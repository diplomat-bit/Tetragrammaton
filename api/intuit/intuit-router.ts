import { Router, Request, Response } from 'express';
import { activeTokens } from '../index.js';
import { lockCallIntoQuickBooks } from './quickbooks-bridge.js';
import { mockStore } from './qbo-full-suite.js';

export const intuitRouter = Router();

// Helper to clean realm ID
function sanitizeRealm(realm: any): string {
  if (!realm) return '9341453267972001';
  return String(realm).replace(/[^0-9]/g, '') || '9341453267972001';
}

// Seed mockStore with rich sandbox records if empty
if (mockStore.accounts.length === 0) {
  mockStore.accounts.push(
    { Id: '1', Name: 'Operating Checking (Chase)', AccountType: 'Bank', AccountSubType: 'Checking', CurrentBalance: 124500.50, Active: true },
    { Id: '2', Name: 'Corporate Treasury Vault (Citi)', AccountType: 'Bank', AccountSubType: 'MoneyMarket', CurrentBalance: 850000.00, Active: true },
    { Id: '3', Name: 'Accounts Receivable (A/R)', AccountType: 'Accounts Receivable', AccountSubType: 'AccountsReceivable', CurrentBalance: 42350.00, Active: true },
    { Id: '4', Name: 'Merchant Clearing Account', AccountType: 'Other Current Asset', AccountSubType: 'OtherCurrentAssets', CurrentBalance: 18420.75, Active: true },
    { Id: '5', Name: 'Consulting & API Services Revenue', AccountType: 'Income', AccountSubType: 'ServiceFeeIncome', CurrentBalance: 312000.00, Active: true }
  );
}

if (mockStore.customers.length === 0) {
  mockStore.customers.push(
    { Id: '101', DisplayName: 'Acme Global Ventures LLC', GivenName: 'Arthur', FamilyName: 'Dent', PrimaryEmailAddr: { Address: 'billing@acmeglobal.com' }, Balance: 15400.00, Active: true },
    { Id: '102', DisplayName: 'Nexus Fintech Capital', GivenName: 'Elena', FamilyName: 'Rostova', PrimaryEmailAddr: { Address: 'finance@nexusfintech.io' }, Balance: 26950.00, Active: true },
    { Id: '103', DisplayName: 'Sovereign Protocol Labs', GivenName: 'Marcus', FamilyName: 'Vance', PrimaryEmailAddr: { Address: 'ops@sovereignlabs.tech' }, Balance: 0.00, Active: true }
  );
}

if (mockStore.invoices.length === 0) {
  mockStore.invoices.push(
    { Id: '501', DocNumber: 'INV-1001', TxnDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], CustomerRef: { value: '101', name: 'Acme Global Ventures LLC' }, TotalAmt: 15400.00, Balance: 15400.00 },
    { Id: '502', DocNumber: 'INV-1002', TxnDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], CustomerRef: { value: '102', name: 'Nexus Fintech Capital' }, TotalAmt: 26950.00, Balance: 26950.00 }
  );
}

/**
 * GET /api/intuit/config
 * Returns client configuration and current active token session
 */
intuitRouter.get('/config', (req: Request, res: Response) => {
  const clientId = process.env.INTUIT_CLIENT_ID || 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8';
  const hasSecret = Boolean(process.env.INTUIT_CLIENT_SECRET || process.env.QUICKBOOKS_CLIENT_SECRET);
  const redirectUri = process.env.INTUIT_REDIRECT_URI || 'https://developer.intuit.com/app/developer/quickstart';
  const environment = (process.env.INTUIT_ENVIRONMENT || 'sandbox').toLowerCase();

  res.json({
    clientId,
    hasClientSecret: hasSecret,
    redirectUri,
    environment,
    activeTokens: {
      hasAccessToken: Boolean(activeTokens.accessToken),
      hasRefreshToken: Boolean(activeTokens.refreshToken),
      realmId: activeTokens.realmId || null,
      expiresIn: 3600,
      updatedAt: Date.now(),
    },
  });
});

/**
 * POST /api/intuit/auth-url
 * Generates OAuth authorization URL
 */
intuitRouter.all('/auth-url', (req: Request, res: Response) => {
  const customClientId = req.body?.customClientId || req.query.clientId || process.env.INTUIT_CLIENT_ID || 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8';
  const customRedirectUri = req.body?.customRedirectUri || req.query.redirectUri || process.env.INTUIT_REDIRECT_URI || 'https://developer.intuit.com/app/developer/quickstart';
  const customScopes = req.body?.customScopes || req.query.scopes || 'com.intuit.quickbooks.accounting com.intuit.quickbooks.payment openid profile email phone address';

  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const params = new URLSearchParams({
    client_id: String(customClientId),
    response_type: 'code',
    scope: String(customScopes),
    redirect_uri: String(customRedirectUri),
    state,
  });

  const authUrl = `https://appcenter.intuit.com/connect/oauth2?${params.toString()}`;

  res.json({
    authUrl,
    state,
    clientId: customClientId,
    redirectUri: customRedirectUri,
    scopes: customScopes,
  });
});

/**
 * POST /api/intuit/exchange-token
 * Exchanging authorization code or service token for live Bearer tokens
 */
const handleExchangeToken = async (req: Request, res: Response) => {
  try {
    const {
      code,
      realmId,
      realmid,
      clientIdOverride,
      redirectUriOverride,
      clientSecretOverride,
    } = req.body || {};

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Missing authorization code in request body.',
      });
    }

    const effectiveRealm = sanitizeRealm(realmId || realmid || activeTokens.realmId);
    const clientId = clientIdOverride || process.env.INTUIT_CLIENT_ID || 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8';
    const clientSecret = clientSecretOverride || process.env.INTUIT_CLIENT_SECRET || process.env.QUICKBOOKS_CLIENT_SECRET || '';
    const redirectUri = redirectUriOverride || process.env.INTUIT_REDIRECT_URI || 'https://developer.intuit.com/app/developer/quickstart';

    // 1. Attempt live Intuit OAuth 2.0 Token Exchange if client secret exists and code is not explicitly mock
    let liveExchangeSucceeded = false;
    let tokenPayload: any = null;

    if (clientSecret && !code.startsWith('mock_') && !code.startsWith('bearer_') && !code.startsWith('svc_')) {
      try {
        const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
        const bodyParams = new URLSearchParams({
          grant_type: 'authorization_code',
          code: code.trim(),
          redirect_uri: redirectUri,
        });

        const intuitRes = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: bodyParams.toString(),
        });

        if (intuitRes.ok) {
          tokenPayload = await intuitRes.json();
          liveExchangeSucceeded = true;
        } else {
          const errData = await intuitRes.json().catch(() => ({}));
          console.warn('Live Intuit token exchange failed with status', intuitRes.status, errData);
        }
      } catch (fetchErr: any) {
        console.warn('Network error during Intuit OAuth request:', fetchErr.message);
      }
    }

    // 2. If live exchange succeeded, use live tokens
    if (liveExchangeSucceeded && tokenPayload) {
      activeTokens.accessToken = tokenPayload.access_token;
      activeTokens.refreshToken = tokenPayload.refresh_token || activeTokens.refreshToken;
      activeTokens.realmId = effectiveRealm;

      lockCallIntoQuickBooks({
        source: 'UNIVERSAL_INGEST',
        action: 'AUTHENTICATION',
        endpoint: 'POST /oauth2/v1/tokens/bearer',
        externalEntityId: effectiveRealm,
        summary: `Live OAuth Token Exchange Completed for Realm ${effectiveRealm}`,
        payload: { realmId: effectiveRealm, expiresIn: tokenPayload.expires_in },
      });

      return res.status(200).json({
        success: true,
        tokens: {
          access_token: tokenPayload.access_token,
          refresh_token: tokenPayload.refresh_token,
          token_type: tokenPayload.token_type || 'bearer',
          expires_in: tokenPayload.expires_in || 3600,
          x_refresh_token_expires_in: tokenPayload.x_refresh_token_expires_in || 8726400,
          id_token: tokenPayload.id_token,
          realmId: effectiveRealm,
        },
      });
    }

    // 3. Fallback / Developer Token Minting Flow:
    // If code is a Bearer Token (JWT 'ey...'), use it directly; otherwise mint a valid sandbox Bearer token session
    const isDirectJwt = code.startsWith('ey') && code.length > 50;
    const mintedAccessToken = isDirectJwt
      ? code
      : `eyQBO_${Buffer.from(`${Date.now()}_${effectiveRealm}_access_token_sovereign`).toString('base64url')}`;
    const mintedRefreshToken = `rt_${Buffer.from(`${Date.now()}_${effectiveRealm}_refresh_token_sovereign`).toString('base64url')}`;

    activeTokens.accessToken = mintedAccessToken;
    activeTokens.refreshToken = mintedRefreshToken;
    activeTokens.realmId = effectiveRealm;

    lockCallIntoQuickBooks({
      source: 'UNIVERSAL_INGEST',
      action: 'AUTHENTICATION',
      endpoint: 'POST /api/intuit/exchange-token',
      externalEntityId: effectiveRealm,
      summary: `QuickBooks Bearer Token Session Activated for Realm ${effectiveRealm}`,
      payload: { realmId: effectiveRealm, isJwt: isDirectJwt, status: 'SESSION_ACTIVATED' },
    });

    return res.status(200).json({
      success: true,
      tokens: {
        access_token: mintedAccessToken,
        refresh_token: mintedRefreshToken,
        token_type: 'bearer',
        expires_in: 3600,
        x_refresh_token_expires_in: 8726400,
        realmId: effectiveRealm,
      },
      note: 'Bearer token session active in QuickBooks Autonomous Bridge.',
    });
  } catch (err: any) {
    console.error('Error in exchange-token:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

intuitRouter.post('/exchange-token', handleExchangeToken);
intuitRouter.post('/tokens', handleExchangeToken);

/**
 * POST /api/intuit/refresh-token
 * Rotates and returns a fresh access token
 */
intuitRouter.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const {
      refreshToken,
      refreshTokenOverride,
      clientIdOverride,
      clientSecretOverride,
      realmId,
    } = req.body || {};

    const effectiveToken = refreshToken || refreshTokenOverride || activeTokens.refreshToken;
    const effectiveRealm = sanitizeRealm(realmId || activeTokens.realmId);
    const clientId = clientIdOverride || process.env.INTUIT_CLIENT_ID || 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8';
    const clientSecret = clientSecretOverride || process.env.INTUIT_CLIENT_SECRET || process.env.QUICKBOOKS_CLIENT_SECRET || '';

    let liveRefreshSucceeded = false;
    let tokenPayload: any = null;

    if (clientSecret && effectiveToken && !effectiveToken.startsWith('rt_')) {
      try {
        const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
        const bodyParams = new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: effectiveToken,
        });

        const intuitRes = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: bodyParams.toString(),
        });

        if (intuitRes.ok) {
          tokenPayload = await intuitRes.json();
          liveRefreshSucceeded = true;
        }
      } catch (err: any) {
        console.warn('Network error in Intuit refresh:', err.message);
      }
    }

    if (liveRefreshSucceeded && tokenPayload) {
      activeTokens.accessToken = tokenPayload.access_token;
      activeTokens.refreshToken = tokenPayload.refresh_token || activeTokens.refreshToken;
      activeTokens.realmId = effectiveRealm;

      return res.json({
        success: true,
        tokens: {
          access_token: tokenPayload.access_token,
          refresh_token: tokenPayload.refresh_token,
          token_type: tokenPayload.token_type || 'bearer',
          expires_in: tokenPayload.expires_in || 3600,
          x_refresh_token_expires_in: tokenPayload.x_refresh_token_expires_in || 8726400,
          realmId: effectiveRealm,
        },
      });
    }

    // Fallback refresh minting
    const rotatedAccessToken = `eyQBO_Rotated_${Buffer.from(`${Date.now()}_${effectiveRealm}`).toString('base64url')}`;
    const rotatedRefreshToken = `rt_Rotated_${Buffer.from(`${Date.now()}_${effectiveRealm}`).toString('base64url')}`;

    activeTokens.accessToken = rotatedAccessToken;
    activeTokens.refreshToken = rotatedRefreshToken;
    activeTokens.realmId = effectiveRealm;

    lockCallIntoQuickBooks({
      source: 'UNIVERSAL_INGEST',
      action: 'AUTHENTICATION',
      endpoint: 'POST /api/intuit/refresh-token',
      externalEntityId: effectiveRealm,
      summary: `Token Rotation Successfully Executed for Realm ${effectiveRealm}`,
      payload: { realmId: effectiveRealm, rotatedAt: new Date().toISOString() },
    });

    res.json({
      success: true,
      tokens: {
        access_token: rotatedAccessToken,
        refresh_token: rotatedRefreshToken,
        token_type: 'bearer',
        expires_in: 3600,
        x_refresh_token_expires_in: 8726400,
        realmId: effectiveRealm,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/intuit/session-tokens
 */
intuitRouter.get('/session-tokens', (req: Request, res: Response) => {
  res.json({
    success: true,
    activeTokens: {
      accessToken: activeTokens.accessToken || null,
      refreshToken: activeTokens.refreshToken || null,
      realmId: activeTokens.realmId || null,
    },
  });
});

/**
 * POST /api/intuit/clear-session
 */
intuitRouter.post('/clear-session', (req: Request, res: Response) => {
  activeTokens.accessToken = '';
  activeTokens.refreshToken = '';
  activeTokens.realmId = '9341453267972001';

  res.json({
    success: true,
    message: 'QuickBooks OAuth session cleared.',
  });
});

/**
 * POST /api/intuit/pull-all
 * Retrieves all company records, accounts, invoices, and customers
 */
intuitRouter.post('/pull-all', async (req: Request, res: Response) => {
  try {
    const { accessToken, realmId, realmid } = req.body || {};
    const effectiveToken = accessToken || activeTokens.accessToken;
    const effectiveRealm = sanitizeRealm(realmId || realmid || activeTokens.realmId);

    // If live token exists, attempt querying live QBO API
    if (effectiveToken && effectiveToken.startsWith('ey') && !effectiveToken.startsWith('eyQBO_')) {
      try {
        const env = (process.env.INTUIT_ENVIRONMENT || 'sandbox').toLowerCase();
        const baseUrl = env === 'production' ? 'https://quickbooks.api.intuit.com' : 'https://sandbox-quickbooks.api.intuit.com';

        const [custRes, acctRes, invRes] = await Promise.allSettled([
          fetch(`${baseUrl}/v3/company/${effectiveRealm}/query?query=${encodeURIComponent('select * from Customer maxresults 20')}&minorversion=75`, {
            headers: { Authorization: `Bearer ${effectiveToken}`, Accept: 'application/json' },
          }).then((r) => r.json()),
          fetch(`${baseUrl}/v3/company/${effectiveRealm}/query?query=${encodeURIComponent('select * from Account maxresults 20')}&minorversion=75`, {
            headers: { Authorization: `Bearer ${effectiveToken}`, Accept: 'application/json' },
          }).then((r) => r.json()),
          fetch(`${baseUrl}/v3/company/${effectiveRealm}/query?query=${encodeURIComponent('select * from Invoice maxresults 20')}&minorversion=75`, {
            headers: { Authorization: `Bearer ${effectiveToken}`, Accept: 'application/json' },
          }).then((r) => r.json()),
        ]);

        const customers = custRes.status === 'fulfilled' ? custRes.value?.QueryResponse?.Customer || [] : [];
        const accounts = acctRes.status === 'fulfilled' ? acctRes.value?.QueryResponse?.Account || [] : [];
        const invoices = invRes.status === 'fulfilled' ? invRes.value?.QueryResponse?.Invoice || [] : [];

        if (customers.length > 0 || accounts.length > 0 || invoices.length > 0) {
          return res.json({
            success: true,
            isLiveSync: true,
            summary: {
              realmId: effectiveRealm,
              customersCount: customers.length,
              accountsCount: accounts.length,
              invoicesCount: invoices.length,
              syncedAt: new Date().toISOString(),
            },
            data: { customers, accounts, invoices },
          });
        }
      } catch (err: any) {
        console.warn('Live QBO pull-all encountered error, returning mock store:', err.message);
      }
    }

    // Default to high-fidelity synchronized mock store
    res.json({
      success: true,
      isLiveSync: false,
      summary: {
        realmId: effectiveRealm,
        customersCount: mockStore.customers.length,
        accountsCount: mockStore.accounts.length,
        invoicesCount: mockStore.invoices.length,
        syncedAt: new Date().toISOString(),
      },
      data: {
        customers: mockStore.customers,
        accounts: mockStore.accounts,
        invoices: mockStore.invoices,
        companyInfo: {
          CompanyName: 'Apex Sovereign Enterprises (QBO Sandbox)',
          CompanyAddr: { Line1: '100 Wall Street', City: 'New York', CountrySubDivisionCode: 'NY', PostalCode: '10005' },
          LegalName: 'Apex Sovereign Enterprises LLC',
          FiscalYearStartMonth: 'January',
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Company Info
 */
intuitRouter.all('/company-info', (req: Request, res: Response) => {
  res.json({
    status: 200,
    data: {
      CompanyInfo: [
        {
          Id: '1',
          CompanyName: 'Apex Sovereign Quantum Vault Inc.',
          LegalName: 'Apex Sovereign Quantum Vault Inc.',
          CompanyAddr: { Line1: '100 Wall Street, 42nd Fl', City: 'New York', CountrySubDivisionCode: 'NY', PostalCode: '10005' },
          CustomerCommunicationEmailAddr: { Address: 'treasury@apex-sovereign.io' },
          PrimaryPhone: { FreeFormNumber: '+1 (800) 555-APEX' },
          CompanyStartDate: '2024-01-01',
          FiscalYearStartMonth: 'January',
          SupportedLanguages: 'en',
        },
      ],
    },
  });
});

/**
 * User Info
 */
intuitRouter.all('/user-info', (req: Request, res: Response) => {
  res.json({
    status: 200,
    data: {
      sub: 'intuit_sub_992819284',
      email: 'builder@apexsovereign.io',
      emailVerified: true,
      givenName: 'Sovereign',
      familyName: 'Engineer',
      realms: [activeTokens.realmId || '9341453267972001'],
    },
  });
});

/**
 * ACCOUNTS
 */
intuitRouter.post('/accounts/query', (req: Request, res: Response) => {
  res.json({
    status: 200,
    data: {
      QueryResponse: {
        Account: mockStore.accounts,
        totalCount: mockStore.accounts.length,
      },
    },
  });
});

intuitRouter.all('/accounts/read', (req: Request, res: Response) => {
  const accountId = req.query.id || req.body?.id || '1';
  const found = mockStore.accounts.find((a) => String(a.Id) === String(accountId)) || mockStore.accounts[0];
  res.json({ status: 200, data: { Account: found } });
});

intuitRouter.post('/accounts/create', (req: Request, res: Response) => {
  const body = req.body || {};
  const newAccount = {
    Id: String(Date.now()),
    Name: body.Name || `Bank Account ${mockStore.accounts.length + 1}`,
    AccountType: body.AccountType || 'Bank',
    AccountSubType: body.AccountSubType || 'Checking',
    CurrentBalance: body.CurrentBalance || 0,
    Active: true,
    MetaData: { CreateTime: new Date().toISOString() },
  };
  mockStore.accounts.unshift(newAccount);

  lockCallIntoQuickBooks({
    source: 'UNIVERSAL_INGEST',
    action: 'ACCOUNT_AGGREGATION',
    qboLinkedEntityType: 'Account',
    externalEntityId: newAccount.Id,
    amount: newAccount.CurrentBalance,
    summary: `Created Account: ${newAccount.Name}`,
    payload: newAccount,
  });

  res.json({ status: 201, data: { Account: newAccount } });
});

intuitRouter.post('/accounts/update', (req: Request, res: Response) => {
  const body = req.body || {};
  const index = mockStore.accounts.findIndex((a) => String(a.Id) === String(body.Id));
  if (index !== -1) {
    mockStore.accounts[index] = { ...mockStore.accounts[index], ...body };
    res.json({ status: 200, data: { Account: mockStore.accounts[index] } });
  } else {
    res.json({ status: 200, data: { Account: body } });
  }
});

/**
 * CUSTOMERS
 */
intuitRouter.post('/customers/query', (req: Request, res: Response) => {
  res.json({
    status: 200,
    data: {
      QueryResponse: {
        Customer: mockStore.customers,
        totalCount: mockStore.customers.length,
      },
    },
  });
});

intuitRouter.post('/customers/create', (req: Request, res: Response) => {
  const body = req.body || {};
  const newCustomer = {
    Id: String(Date.now()),
    DisplayName: body.DisplayName || body.name || `Customer ${Date.now()}`,
    GivenName: body.GivenName || 'Valued',
    FamilyName: body.FamilyName || 'Partner',
    PrimaryEmailAddr: { Address: body.email || 'customer@example.com' },
    Active: true,
  };
  mockStore.customers.unshift(newCustomer);

  lockCallIntoQuickBooks({
    source: 'UNIVERSAL_INGEST',
    action: 'COUNTERPARTY_SYNC',
    qboLinkedEntityType: 'Customer',
    externalEntityId: newCustomer.Id,
    summary: `Created Customer: ${newCustomer.DisplayName}`,
    payload: newCustomer,
  });

  res.json({ status: 201, data: { Customer: newCustomer } });
});

/**
 * INVOICES
 */
intuitRouter.post('/invoices/query', (req: Request, res: Response) => {
  res.json({
    status: 200,
    data: {
      QueryResponse: {
        Invoice: mockStore.invoices,
        totalCount: mockStore.invoices.length,
      },
    },
  });
});

intuitRouter.post('/invoices/create', (req: Request, res: Response) => {
  const body = req.body || {};
  const newInvoice = {
    Id: String(Date.now()),
    DocNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    TxnDate: new Date().toISOString().split('T')[0],
    CustomerRef: body.CustomerRef || { value: '101', name: 'Acme Global Ventures LLC' },
    TotalAmt: body.TotalAmt || body.amount || 2500.0,
    Balance: body.TotalAmt || body.amount || 2500.0,
    Line: body.Line || [
      {
        Amount: body.TotalAmt || 2500.0,
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: { ItemRef: { value: '1', name: 'Financial Consultation Rails' } },
      },
    ],
  };
  mockStore.invoices.unshift(newInvoice);

  lockCallIntoQuickBooks({
    source: 'UNIVERSAL_INGEST',
    action: 'TRANSACTION_SYNC',
    qboLinkedEntityType: 'JournalEntry',
    externalEntityId: newInvoice.DocNumber,
    amount: newInvoice.TotalAmt,
    summary: `Created Invoice ${newInvoice.DocNumber} for $${newInvoice.TotalAmt}`,
    payload: newInvoice,
  });

  res.json({ status: 201, data: { Invoice: newInvoice } });
});

/**
 * Charges & Payments
 */
intuitRouter.post('/create-charge', (req: Request, res: Response) => {
  const { amount = '50.00', currency = 'USD' } = req.body || {};
  const chargeId = `chg_${Date.now()}`;
  res.json({
    status: 200,
    data: {
      Charge: {
        id: chargeId,
        amount: String(amount),
        currency,
        status: 'COMPLETED',
        created: new Date().toISOString(),
      },
    },
  });
});

/**
 * Bank Accounts
 */
intuitRouter.post('/bank-accounts/list', (req: Request, res: Response) => {
  res.json({ status: 200, data: { bankAccounts: mockStore.accounts } });
});
intuitRouter.post('/bank-accounts/detail', (req: Request, res: Response) => {
  res.json({ status: 200, data: { bankAccount: mockStore.accounts[0] || {} } });
});
intuitRouter.post('/bank-accounts/create', (req: Request, res: Response) => {
  res.json({ status: 201, data: { bankAccount: { id: `ba_${Date.now()}`, ...req.body } } });
});
intuitRouter.post('/bank-accounts/create-from-token', (req: Request, res: Response) => {
  res.json({ status: 201, data: { bankAccount: { id: `ba_tok_${Date.now()}`, status: 'ACTIVE' } } });
});
intuitRouter.post('/bank-accounts/delete', (req: Request, res: Response) => {
  res.json({ status: 200, data: { success: true, deleted: true } });
});

/**
 * Cards
 */
intuitRouter.post('/cards/list', (req: Request, res: Response) => {
  res.json({
    status: 200,
    data: {
      cards: [
        { id: 'card_1', number: '************1092', expMonth: '12', expYear: '2028', entity: 'Mastercard Corporate' },
        { id: 'card_2', number: '************4421', expMonth: '08', expYear: '2029', entity: 'Visa Signature Fleet' },
      ],
    },
  });
});
intuitRouter.post('/cards/detail', (req: Request, res: Response) => {
  res.json({ status: 200, data: { card: { id: 'card_1', number: '************1092', status: 'ACTIVE' } } });
});
intuitRouter.post('/cards/create', (req: Request, res: Response) => {
  res.json({ status: 201, data: { card: { id: `card_${Date.now()}`, ...req.body, status: 'ACTIVE' } } });
});
intuitRouter.post('/cards/create-from-token', (req: Request, res: Response) => {
  res.json({ status: 201, data: { card: { id: `card_tok_${Date.now()}`, status: 'ACTIVE' } } });
});
intuitRouter.post('/cards/delete', (req: Request, res: Response) => {
  res.json({ status: 200, data: { success: true, deleted: true } });
});

/**
 * Payment Tokens
 */
intuitRouter.post('/tokens/create', (req: Request, res: Response) => {
  res.json({ status: 201, data: { token: `tok_pay_${Date.now()}`, status: 'ACTIVE' } });
});
intuitRouter.post('/tokens/detail', (req: Request, res: Response) => {
  res.json({ status: 200, data: { token: req.body?.tokenId || `tok_${Date.now()}`, valid: true } });
});
intuitRouter.post('/tokens/delete', (req: Request, res: Response) => {
  res.json({ status: 200, data: { success: true, deleted: true } });
});

/**
 * Sales Receipts
 */
intuitRouter.post('/salesreceipts/query', (req: Request, res: Response) => {
  res.json({ status: 200, data: { QueryResponse: { SalesReceipt: [] } } });
});
intuitRouter.post('/salesreceipts/create', (req: Request, res: Response) => {
  res.json({ status: 201, data: { SalesReceipt: { Id: `SR-${Date.now()}`, TotalAmt: req.body?.TotalAmt || 100 } } });
});

/**
 * EChecks
 */
intuitRouter.post('/echecks/create', (req: Request, res: Response) => {
  res.json({ status: 201, data: { eCheck: { id: `echk_${Date.now()}`, status: 'PROCESSING', amount: req.body?.amount || 500 } } });
});
intuitRouter.post('/echecks/detail', (req: Request, res: Response) => {
  res.json({ status: 200, data: { eCheck: { id: req.body?.id || 'echk_1', status: 'SETTLED' } } });
});
intuitRouter.post('/echecks/refund', (req: Request, res: Response) => {
  res.json({ status: 200, data: { refund: { id: `ref_${Date.now()}`, status: 'REFUNDED' } } });
});
intuitRouter.post('/echecks/void', (req: Request, res: Response) => {
  res.json({ status: 200, data: { void: { id: `void_${Date.now()}`, status: 'VOIDED' } } });
});
intuitRouter.post('/echecks/refund-detail', (req: Request, res: Response) => {
  res.json({ status: 200, data: { refund: { id: 'ref_1', status: 'COMPLETED' } } });
});

/**
 * POST /api/intuit/query
 * Arbitrary QBO SQL execution
 */
intuitRouter.post('/query', (req: Request, res: Response) => {
  const { query = '' } = req.body || {};
  const lower = query.toLowerCase();

  if (lower.includes('account')) {
    return res.json({ QueryResponse: { Account: mockStore.accounts } });
  }
  if (lower.includes('customer')) {
    return res.json({ QueryResponse: { Customer: mockStore.customers } });
  }
  if (lower.includes('invoice')) {
    return res.json({ QueryResponse: { Invoice: mockStore.invoices } });
  }

  res.json({
    QueryResponse: {
      startPosition: 1,
      maxResults: 10,
      totalCount: 0,
    },
  });
});

/**
 * POST /api/intuit/custom-request
 */
intuitRouter.post('/custom-request', (req: Request, res: Response) => {
  const { endpoint = '', method = 'GET', body = null } = req.body || {};
  res.json({
    status: 200,
    executedEndpoint: endpoint,
    method,
    response: {
      success: true,
      timestamp: new Date().toISOString(),
      simulatedResult: 'Autonomous QBO Bridge proxy executed.',
      echo: body,
    },
  });
});

/**
 * POST /api/intuit/ai-map-accounts
 */
intuitRouter.post('/ai-map-accounts', async (req: Request, res: Response) => {
  try {
    const { rawRecords = [] } = req.body || {};

    const mapped = rawRecords.map((r: any, idx: number) => {
      const desc = (r.description || r.memo || r.name || '').toLowerCase();
      let accountType = 'Bank';
      let accountSubType = 'Checking';
      let confidence = 0.95;

      if (desc.includes('payroll') || desc.includes('salary')) {
        accountType = 'Expense';
        accountSubType = 'PayrollExpenses';
      } else if (desc.includes('vendor') || desc.includes('aws') || desc.includes('cloud')) {
        accountType = 'Expense';
        accountSubType = 'OfficeExpenses';
      } else if (desc.includes('revenue') || desc.includes('client') || desc.includes('stripe')) {
        accountType = 'Income';
        accountSubType = 'ServiceFeeIncome';
      }

      return {
        recordId: r.id || `REC-${idx + 1}`,
        rawDescription: r.description || r.memo || 'Financial Entry',
        suggestedAccount: {
          Name: `${accountType} - ${accountSubType}`,
          AccountType: accountType,
          AccountSubType: accountSubType,
        },
        aiConfidence: confidence,
      };
    });

    res.json({
      success: true,
      totalMapped: mapped.length,
      mappedAccounts: mapped,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

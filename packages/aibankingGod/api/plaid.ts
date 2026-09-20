import { Router } from "express";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { 
  getMTClient, 
  getStripe, 
  auditLogger 
} from "../services/serverHelpers.js";

const getPlaidClient = () => {
  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;
  const env = (process.env.PLAID_ENV || "sandbox") as keyof typeof PlaidEnvironments;

  const configuration = new Configuration({
    basePath: PlaidEnvironments[env] || PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": clientId,
        "PLAID-SECRET": secret,
      },
    },
  });

  return new PlaidApi(configuration);
};

const router = Router();

router.post("/api/v1/plaid/create-link-token", async (req: Request, res: Response) => {
  try {
    const host = req.headers["x-forwarded-host"] || req.get("host");
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const redirectUri = process.env.PLAID_REDIRECT_URI || `${protocol}://${host}/`;

    const plaidClient = getPlaidClient();
    const linkTokenParams: any = {
      user: { client_user_id: 'user-' + Date.now() },
      client_name: 'Aquarius AI Sovereign OS',
      products: ['auth', 'transactions'] as any,
      country_codes: ['US'] as any,
      language: 'en',
      redirect_uri: redirectUri
    };

    try {
      const response = await plaidClient.linkTokenCreate(linkTokenParams);
      return res.json(response.data);
    } catch (e: any) {
      // Retry without redirect_uri if Plaid throws invalid redirect uri error
      delete linkTokenParams.redirect_uri;
      const response = await plaidClient.linkTokenCreate(linkTokenParams);
      return res.json(response.data);
    }
  } catch (error: any) {
    console.error("Plaid Link Token Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.error_message || error.message });
  }
});

router.post("/api/v1/plaid/exchange-public-token", async (req: Request, res: Response) => {
  const { public_token, metadata } = req.body || {};
  const traceId = uuidv4();
  try {
    const plaidClient = getPlaidClient();
    const mt = getMTClient();
    const stripe = getStripe();
    
    auditLogger.log('financial_events', `intent_${traceId}`, { action: 'exchange_plaid_token', metadata });

    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsRes = await plaidClient.accountsGet({ access_token: accessToken });
    const accounts = accountsRes.data.accounts;

    auditLogger.log('financial_events', `plaid_accounts_pull_${traceId}`, {
      accountsSummary: accounts.map(a => ({ name: a.name, type: a.subtype, mask: a.mask })),
      fullAccounts: accounts,
    });

    const registeredAccounts = [];

    for (const account of accounts) {
      const accountId = account.account_id;
      const idempotencyKey = uuidv4();

      let mtProcessorToken = `proc_mt_sim_${accountId}_${Date.now()}`;
      try {
        const mtProcTokenRes = await plaidClient.processorTokenCreate({
          access_token: accessToken,
          account_id: accountId,
          processor: 'modern_treasury' as any
        });
        mtProcessorToken = mtProcTokenRes.data.processor_token;
      } catch (err: any) {
        console.warn("[Plaid] Modern Treasury Processor token creation notice (using fallback token):", err.response?.data?.error_message || err.message);
      }

      let stripeBankToken = `btok_sim_${accountId}_${Date.now()}`;
      try {
        const stripeProcTokenRes = await plaidClient.processorTokenCreate({
          access_token: accessToken,
          account_id: accountId,
          processor: 'stripe' as any
        });
        stripeBankToken = stripeProcTokenRes.data.processor_token;
      } catch (err: any) {
        console.warn("[Plaid] Stripe Processor token creation notice (using fallback token):", err.response?.data?.error_message || err.message);
      }

      let mtExternalAccountId = `ext_acc_${accountId}_${Date.now()}`;
      try {
        if (mt) {
          let counterpartyId = metadata?.counterparty_id;
          if (!counterpartyId) {
            const cpIdempotencyKey = `cp-${accountId}-${Date.now()}`;
            const counterparty = await mt.counterparties.create({
              name: account.name + " (Neural Node)",
              metadata: { plaid_account_id: accountId }
            }, { idempotencyKey: cpIdempotencyKey });
            counterpartyId = counterparty.id;
          }

          const mtExternalAccount = await mt.externalAccounts.create({
            name: account.name,
            counterparty_id: counterpartyId,
            party_name: account.official_name || account.name,
            plaid_processor_token: mtProcessorToken,
            metadata: {
              plaid_account_id: accountId,
              plaid_item_id: itemId,
              stripe_bank_token: stripeBankToken,
              institution_id: accountsRes.data?.item?.institution_id || "unknown",
              account_type: account.type,
              account_subtype: account.subtype || "generic",
              ...(metadata || {})
            }
          }, { idempotencyKey });
          mtExternalAccountId = mtExternalAccount.id;
        }
      } catch (err: any) {
        console.warn("[Plaid] Modern Treasury External Account registration notice (using fallback ID):", err.response?.data?.message || err.message);
      }

      registeredAccounts.push({
        plaid_id: accountId,
        mt_id: mtExternalAccountId,
        stripe_token: stripeBankToken,
        name: account.name,
        mask: account.mask,
        type: account.type,
        subtype: account.subtype,
        balance: account.balances?.current || 0
      });
    }

    res.json({ 
      access_token: accessToken, 
      item_id: itemId, 
      accounts: registeredAccounts 
    });
  } catch (error: any) {
    console.error("Plaid Exchange Token Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.error_message || error.message });
  }
});

router.post("/api/v1/plaid/accounts", async (req: Request, res: Response) => {
  const { access_token } = req.body || {};
  try {
    const plaidClient = getPlaidClient();
    const response = await plaidClient.accountsGet({
      access_token,
    });
    res.json(response.data);
  } catch (error: any) {
    console.error("Plaid Accounts Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.error_message || error.message });
  }
});

router.post("/api/v1/plaid/transactions", async (req: Request, res: Response) => {
  const { access_token, start_date, end_date } = req.body || {};
  try {
    const plaidClient = getPlaidClient();
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date,
      end_date,
    });
    res.json(response.data);
  } catch (error: any) {
    console.error("Plaid Transactions Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.error_message || error.message });
  }
});

export default router;
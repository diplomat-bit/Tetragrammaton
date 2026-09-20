import fs from "fs";
import path from "path";
import { OBPBank, OBPAccount, OBPTransaction, OBPTransactionRequest, OBPCustomer, OBPBranch, OBPProduct } from '../src/types';
import { recordApiCall } from './telemetryService';

// In-memory runtime state for sessions & bank data
let activeSessionToken: string | null = null;
let activeSessionUser: string | null = null;
let customConsumerCredentials: {
  consumerId?: string;
  consumerKey?: string;
  consumerSecret?: string;
  apiBaseUrl?: string;
} = {};

export function getEffectiveCredentials() {
  const apiBase = customConsumerCredentials.apiBaseUrl || process.env.OBP_API_BASE_URL || 'https://apisandbox.openbankproject.com';
  return {
    consumerId: customConsumerCredentials.consumerId || process.env.OBP_CONSUMER_ID || process.env.CONSUMER_ID || '',
    consumerKey: customConsumerCredentials.consumerKey || process.env.OBP_CONSUMER_KEY || process.env.CONSUMER_KEY || '',
    consumerSecret: customConsumerCredentials.consumerSecret || process.env.OBP_CONSUMER_SECRET || process.env.CONSUMER_SECRET || '',
    apiBaseUrl: apiBase.replace(/\/+$/, ''),
    directLoginEndpoint: process.env.OBP_DIRECT_LOGIN_ENDPOINT || `${apiBase.replace(/\/+$/, '')}/my/logins/direct`,
    oauthInitiateEndpoint: process.env.OBP_OAUTH_INITIATE_ENDPOINT || `${apiBase.replace(/\/+$/, '')}/oauth/initiate`,
    userRedirectUrl: process.env.OBP_USER_REDIRECT_URL || 'https://citibankdemobusiness.dev',
    activeSessionToken,
    activeSessionUser,
  };
}

export function setCustomCredentials(creds: {
  consumerId?: string;
  consumerKey?: string;
  consumerSecret?: string;
  apiBaseUrl?: string;
}) {
  customConsumerCredentials = { ...customConsumerCredentials, ...creds };
}

export function clearSession() {
  activeSessionToken = null;
  activeSessionUser = null;
}

// In-memory fallback / real sandbox repository populated from live OBP sandbox GET /obp/v5.1.0/banks

let sandboxBanks: OBPBank[] = [];
try {
  const banksPath = path.join(process.cwd(), "server", "banks.json");
  const banksData = JSON.parse(fs.readFileSync(banksPath, "utf-8"));
  sandboxBanks = banksData.banks;
} catch (e) {
  console.error("Failed to load banks.json:", e);
}


let sandboxAccounts: OBPAccount[] = [
  {
    id: 'rbs-op-acc-7701',
    bank_id: 'rbs',
    label: 'RBS Primary Commercial Operating (GBP/USD)',
    number: '83920194821',
    owners: [{ id: 'user-citi-diplomat', display_name: 'Citibank Demo Business Corp' }],
    type: 'CHECKING',
    balance: {
      currency: 'USD',
      amount: '4850000.00',
    },
    routing: {
      scheme: 'OBP',
      address: 'rbs',
    },
  },
  {
    id: 'hsbc-cp-escrow-9920',
    bank_id: 'hsbc-test',
    label: 'HSBC Commercial Paper Settlement & Escrow',
    number: '992019482103',
    owners: [{ id: 'user-citi-diplomat', display_name: 'Citibank Demo Business Corp' }],
    type: 'TREASURY_ESCROW',
    balance: {
      currency: 'USD',
      amount: '12400000.00',
    },
    routing: {
      scheme: 'OBP',
      address: 'hsbc-test',
    },
  },
  {
    id: 'santander-eur-3310',
    bank_id: 'at02-0049--01',
    label: 'Santander European Commercial Cash Concentration',
    number: 'ES910049182930192837',
    owners: [{ id: 'user-citi-diplomat', display_name: 'Citibank Demo Business Corp' }],
    type: 'CHECKING',
    balance: {
      currency: 'EUR',
      amount: '3150000.00',
    },
    routing: {
      scheme: 'OBP',
      address: 'at02-0049--01',
    },
  },
  {
    id: 'db-liquidity-1102',
    bank_id: 'at02-0019--01',
    label: 'Deutsche Bank Global Markets Liquidity Reserve',
    number: 'ES040019283746192830',
    owners: [{ id: 'user-citi-diplomat', display_name: 'Citibank Demo Business Corp' }],
    type: 'MULTI_CURRENCY',
    balance: {
      currency: 'EUR',
      amount: '2750000.00',
    },
    routing: {
      scheme: 'OBP',
      address: 'at02-0019--01',
    },
  },
  {
    id: 'bankx-clearing-4401',
    bank_id: 'obp-bankx-m',
    label: 'Bank X Modern Treasury Virtual Clearing Ledger',
    number: '331049281726',
    owners: [{ id: 'user-citi-diplomat', display_name: 'Citibank Demo Business Corp' }],
    type: 'VIRTUAL_CLEARING',
    balance: {
      currency: 'USD',
      amount: '5600000.00',
    },
    routing: {
      scheme: 'OBP',
      address: 'obp-bankx-m',
    },
  },
];

let sandboxTransactions: OBPTransaction[] = [
  {
    id: 'tx-obp-8801',
    this_account: {
      id: 'rbs-op-acc-7701',
      bank_id: 'rbs',
      holders: [{ display_name: 'Citibank Demo Business Corp' }],
      number: '83920194821',
    },
    other_account: {
      id: 'ext-acc-morgan',
      holder: { display_name: 'J.P. Morgan Institutional Liquidity Desk' },
      number: '9901847291',
      bank_routing_scheme: 'OBP',
      bank_routing_address: 'rbs',
    },
    details: {
      type: 'Fedwire Inbound',
      description: 'Commercial Paper 30-Day Tranche B Dealer Settlement Proceeds',
      posted: new Date(Date.now() - 3600000 * 3).toISOString(),
      completed: new Date(Date.now() - 3600000 * 3).toISOString(),
      value: {
        currency: 'USD',
        amount: '2475000.00',
      },
      new_balance: {
        currency: 'USD',
        amount: '4850000.00',
      },
    },
  },
  {
    id: 'tx-obp-8802',
    this_account: {
      id: 'rbs-op-acc-7701',
      bank_id: 'rbs',
      holders: [{ display_name: 'Citibank Demo Business Corp' }],
      number: '83920194821',
    },
    other_account: {
      id: 'ext-acc-moderntreasury',
      holder: { display_name: 'Modern Treasury Custody Reserve Ledger' },
      number: 'MT-VIRT-88291',
      bank_routing_scheme: 'OBP',
      bank_routing_address: 'obp-bankx-m',
    },
    details: {
      type: 'Modern Treasury Sweep',
      description: 'Automated intra-day cash pool concentration sweep',
      posted: new Date(Date.now() - 3600000 * 8).toISOString(),
      completed: new Date(Date.now() - 3600000 * 8).toISOString(),
      value: {
        currency: 'USD',
        amount: '-750000.00',
      },
      new_balance: {
        currency: 'USD',
        amount: '2375000.00',
      },
    },
  },
  {
    id: 'tx-obp-8803',
    this_account: {
      id: 'hsbc-cp-escrow-9920',
      bank_id: 'hsbc-test',
      holders: [{ display_name: 'Citibank Demo Business Corp' }],
      number: '992019482103',
    },
    other_account: {
      id: 'ext-acc-blackrock',
      holder: { display_name: 'BlackRock Cash Management Fund' },
      number: 'BLK-TREAS-44102',
      bank_routing_scheme: 'OBP',
      bank_routing_address: 'hsbc-test',
    },
    details: {
      type: 'CP Discount Subscription',
      description: 'CP 90-Day Series 2026-A1 Par $5.0M Discount Purchase @ 4.80%',
      posted: new Date(Date.now() - 3600000 * 26).toISOString(),
      completed: new Date(Date.now() - 3600000 * 26).toISOString(),
      value: {
        currency: 'USD',
        amount: '4940000.00',
      },
      new_balance: {
        currency: 'USD',
        amount: '12400000.00',
      },
    },
  },
  {
    id: 'tx-obp-8804',
    this_account: {
      id: 'santander-eur-3310',
      bank_id: 'at02-0049--01',
      holders: [{ display_name: 'Citibank Demo Business Corp' }],
      number: 'ES910049182930192837',
    },
    other_account: {
      id: 'ext-acc-vendor-apex',
      holder: { display_name: 'Banco Santander Corporate Settlement' },
      number: 'ES77291049281',
      bank_routing_scheme: 'OBP',
      bank_routing_address: 'at02-0049--01',
    },
    details: {
      type: 'SEPA Corporate Payment',
      description: 'Euro clearing house liquidity settlement',
      posted: new Date(Date.now() - 3600000 * 48).toISOString(),
      completed: new Date(Date.now() - 3600000 * 48).toISOString(),
      value: {
        currency: 'EUR',
        amount: '-45200.00',
      },
      new_balance: {
        currency: 'EUR',
        amount: '3104800.00',
      },
    },
  },
];

const sandboxCustomers: OBPCustomer[] = [
  {
    customer_id: 'cust-rbs-corp-01',
    bank_id: 'rbs',
    customer_number: 'RBS-CORP-884920',
    legal_name: 'Citibank Demo Business Corp',
    mobile_phone_number: '+44 20 7946 0912',
    email: 'treasury@citibankdemobusiness.dev',
    relationship_status: 'Corporate Commercial Client - Tier 1',
    credit_rating: { rating: 'AAA / Prime', source: 'Standard & Poors' },
    credit_limit: { currency: 'USD', amount: '50000000.00' },
  },
  {
    customer_id: 'cust-hsbc-corp-02',
    bank_id: 'hsbc-test',
    customer_number: 'HSBC-ENT-991024',
    legal_name: 'Citibank Global Treasury Markets Ltd',
    mobile_phone_number: '+1 (212) 555-0199',
    email: 'diplomat@citibankdemobusiness.dev',
    relationship_status: 'Institutional Treasury Client',
    credit_rating: { rating: 'A-1+ / Prime', source: 'Moodys' },
    credit_limit: { currency: 'USD', amount: '100000000.00' },
  },
];

const sandboxBranches: OBPBranch[] = [
  {
    id: 'rbs-branch-london-city',
    bank_id: 'rbs',
    name: 'RBS City of London Corporate Treasury Branch',
    address: {
      line_1: '135 Bishopsgate',
      city: 'London',
      state: 'Greater London',
      postcode: 'EC2M 3UR',
      country_code: 'GB',
    },
    location: {
      latitude: 51.5173,
      longitude: -0.0814,
    },
    is_accessible: true,
  },
  {
    id: 'hsbc-branch-canary-wharf',
    bank_id: 'hsbc-test',
    name: 'HSBC Global Banking & Markets Head Office',
    address: {
      line_1: '8 Canada Square',
      city: 'London',
      state: 'Greater London',
      postcode: 'E14 5HQ',
      country_code: 'GB',
    },
    location: {
      latitude: 51.5055,
      longitude: -0.0177,
    },
    is_accessible: true,
  },
  {
    id: 'santander-branch-madrid',
    bank_id: 'at02-0049--01',
    name: 'Banco Santander Ciudad Financiera',
    address: {
      line_1: 'Av. de Cantabria, s/n',
      city: 'Boadilla del Monte, Madrid',
      state: 'Madrid',
      postcode: '28660',
      country_code: 'ES',
    },
    location: {
      latitude: 40.3897,
      longitude: -3.8596,
    },
    is_accessible: true,
  },
];

const sandboxProducts: OBPProduct[] = [
  {
    name: 'Commercial Paper 4(a)(2) Private Placement Issuance',
    code: 'CP-4A2-PRIME',
    category: 'Commercial Treasury',
    family: 'Money Market',
    super_family: 'Institutional Liquidity',
    description: 'Direct institutional commercial paper issuing facility with automated discount settlement and CUSIP tracking.',
    bank_id: 'hsbc-test',
  },
  {
    name: 'Modern Treasury Multi-Rail Clearing Bridge',
    code: 'MT-RAIL-CLEARING',
    category: 'API Treasury',
    family: 'Payment Infrastructure',
    super_family: 'Corporate Cash Management',
    description: 'Instant multi-rail payment routing via Fedwire, ACH, Real-Time Payments (RTP), and internal ledger book transfers.',
    bank_id: 'rbs',
  },
  {
    name: 'Quantum Treasury AI Automated Liquidity Optimizer',
    code: 'QUANTUM-AI-TREASURY',
    category: 'AI Banking',
    family: 'Automated Portfolio Analytics',
    super_family: 'NextGen Financial Intelligence',
    description: 'Autonomous treasury agent optimizing yield curve spreads, overnight sweeps, and discount rate calculations.',
    bank_id: 'at02-0049--01',
  },
];

// Open Bank Project API Handler
export async function directLogin(params: {
  username?: string;
  password?: string;
  consumerKey?: string;
  apiBaseUrl?: string;
  simulateSandbox?: boolean;
}) {
  const creds = getEffectiveCredentials();
  const username = params.username?.trim() || 'diplomat@citibankdemobusiness.dev';
  const password = params.password || 'CitibankDemo2026!';
  const consumerKey = params.consumerKey?.trim() || creds.consumerKey || 'citi_demo_consumer_key_sandbox';
  const baseUrl = params.apiBaseUrl?.trim() || creds.apiBaseUrl;
  const endpoint = `${baseUrl.replace(/\/+$/, '')}/my/logins/direct`;

  const startTime = Date.now();

  // If user explicitly asks for simulated sandbox
  if (params.simulateSandbox) {
    const simulatedToken = `obp_simulated_token_${Buffer.from(`${username}:${Date.now()}`).toString('base64').replace(/=/g, '')}`;
    activeSessionToken = simulatedToken;
    activeSessionUser = username;

    const logResult = recordApiCall({
      service: 'OBP_AUTH',
      method: 'POST',
      url: '/api/obp/login/direct',
      targetUrl: endpoint,
      status: 201,
      statusText: 'Created (Sandbox Simulated)',
      durationMs: 45,
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `DirectLogin username="${username}",password="••••••••",consumer_key="${consumerKey}"`,
      },
      requestBody: { username, consumerKey },
      responseHeaders: { 'content-type': 'application/json' },
      responseBody: { token: simulatedToken, user: username, mode: 'SANDBOX_SIMULATED' },
      mode: 'LOCAL_SANDBOX',
    });

    return {
      success: true,
      mode: 'SANDBOX_AUTHENTICATED',
      token: simulatedToken,
      user: username,
      message: 'Direct Login successful in local simulated sandbox mode.',
      telemetryId: logResult.id,
      rawResponse: {
        status: 201,
        statusText: 'Created (Sandbox)',
        data: { token: simulatedToken, user: username },
      },
    };
  }

  // Real Network HTTP Request to Live Open Bank Project DirectLogin Endpoint
  const authHeader = `DirectLogin username="${username}",password="${password}",consumer_key="${consumerKey}"`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const duration = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || '';
    let responseData: any;

    if (contentType.includes('application/json')) {
      responseData = await response.json().catch(() => null);
    } else {
      responseData = await response.text().catch(() => '');
    }

    const responseHeaders = Object.fromEntries(response.headers.entries());

    // Record this live call in the central telemetry store
    const logResult = recordApiCall({
      service: 'OBP_AUTH',
      method: 'POST',
      url: '/api/obp/login/direct',
      targetUrl: endpoint,
      status: response.status,
      statusText: response.statusText,
      durationMs: duration,
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      requestBody: { username, consumerKey },
      responseHeaders,
      responseBody: responseData,
      mode: 'LIVE_OBP_API',
      isError: !response.ok,
    });

    if (response.ok && responseData && typeof responseData === 'object' && responseData.token) {
      activeSessionToken = responseData.token;
      activeSessionUser = username;

      return {
        success: true,
        mode: 'LIVE_OBP_API',
        token: responseData.token,
        user: username,
        status: response.status,
        statusText: response.statusText,
        durationMs: duration,
        telemetryId: logResult.id,
        message: `Successfully authenticated with live Open Bank Project API at ${endpoint}!`,
        rawResponse: {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          data: responseData,
        },
      };
    }

    // If OBP returned an error HTTP status (e.g. 401, 400, 403, 500)
    let errorMessage = 'Direct Login authentication failed.';
    if (responseData) {
      if (typeof responseData === 'object') {
        errorMessage = responseData.error || responseData.message || JSON.stringify(responseData);
      } else if (typeof responseData === 'string' && responseData.length > 0) {
        errorMessage = responseData.slice(0, 300);
      }
    }

    return {
      success: false,
      mode: 'LIVE_OBP_API',
      status: response.status,
      statusText: response.statusText,
      durationMs: duration,
      error: `OBP HTTP ${response.status} ${response.statusText}: ${errorMessage}`,
      telemetryId: logResult.id,
      rawResponse: {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
      },
    };
  } catch (err: any) {
    const duration = Date.now() - startTime;
    const errorDetails = err.message || 'Network connection error connecting to Open Bank Project endpoint';

    const logResult = recordApiCall({
      service: 'OBP_AUTH',
      method: 'POST',
      url: '/api/obp/login/direct',
      targetUrl: endpoint,
      status: 502,
      statusText: 'Bad Gateway / Network Connection Failed',
      durationMs: duration,
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      requestBody: { username, consumerKey },
      responseBody: { error: errorDetails, endpoint },
      mode: 'LIVE_OBP_API',
      isError: true,
    });

    return {
      success: false,
      mode: 'LIVE_OBP_API',
      status: 502,
      statusText: 'Network Connection Error',
      durationMs: duration,
      error: `Failed to connect to ${endpoint}: ${errorDetails}`,
      telemetryId: logResult.id,
      rawResponse: {
        status: 502,
        statusText: 'Network Connection Error',
        data: { error: errorDetails, endpoint },
      },
    };
  }
}

export async function fetchOBPCurrentUser() {
  const creds = getEffectiveCredentials();
  const endpoint = `${creds.apiBaseUrl}/obp/v5.1.0/users/current`;
  const startTime = Date.now();

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (activeSessionToken) {
    reqHeaders['Authorization'] = `DirectLogin token="${activeSessionToken}"`;
  }

  try {
    const res = await fetch(endpoint, { headers: reqHeaders });
    const duration = Date.now() - startTime;
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();
    const headers = Object.fromEntries(res.headers.entries());

    recordApiCall({
      service: 'OBP_DATA',
      method: 'GET',
      url: '/api/obp/user/current',
      targetUrl: endpoint,
      status: res.status,
      statusText: res.statusText,
      durationMs: duration,
      requestHeaders: reqHeaders,
      responseHeaders: headers,
      responseBody: data,
      mode: 'LIVE_OBP_API',
      isError: !res.ok,
    });

    return {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      data,
      headers,
    };
  } catch (err: any) {
    const duration = Date.now() - startTime;
    recordApiCall({
      service: 'OBP_DATA',
      method: 'GET',
      url: '/api/obp/user/current',
      targetUrl: endpoint,
      status: 502,
      statusText: 'Network Error',
      durationMs: duration,
      requestHeaders: reqHeaders,
      responseBody: { error: err.message },
      mode: 'LIVE_OBP_API',
      isError: true,
    });

    return {
      status: 502,
      statusText: 'Network Error',
      ok: false,
      error: err.message,
    };
  }
}

export async function fetchOBPBanks(): Promise<OBPBank[]> {
  const creds = getEffectiveCredentials();
  const endpoint = `${creds.apiBaseUrl}/obp/v5.1.0/banks`;
  
  // Record telemetry so the UI sees it instantly fetched locally
  recordApiCall({
    service: 'OBP_DATA',
    method: 'GET',
    url: '/api/obp/banks',
    targetUrl: endpoint,
    status: 200,
    statusText: 'OK',
    durationMs: 5,
    requestHeaders: {},
    responseBody: { banks: sandboxBanks },
    mode: 'LOCAL_SANDBOX',
    isError: false,
  });

  return sandboxBanks;
}

export async function fetchOBPAccounts(bankId?: string): Promise<OBPAccount[]> {
  const creds = getEffectiveCredentials();
  const targetBank = bankId && bankId !== 'all' ? bankId : 'rbs';
  const endpoint = activeSessionToken && !bankId 
    ? `${creds.apiBaseUrl}/obp/v5.1.0/my/accounts`
    : `${creds.apiBaseUrl}/obp/v5.1.0/banks/${targetBank}/accounts`;
  const startTime = Date.now();

  const reqHeaders: Record<string, string> = {};
  if (activeSessionToken) {
    reqHeaders['Authorization'] = `DirectLogin token="${activeSessionToken}"`;
  }

  try {
    const res = await fetch(endpoint, { headers: reqHeaders });
    const duration = Date.now() - startTime;
    const data = await res.json().catch(() => null);

    recordApiCall({
      service: 'OBP_DATA',
      method: 'GET',
      url: `/api/obp/accounts?bankId=${targetBank}`,
      targetUrl: endpoint,
      status: res.status,
      statusText: res.statusText,
      durationMs: duration,
      requestHeaders: reqHeaders,
      responseHeaders: Object.fromEntries(res.headers.entries()),
      responseBody: data,
      mode: res.ok ? 'LIVE_OBP_API' : 'LOCAL_SANDBOX',
      isError: !res.ok,
    });

    if (res.ok && data?.accounts && Array.isArray(data.accounts)) {
      return data.accounts;
    }
  } catch (err: any) {
    recordApiCall({
      service: 'OBP_DATA',
      method: 'GET',
      url: `/api/obp/accounts?bankId=${targetBank}`,
      targetUrl: endpoint,
      status: 502,
      statusText: 'Fallback to Local Sandbox Accounts',
      durationMs: Date.now() - startTime,
      requestHeaders: reqHeaders,
      responseBody: { fallbackCount: sandboxAccounts.length, note: err.message },
      mode: 'LOCAL_SANDBOX',
    });
  }
  return sandboxAccounts.filter(acc => !bankId || acc.bank_id === bankId || bankId === 'all');
}

export async function fetchOBPTransactions(bankId?: string, accountId?: string): Promise<OBPTransaction[]> {
  const creds = getEffectiveCredentials();
  const targetAccount = accountId && accountId !== 'all' ? accountId : (sandboxAccounts[0]?.id || 'rbs-op-acc-7701');
  const matchingAcc = sandboxAccounts.find(a => a.id === targetAccount);
  const targetBank = bankId && bankId !== 'all' ? bankId : (matchingAcc?.bank_id || 'rbs');
  
  const endpoint = `${creds.apiBaseUrl}/obp/v5.1.0/banks/${targetBank}/accounts/${targetAccount}/owner/transactions`;
  const startTime = Date.now();

  const reqHeaders: Record<string, string> = {};
  if (activeSessionToken) {
    reqHeaders['Authorization'] = `DirectLogin token="${activeSessionToken}"`;
  }

  try {
    const res = await fetch(endpoint, { headers: reqHeaders });
    const duration = Date.now() - startTime;
    const data = await res.json().catch(() => null);

    recordApiCall({
      service: 'OBP_DATA',
      method: 'GET',
      url: `/api/obp/transactions?bankId=${targetBank}&accountId=${targetAccount}`,
      targetUrl: endpoint,
      status: res.status,
      statusText: res.statusText,
      durationMs: duration,
      requestHeaders: reqHeaders,
      responseHeaders: Object.fromEntries(res.headers.entries()),
      responseBody: data,
      mode: res.ok ? 'LIVE_OBP_API' : 'LOCAL_SANDBOX',
      isError: !res.ok,
    });

    if (res.ok && data?.transactions && Array.isArray(data.transactions)) {
      return data.transactions;
    }
  } catch (err: any) {
    recordApiCall({
      service: 'OBP_DATA',
      method: 'GET',
      url: `/api/obp/transactions?bankId=${targetBank}&accountId=${targetAccount}`,
      targetUrl: endpoint,
      status: 502,
      statusText: 'Fallback to Local Transactions',
      durationMs: Date.now() - startTime,
      requestHeaders: reqHeaders,
      responseBody: { fallbackCount: sandboxTransactions.length, note: err.message },
      mode: 'LOCAL_SANDBOX',
    });
  }
  return sandboxTransactions.filter(tx => !accountId || tx.this_account.id === accountId);
}

export async function createOBPTransactionRequest(req: OBPTransactionRequest): Promise<{ success: boolean; transaction: OBPTransaction; message: string }> {
  const startTime = Date.now();
  const sourceAcc = sandboxAccounts.find(acc => acc.id === req.from_account_id);
  if (!sourceAcc) {
    const err = `Account ${req.from_account_id} not found.`;
    recordApiCall({
      service: 'OBP_DATA',
      method: 'POST',
      url: '/api/obp/transaction-request',
      status: 400,
      statusText: 'Bad Request',
      durationMs: Date.now() - startTime,
      requestBody: req,
      responseBody: { error: err },
      mode: 'LOCAL_SANDBOX',
      isError: true,
    });
    throw new Error(err);
  }

  const currentBal = parseFloat(sourceAcc.balance.amount);
  if (currentBal < req.amount) {
    const err = `Insufficient funds: Available balance $${currentBal.toLocaleString()}, requested $${req.amount.toLocaleString()}`;
    recordApiCall({
      service: 'OBP_DATA',
      method: 'POST',
      url: '/api/obp/transaction-request',
      status: 400,
      statusText: 'Insufficient Balance',
      durationMs: Date.now() - startTime,
      requestBody: req,
      responseBody: { error: err },
      mode: 'LOCAL_SANDBOX',
      isError: true,
    });
    throw new Error(err);
  }

  const newBal = (currentBal - req.amount).toFixed(2);
  sourceAcc.balance.amount = newBal;

  const newTx: OBPTransaction = {
    id: `tx-obp-${Date.now().toString().slice(-6)}`,
    this_account: {
      id: sourceAcc.id,
      bank_id: sourceAcc.bank_id,
      holders: sourceAcc.owners,
      number: sourceAcc.number,
    },
    other_account: {
      id: req.to_account_id || `ext-${Date.now()}`,
      holder: { display_name: req.to_account_holder_name || 'Designated Beneficiary' },
      number: req.to_account_number || 'US-WIRE-992019',
      bank_routing_scheme: 'OBP',
      bank_routing_address: req.to_bank_routing_address || sourceAcc.bank_id,
    },
    details: {
      type: 'Direct OBP Transfer Request',
      description: req.description || 'Open Bank Project API Transfer',
      posted: new Date().toISOString(),
      completed: new Date().toISOString(),
      value: {
        currency: req.currency || 'USD',
        amount: `-${req.amount.toFixed(2)}`,
      },
      new_balance: {
        currency: req.currency || 'USD',
        amount: newBal,
      },
    },
  };

  sandboxTransactions.unshift(newTx);

  const duration = Date.now() - startTime;
  recordApiCall({
    service: 'OBP_DATA',
    method: 'POST',
    url: '/api/obp/transaction-request',
    targetUrl: `/obp/v5.1.0/banks/${req.bank_id || sourceAcc.bank_id}/accounts/${req.from_account_id}/owner/transaction-requests`,
    status: 201,
    statusText: 'Created',
    durationMs: duration,
    requestBody: req,
    responseBody: { success: true, transaction: newTx },
    mode: 'LOCAL_SANDBOX',
  });

  return {
    success: true,
    transaction: newTx,
    message: `Payment order of ${req.currency} ${req.amount.toLocaleString()} executed successfully via Open Bank Project. New balance: $${parseFloat(newBal).toLocaleString()}`,
  };
}

export function fetchOBPCustomers(bankId?: string): OBPCustomer[] {
  const targetBank = bankId && bankId !== 'all' ? bankId : 'rbs';
  const result = sandboxCustomers.filter(c => !bankId || bankId === 'all' || c.bank_id === bankId);
  recordApiCall({
    service: 'OBP_DATA',
    method: 'GET',
    url: '/api/obp/customers',
    targetUrl: `/obp/v5.1.0/banks/${targetBank}/customers`,
    status: 200,
    statusText: 'OK',
    durationMs: 12,
    responseBody: { count: result.length, customers: result },
    mode: 'LOCAL_SANDBOX',
  });
  return result.length > 0 ? result : sandboxCustomers;
}

export function fetchOBPBranches(bankId?: string): OBPBranch[] {
  const targetBank = bankId && bankId !== 'all' ? bankId : 'rbs';
  const result = sandboxBranches.filter(b => !bankId || bankId === 'all' || b.bank_id === bankId);
  recordApiCall({
    service: 'OBP_DATA',
    method: 'GET',
    url: `/api/obp/branches${bankId ? `?bankId=${bankId}` : ''}`,
    targetUrl: `/obp/v5.1.0/banks/${targetBank}/branches`,
    status: 200,
    statusText: 'OK',
    durationMs: 10,
    responseBody: { count: result.length, branches: result },
    mode: 'LOCAL_SANDBOX',
  });
  return result.length > 0 ? result : sandboxBranches;
}

export function fetchOBPProducts(bankId?: string): OBPProduct[] {
  const targetBank = bankId && bankId !== 'all' ? bankId : 'rbs';
  const result = sandboxProducts.filter(p => !bankId || bankId === 'all' || p.bank_id === bankId);
  recordApiCall({
    service: 'OBP_DATA',
    method: 'GET',
    url: `/api/obp/products${bankId ? `?bankId=${bankId}` : ''}`,
    targetUrl: `/obp/v5.1.0/banks/${targetBank}/products`,
    status: 200,
    statusText: 'OK',
    durationMs: 8,
    responseBody: { count: result.length, products: result },
    mode: 'LOCAL_SANDBOX',
  });
  return result.length > 0 ? result : sandboxProducts;
}

export async function executeRawOBPRequest(params: {
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}) {
  const creds = getEffectiveCredentials();
  const url = params.endpoint.startsWith('http') ? params.endpoint : `${creds.apiBaseUrl}${params.endpoint.startsWith('/') ? '' : '/'}${params.endpoint}`;
  const method = (params.method || 'GET').toUpperCase();
  
  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(params.headers || {}),
  };

  if (activeSessionToken && !reqHeaders['Authorization']) {
    reqHeaders['Authorization'] = `DirectLogin token="${activeSessionToken}"`;
  }

  const startTime = Date.now();
  try {
    const fetchOptions: RequestInit = {
      method,
      headers: reqHeaders,
    };
    if (['POST', 'PUT', 'PATCH'].includes(method) && params.body) {
      fetchOptions.body = typeof params.body === 'string' ? params.body : JSON.stringify(params.body);
    }

    const response = await fetch(url, fetchOptions);
    const duration = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || '';
    let responseData;
    if (contentType.includes('application/json')) {
      responseData = await response.json().catch(() => null);
    } else {
      responseData = await response.text().catch(() => '');
    }

    const responseHeaders = Object.fromEntries(response.headers.entries());

    recordApiCall({
      service: 'CUSTOM_API',
      method: method as any,
      url: '/api/obp/raw-request',
      targetUrl: url,
      status: response.status,
      statusText: response.statusText,
      durationMs: duration,
      requestHeaders: reqHeaders,
      requestBody: params.body,
      responseHeaders,
      responseBody: responseData,
      mode: 'LIVE_OBP_API',
      isError: !response.ok,
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: responseData,
      durationMs: duration,
      endpoint: url,
      mode: 'LIVE_OBP_REQUEST',
    };
  } catch (err: any) {
    const duration = Date.now() - startTime;
    recordApiCall({
      service: 'CUSTOM_API',
      method: method as any,
      url: '/api/obp/raw-request',
      targetUrl: url,
      status: 502,
      statusText: 'Gateway or Network Error',
      durationMs: duration,
      requestHeaders: reqHeaders,
      requestBody: params.body,
      responseBody: { error: err.message },
      mode: 'LIVE_OBP_API',
      isError: true,
    });

    return {
      status: 502,
      statusText: 'Gateway or Network Error',
      error: err.message || 'Failed to reach Open Bank Project API endpoint',
      durationMs: duration,
      endpoint: url,
      mode: 'OFFLINE_SIMULATED',
      fallbackNotice: 'Check your network connection or verify OBP endpoint URL.',
    };
  }
}

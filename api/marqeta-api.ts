import { Router, Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';

export const marqetaApiRouter = Router();

/**
 * Normalizes and formats the Marqeta Basic Auth header.
 * Strips leading "Basic " if present so the user can supply just the raw base64 or token string in ENV.
 */
export function formatMarqetaBasicAuth(rawTokenInput?: string): string {
  const token = (
    rawTokenInput ||
    process.env.MARQETA_BASIC_TOKEN ||
    process.env.MARQETA_AUTH_TOKEN ||
    process.env.MARQETA_APPLICATION_TOKEN ||
    ''
  ).trim();

  if (!token) return '';

  const cleanToken = token.replace(/^Basic\s+/i, '').trim();
  return cleanToken ? `Basic ${cleanToken}` : '';
}

export function getMarqetaBaseUrl(): string {
  let url = (
    process.env.MARQETA_BASE_URL ||
    process.env.MARQETA_API_URL ||
    'https://sandbox-api.marqeta.com/v3'
  ).replace(/\/+$/, '');
  
  if (!url.endsWith('/v3')) {
    url += '/v3';
  }
  
  return url;
}

/**
 * GET /api/marqeta/config
 * Returns current configuration and auth status
 */
marqetaApiRouter.get('/config', (req: Request, res: Response) => {
  const rawToken = (process.env.MARQETA_BASIC_TOKEN || process.env.MARQETA_AUTH_TOKEN || '').trim();
  const cleanToken = rawToken.replace(/^Basic\s+/i, '').trim();
  const authHeader = formatMarqetaBasicAuth(cleanToken);

  res.json({
    success: true,
    baseUrl: getMarqetaBaseUrl(),
    hasToken: Boolean(cleanToken),
    isBasicPrefixAutoHandled: true,
    tokenConfiguredClean: cleanToken ? `${cleanToken.slice(0, 4)}••••••••${cleanToken.slice(-4)}` : null,
    sampleHeader: authHeader || 'Basic <YOUR_TOKEN_WITHOUT_BASIC_WORD>',
    defaultUserToken: process.env.MARQETA_USER_TOKEN || '53e44e56-dd2b-4189-9b01-fd0fa398a82d',
    accountHolderGroupToken: process.env.MARQETA_ACCOUNT_HOLDER_GROUP_TOKEN || 'DEFAULT_AHG',
    endpoints: {
      createUser: `${getMarqetaBaseUrl()}/users`,
      listUsers: `${getMarqetaBaseUrl()}/users`,
      getUser: `${getMarqetaBaseUrl()}/users/{token}`,
      createCard: `${getMarqetaBaseUrl()}/cards`,
    },
  });
});

/**
 * GET /api/marqeta/users
 * Returns list of users
 */
marqetaApiRouter.get('/users', async (req: Request, res: Response) => {
  try {
    const authHeader = formatMarqetaBasicAuth();
    if (!authHeader) throw new Error("No Marqeta token configured.");
    const baseUrl = getMarqetaBaseUrl();

    const liveRes = await axios.get(`${baseUrl}/users?count=25`, {
      headers: { accept: 'application/json', Authorization: authHeader },
      timeout: 5000,
    });
    
    return res.json({
      success: true,
      source: 'marqeta_live_sandbox',
      count: liveRes.data?.data?.length || 0,
      users: liveRes.data?.data || [],
    });
  } catch (err: any) {
    return res.status(err.response?.status || 500).json({ success: false, error: err.response?.data?.error_message || err.message });
  }
});

/**
 * GET /api/marqeta/users/:token
 */
marqetaApiRouter.get('/users/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const authHeader = formatMarqetaBasicAuth();
    if (!authHeader) throw new Error("No Marqeta token configured.");
    const baseUrl = getMarqetaBaseUrl();

    const liveRes = await axios.get(`${baseUrl}/users/${token}`, {
      headers: { accept: 'application/json', Authorization: authHeader },
      timeout: 5000,
    });

    return res.json({
      success: true,
      source: 'marqeta_live_sandbox',
      user: liveRes.data,
    });
  } catch (err: any) {
    return res.status(err.response?.status || 500).json({ success: false, error: err.response?.data?.error_message || err.message });
  }
});

/**
 * POST /api/marqeta/users
 * Creates a new user in Marqeta sandbox
 */
marqetaApiRouter.post('/users', async (req: Request, res: Response) => {
  try {
    const {
      first_name, last_name, token, active = true, uses_parent_account = false,
      corporate_card_holder = false, account_holder_group_token = 'DEFAULT_AHG',
      email, phone, address1, city, state, postal_code, country = 'USA',
      metadata = {}, customBasicToken,
    } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({ success: false, error: 'Fields first_name and last_name are required' });
    }

    const assignedToken = token || crypto.randomUUID();
    const userPayload = {
      token: assignedToken,
      active: Boolean(active),
      first_name,
      last_name,
      uses_parent_account: Boolean(uses_parent_account),
      corporate_card_holder: Boolean(corporate_card_holder),
      metadata: metadata || {},
      account_holder_group_token: account_holder_group_token || 'DEFAULT_AHG',
      email: email || `${first_name.toLowerCase()}.${last_name.toLowerCase()}@fintech.local`,
      phone: phone || '+1 (555) 012-3456',
      address1: address1 || '100 Enterprise Way',
      city: city || 'San Francisco',
      state: state || 'CA',
      postal_code: postal_code || '94105',
      country: country || 'USA',
    };

    const authHeader = formatMarqetaBasicAuth(customBasicToken);
    if (!authHeader) throw new Error("No Marqeta token configured.");
    const baseUrl = getMarqetaBaseUrl();

    const liveRes = await axios.post(`${baseUrl}/users`, userPayload, {
      headers: { accept: 'application/json', 'Content-Type': 'application/json', Authorization: authHeader },
      timeout: 6000,
    });

    return res.status(201).json({
      success: true,
      message: 'User successfully created in Marqeta Sandbox API',
      liveExecuted: true,
      user: liveRes.data,
    });
  } catch (err: any) {
    return res.status(err.response?.status || 500).json({ success: false, error: err.response?.data?.error_message || err.message });
  }
});

/**
 * POST /api/marqeta/cards
 * Issues a virtual card for a Marqeta user
 */
marqetaApiRouter.post('/cards', async (req: Request, res: Response) => {
  try {
    const { user_token, card_product_token = 'cp_corporate_expense_v1', customBasicToken } = req.body;

    if (!user_token) {
      return res.status(400).json({ success: false, error: 'Field user_token is required to issue a Marqeta card' });
    }

    const authHeader = formatMarqetaBasicAuth(customBasicToken);
    if (!authHeader) throw new Error("No Marqeta token configured.");
    const baseUrl = getMarqetaBaseUrl();

    const liveRes = await axios.post(`${baseUrl}/cards`, {
      user_token,
      card_product_token,
    }, {
      headers: { accept: 'application/json', 'Content-Type': 'application/json', Authorization: authHeader },
      timeout: 6000,
    });

    return res.status(201).json({
      success: true,
      message: 'Marqeta virtual card successfully issued',
      card: liveRes.data,
    });
  } catch (err: any) {
    return res.status(err.response?.status || 500).json({ success: false, error: err.response?.data?.error_message || err.message });
  }
});

/**
 * GET /api/marqeta/cards
 */
marqetaApiRouter.get('/cards', async (req: Request, res: Response) => {
  try {
    const { user_token } = req.query;
    if (!user_token) {
      return res.status(400).json({ success: false, error: 'user_token query parameter is required to list cards' });
    }

    const authHeader = formatMarqetaBasicAuth();
    if (!authHeader) throw new Error("No Marqeta token configured.");
    const baseUrl = getMarqetaBaseUrl();

    const liveRes = await axios.get(`${baseUrl}/cards/user/${user_token}`, {
      headers: { accept: 'application/json', Authorization: authHeader },
      timeout: 5000,
    });

    return res.json({ success: true, cards: liveRes.data?.data || [] });
  } catch (err: any) {
    return res.status(err.response?.status || 500).json({ success: false, error: err.response?.data?.error_message || err.message });
  }
});

/**
 * GET /api/marqeta/cardproducts
 * Returns the card products configuration list
 */
marqetaApiRouter.get('/cardproducts', async (req: Request, res: Response) => {
  try {
    const customBasicToken = req.headers['authorization'] as string;
    const authHeader = formatMarqetaBasicAuth(customBasicToken);
    if (!authHeader) throw new Error("No Marqeta token configured.");
    const baseUrl = getMarqetaBaseUrl();

    const liveRes = await axios.get(`${baseUrl}/cardproducts`, {
      headers: { accept: 'application/json', Authorization: authHeader },
      timeout: 5000,
    });

    return res.json({
      success: true,
      cardproducts: liveRes.data,
    });
  } catch (err: any) {
    return res.status(err.response?.status || 500).json({ success: false, error: err.response?.data?.error_message || err.message });
  }
});

/**
 * POST /api/marqeta/gpaorders
 */
marqetaApiRouter.post('/gpaorders', async (req: Request, res: Response) => {
  try {
    const {
      user_token = '53e44e56-dd2b-4189-9b01-fd0fa398a82d',
      amount = '1000.00',
      currency_code = 'USD',
      funding_source_token = 'sandbox_program_funding',
      customBasicToken,
    } = req.body;

    const authHeader = formatMarqetaBasicAuth(customBasicToken || '7fa5863c-8a79-4442-8a60-32c7b61229db:99c5448d-d81d-42d8-9d49-42f46b1d955d');
    if (!authHeader) throw new Error("No Marqeta token configured.");
    const baseUrl = getMarqetaBaseUrl();

    const liveRes = await axios.post(`${baseUrl}/gpaorders`, {
      user_token,
      amount,
      currency_code,
      funding_source_token,
    }, {
      headers: { accept: 'application/json', 'Content-Type': 'application/json', Authorization: authHeader },
      timeout: 6000,
    });

    return res.status(201).json({
      success: true,
      message: 'Marqeta GPA order (funding) executed successfully',
      gpa_order: liveRes.data,
    });
  } catch (err: any) {
    return res.status(err.response?.status || 500).json({ success: false, error: err.response?.data?.error_message || err.message });
  }
});

/**
 * GET /api/marqeta/curl
 */
marqetaApiRouter.get('/curl', (req: Request, res: Response) => {
  const { tokenOverride } = req.query;
  const rawToken = (typeof tokenOverride === 'string' && tokenOverride.trim())
    ? tokenOverride.trim()
    : (process.env.MARQETA_BASIC_TOKEN || process.env.MARQETA_AUTH_TOKEN || '').trim();

  const cleanToken = rawToken.replace(/^Basic\s+/i, '').trim();
  const authDisplay = cleanToken ? `Basic ${cleanToken}` : 'Basic <ENTER_TOKEN_ONLY_IN_ENV>';
  
  const userPayload = {
    first_name: 'Marqeta',
    last_name: 'User',
  };

  const curlCommand = `curl -X POST "https://sandbox-api.marqeta.com/v3/users" \\
  -H "accept: application/json" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: ${authDisplay}" \\
  -d '${JSON.stringify(userPayload)}'`;

  res.json({
    success: true,
    curl: curlCommand,
    authHeader: authDisplay,
    cleanTokenProvided: Boolean(cleanToken),
    targetUrl: 'https://sandbox-api.marqeta.com/v3/users',
    payload: userPayload,
  });
});

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get Citi configuration from environment
const getCitiEnvConfig = () => {
  const bearerToken = process.env.CITI_BEARER_TOKEN || process.env.BEARER_TOKEN || '';
  const clientId = process.env.CITI_CLIENT_ID || process.env.CLIENT_ID || '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI';
  const uuid = process.env.CITI_UUID || process.env.UUID || 'a912c0bc-7f52-41a5-a7d1-fe716d949d71';
  const apiUrl = process.env.CITI_API_URL || process.env.CITI_ACCOUNTS_DETAILS_URL || 'https://partner.citi.com/gcgapi/sandbox/prod/api/accounts/account-transactions/partner/v1/accounts/details';
  const transactionsUrl = process.env.CITI_TRANSACTIONS_URL || 'https://partner.citi.com/gcgapi/sandbox/prod/api/accounts/account-transactions/partner/v1/transactions';
  const environment = process.env.CITI_ENVIRONMENT || 'sandbox';
  const autoRefreshInterval = Number(process.env.AUTO_REFRESH_INTERVAL || 0);

  return {
    bearerToken,
    clientId,
    uuid,
    apiUrl,
    transactionsUrl,
    environment,
    autoRefreshInterval,
  };
};

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Citi environment config info endpoint (safe metadata for frontend initialization)
app.get('/api/citi/config', (req, res) => {
  const env = getCitiEnvConfig();
  const hasEnvToken = Boolean(env.bearerToken && env.bearerToken.trim().length > 0);
  const maskedToken = hasEnvToken 
    ? `...${env.bearerToken.trim().slice(-6)}` 
    : '';

  res.json({
    url: env.apiUrl,
    clientId: env.clientId,
    uuid: env.uuid,
    transactionsUrl: env.transactionsUrl,
    environment: env.environment,
    autoRefreshInterval: env.autoRefreshInterval,
    hasEnvToken,
    maskedToken,
    configuredVars: {
      CITI_BEARER_TOKEN: hasEnvToken,
      CITI_CLIENT_ID: Boolean(process.env.CITI_CLIENT_ID || process.env.CLIENT_ID),
      CITI_UUID: Boolean(process.env.CITI_UUID || process.env.UUID),
      CITI_API_URL: Boolean(process.env.CITI_API_URL || process.env.CITI_ACCOUNTS_DETAILS_URL),
      CITI_TRANSACTIONS_URL: Boolean(process.env.CITI_TRANSACTIONS_URL),
      CITI_ENVIRONMENT: Boolean(process.env.CITI_ENVIRONMENT),
      AUTO_REFRESH_INTERVAL: Boolean(process.env.AUTO_REFRESH_INTERVAL),
    },
  });
});

// Proxy endpoint for Citi Accounts Details
app.post('/api/citi/proxy/accounts-details', async (req, res) => {
  try {
    const env = getCitiEnvConfig();
    const {
      url = env.apiUrl,
      bearerToken,
      clientId = env.clientId,
      uuid = env.uuid,
      accept = 'application/json',
    } = req.body;

    // Use token from request body if provided, otherwise fallback to server environment variable
    const rawToken = (bearerToken && bearerToken.trim()) || env.bearerToken;

    if (!rawToken || !rawToken.trim()) {
      return res.status(400).json({
        error: 'Missing Bearer Token',
        message: 'No Bearer token provided in request or environment (CITI_BEARER_TOKEN). Please provide a token in the configuration modal or set CITI_BEARER_TOKEN in your .env file.',
        hint: 'You can set CITI_BEARER_TOKEN in .env or pass Authorization Bearer in the UI.',
      });
    }

    const cleanToken = rawToken.startsWith('Bearer ')
      ? rawToken
      : `Bearer ${rawToken.trim()}`;

    const headers: Record<string, string> = {
      'Accept': accept || 'application/json',
      'Content-Type': 'application/json',
      'Authorization': cleanToken,
      'client_id': clientId || env.clientId,
      'uuid': uuid || env.uuid,
    };

    const targetUrl = url || env.apiUrl;
    const startTime = Date.now();
    const citiResponse = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });
    const latency = Date.now() - startTime;

    const contentType = citiResponse.headers.get('content-type') || '';
    let responseData: any;

    if (contentType.includes('application/json')) {
      responseData = await citiResponse.json();
    } else {
      const text = await citiResponse.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { rawText: text };
      }
    }

    return res.status(citiResponse.status).json({
      status: citiResponse.status,
      statusText: citiResponse.statusText,
      latencyMs: latency,
      headers: {
        'content-type': contentType,
        'uuid': citiResponse.headers.get('uuid') || uuid,
      },
      data: responseData,
    });
  } catch (error: any) {
    console.error('Citi API Proxy error:', error);
    return res.status(502).json({
      error: 'Proxy Network Error',
      message: error.message || 'Failed to reach Citi Partner API endpoint.',
    });
  }
});

// Proxy endpoint for general Citi API queries (e.g. Transactions endpoint if available)
app.post('/api/citi/proxy/transactions', async (req, res) => {
  try {
    const env = getCitiEnvConfig();
    const {
      url,
      accountId,
      bearerToken,
      clientId = env.clientId,
      uuid = env.uuid,
    } = req.body;

    const targetUrl = url || (accountId 
      ? `https://partner.citi.com/gcgapi/sandbox/prod/api/accounts/account-transactions/partner/v1/accounts/${accountId}/transactions`
      : env.transactionsUrl);

    const rawToken = (bearerToken && bearerToken.trim()) || env.bearerToken;

    if (!rawToken || !rawToken.trim()) {
      return res.status(400).json({ 
        error: 'Missing Bearer Token',
        message: 'No Bearer token found. Please configure CITI_BEARER_TOKEN in .env or provide it in the UI.',
      });
    }

    const cleanToken = rawToken.startsWith('Bearer ')
      ? rawToken
      : `Bearer ${rawToken.trim()}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': cleanToken,
      'client_id': clientId || env.clientId,
      'uuid': uuid || env.uuid,
    };

    const citiResponse = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    const responseData = await citiResponse.json().catch(async () => ({
      rawText: await citiResponse.text(),
    }));

    return res.status(citiResponse.status).json({
      status: citiResponse.status,
      data: responseData,
    });
  } catch (error: any) {
    return res.status(502).json({
      error: 'Proxy Network Error',
      message: error.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Citi Accounts API Server running on port ${PORT}`);
  });
}

startServer();

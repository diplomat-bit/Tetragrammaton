import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health / environment variables endpoint
app.get('/api/env-config', (_req, res) => {
  res.json({
    apiUrl: process.env.CITI_API_URL || 'https://partner.citi.com/gcgapi/sandbox/prod/openapi/v1/insurance/bookings/withOfflinePayments',
    clientId: process.env.CITI_CLIENT_ID || '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
    uuid: process.env.CITI_UUID || '4fd8eb84-cf25-4be1-ab36-e52c7fc8cb52',
    bearerToken: process.env.CITI_BEARER_TOKEN || '',
    accept: process.env.CITI_ACCEPT || 'application/json',
    contentType: process.env.CITI_CONTENT_TYPE || 'application/json',
    offerWaveId: process.env.CITI_OFFER_WAVE_ID || '987654321',
    offerCampaignId: process.env.CITI_OFFER_CAMPAIGN_ID || '123456789',
    offerId: process.env.CITI_OFFER_ID || '111000125',
    policyProductCode: process.env.CITI_POLICY_PRODUCT_CODE || 'PR001',
    policyCurrency: process.env.CITI_POLICY_CURRENCY || 'SGD',
    initialPaymentSourceAccountId: process.env.CITI_INITIAL_PAYMENT_SOURCE_ACCOUNT_ID || '3c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
    premiumSourceAccountId: process.env.CITI_PREMIUM_SOURCE_ACCOUNT_ID || '1234567896f2b4d4d796c344e387563374a476jfhjd23478377889738343d',
  });
});

// Proxy Citi Booking Request
app.post('/api/proxy-booking', async (req, res) => {
  const {
    targetUrl = process.env.CITI_API_URL || 'https://partner.citi.com/gcgapi/sandbox/prod/openapi/v1/insurance/bookings/withOfflinePayments',
    headers = {},
    payload = {}
  } = req.body;

  const startTime = Date.now();

  const requestHeaders: Record<string, string> = {
    'Accept': headers.accept || process.env.CITI_ACCEPT || 'application/json',
    'Content-Type': headers.contentType || process.env.CITI_CONTENT_TYPE || 'application/json',
    'client_id': headers.clientId || process.env.CITI_CLIENT_ID || '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
    'uuid': headers.uuid || process.env.CITI_UUID || '4fd8eb84-cf25-4be1-ab36-e52c7fc8cb52',
  };

  const token = headers.bearerToken !== undefined ? headers.bearerToken : (process.env.CITI_BEARER_TOKEN || '');
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  } else {
    requestHeaders['Authorization'] = 'Bearer ';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    const responseHeadersObj: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      responseHeadersObj[key] = val;
    });

    let data: any;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    res.status(200).json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      durationMs: duration,
      requestHeaders,
      responseHeaders: responseHeadersObj,
      data,
    });
  } catch (err: any) {
    const duration = Date.now() - startTime;
    res.status(200).json({
      success: false,
      status: 502,
      statusText: 'Bad Gateway / Network Error',
      durationMs: duration,
      requestHeaders,
      responseHeaders: {},
      error: err?.message || 'Failed to reach Citi API endpoint',
      data: {
        error: 'Network or Endpoint Error',
        message: err?.message || 'Unable to connect to partner.citi.com sandbox. Please check network connectivity or credentials.',
        hint: 'You can test the example sandbox payload response in the UI response viewer.'
      }
    });
  }
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Citi OpenAPI Proxy Server running on http://0.0.0.0:${PORT}`);
});

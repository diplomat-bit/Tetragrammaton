import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function citiApiPlugin(): Plugin {
  return {
    name: 'citi-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/env-config', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
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
        }));
      });

      server.middlewares.use('/api/proxy-booking', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const {
              targetUrl = process.env.CITI_API_URL || 'https://partner.citi.com/gcgapi/sandbox/prod/openapi/v1/insurance/bookings/withOfflinePayments',
              headers = {},
              payload = {}
            } = parsed;

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

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                durationMs: duration,
                requestHeaders,
                responseHeaders: responseHeadersObj,
                data,
              }));
            } catch (fetchErr: any) {
              const duration = Date.now() - startTime;
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: false,
                status: 502,
                statusText: 'Bad Gateway / Network Error',
                durationMs: duration,
                requestHeaders,
                responseHeaders: {},
                error: fetchErr?.message || 'Failed to reach Citi API endpoint',
                data: {
                  error: 'Network or Endpoint Error',
                  message: fetchErr?.message || 'Unable to connect to partner.citi.com sandbox. Verify network access or credentials.',
                  hint: 'You can test the pre-loaded example sandbox response in the response panel.'
                }
              }));
            }
          } catch (e: any) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON body', details: e?.message }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), citiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

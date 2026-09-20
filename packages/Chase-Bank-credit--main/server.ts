import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API endpoint for Chase API execution & proxy
  app.post('/api/chase/execute', async (req: Request, res: Response) => {
    const startTime = Date.now();
    const {
      token,
      host = 'api.chase.com',
      endpointPath = '/card/loyalty/earn-rewards/enrollment/v1/merchants/programs/pay-with-points/enrollments/123e4567-e89b-12d3-a456-426614174000',
      headers = {},
      body = null,
      method = 'POST',
      simulate = false,
    } = req.body;

    if (!token && !simulate) {
      return res.status(400).json({
        success: false,
        status: 400,
        statusText: 'Bad Request',
        durationMs: 0,
        headers: {},
        data: {
          code: 'MISSING_ACCESS_TOKEN',
          message: 'Access token is required to execute the Chase API request.',
        },
        requestDetails: {
          url: `https://${host}${endpointPath}`,
          method,
          headers: {},
          body,
        },
        isSimulated: false,
        error: 'Access token is required',
      });
    }

    const cleanToken = (token || '').replace(/^Bearer\s+/i, '').trim();

    // Construct full target URL
    const cleanHost = host.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const cleanPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
    const targetUrl = `https://${cleanHost}${cleanPath}`;

    // Construct headers exactly as specified
    const requestHeaders: Record<string, string> = {
      'Host': cleanHost,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Bearer ${cleanToken}`,
      'enrollment-type-code': headers['enrollment-type-code'] || 'ENROLL',
      'external-account-identifier': headers['external-account-identifier'] || '9876543210',
      'trace-id': headers['trace-id'] || '4a7b1e2c3d4f5a6b7c8d9e0f1a2b3c4d',
      'channel-type': headers['channel-type'] || 'WEB',
    };

    // Add any custom extra headers
    if (headers && typeof headers === 'object') {
      for (const [k, v] of Object.entries(headers)) {
        if (v !== undefined && v !== null && v !== '') {
          requestHeaders[k.toLowerCase()] = String(v);
        }
      }
    }

    // Ensure authorization header is clean
    requestHeaders['authorization'] = `Bearer ${cleanToken}`;

    // Handle Mock / Simulated Mode
    if (simulate) {
      const durationMs = Math.floor(Math.random() * 120) + 85;
      const enrollmentId = cleanPath.split('/').pop() || '123e4567-e89b-12d3-a456-426614174000';
      
      const mockResponseData = {
        enrollmentId: enrollmentId,
        programId: 'pay-with-points',
        merchantId: 'MERC-CHASE-009214',
        enrollmentStatus: 'ENROLLED',
        enrollmentTypeCode: requestHeaders['enrollment-type-code'] || 'ENROLL',
        externalAccountIdentifier: requestHeaders['external-account-identifier'] || '9876543210',
        channelType: requestHeaders['channel-type'] || 'WEB',
        memberRewards: {
          pointsBalance: 128450,
          currencyEquivalent: {
            currency: 'USD',
            amount: 1284.50,
            conversionRate: 0.01,
          },
          eligibilityStatus: 'ELIGIBLE_FOR_REDEMPTION',
          tierName: 'SAPPHIRE_RESERVE_PREFERRED',
          pointScaleFactor: 100,
        },
        auditDetails: {
          traceId: requestHeaders['trace-id'],
          timestamp: new Date().toISOString(),
          processedBy: 'CHASE_LOYALTY_GATEWAY_NODE_04',
          responseCode: '200.000.SUCCESS',
        },
      };

      return res.json({
        success: true,
        status: 200,
        statusText: 'OK',
        durationMs,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'trace-id': requestHeaders['trace-id'],
          'server': 'Chase-API-Gateway/4.2.1',
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'DENY',
          'x-chase-session-id': `CHASE-SESS-${Date.now()}`,
          'date': new Date().toUTCString(),
        },
        data: mockResponseData,
        rawResponse: JSON.stringify(mockResponseData, null, 2),
        requestDetails: {
          url: targetUrl,
          method,
          headers: {
            ...requestHeaders,
            authorization: `Bearer ${cleanToken ? cleanToken.slice(0, 10) + '...' + cleanToken.slice(-6) : 'MOCK_TOKEN'}`,
          },
          body,
        },
        isSimulated: true,
        error: null,
      });
    }

    // Live Execution against Chase Host
    try {
      const fetchOptions: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (method !== 'GET' && method !== 'HEAD' && body) {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      const durationMs = Date.now() - startTime;

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        responseHeaders[key] = val;
      });

      const responseText = await response.text();
      let parsedData: any = null;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        parsedData = responseText;
      }

      return res.status(response.status).json({
        success: response.ok,
        status: response.status,
        statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
        durationMs,
        headers: responseHeaders,
        data: parsedData,
        rawResponse: responseText,
        requestDetails: {
          url: targetUrl,
          method,
          headers: {
            ...requestHeaders,
            authorization: `Bearer ${cleanToken.slice(0, 8)}...${cleanToken.slice(-4)}`,
          },
          body,
        },
        isSimulated: false,
        error: response.ok ? null : `Chase API returned HTTP ${response.status}`,
      });
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      return res.status(502).json({
        success: false,
        status: 502,
        statusText: 'Bad Gateway / Network Error',
        durationMs,
        headers: {},
        data: {
          error: err?.message || 'Failed to connect to host',
          code: err?.code || 'FETCH_FAILED',
          targetUrl,
          suggestion: 'Ensure the host is reachable or toggle Simulation Mode to test the client workflow.',
        },
        rawResponse: JSON.stringify({ error: err?.message }),
        requestDetails: {
          url: targetUrl,
          method,
          headers: {
            ...requestHeaders,
            authorization: `Bearer ${cleanToken.slice(0, 8)}...${cleanToken.slice(-4)}`,
          },
          body,
        },
        isSimulated: false,
        error: err?.message || 'Connection failed',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Chase Loyalty API Client Gateway' });
  });

  // Vite middleware in dev or static files in production
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

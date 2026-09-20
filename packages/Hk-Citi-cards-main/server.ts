import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// API route to proxy Citi Cards API requests
app.post('/api/citi/cards', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      url = 'https://partner.citi.com/gcgapi/sandbox/prod/openapi/partner/v1/cards',
      bearerToken,
      uuid,
      clientId,
      cardFunction = 'ALL',
      linkedSupplementaryCardFlag = true,
    } = req.body;

    if (!bearerToken || !uuid) {
      return res.status(400).json({
        error: 'Missing required credentials',
        message: 'Bearer Token and UUID are required to call the Citi Partner API.',
      });
    }

    // Build URL with query params
    const requestUrl = new URL(url);
    if (cardFunction) {
      requestUrl.searchParams.set('cardFunction', cardFunction);
    }
    if (linkedSupplementaryCardFlag !== undefined) {
      requestUrl.searchParams.set('linkedSupplementaryCardFlag', String(linkedSupplementaryCardFlag));
    }

    const cleanBearer = bearerToken.startsWith('Bearer ')
      ? bearerToken
      : `Bearer ${bearerToken}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: cleanBearer,
      'Content-Type': 'application/json',
      uuid: uuid.trim(),
    };

    if (clientId && clientId.trim()) {
      headers['client_id'] = clientId.trim();
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const citiResponse = await fetch(requestUrl.toString(), {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    let responseData: any = null;
    const responseContentType = citiResponse.headers.get('content-type') || '';

    if (responseContentType.includes('application/json')) {
      responseData = await citiResponse.json();
    } else {
      const text = await citiResponse.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { rawText: text };
      }
    }

    const responseHeaders: Record<string, string> = {};
    citiResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return res.status(200).json({
      success: citiResponse.ok,
      status: citiResponse.status,
      statusText: citiResponse.statusText,
      durationMs: duration,
      requestUrl: requestUrl.toString(),
      requestHeaders: {
        Accept: headers.Accept,
        'Content-Type': headers['Content-Type'],
        Authorization: `${cleanBearer.slice(0, 15)}...${cleanBearer.slice(-8)}`,
        client_id: headers.client_id || '(omitted)',
        uuid: headers.uuid,
      },
      responseHeaders,
      data: responseData,
    });
  } catch (err: any) {
    const duration = Date.now() - startTime;
    return res.status(500).json({
      success: false,
      status: 500,
      statusText: 'Gateway Error',
      durationMs: duration,
      error: err.name === 'AbortError' ? 'Request Timeout (15s)' : err.message || 'Failed to fetch from Citi endpoint',
      isNetworkError: true,
      message:
        'Could not reach Citi endpoint. If this is a sandbox environment with IP whitelisting or expired tokens, you can also explore using the built-in Sandbox Simulator payload.',
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
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

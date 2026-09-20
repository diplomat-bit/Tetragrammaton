import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API route to proxy the Citi request
  app.post('/api/citi/register', async (req, res) => {
    try {
      const url = 'https://partner.citi.com/gcgapi/sandbox/prod/api/dcr/v1/register';
      
      const token = process.env.CITI_BEARER_TOKEN;
      const businessCode = process.env.CITI_BUSINESS_CODE || 'GCB';
      const channelId = process.env.CITI_CHANNEL_ID || 'PARTNER_PORTAL';
      const clientId = process.env.CITI_CLIENT_ID || '';
      const countryCode = process.env.CITI_COUNTRY_CODE || 'US';

      if (!token) {
        return res.status(400).json({ error: 'CITI_BEARER_TOKEN environment variable is missing.' });
      }

      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'businessCode': businessCode,
        'channelId': channelId,
        'client_id': clientId,
        'countryCode': countryCode,
      };

      const requestStartTime = Date.now();
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers as any,
        body: JSON.stringify(req.body)
      });

      const responseTimeMs = Date.now() - requestStartTime;
      const status = response.status;
      const statusText = response.statusText;
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = await response.text();
      }

      // We return both the response data and telemetry details
      res.json({
        telemetry: {
          url,
          requestHeaders: headers,
          requestBody: req.body,
          status,
          statusText,
          responseTimeMs
        },
        data
      });
    } catch (error: any) {
      console.error('Error proxying to Citi API:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
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

startServer();

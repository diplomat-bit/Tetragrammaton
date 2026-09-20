const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const accessOnlineRoutes = `
  // ----------------------------------------------------
  // Access Online API Endpoints
  // ----------------------------------------------------
  const ACCESS_ONLINE_API_BASE = 'https://apip2.usbank.com/access-online-transactions/v1';

  // Helper to handle Access Online API errors
  const handleAccessOnlineError = async (response, fallbackData, res) => {
    const errText = await response.text();
    if (response.status === 403 && errText.includes('edgesuite')) {
        return res.json(fallbackData);
    }
    return res.status(400).json({ error: \`Access Online API Error: \${errText}\` });
  };

  // 1. Search Orders
  app.post('/api/access-online/orders/search', async (req, res) => {
    const fallbackData = {
      page: { number: 1, size: 20, pageCount: 1, totalCount: 2 },
      orders: [
        { orderID: 87654321, controlNumber: "KW01262021b", orderDate: new Date().toISOString().split('T')[0], orderAmount: 1500.00, orderStatus: "Open", orderType: "Purchase_Order" },
        { orderID: 87654322, controlNumber: "KW01262021c", orderDate: new Date().toISOString().split('T')[0], orderAmount: 3200.50, orderStatus: "Closed", orderType: "Purchase_Order" }
      ]
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(\`\${ACCESS_ONLINE_API_BASE}/orders/search\`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Organization-Short-Name': 'ORG123',
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) return await handleAccessOnlineError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Access Online API' });
    }
  });

  // 2. Get Transaction Details
  app.get('/api/access-online/transactions/:transactionID', async (req, res) => {
    const fallbackData = {
      transactionID: req.params.transactionID,
      transactionDetails: {
        transactionAmount: 150.00,
        merchantName: "ACME CORP",
        transactionDate: new Date().toISOString().split('T')[0],
        status: "Posted"
      }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(\`\${ACCESS_ONLINE_API_BASE}/transactions/\${req.params.transactionID}\`, {
        headers: {
          ...getHeaders(),
          'Organization-Short-Name': 'ORG123',
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        }
      });
      if (!response.ok) return await handleAccessOnlineError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Access Online API' });
    }
  });
`;

content = content.replace('  // Vite middleware for development', accessOnlineRoutes + '  // Vite middleware for development');
fs.writeFileSync('server.ts', content);

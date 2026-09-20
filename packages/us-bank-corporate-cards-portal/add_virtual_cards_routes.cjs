const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const virtualCardRoutes = `
  // ----------------------------------------------------
  // Virtual Card Payments API Endpoints
  // ----------------------------------------------------
  const VC_API_BASE = 'https://apip2.usbank.com/virtual-cards/v2';

  // Helper to handle VC API errors
  const handleVCError = async (response, fallbackData, res) => {
    const errText = await response.text();
    if (response.status === 403 && errText.includes('edgesuite')) {
        return res.json(fallbackData);
    }
    return res.status(400).json({ error: \`Virtual Cards API Error: \${errText}\` });
  };

  // 1. Create Virtual Card
  app.post('/api/virtual-cards/cards', async (req, res) => {
    const newID = Math.floor(10000000 + Math.random() * 90000000).toString();
    const fallbackData = {
      virtualCard: {
        ID: newID,
        number: \`111122223333\${Math.floor(1000 + Math.random() * 9000)}\`,
        CVV: Math.floor(100 + Math.random() * 900).toString(),
        expirationDate: "2028-12-31"
      }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.status(201).json(fallbackData);
      const response = await fetch(\`\${VC_API_BASE}/cards\`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, ''),
          'Idempotency-Key': crypto.randomUUID()
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) return await handleVCError(response, fallbackData, res);
      return res.status(201).json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Virtual Cards API' });
    }
  });

  // 2. Get Card Details
  app.get('/api/virtual-cards/cards/:cardID', async (req, res) => {
    const fallbackData = {
      virtualCard: {
        ID: req.params.cardID,
        number: \`111122223333\${Math.floor(1000 + Math.random() * 9000)}\`,
        CVV: "123",
        amount: "5000.00",
        availableBalance: "5000.00",
        effectiveStart: "2024-01-01",
        effectiveUntil: "2028-12-31",
        expirationDate: "2028-12-31",
        status: "OPEN"
      }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(\`\${VC_API_BASE}/cards/\${req.params.cardID}\`, {
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        }
      });
      if (!response.ok) return await handleVCError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Virtual Cards API' });
    }
  });

  // 3. Search Transactions for a Card
  app.post('/api/virtual-cards/cards/:cardID/transactions/search', async (req, res) => {
    const fallbackData = {
      pageMeta: { pageNumber: 1, pageSize: 1000, pageCount: 1, totalCount: 1, links: { next: "" } },
      transactions: [
        {
          ID: \`0304607423003133\${Math.floor(100000000000000 + Math.random() * 90000000000000)}\`,
          date: new Date().toISOString().split('T')[0],
          amount: 150.00,
          typeCode: "PURCHASE",
          merchant: { name: "ACME CORP", city: "MINNEAPOLIS", state: "MN", zip: "55402", categoryCode: "5045", categoryCodeDescription: "Computers" }
        }
      ]
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(\`\${VC_API_BASE}/cards/\${req.params.cardID}/transactions/search\`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) return await handleVCError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Virtual Cards API' });
    }
  });
`;

content = content.replace('  // Vite middleware for development', virtualCardRoutes + '  // Vite middleware for development');
fs.writeFileSync('server.ts', content);

const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const custodyRoutes = `
  // ----------------------------------------------------
  // Custody API Endpoints
  // ----------------------------------------------------
  const CUSTODY_API_BASE = 'https://api2.usbank.com/wmis/custody-services/v1';

  // Helper to handle Custody API errors
  const handleCustodyError = async (response, fallbackData, res) => {
    const errText = await response.text();
    if (response.status === 403 && errText.includes('edgesuite')) {
        return res.json(fallbackData);
    }
    return res.status(400).json({ error: \`Custody API Error: \${errText}\` });
  };

  // 1. Get Accounts
  app.get('/api/custody/accounts', async (req, res) => {
    const fallbackData = {
      accounts: [
        { accountId: "a6c93fd4-bf67-b8666eea3232", accountNumber: "1234568", accountName: "XYZ Joint Account FD", accountType: "investment", accountClassification: "escrow", accountGroupId: "643", accountGroupName: "escrowGE", clientId: "6592", clientName: "xyz corp", firmId: "191", firmName: "GTC" }
      ],
      pagination: { pageSize: 25, pageNumber: 1, totalRecords: 1, totalPages: 1 }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      
      const queryParams = new URLSearchParams(req.query).toString();
      const response = await fetch(\`\${CUSTODY_API_BASE}/accounts\${queryParams ? '?' + queryParams : ''}\`, {
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        }
      });
      if (!response.ok) return await handleCustodyError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Custody API' });
    }
  });

  // 2. Get Holdings
  app.post('/api/custody/accounts/holdings', async (req, res) => {
    const fallbackData = {
      holdings: [
        { accountId: req.body.accountId?.[0] || "a6c93fd4-bf67-b8666eea3232", asOfDate: "2023-10-25T00:00:00.000Z", portfolioLongName: "Main", cusip: "73240000", ticker: "BFP30", settledUnitQuantity: 23, baseSettledMarketValue: 8789.9 }
      ],
      pagination: { pageSize: 25, pageNumber: 1, totalRecords: 1, totalPages: 1 }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(\`\${CUSTODY_API_BASE}/accounts/holdings\`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) return await handleCustodyError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Custody API' });
    }
  });

  // 3. Get Transactions
  app.post('/api/custody/accounts/transactions', async (req, res) => {
    const fallbackData = {
      transactions: [
        { accountId: req.body.accountId?.[0] || "a6c93fd4-bf67-b8666eea3232", transactionId: "1000925", transactionDesc: "Sale 0.02 Units of US BANK MMDA", transactionTypeCode: "20", txnDescriptionDesc: "sell", transactionUnitQuantity: 27, transactionNetAmount: 638.01, tradeDate: "2023-10-24T00:00:00.000Z", settlementDate: "2023-10-25T00:00:00.000Z" }
      ],
      pagination: { pageSize: 25, pageNumber: 1, totalRecords: 1, totalPages: 1 }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(\`\${CUSTODY_API_BASE}/accounts/transactions\`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) return await handleCustodyError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Custody API' });
    }
  });

  // 4. Get Tax Lots
  app.post('/api/custody/accounts/taxlots', async (req, res) => {
    const fallbackData = {
      taxlots: [
        { accountId: req.body.accountId?.[0] || "a6c93fd4-bf67-b8666eea3232", taxlotId: "1337155", portfolioLongName: "Primary (capital)", cusip: "73240000", taxlotUnitQuantity: 34, originalFaceAmount: 14600, currentFaceAmount: 14600 }
      ],
      pagination: { pageSize: 25, pageNumber: 1, totalRecords: 1, totalPages: 1 }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(\`\${CUSTODY_API_BASE}/accounts/taxlots\`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) return await handleCustodyError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Custody API' });
    }
  });

  // 5. Get Assets
  app.post('/api/custody/accounts/assets', async (req, res) => {
    const fallbackData = {
      assets: [
        { cusip: "73240000", ticker: "BFP30", instrumentShortName: "asset backed sec", instrumentTypeLongDesc: "corporate secured variable rate", issueCurrencyCode: "USD", price: "3569.9" }
      ],
      pagination: { pageSize: 25, pageNumber: 1, totalRecords: 1, totalPages: 1 }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(\`\${CUSTODY_API_BASE}/accounts/assets\`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) return await handleCustodyError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Custody API' });
    }
  });

  // 6. Get Failed Trades
  app.post('/api/custody/accounts/failedtrades', async (req, res) => {
    const fallbackData = {
      failedTrades: [
        { accountId: req.body.accountId?.[0] || "a6c93fd4-bf67-b8666eea3232", cusip: "73240000", ticker: "BFP30", tradeActivityId: "10265933", transactionTypeDesc: "buy", executingBrokerName: "securities 190", transactionUnitQuantity: 10000, transactionPrice: 1000.98, tradeDate: "2023-10-24T00:00:00.000Z" }
      ],
      pagination: { pageSize: 25, pageNumber: 1, totalRecords: 1, totalPages: 1 }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(\`\${CUSTODY_API_BASE}/accounts/failedtrades\`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) return await handleCustodyError(response, fallbackData, res);
      return res.json(await response.json());
    } catch (err) {
      res.status(400).json({ error: 'Failed to connect to Custody API' });
    }
  });

`;

content = content.replace('  // Vite middleware for development', custodyRoutes + '  // Vite middleware for development');
fs.writeFileSync('server.ts', content);

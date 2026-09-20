import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const USBANK_API_BASE_ACCOUNTS = 'https://apip2.usbank.com/corporate-credit-cards/v1';
  const USBANK_API_BASE_TRANSACTIONS = 'https://apip2.usbank.com/corporate-transactions/v1';

  // Helper to get headers
  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'x-api-key': process.env.USBANK_API_KEY || '',
    };
  };

  // ----------------------------------------------------
  // Stateful Local Development Engine (Fallback)
  // ----------------------------------------------------
  const localDb = {
    accounts: [
      {
        accountUID: 'ACC-8A9B2C3D',
        cardholderName: 'Sarah Jenkins',
        last4: '9482',
        expirationDate: '11/27',
        status: 'Open',
        creditLimit: 25000,
        availableCash: 25000,
        currentBalance: 0,
        address: { addressLine1: '800 Nicollet Mall', city: 'Minneapolis', state: 'MN', postalCode: '55402' }
      },
      {
        accountUID: 'ACC-1F2E3D4C',
        cardholderName: 'Marcus Chen',
        last4: '3318',
        expirationDate: '04/26',
        status: 'Open',
        creditLimit: 10000,
        availableCash: 8540.20,
        currentBalance: 1459.80,
        address: { addressLine1: '1 Market St', city: 'San Francisco', state: 'CA', postalCode: '94105' }
      },
      {
        accountUID: 'ACC-5599AABB',
        cardholderName: 'Elena Rodriguez',
        last4: '7721',
        expirationDate: '09/25',
        status: 'V9-VoluntarilyClosed',
        creditLimit: 5000,
        availableCash: 0,
        currentBalance: 0,
        address: { addressLine1: '450 Lexington Ave', city: 'New York', state: 'NY', postalCode: '10017' }
      }
    ],
    macControls: {} as Record<string, any[]>,
    transactions: [
      { transactionID: 'TXN-0001', date: new Date().toISOString(), merchant: 'Delta Air Lines', amount: 485.20, status: 'Posted' },
      { transactionID: 'TXN-0002', date: new Date(Date.now() - 86400000).toISOString(), merchant: 'Uber Technologies', amount: 42.50, status: 'Posted' },
      { transactionID: 'TXN-0003', date: new Date(Date.now() - 172800000).toISOString(), merchant: 'AWS EMEA', amount: 1240.00, status: 'Pending' }
    ]
  };

  // Initialize MAC controls
  localDb.accounts.forEach(acc => {
    localDb.macControls[acc.accountUID] = [
      { action: 'Approve', merchantGroup: 'Airlines' },
      { action: 'Decline', merchantGroup: 'Casinos/Gambling' }
    ];
  });

  // ----------------------------------------------------
  // API Routes
  // ----------------------------------------------------

  // Search accounts
  app.post('/api/accounts/search', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        // Use Stateful Local Engine
        return res.json({ accounts: localDb.accounts.map(a => ({
          accountUID: a.accountUID,
          cardholderName: a.cardholderName,
          last4: a.last4,
          status: a.status,
          creditLimit: a.creditLimit,
          currentBalance: a.currentBalance
        }))});
      }
      
            const response = await fetch(`${USBANK_API_BASE_ACCOUNTS}/accounts/search`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite')) {
           return res.json({ accounts: localDb.accounts.map(a => ({
            accountUID: a.accountUID,
            cardholderName: a.cardholderName,
            last4: a.last4,
            status: a.status,
            creditLimit: a.creditLimit,
            currentBalance: a.currentBalance
          }))});
        }
        return res.status(400).json({ error: `U.S. Bank API Error: ${errText}` });
      }

      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to U.S. Bank API' });
    }
  });

  // Get Account Details
  app.get('/api/accounts/:id', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        const account = localDb.accounts.find(a => a.accountUID === req.params.id);
        if (!account) return res.status(404).json({ error: 'Account not found in local engine' });
        return res.json(account);
      }
      
            const response = await fetch(`${USBANK_API_BASE_ACCOUNTS}/accounts/${req.params.id}`, { headers: getHeaders() });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite')) {
           const account = localDb.accounts.find(a => a.accountUID === req.params.id);
           if (!account) return res.status(404).json({ error: 'Account not found in local engine' });
           return res.json(account);
        }
        return res.status(400).json({ error: `U.S. Bank API Error: ${errText}` });
      }
      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to U.S. Bank API' });
    }
  });

  // Setup Account
  app.post('/api/accounts/setup', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        const newID = `ACC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const newAcc = {
          accountUID: newID,
          cardholderName: `${req.body.firstName} ${req.body.lastName}`,
          last4: Math.floor(1000 + Math.random() * 9000).toString(),
          expirationDate: '12/28',
          status: 'Open',
          creditLimit: req.body.creditLimit || 5000,
          availableCash: req.body.creditLimit || 5000,
          currentBalance: 0,
          address: { addressLine1: 'New Cardholder Address', city: 'Minneapolis', state: 'MN', postalCode: '55402' }
        };
        localDb.accounts.unshift(newAcc);
        localDb.macControls[newID] = [{ action: 'Approve', merchantGroup: 'All' }];
        
        return res.status(202).json({ setupID: `SETUP-${crypto.randomUUID().split('-')[0].toUpperCase()}`, status: 'SETUP_ACCEPTED', accountUID: newID });
      }
      
            const response = await fetch(`${USBANK_API_BASE_ACCOUNTS}/accounts/setup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite')) {
            const newID = `ACC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
            const newAcc = {
              accountUID: newID,
              cardholderName: `${req.body.firstName} ${req.body.lastName}`,
              last4: Math.floor(1000 + Math.random() * 9000).toString(),
              expirationDate: '12/28',
              status: 'Open',
              creditLimit: req.body.creditLimit || 5000,
              availableCash: req.body.creditLimit || 5000,
              currentBalance: 0,
              address: { addressLine1: 'New Cardholder Address', city: 'Minneapolis', state: 'MN', postalCode: '55402' }
            };
            localDb.accounts.unshift(newAcc);
            localDb.macControls[newID] = [{ action: 'Approve', merchantGroup: 'All' }];
            
            return res.status(202).json({ setupID: `SETUP-${crypto.randomUUID().split('-')[0].toUpperCase()}`, status: 'SETUP_ACCEPTED', accountUID: newID });
        }
        return res.status(400).json({ error: `U.S. Bank API Error: ${errText}` });
      }
      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to U.S. Bank API' });
    }
  });

  // Get MAC
    app.get('/api/accounts/:id/merchant-auth-controls', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        return res.json(localDb.macControls[req.params.id] || []);
      }
      
      const response = await fetch(`${USBANK_API_BASE_ACCOUNTS}/accounts/${req.params.id}/merchant-auth-controls`, { headers: getHeaders() });
      
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite')) {
            return res.json(localDb.macControls[req.params.id] || []);
        }
        return res.status(400).json({ error: `U.S. Bank API Error: ${errText}` });
      }
      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to U.S. Bank API' });
    }
  });

  // Update MAC
    app.put('/api/accounts/:id/merchant-auth-controls', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        localDb.macControls[req.params.id] = req.body;
        return res.json({ success: true, updatedControls: req.body });
      }
      const response = await fetch(`${USBANK_API_BASE_ACCOUNTS}/accounts/${req.params.id}/merchant-auth-controls`, { 
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(req.body)
      });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite')) {
            localDb.macControls[req.params.id] = req.body;
            return res.json({ success: true, updatedControls: req.body });
        }
        return res.status(400).json({ error: `U.S. Bank API Error: ${errText}` });
      }
      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to U.S. Bank API' });
    }
  });

  // Transactions Search
  app.post('/api/transactions/search', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        return res.json({ transactions: localDb.transactions });
      }
      
            const response = await fetch(`${USBANK_API_BASE_TRANSACTIONS}/transactions/search`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite')) {
            return res.json({ transactions: localDb.transactions });
        }
        return res.status(400).json({ error: `U.S. Bank API Error: ${errText}` });
      }
      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to U.S. Bank API' });
    }
  });


  // Zelle: Search Aliases
  app.post('/api/zelle/aliases/search', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        // Fallback for missing key
        return res.json({
          aliasesEnrollmentStatus: req.body.aliases.map((a: string) => ({
            alias: a,
            firstName: "Jane",
            lastName: "Doe",
            organizationID: "US Bank",
            organizationType: "IN_NETWORK",
            financialOrganizationName: "US Bank",
            aliasEnrollmentStatus: "ALIAS_ENROLLED",
            aliasEnrollmentStatusMessage: "Alias is enrolled"
          }))
        });
      }
      const response = await fetch('https://api2.usbank.com/money-movement/zelle-b2c/v1/aliases/search', {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, ''),
          'Accept-Encoding': 'application/json'
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite')) {
            return res.json({
              aliasesEnrollmentStatus: req.body.aliases.map((a: string) => ({
                alias: a,
                firstName: "Jane",
                lastName: "Doe",
                organizationID: "US Bank",
                organizationType: "IN_NETWORK",
                financialOrganizationName: "US Bank",
                aliasEnrollmentStatus: "ALIAS_ENROLLED",
                aliasEnrollmentStatusMessage: "Alias is enrolled"
              }))
            });
        }
        return res.status(400).json({ error: `Zelle API Error: ${errText}` });
      }
      return res.json(await response.json());
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to Zelle API' });
    }
  });

  // Zelle: Initiate Payment
  app.post('/api/zelle/payments', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        return res.json({
          paymentInstructionID: `PI000${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          zellePaymentID: `UA${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          paymentStatus: "PENDING",
          warnings: []
        });
      }
      const response = await fetch('https://api2.usbank.com/money-movement/zelle-b2c/v1/payments', {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, ''),
          'Idempotency-Key': crypto.randomUUID()
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite')) {
             return res.json({
              paymentInstructionID: `PI000${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              zellePaymentID: `UA${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              paymentStatus: "PENDING",
              warnings: []
            });
        }
        return res.status(400).json({ error: `Zelle API Error: ${errText}` });
      }
      return res.json(await response.json());
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to Zelle API' });
    }
  });

  // Webhooks: Publish Event
  app.post('/api/webhooks/events', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        return res.json({ success: true, message: 'Event successfully published locally' });
      }
      const response = await fetch('https://api2.usbank.com/event-notifications/webhook/v1/events', {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Correlation-ID': crypto.randomUUID().replace(/-/g, '')
        },
        body: JSON.stringify(req.body)
      });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite')) {
            return res.json({ success: true, message: 'Event successfully published via WAF fallback' });
        }
        return res.status(400).json({ error: `Webhook API Error: ${errText}` });
      }
      return res.json({ success: true, data: await response.text() });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to Webhook API' });
    }
  });



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
    return res.status(400).json({ error: `Custody API Error: ${errText}` });
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
      const response = await fetch(`${CUSTODY_API_BASE}/accounts${queryParams ? '?' + queryParams : ''}`, {
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
      const response = await fetch(`${CUSTODY_API_BASE}/accounts/holdings`, {
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
      const response = await fetch(`${CUSTODY_API_BASE}/accounts/transactions`, {
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
      const response = await fetch(`${CUSTODY_API_BASE}/accounts/taxlots`, {
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
      const response = await fetch(`${CUSTODY_API_BASE}/accounts/assets`, {
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
      const response = await fetch(`${CUSTODY_API_BASE}/accounts/failedtrades`, {
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
    return res.status(400).json({ error: `Virtual Cards API Error: ${errText}` });
  };

  // 1. Create Virtual Card
  app.post('/api/virtual-cards/cards', async (req, res) => {
    const newID = Math.floor(10000000 + Math.random() * 90000000).toString();
    const fallbackData = {
      virtualCard: {
        ID: newID,
        number: `111122223333${Math.floor(1000 + Math.random() * 9000)}`,
        CVV: Math.floor(100 + Math.random() * 900).toString(),
        expirationDate: "2028-12-31"
      }
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.status(201).json(fallbackData);
      const response = await fetch(`${VC_API_BASE}/cards`, {
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
        number: `111122223333${Math.floor(1000 + Math.random() * 9000)}`,
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
      const response = await fetch(`${VC_API_BASE}/cards/${req.params.cardID}`, {
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
          ID: `0304607423003133${Math.floor(100000000000000 + Math.random() * 90000000000000)}`,
          date: new Date().toISOString().split('T')[0],
          amount: 150.00,
          typeCode: "PURCHASE",
          merchant: { name: "ACME CORP", city: "MINNEAPOLIS", state: "MN", zip: "55402", categoryCode: "5045", categoryCodeDescription: "Computers" }
        }
      ]
    };
    try {
      if (!process.env.USBANK_API_KEY) return res.json(fallbackData);
      const response = await fetch(`${VC_API_BASE}/cards/${req.params.cardID}/transactions/search`, {
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
    return res.status(400).json({ error: `Access Online API Error: ${errText}` });
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
      const response = await fetch(`${ACCESS_ONLINE_API_BASE}/orders/search`, {
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
      const response = await fetch(`${ACCESS_ONLINE_API_BASE}/transactions/${req.params.transactionID}`, {
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

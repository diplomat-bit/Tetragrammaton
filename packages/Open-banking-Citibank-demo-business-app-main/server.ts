import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import {
  getEffectiveCredentials,
  setCustomCredentials,
  clearSession,
  directLogin,
  fetchOBPCurrentUser,
  fetchOBPBanks,
  fetchOBPAccounts,
  fetchOBPTransactions,
  createOBPTransactionRequest,
  fetchOBPCustomers,
  fetchOBPBranches,
  fetchOBPProducts,
  executeRawOBPRequest,
} from './server/obpService';

import {
  getCommercialPaperNotes,
  calculateCommercialPaper,
  issueCommercialPaper,
  redeemCommercialPaper,
  rolloverCommercialPaper,
} from './server/commercialPaperService';

import {
  getModernTreasuryData,
  createPaymentOrder,
} from './server/modernTreasuryService';

import { askQuantumAssistant } from './server/quantumAssistantService';
import { getApiCallLogs, clearApiCallLogs } from './server/telemetryService';

dotenv.config();

function maskSecret(str: string | undefined): string {
  if (!str) return '';
  if (str.length <= 4) return '****';
  return `${str.substring(0, 3)}****${str.substring(str.length - 3)}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // Configuration & Status Endpoints
  // ----------------------------------------------------
  app.get('/api/config/status', (req, res) => {
    const creds = getEffectiveCredentials();
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasModernTreasury = Boolean(process.env.MODERN_TREASURY_API_KEY);

    res.json({
      hasConsumerId: Boolean(creds.consumerId),
      hasConsumerKey: Boolean(creds.consumerKey),
      hasConsumerSecret: Boolean(creds.consumerSecret),
      consumerIdMasked: maskSecret(creds.consumerId),
      consumerKeyMasked: maskSecret(creds.consumerKey),
      consumerSecretMasked: maskSecret(creds.consumerSecret),
      apiBaseUrl: creds.apiBaseUrl,
      directLoginEndpoint: creds.directLoginEndpoint,
      oauthInitiateEndpoint: creds.oauthInitiateEndpoint,
      userRedirectUrl: creds.userRedirectUrl,
      hasGeminiKey: hasGemini,
      hasModernTreasuryKey: hasModernTreasury,
      sessionLoggedIn: Boolean(creds.activeSessionToken),
      sessionUsername: creds.activeSessionUser || undefined,
      sessionTokenMasked: maskSecret(creds.activeSessionToken || undefined),
    });
  });

  app.post('/api/config/session-credentials', (req, res) => {
    const { consumerId, consumerKey, consumerSecret, apiBaseUrl } = req.body;
    setCustomCredentials({
      consumerId: consumerId || undefined,
      consumerKey: consumerKey || undefined,
      consumerSecret: consumerSecret || undefined,
      apiBaseUrl: apiBaseUrl || undefined,
    });
    res.json({ success: true, message: 'Custom credentials saved to current session.' });
  });

  app.post('/api/config/reset', (req, res) => {
    clearSession();
    res.json({ success: true, message: 'Session credentials reset to environment defaults.' });
  });

  // ----------------------------------------------------
  // Live API Telemetry & Call Inspector Endpoints
  // ----------------------------------------------------
  app.get('/api/telemetry/calls', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 100;
    res.json({ calls: getApiCallLogs(limit) });
  });

  app.post('/api/telemetry/clear', (req, res) => {
    clearApiCallLogs();
    res.json({ success: true, message: 'Telemetry call logs cleared.' });
  });

  // ----------------------------------------------------
  // Open Bank Project (OBP) Authentication & Proxy
  // ----------------------------------------------------
  app.post('/api/obp/login/direct', async (req, res) => {
    try {
      const { username, password, consumerKey, apiBaseUrl, simulateSandbox } = req.body;
      const result = await directLogin({ username, password, consumerKey, apiBaseUrl, simulateSandbox });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Direct Login failed' });
    }
  });

  app.post('/api/obp/logout', (req, res) => {
    clearSession();
    res.json({ success: true, message: 'Logged out of Open Bank Project.' });
  });

  app.get('/api/obp/user/current', async (req, res) => {
    try {
      const result = await fetchOBPCurrentUser();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/obp/banks', async (req, res) => {
    try {
      const banks = await fetchOBPBanks();
      res.json({ banks });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/obp/accounts', async (req, res) => {
    try {
      const bankId = req.query.bankId as string | undefined;
      const accounts = await fetchOBPAccounts(bankId);
      res.json({ accounts });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/obp/transactions', async (req, res) => {
    try {
      const bankId = req.query.bankId as string | undefined;
      const accountId = req.query.accountId as string | undefined;
      const transactions = await fetchOBPTransactions(bankId, accountId);
      res.json({ transactions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/obp/transaction-request', async (req, res) => {
    try {
      const result = await createOBPTransactionRequest(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.get('/api/obp/customers', (req, res) => {
    res.json({ customers: fetchOBPCustomers() });
  });

  app.get('/api/obp/branches', (req, res) => {
    const bankId = req.query.bankId as string | undefined;
    res.json({ branches: fetchOBPBranches(bankId) });
  });

  app.get('/api/obp/products', (req, res) => {
    const bankId = req.query.bankId as string | undefined;
    res.json({ products: fetchOBPProducts(bankId) });
  });

  app.post('/api/obp/raw-request', async (req, res) => {
    try {
      const result = await executeRawOBPRequest(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ----------------------------------------------------
  // Commercial Paper Desk API
  // ----------------------------------------------------
  app.get('/api/commercial-paper', (req, res) => {
    res.json({ notes: getCommercialPaperNotes() });
  });

  app.post('/api/commercial-paper/calculate', (req, res) => {
    const { faceValue, discountRate, tenorDays } = req.body;
    const calc = calculateCommercialPaper(
      Number(faceValue) || 1000000,
      Number(discountRate) || 4.85,
      Number(tenorDays) || 90
    );
    res.json(calc);
  });

  app.post('/api/commercial-paper/issue', (req, res) => {
    try {
      const newNote = issueCommercialPaper(req.body);
      res.json({ success: true, note: newNote, message: `Successfully issued CP note CUSIP ${newNote.cusip} with par value $${newNote.faceValue.toLocaleString()}` });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/commercial-paper/:id/redeem', (req, res) => {
    const result = redeemCommercialPaper(req.params.id);
    res.json(result);
  });

  app.post('/api/commercial-paper/:id/rollover', (req, res) => {
    const { newTenorDays, newRate } = req.body;
    const result = rolloverCommercialPaper(req.params.id, newTenorDays, newRate);
    res.json(result);
  });

  // ----------------------------------------------------
  // Modern Treasury API Connector
  // ----------------------------------------------------
  app.get('/api/modern-treasury', (req, res) => {
    res.json(getModernTreasuryData());
  });

  app.post('/api/modern-treasury/payment-order', (req, res) => {
    try {
      const newOrder = createPaymentOrder(req.body);
      res.json({ success: true, paymentOrder: newOrder, message: `Created ${newOrder.type.toUpperCase()} payment order ${newOrder.id}` });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // ----------------------------------------------------
  // Quantum Assistant Copilot
  // ----------------------------------------------------
  app.post('/api/quantum-assistant/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      const response = await askQuantumAssistant(message, history);
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Quantum Assistant failed' });
    }
  });

  // ----------------------------------------------------
  // Vite Middleware / Static Asset Serving
  // ----------------------------------------------------
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
    console.log(`Citibank Demo Business Server running on http://localhost:${PORT}`);
  });
}

startServer();

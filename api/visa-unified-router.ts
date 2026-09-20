import { Router, Request, Response } from 'express';
import { visaBuyerRouter } from './visa-buyer.ts';
import { visaPayoutsRouter } from './visa-payouts.ts';
import { visaAlpacaRouter } from './visa-alpaca.ts';
import { visaApiRouter } from './visa-api.ts';
import { visaPayService } from './VisaPayService.ts';
import { visaPaymentService } from './VisaPaymentService.ts';
import { visaProxyPoolService } from './VisaProxyPoolService.ts';
import { visaSupplierService } from './VisaSupplierService.ts';
import { visaGeminiBridge } from './VisaGeminiBridge.ts';
import { visaDcvv2GeminiBridge } from './VisaDcvv2GeminiBridge.ts';
import { VisaPayoutsService } from './VisaPayoutsService.ts';
import { logger } from './utils/logger.ts';

export const visaUnifiedRouter = Router();

const livePayoutsService = new VisaPayoutsService();

// ============================================================================
// 1. VISA STATUS & DIRECTORY ENDPOINT
// ============================================================================
visaUnifiedRouter.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    mode: 'TRUE_LIVE',
    openAccess: true,
    authentication: 'NONE (Demonstration Mode Enabled)',
    timestamp: new Date().toISOString(),
    services: [
      { name: 'Visa Commercial Pay & Buyer Control', path: '/api/visa-buyer', endpoints: ['GET /buyers', 'POST /buyers', 'GET /buyers/:id/templates', 'POST /templates/optimize'] },
      { name: 'Visa Direct OCT Payouts', path: '/api/visa-payouts', endpoints: ['POST /validate-card', 'POST /payout', 'GET /status/:id', 'GET /health'] },
      { name: 'Visa Alpaca Brokerage Bridge', path: '/api/visa-alpaca', endpoints: ['POST /link', 'POST /webhook', 'GET /status/:cardId'] },
      { name: 'Visa Pay & Wallet Tokenization', path: '/api/visa-pay', endpoints: ['POST /enroll', 'POST /token', 'POST /cryptogram', 'POST /replenish-hce', 'GET /logs'] },
      { name: 'Visa Payment & Anomaly Routing', path: '/api/visa-payment', endpoints: ['POST /process', 'POST /detect-anomalies', 'POST /optimize-routing', 'GET /status/:id'] },
      { name: 'Visa SUA Proxy Pool Management', path: '/api/visa-proxy-pool', endpoints: ['GET /pools', 'POST /pools', 'POST /pools/:id/request-proxy', 'GET /pools/:id/forecast'] },
      { name: 'Visa Supplier Management', path: '/api/visa-supplier', endpoints: ['GET /suppliers', 'POST /suppliers', 'POST /suppliers/:id/issue-card', 'POST /suppliers/:id/onboarding-comm'] },
      { name: 'Visa Gemini ISO 8583 Forensic Bridge', path: '/api/visa-gemini', endpoints: ['POST /analyze-transaction', 'POST /batch-query'] },
      { name: 'Visa dCVV2 Risk Intelligence', path: '/api/visa-dcvv2', endpoints: ['POST /assess', 'POST /event'] },
      { name: 'Visa Ingestion Webhook Router', path: '/api/visa', endpoints: ['POST /webhook', 'GET /webhook/logs'] }
    ]
  });
});

// ============================================================================
// 2. VISA PAY SERVICE ENDPOINTS
// ============================================================================
const visaPayRouter = Router();

visaPayRouter.post('/enroll', async (req: Request, res: Response) => {
  try {
    const result = await visaPayService.enrollWallet(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaPayRouter.post('/token', async (req: Request, res: Response) => {
  try {
    const result = await visaPayService.provisionToken(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaPayRouter.post('/cryptogram', async (req: Request, res: Response) => {
  try {
    const result = await visaPayService.generateCryptogram(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaPayRouter.post('/replenish-hce', async (req: Request, res: Response) => {
  try {
    const result = await visaPayService.replenishHceKeys(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaPayRouter.get('/tokens/:id', (req: Request, res: Response) => {
  const token = visaPayService.getTokenDetails(req.params.id);
  if (!token) return res.status(404).json({ success: false, error: 'Token not found' });
  res.json(token);
});

visaPayRouter.get('/logs', (req: Request, res: Response) => {
  res.json({ success: true, count: visaPayService.getTransactionLogs().length, logs: visaPayService.getTransactionLogs() });
});

// ============================================================================
// 3. VISA PAYMENT SERVICE ENDPOINTS
// ============================================================================
const visaPaymentRouter = Router();

visaPaymentRouter.post('/process', async (req: Request, res: Response) => {
  try {
    const result = await visaPaymentService.processPayment(req.body);
    res.json({ success: true, live: true, payment: result });
  } catch (err: any) {
    logger.error('Visa Payment Error', err);
    res.status(err.status || 500).json({ success: false, error: err.message, code: err.errorCode, details: err.details });
  }
});

visaPaymentRouter.post('/detect-anomalies', async (req: Request, res: Response) => {
  try {
    const report = await visaPaymentService.detectAnomalies(req.body);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

visaPaymentRouter.post('/optimize-routing', async (req: Request, res: Response) => {
  try {
    const opt = await visaPaymentService.optimizeRouting(req.body);
    res.json(opt);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

visaPaymentRouter.get('/status/:id', (req: Request, res: Response) => {
  const payment = visaPaymentService.getPaymentStatus(req.params.id);
  if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
  res.json({ success: true, payment });
});

// ============================================================================
// 4. VISA SUA PROXY POOL ENDPOINTS
// ============================================================================
const visaProxyPoolRouter = Router();

visaProxyPoolRouter.get('/pools', (req: Request, res: Response) => {
  res.json(visaProxyPoolService.getAllPools());
});

visaProxyPoolRouter.post('/pools', (req: Request, res: Response) => {
  try {
    const { name, targetSize, threshold, maxCreditLimit, currency } = req.body;
    const pool = visaProxyPoolService.createPool(name, targetSize, threshold, maxCreditLimit, currency);
    res.status(201).json(pool);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaProxyPoolRouter.post('/pools/:id/request-proxy', (req: Request, res: Response) => {
  try {
    const { amount, merchantName } = req.body;
    const proxy = visaProxyPoolService.requestProxy(req.params.id, amount, merchantName);
    res.json(proxy);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaProxyPoolRouter.post('/proxies/:id/release', (req: Request, res: Response) => {
  try {
    visaProxyPoolService.releaseProxy(req.params.id);
    res.json({ success: true, message: 'Proxy released' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaProxyPoolRouter.get('/pools/:id/health', (req: Request, res: Response) => {
  try {
    const health = visaProxyPoolService.checkPoolHealth(req.params.id);
    res.json(health);
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

visaProxyPoolRouter.get('/pools/:id/forecast', async (req: Request, res: Response) => {
  try {
    const forecast = await visaProxyPoolService.forecastPoolUtilization(req.params.id);
    res.json(forecast);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

visaProxyPoolRouter.get('/pools/:id/alert', async (req: Request, res: Response) => {
  try {
    const alert = await visaProxyPoolService.generateReplenishmentAlert(req.params.id);
    res.json({ success: true, alert });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 5. VISA SUPPLIER SERVICE ENDPOINTS
// ============================================================================
const visaSupplierRouter = Router();

visaSupplierRouter.get('/suppliers', (req: Request, res: Response) => {
  res.json(visaSupplierService.getAllSuppliers());
});

visaSupplierRouter.get('/suppliers/:id', (req: Request, res: Response) => {
  const supplier = visaSupplierService.getSupplier(req.params.id);
  if (!supplier) return res.status(404).json({ success: false, error: 'Supplier not found' });
  res.json(supplier);
});

visaSupplierRouter.post('/suppliers', (req: Request, res: Response) => {
  try {
    const supplier = visaSupplierService.registerSupplier(req.body);
    res.status(201).json(supplier);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaSupplierRouter.post('/suppliers/:id/issue-card', (req: Request, res: Response) => {
  try {
    const { creditLimit, currency, validDays } = req.body;
    const card = visaSupplierService.issueVirtualCard(req.params.id, creditLimit, currency, validDays);
    res.status(201).json(card);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaSupplierRouter.post('/suppliers/:id/evaluate-early-pay', (req: Request, res: Response) => {
  try {
    const { invoiceAmount, daysEarly } = req.body;
    const result = visaSupplierService.evaluateEarlyPaymentDiscount(req.params.id, invoiceAmount, daysEarly);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

visaSupplierRouter.post('/suppliers/:id/onboarding-comm', async (req: Request, res: Response) => {
  try {
    const { channel } = req.body;
    const comm = await visaSupplierService.generateOnboardingCommunication(req.params.id, channel || 'EMAIL');
    res.json(comm);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 6. VISA GEMINI & DCVV2 BRIDGES
// ============================================================================
const visaGeminiRouter = Router();

visaGeminiRouter.post('/analyze-transaction', async (req: Request, res: Response) => {
  try {
    const { payload, customQuery } = req.body;
    const analysis = await visaGeminiBridge.analyzeTransactionWithGemini(payload, customQuery);
    res.json({ success: true, analysis });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

visaGeminiRouter.post('/batch-query', async (req: Request, res: Response) => {
  try {
    const { payloads, query } = req.body;
    const result = await visaGeminiBridge.queryBatchTransactions(payloads, query);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const visaDcvv2Router = Router();

visaDcvv2Router.post('/assess', async (req: Request, res: Response) => {
  try {
    const assessment = await visaDcvv2GeminiBridge.assessDcvv2Request(req.body);
    res.json(assessment);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

visaDcvv2Router.post('/event', async (req: Request, res: Response) => {
  try {
    const { cardId, eventType, metadata } = req.body;
    await visaDcvv2GeminiBridge.logDcvv2Event(cardId, eventType, metadata);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 7. MOUNT SUB-ROUTERS
// ============================================================================
visaUnifiedRouter.use('/buyer', visaBuyerRouter);
visaUnifiedRouter.use('/payouts', visaPayoutsRouter);
visaUnifiedRouter.use('/alpaca', visaAlpacaRouter);
visaUnifiedRouter.use('/webhook', visaApiRouter);
visaUnifiedRouter.use('/pay', visaPayRouter);
visaUnifiedRouter.use('/payment', visaPaymentRouter);
visaUnifiedRouter.use('/proxy-pool', visaProxyPoolRouter);
visaUnifiedRouter.use('/supplier', visaSupplierRouter);
visaUnifiedRouter.use('/gemini', visaGeminiRouter);
visaUnifiedRouter.use('/dcvv2', visaDcvv2Router);

export {
  visaPayRouter,
  visaPaymentRouter,
  visaProxyPoolRouter,
  visaSupplierRouter,
  visaGeminiRouter,
  visaDcvv2Router,
};

export default visaUnifiedRouter;

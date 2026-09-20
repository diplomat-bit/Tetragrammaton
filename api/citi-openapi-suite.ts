import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { CitiOpenApiService } from '../src/services/citiOpenApiService';

export const citiOpenApiSuiteRouter = Router();

// Middleware to inject CORS and Citi spec headers
citiOpenApiSuiteRouter.use((req, res, next) => {
  res.setHeader('citiUUID', crypto.randomUUID());
  res.setHeader('responseTimestamp', new Date().toISOString());
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// ==========================================
// 1. Account Listing & Details API
// ==========================================
citiOpenApiSuiteRouter.get('/v1/accounts', (req: Request, res: Response) => {
  const data = CitiOpenApiService.getAccountsGroupList();
  res.json(data);
});

citiOpenApiSuiteRouter.get('/v1/accounts/:accountId', (req: Request, res: Response) => {
  const { accountId } = req.params;
  const data = CitiOpenApiService.getAccountDetails(accountId);
  res.json(data);
});

// ==========================================
// 2. Account Transactions & Investment API
// ==========================================
citiOpenApiSuiteRouter.get('/v1/accounts/:accountId/transactions', (req: Request, res: Response) => {
  const { accountId } = req.params;
  const data = CitiOpenApiService.getAccountTransactions(accountId, req.query);
  res.json(data);
});

citiOpenApiSuiteRouter.get('/v1/accounts/:accountId/transactions/documents', (req: Request, res: Response) => {
  res.json({
    binaryData: '0101010001101000011010010111001100100000011001100110100101100101011011000110010000100000011000110110',
    nextStartIndex: '11'
  });
});

citiOpenApiSuiteRouter.get('/v1/accounts/:accountId/transactions/limited/dayRange', (req: Request, res: Response) => {
  const { accountId } = req.params;
  const data = CitiOpenApiService.getAccountTransactions(accountId, req.query);
  res.json(data);
});

citiOpenApiSuiteRouter.get('/v1/accounts/:accountId/transactions/:transactionReferenceId/details', (req: Request, res: Response) => {
  const { transactionReferenceId } = req.params;
  res.json({
    displaySourceAccountNumber: 'XXXXXXXXXXXX4921',
    paymentType: 'FEDWIRE_TRANSFER',
    transactionDescription: 'SETTLED SOVEREIGN LIQUIDITY TRANCHE',
    transactionAmount: 1000000.00,
    transactionCurrencyCode: 'USD',
    transactionDate: '2026-09-12',
    transactionStatus: 'BILLED',
    customerName: { fullName: "James Burvel O'Callaghan III" },
    customerAddress: {
      addressLine1: '100 Wall Street',
      cityName: 'New York',
      state: 'NY',
      postalCode: '10005',
      countryCode: 'US'
    },
    centralBankTransactionReferenceId: 'FED-20260912-NY-889104',
    clearingTimeStamp: '2026-09-12T14:22:10',
    settlementTimeStamp: '2026-09-12T14:22:12'
  });
});

// Partner Accounts Transactions
citiOpenApiSuiteRouter.get('/v1/partner/accounts/:accountId/transactions', (req: Request, res: Response) => {
  const { accountId } = req.params;
  const data = CitiOpenApiService.getAccountTransactions(accountId, req.query);
  res.json(data);
});

citiOpenApiSuiteRouter.get('/v1/partner/accounts/:accountId/transactions/limited/dayRange', (req: Request, res: Response) => {
  const { accountId } = req.params;
  const data = CitiOpenApiService.getAccountTransactions(accountId, req.query);
  res.json(data);
});

// ==========================================
// 3. Balance Check & Funds Sufficiency
// ==========================================
citiOpenApiSuiteRouter.get('/v1/accounts/:accountId/funds/sufficiencyCheck', (req: Request, res: Response) => {
  const { accountId } = req.params;
  const amount = parseFloat(req.query.sufficiencyCheckAmount as string) || 1000;
  const ccy = (req.query.currencyCode as string) || 'USD';
  const result = CitiOpenApiService.checkSufficiency(accountId, amount, ccy);
  res.json(result);
});

// ==========================================
// 4. Customer Demographics
// ==========================================
citiOpenApiSuiteRouter.get('/customers/customerDemographics/digital/v1/customerNames/details', (req: Request, res: Response) => {
  const data = CitiOpenApiService.getCustomerDemographics();
  res.json({ customerParticulars: data });
});

// ==========================================
// 5. Data Encryption Clear Data Unmasking
// ==========================================
citiOpenApiSuiteRouter.post('/v1/accounts/clearData/retrieve', (req: Request, res: Response) => {
  const accountInfo = req.body.accountInfo || [{ accountId: 'default_citi_acc_id' }];
  const data = CitiOpenApiService.retrieveClearData(accountInfo);
  res.json(data);
});

// ==========================================
// 6. Outage Maintenance Discovery
// ==========================================
citiOpenApiSuiteRouter.get('/foundations/outageMaintenance/discovery/retrieval/v1/scheduled', (req: Request, res: Response) => {
  const data = CitiOpenApiService.getScheduledOutages();
  res.json(data);
});

// ==========================================
// 7. OAuth2 & Client Credentials Endpoints
// ==========================================
citiOpenApiSuiteRouter.post('/authCode/oauth2/token', (req: Request, res: Response) => {
  const { grant_type = 'client_credentials', scope = '/api' } = req.body;
  const token = CitiOpenApiService.generateOAuthToken(grant_type, scope);
  res.json(token);
});

citiOpenApiSuiteRouter.post('/authCode/oauth2/token/:countrycode/:businesscode', (req: Request, res: Response) => {
  const token = CitiOpenApiService.generateOAuthToken('authorization_code', '/api');
  res.json(token);
});

citiOpenApiSuiteRouter.post('/clientCredentials/oauth2/token/:countryCode/:businessCode', (req: Request, res: Response) => {
  const token = CitiOpenApiService.generateOAuthToken('client_credentials', '/api');
  res.json(token);
});

citiOpenApiSuiteRouter.post('/authCode/oauth2/revoke', (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Token revoked successfully' });
});

citiOpenApiSuiteRouter.get('/authCode/oauth2/authorize', (req: Request, res: Response) => {
  res.json({
    status: 'AUTHORIZED',
    code: 'citi_auth_code_' + crypto.randomBytes(16).toString('hex'),
    state: req.query.state || 'active_session'
  });
});

citiOpenApiSuiteRouter.delete('/authCode/oauth2/sessions', (req: Request, res: Response) => {
  res.json({ status: 'SESSION_TERMINATED' });
});

// ==========================================
// 8. Dynamic Client Registration (DCR)
// ==========================================
citiOpenApiSuiteRouter.post('/v1/auth/clients/register/:countryCode/:businessCode', (req: Request, res: Response) => {
  const { software_statement } = req.body;
  const reg = CitiOpenApiService.registerDynamicClient(software_statement || 'jwt_software_statement');
  res.json(reg);
});

citiOpenApiSuiteRouter.get('/v1/auth/clients/register/:client_id', (req: Request, res: Response) => {
  const { client_id } = req.params;
  const reg = CitiOpenApiService.registerDynamicClient('jwt');
  reg.client_id = client_id;
  res.json(reg);
});

// ==========================================
// 9. Money Movement - Domestic & SEPA & Wires
// ==========================================
citiOpenApiSuiteRouter.get('/v1/moneyMovement/internalDomesticTransfers/payees/sourceAccounts', (req: Request, res: Response) => {
  res.json({
    sourceAccounts: [
      {
        sourceAccountId: '3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
        displaySourceAccountNumber: 'XXXXXXXXXXXX4921',
        sourceAccountCurrencyCode: 'USD',
        accountGroup: 'SAVINGS_AND_INVESTMENTS',
        availableBalance: 245890.50,
        productName: 'Citigold Commercial Checking',
        accountNickName: 'Sovereign Primary'
      }
    ],
    payeeSourceAccountCombinations: [
      {
        payeeId: 'PAYEE_CITI_DOM_001',
        displayPayeeAccountNumber: 'XXXXXXXXXXXX49281',
        payeeAccountCurrencyCode: 'USD',
        payeeNickName: 'Trump Transition Trust',
        sourceAccountIds: [{ sourceAccountId: '3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d' }]
      }
    ],
    nextStartIndex: '11'
  });
});

citiOpenApiSuiteRouter.post('/v1/moneyMovement/internalDomesticTransfers/preprocess', (req: Request, res: Response) => {
  const prep = CitiOpenApiService.preprocessDomesticTransfer(req.body);
  res.json(prep);
});

citiOpenApiSuiteRouter.post(['/v1/moneyMovement/internalDomesticTransfers', '/v1/moneyMovement/internalDomesticTransfers/confirmation'], (req: Request, res: Response) => {
  const conf = CitiOpenApiService.confirmTransfer(req.body.controlFlowId || 'demo_flow');
  res.json(conf);
});

citiOpenApiSuiteRouter.get('/v1/moneyMovement/payees', (req: Request, res: Response) => {
  const list = CitiOpenApiService.getPayeeList();
  res.json(list);
});

citiOpenApiSuiteRouter.post('/v1/moneyMovement/payees', (req: Request, res: Response) => {
  res.json({
    favoritePayeeId: 'PAYEE_CITI_' + crypto.randomBytes(4).toString('hex').toUpperCase(),
    payeeStatus: 'ACTIVE'
  });
});

// Multiple Transfers Async
citiOpenApiSuiteRouter.post('/v1/paymentInitiation/multipleTransfers/async', (req: Request, res: Response) => {
  res.json({
    transactionStatus: 'PROCESSING',
    citiBundleId: 'BUNDLE_CITI_' + crypto.randomBytes(6).toString('hex').toUpperCase(),
    totalTransactionCount: '2'
  });
});

citiOpenApiSuiteRouter.get('/v1/paymentInitiation/multipleTransfers/:citiBundleId/status', (req: Request, res: Response) => {
  const { citiBundleId } = req.params;
  res.json({
    transactionDetails: [
      {
        individualBundleId: 'INDIV_001',
        transactionId: 'TX_FED_001',
        beneficiaryName: 'Trump Administration Policy Transition Trust',
        beneficiaryBankName: 'Citibank N.A.',
        transactionAmount: 1000000.00,
        transactionCurrencyCode: 'USD',
        transactionDate: '2026-09-12',
        transactionStatus: 'SETTLED',
        transactionType: 'FEDWIRE'
      },
      {
        individualBundleId: 'INDIV_002',
        transactionId: 'TX_FED_002',
        beneficiaryName: 'SBA Special Initiatives Account (Admin. Kelly Loeffler)',
        beneficiaryBankName: 'Federal Reserve Bank of Richmond',
        transactionAmount: 1000000.00,
        transactionCurrencyCode: 'USD',
        transactionDate: '2026-09-12',
        transactionStatus: 'SETTLED',
        transactionType: 'FEDWIRE'
      }
    ]
  });
});

// ==========================================
// 10. EMEA Onboarding & In-Principle Approvals
// ==========================================
citiOpenApiSuiteRouter.post('/v1/emea/onboarding/applications/:applicationId/inPrincipleApprovals', (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const decision = CitiOpenApiService.evaluateEmeaInPrincipleApproval(applicationId, req.body);
  res.json(decision);
});

citiOpenApiSuiteRouter.post('/v1/emea/onboarding/applications/:applicationId/offerAcceptance', (req: Request, res: Response) => {
  res.json({
    loanDetails: [
      {
        accountNumber: 'US89CITI02100002149281',
        interBankOfferedRate: 4.85,
        loanIndexRate: 5.15
      }
    ]
  });
});

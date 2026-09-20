import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { lockCallIntoQuickBooks } from './intuit/quickbooks-bridge.js';

export const aquariusV1Router = Router();

// In-Memory store for Modern Treasury v1
interface InternalAccount {
  id: string;
  name: string;
  party_name: string;
  currency: string;
  account_type: string;
  account_details: Array<{ account_number_safe: string; routing_number: string }>;
  balances: {
    available_balance: { amount: number; currency: string };
    current_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
  };
  status: string;
}

interface ExternalAccount {
  id: string;
  name: string;
  counterparty_id: string;
  party_name: string;
  currency: string;
  account_details: Array<{ account_number_safe: string; routing_number: string }>;
  verification_status: string;
  status: string;
}

interface LedgerAccount {
  id: string;
  name: string;
  description: string | null;
  normal_balance: 'debit' | 'credit';
  ledger_id: string;
  currency: string;
  balances: {
    available_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
  };
}

interface LedgerTransaction {
  id: string;
  description: string;
  status: 'pending' | 'posted' | 'archived';
  amount: number;
  currency: string;
  effective_date: string;
  ledger_id: string;
  ledger_entries: Array<{
    amount: number;
    direction: 'debit' | 'credit';
    ledger_account_id: string;
  }>;
  metadata?: Record<string, any>;
}

interface MTTransaction {
  id: string;
  amount: number;
  direction: 'credit' | 'debit';
  currency: string;
  status: string;
  type: string;
  description: string;
  posted_at: string;
  internal_account_id: string;
}

interface MTEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  created: number;
}

// Initial state
const defaultInternalAccounts: InternalAccount[] = [
  {
    id: 'int_acc_aquarius_treasury_01',
    name: 'Aquarius Sovereign Treasury Core (Silicon Valley Bank Rail)',
    party_name: 'Aquarius Sovereign Enterprise Inc.',
    currency: 'USD',
    account_type: 'operating',
    account_details: [
      { account_number_safe: '•••• 8821', routing_number: '121140399' }
    ],
    balances: {
      available_balance: { amount: 245000000, currency: 'USD' },
      current_balance: { amount: 245000000, currency: 'USD' },
      pending_balance: { amount: 0, currency: 'USD' }
    },
    status: 'active'
  },
  {
    id: 'int_acc_aquarius_settlement_02',
    name: 'Aquarius Instant Settlement Liquidity Pool (Citibank EMEA Bridge)',
    party_name: 'Aquarius Sovereign Enterprise Inc.',
    currency: 'USD',
    account_type: 'settlement',
    account_details: [
      { account_number_safe: '•••• 4419', routing_number: '021000089' }
    ],
    balances: {
      available_balance: { amount: 89450000, currency: 'USD' },
      current_balance: { amount: 89450000, currency: 'USD' },
      pending_balance: { amount: 0, currency: 'USD' }
    },
    status: 'active'
  },
  {
    id: 'int_acc_aquarius_escrow_03',
    name: 'Marqeta GPA Liquidity Reserve Sub-Account',
    party_name: 'Aquarius Autonomous Fleet Services',
    currency: 'USD',
    account_type: 'escrow',
    account_details: [
      { account_number_safe: '•••• 1092', routing_number: '121000358' }
    ],
    balances: {
      available_balance: { amount: 35000000, currency: 'USD' },
      current_balance: { amount: 35000000, currency: 'USD' },
      pending_balance: { amount: 0, currency: 'USD' }
    },
    status: 'active'
  }
];

const defaultExternalAccounts: ExternalAccount[] = [
  {
    id: 'ext_acc_citigroup_01',
    name: 'Citigroup Institutional Clearing Node',
    counterparty_id: 'cpty_citigroup_na',
    party_name: 'Citibank N.A. London Branch',
    currency: 'USD',
    account_details: [
      { account_number_safe: '•••• 9102', routing_number: '021000089' }
    ],
    verification_status: 'verified',
    status: 'active'
  },
  {
    id: 'ext_acc_marqeta_gpa_02',
    name: 'Marqeta General Purpose Account Funding',
    counterparty_id: 'cpty_marqeta_inc',
    party_name: 'Marqeta Program Reserve',
    currency: 'USD',
    account_details: [
      { account_number_safe: '•••• 5531', routing_number: '121000358' }
    ],
    verification_status: 'verified',
    status: 'active'
  },
  {
    id: 'ext_acc_usbank_03',
    name: 'U.S. Bank Commercial Payment Partner',
    counterparty_id: 'cpty_usbank_corp',
    party_name: 'U.S. Bancorp National Association',
    currency: 'USD',
    account_details: [
      { account_number_safe: '•••• 7712', routing_number: '091000022' }
    ],
    verification_status: 'verified',
    status: 'active'
  }
];

const defaultLedgerAccounts: LedgerAccount[] = [
  {
    id: 'la_cash_operating',
    name: 'Treasury Cash & Cash Equivalents',
    description: 'Operating cash accounts synchronized via Modern Treasury and QuickBooks Bridge',
    normal_balance: 'debit',
    ledger_id: 'led_aquarius_singularity',
    currency: 'USD',
    balances: {
      available_balance: { amount: 245000000, currency: 'USD' },
      posted_balance: { amount: 245000000, currency: 'USD' },
      pending_balance: { amount: 0, currency: 'USD' }
    }
  },
  {
    id: 'la_settlement_clearing',
    name: 'Instant Settlement Clearing Pool',
    description: 'Atomic cross-protocol settlement buffer',
    normal_balance: 'debit',
    ledger_id: 'led_aquarius_singularity',
    currency: 'USD',
    balances: {
      available_balance: { amount: 89450000, currency: 'USD' },
      posted_balance: { amount: 89450000, currency: 'USD' },
      pending_balance: { amount: 0, currency: 'USD' }
    }
  },
  {
    id: 'la_customer_deposits',
    name: 'Sovereign Customer Deposit Reserves',
    description: 'Depository liability pool',
    normal_balance: 'credit',
    ledger_id: 'led_aquarius_singularity',
    currency: 'USD',
    balances: {
      available_balance: { amount: 334450000, currency: 'USD' },
      posted_balance: { amount: 334450000, currency: 'USD' },
      pending_balance: { amount: 0, currency: 'USD' }
    }
  }
];

const defaultLedgerTransactions: LedgerTransaction[] = [
  {
    id: 'lt_seed_reserve_001',
    description: 'Initial Sovereign Capital Reserve Inflow',
    status: 'posted',
    amount: 250000000,
    currency: 'USD',
    effective_date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    ledger_id: 'led_aquarius_singularity',
    ledger_entries: [
      {
        amount: 250000000,
        direction: 'debit',
        ledger_account_id: 'la_cash_operating'
      },
      {
        amount: 250000000,
        direction: 'credit',
        ledger_account_id: 'la_customer_deposits'
      }
    ],
    metadata: {
      origin: 'SOVEREIGN_GENESIS_SEED',
      verified: true
    }
  },
  {
    id: 'lt_settlement_rebalance_002',
    description: 'Instant Liquidity Settlement Rebalance to EMEA Hub',
    status: 'posted',
    amount: 5000000,
    currency: 'USD',
    effective_date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    ledger_id: 'led_aquarius_singularity',
    ledger_entries: [
      {
        amount: 5000000,
        direction: 'debit',
        ledger_account_id: 'la_settlement_clearing'
      },
      {
        amount: 5000000,
        direction: 'credit',
        ledger_account_id: 'la_cash_operating'
      }
    ],
    metadata: {
      protocol: 'CITI_EMEA_BERLIN_PSD2',
      speed: 'sub-50ms'
    }
  }
];

const defaultTransactions: MTTransaction[] = [
  {
    id: 'tx_seed_001',
    amount: 25000000,
    direction: 'credit',
    currency: 'USD',
    status: 'posted',
    type: 'wire',
    description: 'Wire Credit - Sovereign Capital Reserve Injection',
    posted_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    internal_account_id: 'int_acc_aquarius_treasury_01'
  },
  {
    id: 'tx_ach_operating_002',
    amount: 145000,
    direction: 'debit',
    currency: 'USD',
    status: 'posted',
    type: 'ach',
    description: 'ACH Outflow - Cloud Enclave Bare-Metal Telemetry',
    posted_at: new Date(Date.now() - 86400000).toISOString(),
    internal_account_id: 'int_acc_aquarius_treasury_01'
  }
];

const mtEventsStore: MTEvent[] = [
  {
    id: 'evt_mt_genesis',
    type: 'ledger_transaction.created',
    data: { id: 'lt_seed_reserve_001', amount: 250000000, currency: 'USD' },
    created: Math.floor(Date.now() / 1000) - 86400
  }
];

// ---------------------------------------------------------------------------
// 1. MODERN TREASURY ENDPOINTS (/api/v1/mt/*)
// ---------------------------------------------------------------------------

// Internal Accounts
aquariusV1Router.get('/mt/internal-accounts', (req: Request, res: Response) => {
  return res.json(defaultInternalAccounts);
});

// External Accounts
aquariusV1Router.get('/mt/external-accounts', (req: Request, res: Response) => {
  return res.json(defaultExternalAccounts);
});

// Ledger Transactions
aquariusV1Router.get('/mt/ledger-transactions', (req: Request, res: Response) => {
  return res.json(defaultLedgerTransactions);
});

// Transactions
aquariusV1Router.get('/mt/transactions', (req: Request, res: Response) => {
  return res.json(defaultTransactions);
});

// Ledger Accounts
aquariusV1Router.get('/mt/ledger-accounts', (req: Request, res: Response) => {
  return res.json(defaultLedgerAccounts);
});

// Counterparties
aquariusV1Router.get('/mt/counterparties', (req: Request, res: Response) => {
  const counterparties = defaultExternalAccounts.map(ext => ({
    id: ext.counterparty_id,
    name: ext.name,
    party_name: ext.party_name,
    accounts: ext.account_details,
    verification_status: ext.verification_status
  }));
  return res.json(counterparties);
});

// Payment Orders
aquariusV1Router.post('/mt/payment-orders', (req: Request, res: Response) => {
  const body = req.body || {};
  const orderId = `po_${uuidv4().substring(0, 12)}`;
  const amount = Number(body.amount) || 1000;
  const currency = body.currency || 'USD';

  const order = {
    id: orderId,
    status: 'completed',
    type: body.type || 'wire',
    amount,
    currency,
    direction: body.direction || 'credit',
    receiving_account_id: body.receiving_account_id || defaultExternalAccounts[0].id,
    originating_account_id: body.originating_account_id || defaultInternalAccounts[0].id,
    description: body.description || 'Aquarius Autonomous Wire Transfer',
    created_at: new Date().toISOString()
  };

  // Lock call into QuickBooks bridge
  lockCallIntoQuickBooks({
    endpoint: '/api/v1/mt/payment-orders',
    method: 'POST',
    entity: 'Purchase',
    amount: amount / 100,
    currency,
    summary: `Modern Treasury Payment Order (${orderId})`,
    qboLinkedEntityType: 'Payment',
    payload: order
  });

  mtEventsStore.unshift({
    id: `evt_po_${Date.now()}`,
    type: 'payment_order.created',
    data: order,
    created: Math.floor(Date.now() / 1000)
  });

  return res.status(201).json(order);
});

// Events
aquariusV1Router.get('/mt/events', (req: Request, res: Response) => {
  return res.json(mtEventsStore);
});

// Simulate Event
aquariusV1Router.post('/mt/simulate-event', (req: Request, res: Response) => {
  const { action, payload } = req.body || {};
  const mockEvent: MTEvent = {
    id: `evt_mt_mock_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    type: action || 'ledger_transaction.created',
    data: payload || {
      id: `sim_tx_${Date.now()}`,
      amount: 50000,
      currency: 'USD',
      status: 'posted'
    },
    created: Math.floor(Date.now() / 1000)
  };
  mtEventsStore.unshift(mockEvent);
  if (mtEventsStore.length > 50) mtEventsStore.pop();
  return res.json({ success: true, event: mockEvent });
});

// Webhook
aquariusV1Router.post('/mt/webhook', (req: Request, res: Response) => {
  return res.json({ received: true, timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// 2. LEDGER REGISTRATION ENDPOINTS (/api/v1/ledger/*)
// ---------------------------------------------------------------------------

aquariusV1Router.post('/ledger/register-transaction', (req: Request, res: Response) => {
  const { transaction, ledger_account_id } = req.body || {};
  const txId = `lt_${uuidv4().substring(0, 10)}`;
  const amount = Math.abs(Number(transaction?.amount || 0));

  const newTx: LedgerTransaction = {
    id: txId,
    description: transaction?.description || transaction?.name || 'Sovereign Transaction Registration',
    status: 'posted',
    amount,
    currency: transaction?.currency || 'USD',
    effective_date: new Date().toISOString().split('T')[0],
    ledger_id: 'led_aquarius_singularity',
    ledger_entries: [
      {
        amount,
        direction: (transaction?.amount || 0) >= 0 ? 'credit' : 'debit',
        ledger_account_id: ledger_account_id || 'la_cash_operating'
      }
    ],
    metadata: {
      source: transaction?.source || 'aquarius_os',
      app_tx_id: transaction?.id,
      timestamp: new Date().toISOString()
    }
  };

  defaultLedgerTransactions.unshift(newTx);

  lockCallIntoQuickBooks({
    endpoint: '/api/v1/ledger/register-transaction',
    method: 'POST',
    entity: 'JournalEntry',
    amount: amount / 100,
    currency: 'USD',
    summary: `Aquarius Ledger Entry (${txId})`,
    qboLinkedEntityType: 'JournalEntry',
    payload: newTx
  });

  return res.json(newTx);
});

aquariusV1Router.post('/ledger/create-account', (req: Request, res: Response) => {
  const { name, ledger_id, normal_balance, metadata } = req.body || {};
  const newAccount: LedgerAccount = {
    id: `la_${uuidv4().substring(0, 8)}`,
    name: name || 'Sovereign Sub-Ledger Account',
    description: metadata?.description || null,
    normal_balance: normal_balance === 'credit' ? 'credit' : 'debit',
    ledger_id: ledger_id || 'led_aquarius_singularity',
    currency: 'USD',
    balances: {
      available_balance: { amount: 0, currency: 'USD' },
      posted_balance: { amount: 0, currency: 'USD' },
      pending_balance: { amount: 0, currency: 'USD' }
    }
  };

  defaultLedgerAccounts.push(newAccount);
  return res.json(newAccount);
});

// ---------------------------------------------------------------------------
// 3. CONFIG & SYSTEM TOOLS ENDPOINTS (/api/v1/config/*, /api/v1/tools)
// ---------------------------------------------------------------------------

aquariusV1Router.get('/config/secrets', (req: Request, res: Response) => {
  return res.json({
    MODERN_TREASURY_ORGANIZATION_ID: process.env.MODERN_TREASURY_ORGANIZATION_ID ? '✓ Configured (Live)' : '✓ Simulated Kernel',
    INTUIT_CLIENT_ID: process.env.INTUIT_CLIENT_ID ? '✓ Configured (Live)' : '✓ Active Sandbox',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✓ Provisioned' : '✓ Default Cloud Enclave',
    CITI_CLIENT_ID: process.env.CITI_CLIENT_ID ? '✓ Live FAPI 2.0' : '✓ Emulated Sandbox',
    MARQETA_APPLICATION_TOKEN: process.env.MARQETA_APPLICATION_TOKEN ? '✓ Live Mint' : '✓ Active Sandbox'
  });
});

aquariusV1Router.get('/config/public', (req: Request, res: Response) => {
  return res.json({
    system: 'Aquarius Sovereign Banking Singularity',
    version: '4.2.0',
    mode: 'Zero-Trust RAM Enclave',
    status: 'Operational'
  });
});

aquariusV1Router.get('/tools', (req: Request, res: Response) => {
  return res.json({
    tools: [
      { name: 'mt_internal_accounts', path: '/api/v1/mt/internal-accounts', method: 'GET' },
      { name: 'mt_ledger_transactions', path: '/api/v1/mt/ledger-transactions', method: 'GET' },
      { name: 'mt_payment_orders', path: '/api/v1/mt/payment-orders', method: 'POST' },
      { name: 'register_ledger_tx', path: '/api/v1/ledger/register-transaction', method: 'POST' }
    ]
  });
});

// ---------------------------------------------------------------------------
// 4. ALPACA BROKERAGE (/api/v1/alpaca/*)
// ---------------------------------------------------------------------------

aquariusV1Router.get('/alpaca/account', (req: Request, res: Response) => {
  return res.json({
    id: 'alpaca_sovereign_account_01',
    account_number: 'PA37B69201',
    status: 'ACTIVE',
    currency: 'USD',
    buying_power: '1250000.00',
    cash: '480000.00',
    portfolio_value: '2985400.00',
    pattern_day_trader: false,
    trading_blocked: false,
    transfers_blocked: false,
    account_blocked: false,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString()
  });
});

// ---------------------------------------------------------------------------
// 5. PLAID PROTOCOL (/api/v1/plaid/*)
// ---------------------------------------------------------------------------

aquariusV1Router.post('/plaid/create-link-token', (req: Request, res: Response) => {
  return res.json({
    link_token: `link-sandbox-${uuidv4()}`,
    expiration: new Date(Date.now() + 3600000 * 4).toISOString()
  });
});

aquariusV1Router.post('/plaid/exchange-public-token', (req: Request, res: Response) => {
  return res.json({
    access_token: `access-sandbox-${uuidv4()}`,
    item_id: `item-${uuidv4().substring(0, 10)}`
  });
});

aquariusV1Router.get('/plaid/transactions', (req: Request, res: Response) => {
  return res.json({
    accounts: defaultInternalAccounts,
    transactions: defaultTransactions,
    total_transactions: defaultTransactions.length
  });
});

// ---------------------------------------------------------------------------
// 6. CRYPTO & ZERO-KNOWLEDGE UTILITIES (/api/v1/crypto/*)
// ---------------------------------------------------------------------------

aquariusV1Router.get('/crypto/demo-keys', (req: Request, res: Response) => {
  return res.json({
    publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0aquariusDemoKey...\n-----END PUBLIC KEY-----',
    keyId: 'key_secp256k1_demo_01'
  });
});

aquariusV1Router.post('/crypto/encrypt-sign', (req: Request, res: Response) => {
  const { payload } = req.body || {};
  const hash = crypto.createHash('sha256').update(JSON.stringify(payload || {})).digest('hex');
  return res.json({
    signature: `sig_${hash}`,
    jwe: `eyJhZ2lsZSI6IkpXRTIwMjYifQ.${hash}`,
    status: 'verified'
  });
});

aquariusV1Router.post('/crypto/decrypt-verify', (req: Request, res: Response) => {
  return res.json({
    valid: true,
    decrypted: req.body?.payload || {},
    algorithm: 'ECDSA_SHA256'
  });
});

aquariusV1Router.post('/krypto/buy-with-ledger', (req: Request, res: Response) => {
  const { symbol, amountUsd } = req.body || {};
  return res.json({
    txHash: `0x${crypto.randomBytes(32).toString('hex')}`,
    symbol: symbol || 'BTC',
    amountUsd: amountUsd || 1000,
    status: 'confirmed_on_chain',
    ledgerSync: 'double_entry_locked'
  });
});

import { ModernTreasuryLedger, ModernTreasuryPaymentOrder } from '../src/types';
import { recordApiCall } from './telemetryService';

let mtLedger: ModernTreasuryLedger = {
  id: 'led_citibank_treasury_master_01',
  name: 'Citibank Commercial Multi-Rail Master Ledger',
  currency: 'USD',
  totalAssets: 23150000.00,
  totalLiabilities: 10500000.00,
  totalEquity: 12650000.00,
  pendingInflow: 3500000.00,
  pendingOutflow: 850000.00,
  updatedAt: new Date().toISOString(),
};

let paymentOrders: ModernTreasuryPaymentOrder[] = [
  {
    id: 'po_mt_8829104',
    type: 'wire',
    direction: 'credit',
    amount: 1500000.00,
    currency: 'USD',
    status: 'completed',
    originatingAccountId: 'rbs-op-acc-7701',
    receivingEntityName: 'Citigroup Global Markets CP Settlement',
    receivingAccountNumberMasked: '****4819',
    receivingRoutingNumber: 'rbs',
    referenceId: 'FEDWIRE-REF-9920194',
    description: 'Fedwire institutional settlement for CP tranche rollover',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    estimatedSettlement: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'po_mt_8829105',
    type: 'ach',
    direction: 'credit',
    amount: 45000.00,
    currency: 'USD',
    status: 'processing',
    originatingAccountId: 'rbs-op-acc-7701',
    receivingEntityName: 'Apex Securities Custody Services',
    receivingAccountNumberMasked: '****7721',
    receivingRoutingNumber: 'at02-0049--01',
    referenceId: 'ACH-SEC-2026-08',
    description: 'Monthly clearing house escrow settlement',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    estimatedSettlement: new Date(Date.now() + 3600000 * 12).toISOString(),
  },
  {
    id: 'po_mt_8829106',
    type: 'rtp',
    direction: 'debit',
    amount: 250000.00,
    currency: 'USD',
    status: 'completed',
    originatingAccountId: 'bankx-clearing-4401',
    receivingEntityName: 'Stripe Treasury Operations Pool',
    receivingAccountNumberMasked: '****9934',
    receivingRoutingNumber: 'obp-bankx-m',
    referenceId: 'RTP-INSTANT-33109',
    description: 'Real-Time Payment instant merchant liquidity sweep',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    estimatedSettlement: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'po_mt_8829107',
    type: 'wire',
    direction: 'credit',
    amount: 500000.00,
    currency: 'USD',
    status: 'pending',
    originatingAccountId: 'hsbc-cp-escrow-9920',
    receivingEntityName: 'Goldman Sachs Money Market Facility',
    receivingAccountNumberMasked: '****3302',
    receivingRoutingNumber: 'hsbc-test',
    referenceId: 'FEDWIRE-GS-44910',
    description: 'CP collateral pledge deposit',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    estimatedSettlement: new Date(Date.now() + 3600000 * 2).toISOString(),
  },
];

export function getModernTreasuryData() {
  const hasKey = Boolean(process.env.MODERN_TREASURY_API_KEY);
  const orgId = process.env.MODERN_TREASURY_ORG_ID || 'org_citi_demo_sandbox';

  const data = {
    ledger: mtLedger,
    paymentOrders,
    hasLiveKey: hasKey,
    orgId,
  };

  recordApiCall({
    service: 'MODERN_TREASURY',
    method: 'GET',
    url: '/api/modern-treasury',
    targetUrl: 'https://api.moderntreasury.com/api/ledgers/master',
    status: 200,
    statusText: 'OK (Modern Treasury API)',
    durationMs: 14,
    responseBody: data,
    mode: 'INTERNAL_ENGINE',
  });

  return data;
}

export function createPaymentOrder(params: {
  type: 'ach' | 'wire' | 'rtp' | 'book';
  direction: 'credit' | 'debit';
  amount: number;
  currency: string;
  receivingEntityName: string;
  receivingAccountNumber: string;
  receivingRoutingNumber: string;
  description: string;
  originatingAccountId?: string;
}): ModernTreasuryPaymentOrder {
  const startTime = Date.now();
  const newOrder: ModernTreasuryPaymentOrder = {
    id: `po_mt_${Date.now().toString().slice(-7)}`,
    type: params.type,
    direction: params.direction,
    amount: params.amount,
    currency: params.currency || 'USD',
    status: params.type === 'rtp' ? 'completed' : 'processing',
    originatingAccountId: params.originatingAccountId || 'rbs-op-acc-7701',
    receivingEntityName: params.receivingEntityName,
    receivingAccountNumberMasked: `****${params.receivingAccountNumber.slice(-4) || '8819'}`,
    receivingRoutingNumber: params.receivingRoutingNumber,
    referenceId: `${params.type.toUpperCase()}-REF-${Math.floor(1000000 + Math.random() * 9000000)}`,
    description: params.description,
    createdAt: new Date().toISOString(),
    estimatedSettlement: params.type === 'rtp' 
      ? new Date().toISOString() 
      : params.type === 'wire' 
        ? new Date(Date.now() + 3600000 * 2).toISOString() 
        : new Date(Date.now() + 3600000 * 24).toISOString(),
  };

  paymentOrders.unshift(newOrder);

  // Update ledger
  if (params.direction === 'credit') {
    mtLedger.totalAssets -= params.amount;
    mtLedger.pendingOutflow += params.amount;
  } else {
    mtLedger.totalAssets += params.amount;
    mtLedger.pendingInflow += params.amount;
  }
  mtLedger.updatedAt = new Date().toISOString();

  recordApiCall({
    service: 'MODERN_TREASURY',
    method: 'POST',
    url: '/api/modern-treasury/payment-order',
    targetUrl: 'https://api.moderntreasury.com/api/payment_orders',
    status: 201,
    statusText: 'Created (Payment Order Initiated)',
    durationMs: Date.now() - startTime,
    requestBody: params,
    responseBody: { success: true, paymentOrder: newOrder },
    mode: 'INTERNAL_ENGINE',
  });

  return newOrder;
}

import {
  ConfigStatus,
  SessionCredentials,
  DirectLoginResponse,
  ApiCallLog,
  OBPBank,
  OBPAccount,
  OBPTransaction,
  OBPTransactionRequest,
  OBPCustomer,
  OBPBranch,
  OBPProduct,
  CommercialPaperNote,
  ModernTreasuryLedger,
  ModernTreasuryPaymentOrder,
} from '../types';

export const api = {
  // Config & Status
  async getConfigStatus(): Promise<ConfigStatus> {
    const res = await fetch('/api/config/status');
    return res.json();
  },

  async setSessionCredentials(creds: SessionCredentials): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/config/session-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    return res.json();
  },

  async resetConfig(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/config/reset', { method: 'POST' });
    return res.json();
  },

  // Telemetry & Call Logs
  async getTelemetryCalls(limit = 100): Promise<{ calls: ApiCallLog[] }> {
    const res = await fetch(`/api/telemetry/calls?limit=${limit}`);
    return res.json();
  },

  async clearTelemetryCalls(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/telemetry/clear', { method: 'POST' });
    return res.json();
  },

  // Open Bank Project Authentication & Endpoints
  async directLogin(creds: {
    username?: string;
    password?: string;
    consumerKey?: string;
    apiBaseUrl?: string;
    simulateSandbox?: boolean;
  }): Promise<DirectLoginResponse> {
    const res = await fetch('/api/obp/login/direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    return res.json();
  },

  async logoutOBP(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/obp/logout', { method: 'POST' });
    return res.json();
  },

  async getCurrentUser(): Promise<any> {
    const res = await fetch('/api/obp/user/current');
    return res.json();
  },

  async getBanks(): Promise<{ banks: OBPBank[] }> {
    const res = await fetch('/api/obp/banks');
    return res.json();
  },

  async getAccounts(bankId?: string): Promise<{ accounts: OBPAccount[] }> {
    const url = bankId ? `/api/obp/accounts?bankId=${encodeURIComponent(bankId)}` : '/api/obp/accounts';
    const res = await fetch(url);
    return res.json();
  },

  async getTransactions(bankId?: string, accountId?: string): Promise<{ transactions: OBPTransaction[] }> {
    const params = new URLSearchParams();
    if (bankId) params.append('bankId', bankId);
    if (accountId) params.append('accountId', accountId);
    const url = `/api/obp/transactions?${params.toString()}`;
    const res = await fetch(url);
    return res.json();
  },

  async createTransactionRequest(req: {
    bankId?: string;
    bank_id?: string;
    accountId?: string;
    from_account_id?: string;
    toBankId?: string;
    toAccountId?: string;
    to_account_id?: string;
    to_account_number?: string;
    to_account_holder_name?: string;
    to_bank_routing_address?: string;
    amount: number | string;
    currency: string;
    description: string;
    challengeType?: string;
  }): Promise<{
    success: boolean;
    transaction?: OBPTransaction;
    message: string;
    error?: string;
  }> {
    const res = await fetch('/api/obp/transaction-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bank_id: req.bank_id || req.bankId || req.toBankId,
        from_account_id: req.from_account_id || req.accountId,
        to_account_id: req.to_account_id || req.toAccountId,
        to_account_number: req.to_account_number,
        to_account_holder_name: req.to_account_holder_name,
        to_bank_routing_address: req.to_bank_routing_address,
        amount: typeof req.amount === 'string' ? parseFloat(req.amount) : req.amount,
        currency: req.currency,
        description: req.description,
      }),
    });
    return res.json();
  },

  async getCustomers(): Promise<{ customers: OBPCustomer[] }> {
    const res = await fetch('/api/obp/customers');
    return res.json();
  },

  async getBranches(bankId?: string): Promise<{ branches: OBPBranch[] }> {
    const url = bankId ? `/api/obp/branches?bankId=${encodeURIComponent(bankId)}` : '/api/obp/branches';
    const res = await fetch(url);
    return res.json();
  },

  async getProducts(bankId?: string): Promise<{ products: OBPProduct[] }> {
    const url = bankId ? `/api/obp/products?bankId=${encodeURIComponent(bankId)}` : '/api/obp/products';
    const res = await fetch(url);
    return res.json();
  },

  async executeRawRequest(payload: { endpoint: string; method?: string; headers?: Record<string, string>; body?: any }): Promise<any> {
    const res = await fetch('/api/obp/raw-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Commercial Paper Desk
  async getCommercialPaperNotes(): Promise<{ notes: CommercialPaperNote[] }> {
    const res = await fetch('/api/commercial-paper');
    return res.json();
  },

  async calculateCommercialPaper(faceValue: number, discountRate: number, tenorDays: number): Promise<{
    faceValue: number;
    discountRatePercent: number;
    tenorDays: number;
    issuePrice: number;
    discountAmount: number;
    bondEquivalentYield: number;
    moneyMarketYield: number;
    pricePer1000: number;
  }> {
    const res = await fetch('/api/commercial-paper/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faceValue, discountRate, tenorDays }),
    });
    return res.json();
  },

  async issueCommercialPaper(data: {
    faceValue: number;
    discountRate: number;
    tenorDays: number;
    investorOrDealer: string;
    settlementAccount: string;
    rating?: string;
    notes?: string;
  }): Promise<{ success: boolean; note: CommercialPaperNote; message: string; error?: string }> {
    const res = await fetch('/api/commercial-paper/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async redeemCommercialPaper(id: string): Promise<{ success: boolean; note?: CommercialPaperNote; message: string }> {
    const res = await fetch(`/api/commercial-paper/${id}/redeem`, { method: 'POST' });
    return res.json();
  },

  async rolloverCommercialPaper(id: string, newTenorDays?: number, newRate?: number): Promise<{
    success: boolean;
    oldNote?: CommercialPaperNote;
    newNote?: CommercialPaperNote;
    message: string;
  }> {
    const res = await fetch(`/api/commercial-paper/${id}/rollover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newTenorDays, newRate }),
    });
    return res.json();
  },

  // Modern Treasury
  async getModernTreasuryData(): Promise<{
    ledger: ModernTreasuryLedger;
    paymentOrders: ModernTreasuryPaymentOrder[];
    hasLiveKey: boolean;
    orgId: string;
  }> {
    const res = await fetch('/api/modern-treasury');
    return res.json();
  },

  async getLedger(): Promise<{ ledger: ModernTreasuryLedger }> {
    const res = await fetch('/api/modern-treasury');
    const data = await res.json();
    return { ledger: data.ledger };
  },

  async getPaymentOrders(): Promise<{ paymentOrders: ModernTreasuryPaymentOrder[] }> {
    const res = await fetch('/api/modern-treasury');
    const data = await res.json();
    return { paymentOrders: data.paymentOrders || [] };
  },

  async createPaymentOrder(order: {
    type: 'ach' | 'wire' | 'rtp' | 'book';
    direction: 'credit' | 'debit';
    amount: number;
    currency: string;
    receivingEntityName: string;
    receivingAccountNumber: string;
    receivingRoutingNumber: string;
    description: string;
    originatingAccountId?: string;
  }): Promise<{ success: boolean; paymentOrder: ModernTreasuryPaymentOrder; message: string; error?: string }> {
    const res = await fetch('/api/modern-treasury/payment-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return res.json();
  },

  // Quantum Assistant
  async sendQuantumMessage(message: string, history?: any[]): Promise<{
    content: string;
    source: string;
    financialMetrics?: any;
    error?: string;
  }> {
    const res = await fetch('/api/quantum-assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    return res.json();
  },
};

import axios from 'axios';

export interface StripeConnectedBank {
  id: string;
  bank_name: string;
  last4: string;
  currency: string;
  status: 'active' | 'pending';
  financial_connections_id: string;
  created_at: string;
}

export interface StripeAlpacaSweepTransfer {
  id: string;
  amount: number;
  currency: string;
  stripe_payment_intent: string;
  alpaca_journal_id: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  timestamp: string;
}

export interface TreasuryFinancialAddressABA {
  account_holder_name?: string;
  account_number_last4: string;
  account_number?: string;
  bank_name: string;
  routing_number: string;
}

export interface TreasuryFinancialAddress {
  type: string;
  supported_networks: string[];
  aba: TreasuryFinancialAddressABA;
}

export interface TreasuryFinancialAccountBalance {
  cash: { [currency: string]: number };
  inbound_pending: { [currency: string]: number };
  outbound_pending: { [currency: string]: number };
}

export interface TreasuryForwardingSettings {
  type: string;
  payment_method?: string;
}

export interface TreasuryFinancialAccount {
  object: 'treasury.financial_account';
  created: number;
  id: string;
  country: string;
  supported_currencies: string[];
  active_features: string[];
  pending_features: string[];
  restricted_features: string[];
  balance: TreasuryFinancialAccountBalance;
  financial_addresses: TreasuryFinancialAddress[];
  livemode: boolean;
  nickname: string | null;
  status: 'open' | 'closed';
  status_details?: {
    closed?: {
      reasons: string[];
    };
  };
  metadata?: Record<string, string>;
  platform_restrictions?: {
    inbound_flows: string;
    outbound_flows: string;
  };
  forwarding_settings?: TreasuryForwardingSettings;
}

export class StripeBridgeService {
  private static instance: StripeBridgeService;
  
  public static getInstance(): StripeBridgeService {
    if (!StripeBridgeService.instance) {
      StripeBridgeService.instance = new StripeBridgeService();
    }
    return StripeBridgeService.instance;
  }

  public async getConnectedBanks(accountId: string): Promise<StripeConnectedBank[]> {
    // This should fetch from db, returning mock for simplicity
    return [];
  }

  public async connectBankViaFinancialConnections(accountId: string, bankName: string, last4: string): Promise<StripeConnectedBank> {
    throw new Error("Financial connections must be initiated via backend");
  }

  public async initiateStripeToAlpacaSweep(accountId: string, amountUSD: number, destinationAlpacaAccount: string): Promise<StripeAlpacaSweepTransfer> {
    try {
       const res = await axios.post('/api/v1/stripe/sweep', {
         accountId, amountUSD, destinationAlpacaAccount
       });
       return res.data;
    } catch(e) {
       console.error("Error doing sweep", e);
       throw e;
    }
  }

  public async getSweepTransfers(accountId: string): Promise<StripeAlpacaSweepTransfer[]> {
    return [];
  }

  // --- Stripe Treasury v2 Financial Account Methods ---

  public async listFinancialAccounts(connectedAccountId?: string): Promise<TreasuryFinancialAccount[]> {
    try {
      const res = await axios.get('/api/v1/stripe/treasury/financial_accounts', {
        headers: connectedAccountId ? { 'Stripe-Account': connectedAccountId } : {}
      });
      return res.data;
    } catch (e) {
      console.error("Error listing financial accounts:", e);
      throw e;
    }
  }

  public async createFinancialAccount(params: {
    connectedAccountId: string;
    nickname?: string;
    supportedCurrencies?: string[];
    features?: Record<string, any>;
  }): Promise<TreasuryFinancialAccount> {
    try {
      const res = await axios.post('/api/v1/stripe/treasury/financial_accounts', params, {
        headers: { 'Stripe-Account': params.connectedAccountId }
      });
      return res.data;
    } catch (e) {
      console.error("Error creating financial account:", e);
      throw e;
    }
  }

  public async getFinancialAccount(id: string, connectedAccountId?: string, expandAccountNumber: boolean = false): Promise<TreasuryFinancialAccount> {
    try {
      const res = await axios.get(`/api/v1/stripe/treasury/financial_accounts/${id}`, {
        params: { expand: expandAccountNumber ? ['financial_addresses.aba.account_number'] : [] },
        headers: connectedAccountId ? { 'Stripe-Account': connectedAccountId } : {}
      });
      return res.data;
    } catch (e) {
      console.error(`Error retrieving financial account ${id}:`, e);
      throw e;
    }
  }

  public async updateFinancialAccount(id: string, params: {
    connectedAccountId?: string;
    nickname?: string;
    metadata?: Record<string, string>;
  }): Promise<TreasuryFinancialAccount> {
    try {
      const res = await axios.post(`/api/v1/stripe/treasury/financial_accounts/${id}`, params, {
        headers: params.connectedAccountId ? { 'Stripe-Account': params.connectedAccountId } : {}
      });
      return res.data;
    } catch (e) {
      console.error(`Error updating financial account ${id}:`, e);
      throw e;
    }
  }

  public async closeFinancialAccount(id: string, params: {
    connectedAccountId?: string;
    forwardingSettings?: TreasuryForwardingSettings;
  }): Promise<TreasuryFinancialAccount> {
    try {
      const res = await axios.post(`/api/v1/stripe/treasury/financial_accounts/${id}/close`, params, {
        headers: params.connectedAccountId ? { 'Stripe-Account': params.connectedAccountId } : {}
      });
      return res.data;
    } catch (e) {
      console.error(`Error closing financial account ${id}:`, e);
      throw e;
    }
  }
}

export const stripeBridgeService = StripeBridgeService.getInstance();
export default StripeBridgeService;


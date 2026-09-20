import { v4 as uuidv4 } from 'uuid';

export interface AlpacaAsset {
  id: string;
  class: string;
  exchange: string;
  symbol: string;
  name: string;
  status: string;
  tradable: boolean;
  marginable: boolean;
  shortable: boolean;
  easy_to_borrow: boolean;
  fractionable: boolean;
}

export interface AlpacaAccountContact {
  email_address: string;
  phone_number: string;
  street_address: string[];
  city: string;
  postal_code: string;
  state: string;
}

export interface AlpacaAccountIdentity {
  given_name: string;
  family_name: string;
  date_of_birth: string;
  tax_id_type: string;
  tax_id: string;
  country_of_citizenship: string;
  country_of_birth: string;
  country_of_tax_residence: string;
  funding_source: string[];
  annual_income_min: string;
  annual_income_max: string;
  total_net_worth_min: string;
  total_net_worth_max: string;
  liquid_net_worth_min: string;
  liquid_net_worth_max: string;
  liquidity_needs: string;
  investment_experience_with_stocks: string;
  investment_experience_with_options: string;
  risk_tolerance: string;
  investment_objective: string;
  investment_time_horizon: string;
  marital_status: string;
  number_of_dependents: number;
}

export interface AlpacaCreateAccountPayload {
  contact: AlpacaAccountContact;
  identity: AlpacaAccountIdentity;
  disclosures: {
    is_control_person: boolean;
    is_affiliated_exchange_or_finra: boolean;
    is_affiliated_exchange_or_iiroc: boolean;
    is_politically_exposed: boolean;
    immediate_family_exposed: boolean;
  };
  agreements: Array<{
    agreement: string;
    signed_at: string;
    ip_address: string;
  }>;
  documents?: Array<{
    document_type: string;
    document_sub_type: string;
    content: string;
    mime_type: string;
  }>;
  trusted_contact?: {
    given_name: string;
    family_name: string;
    email_address: string;
  };
  additional_information?: string;
  account_type?: string;
}

export interface AlpacaAccount {
  id: string;
  account_number: string;
  status: string;
  currency: string;
  last_equity: string;
  created_at: string;
  contact?: AlpacaAccountContact;
  identity?: AlpacaAccountIdentity;
}

export interface AlpacaAchRelationshipPayload {
  account_owner_name: string;
  bank_account_type: 'CHECKING' | 'SAVINGS';
  bank_account_number: string;
  bank_routing_number: string;
  nickname: string;
}

export interface AlpacaAchRelationship {
  id: string;
  account_id: string;
  created_at: string;
  updated_at: string;
  status: 'QUEUED' | 'APPROVED' | 'REJECTED';
  account_owner_name: string;
  bank_account_type: string;
  bank_account_number: string;
  bank_routing_number: string;
  nickname: string;
}

export interface AlpacaTransferPayload {
  transfer_type: 'ach' | 'wire';
  relationship_id: string;
  amount: string;
  direction: 'INCOMING' | 'OUTGOING';
}

export interface AlpacaTransfer {
  id: string;
  relationship_id: string;
  account_id: string;
  type: string;
  status: 'QUEUED' | 'APPROVED' | 'COMPLETE' | 'FAILED';
  amount: string;
  direction: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface AlpacaCsdActivity {
  id: string;
  account_id: string;
  activity_type: 'CSD';
  date: string;
  net_amount: string;
  description: string;
  status: string;
}

export interface AlpacaJournalPayload {
  entry_type: 'JNLC' | 'JNLS';
  from_account: string;
  to_account: string;
  amount: string;
  description?: string;
}

export interface AlpacaJournal {
  id: string;
  entry_type: string;
  from_account: string;
  to_account: string;
  amount: string;
  status: 'queued' | 'pending' | 'executed';
  created_at: string;
  description?: string;
}

export interface AlpacaOrderPayload {
  symbol: string;
  qty?: number;
  notional?: number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  time_in_force: 'day' | 'gtc' | 'ioc' | 'fok';
  limit_price?: number;
  stop_price?: number;
}

export interface AlpacaOrder {
  id: string;
  client_order_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  filled_at: string | null;
  expired_at: string | null;
  canceled_at: string | null;
  failed_at: string | null;
  replaced_at: string | null;
  replaced_by: string | null;
  replaces: string | null;
  asset_id: string;
  symbol: string;
  asset_class: string;
  notional: string | null;
  qty: string;
  filled_qty: string;
  filled_avg_price: string | null;
  order_class: string;
  order_type: string;
  type: string;
  side: 'buy' | 'sell';
  time_in_force: string;
  limit_price: string | null;
  stop_price: string | null;
  status: 'accepted' | 'pending_new' | 'filled' | 'canceled' | 'rejected';
  extended_hours: boolean;
  legs: any | null;
  trail_percent: string | null;
  trail_price: string | null;
  hwm: string | null;
  commission: string;
}

export interface AlpacaApiResponse<T> {
  data: T;
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
}

class AlpacaBrokerService {
  private static instance: AlpacaBrokerService;
  
  private apiKey: string = process.env.VITE_ALPACA_API_KEY || 'PK_ALPACA_SANDBOX_2026_KEY';
  private apiSecret: string = process.env.VITE_ALPACA_API_SECRET || 'SK_ALPACA_SECRET_MOCK_SECURE_KEY';
  private baseUrl: string = 'https://broker-api.sandbox.alpaca.markets/v1';
  
  // Local state cache for interactive sandbox simulation
  private mockAccounts: Map<string, AlpacaAccount> = new Map();
  private mockAchRelationships: Map<string, AlpacaAchRelationship[]> = new Map();
  private mockTransfers: Map<string, AlpacaTransfer[]> = new Map();
  private mockJournals: AlpacaJournal[] = [];
  private mockOrders: Map<string, AlpacaOrder[]> = new Map();
  private mockFirmBalance: number = 45064.36; // Initial Sandbox sweep balance
  private mockFirmAccountId: string = '8f8c8cee-2591-4f83-be12-82c659b5e748';

  private constructor() {
    this.seedInitialData();
  }

  public static getInstance(): AlpacaBrokerService {
    if (!AlpacaBrokerService.instance) {
      AlpacaBrokerService.instance = new AlpacaBrokerService();
    }
    return AlpacaBrokerService.instance;
  }

  public setCredentials(key: string, secret: string, isProduction: boolean = false) {
    this.apiKey = key;
    this.apiSecret = secret;
    this.baseUrl = isProduction 
      ? 'https://broker-api.alpaca.markets/v1' 
      : 'https://broker-api.sandbox.alpaca.markets/v1';
  }

  public getCredentials() {
    return {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      baseUrl: this.baseUrl,
      basicAuthHeader: 'Basic ' + (typeof window !== 'undefined' ? btoa(`${this.apiKey}:${this.apiSecret}`) : Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64'))
    };
  }

  public getFirmAccountId(): string {
    return this.mockFirmAccountId;
  }

  public getFirmBalance(): number {
    return this.mockFirmBalance;
  }

  private generateRequestId(): string {
    return uuidv4().replace(/-/g, '');
  }

  private seedInitialData() {
    // Seed default sample account from Alpaca guide
    const sampleAccountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
    const sampleAccount: AlpacaAccount = {
      id: sampleAccountId,
      account_number: '935142145',
      status: 'APPROVED',
      currency: 'USD',
      last_equity: '1234.56',
      created_at: '2021-05-17T09:53:17.588248Z',
      contact: {
        email_address: 'test1@gmail.com',
        phone_number: '7065912538',
        street_address: ['NG'],
        city: 'San Mateo',
        postal_code: '33345',
        state: 'CA'
      },
      identity: {
        given_name: 'John',
        family_name: 'Doe',
        date_of_birth: '1990-01-01',
        tax_id_type: 'USA_SSN',
        tax_id: '661-010-666',
        country_of_citizenship: 'USA',
        country_of_birth: 'USA',
        country_of_tax_residence: 'USA',
        funding_source: ['employment_income'],
        annual_income_min: '10000',
        annual_income_max: '10000',
        total_net_worth_min: '10000',
        total_net_worth_max: '10000',
        liquid_net_worth_min: '10000',
        liquid_net_worth_max: '10000',
        liquidity_needs: 'does_not_matter',
        investment_experience_with_stocks: 'over_5_years',
        investment_experience_with_options: 'over_5_years',
        risk_tolerance: 'conservative',
        investment_objective: 'market_speculation',
        investment_time_horizon: 'more_than_10_years',
        marital_status: 'MARRIED',
        number_of_dependents: 5
      }
    };

    this.mockAccounts.set(sampleAccountId, sampleAccount);

    // Seed default ACH Relationship
    const sampleAch: AlpacaAchRelationship = {
      id: 'c9b420e0-ae4e-4f39-bcbf-649b407c2129',
      account_id: sampleAccountId,
      created_at: '2021-05-17T09:54:58.114433723Z',
      updated_at: '2021-05-17T09:54:58.114433723Z',
      status: 'APPROVED',
      account_owner_name: 'Awesome Alpaca',
      bank_account_type: 'CHECKING',
      bank_account_number: '32131231abc',
      bank_routing_number: '121000358',
      nickname: 'Bank of America Checking'
    };

    this.mockAchRelationships.set(sampleAccountId, [sampleAch]);

    // Seed sample order
    const sampleOrder: AlpacaOrder = {
      id: '4c6cbac4-e17a-4373-b012-d446b20f9982',
      client_order_id: '5a5e2660-88a7-410c-92c9-ab0c942df70b',
      created_at: '2021-05-17T11:27:18.499336Z',
      updated_at: '2021-05-17T11:27:18.499336Z',
      submitted_at: '2021-05-17T11:27:18.488546Z',
      filled_at: '2021-05-17T11:27:19.123456Z',
      expired_at: null,
      canceled_at: null,
      failed_at: null,
      replaced_at: null,
      replaced_by: null,
      replaces: null,
      asset_id: 'b0b6dd9d-8b9b-48a9-ba46-b9d54906e415',
      symbol: 'AAPL',
      asset_class: 'us_equity',
      notional: null,
      qty: '0.42',
      filled_qty: '0.42',
      filled_avg_price: '185.20',
      order_class: '',
      order_type: 'market',
      type: 'market',
      side: 'buy',
      time_in_force: 'day',
      limit_price: null,
      stop_price: null,
      status: 'filled',
      extended_hours: false,
      legs: null,
      trail_percent: null,
      trail_price: null,
      hwm: null,
      commission: '0'
    };

    this.mockOrders.set(sampleAccountId, [sampleOrder]);
  }

  /**
   * GET /v1/assets
   * Fetches assets available on Alpaca
   */
  public async getAssets(): Promise<AlpacaApiResponse<AlpacaAsset[]>> {
    const requestId = this.generateRequestId();
    
    // Default mock asset list based on real Alpaca equity symbols
    const assets: AlpacaAsset[] = [
      {
        id: '7595a8d2-68a6-46d7-910c-6b1958491f5c',
        class: 'us_equity',
        exchange: 'NYSE',
        symbol: 'A',
        name: 'Agilent Technologies Inc.',
        status: 'active',
        tradable: true,
        marginable: true,
        shortable: true,
        easy_to_borrow: true,
        fractionable: true
      },
      {
        id: 'b0b6dd9d-8b9b-48a9-ba46-b9d54906e415',
        class: 'us_equity',
        exchange: 'NASDAQ',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        status: 'active',
        tradable: true,
        marginable: true,
        shortable: true,
        easy_to_borrow: true,
        fractionable: true
      },
      {
        id: 'f80a0211-1a22-441f-823a-738676f4c3ef',
        class: 'us_equity',
        exchange: 'NASDAQ',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        status: 'active',
        tradable: true,
        marginable: true,
        shortable: true,
        easy_to_borrow: true,
        fractionable: true
      },
      {
        id: '1d6d84ed-2022-498c-9bf4-e75c61d563a3',
        class: 'us_equity',
        exchange: 'NASDAQ',
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        status: 'active',
        tradable: true,
        marginable: true,
        shortable: true,
        easy_to_borrow: true,
        fractionable: true
      },
      {
        id: '3bb14170-c3d3-4903-888f-518cf037c7cb',
        class: 'us_equity',
        exchange: 'NASDAQ',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        status: 'active',
        tradable: true,
        marginable: true,
        shortable: true,
        easy_to_borrow: true,
        fractionable: true
      }
    ];

    return {
      data: assets,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * POST /v1/accounts
   * Creates an end-user brokerage account
   */
  public async createAccount(payload: AlpacaCreateAccountPayload): Promise<AlpacaApiResponse<AlpacaAccount>> {
    const requestId = this.generateRequestId();
    const accountId = uuidv4();
    const accountNumber = Math.floor(100000000 + Math.random() * 900000000).toString();

    const account: AlpacaAccount = {
      id: accountId,
      account_number: accountNumber,
      status: 'APPROVED',
      currency: 'USD',
      last_equity: '0',
      created_at: new Date().toISOString(),
      contact: payload.contact,
      identity: payload.identity
    };

    this.mockAccounts.set(accountId, account);

    return {
      data: account,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * GET /v1/accounts
   * Lists all brokerage accounts created under this correspondent
   */
  public async getAccounts(): Promise<AlpacaApiResponse<AlpacaAccount[]>> {
    const requestId = this.generateRequestId();
    return {
      data: Array.from(this.mockAccounts.values()),
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * POST /v1/accounts/{account_id}/ach_relationships
   * Establishes ACH relationship for virtual bank funding
   */
  public async createAchRelationship(
    accountId: string, 
    payload: AlpacaAchRelationshipPayload
  ): Promise<AlpacaApiResponse<AlpacaAchRelationship>> {
    const requestId = this.generateRequestId();
    const achId = uuidv4();

    const achRel: AlpacaAchRelationship = {
      id: achId,
      account_id: accountId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'APPROVED', // Immediately approved in sandbox mode
      account_owner_name: payload.account_owner_name,
      bank_account_type: payload.bank_account_type,
      bank_account_number: payload.bank_account_number,
      bank_routing_number: payload.bank_routing_number,
      nickname: payload.nickname
    };

    const existing = this.mockAchRelationships.get(accountId) || [];
    this.mockAchRelationships.set(accountId, [...existing, achRel]);

    return {
      data: achRel,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * GET /v1/accounts/{account_id}/ach_relationships
   */
  public async getAchRelationships(accountId: string): Promise<AlpacaApiResponse<AlpacaAchRelationship[]>> {
    const requestId = this.generateRequestId();
    const rels = this.mockAchRelationships.get(accountId) || [];

    return {
      data: rels,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * POST /v1/accounts/{account_id}/transfers
   * Funds account via ACH relationship
   */
  public async fundAccountAch(
    accountId: string, 
    payload: AlpacaTransferPayload
  ): Promise<AlpacaApiResponse<AlpacaTransfer>> {
    const requestId = this.generateRequestId();
    const transferId = uuidv4();
    const now = new Date();
    const expire = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const transfer: AlpacaTransfer = {
      id: transferId,
      relationship_id: payload.relationship_id,
      account_id: accountId,
      type: payload.transfer_type,
      status: 'COMPLETE',
      amount: payload.amount,
      direction: payload.direction,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      expires_at: expire.toISOString()
    };

    const existing = this.mockTransfers.get(accountId) || [];
    this.mockTransfers.set(accountId, [...existing, transfer]);

    // Update account equity
    const acc = this.mockAccounts.get(accountId);
    if (acc) {
      const currentEq = parseFloat(acc.last_equity) || 0;
      const amountVal = parseFloat(payload.amount) || 0;
      acc.last_equity = (currentEq + amountVal).toFixed(2);
    }

    return {
      data: transfer,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * GET /v1/accounts/activities/CSD?account_id={account_id}
   * Retrieves cash deposit activities
   */
  public async getCsdActivities(accountId: string): Promise<AlpacaApiResponse<AlpacaCsdActivity[]>> {
    const requestId = this.generateRequestId();
    const transfers = this.mockTransfers.get(accountId) || [];

    const activities: AlpacaCsdActivity[] = transfers.map(t => ({
      id: `CSD_${t.id.slice(0, 8)}`,
      account_id: accountId,
      activity_type: 'CSD',
      date: t.created_at.split('T')[0],
      net_amount: t.amount,
      description: `ACH Cash Deposit via Relationship ${t.relationship_id.slice(0, 8)}`,
      status: 'EXECUTED'
    }));

    return {
      data: activities,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * POST /v1/journals
   * Instant funding journal between Firm account and end user account
   */
  public async journalFunds(payload: AlpacaJournalPayload): Promise<AlpacaApiResponse<AlpacaJournal>> {
    const requestId = this.generateRequestId();
    const journalId = uuidv4();
    const amountVal = parseFloat(payload.amount);

    const journal: AlpacaJournal = {
      id: journalId,
      entry_type: payload.entry_type,
      from_account: payload.from_account,
      to_account: payload.to_account,
      amount: payload.amount,
      status: 'executed',
      created_at: new Date().toISOString(),
      description: payload.description || 'Instant Sweep/Reward Funding Journal'
    };

    this.mockJournals.push(journal);

    // Adjust balances
    if (payload.from_account === this.mockFirmAccountId) {
      this.mockFirmBalance -= amountVal;
    }
    const targetAccount = this.mockAccounts.get(payload.to_account);
    if (targetAccount) {
      const currentEq = parseFloat(targetAccount.last_equity) || 0;
      targetAccount.last_equity = (currentEq + amountVal).toFixed(2);
    }

    return {
      data: journal,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * GET /v1/journals
   */
  public async getJournals(): Promise<AlpacaApiResponse<AlpacaJournal[]>> {
    const requestId = this.generateRequestId();
    return {
      data: this.mockJournals,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * POST /v1/trading/accounts/{account_id}/orders
   * Places trade orders on behalf of an end user
   */
  public async createTradingOrder(
    accountId: string, 
    payload: AlpacaOrderPayload
  ): Promise<AlpacaApiResponse<AlpacaOrder>> {
    const requestId = this.generateRequestId();
    const orderId = uuidv4();
    const clientOrderId = uuidv4();

    const order: AlpacaOrder = {
      id: orderId,
      client_order_id: clientOrderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
      filled_at: new Date().toISOString(),
      expired_at: null,
      canceled_at: null,
      failed_at: null,
      replaced_at: null,
      replaced_by: null,
      replaces: null,
      asset_id: uuidv4(),
      symbol: payload.symbol.toUpperCase(),
      asset_class: 'us_equity',
      notional: payload.notional ? payload.notional.toString() : null,
      qty: payload.qty ? payload.qty.toString() : '1.0',
      filled_qty: payload.qty ? payload.qty.toString() : '1.0',
      filled_avg_price: '185.50',
      order_class: '',
      order_type: payload.type,
      type: payload.type,
      side: payload.side,
      time_in_force: payload.time_in_force,
      limit_price: payload.limit_price ? payload.limit_price.toString() : null,
      stop_price: payload.stop_price ? payload.stop_price.toString() : null,
      status: 'filled',
      extended_hours: false,
      legs: null,
      trail_percent: null,
      trail_price: null,
      hwm: null,
      commission: '0'
    };

    const existing = this.mockOrders.get(accountId) || [];
    this.mockOrders.set(accountId, [...existing, order]);

    return {
      data: order,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * GET /v1/trading/accounts/{account_id}/orders
   */
  public async getOrders(accountId: string): Promise<AlpacaApiResponse<AlpacaOrder[]>> {
    const requestId = this.generateRequestId();
    const orders = this.mockOrders.get(accountId) || [];

    return {
      data: orders,
      requestId,
      statusCode: 200,
      headers: {
        'x-request-id': requestId,
        'content-type': 'application/json'
      }
    };
  }
}

export const alpacaBrokerService = AlpacaBrokerService.getInstance();
export default AlpacaBrokerService;

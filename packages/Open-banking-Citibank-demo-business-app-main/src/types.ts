export interface ConfigStatus {
  hasConsumerId: boolean;
  hasConsumerKey: boolean;
  hasConsumerSecret: boolean;
  consumerIdMasked: string;
  consumerKeyMasked: string;
  consumerSecretMasked: string;
  apiBaseUrl: string;
  directLoginEndpoint: string;
  oauthInitiateEndpoint: string;
  userRedirectUrl: string;
  hasGeminiKey: boolean;
  hasModernTreasuryKey: boolean;
  sessionLoggedIn: boolean;
  sessionUsername?: string;
  sessionTokenMasked?: string;
}

export interface SessionCredentials {
  consumerId?: string;
  consumerKey?: string;
  consumerSecret?: string;
  username?: string;
  password?: string;
  apiBaseUrl?: string;
}

export interface DirectLoginResponse {
  success: boolean;
  mode?: string;
  token?: string;
  user?: string;
  message?: string;
  error?: string;
  status?: number;
  statusText?: string;
  durationMs?: number;
  telemetryId?: string;
  rawResponse?: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    data?: any;
  };
}

export interface ApiCallLog {
  id: string;
  timestamp: string;
  service: 'OBP_AUTH' | 'OBP_DATA' | 'COMMERCIAL_PAPER' | 'MODERN_TREASURY' | 'QUANTUM_COPILOT' | 'CONFIG' | 'CUSTOM_API';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  targetUrl?: string;
  status: number;
  statusText: string;
  durationMs: number;
  requestHeaders?: Record<string, string>;
  requestBody?: any;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
  mode: 'LIVE_OBP_API' | 'LOCAL_SANDBOX' | 'INTERNAL_ENGINE' | 'API_PROXY';
  isError?: boolean;
}

export interface OBPBank {
  id: string;
  short_name: string;
  full_name: string;
  logo?: string | null;
  website?: string | null;
  national_identifier?: string;
  bank_routings?: Array<{
    scheme: string;
    address: string;
  }>;
  attributes?: any[];
}

export interface OBPAccount {
  id: string;
  bank_id: string;
  label: string;
  number: string;
  owners: Array<{
    id: string;
    display_name: string;
  }>;
  type: string;
  balance: {
    currency: string;
    amount: string;
  };
  routing?: {
    scheme: string;
    address: string;
  };
}

export interface OBPTransaction {
  id: string;
  this_account: {
    id: string;
    bank_id: string;
    holders: Array<{ display_name: string }>;
    number: string;
  };
  other_account: {
    id: string;
    holder: { display_name: string };
    number: string;
    bank_routing_scheme?: string;
    bank_routing_address?: string;
  };
  details: {
    type: string;
    description: string;
    posted: string;
    completed: string;
    new_balance: {
      currency: string;
      amount: string;
    };
    value: {
      currency: string;
      amount: string;
    };
  };
}

export interface OBPTransactionRequest {
  id?: string;
  bank_id: string;
  from_account_id: string;
  to_account_id?: string;
  to_account_number?: string;
  to_account_holder_name?: string;
  to_bank_routing_address?: string;
  amount: number;
  currency: string;
  description: string;
  status?: 'INITIATED' | 'COMPLETED' | 'PENDING' | 'REJECTED';
  created_at?: string;
}

export interface OBPCustomer {
  customer_id: string;
  bank_id: string;
  customer_number: string;
  legal_name: string;
  mobile_phone_number: string;
  email: string;
  face_image?: { url: string; date: string };
  date_of_birth?: string;
  relationship_status?: string;
  dependants?: number;
  credit_rating?: { rating: string; source: string };
  credit_limit?: { currency: string; amount: string };
}

export interface OBPBranch {
  id: string;
  bank_id: string;
  name: string;
  address: {
    line_1: string;
    city: string;
    state: string;
    postcode: string;
    country_code: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  is_accessible?: boolean;
}

export interface OBPProduct {
  name: string;
  code: string;
  category: string;
  family: string;
  super_family: string;
  description: string;
  bank_id: string;
}

export interface CommercialPaperNote {
  id: string;
  cusip: string;
  issuer: string;
  program: string;
  rating: 'A-1+/P-1' | 'A-1/P-1' | 'A-2/P-2' | 'Tier-1 Prime';
  faceValue: number;
  issuePrice: number;
  discountRate: number; // e.g. 4.85 for 4.85%
  bondEquivalentYield: number; // e.g. 4.98%
  issueDate: string;
  maturityDate: string;
  tenorDays: number;
  currency: string;
  status: 'ACTIVE' | 'SETTLED' | 'MATURING_SOON' | 'ROLLED_OVER';
  investorOrDealer: string;
  settlementAccount: string;
  notes?: string;
}

export interface ModernTreasuryLedger {
  id: string;
  name: string;
  currency: string;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  pendingInflow: number;
  pendingOutflow: number;
  updatedAt: string;
}

export interface ModernTreasuryPaymentOrder {
  id: string;
  type: 'ach' | 'wire' | 'rtp' | 'book';
  direction: 'credit' | 'debit';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  originatingAccountId: string;
  receivingEntityName: string;
  receivingAccountNumberMasked: string;
  receivingRoutingNumber: string;
  referenceId: string;
  description: string;
  createdAt: string;
  estimatedSettlement: string;
}

export interface QuantumChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionTriggers?: Array<{
    label: string;
    action: string;
    payload?: any;
  }>;
  financialMetrics?: {
    totalCash?: string;
    cpOutstanding?: string;
    liquidityGap?: string;
    recommendedRate?: string;
  };
}

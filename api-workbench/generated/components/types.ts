/**
 * Auto-generated Multi-Spec API & XSD Clean Domain Types
 * Clean, unambiguous TypeScript models for the Workbench SDK and Generated Components
 */

// ==========================================
// 1. BROKERAGE & TRADING DOMAIN
// ==========================================
export interface BrokerAccount {
  id: string;
  account_number: string;
  status: 'ACTIVE' | 'PENDING' | 'DISABLED' | 'ACCOUNT_UPDATED';
  currency: string;
  cash: string | number;
  portfolio_value: string | number;
  pattern_day_trader: boolean;
  trading_blocked: boolean;
  transfers_blocked: boolean;
  account_blocked: boolean;
  created_at: string;
}

export interface BrokerOrderRequest {
  symbol: string;
  qty?: string | number;
  notional?: string | number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  time_in_force: 'day' | 'gtc' | 'opg' | 'ioc';
  limit_price?: string | number;
  stop_price?: string | number;
  client_order_id?: string;
}

export interface BrokerOrderResponse {
  id: string;
  client_order_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  filled_at?: string;
  symbol: string;
  qty: string;
  filled_qty: string;
  type: string;
  side: string;
  time_in_force: string;
  limit_price?: string;
  status: 'new' | 'partially_filled' | 'filled' | 'canceled' | 'expired' | 'rejected';
}

export interface BrokerPosition {
  asset_id: string;
  symbol: string;
  exchange: string;
  asset_class: string;
  qty: string;
  avg_entry_price: string;
  side: 'long' | 'short';
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  current_price: string;
}

export interface BrokerClock {
  timestamp: string;
  is_open: boolean;
  next_open: string;
  next_close: string;
}

// ==========================================
// 2. BANKING & TRANSACTIONS DOMAIN
// ==========================================
export interface AccountFinancialDetails {
  accountId: string;
  accountNumberMasked: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'LOAN' | 'INVESTMENT';
  currency: string;
  currentBalance: number;
  availableBalance: number;
  creditLimit?: number;
  interestRate?: number;
  routingNumber?: string;
  status: 'OPEN' | 'CLOSED' | 'DORMANT' | 'FROZEN';
}

export interface AccountTransactionItem {
  transactionId: string;
  accountId: string;
  bookingDate: string;
  valueDate: string;
  amount: number;
  currency: string;
  creditDebitIndicator: 'CRDT' | 'DBIT';
  status: 'BOOKED' | 'PENDING' | 'REJECTED';
  merchantName?: string;
  merchantCategoryCode?: string;
  description: string;
  referenceNumber?: string;
}

export interface BalanceTransferEligibility {
  accountId: string;
  isEligible: boolean;
  maximumTransferAmount: number;
  minimumTransferAmount: number;
  promotionalApr: number;
  promotionalDurationMonths: number;
  standardApr: number;
  feePercentage: number;
  expiryDate: string;
}

// ==========================================
// 3. AUTH & IDENTITY TOKEN DOMAIN
// ==========================================
export interface TokenRequestParams {
  grant_type: 'authorization_code' | 'client_credentials' | 'refresh_token';
  client_id?: string;
  client_secret?: string;
  code?: string;
  redirect_uri?: string;
  refresh_token?: string;
  scope?: string;
}

export interface TokenResponseData {
  access_token: string;
  token_type: 'Bearer' | string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

export interface PartnerPreLoginExchangeRequest {
  partnerId: string;
  e2ePublicKey: string;
  deviceFingerprint: string;
  clientTimestamp: string;
}

export interface PartnerPreLoginExchangeResponse {
  serverPublicKey: string;
  sessionId: string;
  keyExchangeStatus: 'SUCCESS' | 'FAILED';
  cipherAlgorithm: string;
}

// ==========================================
// 4. PAYPAL & CHECKOUT DOMAIN
// ==========================================
export interface PayPalOrderRequest {
  intent: 'CAPTURE' | 'AUTHORIZE';
  purchase_units: Array<{
    reference_id?: string;
    description?: string;
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
  application_context?: {
    brand_name?: string;
    locale?: string;
    landing_page?: string;
    user_action?: 'CONTINUE' | 'PAY_NOW';
    return_url?: string;
    cancel_url?: string;
  };
}

export interface PayPalOrderResponse {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  intent: string;
  create_time: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

// ==========================================
// 5. REWARDS & LOYALTY DOMAIN
// ==========================================
export interface RewardShopWithPointsLinkage {
  partnerMemberId: string;
  partnerName: string;
  linkageStatus: 'ACTIVE' | 'PENDING' | 'UNLINKED';
  availablePoints: number;
  pointsConversionRate: number; // e.g. 100 points = $1.00
  currencyCode: string;
  cashEquivalentValue: number;
}

export interface RewardRedemptionRequest {
  partnerMemberId: string;
  pointsToRedeem: number;
  redemptionContext: 'CHECKOUT' | 'STATEMENT_CREDIT' | 'GIFT_CARD';
  orderAmount: number;
  currency: string;
}

export interface RewardRedemptionResult {
  redemptionId: string;
  status: 'COMPLETED' | 'PENDING' | 'REJECTED';
  pointsDeducted: number;
  creditApplied: number;
  remainingPointsBalance: number;
  timestamp: string;
}

// ==========================================
// 6. STATEMENTS & ORCHESTRATION DOMAIN
// ==========================================
export interface StatementSummary {
  statementId: string;
  accountId: string;
  statementPeriodStart: string;
  statementPeriodEnd: string;
  openingBalance: number;
  closingBalance: number;
  totalDebits: number;
  totalCredits: number;
  downloadUrl?: string;
}

export interface TaxStatementSummary {
  taxYear: number;
  formType: '1099-INT' | '1099-DIV' | '1099-B' | '1099-MISC';
  accountId: string;
  totalInterestOrDividends: number;
  isAvailableForDownload: boolean;
  documentId: string;
}

// ==========================================
// 7. COMMON & XSD METADATA
// ==========================================
export interface XsdCommonTransmissionDetails {
  businessLineCode?: string;
  category?: string;
  transmissionId?: string;
  timestamp?: string;
}

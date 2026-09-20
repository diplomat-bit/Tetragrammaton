

import React from 'react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
    ethereum?: any;
  }
}

export enum View {
  Dashboard = 'AQUARIUS_EXECUTIVE_COMMAND',
  DataIngest = 'NEURAL_DATA_INGEST',
  PortalHub = 'SOVEREIGN_PORTAL_HUB',
  BillingIdentity = 'LAST_BOSS_IDENTITY_VAULT',
  CryptoVerifier = 'JWE_JWS_CRYPTO_VERIFIER',
  
  // THE LEGIONS (Multi-modal Core)
  LegionArchitect = 'LEGION_I_ARCHITECT',
  LegionGhost = 'LEGION_II_GHOST',
  LegionVisualizer = 'LEGION_III_VISUALIZER',
  LegionVoice = 'LEGION_IV_VOICE',
  LegionAuditor = 'LEGION_V_AUDITOR',
  LegionLive = 'LEGION_VI_LIVE',
  
  // SOVEREIGNTY CORE (Identity & Security)
  IdentityCitadel = 'SOVEREIGN_IDENTITY_CITADEL',
  RecoveryMesh = 'NEURAL_RECOVERY_MESH',
  PrivacyGuardian = 'PRIVACY_BLINDER_CORE',
  TrustRegistry = 'DECENTRALIZED_TRUST_REGISTRY',
  
  // GROWTH & ASSET FORGE (Capital Expansion)
  WealthNexus = 'CAPITAL_GROWTH_NEXUS',
  TokenIssuance = 'SOVEREIGN_ASSET_FORGE',
  MarketingAutomation = 'CAMPAIGN_ORCHESTRATION_HUB',
  IntelligenceHub = 'INTELLIGENCE_CENTER_V5',
  NeuralTools = 'NEURAL_ORACLE_TOOLS',
  
  // OPERATIONS & INTELLIGENCE (Business Logic)
  InstitutionalHub = 'NEXUS_OPERATIONS_CONTROL',
  GlobalLedger = 'GLOBAL_TRANSACTION_LEDGER',
  NexusBuilder = 'NEXUS_FORGE_BUILDER',
  IntegrationsMarketplace = 'COMMAND_CENTER_INTEGRATIONS',
  
  // SYSTEM LAYER
  SendMoney = 'REMITRAX_PORTAL',
  Budgets = 'FISCAL_MANDATES',
  Goals = 'FINANCIAL_GOAL_CARTOGRAPHY',
  TheVision = 'THE_SOVEREIGN_MANIFESTO',
  Settings = 'SYSTEM_CORE_SETTINGS',
  Rewards = 'REWARDS_HUB_OMEGA',
  Portfolio = 'INVESTMENT_PORTFOLIO',
  CitiGateway = 'CITI_SOVEREIGN_GATEWAY',
  CitiConnectInitiation = 'CITI_CONNECT_PAYMENT_INITIATION',
  CitiConnectInquiry = 'CITI_CONNECT_PAYMENT_INQUIRY',
  CitiConnectNotifications = 'CITI_CONNECT_PUSH_NOTIFICATIONS',
  CitiTreasury = 'CITI_TREASURY_COMMAND_CENTER',
  FapiPipeline = 'UK_OPEN_BANKING_FAPI_SECURITY_PIPELINE',
  TradingBots = 'NEURAL_ADVISOR_SANCTUM',
  APIKeys = 'API_KEY_MANAGEMENT',
  Transactions = 'GLOBAL_TRANSACTION_LEDGER_HISTORY',
  AzureApps = 'AZURE_APPS_DIRECTORY',
  PaymentMethods = 'PAYMENT_METHODS_GATEWAY',
  
  // Navigation Aliases and Missing Views
  Investments = 'INVESTMENT_STRATEGY_PORTAL',
  QuantumWeaver = 'QUANTUM_VENTURE_INCUBATOR',
  Crypto = 'DECENTRALIZED_ASSET_GATEWAY',
  SovereignOrgHandshake = 'SOVEREIGN_ORG_HANDSHAKE',
  WorkspaceNexus = 'SOVEREIGN_WORKSPACE_NEXUS',
  GcpInventory = 'GCP_INVENTORY_VIEW',
  FloridaVoter = 'FLORIDA_VOTER_REGISTRATION',
  SovereignIntelligence = 'SOVEREIGN_INTELLIGENCE_CENTER',
  CitiDecryptionUtility = 'CITI_SOVEREIGN_DECRYPTION_VAULT',
  CitiPartnerHub = 'CITI_PARTNER_TRANSACTIONS_HUB',
  CitiUkInternationalPayments = 'CITI_UK_OPEN_BANKING_INTERNATIONAL_PAYMENTS',
  AstraDBQuickstart = 'ASTRA_DB_QUICKSTART_INITIALIZATION',
  UniverseGraph = 'UNIVERSE_GRAPH_3D_TOPOLOGY',
  ImpeachmentGenerator = 'IMPEACHMENT_GENERATOR_AUDIT',
  ContractorLobbying = 'CONTRACTOR_LOBBYING_ROI_INDEX',
  SentryEngine = 'SOVEREIGN_SENTRY_ENGINE_ISO20022',
  AriaComms = 'ARIA_COMMS_WORKLET',
  ModernTreasuryLedger = 'MODERN_TREASURY_LEDGER_HUB',
  AlpacaBroker = 'ALPACA_BROKER_API_INTEGRATION',
  AlpacaAccounts = 'ALPACA_ACCOUNTS_KYC_MANAGER',
  AlpacaTrading = 'ALPACA_TRADING_TERMINAL',
  AlpacaFunding = 'ALPACA_FUNDING_HUB',
  AlpacaCryptoWallets = 'ALPACA_CRYPTO_WALLETS',
  AlpacaJournals = 'ALPACA_SOVEREIGN_JOURNALS',
  AlpacaRebalancing = 'ALPACA_REBALANCING_ENGINE',
  AlpacaTokenization = 'ALPACA_TOKENIZATION_RWA',
  AlpacaIpoMarketplace = 'ALPACA_IPO_MARKETPLACE',
  AlpacaReporting = 'ALPACA_EOD_REPORTING',
  PlaidAlpacaBridge = 'PLAID_ALPACA_BRIDGE',
  StripeAlpacaBridge = 'STRIPE_ALPACA_BRIDGE',
  CitiAlpacaBridge = 'CITI_ALPACA_BRIDGE',
  SovereignMarketTakeover = 'SOVEREIGN_MARKET_TAKEOVER_HUB',
}

export type AppView = View | string;

export interface ExternalApp {
  id: string;
  name: string;
  description: string;
  slug?: string;
  category: 'Banking' | 'AI' | 'Dev' | 'Security' | 'Legacy';
  viewId?: AppView;
  isPremium?: boolean;
}

export interface AzureApp {
  app: string;
  appId: string;
  servicePrincipal: string;
  owner: string;
  homepage?: string;
  objectId?: string;
  isCustom?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  loyaltyTier: string;
  avatarUrl: string;
  usdBalance: number;
  fiatBalance: number;
  cryptoBalance: number;
  // Last Boss Metadata
  app_metadata: {
    stripe_customer_id?: string;
    subscription_status: 'active' | 'past_due' | 'unpaid' | 'none';
    is_pro: boolean;
  };
  user_metadata: {
    theme: string;
    discovery_source: string;
  };
}

export interface TransactionDetailsResponse {
  transactions?: Transaction[];
  investmentTransaction?: any[];
  nextStartIndex?: string;
}

export interface AccountDetailsResponse {
  checkingAccountSummary?: CheckingAccountSummary;
  savingsAccountSummary?: SavingsAccountSummary;
  creditCardAccountSummary?: CreditCardAccountSummary;
  // ... add others as needed
}

export interface CheckingAccountSummary extends BasicAccountDetails {}
export interface SavingsAccountSummary extends BasicAccountDetails {}
export interface CreditCardAccountSummary extends BasicAccountDetails {}
export interface ReadyCreditAccountSummary extends BasicAccountDetails {}
export interface LoanAccountSummary extends BasicAccountDetails {}
export interface MutualFundAccountSummary extends BasicAccountDetails {}
export interface SecuritiesBrokerageAccountSummary extends BasicAccountDetails {}
export interface CallDepositAccountSummary extends BasicAccountDetails {}
export interface PremiumDepositAccountSummary extends BasicAccountDetails {}
export interface TimeDepositAccountSummary extends BasicAccountDetails {}

export interface AccountsGroupList {
  accountGroupSummary: AccountGroupSummary[];
  nextStartIndex?: string;
}

export interface AccountGroupSummary {
  accountGroup: string;
  accounts: AccountSummary[];
  insurancePolicies?: InsurancePolicySummary[];
  totalCurrentBalance?: GroupBalance;
  totalAvailableBalance?: GroupBalance;
  totalOutstandingBalance?: GroupBalance;
}

export interface GroupBalance {
  amount: number;
  currencyCode: string;
}

export interface InsurancePolicySummary {
  policyId: string;
  policyName: string;
  policyStatus: string;
}

export interface AccountSummary {
  checkingAccountSummary?: CheckingAccountSummary;
  savingsAccountSummary?: SavingsAccountSummary;
  creditCardAccountSummary?: CreditCardAccountSummary;
  readyCreditAccountSummary?: ReadyCreditAccountSummary;
  loanAccountSummary?: LoanAccountSummary;
  mutualFundAccountSummary?: MutualFundAccountSummary;
  securitiesBrokerageAccountSummary?: SecuritiesBrokerageAccountSummary;
  callDepositAccountSummary?: CallDepositAccountSummary;
  premiumDepositAccountSummary?: PremiumDepositAccountSummary;
  timeDepositAccountSummary?: TimeDepositAccountSummary;
}

export interface BasicAccountDetails {
  displayAccountNumber: string;
  accountId: string;
  accountOpenDate: string;
  relationshipId: string;
  accountType: string;
  accountAlternateCurrencyCode: string;
  accountBaseCurrencyCode: string;
  productCode: string;
  subProductCode: string;
  accountName: string;
  accountNickname: string;
  accountDescription: string;
  accountStatus: string;
  accountGroupId: string;
  accountGroupTitle: string;
  accountGroupStatus: string;
  balances: Balances;
}

export interface Balances {
  marketValue?: { currencyBasedValue: CurrencyBasedValue };
  currentValue?: { currencyCurrentValue: CurrencyCurrentValue };
  availableBalance?: { currencyBasedValue: CurrencyBasedValue };
  accruedInterest?: { currencyBasedValue: CurrencyBasedValue };
  unrealisedGainLoss?: { currencyBasedValue: CurrencyBasedValue };
  totalBasis?: { currencyBasedValue: CurrencyBasedValue };
  yearToDateIncome?: { currencyBasedValue: CurrencyBasedValue };
  ytdRealizedGainLoss?: { currencyBasedValue: CurrencyBasedValue };
  estimatedAnnualIncome?: { currencyBasedValue: CurrencyBasedValue };
}

export interface CurrencyBasedValue {
  alternateAmount: number;
  baseAmount: number;
}

export interface CurrencyCurrentValue {
  alternateAmountValue: string[];
  baseAmountValue: string[];
}

export interface GroupBalance {
  localCurrencyCode: string;
  localCurrencyBalanceAmount: number;
  foreignCurrencyCode?: string;
  foreignCurrencyBalanceAmount?: number;
}

export interface InsurancePolicySummary {
  productName: string;
  productCode: string;
  displayAccountNumber: string;
  currencyCode: string;
  accountClassification: string;
  accountStatus: string;
  displayPolicyNumber: string;
  insuranceApplicationId: string;
  insuranceSumAssuredAmount: number;
  totalPremiumPaidAmount: number;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  type: 'INFLOW' | 'OUTFLOW' | 'income' | 'expense' | string;
  category: string;
  description: string;
  metadata: {
    merchantName: string;
    carbonFootprint: number;
    tags: string[];
    aiClassification?: string;
    mt_ledger_account_id?: string;
  };
}

export interface InternalAccount {
  id: string;
  bestName: string;
  currency: string;
  operationalStatus: 'ACTIVE' | 'ARCHIVED' | 'PENDING' | string;
  balance: number;
  bankName: string;
}

export interface PortfolioAsset {
  id: string;
  name: string;
  value: number;
  assetClass: string;
  performanceYTD: number;
  color: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'warning' | 'error' | 'critical' | 'success';
  view?: AppView;
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  category?: string;
  remaining?: number;
  alerts?: any[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number;
  type: string;
  description: string;
  iconName: string;
}

export interface APIStatus {
  id: string;
  name: string;
  description: string;
  provider: string;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
  responseTime: number;
  latencyHistory: Array<{ time: string; latency: number }>;
}

// --- MISSING TYPE DEFINITIONS ---

/**
 * Represents a system feature or module capability.
 */
export interface Feature {
  id: string;
  name: string;
  icon: string;
  category: string;
  description?: string;
}

/**
 * Generic Asset type for broader portfolio representation.
 */
export interface Asset {
  id: string;
  name: string;
  value: number;
  color: string;
  performanceYTD: number;
  type: string;
  description?: string;
  esgRating?: number;
}

/**
 * Recurring subscription service details.
 */
export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

/**
 * Credit health aggregate metrics.
 */
export interface CreditScore {
  score: number;
  change?: number;
  rating: string;
  lastUpdated?: string;
}

/**
 * Log of upcoming financial obligations.
 */
export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

/**
 * Financial savings milestone data.
 */
export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

/**
 * Complex financial goal with planning metadata.
 */
export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  iconName: string;
  plan: any;
  startDate: string;
  contributions: any[];
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
}

/**
 * Represents a dependency linkage between two financial goals.
 */
export interface LinkedGoal {
  id: string;
  sourceGoalId: string;
  targetGoalId: string;
  relationshipType: 'prerequisite' | 'overflow' | 'milestone';
  triggerAmount?: number;
}

/**
 * Digital asset specific metadata.
 */
export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

/**
 * Low-level payment rail operation details.
 */
export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

/**
 * Physical or virtual corporate card metadata.
 */
export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: {
    monthlyLimit: number;
    atm: boolean;
    online: boolean;
    contactless: boolean;
  };
}

/**
 * High-fidelity corporate transaction record.
 */
export interface CorporateTransaction {
  id: string;
  merchant: string;
  amount: number;
  holderName: string;
  status: string;
  timestamp: string;
  date: string;
  description: string;
}

/**
 * Loyalty and rewards point ledger.
 */
export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
  pending?: number;
  total?: number;
  history?: any[];
}

/**
 * Individual factor contributing to credit health.
 */
export interface CreditFactor {
  name: string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}

/**
 * Trusted external entity for transactions.
 */
export interface Counterparty {
  id: string;
  name: string;
  email: string;
  send_remittance_advice: boolean;
  accounts: any[];
  created_at: string;
}

/**
 * Detailed internal account metadata.
 */
export interface AccountDetails {
  id: string;
  name: string;
  mask: string;
  currentBalance: number;
  type: string;
  accountHolder: string;
  currency: string;
}

/**
 * High-level portfolio grouping.
 */
export interface Portfolio {
  id: string;
  name: string;
  type: string;
  currency: string;
  totalValue: number;
  unrealizedGainLoss: number;
  todayGainLoss: number;
  lastUpdated: string;
  riskTolerance: string;
  holdings: any[];
}

/**
 * Result of a neural market simulation.
 */
export interface SimulationResult {
  simulationId: string;
  narrativeSummary: string;
  keyImpacts: any[];
}

/**
 * Flagged corporate anomaly for audit.
 */
export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: string;
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore: number;
  recommendedAction: string;
}

/**
 * Static compliance audit report.
 */
export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

/**
 * Periodic cash flow predictive model.
 */
export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

/**
 * Fraud detection heuristic rule.
 */
export interface FraudRule {
  id: string;
  name: string;
}

/**
 * Event-driven webhook configuration.
 */
export interface WebhookSubscription {
  id: string;
}

/**
 * System API key metadata.
 */
export interface APIKey {
  id: string;
  name: string;
}

/**
 * Stages of the Quantum Weaver incubation process.
 */
export enum WeaverStage {
  Pitch = 'PITCH',
  Analysis = 'ANALYSIS',
  IdeaValidation = 'IDEA_VALIDATION',
  Test = 'TEST',
  Error = 'ERROR'
}

/**
 * Structured AI business plan output.
 */
export interface AIPlan {
  id: string;
}

/**
 * AI-generated audit question.
 */
export interface AIQuestion {
  id: string;
  question: string;
}

/**
 * Individual step in an AI execution plan.
 */
export interface AIPlanStep {
  id: string;
}

/**
 * Institutional payment order.
 */
export interface PaymentOrder {
  id: string;
  amount: number;
}

/**
 * Institutional receivable invoice.
 */
export interface Invoice {
  id: string;
  amount: number;
  status: string;
}

/**
 * Compliance investigation case.
 */
export interface ComplianceCase {
  id: string;
  status: string;
}

/**
 * Standard paginated envelope for list responses.
 */
export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  offset: number;
  total: number;
}

/**
 * EIP-6963 Wallet Provider details.
 */
export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
  };
  provider: any;
}

/**
 * EIP-6963 Provider Announcement event.
 */
export interface EIP6963AnnounceProviderEvent extends Event {
  detail: EIP6963ProviderDetail;
}

/**
 * Apollo Persisted Query Manifest structure.
 */
export interface PersistedQueryManifest {
  format: string;
  version: number;
  operations: Array<{
    id: string;
    name: string;
    type: string;
    body: string;
  }>;
}

/**
 * High-velocity market mover metadata.
 */
export interface MarketMover {
    ticker: string;
    name: string;
    change: number;
    price: number;
}

/**
 * Third-party authorized application record.
 */
export interface AuthorizedApp {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'revoked';
    authorizedAt: string;
    scopes: string[];
}

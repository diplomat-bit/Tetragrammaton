export enum View {
  Dashboard = 'Dashboard',
  Transactions = 'Transactions',
  SendMoney = 'SendMoney',
  Budgets = 'Budgets',
  FinancialGoals = 'FinancialGoals',
  CreditHealth = 'CreditHealth',
  Investments = 'Investments',
  CryptoWeb3 = 'CryptoWeb3',
  Crypto = 'Crypto',
  AlgoTradingLab = 'AlgoTradingLab',
  ForexArena = 'ForexArena',
  CommoditiesExchange = 'CommoditiesExchange',
  RealEstateEmpire = 'RealEstateEmpire',
  ArtCollectibles = 'ArtCollectibles',
  DerivativesDesk = 'DerivativesDesk',
  VentureCapital = 'VentureCapital',
  VentureCapitalDeskView = 'VentureCapitalDeskView',
  PrivateEquity = 'PrivateEquity',
  TaxOptimization = 'TaxOptimization',
  LegacyBuilder = 'LegacyBuilder',
  CorporateCommand = 'CorporateCommand',
  ModernTreasury = 'ModernTreasury',
  Treasury = 'Treasury',
  CardPrograms = 'CardPrograms',
  DataNetwork = 'DataNetwork',
  PlaidMainDashboard = 'PlaidMainDashboard',
  Payments = 'Payments',
  StripeNexus = 'StripeNexus',
  StripeNexusDashboard = 'StripeNexusDashboard',
  CustomerDashboard = 'CustomerDashboard',
  SSO = 'SSO',
  OpenBanking = 'OpenBanking',
  APIStatus = 'APIStatus',
  APIIntegration = 'APIIntegration',
  AIAdvisor = 'AIAdvisor',
  AIInsights = 'AIInsights',
  QuantumWeaver = 'QuantumWeaver',
  AgentMarketplace = 'AgentMarketplace',
  AIAdStudio = 'AIAdStudio',
  CardCustomization = 'CardCustomization',
  FinancialDemocracy = 'FinancialDemocracy',
  ConciergeService = 'ConciergeService',
  Philanthropy = 'Philanthropy',
  SovereignWealth = 'SovereignWealth',
  SecurityCenter = 'SecurityCenter',
  Security = 'Security',
  SecurityCompliance = 'SecurityCompliance',
  Personalization = 'Personalization',
  TheVision = 'TheVision',
  TheBook = 'TheBook',
  KnowledgeBase = 'KnowledgeBase',
  GlobalPositionMap = 'GlobalPositionMap',
  GlobalSsiHub = 'GlobalSsiHub',
  CorporateActions = 'CorporateActions',
  GEINDashboard = 'GEINDashboard',
  PlaidInstitutions = 'PlaidInstitutions',
  PlaidItemManagement = 'PlaidItemManagement',
  VerificationReports = 'VerificationReports',
  CitibankUnmaskedData = 'CitibankUnmaskedData',
  SchemaExplorer = 'SchemaExplorer',
  FinancialReporting = 'FinancialReporting',
  ComplianceOracle = 'ComplianceOracle',
  ApiPlayground = 'ApiPlayground',
  ResourceGraph = 'ResourceGraph',
  DeveloperHub = 'DeveloperHub',
  CardholderManagement = 'CardholderManagement',
  ReconciliationHub = 'ReconciliationHub',
  CreditNoteLedger = 'CreditNoteLedger',
  VirtualAccounts = 'VirtualAccounts',
  CounterpartyDashboard = 'CounterpartyDashboard',
  PlaidCRAMonitoring = 'PlaidCRAMonitoring',
  PlaidIdentity = 'PlaidIdentity',
  CitibankEligibility = 'CitibankEligibility',
  CitibankDeveloperTools = 'CitibankDeveloperTools',
  CitibankStandingInstructions = 'CitibankStandingInstructions',
  CitibankPayeeManagement = 'CitibankPayeeManagement',
  CitibankCrossBorder = 'CitibankCrossBorder',
  CitibankBillPay = 'CitibankBillPay',
  CitibankAccountProxy = 'CitibankAccountProxy',
  CitibankAccounts = 'CitibankAccounts',
  QuantumAssets = 'QuantumAssets',
  Accounts = 'Accounts',
  AccountDetails = 'AccountDetails',
  AccountList = 'AccountList',
  AccountsDashboardView = 'AccountsDashboardView',
  Rewards = 'Rewards',
  Settings = 'Settings'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  picture?: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  accountNumber?: string;
  routingNumber?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category?: string;
  status?: string;
  counterparty?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
  currency: string;
  allocation?: number;
  change24h?: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'annually';
  nextBillingDate: string;
  category?: string;
  status?: 'active' | 'cancelled' | 'paused';
}

export interface CreditScore {
  score: number;
  rating: string;
  lastUpdated: string;
  history?: { date: string; score: number }[];
}

export interface UpcomingBill {
  id: string;
  biller: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  category?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
}

export interface PaymentOperation {
  id: string;
  type: string;
  amount: number;
  recipient: string;
  status: string;
  timestamp: string;
}

export interface CorporateCard {
  id: string;
  cardholderName: string;
  lastFour: string;
  limit: number;
  spent: number;
  status: 'active' | 'frozen' | 'cancelled';
}

export interface CorporateTransaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  department: string;
  cardLastFour: string;
  status: string;
}

export interface RewardPoints {
  balance: number;
  lifetimeEarned: number;
  tier: string;
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  category: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
}

export interface APIStatus {
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  latency: string;
  uptime: string;
}

export interface CreditFactor {
  factor: string;
  impact: 'High' | 'Medium' | 'Low';
  status: string;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  direction: 'credit' | 'debit';
  status: string;
  originatingAccountId: string;
  counterpartyId: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
}

export interface ComplianceCase {
  id: string;
  type: string;
  riskScore: number;
  status: 'open' | 'under_review' | 'resolved';
  timestamp: string;
  description: string;
}

export interface FinancialAnomaly {
  id: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impactAmount?: number;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface LendingPoolStats {
  totalDeposited: number;
  totalBorrowed: number;
  utilizationRate: number;
  supplyApy: number;
  borrowApy: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  lastSync?: string;
}

export interface Counterparty {
  id: string;
  name: string;
  email: string;
  accountNumber?: string;
  routingNumber?: string;
}

export interface ExternalAccount {
  id: string;
  institutionName: string;
  accountType: string;
  mask: string;
  balance: number;
}

export interface BiometricData {
  registered: boolean;
  type?: 'fingerprint' | 'face_id' | 'fido2';
  lastUsed?: string;
}

export interface LoginAttempt {
  id: string;
  timestamp: string;
  ip: string;
  successful: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  model: string;
  role: string;
  status: 'active' | 'idle' | 'busy';
}

export interface SynapticVault {
  id: string;
  name: string;
  recordsCount: number;
  encryptionAlgorithm: string;
}

export interface MarqetaUser {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  startDate: string;
}

export interface MarqetaCard {
  token: string;
  userToken: string;
  cardProductToken: string;
  lastFour: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
}

export interface ComplianceRule {
  id: string;
  name: string;
  ruleType: string;
  action: 'ALERT' | 'BLOCK' | 'REQUIRE_REVIEW';
  enabled: boolean;
}

export interface Business {
  id: string;
  legalName: string;
  ein: string;
  incorporationDate: string;
}

export interface GamificationState {
  points: number;
  level: number;
  badges: string[];
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  connected: boolean;
}

export interface WebDriverStatus {
  connected: boolean;
  sessionCount: number;
}

export interface AIGoalPlan {
  goalId: string;
  recommendedMonthlySavings: number;
  steps: string[];
}

export interface RecurringContribution {
  id: string;
  goalId: string;
  amount: number;
  frequency: 'weekly' | 'monthly';
  nextDate: string;
}

export interface LinkedGoal {
  id: string;
  title: string;
  progress: number;
}

export interface Contribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
}

export interface DataSharingPolicy {
  id: string;
  partner: string;
  scope: string[];
  enabled: boolean;
}

export interface APIKey {
  id: string;
  name: string;
  keyMasked: string;
  created: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface SecurityAwarenessModule {
  id: string;
  title: string;
  completed: boolean;
}

export interface ThreatAlert {
  id: string;
  title: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
}

export interface SecurityScoreMetric {
  category: string;
  score: number;
  recommendation?: string;
}

export interface TransactionRule {
  id: string;
  condition: string;
  category: string;
}

export interface PlaidLinkSuccessMetadata {
  public_token: string;
  institution: {
    id: string;
    name: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id: string;
}

export type PlaidProduct = 'auth' | 'transactions' | 'identity' | 'assets' | 'investments' | 'liabilities';

export interface CitiAccount {
  accountId: string;
  displayAccountNumber: string;
  productName: string;
  accountDescription?: string;
  accountGroup: 'CREDITCARD' | 'SAVINGS' | 'CHECKING' | 'LOAN' | 'RETIREMENT' | 'INVESTMENT' | string;
  accountClassification?: string;
  balanceType: 'ASSET' | 'LIABILITY' | string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED' | string;
  currencyCode: string;
  
  // Balances
  currentBalance: number;
  availableBalance?: number;
  availableCredit?: number;
  creditLimit?: number;
  outstandingBalance?: number;
  
  // Rates & Interest
  purchasesAPR?: number;
  advancesAPR?: number;
  interestRate?: number;
  totalInterestAmount?: number;
  
  // Due & Statement info
  minimumDueAmount?: number;
  paymentDueDate?: string;
  lastStatementBalance?: number;
  lastStatementDate?: string;
  
  // Cash advances & Payments
  cashAdvanceLimit?: number;
  cashAdvanceAvailableAmount?: number;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
  
  lastUpdated: string;
  rawItem?: any;
}

export interface AccountGroupTotal {
  group: string;
  totalCurrentBalance: number;
  totalAvailableBalance?: number;
  currencyCode: string;
  accountCount: number;
}

export interface CitiTransaction {
  transactionId: string;
  accountId: string;
  productName: string;
  displayAccountNumber: string;
  transactionDate: string;
  postDate?: string;
  description: string;
  merchantName?: string;
  transactionType: 'DEBIT' | 'CREDIT';
  category: string;
  amount: number;
  currency: string;
  runningBalance?: number;
  referenceId: string;
  status: 'CLEARED' | 'PENDING';
}

export interface ApiConfig {
  url: string;
  bearerToken: string;
  clientId: string;
  uuid: string;
  mode: 'live' | 'sandbox_demo';
  autoRefreshInterval: number; // in seconds (0 = off, 15, 30, 60)
  hasEnvToken?: boolean;
  maskedToken?: string;
  configuredVars?: Record<string, boolean>;
  isEnvLoaded?: boolean;
}

export interface ApiResponseInfo {
  status: number;
  statusText: string;
  latencyMs: number;
  timestamp: string;
  headers?: Record<string, string>;
  rawData?: any;
  error?: string;
}

export interface CsvExportOptions {
  includeHeaders: boolean;
  delimiter: ',' | ';' | '\t';
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  exportType: 'transactions' | 'accounts' | 'both';
  selectedAccountIds: string[];
}

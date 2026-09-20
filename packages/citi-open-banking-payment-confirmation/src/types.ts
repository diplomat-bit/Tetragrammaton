export interface DebtorAccount {
  SchemeName: string;
  Identification: string;
  Name: string;
  SecondaryIdentification?: string;
}

export interface BalanceAmount {
  Amount: string;
  Currency: string;
}

export interface BalanceItem {
  Amount: BalanceAmount;
  CreditDebitIndicator: 'Credit' | 'Debit';
  Type: 'InterimAvailable' | 'ClosingBooked' | 'Expected' | 'OpeningBooked' | 'ForwardAvailable' | string;
  DateTime: string;
  SubType?: string;
}

export interface AccountBalanceDetails {
  AccountId?: string;
  Currency?: string;
  AvailableBalance?: BalanceItem;
  BookedBalance?: BalanceItem;
  AccountType?: string;
  AccountStatus?: string;
}

export interface ConsentData {
  ConsentId: string;
  CreationDateTime: string;
  Status: 'AwaitingAuthorisation' | 'Authorised' | 'Rejected' | 'Revoked' | 'Expired' | string;
  ExpirationDateTime: string;
  DebtorAccount: DebtorAccount;
  StatusUpdateDateTime?: string;
  AccountBalance?: AccountBalanceDetails;
  FundsConfirmationId?: string;
  FundsAvailable?: boolean;
  InstructedAmount?: BalanceAmount;
  Reference?: string;
}

export interface OpenBankingLinks {
  Self?: string;
  Balances?: string;
  First?: string;
  Prev?: string;
  Next?: string;
  Last?: string;
  [key: string]: string | undefined;
}

export interface OpenBankingMeta {
  TotalPages?: number;
  FirstAvailableDateTime?: string;
  [key: string]: any;
}

export interface OpenBankingResponse {
  Data?: ConsentData | any;
  Links?: OpenBankingLinks;
  Meta?: OpenBankingMeta;
  [key: string]: any;
}

export interface ProxyApiResponse {
  status: number;
  statusText: string;
  ok?: boolean;
  headers?: Record<string, string>;
  data?: OpenBankingResponse;
  rawText?: string;
  responseTimeMs: number;
  simulated?: boolean;
  error?: string;
  message?: string;
}

export interface RequestConfig {
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  token: string;
  financialId: string;
  customHeaders?: Record<string, string>;
  bodyJson?: string;
  debtorAccount: DebtorAccount;
  expirationHours: number;
  simulationMode: boolean;
}

export interface SavedHistoryItem {
  id: string;
  timestamp: number;
  consentId: string;
  debtorName: string;
  identification: string;
  status: string;
  selfUrl?: string;
  balanceAmount?: string;
  currency?: string;
  requestUrl: string;
  response: ProxyApiResponse;
}

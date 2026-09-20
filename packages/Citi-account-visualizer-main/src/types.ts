export interface CreditCardSummary {
  productName: string;
  productCode: string;
  displayAccountNumber: string;
  currencyCode: string;
  accountId: string;
  accountClassification: string;
  accountStatus: string;
  outstandingBalance: number;
  availableCredit: number;
  creditLimit: number;
  minimumDueAmount: number;
  alternateCurrencyCurrentBalance: number;
  cardHolderType: string;
}

export interface LoanSummary {
  productName: string;
  productCode: string;
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountClassification: string;
  accountStatus: string;
  originalPrincipalAmount: number;
  outstandingBalance: number;
  nextPaymentAmount: number;
  nextPaymentDate: string;
}

export interface SavingsSummary {
  productName: string;
  productCode: string;
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountClassification: string;
  accountStatus: string;
  currentBalance: number;
  availableBalance: number;
  localCurrencyCurrentBalance: number;
}

export interface CheckingSummary {
  productName: string;
  productCode: string;
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountClassification: string;
  accountStatus: string;
  currentBalance: number;
  availableBalance: number;
  localCurrencyCurrentBalance: number;
}

export interface InsurancePolicy {
  productName: string;
  productCode: string;
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountClassification: string;
  accountStatus: string;
  displayPolicyNumber: string;
  insuranceApplicationId: string;
  totalPremiumPaidAmount: number;
}

export interface CurrencyBalance {
  localCurrencyCode: string;
  localCurrencyBalanceAmount: number;
  foreignCurrencyCode: string;
  foreignCurrencyBalanceAmount: number;
}

export interface AccountGroup {
  accountGroup: string;
  accounts?: Array<{
    creditCardAccountSummary?: CreditCardSummary;
    loanAccountSummary?: LoanSummary;
    savingsAccountSummary?: SavingsSummary;
    checkingAccountSummary?: CheckingSummary;
  }>;
  insurancePolicies?: InsurancePolicy[];
  totalAvailableBalance?: CurrencyBalance;
  totalOutstandingBalance?: CurrencyBalance;
  totalCurrentBalance?: CurrencyBalance;
}

export interface CitiApiResponse {
  accountGroupSummary: AccountGroup[];
}

export interface AiInsights {
  executiveSummary: string;
  netWorthOverview: string;
  alerts: string[];
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
  portfolioHealthScore: number;
}

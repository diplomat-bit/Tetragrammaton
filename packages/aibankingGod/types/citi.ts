export interface EncryptedAccountRoutingNumber {
  encryptedAccountNumber: {
    encryptedPayload: {
      header: {
        zip?: string;
        alg: string;
        enc: string;
        kid: string;
        x5c: string[];
        cty?: string;
      };
      encrypted_key: string;
      iv: string;
      ciphertext: string;
      authTag: string;
      aad: string;
    };
  };
  routingNumber: string;
}

export interface AccountsGroupDetailsList {
  accountGroupDetails?: AccountGroupDetails[];
  customer?: {
    customerId: string;
  };
}

export interface AccountGroupDetails {
  accountGroup: 'CHECKING' | 'SAVINGS' | 'CREDITCARD' | 'LOAN' | 'LINEOFCREDIT' | 'BROKERAGE' | 'RETIREMENT';
  checkingAccountsDetails?: CheckingAccountDetailsList[];
  savingsAccountsDetails?: SavingsAccountDetailsList[];
  creditCardAccountsDetails?: CreditCardAccountDetailsList[];
  loanAccountsDetails?: LoanAccountDetailsList[];
  lineOfCreditAccountsDetails?: LineOfCreditAccountDetailsList[];
  brokerageAccountsDetails?: BrokerageAccountDetailsList[];
  retirementAccountsDetails?: RetirementAccountDetailsList[];
  totalCurrentBalance?: GroupBalance;
  totalAvailableBalance?: GroupBalance;
}

export interface GroupBalance {
  localCurrencyCode: string;
  localCurrencyBalanceAmount: number;
}

export interface CreditCardAccountDetailsList {
  productName: string;
  accountDescription: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  availableCredit?: number;
  creditLimit?: number;
  purchasesAPR?: number;
  minimumDueAmount?: number;
  paymentDueDate?: string;
  currentBalance?: number;
  lastStatementBalance?: number;
  lastStatementDate?: string;
  advancesAPR?: number;
  cashAdvanceLimit?: number;
  cashAdvanceAvailableAmount?: number;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
  ctdPurchaseBalanceAmount?: number;
  purchaseSpendLimitAmount?: number;
  remainingPurchaseSpendAmount?: number;
}

export interface CheckingAccountDetailsList {
  productName: string;
  accountNickname?: string;
  accountDescription: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance?: number;
  availableBalance?: number;
}

export interface SavingsAccountDetailsList {
  productName: string;
  accountNickname?: string;
  accountDescription: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance?: number;
  availableBalance?: number;
  maturityDate?: string;
  maturityTerm?: string;
}

export interface LoanAccountDetailsList {
  productName: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountDescription: string;
  accountNickname?: string;
  accountId: string;
  currencyCode: string;
  currentBalanceAmount?: number;
  creditAvailableAmount?: number;
  paymentDueAmount?: number;
  paymentDueDate?: string;
  autoPayFlag?: boolean;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
}

export interface LineOfCreditAccountDetailsList {
  productName: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountDescription: string;
  accountNickname?: string;
  accountId: string;
  currencyCode: string;
  accountStatus?: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  creditAvailableAmount?: number;
  currentBalanceAmount?: number;
  paymentDueAmount?: number;
  lastPaymentAmount?: number;
}

export interface RetirementAccountDetailsList {
  productName: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountDescription: string;
  accountId: string;
  accountValue?: number;
  accountStatus: 'ACTIVE';
  asOfDateTime?: string;
  retirementPlanComponents?: {
    componentName: string;
    currencyCode: string;
    currentTerms?: string;
    totalValueAmount: number;
    interestPaidYTD?: number;
    nextMaturityDate?: string;
  }[];
}

export interface BrokerageAccountDetailsList {
  accountId: string;
  displayAccountNumber: string;
  accountRegistrationType: string;
  accountTradingCapableFlag: boolean;
  balanceType: 'ASSET' | 'LIABILITY';
  productName?: string;
  accountDescription?: string;
  brokerageAccountTransactionTypes?: string[];
  accountHoldings?: AccountHolding[];
  totalPortfolioBalanceAmount?: number;
}

export interface AccountHolding {
  currencyCode: string;
  cusip: string;
  holdingCategory: string;
  quantity?: number;
  securityName?: string;
  asOfDateTime?: string;
  assetClass?: string;
  symbol?: string;
  price?: number;
  totalValueAmount?: number;
  changeInPercent?: number;
  changeInPrice?: number;
  changeInValue?: number;
  previousPrice?: number;
}

export interface GetAccountTransactionsResp {
  checkingAccountTransactions?: CheckingAccountTransaction[];
  savingsAccountTransactions?: SavingsAccountTransaction[];
  creditCardAccountTransactions?: CreditCardAccountTransaction[];
  loanAccountTransactions?: LoanAccountTransaction[];
  lineOfCreditAccountTransactions?: LineOfCreditAccountTransaction[];
  brokerageAccountTransactions?: BrokerageAccountTransaction[];
}

export interface CheckingAccountTransaction {
  accountId: string;
  checkNumber?: number;
  currencyCode: string;
  debitCreditMemo?: 'DEBIT' | 'CREDIT';
  displayAccountNumber?: string;
  transactionAmount: number;
  transactionDate: string;
  transactionDescription?: string;
  transactionDescriptionExtension?: string;
  transactionId?: string;
  transactionStatus?: 'PENDING' | 'POSTED';
  transactionType?: string;
}

export interface SavingsAccountTransaction extends CheckingAccountTransaction {}

export interface CreditCardAccountTransaction {
  accountId: string;
  currencyCode: string;
  debitCreditMemo?: 'DEBIT' | 'CREDIT';
  displayAccountNumber?: string;
  foreignCurrency?: number;
  merchantCategory?: string;
  merchantDescription?: string;
  merchantCountry?: string;
  transactionDate: string;
  transactionPostingDate?: string;
  transactionId?: string;
  transactionAmount: number;
  transactionDescription?: string;
  transactionStatus: 'PENDING' | 'BILLED' | 'UNBILLED' | 'UNPROCESSED_PAYMENTS';
  transactionType: string;
  memberName?: string;
}

export interface LoanAccountTransaction {
  accountId: string;
  displayAccountNumber?: string;
  transactionDate: string;
  transactionType: string;
  transactionAmount: number;
  debitCreditMemo?: 'DEBIT' | 'CREDIT';
  transactionId?: string;
  transactionDescription?: string;
  transactionDescriptionExtension?: string;
  transactionStatus?: 'PENDING' | 'POSTED';
  transactionPostingDate?: string;
  currencyCode: string;
  checkNumber?: string;
}

export interface LineOfCreditAccountTransaction extends LoanAccountTransaction {}

export interface BrokerageAccountTransaction {
  accountId: string;
  displayAccountNumber?: string;
  currencyCode: string;
  securityIdentifier?: {
    symbol?: string;
    cusip?: string;
  };
  assetClass: string;
  assetType: string;
  buySellIndicator: 'BUY' | 'SELL' | 'NONE';
  longActivityDescription: string;
  netAmount?: number;
  priceAmount?: number;
  principalAmount?: number;
  quantity?: number;
  settlementDate?: string;
  shortActivityDescription: string;
  tradeNumber?: string;
  tradeTransactionFlag?: string;
  transactionDateTime: string;
  transactionId: string;
  transactionType: string;
}

export interface CardUsageRequest {
  cardActivationCode: 'ACTIVATE' | 'DEACTIVATE';
}

export interface ReportLostStolenCardRequest {
  reason: string;
  comment?: string;
}

export interface ReportLostStolenCardResponse {
  referenceNumber: string;
}

export interface OverseasCardUsageRequest {
  activationType: 'PERMANENT' | 'TEMPORARY';
  startDate?: string;
  endDate?: string;
}

export interface CardListingResponse {
  cardDetails: Array<{
    cardId: string;
    displayCardNumber: string;
    cardType: string;
    cardExpiryDate: string;
    cardStatus: string;
  }>;
}

export interface SupplementaryCardRequest {
  supplementaryCardHolderName: string;
  dateOfBirth: string;
  relationship: string;
}

export interface SupplementaryCardResponse {
  applicationId: string;
}

export interface CreditLimitIncreaseRequest {
  requestedCreditLimit: number;
  limitType: 'PERMANENT' | 'TEMPORARY';
}

export interface CreditLimitIncreaseResponse {
  applicationId: string;
}

export interface InitiateApplicationProcessingUnsecuredLoanTopupRequest {
  loanAmount: number;
  tenor: number;
  loanPurpose: string;
}

export interface InitiateApplicationProcessingUnsecuredLoanTopupResponse {
  applicationId: string;
}

export interface RetrieveApplicationProcessingUnsecuredLoanTopupRepaymentScheduleResponse {
  loanAmount: number;
  tenor: number;
  installmentAmount: number;
  interestRate: number;
  totalRepaymentAmount: number;
}

export interface CardUsageConfirmationRequest {
  controlFlowId: string;
}

export interface ResetAtmPinRequest {
  newPin: string;
}

export interface ResetAtmPinConfirmationRequest {
  controlFlowId: string;
}

export interface ResetAtmPinConfirmationResponse {
  referenceNumber: string;
}

export interface CardOverseasUsageConfirmationRequest {
  controlFlowId: string;
}

export interface ExecuteApplicationProcessingUnsecuredLoanTopupOfferAcceptanceAndSubmissionRequest {
  offerId: string;
  acceptanceFlag: boolean;
}

export interface UpdateApplicationProcessingUnsecuredLoanTopupBackgroundScreeningRequest {
  employmentDetails?: any;
  financialDetails?: any;
}

export interface UpdateApplicationProcessingUnsecuredLoanTopupBackgroundScreeningResponse {
  applicationId: string;
  screeningStatus: string;
}

export interface RequestedLoanTopupDecision {
  requestedLoanAmount: number;
  requestedTenor: number;
}

export interface UpdateApplicationProcessingUnsecuredLoanTopupInPrincipalApprovalResponse {
  applicationId: string;
  approvalStatus: string;
}

export interface ApplicantSalaryAndContributionsUploadRequest {
  documentId: string;
  documentType: string;
}

export interface PresetAtmPinAddRequest {
  applicationId: string;
  atmPin: string;
}

export interface PresetAtmPinAddConfirmationRequest {
  controlFlowId: string;
}

export interface UnsecuredApplicationGenerateAndSendOtpRequest {
  deliveryChannel: 'SMS' | 'EMAIL';
}

export interface UnsecuredApplicationGenerateAndSendOtpResponse {
  controlFlowId: string;
}

export interface UnsecuredApplicationValidateOtpRequest {
  otp: string;
  controlFlowId: string;
}

export interface KbaQuestionnaireResponse {
  controlFlowId: string;
  questions: Array<{
    questionId: string;
    questionText: string;
    answers: Array<{
      answerId: string;
      answerText: string;
    }>;
  }>;
}

export interface KbaSubmissionRequest {
  controlFlowId: string;
  answers: Array<{
    questionId: string;
    answerId: string;
  }>;
}

export interface KbaSubmissionResponse {
  status: string;
}

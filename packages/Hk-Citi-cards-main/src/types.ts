export interface CardFunctionAllowed {
  cardFunction: string;
}

export interface TransactionLimitConfig {
  atmTransactionLimitToggleIndicator?: 'A' | 'D' | string;
  atmTransactionLimitAmount?: number;
  contactlessTxnLimitToggleIndicator?: 'A' | 'D' | string;
  contactlessTransactionLimitAmount?: number;
  contactPosTxnLimitToggleIndicator?: 'A' | 'D' | string;
  contactPosTransactionLimitAmount?: number;
  nonPosTxnLimitToggleIndicator?: 'A' | 'D' | string;
  nonPosTransactionLimitAmount?: number;
}

export interface PartnerCardDetail {
  cardId: string;
  displayCardNumber: string;
  localCardActivationIndicator?: string;
  overseasCardActivationIndicator?: string;
  perpetualActivationFlag?: boolean;
  overseasCardActivationStartDate?: string;
  overseasCardActivationEndDate?: string;
  currentCreditLimitAmount?: number;
  maximumPermanentCreditLimitAmount?: number;
  maximumTemporaryCreditLimitAmount?: number;
  subCardType?: string;
  cardHolderType?: string;
  cardIssueReason?: string;
  cardFunctionsAllowed?: CardFunctionAllowed[];
  embossName?: string;
  organization?: string;
  logo?: string;
  productName?: string;
  primaryCardId?: string;
  displayPrimaryCardNumber?: string;
  cardPlasticType?: string;
  currentContactlessWthoutPinPmtLimit?: number;
  maxContactlessWithoutPinPmtLimit?: number;
  domesticTransaction?: TransactionLimitConfig;
  internationalTransaction?: TransactionLimitConfig;
  posSpendingLimitAmount?: number;
  dailyAtmWithdrawalLimitAmount?: number;
  internetPurchaseLimitAmount?: number;
  cashCreditLimitAmount?: number;
}

export interface CitiCardsResponse {
  partnerCardDetails?: PartnerCardDetail[];
  [key: string]: any;
}

export interface ApiResponseState {
  success: boolean;
  status: number;
  statusText: string;
  durationMs?: number;
  requestUrl?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  data?: CitiCardsResponse;
  error?: string;
  message?: string;
  isMock?: boolean;
}

export interface RequestHistoryItem {
  id: string;
  timestamp: string;
  status: number;
  statusText: string;
  durationMs: number;
  uuid: string;
  cardCount: number;
  isMock?: boolean;
  response: ApiResponseState;
}

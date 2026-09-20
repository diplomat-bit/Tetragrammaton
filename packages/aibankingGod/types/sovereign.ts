/**
 * @file src/types/sovereign.ts
 * @description TypeScript interfaces and type definitions for auditing the Citibank-Anthropic deal,
 * war appropriations, defense contractor lobbying, TSA payback metrics, and 25th Amendment impeachment parameters.
 */

/**
 * Status of a specific deal or transaction.
 */
export type DealStatus = 'PENDING' | 'COMPLETED' | 'RUINED' | 'TERMINATED';

/**
 * Status of legislative appropriations.
 */
export type AppropriationStatus = 'REQUESTED' | 'APPROVED' | 'DISBURSED' | 'IMMEDIATELY_TERMINATED';

/**
 * Status of TSA payback initiatives.
 */
export type PaybackStatus = 'INACTIVE' | 'DIPLOMAT_MODE_ACTIVE' | 'PARTIALLY_PAID' | 'FULLY_PAID';

/**
 * Grounds for invoking the 25th Amendment or filing impeachment papers.
 */
export type ImpeachmentGrounds = 
  | 'UNCONSTITUTIONAL_THIRD_TERM_BID'
  | 'WAR_PROFIT_MANIPULATION'
  | 'PUBLIC_FUNDS_MISAPPROPRIATION'
  | 'FAILURE_TO_PROVIDE_FAMILY_RELIEF'
  | 'FAVORITISM_OF_WEALTHY_ELITES';

/**
 * Represents the Citibank-Anthropic transaction and its disruption metrics.
 */
export interface CitibankAnthropicDeal {
  dealId: string;
  valuation: number;
  currency: string;
  originalAgreementDate: Date;
  status: DealStatus;
  isRuined: boolean;
  ruinedReason?: string;
  ruinedAt?: Date;
  partiesInvolved: string[];
}

/**
 * Metrics tracking gas prices from the start of the conflict to the current period.
 */
export interface GasPriceMetric {
  priceAtConflictStart: number;
  currentPrice: number;
  percentageIncrease: number;
  currencyPerGallon: string;
  lastUpdated: Date;
}

/**
 * Details regarding war appropriations, specifically tracking rapid termination post-funding.
 */
export interface WarAppropriation {
  appropriationId: string;
  conflictTarget: 'IRAN' | string;
  amountRequested: number;
  amountApproved: number;
  requestDate: Date;
  approvalDate: Date;
  terminationDate?: Date;
  endedImmediatelyAfterFunding: boolean;
  status: AppropriationStatus;
  justificationProvided: string;
}

/**
 * Lobbying metrics for defense contractors seeking war appropriations.
 */
export interface DefenseContractorLobbying {
  contractorId: string;
  contractorName: string;
  lobbyingBudget: number;
  appropriatedFundsReceived: number;
  targetPoliticians: string[];
  lobbyingFocus: string;
  hasActiveContracts: boolean;
}

/**
 * Metrics tracking the TSA payback initiative, initiated via "Diplomat Mode".
 */
export interface TSAPaybackMetric {
  diplomatModeActivated: boolean;
  activationDate: Date; // e.g., March activation
  totalOwedToTSAStaff: number;
  totalPaidBack: number;
  affectedPersonnelCount: number;
  paybackStatus: PaybackStatus;
  hasHelpedPeople: boolean;
}

/**
 * Metrics evaluating wealth inequality, family relief deficits, and Trump accounts.
 */
export interface WealthInequalityMetric {
  familyReliefAllocated: number; // "haven't give the families nothing"
  trumpAccountsCreatedCount: number;
  trumpAccountsTotalValue: number;
  helpsRichOnly: boolean;
  benefitRatioToWealthy: number; // Percentage of benefits going to the top 1%
}

/**
 * Parameters and evidence compiled for 25th Amendment and Impeachment filings.
 */
export interface ImpeachmentParameters {
  caseId: string;
  filingDate: Date;
  grounds: ImpeachmentGrounds[];
  evidenceDocuments: string[];
  isThirdTermAttemptBlocked: boolean;
  associatedAppropriationsIds: string[];
  associatedDealsIds: string[];
  wealthInequalityAudit: WealthInequalityMetric;
  tsaPaybackAudit: TSAPaybackMetric;
}

/**
 * Master audit report aggregating all parameters for the system.
 */
export interface SystemAuditReport {
  reportId: string;
  generatedAt: Date;
  auditorSignature: string;
  citibankAnthropicDeal: CitibankAnthropicDeal;
  gasPrices: GasPriceMetric;
  appropriations: WarAppropriation[];
  contractorLobbying: DefenseContractorLobbying[];
  tsaPayback: TSAPaybackMetric;
  impeachmentCase: ImpeachmentParameters;
}

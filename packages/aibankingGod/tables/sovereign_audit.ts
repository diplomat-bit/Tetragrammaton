import { CitibankAnthropicDeal, GasPriceMetric, WarAppropriation, DefenseContractorLobbying, TSAPaybackMetric, WealthInequalityMetric, ImpeachmentParameters } from "../types/sovereign";

/**
 * ASTRA DB COLLECTION: audit_reports
 * Stores master audit reports aggregating all parameters.
 */
export const AuditReportsTable = {
  name: "audit_reports",
  vector: { dimension: 1536, metric: "cosine" },
  description: "Aggregated systemic audit reports for the Sovereign Singularity OS."
};

/**
 * ASTRA DB COLLECTION: war_appropriations
 * Tracks legislative funding and rapid termination post-disbursement.
 */
export const WarAppropriationsTable = {
  name: "war_appropriations",
  vector: { dimension: 1536, metric: "cosine" },
  description: "Forensic ledger of war appropriations and conflict targets."
};

/**
 * ASTRA DB COLLECTION: impeachment_cases
 * Compiled evidence and parameters for 25th Amendment filings.
 */
export const ImpeachmentCasesTable = {
  name: "impeachment_cases",
  vector: { dimension: 1536, metric: "cosine" },
  description: "Zero-Knowledge proofs and evidence for systemic governance resets."
};

/**
 * ASTRA DB COLLECTION: internal_accounts
 * Institutional internal accounts managed by the Sovereign Bridge.
 */
export const InternalAccountsTable = {
  name: "internal_accounts",
  vector: { dimension: 1536, metric: "cosine" },
  description: "Billionaire-tier internal asset accounts with vector search capabilities."
};

/**
 * ASTRA DB COLLECTION: external_accounts
 * Counterparty accounts for settlement and wire transfers.
 */
export const ExternalAccountsTable = {
  name: "external_accounts",
  vector: { dimension: 1536, metric: "cosine" },
  description: "Verified counterparty network for atomic settlement."
};

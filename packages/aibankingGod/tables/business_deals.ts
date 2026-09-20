/**
 * ASTRA DB COLLECTION: business_deals
 * Historical and contemporary business acquisitions and mergers.
 */
export const BusinessDealsTable = {
  name: "business_deals",
  vector: { dimension: 1536, metric: "cosine" },
  description: "Knowledge graph of historical capital trajectories and M&A synergy scores."
};

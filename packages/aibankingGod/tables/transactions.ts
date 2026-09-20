/**
 * ASTRA DB COLLECTION: transactions
 * The unified ledger of all Sovereign transactions.
 */
export const TransactionsTable = {
  name: "transactions",
  vector: { dimension: 1536, metric: "cosine" },
  description: "Deterministic metal ledger for every atomic movement of value."
};

/**
 * ASTRA DB COLLECTION: payment_orders
 * Instructions for ACH, Wire, and RTP payments.
 */
export const PaymentOrdersTable = {
  name: "payment_orders",
  vector: { dimension: 1536, metric: "cosine" },
  description: "Signed ISO20022 payment instructions for the Sovereign OS."
};

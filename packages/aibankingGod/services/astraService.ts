import { DataAPIClient } from "@datastax/astra-db-ts";

export class AstraService {
  private static client: DataAPIClient | null = null;

  private static getClient(): DataAPIClient {
    if (!this.client) {
      this.client = new DataAPIClient();
    }
    return this.client;
  }

  public static async listCollections() {
    const db = await this.getDb();
    return await db.listCollections();
  }

  public static async createCollection(name: string, options?: any) {
    const db = await this.getDb();
    try {
      console.log(`Creating collection: ${name}...`);
      return await db.createCollection(name, options);
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        console.log(`Collection ${name} already exists.`);
        return { status: "exists" };
      }
      throw error;
    }
  }

  public static async createAllTables() {
    const collections = [
      { name: "internal_accounts", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "external_accounts", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "payment_orders", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "transactions", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "business_deals", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "war_appropriations", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "lobbying_metrics", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "tsa_payback", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "impeachment_cases", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "audit_reports", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "ach_settings", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "api_keys", options: { vector: { dimension: 1536, metric: "cosine" } } },
      { name: "aibank", options: { vector: { dimension: 1536, metric: "cosine" } } }
    ];

    const results = [];
    for (const col of collections) {
      const res = await this.createCollection(col.name, col.options);
      results.push({ name: col.name, result: res });
    }
    return results;
  }

  private static async getDb() {
    const endpoint = process.env.ASTRA_DB_API_ENDPOINT;
    const token = process.env.ASTRA_DB_APPLICATION_TOKEN;

    if (!endpoint || !token) {
      throw new Error("ASTRA_DB_API_ENDPOINT or ASTRA_DB_APPLICATION_TOKEN not configured");
    }

    return this.getClient().db(endpoint, { token });
  }

  public static async executeQuery(collectionName: string, filterOrQuery: any) {
    try {
      const db = await this.getDb();
      const col = db.collection(collectionName || "aibank");
      const queryObj = typeof filterOrQuery === "string" ? {} : (filterOrQuery || {});
      const cursor = col.find(queryObj);
      return await cursor.toArray();
    } catch (e: any) {
      console.warn(`Astra executeQuery fallback: ${e.message}`);
      return [];
    }
  }

  public static async indexDocument(collectionName: string, document: any) {
    try {
      const db = await this.getDb();
      const col = db.collection(collectionName || "aibank");
      return await col.insertOne(document || {});
    } catch (e: any) {
      console.warn(`Astra indexDocument fallback: ${e.message}`);
      return { insertedId: `doc_${Date.now()}` };
    }
  }

  public static async checkHealth() {
    try {
      await this.listCollections();
      return { status: "healthy" };
    } catch (error: any) {
      return { status: "unhealthy", error: error.message };
    }
  }
}

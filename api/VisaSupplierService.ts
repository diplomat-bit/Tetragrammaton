

// --- CONSOLIDATED FROM: ./services/VisaSupplierService.ts ---

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import * as crypto from "crypto";

const Type = SchemaType;
type Schema = any;

/**
 * Enterprise-grade interfaces representing Visa Supplier Management entities.
 */
export interface VisaSupplier {
  id: string;
  name: string;
  taxId: string; // EIN or SSN (encrypted at rest in production)
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentTerms: string; // e.g., "Net 30", "Net 60", "Due on Receipt"
  status: "ACTIVE" | "INACTIVE" | "PENDING_ONBOARDING";
  preferredPaymentMethod: "CARD" | "ACH" | "WIRE" | "CHECK";
  acceptanceCapabilities?: {
    cardAcceptance: boolean;
    achAcceptance: boolean;
    wireAcceptance: boolean;
    checkAcceptance: boolean;
    confidenceScore: number;
    notes: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierCardAccount {
  id: string;
  supplierId: string;
  cardNumberLast4: string;
  virtualCardId: string; // Reference to Visa Virtual Card API (Visa Payables SDK)
  creditLimit: number;
  availableBalance: number;
  status: "ACTIVE" | "SUSPENDED" | "TERMINATED";
  expirationDate: string; // MM/YY
  billingAddress: VisaSupplier["address"];
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierMatchResult {
  matched: boolean;
  existingSupplierId?: string;
  confidenceScore: number;
  reasoning: string;
}

export interface OnboardingCommunication {
  supplierId: string;
  subject: string;
  body: string;
  channel: "EMAIL" | "PORTAL_NOTIFICATION";
  generatedAt: Date;
}

export class VisaSupplierService {
  private genAI: GoogleGenerativeAI;
  private modelName = "gemini-1.5-pro";

  // In-memory store simulating a secure database with indexing capabilities
  private suppliers: Map<string, VisaSupplier> = new Map();
  private cardAccounts: Map<string, SupplierCardAccount> = new Map();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      console.warn(
        "VisaSupplierService: GEMINI_API_KEY is not set. Gemini integrations will fallback to mock responses."
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.seedMockData();
  }

  /**
   * Seeds initial commercial-grade mock data for testing and demonstration.
   */
  private seedMockData() {
    const mockSuppliers: VisaSupplier[] = [
      {
        id: "sup-001",
        name: "Acme Industrial Supplies",
        taxId: "XX-XXX1234",
        email: "billing@acmeindustrial.com",
        phone: "+1-555-0199",
        address: {
          street: "100 Industrial Parkway",
          city: "Chicago",
          state: "IL",
          postalCode: "60601",
          country: "USA",
        },
        paymentTerms: "Net 30",
        status: "ACTIVE",
        preferredPaymentMethod: "CARD",
        acceptanceCapabilities: {
          cardAcceptance: true,
          achAcceptance: true,
          wireAcceptance: false,
          checkAcceptance: true,
          confidenceScore: 0.98,
          notes: "Verified card acceptance via automated onboarding portal.",
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "sup-002",
        name: "Global Logistics Corp",
        taxId: "XX-XXX5678",
        email: "accounts@globallogistics.com",
        phone: "+1-555-0144",
        address: {
          street: "450 Shipping Lane",
          city: "Seattle",
          state: "WA",
          postalCode: "98101",
          country: "USA",
        },
        paymentTerms: "Net 15",
        status: "ACTIVE",
        preferredPaymentMethod: "ACH",
        acceptanceCapabilities: {
          cardAcceptance: false,
          achAcceptance: true,
          wireAcceptance: true,
          checkAcceptance: false,
          confidenceScore: 0.92,
          notes: "Prefers direct bank transfers; card acceptance requires a 3% surcharge.",
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ];

    mockSuppliers.forEach((s) => this.suppliers.set(s.id, s));

    // Seed a Visa Virtual Card Account for Acme
    const mockCard: SupplierCardAccount = {
      id: "vca-001",
      supplierId: "sup-001",
      cardNumberLast4: "4112",
      virtualCardId: "vcard_att_882910293",
      creditLimit: 50000.0,
      availableBalance: 50000.0,
      status: "ACTIVE",
      expirationDate: "12/28",
      billingAddress: mockSuppliers[0].address,
      createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    };

    this.cardAccounts.set(mockCard.id, mockCard);
  }

  /**
   * Lists all suppliers (synchronous & async compatible).
   */
  public getAllSuppliers(): VisaSupplier[] {
    return Array.from(this.suppliers.values());
  }

  public async listSuppliers(): Promise<VisaSupplier[]> {
    return this.getAllSuppliers();
  }

  /**
   * Registers/creates a new supplier record.
   */
  public registerSupplier(supplierData: any): VisaSupplier {
    const id = supplierData.id || `sup-${uuidv4().substring(0, 8)}`;
    const newSupplier: VisaSupplier = {
      name: supplierData.name || 'Unnamed Supplier',
      taxId: supplierData.taxId || 'XX-XXX0000',
      email: supplierData.email || 'supplier@example.com',
      phone: supplierData.phone || '+1-555-0100',
      address: supplierData.address || {
        street: '100 Business Way',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      },
      paymentTerms: supplierData.paymentTerms || 'Net 30',
      status: supplierData.status || 'ACTIVE',
      preferredPaymentMethod: supplierData.preferredPaymentMethod || 'CARD',
      acceptanceCapabilities: supplierData.acceptanceCapabilities || {
        cardAcceptance: true,
        achAcceptance: true,
        wireAcceptance: true,
        checkAcceptance: true,
        confidenceScore: 0.95,
        notes: 'Verified partner'
      },
      ...supplierData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  public async createSupplier(supplierData: Omit<VisaSupplier, "id" | "createdAt" | "updatedAt">): Promise<VisaSupplier> {
    return this.registerSupplier(supplierData);
  }

  /**
   * Issues a virtual card for a supplier
   */
  public async issueCard(supplierId: string, creditLimit: number = 25000): Promise<SupplierCardAccount> {
    return this.createSupplierCardAccount(supplierId, creditLimit);
  }

  public async issueVirtualCard(supplierId: string, creditLimit: number = 25000, currency: string = "USD", validDays: number = 30): Promise<SupplierCardAccount> {
    return this.createSupplierCardAccount(supplierId, creditLimit);
  }

  public evaluateEarlyPaymentDiscount(supplierId: string, invoiceAmount: number, daysEarly: number = 10): any {
    const discountRate = 0.02;
    const discountAmount = Number((invoiceAmount * discountRate).toFixed(2));
    const netPayable = Number((invoiceAmount - discountAmount).toFixed(2));
    const annualizedApr = Number(((discountRate / Math.max(1, (30 - daysEarly))) * 365 * 100).toFixed(2));
    return {
      supplierId,
      invoiceAmount,
      daysEarly,
      discountRate,
      discountAmount,
      netPayable,
      annualizedApr,
      recommended: daysEarly >= 5,
    };
  }

  /**
   * Retrieves a supplier by ID.
   */
  public getSupplier(id: string): VisaSupplier | null {
    return this.suppliers.get(id) || null;
  }

  /**
   * Updates an existing supplier.
   */
  public async updateSupplier(id: string, updates: Partial<Omit<VisaSupplier, "id" | "createdAt" | "updatedAt">>): Promise<VisaSupplier> {
    const existing = this.suppliers.get(id);
    if (!existing) {
      throw new Error(`Supplier with ID ${id} not found.`);
    }

    const updatedSupplier: VisaSupplier = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  /**
   * Disables a supplier (soft delete / status change).
   */
  public async disableSupplier(id: string): Promise<VisaSupplier> {
    return this.updateSupplier(id, { status: "INACTIVE" });
  }

  /**
   * Manages Supplier Card Accounts (Visa Virtual Cards).
   * Generates a virtual card account linked to a supplier for automated payables.
   */
  public async createSupplierCardAccount(
    supplierId: string,
    creditLimit: number,
    billingAddress?: VisaSupplier["address"]
  ): Promise<SupplierCardAccount> {
    const supplier = this.suppliers.get(supplierId);
    if (!supplier) {
      throw new Error(`Supplier with ID ${supplierId} not found.`);
    }

    // Simulate calling Visa Developer APIs (Visa Payables Automation / Virtual Card API)
    const virtualCardId = `vcard_${crypto.randomBytes(8).toString("hex")}`;
    const cardNumberLast4 = Math.floor(1000 + Math.random() * 9000).toString();
    const id = `vca-${uuidv4().substring(0, 8)}`;

    const cardAccount: SupplierCardAccount = {
      id,
      supplierId,
      cardNumberLast4,
      virtualCardId,
      creditLimit,
      availableBalance: creditLimit,
      status: "ACTIVE",
      expirationDate: "12/29",
      billingAddress: billingAddress || supplier.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.cardAccounts.set(id, cardAccount);
    return cardAccount;
  }

  /**
   * Retrieves a card account by ID.
   */
  public async getCardAccount(id: string): Promise<SupplierCardAccount | null> {
    return this.cardAccounts.get(id) || null;
  }

  /**
   * Retrieves all card accounts associated with a supplier.
   */
  public async getCardAccountsBySupplier(supplierId: string): Promise<SupplierCardAccount[]> {
    return Array.from(this.cardAccounts.values()).filter((acc) => acc.supplierId === supplierId);
  }

  /**
   * Updates the credit limit of a supplier's virtual card account.
   */
  public async updateCardLimit(id: string, newLimit: number): Promise<SupplierCardAccount> {
    const card = this.cardAccounts.get(id);
    if (!card) {
      throw new Error(`Card account with ID ${id} not found.`);
    }

    const difference = newLimit - card.creditLimit;
    const updatedCard: SupplierCardAccount = {
      ...card,
      creditLimit: newLimit,
      availableBalance: Math.max(0, card.availableBalance + difference),
      updatedAt: new Date(),
    };

    this.cardAccounts.set(id, updatedCard);
    return updatedCard;
  }

  /**
   * Suspends or terminates a supplier card account.
   */
  public async updateCardStatus(id: string, status: SupplierCardAccount["status"]): Promise<SupplierCardAccount> {
    const card = this.cardAccounts.get(id);
    if (!card) {
      throw new Error(`Card account with ID ${id} not found.`);
    }

    const updatedCard: SupplierCardAccount = {
      ...card,
      status,
      updatedAt: new Date(),
    };

    this.cardAccounts.set(id, updatedCard);
    return updatedCard;
  }

  /**
   * INTEGRATION: Gemini AI Supplier Matching
   * Analyzes incoming raw supplier data against existing records to prevent duplicates
   * and ensure clean ledger records.
   */
  public async matchSupplier(newSupplierData: Partial<VisaSupplier>): Promise<SupplierMatchResult> {
    const existingList = Array.from(this.suppliers.values());

    if (!process.env.GEMINI_API_KEY) {
      // Fallback matching logic
      const match = existingList.find(
        (s) =>
          s.name.toLowerCase().includes(newSupplierData.name?.toLowerCase() || "") ||
          s.taxId === newSupplierData.taxId
      );
      return {
        matched: !!match,
        existingSupplierId: match?.id,
        confidenceScore: match ? 0.95 : 0.0,
        reasoning: match
          ? `Fallback match found based on name/taxId similarity with ${match.name}.`
          : "No fallback match found.",
      };
    }

    try {
      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          matched: { type: Type.BOOLEAN, description: "True if a duplicate or highly similar supplier exists." },
          existingSupplierId: { type: Type.STRING, description: "The ID of the matched existing supplier, if any." },
          confidenceScore: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0." },
          reasoning: { type: Type.STRING, description: "Detailed explanation of the matching decision." },
        },
        required: ["matched", "confidenceScore", "reasoning"],
      };

      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
        },
      });

      const prompt = `
        You are an expert system auditing corporate supplier records for a Visa commercial payables platform.
        Analyze the incoming supplier data and compare it against the list of existing suppliers to detect duplicates,
        subsidiaries, or parent companies.

        Incoming Supplier Data:
        ${JSON.stringify(newSupplierData, null, 2)}

        Existing Suppliers:
        ${JSON.stringify(existingList, null, 2)}

        Determine if there is a match. Provide the confidence score and reasoning.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText) as SupplierMatchResult;
    } catch (error) {
      console.error("VisaSupplierService.matchSupplier failed:", error);
      throw new Error("Failed to perform AI-driven supplier matching.");
    }
  }

  /**
   * INTEGRATION: Gemini AI Payment Acceptance Capability Analysis
   * Parses unstructured supplier data (e.g., website text, email threads, onboarding questionnaires)
   * to determine if they accept Visa commercial cards, ACH, wire, or check.
   */
  public async analyzePaymentAcceptance(supplierRawText: string): Promise<NonNullable<VisaSupplier["acceptanceCapabilities"]>> {
    if (!process.env.GEMINI_API_KEY) {
      return {
        cardAcceptance: true,
        achAcceptance: true,
        wireAcceptance: true,
        checkAcceptance: false,
        confidenceScore: 0.8,
        notes: "Fallback analysis: Assumed standard digital payment acceptance.",
      };
    }

    try {
      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          cardAcceptance: { type: Type.BOOLEAN, description: "Does the supplier accept credit/debit cards?" },
          achAcceptance: { type: Type.BOOLEAN, description: "Does the supplier accept ACH transfers?" },
          wireAcceptance: { type: Type.BOOLEAN, description: "Does the supplier accept wire transfers?" },
          checkAcceptance: { type: Type.BOOLEAN, description: "Does the supplier accept paper checks?" },
          confidenceScore: { type: Type.NUMBER, description: "Confidence score of this analysis (0.0 to 1.0)." },
          notes: { type: Type.STRING, description: "Summary of findings, including any surcharges or payment terms mentioned." },
        },
        required: ["cardAcceptance", "achAcceptance", "wireAcceptance", "checkAcceptance", "confidenceScore", "notes"],
      };

      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
        },
      });

      const prompt = `
        You are a financial intelligence agent analyzing supplier onboarding documents, emails, or website scrapes.
        Extract their payment acceptance capabilities, specifically focusing on whether they accept Visa Commercial Cards,
        ACH, Wire, or Check. Note any payment terms, processing fees, or surcharges mentioned.

        Raw Supplier Text:
        """
        ${supplierRawText}
        """
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText) as NonNullable<VisaSupplier["acceptanceCapabilities"]>;
    } catch (error) {
      console.error("VisaSupplierService.analyzePaymentAcceptance failed:", error);
      throw new Error("Failed to analyze supplier payment acceptance capabilities.");
    }
  }

  /**
   * INTEGRATION: Gemini AI Automated Onboarding Communications
   * Generates highly professional, personalized onboarding communications based on the supplier's
   * profile, preferred payment methods, and issued Visa Virtual Card accounts.
   */
  public async generateOnboardingCommunication(
    supplierId: string,
    channel: "EMAIL" | "PORTAL_NOTIFICATION" = "EMAIL"
  ): Promise<OnboardingCommunication> {
    const supplier = this.suppliers.get(supplierId);
    if (!supplier) {
      throw new Error(`Supplier with ID ${supplierId} not found.`);
    }

    const cards = await this.getCardAccountsBySupplier(supplierId);
    const activeCard = cards.find((c) => c.status === "ACTIVE");

    if (!process.env.GEMINI_API_KEY) {
      return {
        supplierId,
        subject: `Onboarding Welcome - ${supplier.name}`,
        body: `Dear ${supplier.name} Team,\n\nWelcome to our Visa Commercial Payables network. We have set up your profile with payment terms: ${supplier.paymentTerms}. Preferred payment method: ${supplier.preferredPaymentMethod}.\n\nBest regards,\nCommercial Accounts Team`,
        channel,
        generatedAt: new Date(),
      };
    }

    try {
      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING, description: "The subject line of the email or title of the notification." },
          body: { type: Type.STRING, description: "The complete, professionally formatted body text." },
        },
        required: ["subject", "body"],
      };

      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
        },
      });

      const prompt = `
        You are a professional corporate communications manager for a major enterprise using Visa Commercial Payables.
        Write a highly polished, professional onboarding communication to a newly registered supplier.
        
        Supplier Details:
        - Name: ${supplier.name}
        - Preferred Payment Method: ${supplier.preferredPaymentMethod}
        - Payment Terms: ${supplier.paymentTerms}
        - Address: ${supplier.address.street}, ${supplier.address.city}, ${supplier.address.state}
        
        Visa Virtual Card Account Issued: ${activeCard ? "YES" : "NO"}
        ${
          activeCard
            ? `- Virtual Card Last 4: ${activeCard.cardNumberLast4}\n- Credit Limit: $${activeCard.creditLimit}`
            : ""
        }

        Channel: ${channel}

        Tailor the tone to be welcoming, secure, and clear. If a Visa Virtual Card has been issued, explain how they can securely receive payments via this card for future invoices. Do not include actual raw card numbers or sensitive credentials.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText) as { subject: string; body: string };

      return {
        supplierId,
        subject: parsed.subject,
        body: parsed.body,
        channel,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error("VisaSupplierService.generateOnboardingCommunication failed:", error);
      throw new Error("Failed to generate automated onboarding communication.");
    }
  }
}

export const visaSupplierService = new VisaSupplierService();
export default visaSupplierService;
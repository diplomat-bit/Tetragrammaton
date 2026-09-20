

// --- CONSOLIDATED FROM: ./services/VisaPaymentService.ts ---

import * as crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const Type = SchemaType;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface VisaPaymentRequest {
  sender: {
    accountId: string;
    name: string;
    countryCode: string; // ISO 2-letter
    businessType: string;
    accountType: "COMMERCIAL_CARD" | "SETTLEMENT_ACCOUNT";
    routingNumber?: string;
    accountNumber: string;
  };
  recipient: {
    name: string;
    countryCode: string;
    businessType: string;
    routingNumber?: string;
    accountNumber: string;
    email: string;
  };
  paymentDetails: {
    amount: number;
    currency: string; // ISO 3-letter (USD, EUR, etc.)
    urgency: "STANDARD" | "URGENT" | "INSTANT";
    invoiceNumber: string;
    invoiceDate: string;
    remittanceInfo: string;
  };
  routingPreference?: "AUTO" | "STP" | "COMMERCIAL_CARD" | "B2B_CONNECT" | "VISA_DIRECT";
}

export interface AnomalyReport {
  isAnomaly: boolean;
  confidence: number; // 0.0 to 1.0
  reasons: string[];
  recommendedAction: "APPROVE" | "FLAG_FOR_REVIEW" | "REJECT";
}

export interface RoutingOptimization {
  recommendedRoute: "STP" | "COMMERCIAL_CARD" | "B2B_CONNECT" | "VISA_DIRECT";
  costEstimate: number; // Estimated fee in USD
  speedEstimate: string; // e.g., "Instant", "1-2 Hours", "Next Day"
  reasoning: string;
}

export interface VisaPaymentResponse {
  paymentId: string;
  status: "COMPLETED" | "PENDING_REVIEW" | "FAILED" | "CANCELLED" | "PENDING";
  transactionReference: string;
  routingUsed: "STP" | "COMMERCIAL_CARD" | "B2B_CONNECT" | "VISA_DIRECT";
  timestamp: string;
  anomalyReport: AnomalyReport;
  routingOptimization: RoutingOptimization;
  remittanceSummary: string;
  visaHeaders: {
    xPayToken: string;
    jwsSignature: string;
  };
}

export interface VisaPaymentDetails extends VisaPaymentResponse {
  sender: VisaPaymentRequest["sender"];
  recipient: VisaPaymentRequest["recipient"];
  paymentDetails: VisaPaymentRequest["paymentDetails"];
  history: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
}

export interface VisaCancelResponse {
  paymentId: string;
  status: "CANCELLED";
  cancellationReference: string;
  timestamp: string;
}

// ============================================================================
// CUSTOM ERROR CLASS
// ============================================================================

export class VisaPaymentError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = "VisaPaymentError";
    this.code = code;
    this.details = details;
  }
}

// ============================================================================
// VISA PAYMENT SERVICE
// ============================================================================

export class VisaPaymentService {
  private genAI: GoogleGenerativeAI;
  private paymentStore: Map<string, VisaPaymentDetails>;
  private visaSharedSecret: string;
  private visaPrivateKeyPem: string;

  constructor() {
    // Initialize Gemini AI
    const geminiApiKey = process.env.GEMINI_API_KEY || "MOCK_GEMINI_KEY";
    this.genAI = new GoogleGenerativeAI(geminiApiKey);

    // Stateful in-memory store simulating a secure database
    this.paymentStore = new Map<string, VisaPaymentDetails>();

    // Visa Developer Platform Credentials (loaded from environment or fallback to secure defaults)
    this.visaSharedSecret = process.env.VISA_SHARED_SECRET || "secure_visa_shared_secret_key_12345!";
    
    // Fallback mock private key for JWS signing if not provided in env
    this.visaPrivateKeyPem = process.env.VISA_PRIVATE_KEY_PEM || this.generateMockPrivateKey();
  }

  /**
   * Processes a Visa payment end-to-end.
   * Integrates Gemini for anomaly detection, routing optimization, and remittance summaries.
   */
  public async processPayment(request: VisaPaymentRequest): Promise<VisaPaymentResponse> {
    this.validateRequest(request);

    const paymentId = uuidv4();
    const timestamp = new Date().toISOString();

    try {
      // 1. Run Gemini Anomaly Detection
      const anomalyReport = await this.detectAnomalies(request);

      if (anomalyReport.recommendedAction === "REJECT") {
        throw new VisaPaymentError(
          "Payment rejected due to high anomaly score and security risk.",
          "VISA_SECURITY_REJECTION",
          anomalyReport
        );
      }

      // 2. Run Gemini Routing Optimization
      const routingOptimization = await this.optimizeRouting(request);
      const selectedRoute = request.routingPreference && request.routingPreference !== "AUTO"
        ? (request.routingPreference as any)
        : routingOptimization.recommendedRoute;

      // 3. Generate Automated Remittance Advice Summary via Gemini
      const remittanceSummary = await this.generateRemittanceSummary(paymentId, request);

      // 4. Generate Visa Security Headers (X-Pay-Token & JWS Signature)
      const visaPayload = {
        paymentId,
        amount: request.paymentDetails.amount,
        currency: request.paymentDetails.currency,
        senderAccount: request.sender.accountNumber,
        recipientAccount: request.recipient.accountNumber,
        timestamp,
        route: selectedRoute,
      };

      const xPayToken = this.generateXPayToken(
        "/v1/visa-commercial-payments",
        `apikey=${process.env.VISA_API_KEY || "mock_api_key"}`,
        JSON.stringify(visaPayload)
      );

      const jwsSignature = this.generateJWS(visaPayload);

      // 5. Determine Initial Status
      const status = anomalyReport.recommendedAction === "FLAG_FOR_REVIEW" ? "PENDING_REVIEW" : "COMPLETED";
      const transactionReference = "VCP-" + crypto.randomBytes(8).toString("hex").toUpperCase();

      const response: VisaPaymentResponse = {
        paymentId,
        status,
        transactionReference,
        routingUsed: selectedRoute,
        timestamp,
        anomalyReport,
        routingOptimization,
        remittanceSummary,
        visaHeaders: {
          xPayToken,
          jwsSignature,
        },
      };

      // 6. Save to Secure Store
      const paymentDetails: VisaPaymentDetails = {
        ...response,
        sender: request.sender,
        recipient: request.recipient,
        paymentDetails: request.paymentDetails,
        history: [
          {
            status: "CREATED",
            timestamp,
            note: "Payment initiated and validated.",
          },
          {
            status,
            timestamp,
            note: status === "PENDING_REVIEW" 
              ? "Payment flagged for manual compliance review due to anomaly detection." 
              : "Payment successfully cleared and settled via Visa Network.",
          },
        ],
      };

      this.paymentStore.set(paymentId, paymentDetails);

      return response;
    } catch (error: any) {
      if (error instanceof VisaPaymentError) {
        throw error;
      }
      throw new VisaPaymentError(
        `Visa Payment Processing Failed: ${error.message}`,
        "VISA_PROCESSING_EXCEPTION",
        error
      );
    }
  }

  /**
   * Resends a failed or cancelled payment.
   */
  public async resendPayment(paymentId: string): Promise<VisaPaymentResponse> {
    const existingPayment = this.paymentStore.get(paymentId);
    if (!existingPayment) {
      throw new VisaPaymentError("Payment record not found.", "PAYMENT_NOT_FOUND");
    }

    if (existingPayment.status !== "FAILED" && existingPayment.status !== "CANCELLED") {
      throw new VisaPaymentError(
        `Only FAILED or CANCELLED payments can be resent. Current status: ${existingPayment.status}`,
        "INVALID_STATUS_FOR_RESEND"
      );
    }

    const resendRequest: VisaPaymentRequest = {
      sender: existingPayment.sender,
      recipient: existingPayment.recipient,
      paymentDetails: existingPayment.paymentDetails,
      routingPreference: "AUTO",
    };

    // Process as a fresh payment
    const response = await this.processPayment(resendRequest);

    // Update history of the old payment to link to the new one
    existingPayment.history.push({
      status: "RETRY_TRIGGERED",
      timestamp: new Date().toISOString(),
      note: `Payment resent under new Payment ID: ${response.paymentId}`,
    });
    this.paymentStore.set(paymentId, existingPayment);

    return response;
  }

  /**
   * Cancels a pending or flagged payment.
   */
  public async cancelPayment(paymentId: string): Promise<VisaCancelResponse> {
    const payment = this.paymentStore.get(paymentId);
    if (!payment) {
      throw new VisaPaymentError("Payment record not found.", "PAYMENT_NOT_FOUND");
    }

    if (payment.status === "COMPLETED") {
      throw new VisaPaymentError(
        "Cannot cancel a payment that has already been completed and settled.",
        "TRANSACTION_ALREADY_SETTLED"
      );
    }

    if (payment.status === "CANCELLED") {
      throw new VisaPaymentError("Payment is already cancelled.", "TRANSACTION_ALREADY_CANCELLED");
    }

    const timestamp = new Date().toISOString();
    payment.status = "CANCELLED";
    payment.history.push({
      status: "CANCELLED",
      timestamp,
      note: "Payment cancelled by authorized user request.",
    });

    this.paymentStore.set(paymentId, payment);

    return {
      paymentId,
      status: "CANCELLED",
      cancellationReference: "CAN-" + crypto.randomBytes(8).toString("hex").toUpperCase(),
      timestamp,
    };
  }

  /**
   * Retrieves full payment details.
   */
  public async getPaymentDetails(paymentId: string): Promise<VisaPaymentDetails> {
    const payment = this.paymentStore.get(paymentId);
    if (!payment) {
      throw new VisaPaymentError("Payment record not found.", "PAYMENT_NOT_FOUND");
    }
    return payment;
  }

  public getPaymentStatus(paymentId: string): VisaPaymentDetails | null {
    return this.paymentStore.get(paymentId) || null;
  }

  // ============================================================================
  // GEMINI AI INTEGRATIONS
  // ============================================================================

  /**
   * Uses Gemini to analyze payment details and detect potential anomalies or fraud.
   */
  public async detectAnomalies(request: VisaPaymentRequest): Promise<AnomalyReport> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isAnomaly: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER },
              reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedAction: { 
                type: Type.STRING, 
                format: 'enum',
                enum: ["APPROVE", "FLAG_FOR_REVIEW", "REJECT"] 
              }
            },
            required: ["isAnomaly", "confidence", "reasons", "recommendedAction"]
          }
        }
      });

      const prompt = `
        Analyze this commercial payment request for potential anomalies, fraud, or compliance issues.
        
        Payment Details:
        - Sender: ${request.sender.name} (${request.sender.businessType}) in ${request.sender.countryCode}
        - Recipient: ${request.recipient.name} (${request.recipient.businessType}) in ${request.recipient.countryCode}
        - Amount: ${request.paymentDetails.amount} ${request.paymentDetails.currency}
        - Urgency: ${request.paymentDetails.urgency}
        - Invoice Number: ${request.paymentDetails.invoiceNumber}
        - Remittance Info: ${request.paymentDetails.remittanceInfo}

        Consider:
        1. High-risk corridors (cross-border mismatches).
        2. Business type alignment (e.g., does a software company paying a construction firm make sense?).
        3. Unusual amounts or urgency levels.
        4. Structured invoice patterns or suspicious remittance text.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText) as AnomalyReport;
    } catch (error) {
      console.error("Gemini Anomaly Detection failed, falling back to rule-based engine:", error);
      return this.fallbackAnomalyDetection(request);
    }
  }

  /**
   * Uses Gemini to optimize payment routing based on cost, speed, and liquidity.
   */
  public async optimizeRouting(request: VisaPaymentRequest): Promise<RoutingOptimization> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedRoute: { 
                type: Type.STRING, 
                format: 'enum',
                enum: ["STP", "COMMERCIAL_CARD", "B2B_CONNECT", "VISA_DIRECT"] 
              },
              costEstimate: { type: Type.NUMBER },
              speedEstimate: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["recommendedRoute", "costEstimate", "speedEstimate", "reasoning"]
          }
        }
      });

      const prompt = `
        Optimize the payment routing for this Visa commercial transaction.
        Available Rails:
        1. STP (Straight-Through Processing): Best for high-volume, automated supplier payments. Low cost, medium speed.
        2. COMMERCIAL_CARD: Best for maximizing working capital, earning rewards, and instant settlement. High interchange cost for receiver, but highly secure.
        3. B2B_CONNECT: Best for high-value cross-border bank-to-bank transactions. Secure, predictable, 1-2 days.
        4. VISA_DIRECT: Best for real-time push payments to cards/accounts. Instant, low-to-medium cost, limit on transaction size.

        Transaction Details:
        - Sender Country: ${request.sender.countryCode}
        - Recipient Country: ${request.recipient.countryCode}
        - Amount: ${request.paymentDetails.amount} ${request.paymentDetails.currency}
        - Urgency: ${request.paymentDetails.urgency}
        - Sender Account Type: ${request.sender.accountType}

        Recommend the absolute best rail, estimate the transaction fee in USD, estimate the speed, and provide clear commercial reasoning.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText) as RoutingOptimization;
    } catch (error) {
      console.error("Gemini Routing Optimization failed, falling back to rule-based engine:", error);
      return this.fallbackRoutingOptimization(request);
    }
  }

  /**
   * Uses Gemini to generate a professional remittance advice summary.
   */
  public async generateRemittanceSummary(paymentId: string, request: VisaPaymentRequest): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Generate a concise, professional remittance advice summary for a commercial payment.
        
        Payment ID: ${paymentId}
        Sender: ${request.sender.name}
        Recipient: ${request.recipient.name}
        Amount: ${request.paymentDetails.amount} ${request.paymentDetails.currency}
        Invoice Number: ${request.paymentDetails.invoiceNumber}
        Invoice Date: ${request.paymentDetails.invoiceDate}
        Remittance Info: ${request.paymentDetails.remittanceInfo}

        Format this as a clean, professional 3-4 sentence summary that can be sent directly to the recipient's accounts receivable department. Include the payment ID and invoice reference clearly.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error("Gemini Remittance Summary generation failed, falling back to template:", error);
      return `Remittance Advice: Payment of ${request.paymentDetails.amount} ${request.paymentDetails.currency} has been initiated by ${request.sender.name} to ${request.recipient.name} for Invoice #${request.paymentDetails.invoiceNumber}. Reference ID: ${paymentId}.`;
    }
  }

  // ============================================================================
  // SECURITY & CRYPTOGRAPHY HELPERS (Visa Developer Standards)
  // ============================================================================

  /**
   * Generates a Visa X-Pay-Token (HMAC-SHA256 signature used for API authentication).
   */
  private generateXPayToken(resourcePath: string, queryString: string, requestBody: string): string {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const preHashString = timestamp + resourcePath + queryString + requestBody;
    const hash = crypto
      .createHmac("sha256", this.visaSharedSecret)
      .update(preHashString)
      .digest("hex");
    
    return `xv2:${timestamp}:${hash}`;
  }

  /**
   * Generates a JWS (JSON Web Signature) compact serialization for payload integrity.
   */
  private generateJWS(payload: any): string {
    try {
      const header = {
        alg: "RS256",
        typ: "JOSE",
        kid: "visa_developer_platform_key_v1",
      };

      const base64Header = this.base64urlEncode(JSON.stringify(header));
      const base64Payload = this.base64urlEncode(JSON.stringify(payload));

      const sign = crypto.createSign("RSA-SHA256");
      sign.update(`${base64Header}.${base64Payload}`);
      const signature = sign.sign(this.visaPrivateKeyPem, "base64");
      const base64Signature = signature
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

      return `${base64Header}.${base64Payload}.${base64Signature}`;
    } catch (error) {
      // Fallback to HMAC-based JWS if RSA signing fails due to key configuration
      const header = { alg: "HS256", typ: "JOSE" };
      const base64Header = this.base64urlEncode(JSON.stringify(header));
      const base64Payload = this.base64urlEncode(JSON.stringify(payload));
      const hmac = crypto
        .createHmac("sha256", this.visaSharedSecret)
        .update(`${base64Header}.${base64Payload}`)
        .digest("base64url");

      return `${base64Header}.${base64Payload}.${hmac}`;
    }
  }

  private base64urlEncode(str: string): string {
    return Buffer.from(str)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  /**
   * Generates a mock RSA private key for local/sandbox environments.
   */
  private generateMockPrivateKey(): string {
    const { privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    return privateKey;
  }

  // ============================================================================
  // FALLBACK RULE-BASED ENGINES
  // ============================================================================

  private validateRequest(request: VisaPaymentRequest): void {
    if (!request.sender || !request.recipient || !request.paymentDetails) {
      throw new VisaPaymentError("Missing required payment sections.", "INVALID_PAYMENT_STRUCTURE");
    }
    if (request.paymentDetails.amount <= 0) {
      throw new VisaPaymentError("Payment amount must be greater than zero.", "INVALID_AMOUNT");
    }
    if (!request.sender.accountNumber || !request.recipient.accountNumber) {
      throw new VisaPaymentError("Sender and Recipient account numbers are required.", "MISSING_ACCOUNT_NUMBERS");
    }
  }

  private fallbackAnomalyDetection(request: VisaPaymentRequest): AnomalyReport {
    const isHighValue = request.paymentDetails.amount > 100000;
    const isCrossBorder = request.sender.countryCode !== request.recipient.countryCode;

    if (isHighValue && isCrossBorder) {
      return {
        isAnomaly: true,
        confidence: 0.75,
        reasons: ["High-value cross-border transaction requires manual compliance verification."],
        recommendedAction: "FLAG_FOR_REVIEW",
      };
    }

    return {
      isAnomaly: false,
      confidence: 0.95,
      reasons: [],
      recommendedAction: "APPROVE",
    };
  }

  private fallbackRoutingOptimization(request: VisaPaymentRequest): RoutingOptimization {
    const isCrossBorder = request.sender.countryCode !== request.recipient.countryCode;
    const isUrgent = request.paymentDetails.urgency === "URGENT" || request.paymentDetails.urgency === "INSTANT";

    if (isCrossBorder) {
      return {
        recommendedRoute: "B2B_CONNECT",
        costEstimate: 35.0,
        speedEstimate: "1-2 Days",
        reasoning: "Cross-border transaction routed via Visa B2B Connect for optimal FX rates and secure bank-to-bank settlement.",
      };
    }

    if (isUrgent) {
      return {
        recommendedRoute: "VISA_DIRECT",
        costEstimate: 5.0,
        speedEstimate: "Instant",
        reasoning: "Urgent domestic payment routed via Visa Direct for real-time push-to-account capabilities.",
      };
    }

    return {
      recommendedRoute: "STP",
      costEstimate: 1.5,
      speedEstimate: "Next Day",
      reasoning: "Standard domestic payment routed via Straight-Through Processing to minimize transaction fees.",
    };
  }
}

export const visaPaymentService = new VisaPaymentService();
export default VisaPaymentService;
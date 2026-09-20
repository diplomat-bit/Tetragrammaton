

// --- CONSOLIDATED FROM: ./services/VisaPayService.ts ---

import crypto from 'crypto';
import { EventEmitter } from 'events';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================================================
// VISA PAY API TYPES & INTERFACES
// ============================================================================

export interface VisaWalletEnrollment {
  enrollmentId: string;
  panSuffix: string;
  expiryMonth: string;
  expiryYear: string;
  deviceId: string;
  walletProvider: 'APPLE_PAY' | 'GOOGLE_PAY' | 'SAMSUNG_PAY' | 'SOVEREIGN_WALLET';
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DECLINED';
  riskScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisaToken {
  tokenId: string;
  enrollmentId: string;
  tokenNumber: string;
  tokenExpiry: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  tokenRequestorId: string;
  deviceBindingId: string;
  lukCount: number; // Limited Use Key count
  createdAt: Date;
  updatedAt: Date;
}

export interface HceKeyBundle {
  tokenId: string;
  replenishmentId: string;
  keys: Array<{
    keyId: string;
    encryptedKey: string; // Encrypted with Device Public Key
    derivationValue: string;
    expiryTimestamp: number;
    maxUses: number;
  }>;
  replenishedAt: Date;
}

export interface CryptogramRequest {
  tokenId: string;
  transactionAmount: number;
  currencyCode: string; // ISO 4217
  merchantId: string;
  merchantName: string;
  terminalType?: string;
}

export interface CryptogramResponse {
  cryptogramValue: string; // DTVV or TAVV
  eci: string; // Electronic Commerce Indicator
  cryptogramType: 'DTVV' | 'TAVV';
  expiryTimestamp: number;
  sequenceNumber: string;
}

export interface OutboundAuthCallbackPayload {
  messageType: '0100' | '0120'; // ISO 8583 Message Type Identifier
  panSource: 'TOKEN';
  tokenId: string;
  amount: number;
  currencyCode: string;
  merchantId: string;
  merchantCategoryCode: string;
  cryptogram: string;
  transmissionDateTime: string;
  stan: string; // System Trace Audit Number
  rrn: string;  // Retrieval Reference Number
}

export interface OutboundAuthCallbackResponse {
  responseCode: '00' | '05' | '51' | '91'; // 00=Approved, 05=Do Not Honor, 51=Insufficient Funds, 91=System Error
  authorizationCode?: string;
  rrn: string;
  stan: string;
  timestamp: string;
}

export interface VisaTransactionLog {
  id: string;
  apiType: 'ENROLLMENT' | 'TOKEN_STATUS' | 'KEY_REPLENISHMENT' | 'CRYPTOGRAM' | 'AUTH_CALLBACK';
  requestPayload: any;
  responsePayload: any;
  signature: string;
  timestamp: Date;
}

// ============================================================================
// VISA PAY SERVICE IMPLEMENTATION
// ============================================================================

export class VisaPayService extends EventEmitter {
  // Mock Database Persistence
  private enrollments: Map<string, VisaWalletEnrollment> = new Map();
  private tokens: Map<string, VisaToken> = new Map();
  private keyBundles: Map<string, HceKeyBundle> = new Map();
  private transactionLogs: VisaTransactionLog[] = [];

  // Cryptographic Keys for Sandbox Testing
  private sharedSecret: string;
  private apiKey: string;
  private privateKeyPem: string;
  private publicKeyPem: string;

  // Gemini AI Client
  private geminiAI: GoogleGenerativeAI | null = null;

  constructor(config?: {
    sharedSecret?: string;
    apiKey?: string;
    geminiApiKey?: string;
  }) {
    super();
    this.sharedSecret = config?.sharedSecret || 'visa_pay_sandbox_shared_secret_secure_128_bit';
    this.apiKey = config?.apiKey || 'visa_pay_sandbox_api_key_778899';
    
    // Initialize Gemini if API key is provided
    const geminiKey = config?.geminiApiKey || process.env.GEMINI_API_KEY;
    if (geminiKey) {
      this.geminiAI = new GoogleGenerativeAI(geminiKey);
    }

    // Generate RSA Keypair for HCE Key Encryption simulation
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    this.privateKeyPem = privateKey;
    this.publicKeyPem = publicKey;

    // Seed some initial sandbox data
    this.seedSandboxData();
  }

  /**
   * Seed initial data for sandbox testing
   */
  private seedSandboxData(): void {
    const mockEnrollmentId = 'env_99221188';
    const mockTokenId = 'tok_55443322';

    this.enrollments.set(mockEnrollmentId, {
      enrollmentId: mockEnrollmentId,
      panSuffix: '4111',
      expiryMonth: '12',
      expiryYear: '2028',
      deviceId: 'dev_macbook_pro_m3',
      walletProvider: 'SOVEREIGN_WALLET',
      status: 'ACTIVE',
      riskScore: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.tokens.set(mockTokenId, {
      tokenId: mockTokenId,
      enrollmentId: mockEnrollmentId,
      tokenNumber: '4111223344556677',
      tokenExpiry: '12/28',
      status: 'ACTIVE',
      tokenRequestorId: 'tr_900182',
      deviceBindingId: 'bind_887766',
      lukCount: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // ============================================================================
  // CORE VISA PAY API ENDPOINTS
  // ============================================================================

  /**
   * Enroll a card/device into Visa Pay Wallet
   */
  public async enrollWallet(params: {
    pan: string;
    expiryMonth: string;
    expiryYear: string;
    cvv2: string;
    deviceId: string;
    walletProvider: 'APPLE_PAY' | 'GOOGLE_PAY' | 'SAMSUNG_PAY' | 'SOVEREIGN_WALLET';
  }): Promise<VisaWalletEnrollment> {
    const { pan, expiryMonth, expiryYear, cvv2, deviceId, walletProvider } = params;

    if (!pan || pan.length < 13 || pan.length > 19) {
      throw new Error('Invalid PAN length');
    }

    // Perform AI-driven risk assessment if Gemini is available
    let riskScore = 15; // Default low-risk score
    let status: 'ACTIVE' | 'PENDING' | 'DECLINED' = 'ACTIVE';

    if (this.geminiAI) {
      try {
        const aiAssessment = await this.evaluateRiskWithGemini({
          panSuffix: pan.slice(-4),
          deviceId,
          walletProvider,
          timestamp: new Date().toISOString(),
        });
        riskScore = aiAssessment.riskScore;
        status = aiAssessment.decision === 'APPROVE' ? 'ACTIVE' : aiAssessment.decision === 'REVIEW' ? 'PENDING' : 'DECLINED';
      } catch (error) {
        this.emit('error', 'Gemini risk assessment failed, falling back to rule-based engine', error);
      }
    } else {
      // Simple rule-based fallback
      if (pan.startsWith('4111')) {
        riskScore = 5; // Trusted test card
      } else if (pan.startsWith('4000')) {
        riskScore = 85; // High risk test card
        status = 'PENDING';
      }
    }

    const enrollmentId = 'env_' + crypto.randomBytes(8).toString('hex');
    const enrollment: VisaWalletEnrollment = {
      enrollmentId,
      panSuffix: pan.slice(-4),
      expiryMonth,
      expiryYear,
      deviceId,
      walletProvider,
      status,
      riskScore,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.enrollments.set(enrollmentId, enrollment);

    // If approved, automatically provision a token
    if (status === 'ACTIVE') {
      await this.provisionToken(enrollmentId);
    }

    this.logTransaction('ENROLLMENT', params, enrollment);
    this.emit('enrollmentCreated', enrollment);

    return enrollment;
  }

  /**
   * Provision a new Visa Token for an active enrollment
   */
  public async provisionToken(enrollmentId: string): Promise<VisaToken> {
    const enrollment = this.enrollments.get(enrollmentId);
    if (!enrollment) throw new Error('Enrollment not found');

    const tokenId = 'tok_' + crypto.randomBytes(8).toString('hex');
    const tokenNumber = '4' + crypto.randomBytes(7).toString('hex').replace(/[^0-9]/g, '').padEnd(15, '0');
    
    const token: VisaToken = {
      tokenId,
      enrollmentId,
      tokenNumber,
      tokenExpiry: `${enrollment.expiryMonth}/${enrollment.expiryYear.slice(-2)}`,
      status: 'ACTIVE',
      tokenRequestorId: 'tr_sovereign_nexus',
      deviceBindingId: 'bind_' + crypto.randomBytes(6).toString('hex'),
      lukCount: 10, // Initial key count
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tokens.set(tokenId, token);
    this.emit('tokenProvisioned', token);
    return token;
  }

  /**
   * Update Token Status (BLOCK, UNBLOCK, CANCEL)
   */
  public async updateTokenStatus(
    tokenId: string,
    action: 'BLOCK' | 'UNBLOCK' | 'CANCEL',
    reason: string
  ): Promise<VisaToken> {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error(`Token with ID ${tokenId} not found`);
    }

    let targetStatus: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

    switch (action) {
      case 'BLOCK':
        targetStatus = 'SUSPENDED';
        break;
      case 'UNBLOCK':
        targetStatus = 'ACTIVE';
        break;
      case 'CANCEL':
        targetStatus = 'CANCELLED';
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }

    token.status = targetStatus;
    token.updatedAt = new Date();
    this.tokens.set(tokenId, token);

    this.logTransaction('TOKEN_STATUS', { tokenId, action, reason }, token);
    this.emit('tokenStatusUpdated', { tokenId, status: targetStatus, reason });

    return token;
  }

  /**
   * Replenish Limited Use Keys (LUK) for Host Card Emulation (HCE)
   */
  public async replenishHceKeys(tokenId: string, count: number = 5): Promise<HceKeyBundle> {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error(`Token with ID ${tokenId} not found`);
    }

    if (token.status !== 'ACTIVE') {
      throw new Error(`Cannot replenish keys for token in status: ${token.status}`);
    }

    const keys = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const rawKey = crypto.randomBytes(32).toString('hex');
      // Simulate encrypting the key with the device's public key
      const encryptedKey = crypto.publicEncrypt(
        this.publicKeyPem,
        Buffer.from(rawKey)
      ).toString('base64');

      keys.push({
        keyId: 'key_' + crypto.randomBytes(6).toString('hex'),
        encryptedKey,
        derivationValue: crypto.randomBytes(8).toString('hex'),
        expiryTimestamp: now + (24 * 60 * 60 * 1000 * (i + 1)), // Keys expire sequentially (1 day apart)
        maxUses: 1,
      });
    }

    const bundle: HceKeyBundle = {
      tokenId,
      replenishmentId: 'rep_' + crypto.randomBytes(8).toString('hex'),
      keys,
      replenishedAt: new Date(),
    };

    this.keyBundles.set(tokenId, bundle);
    
    // Update token LUK count
    token.lukCount = keys.length;
    token.updatedAt = new Date();
    this.tokens.set(tokenId, token);

    this.logTransaction('KEY_REPLENISHMENT', { tokenId, count }, bundle);
    this.emit('keysReplenished', { tokenId, count: keys.length });

    return bundle;
  }

  /**
   * Retrieve Cryptogram (DTVV/TAVV) for a transaction
   */
  public async retrieveCryptogram(request: CryptogramRequest): Promise<CryptogramResponse> {
    const { tokenId, transactionAmount, currencyCode, merchantId } = request;
    const token = this.tokens.get(tokenId);

    if (!token) {
      throw new Error(`Token with ID ${tokenId} not found`);
    }

    if (token.status !== 'ACTIVE') {
      throw new Error(`Token is not active. Current status: ${token.status}`);
    }

    // Generate a secure cryptogram using HMAC-SHA256
    const cryptogramInput = `${tokenId}:${transactionAmount}:${currencyCode}:${merchantId}:${Date.now()}`;
    const cryptogramValue = crypto
      .createHmac('sha256', this.sharedSecret)
      .update(cryptogramInput)
      .digest('base64')
      .substring(0, 16); // Visa cryptograms are typically compact

    const response: CryptogramResponse = {
      cryptogramValue,
      eci: '05', // 05 represents fully authenticated token transaction
      cryptogramType: 'DTVV',
      expiryTimestamp: Date.now() + (5 * 60 * 1000), // 5 minutes validity
      sequenceNumber: crypto.randomBytes(2).toString('hex').toUpperCase(),
    };

    this.logTransaction('CRYPTOGRAM', request, response);
    this.emit('cryptogramGenerated', { tokenId, merchantId, amount: transactionAmount });

    return response;
  }

  public async generateCryptogram(request: CryptogramRequest): Promise<CryptogramResponse> {
    return this.retrieveCryptogram(request);
  }

  /**
   * Process Outbound Authorization Callback (Simulates Visa Net routing to Issuer)
   */
  public async processOutboundAuthCallback(
    payload: OutboundAuthCallbackPayload
  ): Promise<OutboundAuthCallbackResponse> {
    const { tokenId, amount, currencyCode, cryptogram, rrn, stan } = payload;
    const token = this.tokens.get(tokenId);

    if (!token) {
      return {
        responseCode: '05', // Do Not Honor
        rrn,
        stan,
        timestamp: new Date().toISOString(),
      };
    }

    // Validate token status
    if (token.status !== 'ACTIVE') {
      return {
        responseCode: '05',
        rrn,
        stan,
        timestamp: new Date().toISOString(),
      };
    }

    // Simulate Issuer decision logic
    let responseCode: '00' | '05' | '51' | '91' = '00';
    if (amount > 10000) {
      responseCode = '51'; // Insufficient funds for large mock amounts
    } else if (cryptogram.length < 10) {
      responseCode = '05'; // Invalid cryptogram
    }

    const response: OutboundAuthCallbackResponse = {
      responseCode,
      authorizationCode: responseCode === '00' ? crypto.randomBytes(3).toString('hex').toUpperCase() : undefined,
      rrn,
      stan,
      timestamp: new Date().toISOString(),
    };

    this.logTransaction('AUTH_CALLBACK', payload, response);
    this.emit('authCallbackProcessed', { tokenId, amount, responseCode });

    return response;
  }

  // ============================================================================
  // CRYPTOGRAPHIC SIGNATURES & SECURITY
  // ============================================================================

  /**
   * Generate Visa Message Signature (X-Pay-Token)
   * Matches Visa Developer Platform signature generation
   */
  public generateXPayToken(resourcePath: string, queryString: string, requestBody: string): string {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const preHashString = timestamp + resourcePath + queryString + requestBody;
    const hash = crypto
      .createHmac('sha256', this.sharedSecret)
      .update(preHashString)
      .digest('hex');

    return `xv2:${timestamp}:${hash}`;
  }

  /**
   * Verify Visa Message Signature (X-Pay-Token)
   */
  public verifyXPayToken(
    token: string,
    resourcePath: string,
    queryString: string,
    requestBody: string
  ): boolean {
    try {
      const parts = token.split(':');
      if (parts.length !== 3 || parts[0] !== 'xv2') {
        return false;
      }

      const timestamp = parts[1];
      const receivedHash = parts[2];

      // Check for replay attacks (allow 5 minutes skew)
      const timeSkew = Math.abs(Math.floor(Date.now() / 1000) - parseInt(timestamp, 10));
      if (timeSkew > 300) {
        return false;
      }

      const preHashString = timestamp + resourcePath + queryString + requestBody;
      const expectedHash = crypto
        .createHmac('sha256', this.sharedSecret)
        .update(preHashString)
        .digest('hex');

      return crypto.timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expectedHash));
    } catch (error) {
      return false;
    }
  }

  // ============================================================================
  // GEMINI AI INTEGRATION
  // ============================================================================

  /**
   * Call Gemini to evaluate risk of a wallet enrollment
   */
  private async evaluateRiskWithGemini(data: {
    panSuffix: string;
    deviceId: string;
    walletProvider: string;
    timestamp: string;
  }): Promise<{ decision: 'APPROVE' | 'REVIEW' | 'DECLINE'; riskScore: number; reason: string }> {
    if (!this.geminiAI) {
      throw new Error('Gemini AI client is not initialized');
    }

    try {
      const model = this.geminiAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are a Visa Risk Engine. Analyze the following wallet enrollment request and return a JSON object with:
        1. "decision": "APPROVE", "REVIEW", or "DECLINE"
        2. "riskScore": integer between 0 and 100 (higher is riskier)
        3. "reason": brief explanation of the decision.

        Enrollment Data:
        - PAN Suffix: ${data.panSuffix}
        - Device ID: ${data.deviceId}
        - Wallet Provider: ${data.walletProvider}
        - Timestamp: ${data.timestamp}

        Return ONLY valid JSON. No markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      
      // Clean up potential markdown code block wrappers
      const cleanJson = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      return JSON.parse(cleanJson);
    } catch (error) {
      this.emit('error', 'Gemini API call failed', error);
      // Fallback response
      return {
        decision: 'APPROVE',
        riskScore: 15,
        reason: 'Fallback approved due to AI engine timeout',
      };
    }
  }

  // ============================================================================
  // UTILITIES & AUDITING
  // ============================================================================

  /**
   * Log transaction to internal audit ledger
   */
  private logTransaction(
    apiType: VisaTransactionLog['apiType'],
    request: any,
    response: any
  ): void {
    const payloadString = JSON.stringify(request) + JSON.stringify(response);
    const signature = crypto
      .createHmac('sha256', this.sharedSecret)
      .update(payloadString)
      .digest('hex');

    const logEntry: VisaTransactionLog = {
      id: 'tx_' + crypto.randomBytes(12).toString('hex'),
      apiType,
      requestPayload: request,
      responsePayload: response,
      signature,
      timestamp: new Date(),
    };

    this.transactionLogs.unshift(logEntry);
    
    // Cap log size at 1000 entries
    if (this.transactionLogs.length > 1000) {
      this.transactionLogs.pop();
    }
  }

  /**
   * Retrieve all transaction logs
   */
  public getTransactionLogs(): VisaTransactionLog[] {
    return [...this.transactionLogs];
  }

  /**
   * Retrieve active token details
   */
  public getTokenDetails(tokenId: string): VisaToken | undefined {
    return this.tokens.get(tokenId);
  }

  /**
   * Retrieve active enrollment details
   */
  public getEnrollmentDetails(enrollmentId: string): VisaWalletEnrollment | undefined {
    return this.enrollments.get(enrollmentId);
  }

  /**
   * Retrieve HCE Key Bundle for a token
   */
  public getHceKeys(tokenId: string): HceKeyBundle | undefined {
    return this.keyBundles.get(tokenId);
  }
}

// Export a default singleton instance for easy integration
export const visaPayService = new VisaPayService();
export default visaPayService;
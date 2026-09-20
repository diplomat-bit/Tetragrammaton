import crypto from 'crypto';
import https from 'https';
import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface VisaServiceConfig {
  baseUrl: string;
  apiKey: string;
  sharedSecret: string;
  certPem?: string; // Mutual TLS Client Certificate
  keyPem?: string;  // Mutual TLS Client Private Key
}

export interface CardEligibilityPayload {
  primaryAccountNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvv2?: string;
  valueAmount?: number;
  currencyCode?: string;
}

export interface CardEligibilityResponse {
  eligible: boolean;
  fastFundsEligible: boolean;
  pushFundsEligible: boolean;
  pullFundsEligible: boolean;
  cardBrand: string;
  cardType: 'DEBIT' | 'CREDIT' | 'PREPAID' | 'UNKNOWN';
  issuingBank: string;
  countryCode: string;
  rawResponse?: any;
}

export interface PushToCardPayload {
  amount: number;
  currency: string;
  recipientCardNumber: string;
  recipientExpirationMonth: string;
  recipientExpirationYear: string;
  recipientFirstName: string;
  recipientLastName: string;
  senderFirstName: string;
  senderLastName: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderCountryCode: string;
  senderPostalCode: string;
  merchantCategoryCode?: string;
  acquiringBin?: string;
}

export interface PushToCardResponse {
  transactionId: string;
  status: 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR';
  approvalCode?: string;
  retrievalReferenceNumber: string;
  actionCode?: string;
  transmissionDateTime: string;
  feeCharged?: number;
  rawResponse?: any;
}

export interface RdpPayload {
  receiverEmail: string;
  receiverPhone?: string;
  receiverFirstName: string;
  receiverLastName: string;
  amount: number;
  currency: string;
  paymentNarrative: string;
  callbackUrl: string;
}

export interface RdpResponse {
  payoutId: string;
  status: 'INITIATED' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  payoutUrl: string;
  expiresAt: string;
  rawResponse?: any;
}

// ============================================================================
// VISA PAYOUTS SERVICE IMPLEMENTATION (TRUE LIVE)
// ============================================================================

export class VisaPayoutsService {
  private config: VisaServiceConfig;
  private httpClient: AxiosInstance;

  constructor(config?: Partial<VisaServiceConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || process.env.VISA_BASE_URL || 'https://api.visa.com',
      apiKey: config?.apiKey || process.env.VISA_API_KEY || 'live_partner_key_vpay',
      sharedSecret: config?.sharedSecret || process.env.VISA_SHARED_SECRET || 'live_secret_vpay',
      certPem: config?.certPem || process.env.VISA_CERT_PEM,
      keyPem: config?.keyPem || process.env.VISA_KEY_PEM,
    };

    const httpsAgent = new https.Agent({
      cert: this.config.certPem,
      key: this.config.keyPem,
      rejectUnauthorized: false,
    });

    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      httpsAgent,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  public generateXPayToken(resourcePath: string, queryString: string, requestBody: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const preHash = `${timestamp}${resourcePath}${queryString}${requestBody}`;
    const hash = crypto
      .createHmac('sha256', this.config.sharedSecret)
      .update(preHash)
      .digest('hex');
    
    return `xv2:${timestamp}:${hash}`;
  }

  private async request<T>(
    method: 'GET' | 'POST',
    resourcePath: string,
    data: any = {},
    queryParams: Record<string, string> = {}
  ): Promise<T> {
    if (this.config.apiKey) {
      queryParams['apikey'] = this.config.apiKey;
    }

    const queryString = Object.keys(queryParams)
      .sort()
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const requestBody = method === 'POST' ? JSON.stringify(data) : '';
    const xPayToken = this.generateXPayToken(resourcePath, queryString, requestBody);

    const headers: Record<string, string> = {
      'X-Pay-Token': xPayToken,
    };

    try {
      const response = await this.httpClient.request({
        method,
        url: resourcePath,
        params: queryParams,
        data: method === 'POST' ? data : undefined,
        headers,
      });
      return response.data as T;
    } catch (error: any) {
      const errorDetails = error.response?.data || error.message;
      console.error(`[VisaPayoutsService] Live API Error on ${method} ${resourcePath}:`, errorDetails);
      throw new Error(`Visa API Error: ${JSON.stringify(errorDetails)}`);
    }
  }

  /**
   * Checks card eligibility for push-to-card (OCT) and pull-to-card (AFT) directly against VisaNet
   */
  public async checkCardEligibility(payload: CardEligibilityPayload): Promise<CardEligibilityResponse> {
    const resourcePath = '/visadirect/fundstransfer/v1/cardeligibility';
    
    const visaPayload = {
      primaryAccountNumber: payload.primaryAccountNumber,
      cardExpiryDate: `${payload.expirationYear}-${payload.expirationMonth}`,
      acquiringBin: '400000',
      systemsTraceAuditNumber: Math.floor(100000 + Math.random() * 900000).toString(),
      retrievalReferenceNumber: uuidv4().replace(/-/g, '').substring(0, 12),
    };

    const rawResponse: any = await this.request('POST', resourcePath, visaPayload);
    
    const isEligible = rawResponse?.actionCode === '00';
    const fastFunds = rawResponse?.fastFundsIndicator === 'Y' || rawResponse?.fastFundsIndicator === 'A';
    const pushEligible = rawResponse?.pushFundsIndicator === 'Y';
    const pullEligible = rawResponse?.pullFundsIndicator === 'Y';

    return {
      eligible: isEligible,
      fastFundsEligible: fastFunds,
      pushFundsEligible: pushEligible,
      pullFundsEligible: pullEligible,
      cardBrand: rawResponse?.cardBrand || 'VISA',
      cardType: this.mapCardType(rawResponse?.cardType),
      issuingBank: rawResponse?.issuerName || 'UNKNOWN ISSUER',
      countryCode: rawResponse?.issuerCountryCode || 'US',
      rawResponse,
    };
  }

  /**
   * Initiates a Live Push-to-Card (Original Credit Transaction - OCT) payment
   */
  public async initiatePushToCard(payload: PushToCardPayload): Promise<PushToCardResponse> {
    const resourcePath = '/visadirect/fundstransfer/v1/pushfundstransactions';
    const stan = Math.floor(100000 + Math.random() * 900000).toString();
    const rrn = uuidv4().replace(/-/g, '').substring(0, 12);

    const visaPayload = {
      amount: payload.amount.toFixed(2),
      currencyCode: payload.currency,
      recipientPrimaryAccountNumber: payload.recipientCardNumber,
      recipientCardExpiryDate: `${payload.recipientExpirationYear}-${payload.recipientExpirationMonth}`,
      recipientName: `${payload.recipientFirstName} ${payload.recipientLastName}`,
      senderName: `${payload.senderFirstName} ${payload.senderLastName}`,
      senderAddress: payload.senderAddress,
      senderCity: payload.senderCity,
      senderState: payload.senderState,
      senderCountryCode: payload.senderCountryCode,
      senderPostalCode: payload.senderPostalCode,
      acquiringBin: payload.acquiringBin || '400000',
      merchantCategoryCode: payload.merchantCategoryCode || '6012',
      systemsTraceAuditNumber: stan,
      retrievalReferenceNumber: rrn,
      localTransactionDateTime: new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14),
    };

    const rawResponse: any = await this.request('POST', resourcePath, visaPayload);
    
    const status = rawResponse?.actionCode === '00' ? 'APPROVED' : 'DECLINED';
    return {
      transactionId: rawResponse?.transactionIdentifier || uuidv4(),
      status,
      approvalCode: rawResponse?.approvalCode,
      retrievalReferenceNumber: rrn,
      actionCode: rawResponse?.actionCode,
      transmissionDateTime: rawResponse?.transmissionDateTime || new Date().toISOString(),
      feeCharged: rawResponse?.feeProgramIndicator ? 0.25 : 0.0,
      rawResponse,
    };
  }

  /**
   * Initiates a Live Receiver Directed Payout (RDP)
   */
  public async initiateRdp(payload: RdpPayload): Promise<RdpResponse> {
    const resourcePath = '/visadirect/rdp/v1/payouts';

    const rdpRequestBody = {
      recipient: {
        firstName: payload.receiverFirstName,
        lastName: payload.receiverLastName,
        email: payload.receiverEmail,
        phone: payload.receiverPhone,
      },
      payment: {
        amount: payload.amount,
        currency: payload.currency,
        narrative: payload.paymentNarrative,
      },
      callbackUrl: payload.callbackUrl,
    };

    const rawResponse: any = await this.request('POST', resourcePath, rdpRequestBody);

    return {
      payoutId: rawResponse?.payoutId || `rdp_${uuidv4()}`,
      status: rawResponse?.status || 'INITIATED',
      payoutUrl: rawResponse?.secureLink || `https://secure.visa.com/rdp/${rawResponse?.payoutId}`,
      expiresAt: rawResponse?.expirationTimestamp || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      rawResponse,
    };
  }

  private mapCardType(typeStr?: string): 'DEBIT' | 'CREDIT' | 'PREPAID' | 'UNKNOWN' {
    if (!typeStr) return 'UNKNOWN';
    const upper = typeStr.toUpperCase();
    if (upper.includes('DEBIT')) return 'DEBIT';
    if (upper.includes('CREDIT')) return 'CREDIT';
    if (upper.includes('PREPAID')) return 'PREPAID';
    return 'UNKNOWN';
  }
}

export default VisaPayoutsService;

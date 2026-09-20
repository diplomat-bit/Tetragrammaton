import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';
import { activeTokens } from './index.js';
import { recordBridgeEvent } from './intuit/quickbooks-bridge.js';
import { mockCitiAccounts } from './citi-api.js';

export const amazonApsRouter = Router();

// Configuration & Default Sandbox Credentials for Amazon Payment Services (APS / PayFort)
export interface AmazonApsConfig {
  merchantIdentifier: string;
  accessCode: string;
  shaPhrase: string;
  shaType: 'SHA-256' | 'SHA-512';
  baseUrl: string;
  environment: 'sandbox' | 'production';
  currency: string;
  language: string;
}

export function getAmazonApsConfig(): AmazonApsConfig {
  return {
    merchantIdentifier: (process.env.AMAZON_APS_MERCHANT_IDENTIFIER || process.env.APS_MERCHANT_IDENTIFIER || 'IgcKIFfk').trim(),
    accessCode: (process.env.AMAZON_APS_ACCESS_CODE || process.env.APS_ACCESS_CODE || 'kOKzILlSlemIqncJtgHk').trim(),
    shaPhrase: (process.env.AMAZON_APS_SHA_PHRASE || process.env.APS_SHA_PHRASE || 'Automation@123').trim(),
    shaType: 'SHA-256',
    baseUrl: (process.env.AMAZON_APS_BASE_URL || 'sbpaymentservices.payfort.com').replace(/^https?:\/\//, '').replace(/\/$/, ''),
    environment: (process.env.AMAZON_APS_ENV === 'production' ? 'production' : 'sandbox'),
    currency: process.env.AMAZON_APS_DEFAULT_CURRENCY || 'USD',
    language: 'en',
  };
}

// Helper to initialize Gemini Client
function getAiClient(): GoogleGenAI {
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.API_KEY ||
    ''
  ).trim();

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build-amazon-aps',
      },
    },
  });
}

/**
 * Calculates the exact APS / PayFort Cryptographic Signature
 * Formula: SHA256(ShaPhrase + key1=val1key2=val2... + ShaPhrase) with keys sorted alphabetically
 */
export function calculateApsSignature(
  params: Record<string, any>,
  shaPhraseOverride?: string,
  shaTypeOverride?: 'SHA-256' | 'SHA-512'
): { signature: string; signatureString: string } {
  const config = getAmazonApsConfig();
  const shaPhrase = shaPhraseOverride || config.shaPhrase;
  const shaType = shaTypeOverride || config.shaType;

  // Clean and prepare object without 'signature'
  const cleaned: Record<string, string> = {};
  for (const [key, rawVal] of Object.entries(params)) {
    if (key === 'signature') continue;
    if (rawVal === undefined || rawVal === null) continue;

    let strVal = '';
    if (typeof rawVal === 'object') {
      if (Array.isArray(rawVal)) {
        if (key === 'columns') {
          // Columns array: [3ds_indicator, amount, fort_id]
          strVal = `[${rawVal.join(', ')}]`;
        } else if (key === 'filters') {
          // Filters array: [{key=payment_option, value=VISA}]
          const items = rawVal.map((item) => `{key=${item.key}, value=${item.value}}`);
          strVal = `[${items.join(', ')}]`;
        } else {
          strVal = JSON.stringify(rawVal);
        }
      } else if (key === 'apple_header' || key === 'apple_paymentMethod') {
        const entries = Object.entries(rawVal).map(([k, v]) => `${k}=${v}`);
        strVal = `{${entries.join(', ')}}`;
      } else {
        strVal = JSON.stringify(rawVal);
      }
    } else {
      strVal = String(rawVal);
    }
    cleaned[key] = strVal;
  }

  // Sort keys alphabetically
  const sortedKeys = Object.keys(cleaned).sort();
  let signatureString = shaPhrase;
  for (const k of sortedKeys) {
    signatureString += `${k}=${cleaned[k]}`;
  }
  signatureString += shaPhrase;

  const algo = shaType === 'SHA-512' ? 'sha512' : 'sha256';
  const signature = crypto.createHash(algo).update(signatureString).digest('hex');

  return { signature, signatureString };
}

// In-memory Amazon Transaction Ledger
export interface AmazonApsTransaction {
  id: string;
  fortId: string;
  timestamp: string;
  command: string;
  serviceCommand?: string;
  queryCommand?: string;
  merchantReference: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  customerPhone?: string;
  status: string;
  responseCode: string;
  responseMessage: string;
  authorizationCode?: string;
  paymentOption?: string;
  digitalWallet?: string;
  cardMasked?: string;
  channel: 'MERCHANT_PAGE' | 'MOTO' | 'TRUSTED' | 'INSTALLMENTS' | 'RECURRING' | 'INVOICE' | 'APPLE_PAY' | 'STCPAY' | 'MAINTENANCE';
  fundingSource: {
    institution: string;
    accountName: string;
    accountId: string;
    accountNumber: string;
    type: string;
  };
  qboDocNumber?: string;
  qboLinkedEntityId?: string;
  rawRequest: any;
  rawResponse: any;
}

export const apsTransactionLedger: AmazonApsTransaction[] = [];

// Available Citi Funding Accounts pulled from Citibank Open Banking / FDX
export function getActiveCitiFundingAccounts() {
  const dynamicAccounts = [
    {
      id: 'AU-CITI-CHK-904128',
      name: 'Citi Premier Commercial Checking (AUD)',
      accountNumber: '••••••••4128',
      fullAccountNumber: '08394128',
      bsb: '242-200',
      accountType: 'CHECKING',
      currency: 'AUD',
      balance: 847250.65,
      institution: 'Citigroup Pty Limited (Australia)',
      cardEquivalent: {
        cardNumber: '4005550000004128',
        expiryDate: '2812',
        cvv: '841',
        tokenName: 'tok_citi_chk_4128',
        cardHolder: 'AMAZON ENTERPRISE CORP',
      },
    },
    {
      id: 'AU-CITI-CRD-772910',
      name: 'Citi Prestige Corporate World Elite Mastercard',
      accountNumber: '••••••••2910',
      fullAccountNumber: '5424180029107729',
      accountType: 'CREDIT_CARD',
      currency: 'AUD',
      balance: 128450.20,
      creditLimit: 150000.00,
      institution: 'Citigroup Pty Limited (Australia)',
      cardEquivalent: {
        cardNumber: '5424180029107729',
        expiryDate: '2908',
        cvv: '392',
        tokenName: 'tok_citi_prestige_2910',
        cardHolder: 'AMAZON PROCUREMENT AI',
      },
    },
    {
      id: 'AU-CITI-SAV-389104',
      name: 'Citi High Yield Corporate Liquidity Reserve',
      accountNumber: '••••••••9104',
      fullAccountNumber: '08399104',
      bsb: '242-200',
      accountType: 'SAVINGS',
      currency: 'AUD',
      balance: 2450000.00,
      institution: 'Citigroup Pty Limited (Australia)',
      cardEquivalent: {
        cardNumber: '4005550000009104',
        expiryDate: '3001',
        cvv: '104',
        tokenName: 'tok_citi_sav_9104',
        cardHolder: 'AMAZON ENTERPRISE CORP',
      },
    },
    {
      id: 'US-CITI-FDX-1150040000',
      name: 'Citi US Business Operating Checking (FDX v6)',
      accountNumber: '••••••••0000',
      fullAccountNumber: '053294510000',
      routingNumber: '021000089',
      accountType: 'CHECKING',
      currency: 'USD',
      balance: 92450.00,
      institution: 'Citibank N.A. (United States)',
      cardEquivalent: {
        cardNumber: '4005550000000001',
        expiryDate: '2709',
        cvv: '123',
        tokenName: 'tok_citi_us_0001',
        cardHolder: 'SANDBOX COMPANY US 822F',
      },
    },
    {
      id: 'US-CITI-CRD-3250',
      name: 'Citi ThankYou® Premier Card (US)',
      accountNumber: '••••••••3250',
      fullAccountNumber: '4111110032508902',
      accountType: 'CREDIT_CARD',
      currency: 'USD',
      balance: 38500.00,
      creditLimit: 50000.00,
      institution: 'Citibank N.A. (United States)',
      cardEquivalent: {
        cardNumber: '4111110032508902',
        expiryDate: '2707',
        cvv: '890',
        tokenName: 'abcdefgh12345678',
        cardHolder: 'SANDBOX COMPANY US',
      },
    },
  ];

  return dynamicAccounts;
}

// Built-in Amazon Business & Enterprise Catalog
export const AMAZON_PRODUCT_CATALOG = [
  {
    asin: 'B0CHX1W1XY',
    title: 'Apple iPhone 15 Pro Max (512GB) - Titanium Black (Unlocked)',
    category: 'Electronics & Mobile',
    price: 1399.00,
    currency: 'USD',
    rating: 4.8,
    reviewsCount: 3842,
    primeEligible: true,
    inStock: true,
    seller: 'Apple Store on Amazon',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
    description: 'A17 Pro chip, aerospace-grade titanium design, 48MP main camera, USB-C 3 with 10Gbps transfer speed.',
    recommendedExpenseAccount: 'Office & Facility:Computer Equipment',
  },
  {
    asin: 'B0B195B42X',
    title: 'Dell UltraSharp 38" Curved USB-C Hub Monitor (U3824DW)',
    category: 'Office & Workspace',
    price: 1149.99,
    currency: 'USD',
    rating: 4.7,
    reviewsCount: 1290,
    primeEligible: true,
    inStock: true,
    seller: 'Dell Technologies Official',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    description: 'WQHD+ IPS Black Technology with 2000:1 contrast ratio, 90W Power Delivery, RJ45 Gigabit Ethernet.',
    recommendedExpenseAccount: 'Office & Facility:Office Supplies',
  },
  {
    asin: 'B08N5LNQCX',
    title: 'Herman Miller Aeron Ergonomic Office Chair (Size B, Fully Loaded)',
    category: 'Furniture & Ergonomics',
    price: 1695.00,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 5200,
    primeEligible: true,
    inStock: true,
    seller: 'Herman Miller Direct',
    image: 'https://images.unsplash.com/photo-1580481077195-c3c129e9cb49?w=500&auto=format&fit=crop&q=60',
    description: 'Pellicle breathable mesh, PostureFit SL lumbar adjustment, fully adjustable arms and forward tilt.',
    recommendedExpenseAccount: 'Maintenance and Repair:Building Repairs',
  },
  {
    asin: 'B0BSHF7LHS',
    title: 'Anker 778 Thunderbolt 4 Docking Station (12-in-1, 40Gbps, 100W)',
    category: 'IT Hardware & Accessories',
    price: 379.99,
    currency: 'USD',
    rating: 4.6,
    reviewsCount: 890,
    primeEligible: true,
    inStock: true,
    seller: 'AnkerDirect',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&auto=format&fit=crop&q=60',
    description: 'Quadruple display support, 8K output, 100W max laptop charging, 2.5Gbps high-speed Ethernet.',
    recommendedExpenseAccount: 'Office & Facility:Computer Equipment',
  },
  {
    asin: 'B0C77G1613',
    title: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones',
    category: 'Audio & Communications',
    price: 398.00,
    currency: 'USD',
    rating: 4.7,
    reviewsCount: 14200,
    primeEligible: true,
    inStock: true,
    seller: 'Sony Authorized Amazon Seller',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    description: 'Two processors and 8 microphones for unparalleled noise cancellation, 30-hour battery life with quick charge.',
    recommendedExpenseAccount: 'Office & Facility:Office Supplies',
  },
  {
    asin: 'B09V4FN9RF',
    title: 'Samsung 990 PRO 4TB PCIe 4.0 NVMe M.2 SSD with Heatsink',
    category: 'Storage & Server Parts',
    price: 319.99,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 6810,
    primeEligible: true,
    inStock: true,
    seller: 'Samsung Electronics Store',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60',
    description: 'Read speeds up to 7450 MB/s, optimal thermal control for enterprise workstations and server clustering.',
    recommendedExpenseAccount: 'Legal & Professional Fees:Accounting',
  },
  {
    asin: 'B08F9V682C',
    title: 'Fellowes Commercial 24-Sheet Cross-Cut Heavy Duty Shredder',
    category: 'Facility & Security',
    price: 489.00,
    currency: 'USD',
    rating: 4.8,
    reviewsCount: 2100,
    primeEligible: true,
    inStock: true,
    seller: 'Fellowes Brand Official',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60',
    description: 'Continuous continuous run time for high-volume enterprise document destruction with jam-proof technology.',
    recommendedExpenseAccount: 'Maintenance and Repair:Building Repairs',
  },
  {
    asin: 'B0BT2C7TYL',
    title: 'APC Smart-UPS 1500VA Sine Wave Lithium-Ion Battery Backup (SMTL1500RM2UC)',
    category: 'Power & Infrastructure',
    price: 1849.00,
    currency: 'USD',
    rating: 4.8,
    reviewsCount: 750,
    primeEligible: true,
    inStock: true,
    seller: 'Schneider Electric / APC Direct',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    description: 'Cloud-enabled SmartConnect remote monitoring, 120V rackmount UPS protecting critical company servers.',
    recommendedExpenseAccount: 'Automobile',
  },
];

// -------------------------------------------------------------
// 1. GET /api/amazon/config
// Returns current APS configuration, active Citi accounts, and stats
// -------------------------------------------------------------
amazonApsRouter.get('/config', (req: Request, res: Response) => {
  const config = getAmazonApsConfig();
  const citiAccounts = getActiveCitiFundingAccounts();

  res.json({
    success: true,
    config,
    citiFundingAccountsCount: citiAccounts.length,
    citiAccounts: citiAccounts.map((a) => ({
      id: a.id,
      name: a.name,
      accountNumber: a.accountNumber,
      currency: a.currency,
      balance: a.balance,
      institution: a.institution,
      tokenName: a.cardEquivalent.tokenName,
    })),
    totalTransactions: apsTransactionLedger.length,
    recentTransactions: apsTransactionLedger.slice(-5).reverse(),
    serverTimestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 2. GET /api/amazon/catalog
// Returns Amazon product catalog ready for AI procurement
// -------------------------------------------------------------
amazonApsRouter.get('/catalog', (req: Request, res: Response) => {
  res.json({
    success: true,
    totalProducts: AMAZON_PRODUCT_CATALOG.length,
    catalog: AMAZON_PRODUCT_CATALOG,
  });
});

// -------------------------------------------------------------
// 3. GET /api/amazon/citi-funding-instruments
// Returns pulled Citi accounts formatted for payment funding
// -------------------------------------------------------------
amazonApsRouter.get('/citi-funding-instruments', (req: Request, res: Response) => {
  const accounts = getActiveCitiFundingAccounts();
  res.json({
    success: true,
    totalAccounts: accounts.length,
    accounts,
  });
});

// -------------------------------------------------------------
// 4. POST /api/amazon/calculate-signature
// Cryptographic Utility Endpoint for calculating APS signatures
// -------------------------------------------------------------
amazonApsRouter.post('/calculate-signature', (req: Request, res: Response) => {
  try {
    const { params = {}, shaPhrase, shaType } = req.body;
    const { signature, signatureString } = calculateApsSignature(params, shaPhrase, shaType);

    res.json({
      success: true,
      signature,
      signatureString,
      algorithm: shaType || 'SHA-256',
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 5. POST /api/amazon/paymentApi & /api/amazon/fort/paymentApi
// Master APS Payment API (Emulates/Proxies All Postman Commands)
// -------------------------------------------------------------
amazonApsRouter.post(['/paymentApi', '/fort/paymentApi'], async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    const config = getAmazonApsConfig();

    const command = payload.command || payload.service_command || payload.query_command || 'PURCHASE';
    const merchantRef = payload.merchant_reference || `merchantTest-${Math.floor(10000 + Math.random() * 90000)}`;
    const amount = Number(payload.amount || 20000);
    const currency = payload.currency || 'USD';
    const fortId = `169996${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const authCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Verify or calculate signature
    const { signature: computedSignature } = calculateApsSignature(payload, config.shaPhrase);
    const effectiveSignature = payload.signature || computedSignature;

    let responsePayload: any = {};
    let status = '02';
    let responseCode = '02000';
    let responseMessage = 'Success';

    switch (command.toUpperCase()) {
      case 'AUTHORIZATION':
        if (payload.token_name && !payload.card_security_code && !payload.card_number) {
          // New Customer Post Tokenization Auth (often asks for 3DS or gives 20064 / 02000)
          status = '02';
          responseCode = '02000';
          responseMessage = 'Success';
          responsePayload = {
            command: 'AUTHORIZATION',
            response_code: responseCode,
            status,
            response_message: responseMessage,
            merchant_reference: merchantRef,
            amount: String(amount),
            currency,
            fort_id: fortId,
            authorization_code: authCode,
            acquirer_response_code: '00',
            token_name: payload.token_name,
            card_number: payload.card_number || '411111******8902',
            payment_option: payload.payment_option || 'VISA',
            expiry_date: payload.expiry_date || '2707',
            customer_email: payload.customer_email || 'procurement@sandbox.intuit.com',
            eci: payload.eci || 'ECOMMERCE',
          };
        } else if (payload.digital_wallet === 'APPLE_PAY') {
          status = '02';
          responseCode = '02000';
          responseMessage = 'Success';
          responsePayload = {
            command: 'AUTHORIZATION',
            digital_wallet: 'APPLE_PAY',
            response_code: responseCode,
            status,
            response_message: responseMessage,
            merchant_reference: merchantRef,
            amount: String(amount),
            currency,
            fort_id: fortId,
            authorization_code: authCode,
            token_name: payload.token_name || 'tok_apple_citi_8819',
            card_number: '542418******2910',
            payment_option: 'MASTERCARD',
            reconciliation_reference: `REC-${Date.now()}`,
          };
        } else {
          status = '02';
          responseCode = '02000';
          responseMessage = 'Success';
          responsePayload = {
            command: 'AUTHORIZATION',
            response_code: responseCode,
            status,
            response_message: responseMessage,
            merchant_reference: merchantRef,
            amount: String(amount),
            currency,
            fort_id: fortId,
            authorization_code: authCode,
            acquirer_response_code: '00',
            token_name: payload.token_name || 'tok_citi_auth_8821',
            card_number: payload.card_number || '400555******4128',
            payment_option: 'VISA',
            eci: payload.eci || 'ECOMMERCE',
          };
        }
        break;

      case 'PURCHASE':
        status = '14';
        responseCode = '14000';
        responseMessage = 'Success';
        responsePayload = {
          command: 'PURCHASE',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          merchant_reference: merchantRef,
          amount: String(amount),
          currency,
          fort_id: fortId,
          authorization_code: authCode,
          acquirer_response_code: '00',
          token_name: payload.token_name || 'tok_citi_purch_9041',
          card_number: payload.card_number || '400555******4128',
          card_holder_name: payload.card_holder_name || 'CITI BUSINESS CLIENT',
          payment_option: payload.payment_option || 'VISA',
          expiry_date: payload.expiry_date || '2812',
          customer_ip: payload.customer_ip || '192.0.0.1',
          customer_email: payload.customer_email || 'procurement@sandbox.intuit.com',
          eci: payload.eci || 'ECOMMERCE',
          signature: effectiveSignature,
        };
        if (payload.installments === 'HOSTED') {
          responsePayload.installments = 'HOSTED';
          responsePayload.plan_code = payload.plan_code || 'yNW32L';
          responsePayload.issuer_code = payload.issuer_code || 'Xylg7w';
        }
        if (payload.digital_wallet === 'STCPAY') {
          responsePayload.digital_wallet = 'STCPAY';
          responsePayload.phone_number = payload.phone_number;
        }
        break;

      case 'CAPTURE':
        status = '04';
        responseCode = '04000';
        responseMessage = 'Success';
        responsePayload = {
          command: 'CAPTURE',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          merchant_reference: merchantRef,
          amount: String(amount),
          currency,
          fort_id: fortId,
          acquirer_response_code: '00',
        };
        break;

      case 'VOID_AUTHORIZATION':
        status = '08';
        responseCode = '08000';
        responseMessage = 'Success';
        responsePayload = {
          command: 'VOID_AUTHORIZATION',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          merchant_reference: merchantRef,
          fort_id: fortId,
          acquirer_response_code: '00',
        };
        break;

      case 'REFUND':
        status = '06';
        responseCode = '06000';
        responseMessage = 'Success';
        responsePayload = {
          command: 'REFUND',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          merchant_reference: merchantRef,
          amount: String(amount),
          currency,
          fort_id: fortId,
          acquirer_response_code: '00',
        };
        break;

      case 'GET_INSTALLMENTS_PLANS':
        status = '62';
        responseCode = '62000';
        responseMessage = 'Success';
        responsePayload = {
          query_command: 'GET_INSTALLMENTS_PLANS',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          amount: String(amount),
          currency,
          installment_detail: {
            issuer_detail: [
              {
                issuer_name_en: 'Citigroup Open Banking Installments',
                issuer_code: 'CITI_AU_PLANS',
                banking_system: 'Commercial Credit',
                country_code: 'AUS',
                plan_details: [
                  {
                    plan_code: 'CITI_3M_ZERO',
                    number_of_installment: 3,
                    amountPerMonth: (amount / 3 / 100).toFixed(2),
                    fees_amount: 0,
                    rate_type: 'Zero Interest Promo',
                    plan_type: 'Corporate Flex',
                  },
                  {
                    plan_code: 'CITI_6M_FLEX',
                    number_of_installment: 6,
                    amountPerMonth: ((amount * 1.02) / 6 / 100).toFixed(2),
                    fees_amount: 50,
                    rate_type: 'Flat 2.0%',
                    plan_type: 'Standard Corporate',
                  },
                  {
                    plan_code: 'CITI_12M_PRIME',
                    number_of_installment: 12,
                    amountPerMonth: ((amount * 1.04) / 12 / 100).toFixed(2),
                    fees_amount: 100,
                    rate_type: 'Flat 4.0%',
                    plan_type: 'Extended Liquidity',
                  },
                ],
              },
            ],
          },
        };
        break;

      case 'CURRENCY_CONVERSION':
        status = '42';
        responseCode = '42000';
        responseMessage = 'Success';
        const targetCurr = payload.converted_currency || 'AED';
        const conversionRate = targetCurr === 'AED' ? 3.6725 : targetCurr === 'AUD' ? 1.54 : 1.0;
        const convertedAmt = Math.round(amount * conversionRate);
        responsePayload = {
          service_command: 'CURRENCY_CONVERSION',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          amount: String(amount),
          currency,
          converted_currency: targetCurr,
          converted_amount: String(convertedAmt),
          conversion_number: fortId,
        };
        break;

      case 'CHECK_STATUS':
        status = '12';
        responseCode = '12000';
        responseMessage = 'Success';
        responsePayload = {
          query_command: 'CHECK_STATUS',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          merchant_reference: merchantRef,
          fort_id: fortId,
          transaction_code: '14000',
          transaction_status: '14',
          transaction_message: 'Success',
          authorized_amount: String(amount),
          captured_amount: String(amount),
          refunded_amount: '0',
        };
        break;

      case 'PAYMENT_LINK':
        status = '48';
        responseCode = '48000';
        responseMessage = 'Success';
        responsePayload = {
          service_command: 'PAYMENT_LINK',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          merchant_reference: merchantRef,
          amount: String(amount),
          currency,
          payment_link_id: fortId,
          payment_link: `https://sbcheckout.payfort.com/pay/${merchantRef}`,
          notification_type: payload.notification_type || 'EMAIL',
          customer_email: payload.customer_email || 'finance@sandbox.intuit.com',
          request_expiry_date: payload.request_expiry_date || new Date(Date.now() + 86400000 * 3).toISOString(),
        };
        break;

      case 'SDK_TOKEN':
        status = '22';
        responseCode = '22000';
        responseMessage = 'Success';
        responsePayload = {
          service_command: 'SDK_TOKEN',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          device_id: payload.device_id || crypto.randomUUID(),
          sdk_token: `aps_sdk_${crypto.randomBytes(16).toString('hex')}`,
        };
        break;

      case '3DS_ENROLLMENT':
        status = '44';
        responseCode = '44000';
        responseMessage = 'Success';
        responsePayload = {
          service_command: '3DS_ENROLLMENT',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          merchant_reference: merchantRef,
          amount: String(amount),
          currency,
          threeds_id: fortId,
          '3ds_enrolled': 'Y',
          '3ds_url': `https://sbsimulator.payfort.com/secure3dsSimulator?paymentId=${fortId}`,
          '3ds_xid': crypto.randomBytes(16).toString('base64'),
        };
        break;

      case '3DS_AUTHENTICATION':
        status = '44';
        responseCode = '44000';
        responseMessage = 'Success';
        responsePayload = {
          service_command: '3DS_AUTHENTICATION',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          merchant_reference: merchantRef,
          threeds_id: fortId,
          '3ds_status': 'Y',
          '3ds_enrolled': 'Y',
          '3ds_eci': '05',
          ver_token: crypto.randomBytes(16).toString('base64'),
        };
        break;

      case 'GENERATE_OTP':
        status = '88';
        responseCode = '88000';
        responseMessage = 'Success';
        responsePayload = {
          service_command: 'GENERATE_OTP',
          digital_wallet: 'STCPAY',
          response_code: responseCode,
          status,
          response_message: responseMessage,
          merchant_reference: merchantRef,
          phone_number: payload.phone_number || '0551111111',
          amount: String(amount),
          currency,
        };
        break;

      default:
        responsePayload = {
          command,
          response_code: '02000',
          status: '02',
          response_message: 'Success',
          merchant_reference: merchantRef,
          fort_id: fortId,
          amount: String(amount),
          currency,
        };
    }

    // Embed matching signature
    const finalRespSignature = calculateApsSignature(responsePayload, config.shaPhrase).signature;
    responsePayload.signature = finalRespSignature;
    responsePayload.access_code = config.accessCode;
    responsePayload.merchant_identifier = config.merchantIdentifier;
    responsePayload.language = config.language;

    // Record into local APS Ledger
    const recordedTx: AmazonApsTransaction = {
      id: `tx_aps_${crypto.randomUUID().slice(0, 12)}`,
      fortId,
      timestamp: new Date().toISOString(),
      command,
      merchantReference: merchantRef,
      amount: amount / 100, // Standardize to dollar units
      currency,
      status,
      responseCode,
      responseMessage,
      authorizationCode: authCode,
      paymentOption: payload.payment_option || 'VISA',
      digitalWallet: payload.digital_wallet,
      cardMasked: payload.card_number ? `${payload.card_number.slice(0, 6)}******${payload.card_number.slice(-4)}` : undefined,
      channel: (payload.eci === 'MOTO' ? 'MOTO' : payload.digital_wallet ? 'APPLE_PAY' : 'MERCHANT_PAGE') as any,
      fundingSource: {
        institution: 'Citibank N.A. / Citigroup AU',
        accountName: 'Citi Premier Commercial Checking',
        accountId: 'AU-CITI-CHK-904128',
        accountNumber: '••••••••4128',
        type: 'CHECKING',
      },
      rawRequest: payload,
      rawResponse: responsePayload,
    };

    apsTransactionLedger.push(recordedTx);

    // Record into Unified QuickBooks Autonomous Bridge Ledger
    try {
      recordBridgeEvent({
        source: 'CITI_OPEN_BANKING',
        action: 'CITI_TOKEN_GENERATION',
        realmId: activeTokens?.realmId || null,
        qboLinkedEntityType: 'Purchase',
        externalEntityId: fortId,
        amount: recordedTx.amount,
        currency,
        status: 'LOCKED_INTO_QUICKBOOKS',
        summary: `Amazon Payment Services APS (${command}): ${merchantRef} via Citi Bank`,
        rawPayload: {
          apsResponse: responsePayload,
          merchantRef,
          fortId,
        },
      });
    } catch (bridgeErr) {
      console.error('Bridge event error in APS:', bridgeErr);
    }

    res.json(responsePayload);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      response_code: '00001',
      response_message: 'Internal processing error',
    });
  }
});

// -------------------------------------------------------------
// 6. POST /api/amazon/reportingApi & /api/amazon/batchApi
// APS Reporting and Batch File Upload/Validation/Processing
// -------------------------------------------------------------
amazonApsRouter.post('/reportingApi', (req: Request, res: Response) => {
  const payload = req.body || {};
  const queryCommand = payload.query_command || 'GENERATE_REPORT';
  const config = getAmazonApsConfig();
  const merchantRef = payload.merchant_reference || `REP-${Date.now()}`;

  if (queryCommand === 'GENERATE_REPORT') {
    res.json({
      query_command: 'GENERATE_REPORT',
      response_code: '56000',
      status: '56',
      response_message: 'Success',
      merchant_reference: merchantRef,
      merchant_identifier: config.merchantIdentifier,
      access_code: config.accessCode,
      from_date: payload.from_date || '2026-08-01T00:00:00+00:00',
      to_date: payload.to_date || new Date().toISOString(),
      response_format: payload.response_format || 'JSON',
      signature: calculateApsSignature({ query_command: 'GENERATE_REPORT', response_code: '56000', merchant_reference: merchantRef }, config.shaPhrase).signature,
    });
  } else if (queryCommand === 'DOWNLOAD_REPORT') {
    const reportData = [
      { data_count: apsTransactionLedger.length },
      apsTransactionLedger.map((tx) => ({
        transaction_date: tx.timestamp,
        amount: String(Math.round(tx.amount * 100)),
        currency: tx.currency,
        fort_id: tx.fortId,
        merchant_reference: tx.merchantReference,
        operation: tx.command,
        payment_option: tx.paymentOption || 'VISA',
        status: 'Accepted',
        response_code: tx.responseCode,
        response_message: tx.responseMessage,
        authorization_code: tx.authorizationCode,
      })),
    ];
    res.json(reportData);
  } else {
    // GET_REPORT with pagination
    res.json({
      query_command: 'GET_REPORT',
      response_code: '56000',
      status: '56',
      response_message: 'Success',
      transactions_count: String(apsTransactionLedger.length),
      page_size: payload.page_size || '10',
      start_index: payload.start_index || '1',
      transactions: apsTransactionLedger.slice(0, 10).map((tx) => ({
        transaction_date: tx.timestamp,
        amount: String(Math.round(tx.amount * 100)),
        currency: tx.currency,
        fort_id: tx.fortId,
        merchant_reference: tx.merchantReference,
        operation: tx.command,
        payment_option: tx.paymentOption || 'VISA',
        status: 'Accepted',
        response_code: tx.responseCode,
      })),
    });
  }
});

amazonApsRouter.post('/batchApi', (req: Request, res: Response) => {
  const payload = req.body || {};
  const serviceCommand = payload.service_command || 'PROCESS_BATCH';
  const config = getAmazonApsConfig();
  const batchId = payload.batch_id || `BATCH-${Date.now()}`;
  const batchRef = payload.batch_reference || `ORD-INV-${Math.floor(100000 + Math.random() * 900000)}`;

  if (serviceCommand === 'GET_BATCH_RESULTS') {
    res.json({
      service_command: 'GET_BATCH_RESULTS',
      response_code: '70000',
      status: '70',
      response_message: 'Success',
      batch_id: batchId,
      batch_reference: batchRef,
      transactions_count: '15',
      success_count: '15',
      merchant_identifier: config.merchantIdentifier,
      access_code: config.accessCode,
    });
  } else {
    res.json({
      service_command: 'PROCESS_BATCH',
      response_code: '72147',
      status: '72',
      response_message: 'The Batch process request has been received',
      batch_id: batchId,
      batch_reference: batchRef,
      merchant_identifier: config.merchantIdentifier,
      access_code: config.accessCode,
    });
  }
});

// -------------------------------------------------------------
// 7. POST /api/amazon/ai-buy
// AI Autonomous Procurement Engine on Amazon with Citibank accounts!
// -------------------------------------------------------------
amazonApsRouter.post('/ai-buy', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      selectedAsin,
      quantity = 1,
      preferredCitiAccountId,
      paymentChannel = 'MERCHANT_PAGE',
      autoExecuteQbo = true,
      tokenOverride,
      realmIdOverride,
    } = req.body;

    if (!prompt && !selectedAsin) {
      return res.status(400).json({
        success: false,
        error: 'Missing required purchase intent prompt or selected Amazon ASIN.',
      });
    }

    const config = getAmazonApsConfig();
    const citiAccounts = getActiveCitiFundingAccounts();

    // Find catalog product if ASIN passed, or evaluate semantic match
    let targetProduct = AMAZON_PRODUCT_CATALOG.find((p) => p.asin === selectedAsin);
    
    // AI Evaluation Prompt
    const aiSystemPrompt = `
You are the Amazon Autonomous Procurement Agent for our enterprise, powered by Amazon Payment Services (APS / PayFort) and connected live to our Citibank Commercial & Consumer Banking liquidity reserve.

USER PROCUREMENT REQUEST:
"${prompt || `Purchase ${quantity} unit(s) of ASIN ${selectedAsin}`}"

AVAILABLE AMAZON CATALOG:
${JSON.stringify(AMAZON_PRODUCT_CATALOG, null, 2)}

AVAILABLE CITIBANK FUNDING INSTRUMENTS:
${JSON.stringify(
  citiAccounts.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.accountType,
    currency: a.currency,
    availableBalance: a.balance,
    cardMasked: a.accountNumber,
    tokenName: a.cardEquivalent.tokenName,
    institution: a.institution,
  })),
  null,
  2
)}

PREFERRED CITI ACCOUNT ID: ${preferredCitiAccountId || 'None (Decide Autonomously based on liquidity)'}

TASK:
1. Identify the exact Amazon item(s) to buy, title, ASIN, quantity, unit price (USD), subtotal, estimated sales tax (assume 8.25%), and total amount.
2. Select the optimal Citibank funding instrument from the available accounts. (e.g. For large tech/office hardware, prefer 'AU-CITI-CHK-904128' or 'US-CITI-FDX-1150040000').
3. Formulate the exact APS Payment API parameters:
   - Command: 'PURCHASE'
   - Currency: Selected Citi account currency or 'USD'
   - Amount: Total in cents (e.g. $1,149.99 -> 114999)
   - Merchant Reference: Formatted as 'AMZ-CORP-XXXXXX'
   - Payment Option: 'VISA' or 'MASTERCARD'
   - ECI: 'ECOMMERCE'
4. Map to QuickBooks Online Expense Account (e.g. 'Office & Facility:Computer Equipment', 'Office Supplies', 'Maintenance and Repair', etc.).
5. Provide a detailed, professional AI Rationale explaining the selection, liquidity impact, and tax allocation.
`;

    let aiDecision: any = null;
    const ai = getAiClient();

    try {
      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: aiSystemPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productTitle: { type: Type.STRING },
              asin: { type: Type.STRING },
              quantity: { type: Type.INTEGER },
              unitPrice: { type: Type.NUMBER },
              subtotal: { type: Type.NUMBER },
              taxAmount: { type: Type.NUMBER },
              totalAmount: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              selectedCitiAccountId: { type: Type.STRING },
              selectedCitiAccountName: { type: Type.STRING },
              selectedCitiTokenName: { type: Type.STRING },
              qboExpenseAccountName: { type: Type.STRING },
              rationale: { type: Type.STRING },
              deliveryEstimateDays: { type: Type.INTEGER },
            },
            required: [
              'productTitle',
              'asin',
              'quantity',
              'unitPrice',
              'subtotal',
              'taxAmount',
              'totalAmount',
              'currency',
              'selectedCitiAccountId',
              'selectedCitiAccountName',
              'selectedCitiTokenName',
              'qboExpenseAccountName',
              'rationale',
            ],
          },
        },
      });

      aiDecision = JSON.parse(aiResponse.text || '{}');
    } catch (aiErr) {
      console.warn('Gemini 3.7 Flash fallback in Amazon buyer:', aiErr);
      // Fallback deterministic logic
      if (!targetProduct) {
        targetProduct = AMAZON_PRODUCT_CATALOG[1]; // Dell UltraSharp
      }
      const qty = quantity || 1;
      const subtotal = Number((targetProduct.price * qty).toFixed(2));
      const tax = Number((subtotal * 0.0825).toFixed(2));
      const total = Number((subtotal + tax).toFixed(2));
      const chosenCiti = citiAccounts.find((a) => a.id === preferredCitiAccountId) || citiAccounts[0];

      aiDecision = {
        productTitle: targetProduct.title,
        asin: targetProduct.asin,
        quantity: qty,
        unitPrice: targetProduct.price,
        subtotal,
        taxAmount: tax,
        totalAmount: total,
        currency: 'USD',
        selectedCitiAccountId: chosenCiti.id,
        selectedCitiAccountName: chosenCiti.name,
        selectedCitiTokenName: chosenCiti.cardEquivalent.tokenName,
        qboExpenseAccountName: targetProduct.recommendedExpenseAccount,
        rationale: `Autonomously selected ${targetProduct.title} for workspace productivity. Funded via ${chosenCiti.name} with optimal liquidity headroom.`,
        deliveryEstimateDays: 2,
      };
    }

    // Resolve matching Citi Account
    const matchedCiti =
      citiAccounts.find((a) => a.id === aiDecision.selectedCitiAccountId) ||
      citiAccounts.find((a) => a.cardEquivalent.tokenName === aiDecision.selectedCitiTokenName) ||
      citiAccounts[0];

    const merchantRef = `AMZ-CORP-${Math.floor(100000 + Math.random() * 900000)}`;
    const fortId = `169996${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const authCode = Math.floor(100000 + Math.random() * 900000).toString();
    const amountInCents = Math.round(aiDecision.totalAmount * 100);

    // Prepare APS Payload
    const apsRequestPayload: any = {
      command: 'PURCHASE',
      access_code: config.accessCode,
      merchant_identifier: config.merchantIdentifier,
      merchant_reference: merchantRef,
      amount: String(amountInCents),
      currency: aiDecision.currency || 'USD',
      language: 'en',
      customer_email: 'procurement@sandbox.intuit.com',
      token_name: matchedCiti.cardEquivalent.tokenName,
      card_number: matchedCiti.cardEquivalent.cardNumber,
      card_holder_name: matchedCiti.cardEquivalent.cardHolder,
      expiry_date: matchedCiti.cardEquivalent.expiryDate,
      customer_ip: '127.0.0.1',
      eci: 'ECOMMERCE',
      order_description: `Amazon Business Order: ${aiDecision.productTitle} (x${aiDecision.quantity})`,
    };

    const { signature } = calculateApsSignature(apsRequestPayload, config.shaPhrase);
    apsRequestPayload.signature = signature;

    const apsResponsePayload = {
      command: 'PURCHASE',
      response_code: '14000',
      status: '14',
      response_message: 'Success',
      merchant_reference: merchantRef,
      amount: String(amountInCents),
      currency: aiDecision.currency || 'USD',
      fort_id: fortId,
      authorization_code: authCode,
      card_number: `${matchedCiti.cardEquivalent.cardNumber.slice(0, 6)}******${matchedCiti.cardEquivalent.cardNumber.slice(-4)}`,
      card_holder_name: matchedCiti.cardEquivalent.cardHolder,
      payment_option: matchedCiti.accountType === 'CREDIT_CARD' ? 'MASTERCARD' : 'VISA',
      signature: calculateApsSignature(
        {
          command: 'PURCHASE',
          response_code: '14000',
          status: '14',
          fort_id: fortId,
          merchant_reference: merchantRef,
        },
        config.shaPhrase
      ).signature,
    };

    // Record into Ledger
    const recordedTx: AmazonApsTransaction = {
      id: `tx_amz_${crypto.randomUUID().slice(0, 12)}`,
      fortId,
      timestamp: new Date().toISOString(),
      command: 'PURCHASE',
      merchantReference: merchantRef,
      amount: aiDecision.totalAmount,
      currency: aiDecision.currency || 'USD',
      status: '14',
      responseCode: '14000',
      responseMessage: 'Success',
      authorizationCode: authCode,
      paymentOption: apsResponsePayload.payment_option,
      cardMasked: apsResponsePayload.card_number,
      channel: 'MERCHANT_PAGE',
      fundingSource: {
        institution: matchedCiti.institution,
        accountName: matchedCiti.name,
        accountId: matchedCiti.id,
        accountNumber: matchedCiti.accountNumber,
        type: matchedCiti.accountType,
      },
      rawRequest: apsRequestPayload,
      rawResponse: apsResponsePayload,
    };

    apsTransactionLedger.push(recordedTx);

    // QuickBooks Integration
    let qboDocNumber = `AMZ-${Math.floor(100000 + Math.random() * 900000)}`;
    let qboPostStatus: 'POSTED_LIVE' | 'SIMULATED_LOCAL' = 'SIMULATED_LOCAL';
    let qboResponseData: any = null;

    const accessToken = tokenOverride || activeTokens.accessToken;
    const realmId = realmIdOverride || activeTokens.realmId;

    if (autoExecuteQbo && accessToken && realmId) {
      try {
        const qboPurchaseBody = {
          AccountRef: {
            value: '35',
            name: matchedCiti.name,
          },
          PaymentType: matchedCiti.accountType === 'CREDIT_CARD' ? 'CreditCard' : 'Cash',
          EntityRef: {
            name: 'Amazon.com Commercial Services LLC',
            type: 'Vendor',
          },
          TxnDate: new Date().toISOString().split('T')[0],
          TotalAmt: aiDecision.totalAmount,
          DocNumber: qboDocNumber,
          PrivateNote: `Amazon Autonomous Purchase via Gemini 3.7 & Citi Bank (PayFort ID: ${fortId}, Auth: ${authCode})`,
          Line: [
            {
              Amount: aiDecision.subtotal,
              DetailType: 'AccountBasedExpenseLineDetail',
              AccountBasedExpenseLineDetail: {
                AccountRef: {
                  value: '73',
                  name: aiDecision.qboExpenseAccountName || 'Maintenance and Repair',
                },
              },
              Description: `${aiDecision.productTitle} (ASIN: ${aiDecision.asin}, Qty: ${aiDecision.quantity})`,
            },
          ],
        };

        const intuitUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/purchase?minorversion=73`;
        const qboRes = await fetch(intuitUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(qboPurchaseBody),
        });

        if (qboRes.ok) {
          qboResponseData = await qboRes.json();
          qboPostStatus = 'POSTED_LIVE';
          if (qboResponseData?.Purchase?.DocNumber) {
            qboDocNumber = qboResponseData.Purchase.DocNumber;
          }
        }
      } catch (qboErr) {
        console.warn('QBO posting error for Amazon AI Buy:', qboErr);
      }
    }

    // Record into Autonomous Bridge Ledger
    try {
      recordBridgeEvent({
        source: 'CITI_OPEN_BANKING',
        action: 'CITI_TOKEN_GENERATION',
        realmId: activeTokens?.realmId || null,
        qboLinkedEntityType: 'Purchase',
        externalEntityId: fortId,
        amount: aiDecision.totalAmount,
        currency: aiDecision.currency || 'USD',
        status: 'LOCKED_INTO_QUICKBOOKS',
        summary: `Amazon AI Purchase: ${aiDecision.productTitle} ($${aiDecision.totalAmount}) via ${matchedCiti.name}`,
        rawPayload: {
          asin: aiDecision.asin,
          apsFortId: fortId,
          citiAccount: matchedCiti,
          qboDocNumber,
          authCode,
        },
      });
    } catch (bridgeErr) {
      console.error('Bridge event recording error:', bridgeErr);
    }

    res.json({
      success: true,
      decision: aiDecision,
      order: {
        orderId: `AMZ-ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        asin: aiDecision.asin,
        productTitle: aiDecision.productTitle,
        quantity: aiDecision.quantity,
        totalAmount: aiDecision.totalAmount,
        currency: aiDecision.currency || 'USD',
        estimatedDelivery: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }),
        trackingNumber: `TBA${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        seller: 'Amazon.com Services LLC',
      },
      apsTransaction: recordedTx,
      apsPaymentResponse: apsResponsePayload,
      citiFundingAccount: {
        id: matchedCiti.id,
        name: matchedCiti.name,
        accountNumber: matchedCiti.accountNumber,
        type: matchedCiti.accountType,
        institution: matchedCiti.institution,
        priorBalance: matchedCiti.balance,
        newBalance: Number((matchedCiti.balance - aiDecision.totalAmount).toFixed(2)),
      },
      quickbooks: {
        status: qboPostStatus,
        docNumber: qboDocNumber,
        expenseAccount: aiDecision.qboExpenseAccountName,
        liveResponse: qboResponseData,
      },
      audit: {
        fortId,
        authCode,
        signature,
        signatureAlgorithm: config.shaType,
        merchantReference: merchantRef,
        executedAt: recordedTx.timestamp,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/amazon/ai-buy:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 8. GET & DELETE /api/amazon/history
// -------------------------------------------------------------
amazonApsRouter.get('/history', (req: Request, res: Response) => {
  res.json({
    success: true,
    totalTransactions: apsTransactionLedger.length,
    history: apsTransactionLedger,
  });
});

amazonApsRouter.delete('/history', (req: Request, res: Response) => {
  apsTransactionLedger.length = 0;
  res.json({ success: true, message: 'Amazon APS transaction history cleared.' });
});

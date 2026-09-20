import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getFinicityEnvConfig } from './finicity-api.js';

export const envManagerRouter = Router();

export interface EnvVariableItem {
  key: string;
  category: string;
  categoryLabel: string;
  description: string;
  value: string;
  isSecret: boolean;
  isSet: boolean;
  status: 'configured' | 'missing' | 'expired_notice';
  isExpiredNotice?: boolean;
  requiredFor?: string;
  maskedValue: string;
  defaultValue?: string;
}

export function maskSecret(val: string): string {
  if (!val) return '';
  if (val.length <= 8) return '••••••••';
  return `${val.slice(0, 4)}••••••••${val.slice(-4)}`;
}

export function getAllEnvironmentVariables(): EnvVariableItem[] {
  const rawList: any[] = [
    // 1. Google Cloud Service Account & IAM
    {
      key: 'GOOGLE_PROJECT_ID',
      category: 'google',
      categoryLabel: 'Google Cloud & IAM',
      description: 'GCP Project ID for service principal and IAM token minting',
      value: process.env.GOOGLE_PROJECT_ID || 'aistudio-quickbooksoauth2-43d92844',
      isSecret: false,
      isSet: Boolean(process.env.GOOGLE_PROJECT_ID),
      maskedValue: process.env.GOOGLE_PROJECT_ID || 'aistudio-quickbooksoauth2-43d92844',
      defaultValue: 'aistudio-quickbooksoauth2-43d92844',
    },
    {
      key: 'GOOGLE_CLIENT_EMAIL',
      category: 'google',
      categoryLabel: 'Google Cloud & IAM',
      description: 'Service Account client email address',
      value: process.env.GOOGLE_CLIENT_EMAIL || 'service-principal@aistudio-quickbooksoauth2-43d92844.iam.gserviceaccount.com',
      isSecret: false,
      isSet: Boolean(process.env.GOOGLE_CLIENT_EMAIL),
      maskedValue: process.env.GOOGLE_CLIENT_EMAIL || 'service-principal@aistudio-quickbooksoauth2-43d92844.iam.gserviceaccount.com',
      defaultValue: 'service-principal@aistudio-quickbooksoauth2-43d92844.iam.gserviceaccount.com',
    },
    {
      key: 'GOOGLE_PRIVATE_KEY',
      category: 'google',
      categoryLabel: 'Google Cloud & IAM',
      description: 'RSA 2048-bit Private Key for OAuth JWT signing and token generation',
      value: process.env.GOOGLE_PRIVATE_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.GOOGLE_PRIVATE_KEY),
      maskedValue: maskSecret(process.env.GOOGLE_PRIVATE_KEY || ''),
    },
    {
      key: 'GOOGLE_HMAC_SERVICE_ACCOUNT',
      category: 'google',
      categoryLabel: 'Google Cloud & IAM',
      description: 'Service Account owning Cloud Storage HMAC keys',
      value: process.env.GOOGLE_HMAC_SERVICE_ACCOUNT || 'service-principal@aistudio-quickbooksoauth2-43d92844.iam.gserviceaccount.com',
      isSecret: false,
      isSet: Boolean(process.env.GOOGLE_HMAC_SERVICE_ACCOUNT),
      maskedValue: process.env.GOOGLE_HMAC_SERVICE_ACCOUNT || 'service-principal@aistudio-quickbooksoauth2-43d92844.iam.gserviceaccount.com',
    },
    {
      key: 'GOOGLE_HMAC_ACCESS_ID',
      category: 'google',
      categoryLabel: 'Google Cloud & IAM',
      description: 'HMAC Access ID (starts with GOOG1E...) for AWS S3 compatibility',
      value: process.env.GOOGLE_HMAC_ACCESS_ID || 'GOOG1E738194720491823901',
      isSecret: false,
      isSet: Boolean(process.env.GOOGLE_HMAC_ACCESS_ID),
      maskedValue: process.env.GOOGLE_HMAC_ACCESS_ID || 'GOOG1E738194720491823901',
      defaultValue: 'GOOG1E738194720491823901',
    },
    {
      key: 'GOOGLE_HMAC_SECRET',
      category: 'google',
      categoryLabel: 'Google Cloud & IAM',
      description: 'Base64 HMAC Secret Key for cryptographic request signing',
      value: process.env.GOOGLE_HMAC_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.GOOGLE_HMAC_SECRET),
      maskedValue: maskSecret(process.env.GOOGLE_HMAC_SECRET || ''),
    },

    // 2. Google Gemini AI
    {
      key: 'GEMINI_API_KEY',
      category: 'gemini',
      categoryLabel: 'Google Gemini AI',
      description: 'Google AI Studio Gemini API Key for server-side ledger mapping & NLP ingest',
      value: process.env.GEMINI_API_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.GEMINI_API_KEY),
      maskedValue: maskSecret(process.env.GEMINI_API_KEY || ''),
    },

    // 3. Mastercard Open Finance / Finicity
    {
      key: 'FINICITY_API_BASE_URL',
      category: 'finicity',
      categoryLabel: 'Mastercard Open Finance (Finicity)',
      description: 'Mastercard Finicity API Host URL',
      value: process.env.FINICITY_API_BASE_URL || 'https://api.finicity.com',
      isSecret: false,
      isSet: Boolean(process.env.FINICITY_API_BASE_URL),
      maskedValue: process.env.FINICITY_API_BASE_URL || 'https://api.finicity.com',
      defaultValue: 'https://api.finicity.com',
    },
    {
      key: 'FINICITY_APP_KEY',
      category: 'finicity',
      categoryLabel: 'Mastercard Open Finance (Finicity)',
      description: 'Mastercard Finicity Application Key (Header: Finicity-App-Key)',
      value: process.env.FINICITY_APP_KEY || '2423653942467',
      isSecret: false,
      isSet: Boolean(process.env.FINICITY_APP_KEY),
      maskedValue: process.env.FINICITY_APP_KEY || '2423653942467',
      defaultValue: '2423653942467',
    },
    {
      key: 'FINICITY_PARTNER_ID',
      category: 'finicity',
      categoryLabel: 'Mastercard Open Finance (Finicity)',
      description: 'Mastercard Finicity Partner ID for Step 1 Authentication',
      value: process.env.FINICITY_PARTNER_ID || '2423653942467',
      isSecret: false,
      isSet: Boolean(process.env.FINICITY_PARTNER_ID),
      maskedValue: process.env.FINICITY_PARTNER_ID || '2423653942467',
      defaultValue: '2423653942467',
    },
    {
      key: 'FINICITY_PARTNER_SECRET',
      category: 'finicity',
      categoryLabel: 'Mastercard Open Finance (Finicity)',
      description: 'Mastercard Finicity Partner Secret credential',
      value: process.env.FINICITY_PARTNER_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.FINICITY_PARTNER_SECRET),
      maskedValue: maskSecret(process.env.FINICITY_PARTNER_SECRET || ''),
    },
    {
      key: 'FINICITY_APP_TOKEN',
      category: 'finicity',
      categoryLabel: 'Mastercard Open Finance (Finicity)',
      description: 'Live 2-hour Finicity App Token (Header: Finicity-App-Token)',
      value: process.env.FINICITY_APP_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.FINICITY_APP_TOKEN),
      maskedValue: maskSecret(process.env.FINICITY_APP_TOKEN || ''),
    },
    {
      key: 'FINICITY_CUSTOMER_ID',
      category: 'finicity',
      categoryLabel: 'Mastercard Open Finance (Finicity)',
      description: 'Active testing customer ID for account aggregation',
      value: process.env.FINICITY_CUSTOMER_ID || '1005061234',
      isSecret: false,
      isSet: Boolean(process.env.FINICITY_CUSTOMER_ID),
      maskedValue: process.env.FINICITY_CUSTOMER_ID || '1005061234',
      defaultValue: '1005061234',
    },
    {
      key: 'FINICITY_CUSTOMER_USERNAME',
      category: 'finicity',
      categoryLabel: 'Mastercard Open Finance (Finicity)',
      description: 'Test customer profile username',
      value: process.env.FINICITY_CUSTOMER_USERNAME || 'customerusername1',
      isSecret: false,
      isSet: Boolean(process.env.FINICITY_CUSTOMER_USERNAME),
      maskedValue: process.env.FINICITY_CUSTOMER_USERNAME || 'customerusername1',
      defaultValue: 'customerusername1',
    },
    {
      key: 'FINICITY_ENVIRONMENT',
      category: 'finicity',
      categoryLabel: 'Mastercard Open Finance (Finicity)',
      description: 'Finicity Target Environment (sandbox / production)',
      value: process.env.FINICITY_ENVIRONMENT || 'sandbox',
      isSecret: false,
      isSet: Boolean(process.env.FINICITY_ENVIRONMENT),
      maskedValue: process.env.FINICITY_ENVIRONMENT || 'sandbox',
      defaultValue: 'sandbox',
    },

    // 4. Chase Open Banking & Loyalty
    {
      key: 'CHASE_API_BASE_URL',
      category: 'chase',
      categoryLabel: 'Chase Open Banking & Loyalty',
      description: 'Chase API Demo and Mock endpoint base',
      value: process.env.CHASE_API_BASE_URL || 'https://apidemo.chase.com',
      isSecret: false,
      isSet: Boolean(process.env.CHASE_API_BASE_URL),
      maskedValue: process.env.CHASE_API_BASE_URL || 'https://apidemo.chase.com',
      defaultValue: 'https://apidemo.chase.com',
    },
    {
      key: 'CHASE_DEVELOPER_BASE_URL',
      category: 'chase',
      categoryLabel: 'Chase Open Banking & Loyalty',
      description: 'Chase Developer Portal origin',
      value: process.env.CHASE_DEVELOPER_BASE_URL || 'https://developer.chase.com',
      isSecret: false,
      isSet: Boolean(process.env.CHASE_DEVELOPER_BASE_URL),
      maskedValue: process.env.CHASE_DEVELOPER_BASE_URL || 'https://developer.chase.com',
      defaultValue: 'https://developer.chase.com',
    },
    {
      key: 'CHASE_PLAYGROUND_ID_TOKEN',
      category: 'chase',
      categoryLabel: 'Chase Open Banking & Loyalty',
      description: 'Raw Chase Developer Playground Token for proxy verification',
      value: process.env.CHASE_PLAYGROUND_ID_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.CHASE_PLAYGROUND_ID_TOKEN),
      maskedValue: maskSecret(process.env.CHASE_PLAYGROUND_ID_TOKEN || ''),
    },
    {
      key: 'CHASE_AUTHORIZATION',
      category: 'chase',
      categoryLabel: 'Chase Open Banking & Loyalty',
      description: 'Primary Chase Authorization Bearer Token',
      value: process.env.CHASE_AUTHORIZATION || 'EB3ik8VN9sAV2YjUnZv5UUcAUzFg',
      isSecret: true,
      isSet: Boolean(process.env.CHASE_AUTHORIZATION),
      maskedValue: maskSecret(process.env.CHASE_AUTHORIZATION || 'EB3ik8VN9sAV2YjUnZv5UUcAUzFg'),
    },
    {
      key: 'CHASE_AUTHORIZATION2',
      category: 'chase',
      categoryLabel: 'Chase Open Banking & Loyalty',
      description: 'Chase Pay With Points RS256 JWT Authorization Token',
      value: process.env.CHASE_AUTHORIZATION2 || '',
      isSecret: true,
      isSet: Boolean(process.env.CHASE_AUTHORIZATION2),
      maskedValue: maskSecret(process.env.CHASE_AUTHORIZATION2 || ''),
    },
    {
      key: 'CHASE_TRACE_ID',
      category: 'chase',
      categoryLabel: 'Chase Open Banking & Loyalty',
      description: 'Trace-Id header for distributed transaction tracing',
      value: process.env.CHASE_TRACE_ID || '562952952929829',
      isSecret: false,
      isSet: Boolean(process.env.CHASE_TRACE_ID),
      maskedValue: process.env.CHASE_TRACE_ID || '562952952929829',
      defaultValue: '562952952929829',
    },
    {
      key: 'CHASE_ACCOUNT_REF_UUID',
      category: 'chase',
      categoryLabel: 'Chase Open Banking & Loyalty',
      description: 'Chase Account Reference UUID',
      value: process.env.CHASE_ACCOUNT_REF_UUID || 'd383fd33-7be1-4ff8-88b7-f2adca419296',
      isSecret: false,
      isSet: Boolean(process.env.CHASE_ACCOUNT_REF_UUID),
      maskedValue: process.env.CHASE_ACCOUNT_REF_UUID || 'd383fd33-7be1-4ff8-88b7-f2adca419296',
    },
    {
      key: 'CHASE_CLIENT_ID',
      category: 'chase',
      categoryLabel: 'Chase Open Banking & Loyalty',
      description: 'Chase App Client ID (e.g. SUNSHINE_WALLET)',
      value: process.env.CHASE_CLIENT_ID || 'SUNSHINE_WALLET',
      isSecret: false,
      isSet: Boolean(process.env.CHASE_CLIENT_ID),
      maskedValue: process.env.CHASE_CLIENT_ID || 'SUNSHINE_WALLET',
    },

    // 5. Intuit QuickBooks API
    {
      key: 'INTUIT_CLIENT_ID',
      category: 'intuit',
      categoryLabel: 'QuickBooks Online OAuth 2.0',
      description: 'Intuit Developer App Client ID',
      value: process.env.INTUIT_CLIENT_ID || 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8',
      isSecret: false,
      isSet: Boolean(process.env.INTUIT_CLIENT_ID),
      maskedValue: process.env.INTUIT_CLIENT_ID || 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8',
      defaultValue: 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8',
    },
    {
      key: 'INTUIT_CLIENT_SECRET',
      category: 'intuit',
      categoryLabel: 'QuickBooks Online OAuth 2.0',
      description: 'Intuit Developer App Client Secret',
      value: process.env.INTUIT_CLIENT_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.INTUIT_CLIENT_SECRET),
      maskedValue: maskSecret(process.env.INTUIT_CLIENT_SECRET || ''),
    },
    {
      key: 'INTUIT_REDIRECT_URI',
      category: 'intuit',
      categoryLabel: 'QuickBooks Online OAuth 2.0',
      description: 'OAuth 2.0 Authorized Redirect URI',
      value: process.env.INTUIT_REDIRECT_URI || 'https://developer.intuit.com/app/developer/quickstart',
      isSecret: false,
      isSet: Boolean(process.env.INTUIT_REDIRECT_URI),
      maskedValue: process.env.INTUIT_REDIRECT_URI || 'https://developer.intuit.com/app/developer/quickstart',
      defaultValue: 'https://developer.intuit.com/app/developer/quickstart',
    },
    {
      key: 'INTUIT_ENVIRONMENT',
      category: 'intuit',
      categoryLabel: 'QuickBooks Online OAuth 2.0',
      description: 'Target QuickBooks environment (sandbox / production)',
      value: process.env.INTUIT_ENVIRONMENT || 'sandbox',
      isSecret: false,
      isSet: Boolean(process.env.INTUIT_ENVIRONMENT),
      maskedValue: process.env.INTUIT_ENVIRONMENT || 'sandbox',
      defaultValue: 'sandbox',
    },

    // 6. Modern Treasury Open Banking & Ledger
    {
      key: 'MODERN_TREASURY_ORGANIZATION_ID',
      category: 'moderntreasury',
      categoryLabel: 'Modern Treasury Ledgers & Banking',
      description: 'Modern Treasury Organization Identifier for Basic Auth',
      value: process.env.MODERN_TREASURY_ORGANIZATION_ID || '',
      isSecret: false,
      isSet: Boolean(process.env.MODERN_TREASURY_ORGANIZATION_ID),
      maskedValue: process.env.MODERN_TREASURY_ORGANIZATION_ID || 'Not Set',
    },
    {
      key: 'MODERN_TREASURY_API_KEY',
      category: 'moderntreasury',
      categoryLabel: 'Modern Treasury Ledgers & Banking',
      description: 'Modern Treasury Secret API Key for programmatic REST access',
      value: process.env.MODERN_TREASURY_API_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.MODERN_TREASURY_API_KEY),
      maskedValue: maskSecret(process.env.MODERN_TREASURY_API_KEY || ''),
    },
    {
      key: 'MODERN_TREASURY_AUTHORIZATION',
      category: 'moderntreasury',
      categoryLabel: 'Modern Treasury Ledgers & Banking',
      description: 'Explicit Basic Authorization header (Basic <base64>)',
      value: process.env.MODERN_TREASURY_AUTHORIZATION || '',
      isSecret: true,
      isSet: Boolean(process.env.MODERN_TREASURY_AUTHORIZATION),
      maskedValue: maskSecret(process.env.MODERN_TREASURY_AUTHORIZATION || ''),
    },
    {
      key: 'MODERN_TREASURY_BASE_URL',
      category: 'moderntreasury',
      categoryLabel: 'Modern Treasury Ledgers & Banking',
      description: 'Modern Treasury API Base Endpoint',
      value: process.env.MODERN_TREASURY_BASE_URL || 'https://app.moderntreasury.com',
      isSecret: false,
      isSet: Boolean(process.env.MODERN_TREASURY_BASE_URL),
      maskedValue: process.env.MODERN_TREASURY_BASE_URL || 'https://app.moderntreasury.com',
      defaultValue: 'https://app.moderntreasury.com',
    },

    // 7. PayPal Sandbox & Pay Later JS SDK v6
    {
      key: 'PAYPAL_CLIENT_ID',
      category: 'paypal',
      categoryLabel: 'PayPal Sandbox & Checkout v2',
      description: 'PayPal Developer Client ID',
      value: process.env.PAYPAL_CLIENT_ID || 'AebUugfXLhryBxMBCyjWa...',
      isSecret: false,
      isSet: Boolean(process.env.PAYPAL_CLIENT_ID),
      maskedValue: process.env.PAYPAL_CLIENT_ID || 'AebUugfXLhryBxMBCyjWa...',
      defaultValue: 'AebUugfXLhryBxMBCyjWa...',
    },
    {
      key: 'PAYPAL_CLIENT_SECRET',
      category: 'paypal',
      categoryLabel: 'PayPal Sandbox & Checkout v2',
      description: 'PayPal Developer Client Secret',
      value: process.env.PAYPAL_CLIENT_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.PAYPAL_CLIENT_SECRET),
      maskedValue: maskSecret(process.env.PAYPAL_CLIENT_SECRET || ''),
    },
    {
      key: 'PAYPAL_SANDBOX_EMAIL',
      category: 'paypal',
      categoryLabel: 'PayPal Sandbox & Checkout v2',
      description: 'PayPal Sandbox Business Account Email',
      value: process.env.PAYPAL_SANDBOX_EMAIL || 'sb-4y30a52700589@business.example.com',
      isSecret: false,
      isSet: Boolean(process.env.PAYPAL_SANDBOX_EMAIL),
      maskedValue: process.env.PAYPAL_SANDBOX_EMAIL || 'sb-4y30a52700589@business.example.com',
      defaultValue: 'sb-4y30a52700589@business.example.com',
    },

    // 8. Western Union PSD2 Open Banking & Developer Portal
    {
      key: 'WESTERN_UNION_ENVIRONMENT',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Western Union Gateway Environment (sandbox / production)',
      value: process.env.WESTERN_UNION_ENVIRONMENT || 'sandbox',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_ENVIRONMENT),
      maskedValue: process.env.WESTERN_UNION_ENVIRONMENT || 'sandbox',
      defaultValue: 'sandbox',
    },
    {
      key: 'WESTERN_UNION_BASE_URL',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Western Union PSD2 Berlin Group Gateway URL',
      value: process.env.WESTERN_UNION_BASE_URL || 'https://api-sandbox.westernunion.com/psd2/v1',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_BASE_URL),
      maskedValue: process.env.WESTERN_UNION_BASE_URL || 'https://api-sandbox.westernunion.com/psd2/v1',
      defaultValue: 'https://api-sandbox.westernunion.com/psd2/v1',
    },
    {
      key: 'WESTERN_UNION_DEVELOPER_EMAIL',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Western Union Developer Portal Account Email',
      value: process.env.WESTERN_UNION_DEVELOPER_EMAIL || 'developer@westernunion.com',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_DEVELOPER_EMAIL),
      maskedValue: process.env.WESTERN_UNION_DEVELOPER_EMAIL || 'developer@westernunion.com',
      defaultValue: 'developer@westernunion.com',
    },
    {
      key: 'WESTERN_UNION_DEVELOPER_PASSWORD',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Western Union Developer Portal Account Password',
      value: process.env.WESTERN_UNION_DEVELOPER_PASSWORD || '',
      isSecret: true,
      isSet: Boolean(process.env.WESTERN_UNION_DEVELOPER_PASSWORD),
      maskedValue: maskSecret(process.env.WESTERN_UNION_DEVELOPER_PASSWORD || ''),
    },
    {
      key: 'WESTERN_UNION_OTP',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Western Union One-Time Password / 2FA Verification Token (SCA Authentication)',
      value: process.env.WESTERN_UNION_OTP || '',
      isSecret: true,
      isSet: Boolean(process.env.WESTERN_UNION_OTP),
      maskedValue: maskSecret(process.env.WESTERN_UNION_OTP || ''),
    },
    {
      key: 'WESTERN_UNION_TPP_ID',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Western Union Third Party Provider ID (e.g. TPP-WU-8890-EU)',
      value: process.env.WESTERN_UNION_TPP_ID || 'TPP-WU-8890-EU',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_TPP_ID),
      maskedValue: process.env.WESTERN_UNION_TPP_ID || 'TPP-WU-8890-EU',
      defaultValue: 'TPP-WU-8890-EU',
    },
    {
      key: 'WESTERN_UNION_CLIENT_ID',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Western Union PSD2 OAuth2 Client ID',
      value: process.env.WESTERN_UNION_CLIENT_ID || 'wu_client_3840294820',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_CLIENT_ID),
      maskedValue: process.env.WESTERN_UNION_CLIENT_ID || 'wu_client_3840294820',
      defaultValue: 'wu_client_3840294820',
    },
    {
      key: 'WESTERN_UNION_CLIENT_SECRET',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Western Union PSD2 OAuth2 Client Secret',
      value: process.env.WESTERN_UNION_CLIENT_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.WESTERN_UNION_CLIENT_SECRET),
      maskedValue: maskSecret(process.env.WESTERN_UNION_CLIENT_SECRET || ''),
    },
    {
      key: 'WESTERN_UNION_ORGANIZATION_ID',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'eIDAS QSEAL Organization Identifier (e.g. PSDDE-BAFIN-12345678 or TppSaltTest000)',
      value: process.env.WESTERN_UNION_ORGANIZATION_ID || 'PSDDE-BAFIN-12345678',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_ORGANIZATION_ID),
      maskedValue: process.env.WESTERN_UNION_ORGANIZATION_ID || 'PSDDE-BAFIN-12345678',
      defaultValue: 'PSDDE-BAFIN-12345678',
    },
    {
      key: 'WESTERN_UNION_ORGANIZATION_NAME',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'eIDAS QSEAL Organization Name (e.g. Western Union FinTech Solutions)',
      value: process.env.WESTERN_UNION_ORGANIZATION_NAME || 'Western Union FinTech Solutions',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_ORGANIZATION_NAME),
      maskedValue: process.env.WESTERN_UNION_ORGANIZATION_NAME || 'Western Union FinTech Solutions',
      defaultValue: 'Western Union FinTech Solutions',
    },
    {
      key: 'WESTERN_UNION_COUNTRY',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'eIDAS Country Code (e.g. AT, RO, DE, US)',
      value: process.env.WESTERN_UNION_COUNTRY || 'AT',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_COUNTRY),
      maskedValue: process.env.WESTERN_UNION_COUNTRY || 'AT',
      defaultValue: 'AT',
    },
    {
      key: 'WESTERN_UNION_CERTIFICATE_SERIAL',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'X.509 Certificate Serial Number in Decimal format (e.g. 104928502 or 0)',
      value: process.env.WESTERN_UNION_CERTIFICATE_SERIAL || '104928502',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_CERTIFICATE_SERIAL),
      maskedValue: process.env.WESTERN_UNION_CERTIFICATE_SERIAL || '104928502',
      defaultValue: '104928502',
    },
    {
      key: 'WESTERN_UNION_ISSUER_DN',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'X.509 Certificate Issuer Distinguished Name',
      value: process.env.WESTERN_UNION_ISSUER_DN || '/organizationIdentifier=PSDDE-BAFIN-12345678/CN=Western Union FinTech Solutions Web CA/O=Western Union/C=AT',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_ISSUER_DN),
      maskedValue: process.env.WESTERN_UNION_ISSUER_DN || '/organizationIdentifier=PSDDE-BAFIN-12345678/CN=Western Union FinTech Solutions Web CA/O=Western Union/C=AT',
      defaultValue: '/organizationIdentifier=PSDDE-BAFIN-12345678/CN=Western Union FinTech Solutions Web CA/O=Western Union/C=AT',
    },
    {
      key: 'WESTERN_UNION_EIDAS_CERTIFICATE_PEM',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'eIDAS QSEAL X.509 Certificate PEM content',
      value: process.env.WESTERN_UNION_EIDAS_CERTIFICATE_PEM || '',
      isSecret: true,
      isSet: Boolean(process.env.WESTERN_UNION_EIDAS_CERTIFICATE_PEM),
      maskedValue: maskSecret(process.env.WESTERN_UNION_EIDAS_CERTIFICATE_PEM || ''),
    },
    {
      key: 'WESTERN_UNION_EIDAS_PRIVATE_KEY_PEM',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'eIDAS QSEAL RSA 2048-bit Private Key PEM content',
      value: process.env.WESTERN_UNION_EIDAS_PRIVATE_KEY_PEM || '',
      isSecret: true,
      isSet: Boolean(process.env.WESTERN_UNION_EIDAS_PRIVATE_KEY_PEM),
      maskedValue: maskSecret(process.env.WESTERN_UNION_EIDAS_PRIVATE_KEY_PEM || ''),
    },
    {
      key: 'WESTERN_UNION_REDIRECT_URI',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Authorized OAuth2 / SCA Redirect URI',
      value: process.env.WESTERN_UNION_REDIRECT_URI || 'https://developer.westernunion.com/oauth2/callback',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_REDIRECT_URI),
      maskedValue: process.env.WESTERN_UNION_REDIRECT_URI || 'https://developer.westernunion.com/oauth2/callback',
      defaultValue: 'https://developer.westernunion.com/oauth2/callback',
    },
    {
      key: 'WESTERN_UNION_DEFAULT_IBAN',
      category: 'westernunion',
      categoryLabel: 'Western Union PSD2 & Developer Portal',
      description: 'Default Western Union Settlement IBAN',
      value: process.env.WESTERN_UNION_DEFAULT_IBAN || 'AT488800000001234567890',
      isSecret: false,
      isSet: Boolean(process.env.WESTERN_UNION_DEFAULT_IBAN),
      maskedValue: process.env.WESTERN_UNION_DEFAULT_IBAN || 'AT488800000001234567890',
      defaultValue: 'AT488800000001234567890',
    },

    // 9. Marqeta Modern Card Issuing & Digital Banking
    {
      key: 'MARQETA_BASIC_TOKEN',
      category: 'marqeta',
      categoryLabel: 'Marqeta Card Issuing & Digital Banking',
      description: 'Marqeta Basic Auth Token (Enter token string only — "Basic " prefix is automatically added)',
      value: process.env.MARQETA_BASIC_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.MARQETA_BASIC_TOKEN),
      maskedValue: maskSecret(process.env.MARQETA_BASIC_TOKEN || ''),
      defaultValue: 'Enter token string only (without "Basic ")',
    },
    {
      key: 'MARQETA_BASE_URL',
      category: 'marqeta',
      categoryLabel: 'Marqeta Card Issuing & Digital Banking',
      description: 'Marqeta API Base URL (Sandbox or Production v3)',
      value: process.env.MARQETA_BASE_URL || 'https://sandbox-api.marqeta.com/v3',
      isSecret: false,
      isSet: Boolean(process.env.MARQETA_BASE_URL),
      maskedValue: process.env.MARQETA_BASE_URL || 'https://sandbox-api.marqeta.com/v3',
      defaultValue: 'https://sandbox-api.marqeta.com/v3',
    },
    {
      key: 'MARQETA_USER_TOKEN',
      category: 'marqeta',
      categoryLabel: 'Marqeta Card Issuing & Digital Banking',
      description: 'Default Marqeta Cardholder User Token (UUID v4)',
      value: process.env.MARQETA_USER_TOKEN || '53e44e56-dd2b-4189-9b01-fd0fa398a82d',
      isSecret: false,
      isSet: Boolean(process.env.MARQETA_USER_TOKEN),
      maskedValue: process.env.MARQETA_USER_TOKEN || '53e44e56-dd2b-4189-9b01-fd0fa398a82d',
      defaultValue: '53e44e56-dd2b-4189-9b01-fd0fa398a82d',
    },
    {
      key: 'MARQETA_ACCOUNT_HOLDER_GROUP_TOKEN',
      category: 'marqeta',
      categoryLabel: 'Marqeta Card Issuing & Digital Banking',
      description: 'Marqeta Account Holder Group Token (AHG)',
      value: process.env.MARQETA_ACCOUNT_HOLDER_GROUP_TOKEN || 'DEFAULT_AHG',
      isSecret: false,
      isSet: Boolean(process.env.MARQETA_ACCOUNT_HOLDER_GROUP_TOKEN),
      maskedValue: process.env.MARQETA_ACCOUNT_HOLDER_GROUP_TOKEN || 'DEFAULT_AHG',
      defaultValue: 'DEFAULT_AHG',
    },

    // 10. New Relic Full-Stack Observability & APM Telemetry
    {
      key: 'NEW_RELIC_API_KEY',
      category: 'newrelic',
      categoryLabel: 'New Relic APM & Observability',
      description: 'New Relic Ingest User / API Key (NRAK) for GraphQL NerdGraph and Logs/Metrics API',
      value: process.env.NEW_RELIC_API_KEY || 'NRAK-JT6X72Y5W8LWT1PB2NB3BTW1KTE',
      isSecret: true,
      isSet: Boolean(process.env.NEW_RELIC_API_KEY),
      maskedValue: maskSecret(process.env.NEW_RELIC_API_KEY || 'NRAK-JT6X72Y5W8LWT1PB2NB3BTW1KTE'),
      defaultValue: 'NRAK-JT6X72Y5W8LWT1PB2NB3BTW1KTE',
    },
    {
      key: 'NEW_RELIC_ACCOUNT_ID',
      category: 'newrelic',
      categoryLabel: 'New Relic APM & Observability',
      description: 'New Relic Account ID for APM metrics, dashboard widgets, and entity telemetry',
      value: process.env.NEW_RELIC_ACCOUNT_ID || '4095792',
      isSecret: false,
      isSet: Boolean(process.env.NEW_RELIC_ACCOUNT_ID),
      maskedValue: process.env.NEW_RELIC_ACCOUNT_ID || '4095792',
      defaultValue: '4095792',
    },
    {
      key: 'NEW_RELIC_APP_NAME',
      category: 'newrelic',
      categoryLabel: 'New Relic APM & Observability',
      description: 'New Relic APM Application Name',
      value: process.env.NEW_RELIC_APP_NAME || 'QuickBooks-AI-Banking-Bridge',
      isSecret: false,
      isSet: Boolean(process.env.NEW_RELIC_APP_NAME),
      maskedValue: process.env.NEW_RELIC_APP_NAME || 'QuickBooks-AI-Banking-Bridge',
      defaultValue: 'QuickBooks-AI-Banking-Bridge',
    },
    {
      key: 'NEW_RELIC_LOG_LEVEL',
      category: 'newrelic',
      categoryLabel: 'New Relic APM & Observability',
      description: 'New Relic Node.js Agent Log Level (info, debug, trace, warn, error)',
      value: process.env.NEW_RELIC_LOG_LEVEL || 'info',
      isSecret: false,
      isSet: Boolean(process.env.NEW_RELIC_LOG_LEVEL),
      maskedValue: process.env.NEW_RELIC_LOG_LEVEL || 'info',
      defaultValue: 'info',
    },

    // 11. Citi Global Consumer Banking (GCB) API Hub & Australia Open Banking
    {
      key: 'CITI_BEARER_TOKEN',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi OAuth 2.0 User/Partner Bearer Token (Currently Expired - fresh valid token required)',
      value: process.env.CITI_BEARER_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.CITI_BEARER_TOKEN),
      status: 'expired_notice',
      isExpiredNotice: true,
      requiredFor: 'Citi Account, Card, and Transaction Live Gateway Endpoints',
      maskedValue: maskSecret(process.env.CITI_BEARER_TOKEN || ''),
    },
    {
      key: 'CITI_REFRESH_TOKEN',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi OAuth 2.0 Refresh Token for autonomous renewal of expired bearer tokens',
      value: process.env.CITI_REFRESH_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.CITI_REFRESH_TOKEN),
      status: 'expired_notice',
      isExpiredNotice: true,
      requiredFor: 'Autonomous Token Refresh & Re-authentication',
      maskedValue: maskSecret(process.env.CITI_REFRESH_TOKEN || ''),
    },
    {
      key: 'CITI_DCR_TOKEN',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi Dynamic Client Registration (DCR) Initial Access Token',
      value: process.env.CITI_DCR_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.CITI_DCR_TOKEN),
      status: Boolean(process.env.CITI_DCR_TOKEN) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.CITI_DCR_TOKEN || ''),
    },
    {
      key: 'CITI_CLIENT_ID',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi Developer API Hub Client ID (App ID)',
      value: process.env.CITI_CLIENT_ID || '',
      isSecret: true,
      isSet: Boolean(process.env.CITI_CLIENT_ID),
      status: Boolean(process.env.CITI_CLIENT_ID) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.CITI_CLIENT_ID || ''),
    },
    {
      key: 'CITI_CLIENT_SECRET',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi Developer API Hub Client Secret for Basic Auth header encoding',
      value: process.env.CITI_CLIENT_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.CITI_CLIENT_SECRET),
      status: Boolean(process.env.CITI_CLIENT_SECRET) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.CITI_CLIENT_SECRET || ''),
    },
    {
      key: 'CITI_BASIC_TOKEN',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi Basic Authentication Token (e.g. your encoded client credentials token for "authorization: Basic <TOKEN>")',
      value: process.env.CITI_BASIC_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.CITI_BASIC_TOKEN),
      status: Boolean(process.env.CITI_BASIC_TOKEN) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.CITI_BASIC_TOKEN || ''),
    },
    {
      key: 'CITI_AUTHORIZATION',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Full Citi Authorization Header value (e.g., "Basic <YOUR_TOKEN>" or "Basic")',
      value: process.env.CITI_AUTHORIZATION || '',
      isSecret: true,
      isSet: Boolean(process.env.CITI_AUTHORIZATION),
      status: Boolean(process.env.CITI_AUTHORIZATION) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.CITI_AUTHORIZATION || ''),
    },
    {
      key: 'CITI_API_HUB_BASE_URL',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi Sandbox / Production API Gateway Base URL',
      value: process.env.CITI_API_HUB_BASE_URL || 'https://sandbox.apihub.citi.com',
      isSecret: false,
      isSet: Boolean(process.env.CITI_API_HUB_BASE_URL),
      status: 'configured',
      maskedValue: process.env.CITI_API_HUB_BASE_URL || 'https://sandbox.apihub.citi.com',
      defaultValue: 'https://sandbox.apihub.citi.com',
    },
    {
      key: 'CITI_TOKEN_ENDPOINT',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi Client Credentials OAuth 2.0 Token Endpoint (e.g., /gcb/api/clientCredentials/oauth2/token/au/gcb)',
      value: process.env.CITI_TOKEN_ENDPOINT || 'https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/au/gcb',
      isSecret: false,
      isSet: Boolean(process.env.CITI_TOKEN_ENDPOINT),
      status: 'configured',
      maskedValue: process.env.CITI_TOKEN_ENDPOINT || 'https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/au/gcb',
      defaultValue: 'https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/au/gcb',
    },
    {
      key: 'CITI_SCOPE',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'OAuth 2.0 Scope for Citi GCB APIs (default: /api or /accounts /cards)',
      value: process.env.CITI_SCOPE || '/api',
      isSecret: false,
      isSet: Boolean(process.env.CITI_SCOPE),
      status: 'configured',
      maskedValue: process.env.CITI_SCOPE || '/api',
      defaultValue: '/api',
    },
    {
      key: 'CITI_UUID',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi Client UUID Request Header (e641a003-df00-4725-9477-7fe868700a6b)',
      value: process.env.CITI_UUID || 'e641a003-df00-4725-9477-7fe868700a6b',
      isSecret: false,
      isSet: Boolean(process.env.CITI_UUID),
      status: 'configured',
      maskedValue: process.env.CITI_UUID || 'e641a003-df00-4725-9477-7fe868700a6b',
      defaultValue: 'e641a003-df00-4725-9477-7fe868700a6b',
    },
    {
      key: 'CITI_COUNTRY_CODE',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi Open Banking Country Code (US, AU, SG, UK)',
      value: process.env.CITI_COUNTRY_CODE || 'US',
      isSecret: false,
      isSet: Boolean(process.env.CITI_COUNTRY_CODE),
      status: 'configured',
      maskedValue: process.env.CITI_COUNTRY_CODE || 'US',
      defaultValue: 'US',
    },
    {
      key: 'CITI_BUSINESS_CODE',
      category: 'citi',
      categoryLabel: 'Citi Open Banking & API Hub',
      description: 'Citi Open Banking Business Code (e.g. GCB)',
      value: process.env.CITI_BUSINESS_CODE || 'GCB',
      isSecret: false,
      isSet: Boolean(process.env.CITI_BUSINESS_CODE),
      status: 'configured',
      maskedValue: process.env.CITI_BUSINESS_CODE || 'GCB',
      defaultValue: 'GCB',
    },

    // 12. Azure Arc Connected Machine Agent Onboarding (james-rg)
    {
      key: 'AZURE_ARC_SUBSCRIPTION_ID',
      category: 'azure-arc',
      categoryLabel: 'Azure Arc Connected Machine Agent',
      description: 'Azure Subscription ID for Connected Machine Agent onboarding',
      value: process.env.AZURE_ARC_SUBSCRIPTION_ID || '0001726b-15a4-4c12-b0d0-16971405fa7d',
      isSecret: false,
      isSet: Boolean(process.env.AZURE_ARC_SUBSCRIPTION_ID),
      maskedValue: process.env.AZURE_ARC_SUBSCRIPTION_ID || '0001726b-15a4-4c12-b0d0-16971405fa7d',
      defaultValue: '0001726b-15a4-4c12-b0d0-16971405fa7d',
    },
    {
      key: 'AZURE_ARC_RESOURCE_GROUP',
      category: 'azure-arc',
      categoryLabel: 'Azure Arc Connected Machine Agent',
      description: 'Target Resource Group for Azure Arc hybrid servers',
      value: process.env.AZURE_ARC_RESOURCE_GROUP || 'james-rg',
      isSecret: false,
      isSet: Boolean(process.env.AZURE_ARC_RESOURCE_GROUP),
      maskedValue: process.env.AZURE_ARC_RESOURCE_GROUP || 'james-rg',
      defaultValue: 'james-rg',
    },
    {
      key: 'AZURE_ARC_TENANT_ID',
      category: 'azure-arc',
      categoryLabel: 'Azure Arc Connected Machine Agent',
      description: 'Azure Entra ID Tenant ID for Arc registration',
      value: process.env.AZURE_ARC_TENANT_ID || '6666f090-016a-494b-b11a-4d3e01febe95',
      isSecret: false,
      isSet: Boolean(process.env.AZURE_ARC_TENANT_ID),
      maskedValue: process.env.AZURE_ARC_TENANT_ID || '6666f090-016a-494b-b11a-4d3e01febe95',
      defaultValue: '6666f090-016a-494b-b11a-4d3e01febe95',
    },
    {
      key: 'AZURE_ARC_LOCATION',
      category: 'azure-arc',
      categoryLabel: 'Azure Arc Connected Machine Agent',
      description: 'Azure Region location (e.g. eastus)',
      value: process.env.AZURE_ARC_LOCATION || 'eastus',
      isSecret: false,
      isSet: Boolean(process.env.AZURE_ARC_LOCATION),
      maskedValue: process.env.AZURE_ARC_LOCATION || 'eastus',
      defaultValue: 'eastus',
    },
    {
      key: 'AZURE_ARC_CORRELATION_ID',
      category: 'azure-arc',
      categoryLabel: 'Azure Arc Connected Machine Agent',
      description: 'Azure Arc Onboarding Tracking Correlation ID',
      value: process.env.AZURE_ARC_CORRELATION_ID || '176a1b5b-86ef-4921-8fa5-4d4b4225c9f1',
      isSecret: false,
      isSet: Boolean(process.env.AZURE_ARC_CORRELATION_ID),
      maskedValue: process.env.AZURE_ARC_CORRELATION_ID || '176a1b5b-86ef-4921-8fa5-4d4b4225c9f1',
      defaultValue: '176a1b5b-86ef-4921-8fa5-4d4b4225c9f1',
    },
    {
      key: 'AZURE_ARC_DATACENTER_TAG',
      category: 'azure-arc',
      categoryLabel: 'Azure Arc Connected Machine Agent',
      description: 'Citibank Hybrid Datacenter Tag',
      value: process.env.AZURE_ARC_DATACENTER_TAG || 'James@citibankdemobusiness.com',
      isSecret: false,
      isSet: Boolean(process.env.AZURE_ARC_DATACENTER_TAG),
      maskedValue: process.env.AZURE_ARC_DATACENTER_TAG || 'James@citibankdemobusiness.com',
      defaultValue: 'James@citibankdemobusiness.com',
    },
    {
      key: 'AZURE_ARC_TAGS',
      category: 'azure-arc',
      categoryLabel: 'Azure Arc Connected Machine Agent',
      description: 'Full Azure Arc tags with Citibank control account metadata',
      value: process.env.AZURE_ARC_TAGS || "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'",
      isSecret: false,
      isSet: Boolean(process.env.AZURE_ARC_TAGS),
      maskedValue: process.env.AZURE_ARC_TAGS || "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'",
      defaultValue: "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'",
    },

    // 13. Security & Master API Key
    {
      key: 'MASTER_API_KEY',
      category: 'security',
      categoryLabel: 'Security & Microservice Auth',
      description: 'Master server key for autonomous cron jobs and authenticated microservices',
      value: process.env.MASTER_API_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.MASTER_API_KEY),
      maskedValue: maskSecret(process.env.MASTER_API_KEY || ''),
    },

    // 14. Plaid Link & Processor Tokens
    {
      key: 'PLAID_CLIENT_ID',
      category: 'plaid',
      categoryLabel: 'Plaid Link & Processor Tokens',
      description: 'Plaid Developer Client ID',
      value: process.env.PLAID_CLIENT_ID || '',
      isSecret: false,
      isSet: Boolean(process.env.PLAID_CLIENT_ID),
      maskedValue: process.env.PLAID_CLIENT_ID || 'Not Set',
    },
    {
      key: 'PLAID_SECRET',
      category: 'plaid',
      categoryLabel: 'Plaid Link & Processor Tokens',
      description: 'Plaid Developer Secret',
      value: process.env.PLAID_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.PLAID_SECRET),
      maskedValue: maskSecret(process.env.PLAID_SECRET || ''),
    },
    {
      key: 'PLAID_ENV',
      category: 'plaid',
      categoryLabel: 'Plaid Link & Processor Tokens',
      description: 'Plaid Environment (sandbox, development, production)',
      value: process.env.PLAID_ENV || 'sandbox',
      isSecret: false,
      isSet: Boolean(process.env.PLAID_ENV),
      maskedValue: process.env.PLAID_ENV || 'sandbox',
      defaultValue: 'sandbox',
    },
    {
      key: 'PLAID_PROCESSOR_TOKEN',
      category: 'plaid',
      categoryLabel: 'Plaid Link & Processor Tokens',
      description: 'Active Plaid Processor Token for Modern Treasury verification traversal (e.g. processor-sandbox-...)',
      value: process.env.PLAID_PROCESSOR_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.PLAID_PROCESSOR_TOKEN),
      maskedValue: maskSecret(process.env.PLAID_PROCESSOR_TOKEN || ''),
      defaultValue: '',
    },
    {
      key: 'AMAZON_APS_MERCHANT_IDENTIFIER',
      category: 'amazon',
      categoryLabel: 'Amazon Payment Services (APS / PayFort)',
      description: 'Amazon APS Merchant Identifier (e.g. IgcKIFfk)',
      value: process.env.AMAZON_APS_MERCHANT_IDENTIFIER || 'IgcKIFfk',
      isSecret: false,
      isSet: Boolean(process.env.AMAZON_APS_MERCHANT_IDENTIFIER),
      maskedValue: process.env.AMAZON_APS_MERCHANT_IDENTIFIER || 'IgcKIFfk',
      defaultValue: 'IgcKIFfk',
    },
    {
      key: 'AMAZON_APS_ACCESS_CODE',
      category: 'amazon',
      categoryLabel: 'Amazon Payment Services (APS / PayFort)',
      description: 'Amazon APS Access Code for API authentications',
      value: process.env.AMAZON_APS_ACCESS_CODE || 'kOKzILlSlemIqncJtgHk',
      isSecret: true,
      isSet: Boolean(process.env.AMAZON_APS_ACCESS_CODE),
      maskedValue: maskSecret(process.env.AMAZON_APS_ACCESS_CODE || 'kOKzILlSlemIqncJtgHk'),
      defaultValue: 'kOKzILlSlemIqncJtgHk',
    },
    {
      key: 'AMAZON_APS_SHA_PHRASE',
      category: 'amazon',
      categoryLabel: 'Amazon Payment Services (APS / PayFort)',
      description: 'Request & Response SHA-256 Passphrase for cryptographic signatures',
      value: process.env.AMAZON_APS_SHA_PHRASE || 'Automation@123',
      isSecret: true,
      isSet: Boolean(process.env.AMAZON_APS_SHA_PHRASE),
      maskedValue: maskSecret(process.env.AMAZON_APS_SHA_PHRASE || 'Automation@123'),
      defaultValue: 'Automation@123',
    },
    {
      key: 'AMAZON_APS_BASE_URL',
      category: 'amazon',
      categoryLabel: 'Amazon Payment Services (APS / PayFort)',
      description: 'Amazon APS Host Gateway (sbpaymentservices.payfort.com)',
      value: process.env.AMAZON_APS_BASE_URL || 'sbpaymentservices.payfort.com',
      isSecret: false,
      isSet: Boolean(process.env.AMAZON_APS_BASE_URL),
      maskedValue: process.env.AMAZON_APS_BASE_URL || 'sbpaymentservices.payfort.com',
      defaultValue: 'sbpaymentservices.payfort.com',
    },
    {
      key: 'AMAZON_APS_ENV',
      category: 'amazon',
      categoryLabel: 'Amazon Payment Services (APS / PayFort)',
      description: 'APS Environment (sandbox / production)',
      value: process.env.AMAZON_APS_ENV || 'sandbox',
      isSecret: false,
      isSet: Boolean(process.env.AMAZON_APS_ENV),
      maskedValue: process.env.AMAZON_APS_ENV || 'sandbox',
      defaultValue: 'sandbox',
    },
    {
      key: 'ETHEREUM_DEFAULT_RPC_URL',
      category: 'ethereum',
      categoryLabel: 'Ethereum & MetaMask Web3 Blockchain Notary',
      description: 'Default Ethereum RPC Endpoint (e.g. Sepolia / Mainnet)',
      value: process.env.ETHEREUM_DEFAULT_RPC_URL || 'https://rpc.sepolia.org',
      isSecret: false,
      isSet: Boolean(process.env.ETHEREUM_DEFAULT_RPC_URL),
      maskedValue: process.env.ETHEREUM_DEFAULT_RPC_URL || 'https://rpc.sepolia.org',
      defaultValue: 'https://rpc.sepolia.org',
    },
    {
      key: 'ETHEREUM_CHAIN_ID',
      category: 'ethereum',
      categoryLabel: 'Ethereum & MetaMask Web3 Blockchain Notary',
      description: 'Default Ethereum Network Chain ID (11155111 = Sepolia, 1 = Mainnet)',
      value: process.env.ETHEREUM_CHAIN_ID || '11155111',
      isSecret: false,
      isSet: Boolean(process.env.ETHEREUM_CHAIN_ID),
      maskedValue: process.env.ETHEREUM_CHAIN_ID || '11155111',
      defaultValue: '11155111',
    },
    {
      key: 'ETHEREUM_RELAYER_ADDRESS',
      category: 'ethereum',
      categoryLabel: 'Ethereum & MetaMask Web3 Blockchain Notary',
      description: 'Automated Ethereum Liquidity Relayer / Treasury Address',
      value: process.env.ETHEREUM_RELAYER_ADDRESS || '0x3D9447d4F60e2B76f7fB5A81aA154095F2494191',
      isSecret: false,
      isSet: Boolean(process.env.ETHEREUM_RELAYER_ADDRESS),
      maskedValue: process.env.ETHEREUM_RELAYER_ADDRESS || '0x3D9447d4F60e2B76f7fB5A81aA154095F2494191',
      defaultValue: '0x3D9447d4F60e2B76f7fB5A81aA154095F2494191',
    },
    {
      key: 'ETHEREUM_NOTARY_CONTRACT',
      category: 'ethereum',
      categoryLabel: 'Ethereum & MetaMask Web3 Blockchain Notary',
      description: 'Enterprise Notary Audit Smart Contract Address',
      value: process.env.ETHEREUM_NOTARY_CONTRACT || '0x889218F12a02b115Ec467773f324838Fbc51B122',
      isSecret: false,
      isSet: Boolean(process.env.ETHEREUM_NOTARY_CONTRACT),
      status: Boolean(process.env.ETHEREUM_NOTARY_CONTRACT) ? 'configured' : 'missing',
      maskedValue: process.env.ETHEREUM_NOTARY_CONTRACT || '0x889218F12a02b115Ec467773f324838Fbc51B122',
      defaultValue: '0x889218F12a02b115Ec467773f324838Fbc51B122',
    },

    // 17. Visa Developer Platform (VDP) & Live Enterprise Suite
    {
      key: 'VISA_API_KEY',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Visa Developer Portal API Key for VDP Gateway Routing',
      value: process.env.VISA_API_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.VISA_API_KEY),
      status: Boolean(process.env.VISA_API_KEY) ? 'configured' : 'missing',
      requiredFor: 'Visa Direct OCT, B2B Commercial Pay, and dCVV2',
      maskedValue: maskSecret(process.env.VISA_API_KEY || ''),
    },
    {
      key: 'VISA_SHARED_SECRET',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Visa Shared Secret for HMAC SHA-256 (x-pay-token) API Authentication',
      value: process.env.VISA_SHARED_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.VISA_SHARED_SECRET),
      status: Boolean(process.env.VISA_SHARED_SECRET) ? 'configured' : 'missing',
      requiredFor: 'Visa API Two-Way Mutual Auth / x-pay-token Generation',
      maskedValue: maskSecret(process.env.VISA_SHARED_SECRET || ''),
    },
    {
      key: 'VISA_BASE_URL',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Visa Developer Gateway Base Endpoint (Sandbox: https://sandbox.api.visa.com)',
      value: process.env.VISA_BASE_URL || 'https://sandbox.api.visa.com',
      isSecret: false,
      isSet: Boolean(process.env.VISA_BASE_URL),
      status: 'configured',
      maskedValue: process.env.VISA_BASE_URL || 'https://sandbox.api.visa.com',
      defaultValue: 'https://sandbox.api.visa.com',
    },
    {
      key: 'VISA_USER_ID',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Visa Developer Portal User ID for HTTP Basic Authentication over mTLS',
      value: process.env.VISA_USER_ID || '',
      isSecret: true,
      isSet: Boolean(process.env.VISA_USER_ID),
      status: Boolean(process.env.VISA_USER_ID) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.VISA_USER_ID || ''),
    },
    {
      key: 'VISA_PASSWORD',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Visa Developer Portal Password for HTTP Basic Authentication',
      value: process.env.VISA_PASSWORD || '',
      isSecret: true,
      isSet: Boolean(process.env.VISA_PASSWORD),
      status: Boolean(process.env.VISA_PASSWORD) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.VISA_PASSWORD || ''),
    },
    {
      key: 'VISA_ACQUIRER_BIN',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Visa Acquirer BIN (Bank Identification Number e.g. 408888)',
      value: process.env.VISA_ACQUIRER_BIN || '408888',
      isSecret: false,
      isSet: Boolean(process.env.VISA_ACQUIRER_BIN),
      status: 'configured',
      maskedValue: process.env.VISA_ACQUIRER_BIN || '408888',
      defaultValue: '408888',
    },
    {
      key: 'VISA_SENDER_REFERENCE',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Visa Direct Sender Reference ID for cross-border ledger payouts',
      value: process.env.VISA_SENDER_REFERENCE || '',
      isSecret: false,
      isSet: Boolean(process.env.VISA_SENDER_REFERENCE),
      status: Boolean(process.env.VISA_SENDER_REFERENCE) ? 'configured' : 'missing',
      maskedValue: process.env.VISA_SENDER_REFERENCE || 'Not Set',
    },
    {
      key: 'VISA_MLE_KEY_ID',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Visa Message Level Encryption (MLE) Key ID',
      value: process.env.VISA_MLE_KEY_ID || '',
      isSecret: false,
      isSet: Boolean(process.env.VISA_MLE_KEY_ID),
      status: Boolean(process.env.VISA_MLE_KEY_ID) ? 'configured' : 'missing',
      maskedValue: process.env.VISA_MLE_KEY_ID || 'Not Set',
    },
    {
      key: 'VISA_APP_ID',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Visa Developer Portal Application ID',
      value: process.env.VISA_APP_ID || '',
      isSecret: false,
      isSet: Boolean(process.env.VISA_APP_ID),
      status: Boolean(process.env.VISA_APP_ID) ? 'configured' : 'missing',
      maskedValue: process.env.VISA_APP_ID || 'Not Set',
    },
    {
      key: 'VISA_CERT_PATH',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Path or PEM string of Client SSL Certificate for mTLS Handshake',
      value: process.env.VISA_CERT_PATH || '',
      isSecret: true,
      isSet: Boolean(process.env.VISA_CERT_PATH || process.env.VISA_CERT_PEM),
      status: Boolean(process.env.VISA_CERT_PATH || process.env.VISA_CERT_PEM) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.VISA_CERT_PATH || process.env.VISA_CERT_PEM || ''),
    },
    {
      key: 'VISA_KEY_PATH',
      category: 'visa',
      categoryLabel: 'Visa Developer Platform (VDP) Suite',
      description: 'Path or PEM string of Client Private Key for mTLS Handshake',
      value: process.env.VISA_KEY_PATH || '',
      isSecret: true,
      isSet: Boolean(process.env.VISA_KEY_PATH || process.env.VISA_KEY_PEM),
      status: Boolean(process.env.VISA_KEY_PATH || process.env.VISA_KEY_PEM) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.VISA_KEY_PATH || process.env.VISA_KEY_PEM || ''),
    },

    // 18. Alpaca Securities Brokerage & Trading API (Visa Bridge)
    {
      key: 'ALPACA_API_KEY',
      category: 'alpaca',
      categoryLabel: 'Alpaca Securities Brokerage & Trading API',
      description: 'Alpaca Securities API Key ID (APCA-API-KEY-ID)',
      value: process.env.ALPACA_API_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.ALPACA_API_KEY),
      status: Boolean(process.env.ALPACA_API_KEY) ? 'configured' : 'missing',
      requiredFor: 'Autonomous Trading, Stock Order Execution, and Liquidity Routing',
      maskedValue: maskSecret(process.env.ALPACA_API_KEY || ''),
    },
    {
      key: 'ALPACA_SECRET_KEY',
      category: 'alpaca',
      categoryLabel: 'Alpaca Securities Brokerage & Trading API',
      description: 'Alpaca Securities Secret Key (APCA-API-SECRET-KEY)',
      value: process.env.ALPACA_SECRET_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.ALPACA_SECRET_KEY),
      status: Boolean(process.env.ALPACA_SECRET_KEY) ? 'configured' : 'missing',
      requiredFor: 'Alpaca Order Signature Verification',
      maskedValue: maskSecret(process.env.ALPACA_SECRET_KEY || ''),
    },
    {
      key: 'ALPACA_BASE_URL',
      category: 'alpaca',
      categoryLabel: 'Alpaca Securities Brokerage & Trading API',
      description: 'Alpaca Paper / Live Trading Endpoint (https://paper-api.alpaca.markets)',
      value: process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets',
      isSecret: false,
      isSet: Boolean(process.env.ALPACA_BASE_URL),
      status: 'configured',
      maskedValue: process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets',
      defaultValue: 'https://paper-api.alpaca.markets',
    },

    // 19. Stripe Financial Infrastructure & Analytics
    {
      key: 'STRIPE_SECRET_KEY',
      category: 'stripe',
      categoryLabel: 'Stripe Payments & Financial Infrastructure',
      description: 'Stripe Secret API Key (sk_test_... or sk_live_...)',
      value: process.env.STRIPE_SECRET_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.STRIPE_SECRET_KEY),
      status: Boolean(process.env.STRIPE_SECRET_KEY) ? 'configured' : 'missing',
      requiredFor: 'Stripe Analytics Dashboard, Payment Intents, and Payout Balances',
      maskedValue: maskSecret(process.env.STRIPE_SECRET_KEY || ''),
    },
    {
      key: 'STRIPE_PUBLISHABLE_KEY',
      category: 'stripe',
      categoryLabel: 'Stripe Payments & Financial Infrastructure',
      description: 'Stripe Client Publishable Key (pk_test_... or pk_live_...)',
      value: process.env.STRIPE_PUBLISHABLE_KEY || '',
      isSecret: false,
      isSet: Boolean(process.env.STRIPE_PUBLISHABLE_KEY),
      status: Boolean(process.env.STRIPE_PUBLISHABLE_KEY) ? 'configured' : 'missing',
      maskedValue: process.env.STRIPE_PUBLISHABLE_KEY || 'Not Set',
    },
    {
      key: 'STRIPE_WEBHOOK_SECRET',
      category: 'stripe',
      categoryLabel: 'Stripe Payments & Financial Infrastructure',
      description: 'Stripe Webhook Signature Verification Secret (whsec_...)',
      value: process.env.STRIPE_WEBHOOK_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      status: Boolean(process.env.STRIPE_WEBHOOK_SECRET) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.STRIPE_WEBHOOK_SECRET || ''),
    },

    // 20. Azure Cloud Deployments & Entra ID
    {
      key: 'AZURE_CLIENT_ID',
      category: 'azure-cloud',
      categoryLabel: 'Azure Cloud Deployments & Entra ID',
      description: 'Azure Entra ID Application (Client) ID for OAuth & Resource Management',
      value: process.env.AZURE_CLIENT_ID || '',
      isSecret: true,
      isSet: Boolean(process.env.AZURE_CLIENT_ID),
      status: Boolean(process.env.AZURE_CLIENT_ID) ? 'configured' : 'missing',
      requiredFor: 'Azure Master Deployer & Entra ID SSO',
      maskedValue: maskSecret(process.env.AZURE_CLIENT_ID || ''),
    },
    {
      key: 'AZURE_CLIENT_SECRET',
      category: 'azure-cloud',
      categoryLabel: 'Azure Cloud Deployments & Entra ID',
      description: 'Azure Entra ID Application Client Secret',
      value: process.env.AZURE_CLIENT_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.AZURE_CLIENT_SECRET),
      status: Boolean(process.env.AZURE_CLIENT_SECRET) ? 'configured' : 'missing',
      requiredFor: 'Azure Service Principal Authentication',
      maskedValue: maskSecret(process.env.AZURE_CLIENT_SECRET || ''),
    },
    {
      key: 'AZURE_TENANT_ID',
      category: 'azure-cloud',
      categoryLabel: 'Azure Cloud Deployments & Entra ID',
      description: 'Azure Entra ID Directory (Tenant) ID',
      value: process.env.AZURE_TENANT_ID || '6666f090-016a-494b-b11a-4d3e01febe95',
      isSecret: false,
      isSet: Boolean(process.env.AZURE_TENANT_ID),
      status: 'configured',
      maskedValue: process.env.AZURE_TENANT_ID || '6666f090-016a-494b-b11a-4d3e01febe95',
      defaultValue: '6666f090-016a-494b-b11a-4d3e01febe95',
    },
    {
      key: 'AZURE_SUBSCRIPTION_ID',
      category: 'azure-cloud',
      categoryLabel: 'Azure Cloud Deployments & Entra ID',
      description: 'Azure Resource Manager Cloud Subscription ID',
      value: process.env.AZURE_SUBSCRIPTION_ID || '0001726b-15a4-4c12-b0d0-16971405fa7d',
      isSecret: false,
      isSet: Boolean(process.env.AZURE_SUBSCRIPTION_ID),
      status: 'configured',
      maskedValue: process.env.AZURE_SUBSCRIPTION_ID || '0001726b-15a4-4c12-b0d0-16971405fa7d',
      defaultValue: '0001726b-15a4-4c12-b0d0-16971405fa7d',
    },
    {
      key: 'AZURE_REDIRECT_URI',
      category: 'azure-cloud',
      categoryLabel: 'Azure Cloud Deployments & Entra ID',
      description: 'Azure OAuth 2.0 Redirect URI for web app authentication flow',
      value: process.env.AZURE_REDIRECT_URI || 'http://localhost:3000/api/azure/auth/callback',
      isSecret: false,
      isSet: Boolean(process.env.AZURE_REDIRECT_URI),
      status: 'configured',
      maskedValue: process.env.AZURE_REDIRECT_URI || 'http://localhost:3000/api/azure/auth/callback',
      defaultValue: 'http://localhost:3000/api/azure/auth/callback',
    },

    // 21. Krisp Audio AI & Zapier Automations
    {
      key: 'KRISP_API_KEY',
      category: 'krisp-zapier',
      categoryLabel: 'Krisp Audio AI & Zapier Automations',
      description: 'Krisp Background Audio AI & Noise Cancellation API Key',
      value: process.env.KRISP_API_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.KRISP_API_KEY),
      status: Boolean(process.env.KRISP_API_KEY) ? 'configured' : 'missing',
      requiredFor: 'AI Meeting Ingest & Noise Cancellation Stream',
      maskedValue: maskSecret(process.env.KRISP_API_KEY || ''),
    },
    {
      key: 'ZAPIER_WEBHOOK_URL',
      category: 'krisp-zapier',
      categoryLabel: 'Krisp Audio AI & Zapier Automations',
      description: 'Zapier Enterprise Webhook Trigger Endpoint for multi-app automated events',
      value: process.env.ZAPIER_WEBHOOK_URL || '',
      isSecret: true,
      isSet: Boolean(process.env.ZAPIER_WEBHOOK_URL),
      status: Boolean(process.env.ZAPIER_WEBHOOK_URL) ? 'configured' : 'missing',
      requiredFor: 'Automated CRM & Slack Notification Triggers',
      maskedValue: maskSecret(process.env.ZAPIER_WEBHOOK_URL || ''),
    },

    // 22. Modern Treasury Extended
    {
      key: 'MODERN_TREASURY_WEBHOOK_KEY',
      category: 'moderntreasury',
      categoryLabel: 'Modern Treasury Ledgers & Banking',
      description: 'Modern Treasury Webhook HMAC Signature Key',
      value: process.env.MODERN_TREASURY_WEBHOOK_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.MODERN_TREASURY_WEBHOOK_KEY),
      status: Boolean(process.env.MODERN_TREASURY_WEBHOOK_KEY) ? 'configured' : 'missing',
      maskedValue: maskSecret(process.env.MODERN_TREASURY_WEBHOOK_KEY || ''),
    },

    // 23. Intuit QuickBooks Extended
    {
      key: 'QUICKBOOKS_REALM_ID',
      category: 'intuit',
      categoryLabel: 'Intuit QuickBooks Online OAuth 2.0',
      description: 'QuickBooks Sandbox / Production Company Realm ID (e.g. 9341454593452243)',
      value: process.env.QUICKBOOKS_REALM_ID || process.env.INTUIT_REALM_ID || '',
      isSecret: false,
      isSet: Boolean(process.env.QUICKBOOKS_REALM_ID || process.env.INTUIT_REALM_ID),
      status: Boolean(process.env.QUICKBOOKS_REALM_ID || process.env.INTUIT_REALM_ID) ? 'configured' : 'missing',
      requiredFor: 'QuickBooks Accounting Queries & Journal Entries',
      maskedValue: process.env.QUICKBOOKS_REALM_ID || process.env.INTUIT_REALM_ID || 'Not Set',
    },

    // 24. US Bank Corporate Cards & Virtual Accounts
    {
      key: 'USBANK_API_KEY',
      category: 'usbank',
      categoryLabel: 'US Bank Corporate Cards Portal',
      description: 'US Bank Developer Portal OAuth / API Client Key',
      value: process.env.USBANK_API_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.USBANK_API_KEY),
      status: Boolean(process.env.USBANK_API_KEY) ? 'configured' : 'missing',
      requiredFor: 'US Bank Commercial Card & Merchant Auth Controls',
      maskedValue: maskSecret(process.env.USBANK_API_KEY || ''),
    },
    {
      key: 'USBANK_API_SECRET',
      category: 'usbank',
      categoryLabel: 'US Bank Corporate Cards Portal',
      description: 'US Bank Developer Portal OAuth Client Secret',
      value: process.env.USBANK_API_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.USBANK_API_SECRET),
      status: Boolean(process.env.USBANK_API_SECRET) ? 'configured' : 'missing',
      requiredFor: 'US Bank API HMAC & Token Exchange',
      maskedValue: maskSecret(process.env.USBANK_API_SECRET || ''),
    },
    {
      key: 'USBANK_BASE_URL',
      category: 'usbank',
      categoryLabel: 'US Bank Corporate Cards Portal',
      description: 'US Bank Gateway Host URL',
      value: process.env.USBANK_BASE_URL || 'https://api.usbank.com',
      isSecret: false,
      isSet: true,
      status: 'configured',
      requiredFor: 'US Bank Card & Zelle Endpoints',
      maskedValue: process.env.USBANK_BASE_URL || 'https://api.usbank.com',
    },

    // 25. Apache Pulsar & Astra Event Streaming
    {
      key: 'PULSAR_BROKER_SERVICE_URL',
      category: 'pulsar',
      categoryLabel: 'Apache Pulsar & Astra Event Streaming',
      description: 'Pulsar binary protocol broker URL (pulsar+ssl://...)',
      value: process.env.PULSAR_BROKER_SERVICE_URL || '',
      isSecret: false,
      isSet: Boolean(process.env.PULSAR_BROKER_SERVICE_URL),
      status: Boolean(process.env.PULSAR_BROKER_SERVICE_URL) ? 'configured' : 'missing',
      requiredFor: 'Real-time financial event fabric',
      maskedValue: process.env.PULSAR_BROKER_SERVICE_URL || 'Not Set',
    },
    {
      key: 'PULSAR_AUTH_TOKEN',
      category: 'pulsar',
      categoryLabel: 'Apache Pulsar & Astra Event Streaming',
      description: 'DataStax Astra Streaming JWT / Pulsar Auth Token',
      value: process.env.PULSAR_AUTH_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.PULSAR_AUTH_TOKEN),
      status: Boolean(process.env.PULSAR_AUTH_TOKEN) ? 'configured' : 'missing',
      requiredFor: 'Pulsar secure client connection authentication',
      maskedValue: maskSecret(process.env.PULSAR_AUTH_TOKEN || ''),
    },
    {
      key: 'PULSAR_WEB_SERVICE_URL',
      category: 'pulsar',
      categoryLabel: 'Apache Pulsar & Astra Event Streaming',
      description: 'Pulsar Admin HTTPS endpoint',
      value: process.env.PULSAR_WEB_SERVICE_URL || '',
      isSecret: false,
      isSet: Boolean(process.env.PULSAR_WEB_SERVICE_URL),
      status: Boolean(process.env.PULSAR_WEB_SERVICE_URL) ? 'configured' : 'missing',
      requiredFor: 'Topic admin & schema registry management',
      maskedValue: process.env.PULSAR_WEB_SERVICE_URL || 'Not Set',
    },

    // 26. DataStax Astra DB Vector & NoSQL
    {
      key: 'ASTRA_DB_APPLICATION_TOKEN',
      category: 'astra',
      categoryLabel: 'DataStax Astra DB Vector & NoSQL',
      description: 'Astra DB Admin Application Token (AstraCS:...)',
      value: process.env.ASTRA_DB_APPLICATION_TOKEN || '',
      isSecret: true,
      isSet: Boolean(process.env.ASTRA_DB_APPLICATION_TOKEN),
      status: Boolean(process.env.ASTRA_DB_APPLICATION_TOKEN) ? 'configured' : 'missing',
      requiredFor: 'Vector ledger search & sovereign data store',
      maskedValue: maskSecret(process.env.ASTRA_DB_APPLICATION_TOKEN || ''),
    },
    {
      key: 'ASTRA_DB_API_ENDPOINT',
      category: 'astra',
      categoryLabel: 'DataStax Astra DB Vector & NoSQL',
      description: 'Astra DB Data API Endpoint URL',
      value: process.env.ASTRA_DB_API_ENDPOINT || '',
      isSecret: false,
      isSet: Boolean(process.env.ASTRA_DB_API_ENDPOINT),
      status: Boolean(process.env.ASTRA_DB_API_ENDPOINT) ? 'configured' : 'missing',
      requiredFor: 'Data API document queries & embeddings',
      maskedValue: process.env.ASTRA_DB_API_ENDPOINT || 'Not Set',
    },

    // 27. Open Bank Project Citibank Sandbox
    {
      key: 'OBP_API_BASE_URL',
      category: 'obp',
      categoryLabel: 'Open Bank Project Citibank Sandbox',
      description: 'Open Bank Project API Root Endpoint URL',
      value: process.env.OBP_API_BASE_URL || 'https://apisandbox.openbankproject.com',
      isSecret: false,
      isSet: true,
      status: 'configured',
      requiredFor: 'OBP Banking & Account Aggregation',
      maskedValue: process.env.OBP_API_BASE_URL || 'https://apisandbox.openbankproject.com',
    },
    {
      key: 'OBP_CONSUMER_KEY',
      category: 'obp',
      categoryLabel: 'Open Bank Project Citibank Sandbox',
      description: 'OBP OAuth Consumer Key',
      value: process.env.OBP_CONSUMER_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.OBP_CONSUMER_KEY),
      status: Boolean(process.env.OBP_CONSUMER_KEY) ? 'configured' : 'missing',
      requiredFor: 'OBP Direct Login & API access',
      maskedValue: maskSecret(process.env.OBP_CONSUMER_KEY || ''),
    },
    {
      key: 'OBP_CONSUMER_SECRET',
      category: 'obp',
      categoryLabel: 'Open Bank Project Citibank Sandbox',
      description: 'OBP OAuth Consumer Secret',
      value: process.env.OBP_CONSUMER_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.OBP_CONSUMER_SECRET),
      status: Boolean(process.env.OBP_CONSUMER_SECRET) ? 'configured' : 'missing',
      requiredFor: 'OBP Token exchange signature',
      maskedValue: maskSecret(process.env.OBP_CONSUMER_SECRET || ''),
    },

    // 28. FDX Financial Data Exchange Bill Pay
    {
      key: 'FDX_API_BASE_URL',
      category: 'fdx',
      categoryLabel: 'FDX Bill Pay Interoperability',
      description: 'FDX Bill Pay Gateway Host URL',
      value: process.env.FDX_API_BASE_URL || 'https://api.citigroup.com/fdx/v5',
      isSecret: false,
      isSet: true,
      status: 'configured',
      requiredFor: 'FDX Bill Pay & Payment Confirmation',
      maskedValue: process.env.FDX_API_BASE_URL || 'https://api.citigroup.com/fdx/v5',
    },
    {
      key: 'FDX_API_CLIENT_ID',
      category: 'fdx',
      categoryLabel: 'FDX Bill Pay Interoperability',
      description: 'FDX Registered Client ID',
      value: process.env.FDX_API_CLIENT_ID || '',
      isSecret: true,
      isSet: Boolean(process.env.FDX_API_CLIENT_ID),
      status: Boolean(process.env.FDX_API_CLIENT_ID) ? 'configured' : 'missing',
      requiredFor: 'FDX OAuth Token Generation',
      maskedValue: maskSecret(process.env.FDX_API_CLIENT_ID || ''),
    },
    {
      key: 'FDX_API_CLIENT_SECRET',
      category: 'fdx',
      categoryLabel: 'FDX Bill Pay Interoperability',
      description: 'FDX Registered Client Secret',
      value: process.env.FDX_API_CLIENT_SECRET || '',
      isSecret: true,
      isSet: Boolean(process.env.FDX_API_CLIENT_SECRET),
      status: Boolean(process.env.FDX_API_CLIENT_SECRET) ? 'configured' : 'missing',
      requiredFor: 'FDX Client Authentication',
      maskedValue: maskSecret(process.env.FDX_API_CLIENT_SECRET || ''),
    },

    // 29. Firebase Firestore & Auth
    {
      key: 'FIREBASE_API_KEY',
      category: 'firebase',
      categoryLabel: 'Firebase Firestore & Auth',
      description: 'Firebase Web API Key',
      value: process.env.FIREBASE_API_KEY || '',
      isSecret: true,
      isSet: Boolean(process.env.FIREBASE_API_KEY),
      status: Boolean(process.env.FIREBASE_API_KEY) ? 'configured' : 'missing',
      requiredFor: 'Firebase Auth & Cloud Firestore Realtime DB',
      maskedValue: maskSecret(process.env.FIREBASE_API_KEY || ''),
    },
    {
      key: 'FIREBASE_PROJECT_ID',
      category: 'firebase',
      categoryLabel: 'Firebase Firestore & Auth',
      description: 'Google Cloud / Firebase Project ID',
      value: process.env.FIREBASE_PROJECT_ID || '',
      isSecret: false,
      isSet: Boolean(process.env.FIREBASE_PROJECT_ID),
      status: Boolean(process.env.FIREBASE_PROJECT_ID) ? 'configured' : 'missing',
      requiredFor: 'Firestore database tenancy',
      maskedValue: process.env.FIREBASE_PROJECT_ID || 'Not Set',
    },
    {
      key: 'FIRESTORE_DATABASE_ID',
      category: 'firebase',
      categoryLabel: 'Firebase Firestore & Auth',
      description: 'Custom Firestore Database Name / ID',
      value: process.env.FIRESTORE_DATABASE_ID || '',
      isSecret: false,
      isSet: Boolean(process.env.FIRESTORE_DATABASE_ID),
      status: Boolean(process.env.FIRESTORE_DATABASE_ID) ? 'configured' : 'missing',
      requiredFor: 'Multi-database routing',
      maskedValue: process.env.FIRESTORE_DATABASE_ID || 'Not Set',
    },
  ];

  // Resolve statuses and apply expired notices
  return rawList.map(item => {
    const isCitiExpired = item.category === 'citi' && (item.key === 'CITI_BEARER_TOKEN' || item.key === 'CITI_REFRESH_TOKEN') && (!item.value || item.value.startsWith('NTJjOGI0'));
    const isExpired = item.isExpiredNotice || isCitiExpired;
    const isSet = Boolean(item.value && item.value.trim().length > 0 && !isExpired);
    return {
      ...item,
      isSet,
      isExpiredNotice: isExpired,
      status: isExpired ? 'expired_notice' : (isSet ? 'configured' : 'missing'),
    };
  });
}

export function generateFullEnvFile(): string {
  const vars = getAllEnvironmentVariables();
  const categories = [
    { id: 'google', title: '1. Google Cloud Service Account & IAM' },
    { id: 'gemini', title: '2. Google Gemini AI' },
    { id: 'finicity', title: '3. Mastercard Open Finance / Finicity' },
    { id: 'chase', title: '4. Chase Open Banking & Loyalty Rewards' },
    { id: 'intuit', title: '5. Intuit QuickBooks Online OAuth 2.0' },
    { id: 'moderntreasury', title: '6. Modern Treasury Ledgers & Banking' },
    { id: 'paypal', title: '7. PayPal Sandbox & Pay Later JS SDK v6' },
    { id: 'westernunion', title: '8. Western Union PSD2 Open Banking & Developer Portal' },
    { id: 'marqeta', title: '9. Marqeta Modern Card Issuing & Digital Banking' },
    { id: 'newrelic', title: '10. New Relic Full-Stack Observability & APM Telemetry' },
    { id: 'citi', title: '11. Citi Global Consumer Banking (GCB) API Hub & Australia Open Banking' },
    { id: 'azure-arc', title: '12. Azure Arc Connected Machine Agent Onboarding (james-rg)' },
    { id: 'security', title: '13. Security & Master API Key' },
    { id: 'plaid', title: '14. Plaid Link & Processor Tokens' },
    { id: 'amazon', title: '15. Amazon Payment Services (APS / PayFort)' },
    { id: 'ethereum', title: '16. Ethereum & MetaMask Web3 Blockchain Notary & On-Ramp' },
    { id: 'visa', title: '17. Visa Developer Platform (VDP) Suite & OCT Payouts' },
    { id: 'alpaca', title: '18. Alpaca Securities Brokerage & Trading API' },
    { id: 'stripe', title: '19. Stripe Payments & Financial Infrastructure' },
    { id: 'azure-cloud', title: '20. Azure Cloud Deployments & Entra ID' },
    { id: 'krisp-zapier', title: '21. Krisp Audio AI & Zapier Automations' },
    { id: 'usbank', title: '22. US Bank Corporate Cards & Virtual Accounts' },
    { id: 'pulsar', title: '23. Apache Pulsar & Astra Event Streaming' },
    { id: 'astra', title: '24. DataStax Astra DB Vector & NoSQL' },
    { id: 'obp', title: '25. Open Bank Project Citibank Sandbox' },
    { id: 'fdx', title: '26. FDX Financial Data Exchange Bill Pay' },
    { id: 'firebase', title: '27. Firebase Firestore & Auth Infrastructure' },
  ];

  let output = `# ==============================================================================
# Unified Enterprise Multi-Bank Gateway Environment Configuration (.env)
# Generated: ${new Date().toISOString()}
# ==============================================================================

`;

  for (const cat of categories) {
    output += `# ==============================================================================\n`;
    output += `# ${cat.title}\n`;
    output += `# ==============================================================================\n`;

    const catVars = vars.filter(v => v.category === cat.id);
    for (const v of catVars) {
      output += `# ${v.description}\n`;
      output += `${v.key}="${v.value}"\n\n`;
    }
  }

  return output;
}

/**
 * GET /api/env/all
 */
envManagerRouter.get('/all', (req: Request, res: Response) => {
  const items = getAllEnvironmentVariables();
  const rawEnvText = generateFullEnvFile();

  const totalCount = items.length;
  const setVarsCount = items.filter(i => i.isSet && i.status === 'configured').length;
  const missingVarsCount = items.filter(i => !i.isSet || i.status === 'missing').length;
  const expiredCount = items.filter(i => i.status === 'expired_notice' || i.isExpiredNotice).length;

  res.json({
    success: true,
    totalCount,
    setVarsCount,
    missingVarsCount,
    expiredCount,
    items,
    rawEnvText,
  });
});

/**
 * GET /api/env/missing
 * Returns an exhaustive breakdown of missing and expired environment variables across the app
 */
envManagerRouter.get('/missing', (req: Request, res: Response) => {
  const items = getAllEnvironmentVariables();
  const missingItems = items.filter(i => !i.isSet || i.status === 'missing' || i.status === 'expired_notice');
  const expiredItems = items.filter(i => i.status === 'expired_notice' || i.isExpiredNotice);
  const configuredItems = items.filter(i => i.isSet && i.status === 'configured');

  // Group missing by category
  const missingByCategory: Record<string, { label: string; count: number; items: EnvVariableItem[] }> = {};
  for (const item of missingItems) {
    if (!missingByCategory[item.category]) {
      missingByCategory[item.category] = {
        label: item.categoryLabel,
        count: 0,
        items: [],
      };
    }
    missingByCategory[item.category].count++;
    missingByCategory[item.category].items.push(item);
  }

  // Generate missing template string
  let missingTemplate = `# ==============================================================================\n`;
  missingTemplate += `# MISSING & EXPIRED ENVIRONMENT VARIABLES TEMPLATE\n`;
  missingTemplate += `# Total Missing / Needs Renewal: ${missingItems.length} (Generated: ${new Date().toISOString()})\n`;
  missingTemplate += `# ==============================================================================\n\n`;

  for (const [catKey, catData] of Object.entries(missingByCategory)) {
    missingTemplate += `# --- ${catData.label} (${catData.count} missing/expired) ---\n`;
    for (const item of catData.items) {
      missingTemplate += `# ${item.description}${item.isExpiredNotice ? ' [EXPIRED: REQUIRES NEW TOKEN]' : ''}\n`;
      missingTemplate += `${item.key}=\n\n`;
    }
  }

  res.json({
    success: true,
    totalVariables: items.length,
    configuredCount: configuredItems.length,
    missingCount: missingItems.length,
    expiredCount: expiredItems.length,
    missingItems,
    expiredItems,
    missingByCategory,
    missingTemplate,
  });
});

/**
 * POST /api/env/update
 */
envManagerRouter.post('/update', (req: Request, res: Response) => {
  try {
    const { updates } = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Expected updates object with key/value pairs' });
    }

    // Apply updates to runtime process.env
    for (const [k, v] of Object.entries(updates)) {
      if (typeof v === 'string') {
        process.env[k] = v.trim();
      }
    }

    const items = getAllEnvironmentVariables();
    const rawEnvText = generateFullEnvFile();

    // Persist to physical .env file on workspace root
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      fs.writeFileSync(envPath, rawEnvText, 'utf8');
    } catch (fsErr: any) {
      console.warn('Could not write directly to .env disk file:', fsErr.message);
    }

    res.json({
      success: true,
      message: `Updated ${Object.keys(updates).length} environment variables and saved to .env file!`,
      items,
      rawEnvText,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/env/import-raw
 * Parses a raw .env text string, updates process.env, and writes to .env
 */
envManagerRouter.post('/import-raw', (req: Request, res: Response) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ success: false, error: 'rawText must be a non-empty string' });
    }

    let parsedCount = 0;
    const lines = rawText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (key) {
          process.env[key] = val;
          parsedCount++;
        }
      }
    }

    const items = getAllEnvironmentVariables();
    const rawEnvText = generateFullEnvFile();

    try {
      const envPath = path.resolve(process.cwd(), '.env');
      fs.writeFileSync(envPath, rawEnvText, 'utf8');
    } catch (fsErr: any) {
      console.warn('Could not write directly to .env disk file:', fsErr.message);
    }

    res.json({
      success: true,
      message: `Successfully imported and saved ${parsedCount} environment variables to .env!`,
      parsedCount,
      items,
      rawEnvText,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/env/download
 * Downloads the full .env file
 */
envManagerRouter.get('/download', (req: Request, res: Response) => {
  try {
    const rawEnvText = generateFullEnvFile();
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=.env');
    res.send(rawEnvText);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});


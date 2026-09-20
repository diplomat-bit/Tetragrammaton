/**
 * Auto-generated Environments & Base URLs
 * Generated: 2026-09-11T21:39:02.915Z
 */

export interface ServerConfig {
  url: string;
  description: string;
  environment: 'production' | 'sandbox' | 'mock' | 'custom';
}

export interface SpecEnvironments {
  title: string;
  format: string;
  servers: ServerConfig[];
}

export const SPEC_ENVIRONMENTS: Record<string, SpecEnvironments> = {
  "Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI-2-swagger__1__yaml": {
    "title": "Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://127.0.0.1/openapi/accounttransactions/findtls/v1",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "Auth_Digital_Public_Token_Api-2-swagger__1__yaml": {
    "title": "Token Authorization",
    "format": "swagger_2",
    "servers": [
      {
        "url": "/api/identity/auth/v1",
        "description": "Default Swagger 2.0 Base URL",
        "environment": "sandbox"
      }
    ]
  },
  "Broker_API_postman_collection_json_txt": {
    "title": "Broker API",
    "format": "postman",
    "servers": [
      {
        "url": "https://sandbox.api.example.com",
        "description": "Postman Target Environment",
        "environment": "sandbox"
      }
    ]
  },
  "CardAccountBalanceTransferEligibility_OpenAPI-4-swagger_yaml": {
    "title": "CardAccountBalanceTransferEligibility_OpenAPI",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://127.0.0.1/openapi/v1/accounts/loans/balanceTransfers",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI-3-swagger__1__yaml": {
    "title": "IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://127.0.0.1/openapi/iam/tokenManagement/partner/authCode/oauth2/cgw/v1",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI-3-swagger_yaml": {
    "title": "IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://127.0.0.1/openapi/iam/tokenManagement/partner/authCode/oauth2/cgw/v1",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "Oauth20_Authorize_Api-5-swagger_yaml__1_": {
    "title": "Token Authorization",
    "format": "openapi_3",
    "servers": [
      {
        "url": "/api/identity/auth/v1",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "Oauth2_Security_Idp_Api-4-swagger_yaml": {
    "title": "Consent Authorization",
    "format": "openapi_3",
    "servers": [
      {
        "url": "/api/identity/v1",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "Openbanking_Customerprofile_Orchestrator_Api-5-swagger_yaml": {
    "title": "Customers Profiles",
    "format": "openapi_3",
    "servers": [
      {
        "url": "/api/custmgmt/profiles/v1",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "PayPal_APIs_postman_collection_json_txt": {
    "title": "PayPal APIs",
    "format": "postman",
    "servers": [
      {
        "url": "https://sandbox.api.example.com",
        "description": "Postman Target Environment",
        "environment": "sandbox"
      }
    ]
  },
  "RewardLinkageShopWithPoints_OpenAPI-4-swagger_yaml__1_": {
    "title": "RewardLinkageShopWithPoints_OpenAPI",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://127.0.0.1/openapi/v1/rewards/shopWithPoints",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "RewardRedemptionSelectAndCredit_OpenAPI-5-swagger_yaml__1_": {
    "title": "RewardRedemptionSelectAndCredit_OpenAPI",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://127.0.0.1/openapi/v1/rewards/selectAndCredit/redemption",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "SecurityE2EKeyExchangePreLogin_Partner_OpenAPI-5-swagger_yaml": {
    "title": "SecurityE2EKeyExchangePreLogin_Partner_OpenAPI",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://127.0.0.1/openapi/partner/v1/prelogin/security/e2eKey",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "Statement_Digital_Orchestration_Api-5-swagger_yaml__1_": {
    "title": "Account Statements",
    "format": "openapi_3",
    "servers": [
      {
        "url": "/api/docmgmt/acctStmt/v1",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "TaxStatement_Digital_Orchestration_Api-1-swagger_yaml__1_": {
    "title": "TaxStatement_Digital_Orchestation",
    "format": "openapi_3",
    "servers": [
      {
        "url": "/gcgapi/docmgmt/taxforms/v1",
        "description": "CUSTOM Server",
        "environment": "custom"
      }
    ]
  },
  "api_reference__1__json": {
    "title": "VisaNet Connect - Issuing",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__10__json": {
    "title": "B2B Virtual Account Payment Method",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__11__json": {
    "title": "Visa DCVV2 Generate",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__12__json": {
    "title": "Visa Pay",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__13__json": {
    "title": "Click to Pay",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__14__json": {
    "title": "Visa Card Program Management",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__15__json": {
    "title": "Visa BIN Attribute Sharing Service",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__16__json": {
    "title": "Foreign Exchange Rates",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__17__json": {
    "title": "Card on File Data Inquiry",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__18__json": {
    "title": "Visa Payment Passkey ",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__19__json": {
    "title": "Visa Consumer Authentication Service",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__3__json": {
    "title": "DPS Card and Account Services",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__4__json": {
    "title": "Visa Travel Notification Service",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__5__json": {
    "title": "Visa Credit Card Application",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__6__json": {
    "title": "Visa Direct Connect",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__8__json": {
    "title": "Kernel in the Cloud",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference__9__json": {
    "title": "Visa Accounts Receivable Manager",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "api_reference_json": {
    "title": "Visa Direct",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.api.visa.com",
        "description": "Sandbox server",
        "environment": "sandbox"
      }
    ]
  },
  "finicity-apimatic-20220106_yaml": {
    "title": "Finicity API",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://api.finicity.com",
        "description": "Production",
        "environment": "production"
      }
    ]
  },
  "openapi__3__json": {
    "title": "Custody",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://sandbox.usbank.com/wmis/custody-services/v1",
        "description": "Sandbox URL",
        "environment": "sandbox"
      },
      {
        "url": "https://alpha-api2.usbank.com/wmis/custody-services/v1",
        "description": "UAT URL",
        "environment": "custom"
      },
      {
        "url": "https://api2.usbank.com/wmis/custody-services/v1",
        "description": "Production URL",
        "environment": "custom"
      }
    ]
  },
  "openapi__4__json": {
    "title": "Access Online Transactions and Orders",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://apip2.usbank.com/access-online-transactions/v1",
        "description": "Production gateway",
        "environment": "custom"
      },
      {
        "url": "https://alpha-apip2.usbank.com/access-online-transactions/v1",
        "description": "UAT gateway",
        "environment": "custom"
      }
    ]
  },
  "openapi__5__json": {
    "title": "Virtual Card Payments",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://apip2.usbank.com/virtual-cards/v2",
        "description": "Production gateway",
        "environment": "custom"
      },
      {
        "url": "https://alpha-apip2.usbank.com/virtual-cards/v2",
        "description": "UAT gateway",
        "environment": "custom"
      }
    ]
  },
  "openapi__6__json": {
    "title": "Corporate Account Information",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://api2.usbank.com/commercial-banking/account-management/v2",
        "description": "Production environment",
        "environment": "custom"
      },
      {
        "url": "https://cert-api2.usbank.com/commercial-banking/account-management/v2",
        "description": "Certification environment",
        "environment": "custom"
      },
      {
        "url": "https://api2.usbank.com/certification/commercial-banking/account-management/v2",
        "description": "Legacy certification environment",
        "environment": "custom"
      },
      {
        "url": "https://sandbox.usbank.com/commercial-banking/account-management/v2",
        "description": "Sandbox environment",
        "environment": "sandbox"
      }
    ]
  },
  "openapi_json": {
    "title": "Incoming webhooks",
    "format": "openapi_3",
    "servers": [
      {
        "url": "https://api2.usbank.com/event-notifications/webhook/v1",
        "description": "Production URL",
        "environment": "custom"
      },
      {
        "url": "https://alpha-api2.usbank.com/event-notifications/webhook/v1",
        "description": "UAT URL",
        "environment": "custom"
      }
    ]
  }
};

export function getDefaultBaseUrl(specId: string): string {
  const spec = SPEC_ENVIRONMENTS[specId];
  if (!spec || !spec.servers || spec.servers.length === 0) {
    return 'https://sandbox.api.example.com';
  }
  const sandbox = spec.servers.find(s => s.environment === 'sandbox');
  return (sandbox || spec.servers[0]).url;
}

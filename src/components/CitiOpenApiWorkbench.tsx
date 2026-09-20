import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Key,
  Shield,
  Send,
  RefreshCw,
  Copy,
  Check,
  Download,
  Terminal,
  Code2,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
  Zap,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Globe,
  Sliders,
  Sparkles,
  Database,
  Eye,
  FileCode,
  DollarSign,
  Briefcase,
  Activity,
  Wallet,
  Play,
  FileText,
  Search,
  Filter,
  Maximize2,
  Minimize2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

export type CitiOpenApiCategory =
  | 'accounts'
  | 'transactions'
  | 'partner_investments'
  | 'sufficiency'
  | 'onboarding_ipa'
  | 'demographics'
  | 'encryption_unmask'
  | 'outage_discovery'
  | 'oauth2_dcr'
  | 'money_movement';

interface ApiEndpointDef {
  id: string;
  category: CitiOpenApiCategory;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  specDoc: string;
  defaultHeaders: Record<string, string>;
  defaultParams?: Record<string, string>;
  defaultBody?: any;
}

export const CITI_OPENAPI_ENDPOINTS: ApiEndpointDef[] = [
  // 1. Accounts
  {
    id: 'get_account_summary',
    category: 'accounts',
    name: 'Retrieve Summary of All Accounts',
    method: 'GET',
    path: '/openapi/v1/accounts',
    description: 'Returns a summary of all accounts held by customer across checking, savings, credit cards, time deposits, and securities brokerage.',
    specDoc: 'AccountListingAndDetails_OpenAPI v1.39.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Accept': 'application/json'
    },
    defaultParams: {
      'nextStartIndex': '0'
    }
  },
  {
    id: 'get_account_details',
    category: 'accounts',
    name: 'Retrieve Detailed Account Breakdown',
    method: 'GET',
    path: '/openapi/v1/accounts/3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
    description: 'Returns granular account breakdown with overdraft limits, interest yields, statement schedules, and masked identifiers.',
    specDoc: 'AccountListingAndDetails_OpenAPI v1.39.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Accept': 'application/json'
    }
  },
  // 2. Transactions
  {
    id: 'get_transactions',
    category: 'transactions',
    name: 'Retrieve Transactions for Specific Account',
    method: 'GET',
    path: '/openapi/v1/accounts/3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d/transactions',
    description: 'Returns an array of settled transactions, Fedwire credit inflows, merchant descriptions, and investment trades.',
    specDoc: 'AccountTransactionListingAndDetails_OpenAPI v1.35.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Accept': 'application/json'
    },
    defaultParams: {
      'pendingSdnScreeningFlag': 'true',
      'transactionFromDate': '2026-01-01',
      'transactionToDate': '2026-09-12'
    }
  },
  {
    id: 'get_transaction_l3_details',
    category: 'transactions',
    name: 'Retrieve L3 Detailed Transaction View',
    method: 'GET',
    path: '/openapi/v1/accounts/3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d/transactions/CITI-TRX-20260912-88391/details',
    description: 'Retrieves enriched Level 3 transaction metadata including central bank reference IDs, ISO timestamp stamps, and debtor/creditor particulars.',
    specDoc: 'AccountTransactionListingAndDetails_OpenAPI v1.35.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Accept': 'application/json'
    }
  },
  // 3. Sufficiency Check
  {
    id: 'check_funds_sufficiency',
    category: 'sufficiency',
    name: 'Check Account Funds Sufficiency',
    method: 'GET',
    path: '/openapi/v1/accounts/US89CITI02100002149281/funds/sufficiencyCheck',
    description: 'Verifies whether sufficient funds are present in the account prior to initiating transfers or executing high-value settlements.',
    specDoc: 'Accounts_AccountFeatureEligibility_BalanceCheck_Digital_Domain_OpenAPI v1.0.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Accept': 'application/json'
    },
    defaultParams: {
      'sufficiencyCheckAmount': '1000000.00',
      'currencyCode': 'USD'
    }
  },
  // 4. Demographics
  {
    id: 'get_customer_demographics',
    category: 'demographics',
    name: 'Retrieve Customer Demographics & Particulars',
    method: 'GET',
    path: '/openapi/customers/customerDemographics/digital/v1/customerNames/details',
    description: 'Retrieves validated customer particulars, legal names, and corporate identity profiles for authenticated accounts.',
    specDoc: 'Customers_CustomerDemographics_Digital_Domain_OpenAPI v1.0.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Accept': 'application/json'
    }
  },
  // 5. Clear Data Unmasking
  {
    id: 'unmask_clear_account_data',
    category: 'encryption_unmask',
    name: 'Retrieve Clear / Unmasked Account Numbers',
    method: 'POST',
    path: '/openapi/v1/accounts/clearData/retrieve',
    description: 'Decrypts and retrieves clear international bank account numbers (IBAN / RTN) for encrypted account identifiers.',
    specDoc: 'Foundations_DataEncryption_ClearDataRetrieval_Digital_Domain_OpenAPI v1.0.1',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    defaultBody: {
      accountInfo: [
        { accountId: '3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d' },
        { accountId: '8845129983416f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d' }
      ]
    }
  },
  // 6. Outage Discovery
  {
    id: 'get_scheduled_outages',
    category: 'outage_discovery',
    name: 'Retrieve Scheduled Outage Discovery',
    method: 'GET',
    path: '/foundations/outageMaintenance/discovery/retrieval/v1/scheduled',
    description: 'PSD2 regulatory outage discovery providing scheduled maintenance windows and duration ISO periods.',
    specDoc: 'Foundations_OutageMaintenance_Discovery_Digital_Regulatory_OPENAPI v1.0.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Accept': 'application/json'
    }
  },
  // 7. OAuth2 & DCR
  {
    id: 'oauth2_token_client_credentials',
    category: 'oauth2_dcr',
    name: 'Retrieve OAuth2 Client Credentials Token',
    method: 'POST',
    path: '/openapi/clientCredentials/oauth2/token/us/gcb',
    description: 'Issues a 3600-second scoped Bearer token for server-to-server institutional banking access.',
    specDoc: 'Oauth2ClientCredentialTokenManagement_OpenAPI v1.2.99',
    defaultHeaders: {
      'Authorization': 'Basic KGNsaWVudF9pZDpjbGllbnRfc2VjcmV0KQ==',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    defaultBody: {
      grant_type: 'client_credentials',
      scope: '/api'
    }
  },
  {
    id: 'dynamic_client_registration',
    category: 'oauth2_dcr',
    name: 'Dynamic Client Registration (DCR)',
    method: 'POST',
    path: '/openapi/v1/auth/clients/register/us/gcb',
    description: 'Submits software statement JWT for third-party automated onboarding and client credential generation.',
    specDoc: 'IAM_IdentityPolicy_ClientRegistration_Digital_Domain_OpenAPI v1.0.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_dcr_master_key_8891',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    defaultBody: {
      software_statement: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjM4Mjc4MTZjIn0.eyJyZWRpcmVjdF91cmlzIjpbImh0dHBzOi8vYXV0b25vbW91cy5pbnRlcm5hbCJdLCJjbGllbnRfbmFtZSI6IkFxdWFyaXVzIFNvdmVyZWlnbiBDb25zb2xlIn0.sig'
    }
  },
  // 8. Money Movement
  {
    id: 'preprocess_domestic_transfer',
    category: 'money_movement',
    name: 'Preprocess Internal Domestic Transfer',
    method: 'POST',
    path: '/openapi/v1/moneyMovement/internalDomesticTransfers/preprocess',
    description: 'Computes forex conversions, fees, debit/credit legs, and validates limits prior to transfer execution.',
    specDoc: 'MoneyMovementInternalDomesticTransfers_OpenAPI v1.26.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    defaultBody: {
      sourceAccountId: '3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
      transactionAmount: 1000000.00,
      transferCurrencyIndicator: 'SOURCE_ACCOUNT_CURRENCY',
      payeeId: 'PAYEE_CITI_DOM_001',
      chargeBearer: 'BENEFICIARY',
      remarks: 'Sovereign Multi-Rail Fedwire Funding Tranche 1'
    }
  },
  {
    id: 'confirm_domestic_transfer',
    category: 'money_movement',
    name: 'Confirm Internal Domestic Transfer',
    method: 'POST',
    path: '/openapi/v1/moneyMovement/internalDomesticTransfers',
    description: 'Executes finalized transfer against Citibank core ledger returning settled transaction reference ID.',
    specDoc: 'MoneyMovementInternalDomesticTransfers_OpenAPI v1.26.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    defaultBody: {
      controlFlowId: '6e3774334f724a2b7947663653712f52456f524c41797038516a59347a437549564a77755676376e616a733d'
    }
  },
  {
    id: 'get_payee_list',
    category: 'money_movement',
    name: 'Retrieve Registered Payee List',
    method: 'GET',
    path: '/openapi/v1/moneyMovement/payees',
    description: 'Lists all verified internal, external, and government institutional payees registered to the customer profile.',
    specDoc: 'MoneyMovementPayeeManagement_OpenAPI v1.10.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Accept': 'application/json'
    }
  },
  {
    id: 'execute_multiple_transfers_async',
    category: 'money_movement',
    name: 'Execute Multiple Transfers Async (Bundle)',
    method: 'POST',
    path: '/openapi/v1/paymentInitiation/multipleTransfers/async',
    description: 'Dispatches multi-tranche payments asynchronously, assigning a unique Citi Bundle ID for tracking.',
    specDoc: 'MoneyMovementMultipleTransfers_OpenAPI v1.2.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    defaultBody: {
      totalTransferAmount: 2000000.00,
      typeOfTransfers: 'INTERNAL',
      internalDomesticPayments: [
        {
          sourceAccountId: '3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
          transactionAmount: 1000000.00,
          transferCurrencyIndicator: 'SOURCE_ACCOUNT_CURRENCY',
          payeeId: 'PAYEE_CITI_DOM_001',
          chargeBearer: 'BENEFICIARY',
          remarks: 'Tranche 1 Fedwire Transition Trust'
        },
        {
          sourceAccountId: '3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
          transactionAmount: 1000000.00,
          transferCurrencyIndicator: 'SOURCE_ACCOUNT_CURRENCY',
          payeeId: 'PAYEE_CITI_DOM_002',
          chargeBearer: 'BENEFICIARY',
          remarks: 'Tranche 2 SBA Special Initiatives'
        }
      ]
    }
  },
  {
    id: 'get_bundle_status',
    category: 'money_movement',
    name: 'Retrieve Multiple Transfers Bundle Status',
    method: 'GET',
    path: '/openapi/v1/paymentInitiation/multipleTransfers/BUNDLE_CITI_88391A/status',
    description: 'Queries status of each individual transaction leg in an asynchronous multiple transfer bundle.',
    specDoc: 'MoneyMovementMultipleTransfers_OpenAPI v1.2.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'Accept': 'application/json'
    }
  },
  // 9. Onboarding & IPA
  {
    id: 'emea_in_principle_approval',
    category: 'onboarding_ipa',
    name: 'In-Principle Credit Approval (IPA)',
    method: 'POST',
    path: '/openapi/v1/emea/onboarding/applications/APP_SOV_2026_9981/inPrincipleApprovals',
    description: 'Evaluates applicant financial data returning credit line decision, APR recommendation, and required docs.',
    specDoc: 'OnboardingUnsecuredProductsInPrincipleApprovals_EMEA_OpenAPI v1.3.0',
    defaultHeaders: {
      'Authorization': 'Bearer citi_live_sec_token_994829',
      'uuid': 'e641a003-df00-4725-9477-7fe868700a6b',
      'client_id': '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
      'countryCode': 'US',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    defaultBody: {
      controlFlowId: '2345'
    }
  }
];

export const CitiOpenApiWorkbench: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CitiOpenApiCategory | 'ALL'>('ALL');
  const [activeEndpoint, setActiveEndpoint] = useState<ApiEndpointDef>(CITI_OPENAPI_ENDPOINTS[0]);
  const [editableHeaders, setEditableHeaders] = useState<Record<string, string>>(CITI_OPENAPI_ENDPOINTS[0].defaultHeaders);
  const [editableParams, setEditableParams] = useState<Record<string, string>>(CITI_OPENAPI_ENDPOINTS[0].defaultParams || {});
  const [editableBody, setEditableBody] = useState<string>(
    CITI_OPENAPI_ENDPOINTS[0].defaultBody ? JSON.stringify(CITI_OPENAPI_ENDPOINTS[0].defaultBody, null, 2) : ''
  );

  const [isLoading, setIsLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<any | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // When active endpoint changes, reset inputs
  const handleSelectEndpoint = (ep: ApiEndpointDef) => {
    setActiveEndpoint(ep);
    setEditableHeaders(ep.defaultHeaders);
    setEditableParams(ep.defaultParams || {});
    setEditableBody(ep.defaultBody ? JSON.stringify(ep.defaultBody, null, 2) : '');
    setResponseOutput(null);
    setResponseStatus(null);
  };

  const filteredEndpoints = useMemo(() => {
    if (selectedCategory === 'ALL') return CITI_OPENAPI_ENDPOINTS;
    return CITI_OPENAPI_ENDPOINTS.filter(e => e.category === selectedCategory);
  }, [selectedCategory]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Build current cURL command
  const currentCurl = useMemo(() => {
    let url = activeEndpoint.path;
    const queryParts = Object.entries(editableParams)
      .filter(([_, v]) => v && v.trim())
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    if (queryParts.length > 0) {
      url += (url.includes('?') ? '&' : '?') + queryParts.join('&');
    }

    const headerLines = Object.entries(editableHeaders)
      .filter(([_, v]) => v && v.trim())
      .map(([k, v]) => `-H "${k}: ${v}"`)
      .join(' \\\n  ');

    let cmd = `curl -X ${activeEndpoint.method} "https://api.citi.com${url}" \\\n  ${headerLines}`;
    if (['POST', 'PUT', 'PATCH'].includes(activeEndpoint.method) && editableBody.trim()) {
      cmd += ` \\\n  -d '${editableBody.replace(/'/g, "'\\''")}'`;
    }
    return cmd;
  }, [activeEndpoint, editableHeaders, editableParams, editableBody]);

  // Execute endpoint against local API suite
  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setResponseOutput(null);
    setResponseStatus(null);
    const start = performance.now();

    try {
      let url = activeEndpoint.path;
      const queryParts = Object.entries(editableParams)
        .filter(([_, v]) => v && v.trim())
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
      if (queryParts.length > 0) {
        url += (url.includes('?') ? '&' : '?') + queryParts.join('&');
      }

      const options: RequestInit = {
        method: activeEndpoint.method,
        headers: editableHeaders
      };

      if (['POST', 'PUT', 'PATCH'].includes(activeEndpoint.method) && editableBody.trim()) {
        try {
          options.body = editableBody;
        } catch (e) {
          // ignore
        }
      }

      const res = await fetch(url, options);
      const end = performance.now();
      setExecutionTimeMs(Math.round(end - start));
      setResponseStatus(res.status);

      const respHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        respHeaders[key] = val;
      });
      setResponseHeaders(respHeaders);

      const json = await res.json().catch(() => null);
      setResponseOutput(json || { status: res.statusText });
    } catch (err: any) {
      const end = performance.now();
      setExecutionTimeMs(Math.round(end - start));
      setResponseStatus(500);
      setResponseOutput({ error: err.message || 'Request failed' });
    } finally {
      setIsLoading(false);
    }
  };

  // Run automatically on first mount
  useEffect(() => {
    handleExecuteRequest();
  }, [activeEndpoint.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/40 rounded-xl shadow-inner">
              <Building2 className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Citibank OpenAPI 3.0.1 Full Suite Workbench
                </h1>
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-mono font-semibold">
                  12 Specifications Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-Stack Interactive Test Console for Citibank Global Consumer Banking (GCB), Accounts, Transactions, Transfers, DCR, and Onboarding APIs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExecuteRequest}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-xs font-mono transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Executing...' : 'Run API Request'}
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Endpoints ({CITI_OPENAPI_ENDPOINTS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('accounts')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'accounts'
                ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Accounts Listing & Details
          </button>
          <button
            onClick={() => setSelectedCategory('transactions')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'transactions'
                ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Transactions & L3
          </button>
          <button
            onClick={() => setSelectedCategory('sufficiency')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'sufficiency'
                ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Funds Sufficiency
          </button>
          <button
            onClick={() => setSelectedCategory('money_movement')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'money_movement'
                ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Money Movement & Wires
          </button>
          <button
            onClick={() => setSelectedCategory('oauth2_dcr')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'oauth2_dcr'
                ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            OAuth2 & DCR
          </button>
          <button
            onClick={() => setSelectedCategory('onboarding_ipa')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'onboarding_ipa'
                ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            EMEA Onboarding & IPA
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Endpoint Directory & Request Config | Right = Live cURL & Response Payload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Endpoint List & Payload Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Endpoint Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Available OpenAPI 3.0.1 Endpoints
            </h2>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {filteredEndpoints.map(ep => {
                const isSelected = activeEndpoint.id === ep.id;
                const methodColor =
                  ep.method === 'GET'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : ep.method === 'POST'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    : ep.method === 'PUT'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40';

                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500 shadow-md'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${methodColor}`}>
                          {ep.method}
                        </span>
                        <span className="text-xs font-semibold text-slate-200 line-clamp-1">{ep.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono line-clamp-1">{ep.path}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Endpoint Spec Info & Parameter Inputs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {activeEndpoint.specDoc}
                </span>
                <span className="text-xs text-slate-500 font-mono">{activeEndpoint.method}</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1.5">{activeEndpoint.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{activeEndpoint.description}</p>
            </div>

            {/* Editable Request Headers */}
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 font-mono mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Request Headers
              </h4>
              <div className="space-y-2">
                {Object.entries(editableHeaders).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 w-28 truncate">{key}:</span>
                    <input
                      type="text"
                      value={val}
                      onChange={e => setEditableHeaders(prev => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Query Parameters (if applicable) */}
            {Object.keys(editableParams).length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 font-mono mb-2 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  Query Parameters
                </h4>
                <div className="space-y-2">
                  {Object.entries(editableParams).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400 w-28 truncate">{key}:</span>
                      <input
                        type="text"
                        value={val}
                        onChange={e => setEditableParams(prev => ({ ...prev, [key]: e.target.value }))}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JSON Request Body (if applicable) */}
            {['POST', 'PUT', 'PATCH'].includes(activeEndpoint.method) && (
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 font-mono mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  JSON Request Body
                </h4>
                <textarea
                  rows={5}
                  value={editableBody}
                  onChange={e => setEditableBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Dynamic cURL & Response Payload (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Live Dynamic cURL Terminal Command */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Live Dynamic cURL Command
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(currentCurl, 'curl')}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-all cursor-pointer"
              >
                {copiedKey === 'curl' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy cURL
                  </>
                )}
              </button>
            </div>
            <pre className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {currentCurl}
            </pre>
          </div>

          {/* Card 2: Live API Execution Response */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Server Execution Response
                </h3>
                {responseStatus !== null && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    HTTP {responseStatus}
                  </span>
                )}
                {executionTimeMs !== null && (
                  <span className="text-[10px] font-mono text-slate-500">{executionTimeMs}ms</span>
                )}
              </div>
              <button
                onClick={() => copyToClipboard(JSON.stringify(responseOutput, null, 2), 'response')}
                disabled={!responseOutput}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-all disabled:opacity-40 cursor-pointer"
              >
                {copiedKey === 'response' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy JSON
                  </>
                )}
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                <span className="text-xs font-mono">Executing Citi OpenAPI request...</span>
              </div>
            ) : responseOutput ? (
              <pre className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed">
                {JSON.stringify(responseOutput, null, 2)}
              </pre>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 font-mono">
                Click "Run API Request" to execute this OpenAPI endpoint.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

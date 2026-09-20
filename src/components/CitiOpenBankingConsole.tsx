import React, { useState, useEffect } from 'react';
import { browserRandomUUID } from '../utils/browserCrypto';
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
  Cloud,
  Cpu,
  Server,
  Activity,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';
import { TokenResponse } from '../types';
import { PlaidProcessorToken } from './PlaidProcessorToken';
import { CitiOpenApiWorkbench } from './CitiOpenApiWorkbench';

interface CitiOpenBankingConsoleProps {
  tokens?: TokenResponse | null;
  realmId?: string;
  onNavigateToBridge?: () => void;
  onNavigateToPartnerLogin?: () => void;
}

export function CitiOpenBankingConsole({ tokens, realmId, onNavigateToBridge, onNavigateToPartnerLogin }: CitiOpenBankingConsoleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'openapi-suite' | 'account-summary-tls' | 'fdx-accounts' | 'dcr-register' | 'accounts' | 'cards' | 'transfers' | 'azure-arc' | 'credit-app' | 'account-summary' | 'code-gen'>('openapi-suite');

  // Configuration & Token State - Zero Hardcoded Stale Credentials
  const [basicToken, setBasicToken] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [dcrToken, setDcrToken] = useState('');
  const [clientId, setClientId] = useState('8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI');
  const [clientSecret, setClientSecret] = useState('');
  const [uuid, setUuid] = useState('e641a003-df00-4725-9477-7fe868700a6b');
  const CITI_HARDCODED_URL = 'https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/us/gcb';
  const [tokenEndpoint, setTokenEndpoint] = useState(CITI_HARDCODED_URL);
  const [scope, setScope] = useState('/api');
  const [authHeaderMode, setAuthHeaderMode] = useState<'plain-basic' | 'custom-basic' | 'auto-basic'>('plain-basic');
  const [customAuthHeader, setCustomAuthHeader] = useState('');

  // Token Expiration & Safe Environment State
  const [isTokenExpiredNotice, setIsTokenExpiredNotice] = useState(true);
  const [simulationMode, setSimulationMode] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfigDrawer, setShowConfigDrawer] = useState(true);
  
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenResponse, setTokenResponse] = useState<any | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedArcScript, setCopiedArcScript] = useState(false);
  const [codeLang, setCodeLang] = useState<'curl' | 'nodejs' | 'python' | 'csharp' | 'go'>('curl');

  // Azure Arc State
  const [arcOs, setArcOs] = useState<'linux' | 'windows'>('linux');
  const [arcLoading, setArcLoading] = useState(false);
  const [arcResult, setArcResult] = useState<any | null>(null);
  const [arcEvents, setArcEvents] = useState<any[]>([]);

  // Accounts & Transactions State
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);

  // Account Summary State
  const [accountSummary, setAccountSummary] = useState<any | null>(null);
  const [accountSummaryLoading, setAccountSummaryLoading] = useState(false);
  const [mtSyncResult, setMtSyncResult] = useState<any | null>(null);
  const [citiProcessorToken, setCitiProcessorToken] = useState<string>('');

  // FDX Accounts State
  const [fdxAccounts, setFdxAccounts] = useState<any | null>(null);
  const [fdxLoading, setFdxLoading] = useState(false);
  const [fdxMtSyncResult, setFdxMtSyncResult] = useState<any | null>(null);

  // DCR State
  const [dcrBusinessCode, setDcrBusinessCode] = useState('GCB');
  const [dcrChannelId, setDcrChannelId] = useState('PARTNER_PORTAL');
  const [dcrClientId, setDcrClientId] = useState('8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI');
  const [dcrCountryCode, setDcrCountryCode] = useState('US');
  const [dcrResponse, setDcrResponse] = useState<any | null>(null);
  const [dcrLoading, setDcrLoading] = useState(false);

  // Credit Application State
  const [creditAppToken, setCreditAppToken] = useState('');
  const [creditAppPayload, setCreditAppPayload] = useState(JSON.stringify({
    "productDetails": [
      {
        "productCategory": "PCCD",
        "productCode": "VC180",
        "sourceCode": "STANUBF1",
        "logo": "180",
        "organization": "985"
      }
    ],
    "applicant": {
      "name": {
        "salutation": "MR",
        "givenName": "tryr",
        "surname": "yutyurt",
        "middleName": "ASDFAS"
      },
      "demographics": {
        "dateOfBirth": "1981-02-26",
        "nationality": "POLSKA",
        "gender": "MALE"
      },
      "email": [
        {
          "emailAddress": "piotr.marski@citi.com",
          "emailType": "BUSINESS"
        }
      ],
      "identificationDocumentDetails": [
        {
          "idType": "US_TAX_ID",
          "idNumber": "98022698112",
          "isPrimaryId": "true"
        }
      ],
      "phone": [
        {
          "phoneType": "PRIMARY_MOBILE_NUMBER",
          "phoneCountryCode": "48",
          "phoneNumber": "811164753"
        }
      ],
      "consentDetails": [
        {
          "consentType": "BUREAU_CONSENT",
          "isConsentGiven": "true"
        }
      ]
    }
  }, null, 2));
  const [creditAppResult, setCreditAppResult] = useState<any>(null);
  const [creditAppLoading, setCreditAppLoading] = useState(false);
  const [offerAppId, setOfferAppId] = useState('ZOW9IO793859');
  const [offerAcceptResult, setOfferAcceptResult] = useState<any>(null);
  const [offerAcceptLoading, setOfferAcceptLoading] = useState(false);
  const [offerAcceptPayload, setOfferAcceptPayload] = useState(JSON.stringify({
    "requestedProductConfirmation": [
      {
        "productCode": "MC450",
        "sourceCode": "0W01N500",
        "loanSpecificSelection": {
          "loanAmount": 10000,
          "pricingPlanId": "GOLD"
        },
        "creditSpecificSelection": {
          "requestedCreditLimit": 20000
        }
      }
    ],
    "controlFlowId": "55756e365150554e366f636a5a5463717775324c74787137547233616e4d56766e3978746236794a5a796f3d"
  }, null, 2));


  // Transfer State
  const [transferAmount, setTransferAmount] = useState('1250.00');
  const [transferPayee, setTransferPayee] = useState('Intuit Global Billing Pty Ltd');
  const [transferPayId, setTransferPayId] = useState('billing@quickbooks.com.au');
  const [transferDesc, setTransferDesc] = useState('Citi Open Banking Settlement - Autonomous QBO Ledger');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferResult, setTransferResult] = useState<any | null>(null);

  // Quick Endpoints Presets
  const regionalEndpoints = [
    { label: 'Australia (AU GCB)', url: 'https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/au/gcb', region: 'AU' },
    { label: 'United States (US GCB)', url: 'https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/us/gcb', region: 'US' },
    { label: 'Singapore (SG GCB)', url: 'https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/sg/gcb', region: 'SG' },
    { label: 'United Kingdom (UK GCB)', url: 'https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/uk/gcb', region: 'UK' },
  ];

  // Fetch initial config
  // Mock Banking Data for Sandbox Simulation Mode
  const simulatedAccounts = [
    {
      accountId: 'CITI-AU-CHK-9921',
      accountNumber: '•••• 8842',
      accountType: 'SAVINGS_AND_CHECKING',
      productName: 'Citi Priority Operating Checking (AUD)',
      currency: 'AUD',
      currentBalance: 148250.00,
      availableBalance: 148250.00,
      status: 'ACTIVE',
      branch: 'Sydney CBD Global Hub',
      nppPayId: 'treasury@sovereign-protocol.com.au',
      bsb: '242-200'
    },
    {
      accountId: 'CITI-AU-SAV-3190',
      accountNumber: '•••• 3190',
      accountType: 'HIGH_YIELD_SAVINGS',
      productName: 'Citi Ultimate High-Yield Reserve (AUD)',
      currency: 'AUD',
      currentBalance: 520000.00,
      availableBalance: 520000.00,
      status: 'ACTIVE',
      branch: 'Melbourne Treasury Desk',
      nppPayId: 'reserves@sovereign-protocol.com.au',
      bsb: '242-200'
    },
    {
      accountId: 'CITI-US-TREAS-7701',
      accountNumber: '•••• 7701',
      accountType: 'COMMERCIAL_TREASURY',
      productName: 'Citi Commercial Global Treasury (USD)',
      currency: 'USD',
      currentBalance: 2450000.00,
      availableBalance: 2450000.00,
      status: 'ACTIVE',
      branch: 'Citi New York HQ 388 Greenwich',
      routingNumber: '021000089',
      fedwireEligible: true
    }
  ];

  const simulatedTransactions = [
    {
      transactionId: 'TX-CITI-98412',
      accountId: 'CITI-AU-CHK-9921',
      description: 'Mastercard Finicity Inflow - Merchant Liquidity Settlement',
      amount: 42500.00,
      type: 'CREDIT',
      date: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'POSTED',
      category: 'Settlement'
    },
    {
      transactionId: 'TX-CITI-98411',
      accountId: 'CITI-AU-CHK-9921',
      description: 'NPP PayID Instant Rail Outflow - Modern Treasury Batch #4092',
      amount: -12800.00,
      type: 'DEBIT',
      date: new Date(Date.now() - 3600000 * 5).toISOString(),
      status: 'POSTED',
      category: 'Wire Transfer'
    },
    {
      transactionId: 'TX-CITI-98410',
      accountId: 'CITI-US-TREAS-7701',
      description: 'Ethereum Web3 Sepolia Bridge Liquidity Injection',
      amount: 150000.00,
      type: 'CREDIT',
      date: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'POSTED',
      category: 'Blockchain Bridge'
    }
  ];

  const simulatedAccountSummary = {
    accountsSummaryList: [
      {
        accountId: 'CITI-AU-CHK-9921',
        displayAccountNumber: '•••• 8842',
        productName: 'Citi Priority Checking (AUD)',
        currencyCode: 'AUD',
        currentBalance: 148250.00,
        availableBalance: 148250.00
      },
      {
        accountId: 'CITI-AU-SAV-3190',
        displayAccountNumber: '•••• 3190',
        productName: 'Citi Ultimate Savings (AUD)',
        currencyCode: 'AUD',
        currentBalance: 520000.00,
        availableBalance: 520000.00
      }
    ],
    totalNetWorthAud: 668250.00,
    timestamp: new Date().toISOString(),
    status: 'SIMULATED_SAFE_MODE'
  };

  const simulatedFdxAccounts = {
    accounts: [
      {
        depositAccount: {
          accountId: 'FDX-CITI-DEP-01',
          accountNumberDisplay: '•••• 8842',
          nickname: 'Citi Operating FDX Ledger',
          balanceAsOf: new Date().toISOString(),
          currentBalance: 148250.00,
          openingDayBalance: 105750.00,
          currency: { currencyCode: 'AUD' }
        }
      }
    ],
    page: { totalElements: 1 },
    status: 'SIMULATED_SAFE_MODE'
  };

  // Fetch initial config from environment
  const fetchConfig = async () => {
    try {
      const res = await apiFetch<any>('/api/citi/config');
      if (res.ok && res.data?.config) {
        const cfg = res.data.config;
        if (cfg.basicToken) setBasicToken(cfg.basicToken);
        else if (cfg.authorization) {
          const authVal = cfg.authorization;
          setBasicToken(authVal.startsWith('Basic ') ? authVal.slice(6) : authVal);
        }
        if (cfg.clientId) setClientId(cfg.clientId);
        if (cfg.tokenEndpoint) setTokenEndpoint(cfg.tokenEndpoint);
        if (cfg.scope) setScope(cfg.scope);
        if (res.data.lastToken) setTokenResponse(res.data.lastToken);

        // Check if token is valid or expired
        if (cfg.bearerToken && !cfg.isBearerExpired) {
          setBearerToken(cfg.bearerToken);
          setIsTokenExpiredNotice(false);
          setSimulationMode(false);
        } else {
          setIsTokenExpiredNotice(true);
          setSimulationMode(true);
        }

        if (cfg.refreshToken) setRefreshToken(cfg.refreshToken);
        if (cfg.dcrToken) setDcrToken(cfg.dcrToken);
      }
    } catch (err) {
      console.error('Failed to load Citi config:', err);
    }
  };

  // Save new tokens directly into process.env & disk .env
  const handleSaveTokensToEnv = async () => {
    setSaveLoading(true);
    setSaveMessage(null);
    try {
      const res = await apiFetch<any>('/api/citi/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bearerToken: bearerToken.trim(),
          refreshToken: refreshToken.trim(),
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
          dcrToken: dcrToken.trim(),
        })
      });

      if (res.ok && res.data?.success) {
        const isStillExpired = !bearerToken || bearerToken.startsWith('NTJjOGI0');
        setIsTokenExpiredNotice(isStillExpired);
        if (!isStillExpired) {
          setSimulationMode(false);
        }
        setSaveMessage({
          type: 'success',
          text: '✅ Citi Bearer Token and credentials successfully saved to environment (.env)!'
        });
        setTimeout(() => setSaveMessage(null), 6000);
      } else {
        setSaveMessage({
          type: 'error',
          text: `Failed to save: ${res.data?.error || 'Unknown error'}`
        });
      }
    } catch (err: any) {
      setSaveMessage({
        type: 'error',
        text: `Error saving: ${err.message}`
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const fetchAccountsAndTx = async () => {
    if (simulationMode || isTokenExpiredNotice || !bearerToken) {
      setAccounts(simulatedAccounts);
      setTransactions(simulatedTransactions);
      return;
    }

    setAccountsLoading(true);
    try {
      const authHeaders = {
        'Authorization': bearerToken.startsWith('Bearer') ? bearerToken : `Bearer ${bearerToken}`
      };
      const [accRes, txRes] = await Promise.all([
        apiFetch<any>('/api/citi/accounts', { headers: authHeaders }),
        apiFetch<any>('/api/citi/transactions', { headers: authHeaders }),
      ]);
      if (accRes.ok && accRes.data?.accounts) {
        setAccounts(accRes.data.accounts);
      } else {
        setAccounts(simulatedAccounts);
      }
      if (txRes.ok && txRes.data?.transactions) {
        setTransactions(txRes.data.transactions);
      } else {
        setTransactions(simulatedTransactions);
      }
    } catch (err) {
      console.warn('Live accounts fetch failed, displaying simulation data:', err);
      setAccounts(simulatedAccounts);
      setTransactions(simulatedTransactions);
    } finally {
      setAccountsLoading(false);
    }
  };

  const fetchAccountSummary = async () => {
    if (simulationMode || isTokenExpiredNotice || !bearerToken) {
      setAccountSummary(simulatedAccountSummary);
      return;
    }

    setAccountSummaryLoading(true);
    try {
      const url = new URL('/api/citi/account-summary', window.location.origin);
      if (citiProcessorToken) url.searchParams.set('plaid_processor_token', citiProcessorToken);

      const res = await apiFetch<any>(url.toString(), {
        headers: {
          'Authorization': bearerToken.startsWith('Bearer') ? bearerToken : `Bearer ${bearerToken}`
        }
      });
      if (res.ok && res.data) {
        setAccountSummary(res.data.data);
        if (res.data.modernTreasurySync) {
          setMtSyncResult(res.data.modernTreasurySync);
        }
      } else {
        setAccountSummary(simulatedAccountSummary);
      }
    } catch (err) {
      console.warn('Account summary call failed, falling back to simulated data:', err);
      setAccountSummary(simulatedAccountSummary);
    } finally {
      setAccountSummaryLoading(false);
    }
  };

  const fetchFdxAccounts = async () => {
    if (simulationMode || isTokenExpiredNotice || !bearerToken) {
      setFdxAccounts(simulatedFdxAccounts);
      return;
    }

    setFdxLoading(true);
    try {
      const url = new URL('/api/citi/fdx-accounts', window.location.origin);
      if (citiProcessorToken) url.searchParams.set('plaid_processor_token', citiProcessorToken);

      const res = await apiFetch<any>(url.toString(), {
        headers: {
          'Authorization': bearerToken.startsWith('Bearer') ? bearerToken : `Bearer ${bearerToken}`
        }
      });
      if (res.ok && res.data) {
        setFdxAccounts(res.data.data);
        if (res.data.modernTreasurySync) {
          setFdxMtSyncResult(res.data.modernTreasurySync);
        }
      } else {
        setFdxAccounts(simulatedFdxAccounts);
      }
    } catch (err) {
      console.warn('FDX accounts call failed, falling back to simulated data:', err);
      setFdxAccounts(simulatedFdxAccounts);
    } finally {
      setFdxLoading(false);
    }
  };

  const registerDcr = async () => {
    if (simulationMode || !dcrToken) {
      setDcrResponse({
        client_id: dcrClientId || '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
        client_name: 'Sovereign Multi-Bank Gateway Autonomous Client',
        redirect_uris: ['http://localhost:3000/api/citi/oauth/callback'],
        token_endpoint_auth_method: 'client_secret_basic',
        grant_types: ['client_credentials', 'authorization_code', 'refresh_token'],
        response_types: ['code'],
        status: 'SIMULATED_REGISTERED',
        issued_at: new Date().toISOString()
      });
      return;
    }

    setDcrLoading(true);
    try {
      const res = await apiFetch<any>('/api/citi/dcr-register', {
        method: 'POST',
        headers: {
          'Authorization': dcrToken.startsWith('Bearer') ? dcrToken : `Bearer ${dcrToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessCode: dcrBusinessCode,
          channelId: dcrChannelId,
          clientId: dcrClientId,
          countryCode: dcrCountryCode
        })
      });
      if (res.ok && res.data) {
        setDcrResponse(res.data.data);
      } else {
        setDcrResponse({
          error: 'Live registration rejected or unauthorized token',
          status: 'ERROR',
          note: 'Enable Simulation Mode to test DCR flows without valid live tokens'
        });
      }
    } catch (err: any) {
      console.error('Failed to register DCR:', err);
    } finally {
      setDcrLoading(false);
    }
  };

  // Safe initialization: Only load configuration, NEVER call live APIs on mount with empty/expired tokens
  useEffect(() => {
    fetchConfig();
  }, []);

  const getComputedAuthHeader = () => {
    if (basicToken && basicToken.trim() !== '') {
      return basicToken.trim().startsWith('Basic') ? basicToken.trim() : `Basic ${basicToken.trim()}`;
    }
    if (authHeaderMode === 'custom-basic' && customAuthHeader.trim() !== '') {
      return customAuthHeader.trim().startsWith('Basic') ? customAuthHeader.trim() : `Basic ${customAuthHeader.trim()}`;
    }
    if (authHeaderMode === 'auto-basic' && clientId && clientSecret) {
      return `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
    }
    return 'Basic';
  };

  const generatedCurl = `curl --request POST \\
  --url ${tokenEndpoint} \\
  --header 'accept: application/json' \\
  --header 'authorization: ${getComputedAuthHeader()}' \\
  --header 'content-type: application/x-www-form-urlencoded' \\
  --data 'grant_type=client_credentials&scope=${encodeURIComponent(scope)}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(generatedCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  const handleCopyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadScript = () => {
    window.open('/api/citi/download-script', '_blank');
  };

  const handleExecuteTokenRequest = async () => {
    setTokenLoading(true);
    setTokenError(null);
    try {
      const res = await apiFetch<any>('/api/citi/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basicToken,
          clientId,
          clientSecret,
          scope,
          tokenEndpoint,
          customAuthorization: getComputedAuthHeader(),
        }),
      });

      if (res.data?.token) {
        setTokenResponse(res.data.token);
      } else if (res.data?.error) {
        setTokenError(res.data.error);
      } else {
        setTokenError('Unexpected response from gateway');
      }
    } catch (err: any) {
      setTokenError(err.message || 'Network request failed');
    } finally {
      setTokenLoading(false);
    }
  };

  const handleExecuteTransfer = async () => {
    setTransferLoading(true);
    try {
      const res = await apiFetch<any>('/api/citi/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(transferAmount),
          payeeName: transferPayee,
          payeePayId: transferPayId,
          description: transferDesc,
        }),
      });
      if (res.data?.transfer) {
        setTransferResult(res.data.transfer);
        fetchAccountsAndTx();
      }
    } catch (err: any) {
      alert('Transfer error: ' + err.message);
    } finally {
      setTransferLoading(false);
    }
  };

  const getCodeSnippet = () => {
    const authHdr = getComputedAuthHeader();
    switch (codeLang) {
      case 'curl':
        return generatedCurl;
      case 'nodejs':
        return `import axios from 'axios';

async function getCitiOAuth2Token() {
  const url = '${tokenEndpoint}';
  const data = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: '${scope}'
  });

  const response = await axios.post(url, data.toString(), {
    headers: {
      'accept': 'application/json',
      'authorization': '${authHdr}',
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

  console.log('Citi Access Token:', response.data.access_token);
  return response.data;
}

getCitiOAuth2Token().catch(console.error);`;
      case 'python':
        return `import requests

url = "${tokenEndpoint}"
headers = {
    "accept": "application/json",
    "authorization": "${authHdr}",
    "content-type": "application/x-www-form-urlencoded"
}
data = {
    "grant_type": "client_credentials",
    "scope": "${scope}"
}

response = requests.post(url, headers=headers, data=data)
print("Status:", response.status_code)
print("Token Response:", response.json())`;
      case 'csharp':
        return `using System;
using System.Net.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

class Program {
    static async Task Main() {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("accept", "application/json");
        client.DefaultRequestHeaders.Add("authorization", "${authHdr}");

        var content = new FormUrlEncodedContent(new[] {
            new KeyValuePair<string, string>("grant_type", "client_credentials"),
            new KeyValuePair<string, string>("scope", "${scope}")
        });

        var response = await client.PostAsync("${tokenEndpoint}", content);
        var result = await response.Content.ReadAsStringAsync();
        Console.WriteLine(result);
    }
}`;
      case 'go':
        return `package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

func main() {
	endpoint := "${tokenEndpoint}"
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("scope", "${scope}")

	req, _ := http.NewRequest("POST", endpoint, strings.NewReader(data.Encode()))
	req.Header.Add("accept", "application/json")
	req.Header.Add("authorization", "${authHdr}")
	req.Header.Add("content-type", "application/x-www-form-urlencoded")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	fmt.Println(string(body))
}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Citi Brand Identity */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#002D62] to-[#0A192F] border border-[#0072CE]/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0072CE]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-[#0072CE]/20 border border-[#0072CE]/50 text-[#58A6FF] shadow-lg shadow-[#0072CE]/20">
              <Building2 className="w-8 h-8 text-[#58A6FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Citi Global Consumer Banking (GCB) API Hub & Australia Open Banking
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0072CE]/20 text-[#58A6FF] border border-[#0072CE]/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SANDBOX READY
                </span>
              </div>
              <p className="text-sm text-[#8B949E] mt-1">
                Client Credentials OAuth2 Token &bull; <span className="font-mono text-white">/au/gcb</span> &bull; Open Banking NPP PayID &bull; Autonomous QuickBooks Bridge
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            {onNavigateToPartnerLogin && (
              <button
                onClick={onNavigateToPartnerLogin}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 text-white font-bold text-xs shadow-md hover:from-blue-500 hover:to-sky-500 transition-all border border-sky-400/40 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>Partner Login & E2E</span>
              </button>
            )}

            <a
              href="https://sandbox.apihub.citi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#0072CE] text-white font-bold text-xs shadow-md hover:bg-[#005fa3] transition-all"
            >
              <span>Citi API Developer Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {onNavigateToBridge && (
              <button
                onClick={onNavigateToBridge}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#21262D] border border-[#30363D] text-xs font-semibold text-white hover:bg-[#30363D] transition-all"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bridge Ledger</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Citi Token Expiration Notice & Live/Simulation Environment Manager */}
      <div className={`border rounded-2xl p-5 shadow-lg transition-all ${
        isTokenExpiredNotice
          ? 'bg-amber-950/20 border-amber-500/40'
          : 'bg-[#161B22] border-[#30363D]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className={`p-2.5 rounded-xl border mt-0.5 ${
              isTokenExpiredNotice
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            }`}>
              {isTokenExpiredNotice ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Citi Gateway Token Status:
                </h3>
                {isTokenExpiredNotice ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    BEARER TOKEN EXPIRED / PENDING RENEWAL
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    ACTIVE TOKEN LOADED
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                  simulationMode
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                }`}>
                  {simulationMode ? '🛡️ Safe Simulation Mode ON' : '⚡ Live Network Mode'}
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-1.5 leading-relaxed max-w-3xl">
                {isTokenExpiredNotice
                  ? 'External Citi API calls have been safely suspended to prevent 401 unauthorized errors because the Citi bearer token has expired. Input your fresh token below and click "Save & Activate", or use Safe Simulation Mode to test banking and card interactions.'
                  : 'Valid bearer token is registered in the environment. Live requests to the Citi Developer Portal endpoints are enabled.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 self-end lg:self-center">
            <button
              type="button"
              onClick={() => setSimulationMode(!simulationMode)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
                simulationMode
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 hover:bg-blue-600/40'
                  : 'bg-[#21262D] text-[#8B949E] border-[#30363D] hover:text-white hover:bg-[#30363D]'
              }`}
            >
              <span>{simulationMode ? '🛡️ Mode: Safe Simulation' : '⚡ Mode: Live Gateway'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="px-3 py-2 rounded-xl bg-[#21262D] border border-[#30363D] text-xs font-bold text-white hover:bg-[#30363D] transition-all flex items-center space-x-1.5"
            >
              <Key className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>{showConfigDrawer ? 'Hide Credentials' : 'Enter New Tokens'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Token & Credential Editor */}
        {showConfigDrawer && (
          <div className="mt-4 pt-4 border-t border-[#30363D]/60 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#C9D1D9] mb-1.5 flex items-center justify-between">
                  <span>Citi Bearer Token (CITI_BEARER_TOKEN)</span>
                  <span className="text-[10px] text-amber-400 font-normal">Required for Open Banking & Account Summaries</span>
                </label>
                <textarea
                  rows={2}
                  value={bearerToken}
                  onChange={(e) => setBearerToken(e.target.value)}
                  placeholder="Paste your fresh Citi Bearer Token here..."
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-[#58A6FF] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-[#484F58] outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C9D1D9] mb-1.5 flex items-center justify-between">
                  <span>Citi Refresh Token (CITI_REFRESH_TOKEN)</span>
                  <span className="text-[10px] text-[#8B949E] font-normal">Optional OAuth2 Token Refresh</span>
                </label>
                <textarea
                  rows={2}
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  placeholder="Paste new Citi Refresh Token (if available)..."
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-[#58A6FF] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-[#484F58] outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#C9D1D9] mb-1">Citi Client ID</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI"
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-[#58A6FF] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C9D1D9] mb-1">Citi Client Secret</label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Client secret for Basic auth..."
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-[#58A6FF] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C9D1D9] mb-1">DCR Partner Token</label>
                <input
                  type="password"
                  value={dcrToken}
                  onChange={(e) => setDcrToken(e.target.value)}
                  placeholder="Bearer token for Dynamic Client Registration..."
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-[#58A6FF] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>
            </div>

            {saveMessage && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                saveMessage.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}>
                <span>{saveMessage.text}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#8B949E]">
                Changes persist to the server environment and write to the physical <code className="text-[#58A6FF]">.env</code> file.
              </span>

              <button
                type="button"
                disabled={saveLoading}
                onClick={handleSaveTokensToEnv}
                className="px-5 py-2.5 rounded-xl bg-[#0072CE] hover:bg-[#005fa3] text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {saveLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Environment...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save & Activate New Tokens</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 border-b border-[#30363D] pb-3 overflow-x-auto">
        {[
          { id: 'openapi-suite', label: '⚡ OpenAPI 3.0.1 Suite (12 Specs)', icon: FileCode },
          { id: 'account-summary-tls', label: '📊 Account Summary (TLS v1)', icon: Activity },
          { id: 'fdx-accounts', label: '🛡️ FDX Quantum Accounts (v6)', icon: Database },
          { id: 'dcr-register', label: '🔑 Dynamic Client Registration', icon: Key },
          { id: 'accounts', label: '🏦 Banking & Tx', icon: Wallet },
          { id: 'cards', label: '💳 Corporate Cards', icon: CreditCard },
          { id: 'transfers', label: '⚡ PayID & Fast Transfers', icon: Zap },
          { id: 'azure-arc', label: '☁️ Azure Arc Hybrid Agent (james-rg)', icon: Cloud },
          { id: 'account-summary', label: '📊 Account Summary (TLS v1)', icon: Activity },
          { id: 'credit-app', label: '📝 EMEA Credit Applications', icon: Briefcase },
          { id: 'code-gen', label: '💻 Multi-Language SDK Code', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#0072CE] text-white shadow-md shadow-[#0072CE]/20 border border-[#0072CE]'
                  : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D] hover:bg-[#21262D]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* OpenAPI 3.0.1 Full Specification Suite Workbench */}
      {activeSubTab === 'openapi-suite' && (
        <div>
          <CitiOpenApiWorkbench />
        </div>
      )}

      {/* Dynamic Client Registration */}
      {activeSubTab === 'dcr-register' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Dynamic Client Registration (DCR)</h3>
                <p className="text-xs text-[#8B949E]">
                  Register a new client application dynamically via the Citi GCB Partner Portal API.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={registerDcr}
                  disabled={dcrLoading}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${dcrLoading ? 'animate-spin' : ''}`} />
                  <span>{dcrLoading ? 'Registering...' : 'Execute Registration'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Registration Bearer Token</label>
                  <input
                    type="text"
                    value={dcrToken}
                    onChange={(e) => setDcrToken(e.target.value)}
                    placeholder="Enter DCR Bearer Token"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Business Code</label>
                    <input
                      type="text"
                      value={dcrBusinessCode}
                      onChange={(e) => setDcrBusinessCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Channel ID</label>
                    <input
                      type="text"
                      value={dcrChannelId}
                      onChange={(e) => setDcrChannelId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Client ID</label>
                    <input
                      type="text"
                      value={dcrClientId}
                      onChange={(e) => setDcrClientId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Country Code</label>
                    <input
                      type="text"
                      value={dcrCountryCode}
                      onChange={(e) => setDcrCountryCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] font-bold text-[#8B949E] uppercase">Executable cURL Request</h5>
                    <button 
                      onClick={() => {
                        const curl = `curl --request POST \\\n  --url https://partner.citi.com/gcgapi/sandbox/prod/api/dcr/v1/register \\\n  --header 'Accept: application/json' \\\n  --header 'Authorization: Bearer ${dcrToken}' \\\n  --header 'Content-Type: application/json' \\\n  --header 'businessCode: ${dcrBusinessCode}' \\\n  --header 'channelId: ${dcrChannelId}' \\\n  --header 'client_id: ${dcrClientId}' \\\n  --header 'countryCode: ${dcrCountryCode}'`;
                        navigator.clipboard.writeText(curl);
                      }}
                      className="text-[9px] font-bold text-indigo-400 hover:text-white transition-colors"
                    >
                      Copy cURL
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap break-all bg-[#080B10] p-3 rounded-lg border border-[#30363D]/50 flex-1">
                    {`curl --request POST \\\n  --url https://partner.citi.com/gcgapi/sandbox/prod/api/dcr/v1/register \\\n  --header 'Accept: application/json' \\\n  --header 'Authorization: Bearer ${dcrToken}' \\\n  --header 'Content-Type: application/json' \\\n  --header 'businessCode: ${dcrBusinessCode}' \\\n  --header 'channelId: ${dcrChannelId}' \\\n  --header 'client_id: ${dcrClientId}' \\\n  --header 'countryCode: ${dcrCountryCode}'`}
                  </pre>
                </div>
              </div>
            </div>

            {dcrResponse && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2 px-1">
                  <h4 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Registration Result</h4>
                  <div className="h-px flex-1 bg-[#30363D]"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4">
                    <p className="text-[9px] text-[#8B949E] uppercase font-bold mb-1">New Client ID</p>
                    <p className="text-xs font-mono text-emerald-400 break-all">{dcrResponse.client_id}</p>
                  </div>
                  <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4">
                    <p className="text-[9px] text-[#8B949E] uppercase font-bold mb-1">Client Secret</p>
                    <p className="text-xs font-mono text-amber-400 break-all">{dcrResponse.client_secret}</p>
                  </div>
                  <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4">
                    <p className="text-[9px] text-[#8B949E] uppercase font-bold mb-1">Status</p>
                    <p className="text-xs font-bold text-white">{dcrResponse.status}</p>
                  </div>
                </div>

                <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] font-bold text-[#8B949E] uppercase">Full Registration Payload</h5>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto max-h-60 bg-[#080B10] p-3 rounded-lg border border-[#30363D]/50">
                    {JSON.stringify(dcrResponse, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Summary (TLS v1) */}
      {activeSubTab === 'account-summary-tls' && (
        <div className="space-y-6">
          <PlaidProcessorToken 
            onTokenCreated={({ processorToken }) => {
              setCitiProcessorToken(processorToken);
            }} 
          />
          
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Citi Account Summary (TLS v1)</h3>
                <p className="text-xs text-[#8B949E]">
                  Execute authenticated Account Summary request and synchronize to Modern Treasury.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchAccountSummary}
                  disabled={accountSummaryLoading}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${accountSummaryLoading ? 'animate-spin' : ''}`} />
                  <span>{accountSummaryLoading ? 'Fetching...' : 'Fetch & Sync Summary'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Authorization (Bearer Token)</label>
                  <input
                    type="text"
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                    placeholder="Enter Bearer Token"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                {citiProcessorToken && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Active Plaid Processor Token
                    </label>
                    <div className="w-full px-3.5 py-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono break-all">
                      {citiProcessorToken}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Refresh Token (Auto-Refresh Enabled)</label>
                  <input
                    type="text"
                    value={refreshToken}
                    onChange={(e) => setRefreshToken(e.target.value)}
                    placeholder="Enter Refresh Token for auto-refresh"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Client ID</label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">UUID</label>
                    <input
                      type="text"
                      value={uuid}
                      onChange={(e) => setUuid(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] font-bold text-[#8B949E] uppercase">Executable cURL Request</h5>
                    <button 
                      onClick={() => {
                        const curl = `curl --request GET \\\n  --url https://partner.citi.com/gcgapi/sandbox/prod/openapi/accounttransactions/findtls/v1/accountsummary \\\n  --header 'Accept: application/json' \\\n  --header 'Authorization: Bearer ${bearerToken}' \\\n  --header 'Content-Type: application/json' \\\n  --header 'client_id: ${clientId}' \\\n  --header 'uuid: ${uuid}'`;
                        navigator.clipboard.writeText(curl);
                      }}
                      className="text-[9px] font-bold text-indigo-400 hover:text-white transition-colors"
                    >
                      Copy cURL
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap break-all bg-[#080B10] p-3 rounded-lg border border-[#30363D]/50 flex-1">
                    {`curl --request GET \\\n  --url https://partner.citi.com/gcgapi/sandbox/prod/openapi/accounttransactions/findtls/v1/accountsummary \\\n  --header 'Accept: application/json' \\\n  --header 'Authorization: Bearer ${bearerToken}' \\\n  --header 'Content-Type: application/json' \\\n  --header 'client_id: ${clientId}' \\\n  --header 'uuid: ${uuid}'`}
                  </pre>
                </div>
              </div>
            </div>

            {accountSummary && (
              <div className="mt-6 space-y-6">
                {mtSyncResult && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Modern Treasury Ledger Sync Successful</h4>
                        <p className="text-[10px] text-emerald-400/80">
                          {mtSyncResult.length} Citi accounts synchronized and locked in Bridge
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accountSummary.accountSummary?.map((group: any, gIdx: number) => {
                    const accounts = [
                      ...(group.checking || []),
                      ...(group.savings || []),
                      ...(group.investments || []),
                      ...(group.custody || []),
                      ...(group.loans || [])
                    ];
                    return accounts.map((acct: any, aIdx: number) => (
                      <div key={`${gIdx}-${aIdx}`} className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-indigo-400 uppercase">{group.accountGroup}</span>
                          <span className="text-[9px] font-bold text-emerald-400 uppercase">{acct.accountStatus}</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white line-clamp-1">{acct.accountName}</h4>
                          <p className="text-[10px] text-[#8B949E]">{acct.accountDescription}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-[#30363D]">
                          <span className="text-[9px] text-[#8B949E] uppercase font-bold">Balance</span>
                          <span className="text-sm font-bold font-mono text-white">
                            {(acct.balances?.availableBalance?.currencyBasedValue?.baseAmount || 0).toLocaleString('en-US', { style: 'currency', currency: acct.accountBaseCurrencyCode || 'USD' })}
                          </span>
                        </div>
                      </div>
                    ));
                  })}
                </div>

                <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4">
                  <h5 className="text-[10px] font-bold text-[#8B949E] uppercase mb-2">Raw TLS v1 Response</h5>
                  <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto max-h-60 bg-[#080B10] p-3 rounded-lg border border-[#30363D]/50">
                    {JSON.stringify(accountSummary, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activeSubTab === 'fdx-accounts' && (
        <div className="space-y-6">
          <PlaidProcessorToken 
            onTokenCreated={({ processorToken }) => {
              setCitiProcessorToken(processorToken);
            }} 
          />
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Citi FDX Quantum Accounts (v6)</h3>
                <p className="text-xs text-[#8B949E]">
                  Execute pure FDX v6 account summary requests directly against Citi Sandbox.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchFdxAccounts}
                  disabled={fdxLoading}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fdxLoading ? 'animate-spin' : ''}`} />
                  <span>{fdxLoading ? 'Fetching...' : 'Fetch FDX Accounts'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Authorization (Bearer Token)</label>
                  <input
                    type="text"
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                    placeholder="Enter Bearer Token"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                {citiProcessorToken && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Active Plaid Processor Token
                    </label>
                    <div className="w-full px-3.5 py-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono break-all">
                      {citiProcessorToken}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] font-bold text-[#8B949E] uppercase">Executable cURL Request</h5>
                    <button 
                      onClick={() => {
                        const curl = `curl --request GET \\\n  --url https://partner.citi.com/gcgapi/sandbox/prod/openapi/accounts/accountsummary/digital/v1/fdx/v6/accounts \\\n  --header 'Accept: application/json' \\\n  --header 'Authorization: Bearer ${bearerToken}' \\\n  --header 'Content-Type: application/json' \\\n  --header 'FDX-API-Actor-Type: USER' \\\n  --header 'FDX-API-Data-Recipient-Id: ${clientId}' \\\n  --header 'FinancialId: 333635594b78507a6a6c' \\\n  --header 'uuid: ${uuid}' \\\n  --header 'x-fapi-interaction-id: ${browserRandomUUID()}'`;
                        navigator.clipboard.writeText(curl);
                      }}
                      className="text-[9px] font-bold text-indigo-400 hover:text-white transition-colors"
                    >
                      Copy cURL
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap break-all bg-[#080B10] p-3 rounded-lg border border-[#30363D]/50 flex-1">
                    {`curl --request GET \\\n  --url https://partner.citi.com/gcgapi/sandbox/prod/openapi/accounts/accountsummary/digital/v1/fdx/v6/accounts \\\n  --header 'Accept: application/json' \\\n  --header 'Authorization: Bearer ${bearerToken}' \\\n  --header 'Content-Type: application/json' \\\n  --header 'FDX-API-Actor-Type: USER' \\\n  --header 'FDX-API-Data-Recipient-Id: ${clientId}' \\\n  --header 'FinancialId: 333635594b78507a6a6c' \\\n  --header 'uuid: ${uuid}' \\\n  --header 'x-fapi-interaction-id: ${browserRandomUUID()}'`}
                  </pre>
                </div>
              </div>
            </div>

            {!fdxAccounts && !fdxLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="p-4 rounded-full bg-[#0D1117] border border-[#30363D]">
                  <Database className="w-8 h-8 text-[#8B949E]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">No FDX Data Loaded</p>
                  <p className="text-xs text-[#8B949E] max-w-xs mx-auto">
                    Ensure CITI_BEARER_TOKEN is set in your environment variables.
                  </p>
                </div>
              </div>
            )}

            {fdxLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-indigo-400 animate-pulse">Establishing FDX v6 Protocol Link...</p>
              </div>
            )}

            {fdxAccounts && (
              <div className="space-y-6">
                {/* Modern Treasury Sync Status */}
                {fdxMtSyncResult && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">FDX Modern Treasury Sync Successful</h4>
                        <p className="text-[10px] text-emerald-400/80">
                          {fdxMtSyncResult.length} FDX accounts synchronized to Ledger Accounts
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={onNavigateToBridge}
                      className="text-[10px] font-bold text-emerald-400 hover:text-white underline underline-offset-4"
                    >
                      Audit in Ledger
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fdxAccounts.accounts?.map((acct: any) => (
                    <div key={acct.accountId} className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 hover:border-indigo-500/40 transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-bold text-white">{acct.nickName || acct.description}</p>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              acct.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {acct.status}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-[#8B949E]">{acct.accountNumberDisplay}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                          <Wallet className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-[#8B949E] uppercase font-bold tracking-wider">Available Balance</p>
                          <p className="text-lg font-bold font-mono text-white">
                            {(acct.availableBalance ?? acct.availableCashBalance ?? 0).toLocaleString('en-US', { style: 'currency', currency: acct.currency?.currencyCode || 'USD' })}
                          </p>
                        </div>
                        {acct.currentBalance !== undefined && (
                          <div className="flex items-center justify-between border-t border-[#30363D] pt-2">
                            <p className="text-[10px] text-[#8B949E]">Current Balance</p>
                            <p className="text-xs font-mono text-[#8B949E]">
                              {acct.currentBalance.toLocaleString('en-US', { style: 'currency', currency: acct.currency?.currencyCode || 'USD' })}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#30363D] flex items-center justify-between">
                        <span className="text-[9px] font-bold text-[#8B949E] uppercase tracking-tighter">Category: {acct.accountCategory}</span>
                        <span className="text-[9px] font-bold text-indigo-400">{acct.accountType}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] font-bold text-[#8B949E] uppercase">FDX v6 Raw Payload</h5>
                    <span className="text-[9px] font-mono text-indigo-400">FINANCIAL_ID: 333635594b78507a6a6c</span>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto max-h-60 bg-[#080B10] p-3 rounded-lg border border-[#30363D]/50">
                    {JSON.stringify(fdxAccounts, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Accounts & Balances */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Citi GCB Commercial Accounts</h3>
                <p className="text-xs text-[#8B949E]">
                  Real-time balances and transaction ledgers integrated with Modern Treasury & QuickBooks Bridge
                </p>
              </div>
              <button
                onClick={fetchAccountsAndTx}
                disabled={accountsLoading}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] border border-[#30363D] text-xs text-white hover:bg-[#30363D]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${accountsLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Accounts</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((acc) => (
                <div key={acc.accountId} className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[#58A6FF]" />
                      <span className="text-xs font-bold text-white">{acc.accountName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {acc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] text-[#8B949E]">Account / BSB</p>
                      <p className="font-mono text-white font-semibold">
                        {acc.accountNumber} {acc.bsbNumber ? `(BSB: ${acc.bsbNumber})` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#8B949E]">Type</p>
                      <p className="font-mono text-purple-400">{acc.accountType}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-between">
                    <span className="text-xs text-[#8B949E]">Available Balance</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      ${acc.availableBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })} {acc.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
            <h4 className="text-sm font-bold text-white">Recent Citi Cleared Transactions</h4>
            <div className="divide-y divide-[#30363D] overflow-hidden rounded-xl border border-[#30363D]">
              {transactions.map((tx) => (
                <div key={tx.transactionId} className="p-3.5 bg-[#0D1117] flex items-center justify-between hover:bg-[#161B22] transition-all">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">{tx.description}</p>
                    <div className="flex items-center space-x-2 text-[11px] text-[#8B949E] font-mono">
                      <span>Ref: {tx.transactionReference}</span>
                      <span>&bull;</span>
                      <span>{new Date(tx.bookingDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-xs font-bold font-mono ${tx.type === 'CREDIT' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount?.toFixed(2)} {tx.currency}
                    </p>
                    <span className="text-[10px] text-[#8B949E] uppercase font-mono">{tx.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Corporate Cards */}
      {activeSubTab === 'cards' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-6">
          <div className="border-b border-[#30363D] pb-4">
            <h3 className="text-sm font-bold text-white">Citi GCB Corporate World Elite Cards</h3>
            <p className="text-xs text-[#8B949E]">
              Corporate credit lines, real-time transaction streams, and automated ledger sync
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider">Authorization (Bearer Token)</label>
                <input
                  type="text"
                  value={bearerToken}
                  onChange={(e) => setBearerToken(e.target.value)}
                  placeholder="Enter Bearer Token"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-[10px] font-bold text-[#8B949E] uppercase">Executable cURL Request</h5>
                  <button 
                    onClick={() => {
                      const curl = `curl --request GET \\\n  --url https://sandbox.apihub.citi.com/gcb/api/v1/cards \\\n  --header 'Accept: application/json' \\\n  --header 'Authorization: Bearer ${bearerToken}' \\\n  --header 'client_id: ${clientId}' \\\n  --header 'uuid: ${uuid}'`;
                      navigator.clipboard.writeText(curl);
                    }}
                    className="text-[9px] font-bold text-indigo-400 hover:text-white transition-colors"
                  >
                    Copy cURL
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap break-all bg-[#080B10] p-3 rounded-lg border border-[#30363D]/50 flex-1">
                  {`curl --request GET \\\n  --url https://sandbox.apihub.citi.com/gcb/api/v1/cards \\\n  --header 'Accept: application/json' \\\n  --header 'Authorization: Bearer ${bearerToken}' \\\n  --header 'client_id: ${clientId}' \\\n  --header 'uuid: ${uuid}'`}
                </pre>
              </div>
            </div>
          </div>

          {/* Card Mockup Visual */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-tr from-[#001D3D] via-[#003566] to-[#000814] border border-[#0072CE]/60 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm tracking-wider text-[#58A6FF]">CITI PRESTIGE CORPORATE</span>
              <Building2 className="w-6 h-6 text-slate-300" />
            </div>

            <div className="space-y-1 my-4">
              <p className="text-lg font-mono tracking-widest text-slate-100">•••• •••• •••• 2910</p>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>EXP: 09/29</span>
                <span>CVV: •••</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
              <div>
                <p className="text-[9px] text-slate-400 uppercase">Cardholder</p>
                <p className="font-bold font-mono">ENTERPRISE TREASURY AU</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 uppercase">Rewards Points</p>
                <p className="font-bold text-amber-400 font-mono">485,200 PTS</p>
              </div>
            </div>
          </div>

          {/* Limits & Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D]">
              <p className="text-[10px] uppercase font-bold text-[#8B949E]">Credit Limit</p>
              <p className="text-base font-bold font-mono text-white mt-1">$150,000.00 AUD</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D]">
              <p className="text-[10px] uppercase font-bold text-[#8B949E]">Available Credit</p>
              <p className="text-base font-bold font-mono text-emerald-400 mt-1">$128,450.20 AUD</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D]">
              <p className="text-[10px] uppercase font-bold text-[#8B949E]">Current Outstanding</p>
              <p className="text-base font-bold font-mono text-blue-400 mt-1">$21,549.80 AUD</p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: PayID & Fast Transfers */}
      {activeSubTab === 'transfers' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-6">
          <div className="border-b border-[#30363D] pb-4">
            <h3 className="text-sm font-bold text-white">NPP PayID Fast Payments & Money Movement</h3>
            <p className="text-xs text-[#8B949E]">
              Execute real-time Australian New Payments Platform (NPP) PayID transactions with autonomous QuickBooks Chart of Accounts sync
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#8B949E] block mb-1">Transfer Amount (AUD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-[#8B949E]">$</span>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-[#0072CE] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8B949E] block mb-1">Payee Name</label>
              <input
                type="text"
                value={transferPayee}
                onChange={(e) => setTransferPayee(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs focus:border-[#0072CE] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8B949E] block mb-1">Payee PayID (Email / Phone / ABN)</label>
              <input
                type="text"
                value={transferPayId}
                onChange={(e) => setTransferPayId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-[#0072CE] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8B949E] block mb-1">Payment Reference / Description</label>
              <input
                type="text"
                value={transferDesc}
                onChange={(e) => setTransferDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs focus:border-[#0072CE] outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleExecuteTransfer}
            disabled={transferLoading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-[#0072CE] hover:bg-[#005fa3] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Send className={`w-4 h-4 ${transferLoading ? 'animate-spin' : ''}`} />
            <span>{transferLoading ? 'Processing PayID Transfer...' : 'Initiate PayID Transfer & Bridge to QuickBooks'}</span>
          </button>

          {transferResult && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>NPP PayID Fast Payment Settled & Synced to QuickBooks</span>
              </div>
              <pre className="p-3 rounded-lg bg-[#0D1117] text-emerald-300 font-mono text-[11px] whitespace-pre-wrap break-all">
                {JSON.stringify(transferResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab: Azure Arc Connected Machine Agent (james-rg) */}
      {activeSubTab === 'azure-arc' && (
        <div className="space-y-6">
          {/* Main Script Card */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Azure Arc Connected Machine Agent Onboarding Script
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono font-bold">
                      james-rg / eastus
                    </span>
                  </div>
                  <p className="text-xs text-[#8B949E]">
                    Pre-configured hybrid onboarding with Automanage & Citibank Control Account Datacenter Tags
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* OS Toggle */}
                <div className="flex items-center bg-[#0D1117] border border-[#30363D] rounded-lg p-0.5 mr-2">
                  <button
                    onClick={() => setArcOs('linux')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      arcOs === 'linux' ? 'bg-blue-600 text-white' : 'text-[#8B949E] hover:text-white'
                    }`}
                  >
                    🐧 Linux (Bash)
                  </button>
                  <button
                    onClick={() => setArcOs('windows')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      arcOs === 'windows' ? 'bg-blue-600 text-white' : 'text-[#8B949E] hover:text-white'
                    }`}
                  >
                    🪟 Windows (PS1)
                  </button>
                </div>

                <button
                  onClick={() => {
                    const bashScript = `export subscriptionId="0001726b-15a4-4c12-b0d0-16971405fa7d";
export resourceGroup="james-rg";
export tenantId="6666f090-016a-494b-b11a-4d3e01febe95";
export location="eastus";
export authType="token";
export correlationId="176a1b5b-86ef-4921-8fa5-4d4b4225c9f1";
export cloud="AzureCloud";
output=$(wget https://aka.ms/azcmagent -O ~/install_linux_azcmagent.sh 2>&1);
if [ $? != 0 ]; then wget -qO- --method=PUT --body-data="{\\"subscriptionId\\":\\"$subscriptionId\\",\\"resourceGroup\\":\\"$resourceGroup\\",\\"tenantId\\":\\"$tenantId\\",\\"location\\":\\"$location\\",\\"correlationId\\":\\"$correlationId\\",\\"authType\\":\\"$authType\\",\\"operation\\":\\"onboarding\\",\\"messageType\\":\\"DownloadScriptFailed\\",\\"message\\":\\"$output\\"}" "https://gbl.his.arc.azure.com/log" &> /dev/null || true; fi;
echo "$output";
bash ~/install_linux_azcmagent.sh;
sudo azcmagent connect --resource-group "$resourceGroup" --tenant-id "$tenantId" --location "$location" --subscription-id "$subscriptionId" --cloud "$cloud" --tags "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'" --automanage-profile "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction" --correlation-id "$correlationId";`;

                    const psScript = `try {
    $env:SUBSCRIPTION_ID = "0001726b-15a4-4c12-b0d0-16971405fa7d";
    $env:RESOURCE_GROUP = "james-rg";
    $env:TENANT_ID = "6666f090-016a-494b-b11a-4d3e01febe95";
    $env:LOCATION = "eastus";
    $env:AUTH_TYPE = "token";
    $env:CORRELATION_ID = "176a1b5b-86ef-4921-8fa5-4d4b4225c9f1";
    $env:CLOUD = "AzureCloud";
    

    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor 3072;

    # Download the installation package
    Invoke-WebRequest -UseBasicParsing -Uri "https://aka.ms/azcmagent-windows" -TimeoutSec 30 -OutFile "$env:TEMP\\install_windows_azcmagent.ps1";

    # Install the hybrid agent
    & "$env:TEMP\\install_windows_azcmagent.ps1";
    if ($LASTEXITCODE -ne 0) { exit 1; }

    # Run connect command
    & "$env:ProgramW6432\\AzureConnectedMachineAgent\\azcmagent.exe" connect --resource-group "$env:RESOURCE_GROUP" --tenant-id "$env:TENANT_ID" --location "$env:LOCATION" --subscription-id "$env:SUBSCRIPTION_ID" --cloud "$env:CLOUD" --tags "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'" --automanage-profile "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction" --correlation-id "$env:CORRELATION_ID";
}
catch {
    $logBody = @{subscriptionId="$env:SUBSCRIPTION_ID";resourceGroup="$env:RESOURCE_GROUP";tenantId="$env:TENANT_ID";location="$env:LOCATION";correlationId="$env:CORRELATION_ID";authType="$env:AUTH_TYPE";operation="onboarding";messageType=$_.FullyQualifiedErrorId;message="$_";};
    Invoke-WebRequest -UseBasicParsing -Uri "https://gbl.his.arc.azure.com/log" -Method "PUT" -Body ($logBody | ConvertTo-Json) | out-null;
    Write-Host  -ForegroundColor red $_.Exception;
}`;

                    const selected = arcOs === 'linux' ? bashScript : psScript;
                    navigator.clipboard.writeText(selected);
                    setCopiedArcScript(true);
                    setTimeout(() => setCopiedArcScript(false), 2000);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 text-xs font-bold transition-all shadow-sm"
                >
                  {copiedArcScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedArcScript ? 'Copied!' : arcOs === 'linux' ? 'Copy Bash Script' : 'Copy PowerShell'}</span>
                </button>

                <a
                  href={arcOs === 'linux' ? '/api/azure/arc/download/bash' : '/api/azure/arc/download/powershell'}
                  download={arcOs === 'linux' ? 'install_linux_azcmagent.sh' : 'install_windows_azcmagent.ps1'}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-white border border-[#30363D] text-xs font-bold transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download {arcOs === 'linux' ? '.sh' : '.ps1'}</span>
                </a>
              </div>
            </div>

            {/* Hardcoded Parameters Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                <p className="text-[10px] text-[#8B949E] uppercase font-mono">Resource Group</p>
                <p className="text-xs font-bold font-mono text-emerald-400">james-rg</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                <p className="text-[10px] text-[#8B949E] uppercase font-mono">Location</p>
                <p className="text-xs font-bold font-mono text-blue-400">eastus</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                <p className="text-[10px] text-[#8B949E] uppercase font-mono">Correlation ID</p>
                <p className="text-xs font-bold font-mono text-purple-400 truncate" title="176a1b5b-86ef-4921-8fa5-4d4b4225c9f1">176a1b5b-86ef...</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                <p className="text-[10px] text-[#8B949E] uppercase font-mono">Datacenter Tag</p>
                <p className="text-xs font-bold font-mono text-amber-400 truncate" title="James@citibankdemobusiness.com">James@citibankdemobusiness.com</p>
              </div>
            </div>

            {/* Code Display */}
            <div className="relative">
              <pre className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner max-h-96">
{arcOs === 'linux' ? `export subscriptionId="0001726b-15a4-4c12-b0d0-16971405fa7d";
export resourceGroup="james-rg";
export tenantId="6666f090-016a-494b-b11a-4d3e01febe95";
export location="eastus";
export authType="token";
export correlationId="176a1b5b-86ef-4921-8fa5-4d4b4225c9f1";
export cloud="AzureCloud";
output=$(wget https://aka.ms/azcmagent -O ~/install_linux_azcmagent.sh 2>&1);
if [ $? != 0 ]; then wget -qO- --method=PUT --body-data="{\\"subscriptionId\\":\\"$subscriptionId\\",\\"resourceGroup\\":\\"$resourceGroup\\",\\"tenantId\\":\\"$tenantId\\",\\"location\\":\\"$location\\",\\"correlationId\\":\\"$correlationId\\",\\"authType\\":\\"$authType\\",\\"operation\\":\\"onboarding\\",\\"messageType\\":\\"DownloadScriptFailed\\",\\"message\\":\\"$output\\"}" "https://gbl.his.arc.azure.com/log" &> /dev/null || true; fi;
echo "$output";
bash ~/install_linux_azcmagent.sh;
sudo azcmagent connect --resource-group "$resourceGroup" --tenant-id "$tenantId" --location "$location" --subscription-id "$subscriptionId" --cloud "$cloud" --tags "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'" --automanage-profile "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction" --correlation-id "$correlationId";`
: `try {
    $env:SUBSCRIPTION_ID = "0001726b-15a4-4c12-b0d0-16971405fa7d";
    $env:RESOURCE_GROUP = "james-rg";
    $env:TENANT_ID = "6666f090-016a-494b-b11a-4d3e01febe95";
    $env:LOCATION = "eastus";
    $env:AUTH_TYPE = "token";
    $env:CORRELATION_ID = "176a1b5b-86ef-4921-8fa5-4d4b4225c9f1";
    $env:CLOUD = "AzureCloud";
    

    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor 3072;

    # Download the installation package
    Invoke-WebRequest -UseBasicParsing -Uri "https://aka.ms/azcmagent-windows" -TimeoutSec 30 -OutFile "$env:TEMP\\install_windows_azcmagent.ps1";

    # Install the hybrid agent
    & "$env:TEMP\\install_windows_azcmagent.ps1";
    if ($LASTEXITCODE -ne 0) { exit 1; }

    # Run connect command
    & "$env:ProgramW6432\\AzureConnectedMachineAgent\\azcmagent.exe" connect --resource-group "$env:RESOURCE_GROUP" --tenant-id "$env:TENANT_ID" --location "$env:LOCATION" --subscription-id "$env:SUBSCRIPTION_ID" --cloud "$env:CLOUD" --tags "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'" --automanage-profile "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction" --correlation-id "$env:CORRELATION_ID";
}
catch {
    $logBody = @{subscriptionId="$env:SUBSCRIPTION_ID";resourceGroup="$env:RESOURCE_GROUP";tenantId="$env:TENANT_ID";location="$env:LOCATION";correlationId="$env:CORRELATION_ID";authType="$env:AUTH_TYPE";operation="onboarding";messageType=$_.FullyQualifiedErrorId;message="$_";};
    Invoke-WebRequest -UseBasicParsing -Uri "https://gbl.his.arc.azure.com/log" -Method "PUT" -Body ($logBody | ConvertTo-Json) | out-null;
    Write-Host  -ForegroundColor red $_.Exception;
}`}
              </pre>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={async () => {
                    setArcLoading(true);
                    try {
                      const res = await apiFetch<any>('/api/azure/arc/onboard', {
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({
                          machineName: 'WIN-SRV-CITI-JAMES01',
                          operatingSystem: 'Windows Server 2022 Datacenter',
                        }),
                      });
                      if (res.ok && res.data) {
                        setArcResult(res.data);
                      }
                    } catch (e: any) {
                      setArcResult({ error: e.message });
                    } finally {
                      setArcLoading(false);
                    }
                  }}
                  disabled={arcLoading}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  <Server className={`w-4 h-4 ${arcLoading ? 'animate-spin' : ''}`} />
                  <span>{arcLoading ? 'Connecting Azure Arc Agent...' : 'Simulate Connect & Lock to QuickBooks'}</span>
                </button>

                <button
                  onClick={async () => {
                    try {
                      const res = await apiFetch<any>('/api/azure/arc/log-telemetry', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: 'Telemetry ping test from Citi console' }),
                      });
                      if (res.ok && res.data) {
                        alert('Telemetry forwarded to ' + res.data.forwardedTo);
                      }
                    } catch (e: any) {
                      alert('Telemetry ping notice: ' + e.message);
                    }
                  }}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-slate-300 text-xs font-semibold border border-[#30363D] transition-all"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Telemetry Ping</span>
                </button>
              </div>

              <div className="text-[11px] text-[#8B949E] flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>TLS 1.2+ Enforced ([Net.ServicePointManager] Protocol 3072)</span>
              </div>
            </div>

            {/* Execution Result */}
            {arcResult && (
              <div className="p-4 rounded-xl bg-[#0D1117] border border-blue-500/40 space-y-2 mt-3">
                <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Azure Arc Hybrid Machine Onboarding Event</span>
                </div>
                <pre className="p-3 rounded-lg bg-[#161B22] text-slate-200 font-mono text-[11px] whitespace-pre-wrap break-all">
                  {JSON.stringify(arcResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

            {/* EMEA Credit Applications */}
      {activeSubTab === 'credit-app' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">EMEA Credit Applications API</h3>
                <p className="text-xs text-[#8B949E]">
                  Create and submit credit applications securely to the live Sandbox via Citi OpenAPI. 
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#0072CE]/10 text-[#58A6FF]">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Bearer Token (Authorization)
                </label>
                <input
                  type="text"
                  value={creditAppToken}
                  onChange={(e) => setCreditAppToken(e.target.value)}
                  placeholder="Leave blank to use CITI_BEARER_TOKEN from .env"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#58A6FF] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Application Payload (JSON)
                </label>
                <textarea
                  value={creditAppPayload}
                  onChange={(e) => setCreditAppPayload(e.target.value)}
                  rows={15}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-slate-200 text-[11px] focus:outline-none focus:border-[#58A6FF] transition-all font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    setCreditAppLoading(true);
                    setCreditAppResult(null);
                    try {
                      const res = await apiFetch('/api/citi/onboarding/applications', {
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': creditAppToken 
                        },
                        body: creditAppPayload,
                      });
                      setCreditAppResult(res);
                    } catch (e: any) {
                      setCreditAppResult({ success: false, error: e.message });
                    } finally {
                      setCreditAppLoading(false);
                    }
                  }}
                  disabled={creditAppLoading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creditAppLoading ? (
                    <Activity className="w-4 h-4 animate-spin" />
                  ) : (
                    <Briefcase className="w-4 h-4" />
                  )}
                  <span>{creditAppLoading ? 'Submitting Application...' : 'Submit EMEA Credit Application'}</span>
                </button>
              </div>

              {creditAppResult && (
                <div className="mt-4 p-4 rounded-xl bg-[#0D1117] border border-blue-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
                      {creditAppResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Activity className="w-4 h-4 text-rose-400" />
                      )}
                      <span className={creditAppResult.success ? "text-emerald-400" : "text-rose-400"}>
                        {creditAppResult.success ? 'Application Accepted' : 'Application Failed'}
                      </span>
                    </div>
                  </div>
                  <pre className="p-3 rounded-lg bg-[#161B22] text-slate-200 font-mono text-[11px] whitespace-pre-wrap break-all">
                    {JSON.stringify(creditAppResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4 mt-6">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Accept Credit Offer</h3>
                <p className="text-xs text-[#8B949E]">
                  Accept an offer for a successfully submitted application.
                </p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Application ID
                </label>
                <input
                  type="text"
                  value={offerAppId}
                  onChange={(e) => setOfferAppId(e.target.value)}
                  placeholder="e.g. ZOW9IO793859"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#58A6FF] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Offer Acceptance Payload (JSON)
                </label>
                <textarea
                  value={offerAcceptPayload}
                  onChange={(e) => setOfferAcceptPayload(e.target.value)}
                  rows={15}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-slate-200 text-[11px] focus:outline-none focus:border-[#58A6FF] transition-all font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    setOfferAcceptLoading(true);
                    setOfferAcceptResult(null);
                    try {
                      const res = await apiFetch(`/api/citi/onboarding/applications/${offerAppId}/offerAcceptance`, {
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': creditAppToken 
                        },
                        body: offerAcceptPayload,
                      });
                      setOfferAcceptResult(res);
                    } catch (e: any) {
                      setOfferAcceptResult({ success: false, error: e.message });
                    } finally {
                      setOfferAcceptLoading(false);
                    }
                  }}
                  disabled={offerAcceptLoading || !offerAppId.trim()}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {offerAcceptLoading ? (
                    <Activity className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{offerAcceptLoading ? 'Accepting Offer...' : 'Accept Application Offer'}</span>
                </button>
              </div>

              {offerAcceptResult && (
                <div className="mt-4 p-4 rounded-xl bg-[#0D1117] border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                      {offerAcceptResult.success ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Activity className="w-4 h-4 text-rose-400" />
                      )}
                      <span className={offerAcceptResult.success ? "text-emerald-400" : "text-rose-400"}>
                        {offerAcceptResult.success ? 'Offer Successfully Accepted' : 'Offer Acceptance Failed'}
                      </span>
                    </div>
                  </div>
                  <pre className="p-3 rounded-lg bg-[#161B22] text-slate-200 font-mono text-[11px] whitespace-pre-wrap break-all">
                    {JSON.stringify(offerAcceptResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Summary (TLS v1) */}
      {activeSubTab === 'account-summary' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Citi Global Account Summary (TLS v1)</h3>
                <p className="text-xs text-[#8B949E]">
                  Consolidated view of Checking, Savings, Investments, and Liabilities across Citi GCB.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchAccountSummary}
                  disabled={accountSummaryLoading}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#0072CE] hover:bg-[#005fa3] text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${accountSummaryLoading ? 'animate-spin' : ''}`} />
                  <span>{accountSummaryLoading ? 'Fetching...' : 'Fetch Account Summary'}</span>
                </button>
              </div>
            </div>

            {!accountSummary && !accountSummaryLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="p-4 rounded-full bg-[#0D1117] border border-[#30363D]">
                  <Activity className="w-8 h-8 text-[#8B949E]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">No Summary Loaded</p>
                  <p className="text-xs text-[#8B949E] max-w-xs mx-auto">
                    Click the button above to execute a real API call to the Citi Sandbox Account Summary endpoint.
                  </p>
                </div>
              </div>
            )}

            {accountSummaryLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-[#0072CE]/20 border-t-[#0072CE] rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-[#58A6FF] animate-pulse">Communicating with Citi API Hub...</p>
              </div>
            )}

            {accountSummary && (
              <div className="space-y-6">
                {/* Modern Treasury Sync Status */}
                {mtSyncResult && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Modern Treasury Ledger Synchronized</h4>
                        <p className="text-[10px] text-emerald-400/80">
                          {mtSyncResult.length} accounts mapped to Modern Treasury Ledger Accounts
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={onNavigateToBridge}
                      className="text-[10px] font-bold text-emerald-400 hover:text-white underline underline-offset-4"
                    >
                      View in Ledger
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {accountSummary.accountSummary?.map((group: any, idx: number) => {
                    const accounts = [
                      ...(group.checking || []),
                      ...(group.savings || []),
                      ...(group.investments || []),
                      ...(group.custody || []),
                      ...(group.loans || [])
                    ];
                    
                    if (accounts.length === 0) return null;

                    return (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center space-x-2 px-1">
                          <h4 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">{group.accountGroup}</h4>
                          <div className="h-px flex-1 bg-[#30363D]"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {accounts.map((acct: any) => (
                            <div key={acct.accountId} className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 hover:border-[#0072CE]/40 transition-all group">
                              <div className="flex items-start justify-between mb-3">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <p className="text-sm font-bold text-white">{acct.accountName || acct.accountDescription}</p>
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#161B22] border border-[#30363D] text-[#8B949E]">
                                      {acct.accountType}
                                    </span>
                                  </div>
                                  <p className="text-xs font-mono text-[#8B949E]">{acct.displayAccountNumber}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold font-mono text-emerald-400">
                                    {acct.balances?.availableBalance?.currencyBasedValue?.baseAmount?.toLocaleString('en-US', { style: 'currency', currency: acct.accountBaseCurrencyCode || 'USD' })}
                                  </p>
                                  <p className="text-[10px] text-[#8B949E] uppercase">Available</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#30363D]">
                                <div>
                                  <p className="text-[9px] text-[#8B949E] uppercase font-bold">Product Code</p>
                                  <p className="text-[11px] font-mono text-white">{acct.productCode}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-[#8B949E] uppercase font-bold">Opened</p>
                                  <p className="text-[11px] font-mono text-white">{acct.accountOpenDate ? new Date(acct.accountOpenDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Raw Inspector */}
                <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] font-bold text-[#8B949E] uppercase">Raw API Response Inspector</h5>
                    <span className="text-[9px] font-mono text-[#58A6FF]">UUID: 686a96a8-0a1b-4ea7-a67a-7832daf9e633</span>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto max-h-60 bg-[#080B10] p-3 rounded-lg border border-[#30363D]/50">
                    {JSON.stringify(accountSummary, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Multi-Language Code Generation */}
      {activeSubTab === 'code-gen' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-[#58A6FF]" />
              <h3 className="text-sm font-bold text-white">Citi GCB Token Request Code Snippets</h3>
            </div>

            <div className="flex items-center space-x-1.5">
              {(['curl', 'nodejs', 'python', 'csharp', 'go'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCodeLang(lang)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    codeLang === lang
                      ? 'bg-[#0072CE] text-white shadow-sm'
                      : 'bg-[#0D1117] text-[#8B949E] hover:text-white border border-[#30363D]'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
              {getCodeSnippet()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

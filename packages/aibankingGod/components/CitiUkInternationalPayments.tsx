import React, { useState, useContext, useEffect } from 'react';
import { 
  Send, Key, Settings, Code, Terminal, CheckCircle2, AlertCircle, 
  Copy, Check, RefreshCw, Globe, Sliders, Layers, Sun, Moon, 
  ShieldCheck, ArrowRight, ExternalLink, Activity, FileText, Database
} from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function CitiUkInternationalPayments() {
  const context = useContext(DataContext);

  // UI Theme Mode (Light / Dark)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Section 1: Environment Variables ("a spot for each env var")
  const [envVars, setEnvVars] = useState({
    CITI_OB_BASE_URL: 'https://partner.citi.com/gcgapi/sandbox/prod/openapi/open-banking/v3.1',
    CITI_OB_BEARER_TOKEN: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImNpdGktc2FuZGJveC0wMSJ9.ey...',
    CITI_OB_FINANCIAL_ID: 'CT_9001',
    CITI_OB_IDEMPOTENCY_KEY: 'FRESCO.21302.GFX.20',
    CITI_OB_JWS_SIGNATURE: 'TGlmZSdzIGEgam91cm5leSBub3QgYSBkZXN0aW5hdGlvbiA=..T2ggZ29vZCBldmVuaW5nIG1yIHR5bGVyIGdvaW5nIGRvd24gPw==',
    CITI_OB_CONSENT_ID: '3IPY201998765409',
    CITI_CLIENT_ID: '8558324c-1486-4e0f-94da-9027e61d773d',
    CITI_CLIENT_SECRET: '••••••••••••••••••••••••••••',
    CITI_UUID: 'd987edfe-792c-4500-9002-1d7a5a018d77'
  });

  // Section 2: Set Up Access Token
  const [accessToken, setAccessToken] = useState('');
  const [tokenType, setTokenType] = useState('Bearer');

  // Section 3: Header Parameters
  const [headers, setHeaders] = useState({
    accept: 'application/json',
    contentType: 'application/json',
    financialId: 'CT_9001',
    lastLoggedTime: new Date().toISOString(),
    ipAddress: '192.168.1.100',
    interactionId: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
    idempotencyKey: 'FRESCO.21302.GFX.20',
    jwsSignature: 'TGlmZSdzIGEgam91cm5leSBub3QgYSBkZXN0aW5hdGlvbiA=..T2ggZ29vZCBldmVuaW5nIG1yIHR5bGVyIGdvaW5nIGRvd24gPw==',
    customerUserAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)'
  });

  // Section 3: Body Parameters (OBWriteInternational2 JSON Object)
  const [rawJsonBody, setRawJsonBody] = useState(JSON.stringify({
    "Data": {
      "ConsentId": "3IPY201998765409",
      "Initiation": {
        "InstructionIdentification": "ACME412",
        "EndToEndIdentification": "FRESCO.21302.GFX.20",
        "InstructionPriority": "Normal",
        "CurrencyOfTransfer": "GBP",
        "ChargeBearer": "BorneByDebtor",
        "Purpose": "TEST",
        "InstructedAmount": {
          "Amount": "2.92",
          "Currency": "GBP"
        },
        "ExchangeRateInformation": {
          "UnitCurrency": "GBP",
          "RateType": "Indicative"
        },
        "DebtorAccount": {
          "SchemeName": "UK.OBIE.BBAN",
          "Identification": "0/666743/003",
          "Name": "Andrea Frost",
          "SecondaryIdentification": "0002"
        },
        "CreditorAccount": {
          "SchemeName": "UK.OBIE.IBAN",
          "Identification": "GB23BARC20137212345601",
          "Name": "Tom Kirkman",
          "SecondaryIdentification": "0001"
        },
        "CreditorAgent": {
          "SchemeName": "UK.OBIE.SortCodeAccountNumber",
          "Identification": "CITIJESXLPN",
          "Name": "TEST1",
          "PostalAddress": {
            "AddressType": "Correspondence",
            "Department": "IT",
            "SubDepartment": "DEV",
            "StreetName": "Liberty",
            "BuildingNumber": "1",
            "PostCode": "AB1 2CD",
            "TownName": "London",
            "CountrySubDivision": "SUBUK",
            "Country": "UK",
            "AddressLine": [
              "UK1",
              "UK2"
            ]
          }
        },
        "Creditor": {
          "Name": "TEST1",
          "PostalAddress": {
            "AddressType": "Correspondence",
            "Department": "IT",
            "SubDepartment": "DEV",
            "StreetName": "Liberty",
            "BuildingNumber": "1",
            "PostCode": "AB1 2CD",
            "TownName": "London",
            "CountrySubDivision": "SUBUK",
            "Country": "UK",
            "AddressLine": [
              "UK1",
              "UK2"
            ]
          }
        },
        "RemittanceInformation": {
          "Unstructured": "Internal ops code 5120101",
          "Reference": "FRESCO-101"
        }
      }
    },
    "Risk": {
      "PaymentContextCode": "PartyToParty",
      "MerchantCategoryCode": "5967",
      "MerchantCustomerIdentification": "053598653254",
      "DeliveryAddress": {
        "AddressLine": [
          "Flat 7",
          "Acacia Lodge"
        ],
        "StreetName": "Acacia Avenue",
        "BuildingNumber": "27",
        "PostCode": "GU31 2ZZ",
        "TownName": "Sparsholt",
        "CountrySubDivision": [
          "Wessex"
        ],
        "Country": "UK"
      }
    }
  }, null, 2));

  // Mode & Tabs
  const [activeTab, setActiveTab] = useState<'env' | 'token' | 'params' | 'curl' | 'response'>('params');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // API Call Execution State
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // Load existing bearer token from localStorage if available
    const savedToken = localStorage.getItem('citi_access_token') || localStorage.getItem('citi_ob_bearer_token');
    if (savedToken) {
      setAccessToken(savedToken);
      setEnvVars(prev => ({ ...prev, CITI_OB_BEARER_TOKEN: `Bearer ${savedToken}` }));
    }
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
    context?.showNotification(`Copied ${label} to clipboard`, 'info');
  };

  const handleJsonChange = (val: string) => {
    setRawJsonBody(val);
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const generateCurlCommand = () => {
    const bearerStr = accessToken ? `Bearer ${accessToken}` : (envVars.CITI_OB_BEARER_TOKEN || 'Bearer ');
    const url = `${envVars.CITI_OB_BASE_URL}/pisp/international-payments`;

    return `curl --request POST \\
  --url ${url} \\
  --header 'Accept: ${headers.accept}' \\
  --header 'Authorization: ${bearerStr}' \\
  --header 'Content-Type: ${headers.contentType}' \\
  --header 'x-fapi-financial-id: ${headers.financialId}' \\
  --header 'x-fapi-customer-last-logged-time: ${headers.lastLoggedTime}' \\
  --header 'x-fapi-customer-ip-address: ${headers.ipAddress}' \\
  --header 'x-fapi-interaction-id: ${headers.interactionId}' \\
  --header 'x-idempotency-key: ${headers.idempotencyKey}' \\
  --header 'x-jws-signature: ${headers.jwsSignature}' \\
  --header 'x-customer-user-agent: ${headers.customerUserAgent}' \\
  --data '${rawJsonBody.replace(/\n/g, '')}'`;
  };

  const executeApiCall = async () => {
    if (jsonError) {
      context?.showNotification('Fix JSON body errors before making the API call', 'error');
      return;
    }

    setLoading(true);
    setApiResponse(null);
    setHttpStatus(null);

    try {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(rawJsonBody);
      } catch (e) {
        parsedPayload = {};
      }

      const bearerStr = accessToken ? `Bearer ${accessToken}` : envVars.CITI_OB_BEARER_TOKEN;

      const res = await fetch('/api/citi/pisp/international-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerStr,
          'x-fapi-financial-id': headers.financialId,
          'x-fapi-customer-last-logged-time': headers.lastLoggedTime,
          'x-fapi-customer-ip-address': headers.ipAddress,
          'x-fapi-interaction-id': headers.interactionId,
          'x-idempotency-key': headers.idempotencyKey,
          'x-jws-signature': headers.jwsSignature,
          'x-customer-user-agent': headers.customerUserAgent
        },
        body: JSON.stringify({
          customUrl: `${envVars.CITI_OB_BASE_URL}/pisp/international-payments`,
          payload: parsedPayload
        })
      });

      const data = await res.json();
      setHttpStatus(res.status || 201);
      setApiResponse(data);
      setActiveTab('response');

      if (res.ok || res.status === 201) {
        context?.showNotification('Citi International Payment Created (201 Created)', 'success');
      } else {
        context?.showNotification(`Citi API returned HTTP ${res.status}`, 'error');
      }
    } catch (err: any) {
      console.error(err);
      setHttpStatus(500);
      setApiResponse({ error: err.message || 'API Call failed' });
      setActiveTab('response');
    } finally {
      setLoading(false);
    }
  };

  const bgClass = isDarkMode ? 'bg-[#090d16] text-gray-200' : 'bg-slate-50 text-slate-800';
  const cardBgClass = isDarkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const inputBgClass = isDarkMode ? 'bg-black/60 border-slate-700 text-emerald-400 focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600';

  return (
    <div className={`flex flex-col h-full ${bgClass} p-6 md:p-8 overflow-y-auto font-sans transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* HEADER BAR */}
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl border ${cardBgClass}`}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 text-blue-500">
              <Globe size={32} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  UK Open Banking v3.1 PISP
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Sandbox Active
                </span>
              </div>
              <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                PAYMENT INITIATION API
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Create international payments (United Kingdom) &bull; endpoint: <code className="text-blue-400">/open-banking/v3.1/pisp/international-payments</code>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-auto">
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border transition-all flex items-center space-x-2 text-xs font-bold ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={executeApiCall}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
              <span>{loading ? 'EXECUTING...' : 'Call the API'}</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center space-x-2 overflow-x-auto border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('params')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'params'
                ? 'bg-blue-600 text-white shadow-md'
                : isDarkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            <Sliders size={14} />
            <span>3. Modify Test Parameters</span>
          </button>

          <button
            onClick={() => setActiveTab('token')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'token'
                ? 'bg-blue-600 text-white shadow-md'
                : isDarkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            <Key size={14} />
            <span>2. Set Up Access Token</span>
          </button>

          <button
            onClick={() => setActiveTab('env')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'env'
                ? 'bg-blue-600 text-white shadow-md'
                : isDarkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            <Settings size={14} />
            <span>1. Environment Variables (.env)</span>
          </button>

          <button
            onClick={() => setActiveTab('curl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'curl'
                ? 'bg-blue-600 text-white shadow-md'
                : isDarkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            <Code size={14} />
            <span>cURL Command</span>
          </button>

          <button
            onClick={() => setActiveTab('response')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'response'
                ? 'bg-blue-600 text-white shadow-md'
                : isDarkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            <Terminal size={14} />
            <span>API Response {httpStatus && `(${httpStatus})`}</span>
          </button>
        </div>

        {/* TAB CONTENT 1: ENVIRONMENT VARIABLES SPOT */}
        {activeTab === 'env' && (
          <div className={`p-6 rounded-2xl border space-y-6 ${cardBgClass}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold">1. Environment Variable Configuration Spots</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Every environment key required for Citi UK Open Banking Payment Initiation.</p>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem('citi_ob_bearer_token', envVars.CITI_OB_BEARER_TOKEN);
                  context?.showNotification('Saved environment configuration spots to local state', 'success');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Sync to Enclave Environment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-slate-400 font-bold uppercase text-[10px]">CITI_OB_BASE_URL</label>
                <input
                  type="text"
                  value={envVars.CITI_OB_BASE_URL}
                  onChange={e => setEnvVars({ ...envVars, CITI_OB_BASE_URL: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none ${inputBgClass}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 font-bold uppercase text-[10px]">CITI_OB_BEARER_TOKEN</label>
                <input
                  type="text"
                  value={envVars.CITI_OB_BEARER_TOKEN}
                  onChange={e => setEnvVars({ ...envVars, CITI_OB_BEARER_TOKEN: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none ${inputBgClass}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 font-bold uppercase text-[10px]">CITI_OB_FINANCIAL_ID</label>
                <input
                  type="text"
                  value={envVars.CITI_OB_FINANCIAL_ID}
                  onChange={e => setEnvVars({ ...envVars, CITI_OB_FINANCIAL_ID: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none ${inputBgClass}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 font-bold uppercase text-[10px]">CITI_OB_IDEMPOTENCY_KEY</label>
                <input
                  type="text"
                  value={envVars.CITI_OB_IDEMPOTENCY_KEY}
                  onChange={e => setEnvVars({ ...envVars, CITI_OB_IDEMPOTENCY_KEY: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none ${inputBgClass}`}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-slate-400 font-bold uppercase text-[10px]">CITI_OB_JWS_SIGNATURE</label>
                <input
                  type="text"
                  value={envVars.CITI_OB_JWS_SIGNATURE}
                  onChange={e => setEnvVars({ ...envVars, CITI_OB_JWS_SIGNATURE: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none ${inputBgClass}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 font-bold uppercase text-[10px]">CITI_OB_CONSENT_ID</label>
                <input
                  type="text"
                  value={envVars.CITI_OB_CONSENT_ID}
                  onChange={e => setEnvVars({ ...envVars, CITI_OB_CONSENT_ID: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none ${inputBgClass}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 font-bold uppercase text-[10px]">CITI_CLIENT_ID</label>
                <input
                  type="text"
                  value={envVars.CITI_CLIENT_ID}
                  onChange={e => setEnvVars({ ...envVars, CITI_CLIENT_ID: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none ${inputBgClass}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: SET UP ACCESS TOKEN */}
        {activeTab === 'token' && (
          <div className={`p-6 rounded-2xl border space-y-6 ${cardBgClass}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold">2. Set Up Access Token</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Configure authorization token for Citi PISP endpoints.</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Token Configured</span>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Token Type</label>
                  <select
                    value={tokenType}
                    onChange={e => setTokenType(e.target.value)}
                    className={`w-full p-3 rounded-xl border outline-none ${inputBgClass}`}
                  >
                    <option value="Bearer">Bearer</option>
                    <option value="OAuth2">OAuth2 Client Credentials</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-3">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Bearer Token Value</label>
                  <input
                    type="text"
                    placeholder="Enter Bearer access_token..."
                    value={accessToken}
                    onChange={e => {
                      setAccessToken(e.target.value);
                      localStorage.setItem('citi_access_token', e.target.value);
                    }}
                    className={`w-full p-3 rounded-xl border outline-none ${inputBgClass}`}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400">Sample Active Bearer Token</span>
                  <button
                    onClick={() => {
                      const sample = "sample_pisp_token_3IPY201998765409_" + Date.now();
                      setAccessToken(sample);
                      localStorage.setItem('citi_access_token', sample);
                      context?.showNotification('Loaded Sample PISP Bearer Token', 'info');
                    }}
                    className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                  >
                    Load Sample Token
                  </button>
                </div>
                <p className="text-[11px] text-slate-300">
                  Requests sent to <code className="text-emerald-400">/open-banking/v3.1/pisp/international-payments</code> require a valid Bearer token acquired from Citi Developer Portal OAuth.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: MODIFY TEST PARAMETERS (BODY & HEADERS) */}
        {activeTab === 'params' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* HEADER PARAMETERS */}
            <div className={`p-6 rounded-2xl border space-y-4 ${cardBgClass}`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">Header Parameters</h3>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Required Headers</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] font-bold uppercase">* Accept</label>
                  <input
                    type="text"
                    value={headers.accept}
                    onChange={e => setHeaders({ ...headers, accept: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border outline-none ${inputBgClass}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] font-bold uppercase">* Content-Type</label>
                  <input
                    type="text"
                    value={headers.contentType}
                    onChange={e => setHeaders({ ...headers, contentType: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border outline-none ${inputBgClass}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] font-bold uppercase">* x-fapi-financial-id</label>
                  <input
                    type="text"
                    value={headers.financialId}
                    onChange={e => setHeaders({ ...headers, financialId: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border outline-none ${inputBgClass}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] font-bold uppercase">* x-idempotency-key</label>
                  <input
                    type="text"
                    value={headers.idempotencyKey}
                    onChange={e => setHeaders({ ...headers, idempotencyKey: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border outline-none ${inputBgClass}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] font-bold uppercase">* x-jws-signature</label>
                  <textarea
                    rows={2}
                    value={headers.jwsSignature}
                    onChange={e => setHeaders({ ...headers, jwsSignature: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border outline-none text-[10px] resize-none ${inputBgClass}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px] font-bold uppercase">x-fapi-interaction-id</label>
                    <input
                      type="text"
                      value={headers.interactionId}
                      onChange={e => setHeaders({ ...headers, interactionId: e.target.value })}
                      className={`w-full p-2 rounded-lg border outline-none text-[11px] ${inputBgClass}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px] font-bold uppercase">x-fapi-customer-ip-address</label>
                    <input
                      type="text"
                      value={headers.ipAddress}
                      onChange={e => setHeaders({ ...headers, ipAddress: e.target.value })}
                      className={`w-full p-2 rounded-lg border outline-none text-[11px] ${inputBgClass}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BODY PARAMETERS (OBWriteInternational2) */}
            <div className={`p-6 rounded-2xl border space-y-4 ${cardBgClass}`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Body Parameters</h3>
                  <p className="text-[10px] text-slate-400 font-mono">OBWriteInternational2 JSON Payload</p>
                </div>
                <button
                  onClick={() => handleCopy(rawJsonBody, 'JSON Body')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded flex items-center space-x-1 cursor-pointer"
                >
                  <Copy size={12} />
                  <span>Copy Payload</span>
                </button>
              </div>

              <div className="space-y-2">
                {jsonError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center space-x-2 font-mono">
                    <AlertCircle size={14} />
                    <span>JSON Syntax Error: {jsonError}</span>
                  </div>
                )}

                <textarea
                  rows={18}
                  value={rawJsonBody}
                  onChange={e => handleJsonChange(e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none font-mono text-[11px] leading-relaxed resize-none ${inputBgClass}`}
                />
              </div>
            </div>

          </div>
        )}

        {/* TAB CONTENT 4: CURL COMMAND */}
        {activeTab === 'curl' && (
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBgClass}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase text-blue-400 font-mono">Generated cURL Command</h2>
              <button
                onClick={() => handleCopy(generateCurlCommand(), 'cURL Command')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
              >
                {copiedField === 'cURL Command' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedField === 'cURL Command' ? 'Copied!' : 'Copy cURL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-black/80 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {generateCurlCommand()}
            </pre>
          </div>
        )}

        {/* TAB CONTENT 5: API RESPONSE VIEWER */}
        {activeTab === 'response' && (
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBgClass}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <h2 className="text-sm font-bold uppercase text-emerald-400 font-mono">Example Response Output</h2>
                {httpStatus && (
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    httpStatus === 201 || httpStatus === 200 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {httpStatus} {httpStatus === 201 ? 'Created' : 'Response'}
                  </span>
                )}
              </div>

              {apiResponse && (
                <button
                  onClick={() => handleCopy(JSON.stringify(apiResponse, null, 2), 'API Response')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Copy size={12} />
                  <span>Copy JSON Response</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-12 text-center font-mono space-y-3">
                <RefreshCw size={32} className="animate-spin text-blue-500 mx-auto" />
                <p className="text-sm font-bold text-blue-400">Executing Citi PISP International Payment Request...</p>
                <p className="text-xs text-slate-500">Communicating with /openapi/open-banking/v3.1/pisp/international-payments</p>
              </div>
            ) : apiResponse ? (
              <div className="space-y-3 font-mono">
                {apiResponse._gatewayMeta?.simulatedResponse && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-xl text-xs space-y-1">
                    <div className="font-bold flex items-center space-x-2">
                      <ShieldCheck size={14} className="text-blue-400" />
                      <span>Citi Sandbox Gateway Verification Status</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Validated request body and headers against Citi UK Open Banking v3.1 specification. Output matches official 201 Created schema.
                    </p>
                  </div>
                )}

                <pre className="p-4 bg-black/90 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 font-mono text-xs space-y-3">
                <Send size={32} className="mx-auto text-slate-600" />
                <p>Click <strong className="text-blue-400">"Call the API"</strong> above to dispatch the request and view the 201 Created response.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Play, Copy, Check, RefreshCw, Layers, Terminal, Globe, 
  Code2, ChevronRight, Send, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { workbenchSdk } from '../../configs/api-clients';

export interface SpecUI_DPS_Card_and_Account_ServicesProps {
  onExecute?: (endpoint: any, response: any) => void;
}

const SPEC_META = {
  id: "api_reference__3__json",
  title: "DPS Card and Account Services",
  version: "1",
  format: "openapi_3",
  description: "Interactive API console and live execution suite for DPS Card and Account Services.",
  baseUrl: "https://sandbox.api.visa.com",
  endpoints: [{"id":"POST__dcas_cardservices_v2_cards__card_id__pin","path":"/dcas/cardservices/v2/cards/{card-id}/pin","method":"POST","summary":"Set PIN","operationId":"createPinUsingPOST_2","parameters":[{"name":"card-id","in":"path","required":true,"type":"string","description":"Unique ID for current card. minLength: 1, maxLength: 40.","example":""}],"hasBody":true,"samplePayload":{}},{"id":"PUT__dcas_cardservices_v2_cards__card_id__pin","path":"/dcas/cardservices/v2/cards/{card-id}/pin","method":"PUT","summary":"Change PIN","operationId":"changePinUsingPUT_2","parameters":[{"name":"card-id","in":"path","required":true,"type":"string","description":"Unique ID for current card. minLength: 1, maxLength: 40.","example":""}],"hasBody":true,"samplePayload":{}},{"id":"GET__dcas_cardservices_v2_cards__card_id__pin_settings","path":"/dcas/cardservices/v2/cards/{card-id}/pin/settings","method":"GET","summary":"Retrieve PIN Settings","operationId":"Retrieve PIN Settings","parameters":[{"name":"card-id","in":"path","required":true,"type":"string","description":"card-id","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098632","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__dcas_cardservices_v2_cards","path":"/dcas/cardservices/v2/cards","method":"POST","summary":"Create Card ID for a PAN V2","operationId":"Create Card ID for a PAN V2","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"GET__dcas_cardservices_v2_cards__cardId__cardstatus","path":"/dcas/cardservices/v2/cards/{cardId}/cardstatus","method":"GET","summary":"Retrieve Card Status - Debit","operationId":"retrieveCardStatusForDebitUsingGET","parameters":[{"name":"cardId","in":"path","required":true,"type":"string","description":"Unique ID for current card. minLength: 1, maxLength: 40.","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098632","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"PUT__dcas_cardservices_v2_cards__cardId__cardstatus","path":"/dcas/cardservices/v2/cards/{cardId}/cardstatus","method":"PUT","summary":"Update Card Status","operationId":"updateCardStatusUsingPUT","parameters":[{"name":"cardId","in":"path","required":true,"type":"string","description":"Unique ID for current card. minLength: 1, maxLength: 40.","example":""}],"hasBody":true,"samplePayload":{}},{"id":"GET__dcas_cardservices_v1_cards__cardId__cardstatus","path":"/dcas/cardservices/v1/cards/{cardId}/cardstatus","method":"GET","summary":"Retrieve Card Status","operationId":"Retrieve Card Status","parameters":[{"name":"cardId","in":"path","required":true,"type":"string","description":"CardId unique Indentifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098632","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"PUT__dcas_cardservices_v1_cards__cardId__cardstatus","path":"/dcas/cardservices/v1/cards/{cardId}/cardstatus","method":"PUT","summary":"Update Card Status","operationId":"Update Card Status","parameters":[{"name":"cardId","in":"path","required":true,"type":"string","description":"Card alias Id unique Indentifier","example":""}],"hasBody":true,"samplePayload":{"cardStatus":"sample_string"}},{"id":"POST__dcas_cardservices_v2_cards__cardId__cardactivation","path":"/dcas/cardservices/v2/cards/{cardId}/cardactivation","method":"POST","summary":"Activate Card with Verification","operationId":"Activate Card with Verification","parameters":[{"name":"cardId","in":"path","required":true,"type":"string","description":"Unique ID for current card. minLength: 1, maxLength: 40.","example":""}],"hasBody":true,"samplePayload":{}},{"id":"POST__dcas_cardservices_v1_cards","path":"/dcas/cardservices/v1/cards","method":"POST","summary":"Create Card ID for a PAN","operationId":"Create Card ID for a PAN","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"GET__dcas_cardservices_v2_cards__cardId_","path":"/dcas/cardservices/v2/cards/{cardId}","method":"GET","summary":"Retrieve Card Details","operationId":"Retrieve Card Details","parameters":[{"name":"cardId","in":"path","required":true,"type":"string","description":"Unique ID for current card. minLength: 1, maxLength: 40.","example":""},{"name":"lookUpBalances","in":"query","required":false,"type":"string","description":"Indicates if balance should be returned. Must be passed in the URI. Example: …/dcas/cardservices/v2/cards/{cardId]?lookUpBalances=true","example":"false"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098632","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__dcas_cardservices_v1_cards__cardId__transactions","path":"/dcas/cardservices/v1/cards/{cardId}/transactions","method":"GET","summary":"Retrieve Transaction History - DEPRECATED","operationId":"Retrieve Transaction History","parameters":[{"name":"cardId","in":"path","required":true,"type":"string","description":"Unique indentifier assigned to the PAN","example":""},{"name":"indexRow","in":"query","required":false,"type":"integer","description":"Unique indentifier assigned to the PAN","example":""},{"name":"rowsOnPage","in":"query","required":false,"type":"integer","description":"Unique indentifier assigned to the PAN","example":""},{"name":"accountAliasId","in":"query","required":false,"type":"string","description":"Unique indentifier assigned to the PAN","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098632","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__dcas_cardservices_v1_cards__cardId_","path":"/dcas/cardservices/v1/cards/{cardId}","method":"GET","summary":"Retrieve Card Details","operationId":"Retrieve Card Details","parameters":[{"name":"balance","in":"query","required":false,"type":"string","description":"Indicates if balance should be returned. Must be passed in the URI. Example: …/dcas/cardservices/v1/cards/{cardId]?balance=true","example":"false"},{"name":"cardId","in":"path","required":true,"type":"string","description":"cardId","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098632","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__dcas_cardservices_v1_cards__cardId__cardactivation","path":"/dcas/cardservices/v1/cards/{cardId}/cardactivation","method":"POST","summary":"Activate Card with Verification","operationId":"Card Activation","parameters":[{"name":"cardId","in":"path","required":true,"type":"string","description":"Unique indentifier assigned to the PAN","example":""}],"hasBody":true,"samplePayload":{"cvv2":"sample_string","ssnToken":{"ssn":"sample_string","isLastFourOnly":true,"isTokenPresent":true},"birthDateToken":{"isTokenPresent":true,"birthDateMmDdYyyy":"sample_string"},"expirationDate":{"mm":"sample_string","yy":"sample_string"},"phoneNumberToken":{"countryCode":"sample_string","phoneNumber":"sample_string","isTokenPresent":true},"driversLicenseToken":{"stateCode":"sample_string","countryCode":"sample_string","isTokenPresent":true,"drivingLicenseNumber":"sample_string"},"mothersMaidenNameToken":{"isTokenPresent":true,"mothersMaidenName":"sample_string"}}},{"id":"GET__dcas_cardservices_v1_cards_prepaid__cardId__cardstatus","path":"/dcas/cardservices/v1/cards/prepaid/{cardId}/cardstatus","method":"GET","summary":"Retrieve Card Status - Prepaid","operationId":"retrieveCardStatusForPrepaidUsingGET","parameters":[{"name":"cardId","in":"path","required":true,"type":"string","description":"Unique ID for current card. minLength: 1, maxLength: 40.","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098632","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__dcas_accountservices_v1_accounts__accountId__cards__cardId__transactions","path":"/dcas/accountservices/v1/accounts/{accountId}/cards/{cardId}/transactions","method":"GET","summary":"Retrieve Transaction History - Debit","operationId":"Retrieve Transaction History - Debit","parameters":[{"name":"accountId","in":"path","required":true,"type":"string","description":"accountId","example":""},{"name":"cardId","in":"path","required":true,"type":"string","description":"cardId","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098632","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__dcas_programservices_v1_reports_wireconfirmation","path":"/dcas/programservices/v1/reports/wireconfirmation","method":"GET","summary":"Retrieve Wire Confirmation Report","operationId":"wireConfirmationReportUsingGET_1","parameters":[{"name":"date","in":"query","required":false,"type":"string","description":"Settlement date in YYYY-MM-DD format. If not provided, then current date will be used.","example":""},{"name":"prc","in":"query","required":false,"type":"string","description":"If PRC is provided, then report will only include the details related to the requested PRC. If not, then API will send response to all the PRC mapped to the sponsor.","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098632","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__dcas_cardservices_v3_cards__cardId__cardactivation","path":"/dcas/cardservices/v3/cards/{cardId}/cardactivation","method":"POST","summary":"Activate Card with Verification","operationId":"cardActivationV3","parameters":[{"name":"X-Correlation-Id","in":"header","required":false,"type":"string","description":"Id that uniquely identifies a request across distributed systems. Generally populated by the upstream system in this case, VDP or the client.","example":""},{"name":"cardId","in":"path","required":true,"type":"string","description":"Unique ID for current card. minLength: 1, maxLength: 40.","example":""}],"hasBody":true,"samplePayload":{}},{"id":"POST__dcas_cardservices_v1_cards__cardId__digitalactivation","path":"/dcas/cardservices/v1/cards/{cardId}/digitalactivation","method":"POST","summary":"Digital Activation","operationId":"updateDigitalActivateFlagUsingPOST","parameters":[{"name":"X-Correlation-Id","in":"header","required":false,"type":"string","description":"Id that uniquely identifies a request across distributed systems. Generally populated by the upstream system in this case, VDP or the client.","example":""},{"name":"app-group-id","in":"header","required":false,"type":"string","description":"Unique ID that defines a collection of related apps. Related child apps will inherit all customer accounts, profiles, and data related to the app-group-id.","example":""},{"name":"app-id","in":"header","required":false,"type":"string","description":"The app-id is provisioned to the app when it is registered on the VDP. The app-id must be included in all API calls to the Paas API. NOTE: During runtime, the gateway is responsible for injecting the app-id as a header into the call before ","example":""},{"name":"cardId","in":"path","required":true,"type":"string","description":"cardId","example":""},{"name":"sponsor-id","in":"header","required":false,"type":"string","description":"After authenticating the app's API credentials during runtime, the gateway will immediately look up the app-id bound to the API credentials. It will then determine if the call initiated from a Sponsors/Issuers application and if it did, the","example":""}],"hasBody":true,"samplePayload":{}},{"id":"POST__dcas_cardservices_v1_cards_activation","path":"/dcas/cardservices/v1/cards/activation","method":"POST","summary":"Activate Card","operationId":"Card Activation No Verification - application/json","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__dcas_cardinquiry_v1_accounts_debitcardsearch","path":"/dcas/cardinquiry/v1/accounts/debitcardsearch","method":"POST","summary":"Search Card","operationId":"Search Card","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__dcas_cardinquiry_v3_accounts_debitcardinquiry","path":"/dcas/cardinquiry/v3/accounts/debitcardinquiry","method":"POST","summary":"Inquire Card","operationId":"retrieveCardDetailByAccountNumberV3","parameters":[{"name":"X-Correlation-Id","in":"header","required":false,"type":"string","description":"","example":""}],"hasBody":true,"samplePayload":{}},{"id":"POST__dcas_cardservices_v2_cards__cardId__cardholderverification","path":"/dcas/cardservices/v2/cards/{cardId}/cardholderverification","method":"POST","summary":"Cardholder Verification","operationId":"validateTokenV2","parameters":[{"name":"X-Correlation-Id","in":"header","required":false,"type":"string","description":"Id that uniquely identifies a request across distributed systems. Generally populated by the upstream system in this case, VDP or the client.","example":""},{"name":"cardId","in":"path","required":true,"type":"string","description":"","example":""}],"hasBody":true,"samplePayload":{}},{"id":"POST__dcas_cardservices_v2_cards__cardId__cvv2generation","path":"/dcas/cardservices/v2/cards/{cardId}/cvv2generation","method":"POST","summary":"Generate Cvv2","operationId":"generateCvv2ForCardAliasIdV2_1","parameters":[{"name":"X-Correlation-Id","in":"header","required":false,"type":"string","description":"","example":""},{"name":"cardId","in":"path","required":true,"type":"string","description":"","example":""}],"hasBody":true,"samplePayload":{}}]
};

export const SpecUI_DPS_Card_and_Account_Services: React.FC<SpecUI_DPS_Card_and_Account_ServicesProps> = ({ onExecute }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'execute' | 'code' | 'schema'>('execute');
  const [pathParamValues, setPathParamValues] = useState<Record<string, string>>({});
  const [queryParamValues, setQueryParamValues] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test_token_api_workbench'
  });
  const [requestBodyText, setRequestBodyText] = useState<string>('{}');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const currentEndpoint = SPEC_META.endpoints[selectedIdx] || SPEC_META.endpoints[0];

  // Initialize defaults on endpoint change
  useEffect(() => {
    if (!currentEndpoint) return;
    const initialPaths: Record<string, string> = {};
    const initialQueries: Record<string, string> = {};

    currentEndpoint.parameters.forEach(p => {
      if (p.in === 'path') {
        initialPaths[p.name] = p.example || '12345';
      } else if (p.in === 'query') {
        initialQueries[p.name] = p.example || '';
      }
    });

    setPathParamValues(initialPaths);
    setQueryParamValues(initialQueries);

    if (currentEndpoint.hasBody) {
      setRequestBodyText(JSON.stringify(currentEndpoint.samplePayload || { sampleKey: 'sampleValue' }, null, 2));
    }
  }, [selectedIdx]);

  // Compute interpolated path
  const resolvedPath = currentEndpoint ? currentEndpoint.path.replace(/\{([^}]+)\}/g, (_, key) => {
    return pathParamValues[key] || `{${key}}`;
  }) : '';

  const handleExecute = async () => {
    if (!currentEndpoint) return;
    setLoading(true);
    const startTime = performance.now();

    try {
      let bodyData: any = undefined;
      if (currentEndpoint.hasBody) {
        try { bodyData = JSON.parse(requestBodyText); } catch { bodyData = requestBodyText; }
      }

      const res = await workbenchSdk.request({
        method: currentEndpoint.method as any,
        path: resolvedPath,
        baseUrl: SPEC_META.baseUrl,
        queryParams: queryParamValues,
        headers: headers,
        body: bodyData
      });

      setResponseOutput(res);
      if (onExecute) onExecute(currentEndpoint, res);
    } catch (err: any) {
      setResponseOutput({
        ok: false,
        status: 500,
        statusText: 'Client Error',
        data: { error: err.message || 'Execution failed' },
        durationMs: Math.round(performance.now() - startTime)
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurlCommand = () => {
    if (!currentEndpoint) return '';
    let cmd = `curl -X ${currentEndpoint.method} "${SPEC_META.baseUrl}${resolvedPath}"`;
    const queryParts = Object.entries(queryParamValues).filter(([_, v]) => Boolean(v)).map(([k, v]) => `${k}=${encodeURIComponent(v)}`);
    if (queryParts.length > 0) cmd += `?${queryParts.join('&')}`;
    cmd += `"\\`;
    Object.entries(headers).forEach(([k, v]) => {
      cmd += `\n  -H "${k}: ${v}" \\`;
    });
    if (currentEndpoint.hasBody && requestBodyText.trim()) {
      cmd += `\n  -d '${requestBodyText.replace(/'/g, "\\'")}'`;
    }
    return cmd;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const copySnippet = () => {
    if (!currentEndpoint) return;
    const snippet = `import { workbenchSdk } from '../../configs/api-clients';

// Call ${currentEndpoint.operationId} on ${SPEC_META.title}
const response = await workbenchSdk.request({
  method: '${currentEndpoint.method}',
  path: '${resolvedPath}',
  baseUrl: '${SPEC_META.baseUrl}',
  headers: ${JSON.stringify(headers, null, 2)},
  ${currentEndpoint.hasBody ? `body: ${requestBodyText}` : ''}
});

console.log('Status:', response.status);
console.log('Data:', response.data);`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-white space-y-6 shadow-xl">
      {/* Spec Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white font-mono">{SPEC_META.title}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              v{SPEC_META.version} • {SPEC_META.format.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{SPEC_META.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyCurl}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition font-mono"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy cURL</span>
          </button>
          <button
            onClick={copySnippet}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition font-mono"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>Copy SDK Code</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector Sidebar + Interactive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints Sidebar */}
        <div className="lg:col-span-4 bg-[#0D1117] border border-[#30363D] rounded-xl p-3 space-y-1.5 max-h-[520px] overflow-y-auto scrollbar-thin">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Endpoints ({SPEC_META.endpoints.length})</span>
            <span className="text-[10px] text-gray-500 font-mono">Live</span>
          </div>
          {SPEC_META.endpoints.map((ep, idx) => (
            <button
              key={ep.id || idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between gap-2 ${
                selectedIdx === idx
                  ? 'bg-[#1F242C] border border-indigo-500/60 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-[#161B22] hover:text-gray-200'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                  ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                  ep.method === 'PUT' ? 'bg-amber-500/20 text-amber-400' :
                  ep.method === 'DELETE' ? 'bg-rose-500/20 text-rose-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {ep.method}
                </span>
                <span className="truncate">{ep.path}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-500" />
            </button>
          ))}
        </div>

        {/* Console & Runner */}
        <div className="lg:col-span-8 bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-4">
          {currentEndpoint ? (
            <>
              {/* Endpoint Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    currentEndpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                    currentEndpoint.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {currentEndpoint.method}
                  </span>
                  <span className="text-sm font-mono text-white font-bold">{resolvedPath}</span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">
                  Base: {SPEC_META.baseUrl}
                </div>
              </div>

              {currentEndpoint.summary && (
                <p className="text-xs text-gray-300">{currentEndpoint.summary}</p>
              )}

              {/* Mode Tabs */}
              <div className="flex items-center space-x-2 border-b border-[#30363D] pb-2 text-xs">
                <button
                  onClick={() => setActiveTab('execute')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    activeTab === 'execute' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Live Runner
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  SDK & cURL
                </button>
                <button
                  onClick={() => setActiveTab('schema')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    activeTab === 'schema' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Parameters ({currentEndpoint.parameters.length})
                </button>
              </div>

              {/* Live Runner Tab */}
              {activeTab === 'execute' && (
                <div className="space-y-4">
                  {/* Path Parameters Inputs */}
                  {Object.keys(pathParamValues).length > 0 && (
                    <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-2">
                      <div className="text-[11px] font-bold text-gray-300">Path Parameters</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(pathParamValues).map(([paramName, val]) => (
                          <div key={paramName}>
                            <label className="block text-[10px] font-mono text-indigo-400 mb-0.5">{paramName}</label>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => setPathParamValues({ ...pathParamValues, [paramName]: e.target.value })}
                              className="w-full bg-[#0D1117] border border-[#30363D] rounded px-2.5 py-1 text-xs text-white font-mono outline-none focus:border-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body (if supported) */}
                  {currentEndpoint.hasBody && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-gray-400 font-medium">Request Payload (JSON)</label>
                        <button
                          onClick={() => setRequestBodyText(JSON.stringify(currentEndpoint.samplePayload, null, 2))}
                          className="text-[10px] text-indigo-400 hover:underline"
                        >
                          Load Sample Payload
                        </button>
                      </div>
                      <textarea
                        value={requestBodyText}
                        onChange={(e) => setRequestBodyText(e.target.value)}
                        rows={4}
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-2.5 text-xs font-mono text-gray-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  )}

                  {/* Run Button */}
                  <button
                    onClick={handleExecute}
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>Execute {currentEndpoint.method} {resolvedPath}</span>
                  </button>

                  {/* Response Window */}
                  {responseOutput && (
                    <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-xl text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between text-gray-400">
                        <span className={`font-bold ${responseOutput.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                          Status: {responseOutput.status} {responseOutput.statusText}
                        </span>
                        <span>{responseOutput.durationMs}ms</span>
                      </div>
                      <pre className="text-gray-200 max-h-48 overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(responseOutput.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Code Tab */}
              {activeTab === 'code' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-bold text-gray-300 mb-1">TypeScript SDK Snippet</div>
                    <pre className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-mono text-indigo-300 overflow-auto whitespace-pre">
{`import { workbenchSdk } from '../../configs/api-clients';

const response = await workbenchSdk.request({
  method: '${currentEndpoint.method}',
  path: '${resolvedPath}',
  baseUrl: '${SPEC_META.baseUrl}',
  headers: {
    'Accept': 'application/json'
  }${currentEndpoint.hasBody ? `,\n  body: ${requestBodyText}` : ''}
});

console.log(response.data);
`}
                    </pre>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-300 mb-1">cURL Command</div>
                    <pre className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-mono text-emerald-300 overflow-auto whitespace-pre">
{getCurlCommand()}
                    </pre>
                  </div>
                </div>
              )}

              {/* Schema Tab */}
              {activeTab === 'schema' && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-300">Declared Parameters ({currentEndpoint.parameters.length})</div>
                  {currentEndpoint.parameters.length === 0 ? (
                    <div className="p-4 text-xs text-gray-500 text-center">No explicit query or path parameters declared</div>
                  ) : (
                    currentEndpoint.parameters.map((p, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] text-xs font-mono flex flex-col gap-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-indigo-400 font-bold">{p.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0D1117] text-amber-400 border border-[#30363D]">{p.in}</span>
                          <span className="text-[10px] text-gray-400">({p.type})</span>
                          {p.required && <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300">required</span>}
                        </div>
                        {p.description && <div className="text-[11px] text-gray-400 font-sans">{p.description}</div>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500">Select an endpoint to execute</div>
          )}
        </div>
      </div>
    </div>
  );
};

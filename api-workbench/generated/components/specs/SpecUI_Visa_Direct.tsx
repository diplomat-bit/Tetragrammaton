import React, { useState, useEffect } from 'react';
import { 
  Play, Copy, Check, RefreshCw, Layers, Terminal, Globe, 
  Code2, ChevronRight, Send, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { workbenchSdk } from '../../configs/api-clients';

export interface SpecUI_Visa_DirectProps {
  onExecute?: (endpoint: any, response: any) => void;
}

const SPEC_META = {
  id: "api_reference_json",
  title: "Visa Direct",
  version: "1",
  format: "openapi_3",
  description: "Interactive API console and live execution suite for Visa Direct.",
  baseUrl: "https://sandbox.api.visa.com",
  endpoints: [{"id":"POST__visaaliasdirectory_v1_resolve","path":"/visaaliasdirectory/v1/resolve","method":"POST","summary":"Resolve","operationId":"Resolve","parameters":[{"name":"fields","in":"query","required":false,"type":"string","description":"Optional query parameter to select the list of fields to be sent in Resolve Response. Currently supports only primary/first level json attributes from AliasResolveResponse. Nested attributes are not supported.","example":"recipientName,recipientNameLocal,issuerName,cardType,country,postalCode"}],"hasBody":true,"samplePayload":{}},{"id":"POST__visaaliasdirectory_v1_aliasinquiry","path":"/visaaliasdirectory/v1/aliasinquiry","method":"POST","summary":"Alias Inquiry","operationId":"inquiry","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__visaaliasdirectory_v2_resolve","path":"/visaaliasdirectory/v2/resolve","method":"POST","summary":"Resolve V2","operationId":"Resolve V2","parameters":[{"name":"fields","in":"query","required":false,"type":"string","description":"Optional query parameter to select the list of fields to be sent in Resolve Response. Currently supports only primary/first level json attributes from AliasResolveResponse. Nested attributes are not supported.","example":"recipientName,recipientNameLocal,issuerName,cardType,country,postalCode"}],"hasBody":true,"samplePayload":{}},{"id":"POST__visaaliasdirectory_v1_manage_getalias","path":"/visaaliasdirectory/v1/manage/getalias","method":"POST","summary":"Get Alias","operationId":"Get Alias","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__visaaliasdirectory_v1_manage_updatealias","path":"/visaaliasdirectory/v1/manage/updatealias","method":"POST","summary":"Update Alias","operationId":"Update Alias","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__visaaliasdirectory_v1_manage_deletealias","path":"/visaaliasdirectory/v1/manage/deletealias","method":"POST","summary":"Delete Alias","operationId":"Delete Alias","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__visaaliasdirectory_v1_manage_createalias","path":"/visaaliasdirectory/v1/manage/createalias","method":"POST","summary":"Create Alias","operationId":"Create Alias","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__visadirect_mvisa_v1_mr","path":"/visadirect/mvisa/v1/mr","method":"POST","summary":"MerchandiseReturn POST","operationId":"createMerchandiseReturnTransaction","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"GET__visadirect_mvisa_v1_mrr__statusIdentifier_","path":"/visadirect/mvisa/v1/mrr/{statusIdentifier}","method":"GET","summary":"Merchandise Return Reversal GET","operationId":"readMerchandiseReturnReversalTransaction","parameters":[{"name":"statusIdentifier","in":"path","required":true,"type":"string","description":"Status Identifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__visadirect_mvisa_v1_mrr","path":"/visadirect/mvisa/v1/mrr","method":"POST","summary":"Merchandise Return Reversal POST","operationId":"createMerchandiseReturnReversalTransaction","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"GET__visadirect_mvisa_v1_mr__statusIdentifier_","path":"/visadirect/mvisa/v1/mr/{statusIdentifier}","method":"GET","summary":"Merchandise Return GET","operationId":"readMerchandiseReturnTransaction","parameters":[{"name":"statusIdentifier","in":"path","required":true,"type":"string","description":"Status Identifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__visadirect_reports_v1_transactiondata","path":"/visadirect/reports/v1/transactiondata","method":"GET","summary":"TransactionData","operationId":"TransactionData","parameters":[{"name":"fromDate","in":"query","required":true,"type":"string","description":"The beginning date. Example: 31032016 for 31st March 2016.","example":""},{"name":"toDate","in":"query","required":true,"type":"string","description":"The end date. Example: 03042016 for 3rd April 2016. Currently, only upto 5 days worth of data can be retrieved. Also, only the last 120 days of data can be searched from the current date.","example":""},{"name":"fields","in":"query","required":false,"type":"string","description":"Required additional fields. Example: Add fields like amountInTransactionCurrency, currencyConversionRate, reasonCodeValue, cardType, networkId, transactionStateCode, businessApplicationId, separated by comma.","example":""},{"name":"offset","in":"query","required":false,"type":"string","description":"This determines the page number for the pagination. Defalut is set to 1.","example":""},{"name":"limit","in":"query","required":false,"type":"string","description":"Total number of records that should be present in each page. Defalut is set to 100.","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__visadirect_mvisa_v1_merchantpushpayments__statusIdentifier_","path":"/visadirect/mvisa/v1/merchantpushpayments/{statusIdentifier}","method":"GET","summary":"MerchantPushPayments GET","operationId":"MerchantPushPayment GET","parameters":[{"name":"statusIdentifier","in":"path","required":true,"type":"string","description":"Status Identifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__visadirect_mvisa_v1_cashinpushpayments__statusIdentifier_","path":"/visadirect/mvisa/v1/cashinpushpayments/{statusIdentifier}","method":"GET","summary":"CashInPushPayments GET","operationId":"CashInPushPayments GET","parameters":[{"name":"statusIdentifier","in":"path","required":true,"type":"string","description":"Status Identifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__visadirect_mvisa_v1_cashoutpushpayments","path":"/visadirect/mvisa/v1/cashoutpushpayments","method":"POST","summary":"CashOutPushPayments POST","operationId":"CashOutPushPayments POST","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"GET__visadirect_mvisa_v1_cashoutpushpayments__statusIdentifier_","path":"/visadirect/mvisa/v1/cashoutpushpayments/{statusIdentifier}","method":"GET","summary":"CashOutPushPayments GET","operationId":"CashOutPayments GET","parameters":[{"name":"statusIdentifier","in":"path","required":true,"type":"string","description":"Status Identifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__visadirect_mvisa_v1_cashinpushpayments","path":"/visadirect/mvisa/v1/cashinpushpayments","method":"POST","summary":"CashInPushPayments POST","operationId":"CashInPushPayments POST","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__visadirect_mvisa_v1_merchantpushpayments","path":"/visadirect/mvisa/v1/merchantpushpayments","method":"POST","summary":"MerchantPushPayments POST","operationId":"postmerchantPushPaymentsPost","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__visadirect_v1_adjustment","path":"/visadirect/v1/adjustment","method":"POST","summary":"Create Adjustment Reverse Funds Transaction","operationId":"adjustFundsTransaction","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"GET__visadirect_v1_transactionquery","path":"/visadirect/v1/transactionquery","method":"GET","summary":"Transaction Query using GET","operationId":"transactionquery","parameters":[{"name":"acquiringBIN","in":"query","required":true,"type":"integer","description":"The Bank Identification Number (BIN) under which the Visa Direct solution is registered. This must match the information provided during enrollment. Note : A combination of acquiringBin with either transactionIdentifier or, stan along with ","example":""},{"name":"stan","in":"query","required":false,"type":"integer","description":"A number assigned by the message initiator that uniquely identifies a transaction. This is the same as systemsTraceAuditNumber previously sent in the request for the PullFunds, PushFunds or ReverseFunds transaction API calls. Note: When tra","example":""},{"name":"rrn","in":"query","required":false,"type":"string","description":"A value used to tie together service calls related to a single financial transaction. This is the same as retrievalReferenceNumber previously sent in the request for PullFunds, PushFunds or ReverseFunds transaction API calls. Note: When tra","example":""},{"name":"requestType","in":"query","required":false,"type":"string","description":"This parameter will contain the deferred OCT request type. 00 : (Not a deferred OCT). This value indicates that the request is not a deferred OCT. Visa will send this value to the recipient issuer in the request. This acts as the default va","example":""},{"name":"transactionIdentifier","in":"query","required":false,"type":"string","description":"The VisaNet reference number for the transaction. This is the same transactionIdentifier previously received in the response for PullFunds, PushFunds or ReverseFunds transaction API calls. Note: When stan and rrn parameters combination is n","example":""},{"name":"caid","in":"query","required":false,"type":"string","description":"An identifier for the card acceptor. This is the same as cardAcceptor.idCode previously sent in the request for PullFunds, PushFunds or ReverseFunds transaction API calls.","example":""},{"name":"transactionStartDate","in":"query","required":false,"type":"string","description":"The start date for querying the transaction. Can be in previous 120 day range including today's date. Start date cannot be later than End date.","example":""},{"name":"transactionEndDate","in":"query","required":false,"type":"string","description":"The end date for querying the transacton. Can be in previous 120 day range including today's date.","example":""},{"name":"fields","in":"query","required":false,"type":"string","description":"Comma separated list of additional fields requestor would like in response e.g. amount, responseCode, prepaidBalance, merchantVerificationValue, integratedCircuitCardData, transactionLinkIdentifier, persistentFX, settlementInfo, responseRea","example":""},{"name":"limit","in":"query","required":false,"type":"integer","description":"Number of records to return, if there are multiple records. Useful for pagination. e.g. if there are 29 records, limit=10 returns 10 records at a time Note: 1) If no limit parameter is specified, then max of 10 records will be returned by d","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__visadirect_fundstransfer_cancel","path":"/visadirect/fundstransfer/cancel","method":"POST","summary":"Create Cancel Deferred Push Funds Transaction","operationId":"createCancelDeferredPushFundsTransaction","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"GET__visadirect_fundstransfer_v1_pushfundstransactions__statusIdentifier_","path":"/visadirect/fundstransfer/v1/pushfundstransactions/{statusIdentifier}","method":"GET","summary":"Read Push Funds Transaction","operationId":"readPushFundsTransaction","parameters":[{"name":"statusIdentifier","in":"path","required":true,"type":"string","description":"Status Identifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__visadirect_fundstransfer_v1_pullfundstransactions","path":"/visadirect/fundstransfer/v1/pullfundstransactions","method":"POST","summary":"Create Pull Funds Transaction","operationId":"createPullFundsTransaction","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"GET__visadirect_fundstransfer_v1_pullfundstransactions__statusIdentifier_","path":"/visadirect/fundstransfer/v1/pullfundstransactions/{statusIdentifier}","method":"GET","summary":"Read Pull Funds Transaction","operationId":"readPullFundsTransaction","parameters":[{"name":"statusIdentifier","in":"path","required":true,"type":"string","description":"statusIdentifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__visadirect_fundstransfer_v1_reversefundstransactions__statusIdentifier_","path":"/visadirect/fundstransfer/v1/reversefundstransactions/{statusIdentifier}","method":"GET","summary":"Read Reverse Funds Transaction","operationId":"readReverseFundsTransaction","parameters":[{"name":"transaction-id","in":"path","required":true,"type":"string","description":"transaction-id","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__visadirect_fundstransfer_v1_pushfundstransactions","path":"/visadirect/fundstransfer/v1/pushfundstransactions","method":"POST","summary":"Create Push Funds Transaction","operationId":"createPushFundsTransaction","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__visadirect_fundstransfer_v1_reversefundstransactions","path":"/visadirect/fundstransfer/v1/reversefundstransactions","method":"POST","summary":"Create Reverse Funds Transaction","operationId":"createReverseFundsTransaction","parameters":[],"hasBody":true,"samplePayload":{}}]
};

export const SpecUI_Visa_Direct: React.FC<SpecUI_Visa_DirectProps> = ({ onExecute }) => {
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

import React, { useState, useEffect } from 'react';
import { 
  Play, Copy, Check, RefreshCw, Layers, Terminal, Globe, 
  Code2, ChevronRight, Send, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { workbenchSdk } from '../../configs/api-clients';

export interface SpecUI_Visa_PayProps {
  onExecute?: (endpoint: any, response: any) => void;
}

const SPEC_META = {
  id: "api_reference__12__json",
  title: "Visa Pay",
  version: "1",
  format: "openapi_3",
  description: "Interactive API console and live execution suite for Visa Pay.",
  baseUrl: "https://sandbox.api.visa.com",
  endpoints: [{"id":"PATCH__v1_enrollments__external_id_","path":"/v1/enrollments/{external-id}","method":"PATCH","summary":"Update Enrollment Data","operationId":"patch_/v1/enrollments/{external-id}","parameters":[{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type of the request/response","example":"application/json"},{"name":"x-tenant","in":"header","required":true,"type":"string","description":"Tenant ID","example":""},{"name":"externalId","in":"path","required":true,"type":"string","description":"External ID of the enrollment to be updated (wallet_account_id).","example":""},{"name":"programId","in":"query","required":true,"type":"string","description":"Program ID to which the enrollment belongs.","example":""}],"hasBody":true,"samplePayload":{}},{"id":"POST__passport_v2_s2s_access_token","path":"/passport/v2/s2s/access-token","method":"POST","summary":"Get Basic Authentication Access Token","operationId":"post-passport-v2-s2s-access-token","parameters":[],"hasBody":true,"samplePayload":{"account_id":123,"server_key":"5d8252ea2e6729223f30d477d79a5c3cb45f8e03","server_secret":"3$vKc)FCCfT;b%;_kPfaeq-zDG3vA=e&"}},{"id":"PATCH__v1_enrollments__external_Id__tokens__token_id__status","path":"/v1/enrollments/{external-Id}/tokens/{token-id}/status","method":"PATCH","summary":"Block and Unblock Token","operationId":"patch_/v1/enrollments/{external-Id}/tokens/{token-id}/status","parameters":[{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type of the request/response","example":"application/json"},{"name":"externalId","in":"path","required":true,"type":"string","description":"External ID of the enrollment to be retrieved (wallet_account_id).","example":""},{"name":"programId","in":"query","required":true,"type":"string","description":"Program identifier to which the enrollment belongs.","example":""},{"name":"token_id","in":"path","required":true,"type":"string","description":"Token ID","example":""}],"hasBody":true,"samplePayload":{"action":{},"update_reason":{"reason_code":{},"reason_desc":{}}}},{"id":"GET__pay_by_wallet_v1_enrollments__external_id_","path":"/pay-by-wallet/v1/enrollments/{external-id}","method":"GET","summary":"Get Visa Pay Account","operationId":"get_/pay-by-wallet/v1/enrollments/{external-id}","parameters":[{"name":"externalId","in":"path","required":true,"type":"string","description":"External ID of the enrollment to be retrieved (wallet_account_id).","example":""},{"name":"programId","in":"path","required":true,"type":"string","description":"Program ID to which the enrollment belongs.","example":""},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type of the request/response","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098648","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"PATCH__v1_enrollments__External_Id___status_","path":"/v1/enrollments/{External-Id}/{status}","method":"PATCH","summary":"Block and Unblock Account","operationId":"patch_/v1/enrollments/{External-Id}/{status}","parameters":[{"name":"externalId","in":"path","required":true,"type":"string","description":"External ID of the enrollment to be retrieved (wallet_account_id)","example":""},{"name":"programId","in":"query","required":true,"type":"string","description":"Program ID to which the enrollment belongs.","example":""},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type of the request/response","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__v1_enrollments__external_Id__replenish","path":"/v1/enrollments/{external-Id}/replenish","method":"POST","summary":"Replenish HCE Keys","operationId":"post_/v1/enrollments/{external-Id}/replenish","parameters":[{"name":"externalId","in":"path","required":true,"type":"string","description":"External ID of the enrollment (wallet_account_id)","example":""},{"name":"programId","in":"query","required":true,"type":"string","description":"Program ID to which the enrollment belongs","example":""},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type of the request/response","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__pay_by_wallet_v1_enroll","path":"/pay-by-wallet/v1/enroll","method":"POST","summary":"Enroll Visa Pay Account","operationId":"post_/pay-by-wallet/v1/enroll","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__v1_enrollments__external_Id__payment_data","path":"/v1/enrollments/{external-Id}/payment-data","method":"POST","summary":"Retrieve Cryptogram Data","operationId":"post_/v1/enrollments/{external-Id}/payment-data","parameters":[{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type of the request/response","example":"application/json"},{"name":"externalId","in":"path","required":true,"type":"string","description":"External ID of the enrollment to be retrieved (wallet_account_id).","example":""},{"name":"programId","in":"query","required":true,"type":"string","description":"Program identifier to which the enrollment belongs.","example":""}],"hasBody":true,"samplePayload":{}},{"id":"POST__v1_enrollments__external_id__tokens","path":"/v1/enrollments/{external-id}/tokens","method":"POST","summary":"Request Additional Tokens","operationId":"post_/v1/enrollments/{external-id}/tokens","parameters":[{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type of the request/response","example":"application/json"},{"name":"externalId","in":"path","required":true,"type":"string","description":"External ID of the enrollment (wallet_account_id)","example":""},{"name":"programId","in":"query","required":true,"type":"string","description":"Program ID to which the enrollment belongs","example":""}],"hasBody":true,"samplePayload":{"tokens":{}}},{"id":"POST__v1__wallet_defined_authorize_endpoint_","path":"/v1/{wallet-defined-authorize-endpoint}","method":"POST","summary":"Authorization Callback - Outbound","operationId":"post_/v1/{wallet-defined-authorize-endpoint}","parameters":[],"hasBody":true,"samplePayload":{}},{"id":"POST__passport_v1_oauth2_token","path":"/passport/v1/oauth2/token","method":"POST","summary":"Get OpenID Access Token","operationId":"post-passport-v1-oauth2-token","parameters":[],"hasBody":true,"samplePayload":{"token":"sample_string"}}]
};

export const SpecUI_Visa_Pay: React.FC<SpecUI_Visa_PayProps> = ({ onExecute }) => {
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

import React, { useState } from 'react';
import { 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ExternalLink,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  KeyRound,
  FileJson,
  HelpCircle,
  Dices
} from 'lucide-react';
import { ApiResponseInfo, ApiConfig, CitiAccount, CitiTransaction } from '../types';

interface ApiResponseViewerProps {
  lastResponseInfo: ApiResponseInfo | null;
  apiConfig: ApiConfig;
  setApiConfig: React.Dispatch<React.SetStateAction<ApiConfig>>;
  isLoading: boolean;
  onExecuteRequest: (customUrl?: string, customAccountId?: string) => Promise<void>;
  onFetchTransactions: (accountId?: string) => Promise<void>;
  onLoadExampleResponse: () => void;
  onOpenPasteModal: () => void;
  accounts: CitiAccount[];
  transactions: CitiTransaction[];
  onOpenConfigModal: () => void;
}

export const ApiResponseViewer: React.FC<ApiResponseViewerProps> = ({
  lastResponseInfo,
  apiConfig,
  setApiConfig,
  isLoading,
  onExecuteRequest,
  onFetchTransactions,
  onLoadExampleResponse,
  onOpenPasteModal,
  accounts,
  transactions,
  onOpenConfigModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'response' | 'curl' | 'troubleshoot' | 'explorer'>('response');
  const [customUrl, setCustomUrl] = useState(apiConfig.url);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isFetchingTxns, setIsFetchingTxns] = useState(false);

  const payloadString = lastResponseInfo?.rawData
    ? JSON.stringify(lastResponseInfo.rawData, null, 2)
    : lastResponseInfo?.error
      ? JSON.stringify({ error: lastResponseInfo.error, status: lastResponseInfo.status, statusText: lastResponseInfo.statusText }, null, 2)
      : '// No API request executed yet. Enter your Bearer Token or click "Load Citi Sandbox Example Response" below.';

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateUuid = () => {
    const newUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    setApiConfig((prev) => ({ ...prev, uuid: newUuid }));
  };

  const handleFetchTxnsClick = async () => {
    setIsFetchingTxns(true);
    try {
      await onFetchTransactions(selectedAccountId || undefined);
    } finally {
      setIsFetchingTxns(false);
    }
  };

  const isSuccess = lastResponseInfo && lastResponseInfo.status >= 200 && lastResponseInfo.status < 300;
  const isError = lastResponseInfo && (lastResponseInfo.status >= 400 || Boolean(lastResponseInfo.error));
  const isMissingToken = !apiConfig.bearerToken || apiConfig.bearerToken.trim().length === 0;

  const curlCommand = `curl --request GET \\
  --url '${customUrl || apiConfig.url}' \\
  --header 'Accept: application/json' \\
  --header 'Authorization: Bearer ${apiConfig.bearerToken ? apiConfig.bearerToken.trim() : '<YOUR_BEARER_TOKEN>'}' \\
  --header 'Content-Type: application/json' \\
  --header 'client_id: ${apiConfig.clientId || '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI'}' \\
  --header 'uuid: ${apiConfig.uuid || 'a912c0bc-7f52-41a5-a7d1-fe716d949d71'}'`;

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col space-y-0">
      {/* Header with status bar */}
      <div className="p-6 border-b border-[#F1F5F9] flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center font-mono font-bold text-sm">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#1E293B] text-lg">Citi Gateway Live Response Inspector</h3>
              {lastResponseInfo ? (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1 ${
                    isSuccess
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isError
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {isSuccess && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {isError && <AlertCircle className="w-3.5 h-3.5" />}
                  HTTP {lastResponseInfo.status} {lastResponseInfo.statusText}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-600">
                  Ready to pull
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5 font-mono truncate max-w-xl">
              Target: {apiConfig.url}
            </p>
          </div>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onLoadExampleResponse}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Citi Example Response</span>
          </button>

          <button
            onClick={onOpenPasteModal}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <FileJson className="w-3.5 h-3.5 text-slate-600" />
            <span>Paste Response JSON</span>
          </button>

          <button
            onClick={() => onExecuteRequest(customUrl)}
            disabled={isLoading}
            className="px-4 py-2 bg-[#0052FF] hover:bg-[#0045D8] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Pulling...' : 'Execute Live Pull'}</span>
          </button>
        </div>
      </div>

      {/* Quick Credential Inline Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Token Input */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 focus-within:border-blue-500">
          <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="password"
            placeholder="Enter Bearer Token (Authorization: Bearer <token>)..."
            value={apiConfig.bearerToken}
            onChange={(e) => setApiConfig((prev) => ({ ...prev, bearerToken: e.target.value }))}
            className="w-full text-xs font-mono bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
          />
          {apiConfig.bearerToken && (
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">
              SET
            </span>
          )}
        </div>

        {/* Client ID & UUID Display / Generator */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">UUID:</span>
          <input
            type="text"
            value={apiConfig.uuid}
            onChange={(e) => setApiConfig((prev) => ({ ...prev, uuid: e.target.value }))}
            className="w-full text-xs font-mono bg-transparent outline-none text-slate-700"
          />
          <button
            onClick={handleGenerateUuid}
            title="Generate new random UUID"
            className="text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Dices className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Client ID */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">CLIENT_ID:</span>
          <input
            type="text"
            value={apiConfig.clientId}
            onChange={(e) => setApiConfig((prev) => ({ ...prev, clientId: e.target.value }))}
            className="w-full text-xs font-mono bg-transparent outline-none text-slate-700"
          />
        </div>
      </div>

      {/* Error Callout if Request Failed or Bearer Token is missing */}
      {isMissingToken && (
        <div className="p-4 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Why is cURL erroring?</strong> In your command,{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-800">
                --header 'Authorization: Bearer '
              </code>{' '}
              has an empty Bearer token. Citi Sandbox requires a valid OAuth Bearer token or you can click{' '}
              <strong>"Load Citi Example Response"</strong> to immediately preview with Citi's official sandbox response schema.
            </div>
          </div>
          <button
            onClick={onLoadExampleResponse}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-2xs"
          >
            Load Example Response
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-[#F1F5F9] bg-[#F8F9FB] divide-x divide-[#F1F5F9]">
        <div className="p-4">
          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">HTTP Status</span>
          <span className="text-base font-bold font-mono text-[#1E293B]">
            {lastResponseInfo ? `${lastResponseInfo.status} ${lastResponseInfo.statusText}` : 'Not queried'}
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Roundtrip Latency</span>
          <span className="text-base font-bold font-mono text-[#1E293B] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            {lastResponseInfo?.latencyMs ? `${lastResponseInfo.latencyMs} ms` : '--'}
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Parsed Accounts</span>
          <span className="text-base font-bold font-mono text-[#0052FF]">
            {accounts.length} Live Accounts
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Live Transactions</span>
          <span className="text-base font-bold font-mono text-emerald-600">
            {transactions.length} Transactions
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Inspector */}
      <div className="px-6 pt-3 pb-0 bg-white flex items-center justify-between border-b border-[#F1F5F9] overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('response')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'response'
                ? 'border-[#0052FF] text-[#0052FF]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Raw JSON Response Body
          </button>
          <button
            onClick={() => setActiveSubTab('curl')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'curl'
                ? 'border-[#0052FF] text-[#0052FF]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            cURL Request Command
          </button>
          <button
            onClick={() => setActiveSubTab('troubleshoot')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'troubleshoot'
                ? 'border-[#0052FF] text-[#0052FF]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Citi API Troubleshooting
          </button>
          <button
            onClick={() => setActiveSubTab('explorer')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'explorer'
                ? 'border-[#0052FF] text-[#0052FF]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Custom Endpoint Runner
          </button>
        </div>

        <div className="flex items-center gap-2 pb-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0052FF] bg-[#F8F9FB] px-2.5 py-1 rounded-md border border-[#E2E8F0] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Payload'}</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Content Area */}
      <div className="p-6 bg-[#0F172A]">
        {activeSubTab === 'response' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>application/json • UTF-8</span>
              <span>{payloadString.split('\n').length} lines</span>
            </div>
            <pre className="bg-[#1E293B] text-emerald-400 p-5 rounded-xl text-xs font-mono overflow-auto max-h-[550px] leading-relaxed border border-slate-700/80 selection:bg-emerald-500/30">
              {payloadString}
            </pre>
          </div>
        )}

        {activeSubTab === 'curl' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              You can execute this exact cURL command in your terminal or API client (Postman/Insomnia) to test directly against Citi's server.
            </p>
            <pre className="bg-[#1E293B] text-blue-300 p-5 rounded-xl text-xs font-mono overflow-auto max-h-[350px] leading-relaxed border border-slate-700/80 whitespace-pre-wrap">
              {curlCommand}
            </pre>
          </div>
        )}

        {activeSubTab === 'troubleshoot' && (
          <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700/80 space-y-4 text-white">
            <h4 className="font-bold text-sm text-blue-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Common Citi Developer Sandbox Errors & Solutions
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700">
                <span className="font-mono font-bold text-amber-400 block mb-1">
                  1. HTTP 401 Unauthorized / Invalid Request Error
                </span>
                <p className="text-slate-300 mb-1">
                  <strong>Cause:</strong> The header <code className="text-amber-300 font-mono">Authorization: Bearer </code> is missing the token string or the token has expired.
                </p>
                <p className="text-slate-400">
                  <strong>Fix:</strong> Obtain a sandbox access token from Citi Developer Portal, or click <strong>"Load Citi Example Response"</strong> to test immediately.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700">
                <span className="font-mono font-bold text-blue-400 block mb-1">
                  2. Required Citi Headers
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono">
                  <li><strong className="text-white">client_id:</strong> 8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI</li>
                  <li><strong className="text-white">uuid:</strong> a912c0bc-7f52-41a5-a7d1-fe716d949d71 (or any valid UUID v4)</li>
                  <li><strong className="text-white">Authorization:</strong> Bearer &lt;sandbox_token&gt;</li>
                  <li><strong className="text-white">Accept:</strong> application/json</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'explorer' && (
          <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700/80 space-y-4 text-white">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Target Citi Endpoint URL
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Optional Account ID Filter
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Accounts / Default</option>
                  {accounts.map((a) => (
                    <option key={a.accountId} value={a.accountId}>
                      {a.productName} ({a.displayAccountNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => onExecuteRequest(customUrl, selectedAccountId)}
                  disabled={isLoading}
                  className="w-full bg-[#0052FF] hover:bg-[#0040CC] text-white py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Live Request & Parse</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Key,
  Fingerprint,
  Globe,
  Play,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Sliders,
  Terminal,
  Shield,
  Loader2,
  Info,
} from 'lucide-react';

interface RequestConfigProps {
  url: string;
  setUrl: (val: string) => void;
  bearerToken: string;
  setBearerToken: (val: string) => void;
  uuid: string;
  setUuid: (val: string) => void;
  clientId: string;
  setClientId: (val: string) => void;
  cardFunction: string;
  setCardFunction: (val: string) => void;
  linkedSupplementaryCardFlag: boolean;
  setLinkedSupplementaryCardFlag: (val: boolean) => void;
  isLoading: boolean;
  onExecute: () => void;
  onUseSampleData: () => void;
  onGenerateUuid: () => void;
}

export const RequestConfig: React.FC<RequestConfigProps> = ({
  url,
  setUrl,
  bearerToken,
  setBearerToken,
  uuid,
  setUuid,
  clientId,
  setClientId,
  cardFunction,
  setCardFunction,
  linkedSupplementaryCardFlag,
  setLinkedSupplementaryCardFlag,
  isLoading,
  onExecute,
  onUseSampleData,
  onGenerateUuid,
}) => {
  const [showToken, setShowToken] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Construct full dynamic cURL string for display and copying
  const generatedCurl = `curl --request GET \\
  --url '${url}?cardFunction=${encodeURIComponent(cardFunction)}&linkedSupplementaryCardFlag=${linkedSupplementaryCardFlag}' \\
  --header 'Accept: application/json' \\
  --header 'Authorization: Bearer ${bearerToken || '<YOUR_BEARER_TOKEN>'}' \\
  --header 'Content-Type: application/json' \\
  --header 'client_id: ${clientId || '<YOUR_CLIENT_ID>'}' \\
  --header 'uuid: ${uuid || '<YOUR_UUID>'}'`;

  const copyToClipboard = async (text: string, type: 'curl' | 'uuid') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'curl') {
        setCopiedCurl(true);
        setTimeout(() => setCopiedCurl(false), 2000);
      } else {
        setCopiedUuid(true);
        setTimeout(() => setCopiedUuid(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handlePasteToken = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setBearerToken(text.trim());
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-semibold text-sm">
            GET
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Citi Partner API Request</h2>
            <p className="text-xs text-slate-500">Provide your Bearer Token & UUID headers to execute</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center space-x-1 px-2.5 py-1 rounded-md hover:bg-slate-200/60 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 mr-1" />
          <span>{showAdvanced ? 'Simple View' : 'Parameters & Options'}</span>
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Bearer Token Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-bearer-token" className="block text-xs font-semibold text-slate-800">
              <span className="flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Authorization Bearer Token</span>
                <span className="text-rose-500">*</span>
              </span>
            </label>
            <div className="flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={handlePasteToken}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
              >
                Paste
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-slate-500 hover:text-slate-800 inline-flex items-center space-x-1 cursor-pointer"
              >
                {showToken ? (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Reveal
                  </>
                )}
              </button>
              {bearerToken && (
                <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {bearerToken.length} chars
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="input-bearer-token"
              rows={showToken ? 3 : 2}
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              placeholder="Paste Bearer token (e.g. ZjQwOTAwMTg4...)"
              className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                !bearerToken
                  ? 'border-amber-300 bg-amber-50/20 focus:border-blue-500 focus:ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-blue-500/20 text-slate-800'
              } ${!showToken && bearerToken ? 'line-clamp-2' : ''}`}
            />
          </div>
        </div>

        {/* UUID and Client ID Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* UUID Header */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-uuid" className="block text-xs font-semibold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Request UUID</span>
                  <span className="text-rose-500">*</span>
                </span>
              </label>
              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={onGenerateUuid}
                  className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer"
                >
                  Generate New
                </button>
                {uuid && (
                  <>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(uuid, 'uuid')}
                      className="text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      {copiedUuid ? 'Copied' : 'Copy'}
                    </button>
                  </>
                )}
              </div>
            </div>
            <input
              id="input-uuid"
              type="text"
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              placeholder="e.g. aad4a7cd-0828-405e-ae49-741b72238736"
              className="w-full text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          {/* Client ID Header */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-client-id" className="block text-xs font-semibold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-sky-600" />
                  <span>Client ID (`client_id` header)</span>
                </span>
              </label>
            </div>
            <input
              id="input-client-id"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g. 8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI"
              className="w-full text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Advanced Parameters Section */}
        {showAdvanced && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Target Endpoint & Query Params</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  API Endpoint Base URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Query: cardFunction
                  </label>
                  <select
                    value={cardFunction}
                    onChange={(e) => setCardFunction(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">ALL (All card functions)</option>
                    <option value="CREDIT_LIMIT_INCREASE">CREDIT_LIMIT_INCREASE</option>
                    <option value="LOCAL_CARD_ACTIVATION">LOCAL_CARD_ACTIVATION</option>
                    <option value="OVERSEAS_CARD_ACTIVATION">OVERSEAS_CARD_ACTIVATION</option>
                    <option value="REPORT_LOST_STOLEN">REPORT_LOST_STOLEN</option>
                    <option value="RESET_ATM_PIN">RESET_ATM_PIN</option>
                    <option value="EPP_BOOKING">EPP_BOOKING</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Query: linkedSupplementaryCardFlag
                  </label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="inline-flex items-center text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={linkedSupplementaryCardFlag === true}
                        onChange={() => setLinkedSupplementaryCardFlag(true)}
                        className="text-blue-600 focus:ring-blue-500 mr-1.5"
                      />
                      True (Include supplementary)
                    </label>
                    <label className="inline-flex items-center text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={linkedSupplementaryCardFlag === false}
                        onChange={() => setLinkedSupplementaryCardFlag(false)}
                        className="text-blue-600 focus:ring-blue-500 mr-1.5"
                      />
                      False (Primary only)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-call-citi-api"
              type="button"
              onClick={onExecute}
              disabled={isLoading || !bearerToken || !uuid}
              className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                isLoading || !bearerToken || !uuid
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-blue-600/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calling Citi API Gateway...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Call Citi Partner API
                </>
              )}
            </button>

            <button
              id="btn-use-sample-payload"
              type="button"
              onClick={onUseSampleData}
              className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] border border-slate-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Load Prompt Sample Payload
            </button>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(generatedCurl, 'curl')}
            className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            {copiedCurl ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied cURL!</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Copy Equivalent cURL
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

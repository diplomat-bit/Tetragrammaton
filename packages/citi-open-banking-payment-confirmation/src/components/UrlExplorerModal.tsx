import React, { useState } from 'react';
import {
  X,
  Globe,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ProxyApiResponse } from '../types';
import { ConsentSummaryCard } from './ConsentSummaryCard';
import { AccountBalanceCard } from './AccountBalanceCard';
import { JsonViewer } from './JsonViewer';

interface UrlExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  token: string;
  financialId: string;
  response: ProxyApiResponse | null;
  isLoading: boolean;
  onReFetch: (customUrl?: string) => void;
  onCheckFunds: (amount: string, currency: string) => Promise<any>;
}

export const UrlExplorerModal: React.FC<UrlExplorerModalProps> = ({
  isOpen,
  onClose,
  url,
  token,
  financialId,
  response,
  isLoading,
  onReFetch,
  onCheckFunds,
}) => {
  const [activeTab, setActiveTab] = useState<'formatted' | 'json' | 'headers'>('formatted');
  const [editableUrl, setEditableUrl] = useState(url);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Sync state if incoming url prop changes
  React.useEffect(() => {
    setEditableUrl(url);
  }, [url]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(editableUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const consentData = response?.data?.Data;
  const balanceData = consentData?.AccountBalance;
  const debtorData = consentData?.DebtorAccount;
  const links = response?.data?.Links;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Live URL Renderer & Response Inspector</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                  GET Query
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Rendering Open Banking resource using Bearer Token and Financial ID
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Bar and Controls */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 w-full flex rounded-xl overflow-hidden border border-slate-800 bg-slate-900 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <span className="bg-slate-800 text-blue-400 font-mono font-bold text-xs px-3 py-2 border-r border-slate-700/80 flex items-center">
                GET
              </span>
              <input
                type="text"
                id="input-render-url-field"
                value={editableUrl}
                onChange={(e) => setEditableUrl(e.target.value)}
                placeholder="https://partner.citi.com/open-banking/v3.1/..."
                className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
              />
              <button
                type="button"
                id="btn-copy-modal-url"
                onClick={handleCopyUrl}
                className="px-2.5 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition border-l border-slate-800"
                title="Copy URL"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              id="btn-fetch-render-url"
              onClick={() => onReFetch(editableUrl)}
              disabled={isLoading || !editableUrl}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute GET</span>
                </>
              )}
            </button>
          </div>

          {/* Active Auth Details */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Token:</span>
              <code className="text-slate-300 font-mono text-[11px] bg-slate-900 px-1.5 py-0.5 rounded">
                {token ? `${token.slice(0, 16)}...` : 'None'}
              </code>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>Financial ID:</span>
              <code className="text-cyan-300 font-mono text-[11px] bg-slate-900 px-1.5 py-0.5 rounded">
                {financialId || 'citi-sandbox-fid-001'}
              </code>
            </span>
            {response && (
              <>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <span>Status:</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded font-mono ${
                      response.status >= 200 && response.status < 300
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {response.status} {response.statusText}
                  </span>
                </span>
                <span>•</span>
                <span className="text-slate-500">{response.responseTimeMs}ms</span>
              </>
            )}
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-6 pt-2">
          <button
            type="button"
            id="tab-view-formatted"
            onClick={() => setActiveTab('formatted')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition -mb-px flex items-center space-x-1.5 ${
              activeTab === 'formatted'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Formatted Summary & Balance</span>
          </button>
          <button
            type="button"
            id="tab-view-json"
            onClick={() => setActiveTab('json')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition -mb-px flex items-center space-x-1.5 ${
              activeTab === 'json'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw Response JSON</span>
          </button>
          <button
            type="button"
            id="tab-view-headers"
            onClick={() => setActiveTab('headers')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition -mb-px flex items-center space-x-1.5 ${
              activeTab === 'headers'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Response Headers</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Rendering and querying Open Banking resource...</p>
            </div>
          ) : !response ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              Click &quot;Execute GET&quot; to fetch and render the resource from the URL.
            </div>
          ) : (
            <>
              {activeTab === 'formatted' && (
                <div className="space-y-5">
                  {/* If error in response */}
                  {response.error && (
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                      <div className="font-bold flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>Gateway Response Error ({response.status})</span>
                      </div>
                      <p>{response.error}</p>
                      {response.message && <p className="text-slate-400 text-[11px]">{response.message}</p>}
                    </div>
                  )}

                  {/* Render Account Balance Card */}
                  <AccountBalanceCard
                    balanceDetails={balanceData}
                    debtorAccount={debtorData}
                    onCheckFunds={onCheckFunds}
                  />

                  {/* Render Consent Card if data exists */}
                  {consentData && (
                    <ConsentSummaryCard
                      data={consentData}
                      links={links}
                      onRenderUrl={(nextUrl) => {
                        setEditableUrl(nextUrl);
                        onReFetch(nextUrl);
                      }}
                    />
                  )}
                </div>
              )}

              {activeTab === 'json' && (
                <JsonViewer
                  data={response.data || response}
                  title="Open Banking Resource JSON"
                />
              )}

              {activeTab === 'headers' && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-slate-300 mb-3">HTTP Response Headers</h4>
                  {response.headers && Object.keys(response.headers).length > 0 ? (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                      {Object.entries(response.headers).map(([key, val]) => (
                        <div key={key} className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                          <dt className="text-blue-400 font-semibold">{key}</dt>
                          <dd className="text-slate-300 mt-0.5 break-all">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-xs text-slate-500">No response headers captured.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Open Banking Read/Write API Specification v3.1
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

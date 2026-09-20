import React, { useState } from 'react';
import { ApiCallResult } from '../types';
import { Check, Copy, Clock, ShieldCheck, AlertTriangle, XCircle, ArrowUpRight, History } from 'lucide-react';

interface ResponseViewerProps {
  currentResult: ApiCallResult | null;
  history: ApiCallResult[];
  onSelectHistory: (result: ApiCallResult) => void;
  onLoadExampleResponse: () => void;
  isLoading: boolean;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  currentResult,
  history,
  onSelectHistory,
  onLoadExampleResponse,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'history'>('body');
  const [copied, setCopied] = useState(false);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    if (status >= 400 && status < 500) return 'bg-amber-950 text-amber-300 border-amber-800';
    return 'bg-rose-950 text-rose-300 border-rose-800';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    if (status >= 400 && status < 500) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <XCircle className="w-4 h-4 text-rose-400" />;
  };

  const handleCopyBody = () => {
    if (!currentResult) return;
    const text = typeof currentResult.data === 'string'
      ? currentResult.data
      : JSON.stringify(currentResult.data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="citi-response-viewer" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">
            Response Inspector
          </span>
          {currentResult && (
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border flex items-center gap-1 ${getStatusColor(currentResult.status)}`}>
              {getStatusIcon(currentResult.status)}
              {currentResult.status} {currentResult.statusText || 'OK'}
            </span>
          )}
          {currentResult?.isExampleResponse && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              Sample Sandbox Response
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentResult && (
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {currentResult.durationMs}ms
            </span>
          )}

          <button
            id="load-example-response-btn"
            type="button"
            onClick={onLoadExampleResponse}
            className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-sky-300 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Load the 200 OK Sandbox Response Schema provided in documentation"
          >
            Load Example 200 OK
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('body')}
            className={`py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'body'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Response Body
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('headers')}
            className={`py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'headers'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Headers ({currentResult ? Object.keys(currentResult.responseHeaders || {}).length : 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-2 border-b-2 font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3 h-3" />
            History ({history.length})
          </button>
        </div>

        {activeTab === 'body' && currentResult && (
          <button
            type="button"
            onClick={handleCopyBody}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy Body'}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-auto max-h-[500px] font-mono text-xs bg-slate-950">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3 font-sans">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Dispatching request to Citi OpenAPI gateway...</p>
          </div>
        ) : !currentResult ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-2 font-sans">
            <ArrowUpRight className="w-8 h-8 text-slate-600 stroke-1" />
            <p className="text-xs text-slate-400">No request sent yet in this session.</p>
            <p className="text-[11px] text-slate-500">
              Click <span className="text-blue-400 font-medium">"Execute POST"</span> or <span className="text-sky-400 font-medium">"Load Example 200 OK"</span>.
            </p>
          </div>
        ) : activeTab === 'body' ? (
          <div>
            <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {typeof currentResult.data === 'string'
                ? currentResult.data
                : JSON.stringify(currentResult.data, null, 2)}
            </pre>
          </div>
        ) : activeTab === 'headers' ? (
          <div className="space-y-4">
            <div>
              <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                Response Headers
              </h5>
              {Object.keys(currentResult.responseHeaders || {}).length === 0 ? (
                <p className="text-slate-500 text-[11px]">No response headers available.</p>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1.5">
                  {Object.entries(currentResult.responseHeaders).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-sky-400 font-medium">{k}:</span>
                      <span className="text-slate-300 break-all">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                Sent Request Headers
              </h5>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1.5">
                {Object.entries(currentResult.requestHeaders || {}).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-purple-400 font-medium">{k}:</span>
                    <span className="text-slate-300 break-all">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 font-sans">
            {history.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-6">No previous attempts.</p>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectHistory(item)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    item === currentResult
                      ? 'bg-blue-950/40 border-blue-800 text-slate-100'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="font-mono text-slate-400">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>{item.durationMs}ms</span>
                    <span className="text-blue-400 hover:underline">View</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

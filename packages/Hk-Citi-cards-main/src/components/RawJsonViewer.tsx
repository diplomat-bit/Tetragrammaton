import React, { useState } from 'react';
import { Copy, Check, Search, Code, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { ApiResponseState } from '../types';

interface RawJsonViewerProps {
  responseState: ApiResponseState | null;
}

export const RawJsonViewer: React.FC<RawJsonViewerProps> = ({ responseState }) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'body' | 'headers' | 'request'>('body');

  if (!responseState) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
        <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No response data yet. Execute the request above to view output.</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      const dataToCopy =
        activeSubTab === 'body'
          ? JSON.stringify(responseState.data || responseState.error, null, 2)
          : activeSubTab === 'headers'
          ? JSON.stringify(responseState.responseHeaders || {}, null, 2)
          : JSON.stringify(responseState.requestHeaders || {}, null, 2);

      await navigator.clipboard.writeText(dataToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const getStatusBadge = () => {
    const isSuccess = responseState.success || (responseState.status >= 200 && responseState.status < 300);
    return (
      <div className="flex items-center space-x-2">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
            isSuccess
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-rose-100 text-rose-800 border border-rose-200'
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
          )}
          {responseState.status} {responseState.statusText || (isSuccess ? 'OK' : 'Error')}
        </span>

        {responseState.durationMs !== undefined && (
          <span className="inline-flex items-center text-xs text-slate-500 font-mono">
            <Clock className="w-3 h-3 mr-1 text-slate-400" />
            {responseState.durationMs} ms
          </span>
        )}

        {responseState.isMock && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Sandbox Payload
          </span>
        )}
      </div>
    );
  };

  const formattedJson = JSON.stringify(
    activeSubTab === 'body'
      ? responseState.data ?? { error: responseState.error, message: responseState.message }
      : activeSubTab === 'headers'
      ? responseState.responseHeaders || {}
      : responseState.requestHeaders || {},
    null,
    2
  );

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
      {/* Top action bar */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          {getStatusBadge()}

          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('body')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeSubTab === 'body'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Response Body
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('headers')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeSubTab === 'headers'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Response Headers
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('request')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeSubTab === 'request'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Request Headers
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search JSON keys/values..."
              className="pl-8 pr-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500 placeholder-slate-500 w-44 sm:w-56"
            />
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* JSON Viewer Console */}
      <div className="p-4 max-h-96 overflow-auto font-mono text-xs text-sky-300 leading-relaxed bg-slate-950/90 selection:bg-blue-600 selection:text-white">
        <pre className="whitespace-pre-wrap break-all">
          {searchTerm
            ? highlightSearch(formattedJson, searchTerm)
            : formattedJson}
        </pre>
      </div>
    </div>
  );
};

function highlightSearch(text: string, search: string): React.ReactNode {
  if (!search.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(search)})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <mark key={i} className="bg-yellow-400 text-slate-950 font-bold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

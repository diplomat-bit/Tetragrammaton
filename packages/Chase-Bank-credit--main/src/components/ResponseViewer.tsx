import React, { useState } from 'react';
import { ApiResponse } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  FileCode,
  ShieldAlert,
  ArrowUpRight,
  Terminal,
  Activity,
} from 'lucide-react';

interface ResponseViewerProps {
  response: ApiResponse | null;
  loading?: boolean;
  isLoading?: boolean;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response, loading, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw' | 'diagnostics'>('formatted');
  const isFetching = Boolean(loading || isLoading);

  if (isFetching) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-4 animate-bounce">
          <Activity className="w-7 h-7 animate-spin" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Dispatching HTTPS Request to Chase Gateway</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Passing authorization header, enrollment-type-code, external account identifier, and trace-id...
        </p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Terminal className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">Awaiting Request Execution</h3>
        <p className="text-xs text-slate-500 max-w-lg mx-auto mb-6">
          Paste your Chase OAuth token above, configure your headers, and click{' '}
          <strong className="text-slate-700">"Call Chase API"</strong> to inspect the live or simulated response.
        </p>

        {/* Quick Tips Box */}
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            Quick Chase Pay-With-Points Checklist:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>
              <code className="bg-white px-1 py-0.5 rounded border text-slate-800 font-mono">authorization</code>:
              Must be formatted as <code className="text-blue-700">Bearer &lt;token&gt;</code>
            </li>
            <li>
              <code className="bg-white px-1 py-0.5 rounded border text-slate-800 font-mono">trace-id</code>: 32-character
              hexadecimal string for distributed transaction tracking
            </li>
            <li>
              <code className="bg-white px-1 py-0.5 rounded border text-slate-800 font-mono">
                enrollment-type-code
              </code>
              : Supported codes include <code className="text-emerald-700 font-semibold">ENROLL</code>, <code className="text-amber-700 font-semibold">CANCEL</code>, <code className="text-indigo-700 font-semibold">INQUIRE</code>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  const isSuccess = response.status >= 200 && response.status < 300;
  const isAuthError = response.status === 401 || response.status === 403;

  const handleCopyBody = () => {
    const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Status Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 shadow-xs ${
              isSuccess
                ? 'bg-emerald-600 text-white'
                : isAuthError
                ? 'bg-amber-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {response.status} {response.statusText}
          </span>

          {response.isSimulated && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              <Sparkles className="w-3 h-3 text-amber-600" /> Mock Response
            </span>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{response.latencyMs} ms</span>
          </div>
        </div>

        {/* Action Tabs & Copy */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('formatted')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'formatted' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              JSON
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('raw')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'raw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw Text
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diagnostics')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'diagnostics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diagnostics
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyBody}
            title="Copy response body"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Response Headers Collapsible Drawer */}
      <div className="border-b border-slate-100 bg-slate-50/40">
        <button
          type="button"
          onClick={() => setShowHeaders(!showHeaders)}
          className="w-full px-5 py-2 text-left text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-between transition-colors"
        >
          <span>Response Headers ({Object.keys(response.headers || {}).length})</span>
          {showHeaders ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showHeaders && (
          <div className="px-5 pb-3 font-mono text-[11px] text-slate-600 space-y-1 bg-white border-t border-slate-100">
            {Object.entries(response.headers || {}).map(([key, val]) => (
              <div key={key} className="flex gap-2">
                <span className="text-slate-400 select-all font-semibold">{key}:</span>
                <span className="text-slate-800 select-all">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Body Main Content */}
      <div className="p-5">
        {activeTab === 'formatted' && (
          <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto shadow-inner">
            <pre className="whitespace-pre-wrap break-all leading-relaxed">
              {typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto">
            <pre className="whitespace-pre-wrap break-all">
              {typeof response.data === 'object' ? JSON.stringify(response.data) : String(response.data)}
            </pre>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-4 text-xs">
            {/* Status explanation */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                Response Analysis
              </div>
              <p className="text-slate-600 leading-relaxed">
                {isSuccess
                  ? 'The Chase Gateway acknowledged and processed the enrollment operation successfully. Rewards status is confirmed.'
                  : isAuthError
                  ? 'Authorization failed. This typically means the Bearer token is expired, has an invalid signature, or lacks the necessary OAuth scope (e.g. card.loyalty.enrollments.write).'
                  : 'An error occurred while connecting to or executing the request. Review trace-id and external-account-identifier parameters.'}
              </p>
            </div>

            {/* Field breakdown */}
            {typeof response.data === 'object' && response.data && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="font-semibold text-slate-900">Extracted Payload Entities</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(response.data).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-mono">{key}</div>
                      <div className="text-xs font-semibold text-slate-900 font-mono mt-0.5 truncate">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

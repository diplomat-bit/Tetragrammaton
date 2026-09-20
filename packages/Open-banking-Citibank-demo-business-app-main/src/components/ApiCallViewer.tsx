import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Activity,
  Terminal,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ApiCallLog } from '../types';

interface ApiCallViewerProps {
  title?: string;
  subtitle?: string;
  lastCall?: ApiCallLog | null;
  onOpenTelemetryModal?: () => void;
  className?: string;
}

export const ApiCallViewer: React.FC<ApiCallViewerProps> = ({
  title = 'Live API Response Inspector',
  subtitle = 'Inspect real-time request and response payloads from this service',
  lastCall,
  onOpenTelemetryModal,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'response' | 'request' | 'headers' | 'curl'>('response');
  const [copied, setCopied] = useState(false);

  if (!lastCall) {
    return null;
  }

  const isSuccess = lastCall.status >= 200 && lastCall.status < 300;
  const isError = lastCall.status >= 400;

  const copyContent = () => {
    let textToCopy = '';
    if (activeTab === 'response') {
      textToCopy = typeof lastCall.responseBody === 'string' ? lastCall.responseBody : JSON.stringify(lastCall.responseBody, null, 2);
    } else if (activeTab === 'request') {
      textToCopy = typeof lastCall.requestBody === 'string' ? lastCall.requestBody : JSON.stringify(lastCall.requestBody, null, 2);
    } else if (activeTab === 'headers') {
      textToCopy = JSON.stringify({ request: lastCall.requestHeaders, response: lastCall.responseHeaders }, null, 2);
    } else {
      textToCopy = `curl -X ${lastCall.method} "${lastCall.targetUrl || lastCall.url}"`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`border border-white/15 bg-slate-900/80 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl transition-all ${className}`}>
      {/* Accordion / Header Bar */}
      <div className="p-4 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white tracking-tight">{title}</span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                  isSuccess
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                    : isError
                    ? 'bg-red-500/15 text-red-300 border-red-400/30'
                    : 'bg-blue-500/15 text-blue-300 border-blue-400/30'
                }`}
              >
                {lastCall.method} {lastCall.status} {lastCall.statusText}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                {lastCall.durationMs}ms
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate max-w-md mt-0.5">
              {lastCall.targetUrl || lastCall.url}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenTelemetryModal && (
            <button
              onClick={onOpenTelemetryModal}
              className="text-[11px] font-medium text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1.5 rounded-xl border border-cyan-400/30 transition-all flex items-center space-x-1"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Full Telemetry</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {/* Sub tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex space-x-1">
              {[
                { id: 'response', label: 'Response JSON' },
                { id: 'request', label: 'Request Payload' },
                { id: 'headers', label: 'Headers' },
                { id: 'curl', label: 'cURL Replay' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={copyContent}
              className="flex items-center space-x-1 text-[11px] text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded-lg border border-blue-400/20 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Body Viewer */}
          <div className="bg-black/50 rounded-xl p-3.5 border border-white/10 font-mono text-xs max-h-64 overflow-y-auto leading-relaxed scrollbar-thin">
            {activeTab === 'response' && (
              <pre className="text-emerald-300/90 whitespace-pre-wrap break-all">
                {typeof lastCall.responseBody === 'string'
                  ? lastCall.responseBody
                  : JSON.stringify(lastCall.responseBody, null, 2)}
              </pre>
            )}

            {activeTab === 'request' && (
              <pre className="text-cyan-300/90 whitespace-pre-wrap break-all">
                {lastCall.requestBody
                  ? typeof lastCall.requestBody === 'string'
                    ? lastCall.requestBody
                    : JSON.stringify(lastCall.requestBody, null, 2)
                  : '// No request body payload sent with this call'}
              </pre>
            )}

            {activeTab === 'headers' && (
              <pre className="text-purple-300/90 whitespace-pre-wrap break-all">
                {JSON.stringify(
                  {
                    requestHeaders: lastCall.requestHeaders,
                    responseHeaders: lastCall.responseHeaders,
                  },
                  null,
                  2
                )}
              </pre>
            )}

            {activeTab === 'curl' && (
              <pre className="text-amber-300/90 whitespace-pre-wrap break-all select-all">
                {`curl -X ${lastCall.method} "${lastCall.targetUrl || lastCall.url}" \\
  -H "Content-Type: application/json"${
    lastCall.requestBody
      ? ` \\\n  -d '${JSON.stringify(lastCall.requestBody)}'`
      : ''
  }`}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

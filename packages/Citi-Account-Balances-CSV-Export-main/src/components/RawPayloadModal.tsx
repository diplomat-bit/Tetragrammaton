import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { ApiResponseInfo, ApiConfig } from '../types';

interface RawPayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastResponseInfo: ApiResponseInfo | null;
  apiConfig: ApiConfig;
}

export const RawPayloadModal: React.FC<RawPayloadModalProps> = ({
  isOpen,
  onClose,
  lastResponseInfo,
  apiConfig,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const payloadString = lastResponseInfo?.rawData
    ? JSON.stringify(lastResponseInfo.rawData, null, 2)
    : '// No API payload recorded yet. Click Refresh in the top bar to fetch from Citi Gateway.';

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1E293B] text-base">Citi Partner API Response Inspector</h3>
              <p className="text-xs text-[#64748B]">Inspecting raw JSON payload, HTTP status & latency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8F9FB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-[#F8F9FB]">
          {/* Metadata banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Status Code</span>
              <div className="text-sm font-bold text-[#1E293B] mt-0.5">
                {lastResponseInfo?.status ? `HTTP ${lastResponseInfo.status}` : 'Pending'}
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Roundtrip Latency</span>
              <div className="text-sm font-bold text-[#1E293B] mt-0.5">
                {lastResponseInfo?.latencyMs ? `${lastResponseInfo.latencyMs} ms` : 'N/A'}
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Client ID</span>
              <div className="text-xs font-mono text-[#64748B] mt-0.5 truncate" title={apiConfig.clientId}>
                {apiConfig.clientId ? `${apiConfig.clientId.substring(0, 10)}...` : 'None'}
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">UUID</span>
              <div className="text-xs font-mono text-[#64748B] mt-0.5 truncate" title={apiConfig.uuid}>
                {apiConfig.uuid ? `${apiConfig.uuid.substring(0, 10)}...` : 'None'}
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <div className="flex items-center justify-between bg-[#0F172A] px-4 py-2 rounded-t-lg text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Response Body (JSON)</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="bg-[#1E293B] text-emerald-400 p-4 rounded-b-lg text-xs font-mono overflow-auto max-h-[380px] leading-relaxed border-t border-slate-700">
              {payloadString}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#F1F5F9] bg-white flex items-center justify-between shrink-0">
          <span className="text-xs text-[#64748B]">Citi Developer Hub Sandbox compliant</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1E293B] text-white hover:bg-[#0F172A] rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

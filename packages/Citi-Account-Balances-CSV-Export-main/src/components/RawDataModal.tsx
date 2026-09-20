import React, { useState } from 'react';
import { X, Copy, Check, Code, Database, Clock } from 'lucide-react';
import { ApiResponseInfo } from '../types';

interface RawDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  responseInfo: ApiResponseInfo | null;
}

export const RawDataModal: React.FC<RawDataModalProps> = ({
  isOpen,
  onClose,
  responseInfo,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawJson = responseInfo?.rawData
    ? JSON.stringify(responseInfo.rawData, null, 2)
    : '{\n  "message": "No response data available. Please fetch balances using your Bearer token."\n}';

  const handleCopy = () => {
    navigator.clipboard.writeText(rawJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#1E293B]">Citi Partner API Response Inspector</h3>
              <p className="text-xs text-[#64748B]">Raw JSON payload & headers returned from account-transactions endpoint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar */}
        <div className="px-6 py-2.5 bg-[#F8F9FB] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="text-[#64748B]">Status:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                (responseInfo?.status || 200) >= 200 && (responseInfo?.status || 200) < 300
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {responseInfo?.status || 200} {responseInfo?.statusText || 'OK'}
              </span>
            </span>

            {responseInfo?.latencyMs !== undefined && (
              <span className="flex items-center gap-1 text-[#64748B]">
                <Clock className="w-3.5 h-3.5" />
                <span>{responseInfo.latencyMs} ms</span>
              </span>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-md text-xs font-semibold text-[#1E293B] hover:bg-gray-50 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied Payload</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>

        {/* Code Editor Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0F172A]">
          <pre className="text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto selection:bg-[#0052FF]/40">
            {rawJson}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-[#F8F9FB] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1E293B] hover:bg-[#0F172A] text-white transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Send, RotateCcw, Copy, Check, Terminal, FileCode2, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onSend: () => void;
  onReset: () => void;
  onShowCurl: () => void;
  onToggleRawJson: () => void;
  isRawJsonActive: boolean;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSend,
  onReset,
  onShowCurl,
  onToggleRawJson,
  isRawJsonActive,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  return (
    <header id="citi-app-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner tracking-wider">
            CITI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-100 tracking-tight">
                Insurance Booking API Client
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                POST
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              /gcgapi/sandbox/prod/openapi/v1/insurance/bookings/withOfflinePayments
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            id="toggle-raw-json-btn"
            onClick={onToggleRawJson}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isRawJsonActive
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            {isRawJsonActive ? 'Form View' : 'Raw JSON'}
          </button>

          <button
            id="view-curl-modal-btn"
            onClick={onShowCurl}
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            cURL Code
          </button>

          <button
            id="reset-form-btn"
            onClick={onReset}
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
            title="Reset form to default pre-filled sample"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Pre-filled
          </button>

          <button
            id="send-booking-request-btn"
            onClick={onSend}
            disabled={isLoading}
            type="button"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Execute POST
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

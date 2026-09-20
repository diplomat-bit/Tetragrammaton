import React, { useState } from 'react';
import { X, Terminal, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseCurlCommand } from '../utils/openBanking';
import { RequestConfig } from '../types';

interface CurlParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (parsed: Partial<RequestConfig>) => void;
}

const DEFAULT_SAMPLE_CURL = `curl --request POST \\
  --url https://partner.citi.com/gcgapi/sandbox/prod/openapi/open-banking/v3.1/cbpii/funds-confirmation-consents \\
  --header 'Accept: application/json' \\
  --header 'Authorization: Bearer test_token_citi_sandbox_9921' \\
  --header 'Content-Type: application/json' \\
  --header 'x-fapi-financial-id: citi-sandbox-fid-001' \\
  --data '{"Data":{"ExpirationDateTime":"2026-08-20T22:36:44.000Z","DebtorAccount":{"SchemeName":"UK.OBIE.BBAN","Identification":"GB29CITI60161331926819","Name":"James","SecondaryIdentification":"ROLL-882910"}}}'`;

export const CurlParserModal: React.FC<CurlParserModalProps> = ({ isOpen, onClose, onApply }) => {
  const [curlText, setCurlText] = useState(DEFAULT_SAMPLE_CURL);
  const [parsedPreview, setParsedPreview] = useState<Partial<RequestConfig> | null>(() =>
    parseCurlCommand(DEFAULT_SAMPLE_CURL)
  );

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setCurlText(text);
    if (text.trim()) {
      const parsed = parseCurlCommand(text);
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  };

  const handleApply = () => {
    if (parsedPreview) {
      onApply(parsedPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Import cURL Command</h3>
              <p className="text-xs text-slate-400">
                Paste any Open Banking cURL request to auto-extract token, financial ID, URL, and account details
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

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">Raw cURL Command</label>
              <button
                type="button"
                onClick={() => handleTextChange(DEFAULT_SAMPLE_CURL)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
              >
                Insert Citi Prompt Example
              </button>
            </div>
            <textarea
              id="input-curl-text"
              value={curlText}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={7}
              placeholder="curl --request POST --url https://partner.citi.com/... --header 'Authorization: Bearer $token' ..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Parsed Inspection Preview */}
          {parsedPreview && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Extracted Parameters</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono">Method & Target URL:</span>
                  <div className="text-slate-200 font-mono text-[11px] bg-slate-900 px-2.5 py-1.5 rounded mt-0.5 break-all border border-slate-800">
                    <span className="text-blue-400 font-bold mr-1.5">{parsedPreview.method || 'POST'}</span>
                    {parsedPreview.url || 'None detected'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Financial ID (x-fapi-financial-id):</span>
                  <div className="text-slate-200 font-mono text-[11px] bg-slate-900 px-2.5 py-1.5 rounded mt-0.5 border border-slate-800">
                    {parsedPreview.financialId || <span className="text-amber-400 italic">Not in curl (will use default)</span>}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Bearer Access Token:</span>
                  <div className="text-slate-200 font-mono text-[11px] bg-slate-900 px-2.5 py-1.5 rounded mt-0.5 truncate border border-slate-800">
                    {parsedPreview.token ? `${parsedPreview.token.slice(0, 20)}...` : <span className="text-amber-400 italic">Not in curl</span>}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Debtor Account:</span>
                  <div className="text-slate-200 font-mono text-[11px] bg-slate-900 px-2.5 py-1.5 rounded mt-0.5 border border-slate-800">
                    {parsedPreview.debtorAccount ? (
                      <span>{parsedPreview.debtorAccount.Name} ({parsedPreview.debtorAccount.SchemeName})</span>
                    ) : (
                      <span className="text-slate-400 italic">Standard Citi Template</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            type="button"
            id="btn-apply-curl"
            onClick={handleApply}
            disabled={!parsedPreview?.url}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span>Apply to Request Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Code2, Sparkles, Check, AlertCircle, UploadCloud } from 'lucide-react';
import { citiSandboxAccountDetailsExample } from '../data/citiSandboxExamples';

interface PastePayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPayload: (parsedJson: any) => void;
}

export const PastePayloadModal: React.FC<PastePayloadModalProps> = ({
  isOpen,
  onClose,
  onApplyPayload,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = () => {
    setParseError(null);
    try {
      if (!jsonText.trim()) {
        setParseError('Please enter or paste a JSON response payload.');
        return;
      }
      const parsed = JSON.parse(jsonText);
      onApplyPayload(parsed);
      onClose();
    } catch (err: any) {
      setParseError(`Invalid JSON format: ${err.message}`);
    }
  };

  const handleLoadExample = () => {
    setJsonText(JSON.stringify(citiSandboxAccountDetailsExample, null, 2));
    setParseError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Paste Citi Response Payload</h3>
              <p className="text-xs text-slate-500">
                Paste any JSON payload from Citi Sandbox or cURL output to render live accounts & transactions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              JSON Response Body
            </label>
            <button
              type="button"
              onClick={handleLoadExample}
              className="text-xs font-semibold text-[#0052FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Citi Sandbox Example Response
            </button>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setParseError(null);
            }}
            placeholder={`{\n  "accountGroupSummary": [\n    {\n      "accountGroup": "CHECKING",\n      "checkingAccountsDetails": [...]\n    }\n  ]\n}`}
            rows={14}
            className="w-full font-mono text-xs p-4 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 selection:bg-emerald-500/30 leading-relaxed"
          />

          {parseError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadExample}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Fill Example
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Parse & Display on App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

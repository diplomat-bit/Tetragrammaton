import React, { useState, useEffect } from 'react';
import { InsuranceBookingPayload } from '../types';
import { Check, Copy, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

interface JsonPayloadEditorProps {
  payload: InsuranceBookingPayload;
  onChange: (updated: InsuranceBookingPayload) => void;
  onReset: () => void;
}

export const JsonPayloadEditor: React.FC<JsonPayloadEditorProps> = ({
  payload,
  onChange,
  onReset,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setJsonText(JSON.stringify(payload, null, 2));
    setParseError(null);
  }, [payload]);

  const handleTextChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setParseError(null);
      onChange(parsed);
    } catch (e: any) {
      setParseError(e.message);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setParseError(null);
      onChange(parsed);
    } catch (e: any) {
      setParseError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">
            Raw JSON Payload Editor (2-Way Form Sync)
          </span>
          {parseError ? (
            <span className="text-[11px] text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Syntax Error
            </span>
          ) : (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Valid JSON
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFormatJson}
            className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            Format
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {parseError && (
        <div className="p-2.5 bg-red-950/50 border border-red-800/80 rounded-lg text-xs text-red-300 font-mono">
          {parseError}
        </div>
      )}

      <textarea
        id="raw-json-textarea"
        rows={24}
        value={jsonText}
        onChange={(e) => handleTextChange(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
};

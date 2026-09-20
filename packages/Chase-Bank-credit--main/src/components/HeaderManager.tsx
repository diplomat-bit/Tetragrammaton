import React, { useState } from 'react';
import { Key, Copy, Check, RefreshCw, Shield, Sparkles, Plus, Trash2 } from 'lucide-react';

interface HeaderManagerProps {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
  onGenerateTraceId: () => void;
  onGenerateMockToken: () => void;
}

export const HeaderManager: React.FC<HeaderManagerProps> = ({
  headers,
  onChange,
  onGenerateTraceId,
  onGenerateMockToken,
}) => {
  const [copied, setCopied] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleHeaderChange = (key: string, value: string) => {
    onChange({
      ...headers,
      [key]: value,
    });
  };

  const handleRemoveHeader = (key: string) => {
    const updated = { ...headers };
    delete updated[key];
    onChange(updated);
  };

  const handleAddHeader = () => {
    if (!newKey.trim()) return;
    onChange({
      ...headers,
      [newKey.trim()]: newValue.trim(),
    });
    setNewKey('');
    setNewValue('');
  };

  const copyAllHeaders = () => {
    navigator.clipboard.writeText(JSON.stringify(headers, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const defaultKeys = ['authorization', 'enrollment-type-code', 'external-account-identifier', 'trace-id', 'channel-type'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-600" />
          HTTP Request Headers
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGenerateTraceId}
            className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> New Trace ID
          </button>
          <button
            type="button"
            onClick={onGenerateMockToken}
            className="text-[11px] font-medium px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Mock Token
          </button>
          <button
            type="button"
            onClick={copyAllHeaders}
            className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
        {Object.entries(headers).map(([key, value]) => {
          const isStandard = defaultKeys.includes(key.toLowerCase());
          return (
            <div key={key} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="w-1/3 min-w-[130px]">
                <span className="text-xs font-mono font-semibold text-slate-700 truncate block" title={key}>
                  {key}
                </span>
                {isStandard && (
                  <span className="text-[10px] text-blue-600 font-medium">Chase Required</span>
                )}
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => handleHeaderChange(key, e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              {!isStandard && (
                <button
                  type="button"
                  onClick={() => handleRemoveHeader(key)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  title="Remove header"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Header */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <input
          type="text"
          placeholder="Header Name (e.g. X-Chase-Client)"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="w-1/3 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800"
        />
        <input
          type="text"
          placeholder="Header Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800"
        />
        <button
          type="button"
          onClick={handleAddHeader}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Copy, Check, Download, ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  title?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, title = 'Response Data' }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `open-banking-response-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 font-mono">{title}</span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            id="btn-download-json"
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition flex items-center space-x-1"
            title="Download JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Download</span>
          </button>
          <button
            type="button"
            id="btn-copy-json"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition flex items-center space-x-1"
            title="Copy JSON"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy JSON</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 max-h-[500px] overflow-auto">
        <pre className="text-xs font-mono text-cyan-300 leading-relaxed whitespace-pre-wrap select-all">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};

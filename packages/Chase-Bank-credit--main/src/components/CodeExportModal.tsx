import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Download } from 'lucide-react';
import { ChaseHeaders } from '../types';
import {
  generateCurlCommand,
  generateFetchSnippet,
  generateAxiosSnippet,
  generatePythonSnippet,
  generateJavaSnippet,
  generateGoSnippet,
} from '../utils/helpers';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: string;
  url: string;
  token: string;
  headers: ChaseHeaders;
  body: string;
}

type LangOption = 'curl' | 'javascript' | 'typescript' | 'python' | 'java' | 'go';

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  method,
  url,
  token,
  headers,
  body,
}) => {
  const [selectedLang, setSelectedLang] = useState<LangOption>('curl');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let codeSnippet = '';
  let filename = 'snippet.txt';

  switch (selectedLang) {
    case 'curl':
      codeSnippet = generateCurlCommand(method, url, token, headers, body);
      filename = 'chase-pwp-request.sh';
      break;
    case 'javascript':
    case 'typescript':
      codeSnippet = generateFetchSnippet(method, url, token, headers, body);
      filename = 'chase-enrollment.ts';
      break;
    case 'python':
      codeSnippet = generatePythonSnippet(method, url, token, headers, body);
      filename = 'chase_enrollment.py';
      break;
    case 'java':
      codeSnippet = generateJavaSnippet(method, url, token, headers, body);
      filename = 'ChaseEnrollment.java';
      break;
    case 'go':
      codeSnippet = generateGoSnippet(method, url, token, headers, body);
      filename = 'main.go';
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeSnippet], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Export Ready-to-Run Code Snippet</h3>
              <p className="text-xs text-slate-500">Includes all Chase headers, Authorization Bearer, & Payload</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection Tabs */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { id: 'curl', label: 'cURL (CLI)' },
              { id: 'typescript', label: 'TypeScript / Fetch' },
              { id: 'python', label: 'Python (Requests)' },
              { id: 'java', label: 'Java (HttpClient)' },
              { id: 'go', label: 'Go (net/http)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedLang(tab.id as LangOption)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedLang === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-2.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download File
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 font-semibold transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950">
          <pre className="text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
            {codeSnippet}
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Remember to never commit live OAuth tokens to public repositories.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-xs font-medium text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CitiApiResponse } from '../types';
import { Terminal, Copy, Check, Send, Shield, Globe, RefreshCw, Code2 } from 'lucide-react';

interface ApiPlaygroundProps {
  data: CitiApiResponse | null;
  bearerToken: string;
  clientId: string;
  uuid: string;
  onFetchCustom: (nextStartIndex: string, cardId: string) => void;
  loading: boolean;
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({
  data,
  bearerToken,
  clientId,
  uuid,
  onFetchCustom,
  loading
}) => {
  const [nextStartIndex, setNextStartIndex] = useState('11');
  const [cardId, setCardId] = useState('44125873852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d');
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const curlCommand = `curl --request GET \\
  --url 'https://partner.citi.com/gcgapi/sandbox/prod/openapi/v1/accounts?nextStartIndex=${nextStartIndex}&cardId=${cardId}' \\
  --header 'Accept: application/json' \\
  --header 'Authorization: Bearer ${bearerToken ? bearerToken.substring(0, 20) + '...' : ''}' \\
  --header 'Content-Type: application/json' \\
  --header 'client_id: ${clientId}' \\
  --header 'uuid: ${uuid}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(`curl --request GET \\
  --url 'https://partner.citi.com/gcgapi/sandbox/prod/openapi/v1/accounts?nextStartIndex=${nextStartIndex}&cardId=${cardId}' \\
  --header 'Accept: application/json' \\
  --header 'Authorization: Bearer ${bearerToken}' \\
  --header 'Content-Type: application/json' \\
  --header 'client_id: ${clientId}' \\
  --header 'uuid: ${uuid}'`);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Citi API Sandbox Playground</h2>
            <p className="text-xs text-slate-500 mt-0.5">Test real API parameters, headers, and inspect JSON responses</p>
          </div>
        </div>
      </div>

      {/* Query Parameters Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-900 text-base">Request Test Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              nextStartIndex (Query Param)
            </label>
            <input
              type="text"
              value={nextStartIndex}
              onChange={(e) => setNextStartIndex(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              cardId (Query Param)
            </label>
            <input
              type="text"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onFetchCustom(nextStartIndex, cardId)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Execute API Request</span>
          </button>
        </div>
      </div>

      {/* cURL Command Generator */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Generated cURL Command</span>
          </div>
          <button
            onClick={handleCopyCurl}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1.5"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCurl ? 'Copied cURL!' : 'Copy cURL'}</span>
          </button>
        </div>
        
        <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-blue-300 overflow-x-auto leading-relaxed border border-slate-800">
          {curlCommand}
        </pre>
      </div>

      {/* JSON Response Viewer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">API Response JSON (200 OK)</span>
          </div>
          <button
            onClick={handleCopyJson}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1.5"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedJson ? 'Copied JSON!' : 'Copy JSON'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-[450px] leading-relaxed border border-slate-800">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

    </div>
  );
};

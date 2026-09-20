import React, { useState } from 'react';
import { RequestHeadersConfig } from '../types';
import { generateUUID } from '../utils';
import { KeyRound, RefreshCw, Eye, EyeOff, SlidersHorizontal, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface EnvConfigPanelProps {
  headers: RequestHeadersConfig;
  onChange: (updated: RequestHeadersConfig) => void;
  onRefreshFromEnv: () => void;
}

export const EnvConfigPanel: React.FC<EnvConfigPanelProps> = ({
  headers,
  onChange,
  onRefreshFromEnv,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleFieldChange = (field: keyof RequestHeadersConfig, value: string) => {
    onChange({
      ...headers,
      [field]: value,
    });
  };

  const handleRegenerateUUID = () => {
    handleFieldChange('uuid', generateUUID());
  };

  const copyEnvSnippet = () => {
    const snippet = `# Citi OpenAPI Configuration
CITI_API_URL="${headers.apiUrl}"
CITI_CLIENT_ID="${headers.clientId}"
CITI_UUID="${headers.uuid}"
CITI_BEARER_TOKEN="${headers.bearerToken}"
CITI_ACCEPT="${headers.accept}"
CITI_CONTENT_TYPE="${headers.contentType}"`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div id="env-config-panel" className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all mb-6">
      <div
        className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">
                Environment Variables & Request Headers
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                client_id & uuid active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Configured from <code className="text-sky-400">.env</code> with instant overrides for testing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            id="copy-env-snippet-btn"
            type="button"
            onClick={copyEnvSnippet}
            className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-colors"
            title="Copy as .env configuration block"
          >
            {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedEnv ? 'Copied .env' : 'Copy .env'}
          </button>

          <button
            id="reload-env-btn"
            type="button"
            onClick={onRefreshFromEnv}
            className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-colors"
            title="Reload server .env"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            Reload Env
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-200"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Target Endpoint URL */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-slate-400 font-mono font-medium mb-1">
              CITI_API_URL (Endpoint)
            </label>
            <input
              id="input-api-url"
              type="text"
              value={headers.apiUrl}
              onChange={(e) => handleFieldChange('apiUrl', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="https://partner.citi.com/..."
            />
          </div>

          {/* Client ID */}
          <div>
            <label className="block text-slate-400 font-mono font-medium mb-1 flex items-center justify-between">
              <span>CITI_CLIENT_ID (Header: client_id)</span>
            </label>
            <input
              id="input-client-id"
              type="text"
              value={headers.clientId}
              onChange={(e) => handleFieldChange('clientId', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI"
            />
          </div>

          {/* UUID */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-mono font-medium">
                CITI_UUID (Header: uuid)
              </label>
              <button
                id="btn-regen-uuid"
                type="button"
                onClick={handleRegenerateUUID}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-sans"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                New UUID
              </button>
            </div>
            <input
              id="input-uuid"
              type="text"
              value={headers.uuid}
              onChange={(e) => handleFieldChange('uuid', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="4fd8eb84-cf25-4be1-ab36-e52c7fc8cb52"
            />
          </div>

          {/* Bearer Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-mono font-medium">
                CITI_BEARER_TOKEN (Authorization)
              </label>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-sans"
              >
                {showToken ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <input
                id="input-bearer-token"
                type={showToken ? 'text' : 'password'}
                value={headers.bearerToken}
                onChange={(e) => handleFieldChange('bearerToken', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Optional Bearer token or OAuth access token"
              />
            </div>
          </div>

          {/* Accept */}
          <div>
            <label className="block text-slate-400 font-mono font-medium mb-1">
              CITI_ACCEPT (Header: Accept)
            </label>
            <input
              id="input-accept"
              type="text"
              value={headers.accept}
              onChange={(e) => handleFieldChange('accept', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Content-Type */}
          <div>
            <label className="block text-slate-400 font-mono font-medium mb-1">
              CITI_CONTENT_TYPE (Header: Content-Type)
            </label>
            <input
              id="input-content-type"
              type="text"
              value={headers.contentType}
              onChange={(e) => handleFieldChange('contentType', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center text-slate-400 text-[11px] p-2 rounded-lg bg-slate-950 border border-slate-800">
            <KeyRound className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
            <span>
              Calls are proxied via secure backend API route so credentials remain safe and bypass browser CORS limits.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

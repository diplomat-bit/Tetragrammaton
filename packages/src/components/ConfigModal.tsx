import React, { useState, useEffect } from 'react';
import { X, KeyRound, Shield, Terminal, Check, Sparkles, AlertCircle, Copy, FileCode, RefreshCw } from 'lucide-react';
import { ApiConfig } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiConfig: ApiConfig;
  onSaveConfig: (newConfig: ApiConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  apiConfig,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<ApiConfig>({ ...apiConfig });
  const [curlInput, setCurlInput] = useState('');
  const [parseStatus, setParseStatus] = useState<string | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [isReloadingEnv, setIsReloadingEnv] = useState(false);

  useEffect(() => {
    setFormData({ ...apiConfig });
  }, [apiConfig]);

  if (!isOpen) return null;

  // Auto parser for pasted cURL command
  const handleParseCurl = () => {
    if (!curlInput.trim()) return;

    try {
      const urlMatch = curlInput.match(/--url\s+['"]([^'"]+)['"]/i) || curlInput.match(/curl\s+['"]?([^'"\s]+)/i);
      const authMatch = curlInput.match(/Authorization:\s*Bearer\s*([^'"\r\n\\]+)/i);
      const clientIdMatch = curlInput.match(/client_id:\s*([^'"\r\n\\]+)/i);
      const uuidMatch = curlInput.match(/uuid:\s*([^'"\r\n\\]+)/i);

      const updated = { ...formData };
      let parsedFields = 0;

      if (urlMatch && urlMatch[1]) {
        updated.url = urlMatch[1].trim();
        parsedFields++;
      }
      if (authMatch && authMatch[1]) {
        updated.bearerToken = authMatch[1].trim();
        parsedFields++;
      }
      if (clientIdMatch && clientIdMatch[1]) {
        updated.clientId = clientIdMatch[1].trim();
        parsedFields++;
      }
      if (uuidMatch && uuidMatch[1]) {
        updated.uuid = uuidMatch[1].trim();
        parsedFields++;
      }

      setFormData(updated);
      setParseStatus(`Successfully extracted ${parsedFields} parameter(s) from cURL command!`);
      setTimeout(() => setParseStatus(null), 3500);
    } catch (err: any) {
      setParseStatus('Failed to parse cURL snippet format.');
      setTimeout(() => setParseStatus(null), 3000);
    }
  };

  const handleReloadEnv = async () => {
    setIsReloadingEnv(true);
    try {
      const res = await fetch('/api/citi/config');
      if (res.ok) {
        const envData = await res.json();
        const updated: ApiConfig = {
          ...formData,
          url: envData.url || formData.url,
          clientId: envData.clientId || formData.clientId,
          uuid: envData.uuid || formData.uuid,
          hasEnvToken: Boolean(envData.hasEnvToken),
          maskedToken: envData.maskedToken || '',
          configuredVars: envData.configuredVars || {},
          autoRefreshInterval: envData.autoRefreshInterval ?? formData.autoRefreshInterval,
          isEnvLoaded: true,
        };
        setFormData(updated);
        setParseStatus('Reloaded server-side environment variables!');
        setTimeout(() => setParseStatus(null), 3000);
      }
    } catch (e) {
      setParseStatus('Failed to reload .env configuration.');
      setTimeout(() => setParseStatus(null), 3000);
    } finally {
      setIsReloadingEnv(false);
    }
  };

  const envSampleSnippet = `# Citi Partner API Environment Configuration (.env)
CITI_BEARER_TOKEN="${formData.bearerToken || ''}"
CITI_CLIENT_ID="${formData.clientId || '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI'}"
CITI_UUID="${formData.uuid || 'fff161be-9ca1-4e25-8d83-e2191868d7e8'}"
CITI_API_URL="${formData.url || 'https://partner.citi.com/gcgapi/sandbox/prod/api/accounts/account-transactions/partner/v1/accounts/details'}"
CITI_ENVIRONMENT="sandbox"
AUTO_REFRESH_INTERVAL="${formData.autoRefreshInterval || 0}"`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSampleSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052FF] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1E293B] text-base">Citi Partner API & Environment Config</h3>
              <p className="text-xs text-[#64748B]">Real-time credentials, .env variables & endpoint proxy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8F9FB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Environment Variables Overview Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#0052FF]" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">.env Environment Detection</span>
              </div>
              <button
                type="button"
                onClick={handleReloadEnv}
                disabled={isReloadingEnv}
                className="text-[11px] text-[#0052FF] hover:text-[#0040CC] font-semibold flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isReloadingEnv ? 'animate-spin' : ''}`} />
                <span>Sync .env</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-white px-2.5 py-1.5 rounded-md border border-slate-200 text-center">
                <span className="block text-[10px] text-slate-500 font-mono">CITI_BEARER_TOKEN</span>
                <span className={`text-[11px] font-bold ${formData.hasEnvToken || formData.bearerToken ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {formData.hasEnvToken ? 'Active in .env' : formData.bearerToken ? 'Set in UI' : 'Missing'}
                </span>
              </div>

              <div className="bg-white px-2.5 py-1.5 rounded-md border border-slate-200 text-center">
                <span className="block text-[10px] text-slate-500 font-mono">CITI_CLIENT_ID</span>
                <span className="text-[11px] font-bold text-slate-700 font-mono">
                  {formData.clientId ? 'Loaded' : 'Default'}
                </span>
              </div>

              <div className="bg-white px-2.5 py-1.5 rounded-md border border-slate-200 text-center">
                <span className="block text-[10px] text-slate-500 font-mono">CITI_UUID</span>
                <span className="text-[11px] font-bold text-slate-700 font-mono">
                  {formData.uuid ? 'Loaded' : 'Default'}
                </span>
              </div>

              <div className="bg-white px-2.5 py-1.5 rounded-md border border-slate-200 text-center">
                <span className="block text-[10px] text-slate-500 font-mono">CITI_API_URL</span>
                <span className="text-[11px] font-bold text-slate-700 font-mono">
                  {formData.url ? 'Loaded' : 'Default'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Paste cURL Helper */}
          <div className="bg-[#F8F9FB] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B]">
                <Terminal className="w-3.5 h-3.5 text-[#0052FF]" />
                <span>Quick Paste cURL Request</span>
              </div>
              <span className="text-[11px] text-[#64748B]">Auto-populates headers & URL</span>
            </div>
            <textarea
              rows={2}
              placeholder={`curl --request GET \\\n  --url 'https://partner.citi.com/gcgapi/sandbox/prod/api/accounts/account-transactions/partner/v1/accounts/details' \\\n  --header 'Authorization: Bearer <YOUR_TOKEN>' \\\n  --header 'client_id: 8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI' \\\n  --header 'uuid: fff161be-9ca1-4e25-8d83-e2191868d7e8'`}
              value={curlInput}
              onChange={(e) => setCurlInput(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2 text-xs font-mono text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0052FF]"
            />
            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={handleParseCurl}
                className="bg-[#0052FF] hover:bg-[#0040CC] text-white px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Parse cURL Headers</span>
              </button>
              {parseStatus && (
                <span className="text-xs text-emerald-600 font-medium">{parseStatus}</span>
              )}
            </div>
          </div>

          {/* Bearer Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                Authorization Bearer Token
              </label>
              {formData.hasEnvToken && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-semibold border border-emerald-200">
                  ENV: {formData.maskedToken}
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder={formData.hasEnvToken ? `(Using CITI_BEARER_TOKEN from .env: ${formData.maskedToken})` : "e.g. AAIkOGJKVjVBdTdCODBMMHlVaG1tTmNDem5hVEpLVkNZS0np..."}
              value={formData.bearerToken}
              onChange={(e) => setFormData({ ...formData, bearerToken: e.target.value })}
              className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-mono text-[#1E293B] focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]"
            />
            <p className="text-[11px] text-[#64748B] mt-1">
              You can set this in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">CITI_BEARER_TOKEN</code> in your <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">.env</code> file or paste it directly above.
            </p>
          </div>

          {/* Endpoint URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
              Citi API Endpoint URL (CITI_API_URL)
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-mono text-[#1E293B] focus:outline-none focus:border-[#0052FF]"
            />
          </div>

          {/* Client ID and UUID in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                Client ID (CITI_CLIENT_ID)
              </label>
              <input
                type="text"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-mono text-[#1E293B] focus:outline-none focus:border-[#0052FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                Request UUID (CITI_UUID)
              </label>
              <input
                type="text"
                value={formData.uuid}
                onChange={(e) => setFormData({ ...formData, uuid: e.target.value })}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-mono text-[#1E293B] focus:outline-none focus:border-[#0052FF]"
              />
            </div>
          </div>

          {/* Copyable .env format box */}
          <div className="p-3 bg-slate-900 rounded-lg text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300">.env File Definition</span>
              <button
                type="button"
                onClick={handleCopyEnv}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedEnv ? 'Copied!' : 'Copy .env variables'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre p-2 bg-black/40 rounded border border-slate-800">
              {envSampleSnippet}
            </pre>
          </div>

          {/* Security & Sandbox Info banner */}
          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
            <Shield className="w-4 h-4 text-[#0052FF] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#0052FF]">Secure Server Proxy: </span>
              All credentials in <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-950 font-mono">.env</code> and bearer tokens are kept on the Node server and proxied directly to the Citi Partner Gateway.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8F9FB] rounded-lg text-xs font-semibold text-[#475569] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply & Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


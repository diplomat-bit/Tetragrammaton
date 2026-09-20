import React, { useState } from 'react';
import { X, Key, Copy, Check, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { ApiConfig } from '../types';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSave: (newConfig: ApiConfig) => void;
  onFetchLive: (customConfig?: ApiConfig) => void;
  isLoading: boolean;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onFetchLive,
  isLoading,
}) => {
  const [formData, setFormData] = useState<ApiConfig>(config);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const curlCommand = `curl --request GET \\
  --url '${formData.url}' \\
  --header 'Accept: application/json' \\
  --header 'Authorization: Bearer ${formData.bearerToken ? formData.bearerToken.trim() : '<YOUR_BEARER_TOKEN>'}' \\
  --header 'Content-Type: application/json' \\
  --header 'client_id: ${formData.clientId}' \\
  --header 'uuid: ${formData.uuid}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleSaveAndFetch = () => {
    onSave(formData);
    onFetchLive(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#1E293B]">Citi Partner API Authentication</h3>
              <p className="text-xs text-[#64748B]">Provide your Bearer token and headers for sandbox or production</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, mode: 'sandbox_demo' })}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                formData.mode === 'sandbox_demo'
                  ? 'bg-white text-[#0052FF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Citi Sandbox Dataset
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, mode: 'live' })}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                formData.mode === 'live'
                  ? 'bg-[#0052FF] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Live Citi API Gateway
            </button>
          </div>

          {/* Bearer Token Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                Authorization Bearer Token <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-[#64748B]">Omit or include "Bearer"</span>
            </div>
            <textarea
              rows={3}
              value={formData.bearerToken}
              onChange={(e) => setFormData({ ...formData, bearerToken: e.target.value })}
              placeholder="e.g. eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full text-xs font-mono p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] bg-[#F8F9FB] text-[#1E293B]"
            />
          </div>

          {/* Endpoint URL */}
          <div>
            <label className="text-xs font-bold text-[#1E293B] uppercase tracking-wider block mb-1.5">
              Citi Partner Endpoint URL
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full text-xs font-mono p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#0052FF] bg-[#F8F9FB] text-[#1E293B]"
            />
          </div>

          {/* Client ID & UUID in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#1E293B] uppercase tracking-wider block mb-1.5">
                Client ID (Header)
              </label>
              <input
                type="text"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full text-xs font-mono p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#0052FF] bg-[#F8F9FB] text-[#1E293B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1E293B] uppercase tracking-wider block mb-1.5">
                UUID (Header)
              </label>
              <input
                type="text"
                value={formData.uuid}
                onChange={(e) => setFormData({ ...formData, uuid: e.target.value })}
                className="w-full text-xs font-mono p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#0052FF] bg-[#F8F9FB] text-[#1E293B]"
              />
            </div>
          </div>

          {/* cURL command preview */}
          <div className="bg-[#1E293B] rounded-lg p-3.5 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-mono">
                <Terminal className="w-3.5 h-3.5 text-[#0052FF]" />
                <span>Generated cURL Command</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCurl}
                className="text-xs flex items-center gap-1 text-[#94A3B8] hover:text-white transition-colors"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 bg-[#0F172A] rounded border border-slate-700/60 leading-relaxed whitespace-pre-wrap break-all">
              {curlCommand}
            </pre>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Bearer tokens are securely proxied via server-side endpoint with zero client exposure.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8F9FB] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#1E293B] hover:bg-[#E2E8F0]/60 transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSave(formData);
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-gray-50 transition-colors shadow-xs"
            >
              Save Credentials
            </button>
            <button
              type="button"
              onClick={handleSaveAndFetch}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0052FF] hover:bg-[#0045D8] text-white transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>{isLoading ? 'Pulling Accounts...' : 'Save & Fetch Balances'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

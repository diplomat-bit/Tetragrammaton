import React, { useState } from 'react';
import { X, Key, Shield, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';

interface TokenConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  bearerToken: string;
  setBearerToken: (token: string) => void;
  clientId: string;
  setClientId: (id: string) => void;
  uuid: string;
  setUuid: (uuid: string) => void;
  onSaveAndTest: () => void;
}

export const TokenConfigModal: React.FC<TokenConfigModalProps> = ({
  isOpen,
  onClose,
  bearerToken,
  setBearerToken,
  clientId,
  setClientId,
  uuid,
  setUuid,
  onSaveAndTest
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleToken = "NmU5MDRkMjI2NDhhNWU0MzIyZGZhOTQ1OWZkNmQyNmJkYWViYzMwMzk1MWRhOGFiMDdkYTFkNDQ1MWRiYjRjODI3ZTE5YzIyMjJiNmY4NWZmNTdkOWNkMjM1ZDliMTdjZTEyZDc4NTkyYmNiYmU3NjllNzE4ZGJlMjM1NDcwNGMxYmRmOTg5ZWQ2YmE1MDZhY2VjNjJiOWY5NzE3YjJjZDY4ZDQyNGI4MDc1ZGM5NzdkMzU0ZjBhYWM3NmY5YWFmZjMwMzVkZjJiMjI5MTI1MjEzZDQzY2FkMjVkMWY2ZjcxYjkyMDMyMDAyOWRlNTAyOTU0YmFiMWI2ZGU4ODFmNw==";

  const handleCopyDefault = () => {
    setBearerToken(sampleToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Citi API Credentials & Bearer Token</h3>
              <p className="text-xs text-slate-400">Configure authentication headers for sandbox API calls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Authorization Bearer Token
              </label>
              <button
                onClick={handleCopyDefault}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied default token!' : 'Use default sandbox token'}</span>
              </button>
            </div>
            <textarea
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              rows={3}
              placeholder="Paste your base64 encoded bearer token here..."
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            />
            <p className="text-xs text-slate-500 mt-1">
              Passed in the header as <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">Authorization: Bearer &lt;token&gt;</code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI"
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                UUID Header
              </label>
              <input
                type="text"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                placeholder="6852c556-7a5b-418a-95d1-90a0014c0b70"
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3 text-sm text-blue-900">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-950">Secure Server Proxy</p>
              <p className="text-xs text-blue-800 mt-0.5">
                Your credentials are securely sent to the backend proxy route (<code className="bg-blue-100 px-1 py-0.5 rounded">/api/citi/accounts</code>) to query Citi Sandbox API without browser CORS restrictions.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSaveAndTest();
              onClose();
            }}
            className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Save & Fetch Accounts</span>
          </button>
        </div>

      </div>
    </div>
  );
};

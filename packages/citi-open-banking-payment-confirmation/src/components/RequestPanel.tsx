import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Copy,
  Check,
  Eye,
  EyeOff,
  User,
  Building,
  KeyRound,
  Globe,
  Sliders,
  Layers,
} from 'lucide-react';
import { RequestConfig, DebtorAccount } from '../types';
import { SAMPLE_PRESETS, buildConsentPayload, buildCurlCommand, DEFAULT_CITI_ENDPOINT } from '../utils/openBanking';

interface RequestPanelProps {
  config: RequestConfig;
  onChangeConfig: (newConfig: Partial<RequestConfig>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: typeof SAMPLE_PRESETS[0]) => void;
}

export const RequestPanel: React.FC<RequestPanelProps> = ({
  config,
  onChangeConfig,
  onSubmit,
  isLoading,
  onSelectPreset,
}) => {
  const [showToken, setShowToken] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'bodyJson' | 'curl'>('form');

  const currentPayload = config.bodyJson
    ? JSON.parse(config.bodyJson)
    : buildConsentPayload(config.debtorAccount, config.expirationHours);

  const curlString = buildCurlCommand({
    url: config.url,
    method: config.method,
    token: config.token,
    financialId: config.financialId,
    body: currentPayload,
  });

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlString);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleDebtorChange = (field: keyof DebtorAccount, value: string) => {
    const updated = {
      ...config.debtorAccount,
      [field]: value,
    };
    onChangeConfig({
      debtorAccount: updated,
      // Clear custom body JSON if user switches back to editing visual form
      bodyJson: undefined,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Panel Top Header */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-white">Open Banking Request Configuration</h2>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Presets:</span>
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              id={`btn-preset-${idx}`}
              onClick={() => onSelectPreset(preset)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition whitespace-nowrap ${
                config.debtorAccount.Name === preset.debtorAccount.Name
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-300 font-medium'
                  : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
              }`}
            >
              {preset.debtorAccount.Name} ({preset.debtorAccount.SchemeName.split('.').pop()})
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Core Credentials Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Access Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                <span>Bearer Access Token</span>
                <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center space-x-1"
              >
                {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showToken ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showToken ? 'text' : 'password'}
              id="input-access-token"
              value={config.token}
              onChange={(e) => onChangeConfig({ token: e.target.value })}
              placeholder="e.g. eyJhbGciOiJSUzI1NiIs..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Financial ID */}
          <div>
            <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5 mb-1">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>Financial ID (x-fapi-financial-id)</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              id="input-financial-id"
              value={config.financialId}
              onChange={(e) => onChangeConfig({ financialId: e.target.value })}
              placeholder="e.g. citi-sandbox-fid-001"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* URL and Method */}
        <div>
          <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5 mb-1">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Banking Endpoint URL</span>
          </label>
          <div className="flex rounded-xl overflow-hidden border border-slate-800 bg-slate-950 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <select
              id="select-http-method"
              value={config.method}
              onChange={(e) => onChangeConfig({ method: e.target.value as any })}
              className="bg-slate-900 text-blue-400 font-mono font-bold text-xs px-3 py-2 border-r border-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
            <input
              type="text"
              id="input-endpoint-url"
              value={config.url}
              onChange={(e) => onChangeConfig({ url: e.target.value })}
              placeholder={DEFAULT_CITI_ENDPOINT}
              className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Sub Navigation / Tabs for Payload */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
          <div className="flex border-b border-slate-800 bg-slate-900/70 px-3 pt-2">
            <button
              type="button"
              id="tab-debtor-form"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition -mb-px flex items-center space-x-1.5 ${
                activeTab === 'form'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Debtor Account Form</span>
            </button>
            <button
              type="button"
              id="tab-body-json"
              onClick={() => setActiveTab('bodyJson')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition -mb-px flex items-center space-x-1.5 ${
                activeTab === 'bodyJson'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Raw JSON Payload</span>
            </button>
            <button
              type="button"
              id="tab-view-curl"
              onClick={() => setActiveTab('curl')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition -mb-px flex items-center space-x-1.5 ml-auto ${
                activeTab === 'curl'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>cURL Preview</span>
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'form' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Account Name */}
                <div>
                  <label className="text-slate-400 block mb-1">Account Holder (Name)</label>
                  <input
                    type="text"
                    id="input-debtor-name"
                    value={config.debtorAccount.Name}
                    onChange={(e) => handleDebtorChange('Name', e.target.value)}
                    placeholder="e.g. James"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Scheme Name */}
                <div>
                  <label className="text-slate-400 block mb-1">Scheme Name</label>
                  <select
                    id="select-scheme-name"
                    value={config.debtorAccount.SchemeName}
                    onChange={(e) => handleDebtorChange('SchemeName', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="UK.OBIE.BBAN">UK.OBIE.BBAN</option>
                    <option value="UK.OBIE.IBAN">UK.OBIE.IBAN</option>
                    <option value="UK.OBIE.SortCodeAccountNumber">UK.OBIE.SortCodeAccountNumber</option>
                    <option value="UK.OBIE.PAN">UK.OBIE.PAN</option>
                  </select>
                </div>

                {/* Identification / IBAN / Account */}
                <div>
                  <label className="text-slate-400 block mb-1">Identification (IBAN/Account)</label>
                  <input
                    type="text"
                    id="input-debtor-id"
                    value={config.debtorAccount.Identification}
                    onChange={(e) => handleDebtorChange('Identification', e.target.value)}
                    placeholder="e.g. GB29CITI60161331926819"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Secondary Identification (Roll Number) */}
                <div>
                  <label className="text-slate-400 block mb-1">Secondary ID (Roll Number)</label>
                  <input
                    type="text"
                    id="input-debtor-secondary"
                    value={config.debtorAccount.SecondaryIdentification || ''}
                    onChange={(e) => handleDebtorChange('SecondaryIdentification', e.target.value)}
                    placeholder="e.g. ROLL-882910"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'bodyJson' && (
              <div>
                <textarea
                  id="textarea-body-json"
                  rows={6}
                  value={
                    config.bodyJson !== undefined
                      ? config.bodyJson
                      : JSON.stringify(currentPayload, null, 2)
                  }
                  onChange={(e) => onChangeConfig({ bodyJson: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-blue-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeTab === 'curl' && (
              <div className="relative">
                <pre className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                  {curlString}
                </pre>
                <button
                  type="button"
                  id="btn-copy-curl"
                  onClick={handleCopyCurl}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] flex items-center space-x-1 shadow"
                >
                  {copiedCurl ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy cURL</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Execution Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                config.simulationMode ? 'bg-blue-400' : 'bg-emerald-400'
              }`}
            />
            <span>
              Target:{' '}
              <strong className="text-slate-200">
                {config.simulationMode ? 'Sandbox Simulation Environment' : 'Live Citi Gateway Proxy'}
              </strong>
            </span>
          </div>

          <button
            type="button"
            id="btn-execute-request"
            onClick={onSubmit}
            disabled={isLoading || !config.token || !config.financialId}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Executing Open Banking Request...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Execute & Pull Confirmation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

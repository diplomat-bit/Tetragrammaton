import React from 'react';
import { 
  Building2, 
  RefreshCw, 
  Key, 
  Code, 
  FileSpreadsheet, 
  Layers, 
  BarChart3, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ApiConfig, ApiResponseInfo } from '../types';

interface NavbarProps {
  apiConfig: ApiConfig;
  setApiConfig: React.Dispatch<React.SetStateAction<ApiConfig>>;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenConfigModal: () => void;
  onOpenRawModal: () => void;
  onOpenExportModal: () => void;
  lastResponseInfo: ApiResponseInfo | null;
  lastSyncedAt: Date | null;
  activeTab: 'dashboard' | 'transactions' | 'analytics' | 'api-response';
  setActiveTab: (tab: 'dashboard' | 'transactions' | 'analytics' | 'api-response') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  apiConfig,
  setApiConfig,
  isLoading,
  onRefresh,
  onOpenConfigModal,
  onOpenRawModal,
  onOpenExportModal,
  lastResponseInfo,
  lastSyncedAt,
  activeTab,
  setActiveTab,
}) => {
  const hasActiveToken = Boolean(apiConfig.bearerToken || apiConfig.hasEnvToken);
  const tokenLabel = apiConfig.bearerToken 
    ? `TOKEN: ...${apiConfig.bearerToken.trim().slice(-6)}`
    : apiConfig.hasEnvToken 
      ? `ENV TOKEN: ${apiConfig.maskedToken || 'ACTIVE'}`
      : 'NO TOKEN SET';

  return (
    <nav className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-xs z-30 sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#0052FF] rounded-lg flex items-center justify-center shadow-xs">
          <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-xl tracking-tight text-[#1A1C1E]">
            Citi<span className="text-[#0052FF]">Pulse</span>
          </span>
          <span className="text-[#64748B] font-normal text-sm hidden sm:inline">Connect</span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 ml-6 bg-[#F8F9FB] p-1 rounded-lg border border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#0052FF] shadow-xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'transactions'
                ? 'bg-white text-[#0052FF] shadow-xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-[#0052FF] shadow-xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('api-response')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'api-response'
                ? 'bg-white text-[#0052FF] shadow-xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <span>API Response</span>
            {lastResponseInfo && (
              <span
                className={`w-2 h-2 rounded-full ${
                  lastResponseInfo.status >= 200 && lastResponseInfo.status < 300
                    ? 'bg-emerald-500'
                    : 'bg-rose-500'
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Right Header Status and Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Token status badge */}
        <button
          onClick={onOpenConfigModal}
          className="flex items-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] px-3 py-1.5 rounded-md border border-[#E2E8F0] transition-colors cursor-pointer"
          title="Click to view API & .env configuration"
        >
          <div className={`w-2 h-2 rounded-full ${hasActiveToken ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
          <span className="text-xs font-mono text-[#475569]">
            {tokenLabel}
          </span>
        </button>

        {/* Auto Refresh dropdown */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#64748B] bg-[#F8F9FB] px-2.5 py-1.5 rounded-md border border-[#E2E8F0]">
          <Clock className="w-3.5 h-3.5" />
          <span>Auto:</span>
          <select
            aria-label="Auto Refresh Interval"
            value={apiConfig.autoRefreshInterval}
            onChange={(e) =>
              setApiConfig((prev) => ({
                ...prev,
                autoRefreshInterval: Number(e.target.value),
              }))
            }
            className="bg-transparent text-[#1E293B] font-semibold focus:outline-none cursor-pointer"
          >
            <option value={0}>Off</option>
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
          </select>
        </div>

        {/* Pull / Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-[#0052FF] hover:bg-[#0045D8] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
          title="Pull real-time balances from Citi endpoint"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Pull Balances</span>
        </button>

        {/* Raw JSON trigger */}
        <button
          onClick={onOpenRawModal}
          className="p-1.5 rounded-md border border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F9FB] transition-colors"
          title="View raw Citi API payload"
        >
          <Code className="w-4 h-4" />
        </button>

        {/* User / Environment badge */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
          <div className="text-right">
            <p className="text-xs font-medium text-[#1E293B]">
              {apiConfig.mode === 'live' ? 'Citi Partner Live' : 'Citi Sandbox'}
            </p>
            <p className="text-[10px] text-[#64748B] uppercase tracking-wider">
              {lastResponseInfo?.latencyMs ? `${lastResponseInfo.latencyMs}ms Gateway` : 'Verified API'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#E2E8F0] border-2 border-white shadow-xs flex items-center justify-center text-[#475569] font-bold text-xs">
            CP
          </div>
        </div>
      </div>
    </nav>
  );
};

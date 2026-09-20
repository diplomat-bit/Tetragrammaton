import React from 'react';
import {
  Building2,
  Key,
  ShieldCheck,
  ShieldAlert,
  Bot,
  FileSpreadsheet,
  Coins,
  RefreshCw,
  SlidersHorizontal,
  Lock,
  Activity,
  Terminal,
} from 'lucide-react';
import { ConfigStatus } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  configStatus: ConfigStatus | null;
  onOpenCredentials: () => void;
  onOpenTelemetry: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  configStatus,
  onOpenCredentials,
  onOpenTelemetry,
  onRefresh,
  isRefreshing,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Executive Cockpit', icon: Building2 },
    { id: 'obp', label: 'Open Bank Project (OBP)', icon: Key },
    { id: 'commercial-paper', label: 'Commercial Paper Desk', icon: Coins, badge: 'First CP App' },
    { id: 'modern-treasury', label: 'Modern Treasury', icon: FileSpreadsheet },
    { id: 'quantum-assistant', label: 'Quantum Assistant', icon: Bot, badge: 'AI Copilot' },
    { id: 'developer-guide', label: 'API Guide & Docs', icon: Lock },
  ];

  return (
    <header className="bg-white/5 backdrop-blur-2xl border-b border-white/10 text-white sticky top-0 z-40 shadow-2xl shadow-black/20">
      {/* Top corporate bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 border border-white/30 shadow-lg shadow-blue-500/25">
              <span className="text-white font-black text-xl tracking-tighter">citi</span>
              {/* Signature Citi Red Arc Accent */}
              <div className="absolute -top-1 right-1 w-3.5 h-3.5 rounded-full border-t-2 border-r-2 border-red-400 transform rotate-12" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
                  Citibank Demo Business
                </span>
                <span className="bg-white/10 text-cyan-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-white/15 backdrop-blur-md">
                  OBP v5.1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Commercial Paper • Modern Treasury • Quantum AI
              </p>
            </div>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Live API Telemetry & Response Inspector Button */}
            <button
              onClick={onOpenTelemetry}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 backdrop-blur-md transition-all shadow-sm shadow-cyan-500/10"
              title="Click to view live API request and response telemetry for all calls"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">Live Telemetry & Responses</span>
              <span className="sm:hidden">Telemetry</span>
            </button>

            {/* OBP Consumer Key Status */}
            <button
              onClick={onOpenCredentials}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all shadow-sm ${
                configStatus?.hasConsumerKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`}
              title="Click to view & configure Open Bank Project Consumer Credentials"
            >
              {configStatus?.hasConsumerKey ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="hidden md:inline">
                {configStatus?.hasConsumerKey ? `Key: ${configStatus.consumerKeyMasked || 'Active'}` : 'Set Consumer Key'}
              </span>
              <span className="md:hidden">
                {configStatus?.hasConsumerKey ? 'Key Active' : 'Key'}
              </span>
            </button>

            {/* Direct Login Status Badge */}
            <div
              className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border backdrop-blur-md ${
                configStatus?.sessionLoggedIn
                  ? 'bg-blue-500/15 text-cyan-300 border-blue-400/30'
                  : 'bg-white/5 text-slate-300 border-white/10'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  configStatus?.sessionLoggedIn ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span>{configStatus?.sessionLoggedIn ? `Auth: ${configStatus.sessionUsername || 'Active'}` : 'Sandbox Ready'}</span>
            </div>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 rounded-xl border border-white/10 backdrop-blur-md transition-all shadow-sm"
              title="Refresh Bank Accounts and Ledgers"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Configure Credentials Button */}
            <button
              onClick={onOpenCredentials}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-lg shadow-blue-600/30 transition-all border border-white/20 backdrop-blur-md"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Credentials & Env</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="bg-white/[0.02] border-t border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20 shadow-md backdrop-blur-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md tracking-wide ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 font-extrabold'
                          : 'bg-white/10 text-slate-400 border border-white/10'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

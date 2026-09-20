import React from 'react';
import { Key, ShieldCheck, Terminal, Sparkles, RefreshCw, Layers, BarChart3, Wallet } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  isMockMode: boolean;
  onToggleMockMode: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  isMockMode,
  onToggleMockMode,
  onRefresh,
  loading
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl tracking-wider shadow-inner shadow-blue-400/40">
            citi
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg tracking-tight">Developer Workspace</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono border border-blue-500/30">
                Sandbox v1
              </span>
            </div>
            <p className="text-xs text-slate-400">Account Listing & Details API Playground</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard & Charts</span>
          </button>
          
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'accounts'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>All Accounts</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'playground'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>API Playground</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Advisor</span>
          </button>
        </nav>

        {/* Actions & Settings */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh accounts data"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            onClick={onToggleMockMode}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
              isMockMode 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isMockMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
            <span>{isMockMode ? 'Mock Sandbox' : 'Live Proxy Mode'}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg text-sm font-medium border border-slate-700 transition-all shadow-sm"
          >
            <Key className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Configure Token</span>
          </button>
        </div>

      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 px-2 py-2 bg-slate-950">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium ${activeTab === 'accounts' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          Accounts
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium ${activeTab === 'playground' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          Playground
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium ${activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          AI Advisor
        </button>
      </div>
    </header>
  );
};

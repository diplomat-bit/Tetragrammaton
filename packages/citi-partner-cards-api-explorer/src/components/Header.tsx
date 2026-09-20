import React from 'react';
import { CreditCard, ShieldCheck, Terminal, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onLoadDefaults: () => void;
  onClear: () => void;
  isMockActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLoadDefaults, onClear, isMockActive }) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">Citi Partner Cards</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                API Sandbox Explorer
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              REST Client for Open API v1 Partner Cards Management
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {isMockActive && (
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Showing Prompt Sample Response
            </span>
          )}

          <button
            id="btn-load-prompt-defaults"
            type="button"
            onClick={onLoadDefaults}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Load Prompt Curl</span> Preset
          </button>

          <button
            id="btn-clear-all"
            type="button"
            onClick={onClear}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>
    </header>
  );
};

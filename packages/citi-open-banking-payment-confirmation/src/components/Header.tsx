import React from 'react';
import { ShieldCheck, Server, Sparkles, Terminal, History, BookOpen, RefreshCw } from 'lucide-react';

interface HeaderProps {
  simulationMode: boolean;
  onToggleSimulation: (val: boolean) => void;
  onOpenCurlModal: () => void;
  onOpenHistory: () => void;
  onOpenDocs: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  simulationMode,
  onToggleSimulation,
  onOpenCurlModal,
  onOpenHistory,
  onOpenDocs,
  historyCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 font-bold text-white tracking-wider text-base">
              CB
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg tracking-tight text-white">Citi Open Banking</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-400/30">
                  v3.1 CBPII
                </span>
              </div>
              <p className="text-xs text-slate-400">Payment Confirmation & Account Balance Hub</p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center space-x-3">
            {/* Simulation / Live Toggle */}
            <div className="bg-slate-800/90 border border-slate-700/80 p-1 rounded-xl flex items-center shadow-inner">
              <button
                type="button"
                id="btn-mode-sandbox"
                onClick={() => onToggleSimulation(true)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  simulationMode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sandbox Sim</span>
              </button>
              <button
                type="button"
                id="btn-mode-live"
                onClick={() => onToggleSimulation(false)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !simulationMode
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Live Citi API</span>
              </button>
            </div>

            {/* Quick cURL Importer */}
            <button
              type="button"
              id="btn-open-curl-modal"
              onClick={onOpenCurlModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition shadow-sm"
              title="Import cURL command"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Import cURL</span>
            </button>

            {/* History Button */}
            <button
              type="button"
              id="btn-open-history"
              onClick={onOpenHistory}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition shadow-sm relative"
              title="View saved confirmations"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            {/* API Docs / Spec info */}
            <button
              type="button"
              id="btn-open-docs"
              onClick={onOpenDocs}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
              title="Open Banking API Specs & Guide"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

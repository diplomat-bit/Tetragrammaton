import React from 'react';
import { ShieldCheck, Activity, Terminal, Sparkles, HelpCircle, Server, Code2, History } from 'lucide-react';

interface HeaderProps {
  host: string;
  onHostChange: (host: string) => void;
  simulate: boolean;
  onToggleSimulate: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenCodeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  host,
  onHostChange,
  simulate,
  onToggleSimulate,
  onOpenHistory,
  historyCount,
  onOpenCodeModal,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
              <ShieldCheck className="w-6 h-6 text-blue-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-lg tracking-tight">Chase Pay With Points</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Loyalty API v1
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono hidden sm:block">
                POST /card/loyalty/earn-rewards/enrollment/v1/...
              </p>
            </div>
          </div>

          {/* Environment & Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Host Selector */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <Server className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <button
                type="button"
                onClick={() => onHostChange('api.chase.com')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  host === 'api.chase.com'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Production (api.chase.com)
              </button>
              <button
                type="button"
                onClick={() => onHostChange('api-sandbox.chase.com')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  host === 'api-sandbox.chase.com'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sandbox
              </button>
            </div>

            {/* Simulation Mode Toggle */}
            <button
              type="button"
              onClick={onToggleSimulate}
              title="Toggle between live HTTP call and realistic simulated Chase response"
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                simulate
                  ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-200/50'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${simulate ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Mock Mode:</span>
              <span className={`font-semibold ${simulate ? 'text-amber-700' : 'text-slate-500'}`}>
                {simulate ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Code Export Button */}
            <button
              type="button"
              onClick={onOpenCodeModal}
              title="View & copy cURL / Code snippets"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Snippets</span>
            </button>

            {/* History Button */}
            <button
              type="button"
              onClick={onOpenHistory}
              title="View past execution logs"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <History className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

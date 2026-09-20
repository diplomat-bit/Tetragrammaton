import { useState, useEffect } from 'react';
import { PieChart, Play, Plus, RefreshCw } from 'lucide-react';
import { alpacaRebalancingService, AlpacaPortfolio, AlpacaRebalanceRun } from '../../services/AlpacaRebalancingService';

export const AlpacaRebalancingView: React.FC = () => {
  const accountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
  const [portfolios, setPortfolios] = useState<AlpacaPortfolio[]>([]);
  const [runs, setRuns] = useState<AlpacaRebalanceRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await alpacaRebalancingService.getPortfolios();
      const r = await alpacaRebalancingService.getRuns(accountId);
      setPortfolios(p);
      setRuns(r);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerRebalance = async (portfolioId: string) => {
    setLoading(true);
    try {
      const run = await alpacaRebalancingService.createRun(portfolioId, accountId, 'full_rebalance');
      setStatusMsg(`Rebalance Run Triggered (Run ID: ${run.id}) - Status: ${run.status}`);
      loadData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-yellow-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <PieChart className="text-yellow-400" size={24} />
            Alpaca Portfolio Model & Automatic Rebalancing Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Model Allocations, Custom Cooldown Timers & Automated Execution Engine
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Portfolios */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <PieChart className="text-cyan-400" size={18} />
            Model Portfolios ({portfolios.length})
          </h3>

          <div className="space-y-3">
            {portfolios.map((p) => (
              <div key={p.id} className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-yellow-400">{p.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{p.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  {p.weights.map((w) => (
                    <div key={w.symbol} className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
                      <span className="font-mono text-cyan-300">{w.symbol}</span>
                      <span className="font-bold text-slate-200">{w.percent}%</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleTriggerRebalance(p.id)}
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition"
                >
                  <Play size={14} />
                  Trigger Manual Account Rebalance
                </button>
              </div>
            ))}
          </div>

          {statusMsg && (
            <div className="p-3 bg-slate-950 rounded border border-yellow-500/30 text-xs text-yellow-300 font-mono break-all">
              {statusMsg}
            </div>
          )}
        </div>

        {/* Rebalancing Runs Table */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <RefreshCw className="text-emerald-400" size={18} />
            Rebalance Execution History ({runs.length})
          </h3>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {runs.map((r) => (
              <div key={r.id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-cyan-400">{r.type}</span>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Run ID: {r.id.slice(0, 8)}...</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {r.status}
                </span>
              </div>
            ))}
            {runs.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No rebalance runs executed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlpacaRebalancingView;

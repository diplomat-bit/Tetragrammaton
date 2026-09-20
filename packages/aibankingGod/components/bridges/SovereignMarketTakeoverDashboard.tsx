import React from 'react';
import { ShieldAlert, Globe2, Landmark, Zap, TrendingUp, CheckCircle, Lock, ArrowUpRight, DollarSign } from 'lucide-react';

export const SovereignMarketTakeoverDashboard: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 text-slate-100">
      {/* Hero Takeover Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 rounded-2xl border border-yellow-500/30 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Globe2 size={240} className="text-yellow-400" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
              God-Protocol Market Takeover
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Sub-5ms Global Execution
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            Sovereign Liquidity Control Hub (Plaid + Stripe + Citi + Alpaca)
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Unifying Citibank Open Banking FAPI 2.0, Plaid Financial Connections, Stripe Treasury PaymentIntents, and Alpaca Broker API into an unstoppable, fully integrated financial engine.
          </p>
        </div>
      </div>

      {/* Primary Liquidity Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Alpaca Omnibus Balance</span>
          <span className="text-2xl font-mono font-black text-yellow-400">$1,452,900,000.00</span>
          <span className="text-[10px] text-emerald-400 font-mono block">Real-time Settlement Enabled</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Citi Treasury Pipeline</span>
          <span className="text-2xl font-mono font-black text-cyan-400">$850,000,000.00</span>
          <span className="text-[10px] text-cyan-400 font-mono block">ISO 20022 pacs.008 Active</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Plaid Verified ACH Rails</span>
          <span className="text-2xl font-mono font-black text-emerald-400">1,240 Linked Banks</span>
          <span className="text-[10px] text-emerald-400 font-mono block">Instant Processor Tokens</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Stripe Treasury Sweeps</span>
          <span className="text-2xl font-mono font-black text-purple-400">$320,500,000.00</span>
          <span className="text-[10px] text-purple-400 font-mono block">FC PaymentIntent Active</span>
        </div>
      </div>

      {/* Unified Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plaid Bridge Portal */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Zap size={16} />
                Plaid Link Bridge
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">LIVE</span>
            </div>
            <p className="text-xs text-slate-400">
              Instant bank account authentication with automated Alpaca Processor Token generation and ACH relationship assignment.
            </p>
          </div>
          <button
            onClick={() => onNavigate('PLAID_ALPACA_BRIDGE')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold py-2 rounded-lg text-xs border border-emerald-500/30 flex items-center justify-center gap-2 transition"
          >
            Open Plaid Bridge &rarr;
          </button>
        </div>

        {/* Stripe Bridge Portal */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-indigo-400 flex items-center gap-2">
                <DollarSign size={16} />
                Stripe FC Sweep Engine
              </h3>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">LIVE</span>
            </div>
            <p className="text-xs text-slate-400">
              Stripe Financial Connections + PaymentIntent sweep into Alpaca JNLC journals with automated ledger balancing.
            </p>
          </div>
          <button
            onClick={() => onNavigate('STRIPE_ALPACA_BRIDGE')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold py-2 rounded-lg text-xs border border-indigo-500/30 flex items-center justify-center gap-2 transition"
          >
            Open Stripe Bridge &rarr;
          </button>
        </div>

        {/* Citi Open Banking Portal */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                <Landmark size={16} />
                Citibank Open Banking
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">LIVE</span>
            </div>
            <p className="text-xs text-slate-400">
              Citibank UK International Open Banking FAPI 2.0 wires connected directly to Alpaca Correspondent Omnibus clearing.
            </p>
          </div>
          <button
            onClick={() => onNavigate('CITI_ALPACA_BRIDGE')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold py-2 rounded-lg text-xs border border-cyan-500/30 flex items-center justify-center gap-2 transition"
          >
            Open Citi Bridge &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SovereignMarketTakeoverDashboard;

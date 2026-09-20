import React from 'react';
import {
  Building2,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Bot,
  Zap,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertTriangle,
  ChevronRight,
  CreditCard,
  Layers,
} from 'lucide-react';
import { OBPAccount, CommercialPaperNote, ModernTreasuryLedger, OBPTransaction } from '../types';

interface DashboardTabProps {
  accounts: OBPAccount[];
  cpNotes: CommercialPaperNote[];
  mtLedger: ModernTreasuryLedger | null;
  transactions: OBPTransaction[];
  onNavigateTab: (tab: string) => void;
  onOpenTransferModal: (accountId?: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  accounts,
  cpNotes,
  mtLedger,
  transactions,
  onNavigateTab,
  onOpenTransferModal,
}) => {
  // Aggregate calculations
  const totalUsdCash = accounts.reduce((acc, a) => {
    return acc + (a.balance.currency === 'USD' ? parseFloat(a.balance.amount) : 0);
  }, 0);

  const activeCp = cpNotes.filter((n) => n.status === 'ACTIVE' || n.status === 'MATURING_SOON');
  const totalCpPar = activeCp.reduce((acc, n) => acc + n.faceValue, 0);
  const maturingSoonNote = cpNotes.find((n) => n.status === 'MATURING_SOON');

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if CP is maturing soon */}
      {maturingSoonNote && (
        <div className="bg-gradient-to-r from-amber-500/15 via-white/5 to-amber-500/10 border border-amber-400/30 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl shadow-amber-500/10">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Treasury Liquidity Alert
                </span>
                <span className="bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-md">
                  Matures in 48 Hours
                </span>
              </div>
              <p className="text-sm text-slate-200 mt-0.5">
                Commercial Paper <span className="font-mono font-semibold text-white">CUSIP {maturingSoonNote.cusip}</span> ($
                {maturingSoonNote.faceValue.toLocaleString()} Par) matures on {maturingSoonNote.maturityDate}.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onNavigateTab('commercial-paper')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 border border-amber-300/40"
            >
              <span>Manage Rollover</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cash */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Consolidated OBP Cash</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-cyan-300 border border-blue-400/30 backdrop-blur-md">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              ${totalUsdCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
              <span className="text-emerald-400 font-medium">4 accounts active</span>
              <span>across Citi & OBP</span>
            </p>
          </div>
        </div>

        {/* Commercial Paper Desk */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Commercial Paper Par</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              ${totalCpPar.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
              <span className="text-cyan-400 font-medium">{activeCp.length} active tranches</span>
              <span>• Avg Yield 4.92%</span>
            </p>
          </div>
        </div>

        {/* Modern Treasury Assets */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Modern Treasury Master</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              ${(mtLedger?.totalAssets || 23150000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pending Outflow: <span className="text-amber-300 font-medium">${(mtLedger?.pendingOutflow || 850000).toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Quantum AI Readiness */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Quantum Treasury AI</span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
              <span>Online</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gemini 3.7 Flash • Autonomous Copilot
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Accounts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active OBP Accounts List (2 Columns on large) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Open Bank Project Accounts</span>
              </h3>
              <p className="text-xs text-slate-400">
                Institutional operating, settlement, and virtual clearing accounts
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('obp')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
            >
              <span>View OBP Explorer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-white/20 hover:bg-white/[0.08] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-black/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{acc.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/10 backdrop-blur-md">
                      {acc.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
                    <span>Acc: ••••{acc.number.slice(-4)}</span>
                    <span>Routing: {acc.routing?.address || '021000089'}</span>
                    <span className="text-slate-500">({acc.bank_id})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-left sm:text-right">
                    <div className="text-base font-bold text-slate-100 font-mono">
                      {acc.balance.currency} {parseFloat(acc.balance.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">Available</span>
                  </div>

                  <button
                    onClick={() => onOpenTransferModal(acc.id)}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-cyan-300 hover:text-white border border-white/15 rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>Transfer</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Cross-Rail Activity Feed */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recent Treasury & OBP Activity</span>
              </h3>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden shadow-xl shadow-black/20">
              {transactions.slice(0, 4).map((tx) => {
                const isOutflow = tx.details.value.amount.startsWith('-');
                return (
                  <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-xl border backdrop-blur-md ${
                          isOutflow
                            ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
                            : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                        }`}
                      >
                        {isOutflow ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white line-clamp-1">
                          {tx.details.description}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                          <span>{tx.details.type}</span>
                          <span>•</span>
                          <span>{new Date(tx.details.posted).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isOutflow ? 'text-slate-200' : 'text-emerald-400'
                        }`}
                      >
                        {isOutflow ? '' : '+'}
                        {tx.details.value.currency}{' '}
                        {Math.abs(parseFloat(tx.details.value.amount)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Desk & Quantum Assistant Widget */}
        <div className="space-y-4">
          {/* Quick Action Station */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl shadow-black/20">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Institutional Quick Actions</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('commercial-paper')}
                className="w-full text-left p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Issue Commercial Paper
                    </div>
                    <div className="text-[11px] text-slate-400">Discount calculation & CUSIP placement</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-colors" />
              </button>

              <button
                onClick={() => onOpenTransferModal()}
                className="w-full text-left p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-blue-500/15 text-cyan-300 border border-blue-400/30 backdrop-blur-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Initiate OBP Wire / Payment
                    </div>
                    <div className="text-[11px] text-slate-400">Create transaction request on OBP</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab('modern-treasury')}
                className="w-full text-left p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      Modern Treasury Multi-Rail
                    </div>
                    <div className="text-[11px] text-slate-400">Fedwire, ACH & RTP execution</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-colors" />
              </button>
            </div>
          </div>

          {/* Quantum Copilot Mini Widget */}
          <div className="bg-gradient-to-br from-blue-600/15 via-white/5 to-cyan-600/15 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 space-y-3.5 shadow-2xl shadow-blue-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Bot className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Quantum Assistant</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/15 backdrop-blur-md">
                Gemini 3.7
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/5 backdrop-blur-md">
              "Net cash position is strong ($23.15M total). Notice CUSIP 172967AD7 maturing in 48 hours ($3.0M). I recommend rolling over into a 60-day tranche at 4.80% discount rate."
            </p>

            <button
              onClick={() => onNavigateTab('quantum-assistant')}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border border-white/20 rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25"
            >
              <span>Ask Quantum Assistant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

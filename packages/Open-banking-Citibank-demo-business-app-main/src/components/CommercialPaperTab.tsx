import React, { useState, useEffect } from 'react';
import {
  Coins,
  Calculator,
  PlusCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
  Building2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Percent,
  Calendar,
  Layers,
} from 'lucide-react';
import { CommercialPaperNote, OBPAccount } from '../types';
import { api } from '../services/api';

interface CommercialPaperTabProps {
  notes: CommercialPaperNote[];
  accounts: OBPAccount[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const CommercialPaperTab: React.FC<CommercialPaperTabProps> = ({
  notes,
  accounts,
  onRefresh,
  isRefreshing,
}) => {
  // Issuance Desk Form State
  const [faceValue, setFaceValue] = useState<number>(5000000);
  const [discountRate, setDiscountRate] = useState<number>(4.80);
  const [tenorDays, setTenorDays] = useState<number>(90);
  const [rating, setRating] = useState<'A-1+/P-1' | 'A-1/P-1' | 'Tier-1 Prime'>('A-1+/P-1');
  const [dealer, setDealer] = useState<string>('Citigroup Global Markets CP Desk');
  const [settlementAcc, setSettlementAcc] = useState<string>('citi-cp-settlement-9920');
  const [notesDesc, setNotesDesc] = useState<string>('Tier-1 4(a)(2) Institutional Liquidity Placement');

  // Real-time calculation preview
  const [calcPreview, setCalcPreview] = useState<{
    issuePrice: number;
    discountAmount: number;
    bondEquivalentYield: number;
    moneyMarketYield: number;
    pricePer1000: number;
  }>({
    issuePrice: 4940000,
    discountAmount: 60000,
    bondEquivalentYield: 4.93,
    moneyMarketYield: 4.86,
    pricePer1000: 988.00,
  });

  const [isIssuing, setIsIssuing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Recalculate preview whenever inputs change
  useEffect(() => {
    const d = discountRate / 100;
    const discountAmt = faceValue * (d * (tenorDays / 360));
    const price = faceValue - discountAmt;
    const bey = (365 * d) / (360 - (d * tenorDays)) * 100;
    const mmy = (360 * d) / (360 - (d * tenorDays)) * 100;
    const p1000 = (price / faceValue) * 1000;

    setCalcPreview({
      issuePrice: Math.round(price * 100) / 100,
      discountAmount: Math.round(discountAmt * 100) / 100,
      bondEquivalentYield: Math.round(bey * 100) / 100,
      moneyMarketYield: Math.round(mmy * 100) / 100,
      pricePer1000: Math.round(p1000 * 100) / 100,
    });
  }, [faceValue, discountRate, tenorDays]);

  const handleIssuePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuing(true);
    setActionFeedback(null);
    try {
      const res = await api.issueCommercialPaper({
        faceValue,
        discountRate,
        tenorDays,
        investorOrDealer: dealer,
        settlementAccount: settlementAcc,
        rating,
        notes: notesDesc,
      });
      if (res.success) {
        setActionFeedback({ type: 'success', message: res.message });
        onRefresh();
      } else {
        setActionFeedback({ type: 'error', message: res.error || 'Failed to issue note' });
      }
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Issuance failed' });
    } finally {
      setIsIssuing(false);
    }
  };

  const handleRedeem = async (id: string) => {
    try {
      const res = await api.redeemCommercialPaper(id);
      if (res.success) {
        setActionFeedback({ type: 'success', message: res.message });
        onRefresh();
      }
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message });
    }
  };

  const handleRollover = async (id: string) => {
    try {
      const res = await api.rolloverCommercialPaper(id, 60, 4.80);
      if (res.success) {
        setActionFeedback({ type: 'success', message: res.message });
        onRefresh();
      }
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message });
    }
  };

  const activeNotes = notes.filter((n) => n.status === 'ACTIVE' || n.status === 'MATURING_SOON');
  const totalParOutstanding = activeNotes.reduce((acc, n) => acc + n.faceValue, 0);
  const totalProceeds = activeNotes.reduce((acc, n) => acc + n.issuePrice, 0);

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 backdrop-blur-md shadow-lg shadow-emerald-500/10">
              <Coins className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Commercial Paper Desk (First CP App)</h2>
            <span className="text-xs bg-emerald-500/15 text-emerald-300 font-bold px-2.5 py-0.5 rounded-lg border border-emerald-400/30 backdrop-blur-md">
              SEC 4(a)(2) Exempt Program
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Short-term corporate debt issuance, discount pricing engine, CUSIP registry, and maturity ladder.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300 rounded-xl transition-all shrink-0 backdrop-blur-md shadow-sm"
          title="Refresh CP Notes"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {actionFeedback && (
        <div
          className={`p-4 rounded-2xl text-xs border flex items-start space-x-2 backdrop-blur-xl shadow-lg ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-red-500/10 border-red-500/30 text-red-200'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <span className="text-xs font-medium text-slate-400">Total Outstanding Par Value</span>
          <div className="text-2xl font-bold font-mono text-white mt-2 drop-shadow-sm">
            ${totalParOutstanding.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-400 mt-1 font-medium">{activeNotes.length} active notes in market</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <span className="text-xs font-medium text-slate-400">Net Discount Proceeds Realized</span>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-2 drop-shadow-sm">
            ${totalProceeds.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total Discount: ${(totalParOutstanding - totalProceeds).toLocaleString()}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <span className="text-xs font-medium text-slate-400">Weighted Average Yield</span>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-2 drop-shadow-sm">
            4.93% <span className="text-xs font-normal text-slate-400">BEY</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Money Market Benchmark: SOFR + 15bps</p>
        </div>
      </div>

      {/* Issuance Desk & Pricing Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Issuance Form (7 cols) */}
        <div className="lg:col-span-7 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl shadow-black/20">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Issue New Commercial Paper Tranche
            </h3>
          </div>

          <form onSubmit={handleIssuePaper} className="space-y-4">
            {/* Par Value & Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Face Value / Par ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs font-mono">$</span>
                  <input
                    type="number"
                    step="100000"
                    min="100000"
                    value={faceValue}
                    onChange={(e) => setFaceValue(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 backdrop-blur-md"
                  />
                </div>
                {/* Quick Presets */}
                <div className="flex items-center space-x-1.5 mt-2">
                  {[1000000, 2500000, 5000000, 10000000].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setFaceValue(val)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border backdrop-blur-md transition-all ${
                        faceValue === val
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-sm'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      ${val / 1000000}M
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Discount Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="15.0"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 backdrop-blur-md"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">360-day money market year convention</span>
              </div>
            </div>

            {/* Tenor & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tenor (Maturity in Days)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[30, 60, 90, 180].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setTenorDays(d)}
                      className={`py-1.5 text-xs font-mono font-bold rounded-xl border backdrop-blur-md transition-all ${
                        tenorDays === d
                          ? 'bg-emerald-600 text-white border-white/30 shadow-lg shadow-emerald-600/30'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Credit Rating Tranche
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 backdrop-blur-md"
                >
                  <option value="A-1+/P-1">A-1+ / P-1 (Prime Tier 1)</option>
                  <option value="A-1/P-1">A-1 / P-1 (High Grade)</option>
                  <option value="Tier-1 Prime">Tier-1 Prime (Citigroup Benchmark)</option>
                </select>
              </div>
            </div>

            {/* Dealer & Settlement Account */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Dealer / Investor Placement
                </label>
                <select
                  value={dealer}
                  onChange={(e) => setDealer(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 backdrop-blur-md"
                >
                  <option value="Citigroup Global Markets CP Desk">Citigroup Global Markets CP Desk</option>
                  <option value="BlackRock Cash Management Fund">BlackRock Cash Management Fund</option>
                  <option value="Vanguard Treasury Liquidity Reserve">Vanguard Treasury Liquidity Reserve</option>
                  <option value="Fidelity Institutional Money Market">Fidelity Institutional Money Market</option>
                  <option value="J.P. Morgan Securities Dealer Desk">J.P. Morgan Securities Dealer Desk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Settlement OBP Bank Account
                </label>
                <select
                  value={settlementAcc}
                  onChange={(e) => setSettlementAcc(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 backdrop-blur-md"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} (••••{a.number.slice(-4)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isIssuing}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/30 border border-white/20 flex items-center justify-center space-x-2 backdrop-blur-md"
            >
              <Coins className="w-4 h-4" />
              <span>{isIssuing ? 'Issuing Commercial Paper...' : `Issue & Settle $${faceValue.toLocaleString()} CP Note`}</span>
            </button>
          </form>
        </div>

        {/* Pricing Math Box (5 cols) */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl shadow-black/20">
          <div className="flex items-center space-x-2 text-emerald-400 border-b border-white/10 pb-3">
            <Calculator className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Institutional Pricing Engine
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 backdrop-blur-md space-y-1">
              <span className="text-slate-400 block text-[11px]">Formula:</span>
              <code className="text-emerald-300 font-mono text-xs block font-bold">
                P = F × [ 1 - (d × t / 360) ]
              </code>
              <p className="text-[10px] text-slate-400 pt-1">
                F=${faceValue.toLocaleString()} | d={discountRate}% | t={tenorDays}d
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">Issue Proceeds (Price P):</span>
                <span className="font-mono font-bold text-white text-sm">
                  ${calcPreview.issuePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">Dollar Discount:</span>
                <span className="font-mono font-bold text-amber-300">
                  ${calcPreview.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">Bond Equivalent Yield (BEY):</span>
                <span className="font-mono font-bold text-emerald-300">
                  {calcPreview.bondEquivalentYield}% (365-day basis)
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">Money Market Yield (CD eq):</span>
                <span className="font-mono font-bold text-cyan-300">
                  {calcPreview.moneyMarketYield}%
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Price per $1,000 Par:</span>
                <span className="font-mono font-bold text-slate-200">
                  ${calcPreview.pricePer1000.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Paper Active Portfolio Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Active Commercial Paper Portfolio</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {notes.length} Total Registered Notes
          </span>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5">CUSIP / Program</th>
                  <th className="p-3.5">Par Value</th>
                  <th className="p-3.5">Discount Rate</th>
                  <th className="p-3.5">Yield (BEY)</th>
                  <th className="p-3.5">Tenor</th>
                  <th className="p-3.5">Maturity Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {notes.map((note) => (
                  <tr key={note.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white flex items-center space-x-2">
                        <span className="text-cyan-300">{note.cusip}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300 font-sans border border-white/10 backdrop-blur-md">
                          {note.rating}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{note.investorOrDealer}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-100">
                      ${note.faceValue.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{note.discountRate.toFixed(2)}%</td>
                    <td className="p-3.5 font-mono font-semibold text-emerald-300">
                      {note.bondEquivalentYield.toFixed(2)}%
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{note.tenorDays}d</td>
                    <td className="p-3.5 font-mono text-slate-300">{note.maturityDate}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${
                          note.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                            : note.status === 'MATURING_SOON'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-400/30 animate-pulse'
                            : 'bg-white/10 text-slate-400 border-white/10'
                        }`}
                      >
                        {note.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {note.status !== 'SETTLED' && note.status !== 'ROLLED_OVER' && (
                        <>
                          <button
                            onClick={() => handleRollover(note.id)}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-cyan-300 border border-white/15 rounded-lg text-[11px] font-semibold backdrop-blur-md transition-all shadow-sm"
                          >
                            Rollover
                          </button>
                          <button
                            onClick={() => handleRedeem(note.id)}
                            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg text-[11px] font-semibold backdrop-blur-md transition-all shadow-sm"
                          >
                            Redeem
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

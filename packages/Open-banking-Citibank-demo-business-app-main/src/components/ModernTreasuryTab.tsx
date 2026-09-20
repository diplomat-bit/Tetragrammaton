import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  PlusCircle,
  ShieldCheck,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
} from 'lucide-react';
import { ModernTreasuryLedger, ModernTreasuryPaymentOrder, OBPAccount } from '../types';
import { api } from '../services/api';

interface ModernTreasuryTabProps {
  ledger: ModernTreasuryLedger | null;
  paymentOrders: ModernTreasuryPaymentOrder[];
  accounts: OBPAccount[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const ModernTreasuryTab: React.FC<ModernTreasuryTabProps> = ({
  ledger,
  paymentOrders,
  accounts,
  onRefresh,
  isRefreshing,
}) => {
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [orderType, setOrderType] = useState<'ach' | 'wire' | 'rtp' | 'book'>('wire');
  const [direction, setDirection] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState<number>(250000);
  const [receivingEntity, setReceivingEntity] = useState('Citigroup Global Markets Escrow');
  const [receivingAccount, setReceivingAccount] = useState('9920194821');
  const [receivingRouting, setReceivingRouting] = useState('021000089');
  const [description, setDescription] = useState('Interbank liquidity sweep to treasury reserve');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await api.createPaymentOrder({
        type: orderType,
        direction,
        amount,
        currency: 'USD',
        receivingEntityName: receivingEntity,
        receivingAccountNumber: receivingAccount,
        receivingRoutingNumber: receivingRouting,
        description,
      });
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setShowNewOrderModal(false);
        onRefresh();
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to create payment order' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Payment order submission failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md shadow-lg shadow-purple-500/10">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Modern Treasury API Connector</h2>
            <span className="text-xs bg-purple-500/15 text-purple-300 font-bold px-2.5 py-0.5 rounded-lg border border-purple-400/30 backdrop-blur-md">
              Multi-Rail Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Programmatic payment rails (Fedwire, ACH, Real-Time Payments RTP) and real-time double-entry ledgers.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-lg shadow-purple-500/25 border border-white/20 backdrop-blur-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Payment Order</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300 rounded-xl transition-all backdrop-blur-md shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs border flex items-start space-x-2 backdrop-blur-xl shadow-lg ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-red-500/10 border-red-500/30 text-red-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Master Ledger Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <span className="text-xs font-medium text-slate-400">Total Ledger Assets</span>
          <div className="text-2xl font-bold font-mono text-white mt-2 drop-shadow-sm">
            ${(ledger?.totalAssets || 23150000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-purple-300 mt-1">Multi-Rail Corporate Master Pool</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <span className="text-xs font-medium text-slate-400">Total Liabilities & Escrows</span>
          <div className="text-2xl font-bold font-mono text-slate-200 mt-2 drop-shadow-sm">
            ${(ledger?.totalLiabilities || 10500000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-1">Commercial Paper & Escrow obligations</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <span className="text-xs font-medium text-slate-400">Net Corporate Equity</span>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-2 drop-shadow-sm">
            ${(ledger?.totalEquity || 12650000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-1">Unencumbered liquidity capital</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          <span className="text-xs font-medium text-slate-400">In-Flight Outflow Queue</span>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-2 drop-shadow-sm">
            ${(ledger?.pendingOutflow || 850000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-1">Fedwire & ACH clearing cycles</p>
        </div>
      </div>

      {/* Payment Orders Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Modern Treasury Payment Orders Pipeline</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">{paymentOrders.length} Orders</span>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5">Order ID / Rail</th>
                  <th className="p-3.5">Receiving Beneficiary</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Settlement Est.</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {paymentOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white">{po.id}</div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md">
                        {po.type}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-white">{po.receivingEntityName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Routing: {po.receivingRoutingNumber} • Acc: {po.receivingAccountNumberMasked}
                      </div>
                    </td>
                    <td className="p-3.5 max-w-xs truncate font-medium text-slate-300">
                      {po.description}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">
                      {new Date(po.estimatedSettlement).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                          po.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                            : po.status === 'processing'
                            ? 'bg-blue-500/15 text-cyan-300 border-blue-400/30 animate-pulse'
                            : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-white">
                      ${po.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Payment Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-slate-900/90 border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-100 space-y-4 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span>Create Modern Treasury Payment Order</span>
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              {/* Payment Rail */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">Select Payment Rail</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'wire', label: 'Fedwire' },
                    { id: 'ach', label: 'ACH' },
                    { id: 'rtp', label: 'RTP (Instant)' },
                    { id: 'book', label: 'Book Transfer' },
                  ].map((rail) => (
                    <button
                      type="button"
                      key={rail.id}
                      onClick={() => setOrderType(rail.id as any)}
                      className={`py-2 rounded-xl font-bold border transition-all backdrop-blur-md ${
                        orderType === rail.id
                          ? 'bg-purple-600 text-white border-white/30 shadow-lg shadow-purple-600/30'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {rail.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount & Direction */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl font-mono text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Direction</label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  >
                    <option value="credit">Credit (Outbound Payout)</option>
                    <option value="debit">Debit (Inbound Collection)</option>
                  </select>
                </div>
              </div>

              {/* Beneficiary Entity */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">Beneficiary Legal Entity</label>
                <input
                  type="text"
                  value={receivingEntity}
                  onChange={(e) => setReceivingEntity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  required
                />
              </div>

              {/* Account & Routing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={receivingAccount}
                    onChange={(e) => setReceivingAccount(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl font-mono text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Routing Number (ABA)</label>
                  <input
                    type="text"
                    value={receivingRouting}
                    onChange={(e) => setReceivingRouting(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl font-mono text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">Payment Memo / Purpose</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl backdrop-blur-md transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/30 border border-white/20 backdrop-blur-md"
                >
                  {isSubmitting ? 'Dispatching Order...' : 'Submit Payment Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

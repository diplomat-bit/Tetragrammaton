import React, { useState, useEffect } from 'react';
import Card from './Card';
import { ModernTreasuryService, MTPaymentOrderResponse } from '../services/ModernTreasuryService';
import { DollarSign, Send, Landmark, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const ModernTreasuryLedgerHub: React.FC = () => {
  const [internalAccounts, setInternalAccounts] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  const [paymentAmountUSD, setPaymentAmountUSD] = useState('25000');
  const [paymentType, setPaymentType] = useState<'wire' | 'ach' | 'rtp' | 'book'>('wire');
  const [description, setDescription] = useState('Citigroup Reserve Settlement');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState<MTPaymentOrderResponse | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<MTPaymentOrderResponse[]>([]);

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const accts = await ModernTreasuryService.getInternalAccounts();
      setInternalAccounts(accts);
    } catch (e: any) {
      console.warn("Internal accounts fetch notice:", e.message);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreatePaymentOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentResult(null);
    try {
      const amountCents = Math.round(parseFloat(paymentAmountUSD) * 100);
      const res = await ModernTreasuryService.upsertPaymentOrder({
        type: paymentType,
        amount: amountCents,
        direction: 'credit',
        currency: 'USD',
        originatingAccountId: internalAccounts[0]?.id || "f78ed0dc-acc8-4ebb-ba84-37454e26cd28",
        receivingAccountId: internalAccounts[1]?.id || "citi-checking-7777788888",
        description
      });
      setPaymentResult(res);
      setPaymentHistory(prev => [res, ...prev]);
    } catch (err: any) {
      alert(`Payment Order Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Modern Treasury Sovereign Ledger Hub" icon={<Landmark className="text-amber-400" />}>
      <div className="space-y-6 pt-2 font-mono text-xs">
        <p className="text-gray-400">
          GraphQL API Integration (<code className="text-amber-300">/graphql</code>) for programmatic payment order upserts and ledger account reconciliation.
        </p>

        {/* INTERNAL ACCOUNTS PREVIEW */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Registered Ledger Accounts</span>
            <button onClick={fetchAccounts} className="text-amber-400 text-[10px] flex items-center gap-1">
              <RefreshCw size={10} className={isLoadingAccounts ? 'animate-spin' : ''} /> Sync Accounts
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {internalAccounts.map((acct) => (
              <div key={acct.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <p className="text-white font-bold text-xs">{acct.name}</p>
                <p className="text-[10px] text-gray-500">{acct.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NEW PAYMENT ORDER FORM */}
        <form onSubmit={handleCreatePaymentOrder} className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-4">
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider block">
            Upsert Modern Treasury Payment Order (GraphQL)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 uppercase block mb-1">Amount (USD)</label>
              <input
                type="number"
                value={paymentAmountUSD}
                onChange={(e) => setPaymentAmountUSD(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase block mb-1">Payment Type</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                <option value="wire">Wire Transfer</option>
                <option value="ach">ACH Transfer</option>
                <option value="rtp">RTP (Real-Time Payment)</option>
                <option value="book">Book Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase block mb-1">Description / Reference</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
            EXECUTE GRAPHQL UPSERT PAYMENT ORDER
          </button>
        </form>

        {/* PAYMENT RESULT & HISTORY */}
        {paymentHistory.length > 0 && (
          <div className="space-y-3">
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Payment Order Execution Log</span>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 max-h-48 overflow-y-auto">
              {paymentHistory.map((po) => (
                <div key={po.id} className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between border border-slate-800">
                  <div>
                    <span className="text-white font-bold block">{po.id}</span>
                    <span className="text-[10px] text-gray-500">{po.createdAt}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">${po.amount.toLocaleString()}</span>
                    <span className="text-[10px] text-amber-400 uppercase">{po.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ModernTreasuryLedgerHub;

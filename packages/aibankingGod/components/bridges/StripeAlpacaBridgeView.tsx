import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { stripeBridgeService, StripeConnectedBank, StripeAlpacaSweepTransfer } from '../../services/StripeBridgeService';

export const StripeAlpacaBridgeView: React.FC = () => {
  const accountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
  const [banks, setBanks] = useState<StripeConnectedBank[]>([]);
  const [sweeps, setSweeps] = useState<StripeAlpacaSweepTransfer[]>([]);
  const [loading, setLoading] = useState(false);

  const [sweepAmount, setSweepAmount] = useState('15000');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadStripeData();
  }, []);

  const loadStripeData = async () => {
    setLoading(true);
    try {
      const b = await stripeBridgeService.getConnectedBanks(accountId);
      const s = await stripeBridgeService.getSweepTransfers(accountId);
      setBanks(b);
      setSweeps(s);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteSweep = async () => {
    setLoading(true);
    try {
      const sweep = await stripeBridgeService.initiateStripeToAlpacaSweep(accountId, parseFloat(sweepAmount), accountId);
      setStatusMsg(`Stripe -> Alpaca Sweep Executed: $${sweep.amount} (PaymentIntent: ${sweep.stripe_payment_intent} -> Alpaca Journal ID: ${sweep.alpaca_journal_id})`);
      loadStripeData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-indigo-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
            <DollarSign className="text-indigo-400" size={24} />
            Stripe Financial Connections & Alpaca Direct Sweep
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Instant Card/ACH PaymentIntent Authorization & Real-time Atomic Journaling into Alpaca Custody
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stripe Sweep Controller */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Zap className="text-indigo-400" size={18} />
            Stripe Payment Intent to Alpaca JNLC Sweep
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400">Connected Stripe Treasury Source:</span>
              <p className="font-bold text-indigo-300">Silicon Valley Bank / Stripe FC (****9901)</p>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Sweep Amount ($ USD)</label>
              <input
                type="number"
                value={sweepAmount}
                onChange={(e) => setSweepAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleExecuteSweep}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition"
            >
              <ArrowRight size={14} />
              Execute Stripe to Alpaca Instant Sweep
            </button>

            {statusMsg && (
              <div className="p-3 bg-slate-950 rounded border border-indigo-500/30 text-xs text-indigo-300 font-mono break-all">
                {statusMsg}
              </div>
            )}
          </div>
        </div>

        {/* Sweep Audit Table */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={18} />
            Stripe Sweep Audit Stream ({sweeps.length})
          </h3>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {sweeps.map((sw) => (
              <div key={sw.id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400">+${sw.amount.toFixed(2)} USD</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {sw.status}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-slate-400 truncate">PaymentIntent: {sw.stripe_payment_intent}</p>
                <p className="font-mono text-[10px] text-cyan-300 truncate">Alpaca Journal ID: {sw.alpaca_journal_id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeAlpacaBridgeView;

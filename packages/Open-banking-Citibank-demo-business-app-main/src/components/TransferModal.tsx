import React, { useState } from 'react';
import { X, Send, ArrowUpRight, ShieldCheck, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { OBPAccount } from '../types';
import { api } from '../services/api';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: OBPAccount[];
  initialFromAccountId?: string;
  onSuccess: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  accounts,
  initialFromAccountId,
  onSuccess,
}) => {
  const [fromAccountId, setFromAccountId] = useState(
    initialFromAccountId || (accounts.length > 0 ? accounts[0].id : '')
  );
  const [toBankId, setToBankId] = useState(
    accounts.length > 1 ? accounts[1].bank_id : (accounts[0]?.bank_id || 'rbs')
  );
  const [toAccountId, setToAccountId] = useState(
    accounts.length > 1 ? accounts[1].id : ''
  );
  const [amount, setAmount] = useState('25000');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('Commercial settlement transfer');
  const [challengeType, setChallengeType] = useState('SANDBOX_TAN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const selectedFromAccount = accounts.find((a) => a.id === fromAccountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const fromAcc = accounts.find((a) => a.id === fromAccountId);
    const destAcc = accounts.find((a) => a.id === toAccountId);
    const bankId = fromAcc?.bank_id || 'rbs';

    try {
      const res = await api.createTransactionRequest({
        bankId,
        accountId: fromAccountId,
        toBankId: destAcc?.bank_id || toBankId || 'rbs',
        toAccountId,
        amount,
        currency,
        description,
        challengeType,
      });

      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Transfer failed' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Payment initiation error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <div className="bg-slate-900/90 border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-100 space-y-4 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-400/30 backdrop-blur-md shadow-lg shadow-blue-500/10">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Initiate OBP Payment / Wire Request
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                POST /banks/{'{bankId}'}/accounts/{'{accountId}'}/owner/transaction-requests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-all backdrop-blur-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs border flex items-start space-x-2 backdrop-blur-xl shadow-lg ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-red-500/10 border-red-500/30 text-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Source Account */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium text-slate-300">From Account (Source)</label>
              {selectedFromAccount && (
                <span className="font-mono text-emerald-300 font-semibold drop-shadow-sm">
                  Avail: {selectedFromAccount.balance.currency}{' '}
                  {parseFloat(selectedFromAccount.balance.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400 backdrop-blur-md"
              required
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                  {a.label} (••••{a.number.slice(-4)}) - {a.balance.currency} {parseFloat(a.balance.amount).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Account */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">To Account (Beneficiary)</label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400 backdrop-blur-md"
              required
            >
              {accounts
                .filter((a) => a.id !== fromAccountId)
                .map((a) => (
                  <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                    {a.label} (••••{a.number.slice(-4)})
                  </option>
                ))}
              <option value="ext-citi-escrow-8819" className="bg-slate-900 text-white">External Citibank Commercial Escrow (9920194821)</option>
              <option value="ext-fedwire-treasury-01" className="bg-slate-900 text-white">Federal Reserve Treasury Clearing (021000089)</option>
            </select>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl font-mono font-bold text-white focus:outline-none focus:border-blue-400 backdrop-blur-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl font-mono text-white focus:outline-none focus:border-blue-400 backdrop-blur-md"
              >
                <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
                <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
                <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Payment Reference / Memo</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400 backdrop-blur-md"
              required
            />
          </div>

          {/* Challenge Type */}
          <div className="p-3.5 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-300">Challenge / 2FA Method</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">Auto-Validated</span>
            </div>
            <select
              value={challengeType}
              onChange={(e) => setChallengeType(e.target.value)}
              className="w-full px-3 py-1.5 bg-black/40 border border-white/15 rounded-xl text-[11px] text-slate-200 backdrop-blur-md focus:border-blue-400 focus:outline-none"
            >
              <option value="SANDBOX_TAN" className="bg-slate-900 text-white">SANDBOX_TAN (Simulated 2FA / Instant Approval)</option>
              <option value="SMS_OTP" className="bg-slate-900 text-white">SMS_OTP (One-Time Passcode)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl transition-all backdrop-blur-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-lg shadow-blue-500/25 border border-white/20 backdrop-blur-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting Request...' : 'Send Wire'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

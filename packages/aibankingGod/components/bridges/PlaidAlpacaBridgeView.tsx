import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { plaidBridgeService, PlaidLinkedAccount } from '../../services/PlaidBridgeService';

export const PlaidAlpacaBridgeView: React.FC = () => {
  const accountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
  const [linkedAccounts, setLinkedAccounts] = useState<PlaidLinkedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [institution, setInstitution] = useState('Citibank N.A.');
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  const [mask, setMask] = useState('8821');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const list = await plaidBridgeService.getLinkedAccounts(accountId);
      setLinkedAccounts(list);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePlaidLink = async () => {
    setLoading(true);
    try {
      const item = await plaidBridgeService.exchangePublicTokenAndLinkAlpaca(
        accountId,
        'public-sandbox-token-123',
        {
          institutionName: institution,
          accountName: `${institution} ${accountType.toUpperCase()}`,
          mask,
          accountType
        }
      );
      setStatusMsg(`Plaid Link Complete! Generated Processor Token: ${item.processor_token.slice(0, 18)}... Linked to Alpaca ACH ID: ${item.alpaca_ach_id}`);
      loadAccounts();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-emerald-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <CreditCard className="text-emerald-400" size={24} />
            Plaid Link & Alpaca Processor Token Direct Bridge
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Seamless Plaid Bank Verification & Instant Token Exchange for Alpaca Correspondent ACH Funding
          </p>
        </div>
        <button
          onClick={loadAccounts}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Plaid Token
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plaid Link Simulator */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Zap className="text-emerald-400" size={18} />
            Simulate Plaid Link Authorization Session
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Financial Institution</label>
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Citibank N.A.">Citibank N.A. (Citi Priority)</option>
                <option value="JPMorgan Chase">JPMorgan Chase Bank</option>
                <option value="Bank of America">Bank of America Private Bank</option>
                <option value="Wells Fargo">Wells Fargo Commercial</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Account Type</label>
                <select
                  value={accountType}
                  onChange={(e: any) => setAccountType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Account Mask (Last 4)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={mask}
                  onChange={(e) => setMask(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-cyan-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleSimulatePlaidLink}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition"
            >
              <CheckCircle size={14} />
              Launch Plaid Link & Exchange Processor Token
            </button>

            {statusMsg && (
              <div className="p-3 bg-slate-950 rounded border border-emerald-500/30 text-xs text-emerald-300 font-mono break-all">
                {statusMsg}
              </div>
            )}
          </div>
        </div>

        {/* Linked Accounts List */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <CreditCard className="text-yellow-400" size={18} />
            Linked Plaid & Alpaca Accounts ({linkedAccounts.length})
          </h3>

          <div className="space-y-3">
            {linkedAccounts.map((acc) => (
              <div key={acc.id} className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-yellow-400">{acc.institution_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {acc.type}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">{acc.account_name} (****{acc.mask})</p>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 space-y-1 font-mono text-[10px] text-slate-400 mt-2">
                  <p className="truncate text-cyan-300">Processor Token: {acc.processor_token}</p>
                  <p className="truncate text-slate-400">Alpaca ACH Rel ID: {acc.alpaca_ach_id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaidAlpacaBridgeView;

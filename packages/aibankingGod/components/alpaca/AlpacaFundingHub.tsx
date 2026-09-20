import { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft, Plus, CheckCircle2, ShieldAlert } from 'lucide-react';
import { alpacaFundingService, AlpacaRecipientBank, AlpacaInstantFunding, AlpacaFundingWallet } from '../../services/AlpacaFundingService';

export const AlpacaFundingHub: React.FC = () => {
  const accountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
  const [recipientBanks, setRecipientBanks] = useState<AlpacaRecipientBank[]>([]);
  const [fundingWallet, setFundingWallet] = useState<AlpacaFundingWallet | null>(null);
  const [loading, setLoading] = useState(false);

  // New bank state
  const [bankName, setBankName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [instantAmount, setInstantAmount] = useState('10000');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadFundingData();
  }, []);

  const loadFundingData = async () => {
    setLoading(true);
    try {
      const banks = await alpacaFundingService.getRecipientBanks(accountId);
      const wallet = await alpacaFundingService.getFundingWallet(accountId);
      setRecipientBanks(banks);
      setFundingWallet(wallet);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipientBank = async () => {
    if (!bankName || !routingNumber || !accountNumber) return;
    setLoading(true);
    try {
      await alpacaFundingService.createRecipientBank(accountId, {
        name: bankName,
        bank_code: routingNumber,
        bank_code_type: 'ABA',
        account_number: accountNumber,
        city: 'New York',
        country: 'USA'
      });
      setStatusMsg(`Recipient Bank Connected: ${bankName}`);
      setBankName('');
      setRoutingNumber('');
      setAccountNumber('');
      loadFundingData();
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerInstantFunding = async () => {
    setLoading(true);
    try {
      const item = await alpacaFundingService.createInstantFunding(accountId, instantAmount);
      setStatusMsg(`Instant JNLC Funding Request Executed: $${item.amount} (Ref: ${item.id})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-yellow-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <Landmark className="text-yellow-400" size={24} />
            Alpaca Funding, Recipient Banks & Instant ACH
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Recipient Bank Relationships, Wire Sweeps, Funding Wallets & Instant JNLC Clearing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipient Banks Card */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Landmark className="text-emerald-400" size={18} />
            Connected Recipient Banks ({recipientBanks.length})
          </h3>

          <div className="space-y-2">
            {recipientBanks.map((bank) => (
              <div key={bank.id} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-yellow-400">{bank.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    ABA: {bank.bank_code} | Acc: ****{bank.account_number.slice(-4)}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {bank.status}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-3 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Link New Recipient Bank</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                placeholder="Routing Number"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-yellow-500 font-mono"
              />
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-yellow-500 font-mono"
              />
            </div>
            <button
              onClick={handleAddRecipientBank}
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2 rounded-lg text-xs border border-yellow-500/20 flex items-center justify-center gap-2 transition"
            >
              <Plus size={14} />
              Add Bank Relationship
            </button>
          </div>
        </div>

        {/* Instant Funding & Wallet Card */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <ArrowUpRight className="text-cyan-400" size={18} />
            Instant JNLC Sweep & Funding Wallet
          </h3>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Funding Wallet Status:</span>
              <span className="text-emerald-400 font-bold uppercase">{fundingWallet?.status || 'ACTIVE'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Primary Omnibus Rail:</span>
              <span className="text-cyan-400 font-mono">Alpaca JIT Securities</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Instant Transfer Amount ($)</label>
              <input
                type="number"
                value={instantAmount}
                onChange={(e) => setInstantAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-yellow-500"
              />
            </div>

            <button
              onClick={handleTriggerInstantFunding}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 size={14} />
              Execute Instant JNLC Funding Request
            </button>

            {statusMsg && (
              <div className="p-3 bg-slate-950 rounded border border-emerald-500/30 text-xs text-emerald-300 font-mono break-all">
                {statusMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlpacaFundingHub;

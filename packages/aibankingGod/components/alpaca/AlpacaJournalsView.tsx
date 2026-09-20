import { useState, useEffect } from 'react';
import { ArrowRightLeft, Layers, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { alpacaJournalsService } from '../../services/AlpacaJournalsService';
import { AlpacaJournal } from '../../services/AlpacaBrokerService';

export const AlpacaJournalsView: React.FC = () => {
  const [journals, setJournals] = useState<AlpacaJournal[]>([]);
  const [loading, setLoading] = useState(false);

  // Single journal state
  const [fromAccount, setFromAccount] = useState('FIRM_CORRESPONDENT_OMNIBUS');
  const [toAccount, setToAccount] = useState('b9b19618-22dd-4e80-8432-fc9e1ba0b27d');
  const [amount, setAmount] = useState('25000.00');
  const [entryType, setEntryType] = useState<'JNLC' | 'JNLS'>('JNLC');
  const [description, setDescription] = useState('Sovereign Journal Re-allocation');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    setLoading(true);
    try {
      const list = await alpacaJournalsService.getJournals();
      setJournals([...list]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteSingle = async () => {
    setLoading(true);
    try {
      const j = await alpacaJournalsService.createSingleJournal(fromAccount, toAccount, amount, entryType, description);
      setStatusMsg(`Journal Executed: ${j.entry_type} $${j.amount} -> Account ${j.to_account.slice(0, 8)}... (ID: ${j.id})`);
      loadJournals();
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteBatch = async () => {
    setLoading(true);
    try {
      const entries = [
        { to_account: 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d', amount: '10000.00', description: 'Batch 1-to-Many Sub-Vault Alpha' },
        { to_account: '8f8c8cee-2591-4f83-be12-82c659b5e748', amount: '15000.00', description: 'Batch 1-to-Many Sub-Vault Beta' }
      ];
      const res = await alpacaJournalsService.createBatchJournal(fromAccount, entries);
      setStatusMsg(`Batch Journal Executed: ${res.length} accounts credited simultaneously`);
      loadJournals();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-cyan-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <ArrowRightLeft className="text-cyan-400" size={24} />
            Alpaca Sovereign Journal Engine (JNLC & JNLS)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Single, Batch 1-to-Many, and Reverse Batch Many-to-1 Atomic Ledger Movement
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Journal Creation Panel */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Layers className="text-yellow-400" size={18} />
            Journal Dispatch Form
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Journal Entry Type</label>
              <select
                value={entryType}
                onChange={(e: any) => setEntryType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="JNLC">JNLC - Move Cash (Instant Liquidity)</option>
                <option value="JNLS">JNLS - Move Shares (Asset Transfer)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Source Account / Vault</label>
              <input
                type="text"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Destination Account / Vault</label>
              <input
                type="text"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Amount / Quantity</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-emerald-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Description / Audit Ref</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleExecuteSingle}
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle2 size={14} />
                Single Journal
              </button>
              <button
                onClick={handleExecuteBatch}
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2.5 rounded-lg text-xs border border-yellow-500/30 flex items-center justify-center gap-1.5 transition"
              >
                <CornerDownRight size={14} />
                Batch (1-to-Many)
              </button>
            </div>

            {statusMsg && (
              <div className="p-3 bg-slate-950 rounded border border-cyan-500/30 text-xs text-cyan-300 font-mono break-all">
                {statusMsg}
              </div>
            )}
          </div>
        </div>

        {/* Live Journals Log Table */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <ArrowRightLeft className="text-emerald-400" size={18} />
            Ledger Audit Stream ({journals.length})
          </h3>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {journals.map((j) => (
              <div key={j.id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-yellow-400">{j.entry_type} | ${j.amount}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {j.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <span className="text-slate-300 truncate max-w-[120px]">{j.from_account}</span>
                  <span>&rarr;</span>
                  <span className="text-cyan-400 truncate max-w-[120px]">{j.to_account}</span>
                </div>
                <p className="text-[10px] text-slate-500 italic">{j.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlpacaJournalsView;

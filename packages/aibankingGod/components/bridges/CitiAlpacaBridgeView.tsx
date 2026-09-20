import React, { useState, useEffect } from 'react';
import { Building2, Globe, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { citiAlpacaBridgeService, CitiAlpacaSyncRecord } from '../../services/CitiAlpacaBridgeService';

export const CitiAlpacaBridgeView: React.FC = () => {
  const accountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
  const [records, setRecords] = useState<CitiAlpacaSyncRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [wireAmount, setWireAmount] = useState('100000.00');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadCitiData();
  }, []);

  const loadCitiData = async () => {
    setLoading(true);
    try {
      const list = await citiAlpacaBridgeService.getSyncRecords(accountId);
      setRecords(list);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteCitiWire = async () => {
    setLoading(true);
    try {
      const record = await citiAlpacaBridgeService.executeCitiToAlpacaIso20022Wire(accountId, wireAmount, '3IPY201998765409');
      setStatusMsg(`Citi Open Banking pacs.008 Wire Executed: $${record.amount} (Citi Wire Ref: ${record.citi_wire_reference} -> Alpaca Journal ID: ${record.alpaca_journal_id})`);
      loadCitiData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-cyan-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <Building2 className="text-cyan-400" size={24} />
            Citibank Open Banking & Alpaca Correspondent Bridge
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            FAPI 2.0 Security, ISO 20022 pacs.008 Messaging & Instant Omnibus Clearing into Alpaca
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Citi Wire Execution Card */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Globe className="text-cyan-400" size={18} />
            Dispatch ISO 20022 Wire (Citi to Alpaca)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Citi Consent ID:</span>
                <span className="text-cyan-300">3IPY201998765409</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Message standard:</span>
                <span className="text-emerald-400">ISO 20022 pacs.008.001.08</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Security Profile:</span>
                <span className="text-yellow-400">FAPI 2.0 + mTLS + JWS</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Transfer Amount ($ USD)</label>
              <input
                type="text"
                value={wireAmount}
                onChange={(e) => setWireAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleExecuteCitiWire}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition"
            >
              <Send size={14} />
              Transmit Citi Open Banking pacs.008 Wire
            </button>

            {statusMsg && (
              <div className="p-3 bg-slate-950 rounded border border-cyan-500/30 text-xs text-cyan-300 font-mono break-all">
                {statusMsg}
              </div>
            )}
          </div>
        </div>

        {/* Audit Stream */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={18} />
            Citi-Alpaca Bridge Audit Ledger ({records.length})
          </h3>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {records.map((r) => (
              <div key={r.id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-yellow-400">${r.amount} USD</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {r.status}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-cyan-300">Citi Ref: {r.citi_wire_reference}</p>
                <p className="font-mono text-[10px] text-slate-400">Alpaca Journal: {r.alpaca_journal_id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitiAlpacaBridgeView;

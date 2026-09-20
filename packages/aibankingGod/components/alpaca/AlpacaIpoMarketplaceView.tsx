import React, { useState, useEffect } from 'react';
import { Rocket, CheckCircle2, DollarSign } from 'lucide-react';
import { alpacaMarketDataService, AlpacaIpoOffering } from '../../services/AlpacaMarketDataService';

export const AlpacaIpoMarketplaceView: React.FC = () => {
  const [ipos, setIpos] = useState<AlpacaIpoOffering[]>([]);
  const [selectedIpo, setSelectedIpo] = useState<AlpacaIpoOffering | null>(null);
  const [indicationNotional, setIndicationNotional] = useState('10000');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    alpacaMarketDataService.getIpoOfferings().then((res) => {
      setIpos(res);
      if (res.length > 0) setSelectedIpo(res[0]);
    });
  }, []);

  const handleSubmitIndication = () => {
    if (!selectedIpo) return;
    setStatusMsg(`Indication of Interest Submitted: ${selectedIpo.ticker_symbol} ($${indicationNotional} Notional)`);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-yellow-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <Rocket className="text-yellow-400" size={24} />
            Alpaca Primary IPO & Offering Indications Marketplace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Indication of Interest (IOI), Prospectus Disclosures, 60-Minute Mail & Primary Allocations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IPO Offerings List */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Rocket className="text-cyan-400" size={18} />
            Upcoming IPO Offerings ({ipos.length})
          </h3>

          <div className="space-y-3">
            {ipos.map((ipo) => (
              <div
                key={ipo.ipo_reference}
                onClick={() => setSelectedIpo(ipo)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedIpo?.ipo_reference === ipo.ipo_reference
                    ? 'bg-slate-800/80 border-yellow-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-yellow-400">{ipo.name}</h4>
                    <span className="font-mono text-xs text-cyan-300 font-bold">${ipo.ticker_symbol}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {ipo.availability}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span>Price Range: ${ipo.min_price} - ${ipo.max_price}</span>
                  <span>Trade Date: {ipo.trade_date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indication of Interest Ticket */}
        {selectedIpo && (
          <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
              <DollarSign className="text-emerald-400" size={18} />
              IPO Indication Ticket: ${selectedIpo.ticker_symbol}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400">Issuer Name:</span>
                <p className="text-slate-100 font-bold text-sm">{selectedIpo.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">Ref: {selectedIpo.ipo_reference}</p>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Notional Indication Amount ($)</label>
                <input
                  type="number"
                  value={indicationNotional}
                  onChange={(e) => setIndicationNotional(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-yellow-500"
                />
              </div>

              <button
                onClick={handleSubmitIndication}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 size={14} />
                Submit Indication of Interest (IOI)
              </button>

              {statusMsg && (
                <div className="p-3 bg-slate-950 rounded border border-emerald-500/30 text-xs text-emerald-300 font-mono break-all">
                  {statusMsg}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlpacaIpoMarketplaceView;

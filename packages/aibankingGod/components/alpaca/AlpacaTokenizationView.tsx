import React, { useState, useEffect } from 'react';
import { Coins, Layers, ArrowUpRight, CheckCircle2, Shield } from 'lucide-react';
import { alpacaTokenizationService, AlpacaTokenizationRequest } from '../../services/AlpacaTokenizationService';

export const AlpacaTokenizationView: React.FC = () => {
  const [requests, setRequests] = useState<AlpacaTokenizationRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Mint form state
  const [symbol, setSymbol] = useState('AAPL');
  const [qty, setQty] = useState('50.0');
  const [issuer, setIssuer] = useState<'st0x' | 'xstocks'>('st0x');
  const [network, setNetwork] = useState<'ethereum' | 'solana' | 'arbitrum' | 'ton'>('ethereum');
  const [walletAddress, setWalletAddress] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const list = await alpacaTokenizationService.getRequests();
      setRequests(list);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMint = async () => {
    setLoading(true);
    try {
      const req = await alpacaTokenizationService.requestMint(symbol, qty, issuer, network, walletAddress);
      setStatusMsg(`Token Mint Requested: ${req.token_symbol} (${req.qty} shares) on ${req.network.toUpperCase()} Network`);
      loadRequests();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-yellow-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <Coins className="text-yellow-400" size={24} />
            Alpaca Real World Asset (RWA) Tokenization Protocol
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Minting & Redemption of Equities (sAAPL, sNVDA, sTSLA) on EVM & Solana Blockchains
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tokenization Form */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Layers className="text-cyan-400" size={18} />
            Mint RWA Tokenized Asset
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Underlying Symbol</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-yellow-400 focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Quantity</label>
                <input
                  type="text"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-emerald-400 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Issuer Protocol</label>
                <select
                  value={issuer}
                  onChange={(e: any) => setIssuer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-yellow-500"
                >
                  <option value="st0x">ST0X Issuer Network</option>
                  <option value="xstocks">xStocks Protocol</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Blockchain</label>
                <select
                  value={network}
                  onChange={(e: any) => setNetwork(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-yellow-500"
                >
                  <option value="ethereum">Ethereum (ERC-20)</option>
                  <option value="solana">Solana (SPL)</option>
                  <option value="arbitrum">Arbitrum One</option>
                  <option value="ton">TON Blockchain</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Destination Custody Wallet</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-cyan-300 focus:outline-none focus:border-yellow-500"
              />
            </div>

            <button
              onClick={handleRequestMint}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition"
            >
              <Coins size={14} />
              Request RWA Mint Token
            </button>

            {statusMsg && (
              <div className="p-3 bg-slate-950 rounded border border-yellow-500/30 text-xs text-yellow-300 font-mono break-all">
                {statusMsg}
              </div>
            )}
          </div>
        </div>

        {/* Tokenization Log */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Shield className="text-emerald-400" size={18} />
            On-Chain Tokenization Ledger ({requests.length})
          </h3>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {requests.map((r) => (
              <div key={r.tokenization_request_id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-yellow-400">{r.token_symbol} ({r.qty} units)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {r.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                  <span>Network: {r.network.toUpperCase()}</span>
                  <span>Issuer: {r.issuer}</span>
                </div>
                {r.tx_hash && (
                  <p className="font-mono text-[10px] text-cyan-400 truncate">Tx: {r.tx_hash}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlpacaTokenizationView;

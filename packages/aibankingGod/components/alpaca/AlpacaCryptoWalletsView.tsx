import { useState, useEffect } from 'react';
import { Shield, Plus, Lock, CheckCircle } from 'lucide-react';
import { alpacaFundingService, AlpacaCryptoWallet, AlpacaCryptoWhitelist } from '../../services/AlpacaFundingService';

export const AlpacaCryptoWalletsView: React.FC = () => {
  const accountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
  const [wallets, setWallets] = useState<AlpacaCryptoWallet[]>([]);
  const [whitelists, setWhitelists] = useState<AlpacaCryptoWhitelist[]>([]);
  const [loading, setLoading] = useState(false);

  // New whitelist state
  const [address, setAddress] = useState('');
  const [asset, setAsset] = useState('USDC');
  const [chain, setChain] = useState('ETH');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadCryptoData();
  }, []);

  const loadCryptoData = async () => {
    setLoading(true);
    try {
      const w = await alpacaFundingService.getCryptoWallets(accountId);
      const wl = await alpacaFundingService.getCryptoWhitelists(accountId);
      setWallets(w);
      setWhitelists(wl);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWhitelist = async () => {
    if (!address) return;
    setLoading(true);
    try {
      await alpacaFundingService.addCryptoWhitelist(accountId, address, asset, chain);
      setStatusMsg(`Address Whitelisted on ${chain} network for ${asset}`);
      setAddress('');
      loadCryptoData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-purple-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
            <Shield className="text-purple-400" size={24} />
            Alpaca Multi-Chain Crypto Funding & Travel Rule Enforcer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Native Custody Wallets (SOL, ETH, BTC, XRP, ARB) & 24h Travel Rule Whitelist Destination Validation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* On-Chain Deposit Wallets */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Lock className="text-cyan-400" size={18} />
            On-Chain Deposit Custody Wallets ({wallets.length})
          </h3>

          <div className="space-y-2">
            {wallets.map((w, idx) => (
              <div key={idx} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-400">{w.asset} ({w.chain} Chain)</span>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(w.created_at).toLocaleDateString()}</span>
                </div>
                <div className="font-mono text-[11px] text-cyan-300 break-all bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  {w.address}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Rule Address Whitelisting */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Shield className="text-emerald-400" size={18} />
            Whitelisted Withdrawal Destinations ({whitelists.length})
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {whitelists.map((wl) => (
              <div key={wl.id} className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-yellow-400">{wl.asset} [{wl.chain}]</span>
                  <p className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{wl.address}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {wl.status}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
            <span className="font-semibold text-slate-300 block">Register Whitelist Address (Travel Rule Required)</span>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-purple-500 text-slate-200"
              >
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ARB">Arbitrum (ARB)</option>
              </select>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-purple-500 text-slate-200"
              >
                <option value="USDC">USDC Stablecoin</option>
                <option value="SOL">SOL Native</option>
                <option value="ETH">ETH Native</option>
                <option value="WBTC">Wrapped BTC</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="0x... or Solana Destination Public Key"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleAddWhitelist}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition"
            >
              <Plus size={14} />
              Submit Travel Rule Whitelist
            </button>
            {statusMsg && (
              <div className="p-2 bg-slate-950 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                {statusMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlpacaCryptoWalletsView;

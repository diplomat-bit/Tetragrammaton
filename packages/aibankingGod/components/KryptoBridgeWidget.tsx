import React, { useState } from 'react';
import Card from './Card';
import { Zap, Wallet, ShieldCheck, DollarSign, RefreshCw, ArrowRight } from 'lucide-react';

export const KryptoBridgeWidget: React.FC = () => {
  const [fundingAmountUSD, setFundingAmountUSD] = useState('10000');
  const [tokenSymbol, setTokenSymbol] = useState('ETH');
  const [fundingSource, setFundingSource] = useState<'MODERN_TREASURY' | 'STRIPE'>('MODERN_TREASURY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const executeBridge = async () => {
    setIsProcessing(true);
    setLogs(["⚡ Initiating 1-Click MetaMask Bridge..."]);
    try {
      let myWallet = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
      let txHash = `0x${Math.random().toString(16).substring(2, 42)}`;

      if ((window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts[0]) myWallet = accounts[0];
          setLogs(prev => [...prev, `[METAMASK] Connected address: ${myWallet}`]);

          txHash = await (window as any).ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              to: myWallet,
              from: myWallet,
              value: '0x0',
              data: '0x4d545f46554e44' // MT_FUND
            }]
          });
          setLogs(prev => [...prev, `✅ MetaMask Approval Tx: ${txHash}`]);
        } catch (mErr: any) {
          setLogs(prev => [...prev, `⚠️ MetaMask interaction note: ${mErr.message}. Executing Modern Treasury Ledger credit.`]);
        }
      }

      setLogs(prev => [...prev, `[LEDGER] Submitting credit order to /api/v1/krypto/buy-with-ledger...`]);

      const res = await fetch("/api/v1/krypto/buy-with-ledger", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          metamaskAddress: myWallet,
          tokenSymbol,
          amountUSD: parseFloat(fundingAmountUSD),
          paymentSource: fundingSource,
          txHash
        })
      });

      const data = await res.json();
      if (data.success) {
        setLastTxHash(data.txHash);
        setLogs(prev => [...prev, `🎉 BRIDGE COMPLETE! Minted ${data.ethAmount} ${data.tokenSymbol} ($${fundingAmountUSD}) into ${myWallet}.`]);
      } else {
        setLogs(prev => [...prev, `❌ Error: ${data.error}`]);
      }
    } catch (e: any) {
      setLogs(prev => [...prev, `❌ Network Error: ${e.message}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card title="1-Click MetaMask + Modern Treasury Crypto Bridge" icon={<Zap className="text-orange-400" />}>
      <div className="space-y-5 pt-2 font-mono text-xs">
        <p className="text-gray-400">
          Directly bridge USD ledger balance from Modern Treasury wire accounts into on-chain MetaMask cryptocurrency.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-gray-400 uppercase block mb-1">Bridge Amount (USD)</label>
            <input
              type="number"
              value={fundingAmountUSD}
              onChange={(e) => setFundingAmountUSD(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 uppercase block mb-1">Target Crypto Asset</label>
            <select
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-orange-500"
            >
              <option value="ETH">Ethereum (ETH)</option>
              <option value="SOV">Sovereign Reserve (SOV)</option>
              <option value="USDC">USD Coin (USDC)</option>
              <option value="WBTC">Wrapped Bitcoin (WBTC)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 uppercase block mb-1">Settlement Source</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFundingSource('MODERN_TREASURY')}
                className={`flex-1 p-2 rounded-xl border text-[10px] font-bold ${fundingSource === 'MODERN_TREASURY' ? 'bg-orange-500/20 border-orange-500 text-white' : 'bg-slate-950 border-slate-800 text-gray-400'}`}
              >
                Modern Treasury
              </button>
              <button
                type="button"
                onClick={() => setFundingSource('STRIPE')}
                className={`flex-1 p-2 rounded-xl border text-[10px] font-bold ${fundingSource === 'STRIPE' ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-gray-400'}`}
              >
                Stripe Card
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={executeBridge}
          disabled={isProcessing}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />}
          {isProcessing ? 'BRIDGING ON-CHAIN...' : `BRIDGE $${parseFloat(fundingAmountUSD || '0').toLocaleString()} TO METAMASK`}
        </button>

        {logs.length > 0 && (
          <div className="p-3 bg-black rounded-xl border border-orange-500/30 max-h-36 overflow-y-auto space-y-1 font-mono text-[10px] text-orange-400 custom-scrollbar">
            {logs.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        )}
      </div>
    </Card>
  );
};

export default KryptoBridgeWidget;

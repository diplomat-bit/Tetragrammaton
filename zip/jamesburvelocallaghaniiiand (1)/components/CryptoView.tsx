import React, { useState } from 'react';

export const CryptoView: React.FC = () => {
  const [cryptos] = useState([
    { symbol: 'BTC', name: 'Bitcoin Institutional Vault', balance: '142.50 BTC', value: '$9,262,500.00', change: '+2.4%' },
    { symbol: 'ETH', name: 'Ethereum Staking Pool', balance: '1,850.00 ETH', value: '$6,290,000.00', change: '+4.1%' },
    { symbol: 'USDC', name: 'Circle Institutional Settlement', balance: '15,000,000.00 USDC', value: '$15,000,000.00', change: '0.0%' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Digital Assets & Crypto Custody Chamber</h1>
        <p className="text-sm text-gray-400">Institutional MPC security, multi-chain settlement rails, and automated staking yield</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cryptos.map(c => (
          <div key={c.symbol} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-cyan-400">{c.symbol}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{c.change}</span>
            </div>
            <p className="text-xs text-gray-400">{c.name}</p>
            <div className="pt-2 border-t border-gray-800 flex justify-between items-baseline">
              <span className="text-xs font-mono text-gray-300">{c.balance}</span>
              <span className="text-base font-bold text-white">{c.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoView;

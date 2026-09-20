import React, { useState } from 'react';

export const SovereignWealth: React.FC = () => {
  const [allocations] = useState([
    { assetClass: 'Global Sovereign Bonds & Gilts', allocation: '$180,000,000', weight: '36%', yield: '4.6%' },
    { assetClass: 'Strategic Infrastructure & Energy', allocation: '$140,000,000', weight: '28%', yield: '7.8%' },
    { assetClass: 'Private Equity & Sovereign Tech', allocation: '$110,000,000', weight: '22%', yield: '14.2%' },
    { assetClass: 'Gold Bullion & Precious Physical', allocation: '$70,000,000', weight: '14%', yield: '0.0%' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sovereign Wealth Fund & Macro Capital Reserves</h1>
        <p className="text-sm text-gray-400">Multi-generational sovereign endowment allocations, liquidity reserves, and inflation hedge</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allocations.map((a, idx) => (
          <div key={idx} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Weight: <strong className="text-cyan-400">{a.weight}</strong></span>
              <span>Yield: <strong className="text-emerald-400">{a.yield}</strong></span>
            </div>
            <h3 className="font-semibold text-base">{a.assetClass}</h3>
            <div className="text-2xl font-bold text-white pt-2">{a.allocation}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SovereignWealth;

import React, { useState } from 'react';

export const DerivativesDesk: React.FC = () => {
  const [positions] = useState([
    { contract: 'SPX 5500 Call Dec-26', delta: '0.62', gamma: '0.003', notional: '$12,500,000', pnl: '+$420,000' },
    { contract: 'UST 10Y Swap Spread', delta: '-0.15', gamma: '0.001', notional: '$50,000,000', pnl: '+$180,000' },
    { contract: 'EUR/USD Cross Currency Basis', delta: '0.00', gamma: '0.000', notional: '$20,000,000', pnl: '+$75,000' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Derivatives & Exotic Hedging Desk</h1>
        <p className="text-sm text-gray-400">Greeks matrix, interest rate swap pricing, and synthetic delta replication</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Contract Instrument</th>
              <th className="p-3">Delta (Δ)</th>
              <th className="p-3">Gamma (Γ)</th>
              <th className="p-3">Notional Exposure</th>
              <th className="p-3">Unrealized PnL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 font-mono text-xs">
            {positions.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-800/30">
                <td className="p-3 font-semibold text-white font-sans">{p.contract}</td>
                <td className="p-3 text-cyan-400">{p.delta}</td>
                <td className="p-3 text-gray-300">{p.gamma}</td>
                <td className="p-3 text-gray-300">{p.notional}</td>
                <td className="p-3 text-emerald-400 font-bold">{p.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DerivativesDesk;

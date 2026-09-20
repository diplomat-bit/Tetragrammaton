import React, { useState } from 'react';

export const CounterpartyDashboardView: React.FC = () => {
  const [counterparties] = useState([
    { id: 'CP-901', name: 'Citibank N.A. Institutional', riskScore: 'AAA', status: 'ACTIVE', volume: '$42.5M' },
    { id: 'CP-902', name: 'Barclays Global Custody', riskScore: 'AA+', status: 'ACTIVE', volume: '$18.2M' },
    { id: 'CP-903', name: 'BNP Paribas Arbitrage', riskScore: 'A+', status: 'REVIEW', volume: '$9.7M' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Counterparty Risk & Network Dashboard</h1>
        <p className="text-sm text-gray-400">Real-time creditworthiness scores, settlement exposure, and LEI validation</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Counterparty Name</th>
              <th className="p-3">Risk Rating</th>
              <th className="p-3">Settlement Volume</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {counterparties.map(cp => (
              <tr key={cp.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{cp.id}</td>
                <td className="p-3 font-semibold">{cp.name}</td>
                <td className="p-3 font-mono text-emerald-400">{cp.riskScore}</td>
                <td className="p-3 text-cyan-300 font-semibold">{cp.volume}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">{cp.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CounterpartyDashboardView;

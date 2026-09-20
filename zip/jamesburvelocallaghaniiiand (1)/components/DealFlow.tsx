import React, { useState } from 'react';

export const DealFlow: React.FC = () => {
  const [deals] = useState([
    { id: 'DF-01', target: 'Neuromorphic Compute Systems', stage: 'Due Diligence', round: 'Series B', size: '$25,000,000' },
    { id: 'DF-02', target: 'Helios Fusion Core Power', stage: 'Term Sheet Sent', round: 'Series A', size: '$40,000,000' },
    { id: 'DF-03', target: 'Aether Bio-Longevity Tech', stage: 'Closing Escrow', round: 'Growth', size: '$15,000,000' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Venture Deal Flow & Pipeline Management</h1>
        <p className="text-sm text-gray-400">Direct syndication, term sheet workflow, and cap table analytics</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Target Venture</th>
              <th className="p-3">Round</th>
              <th className="p-3">Allocation Size</th>
              <th className="p-3">Deal Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {deals.map(d => (
              <tr key={d.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{d.id}</td>
                <td className="p-3 font-semibold">{d.target}</td>
                <td className="p-3 text-purple-300 text-xs">{d.round}</td>
                <td className="p-3 text-emerald-400 font-bold">{d.size}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-900/40 text-blue-300 border border-blue-700/50">{d.stage}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealFlow;

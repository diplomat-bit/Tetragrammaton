import React, { useState } from 'react';

export const ReconciliationHubView: React.FC = () => {
  const [recons] = useState([
    { batch: 'REC-20260911-01', ledgerItems: 4250, bankItems: 4250, variance: '$0.00', status: 'BALANCED' },
    { batch: 'REC-20260910-02', ledgerItems: 3890, bankItems: 3890, variance: '$0.00', status: 'BALANCED' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Automated Multi-Bank Reconciliation Hub</h1>
        <p className="text-sm text-gray-400">Zero-variance 3-way matching between internal ledger, bank statements, and payment gateways</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Batch Number</th>
              <th className="p-3">Internal Ledger Items</th>
              <th className="p-3">Bank Statement Items</th>
              <th className="p-3">Variance</th>
              <th className="p-3">Reconciliation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {recons.map(r => (
              <tr key={r.batch} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{r.batch}</td>
                <td className="p-3">{r.ledgerItems.toLocaleString()}</td>
                <td className="p-3">{r.bankItems.toLocaleString()}</td>
                <td className="p-3 font-bold text-emerald-400">{r.variance}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReconciliationHubView;

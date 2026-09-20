import React, { useState } from 'react';

export const RecentTransactions: React.FC = () => {
  const [txs] = useState([
    { id: 'tx_881', date: 'Today, 15:30', desc: 'Citibank Commercial Inbound Wire', amount: '+$5,000,000.00', status: 'SETTLED' },
    { id: 'tx_882', date: 'Today, 12:10', desc: 'Stripe Nexus Payout to Treasury', amount: '+$1,240,000.00', status: 'SETTLED' },
    { id: 'tx_883', date: 'Yesterday, 18:45', desc: 'Private Equity Capital Call Disbursal', amount: '-$2,500,000.00', status: 'EXECUTED' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ledger Transactions & Audit Journal</h1>
        <p className="text-sm text-gray-400">Comprehensive real-time ledger records across all institutional accounts</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Tx ID</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Description</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {txs.map(t => (
              <tr key={t.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{t.id}</td>
                <td className="p-3 text-xs text-gray-400">{t.date}</td>
                <td className="p-3 font-semibold">{t.desc}</td>
                <td className={`p-3 font-bold ${t.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{t.amount}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;

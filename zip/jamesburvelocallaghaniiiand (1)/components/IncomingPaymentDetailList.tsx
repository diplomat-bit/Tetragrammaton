import React, { useState } from 'react';

export const IncomingPaymentDetailList: React.FC = () => {
  const [items] = useState([
    { id: 'inc_101', debtor: 'Citigroup North America', amount: '$2,500,000.00', currency: 'USD', channel: 'Fedwire', date: '2026-09-11 14:22' },
    { id: 'inc_102', debtor: 'HSBC Global Liquidity', amount: '€1,800,000.00', currency: 'EUR', channel: 'TARGET2', date: '2026-09-11 11:05' },
    { id: 'inc_103', debtor: 'Standard Chartered SG', amount: '$950,000.00', currency: 'USD', channel: 'CHIPS', date: '2026-09-11 08:30' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Incoming Payment Ingress Logs</h1>
        <p className="text-sm text-gray-400">Detailed wire message telemetry, ISO 20022 parsing, and ledger credit logs</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Payment ID</th>
              <th className="p-3">Debtor Institution</th>
              <th className="p-3">Gross Amount</th>
              <th className="p-3">Rail</th>
              <th className="p-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{item.id}</td>
                <td className="p-3 font-semibold">{item.debtor}</td>
                <td className="p-3 font-bold text-emerald-400">{item.amount}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-xs bg-blue-900/40 text-blue-300">{item.channel}</span></td>
                <td className="p-3 text-xs text-gray-400">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomingPaymentDetailList;

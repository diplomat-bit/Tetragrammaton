import React, { useState } from 'react';

export const ExpectedPaymentsTable: React.FC = () => {
  const [expected] = useState([
    { id: 'exp_01', counterparty: 'BlackRock Fixed Income', amount: '$4,200,000.00', expectedDate: 'Today, 17:00 EST', status: 'PENDING_INGRESS' },
    { id: 'exp_02', counterparty: 'Goldman Sachs Treasury', amount: '$12,800,000.00', expectedDate: 'Tomorrow, 09:00 EST', status: 'MATCHED' },
    { id: 'exp_03', counterparty: 'Morgan Stanley Prime', amount: '$1,500,000.00', expectedDate: 'Sep 15, 12:00 EST', status: 'CONFIRMED' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Expected Inbound Payments & Liquidity Forecast</h1>
        <p className="text-sm text-gray-400">Automated matching of inbound wires, ACH returns, and SEPA credit transfers</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Ref ID</th>
              <th className="p-3">Originating Counterparty</th>
              <th className="p-3">Expected Amount</th>
              <th className="p-3">Settlement Window</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {expected.map(e => (
              <tr key={e.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{e.id}</td>
                <td className="p-3 font-semibold">{e.counterparty}</td>
                <td className="p-3 font-bold text-emerald-400">{e.amount}</td>
                <td className="p-3 text-xs text-gray-400">{e.expectedDate}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpectedPaymentsTable;

import React, { useState } from 'react';

export const CustomerDashboard: React.FC = () => {
  const [customers] = useState([
    { id: 'cus_991', name: 'Apex Global Holdings Ltd', email: 'treasury@apexholdings.com', status: 'Active', tier: 'Enterprise' },
    { id: 'cus_992', name: 'Quantum Capital Partners', email: 'settlements@quantumcp.io', status: 'Active', tier: 'Institutional' },
    { id: 'cus_993', name: 'Vanguard Alpha Fund', email: 'ops@vanguardalpha.com', status: 'Verified', tier: 'Prime' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Client & Customer Directory</h1>
        <p className="text-sm text-gray-400">KYC/AML verified enterprise counterparties and portfolio corporate accounts</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Customer ID</th>
              <th className="p-3">Entity Name</th>
              <th className="p-3">Contact Email</th>
              <th className="p-3">Tier</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{c.id}</td>
                <td className="p-3 font-semibold">{c.name}</td>
                <td className="p-3 text-gray-400 text-xs font-mono">{c.email}</td>
                <td className="p-3 text-xs text-purple-300 font-semibold">{c.tier}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboard;

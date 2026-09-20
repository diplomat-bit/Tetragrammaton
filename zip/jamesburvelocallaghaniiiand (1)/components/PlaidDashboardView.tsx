import React, { useState } from 'react';

export const PlaidDashboardView: React.FC = () => {
  const [items] = useState([
    { institution: 'JPMorgan Chase Institutional', accounts: 4, balance: '$18,400,000.00', status: 'Healthy' },
    { institution: 'Bank of America Treasury', accounts: 2, balance: '$9,250,000.00', status: 'Healthy' },
    { institution: 'Wells Fargo Commercial', accounts: 3, balance: '$6,120,000.00', status: 'Healthy' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plaid Connected Accounts & Balance Aggregator</h1>
        <p className="text-sm text-gray-400">Direct open banking aggregation and real-time multi-institution telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it, idx) => (
          <div key={idx} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{it.accounts} Linked Accounts</span>
              <span className="text-xs text-emerald-400 font-semibold">{it.status}</span>
            </div>
            <h3 className="font-semibold text-base">{it.institution}</h3>
            <div className="text-2xl font-bold text-cyan-400 pt-2">{it.balance}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaidDashboardView;

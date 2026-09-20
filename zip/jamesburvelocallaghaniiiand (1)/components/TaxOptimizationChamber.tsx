import React, { useState } from 'react';

export const TaxOptimizationChamber: React.FC = () => {
  const [strategies] = useState([
    { name: 'Qualified Small Business Stock (QSBS § 1202)', savings: '$10,000,000 Exemption', status: 'Optimized' },
    { name: 'Accelerated Cost Recovery & Depreciation (§ 179)', savings: '$4,200,000 Deducted', status: 'Applied' },
    { name: 'Cross-Border Double Tax Treaty Relief (US/UK)', savings: '$1,850,000 Credits', status: 'Filed' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Tax Optimization & Strategy Chamber</h1>
        <p className="text-sm text-gray-400">Algorithmic tax loss harvesting, statutory credit utilization, and transfer pricing models</p>
      </div>

      <div className="space-y-4">
        {strategies.map((s, idx) => (
          <div key={idx} className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-base">{s.name}</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-1">{s.savings}</p>
            </div>
            <span className="px-3 py-1 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 text-xs font-semibold">{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxOptimizationChamber;

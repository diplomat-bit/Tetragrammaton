import React, { useState } from 'react';

export const CreditHealthView: React.FC = () => {
  const [creditMetrics] = useState({
    score: 825,
    rating: 'Tier 1 Prime / Institutional',
    utilization: '14.2%',
    totalFacility: '$25,000,000',
    availableLiquidity: '$21,450,000'
  });

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Credit Health & Commercial Rating Matrix</h1>
        <p className="text-sm text-gray-400">Institutional credit score tracking, Moody’s/S&P benchmark parity, and leverage diagnostics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Composite Score</span>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{creditMetrics.score}</div>
          <span className="text-xs text-emerald-500 font-medium">{creditMetrics.rating}</span>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Total Credit Facility</span>
          <div className="text-3xl font-bold text-cyan-400 mt-2">{creditMetrics.totalFacility}</div>
          <span className="text-xs text-gray-400">Utilization: {creditMetrics.utilization}</span>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Available Instant Liquidity</span>
          <div className="text-3xl font-bold text-white mt-2">{creditMetrics.availableLiquidity}</div>
          <span className="text-xs text-cyan-400 font-medium">Revolving Overdraft Guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default CreditHealthView;

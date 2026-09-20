import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Treasury & Liquidity Control</h1>
          <p className="text-sm text-gray-400">Consolidated financial overview across Stripe Nexus, Citibank B2B, and Plaid CRA rails</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Total Liquid Capital</span>
          <div className="text-3xl font-bold text-white mt-1">$48,920,450.00</div>
          <span className="text-xs text-emerald-400">+3.8% this quarter</span>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Citibank Treasury Pool</span>
          <div className="text-3xl font-bold text-cyan-400 mt-1">$28,500,000.00</div>
          <span className="text-xs text-gray-400">Yield: 4.85% APY</span>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Stripe Nexus Clearing</span>
          <div className="text-3xl font-bold text-purple-400 mt-1">$14,220,450.00</div>
          <span className="text-xs text-gray-400">Real-time settlement</span>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">System Compliance Status</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">100% SEC/CFTC</div>
          <span className="text-xs text-emerald-500">Zero open audits</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

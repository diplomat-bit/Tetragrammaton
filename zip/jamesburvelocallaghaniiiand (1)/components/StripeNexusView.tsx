import React, { useState } from 'react';

export const StripeNexusView: React.FC = () => {
  const [metrics] = useState({
    grossVolume: '$24,500,000.00',
    netSettled: '$23,985,500.00',
    disputeRate: '0.02%',
    activeConnectAccounts: 1420
  });

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stripe Nexus Enterprise Settlement Terminal</h1>
        <p className="text-sm text-gray-400">Custom Connected Account orchestration, automatic multi-currency payouts, and fee splits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Gross Volume (30D)</span>
          <div className="text-2xl font-bold text-white mt-1">{metrics.grossVolume}</div>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Net Settled</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.netSettled}</div>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Dispute Ratio</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{metrics.disputeRate}</div>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Connect Accounts</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">{metrics.activeConnectAccounts}</div>
        </div>
      </div>
    </div>
  );
};

export default StripeNexusView;

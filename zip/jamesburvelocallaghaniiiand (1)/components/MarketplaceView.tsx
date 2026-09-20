import React, { useState } from 'react';

export const MarketplaceView: React.FC = () => {
  const [integrations] = useState([
    { id: 'citi_b2b', name: 'Citibank Commercial B2B API', category: 'Banking Rails', status: 'Connected' },
    { id: 'plaid_cra', name: 'Plaid CRA Credit Intelligence', category: 'Risk & Identity', status: 'Active' },
    { id: 'stripe_nexus', name: 'Stripe Nexus Global Acquiring', category: 'Payments', status: 'Active' },
    { id: 'swift_gpi', name: 'SWIFT gpi Cross-Border Tracker', category: 'Settlement', status: 'Configured' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Integration Marketplace</h1>
        <p className="text-sm text-gray-400">Direct core banking plugins, API connectors, and automated clearing networks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(item => (
          <div key={item.id} className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400">{item.category}</span>
              <h3 className="font-semibold text-base mt-0.5">{item.name}</h3>
            </div>
            <span className="px-3 py-1 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 text-xs font-semibold">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceView;

import React, { useState } from 'react';

export const RealEstateEmpire: React.FC = () => {
  const [properties] = useState([
    { id: 'RE-101', name: 'One Manhattan West Commercial Tower', location: 'New York, NY', value: '$450,000,000', capRate: '6.4%', occupancy: '98%' },
    { id: 'RE-102', name: 'Mayfair Heritage Prime Logistics Hub', location: 'London, UK', value: '£180,000,000', capRate: '7.1%', occupancy: '100%' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Real Estate Portfolio & Global Property Syndicate</h1>
        <p className="text-sm text-gray-400">Prime commercial real estate holdings, net operating income (NOI), and debt covenants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map(p => (
          <div key={p.id} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-cyan-400">{p.id}</span>
              <span className="text-gray-400">{p.location}</span>
            </div>
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <div className="text-2xl font-bold text-emerald-400">{p.value}</div>
            <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
              <span>Cap Rate: {p.capRate}</span>
              <span>Occupancy: {p.occupancy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealEstateEmpire;

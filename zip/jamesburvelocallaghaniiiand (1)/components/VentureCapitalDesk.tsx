import React, { useState } from 'react';

export const VentureCapitalDesk: React.FC = () => {
  const [portfolio] = useState([
    { company: 'Hyperion Quantum Labs', invested: '$15,000,000', currentVal: '$45,000,000', multiple: '3.0x' },
    { company: 'NeuraLink Bio-Interface', invested: '$20,000,000', currentVal: '$60,000,000', multiple: '3.0x' },
    { company: 'Solaris Space Propulsion', invested: '$10,000,000', currentVal: '$28,000,000', multiple: '2.8x' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Venture Capital Portfolio & Direct Investments</h1>
        <p className="text-sm text-gray-400">Direct equity stakes, MOIC tracking, follow-on reserves, and board governance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {portfolio.map((p, idx) => (
          <div key={idx} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <span className="text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 font-semibold">{p.multiple} MOIC</span>
            <h3 className="font-semibold text-base mt-2">{p.company}</h3>
            <div className="flex justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
              <span>Invested: {p.invested}</span>
              <span className="text-emerald-400 font-bold">{p.currentVal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VentureCapitalDesk;

import React, { useState } from 'react';

export const ConciergeService: React.FC = () => {
  const [requests] = useState([
    { id: 'req_01', type: 'Private Aviation Charter', status: 'CONFIRMED', time: 'Today, 14:00 EST' },
    { id: 'req_02', type: 'High-Value Escrow Delivery', status: 'PROCESSING', time: 'Tomorrow, 09:30 EST' },
    { id: 'req_03', type: 'Bespoke Advisory Meeting', status: 'SCHEDULED', time: 'Sep 15, 11:00 EST' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Executive Concierge & VIP Services</h1>
        <p className="text-sm text-gray-400">24/7 dedicated private banking concierge and high-touch logistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {requests.map(r => (
          <div key={r.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg space-y-2">
            <span className="text-xs font-mono text-cyan-400">{r.id}</span>
            <h4 className="font-semibold text-sm">{r.type}</h4>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{r.time}</span>
              <span className="text-emerald-400 font-semibold">{r.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConciergeService;

import React, { useState } from 'react';

export const PhilanthropyHub: React.FC = () => {
  const [endowments] = useState([
    { name: 'Clean Energy & Fusion Initiative', grantAmount: '$10,000,000', impact: '3 Research Labs Funded', status: 'Active' },
    { name: 'Global STEM Education Endowment', grantAmount: '$5,000,000', impact: '24,000 Scholarships', status: 'Disbursing' },
    { name: 'Ocean Conservation Alliance', grantAmount: '$2,500,000', impact: '8 Marine Sanctuaries Protected', status: 'Active' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Philanthropic Foundation & Impact Endowment</h1>
        <p className="text-sm text-gray-400">Strategic charitable grants, donor-advised fund management, and global impact metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {endowments.map((e, idx) => (
          <div key={idx} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <span className="text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/50">{e.status}</span>
            <h3 className="font-semibold text-base">{e.name}</h3>
            <div className="text-2xl font-bold text-emerald-400 mt-2">{e.grantAmount}</div>
            <p className="text-xs text-gray-400">{e.impact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhilanthropyHub;

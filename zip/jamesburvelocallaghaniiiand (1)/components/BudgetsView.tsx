import React, { useState } from 'react';

export const BudgetsView: React.FC = () => {
  const [budgets] = useState([
    { category: 'Enterprise Infrastructure & Cloud', allocated: '$120,000', spent: '$94,500', remaining: '$25,500', progress: 78 },
    { category: 'Compliance & Regulatory Oracles', allocated: '$85,000', spent: '$62,300', remaining: '$22,700', progress: 73 },
    { category: 'Algorithmic Liquidity Provision', allocated: '$500,000', spent: '$410,000', remaining: '$90,000', progress: 82 },
    { category: 'Executive Concierge & Travel', allocated: '$45,000', spent: '$28,100', remaining: '$16,900', progress: 62 }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Capital Budgets & Cash Flow Control</h1>
        <p className="text-sm text-gray-400">Departmental expenditure thresholds, real-time variance alerts, and budget limits</p>
      </div>

      <div className="space-y-4">
        {budgets.map((b, idx) => (
          <div key={idx} className="p-4 bg-gray-900 border border-gray-800 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{b.category}</span>
              <span className="text-xs text-gray-400">Spent: <strong className="text-white">{b.spent}</strong> / {b.allocated}</span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${b.progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{b.progress}% utilized</span>
              <span className="text-emerald-400 font-semibold">{b.remaining} remaining</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetsView;

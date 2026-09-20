import React, { useState } from 'react';

export const UniversalObjectInspector: React.FC<{ data?: any }> = ({ data = { id: 'obj_demo', type: 'balance_transaction', amount: 50000, currency: 'usd' } }) => {
  const [inspected] = useState(data);

  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-white space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold">Universal Object Inspector</h4>
        <span className="text-xs font-mono text-cyan-400">JSON Protocol</span>
      </div>
      <pre className="p-3 bg-gray-950 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
        {JSON.stringify(inspected, null, 2)}
      </pre>
    </div>
  );
};

export default UniversalObjectInspector;

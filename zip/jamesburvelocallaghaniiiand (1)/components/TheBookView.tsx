import React from 'react';

export const TheBookView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">The Book: Master Institutional Ledger</h1>
        <p className="text-sm text-gray-400">Cryptographically verified immutability chain, journal entries, and real-time trial balance</p>
      </div>

      <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
        <div className="flex justify-between items-center text-xs font-mono text-cyan-400 pb-3 border-b border-gray-800">
          <span>ROOT_HASH: 0x9f8b72c4e1a0d3f829a8c17b5e43a90d8329b...</span>
          <span className="text-emerald-400">STATUS: PROVEN_VALID</span>
        </div>
        <p className="text-sm text-gray-300">The master record ledger is fully synchronized across all corporate entities and banking partners.</p>
      </div>
    </div>
  );
};

export default TheBookView;

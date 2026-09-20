import React, { useState } from 'react';

export const EarlyFraudWarningFeed: React.FC = () => {
  const [warnings] = useState([
    { id: 'EFW-884', charge: 'ch_3N84x9', riskLevel: 'HIGH', issuer: 'Chase Visa', reason: 'suspected_compromise', timestamp: '10m ago' },
    { id: 'EFW-885', charge: 'ch_3N85y1', riskLevel: 'ELEVATED', issuer: 'Barclays MC', reason: 'counterfeit_card', timestamp: '24m ago' },
    { id: 'EFW-886', charge: 'ch_3N86z2', riskLevel: 'LOW', issuer: 'Amex Corp', reason: 'velocity_spike', timestamp: '1h ago' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">TC40 / SAFE Early Fraud Warning Interceptor</h1>
        <p className="text-sm text-gray-400">Pre-chargeback telemetry feed directly from Visa and Mastercard fraud databases</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Warning ID</th>
              <th className="p-3">Charge Ref</th>
              <th className="p-3">Card Issuer</th>
              <th className="p-3">Fraud Reason</th>
              <th className="p-3">Risk Level</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {warnings.map(w => (
              <tr key={w.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{w.id}</td>
                <td className="p-3 font-mono text-xs text-gray-300">{w.charge}</td>
                <td className="p-3 font-semibold">{w.issuer}</td>
                <td className="p-3 text-xs text-yellow-300 font-mono">{w.reason}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${w.riskLevel === 'HIGH' ? 'bg-red-900/40 text-red-300 border border-red-700/50' : 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/50'}`}>
                    {w.riskLevel}
                  </span>
                </td>
                <td className="p-3 text-xs text-gray-400">{w.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarlyFraudWarningFeed;

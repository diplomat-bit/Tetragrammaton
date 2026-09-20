import React, { useState } from 'react';

export const QuantumWeaverView: React.FC = () => {
  const [threads] = useState([
    { id: 'TH-01', pipeline: 'Cross-Border FX Optimization', speed: '0.42ms', throughput: '12,500 tx/sec', status: 'OPTIMAL' },
    { id: 'TH-02', pipeline: 'Dynamic Liquidity Auto-Rebalancing', speed: '1.18ms', throughput: '8,200 tx/sec', status: 'RUNNING' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quantum Weaver Execution Matrix</h1>
        <p className="text-sm text-gray-400">High-throughput sub-millisecond liquidity routing and neural settlement orchestration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {threads.map(t => (
          <div key={t.id} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-cyan-400">{t.id}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{t.status}</span>
            </div>
            <h3 className="font-semibold text-base">{t.pipeline}</h3>
            <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
              <span>Latency: <strong className="text-cyan-300">{t.speed}</strong></span>
              <span>Throughput: <strong className="text-emerald-300">{t.throughput}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuantumWeaverView;

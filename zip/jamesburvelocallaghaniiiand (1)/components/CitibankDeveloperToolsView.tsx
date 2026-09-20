import React, { useState } from 'react';

export const CitibankDeveloperToolsView: React.FC = () => {
  const [logs] = useState([
    { id: 'log_01', method: 'GET', endpoint: '/v1/accounts/citi/treasury', status: 200, latency: '42ms' },
    { id: 'log_02', method: 'POST', endpoint: '/v1/settlements/wire/execute', status: 201, latency: '120ms' },
    { id: 'log_03', method: 'POST', endpoint: '/v1/webhooks/subscribe', status: 200, latency: '35ms' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Citibank Developer Tools & Sandbox API Console</h1>
        <p className="text-sm text-gray-400">Interactive API request logger, webhook telemetry, and institutional endpoint simulator</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 font-semibold text-sm">Real-time HTTP Request Stream</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Method</th>
              <th className="p-3">Endpoint</th>
              <th className="p-3">Status</th>
              <th className="p-3">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 font-mono text-xs">
            {logs.map(l => (
              <tr key={l.id} className="hover:bg-gray-800/30">
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-semibold">{l.method}</span></td>
                <td className="p-3 text-cyan-400">{l.endpoint}</td>
                <td className="p-3"><span className="text-emerald-400 font-semibold">{l.status} OK</span></td>
                <td className="p-3 text-gray-400">{l.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CitibankDeveloperToolsView;

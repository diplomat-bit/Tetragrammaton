import React, { useState } from 'react';

export const CitibankCrossBorderView: React.FC = () => {
  const [transfers] = useState([
    { ref: 'CB-99482', dest: 'London Branch (GB)', amount: '£450,000.00', fxRate: '1.2740 USD/GBP', status: 'SETTLED' },
    { ref: 'CB-99483', dest: 'Tokyo Desk (JP)', amount: '¥85,000,000', fxRate: '154.20 USD/JPY', status: 'IN_TRANSIT' },
    { ref: 'CB-99484', dest: 'Frankfurt Hub (DE)', amount: '€1,200,000.00', fxRate: '1.0850 USD/EUR', status: 'CLEARING' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Citibank Cross-Border Payment Rail & FX Engine</h1>
        <p className="text-sm text-gray-400">Real-time SWIFT gpi, Target2, and ISO 20022 international settlement corridor</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Reference</th>
              <th className="p-3">Destination Corridor</th>
              <th className="p-3">Settlement Amount</th>
              <th className="p-3">Locked FX Rate</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {transfers.map(t => (
              <tr key={t.ref} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{t.ref}</td>
                <td className="p-3">{t.dest}</td>
                <td className="p-3 font-semibold text-emerald-400">{t.amount}</td>
                <td className="p-3 font-mono text-gray-300">{t.fxRate}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CitibankCrossBorderView;

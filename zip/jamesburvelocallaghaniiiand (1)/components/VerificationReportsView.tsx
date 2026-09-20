import React, { useState } from 'react';

export const VerificationReportsView: React.FC = () => {
  const [reports] = useState([
    { id: 'VR-901', subject: 'Apex Global Corp', type: 'KYB Full Entity Audit', outcome: 'PASSED', date: '2026-09-11' },
    { id: 'VR-902', subject: 'Quantum Capital Desk', type: 'Anti-Money Laundering Screen', outcome: 'PASSED', date: '2026-09-10' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional KYC/AML Verification Reports</h1>
        <p className="text-sm text-gray-400">Identity verification reports, sanctions screening matches, and PEP disclosures</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Report Ref</th>
              <th className="p-3">Subject Entity</th>
              <th className="p-3">Verification Scope</th>
              <th className="p-3">Outcome</th>
              <th className="p-3">Audit Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reports.map(r => (
              <tr key={r.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{r.id}</td>
                <td className="p-3 font-semibold">{r.subject}</td>
                <td className="p-3 text-gray-300">{r.type}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{r.outcome}</span></td>
                <td className="p-3 text-xs text-gray-400">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerificationReportsView;

import fs from 'fs';

// 1. ArtCollectibles.tsx
const artCollectibles = `import React, { useState } from 'react';

export interface Collectible {
  id: string;
  name: string;
  artist: string;
  valuation: string;
  category: string;
  status: string;
}

export const ArtCollectibles: React.FC = () => {
  const [items] = useState<Collectible[]>([
    { id: 'art_01', name: 'Quantum Abstract Resonance No. 4', artist: 'H. Vance', valuation: '$1,850,000', category: 'Contemporary Oil', status: 'Vault Secured' },
    { id: 'art_02', name: 'Chronos Mechanical Tourbillon 1954', artist: 'Patek Philippe & Co', valuation: '$720,000', category: 'Horology', status: 'In Transit' },
    { id: 'art_03', name: 'Imperial Jadeite Pendant', artist: 'Dynasty Archives', valuation: '$3,400,000', category: 'High Jewelry', status: 'Insured Escrow' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Art & Luxury Collectibles Registry</h1>
          <p className="text-sm text-gray-400">Institutional custodian vault, provenance verification, and asset collateralization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-cyan-400">{item.id}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{item.status}</span>
            </div>
            <h3 className="font-semibold text-base">{item.name}</h3>
            <p className="text-xs text-gray-400">Creator: {item.artist}</p>
            <div className="pt-2 border-t border-gray-800 flex justify-between items-center">
              <span className="text-xs text-gray-400">{item.category}</span>
              <span className="font-bold text-cyan-300">{item.valuation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtCollectibles;
`;
fs.writeFileSync('components/ArtCollectibles.tsx', artCollectibles, 'utf8');

// 2. BudgetsView.tsx - clean component
const budgetsView = `import React, { useState } from 'react';

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
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: \`\${b.progress}%\` }}></div>
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
`;
fs.writeFileSync('components/BudgetsView.tsx', budgetsView, 'utf8');

// 3. CounterpartyDashboardView.tsx
const cpDashboard = `import React, { useState } from 'react';

export const CounterpartyDashboardView: React.FC = () => {
  const [counterparties] = useState([
    { id: 'CP-901', name: 'Citibank N.A. Institutional', riskScore: 'AAA', status: 'ACTIVE', volume: '$42.5M' },
    { id: 'CP-902', name: 'Barclays Global Custody', riskScore: 'AA+', status: 'ACTIVE', volume: '$18.2M' },
    { id: 'CP-903', name: 'BNP Paribas Arbitrage', riskScore: 'A+', status: 'REVIEW', volume: '$9.7M' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Counterparty Risk & Network Dashboard</h1>
        <p className="text-sm text-gray-400">Real-time creditworthiness scores, settlement exposure, and LEI validation</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Counterparty Name</th>
              <th className="p-3">Risk Rating</th>
              <th className="p-3">Settlement Volume</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {counterparties.map(cp => (
              <tr key={cp.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{cp.id}</td>
                <td className="p-3 font-semibold">{cp.name}</td>
                <td className="p-3 font-mono text-emerald-400">{cp.riskScore}</td>
                <td className="p-3 text-cyan-300 font-semibold">{cp.volume}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">{cp.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CounterpartyDashboardView;
`;
fs.writeFileSync('components/CounterpartyDashboardView.tsx', cpDashboard, 'utf8');

// 4. ConciergeService.tsx
const conciergeService = `import React, { useState } from 'react';

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
`;
fs.writeFileSync('components/ConciergeService.tsx', conciergeService, 'utf8');

// 5. CitibankCrossBorderView.tsx
const citiCrossBorder = `import React, { useState } from 'react';

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
`;
fs.writeFileSync('components/CitibankCrossBorderView.tsx', citiCrossBorder, 'utf8');

// 6. CitibankAccountProxyView.tsx
const citiProxy = `import React from 'react';

export const CitibankAccountProxyView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Citibank Account Proxy & Virtual Sub-Ledger Router</h1>
      <p className="text-sm text-gray-400">Configure virtual IBANs, multi-tenant automated ledger routing, and account proxies.</p>
      <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
        <span className="text-xs font-mono text-cyan-400">PROXY_ROUTER: ACTIVE (Port 443 / TLS 1.3)</span>
      </div>
    </div>
  );
};

export default CitibankAccountProxyView;
`;
fs.writeFileSync('components/CitibankAccountProxyView.tsx', citiProxy, 'utf8');

console.log('Fixed broken component files!');

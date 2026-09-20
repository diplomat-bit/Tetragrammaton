import fs from 'fs';

const comps = {
'CryptoView.tsx': `import React, { useState } from 'react';

export const CryptoView: React.FC = () => {
  const [cryptos] = useState([
    { symbol: 'BTC', name: 'Bitcoin Institutional Vault', balance: '142.50 BTC', value: '$9,262,500.00', change: '+2.4%' },
    { symbol: 'ETH', name: 'Ethereum Staking Pool', balance: '1,850.00 ETH', value: '$6,290,000.00', change: '+4.1%' },
    { symbol: 'USDC', name: 'Circle Institutional Settlement', balance: '15,000,000.00 USDC', value: '$15,000,000.00', change: '0.0%' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Digital Assets & Crypto Custody Chamber</h1>
        <p className="text-sm text-gray-400">Institutional MPC security, multi-chain settlement rails, and automated staking yield</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cryptos.map(c => (
          <div key={c.symbol} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-cyan-400">{c.symbol}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{c.change}</span>
            </div>
            <p className="text-xs text-gray-400">{c.name}</p>
            <div className="pt-2 border-t border-gray-800 flex justify-between items-baseline">
              <span className="text-xs font-mono text-gray-300">{c.balance}</span>
              <span className="text-base font-bold text-white">{c.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoView;
`,

'CustomerDashboard.tsx': `import React, { useState } from 'react';

export const CustomerDashboard: React.FC = () => {
  const [customers] = useState([
    { id: 'cus_991', name: 'Apex Global Holdings Ltd', email: 'treasury@apexholdings.com', status: 'Active', tier: 'Enterprise' },
    { id: 'cus_992', name: 'Quantum Capital Partners', email: 'settlements@quantumcp.io', status: 'Active', tier: 'Institutional' },
    { id: 'cus_993', name: 'Vanguard Alpha Fund', email: 'ops@vanguardalpha.com', status: 'Verified', tier: 'Prime' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Client & Customer Directory</h1>
        <p className="text-sm text-gray-400">KYC/AML verified enterprise counterparties and portfolio corporate accounts</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Customer ID</th>
              <th className="p-3">Entity Name</th>
              <th className="p-3">Contact Email</th>
              <th className="p-3">Tier</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{c.id}</td>
                <td className="p-3 font-semibold">{c.name}</td>
                <td className="p-3 text-gray-400 text-xs font-mono">{c.email}</td>
                <td className="p-3 text-xs text-purple-300 font-semibold">{c.tier}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboard;
`,

'Dashboard.tsx': `import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Treasury & Liquidity Control</h1>
          <p className="text-sm text-gray-400">Consolidated financial overview across Stripe Nexus, Citibank B2B, and Plaid CRA rails</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Total Liquid Capital</span>
          <div className="text-3xl font-bold text-white mt-1">$48,920,450.00</div>
          <span className="text-xs text-emerald-400">+3.8% this quarter</span>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Citibank Treasury Pool</span>
          <div className="text-3xl font-bold text-cyan-400 mt-1">$28,500,000.00</div>
          <span className="text-xs text-gray-400">Yield: 4.85% APY</span>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Stripe Nexus Clearing</span>
          <div className="text-3xl font-bold text-purple-400 mt-1">$14,220,450.00</div>
          <span className="text-xs text-gray-400">Real-time settlement</span>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">System Compliance Status</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">100% SEC/CFTC</div>
          <span className="text-xs text-emerald-500">Zero open audits</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
`,

'DealFlow.tsx': `import React, { useState } from 'react';

export const DealFlow: React.FC = () => {
  const [deals] = useState([
    { id: 'DF-01', target: 'Neuromorphic Compute Systems', stage: 'Due Diligence', round: 'Series B', size: '$25,000,000' },
    { id: 'DF-02', target: 'Helios Fusion Core Power', stage: 'Term Sheet Sent', round: 'Series A', size: '$40,000,000' },
    { id: 'DF-03', target: 'Aether Bio-Longevity Tech', stage: 'Closing Escrow', round: 'Growth', size: '$15,000,000' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Venture Deal Flow & Pipeline Management</h1>
        <p className="text-sm text-gray-400">Direct syndication, term sheet workflow, and cap table analytics</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Target Venture</th>
              <th className="p-3">Round</th>
              <th className="p-3">Allocation Size</th>
              <th className="p-3">Deal Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {deals.map(d => (
              <tr key={d.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{d.id}</td>
                <td className="p-3 font-semibold">{d.target}</td>
                <td className="p-3 text-purple-300 text-xs">{d.round}</td>
                <td className="p-3 text-emerald-400 font-bold">{d.size}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-900/40 text-blue-300 border border-blue-700/50">{d.stage}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealFlow;
`,

'DerivativesDesk.tsx': `import React, { useState } from 'react';

export const DerivativesDesk: React.FC = () => {
  const [positions] = useState([
    { contract: 'SPX 5500 Call Dec-26', delta: '0.62', gamma: '0.003', notional: '$12,500,000', pnl: '+$420,000' },
    { contract: 'UST 10Y Swap Spread', delta: '-0.15', gamma: '0.001', notional: '$50,000,000', pnl: '+$180,000' },
    { contract: 'EUR/USD Cross Currency Basis', delta: '0.00', gamma: '0.000', notional: '$20,000,000', pnl: '+$75,000' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Derivatives & Exotic Hedging Desk</h1>
        <p className="text-sm text-gray-400">Greeks matrix, interest rate swap pricing, and synthetic delta replication</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Contract Instrument</th>
              <th className="p-3">Delta (Δ)</th>
              <th className="p-3">Gamma (Γ)</th>
              <th className="p-3">Notional Exposure</th>
              <th className="p-3">Unrealized PnL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 font-mono text-xs">
            {positions.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-800/30">
                <td className="p-3 font-semibold text-white font-sans">{p.contract}</td>
                <td className="p-3 text-cyan-400">{p.delta}</td>
                <td className="p-3 text-gray-300">{p.gamma}</td>
                <td className="p-3 text-gray-300">{p.notional}</td>
                <td className="p-3 text-emerald-400 font-bold">{p.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DerivativesDesk;
`,

'EarlyFraudWarningFeed.tsx': `import React, { useState } from 'react';

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
                  <span className={\`px-2 py-0.5 rounded text-xs \${w.riskLevel === 'HIGH' ? 'bg-red-900/40 text-red-300 border border-red-700/50' : 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/50'}\`}>
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
`,

'EventNotificationCard.tsx': `import React from 'react';

export interface EventNotificationProps {
  title?: string;
  message?: string;
  type?: 'info' | 'warning' | 'success';
}

export const EventNotificationCard: React.FC<EventNotificationProps> = ({
  title = 'Institutional Notification',
  message = 'Real-time settlement confirmation executed successfully across multi-currency channels.',
  type = 'info'
}) => {
  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-2 text-white">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">{title}</h4>
        <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">{type.toUpperCase()}</span>
      </div>
      <p className="text-xs text-gray-400">{message}</p>
    </div>
  );
};

export default EventNotificationCard;
`,

'ExpectedPaymentsTable.tsx': `import React, { useState } from 'react';

export const ExpectedPaymentsTable: React.FC = () => {
  const [expected] = useState([
    { id: 'exp_01', counterparty: 'BlackRock Fixed Income', amount: '$4,200,000.00', expectedDate: 'Today, 17:00 EST', status: 'PENDING_INGRESS' },
    { id: 'exp_02', counterparty: 'Goldman Sachs Treasury', amount: '$12,800,000.00', expectedDate: 'Tomorrow, 09:00 EST', status: 'MATCHED' },
    { id: 'exp_03', counterparty: 'Morgan Stanley Prime', amount: '$1,500,000.00', expectedDate: 'Sep 15, 12:00 EST', status: 'CONFIRMED' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Expected Inbound Payments & Liquidity Forecast</h1>
        <p className="text-sm text-gray-400">Automated matching of inbound wires, ACH returns, and SEPA credit transfers</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Ref ID</th>
              <th className="p-3">Originating Counterparty</th>
              <th className="p-3">Expected Amount</th>
              <th className="p-3">Settlement Window</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {expected.map(e => (
              <tr key={e.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{e.id}</td>
                <td className="p-3 font-semibold">{e.counterparty}</td>
                <td className="p-3 font-bold text-emerald-400">{e.amount}</td>
                <td className="p-3 text-xs text-gray-400">{e.expectedDate}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpectedPaymentsTable;
`,

'IdentityView.tsx': `import React, { useState } from 'react';

export const IdentityView: React.FC = () => {
  const [identity] = useState({
    legalName: 'James Burvel O’Callaghan III Institutional Trust',
    taxId: 'XX-XXX4910',
    lei: '5493006MHB84DD0Z4Y42',
    jurisdiction: 'Delaware, United States',
    kybStatus: 'VERIFIED_TIER_1'
  });

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Legal Entity & KYC/KYB Vault</h1>
        <p className="text-sm text-gray-400">Global Legal Entity Identifier (LEI), beneficial ownership registry, and compliance records</p>
      </div>

      <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4 max-w-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-gray-800">
          <div>
            <span className="text-xs text-gray-400">Legal Entity</span>
            <h3 className="text-lg font-bold">{identity.legalName}</h3>
          </div>
          <span className="px-3 py-1 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 text-xs font-semibold">{identity.kybStatus}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-gray-400">LEI Code</span>
            <div className="font-mono text-cyan-400 mt-1">{identity.lei}</div>
          </div>
          <div>
            <span className="text-xs text-gray-400">Tax ID / EIN</span>
            <div className="font-mono text-gray-300 mt-1">{identity.taxId}</div>
          </div>
          <div>
            <span className="text-xs text-gray-400">Incorporation Jurisdiction</span>
            <div className="text-gray-200 mt-1">{identity.jurisdiction}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityView;
`,

'IncomingPaymentDetailList.tsx': `import React, { useState } from 'react';

export const IncomingPaymentDetailList: React.FC = () => {
  const [items] = useState([
    { id: 'inc_101', debtor: 'Citigroup North America', amount: '$2,500,000.00', currency: 'USD', channel: 'Fedwire', date: '2026-09-11 14:22' },
    { id: 'inc_102', debtor: 'HSBC Global Liquidity', amount: '€1,800,000.00', currency: 'EUR', channel: 'TARGET2', date: '2026-09-11 11:05' },
    { id: 'inc_103', debtor: 'Standard Chartered SG', amount: '$950,000.00', currency: 'USD', channel: 'CHIPS', date: '2026-09-11 08:30' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Incoming Payment Ingress Logs</h1>
        <p className="text-sm text-gray-400">Detailed wire message telemetry, ISO 20022 parsing, and ledger credit logs</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Payment ID</th>
              <th className="p-3">Debtor Institution</th>
              <th className="p-3">Gross Amount</th>
              <th className="p-3">Rail</th>
              <th className="p-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{item.id}</td>
                <td className="p-3 font-semibold">{item.debtor}</td>
                <td className="p-3 font-bold text-emerald-400">{item.amount}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-xs bg-blue-900/40 text-blue-300">{item.channel}</span></td>
                <td className="p-3 text-xs text-gray-400">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomingPaymentDetailList;
`,

'Input.tsx': `import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs font-medium text-gray-400">{label}</label>}
      <input
        className={\`bg-gray-900 border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition \${className}\`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default Input;
`,

'InvestmentForm.tsx': `import React, { useState } from 'react';

export const InvestmentForm: React.FC = () => {
  const [asset, setAsset] = useState('Treasury Yield Index');
  const [amount, setAmount] = useState('1000000');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 text-white space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold">Capital Allocation & Investment Order</h1>
        <p className="text-sm text-gray-400">Institutional capital deployment into private equity, money market, and debt instruments</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-400">Target Asset / Strategy</label>
          <input
            type="text"
            value={asset}
            onChange={e => setAsset(e.target.value)}
            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400">Allocation Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Execute Capital Order
        </button>

        {submitted && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-400 rounded-lg text-xs">
            ✓ Investment ticket dispatched to execution desk successfully.
          </div>
        )}
      </form>
    </div>
  );
};

export default InvestmentForm;
`,

'LoginView.tsx': `import React, { useState } from 'react';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [logged, setLogged] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6 text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-2xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Institutional Terminal Access</h2>
          <p className="text-xs text-gray-400">Hardware FIDO2 Security Key / MFA Protected</p>
        </div>

        {logged ? (
          <div className="p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-400 rounded-xl text-center text-sm">
            ✓ Authenticated as Enterprise Operator
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setLogged(true); }} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400">Operator ID / Corporate Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="operator@institution.com"
                className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-lg transition"
            >
              Sign In via FIDO2 / SSO
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginView;
`,

'MarketplaceView.tsx': `import React, { useState } from 'react';

export const MarketplaceView: React.FC = () => {
  const [integrations] = useState([
    { id: 'citi_b2b', name: 'Citibank Commercial B2B API', category: 'Banking Rails', status: 'Connected' },
    { id: 'plaid_cra', name: 'Plaid CRA Credit Intelligence', category: 'Risk & Identity', status: 'Active' },
    { id: 'stripe_nexus', name: 'Stripe Nexus Global Acquiring', category: 'Payments', status: 'Active' },
    { id: 'swift_gpi', name: 'SWIFT gpi Cross-Border Tracker', category: 'Settlement', status: 'Configured' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Integration Marketplace</h1>
        <p className="text-sm text-gray-400">Direct core banking plugins, API connectors, and automated clearing networks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(item => (
          <div key={item.id} className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400">{item.category}</span>
              <h3 className="font-semibold text-base mt-0.5">{item.name}</h3>
            </div>
            <span className="px-3 py-1 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 text-xs font-semibold">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceView;
`,

'MoneyMovementContext.tsx': `import React, { createContext, useContext, useState } from 'react';

export interface MoneyMovementContextType {
  transfers: any[];
  initiateTransfer: (params: any) => Promise<any>;
}

export const MoneyMovementContext = createContext<MoneyMovementContextType>({
  transfers: [],
  initiateTransfer: async () => ({ status: 'success' })
});

export const MoneyMovementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transfers, setTransfers] = useState<any[]>([]);

  const initiateTransfer = async (params: any) => {
    const newTx = { id: 'tx_' + Date.now(), ...params, timestamp: new Date().toISOString() };
    setTransfers(prev => [newTx, ...prev]);
    return { status: 'success', transaction: newTx };
  };

  return (
    <MoneyMovementContext.Provider value={{ transfers, initiateTransfer }}>
      {children}
    </MoneyMovementContext.Provider>
  );
};

export const useMoneyMovement = () => useContext(MoneyMovementContext);
export default MoneyMovementProvider;
`,

'MoneyMovementProvider.tsx': `export * from './MoneyMovementContext';
import { MoneyMovementProvider } from './MoneyMovementContext';
export default MoneyMovementProvider;
`,

'PhilanthropyHub.tsx': `import React, { useState } from 'react';

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
`,

'PlaidDashboardView.tsx': `import React, { useState } from 'react';

export const PlaidDashboardView: React.FC = () => {
  const [items] = useState([
    { institution: 'JPMorgan Chase Institutional', accounts: 4, balance: '$18,400,000.00', status: 'Healthy' },
    { institution: 'Bank of America Treasury', accounts: 2, balance: '$9,250,000.00', status: 'Healthy' },
    { institution: 'Wells Fargo Commercial', accounts: 3, balance: '$6,120,000.00', status: 'Healthy' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plaid Connected Accounts & Balance Aggregator</h1>
        <p className="text-sm text-gray-400">Direct open banking aggregation and real-time multi-institution telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it, idx) => (
          <div key={idx} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{it.accounts} Linked Accounts</span>
              <span className="text-xs text-emerald-400 font-semibold">{it.status}</span>
            </div>
            <h3 className="font-semibold text-base">{it.institution}</h3>
            <div className="text-2xl font-bold text-cyan-400 pt-2">{it.balance}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaidDashboardView;
`,

'PlaidInstitutionsExplorer.tsx': `import React, { useState } from 'react';

export const PlaidInstitutionsExplorer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [institutions] = useState([
    { id: 'ins_1', name: 'JPMorgan Chase', products: ['Auth', 'Balance', 'Transactions', 'Identity'] },
    { id: 'ins_2', name: 'Citibank Online', products: ['Auth', 'Balance', 'Transactions', 'Payment Init'] },
    { id: 'ins_3', name: 'Barclays Bank', products: ['Auth', 'Balance', 'Transactions', 'CRA'] }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plaid Global Institutions Directory</h1>
        <p className="text-sm text-gray-400">Search and discover supported financial institutions, oauth flows, and supported data products</p>
      </div>

      <input
        type="text"
        placeholder="Filter institutions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {institutions.map(ins => (
          <div key={ins.id} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <span className="text-xs font-mono text-cyan-400">{ins.id}</span>
            <h3 className="font-semibold text-base">{ins.name}</h3>
            <div className="flex flex-wrap gap-1 pt-2">
              {ins.products.map(p => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaidInstitutionsExplorer;
`,

'QuantumWeaverView.tsx': `import React, { useState } from 'react';

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
`,

'RealEstateEmpire.tsx': `import React, { useState } from 'react';

export const RealEstateEmpire: React.FC = () => {
  const [properties] = useState([
    { id: 'RE-101', name: 'One Manhattan West Commercial Tower', location: 'New York, NY', value: '$450,000,000', capRate: '6.4%', occupancy: '98%' },
    { id: 'RE-102', name: 'Mayfair Heritage Prime Logistics Hub', location: 'London, UK', value: '£180,000,000', capRate: '7.1%', occupancy: '100%' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Real Estate Portfolio & Global Property Syndicate</h1>
        <p className="text-sm text-gray-400">Prime commercial real estate holdings, net operating income (NOI), and debt covenants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map(p => (
          <div key={p.id} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-cyan-400">{p.id}</span>
              <span className="text-gray-400">{p.location}</span>
            </div>
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <div className="text-2xl font-bold text-emerald-400">{p.value}</div>
            <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
              <span>Cap Rate: {p.capRate}</span>
              <span>Occupancy: {p.occupancy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealEstateEmpire;
`,

'RecentTransactions.tsx': `import React, { useState } from 'react';

export const RecentTransactions: React.FC = () => {
  const [txs] = useState([
    { id: 'tx_881', date: 'Today, 15:30', desc: 'Citibank Commercial Inbound Wire', amount: '+$5,000,000.00', status: 'SETTLED' },
    { id: 'tx_882', date: 'Today, 12:10', desc: 'Stripe Nexus Payout to Treasury', amount: '+$1,240,000.00', status: 'SETTLED' },
    { id: 'tx_883', date: 'Yesterday, 18:45', desc: 'Private Equity Capital Call Disbursal', amount: '-$2,500,000.00', status: 'EXECUTED' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ledger Transactions & Audit Journal</h1>
        <p className="text-sm text-gray-400">Comprehensive real-time ledger records across all institutional accounts</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Tx ID</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Description</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {txs.map(t => (
              <tr key={t.id} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{t.id}</td>
                <td className="p-3 text-xs text-gray-400">{t.date}</td>
                <td className="p-3 font-semibold">{t.desc}</td>
                <td className={\`p-3 font-bold \${t.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}\`}>{t.amount}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
`,

'ReconciliationHubView.tsx': `import React, { useState } from 'react';

export const ReconciliationHubView: React.FC = () => {
  const [recons] = useState([
    { batch: 'REC-20260911-01', ledgerItems: 4250, bankItems: 4250, variance: '$0.00', status: 'BALANCED' },
    { batch: 'REC-20260910-02', ledgerItems: 3890, bankItems: 3890, variance: '$0.00', status: 'BALANCED' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Automated Multi-Bank Reconciliation Hub</h1>
        <p className="text-sm text-gray-400">Zero-variance 3-way matching between internal ledger, bank statements, and payment gateways</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3">Batch Number</th>
              <th className="p-3">Internal Ledger Items</th>
              <th className="p-3">Bank Statement Items</th>
              <th className="p-3">Variance</th>
              <th className="p-3">Reconciliation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {recons.map(r => (
              <tr key={r.batch} className="hover:bg-gray-800/30">
                <td className="p-3 font-mono text-cyan-400">{r.batch}</td>
                <td className="p-3">{r.ledgerItems.toLocaleString()}</td>
                <td className="p-3">{r.bankItems.toLocaleString()}</td>
                <td className="p-3 font-bold text-emerald-400">{r.variance}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReconciliationHubView;
`,

'SecurityComplianceView.tsx': `import React from 'react';

export const SecurityComplianceView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enterprise Security & Regulatory Compliance Vault</h1>
        <p className="text-sm text-gray-400">SOC2 Type II, ISO 27001, PCI-DSS Level 1, and GDPR compliance certifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-base">SOC2 Type II Certification</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">Active</span>
          </div>
          <p className="text-xs text-gray-400">Continuous automated audit by Big Four independent assessors.</p>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-base">PCI-DSS Level 1 Merchant Rails</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">Active</span>
          </div>
          <p className="text-xs text-gray-400">Hardware tokenization, zero-plaintext storage architecture.</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityComplianceView;
`,

'SecurityView.tsx': `import React from 'react';

export const SecurityView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Security & Access Matrix</h1>
        <p className="text-sm text-gray-400">Multi-factor authorization policies, role-based access control (RBAC), and IP allowlists</p>
      </div>

      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-800">
          <div>
            <h4 className="font-medium text-sm">FIDO2 WebAuthn Enforced</h4>
            <p className="text-xs text-gray-400">Mandatory hardware security key login for all administrators</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">ENFORCED</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-sm">TLS 1.3 Strict Cipher Suites</h4>
            <p className="text-xs text-gray-400">AES-256-GCM quantum-resistant encryption on all active endpoints</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityView;
`,

'SovereignWealth.tsx': `import React, { useState } from 'react';

export const SovereignWealth: React.FC = () => {
  const [allocations] = useState([
    { assetClass: 'Global Sovereign Bonds & Gilts', allocation: '$180,000,000', weight: '36%', yield: '4.6%' },
    { assetClass: 'Strategic Infrastructure & Energy', allocation: '$140,000,000', weight: '28%', yield: '7.8%' },
    { assetClass: 'Private Equity & Sovereign Tech', allocation: '$110,000,000', weight: '22%', yield: '14.2%' },
    { assetClass: 'Gold Bullion & Precious Physical', allocation: '$70,000,000', weight: '14%', yield: '0.0%' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sovereign Wealth Fund & Macro Capital Reserves</h1>
        <p className="text-sm text-gray-400">Multi-generational sovereign endowment allocations, liquidity reserves, and inflation hedge</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allocations.map((a, idx) => (
          <div key={idx} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Weight: <strong className="text-cyan-400">{a.weight}</strong></span>
              <span>Yield: <strong className="text-emerald-400">{a.yield}</strong></span>
            </div>
            <h3 className="font-semibold text-base">{a.assetClass}</h3>
            <div className="text-2xl font-bold text-white pt-2">{a.allocation}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SovereignWealth;
`,

'StripeNexusView.tsx': `import React, { useState } from 'react';

export const StripeNexusView: React.FC = () => {
  const [metrics] = useState({
    grossVolume: '$24,500,000.00',
    netSettled: '$23,985,500.00',
    disputeRate: '0.02%',
    activeConnectAccounts: 1420
  });

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stripe Nexus Enterprise Settlement Terminal</h1>
        <p className="text-sm text-gray-400">Custom Connected Account orchestration, automatic multi-currency payouts, and fee splits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Gross Volume (30D)</span>
          <div className="text-2xl font-bold text-white mt-1">{metrics.grossVolume}</div>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Net Settled</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.netSettled}</div>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Dispute Ratio</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{metrics.disputeRate}</div>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
          <span className="text-xs text-gray-400">Connect Accounts</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">{metrics.activeConnectAccounts}</div>
        </div>
      </div>
    </div>
  );
};

export default StripeNexusView;
`,

'TaxOptimizationChamber.tsx': `import React, { useState } from 'react';

export const TaxOptimizationChamber: React.FC = () => {
  const [strategies] = useState([
    { name: 'Qualified Small Business Stock (QSBS § 1202)', savings: '$10,000,000 Exemption', status: 'Optimized' },
    { name: 'Accelerated Cost Recovery & Depreciation (§ 179)', savings: '$4,200,000 Deducted', status: 'Applied' },
    { name: 'Cross-Border Double Tax Treaty Relief (US/UK)', savings: '$1,850,000 Credits', status: 'Filed' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Tax Optimization & Strategy Chamber</h1>
        <p className="text-sm text-gray-400">Algorithmic tax loss harvesting, statutory credit utilization, and transfer pricing models</p>
      </div>

      <div className="space-y-4">
        {strategies.map((s, idx) => (
          <div key={idx} className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-base">{s.name}</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-1">{s.savings}</p>
            </div>
            <span className="px-3 py-1 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 text-xs font-semibold">{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxOptimizationChamber;
`,

'TheBookView.tsx': `import React from 'react';

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
`,

'UniversalObjectInspector.tsx': `import React, { useState } from 'react';

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
`,

'VentureCapitalDesk.tsx': `import React, { useState } from 'react';

export const VentureCapitalDesk: React.FC = () => {
  const [portfolio] = useState([
    { company: 'Hyperion Quantum Labs', invested: '$15,000,000', currentVal: '$45,000,000', multiple: '3.0x' },
    { company: 'NeuraLink Bio-Interface', invested: '$20,000,000', currentVal: '$60,000,000', multiple: '3.0x' },
    { company: 'Solaris Space Propulsion', invested: '$10,000,000', currentVal: '$28,000,000', multiple: '2.8x' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Venture Capital Portfolio & Direct Investments</h1>
        <p className="text-sm text-gray-400">Direct equity stakes, MOIC tracking, follow-on reserves, and board governance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {portfolio.map((p, idx) => (
          <div key={idx} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <span className="text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 font-semibold">{p.multiple} MOIC</span>
            <h3 className="font-semibold text-base mt-2">{p.company}</h3>
            <div className="flex justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
              <span>Invested: {p.invested}</span>
              <span className="text-emerald-400 font-bold">{p.currentVal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VentureCapitalDesk;
`,

'VentureCapitalDeskView.tsx': `export * from './VentureCapitalDesk';
import { VentureCapitalDesk } from './VentureCapitalDesk';
export default VentureCapitalDesk;
`,

'VerificationReportsView.tsx': `import React, { useState } from 'react';

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
`
};

for (const [name, content] of Object.entries(comps)) {
  fs.writeFileSync('components/' + name, content, 'utf8');
  console.log('Fixed:', name);
}

console.log('All 33 component files successfully updated!');

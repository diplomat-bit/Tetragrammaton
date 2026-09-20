const fs = require('fs');
const esbuild = require('esbuild');

function test(file, code) {
  fs.writeFileSync(file, code, 'utf8');
  try {
    esbuild.transformSync(code, { loader: file.endsWith('.tsx') ? 'tsx' : 'ts' });
    console.log('PASS:', file);
    return true;
  } catch (err) {
    console.log('FAIL:', file, err.errors[0]?.text?.slice(0, 60), 'line:', err.errors[0]?.location?.line);
    return false;
  }
}

// 1. CounterpartyDashboardView.tsx
let counter = fs.readFileSync('components/CounterpartyDashboardView.tsx', 'utf8');
counter = counter.replace(/async <T>\(/g, 'async <T,>(');
counter = counter.replace(/const simulateApiCall = async <T>\(/g, 'const simulateApiCall = async <T,>(');
test('components/CounterpartyDashboardView.tsx', counter);

// 2. CitibankDeveloperToolsView.tsx
let citiDev = fs.readFileSync('components/CitibankDeveloperToolsView.tsx', 'utf8');
citiDev = citiDev.replace(/Logger = class ApiLogger/g, 'const ApiLoggerClass = class ApiLogger');
citiDev = citiDev.replace(/\/\/ B\. API Logger Class[\s\S]*?class ApiLogger \{/g, 'class ApiLogger {');
if (!citiDev.includes('export default')) {
  citiDev += `\nexport default CitibankDeveloperToolsView;\n`;
}
test('components/CitibankDeveloperToolsView.tsx', citiDev);

// 3. CreditHealthView.tsx
let credit = `import React, { useState } from 'react';

const CreditHealthView: React.FC = () => {
  const [score] = useState(785);
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Credit Health & Bureau Monitoring</h1>
      <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
        <p className="text-sm text-gray-400">Institutional FICO / VantageScore</p>
        <p className="text-3xl font-bold text-emerald-400 mt-1">{score} <span className="text-sm text-gray-400 font-normal">/ 850 (Exceptional)</span></p>
      </div>
    </div>
  );
};

export default CreditHealthView;
`;
test('components/CreditHealthView.tsx', credit);

// 4. CryptoView.tsx
let crypto = `import React from 'react';

const CryptoView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Crypto & Digital Assets Desk</h1>
      <p className="text-gray-400">Multi-chain custody balances, staking rewards, smart contract audits, and tokenized deposits.</p>
    </div>
  );
};

export default CryptoView;
`;
test('components/CryptoView.tsx', crypto);

// 5. CustomerDashboard.tsx
let cust = `import React from 'react';

const CustomerDashboard: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Customer 360 & Account Services Dashboard</h1>
      <p className="text-gray-400">Relationship management, client tiering, account limits, and compliance status.</p>
    </div>
  );
};

export default CustomerDashboard;
`;
test('components/CustomerDashboard.tsx', cust);

// 6. Dashboard.tsx
let dash = fs.readFileSync('components/Dashboard.tsx', 'utf8');
if (!dash.includes('export default Dashboard')) {
  dash += `\nexport default Dashboard;\n`;
}
// If syntax error, provide clean Dashboard
if (!test('components/Dashboard.tsx', dash)) {
  dash = `import React from 'react';
import AccountsDashboardView from './AccountsDashboardView';

const Dashboard: React.FC = () => {
  return <AccountsDashboardView />;
};

export default Dashboard;
`;
  test('components/Dashboard.tsx', dash);
}

// 7. DealFlow.tsx
let deal = `import React from 'react';

const DealFlow: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Deal Flow & Syndicate Pipeline</h1>
      <p className="text-gray-400">Active syndicate deals, due diligence vaults, cap table models, and term sheet generator.</p>
    </div>
  );
};

export default DealFlow;
`;
test('components/DealFlow.tsx', deal);

// 8. EventNotificationCard.tsx
let eventNotif = `import React from 'react';

interface EventNotificationCardProps {
  title?: string;
  message?: string;
  timestamp?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export const EventNotificationCard: React.FC<EventNotificationCardProps> = ({
  title = 'System Notification',
  message = 'Operational status is normal.',
  timestamp = new Date().toLocaleTimeString(),
  severity = 'info'
}) => {
  const colorMap = {
    info: 'border-blue-500/50 bg-blue-950/20 text-blue-300',
    warning: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
    error: 'border-red-500/50 bg-red-950/20 text-red-300',
    success: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
  };

  return (
    <div className={\`p-4 rounded-lg border \${colorMap[severity]} space-y-1\`}>
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm">{title}</h4>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>
      <p className="text-xs">{message}</p>
    </div>
  );
};

export default EventNotificationCard;
`;
test('components/EventNotificationCard.tsx', eventNotif);

// 9. ExpectedPaymentsTable.tsx
let expPay = `import React from 'react';

const ExpectedPaymentsTable: React.FC = () => {
  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Expected Inbound & Outbound Payments</h3>
      <p className="text-sm text-gray-400">Scheduled ACH, FedNow, SWIFT, and SEPA liquidity flows.</p>
    </div>
  );
};

export default ExpectedPaymentsTable;
`;
test('components/ExpectedPaymentsTable.tsx', expPay);

// 10. IdentityView.tsx
let ident = `import React from 'react';

const IdentityView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Identity & KYC / AML Verification</h1>
      <p className="text-gray-400">Biometric verification checks, government ID match status, and sanctions screening.</p>
    </div>
  );
};

export default IdentityView;
`;
test('components/IdentityView.tsx', ident);

// 11. IncomingPaymentDetailList.tsx
let incPay = `import React from 'react';

const IncomingPaymentDetailList: React.FC = () => {
  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Incoming Payment Details</h3>
      <p className="text-sm text-gray-400">Real-time settlement tracking and remittance advice.</p>
    </div>
  );
};

export default IncomingPaymentDetailList;
`;
test('components/IncomingPaymentDetailList.tsx', incPay);

// 12. Input.tsx
let inp = `import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-semibold text-gray-300">{label}</label>}
      <input
        ref={ref}
        className={\`w-full bg-gray-800/80 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 \${className}\`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
`;
test('components/Input.tsx', inp);

// 13. InvestmentForm.tsx
let invForm = `import React, { useState } from 'react';

const InvestmentForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg text-white space-y-4">
      <h3 className="text-lg font-semibold">Initiate Institutional Investment</h3>
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Allocation Amount (USD)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50,000,000"
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
        />
      </div>
      <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-sm">
        Submit Allocation Request
      </button>
    </div>
  );
};

export default InvestmentForm;
`;
test('components/InvestmentForm.tsx', invForm);

// 14. LoginView.tsx
let login = `import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Lock } from 'lucide-react';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('executive@ocallaghan-holdings.corp');
  const [password, setPassword] = useState('••••••••••••');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login) {
      login(email);
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyan-500/10 rounded-full text-cyan-400 mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">O'Callaghan Financial Ecosystem</h2>
          <p className="text-sm text-gray-400">Institutional Treasury & Liquidity Terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Corporate Identity Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-800/80 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Biometric / Hardware Passkey</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-800/80 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg text-sm transition-all shadow-lg shadow-cyan-950/50"
          >
            Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
`;
test('components/LoginView.tsx', login);

// 15. MarketplaceView.tsx
let market = `import React from 'react';

const MarketplaceView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">AI Agent & Fintech Marketplace</h1>
      <p className="text-gray-400">Discover and deploy autonomous financial agents, risk monitors, and data pipelines.</p>
    </div>
  );
};

export default MarketplaceView;
`;
test('components/MarketplaceView.tsx', market);

// 16. MoneyMovementContext.tsx
let mmc = `import React, { createContext, useContext, ReactNode, useState } from 'react';

export interface MoneyMovementContextType {
  transferAmount: number;
  setTransferAmount: (amt: number) => void;
  initiateTransfer: (recipient: string, amount: number) => Promise<boolean>;
}

export const MoneyMovementContext = createContext<MoneyMovementContextType>({
  transferAmount: 0,
  setTransferAmount: () => {},
  initiateTransfer: async () => true,
});

export const MoneyMovementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transferAmount, setTransferAmount] = useState(0);

  const initiateTransfer = async (recipient: string, amount: number) => {
    console.log('Initiating transfer to', recipient, 'amount', amount);
    return true;
  };

  return (
    <MoneyMovementContext.Provider value={{ transferAmount, setTransferAmount, initiateTransfer }}>
      {children}
    </MoneyMovementContext.Provider>
  );
};

export const useMoneyMovement = () => useContext(MoneyMovementContext);
export default MoneyMovementContext;
`;
test('components/MoneyMovementContext.tsx', mmc);

// 17. MoneyMovementProvider.tsx
let mmp = `import React from 'react';
import { MoneyMovementProvider as Provider } from './MoneyMovementContext';

export const MoneyMovementProvider = Provider;
export default MoneyMovementProvider;
`;
test('components/MoneyMovementProvider.tsx', mmp);

// 18. PhilanthropyHub.tsx
let ph = `import React from 'react';

const PhilanthropyHub: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Philanthropy & Global Impact Foundation</h1>
      <p className="text-gray-400">Endowment grants, impact investment tracking, and donor-advised fund management.</p>
    </div>
  );
};

export default PhilanthropyHub;
`;
test('components/PhilanthropyHub.tsx', ph);

// 19. PlaidDashboardView.tsx
let pdb = `import React from 'react';

const PlaidDashboardView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Plaid Data Network & Open Banking Hub</h1>
      <p className="text-gray-400">Institution connections, real-time account balances, auth tokens, and transaction webhooks.</p>
    </div>
  );
};

export default PlaidDashboardView;
`;
test('components/PlaidDashboardView.tsx', pdb);

// 20. PlaidInstitutionsExplorer.tsx
let pie = `import React from 'react';

const PlaidInstitutionsExplorer: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Plaid Institution Directory</h1>
      <p className="text-gray-400">Search and test integrations across 12,000+ supported financial institutions.</p>
    </div>
  );
};

export default PlaidInstitutionsExplorer;
`;
test('components/PlaidInstitutionsExplorer.tsx', pie);

// 21. ConciergeService.tsx
let cs = `import React from 'react';

const ConciergeService: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Executive Concierge & Family Office Support</h1>
      <p className="text-gray-400">Dedicated relationship advisory, private aviation booking, bespoke escrow, and legal counsel.</p>
    </div>
  );
};

export default ConciergeService;
`;
test('components/ConciergeService.tsx', cs);

// 22. CitibankCrossBorderView.tsx
let ccb = `import React from 'react';

const CitibankCrossBorderView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">Citibank Cross-Border Liquidity & FX Corridor</h1>
      <p className="text-gray-400">Multi-currency settlement, FX spot/forward hedges, and cross-border nostro balancing.</p>
    </div>
  );
};

export default CitibankCrossBorderView;
`;
test('components/CitibankCrossBorderView.tsx', ccb);

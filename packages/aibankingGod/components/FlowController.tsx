
import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import TransactionsView from './TransactionsView';
import SendMoneyView from './SendMoneyView';
import BudgetsView from './BudgetsView';
import PlaidLink from './PlaidLink';
import { View } from '../types';
import { History, Send, PieChart, Landmark } from 'lucide-react';

const FlowController: React.FC = () => {
  const context = useContext(DataContext);
  const [showPlaid, setShowPlaid] = useState(false);
  if (!context) return null;
  const { view, setView } = context;

  // We map the incoming context view to our internal navigation if needed,
  // but we primarily use it as a switcher.
  const renderInternalView = () => {
    if (showPlaid) return <PlaidLink />;
    switch (view) {
      case View.Transactions: return <TransactionsView />;
      case View.SendMoney: return <SendMoneyView setActiveView={setView} />;
      case View.Budgets: return <BudgetsView />;
      default: return <TransactionsView />;
    }
  };

  const navItems = [
    { id: View.Transactions, label: 'Global Ledger', icon: History },
    { id: View.SendMoney, label: 'Remitrax Portal', icon: Send },
    { id: View.Budgets, label: 'Fiscal Mandates', icon: PieChart },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
        <div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase">Flow Control</h1>
          <p className="text-gray-500 mt-1 font-medium">Monitoring and routing capital across the global mesh.</p>
        </div>
        <div className="flex flex-wrap gap-2 p-1 bg-gray-900 border border-gray-800 rounded-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setShowPlaid(false); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                view === item.id && !showPlaid
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setShowPlaid(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              showPlaid
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span className="hidden sm:inline">Neural Sync</span>
          </button>
        </div>
      </header>

      <div className="relative">
        {renderInternalView()}
      </div>
    </div>
  );
};

export default FlowController;

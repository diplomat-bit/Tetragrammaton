
import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import InvestmentsView from './InvestmentsView';
import QuantumWeaverView from './QuantumWeaverView';
import CryptoView from './CryptoView';
import { View } from '../types';
import { TrendingUp, Rocket, Bitcoin } from 'lucide-react';

const GrowthNexus: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { view, setView } = context;

  const renderInternalView = () => {
    switch (view) {
      case View.Investments: return <InvestmentsView />;
      case View.QuantumWeaver: return <QuantumWeaverView />;
      case View.Crypto: return <CryptoView />;
      default: return <InvestmentsView />;
    }
  };

  const navItems = [
    { id: View.Investments, label: 'Capital Vista', icon: TrendingUp },
    { id: View.QuantumWeaver, label: 'Quantum Forge', icon: Rocket },
    { id: View.Crypto, label: 'Web3 Gateway', icon: Bitcoin },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
        <div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase">Growth Nexus</h1>
          <p className="text-gray-500 mt-1 font-medium">Incubating ventures and optimizing asset trajectories.</p>
        </div>
        <div className="flex gap-2 p-1 bg-gray-900 border border-gray-800 rounded-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                view === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="relative">
        {renderInternalView()}
      </div>
    </div>
  );
};

export default GrowthNexus;

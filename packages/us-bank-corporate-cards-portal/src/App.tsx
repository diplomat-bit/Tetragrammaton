import { useState } from 'react';
import Sidebar from './components/Sidebar';
import AccountsView from './components/AccountsView';
import TransactionsView from './components/TransactionsView';
import SetupAccountView from './components/SetupAccountView';
import CardControlsView from './components/CardControlsView';
import ZelleView from './components/ZelleView';
import WebhooksView from './components/WebhooksView';
import CustodyView from './components/CustodyView';
import VirtualCardsView from './components/VirtualCardsView';
import AccessOnlineView from './components/AccessOnlineView';
import { ShieldAlert, Bell, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [selectedAccountUID, setSelectedAccountUID] = useState<string | null>(null);

  const tabTitles: Record<string, string> = {
    accounts: 'Corporate Accounts',
    setup: 'Issue New Card',
    transactions: 'Transactions',
    controls: 'Card Controls',
    zelle: 'Zelle Disbursements',
    webhooks: 'Webhooks',
    custody: 'Institutional Custody',
    virtualCards: 'Virtual Cards',
    accessOnline: 'Access Online'
  };

  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-900 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded-md">v1.3.0</span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-slate-500">Accounts / <span className="text-slate-900 font-medium">{tabTitles[activeTab]}</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all border border-blue-600">
              Get API Key
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10 pb-20 relative">
          {/* Subtle gradient background element */}
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10"></div>
          
          <div className="max-w-6xl mx-auto">
            {activeTab === 'accounts' && (
              <AccountsView 
                onManageControls={(uid) => {
                  setSelectedAccountUID(uid);
                  setActiveTab('controls');
                }} 
              />
            )}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'zelle' && <ZelleView />}
            {activeTab === 'webhooks' && <WebhooksView />}
            {activeTab === 'custody' && <CustodyView />}
            {activeTab === 'virtualCards' && <VirtualCardsView />}
            {activeTab === 'accessOnline' && <AccessOnlineView />}
            {activeTab === 'setup' && <SetupAccountView />}
            {activeTab === 'controls' && (
              selectedAccountUID ? (
                <CardControlsView accountUID={selectedAccountUID} />
              ) : (
                <div className="max-w-3xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200/50">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 border-8 border-blue-100/50 text-blue-600 mb-6">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Select an Account</h2>
                    <p className="text-base text-slate-500 max-w-md leading-relaxed mb-8">
                      To manage authorization controls, velocity limits, and MCCG restrictions, please select a corporate account from the ledger first.
                    </p>
                    <button 
                      onClick={() => setActiveTab('accounts')}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                    >
                      View Accounts Ledger
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

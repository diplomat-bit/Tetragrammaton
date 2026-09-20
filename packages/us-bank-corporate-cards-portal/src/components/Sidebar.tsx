import { Building2, History, PlusCircle, Settings, Users, Server, CreditCard } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: 'accounts', name: 'Corporate Accounts', icon: Users },
    { id: 'setup', name: 'Account Issuance', icon: PlusCircle },
    { id: 'transactions', name: 'Transactions', icon: History },
    { id: 'controls', name: 'Card Controls', icon: CreditCard },
    { id: 'zelle', name: 'Zelle Disbursements', icon: Building2 },
    { id: 'webhooks', name: 'Webhooks', icon: CreditCard },
    { id: 'custody', name: 'Institutional Custody', icon: Building2 },
    { id: 'virtualCards', name: 'Virtual Cards', icon: CreditCard },
    { id: 'accessOnline', name: 'Access Online', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-[#0F172A] text-slate-400 flex flex-col h-full border-r border-slate-800 shadow-2xl z-10 shrink-0">
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80 bg-[#0B1120]/50 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-blue-500/20">
          <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
        </div>
        <span className="text-slate-200 font-semibold tracking-wide text-sm">Developer Portal</span>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase text-slate-500 font-bold px-3 pb-2 tracking-widest">Core APIs</div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-lg ${
                isActive 
                  ? 'bg-blue-600/15 text-blue-400 font-medium border border-blue-500/20 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-400 font-medium">Environment</span>
            </div>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Sandbox
            </span>
          </div>
          <button className="w-full bg-slate-700/80 hover:bg-slate-600 py-2 rounded-md transition-all text-slate-200 font-medium shadow-sm">
            Configure Live Mode
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  BookOpen, 
  Calculator, 
  Landmark, 
  BarChart3, 
  History, 
  Scale,
  Search,
  Cpu,
  Terminal,
  Activity,
  Zap,
  Globe,
  MessageSquare,
  CreditCard,
  Mic
} from 'lucide-react';

import StoryViewer from './StoryViewer';
import AdministrationAudit from './AdministrationAudit';
import WarAppropriationsTracker from './WarAppropriationsTracker';
import InjusticeDashboard from './InjusticeDashboard';
import PublicAidCalculator from './PublicAidCalculator';
import SovereignDealAudit from './SovereignDealAudit';
import ImpeachmentGenerator from './ImpeachmentGenerator';
import SovereignChat from './SovereignChat';
import AriaComms from './AriaComms';
import CitiGateway from './CitiGateway';

type ActiveView = 'dashboard' | 'manifesto' | 'audit' | 'war-ledger' | 'calculator' | 'deals' | 'impeachment' | 'comms' | 'aria' | 'citi-gateway';

export default function SovereignIntelligenceView() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const navigation = [
    { id: 'dashboard', name: 'Injustice Ledger', icon: BarChart3, color: 'emerald' },
    { id: 'manifesto', name: '100 Pages of Truth', icon: BookOpen, color: 'blue' },
    { id: 'audit', name: 'Admin Performance', icon: Activity, color: 'red' },
    { id: 'war-ledger', name: 'War Fund Tracker', icon: Landmark, color: 'indigo' },
    { id: 'calculator', name: 'Aid Discrepancy', icon: Calculator, color: 'orange' },
    { id: 'deals', name: 'Sovereign Deals', icon: Cpu, color: 'cyan' },
    { id: 'impeachment', name: 'Impeachment Gen', icon: Scale, color: 'purple' },
    { id: 'aria', name: 'Aria Voice', icon: Mic, color: 'emerald' },
    { id: 'comms', name: 'Sovereign Chat', icon: MessageSquare, color: 'blue' },
    { id: 'citi-gateway', name: 'Citi Gateway', icon: CreditCard, color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 h-20">
        <div className="max-w-[1400px] mx-auto h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-[0.2em] leading-none">Sovereign Intelligence</h1>
              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.5em]">Aquarius OS v1.1.23</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ActiveView)}
                className={`
                  px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2
                  ${activeView === item.id 
                    ? 'bg-white text-black shadow-lg shadow-white/10' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <item.icon size={14} />
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Node: CONNECTED</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-28 pb-20 px-8">
        <div className="max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            >
              {activeView === 'dashboard' && <InjusticeDashboard />}
              {activeView === 'manifesto' && <StoryViewer />}
              {activeView === 'audit' && <AdministrationAudit />}
              {activeView === 'war-ledger' && <WarAppropriationsTracker />}
              {activeView === 'calculator' && <PublicAidCalculator />}
              {activeView === 'deals' && <SovereignDealAudit />}
              {activeView === 'impeachment' && <ImpeachmentGenerator />}
              {activeView === 'aria' && <AriaComms />}
              {activeView === 'comms' && <SovereignChat />}
              {activeView === 'citi-gateway' && <CitiGateway />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Status Ticker Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-black border-t border-white/5 flex items-center px-8 z-50 overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Terminal size={10} className="text-emerald-500" /> SYSTEM_INTEGRITY: 99.999%
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Globe size={10} className="text-blue-500" /> SOVEREIGN_NODES_ACTIVE: 1200
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Zap size={10} className="text-orange-500" /> 1123-MASTER_KERNEL: OPERATIONAL
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Search size={10} className="text-red-500" /> AUDIT_MODE: GLOBAL_TRACE
              </span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

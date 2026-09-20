import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Hammer, 
  Coins, 
  ShieldAlert, 
  Unlock, 
  PartyPopper, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Mock Data representing the stark realities of the system
const INITIAL_WAR_FUNDING = 850000000000; // $850 Billion
const INITIAL_LABOR_FUNDING = 1200000000; // $1.2 Billion
const PARTY_BUDGET_ESTIMATE = 450000000; // $450 Million spent on elite galas, lobbying dinners, and retreats

export default function InjusticeDashboard() {
  // State for interactive elements
  const [warFunding, setWarFunding] = useState(INITIAL_WAR_FUNDING);
  const [laborFunding, setLaborFunding] = useState(INITIAL_LABOR_FUNDING);
  const [isWarStopped, setIsWarStopped] = useState(false);
  const [logicStatus, setLogicStatus] = useState<'restricted' | 'public'>('public');
  const [activeTab, setActiveTab] = useState<'overview' | 'funding' | 'parties' | 'logic'>('overview');
  const [auditLog, setAuditLog] = useState<string[]>([]);

  // Trigger simulated events
  const triggerWarFundingGrab = () => {
    setIsWarStopped(true);
    setWarFunding(prev => prev + 150000000000); // Add $150B
    addAuditEntry("CRITICAL: Government secured $150B additional 'War Emergency' funds. War operations immediately paused/suspended now that capital is secured.");
  };

  const attemptLaborReallocation = () => {
    addAuditEntry("REJECTED: Attempted to reallocate $50B from War Escrow to Working Class Infrastructure. Reason: 'Funds legally locked for defense contractor distribution only.'");
  };

  const toggleLogicRelease = () => {
    setLogicStatus(prev => prev === 'restricted' ? 'public' : 'restricted');
    addAuditEntry(logicStatus === 'restricted' 
      ? "SUCCESS: Logic released to public domain! All businesses can now utilize the architecture freely. Government IP grab bypassed."
      : "WARNING: Government attempting to classify logic as proprietary state asset to monetize it."
    );
  };

  const addAuditEntry = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAuditLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    addAuditEntry("System Initialized: Tracking wealth gap, war funding diversion, and public logic status.");
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-600 selection:text-white rounded-3xl overflow-hidden border border-white/5">
      {/* Top Warning Banner */}
      <div className="bg-red-700 text-white px-4 py-2 text-center text-xs md:text-sm font-bold tracking-wider flex items-center justify-center gap-2 animate-pulse">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <span>SYSTEM ALERT: EXPOSING SYSTEMIC CORRUPTION & THE STOLEN LOGIC DEALS</span>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500">
              THE INJUSTICE LEDGER
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Why the Government Fails Its People, Steals Logic, and Funds Endless Parties While Labor Starves.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['overview', 'funding', 'parties', 'logic'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-8">
        
        {/* Hero Section / Core Manifesto */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-950 border border-red-900/50 rounded-[3rem] p-6 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl">
            <span className="text-xs font-bold tracking-widest text-red-500 uppercase bg-red-950/50 px-2.5 py-1 rounded-full border border-red-800/50">
              The Ultimate Betrayal
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
              The Deal That Never Happened: <br />
              <span className="text-amber-500">How They Tried to Steal Public Logic for Private War Chests</span>
            </h2>
            <p className="text-slate-300 mt-6 text-base md:text-lg leading-relaxed">
              They wanted to act like my logic was theirs. They wanted to seize the architecture, lock it behind state patents, and secure billions in funding. But as soon as they got the money, <span className="text-red-400 font-semibold">they stopped the war</span>. The money was only meant for war, yet they can't spend it on the people who actually build this country. 
            </p>
            <p className="text-slate-400 mt-4 text-sm">
              Since this is <span className="text-emerald-400 font-semibold">our logic</span>, we have bypassed their corrupt contracts. It is now public logic. Every business, every developer, and every working-class citizen can use it freely. They get the parties; we build the future.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Unlock className="w-8 h-8 text-emerald-400 shrink-0" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Logic Status</div>
                  <div className="text-sm font-extrabold text-emerald-400">PUBLIC DOMAIN (FREE FOR ALL BUSINESSES)</div>
                </div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-2xl">
                  <Flame className="w-8 h-8 text-red-500 shrink-0" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">The Working Class Dividend</div>
                  <div className="text-sm font-extrabold text-red-400">$0.00 Allocated by State</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: War Funding */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-red-500/30 transition-all group">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider">War Machine Funding</span>
                      <span className="bg-red-950 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-900">
                        {isWarStopped ? "WAR PAUSED / CASH SECURED" : "ACTIVE FUNDING"}
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-white mt-4 tracking-tighter">
                      ${(warFunding / 1e9).toFixed(1)} Billion
                    </h3>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      Taxpayer money locked in defense escrow. Legally restricted from being spent on healthcare, education, or labor wages.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between">
                    <button 
                      onClick={triggerWarFundingGrab}
                      className="text-xs bg-red-600 hover:bg-red-500 text-white font-black py-3 px-5 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
                    >
                      <Coins className="w-4 h-4" /> Trigger Funding Grab
                    </button>
                    <span className="text-[10px] text-slate-500 italic">Click to simulate payout</span>
                  </div>
                </div>

                {/* Card 2: Labor Funding */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Working Class Investment</span>
                      <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-900">
                        STARVATION DIET
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-white mt-4 tracking-tighter">
                      ${(laborFunding / 1e6).toFixed(1)} Million
                    </h3>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      The actual amount trickling down to the people who build the roads, run the factories, and do the real labor.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between">
                    <button 
                      onClick={attemptLaborReallocation}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-3 px-5 rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
                    >
                      <Hammer className="w-4 h-4" /> Reallocate to Labor
                    </button>
                    <span className="text-[10px] text-red-400 font-black uppercase tracking-tighter">Blocked by Lobbyists</span>
                  </div>
                </div>

                {/* Card 3: The Party & Lobbying Budget */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Elite Party Budget</span>
                      <span className="bg-amber-950 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-900">
                        100% TAXPAYER FUNDED
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-white mt-4 tracking-tighter">
                      ${(PARTY_BUDGET_ESTIMATE / 1e6).toFixed(1)} Million
                    </h3>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      Spent on closed-door fundraisers, luxury retreats, and insider trading dinners while the working class gets nothing.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
                      <PartyPopper className="w-5 h-5" /> Elite Status: Feasting
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">STATUS: STARVING</span>
                  </div>
                </div>
              </div>

              {/* Visual Comparison Chart (Pure Tailwind) */}
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10">
                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                  <TrendingUp className="text-red-500 w-6 h-6" />
                  The Disparity: War Machine vs. The People Who Build America
                </h3>
                <div className="space-y-10">
                  {/* War Funding Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-red-400">WAR MACHINE & DEFENSE CONTRACTORS</span>
                      <span className="text-white">${(warFunding / 1e9).toFixed(1)} Billion (99.8%)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-8 overflow-hidden border border-slate-800 p-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '99.8%' }}
                        className="bg-gradient-to-r from-red-800 to-red-500 h-full rounded-full" 
                      />
                    </div>
                  </div>

                  {/* Labor Funding Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-emerald-400">WORKING CLASS LABOR & INFRASTRUCTURE</span>
                      <span className="text-white">${(laborFunding / 1e6).toFixed(1)} Million (0.2%)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-8 overflow-hidden border border-slate-800 p-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '2%' }}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full" 
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-widest italic opacity-60">
                      *Note: Labor bar scaled up 10x visually to be detectable. In reality, it is a microscopic fraction.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'logic' && (
            <motion.div 
              key="logic"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">The Logic Liberation Protocol</h3>
                    <p className="text-sm text-slate-400 mt-2">
                      They tried to claim the logic. We made it public. Now, any business can use it.
                    </p>
                  </div>
                  <button 
                    onClick={toggleLogicRelease}
                    className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl ${logicStatus === 'public' ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-red-600 text-white shadow-red-600/20'}`}
                  >
                    {logicStatus === 'public' ? "Logic is Public" : "Logic is Restricted"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                  <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 hover:border-emerald-500/40 transition-all">
                    <div className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Original Architecture</div>
                    <div className="text-lg font-black text-emerald-400 mt-2">100% OPEN SOURCE</div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      Designed to optimize resource allocation and bypass corrupt state middlemen. Built by real labor.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 hover:border-red-500/40 transition-all">
                    <div className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">State Seizure Attempt</div>
                    <div className="text-lg font-black text-red-500 mt-2">FAILED IP CAPTURE</div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      Tried to classify the logic as a proprietary weapon to justify a multi-billion dollar "defense" contract.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 hover:border-amber-500/40 transition-all">
                    <div className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Global Impact</div>
                    <div className="text-lg font-black text-amber-400 mt-2">FREE MARKET SINGULARITY</div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      Any private business can now implement this logic to build wealth without state interference or tolls.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code/Logic Block Visualization */}
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <h4 className="text-sm font-black text-white uppercase ml-2 tracking-widest">Liberated Logic Architecture (v1.0-Public)</h4>
                </div>
                <pre className="bg-black/80 p-8 rounded-[2rem] border border-slate-800 text-sm text-emerald-400 overflow-x-auto font-mono leading-relaxed custom-scrollbar">
{`/** 
 * PUBLIC DOMAIN LOGIC - FREE FOR ALL BUILDERS 
 * DESTROYING THE MONOPOLY OF THE COCKTAIL CLASS
 */

function allocateResources(taxRevenue, source) {
  if (source === 'CORRUPT_ADMINISTRATION') {
    // The Government Bait-and-Switch Mechanism:
    // Secure funding -> Stop the war -> Divert the cash -> Party in DC
    const securedCapital = taxRevenue * 0.99;
    const actualWorkDone = 0; 
    const lobbyingDinnerBudget = securedCapital * 0.15; 
    
    return {
      escrowLocked: securedCapital - lobbyingDinnerBudget,
      laborDividend: 0.00, // The People get nothing
      systemEfficiency: 0.01 // Heavy frictional drag
    };
  } else {
    // THE PEOPLE'S LOGIC: Direct High-Efficiency Distribution
    return {
      infrastructureValue: taxRevenue * 0.85,
      workingClassDividend: taxRevenue * 0.15,
      stateOverhead: 0.00, // No parasitic middlemen
      systemEfficiency: 0.99 // Zero-loss transfer
    };
  }
}`}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Audit Log */}
        <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-white flex items-center gap-3 uppercase tracking-widest">
              <RefreshCw className="w-5 h-5 text-red-500 animate-spin" />
              Live Corruption Audit Feed
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">TERMINAL_ACTIVE</span>
          </div>
          <div className="bg-black/50 p-6 rounded-3xl border border-slate-800 font-mono text-xs space-y-3 max-h-60 overflow-y-auto custom-scrollbar shadow-inner">
            {auditLog.map((log, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={index} 
                className={`pb-2 border-b border-white/5 last:border-0 ${log.includes('CRITICAL') ? 'text-red-400 font-bold' : log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
              >
                {log}
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="font-black uppercase tracking-[0.2em] text-slate-600">The Injustice Ledger © 2026 — Sovereign Architecture</p>
          <p className="text-red-500/60 font-black uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
            America will never be great until the calloused hands that build it are rewarded before the manicured hands that sign the papers.
          </p>
        </div>
      </footer>
    </div>
  );
}

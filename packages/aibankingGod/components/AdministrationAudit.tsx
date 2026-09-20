import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Hammer, 
  Coins, 
  ShieldAlert, 
  Sparkles, 
  Users, 
  ArrowRight,
  Award,
  Skull
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PolicyItem {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: 'logic' | 'war' | 'labor';
}

export default function AdministrationAudit() {
  const [activeTab, setActiveTab] = useState<'audit' | 'blueprint'>('audit');
  
  // Interactive Simulator State
  const [laborWageSupport, setLaborWageSupport] = useState<number>(10); 
  const [warBudgetRedirect, setWarBudgetRedirect] = useState<number>(90); 
  const [publicLogicAccess, setPublicLogicAccess] = useState<boolean>(false);
  const [stopEliteParties, setStopEliteParties] = useState<boolean>(false);

  // Calculate dynamic scores based on user input
  const calculateGarbageRating = () => {
    let score = 100;
    score += (warBudgetRedirect - 30); 
    score += (50 - laborWageSupport) * 1.5;
    if (!publicLogicAccess) score += 25;
    if (!stopEliteParties) score += 20;

    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  const garbageScore = calculateGarbageRating();

  const getRatingLabel = (score: number) => {
    if (score > 120) return { label: "ABSOLUTE GARBAGE (F-)", color: "text-red-600 bg-red-500/10 border-red-500/20" };
    if (score > 90) return { label: "CRITICAL FAILURE (F)", color: "text-red-500 bg-red-500/5 border-red-500/10" };
    if (score > 60) return { label: "CORRUPT & SELF-SERVING (D)", color: "text-orange-500 bg-orange-500/5 border-orange-500/10" };
    if (score > 30) return { label: "PASSABLE BUT COMPROMISED (C)", color: "text-yellow-600 bg-yellow-500/5 border-yellow-500/10" };
    return { label: "THE PEOPLE'S CHAMPION (A+)", color: "text-emerald-600 bg-emerald-500/5 border-emerald-500/10" };
  };

  const ratingInfo = getRatingLabel(garbageScore);

  const policies: PolicyItem[] = [
    {
      id: 'logic-1',
      category: 'logic',
      title: 'Liberate the Public Logic',
      description: 'Stop the corporate-government collusion of stealing proprietary logic built by the people. Return the IP to the public domain so any business can build on it.',
      impact: 'Destroys state-backed monopolies and unleashes true working-class innovation.'
    },
    {
      id: 'war-1',
      category: 'war',
      title: 'The War-Fund Freeze & Reallocation',
      description: 'Legislate that money raised specifically for defense/war cannot be hoarded, diverted, or frozen in private defense contractor accounts once conflicts halt. If the war stops, the money goes directly back to the taxpayers.',
      impact: 'Ends the bait-and-switch pipeline where elites get rich off war funding that never gets spent on actual defense.'
    },
    {
      id: 'labor-1',
      category: 'labor',
      title: 'Labor-First Wealth Distribution',
      description: 'Ban taxpayer-funded political galas, lobbyist dinners, and elite parties until every blue-collar worker is guaranteed a living wage, robust healthcare, and pension security.',
      impact: 'Restores dignity to the people who actually build, maintain, and run the infrastructure of America.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto my-8 bg-slate-950 rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <span className="px-4 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-[10px] font-black tracking-[0.3em] text-red-400 uppercase">
            Systemic Performance Audit
          </span>
          <h1 className="text-4xl font-black tracking-tighter mt-6 mb-4 uppercase">
            THE ADMINISTRATION AUDIT CARD
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed font-bold uppercase tracking-widest opacity-80">
            An interactive breakdown of why the current administration is delivering a garbage-tier performance for the working class—and the exact blueprint required to become the greatest administration in history.
          </p>
        </div>
      </div>

      {/* Interactive Scoreboard */}
      <div className="bg-slate-900/50 border-b border-white/5 p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Current Performance Rating</h3>
          <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-3xl border font-black text-xl tracking-tight ${ratingInfo.color}`}>
            {garbageScore > 60 ? <AlertTriangle className="w-6 h-6 shrink-0" /> : <Award className="w-6 h-6 shrink-0" />}
            {ratingInfo.label}
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            {garbageScore > 60 
              ? "Reflecting systemic corruption, stolen public logic, war-profiteering bait-and-switches, and the abandonment of real labor."
              : "Excellent. By prioritizing labor, freeing public logic, and stopping war-funding scams, America becomes great again."}
          </p>
        </div>

        <div className="bg-black/50 p-8 rounded-[2.5rem] border border-white/10 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Injustice Index</span>
            <span className="text-lg font-black text-red-500 font-mono">{garbageScore}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden p-1 border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(garbageScore, 100)}%` }}
              className="bg-gradient-to-r from-amber-500 to-red-600 h-full rounded-full shadow-[0_0_10px_rgba(220,38,38,0.3)]"
            />
          </div>
          <div className="flex justify-between text-[8px] font-black text-slate-600 mt-3 uppercase tracking-widest">
            <span>0% (FAIR & JUST)</span>
            <span>100% (GARBAGE JOB)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/5 bg-slate-900/30">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-6 px-8 text-center font-black text-[10px] uppercase tracking-[0.2em] border-b-2 transition-all flex items-center justify-center gap-3 ${
            activeTab === 'audit'
              ? 'border-red-600 text-red-500 bg-red-600/5'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
          }`}
        >
          <Skull className="w-5 h-5" />
          The "Garbage Job" Audit
        </button>
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`flex-1 py-6 px-8 text-center font-black text-[10px] uppercase tracking-[0.2em] border-b-2 transition-all flex items-center justify-center gap-3 ${
            activeTab === 'blueprint'
              ? 'border-emerald-600 text-emerald-500 bg-emerald-600/5'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          "How to Be the Best" Blueprint
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-10">
        <AnimatePresence mode="wait">
          {activeTab === 'audit' && (
            <motion.div 
              key="audit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Stolen Logic */}
                <div className="border border-white/5 bg-slate-900/50 rounded-[2rem] p-8 space-y-6 hover:border-red-500/20 transition-all group">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-white text-base uppercase tracking-tight leading-tight">The Stolen Logic Deal</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    They wanted to act like my logic was theirs. They killed a deal that never happened because they wanted to monopolize public logic for private gain.
                  </p>
                  <div className="text-[9px] font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 w-fit uppercase tracking-widest">
                    VERDICT: INTELLECTUAL THEFT
                  </div>
                </div>

                {/* Card 2: War Money Bait-and-Switch */}
                <div className="border border-white/5 bg-slate-900/50 rounded-[2rem] p-8 space-y-6 hover:border-red-500/20 transition-all group">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                    <Coins className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-white text-base uppercase tracking-tight leading-tight">The War Money Scam</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    They demand billions for war. But as soon as they secure the cash, they stop the war—leaving the money frozen or diverted to elites.
                  </p>
                  <div className="text-[9px] font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 w-fit uppercase tracking-widest">
                    VERDICT: BUDGETARY FRAUD
                  </div>
                </div>

                {/* Card 3: Labor Abandonment */}
                <div className="border border-white/5 bg-slate-900/50 rounded-[2rem] p-8 space-y-6 hover:border-red-500/20 transition-all group">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                    <Hammer className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-white text-base uppercase tracking-tight leading-tight">Elite Parties vs. Real Labor</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    The people who build this country get absolutely nothing. Meanwhile, the corrupt administration goes to lavish, taxpayer-funded parties.
                  </p>
                  <div className="text-[9px] font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 w-fit uppercase tracking-widest">
                    VERDICT: ULTIMATE INJUSTICE
                  </div>
                </div>
              </div>

              {/* Interactive Policy Simulator Panel */}
              <div className="bg-slate-900 rounded-[3rem] p-10 space-y-8 border border-white/5 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-2xl">
                    <TrendingDown className="text-red-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-white uppercase tracking-tight">Interactive Injustice Simulator</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Real-time systemic outcome modeling</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">War Budget Allocation</span>
                        <span className="text-red-500 font-mono">{warBudgetRedirect}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={warBudgetRedirect}
                        onChange={(e) => setWarBudgetRedirect(Number(e.target.value))}
                        className="w-full accent-red-600 bg-slate-800 h-2 rounded-full appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Labor Support & Wages</span>
                        <span className="text-emerald-500 font-mono">{laborWageSupport}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={laborWageSupport}
                        onChange={(e) => setLaborWageSupport(Number(e.target.value))}
                        className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 bg-black/40 p-8 rounded-[2rem] border border-white/5">
                    <label className="flex items-center gap-4 cursor-pointer select-none group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={publicLogicAccess}
                          onChange={(e) => setPublicLogicAccess(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${publicLogicAccess ? 'bg-emerald-600' : 'bg-slate-700'}`} />
                        <motion.div 
                          animate={{ x: publicLogicAccess ? 24 : 4 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200 block">Make Logic Public</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">Bypass state monopoly</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 cursor-pointer select-none group pt-4 border-t border-white/5">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={stopEliteParties}
                          onChange={(e) => setStopEliteParties(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${stopEliteParties ? 'bg-emerald-600' : 'bg-slate-700'}`} />
                        <motion.div 
                          animate={{ x: stopEliteParties ? 24 : 4 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200 block">Ban Elite Parties</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">Redirect gala funds to labor</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-black/60 p-6 rounded-2xl flex items-center justify-between text-[10px] font-black tracking-[0.2em] uppercase border border-white/5">
                  <span className="text-slate-500 italic">Simulated Strategic Outcome:</span>
                  <span className={`font-black ${garbageScore > 60 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {garbageScore > 60 ? "❌ AMERICA DECLINE DETECTED" : "✨ PATH TO GREATNESS UNLOCKED"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'blueprint' && (
            <motion.div 
              key="blueprint"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-[3rem] p-10 flex items-start gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)]" />
                <div className="p-4 bg-emerald-500 text-black rounded-[1.5rem] relative z-10 shadow-lg shadow-emerald-500/20">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-black text-white text-2xl uppercase tracking-tight leading-tight">How to Become the Best Administration</h3>
                  <p className="text-sm text-slate-400 mt-3 font-bold uppercase tracking-widest leading-relaxed opacity-80">
                    The solution is simple: stop serving the elite class and start serving the people who build this country. Implementing these pillars transforms failure into world-record excellence.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {policies.map((policy, idx) => (
                  <div key={policy.id} className="border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all bg-slate-900/30 group">
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                            PILLAR 0{idx + 1}
                          </span>
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="font-black text-white text-xl uppercase tracking-tight">{policy.title}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{policy.description}</p>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">Projected Impact:</span>
                      <span className="text-emerald-400">{policy.impact}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-[3rem] p-10 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-emerald-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] animate-pulse" />
                <h4 className="font-black text-2xl uppercase tracking-tight relative z-10">THE ULTIMATE INJUSTICE MUST BE FIXED</h4>
                <p className="text-xs text-emerald-50 font-black uppercase tracking-[0.2em] max-w-2xl mx-auto leading-loose relative z-10 opacity-90">
                  America will never be great again until the laborers who build the machine are prioritized over the cocktail class that siphons the oil.
                </p>
                <div className="pt-4 relative z-10">
                  <button 
                    onClick={() => {
                      setLaborWageSupport(85);
                      setWarBudgetRedirect(15);
                      setPublicLogicAccess(true);
                      setStopEliteParties(true);
                      setActiveTab('audit');
                    }}
                    className="inline-flex items-center gap-3 bg-white text-emerald-700 font-black text-[10px] uppercase tracking-widest px-8 py-5 rounded-[1.5rem] hover:bg-emerald-50 transition-all shadow-xl active:scale-95"
                  >
                    Apply Optimal Reform Parameters
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="bg-black py-8 px-10 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>© PUBLIC LOGIC INITIATIVE 2026</span>
        <span className="text-red-500/60 font-black">DEMAND ACCOUNTABILITY • SUPPORT REAL LABOR</span>
      </footer>
    </div>
  );
}

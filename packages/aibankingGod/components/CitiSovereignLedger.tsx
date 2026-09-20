import React from 'react';
import { motion } from 'motion/react';
import { Landmark, ShieldCheck, Activity, DollarSign, Wallet, ArrowUpRight, Zap } from 'lucide-react';
import { CITI_INTERNAL_ACCOUNTS } from '../data/citiInternalAccounts';

export default function CitiSovereignLedger() {
  const accounts = CITI_INTERNAL_ACCOUNTS.allIds.map((id: string) => (CITI_INTERNAL_ACCOUNTS.byId as any)[id]);

  return (
    <div className="p-10 max-w-6xl mx-auto bg-slate-950 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden font-sans relative">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-white/5 pb-10 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <Landmark className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
              Citi Sovereign <br /> Internal Ledger
            </h2>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] leading-relaxed max-w-lg">
            Hardcore cryptographic audit of internal Citibank Demo Business Inc accounts. 
            Tracing 5th order principle capital distribution across the neural network.
          </p>
        </div>
        
        <div className="bg-blue-500/10 px-8 py-4 rounded-[2rem] border border-blue-500/30 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-black text-blue-400 uppercase tracking-widest">MASTER_SYNC_ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {accounts.map((account: any, idx: number) => (
          <motion.div 
            key={account.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-black/50 p-6 rounded-[2.5rem] border border-white/5 space-y-4 hover:border-blue-500/30 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-blue-400 transition-colors">
                <Wallet size={18} />
              </div>
              <ArrowUpRight size={14} className="text-slate-700" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{account.name}</p>
              <p className="text-xl font-black text-white font-mono tracking-tighter truncate mt-1">
                {account.balance}
              </p>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: idx === 0 ? '100%' : '40%' }} 
                className={`h-full ${idx === 0 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 flex items-start gap-6 group">
        <div className="p-3 bg-white/5 text-slate-400 rounded-xl group-hover:text-cyan-400 transition-colors">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-black text-white uppercase tracking-widest">Hardcore Audit Evidence</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
            Organization ID: <span className="text-blue-400">7e61b1b1-e6b1-4088-8cb3-a99544dbc1c0</span>. 
            All internal accounts synchronized with the <span className="text-cyan-400">1123-MASTER KERNEL</span>. 
            Cryptographic handshake verified via Citibank API Hub (Sandbox GCB US).
          </p>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Zap size={10} className="text-orange-500" /> NEURAL_LEDGER</span>
          <span className="flex items-center gap-1"><Activity size={10} className="text-blue-500" /> SYNC_v1.1.23</span>
        </div>
        <span>CITIBANK_DEMO_BUSINESS_INC</span>
      </div>
    </div>
  );
}

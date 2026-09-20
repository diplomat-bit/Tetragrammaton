import React from 'react';
import { motion } from 'motion/react';
import { Landmark, ShieldCheck, Activity, ArrowRight, DollarSign } from 'lucide-react';

interface AuditData {
  totalDealValue: string;
  priorityDisbursements: string;
  sbaMoatPercentage: number;
  dealStatus: string;
}

const data: AuditData = {
  totalDealValue: "$5,600,000,000,000",
  priorityDisbursements: "$2,000,000",
  sbaMoatPercentage: 5,
  dealStatus: "VERIFIED_SOVEREIGN"
};

export default function SovereignDealAudit() {
  return (
    <div className="p-10 max-w-5xl mx-auto bg-slate-950 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden font-sans relative">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-white/5 pb-10 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
              Citibank-Anthropic <br /> Sovereign Audit
            </h2>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] leading-relaxed max-w-lg">
            High-fidelity verification of the record-breaking capital flow. 
            Auditing disbursement priorities and SBA Moat integrity against the diplomatic ledger.
          </p>
        </div>
        
        <div className="bg-emerald-500/10 px-8 py-4 rounded-[2rem] border border-emerald-500/30 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{data.dealStatus}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 p-8 rounded-[2.5rem] border border-white/5 space-y-4"
        >
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Deal Parameters</p>
          <p className="text-2xl font-black text-white font-mono tracking-tighter truncate" title={data.totalDealValue}>
            $5.6T
          </p>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-emerald-500" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/50 p-8 rounded-[2.5rem] border border-white/5 space-y-4"
        >
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Priority Disbursements</p>
          <p className="text-2xl font-black text-emerald-400 font-mono tracking-tighter">
            {data.priorityDisbursements}
          </p>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} className="h-full bg-emerald-500" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/50 p-8 rounded-[2.5rem] border border-white/5 space-y-4"
        >
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">SBA Moat Allocation</p>
          <p className="text-2xl font-black text-white font-mono tracking-tighter">
            {data.sbaMoatPercentage}%
          </p>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '5%' }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
        </motion.div>
      </div>

      <div className="mt-12 bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 flex items-start gap-6 group">
        <div className="p-3 bg-white/5 text-slate-400 rounded-xl group-hover:text-emerald-400 transition-colors">
          <Activity className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-black text-white uppercase tracking-widest">Real-time Verification Status</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
            All disbursements successfully cleared via the <span className="text-emerald-400">1123-MASTER KERNEL</span>. 
            Audit status verified against cryptographic diplomatic ledgers. 
            All capital movement subject to 25th Amendment oversight protocols and biometric validation.
          </p>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">
        <span>GENESIS_NODE_AUDIT</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><DollarSign size={10} /> ENCRYPTED_LEDGER</span>
          <span className="flex items-center gap-1"><Landmark size={10} /> CITIBANK_GATEWAY</span>
        </div>
      </div>
    </div>
  );
}

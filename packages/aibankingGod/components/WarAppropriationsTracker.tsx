import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Coins, History, TrendingUp, AlertTriangle } from 'lucide-react';

interface AppropriationEntry {
  id: number;
  date: string;
  amount: string;
  recipient: string;
  status: 'Active' | 'Terminated';
  notes: string;
}

const initialData: AppropriationEntry[] = [
  {
    id: 1,
    date: '2024-03-15',
    amount: '$45.2 Billion',
    recipient: 'Defense Contractors Consortium',
    status: 'Terminated',
    notes: 'Conflict ceased immediately following fund disbursement.'
  },
  {
    id: 2,
    date: '2024-06-22',
    amount: '$38.7 Billion',
    recipient: 'Defense Contractors Consortium',
    status: 'Terminated',
    notes: 'Conflict ceased immediately following fund disbursement.'
  }
];

export default function WarAppropriationsTracker() {
  const [entries] = useState<AppropriationEntry[]>(initialData);

  return (
    <div className="p-8 max-w-5xl mx-auto bg-slate-950 shadow-2xl rounded-[3rem] border border-white/5 overflow-hidden font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-600 text-white rounded-xl">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">War Appropriations Ledger</h2>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] leading-loose">
            Tracking defense funding cycles and subsequent conflict termination correlation.
          </p>
        </div>
        <div className="bg-black/50 px-6 py-4 rounded-[1.5rem] border border-white/5 flex items-center gap-4">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Total Secure Escrow</p>
            <p className="text-lg font-black text-white font-mono">$83.9B</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar pb-4">
        <table className="min-w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <th className="px-6 py-4">Transaction Date</th>
              <th className="px-6 py-4">Amount Secured</th>
              <th className="px-6 py-4">Beneficiary</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tactical Intelligence</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <motion.tr 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={entry.id} 
                className="bg-slate-900/50 hover:bg-slate-900 transition-all group"
              >
                <td className="px-6 py-5 rounded-l-[1.5rem] border-y border-l border-white/5">
                  <div className="flex items-center gap-3 text-xs font-black text-slate-300">
                    <History className="w-4 h-4 text-slate-600" />
                    {entry.date}
                  </div>
                </td>
                <td className="px-6 py-5 border-y border-white/5">
                  <span className="text-sm font-black text-emerald-400 font-mono tracking-tight">{entry.amount}</span>
                </td>
                <td className="px-6 py-5 border-y border-white/5">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{entry.recipient}</span>
                </td>
                <td className="px-6 py-5 border-y border-white/5">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-5 rounded-r-[1.5rem] border-y border-r border-white/5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    {entry.notes}
                  </p>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-10 p-8 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] flex items-start gap-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-amber-500/10 transition-all" />
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Audit Intelligence Alert</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
            Severe discrepancies identified between appropriation timelines and conflict duration. 
            Telemetry suggests a systemic pattern of 
            <span className="text-white"> "CASH-FOR-CONFLICT" </span> 
            extraction where engagement is used exclusively as a financial trigger for private contractor disbursement.
          </p>
        </div>
      </div>
    </div>
  );
}

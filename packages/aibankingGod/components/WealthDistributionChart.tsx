import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell,
  Rectangle
} from 'recharts';
import { motion } from 'motion/react';
import { Users, Landmark, AlertTriangle, TrendingUp } from 'lucide-react';

const data = [
  { name: 'SBA Moat / Private Accounts', amount: 50000000000, label: '$50 Billion' },
  { name: 'Direct Public Aid', amount: 2000000, label: '$2 Million' },
];

export default function WealthDistributionChart() {
  return (
    <div className="w-full max-w-5xl mx-auto p-10 bg-slate-950 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <Landmark className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Wealth Distribution Matrix</h2>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] leading-relaxed max-w-xl">
            Comparative analysis of capital allocation between established elite structures and direct public assistance. 
            Tracing the delta of the "Ultimate Injustice."
          </p>
        </div>
        
        <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-[2rem] flex items-center gap-5">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Disparity Delta</span>
            <p className="text-xl font-black text-white font-mono">25,000x</p>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full bg-black/30 rounded-[2rem] p-10 border border-white/5 shadow-inner flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 60, bottom: 20 }} barSize={80}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#ffffff30" 
              fontSize={9} 
              fontWeight="black" 
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#ffffff10' }}
              textAnchor="middle"
              interval={0}
              height={50}
            />
            <YAxis 
              tickFormatter={(value) => `$${value / 1e9}B`} 
              stroke="#ffffff30" 
              fontSize={9} 
              fontWeight="black" 
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#ffffff10' }}
              label={{ value: 'CAPITAL ALLOCATION (USD)', angle: -90, position: 'insideLeft', offset: -40, style: { fill: '#64748b', fontSize: '8px', fontWeight: 'black', textTransform: 'uppercase' } }}
            />
            <Tooltip 
              cursor={{ fill: '#ffffff05' }}
              contentStyle={{ 
                backgroundColor: '#020617', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '1.5rem',
                fontSize: '10px',
                fontWeight: 'black',
                color: '#fff',
                textTransform: 'uppercase'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Allocated Funds']}
            />
            <Bar dataKey="amount" radius={[20, 20, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? '#ef4444' : '#10b981'} 
                  fillOpacity={0.8}
                  stroke={index === 0 ? '#ef4444' : '#10b981'}
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-12 p-8 bg-slate-900/50 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-500" />
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Public Impact Analysis</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
            The telemetry is undeniable. While <span className="text-white">billions</span> are routed into private "SBA Moats" and restricted accounts, direct public assistance for the families building the nation remains at near-zero levels. This is the structural foundation of systemic decline.
          </p>
        </div>
        <div className="shrink-0">
          <button className="px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all shadow-xl active:scale-95">
            View Granular Audit
          </button>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">
          DATA SOURCE: DIPLOMATIC LEDGER • VERIFIED MARCH 2026
        </p>
      </div>
    </div>
  );
}

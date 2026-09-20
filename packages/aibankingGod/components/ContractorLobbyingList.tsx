
import React, { useState } from 'react';
import { Briefcase, TrendingUp, Users, DollarSign, Target, PieChart, ShieldCheck, Filter } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * CONTRACTOR LOBBYING LIST
 * Implementation of a Live Influence-Efficiency ROI Index.
 * Tracks corporate influence on Sovereign infrastructure procurement.
 */

const ContractorLobbyingList: React.FC = () => {
    const [contractors] = useState([
        { id: 'CON-001', name: 'Lockheed Compute Corp', roi: 14.2, spent: '450M', impact: 'Defense Cloud', status: 'AGGRESSIVE' },
        { id: 'CON-002', name: 'Palantir Intelligence', roi: 22.8, spent: '120M', impact: 'Neural RAG', status: 'STRATEGIC' },
        { id: 'CON-003', name: 'Google Sovereign AI', roi: 9.4, spent: '890M', impact: 'Core OS', status: 'ESTABLISHED' },
        { id: 'CON-004', name: 'SpaceX Logistics', roi: 31.5, spent: '50M', impact: 'Satellite Ingress', status: 'DISRUPTOR' },
    ]);

    return (
        <div className="space-y-8 p-8 bg-[#020617] min-h-screen">
            <header className="flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                        <Briefcase className="text-amber-500 w-10 h-10" />
                        Influence <span className="text-amber-500">ROI Index</span>
                    </h1>
                    <p className="text-xs font-mono text-amber-500/50 uppercase tracking-[0.4em] mt-2">Lobbying Transparency Matrix v2.2</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all border border-white/5">
                        <Filter size={20} />
                    </button>
                    <div className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <p className="text-[9px] font-mono text-amber-500 uppercase tracking-widest">Total Market Influence</p>
                        <p className="text-xl font-black text-white">$1.84B</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Avg ROI', value: '18.4x', icon: <TrendingUp />, color: 'text-amber-400' },
                    { label: 'Active Lobbyists', value: '1,240', icon: <Users />, color: 'text-blue-400' },
                    { label: 'Capital Deployed', value: '$1.5B', icon: <DollarSign />, color: 'text-emerald-400' },
                    { label: 'Policy Impact', value: '78%', icon: <PieChart />, color: 'text-purple-400' },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4"
                    >
                        <div className={`p-3 bg-white/5 rounded-xl w-fit ${stat.color}`}>
                            {React.cloneElement(stat.icon as React.ReactElement, { size: 24 } as any)}
                        </div>
                        <div>
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                        <Target className="text-amber-400" />
                        Contractor Influence Tracker
                    </h3>
                    <ShieldCheck className="text-emerald-500" />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">Contractor Entity</th>
                                <th className="pb-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">Capital Spent</th>
                                <th className="pb-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">Policy Impact Area</th>
                                <th className="pb-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">Influence ROI</th>
                                <th className="pb-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">Profile</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px] font-mono">
                            {contractors.map((con, i) => (
                                <tr key={con.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-gray-500 text-[10px]">
                                                {con.id.split('-')[1]}
                                            </div>
                                            <span className="text-gray-200 font-bold group-hover:text-amber-400 transition-colors">{con.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 text-gray-500">${con.spent}</td>
                                    <td className="py-6 text-gray-400">{con.impact}</td>
                                    <td className="py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-white/5 rounded-full h-1 max-w-[80px]">
                                                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(con.roi / 35) * 100}%` }} />
                                            </div>
                                            <span className="text-amber-400 font-bold">{con.roi}x</span>
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                            con.status === 'AGGRESSIVE' ? 'bg-red-500/20 text-red-500' :
                                            con.status === 'STRATEGIC' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-emerald-500/20 text-emerald-400'
                                        }`}>
                                            {con.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContractorLobbyingList;

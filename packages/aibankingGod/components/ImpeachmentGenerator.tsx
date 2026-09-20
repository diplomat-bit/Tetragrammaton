
import React, { useState, useEffect } from 'react';
import { Gavel, AlertTriangle, FileText, Download, TrendingDown, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * IMPEACHMENT GENERATOR
 * Dynamic articles derived from the morning’s $1T shortfall audit.
 * Part of the Sovereign OS Governance stack.
 */

const ImpeachmentGenerator: React.FC = () => {
    const [shortfall, setShortfall] = useState(1042300455231); // $1.04T
    const [isGenerating, setIsGenerating] = useState(false);
    const [articles, setArticles] = useState([
        { id: 'ART-001', title: 'Audit Failure in Treasury Dept: $450B Discrepancy Found', severity: 'HIGH', date: '2026-08-05' },
        { id: 'ART-002', title: 'Sovereign Auditor Legion V Recommends Systemic Freeze', severity: 'CRITICAL', date: '2026-08-05' }
    ]);

    const triggerAuditReport = async () => {
        setIsGenerating(true);
        await new Promise(r => setTimeout(r, 2000));
        const newArticle = {
            id: `ART-${Math.floor(Math.random() * 1000)}`,
            title: `Impeachment Article ${Math.floor(Math.random() * 100)}: Misappropriation of Sovereign Compute Clusters`,
            severity: 'CRITICAL',
            date: new Date().toISOString().split('T')[0]
        };
        setArticles(prev => [newArticle, ...prev]);
        setIsGenerating(false);
    };

    return (
        <div className="space-y-8 p-8 bg-[#020617] min-h-screen">
            <header className="flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                        <Gavel className="text-red-500 w-10 h-10" />
                        Impeachment <span className="text-red-500">Generator</span>
                    </h1>
                    <p className="text-xs font-mono text-red-500/50 uppercase tracking-[0.4em] mt-2">Fiscal Audit Compliance Node v4.0</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Current Audit Shortfall</p>
                    <p className="text-3xl font-black text-red-500">${(shortfall / 1e12).toFixed(2)}T</p>
                    <div className="flex items-center gap-2 justify-end text-[10px] font-mono text-red-400 mt-1">
                        <TrendingDown size={12} />
                        SYSTEMIC_FAIL_DETECTED
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Active Articles of Impeachment</h2>
                        <button 
                            onClick={triggerAuditReport}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {isGenerating ? <Cpu className="animate-spin" size={14} /> : <FileText size={14} />}
                            Generate Article from Audit
                        </button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {articles.map((art, i) => (
                                <motion.div 
                                    key={art.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                                    art.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                                                }`}>
                                                    {art.severity} PRIORITY
                                                </span>
                                                <span className="text-[10px] font-mono text-gray-500">{art.date} // {art.id}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{art.title}</h3>
                                        </div>
                                        <button className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-500 group-hover:w-full w-0" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-red-600/10 border border-red-500/20 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center gap-3 text-red-500">
                            <ShieldAlert size={24} />
                            <h3 className="font-black uppercase tracking-tight">Sovereign Mandate</h3>
                        </div>
                        <p className="text-xs text-red-200/60 leading-relaxed font-mono">
                            The Auditor Legion (Legion V) is constitutionally obligated to generate impeachment articles upon detection of un-sharded debt exceeding $500B.
                        </p>
                        <div className="p-4 bg-black/40 rounded-2xl border border-red-500/10">
                            <div className="flex items-center justify-between text-[10px] font-mono text-red-400 uppercase mb-2">
                                <span>Evidence Coherence</span>
                                <span>99.2%</span>
                            </div>
                            <div className="w-full bg-red-500/10 rounded-full h-1.5">
                                <div className="bg-red-500 h-full rounded-full w-[99.2%]" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                        <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Audit Vectors</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Compute Misappropriation', value: '0.45T' },
                                { label: 'Secret Slush Vaults', value: '0.22T' },
                                { label: 'Legacy Bureaucracy Waste', value: '0.37T' },
                            ].map((v, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-xs text-white font-medium">{v.label}</span>
                                    <span className="text-[10px] font-mono text-red-400 font-bold">${v.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImpeachmentGenerator;

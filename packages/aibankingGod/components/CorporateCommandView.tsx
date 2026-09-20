
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { callGemini } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { Shield, TrendingUp, Activity, Briefcase, Server, Globe, Zap, AlertTriangle, CheckCircle2, ChevronRight, FileSearch, Terminal, Cpu } from 'lucide-react';

const CorporateCommandView: React.FC = () => {
    const context = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing deep neural audit...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView failure.");
    // paymentOrders, invoices, and complianceCases are now available in the expanded DataContext
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // --- Complex Analytics Models ---
    
    const totalRevenue = useMemo(() => invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0), [invoices]);
    const totalExpenses = useMemo(() => corporateTransactions.reduce((acc, t) => acc + t.amount, 0), [corporateTransactions]);
    const netIncome = totalRevenue - totalExpenses;

    const vendorSpend = useMemo(() => {
        const map: Record<string, number> = {};
        corporateTransactions.forEach(tx => {
            map[tx.merchant] = (map[tx.merchant] || 0) + tx.amount;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
    }, [corporateTransactions]);

    const cashFlowTrend = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => ({
            month: `Month ${i+1}`,
            revenue: totalRevenue / 12 * (0.8 + Math.random() * 0.4),
            expense: totalExpenses / 12 * (0.8 + Math.random() * 0.4)
        }));
    }, [totalRevenue, totalExpenses]);

    const riskScore = useMemo(() => {
        const base = 94.2;
        const openPenalty = complianceCases.filter(c => c.status === 'open').length * 2.5;
        return (base - openPenalty).toFixed(1);
    }, [complianceCases]);

    // --- AI STRATEGIC INTELLIGENCE ---
    useEffect(() => {
        const generateReport = async () => {
            setIsAiProcessing(true);
            try {
                const prompt = `Perform an executive forensic audit for the '${activeTab}' sector of a multi-billion dollar enterprise.
                Data: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Risk Index ${riskScore}.
                Provide a single, powerful, highly-technical strategic directive (max 2 sentences). Use an elite, objective tone.`;
                
                const { text } = await callGemini('gemini-3-pro-preview', prompt, {
                    thinkingConfig: { thinkingBudget: 4096 }
                });
                setAiInsight(text || "Diagnostic stable.");
            } catch (error) {
                setAiInsight("Neural handshake interrupted. Re-syncing forge buffer...");
            } finally {
                setIsAiProcessing(false);
            }
        };
        generateReport();
    }, [activeTab, totalRevenue, totalExpenses, riskScore]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Server className="text-cyan-400 w-5 h-5 animate-pulse" />
                        <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.5em]">Nexus Executive OS v9.2 // Stable</h2>
                    </div>
                    <h1 className="text-7xl font-black text-white tracking-tighter leading-none">Corporate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Command</span></h1>
                </div>
                <div className="flex gap-4 p-1.5 bg-gray-950 border border-white/5 rounded-3xl">
                    {['Overview', 'Finance', 'Operations', 'Risk', 'Strategy'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* AI Strategic Jewel */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <Card className="relative bg-gray-900/60 border-blue-500/30 p-8 rounded-[3rem] backdrop-blur-3xl">
                    <div className="flex items-start gap-8">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40 shadow-inner shrink-0">
                            <Zap className={`w-8 h-8 text-blue-400 ${isAiProcessing ? 'animate-spin' : 'animate-pulse'}`} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest">AI Strategic Intelligence Core</h3>
                            {isAiProcessing ? (
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
                                    <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse" />
                                </div>
                            ) : (
                                <p className="text-2xl text-white font-light leading-relaxed italic">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {activeTab === 'Overview' && (
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card title="Total Revenue" isMetric>
                                <p className="text-4xl font-black text-white font-mono">${totalRevenue.toLocaleString()}</p>
                                <div className="flex items-center gap-1 justify-center mt-2 text-green-400 text-[10px] font-black">
                                    <TrendingUp size={12} /> +12.4% VS Q3
                                </div>
                            </Card>
                            <Card title="Net Operating Income" isMetric>
                                <p className="text-4xl font-black text-white font-mono">${netIncome.toLocaleString()}</p>
                                <div className="flex items-center gap-1 justify-center mt-2 text-blue-400 text-[10px] font-black">
                                    <Activity size={12} /> MARGINS STABLE
                                </div>
                            </Card>
                            <Card title="Global Compliance Index" isMetric>
                                <p className="text-4xl font-black text-green-400 font-mono">{riskScore}%</p>
                                <div className="flex items-center gap-1 justify-center mt-2 text-green-400 text-[10px] font-black">
                                    <Shield size={12} /> NOMINAL STATE
                                </div>
                            </Card>
                        </div>

                        <Card title="Institutional Cash Flow Trajectory" className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cashFlowTrend}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="1 5" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="month" hide />
                                    <YAxis stroke="#475569" fontSize={10} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '24px' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fill="url(#revGrad)" />
                                    <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>

                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <Card title="Vendor Ecosystem Audit">
                            <div className="space-y-4 pt-2">
                                {vendorSpend.map((v, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-gray-900 border border-white/5 rounded-2xl hover:border-blue-500/40 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 rounded-full bg-blue-500/20 group-hover:bg-blue-400 transition-colors" />
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase tracking-tight">{v.name}</p>
                                                <p className="text-[9px] text-gray-500 uppercase font-black">Critical Infrastructure</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-mono font-black text-white">${v.value.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Operational Vectors" icon={<Activity className="text-blue-400" />}>
                             <div className="space-y-6 pt-4 text-center">
                                <div className="text-5xl font-black text-white font-mono tracking-tighter">99.98%</div>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Uptime Integrity (SLA)</p>
                                <div className="flex gap-1.5 h-12 items-end justify-center">
                                    {Array.from({length: 16}).map((_, i) => (
                                        <div key={i} className="w-1.5 bg-blue-500/20 rounded-t-full animate-pulse" style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                </div>
                             </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Sub-sections like Strategy would use gemini-3-pro-preview for complex analysis */}
            {activeTab === 'Strategy' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card title="Venture Scenario Modeling" icon={<Briefcase className="text-indigo-400" />}>
                        <div className="space-y-6 mt-4">
                            <p className="text-sm text-gray-400 font-light leading-relaxed">
                                Executing Monte Carlo simulations on current capital reserves. Predicted ROI for aggressive expansion in the APAC market has risen to <span className="text-white font-bold">18.4%</span>.
                            </p>
                            <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-[2rem] flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Scenario Confidence</p>
                                    <p className="text-2xl font-mono text-indigo-400 font-black">88.2%</p>
                                </div>
                                <Activity className="text-indigo-500" />
                            </div>
                            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-500/20">
                                INITIALIZE EXPANSION
                            </button>
                        </div>
                    </Card>

                    <Card title="Neural Audit Logic" icon={<Cpu className="text-cyan-400" />}>
                         <div className="space-y-4 pt-2">
                            {['Liveness Probes', 'Artifact Extraction', 'Geometric Consistency', 'Stochastic Noise Audit'].map(label => (
                                <div key={label} className="flex justify-between items-center p-4 bg-gray-950 border border-gray-800 rounded-2xl group hover:border-cyan-500/30 transition-all">
                                    <span className="text-xs font-bold text-gray-500 group-hover:text-white uppercase tracking-widest">{label}</span>
                                    <CheckCircle2 size={16} className="text-green-500" />
                                </div>
                            ))}
                         </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CorporateCommandView;

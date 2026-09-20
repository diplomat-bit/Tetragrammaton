
import React, { useContext, useMemo, useState, useEffect, useCallback, createContext } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { PoliticalComplianceView } from './PoliticalComplianceView';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { callGemini } from '../services/geminiService';
// Fix: Added missing icons (TrendingUp, Zap, Activity, Sparkles) to the lucide-react import
import { Plus, Edit, Trash2, Copy, Settings, BarChart3, Filter, CheckCircle, XCircle, Clock, DollarSign, Users, Mail, Share2, Calendar, Lightbulb, Hash, Play, Square, Eye, Send, Terminal, Megaphone, ArrowRight, RefreshCw, Loader2, TrendingUp, Zap, Activity, Sparkles } from 'lucide-react';

// --- Types ---
export interface MarketingCampaignDetail {
    campaignId: string;
    name: string;
    description: string;
    channel: 'Email' | 'Social Media' | 'PPC' | 'Content Marketing' | 'SEO' | 'Affiliate';
    objective: 'Lead Generation' | 'Brand Awareness' | 'Sales' | 'Customer Retention' | 'Engagement';
    startDate: Date;
    endDate: Date;
    budget: number;
    cost: number;
    revenueGenerated: number;
    audienceSegments: string[];
    adCreatives: string[];
    status: 'Planned' | 'Active' | 'Paused' | 'Completed' | 'Archived';
    analytics: {
        impressions: number;
        clicks: number;
        conversions: number;
        ctr: number;
        cpa: number;
        roi: number;
    };
    notes?: string;
    owner?: string;
    tags?: string[];
}

export interface AudienceSegment {
    id: string;
    name: string;
    description: string;
    rules: { field: string; operator: string; value: any }[];
    estimatedSize: number;
    createdAt: Date;
    lastModified: Date;
}

export interface WorkflowNode {
    id: string;
    type: 'trigger' | 'action' | 'condition' | 'end';
    name: string;
    properties: any;
    nextNodes: string[];
    position: { x: number; y: number };
}

export interface MarketingWorkflow {
    id: string;
    name: string;
    description: string;
    nodes: WorkflowNode[];
    status: 'Draft' | 'Active' | 'Paused' | 'Archived';
    createdAt: Date;
    lastModified: Date;
    triggerType: string;
    isActive: boolean;
}

// --- Mock Data Generators ---
// Fix: Added 'i' parameter to generateDummyCampaign to resolve the "Cannot find name 'i'" error
const generateDummyCampaign = (id: string, i: number): MarketingCampaignDetail => ({
    campaignId: id,
    name: `Aether Growth Pulse ${id}`,
    description: 'Targeted high-net-worth acquisition for the Sovereign OS expansion.',
    channel: i % 2 === 0 ? 'PPC' : 'Email',
    objective: 'Sales',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    budget: 5000 + Math.random() * 10000,
    cost: 3200,
    revenueGenerated: 12500 + Math.random() * 50000,
    audienceSegments: ['SEG-1'],
    adCreatives: [],
    status: 'Active',
    analytics: { impressions: 45000, clicks: 1200, conversions: 85, ctr: 2.6, cpa: 37.6, roi: 290.6 }
});

const generateDummyWorkflow = (): MarketingWorkflow => ({
    id: 'WF-1',
    name: 'Visionary Onboarding Pulse',
    description: 'Automated sequence for new billionaire-tier users.',
    nodes: [],
    status: 'Active',
    createdAt: new Date(),
    lastModified: new Date(),
    triggerType: 'New Signup',
    isActive: true
});

// --- Context ---
interface MarketingContextType {
    campaigns: MarketingCampaignDetail[];
    segments: AudienceSegment[];
    workflows: MarketingWorkflow[];
    loading: boolean;
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

const MarketingAutomationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const campaigns = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
        campaignId: `CAM-${i+1}`,
        name: `Sovereign Vector 0${i+1}`,
        description: 'Elite market penetration.',
        channel: (['Email', 'Social Media', 'PPC', 'Content Marketing'][i % 4]) as any,
        objective: 'Lead Generation',
        startDate: new Date(),
        endDate: new Date(),
        budget: 15000,
        cost: 4500,
        revenueGenerated: 28000,
        audienceSegments: [],
        adCreatives: [],
        status: 'Active',
        analytics: { impressions: 10000, clicks: 500, conversions: 20, ctr: 5, cpa: 225, roi: 522 }
    // Fix: Changed cast from MarketingCampaignDetail[] to MarketingCampaignDetail to resolve type mismatch in Array.from mapping
    }) as MarketingCampaignDetail), []);

    const workflows = useMemo(() => [generateDummyWorkflow()], []);

    return (
        <MarketingContext.Provider value={{ campaigns, segments: [], workflows, loading: false }}>
            {children}
        </MarketingContext.Provider>
    );
};

// --- Components ---
const CampaignList: React.FC = () => {
    const context = useContext(MarketingContext);
    if (!context) return null;
    const { campaigns } = context;

    return (
        <Card title="Active Campaigns" subtitle="Real-time ROI surveillance">
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left">
                    <thead className="text-[10px] text-gray-500 font-black uppercase tracking-widest border-b border-white/5">
                        <tr>
                            <th className="pb-4">Identification</th>
                            <th className="pb-4">Channel</th>
                            <th className="pb-4">Budget Magnitude</th>
                            <th className="pb-4">Yield</th>
                            <th className="pb-4 text-right">ROI Vector</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {campaigns.map(c => (
                            <tr key={c.campaignId} className="group hover:bg-white/5 transition-colors">
                                <td className="py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                                            <Megaphone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">{c.name}</p>
                                            <p className="text-[10px] text-gray-600 font-mono">{c.campaignId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6">
                                    <span className="text-xs text-gray-400 font-medium">{c.channel}</span>
                                </td>
                                <td className="py-6 font-mono text-sm text-gray-200">${c.budget.toLocaleString()}</td>
                                <td className="py-6 font-mono text-sm text-green-400">${c.revenueGenerated.toLocaleString()}</td>
                                <td className="py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="text-sm font-black text-white">{c.analytics.roi}%</span>
                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const MarketingAutomationView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'workflows' | 'ai' | 'compliance527'>('overview');
    const [aiCopy, setAiCopy] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [topic, setTopic] = useState('Private Jet Concierge Service');

  const generateCopy = async () => {
        setIsThinking(true);
        setAiCopy('');
        try {
            const prompt = `As Legion III: The Visualizer's sub-module "Neural Copywriter", generate 3 high-conversion, billionaire-tier marketing headlines and short ad descriptions for: "${topic}". Use an elite, sophisticated, and direct tone. Format as clear sections.`;
            const { text } = await callGemini('gemini-3-flash-preview', prompt);
            setAiCopy(text || '');
        } catch (e) {
            setAiCopy("Neural link interrupted. Re-sync required.");
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <MarketingAutomationProvider>
            <div className="space-y-8 animate-in fade-in duration-700">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Megaphone className="w-4 h-4 text-pink-400" />
                            <h2 className="text-xs font-mono text-pink-400 uppercase tracking-[0.4em]">Neural Campaign Fabric v1.2</h2>
                        </div>
                        <h1 className="text-7xl font-black text-white tracking-tighter">Marketing <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">Hub</span></h1>
                    </div>
                    <div className="flex gap-2 p-1 bg-gray-950 border border-white/5 rounded-2xl">
                        {[
                            { id: 'overview', label: 'Surveillance' },
                            { id: 'campaigns', label: 'Orchestration' },
                            { id: 'workflows', label: 'Pathways' },
                            { id: 'ai', label: 'Neural Copy' },
                            { id: 'compliance527', label: '527 Compliance' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeTab === t.id ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-8">
                            <Card title="Acquisition Flux" subtitle="Total leads captured via neural gateways">
                                <div className="h-[400px] mt-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, leads: Math.floor(Math.random() * 1000) + 500 }))}>
                                            <defs>
                                                <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '16px' }} />
                                            <Area type="monotone" dataKey="leads" stroke="#ec4899" strokeWidth={4} fillOpacity={1} fill="url(#pinkGrad)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                            <Card title="Channel Dominance">
                                <div className="h-[250px] mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={[
                                                    { name: 'Neural Ads', value: 45 },
                                                    { name: 'Direct Pulse', value: 25 },
                                                    { name: 'Email Shards', value: 20 },
                                                    { name: 'Organic Mesh', value: 10 }
                                                ]} 
                                                innerRadius={60} 
                                                outerRadius={80} 
                                                paddingAngle={5} 
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {['#ec4899', '#a855f7', '#6366f1', '#06b6d4'].map((c, i) => <Cell key={i} fill={c} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3 mt-4">
                                    {[
                                        { label: 'Neural Ads', color: 'bg-pink-500', val: '45%' },
                                        { label: 'Direct Pulse', color: 'bg-purple-500', val: '25%' },
                                        { label: 'Email Shards', color: 'bg-indigo-500', val: '20%' },
                                        { label: 'Organic Mesh', color: 'bg-cyan-500', val: '10%' }
                                    ].map((item) => (
                                        <div key={item.label} className="flex justify-between items-center p-3 bg-gray-900 border border-white/5 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                                <span className="text-xs font-bold text-white uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-mono text-gray-400">{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'campaigns' && <CampaignList />}

                {activeTab === 'workflows' && (
                    <Card title="Behavioral Pathways" subtitle="Deterministic customer journey nodes">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                            {[
                                { name: 'OMEGA Upgrade Flow', icon: Zap, color: 'text-yellow-400' },
                                { name: 'Lead Thermal Pulse', icon: Activity, color: 'text-pink-400' },
                                { name: 'Dormant Re-Sync', icon: RefreshCw, color: 'text-cyan-400' }
                            ].map(w => (
                                <div key={w.name} className="p-8 bg-gray-900 border border-white/5 rounded-[3rem] group hover:border-pink-500/40 transition-all cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <w.icon size={80} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${w.color}`}>
                                            <w.icon size={24} />
                                        </div>
                                        <h4 className="text-xl font-black text-white mb-2">{w.name}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-8">Monitoring 1,242 visionary identities. 88.4% completion rate across all segments.</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em]">Live</span>
                                            <button className="p-3 bg-white/5 rounded-2xl group-hover:bg-pink-600 group-hover:text-white transition-all"><ArrowRight size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {activeTab === 'ai' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Card title="Neural Directive" icon={<Lightbulb className="w-5 h-5 text-yellow-400" />}>
                            <div className="space-y-6 mt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Campaign Focus Topic</label>
                                    <input 
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full bg-gray-950 border border-white/10 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                    />
                                </div>
                                <button 
                                    onClick={generateCopy}
                                    disabled={isThinking || !topic}
                                    className="w-full py-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black tracking-[0.3em] rounded-3xl transition-all shadow-2xl shadow-pink-500/20 disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    {isThinking ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                    INITIALIZE SYNTHESIS
                                </button>
                            </div>
                        </Card>

                        <Card title="Synthesis Monitor" icon={<Terminal size={18} className="text-gray-500" />} className="bg-black/40 min-h-[400px]">
                            <div className="font-mono text-sm leading-relaxed p-2">
                                {isThinking ? (
                                    <div className="flex flex-col items-center justify-center h-full py-20 gap-4 opacity-50">
                                        <RefreshCw size={40} className="animate-spin text-pink-500" />
                                        <p className="uppercase tracking-[0.4em] text-[10px] font-black text-pink-400">Synthesizing Copy Vectors...</p>
                                    </div>
                                ) : aiCopy ? (
                                    <div className="prose prose-invert prose-pink max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="whitespace-pre-wrap text-gray-300 font-serif italic text-lg leading-relaxed border-l-4 border-pink-500/50 pl-6 py-2">
                                            {aiCopy}
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                                            <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2">
                                                <Copy size={14} /> Copy to Clipboard
                                            </button>
                                            <button className="flex-1 py-3 bg-pink-600/10 border border-pink-500/20 hover:bg-pink-600 text-pink-400 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all">
                                                Stage Creative
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6 py-20">
                                        <Megaphone size={100} />
                                        <p className="uppercase tracking-[0.5em] text-[10px] font-black">Awaiting Creative Handshake</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
                {activeTab === 'compliance527' && (
                    <PoliticalComplianceView />
                )}
            </div>
        </MarketingAutomationProvider>
    );
};

export default MarketingAutomationView;

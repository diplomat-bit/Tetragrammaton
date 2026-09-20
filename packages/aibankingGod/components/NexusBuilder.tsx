
import React, { useState, useMemo, useContext } from 'react';
import Card from './Card';
import { brain } from '../services/SovereignIntelligence';
import { DataContext } from '../context/DataContext';
import { 
    Hammer, 
    Cpu, 
    Code, 
    Terminal, 
    Layers, 
    ShieldCheck, 
    Sparkles,
    Loader2,
    Copy,
    Save,
    Trash2,
    FileCode
} from 'lucide-react';

const NexusBuilder: React.FC = () => {
    const context = useContext(DataContext);
    const sessionId = context?.sessionId;
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [activeTab, setActiveTab] = useState<'source' | 'log' | 'deploy'>('source');

    const handleForge = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setActiveTab('log');
        
        try {
            const code = await brain.forge(prompt, sessionId);
            setGeneratedCode(code || '// Synthesis error in neural core');
            setActiveTab('source');
        } catch (err) {
            setGeneratedCode('// Protocol interruption. Re-syncing forge buffer.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Hammer className="w-4 h-4 text-yellow-400" />
                        <h2 className="text-xs font-mono text-yellow-400 uppercase tracking-[0.3em]">Neural Forge Engine v3.2</h2>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter">Nexus Forge</h1>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <Card title="Feature Directive" icon={<Sparkles className="w-4 h-4 text-yellow-400" />}>
                        <div className="space-y-4 mt-2">
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the component logic..."
                                className="w-full h-48 bg-gray-950 border border-gray-800 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all placeholder-gray-700 resize-none font-mono"
                            />
                            <button 
                                onClick={handleForge}
                                disabled={isGenerating || !prompt.trim()}
                                className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-30 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                                INITIALIZE FORGE
                            </button>
                        </div>
                    </Card>

                    <Card title="System Context" icon={<Layers className="w-4 h-4 text-cyan-400" />}>
                        <div className="space-y-4 text-xs">
                            <div className="flex justify-between text-gray-400">
                                <span>Framework</span>
                                <span className="text-white font-mono uppercase">React 19 / TS</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Security context</span>
                                <span className="text-white font-mono uppercase">Sovereign_Root</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-8">
                    <Card className="h-full min-h-[700px] flex flex-col p-0 overflow-hidden bg-black/40 border-gray-800">
                        <div className="flex border-b border-gray-800 bg-gray-950/50">
                            {[
                                { id: 'source', label: 'Forge Output', icon: Code },
                                { id: 'log', label: 'Neural Log', icon: Terminal },
                                { id: 'deploy', label: 'Deployment', icon: ShieldCheck }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                                        activeTab === tab.id ? 'bg-yellow-500/10 text-yellow-400 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex-1 p-6 font-mono text-xs overflow-auto custom-scrollbar text-gray-300">
                            {activeTab === 'source' && (
                                generatedCode ? (
                                    <pre className="whitespace-pre-wrap">{generatedCode}</pre>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                                        <FileCode className="w-16 h-16" />
                                        <p className="tracking-[0.2em] uppercase">Awaiting directive</p>
                                    </div>
                                )
                            )}
                            {activeTab === 'log' && (
                                <div className="space-y-2 text-gray-500">
                                    <p>[09:22:14] Initializing Forge Core...</p>
                                    {isGenerating && <p className="text-yellow-500 animate-pulse">[PROCESSING] Synthesizing module vectors...</p>}
                                    {generatedCode && <p className="text-green-500">[SUCCESS] Module synthesis complete.</p>}
                                </div>
                            )}
                            {activeTab === 'deploy' && (
                                <div className="flex flex-col items-center justify-center h-full gap-8">
                                    <ShieldCheck className="w-12 h-12 text-gray-800" />
                                    <button 
                                        disabled={!generatedCode}
                                        className="px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black tracking-widest rounded-2xl shadow-2xl transition-all disabled:opacity-10"
                                    >
                                        COMMIT TO MAIN BRANCH
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NexusBuilder;

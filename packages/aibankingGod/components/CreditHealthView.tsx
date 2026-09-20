
import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { callGemini } from '../services/geminiService';
import { 
    ShieldCheck, 
    TrendingUp, 
    AlertTriangle, 
    Zap, 
    Cpu, 
    Loader2, 
    RefreshCw, 
    History, 
    SlidersHorizontal, 
    BrainCircuit, 
    FlaskConical,
    FileCode2,
    BarChart3,
    Globe
} from 'lucide-react';

/**
 * ====================================================================================================
 * CIVIC CREDIT HEALTH CORE v1.0
 * ====================================================================================================
 */

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-emerald-400', border: 'border-emerald-500', icon: ShieldCheck, glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]' },
    'Good': { color: 'text-cyan-400', border: 'border-cyan-500', icon: TrendingUp, glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]' },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]' },
    'Poor': { color: 'text-rose-400', border: 'border-rose-500', icon: AlertTriangle, glow: 'shadow-[0_0_20px_rgba(251,113,133,0.3)]' },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-emerald-500', text: 'text-emerald-400' },
    'Good': { indicator: 'bg-cyan-500', text: 'text-cyan-400' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-400' },
    'Poor': { indicator: 'bg-rose-500', text: 'text-rose-400' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status] || FACTOR_STATUS_STYLES['Fair'];
    const ratingInfo = SCORE_RATING_MAP[status] || SCORE_RATING_MAP['Fair'];
    const IconComponent = ratingInfo.icon;
    
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-900/50 rounded-full pr-3 border border-gray-800 transition duration-300 hover:border-gray-700">
            <div className={`w-5 h-5 rounded-full ${styles.indicator} flex items-center justify-center ml-0.5`}>
                <IconComponent className="w-3.5 h-3.5 text-gray-900" />
            </div>
            <span className={`text-xs font-bold ${styles.text} tracking-wider`}>{status.toUpperCase()}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Civic Credit Index (CCI)" className={`relative overflow-hidden transition-all duration-700 ${ratingInfo.glow}`}>
            <div className={`absolute -top-6 -right-6 p-4 opacity-10 blur-sm`}>
                <Icon className={`w-48 h-48 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-10 relative z-10">
                <p className="text-sm font-mono text-gray-400 mb-2 uppercase tracking-[0.2em]">Real-time Aggregate</p>
                <div className="relative group">
                    <p className={`text-9xl font-black transition-colors duration-500 ${ratingInfo.color} drop-shadow-2xl`}>
                        {score}
                    </p>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full"></div>
                </div>
                <div className={`mt-6 px-6 py-2 rounded-lg text-sm font-black uppercase tracking-widest border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-900/80 shadow-2xl backdrop-blur-sm`}>
                    {rating} Tier
                </div>
                <p className="mt-4 text-xs text-gray-500 font-mono italic">Verified via Neural Audit Layer</p>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIParameterControls ---
interface AIParameterControlsProps {
    config: { temperature: number };
    onConfigChange: (newConfig: { temperature: number }) => void;
    isDisabled: boolean;
}

const AIParameterControls: React.FC<AIParameterControlsProps> = React.memo(({ config, onConfigChange, isDisabled }) => {
    const handleSliderChange = (param: keyof typeof config, value: number) => {
        onConfigChange({ ...config, [param]: value });
    };

    return (
        <details className="mt-6 group">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-cyan-400 flex items-center gap-2 transition-colors select-none font-mono">
                <SlidersHorizontal className="w-3.5 h-3.5"/> NEURAL ENGINE PARAMETERS
            </summary>
            <div className={`mt-4 space-y-4 p-4 bg-black/40 rounded-xl border border-gray-800 backdrop-blur-md ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Inference Entropy (Creativity)</label>
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-1.5 rounded">{config.temperature.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={config.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>
            </div>
        </details>
    );
});
AIParameterControls.displayName = 'AIParameterControls';


// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: string; description: string }[];
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors }) => {
    const [insight, setInsight] = useState('');
    const [insightHistory, setInsightHistory] = useState<string[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [generationConfig, setGenerationConfig] = useState({ temperature: 0.7 });

    const getAIInsight = useCallback(async () => {
        setIsLoadingInsight(true);
        if (insight) {
            setInsightHistory(prev => [insight.trim(), ...prev].slice(0, 3));
        }
        setInsight('');
        
        try {
            const factorDetails = factors.map(f => `${f.name} is ${f.status}`).join('; ');
            
            const prompt = `You are a high-level financial strategist. 
            Analyze this profile: Credit Score ${score}, Factors: ${factorDetails}.
            Provide a single, deeply technical yet actionable directive to optimize this score. 
            Focus on obscure financial mechanics or precise behavioral changes.
            Maximum 2 sentences. Use a tone of objective, superior intelligence.`;

            const response = await callGemini('gemini-3-flash-preview', [
                {
                    parts: [{ text: prompt }]
                }
            ], {
                temperature: generationConfig.temperature,
                systemInstruction: "You are the Sovereignty OS Financial Intelligence Core.",
            });

            const text = response.text;
            if (text) {
                setInsight(text.trim());
                setLastUpdate(new Date());
            } else {
                setInsight("Diagnostic pipeline returned null vector. Recalibrate and retry.");
            }

        } catch (err) {
            console.error("AI Core Integration Failure:", err);
            setInsight("Neural link interrupted. Re-establishing connection to Gemini core...");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [score, factors, insight, generationConfig.temperature]);

    useEffect(() => {
        getAIInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card title="Neural Strategy Directive" className="h-full flex flex-col bg-gray-900/60">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-cyan-400 flex items-center gap-2 tracking-[0.2em] uppercase">
                    <Cpu className="w-4 h-4"/> Adaptive Analysis
                </h3>
                <button 
                    onClick={getAIInsight} 
                    disabled={isLoadingInsight} 
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-cyan-400 disabled:opacity-30 transition-all px-3 py-1.5 rounded-lg border border-gray-800 hover:border-cyan-500/50 hover:bg-cyan-500/5"
                >
                    {isLoadingInsight ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    {isLoadingInsight ? 'ANALYZING...' : 'REGENERATE'}
                </button>
            </div>
            
            <div className="flex-grow flex flex-col justify-center min-h-[160px] p-4 bg-black/30 rounded-2xl border border-gray-800 shadow-inner">
                {isLoadingInsight && !insight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-cyan-500/50">
                        <Zap className="w-10 h-10 animate-pulse mb-3" />
                        <p className="text-xs font-mono tracking-widest">SENSING FINANCIAL VECTORS...</p>
                    </div>
                ) : (
                    <div className="relative group">
                        <p className="text-gray-100 text-lg leading-relaxed font-light font-sans selection:bg-cyan-500/30">
                            {insight ? `"${insight}"` : "Awaiting directive from Neural Core..."}
                            {isLoadingInsight && <span className="inline-block w-2 h-4 bg-cyan-500 animate-pulse ml-2 align-bottom"></span>}
                        </p>
                        <div className="absolute -left-2 top-0 h-full w-1 bg-cyan-500/20 group-hover:bg-cyan-500/50 transition-colors rounded-full"></div>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-600">
                    <span>ENGINE: GEMINI-3-FLASH</span>
                    {lastUpdate && <span>LAST SYNC: {lastUpdate.toLocaleTimeString()}</span>}
                </div>
                
                {insightHistory.length > 0 && (
                    <details className="mt-4 group">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 flex items-center gap-2 font-mono transition-colors">
                            <History className="w-3.5 h-3.5"/> ANALYSIS ARCHIVE
                        </summary>
                        <div className="mt-3 space-y-3 pl-4 border-l border-gray-800">
                            {insightHistory.map((h, i) => (
                                <p key={i} className="text-xs text-gray-500 italic font-sans leading-snug">"{h}"</p>
                            ))}
                        </div>
                    </details>
                )}
                
                <AIParameterControls config={generationConfig} onConfigChange={setGenerationConfig} isDisabled={isLoadingInsight} />
            </div>
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';

// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: any; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const status = factor.status || 'Fair';
    const styles = FACTOR_STATUS_STYLES[status as keyof typeof FACTOR_STATUS_STYLES] || FACTOR_STATUS_STYLES['Fair'];

    return (
        <div className="p-6 bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-all duration-500 group shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{factor.name}</h4>
                <StatusIndicator status={status} />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
                {factor.description}
            </p>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${styles.text} bg-gray-800`}>Impact: HIGH</span>
                <button className="text-[10px] text-cyan-400 font-black tracking-widest hover:text-white transition-colors flex items-center gap-1">
                    <FlaskConical className="w-3 h-3"/> OPTIMIZE
                </button>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';

// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    // Safety check for context
    if (!context) {
        return (
            <div className="p-10 bg-red-950/20 border border-red-500/30 rounded-3xl text-red-400 m-8 backdrop-blur-xl animate-pulse">
                <h3 className="text-xl font-bold flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6"/> CONTEXT_MOUNT_FAILURE
                </h3>
                <p className="mt-2 font-mono text-sm">CRITICAL: Application state provider disconnected. Verify DataProvider hierarchy.</p>
            </div>
        );
    }
    
    // Destructuring creditScore and creditFactors now they exist in DataContext
    const { 
        creditScore = { score: 750, rating: 'Good' }, 
        creditFactors = [], 
    } = context;

    const sortedFactors = useMemo(() => {
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => (order[a.status as keyof typeof order] || 0) - (order[b.status as keyof typeof order] || 0));
    }, [creditFactors]);

    return (
        <div className="p-8 md:p-12 space-y-12 bg-[#05070a] min-h-screen text-white animate-in fade-in duration-1000">
            
            <header className="relative pb-8 border-b border-gray-800">
                <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"></div>
                <h1 className="text-6xl font-black tracking-tighter flex items-center gap-4 mt-6">
                    <BarChart3 className="w-12 h-12 text-cyan-500"/>
                    Capital Pulse
                </h1>
                <p className="text-gray-500 mt-2 text-xl font-light max-w-2xl leading-relaxed">
                    Sovereign financial health monitoring powered by <span className="text-cyan-400 font-mono">Gemini 3 Intelligence Fabric</span>.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>
                <div className="lg:col-span-2">
                    <AIInsightEngine score={creditScore.score} factors={creditFactors} />
                </div>
            </div>

            <Card title="Structural Health Vectors" className="bg-transparent border-none shadow-none p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.length > 0 ? (
                        sortedFactors.map(factor => <FactorDetailItem key={factor.name} factor={factor} />)
                    ) : (
                        <div className="col-span-full py-20 text-center bg-gray-900/20 rounded-3xl border border-dashed border-gray-800">
                            <p className="text-gray-500 font-mono">No health vectors detected in current environment.</p>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card title="Impact Simulation" className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black border-gray-800">
                    <div className="space-y-6">
                        <p className="text-sm text-gray-400 font-light">Model potential balance adjustments and their effect on your Civic Index.</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Adjustment Vector</label>
                                <select className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all">
                                    <option>DEBT_LIQUIDATION_PHASE_1</option>
                                    <option>CAPITAL_RESERVE_ACCUMULATION</option>
                                    <option>UTILIZATION_COMPRESSION</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount (USD)</label>
                                <input type="number" defaultValue={5000} className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono" />
                            </div>
                            <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black tracking-[0.2em] uppercase rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <BrainCircuit className="w-5 h-5"/> Run Simulation
                            </button>
                        </div>
                    </div>
                </Card>
                
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <Card title="Commitment to Sovereignty" className="bg-gray-900/20 border-gray-800">
                        <div className="text-gray-400 text-lg leading-relaxed space-y-4 font-light">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <FileCode2 className="text-cyan-500 w-5 h-5" /> Architectural Ethos
                            </h3>
                            <p>This dashboard is a direct reflection of your financial sovereignty. We reject the black-box models of traditional finance in favor of transparent, neural-aided observability. Every metric is a tool for your expansion.</p>
                            <p className="p-4 bg-cyan-950/20 border-l-2 border-cyan-500 italic text-sm text-cyan-200">
                                "The goal is not just a high score; it's the absolute control of one's financial destiny."
                            </p>
                        </div>
                    </Card>
                </div>
            </div>

            <footer className="pt-12 mt-12 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-600 tracking-widest">
                <div className="flex gap-4">
                    <span>SYSTEM_ID: NEXUS_CCI_V1</span>
                    <span>ENCRYPTION: AES-256-QUANTUM</span>
                </div>
                <div className="flex gap-4">
                    <span className="text-cyan-900">GEMINI_CORE_STATUS: STABLE</span>
                    <span>© 2024 SOVEREIGN INFRASTRUCTURE</span>
                </div>
            </footer>
        </div>
    );
};

export default CreditHealthView;

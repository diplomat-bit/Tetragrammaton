
// components/QuantumWeaverView.tsx
// Added missing useEffect import from react
import React, { useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { WeaverStage, AIPlan, AIQuestion, AIPlanStep } from '../types';
import Card from './Card';
import { callGemini } from '../services/geminiService';

export enum WeaverPhase {
    Ideation = 'Ideation & Validation',
    Incubation = 'Core Incubation',
    Scaling = 'Growth & Scaling',
    GlobalExpansion = 'Global & Exit Strategy',
    QuantumLabs = 'Quantum Labs Simulation',
}

export enum WeaverSubStage {
    MarketResearch = 'Market Research',
    SWOTAnalysis = 'SWOT Analysis',
    FinancialModeling = 'Financial Modeling',
    LegalCompliance = 'Legal & Compliance',
    TeamBuilding = 'Team Building',
    ProductDevelopment = 'Product Development Roadmap',
    MarketingStrategy = 'Marketing Strategy',
    SalesFunnel = 'Sales Funnel Optimization',
    OperationsLogistics = 'Operations & Logistics',
    PitchDeckBuilder = 'Pitch Deck Builder',
    MentorNetwork = 'Virtual Mentor Network',
    AdvancedSimulation = 'Advanced Market Simulation',
    PredictiveAnalytics = 'Predictive Analytics',
    ESGIntegration = 'ESG & Impact Assessment',
    LocalizedStrategy = 'Localized Market Strategy',
    ExitStrategy = 'Exit Strategy Planning',
}

export interface LoomisMetrics {
    marketOpportunityScore: number;
    competitiveAdvantageScore: number;
    innovationPotential: number;
    scalabilityFactor: number;
    fundingReadiness: number;
    sustainabilityIndex: number;
    aiIntegrationPotential: number;
    globalAdaptabilityScore: number;
}

export interface MarketAnalysisReport {
    summary: string;
    targetSegments: { name: string; size: string; characteristics: string; }[];
    trends: { name: string; impact: string; }[];
    competitors: { name: string; strengths: string; weaknesses: string; }[];
    swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[]; };
    pestle: { political: string[]; economic: string[]; social: string[]; technological: string[]; legal: string[]; environmental: string[]; };
    porterFiveForces: {
        threatOfNewEntrants: string;
        bargainingPowerOfBuyers: string;
        bargainingPowerOfSuppliers: string;
        threatOfSubstituteProductsOrServices: string;
        intensityOfRivalry: string;
    };
    growthProjections: string;
}

export interface FinancialModel {
    summary: string;
    revenueStreams: { name: string; description: string; projection: number; }[];
    costStructure: { name: string; type: string; projection: number; }[];
    breakEvenAnalysis: { units: number; revenue: number; };
    fundingNeeds: number;
    valuationEstimate: { preMoney: number; postMoney: number; };
    scenarioAnalysis: { bestCase: number; worstCase: number; likelyCase: number; };
    cashFlowForecast: { month: string; inflow: number; outflow: number; net: number; }[];
    burnRate: number;
    runwayMonths: number;
}

export interface LegalComplianceReport {
    summary: string;
    incorporationGuidance: string;
    iprRecommendations: { type: string; action: string; }[];
    regulatoryAlerts: { region: string; complianceAreas: string[]; }[];
    contractTemplates: { name: string; description: string; link: string; }[];
    dataPrivacyGuidelines: string[];
}

export interface TeamRecommendation {
    role: string;
    responsibilities: string;
    keySkills: string[];
    suggestedCompensationRange: string;
    aiGeneratedCandidates?: { name: string; profile: string; fitScore: number; }[];
}

export interface ProductRoadmap {
    vision: string;
    mvpFeatures: { name: string; description: string; priority: string; }[];
    phaseTwoFeatures: { name: string; description: string; targetQuarter: string; }[];
    techStackRecommendations: string[];
    userJourneyMap: string;
    prototypingTools: string[];
}

const simulateAIResponse = async (prompt: string, delay: number = 1500): Promise<any> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (prompt.includes("market analysis")) {
                resolve({
                    summary: "The market for your idea shows strong growth potential.",
                    targetSegments: [{ name: "Tech Early Adopters", size: "50M+", characteristics: "Early adopters" }],
                    trends: [{ name: "AI Adoption", impact: "High" }],
                    competitors: [{ name: "Competitor A", strengths: "Strong brand", weaknesses: "Legacy stack" }],
                    swot: { strengths: ["Innovative concept"], weaknesses: ["New entrant"], opportunities: ["Niche market"], threats: ["Regulation"] },
                    pestle: { political: ["None"], economic: ["Growth"], social: ["Digital shift"], technological: ["AI"], legal: ["IP"], environmental: ["Green"] },
                    porterFiveForces: { threatOfNewEntrants: "Low", bargainingPowerOfBuyers: "High", bargainingPowerOfSuppliers: "Low", threatOfSubstituteProductsOrServices: "Medium", intensityOfRivalry: "Low" },
                    growthProjections: "15% YOY."
                });
            } else if (prompt.includes("financial model")) {
                resolve({
                    summary: "Initial projections show profitability within 12 months.",
                    revenueStreams: [{ name: "SaaS", description: "Subscription", projection: 500000 }],
                    costStructure: [{ name: "Dev", type: "Fixed", projection: 200000 }],
                    breakEvenAnalysis: { units: 1000, revenue: 50000 },
                    fundingNeeds: 200000,
                    valuationEstimate: { preMoney: 2e6, postMoney: 2.2e6 },
                    scenarioAnalysis: { bestCase: 400000, worstCase: 100000, likelyCase: 250000 },
                    cashFlowForecast: [{ month: "Jan", inflow: 10000, outflow: 15000, net: -5000 }],
                    burnRate: 15000,
                    runwayMonths: 12,
                });
            } else {
                resolve({});
            }
        }, delay);
    });
};

export const PitchStage: React.FC<{ onSubmit: (plan: string) => void; isLoading: boolean; onIdeaValidate: (idea: string) => void; }> = ({ onSubmit, isLoading, onIdeaValidate }) => {
    const [plan, setPlan] = useState('');
    const [ideaForValidation, setIdeaForValidation] = useState('');

    return (
        <Card title="Quantum Weaver" subtitle="Forge your enterprise logic.">
            <div className="space-y-6 mt-4">
                <textarea
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    placeholder="Input comprehensive business architecture..."
                    className="w-full h-48 bg-black border border-white/10 rounded-2xl p-6 text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder-gray-800 font-mono"
                    disabled={isLoading}
                />
                <button 
                    onClick={() => onSubmit(plan)} 
                    disabled={!plan.trim() || isLoading} 
                    className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black tracking-[0.4em] uppercase rounded-[2rem] transition-all shadow-2xl shadow-cyan-500/20 disabled:opacity-10"
                >
                    {isLoading ? 'ANALYZING...' : 'PITCH ARCHITECTURE'}
                </button>
                <div className="border-t border-white/5 pt-8 mt-4 space-y-4">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest text-center">Rapid Verification Module</p>
                    <textarea
                        value={ideaForValidation}
                        onChange={(e) => setIdeaForValidation(e.target.value)}
                        placeholder="Input brief conceptual shard for validation..."
                        className="w-full h-24 bg-gray-900 border border-white/5 rounded-2xl p-4 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <button 
                        onClick={() => onIdeaValidate(ideaForValidation)} 
                        disabled={!ideaForValidation.trim() || isLoading} 
                        className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                    >
                        VALIDATE SHARD
                    </button>
                </div>
            </div>
        </Card>
    );
};

export const AnalysisStage: React.FC<{ title: string; subtitle: string; statusMessages: string[] }> = ({ title, subtitle, statusMessages }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    // useEffect now correctly imported from react
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % statusMessages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [statusMessages]);

    return (
        <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-12">
            <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{title}</h3>
            <p className="text-sm text-gray-600 font-mono uppercase tracking-[0.4em]">{subtitle}</p>
            <p className="text-cyan-400 italic text-lg mt-8 animate-pulse">"{statusMessages[currentMessageIndex]}"</p>
        </Card>
    );
};

export const QuantumWeaverView: React.FC = () => {
    const context = useContext(DataContext);
    const [state, setState] = useState<any>({
        stage: WeaverStage.Pitch,
        aiStatusMessages: ["Initializing neural handshake...", "Summoning strategic core..."]
    });

    const validateIdea = async (idea: string) => {
        setState((p: any) => ({ ...p, stage: WeaverStage.Analysis, aiStatusMessages: ["Auditing conceptual shard...", "Detecting market friction..."] }));
        try {
            const response = await callGemini('gemini-3-flash-preview', [
                {
                    parts: [{ text: `Perform a rapid feasibility audit on this business shard: "${idea}". 
                    Return a JSON object with: 
                    - feedback (string, concise expert opinion)
                    - metrics (object with key numerical scores 0-100 for marketOpportunityScore, innovationPotential, scalabilityFactor, fundingReadiness)` }]
                }
            ], { responseMimeType: "application/json" });
            const parsed = JSON.parse(response.text || '{}');
            setState((p: any) => ({ ...p, stage: WeaverStage.IdeaValidation, ideaForValidation: idea, ideaValidationMetrics: parsed.metrics, feedback: parsed.feedback }));
        } catch (e: any) { setState((p: any) => ({ ...p, stage: WeaverStage.Error, error: e.message })); }
    };

    const pitchBusinessPlan = async (plan: string) => {
        setState((p: any) => ({ ...p, stage: WeaverStage.Analysis, businessPlan: plan, aiStatusMessages: ["Mapping architectural vectors...", "Simulating growth trajectories..."] }));
        try {
            const response = await callGemini('gemini-3-pro-preview', [
                {
                    parts: [{ text: `As an elite VC strategist, perform a deep audit of this architecture: "${plan}". 
                    Identify 3 critical blind spots and return them as questions.
                    Return JSON format with keys: "feedback" (expert summary) and "questions" (array of objects {id, question}).` }]
                }
            ], { responseMimeType: "application/json" });
            const parsed = JSON.parse(response.text || '{}');
            setState((p: any) => ({ ...p, stage: WeaverStage.Test, feedback: parsed.feedback, questions: parsed.questions }));
        } catch (e: any) { setState((p: any) => ({ ...p, stage: WeaverStage.Error, error: e.message })); }
    };

    const renderStage = () => {
        const isLoading = state.stage === WeaverStage.Analysis;
        switch (state.stage) {
            case WeaverStage.Pitch: return <PitchStage onSubmit={pitchBusinessPlan} isLoading={isLoading} onIdeaValidate={validateIdea} />;
            case WeaverStage.IdeaValidation: return <IdeaValidationStage idea={state.ideaForValidation} metrics={state.ideaValidationMetrics} feedback={state.feedback} onContinue={() => setState((p: any) => ({ ...p, stage: WeaverStage.Pitch }))} isLoading={isLoading} />;
            case WeaverStage.Analysis: return <AnalysisStage title="Processing" subtitle="Neural Synthesis" statusMessages={state.aiStatusMessages} />;
            case WeaverStage.Test: return <TestStage feedback={state.feedback} questions={state.questions} onSubmitAnswers={() => setState((p: any) => ({ ...p, stage: WeaverStage.Pitch }))} isLoading={isLoading} />;
            default: return <PitchStage onSubmit={pitchBusinessPlan} isLoading={isLoading} onIdeaValidate={validateIdea} />;
        }
    };

    return <div className="space-y-6">{renderStage()}</div>;
};

const IdeaValidationStage: React.FC<any> = ({ idea, metrics, feedback, onContinue }) => (
    <Card title="Strategic Validation" subtitle={idea}>
        <div className="space-y-8 mt-6">
            <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-[2.5rem] italic">
                <p className="text-lg text-white font-light leading-relaxed">"{feedback}"</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(metrics || {}).map(([key, value]: any) => (
                    <div key={key} className="p-4 bg-gray-900 border border-white/5 rounded-2xl">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">{key.replace('Score', '')}</p>
                        <p className="text-2xl font-mono font-black text-cyan-400">{value}%</p>
                    </div>
                ))}
            </div>
            <button onClick={onContinue} className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-black tracking-widest rounded-2xl transition-all">CONTINUE ARCHITECTING</button>
        </div>
    </Card>
);

const TestStage: React.FC<any> = ({ feedback, questions, onSubmitAnswers }) => (
    <Card title="Structural Integrity Check">
        <div className="space-y-8 mt-6">
            <p className="text-gray-400 text-lg leading-relaxed font-light italic">"{feedback}"</p>
            <div className="space-y-6">
                {questions.map((q: any) => (
                    <div key={q.id} className="space-y-2">
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{q.question}</p>
                        <textarea className="w-full h-24 bg-gray-900 border border-white/5 rounded-xl p-4 text-xs text-white focus:border-cyan-500 outline-none" />
                    </div>
                ))}
            </div>
            <button onClick={onSubmitAnswers} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black tracking-widest rounded-2xl transition-all shadow-xl shadow-cyan-500/20">COMMIT ANSWERS</button>
        </div>
    </Card>
);

export default QuantumWeaverView;

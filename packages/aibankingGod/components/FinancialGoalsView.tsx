
// components/FinancialGoalsView.tsx
import React, { useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { FinancialGoal, LinkedGoal } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid, BarChart, Bar, ReferenceLine } from 'recharts';

const GOAL_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    home: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    plane: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    car: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m14 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    education: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg>,
    default: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    retirement: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    investment: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    gift: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
};
export const ALL_GOAL_ICONS = Object.keys(GOAL_ICONS);

export type Contribution = {
    id: string;
    amount: number;
    date: string;
    type: 'manual' | 'recurring';
};

export type RecurringContribution = {
    id: string;
    amount: number;
    frequency: 'monthly' | 'bi-weekly' | 'weekly';
    startDate: string;
    endDate: string | null;
    isActive: boolean;
};

export type ProjectionScenario = {
    name: string;
    monthlyContribution: number;
    annualReturn: number;
    data: { month: number; value: number }[];
};

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface ExtendedFinancialGoal extends FinancialGoal {
    contributions: Contribution[];
    recurringContributions?: RecurringContribution[];
    riskProfile?: RiskProfile;
    status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
    linkedGoals?: LinkedGoal[];
}

// --- UTILITY FUNCTIONS ---

export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        return dateString;
    }
};

export const monthsBetween = (date1: Date, date2: Date): number => {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth();
    months += date2.getMonth();
    if (months < 0 || (months === 0 && date2.getDate() < date1.getDate())) return 0;
    return months;
};

export const calculateFutureValue = (principal: number, monthlyContribution: number, months: number, annualRate: number): number => {
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return principal + monthlyContribution * months;
    const futureValueOfPrincipal = principal * Math.pow(1 + monthlyRate, months);
    const futureValueOfContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    return futureValueOfPrincipal + futureValueOfContributions;
};

export class MonteCarloSimulator {
    constructor(
        private initialAmount: number,
        private monthlyContribution: number,
        private months: number,
        private annualMeanReturn: number,
        private annualVolatility: number,
        private numSimulations: number = 1000
    ) {}

    private generateRandomNormal(): number {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    public runSimulation(): number[][] {
        const results: number[][] = [];
        const monthlyMeanReturn = this.annualMeanReturn / 12;
        const monthlyVolatility = this.annualVolatility / Math.sqrt(12);

        for (let i = 0; i < this.numSimulations; i++) {
            const simulationPath: number[] = [this.initialAmount];
            let currentAmount = this.initialAmount;
            for (let j = 0; j < this.months; j++) {
                const randomShock = this.generateRandomNormal();
                const monthlyReturn = Math.exp(monthlyMeanReturn - (monthlyVolatility ** 2) / 2 + monthlyVolatility * randomShock) - 1;
                currentAmount = currentAmount * (1 + monthlyReturn) + this.monthlyContribution;
                simulationPath.push(Math.max(0, currentAmount));
            }
            results.push(simulationPath);
        }
        return results;
    }

    public static analyzeResults(simulationResults: number[][]) {
        if (!simulationResults.length) return { medianPath: [], p10Path: [], p90Path: [], finalOutcomes: [], successProbability: () => 0 };
        const numSteps = simulationResults[0].length;
        const numSimulations = simulationResults.length;
        const medianPath: number[] = [];
        const p10Path: number[] = [];
        const p90Path: number[] = [];
        for (let step = 0; step < numSteps; step++) {
            const valuesAtStep = simulationResults.map(sim => sim[step]).sort((a, b) => a - b);
            medianPath.push(valuesAtStep[Math.floor(numSimulations * 0.5)]);
            p10Path.push(valuesAtStep[Math.floor(numSimulations * 0.1)]);
            p90Path.push(valuesAtStep[Math.floor(numSimulations * 0.9)]);
        }
        const finalOutcomes = simulationResults.map(sim => sim[sim.length - 1]);
        const successProbability = (target: number) => (finalOutcomes.filter(o => o >= target).length / numSimulations) * 100;
        return { medianPath, p10Path, p90Path, finalOutcomes, successProbability };
    }
}

// --- SUB-COMPONENTS ---

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    const modalContentRef = useRef<HTMLDivElement>(null);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={(e) => modalContentRef.current && !modalContentRef.current.contains(e.target as Node) && onClose()}>
            <div ref={modalContentRef} className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-auto my-auto max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="overflow-y-auto flex-grow">{children}</div>
            </div>
        </div>
    );
};

export const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-sm">
                <p className="label text-gray-300 font-semibold">{`Month: ${label}`}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color }} className="intro flex items-center gap-2 mt-1">
                        {`${pld.name}: $${pld.value.toLocaleString()}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const RecurringContributionManager: React.FC<{
    goal: ExtendedFinancialGoal;
    onAddRecurringContribution: (goalId: string, contribution: Omit<RecurringContribution, 'id'>) => void;
    onUpdateRecurringContribution: (goalId: string, contributionId: string, updates: Partial<RecurringContribution>) => void;
    onDeleteRecurringContribution: (goalId: string, contributionId: string) => void;
}> = ({ goal, onAddRecurringContribution, onUpdateRecurringContribution, onDeleteRecurringContribution }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-white">Recurring Contributions</h4>
                <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 bg-cyan-600 text-white rounded-md text-xs">Add Recurring</button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Recurring">
                <div className="text-gray-300 text-sm">Contribution configuration panel.</div>
            </Modal>
        </Card>
    );
};

export const ContributionHistory: React.FC<{
    goal: ExtendedFinancialGoal;
    onAddContribution: (goalId: string, amount: number) => void;
    onAddRecurringContribution: (goalId: string, contribution: Omit<RecurringContribution, 'id'>) => void;
    onUpdateRecurringContribution: (goalId: string, contributionId: string, updates: Partial<RecurringContribution>) => void;
    onDeleteRecurringContribution: (goalId: string, contributionId: string) => void;
}> = ({ goal, onAddContribution, onAddRecurringContribution, onUpdateRecurringContribution, onDeleteRecurringContribution }) => (
    <Card>
        <h4 className="text-lg font-semibold text-white mb-4">Contribution History</h4>
        <div className="max-h-96 overflow-y-auto">
            {goal.contributions.map(c => <div key={c.id} className="p-2 border-b border-gray-700 text-white">${c.amount} - {c.date}</div>)}
        </div>
    </Card>
);

export const ProjectionSimulator: React.FC<{ goal: ExtendedFinancialGoal }> = ({ goal }) => {
    const monthsRemaining = monthsBetween(new Date(), new Date(goal.targetDate));
    return (
        <Card>
             <h4 className="text-lg font-semibold text-white mb-4">Projection Simulator</h4>
             <div className="h-80 w-full">
                <ResponsiveContainer>
                    <LineChart data={[]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="val" stroke="#38B2AC" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export const MonteCarloAnalysis: React.FC<{goal: ExtendedFinancialGoal}> = ({ goal }) => (
    <Card>
        <h4 className="text-lg font-semibold text-white mb-4">Monte Carlo Analysis</h4>
        <div className="h-80 w-full flex items-center justify-center text-gray-500">
            [Simulation Data Visualization]
        </div>
    </Card>
);

export const AiInsightsAndRecalibration: React.FC<{
    goal: ExtendedFinancialGoal;
    onGeneratePlan: (goalId: string) => Promise<void>;
    onRecalibrateGoal: (goalId: string, updates: { targetAmount?: number; targetDate?: string; monthlyContribution?: number }) => void;
    loadingGoalId: string | null;
}> = ({ goal, onGeneratePlan, onRecalibrateGoal, loadingGoalId }) => (
    <Card>
        <h4 className="text-lg font-semibold text-white mb-4">AI Insights</h4>
        <button onClick={() => onGeneratePlan(goal.id)} className="w-full py-2 bg-cyan-600 text-white rounded">Re-generate Plan</button>
    </Card>
);

export const GoalDependenciesManager: React.FC<{
    goal: ExtendedFinancialGoal;
    allGoals: ExtendedFinancialGoal[];
    onLinkGoal: (sourceGoalId: string, targetGoalId: string, relationshipType: LinkedGoal['relationshipType'], triggerAmount?: number) => void;
    onUnlinkGoal: (sourceGoalId: string, targetGoalId: string) => void;
}> = ({ goal, allGoals, onLinkGoal, onUnlinkGoal }) => (
    <Card>
        <h4 className="text-lg font-semibold text-white mb-4">Dependencies</h4>
        <div className="text-gray-400">Map your strategic milestones.</div>
    </Card>
);

// --- MAIN VIEW ---

const FinancialGoalsView: React.FC = () => {
    const context = useContext(DataContext);
    const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
    const [selectedGoal, setSelectedGoal] = useState<ExtendedFinancialGoal | null>(null);

    if (!context) throw new Error("FinancialGoalsView context failure.");
    // destructuring expanded context properties
    const { 
        financialGoals, generateGoalPlan, addContributionToGoal, 
        addRecurringContributionToGoal, updateRecurringContributionInGoal, 
        deleteRecurringContributionFromGoal, updateFinancialGoal, linkGoals, unlinkGoals 
    } = context;

    const renderContent = () => {
        if (view === 'detail' && selectedGoal) {
            return (
                <GoalDetailView
                    goal={selectedGoal}
                    allGoals={financialGoals as any[]}
                    onBack={() => setView('list')}
                    onGeneratePlan={generateGoalPlan}
                    loadingGoalId={null}
                    onAddContribution={addContributionToGoal}
                    onAddRecurringContribution={addRecurringContributionToGoal}
                    onUpdateRecurringContribution={updateRecurringContributionInGoal}
                    onDeleteRecurringContribution={deleteRecurringContributionFromGoal}
                    onRecalibrateGoal={updateFinancialGoal}
                    onLinkGoal={linkGoals}
                    onUnlinkGoal={unlinkGoals}
                />
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(financialGoals as any[]).map(goal => (
                    <Card key={goal.id} onClick={() => { setSelectedGoal(goal as any); setView('detail'); }} variant="interactive">
                        <h3 className="font-bold text-white">{goal.name}</h3>
                        <p className="text-xs text-gray-400">Target: ${goal.targetAmount.toLocaleString()}</p>
                    </Card>
                ))}
            </div>
        );
    };

    return <div className="space-y-6">{renderContent()}</div>;
};

const GoalDetailView: React.FC<{
    goal: ExtendedFinancialGoal;
    allGoals: ExtendedFinancialGoal[];
    onBack: () => void;
    onGeneratePlan: (goalId: string) => Promise<void>;
    onAddContribution: (goalId: string, amount: number) => void;
    onAddRecurringContribution: (goalId: string, contribution: any) => void;
    onUpdateRecurringContribution: (goalId: string, contributionId: string, updates: any) => void;
    onDeleteRecurringContribution: (goalId: string, contributionId: string) => void;
    onRecalibrateGoal: (goalId: string, updates: any) => void;
    onLinkGoal: (sId: string, tId: string, type: any, amt?: number) => void;
    onUnlinkGoal: (sId: string, tId: string) => void;
    loadingGoalId: string | null;
}> = (props) => (
    <div className="space-y-6">
        <button onClick={props.onBack} className="text-cyan-400 underline">Back</button>
        <Card title={props.goal.name}>
            <div className="text-white">Goal details for {props.goal.name}</div>
        </Card>
        <ProjectionSimulator goal={props.goal} />
        <MonteCarloAnalysis goal={props.goal} />
    </div>
);

export default FinancialGoalsView;

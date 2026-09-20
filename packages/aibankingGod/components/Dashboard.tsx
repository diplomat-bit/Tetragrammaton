import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import AIInsights from './AIInsights';
import ImpactTracker from './ImpactTracker';
import InvestmentPortfolio from './InvestmentPortfolio';
import { View } from '../types';

const Dashboard: React.FC<{ setActiveView: (view: View) => void }> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) return null;

    const { treesPlanted, spendingForNextTree, userProfile } = context;

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Sovereign Command</h2>
                    <p className="text-gray-400 font-mono mt-1">Status: All Systems Operational // Global settlement logic active</p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Available Liquidity</p>
                    <p className="text-2xl font-bold text-cyan-400">${userProfile.usdBalance.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <BalanceSummary />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Quick Actions" className="h-full">
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setActiveView(View.SendMoney)} className="p-4 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 rounded-xl text-cyan-300 font-bold transition-all transform hover:scale-105">Transmit Funds</button>
                                <button onClick={() => setActiveView(View.Crypto)} className="p-4 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 rounded-xl text-indigo-300 font-bold transition-all transform hover:scale-105">Web3 Gateway</button>
                                <button onClick={() => setActiveView(View.QuantumWeaver)} className="p-4 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-xl text-purple-300 font-bold transition-all transform hover:scale-105">Forge Venture</button>
                                <button onClick={() => setActiveView(View.Goals)} className="p-4 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 rounded-xl text-emerald-300 font-bold transition-all transform hover:scale-105">Goal Matrix</button>
                            </div>
                        </Card>
                        <ImpactTracker initialTrees={treesPlanted} initialCarbonOffsetTonnes={14.2} initialBiodiversityIndex={88} initialWaterPurityPPM={12} initialSocialEquityScore={91} transactionsPerSecond={5} />
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <AIInsights />
                    <InvestmentPortfolio />
                    {/* Fix: RecentTransactions does not take props */}
                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
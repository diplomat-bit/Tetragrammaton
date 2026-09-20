import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Bot, Activity, Zap, ShieldAlert } from 'lucide-react';

const TradingBotsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Neural Advisor Sanctum</h1>
                <p className="text-gray-400">Algorithmic trading and automated portfolio management.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Active Bots</h3>
                        <Bot className="text-cyan-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        3
                    </div>
                </div>
                
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">24h Volume</h3>
                        <Activity className="text-purple-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        $124,500
                    </div>
                </div>

                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Risk Level</h3>
                        <ShieldAlert className="text-orange-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        Moderate
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Zap className="text-cyan-400" size={20} />
                    Active Strategies
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <Bot size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Alpha Arbitrage</div>
                                <div className="text-xs text-gray-500 mt-1">High-frequency cross-exchange</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-green-400">+1.2%</div>
                            <div className="text-xs text-gray-500 mt-1">Running</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <Bot size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Yield Farmer Pro</div>
                                <div className="text-xs text-gray-500 mt-1">DeFi liquidity optimization</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-green-400">+0.8%</div>
                            <div className="text-xs text-gray-500 mt-1">Running</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingBotsView;

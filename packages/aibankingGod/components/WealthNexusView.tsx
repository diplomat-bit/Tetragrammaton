import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { TrendingUp, PieChart, DollarSign, Activity } from 'lucide-react';

const WealthNexusView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return null;

    const totalAssets = context.assets.reduce((acc, asset) => acc + asset.value, 0);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Wealth Nexus</h1>
                <p className="text-gray-400">Capital expansion and multi-asset portfolio orchestration.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Total Net Worth</h3>
                        <DollarSign className="text-green-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        ${totalAssets.toLocaleString()}
                    </div>
                </div>
                
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">24h Change</h3>
                        <TrendingUp className="text-cyan-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-green-400">
                        +2.4%
                    </div>
                </div>

                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Yield Rate</h3>
                        <Activity className="text-purple-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        8.5% APY
                    </div>
                </div>

                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Active Positions</h3>
                        <PieChart className="text-orange-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {context.assets.length}
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <PieChart className="text-cyan-400" size={20} />
                    Asset Allocation
                </h2>
                <div className="space-y-4">
                    {context.assets.map((asset, idx) => (
                        <div key={asset.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
                                    {asset.name[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">{asset.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{asset.assetClass}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-white">
                                    {asset.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">YTD: {asset.performanceYTD}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WealthNexusView;

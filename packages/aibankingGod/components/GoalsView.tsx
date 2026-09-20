import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Target, TrendingUp, CheckCircle } from 'lucide-react';

const GoalsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Financial Goals</h1>
                <p className="text-gray-400">Track and manage your financial objectives.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {context.financialGoals?.map(goal => (
                    <div key={goal.id} className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">{goal.name}</h3>
                            {goal.currentAmount >= goal.targetAmount ? (
                                <CheckCircle className="text-green-400" size={24} />
                            ) : (
                                <Target className="text-cyan-400" size={24} />
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Progress</span>
                                    <span className="text-white font-medium">
                                        {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-cyan-500 rounded-full"
                                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Target</span>
                                <span className="text-white font-medium">${goal.targetAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Deadline</span>
                                <span className="text-white font-medium">{new Date(goal.targetDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {(!context.financialGoals || context.financialGoals.length === 0) && (
                    <div className="col-span-full p-12 text-center border border-dashed border-white/10 rounded-2xl">
                        <Target className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white mb-2">No Goals Set</h3>
                        <p className="text-gray-400">Define your financial objectives to start tracking progress.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalsView;

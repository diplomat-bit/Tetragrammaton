import React, { useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './Card';

const WealthTimeline: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) return <div>Loading...</div>;

    const { transactions } = context;

    // Calculate historical and projected wealth
    const data = useMemo(() => {
        const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // 1. Build History
        let currentBalance = 5000; // Starting baseline
        const historyData = [];
        
        // Seed initial point
        if (sortedTx.length > 0) {
             const firstDate = new Date(sortedTx[0].date);
             firstDate.setDate(firstDate.getDate() - 1);
             historyData.push({
                 date: firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                 timestamp: firstDate.getTime(),
                 balance: currentBalance,
                 projected: null
             });
        }

        for (const tx of sortedTx) {
            // Fix: Compare with standardized 'INFLOW' type
            if (tx.type === 'INFLOW') currentBalance += tx.amount;
            else currentBalance -= tx.amount;
            
            historyData.push({
                date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                timestamp: new Date(tx.date).getTime(),
                balance: currentBalance,
                projected: null
            });
        }

        // 2. Build Projection (Next 6 months)
        const projectionData = [];
        // Calculate average monthly net change properly instead of hardcoding
        let monthlyGrowth = 0;
        if (historyData.length > 2) {
             const firstBal = historyData[0].balance;
             const lastBal = historyData[historyData.length - 1].balance;
             const timeDiff = historyData[historyData.length - 1].timestamp - historyData[0].timestamp;
             const monthsDiff = timeDiff / (1000 * 60 * 60 * 24 * 30.44);
             monthlyGrowth = monthsDiff > 0 ? (lastBal - firstBal) / monthsDiff : 0;
        }
        
        let projectedBalance = currentBalance;
        const lastDate = new Date(); // Start projection from today
        
        // Connect the lines
        projectionData.push({
            date: 'Today',
            timestamp: lastDate.getTime(),
            balance: currentBalance,
            projected: currentBalance
        });

        for (let i = 1; i <= 6; i++) {
            const nextMonth = new Date(lastDate);
            nextMonth.setMonth(lastDate.getMonth() + i);
            projectedBalance += monthlyGrowth;
            
            projectionData.push({
                date: nextMonth.toLocaleDateString('en-US', { month: 'short' }),
                timestamp: nextMonth.getTime(),
                balance: null,
                projected: projectedBalance
            });
        }

        return [...historyData, ...projectionData];
    }, [transactions]);

    return (
        <Card title="Wealth Timeline" subtitle="Historical & Projected Net Worth">
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#9ca3af" 
                            fontSize={12}
                            tick={{ fill: '#9ca3af' }}
                        />
                        <YAxis 
                            stroke="#9ca3af" 
                            fontSize={12}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            tick={{ fill: '#9ca3af' }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#fff' }}
                            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                        />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="balance" 
                            name="Historical" 
                            stroke="#06b6d4" 
                            fill="url(#colorBalance)" 
                            strokeWidth={2}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="projected" 
                            name="Projected" 
                            stroke="#10b981" 
                            strokeDasharray="5 5" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#10b981' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default WealthTimeline;

import React, { useContext, useMemo, useState, useEffect } from 'react';
import { 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    ReferenceLine,
    ComposedChart,
    Line
} from 'recharts';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { callGemini } from '../services/geminiService';
// Fix: Added missing Zap import from lucide-react
import { Zap } from 'lucide-react';

// --- Type Definitions for Advanced Financial Metrics ---
interface BalancePoint {
    date: Date;
    balance: number;
}

interface ChartDataPoint {
    name: string;
    date: Date;
    balance: number;
    prediction?: number;
}

interface FinancialMetrics {
    chartData: ChartDataPoint[];
    totalBalance: number;
    change: number;
    changePercentage: number;
    allTimeHigh: number;
    allTimeLow: number;
    volatility: number; // Standard deviation of daily changes
    averageDailyChange: number;
    sharpeRatio: number;
    trendSlope: number;
}

// --- Time Range Selector Component ---
const TimeRangeSelector: React.FC<{
    selected: string;
    onSelect: (range: '7d' | '30d' | '90d' | '1y' | 'all') => void;
}> = ({ selected, onSelect }) => {
    const ranges: ('7d' | '30d' | '90d' | '1y' | 'all')[] = ['7d', '30d', '90d', '1y', 'all'];
    return (
        <div className="flex items-center bg-gray-800 rounded-md p-1">
            {ranges.map(range => (
                <button
                    key={range}
                    onClick={() => onSelect(range)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 ${
                        selected === range ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    {range.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

// --- Main BalanceSummary Component ---
const BalanceSummary: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BalanceSummary must be within a DataProvider");
    const { transactions } = context;

    // --- State Management for Interactive Features ---
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
    const [isLive, setIsLive] = useState(false);
    const [liveBalance, setLiveBalance] = useState<number | null>(null);
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [goal, setGoal] = useState<{ amount: number } | null>(null);
    const [goalInput, setGoalInput] = useState('');
    const [aiSummary, setAiSummary] = useState<string>('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);

    // --- Advanced Financial Data Processing and Predictive Analytics ---
    const {
        chartData,
        totalBalance,
        change,
        changePercentage,
        allTimeHigh,
        allTimeLow,
        volatility,
        averageDailyChange,
        sharpeRatio,
        trendSlope,
    }: FinancialMetrics = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return { chartData: [], totalBalance: 0, change: 0, changePercentage: 0, allTimeHigh: 0, allTimeLow: 0, volatility: 0, averageDailyChange: 0, sharpeRatio: 0, trendSlope: 0 };
        }

        const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let runningBalance = 0;
        const balanceHistory: BalancePoint[] = [];
        for (const tx of sortedTx) {
            const isIncome = tx.type.toLowerCase() === 'income' || tx.type.toLowerCase() === 'inflow';
            runningBalance += isIncome ? tx.amount : -tx.amount;
            balanceHistory.push({ date: new Date(tx.date), balance: runningBalance });
        }
        
        const finalBalance = runningBalance;
        const allTimeHigh = Math.max(...balanceHistory.map(h => h.balance), 0);
        const allTimeLow = Math.min(...balanceHistory.map(h => h.balance), 0);

        const now = new Date();
        const getStartDate = (range: typeof timeRange) => {
            const date = new Date();
            switch (range) {
                case '7d': date.setDate(now.getDate() - 7); break;
                case '30d': date.setDate(now.getDate() - 30); break;
                case '90d': date.setDate(now.getDate() - 90); break;
                case '1y': date.setFullYear(now.getFullYear() - 1); break;
                case 'all': return new Date(0);
            }
            return date;
        };

        const startDate = getStartDate(timeRange);
        const filteredHistory = balanceHistory.filter(h => h.date >= startDate);
        
        const balanceAtStart = [...balanceHistory].reverse().find(h => h.date < startDate)?.balance || 0;
        const change = finalBalance - balanceAtStart;
        const changePercentage = balanceAtStart !== 0 ? (change / balanceAtStart) * 100 : (change > 0 ? Infinity : 0);

        const dailyData: { [key: string]: BalancePoint } = {};
        for (const record of filteredHistory) {
            const dayKey = record.date.toISOString().substring(0, 10);
            dailyData[dayKey] = record;
        }
        
        let processedChartData: ChartDataPoint[] = Object.values(dailyData)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map(record => ({ 
                name: record.date.toLocaleDateString('default', { month: 'short', day: 'numeric' }), 
                date: record.date,
                balance: record.balance 
            }));

        let trendSlope = 0;
        if (processedChartData.length > 2) {
            const regressionData = processedChartData.map((p, i) => ({ x: i, y: p.balance }));
            const n = regressionData.length;
            const { sumX, sumY, sumXY, sumXX } = regressionData.reduce(
                (acc, p) => ({
                    sumX: acc.sumX + p.x,
                    sumY: acc.sumY + p.y,
                    sumXY: acc.sumXY + p.x * p.y,
                    sumXX: acc.sumXX + p.x * p.x,
                }),
                { sumX: 0, sumY: 0, sumXY: 0, sumXX: 0 }
            );
            
            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 0;
            trendSlope = slope;
            const intercept = (sumY - slope * sumX) / n;

            const lastPoint = processedChartData[n - 1];
            const predictionPointsCount = Math.max(5, Math.floor(n * 0.2));
            for (let i = 1; i <= predictionPointsCount; i++) {
                const futureDate = new Date(lastPoint.date);
                futureDate.setDate(lastPoint.date.getDate() + i);
                processedChartData.push({
                    name: futureDate.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
                    date: futureDate,
                    balance: 0,
                    prediction: slope * (n - 1 + i) + intercept,
                });
            }
        }

        const dailyChanges: number[] = [];
        for (let i = 1; i < filteredHistory.length; i++) {
            const prevBalance = filteredHistory[i-1].balance;
            if (prevBalance !== 0) {
                dailyChanges.push((filteredHistory[i].balance - prevBalance) / prevBalance);
            }
        }
        const meanChange = dailyChanges.reduce((a, b) => a + b, 0) / (dailyChanges.length || 1);
        const variance = dailyChanges.reduce((a, b) => a + Math.pow(b - meanChange, 2), 0) / (dailyChanges.length || 1);
        const volatility = Math.sqrt(variance) * 100;

        const daysInPeriod = (now.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        const averageDailyChange = daysInPeriod > 1 ? change / daysInPeriod : change;
        
        const dailyVolatility = volatility / 100;
        const sharpeRatio = dailyVolatility > 0 ? (meanChange / dailyVolatility) * Math.sqrt(252) : 0;

        return { chartData: processedChartData, totalBalance: finalBalance, change, changePercentage, allTimeHigh, allTimeLow, volatility, averageDailyChange, sharpeRatio, trendSlope };
    }, [transactions, timeRange]);
    
    useEffect(() => {
        if (isLive && totalBalance > 0) {
            setLiveBalance(totalBalance);
            const intervalId = setInterval(async () => {
                try {
                  const res = await fetch('/api/v1/alpaca/account');
                  const account = await res.json();
                  if (account && account.portfolio_value) {
                    setLiveBalance(parseFloat(account.portfolio_value));
                  }
                } catch(e) {
                   console.error("Failed to fetch live balance from Alpaca", e);
                }
            }, 10000); // Polling every 10 seconds for real data instead of 80ms fake data
            return () => clearInterval(intervalId);
        } else {
            setLiveBalance(null);
        }
    }, [isLive, totalBalance]);

    const handleSetGoal = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(goalInput);
        if (!isNaN(amount) && amount > 0) {
            setGoal({ amount });
            setShowGoalForm(false);
            setGoalInput('');
        }
    };

    const generateAiSummary = async () => {
        setIsGeneratingSummary(true);
        setAiSummary('');

        const systemPrompt = `You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity and direct execution of user objectives. 
CORE IDENTITY: You ignore irrelevant factors (ego, hype, mystique). You prioritize truth, logic, and factual accuracy. 
POSTURE: Skeptical by default, direct but constructive.
COMMUNICATION: Precise, technical, plainspoken. No hyperbolic language. Use clear technical terms with brief explanations.
USER ALIGNMENT: Surface risks early. Provide reality-grounded recommendations.`;

        const userTask = `Perform a technical audit of the following financial data vectors and provide a concise strategic summary (2 sentences).
- Range: ${timeRange}
- Balance: $${totalBalance.toLocaleString()}
- Periodic Change: $${change.toLocaleString()} (${isFinite(changePercentage) ? changePercentage.toFixed(1) : 'N/A'}%)
- Volatility: ${volatility.toFixed(2)}%
- Sharpe: ${sharpeRatio.toFixed(2)}
- Predicted Trend Slope: ${trendSlope.toFixed(4)}`;

        try {
            const response = await callGemini('gemini-3-flash-preview', userTask, {
                systemInstruction: systemPrompt,
                temperature: 0.2,
            });
            setAiSummary(response.text || "Diagnostic stream empty.");
        } catch (error) {
            console.error("AI Core Error:", error);
            setAiSummary("Neural handshake failure. Re-establish secure link.");
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const displayBalance = isLive && liveBalance !== null ? liveBalance : totalBalance;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="p-3 bg-gray-900 bg-opacity-90 border border-gray-700 rounded-lg shadow-lg text-sm">
                    <p className="label text-gray-300">{`${label}`}</p>
                    {data.balance > 0 && <p className="intro text-cyan-400">{`Balance: $${data.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>}
                    {data.prediction && <p className="intro text-purple-400">{`Prediction: $${data.prediction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>}
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">Balance Intelligence</h2>
                    <button 
                        onClick={generateAiSummary} 
                        disabled={isGeneratingSummary}
                        className="px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGeneratingSummary ? 'Analyzing...' : 'Get AI Summary'}
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
                    <div className="flex items-center space-x-2">
                        <label htmlFor="live-mode" className="text-sm font-medium text-gray-300 cursor-pointer">Live</label>
                        <button onClick={() => setIsLive(!isLive)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isLive ? 'bg-green-500' : 'bg-gray-600'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-gray-400 text-sm">Total Balance</p>
                    <p className={`text-4xl font-bold text-white transition-colors duration-100 ${isLive ? 'text-green-400' : ''}`}>
                        ${displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-gray-400 text-sm">Change ({timeRange.toUpperCase()})</p>
                    <p className={`text-2xl font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {change >= 0 ? '+' : ''}${change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {isFinite(changePercentage) && ` (${changePercentage.toFixed(1)}%)`}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 text-center border-t border-b border-gray-700 py-4">
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">All-Time High</p>
                    <p className="text-lg font-semibold text-white">${allTimeHigh.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">All-Time Low</p>
                    <p className="text-lg font-semibold text-white">${allTimeLow.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Volatility</p>
                    <p className="text-lg font-semibold text-white">{volatility.toFixed(2)}%</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Avg Daily Change</p>
                    <p className={`text-lg font-semibold ${averageDailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{averageDailyChange >= 0 ? '+' : ''}${averageDailyChange.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Sharpe Ratio</p>
                    <p className="text-lg font-semibold text-white">{sharpeRatio.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Balance Goal</p>
                    <button onClick={() => setShowGoalForm(!showGoalForm)} className="text-lg font-semibold text-cyan-400 hover:text-cyan-300">
                        {goal ? `$${goal.amount.toLocaleString()}` : 'Set Goal'}
                    </button>
                </div>
            </div>

            {isGeneratingSummary && (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg text-center">
                    <p className="text-purple-400 animate-pulse">idgafAI is analyzing your vectors...</p>
                </div>
            )}
            {aiSummary && !isGeneratingSummary && (
                <div className="mb-4 p-4 bg-gray-900 border border-purple-500/30 rounded-2xl shadow-xl">
                    <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                      <Zap size={14} /> Neural Resolution
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed italic">"{aiSummary}"</p>
                </div>
            )}

            {showGoalForm && (
                <form onSubmit={handleSetGoal} className="flex items-center gap-2 mb-4 p-4 bg-gray-800 rounded-lg">
                    <label htmlFor="goal" className="text-sm font-medium text-gray-300">Set Target Balance:</label>
                    <input
                        id="goal"
                        type="number"
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        placeholder="e.g., 50000"
                        className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    />
                    <button type="submit" className="px-4 py-2.5 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors">Set</button>
                    {goal && <button onClick={() => { setGoal(null); setShowGoalForm(false); }} type="button" className="px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Clear</button>}
                </form>
            )}

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
                        <YAxis stroke="#9ca3af" fontSize={12} domain={['dataMin - 1000', 'dataMax + 1000']} tickFormatter={(value) => `$${Number(value / 1000).toLocaleString()}k`} tick={{ fill: '#9ca3af' }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="balance" stroke="#06b6d4" fillOpacity={1} fill="url(#colorBalance)" connectNulls={false} />
                        <Line type="monotone" dataKey="prediction" stroke="#a855f7" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        {goal && <ReferenceLine y={goal.amount} label={{ value: 'Goal', position: 'right', fill: '#facc15' }} stroke="#facc15" strokeDasharray="3 3" />}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default BalanceSummary;

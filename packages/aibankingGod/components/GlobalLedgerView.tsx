import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Activity, Database, Shield, Zap, RefreshCw, BarChart3, ListCollapse } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const GlobalLedgerView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return null;

    const realAccounts = context.modernTreasuryLedgerAccounts || [];
    const hasRealData = realAccounts.length > 0;

    // Use only real data. If none, show placeholder/instructions for integration.
    const displayAccounts = realAccounts;

    const formatBalance = (balObj: any) => {
        if (!balObj) return "$0.00";
        const amount = balObj.amount ?? 0;
        const exp = balObj.currency_exponent ?? 2;
        const val = amount / Math.pow(10, exp);
        return val.toLocaleString('en-US', { style: 'currency', currency: balObj.currency || 'USD' });
    };

    const chartData = displayAccounts.map(acc => {
        const pendingAmount = (acc.balances?.pending_balance?.amount ?? 0) / Math.pow(10, acc.balances?.pending_balance?.currency_exponent ?? 2);
        const postedAmount = (acc.balances?.posted_balance?.amount ?? 0) / Math.pow(10, acc.balances?.posted_balance?.currency_exponent ?? 2);
        return {
            name: acc.name,
            id: acc.id.slice(0, 10),
            fullId: acc.id,
            Pending: pendingAmount,
            Posted: postedAmount,
        };
    });

    const totalPostedSum = displayAccounts.reduce((acc, current) => {
        const posted = current.balances?.posted_balance?.amount ?? 0;
        const exp = current.balances?.posted_balance?.currency_exponent ?? 2;
        return acc + (posted / Math.pow(10, exp));
    }, 0);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Global Ledger</h1>
                    <p className="text-gray-400 font-medium">Distributed ledger account consensus, immutable balance indexing, and transaction flows.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 ${hasRealData ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                        <RefreshCw size={12} className={hasRealData ? "" : "animate-spin"} />
                        {hasRealData ? "ACTIVE MODERN TREASURY FEED" : "STABLE SIMULATED ENVIRONMENT"}
                    </span>
                </div>
            </header>

            {/* Metric Status Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Total Volume</h3>
                        <Activity className="text-cyan-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">
                        ${context.transactions.reduce((acc, tx) => acc + tx.amount, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-mono">Aggregated immutable events</p>
                </div>
                
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Sovereign Ledger Assets</h3>
                        <Database className="text-purple-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">
                        {totalPostedSum.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-mono">Sum total of indexed ledger accounts</p>
                </div>

                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Ledger Accounts Loaded</h3>
                        <Shield className="text-green-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">
                        {displayAccounts.length}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-mono">Counted via Modern Treasury system</p>
                </div>
            </div>

            {/* Graphs and balances section */}
            {displayAccounts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visual balance graph of accounts with IDs */}
                    <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl flex flex-col h-[400px]">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="text-cyan-400 shrink-0" size={20} />
                            <div>
                                <h2 className="text-lg font-bold text-white leading-none">Ledger Account Balances</h2>
                                <p className="text-xs text-gray-500 mt-1">Graphed balances by unique ledger account ID</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis dataKey="id" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        formatter={(value: any, name: any, props: any) => [
                                            `$${Number(value).toLocaleString()}`, 
                                            name === 'Posted' ? `Posted Balance` : `Pending Balance`
                                        ]}
                                        labelFormatter={(label) => {
                                            const account = chartData.find(a => a.id === label);
                                            return account ? `${account.name} (ID: ${account.fullId})` : label;
                                        }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                                    <Bar dataKey="Posted" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Pending" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Table representation of ledger accounts and IDs */}
                    <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl flex flex-col h-[400px]">
                        <div className="flex items-center gap-2 mb-6">
                            <ListCollapse className="text-purple-400 shrink-0" size={20} />
                            <div>
                                <h2 className="text-lg font-bold text-white leading-none">Sovereign Vault Ledger Accounts</h2>
                                <p className="text-xs text-gray-500 mt-1">Detailed list of accounts loaded via Modern Treasury SDK</p>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                            {displayAccounts.map((acc, idx) => (
                                <div key={acc.id || idx} className="p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">{acc.name}</h4>
                                        <div className="text-[11px] text-gray-500 font-mono mt-1 select-all break-all">ID: {acc.id}</div>
                                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">Ledger ID: {acc.ledger_id}</div>
                                    </div>
                                    <div className="text-right flex flex-row md:flex-col justify-between items-end gap-1 shrink-0">
                                        <div>
                                            <div className="text-xs font-semibold text-cyan-400" title="Posted Balance">
                                                Posted: {formatBalance(acc.balances?.posted_balance)}
                                            </div>
                                            <div className="text-[11px] text-purple-400 mt-0.5" title="Pending Balance">
                                                Pending: {formatBalance(acc.balances?.pending_balance)}
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-gray-800 text-gray-400 border border-white/5">
                                            Type: {acc.normal_balance}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-900/50 border border-white/5 rounded-[2rem] p-12 text-center backdrop-blur-3xl animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Database className="text-cyan-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Immutable Ledger Offline</h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-8 font-mono text-sm uppercase leading-relaxed">
                        No live Modern Treasury ledger accounts detected. Synchronize your organizational credentials to materialize the sovereign financial stack.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="px-8 py-3 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all font-mono text-xs">
                            Configure Integration
                        </button>
                        <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all font-mono text-xs">
                            Audit Logs
                        </button>
                    </div>
                </div>
            )}

            {/* Recents List */}
            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Zap className="text-cyan-400" size={20} />
                    Immutable Transaction Ledger Blocks
                </h2>
                <div className="space-y-4">
                    {[...context.transactions, ...context.modernTreasuryTransactions].slice(0, 5).map((tx, idx) => (
                        <div key={tx.id || idx} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                            <div>
                                <div className="text-sm font-medium text-white">{tx.description || tx.name}</div>
                                <div className="text-xs text-gray-500 font-mono mt-1">ID: {tx.id?.slice(0, 8) || '...'}</div>
                            </div>
                            <div className="text-right">
                                <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                                    {tx.amount > 0 ? '+' : ''}{(tx.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </span>
                                <div className="text-[11px] text-gray-500 mt-1">{new Date(tx.date || tx.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GlobalLedgerView;

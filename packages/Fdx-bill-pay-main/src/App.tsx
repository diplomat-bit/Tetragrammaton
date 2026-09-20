import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, AreaChart, Area } from 'recharts';
import { Activity, Users, Settings, Server, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from './utils';

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('citi_username') || '');
  const [payees, setPayees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>(() => JSON.parse(localStorage.getItem('citi_telemetryLogs') || '[]'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('citi_username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('citi_telemetryLogs', JSON.stringify(telemetryLogs));
  }, [telemetryLogs]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [payeesRes, paymentsRes] = await Promise.all([
        fetch('/api/payees'),
        fetch('/api/payments')
      ]);
      
      const payeesJson = await payeesRes.json();
      const paymentsJson = await paymentsRes.json();
      
      if (!payeesRes.ok) throw new Error(payeesJson.error || `Payees HTTP error ${payeesRes.status}`);
      if (!paymentsRes.ok) throw new Error(paymentsJson.error || `Payments HTTP error ${paymentsRes.status}`);

      setPayees(payeesJson.data?.payees || []);
      setPayments(paymentsJson.data?.payments || []);
      
      const newLogs = [];
      if (payeesJson.telemetry) newLogs.push(payeesJson.telemetry);
      if (paymentsJson.telemetry) newLogs.push(paymentsJson.telemetry);

      if (newLogs.length > 0) {
         setTelemetryLogs(prev => [...prev, ...newLogs].slice(-20)); // Keep last 20 logs
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusData = payees.reduce((acc, curr) => {
    const status = curr.merchant?.status || 'UNKNOWN';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusChartData = Object.entries(statusData).map(([name, count]) => ({ name, count }));

  const avgLatency = telemetryLogs.length > 0 
    ? Math.round(telemetryLogs.reduce((sum, log) => sum + log.latency, 0) / telemetryLogs.length) 
    : 0;

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Server size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">FDX BillPay Connect</h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">Sandbox</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>API Status: Online</span>
          </div>
          <div className="w-px h-4 bg-slate-700"></div>
          <div className="relative flex items-center">
            <Settings className="absolute left-3 text-slate-500" size={14} />
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-slate-200 transition-all w-40"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {username ? `Welcome back, ${username}` : 'Dashboard Overview'}
              </h2>
              <p className="text-slate-400 text-xs mt-1">Manage payees and monitor API telemetry in real-time.</p>
            </div>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-70"
            >
              <RefreshCw size={14} className={cn(loading && "animate-spin")} />
              {loading ? 'Fetching...' : 'Fetch Data'}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="text-xs font-medium">
                API Connection Error: <span className="font-normal">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Payees</h3>
                <Users size={16} className="text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white">{payees.length}</div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Payments</h3>
                <Activity size={16} className="text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">{payments.length}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg API Latency</h3>
                <Activity size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {avgLatency} <span className="text-sm font-medium text-slate-500">ms</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">API Requests</h3>
                <RefreshCw size={16} className="text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white">{telemetryLogs.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Telemetry Chart */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-80">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <Activity size={16} className="text-indigo-400" />
                API Latency Telemetry
              </h3>
              <div className="flex-1 min-h-0 w-full">
                {telemetryLogs.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetryLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                        itemStyle={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="latency" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs font-medium">
                    No telemetry data yet. Click fetch to begin.
                  </div>
                )}
              </div>
            </div>

            {/* Payees Status Chart */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-80">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <Users size={16} className="text-emerald-400" />
                Payee Distribution
              </h3>
              <div className="flex-1 min-h-0 w-full">
                {statusChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip 
                        cursor={{ fill: '#1e293b' }}
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                        itemStyle={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs font-medium">
                    No payees loaded.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Raw Payee Data</span>
              <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">JSON Array</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] text-slate-500 bg-slate-950/40 border-b border-slate-800 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-3 font-bold">Display Name</th>
                    <th className="px-6 py-3 font-bold">Location</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 font-bold">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {payees.length > 0 ? (
                    payees.map((payee, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-200">
                          {payee.merchant?.displayName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {[payee.merchant?.address?.city, payee.merchant?.address?.region].filter(Boolean).join(', ') || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider",
                            payee.merchant?.status === 'ACTIVE' 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          )}>
                            {payee.merchant?.status || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-[10px]">
                          {payee.merchant?.payeeId || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">
                        No payees to display.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Raw Payment Data</span>
              <span className="text-[10px] text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">JSON Array</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] text-slate-500 bg-slate-950/40 border-b border-slate-800 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-3 font-bold">Payment ID</th>
                    <th className="px-6 py-3 font-bold">Payee ID</th>
                    <th className="px-6 py-3 font-bold">Amount</th>
                    <th className="px-6 py-3 font-bold">Due Date</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {payments.length > 0 ? (
                    payments.map((payment, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-200 text-[10px]">
                          {payment.paymentId || '-'}
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">
                          {payment.toPayeeId || '-'}
                        </td>
                        <td className="px-6 py-4 font-medium text-emerald-400">
                          ${payment.amount != null ? Number(payment.amount).toFixed(2) : '0.00'}
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-[10px]">
                          {payment.dueDate || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider",
                            payment.status === 'PROCESSED' 
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          )}>
                            {payment.status || 'UNKNOWN'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                        No payments to display.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

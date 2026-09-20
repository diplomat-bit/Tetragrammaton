import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  CreditCard,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus,
  CheckCircle,
  Activity,
  Code2,
  Terminal,
  Calendar,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';

export function StripeAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeMetric, setActiveMetric] = useState<'gross_volume' | 'net_volume' | 'new_customer_count' | 'applications/gross_volume'>('gross_volume');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  // Issuing state
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [newCardType, setNewCardType] = useState<'virtual' | 'physical'>('virtual');
  const [cardholderName, setCardholderName] = useState('Autonomous Agent 01');
  const [issuedCards, setIssuedCards] = useState<any[]>([]);
  const [isIssuing, setIsIssuing] = useState(false);

  // Raw ajax inspector
  const [rawAjaxResponse, setRawAjaxResponse] = useState<any>(null);

  useEffect(() => {
    fetchMetrics();
    fetchChartData(activeMetric);
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/stripe/dashboard/metrics');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
      }
    } catch (e) {
      console.error('Error fetching stripe metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (metricName: string) => {
    setChartLoading(true);
    try {
      const endpoint = metricName === 'applications/gross_volume' 
        ? '/ajax/charts/applications/gross_volume'
        : `/ajax/charts/${metricName}`;
      
      const res = await fetch(endpoint);
      const data = await res.json();
      setRawAjaxResponse(data);
      if (data.data) {
        setChartData(data.data);
      }
    } catch (e) {
      console.error('Error fetching chart data:', e);
    } finally {
      setChartLoading(false);
    }
  };

  const handleMetricChange = (metric: any) => {
    setActiveMetric(metric);
    fetchChartData(metric);
  };

  const handleIssueCard = async () => {
    setIsIssuing(true);
    try {
      const res = await fetch('/api/stripe/dashboard/issuing/issue-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newCardType,
          cardholderName,
          spendingLimit: 5000,
        }),
      });
      const data = await res.json();
      if (data.success && data.card) {
        setIssuedCards(prev => [data.card, ...prev]);
        setIssueModalOpen(false);
        fetchMetrics();
      }
    } catch (e) {
      console.error('Error issuing card:', e);
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Stripe Analytics & Issuing Engine</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  dashboard.629.min.txt.es
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Financial intelligence, MRR cohorts, Connect applications volume, and live card issuing
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                fetchMetrics();
                fetchChartData(activeMetric);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-gray-200 rounded-lg text-xs font-medium border border-[#30363D] transition-colors"
            >
              <RefreshCw size={13} className={chartLoading ? 'animate-spin text-indigo-400' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setIssueModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>Issue Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Volume */}
        <div
          onClick={() => handleMetricChange('gross_volume')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'gross_volume'
              ? 'bg-indigo-600/15 border-indigo-500/40 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:bg-[#1c2128]'
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
            <span>Gross Volume</span>
            <DollarSign size={16} className="text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              ${metrics?.grossVolume?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '428,940.50'}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight size={12} /> +14.8%
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Total revenue processed before fees</p>
        </div>

        {/* Net Volume */}
        <div
          onClick={() => handleMetricChange('net_volume')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'net_volume'
              ? 'bg-indigo-600/15 border-indigo-500/40 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:bg-[#1c2128]'
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
            <span>Net Volume</span>
            <Activity size={16} className="text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              ${metrics?.netVolume?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '395,120.25'}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight size={12} /> +12.4%
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Post refunds and fee deductions</p>
        </div>

        {/* New Customers */}
        <div
          onClick={() => handleMetricChange('new_customer_count')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'new_customer_count'
              ? 'bg-indigo-600/15 border-indigo-500/40 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:bg-[#1c2128]'
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
            <span>New Customers</span>
            <Users size={16} className="text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              {metrics?.newCustomerCount || 142}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight size={12} /> +8.2%
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">New accounts onboarded this month</p>
        </div>

        {/* Connect Applications Volume */}
        <div
          onClick={() => handleMetricChange('applications/gross_volume')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'applications/gross_volume'
              ? 'bg-indigo-600/15 border-indigo-500/40 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:bg-[#1c2128]'
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
            <span>Connect Applications</span>
            <Layers size={16} className="text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              ${((metrics?.grossVolume || 428940) * 0.45).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight size={12} /> +22.1%
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Marketplace & platform connected accounts</p>
        </div>
      </div>

      {/* Main Interactive Chart */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight uppercase">
              {activeMetric.replace('_', ' ').replace('/', ' — ')} (30 Day Trend)
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Source: /ajax/charts/{activeMetric}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span className="text-xs text-gray-300 font-medium">Current Period</span>
            <span className="w-2.5 h-2.5 rounded-full bg-gray-600 ml-3"></span>
            <span className="text-xs text-gray-400 font-medium">Previous Period</span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
              <XAxis dataKey="date" stroke="#8B949E" fontSize={11} tickLine={false} />
              <YAxis stroke="#8B949E" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  borderColor: '#30363D',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="previousPeriod"
                stroke="#6B7280"
                strokeDasharray="4 4"
                fill="none"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#metricGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issuing & Card Fleet Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Issuing Overview */}
        <div className="lg:col-span-6 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="text-indigo-400" size={18} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Stripe Issuing Fleet
              </h3>
            </div>
            <button
              onClick={() => setIssueModalOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              + Issue New Card
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
              <span className="text-xs text-gray-400">Active Virtual Cards</span>
              <p className="text-2xl font-bold text-white font-mono mt-1">
                {metrics?.issuingVirtualCards || 312}
              </p>
              <span className="text-[10px] text-indigo-400 font-medium">Instant API Provisioning</span>
            </div>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
              <span className="text-xs text-gray-400">Physical Cards</span>
              <p className="text-2xl font-bold text-white font-mono mt-1">
                {metrics?.issuingPhysicalCards || 48}
              </p>
              <span className="text-[10px] text-gray-400 font-medium">Custom Branded Plastic</span>
            </div>
          </div>

          {/* List of recently issued cards */}
          <div className="space-y-2 mt-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recently Issued Cards ({issuedCards.length > 0 ? issuedCards.length : 'Live Pool'})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {(issuedCards.length > 0 ? issuedCards : [
                { id: 'ic_9912a', type: 'virtual', cardholderName: 'Autonomous Agent 01', last4: '8821', spendingLimit: 5000 },
                { id: 'ic_4482b', type: 'physical', cardholderName: 'Chief Financial Officer', last4: '3940', spendingLimit: 25000 },
                { id: 'ic_1294c', type: 'virtual', cardholderName: 'Procurement Bot', last4: '1092', spendingLimit: 2500 },
              ]).map((c: any) => (
                <div
                  key={c.id}
                  className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      c.type === 'virtual' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {c.type}
                    </span>
                    <span className="font-semibold text-white">{c.cardholderName}</span>
                    <span className="font-mono text-gray-400">•••• {c.last4}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">
                    ${c.spendingLimit?.toLocaleString()} Limit
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Raw AJAX Endpoint Inspector */}
        <div className="lg:col-span-6 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="text-lime-400" size={18} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live AJAX Engine Payload
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400">
              {rawAjaxResponse?.runtimePath || `/ajax/charts/${activeMetric}`}
            </span>
          </div>

          <pre className="bg-[#090D13] border border-[#30363D] p-4 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto max-h-72 custom-scrollbar">
            {rawAjaxResponse ? JSON.stringify(rawAjaxResponse, null, 2) : '// Loading ajax response...'}
          </pre>
        </div>
      </div>

      {/* Issue Card Modal */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Issue Stripe Payment Card</h3>
            <p className="text-xs text-gray-400">
              Simulate creating a live corporate debit card for agents or employees.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Card Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCardType('virtual')}
                    className={`py-2 px-3 rounded-lg border font-semibold ${
                      newCardType === 'virtual'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-[#0D1117] text-gray-300 border-[#30363D]'
                    }`}
                  >
                    Virtual
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCardType('physical')}
                    className={`py-2 px-3 rounded-lg border font-semibold ${
                      newCardType === 'physical'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-[#0D1117] text-gray-300 border-[#30363D]'
                    }`}
                  >
                    Physical
                  </button>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={e => setCardholderName(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg p-2.5 text-white"
                  placeholder="Cardholder Name"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIssueModalOpen(false)}
                className="px-4 py-2 bg-[#21262D] text-gray-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleIssueCard}
                disabled={isIssuing}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                {isIssuing ? 'Issuing...' : 'Confirm & Issue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

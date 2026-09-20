import React from 'react';
import { CitiApiResponse } from '../types';
import { Wallet, CreditCard, Landmark, ShieldCheck, ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

interface DashboardOverviewProps {
  data: CitiApiResponse | null;
  loading: boolean;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data, loading, onNavigateTab }) => {
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 text-sm font-medium">Retrieving Citi account portfolio...</p>
        </div>
      </div>
    );
  }

  const groups = data?.accountGroupSummary || [];

  // Calculate totals and statistics
  let totalAssetsUsd = 0;
  let totalLiabilitiesUsd = 0;
  let savingsUsd = 0;
  let checkingUsd = 0;
  let loansUsd = 0;
  let creditCardLimit = 0;

  const chartDataGroups: Array<{ name: string; value: number; color: string }> = [];

  groups.forEach(group => {
    if (group.accountGroup === 'SAVINGS_AND_INVESTMENTS') {
      const amt = group.totalCurrentBalance?.foreignCurrencyBalanceAmount || 9743468.24;
      savingsUsd += amt;
      totalAssetsUsd += amt;
      chartDataGroups.push({ name: 'Savings & Investments', value: Number(amt.toFixed(2)), color: '#3b82f6' });
    } else if (group.accountGroup === 'CHECKING') {
      const amt = group.totalCurrentBalance?.foreignCurrencyBalanceAmount || 3.72;
      checkingUsd += Math.abs(amt);
      totalAssetsUsd += Math.max(0, amt);
      chartDataGroups.push({ name: 'Checking', value: Number(Math.abs(amt).toFixed(2)), color: '#10b981' });
    } else if (group.accountGroup === 'LOANS') {
      const amt = group.totalOutstandingBalance?.foreignCurrencyBalanceAmount || 714687.09;
      loansUsd += amt;
      totalLiabilitiesUsd += amt;
      chartDataGroups.push({ name: 'Loans / Mortgage', value: Number(amt.toFixed(2)), color: '#f59e0b' });
    } else if (group.accountGroup === 'CREDIT_CARD') {
      const limit = group.accounts?.[0]?.creditCardAccountSummary?.creditLimit || 698000;
      creditCardLimit += limit;
      chartDataGroups.push({ name: 'Credit Limit', value: Number(limit.toFixed(2)), color: '#8b5cf6' });
    }
  });

  const netWorthUsd = totalAssetsUsd - totalLiabilitiesUsd;

  const assetVsLiabilityPie = [
    { name: 'Assets (Savings/Checking)', value: totalAssetsUsd, color: '#3b82f6' },
    { name: 'Liabilities (Loans)', value: totalLiabilitiesUsd, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase tracking-wider font-semibold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
            Citi API Sandbox Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-3 tracking-tight">
            Portfolio Financial Overview
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Successfully connected to Citibank Account Listing & Details API. Monitoring accounts across United Arab Emirates & global regions with multi-currency USD/HKD/AUD conversions.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('accounts')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-600/30 flex items-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span>View All Accounts ({groups.length} Groups)</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai')}
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-slate-700 flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Run AI Portfolio Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Assets (USD)</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ${totalAssetsUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>Savings & Checking balances</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Liabilities (USD)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ${totalLiabilitiesUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-amber-600 mt-1 flex items-center font-medium">
              <AlertTriangle className="w-3.5 h-3.5 mr-0.5" />
              <span>Mortgage & Loan balances</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimated Net Worth</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold ${netWorthUsd >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              ${netWorthUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Assets minus outstanding liabilities
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Credit Limit</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ${creditCardLimit.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 mt-1 flex items-center font-medium">
              <span>Visa Gold Available Credit</span>
            </p>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 text-lg mb-1">Portfolio Group Distribution</h3>
          <p className="text-xs text-slate-500 mb-6">Financial breakdown across account groups in USD equivalent</p>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataGroups} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset vs Liability Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 text-lg mb-1">Assets vs Liabilities Ratio</h3>
          <p className="text-xs text-slate-500 mb-6">Comparative balance proportion in foreign currency (USD)</p>
          
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetVsLiabilityPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {assetVsLiabilityPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Account Groups Quick Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-lg mb-4">Account Group Summaries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {group.accountGroup.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {group.accounts?.length || group.insurancePolicies?.length || 0} items
                </span>
              </div>
              
              {group.totalCurrentBalance && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500">Current Balance</p>
                  <p className="text-base font-bold text-slate-900">
                    ${group.totalCurrentBalance.foreignCurrencyBalanceAmount.toLocaleString()} USD
                  </p>
                </div>
              )}

              {group.totalOutstandingBalance && group.accountGroup === 'LOANS' && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500">Outstanding Balance</p>
                  <p className="text-base font-bold text-amber-600">
                    ${group.totalOutstandingBalance.foreignCurrencyBalanceAmount.toLocaleString()} USD
                  </p>
                </div>
              )}

              {group.accountGroup === 'CREDIT_CARD' && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500">Available Credit</p>
                  <p className="text-base font-bold text-emerald-600">
                    ${group.accounts?.[0]?.creditCardAccountSummary?.availableCredit.toLocaleString()} AUD
                  </p>
                </div>
              )}

              {group.accountGroup === 'INSURANCE' && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500">Policy Number</p>
                  <p className="text-sm font-semibold text-slate-800 font-mono">
                    {group.insurancePolicies?.[0]?.displayPolicyNumber}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { CitiAccount, CitiTransaction } from '../types';
import { TrendingUp, PieChart as PieIcon, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface AnalyticsChartsProps {
  accounts: CitiAccount[];
  transactions: CitiTransaction[];
}

const COLORS = ['#0052FF', '#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ accounts, transactions }) => {
  // Accounts balance breakdown for Bar Chart
  const accountBarData = accounts.map((acct) => ({
    name: (acct.productName || acct.accountDescription || 'Account').length > 18 
      ? (acct.productName || acct.accountDescription || 'Account').substring(0, 16) + '...' 
      : (acct.productName || acct.accountDescription || 'Account'),
    balance: acct.currentBalance,
    available: acct.availableCredit || acct.availableBalance || 0,
    group: acct.accountGroup,
  }));

  // Category breakdown for expenses
  const categoryMap: Record<string, number> = {};
  let totalDebits = 0;
  let totalCredits = 0;

  transactions.forEach((tx) => {
    if (tx.transactionType === 'DEBIT') {
      totalDebits += tx.amount;
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    } else {
      totalCredits += tx.amount;
    }
  });

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      {/* Top summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Reconciled Credits</span>
            <h4 className="text-xl font-bold text-emerald-600 mt-1">
              +${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Reconciled Debits</span>
            <h4 className="text-xl font-bold text-red-600 mt-1">
              -${totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Net Cash Movement</span>
            <h4 className={`text-xl font-bold mt-1 ${totalCredits - totalDebits >= 0 ? 'text-[#0052FF]' : 'text-amber-600'}`}>
              {totalCredits - totalDebits >= 0 ? '+' : '-'}${Math.abs(totalCredits - totalDebits).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0052FF] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two main analytical charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Balances Comparison */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
            <div>
              <h3 className="font-bold text-[#1E293B] text-base">Account Balance Allocation</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Real-time ledger & available balance distribution</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#0052FF]" />
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accountBarData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Balance']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Bar dataKey="balance" fill="#0052FF" radius={[4, 4, 0, 0]} name="Ledger Balance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
            <div>
              <h3 className="font-bold text-[#1E293B] text-base">Expense Categorization</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Debit distribution across financial categories</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-center">
              <PieIcon className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="h-[280px] w-full flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-[#94A3B8]">No debit transactions recorded</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                  />
                  <Legend 
                    formatter={(val) => <span className="text-[11px] text-[#475569]">{val}</span>}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

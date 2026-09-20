import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { CitiAccount, CitiTransaction } from '../types';
import { TrendingUp, ShieldAlert, DollarSign, PieChart as PieIcon } from 'lucide-react';

interface AnalyticsPanelProps {
  accounts: CitiAccount[];
  transactions: CitiTransaction[];
}

const COLORS = ['#0052FF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ accounts, transactions }) => {
  // Balance by Account Group
  const groupData = React.useMemo(() => {
    const map = new Map<string, number>();
    accounts.forEach(a => {
      const g = a.accountGroup;
      map.set(g, (map.get(g) || 0) + a.currentBalance);
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }));
  }, [accounts]);

  // Spending by Category
  const categorySpending = React.useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter(t => t.transactionType === 'DEBIT')
      .forEach(t => {
        map.set(t.category, (map.get(t.category) || 0) + t.amount);
      });
    return Array.from(map.entries())
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [transactions]);

  // Assets vs Liabilities
  const assetTotal = accounts
    .filter(a => a.balanceType === 'ASSET' && a.accountGroup !== 'CREDITCARD' && a.accountGroup !== 'LOAN')
    .reduce((sum, a) => sum + a.currentBalance, 0);

  const liabilityTotal = accounts
    .filter(a => a.balanceType === 'LIABILITY' || a.accountGroup === 'CREDITCARD' || a.accountGroup === 'LOAN')
    .reduce((sum, a) => sum + a.currentBalance, 0);

  const netWorth = assetTotal - liabilityTotal;

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Total Assets (Liquid & Ret.)</p>
          <h2 className="text-3xl font-bold text-emerald-600">
            ${assetTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="mt-3 text-xs text-[#64748B] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Savings, Checking & Retirement</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Total Liabilities & Credit Due</p>
          <h2 className="text-3xl font-bold text-amber-600">
            ${liabilityTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="mt-3 text-xs text-[#64748B] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Credit Cards & Loans</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Calculated Net Position</p>
          <h2 className={`text-3xl font-bold ${netWorth >= 0 ? 'text-[#1E293B]' : 'text-red-600'}`}>
            ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="mt-3 text-xs text-[#64748B]">
            Real-time balance delta across all synced accounts
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Distribution by Group */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-[#1E293B] text-sm">Balance Breakdown by Account Group</h4>
            <span className="text-xs text-[#64748B]">Current balances</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={groupData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {groupData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Spending Categories */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-[#1E293B] text-sm">Top Debits by Category</h4>
            <span className="text-xs text-[#64748B]">Transaction History</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySpending} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                <YAxis dataKey="category" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Spent']} />
                <Bar dataKey="amount" fill="#0052FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

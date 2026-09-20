import React from 'react';
import { ArrowUpRight, ArrowDownRight, Layers, ShieldCheck, DollarSign, CreditCard } from 'lucide-react';
import { CitiAccount } from '../types';

interface BalanceCardsProps {
  accounts: CitiAccount[];
  lastSyncedAt: Date | null;
  autoRefreshSeconds: number;
  isLoading: boolean;
}

export const BalanceCards: React.FC<BalanceCardsProps> = ({
  accounts,
  lastSyncedAt,
  autoRefreshSeconds,
  isLoading,
}) => {
  // Compute Liquid Assets (Checking + Savings)
  const liquidBalance = accounts
    .filter((a) => a.accountGroup === 'CHECKING' || a.accountGroup === 'SAVINGS')
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  // Compute Total Credit & Loan Liabilities
  const totalLiabilities = accounts
    .filter((a) => a.accountGroup === 'CREDIT_CARD' || a.accountGroup === 'LOAN')
    .reduce((sum, a) => sum + (a.currentBalance || a.outstandingBalance || 0), 0);

  // Compute Net Available Liquidity
  const netWorth = liquidBalance - totalLiabilities;

  const connectedCount = accounts.length;
  const activeCount = accounts.filter((a) => a.accountStatus === 'ACTIVE').length;

  const formattedTime = lastSyncedAt
    ? lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Liquid Balance */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">
              Total Liquid Balance
            </p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052FF] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1A1C1E] mt-1 tracking-tight">
            ${liquidBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-[#F1F5F9]">
          <div className="flex items-center text-emerald-600 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            <span>Liquid Checking & Savings</span>
          </div>
          <span className="text-[#64748B] font-mono font-medium">
            Liabilities: -${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">
              Connected Accounts
            </p>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1A1C1E] mt-1 tracking-tight">
            {connectedCount < 10 ? `0${connectedCount}` : connectedCount}
          </h2>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#0052FF]"></div>
            <div className="w-2 h-2 rounded-full bg-[#0052FF] opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-[#0052FF] opacity-30"></div>
            <span className="text-[#64748B] ml-1">{activeCount} active in Citi Sandbox</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-medium">
            Verified
          </span>
        </div>
      </div>

      {/* Last Sync Time & Status */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">
              Last Sync Time
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1A1C1E] mt-1 tracking-tight font-mono">
            {formattedTime}
          </h2>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-[#F1F5F9]">
          <div className="text-[#64748B]">
            {autoRefreshSeconds > 0
              ? `Automatic refresh every ${autoRefreshSeconds}s`
              : 'Auto-refresh off (manual sync)'}
          </div>
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time
          </span>
        </div>
      </div>
    </div>
  );
};

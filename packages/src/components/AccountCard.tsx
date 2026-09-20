import React from 'react';
import { 
  CreditCard, 
  PiggyBank, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Percent, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CitiAccount } from '../types';

interface AccountCardProps {
  account: CitiAccount;
  onSelectAccount: (accountId: string) => void;
  isSelected?: boolean;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onSelectAccount,
  isSelected,
}) => {
  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'CREDITCARD':
        return <CreditCard className="w-5 h-5 text-[#0052FF]" />;
      case 'SAVINGS':
        return <PiggyBank className="w-5 h-5 text-emerald-600" />;
      case 'LOAN':
        return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'RETIREMENT':
      case 'INVESTMENT':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-[#64748B]" />;
    }
  };

  const getGroupBadgeColor = (group: string) => {
    switch (group) {
      case 'CREDITCARD':
        return 'bg-blue-50 text-[#0052FF] border-blue-200';
      case 'SAVINGS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'LOAN':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'RETIREMENT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Credit utilization or balance metric
  const utilization = account.creditLimit && account.creditLimit > 0
    ? Math.min(100, Math.round((account.currentBalance / account.creditLimit) * 100))
    : null;

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
        isSelected
          ? 'border-[#0052FF] ring-2 ring-[#0052FF]/20'
          : 'border-[#E2E8F0] hover:border-slate-300'
      }`}
    >
      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-center shrink-0">
              {getGroupIcon(account.accountGroup)}
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1E293B] leading-tight line-clamp-1">
                {account.productName}
              </h4>
              <p className="font-mono text-xs text-[#94A3B8] tracking-wider mt-0.5">
                {account.displayAccountNumber}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${getGroupBadgeColor(account.accountGroup)}`}>
            {account.accountGroup}
          </span>
        </div>

        {/* Primary Balance Section */}
        <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-0.5">
            {account.balanceType === 'LIABILITY' || account.accountGroup === 'CREDITCARD' || account.accountGroup === 'LOAN'
              ? 'Current Balance Due'
              : 'Current Balance'}
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-[#1A1C1E] tracking-tight">
              ${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="text-xs font-semibold text-[#64748B]">{account.currencyCode}</span>
          </div>

          {/* Available balance / credit line */}
          {account.availableCredit !== undefined && (
            <div className="mt-1.5 flex items-center justify-between text-xs text-[#64748B]">
              <span>Available Credit:</span>
              <span className="font-semibold text-emerald-600">
                ${account.availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {account.availableBalance !== undefined && account.availableCredit === undefined && (
            <div className="mt-1.5 flex items-center justify-between text-xs text-[#64748B]">
              <span>Available Balance:</span>
              <span className="font-semibold text-emerald-600">
                ${account.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Credit Limit & Utilization bar */}
          {account.creditLimit !== undefined && (
            <div className="mt-2.5">
              <div className="flex justify-between text-[11px] text-[#64748B] mb-1">
                <span>Credit Limit: ${account.creditLimit.toLocaleString()}</span>
                <span className="font-semibold">{utilization}% used</span>
              </div>
              <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    (utilization || 0) > 80
                      ? 'bg-red-500'
                      : (utilization || 0) > 50
                      ? 'bg-amber-500'
                      : 'bg-[#0052FF]'
                  }`}
                  style={{ width: `${Math.min(100, utilization || 0)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Details Sub-grid */}
      <div className="px-5 py-3 bg-[#F8F9FB] border-t border-[#F1F5F9] text-xs space-y-1.5">
        {/* APR or Interest Rate */}
        {account.purchasesAPR !== undefined && (
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="flex items-center gap-1">
              <Percent className="w-3 h-3 text-[#0052FF]" />
              <span>Purchases APR:</span>
            </span>
            <span className="font-semibold text-[#1E293B] font-mono">{account.purchasesAPR}%</span>
          </div>
        )}

        {account.interestRate !== undefined && (
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="flex items-center gap-1">
              <Percent className="w-3 h-3 text-emerald-600" />
              <span>Interest Rate:</span>
            </span>
            <span className="font-semibold text-[#1E293B] font-mono">{account.interestRate}%</span>
          </div>
        )}

        {/* Minimum Due Amount */}
        {account.minimumDueAmount !== undefined && (
          <div className="flex items-center justify-between text-[#64748B]">
            <span>Minimum Due:</span>
            <span className="font-semibold text-red-600 font-mono">
              ${account.minimumDueAmount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Payment Due Date */}
        {account.paymentDueDate && (
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Payment Due:</span>
            </span>
            <span className="font-medium text-[#1E293B] font-mono">{account.paymentDueDate}</span>
          </div>
        )}

        {/* Last Statement or Payment */}
        {account.lastPaymentAmount !== undefined && (
          <div className="flex items-center justify-between text-[#64748B]">
            <span>Last Payment:</span>
            <span className="font-medium text-[#1E293B]">
              ${account.lastPaymentAmount.toFixed(2)} {account.lastPaymentDate ? `(${account.lastPaymentDate})` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="p-3 bg-white border-t border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span>{account.accountStatus}</span>
        </div>

        <button
          onClick={() => onSelectAccount(account.accountId)}
          className="text-xs font-semibold text-[#0052FF] hover:text-[#0045D8] flex items-center gap-1 transition-colors py-1 px-2 rounded hover:bg-blue-50"
        >
          <span>View Transactions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

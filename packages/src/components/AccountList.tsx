import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  PiggyBank, 
  Landmark, 
  Copy, 
  Check, 
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  FileJson
} from 'lucide-react';
import { CitiAccount } from '../types';

interface AccountListProps {
  accounts: CitiAccount[];
  selectedAccountId: string | null;
  onSelectAccount: (accountId: string) => void;
  onLoadExample?: () => void;
  onOpenPasteModal?: () => void;
}

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onLoadExample,
  onOpenPasteModal,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getAccountIcon = (group: string) => {
    const g = (group || '').toUpperCase();
    if (g.includes('CREDIT')) return <CreditCard className="w-4 h-4 text-indigo-600" />;
    if (g.includes('SAVING')) return <PiggyBank className="w-4 h-4 text-emerald-600" />;
    if (g.includes('LOAN')) return <Landmark className="w-4 h-4 text-amber-600" />;
    if (g.includes('RETIRE') || g.includes('INVEST')) return <TrendingUp className="w-4 h-4 text-purple-600" />;
    return <Wallet className="w-4 h-4 text-[#0052FF]" />;
  };

  const getBadgeStyle = (group: string) => {
    const g = (group || '').toUpperCase();
    if (g.includes('CREDIT')) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    if (g.includes('SAVING')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (g.includes('LOAN')) return 'bg-amber-50 text-amber-800 border-amber-100';
    if (g.includes('RETIRE') || g.includes('INVEST')) return 'bg-purple-50 text-purple-700 border-purple-100';
    return 'bg-blue-50 text-[#0052FF] border-blue-100';
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#1E293B] text-base">Citi Account Portfolio</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Real-time balances and available credit synchronized from Citi Gateway</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#F8F9FB] text-[#475569] border border-[#E2E8F0]">
            {accounts.length} Active Accounts
          </span>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="p-12 text-center bg-[#F8F9FB] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0052FF] flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-[#1E293B] text-base">No Accounts Synced Yet</h4>
            <p className="text-xs text-[#64748B] max-w-md mt-1">
              If your cURL or Live pull errored due to a missing Bearer token, you can load Citi's official sandbox response or paste your response payload to preview immediately.
            </p>
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            {onLoadExample && (
              <button
                type="button"
                onClick={onLoadExample}
                className="px-4 py-2 bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Load Citi Sandbox Example Response</span>
              </button>
            )}
            {onOpenPasteModal && (
              <button
                type="button"
                onClick={onOpenPasteModal}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileJson className="w-4 h-4" />
                <span>Paste Payload</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-[#F8F9FB]">
          {accounts.map((acct) => {
            const isSelected = selectedAccountId === acct.accountId;
            const isLiability = acct.balanceType === 'LIABILITY' || acct.accountGroup === 'CREDITCARD' || acct.accountGroup === 'LOAN';
            const avail = acct.availableCredit !== undefined ? acct.availableCredit : acct.availableBalance;

            return (
              <div
                key={acct.accountId}
                onClick={() => onSelectAccount(acct.accountId)}
                className={`bg-white rounded-xl p-5 border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#0052FF] ring-2 ring-[#0052FF]/10 shadow-sm'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Header row with Icon, Name, and Classification */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-center">
                        {getAccountIcon(acct.accountGroup)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1E293B] group-hover:text-[#0052FF] transition-colors leading-snug">
                          {acct.productName || acct.accountDescription || 'Citi Account'}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-mono text-[#64748B]">
                            {acct.displayAccountNumber}
                          </span>
                          <button
                            onClick={(e) => handleCopy(e, acct.displayAccountNumber, acct.accountId)}
                            className="text-[#94A3B8] hover:text-[#475569] transition-colors p-0.5"
                            title="Copy account number"
                          >
                            {copiedId === acct.accountId ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getBadgeStyle(
                        acct.accountGroup
                      )}`}
                    >
                      {acct.accountGroup}
                    </span>
                  </div>

                  {/* Balance section */}
                  <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                        Current Balance
                      </span>
                      <span className="text-xl font-bold text-[#1A1C1E] tracking-tight">
                        ${acct.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Available Credit / Balance */}
                    {avail !== undefined && (
                      <div className="flex items-center justify-between text-xs text-[#64748B] mt-1.5">
                        <span>{acct.availableCredit !== undefined ? 'Available Credit' : 'Available Balance'}</span>
                        <span className="font-semibold text-[#1E293B]">
                          ${avail.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* Credit Limit */}
                    {acct.creditLimit !== undefined && (
                      <div className="flex items-center justify-between text-xs text-[#64748B] mt-1">
                        <span>Total Credit Limit</span>
                        <span className="font-medium text-[#475569]">
                          ${acct.creditLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* APR / Interest Rate */}
                    {(acct.purchasesAPR !== undefined || acct.interestRate !== undefined) && (
                      <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-1">
                        <span>Interest Rate / APR</span>
                        <span className="font-mono text-[#0052FF] font-medium">
                          {acct.purchasesAPR !== undefined ? `${acct.purchasesAPR}% APR` : `${acct.interestRate}%`}
                        </span>
                      </div>
                    )}

                    {/* Minimum Due Date if present */}
                    {acct.paymentDueDate && (
                      <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-1">
                        <span>Payment Due Date</span>
                        <span className="text-amber-700 font-medium">
                          {acct.paymentDueDate} {acct.minimumDueAmount ? `($${acct.minimumDueAmount.toFixed(2)})` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {acct.accountStatus}
                  </span>
                  <span className="group-hover:text-[#0052FF] font-medium flex items-center gap-0.5 transition-colors">
                    Filter Transactions <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

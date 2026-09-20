import React, { useState } from 'react';
import { CitiApiResponse } from '../types';
import { Search, CreditCard, Landmark, ShieldAlert, CheckCircle, FileText, Filter, AlertTriangle } from 'lucide-react';

interface AccountListProps {
  data: CitiApiResponse | null;
  loading: boolean;
}

export const AccountList: React.FC<AccountListProps> = ({ data, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 text-sm font-medium">Loading Citi accounts...</p>
        </div>
      </div>
    );
  }

  const groups = data?.accountGroupSummary || [];

  // Gather flat list of all account items with group info
  const allItems: Array<{ groupName: string; type: string; item: any }> = [];

  groups.forEach(group => {
    if (group.accounts) {
      group.accounts.forEach(acc => {
        if (acc.creditCardAccountSummary) {
          allItems.push({ groupName: group.accountGroup, type: 'CREDIT_CARD', item: acc.creditCardAccountSummary });
        } else if (acc.loanAccountSummary) {
          allItems.push({ groupName: group.accountGroup, type: 'LOAN', item: acc.loanAccountSummary });
        } else if (acc.savingsAccountSummary) {
          allItems.push({ groupName: group.accountGroup, type: 'SAVINGS', item: acc.savingsAccountSummary });
        } else if (acc.checkingAccountSummary) {
          allItems.push({ groupName: group.accountGroup, type: 'CHECKING', item: acc.checkingAccountSummary });
        }
      });
    }
    if (group.insurancePolicies) {
      group.insurancePolicies.forEach(pol => {
        allItems.push({ groupName: group.accountGroup, type: 'INSURANCE', item: pol });
      });
    }
  });

  const filteredItems = allItems.filter(({ groupName, type, item }) => {
    const matchesGroup = selectedGroupFilter === 'ALL' || groupName === selectedGroupFilter;
    const name = item.productName || '';
    const accNum = item.displayAccountNumber || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          accNum.includes(searchQuery) ||
                          type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Citi Accounts Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Showing all retrieved accounts, cards, loans, and policies</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product or account #..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* Group Filter */}
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
          >
            <option value="ALL">All Groups ({groups.length})</option>
            {groups.map((g, i) => (
              <option key={i} value={g.accountGroup}>{g.accountGroup.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Account Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No accounts found matching your search criteria.</p>
          </div>
        ) : (
          filteredItems.map(({ groupName, type, item }, idx) => {
            const isCreditCard = type === 'CREDIT_CARD';
            const isLoan = type === 'LOAN';
            const isSavings = type === 'SAVINGS';
            const isChecking = type === 'CHECKING';
            const isInsurance = type === 'INSURANCE';

            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${
                      isCreditCard ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                      isLoan ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      isInsurance ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                      'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {isCreditCard ? <CreditCard className="w-5 h-5" /> :
                       isLoan ? <AlertTriangle className="w-5 h-5" /> :
                       isInsurance ? <FileText className="w-5 h-5" /> :
                       <Landmark className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {groupName.replace(/_/g, ' ')}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">{item.productName}</h4>
                    </div>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    item.accountStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    item.accountStatus === 'DELINQUENT' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {item.accountStatus}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 block">Account / Number</span>
                    <span className="font-mono font-semibold text-slate-800">
                      •••• {item.displayAccountNumber} {item.displayPolicyNumber ? `(${item.displayPolicyNumber})` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 block">Currency & Class</span>
                    <span className="font-medium text-slate-800">
                      {item.currencyCode} <span className="text-xs text-slate-400">({item.accountClassification})</span>
                    </span>
                  </div>
                </div>

                {/* Balances / Specific Details */}
                <div className="mt-4 bg-slate-50 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">
                      {isCreditCard ? 'Available Credit' :
                       isLoan ? 'Outstanding Principal' :
                       isInsurance ? 'Application ID' :
                       'Current Balance'}
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {isCreditCard ? `$${item.availableCredit?.toLocaleString()} AUD` :
                       isLoan ? `$${item.outstandingBalance?.toLocaleString()} HKD` :
                       isInsurance ? item.insuranceApplicationId :
                       `$${(item.currentBalance ?? 0)?.toLocaleString()} ${item.currencyCode}`}
                    </span>
                  </div>

                  {isCreditCard && (
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Credit Limit</span>
                      <span className="text-sm font-semibold text-purple-700">${item.creditLimit?.toLocaleString()}</span>
                    </div>
                  )}

                  {isLoan && (
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Next Payment Date</span>
                      <span className="text-sm font-semibold text-amber-700">{item.nextPaymentDate}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

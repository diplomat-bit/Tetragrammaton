import { fetchApi } from '../utils';
import { useState, useEffect } from 'react';
import { Account } from '../types';
import { Search, CreditCard, ChevronRight, AlertCircle, X, CheckCircle2, XCircle, Settings, ArrowRight } from 'lucide-react';

export default function AccountsView({ onManageControls }: { onManageControls?: (uid: string) => void }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchApi('/api/accounts/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    .then(data => {
      setAccounts(data.accounts || []);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  const handleAccountClick = async (accountUID: string) => {
    setDetailsLoading(true);
    try {
      const data = await fetchApi(`/api/accounts/${accountUID}`);
      setSelectedAccount(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (selectedAccount) {
    return (
      <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSelectedAccount(null)} className="text-slate-500 hover:text-slate-900 transition-colors flex items-center text-sm font-semibold group bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-fit">
          <ChevronRight className="w-4 h-4 rotate-180 mr-1 text-slate-400 group-hover:-translate-x-1 transition-transform" />
          Back to Ledger
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full pointer-events-none -z-10"></div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">{selectedAccount.cardholderName}</h1>
              <div className="flex items-center gap-4 text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-fit">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <span className="font-mono font-medium text-slate-900">•••• {selectedAccount.last4}</span>
                <span className="w-px h-4 bg-slate-200"></span>
                <span className="text-sm">Exp {selectedAccount.expirationDate || 'N/A'}</span>
                <span className="w-px h-4 bg-slate-200"></span>
                <span className="text-xs font-mono text-slate-400">{selectedAccount.accountUID}</span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold border shadow-sm ${selectedAccount.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
              {selectedAccount.status === 'Open' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {selectedAccount.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Balance</div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">${selectedAccount.currentBalance?.toLocaleString('en-US', {minimumFractionDigits: 2}) || '0.00'}</div>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Credit Limit</div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">${selectedAccount.creditLimit?.toLocaleString('en-US') || '0'}</div>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Available Cash</div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">${selectedAccount.availableCash?.toLocaleString('en-US', {minimumFractionDigits: 2}) || '0.00'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            {selectedAccount.address && (
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-3">Billing Address</h3>
                <div className="text-slate-600 space-y-1 text-sm font-medium">
                  <p>{selectedAccount.address.addressLine1}</p>
                  <p>{selectedAccount.address.city}, {selectedAccount.address.state} {selectedAccount.address.postalCode}</p>
                </div>
              </div>
            )}
            
            {onManageControls && (
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 shadow-sm flex flex-col justify-center items-start">
                 <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-2">Card Controls</h3>
                 <p className="text-blue-700 text-sm mb-4">Manage merchant category codes, velocity limits, and transaction authorizations for this card.</p>
                 <button onClick={() => onManageControls(selectedAccount.accountUID)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 text-sm group">
                   Configure MAC
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Corporate Accounts</h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">Manage cardholder accounts and balances across the organization.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search accounts..." 
            className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm font-medium transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="text-sm font-medium leading-relaxed">{error}</div>
        </div>
      )}

      {loading || detailsLoading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white rounded-xl border border-slate-100 shadow-sm"></div>)}
        </div>
      ) : accounts.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500">Cardholder</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500">Card Number</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500 text-right">Balance</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500 text-right">Credit Limit</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map(acc => (
                <tr 
                  key={acc.accountUID} 
                  onClick={() => handleAccountClick(acc.accountUID)}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-5 font-semibold text-slate-900">{acc.cardholderName}</td>
                  <td className="px-6 py-5 text-slate-500 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                      <CreditCard className="w-4 h-4 text-slate-400" /> 
                    </div>
                    <span className="font-mono text-sm font-medium text-slate-700">•••• {acc.last4}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border ${acc.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 shadow-sm'}`}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-medium text-slate-900">
                    ${acc.currentBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-5 text-right font-medium text-slate-900">
                    ${acc.creditLimit.toLocaleString('en-US')}
                  </td>
                  <td className="px-6 py-5 text-right text-slate-300 group-hover:text-blue-600 transition-colors">
                    <ChevronRight className="w-5 h-5 inline group-hover:translate-x-1 transition-transform" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !error && (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <CreditCard className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No accounts found</h3>
          <p className="text-slate-500">Create a new corporate account to get started.</p>
        </div>
      )}
    </div>
  );
}

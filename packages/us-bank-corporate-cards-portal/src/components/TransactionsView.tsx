import { fetchApi } from '../utils';
import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { Search, AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCcw, Receipt } from 'lucide-react';

export default function TransactionsView() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi('/api/transactions/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    .then(data => {
      setTransactions(data.transactions || []);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Ledger & Activity</h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">Monitor real-time authorization events and posted transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search merchants..." 
              className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm font-medium transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors" title="Refresh">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="text-sm font-medium leading-relaxed">{error}</div>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-white rounded-xl border border-slate-100 shadow-sm"></div>)}
        </div>
      ) : transactions.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500">Date</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500">Merchant</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-slate-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map(txn => (
                <tr key={txn.transactionID} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">
                    {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5 font-semibold text-slate-900 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg border border-slate-200 bg-white shadow-sm text-slate-400 flex items-center justify-center">
                      <Receipt className="w-5 h-5" />
                    </div>
                    {txn.merchant}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border shadow-sm ${txn.status === 'Posted' ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {txn.status === 'Posted' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-slate-900">
                    ${txn.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !error && (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Receipt className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No transactions yet</h3>
          <p className="text-slate-500">Activity will appear here once purchases are made.</p>
        </div>
      )}
    </div>
  );
}

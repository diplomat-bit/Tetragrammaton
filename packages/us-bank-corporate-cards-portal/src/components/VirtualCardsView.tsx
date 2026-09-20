import { useState } from 'react';
import { fetchApi } from '../utils';
import { CreditCard, Search, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VirtualCardsView() {
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    try {
      const data = await fetchApi('/api/virtual-cards/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remitType: "ClientRemit",
          paymentAccountID: "234237424872",
          amount: formData.get('amount'),
          effectiveUntil: formData.get('effectiveUntil'),
          cardholderName: formData.get('cardholderName')
        })
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTransactions = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    try {
      const data = await fetchApi(`/api/virtual-cards/cards/${formData.get('cardID')}/transactions/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: formData.get('startDate'),
          endDate: formData.get('endDate')
        })
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Virtual Cards</h1>
        <p className="text-slate-500 mt-1">Issue and manage virtual cards, and track card transactions.</p>
      </div>

      <div className="flex border-b border-slate-200 mb-6 gap-6">
        <button
          onClick={() => { setActiveTab('create'); setResult(null); setError(null); }}
          className={`pb-3 font-medium transition-colors relative ${activeTab === 'create' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Create Card
          {activeTab === 'create' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button
          onClick={() => { setActiveTab('transactions'); setResult(null); setError(null); }}
          className={`pb-3 font-medium transition-colors relative ${activeTab === 'transactions' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Card Transactions
          {activeTab === 'transactions' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'create' ? (
          <form onSubmit={handleCreate} className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Issue New Virtual Card</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                <input required name="cardholderName" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount Limit ($)</label>
                <input required name="amount" type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" placeholder="5000.00" />
              </div>
            </div>
            
            <div className="mb-8 max-w-md">
              <label className="block text-sm font-medium text-slate-700 mb-2">Effective Until (YYYY-MM-DD)</label>
              <input required name="effectiveUntil" type="date" defaultValue="2026-12-31" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            
            {result && !error && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                <div className="text-sm overflow-auto">
                  <div className="font-medium mb-1">Virtual Card Issued</div>
                  <pre className="text-xs text-emerald-700 mt-2 p-2 bg-emerald-100 rounded-md">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button disabled={loading} type="submit" className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Plus className="w-4 h-4" />}
                Create Card
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSearchTransactions} className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Search Card Transactions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Card ID</label>
                <input required name="cardID" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" placeholder="12345678" defaultValue="12345678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                <input required name="startDate" type="date" defaultValue="2025-01-01" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                <input required name="endDate" type="date" defaultValue="2026-12-31" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            
            {result && !error && (
              <div className="mb-6 p-4 bg-slate-50 text-slate-800 rounded-lg border border-slate-200 text-sm overflow-auto">
                <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}

            <div className="flex justify-start pt-4 border-t border-slate-100">
              <button disabled={loading} type="submit" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50">
                {loading ? <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
                Search Transactions
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

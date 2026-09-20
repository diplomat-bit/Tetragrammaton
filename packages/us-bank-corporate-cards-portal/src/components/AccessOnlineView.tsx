import { useState } from 'react';
import { fetchApi } from '../utils';
import { Globe, Search, AlertCircle, FileText } from 'lucide-react';

export default function AccessOnlineView() {
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSearchOrders = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await fetchApi('/api/access-online/orders/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Empty body searches last 90 days
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    const txId = formData.get('transactionID') as string;
    try {
      const data = await fetchApi(`/api/access-online/transactions/${txId}`);
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Online</h1>
        <p className="text-slate-500 mt-1">Search Access Online orders and transaction details.</p>
      </div>

      <div className="flex border-b border-slate-200 mb-6 gap-6">
        <button
          onClick={() => { setActiveTab('orders'); setResult(null); setError(null); }}
          className={`pb-3 font-medium transition-colors relative ${activeTab === 'orders' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Search Orders
          {activeTab === 'orders' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button
          onClick={() => { setActiveTab('transactions'); setResult(null); setError(null); }}
          className={`pb-3 font-medium transition-colors relative ${activeTab === 'transactions' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Transaction Details
          {activeTab === 'transactions' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'orders' ? (
          <form onSubmit={handleSearchOrders} className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Find Recent Orders</h2>
            <p className="text-sm text-slate-600 mb-6">This will search for all Access Online orders in the last 90 days.</p>
            
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
              <button disabled={loading} type="submit" className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Globe className="w-4 h-4" />}
                Search Orders
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleGetTransaction} className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Get Transaction by ID</h2>
            
            <div className="mb-8 max-w-md">
              <label className="block text-sm font-medium text-slate-700 mb-2">29-digit Access Online Transaction ID</label>
              <input required name="transactionID" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-mono text-sm" placeholder="03046074230031332024-12-1900001" defaultValue="03046074230031332024-12-1900001" />
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
                {loading ? <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div> : <FileText className="w-4 h-4" />}
                Retrieve Transaction
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { fetchApi } from '../utils';
import { Send, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ZelleView() {
  const [activeTab, setActiveTab] = useState('pay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSearchAlias = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    const alias = formData.get('alias') as string;

    try {
      const data = await fetchApi('/api/zelle/aliases/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payerID: 'Py040518',
          aliases: [alias]
        })
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    const alias = formData.get('alias') as string;
    const amount = Number(formData.get('amount'));

    try {
      const data = await fetchApi('/api/zelle/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payerID: 'Py040518',
          recipientDetail: {
            alias: alias,
            aliasType: alias.includes('@') ? 'EMAIL' : 'MOBILE',
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string
          },
          paymentDetail: {
            amount: amount,
            payFromAccountNumber: '156041200221',
            priorityType: 'STANDARD'
          },
          updateUserID: 'test_user'
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Zelle Disbursements (B2C)</h1>
        <p className="text-slate-500 mt-1">Manage B2C Zelle payments and check recipient enrollment status.</p>
      </div>

      <div className="flex border-b border-slate-200 mb-6 gap-6">
        <button
          onClick={() => { setActiveTab('pay'); setResult(null); setError(null); }}
          className={`pb-3 font-medium transition-colors relative ${activeTab === 'pay' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Send Payment
          {activeTab === 'pay' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button
          onClick={() => { setActiveTab('alias'); setResult(null); setError(null); }}
          className={`pb-3 font-medium transition-colors relative ${activeTab === 'alias' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Check Alias Enrollment
          {activeTab === 'alias' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'pay' ? (
          <form onSubmit={handlePay} className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Initiate Zelle Payment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipient First Name</label>
                <input required name="firstName" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Last Name</label>
                <input required name="lastName" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" placeholder="Doe" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Zelle Alias (Email or Phone)</label>
                <input required name="alias" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" placeholder="jane@example.com or 8125551212" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($)</label>
                <input required name="amount" type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" placeholder="150.00" />
              </div>
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
                  <div className="font-medium mb-1">Payment successfully initiated</div>
                  <pre className="text-xs text-emerald-700 mt-2 p-2 bg-emerald-100 rounded-md">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button disabled={loading} type="submit" className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send Payment
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSearchAlias} className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Check Alias Enrollment</h2>
            
            <div className="mb-8 max-w-md">
              <label className="block text-sm font-medium text-slate-700 mb-2">Zelle Alias (Email or Phone)</label>
              <input required name="alias" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900" placeholder="jane@example.com" />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            
            {result && !error && (
              <div className="mb-6 p-4 bg-slate-50 text-slate-800 rounded-lg border border-slate-200 text-sm overflow-auto">
                <pre className="text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-start pt-4 border-t border-slate-100">
              <button disabled={loading} type="submit" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Check Enrollment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

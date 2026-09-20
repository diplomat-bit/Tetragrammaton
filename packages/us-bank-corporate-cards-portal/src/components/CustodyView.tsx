import { useState } from 'react';
import { fetchApi } from '../utils';
import { Search, Briefcase, FileText, AlertCircle, RefreshCw, Layers, Ban } from 'lucide-react';

export default function CustodyView() {
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchCustodyData = async (endpoint: string, payload?: any) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      let resData;
      if (endpoint === 'accounts') {
        resData = await fetchApi(`/api/custody/accounts`);
      } else {
        resData = await fetchApi(`/api/custody/accounts/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            endpoint === 'assets' 
            ? { assets: [{ assetIdentifierType: "CUSIP", assetIdentifierValue: "73240000" }] }
            : { accountId: ["a6c93fd4-bf67-b8666eea3232"] }
          )
        });
      }
      setData(resData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = (endpoint: string) => {
    setActiveTab(endpoint);
    fetchCustodyData(endpoint);
  };

  const renderData = () => {
    if (!data) return null;
    return (
      <div className="mt-6 bg-white border border-slate-200 rounded-lg shadow-sm p-4 overflow-auto max-h-[500px]">
        <pre className="text-xs text-slate-800">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Custody</h1>
        <p className="text-slate-500 mt-1">Access Accounts, Holdings, Transactions, Tax Lots, Assets, and Failed Trades.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <button onClick={() => handleFetch('accounts')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'accounts' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <Briefcase className="w-5 h-5" />
          <span className="text-sm font-medium">Accounts</span>
        </button>
        <button onClick={() => handleFetch('holdings')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'holdings' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <Layers className="w-5 h-5" />
          <span className="text-sm font-medium">Holdings</span>
        </button>
        <button onClick={() => handleFetch('transactions')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'transactions' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <RefreshCw className="w-5 h-5" />
          <span className="text-sm font-medium">Transactions</span>
        </button>
        <button onClick={() => handleFetch('taxlots')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'taxlots' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <FileText className="w-5 h-5" />
          <span className="text-sm font-medium">Tax Lots</span>
        </button>
        <button onClick={() => handleFetch('assets')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'assets' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <Search className="w-5 h-5" />
          <span className="text-sm font-medium">Assets</span>
        </button>
        <button onClick={() => handleFetch('failedtrades')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'failedtrades' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <Ban className="w-5 h-5" />
          <span className="text-sm font-medium">Failed Trades</span>
        </button>
      </div>

      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 capitalize">{activeTab ? `${activeTab} Details` : 'Viewer'}</h2>
        
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {!loading && !error && data && renderData()}
        
        {!loading && !error && !data && (
          <div className="text-center py-12 text-slate-500">
            Select an endpoint above to view custody data.
          </div>
        )}
      </div>
    </div>
  );
}

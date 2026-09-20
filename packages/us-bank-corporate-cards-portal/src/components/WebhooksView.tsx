import { useState } from 'react';
import { fetchApi } from '../utils';
import { RadioReceiver, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function WebhooksView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handlePublishEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData(e.currentTarget);

    try {
      const data = await fetchApi('/api/webhooks/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerID: formData.get('customerID'),
          customerIdType: formData.get('customerIdType'),
          transaction: formData.get('transaction')
        })
      });
      setResult(data || { success: true, message: 'Event published successfully' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Incoming Webhooks</h1>
        <p className="text-slate-500 mt-1">Publish real-time event notifications from this partner application to U.S. Bank.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl">
        <form onSubmit={handlePublishEvent} className="p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <RadioReceiver className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Publish Event</h2>
              <p className="text-sm text-slate-500">Simulate a real-time webhook notification</p>
            </div>
          </div>
          
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Customer ID</label>
              <input required defaultValue="10496712671" name="customerID" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Customer ID Type</label>
              <input required defaultValue="EXT_CHITL" name="customerIdType" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Ref</label>
              <input required defaultValue="234223342323" name="transaction" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-mono text-sm" />
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
                <div className="font-medium mb-1">Event published!</div>
                <pre className="text-xs text-emerald-700 mt-2 p-2 bg-emerald-100 rounded-md">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button disabled={loading} type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <RadioReceiver className="w-4 h-4" />
              )}
              Send Webhook Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

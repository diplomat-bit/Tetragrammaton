import { fetchApi } from '../utils';
import { useState } from 'react';
import { ShieldCheck, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function SetupAccountView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{setupID: string, status: string, accountUID?: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/api/accounts/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          creditLimit: Number(formData.get('creditLimit'))
        })
      });
      setSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-10 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-emerald-50 border-8 border-emerald-100/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Configured</h2>
          <p className="text-slate-500 mt-2 text-lg">The corporate cardholder account has been instantly provisioned.</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 text-left text-sm text-slate-600 font-mono border border-slate-200 shadow-inner">
          <div className="flex justify-between py-2 border-b border-slate-200/60">
            <span className="text-slate-400">Account UID</span>
            <span className="font-semibold text-slate-800">{success.accountUID || 'ACC-XXXXXXXX'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200/60">
            <span className="text-slate-400">Setup ID</span>
            <span>{success.setupID}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Status</span>
            <span className="text-emerald-600 font-semibold">{success.status}</span>
          </div>
        </div>
        <button onClick={() => setSuccess(null)} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-lg shadow-slate-900/20 mt-4">
          Issue Another Card
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Issue New Card</h1>
        <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">Provision a new corporate cardholder account instantly via the API.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-8 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="text-sm font-medium leading-relaxed">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 space-y-8">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">Cardholder Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">First Name</label>
              <input name="firstName" required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder:font-normal" placeholder="Jane" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Last Name</label>
              <input name="lastName" required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder:font-normal" placeholder="Doe" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Credit Limit</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input name="creditLimit" required type="number" defaultValue={5000} className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all text-sm font-medium text-slate-900" />
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">Default Controls</h3>
          <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" defaultChecked className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 checked:bg-blue-600 checked:border-blue-600 transition-colors" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 14" fill="none"><path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Enable eCommerce Purchases</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" defaultChecked className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 checked:bg-blue-600 checked:border-blue-600 transition-colors" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 14" fill="none"><path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Apply Standard Velocity Limits</span>
            </label>
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20 disabled:opacity-70 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Provision Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

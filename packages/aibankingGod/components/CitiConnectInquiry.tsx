import React, { useState } from 'react';
import { Landmark, Search, Activity, Shield, AlertCircle, CheckCircle2, RefreshCw, FileSearch, Hash } from 'lucide-react';

export default function CitiConnectInquiry() {
  const [inquiryId, setInquiryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryId) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/citi/payments/inquiry/${inquiryId}`, {
        headers: { 
          'Authorization': 'Bearer ' + (localStorage.getItem('citi_access_token') || '')
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Status inquiry failed');
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-gray-300 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="flex items-center space-x-4 border-b border-white/10 pb-6">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Search className="text-blue-500" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">CITI_STATUS_INQUIRY</h1>
            <p className="text-blue-500/60 text-sm uppercase tracking-[0.2em] font-bold">Transaction Verification Mesh</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <form onSubmit={handleInquiry} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center space-x-2">
                  <Hash size={12} />
                  <span>TRANSACTION_OR_REQUEST_ID</span>
                </label>
                <input 
                  type="text" 
                  value={inquiryId}
                  onChange={(e) => setInquiryId(e.target.value)}
                  placeholder="e.g. CITI-928374-X"
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-blue-500/50 outline-none font-mono"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || !inquiryId}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black rounded-xl transition-all flex items-center justify-center space-x-3 shadow-[0_0_30px_rgba(37,99,235,0.2)]"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <FileSearch size={20} />}
                <span className="tracking-[0.2em]">VERIFY_TRANSACTION</span>
              </button>
            </form>

            <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 space-y-4">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Inquiry Intelligence</h3>
              <p className="text-[11px] leading-relaxed text-gray-500">
                Direct lookup via Citi's Payment Services v3 API. Fetches real-time status including clearing updates, beneficiary notification receipts, and network settlement vectors.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 h-full min-h-[400px] font-mono">
              {!result && !error && !loading && (
                <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-4">
                  <Activity size={64} />
                  <p className="tracking-[0.4em] text-xs uppercase">Awaiting Identity Vector</p>
                </div>
              )}

              {loading && (
                <div className="space-y-4 text-blue-500/60 animate-pulse text-xs">
                  <p>{'>'} POLLING GLOBAL CLEARING MESH...</p>
                  <p>{'>'} RESOLVING TRANSACTION ID: {inquiryId}</p>
                  <p>{'>'} EXTRACTING SETTLEMENT STATUS...</p>
                </div>
              )}

              {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl space-y-4">
                  <div className="flex items-center space-x-3 text-red-500">
                    <AlertCircle size={24} />
                    <span className="font-bold tracking-widest">LOOKUP_ERROR</span>
                  </div>
                  <p className="text-red-400/80 text-sm">{error}</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center space-x-3 text-blue-400">
                      <CheckCircle2 size={24} />
                      <span className="font-bold tracking-widest text-lg">RECORD_FOUND</span>
                    </div>
                    <span className="text-[10px] text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase">Verified</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-black p-4 rounded border border-white/5">
                      <p className="text-gray-500 mb-1 uppercase tracking-tighter">Current Status</p>
                      <p className="text-white font-bold tracking-widest text-lg">{result.status || 'PENDING_CLEARANCE'}</p>
                    </div>
                    <div className="bg-black p-4 rounded border border-white/5">
                      <p className="text-gray-500 mb-1 uppercase tracking-tighter">Last Update</p>
                      <p className="text-white font-bold">{new Date().toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Extended Meta Discovery</p>
                    <pre className="bg-black p-6 rounded-xl border border-white/5 text-[11px] text-blue-400/80 overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

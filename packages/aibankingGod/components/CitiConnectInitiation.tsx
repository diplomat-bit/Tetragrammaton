import React, { useState, useContext } from 'react';
import { Landmark, Rocket, Shield, Activity, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function CitiConnectInitiation() {
  const context = useContext(DataContext);
  const [formData, setFormData] = useState({
    sourceAccount: '',
    targetAccount: '',
    amount: '',
    currency: 'USD',
    memo: ''
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    
    try {
      const response = await fetch('/api/citi/payments/initiation', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (localStorage.getItem('citi_access_token') || '')
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Payment initiation failed');
      
      setResult(data);
      setStatus('success');
      context?.showNotification('Citi Payment Initiated Successfully', 'info');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setResult(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-gray-300 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Rocket className="text-emerald-500" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tighter">CITI_CONNECT_INITIATION</h1>
              <p className="text-emerald-500/60 text-sm uppercase tracking-widest">Real-time Sovereign Payment Rail</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest">GATEWAY_ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Source Control Account</label>
                <select 
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-emerald-500/50 outline-none"
                  value={formData.sourceAccount}
                  onChange={e => setFormData({...formData, sourceAccount: e.target.value})}
                >
                  <option value="">Select Sovereign Account</option>
                  <option value="9901827361">CITI_TREASURY_MAIN_01</option>
                  <option value="9901827362">CITI_TREASURY_RESERVE_02</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Beneficiary Account / URI</label>
                <input 
                  type="text" 
                  placeholder="Recipient SWIFT/IBAN/Account"
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-emerald-500/50 outline-none"
                  value={formData.targetAccount}
                  onChange={e => setFormData({...formData, targetAccount: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Transaction Amount</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-emerald-500/50 outline-none"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Currency</label>
                  <select 
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-emerald-500/50 outline-none"
                    value={formData.currency}
                    onChange={e => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Transfer Memo / Reference</label>
                <textarea 
                  placeholder="Reference Code: CIT-SOV-..."
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-emerald-500/50 outline-none h-24 resize-none"
                  value={formData.memo}
                  onChange={e => setFormData({...formData, memo: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={status === 'processing'}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-black font-black rounded-xl transition-all flex items-center justify-center space-x-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] group"
            >
              {status === 'processing' ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="tracking-[0.2em]">INITIATE_TRANSFER_HANDSHAKE</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="space-y-6">
            <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 h-full min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Live_Execution_Audit</h3>
                <Activity size={16} className="text-emerald-500 animate-pulse" />
              </div>

              <div className="flex-grow space-y-4 font-mono text-[11px]">
                {status === 'idle' && (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 space-y-4">
                    <Shield size={48} />
                    <p className="tracking-widest">Awaiting Parameter Submission</p>
                  </div>
                )}

                {status === 'processing' && (
                  <div className="space-y-2 text-emerald-500/80 animate-pulse">
                    <p>{'>'} INITIATING mTLS HANDSHAKE...</p>
                    <p>{'>'} VERIFYING SOVEREIGN PERMISSIONS...</p>
                    <p>{'>'} PACKAGING RFC 7516 PAYLOAD...</p>
                    <p>{'>'} AWAITING GATEWAY RESPONSE...</p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="space-y-6 animate-in fade-in duration-700">
                    <div className="flex items-center space-x-3 text-emerald-500 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 size={24} />
                      <span className="font-bold tracking-widest text-[14px]">TRANSFER_AUTHORIZED_BY_GATEWAY</span>
                    </div>
                    <div className="bg-black/50 p-6 rounded-lg border border-white/5 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">REQUEST_ID</span>
                        <span className="text-white">{result?.requestId || 'CIT-827361-A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">GATEWAY_STATUS</span>
                        <span className="text-white font-bold tracking-widest">{result?.status || 'ACCEPTED'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">TIMESTAMP</span>
                        <span className="text-white">{new Date().toISOString()}</span>
                      </div>
                    </div>
                    <pre className="text-[10px] text-gray-600 bg-black p-4 rounded overflow-x-auto border border-white/5">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                )}

                {status === 'error' && (
                  <div className="space-y-4 animate-in zoom-in duration-300">
                    <div className="flex items-center space-x-3 text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                      <AlertCircle size={24} />
                      <span className="font-bold tracking-widest">GATEWAY_HANDSHAKE_FAILURE</span>
                    </div>
                    <div className="p-4 bg-black rounded border border-white/5 text-red-400">
                      {result}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

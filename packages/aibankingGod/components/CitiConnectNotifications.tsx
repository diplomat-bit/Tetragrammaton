import React, { useState } from 'react';
import { Landmark, Megaphone, Bell, Activity, Shield, Info, RefreshCw, Smartphone, Mail, Settings2, CheckCircle2 } from 'lucide-react';

export default function CitiConnectNotifications() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const mockAlerts = [
    { id: 1, type: 'PAYMENT_CLEARANCE', title: 'Payment Executed', message: 'Transfer CIT-9283-A has cleared SWIFT mesh.', time: '2 mins ago', severity: 'success' },
    { id: 2, type: 'SECURITY_HANDSHAKE', title: 'New Access Token', message: 'Sovereign Enclave successfully refreshed Citi credentials.', time: '1 hour ago', severity: 'info' },
    { id: 3, type: 'INCOMING_REMITTANCE', title: 'Funds Received', message: 'Incoming ACH of $25,000.00 detected on Main-01.', time: '4 hours ago', severity: 'success' },
    { id: 4, type: 'GATEWAY_ERROR', title: 'Stop Payment Failed', message: 'Stop request for CIT-8211 timed out at clearing host.', time: 'Yesterday', severity: 'warning' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-gray-300 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
              <Megaphone className="text-pink-500" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">SOVEREIGN_NOTIFICATIONS</h1>
              <p className="text-pink-500/60 text-sm uppercase tracking-[0.2em] font-bold">Push Subscription Mesh</p>
            </div>
          </div>
          <button 
            onClick={() => setLoading(true)}
            className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 px-2">Live_Event_Stream</h2>
              <div className="space-y-3">
                {mockAlerts.map(alert => (
                  <div key={alert.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-start space-x-4 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className={`p-3 rounded-xl border ${
                      alert.severity === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      alert.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      'bg-blue-500/10 border-blue-500/20 text-blue-500'
                    }`}>
                      {alert.type === 'GATEWAY_ERROR' ? <Info size={20} /> : <Bell size={20} />}
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-bold text-sm tracking-tight">{alert.title}</h4>
                        <span className="text-[10px] text-gray-600 font-mono">{alert.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{alert.message}</p>
                      <div className="pt-2">
                        <span className="text-[9px] font-mono text-gray-600 border border-white/5 px-2 py-0.5 rounded uppercase tracking-widest">{alert.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-sm">Real-time Push</h3>
                    <p className="text-[10px] text-gray-500">mTLS Secure Alerts</p>
                  </div>
                  <button 
                    onClick={() => setEnabled(!enabled)}
                    className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${enabled ? 'bg-pink-600' : 'bg-gray-800'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Delivery Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                      <div className="flex items-center space-x-3">
                        <Smartphone size={16} className="text-gray-400" />
                        <span className="text-xs">Sovereign App</span>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                      <div className="flex items-center space-x-3">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-xs">Encrypted Email</span>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all">
                    <Settings2 size={14} />
                    <span>ADVANCED_CONFIG</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-pink-500/5 rounded-2xl border border-pink-500/10">
                <div className="flex items-center space-x-2 text-pink-500 mb-2">
                  <Shield size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Push</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  All notifications are encrypted using the user's Sovereign Public Key before being dispatched via the push relay server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

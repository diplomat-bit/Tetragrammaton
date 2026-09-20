import React, { useContext } from 'react';
import { Landmark, Rocket, Activity, Megaphone, ShieldCheck, ArrowRight, Layout, Key, Unlock } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { AppView, View } from '../types';

export default function CitiTreasuryHub() {
  const context = useContext(DataContext);
  if (!context) return null;
  const { setView } = context;

  const modules = [
    { 
      id: View.FapiPipeline, 
      label: 'FAPI 2.0 Security Pipeline', 
      desc: 'Complete UK Open Banking Read/Write OIDC Security Pipeline & Hybrid Flow.',
      icon: <ShieldCheck className="text-emerald-400" size={24} />,
      status: 'Primary',
      color: 'emerald'
    },
    { 
      id: View.CitiConnectInitiation, 
      label: 'Payment Initiation', 
      desc: 'Execute real-time treasury transfers across global Citi nodes.',
      icon: <Rocket className="text-emerald-500" size={24} />,
      status: 'Ready',
      color: 'emerald'
    },
    { 
      id: View.CitiConnectInquiry, 
      label: 'Status Inquiry', 
      desc: 'Deep-mesh transaction lookup and settlement verification.',
      icon: <Activity className="text-blue-500" size={24} />,
      status: 'Active',
      color: 'blue'
    },
    { 
      id: View.CitiConnectNotifications, 
      label: 'Push Alerts', 
      desc: 'Real-time subscription mesh for clearing notifications.',
      icon: <Megaphone className="text-pink-500" size={24} />,
      status: 'Live',
      color: 'pink'
    },
    { 
      id: View.CitiDecryptionUtility, 
      label: 'Decryption Vault', 
      desc: 'RFC 7516 JWE Field-level decryption engine for PII data.',
      icon: <Unlock className="text-amber-500" size={24} />,
      status: 'Secure',
      color: 'amber'
    },
    { 
      id: View.CitiPartnerHub, 
      label: 'Citi Partner API Transactions', 
      desc: 'Configure account ID, bearer token, and refresh token to execute partner API curl queries.',
      icon: <Key className="text-cyan-400" size={24} />,
      status: 'Live',
      color: 'cyan'
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#050505] text-gray-300 p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-amber-500">
            <Landmark size={24} />
            <span className="text-xs font-black uppercase tracking-[0.4em]">Sovereign Institutional Mesh</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
            CITI_TREASURY_HUB
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl font-medium">
            The primary bridge between Sovereign assets and the Citibank global liquidity network. Unified command for initiation, verification, and cryptographic integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setView(m.id as AppView)}
              className="group relative flex flex-col items-start p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left overflow-hidden"
            >
              <div className="relative z-10 space-y-6 w-full">
                <div className="flex justify-between items-start">
                  <div className={`p-4 bg-${m.color}-500/10 rounded-2xl border border-${m.color}-500/20`}>
                    {m.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-${m.color}-500/10 text-${m.color}-500 border border-${m.color}-500/20`}>
                    {m.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{m.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                </div>
                <div className="pt-4 flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  <span>Open Module</span>
                  <ArrowRight size={14} />
                </div>
              </div>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${m.color}-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-${m.color}-500/10 transition-all`} />
            </button>
          ))}
        </div>

        <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <ShieldCheck className="text-emerald-500" size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-bold text-xl tracking-tight">Sovereign_Trust_Link</h4>
              <p className="text-sm text-gray-500">mTLS certificates and OAuth2.0 handshake verified. Connection is end-to-end encrypted.</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-gray-800 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=citi${i}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-[#050505] bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-black">
              +14
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5 text-center">
          <div className="space-y-2">
            <p className="text-3xl font-black text-white">$4.2B</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Bridge Liquidity</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-white">0.02ms</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Handshake Latency</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-white">100%</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Audit Reliability</p>
          </div>
        </div>
      </div>
    </div>
  );
}

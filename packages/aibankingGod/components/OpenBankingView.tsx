
import React from 'react';
import Card from './Card';
import { Share2, Lock, Smartphone, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

const OpenBankingView: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-mono text-blue-400 uppercase tracking-[0.3em]">Institutional Mesh Control</h2>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">Open Treaties</h1>
        </div>
        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest rounded-2xl shadow-lg transition-all flex items-center gap-2">
           <RefreshCw className="w-4 h-4" /> RE-SYNC ALL MESHES
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <Card title="Active Connections" subtitle="Authorized external financial gates">
              <div className="space-y-6 mt-4">
                 <div className="p-6 bg-gray-900 border border-gray-800 rounded-3xl hover:border-blue-500/40 transition-all group shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                             <img src="https://plaid.com/favicon.ico" className="w-8 h-8" alt="Plaid" />
                          </div>
                          <div>
                             <h4 className="text-lg font-bold text-white">Plaid Master Node</h4>
                             <p className="text-xs text-gray-500">Linked to Chase, BOA, and Amex</p>
                          </div>
                       </div>
                       <span className="text-[10px] font-black text-green-400 uppercase tracking-widest px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">Operational</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                       <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Last Sync</p>
                          <p className="text-xs font-bold text-white">4m ago</p>
                       </div>
                       <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Latency</p>
                          <p className="text-xs font-bold text-white">12ms</p>
                       </div>
                       <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Encryption</p>
                          <p className="text-xs font-bold text-white">TLS 1.3</p>
                       </div>
                       <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Auth Type</p>
                          <p className="text-xs font-bold text-white">OAuth 2.1</p>
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <button className="flex-1 py-3 border border-gray-700 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-white hover:border-blue-500 transition-all">Audit Permissions</button>
                       <button className="flex-1 py-3 border border-gray-700 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-red-400 hover:border-red-500 transition-all">Disconnect</button>
                    </div>
                 </div>
              </div>
           </Card>
        </div>

        <div className="space-y-8">
           <Card title="Security Protocol" icon={<ShieldCheck className="w-5 h-5 text-blue-400" />}>
              <div className="space-y-6 pt-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Lock className="w-4 h-4 text-gray-500" />
                       <span className="text-sm font-medium text-gray-300">Biometric Confirmation</span>
                    </div>
                    <button className="w-10 h-5 rounded-full bg-blue-600 relative">
                       <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-white"></div>
                    </button>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Smartphone className="w-4 h-4 text-gray-500" />
                       <span className="text-sm font-medium text-gray-300">Neural Signature Pass</span>
                    </div>
                    <button className="w-10 h-5 rounded-full bg-gray-700 relative">
                       <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white"></div>
                    </button>
                 </div>
              </div>
           </Card>

           <Card title="API Documentation" subtitle="For developer-level treaties">
              <div className="space-y-4 pt-4">
                 <p className="text-xs text-gray-500 leading-relaxed">Need to bridge your custom ERP or DLT node into the Sovereign Mesh? Access our secure forge portal.</p>
                 <button className="w-full py-4 border border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-cyan-500 transition-all flex items-center justify-center gap-2">
                    Developer Forge <ArrowRight className="w-3 h-3" />
                 </button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default OpenBankingView;

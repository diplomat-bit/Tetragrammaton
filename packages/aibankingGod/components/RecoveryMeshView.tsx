import React, { useState } from 'react';
import Card from './Card';
import { 
  LifeBuoy, ShieldCheck, Users, Link as LinkIcon, 
  Key, CloudOff, Info, AlertTriangle, ArrowRight 
} from 'lucide-react';

const RecoveryMeshView: React.FC = () => {
  const [nodes, setNodes] = useState([
    { id: 1, name: 'Cold Storage Ledger', type: 'Hardware', status: 'LINKED' },
    { id: 2, name: 'Trusted Guardian 01', type: 'Social', status: 'AWAITING' },
    { id: 3, name: 'Local Neural Vault', type: 'Encrypted FS', status: 'LINKED' },
  ]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="border-b border-gray-800 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <LifeBuoy className="text-orange-400 w-5 h-5" />
          <h2 className="text-xs font-mono text-orange-400 uppercase tracking-[0.4em]">Shamir Secret Sharing Protocol</h2>
        </div>
        <h1 className="text-7xl font-black text-white tracking-tighter">Recovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Mesh</span></h1>
        <p className="text-gray-400 mt-4 max-w-3xl font-light leading-relaxed">
          The solution to recovery pain. We split your master key into <span className="text-orange-400 font-bold">5 neural shards</span>. Any 3 can rebuild your identity. No centralized server ever holds a complete key.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <Card title="Active Key Shards" icon={<Key className="text-orange-400" />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                 {nodes.map(node => (
                    <div key={node.id} className="p-6 bg-gray-900 border border-gray-800 rounded-3xl relative group hover:border-orange-500/50 transition-all">
                       <div className={`w-3 h-3 rounded-full mb-4 ${node.status === 'LINKED' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-800'}`} />
                       <h4 className="text-white font-bold">{node.name}</h4>
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{node.type}</p>
                       <div className="mt-4 flex items-center justify-between">
                          <span className={`text-[9px] font-black uppercase ${node.status === 'LINKED' ? 'text-green-400' : 'text-gray-600'}`}>{node.status}</span>
                          <button className="p-2 bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={12} /></button>
                       </div>
                    </div>
                 ))}
                 <button className="border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-orange-500/30 transition-all text-gray-600 hover:text-orange-400 py-12">
                    <LinkIcon size={24} />
                    <span className="text-[10px] font-black uppercase">Add Guard Node</span>
                 </button>
              </div>
           </Card>

           <Card title="Decentralization Matrix" className="bg-orange-500/5 border-orange-500/10">
              <div className="flex items-center gap-6 p-4">
                 <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shadow-inner">
                    <CloudOff size={32} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Zero Central Exposure</h3>
                    <p className="text-sm text-gray-500">Your identity recovery depends on <span className="text-white font-mono">SOCIAL + HARDWARE</span> consensus, not an NGO database.</p>
                 </div>
              </div>
           </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <Card title="Protocol Strength" icon={<ShieldCheck className="text-green-500" />}>
              <div className="space-y-6 pt-2">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                       <span>Threshold Confidence</span>
                       <span className="text-orange-400">60% (3/5)</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-orange-500 h-full w-3/5 shadow-[0_0_10px_#f97316]"></div>
                    </div>
                 </div>
                 <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 flex items-start gap-3">
                    <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      AI is monitoring node health. Guardians are checked for "liveness" every 30 days via zero-knowledge pings.
                    </p>
                 </div>
              </div>
           </Card>

           <Card title="Critical Warning" variant="critical">
              <div className="flex gap-4 items-start">
                 <AlertTriangle className="text-red-400 shrink-0" />
                 <p className="text-xs text-red-300 leading-relaxed font-bold uppercase italic">
                   "If you lose access to more than 2 guard nodes, identity restoration is mathematically impossible. Final sovereignty rests with you."
                 </p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default RecoveryMeshView;

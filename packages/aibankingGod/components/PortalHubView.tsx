
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { SOVEREIGN_APPS } from '../constants';
import { ExternalApp, View } from '../types';
import { Search, Rocket, Box, Globe, Shield, Code, Cpu, ArrowRight, Lock, Fingerprint, Zap } from 'lucide-react';
import PortalHandshake from './PortalHandshake';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Security': <Shield className="text-emerald-400" />,
  'Banking': <Globe className="text-blue-400" />,
  'Dev': <Code className="text-cyan-400" />,
  'AI': <Cpu className="text-purple-400" />,
  'Legacy': <Rocket className="text-gray-500" />,
};

interface PortalHubViewProps {
  openTab?: (id: string, name: string) => void;
}

const PortalHubView: React.FC<PortalHubViewProps> = ({ openTab }) => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { setView, user } = context;

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [showHandshake, setShowHandshake] = useState(false);

  const filtered = useMemo(() => {
    return SOVEREIGN_APPS.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                          app.description.toLowerCase().includes(search.toLowerCase()) ||
                          app.id.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCat === 'All' || app.category === activeCat;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCat]);

  const categories = ['All', 'Banking', 'AI', 'Dev', 'Security'];

  const launchPortal = (app: ExternalApp) => {
    if (app.viewId) {
      setView(app.viewId);
    } else {
      if (openTab) {
        openTab(app.id, app.name);
      } else {
        setView(app.id);
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Box className="text-yellow-400 w-5 h-5" />
              <h2 className="text-xs font-mono text-yellow-400 uppercase tracking-[0.4em]">Integrated Neural Gateways v9.2</h2>
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter">Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">Constellation</span></h1>
          </div>
          <button 
            onClick={() => setShowHandshake(!showHandshake)}
            className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${
              showHandshake 
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-900 text-cyan-400 border-cyan-500/20 hover:border-cyan-400'
            }`}
          >
            <Fingerprint size={16} /> {showHandshake ? 'CLOSE_IDENTITY' : 'IDENTITY_HANDSHAKE'}
          </button>
        </div>
        <p className="text-gray-400 mt-4 max-w-3xl font-light leading-relaxed">
           Access the complete array of your 74 sovereign AI enclaves. All modules are embedded via high-throughput Hugging Face static enclaves.
        </p>
      </header>

      {showHandshake && (
        <div className="p-10 bg-slate-900/30 border border-cyan-500/20 rounded-[3rem] animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
            <Zap className="text-cyan-500/20 w-20 h-20" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="text-cyan-400 w-6 h-6" />
              <h3 className="text-lg font-black text-white tracking-tight uppercase">Neural Handshake Protocol</h3>
            </div>
            <PortalHandshake />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
           <input 
             value={search}
             onChange={e => setSearch(e.target.value)}
             placeholder="Search 74 neural shards (e.g. 'Webgenai', 'Identity')..."
             className="w-full bg-gray-900 border border-white/5 rounded-3xl py-4 pl-14 pr-6 text-sm text-white focus:border-yellow-500 outline-none transition-all placeholder-gray-700"
           />
        </div>
        <div className="flex gap-2 p-1.5 bg-gray-900 border border-white/5 rounded-[1.5rem] overflow-x-auto no-scrollbar">
           {categories.map(c => (
             <button
               key={c}
               onClick={() => setActiveCat(c)}
               className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 activeCat === c ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'
               }`}
             >
               {c}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filtered.map(app => (
          <div 
            key={app.id} 
            onClick={() => launchPortal(app)}
            className="group bg-gray-900/40 border border-white/5 hover:border-yellow-500/50 p-8 rounded-[2.5rem] transition-all duration-500 cursor-pointer relative overflow-hidden"
          >
             {app.isPremium && !user.app_metadata.is_pro && (
                <div className="absolute top-0 right-0 p-6">
                   <Lock className="text-indigo-400 w-5 h-5" />
                </div>
             )}
             
             {!app.isPremium || user.app_metadata.is_pro ? (
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowRight className="text-yellow-500 w-5 h-5" />
                </div>
             ) : null}

             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-950 border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                   {CATEGORY_ICONS[app.category] || <Rocket className="text-yellow-400" />}
                </div>
                <div>
                   <h4 className="text-lg font-black text-white group-hover:text-yellow-400 transition-colors leading-tight">{app.name}</h4>
                   <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{app.category}</p>
                </div>
             </div>

             <p className="text-sm text-gray-500 leading-relaxed font-light line-clamp-2 mb-6">
                {app.description}
             </p>

             <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-[10px] font-mono text-gray-700 uppercase tracking-tighter">ID: {app.id}</span>
                <div className="flex items-center gap-2 text-[10px] font-black text-yellow-500/50 group-hover:text-yellow-400 uppercase tracking-widest transition-colors">
                  {app.isPremium && !user.app_metadata.is_pro ? 'PRO_ONLY' : 'INITIALIZE'} <ArrowRight className="w-3 h-3" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortalHubView;


import React, { useState } from 'react';
import Card from './Card';
import { callGemini } from '../services/geminiService';
import { EyeOff, Globe, MapPin, Search, ExternalLink, ShieldCheck, Activity, Loader2 } from 'lucide-react';

const AquariusGhostView: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [locationQuery, setLocationQuery] = useState('');

  const auditPerimeter = async () => {
    setIsSearching(true);
    setResults(null);
    try {
      const response = await callGemini('gemini-3-flash-preview', [
        {
          parts: [{ text: "Find the latest reports on data broker linkability vulnerabilities in EU digital wallets for 2024. List specific verifier patterns we should block." }]
        }
      ], {
        tools: [{ googleSearch: {} }]
      });
      setResults(response.text || "");
      setLinks(response.data.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (e) {
      setResults("Ghost link failed. Rerouting...");
    } finally {
      setIsSearching(false);
    }
  };

  const locateSecureNodes = async () => {
    setIsSearching(true);
    try {
      const response = await callGemini('gemini-2.5-flash', [
        {
          parts: [{ text: `Where are the most secure private compute enclaves or data centers in ${locationQuery || 'Switzerland'}?` }]
        }
      ], {
        tools: [{ googleMaps: {} }]
      });
      setResults(response.text || "");
      setLinks(response.data.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (e) {
      setResults("Mapping error.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <EyeOff className="text-purple-400 w-5 h-5" />
          <h2 className="text-xs font-mono text-purple-400 uppercase tracking-[0.4em]">Legion II: The Ghost</h2>
        </div>
        <h1 className="text-7xl font-black text-white tracking-tighter">Grounding <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">Shield</span></h1>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <Card title="Audit Vectors" icon={<Search className="text-purple-400" />}>
             <div className="space-y-4 pt-4">
                <button 
                  onClick={auditPerimeter}
                  disabled={isSearching}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black tracking-widest rounded-2xl transition-all shadow-xl shadow-purple-500/10 flex items-center justify-center gap-3"
                >
                  {isSearching ? <Loader2 className="animate-spin" /> : <Globe size={18} />}
                  AUDIT GLOBAL LEAKS
                </button>
                <div className="relative">
                  <input 
                    value={locationQuery}
                    onChange={e => setLocationQuery(e.target.value)}
                    placeholder="Enter region for node lookup..."
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-500"
                  />
                  <button onClick={locateSecureNodes} className="absolute right-2 top-2 p-1 text-purple-400 hover:text-white transition-colors">
                     <MapPin size={16} />
                  </button>
                </div>
             </div>
          </Card>

          <Card title="Grounding Metadata" icon={<Activity className="text-cyan-400" />}>
             <div className="space-y-4 max-h-[300px] overflow-auto custom-scrollbar pt-2">
                {links.length > 0 ? links.map((link, i) => (
                  <a key={i} href={link.web?.uri || link.maps?.uri} target="_blank" className="block p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group">
                     <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-purple-400 uppercase">{link.web ? 'Web Source' : 'Mapping Source'}</span>
                        <ExternalLink size={10} className="text-gray-600 group-hover:text-white" />
                     </div>
                     <p className="text-xs text-gray-400 mt-1 truncate">{link.web?.title || link.maps?.title}</p>
                  </a>
                )) : <p className="text-[10px] text-gray-700 italic">No grounding citations currently loaded.</p>}
             </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8">
           <Card title="Neural Reconnaissance Feed" className="h-full min-h-[500px] bg-black/40">
              {isSearching ? (
                 <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                 </div>
              ) : results ? (
                <div className="prose prose-invert prose-purple max-w-none animate-in fade-in duration-500">
                   <p className="text-gray-300 leading-relaxed italic">"{results}"</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                  <ShieldCheck size={60} />
                  <p className="uppercase tracking-[0.4em] text-[10px] font-black">Shield Ready</p>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
};

export default AquariusGhostView;

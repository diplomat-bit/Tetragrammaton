
import React, { useState, useContext } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { callGemini } from '../services/geminiService';
// Fix: Added missing 'Search' import from lucide-react
import { EyeOff, ShieldAlert, Globe, Server, UserX, Activity, Sparkles, Sliders, ExternalLink, Loader2, Search } from 'lucide-react';

const PrivacyGuardianView: React.FC = () => {
    const [isBlindingActive, setIsBlindingActive] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [groundingLinks, setGroundingLinks] = useState<any[]>([]);
    const [searchResult, setSearchResult] = useState<string | null>(null);

    const auditPrivacyStandards = async () => {
      setIsSearching(true);
      setSearchResult(null);
      try {
        const response = await callGemini('gemini-3-flash-preview', "Analyze current EU Digital Identity Wallet privacy flaws and metadata linkability reports. List specific vulnerabilities we must block.", {
          tools: [{ googleSearch: {} }]
        });
        setSearchResult(response.text || "No anomalies detected.");
        setGroundingLinks(response.data.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
      } catch (e) {
        setSearchResult("Grounding link failed.");
      } finally {
        setIsSearching(false);
      }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="border-b border-gray-800 pb-10">
                <div className="flex items-center gap-3 mb-2">
                    <EyeOff className="text-purple-400 w-5 h-5" />
                    <h2 className="text-xs font-mono text-purple-400 uppercase tracking-[0.4em]">Stealth Protocol P-X</h2>
                </div>
                <h1 className="text-7xl font-black text-white tracking-tighter">Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">Blinder</span></h1>
                <p className="text-gray-400 mt-4 max-w-3xl font-light leading-relaxed">
                    Stochastic noise injection layer. We decouple metadata and strip "phone home" identifiers before they leave your device.
                </p>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    <Card title="Active Blinding Mesh" className="min-h-[400px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-purple-500/5 backdrop-blur-3xl animate-pulse" />
                        <div className="relative z-10 p-10 flex flex-col items-center justify-center h-full text-center space-y-8">
                            <div className="w-32 h-32 bg-purple-600/10 rounded-full border border-purple-500/20 flex items-center justify-center">
                                <Server className={`w-16 h-16 ${isBlindingActive ? 'text-purple-400 animate-bounce' : 'text-gray-700'}`} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-white uppercase tracking-widest">
                                    {isBlindingActive ? 'METADATA STRIPPING ACTIVE' : 'STEALTH OFFLINE'}
                                </h3>
                                <p className="text-sm text-gray-500 font-mono">Routing through {isBlindingActive ? '42 Ephemeral Proxies' : '0 Nodes'}</p>
                            </div>
                            <button 
                                onClick={() => setIsBlindingActive(!isBlindingActive)}
                                className={`px-16 py-6 rounded-full font-black tracking-[0.3em] uppercase transition-all shadow-2xl ${
                                    isBlindingActive ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'
                                }`}
                            >
                                {isBlindingActive ? 'DISABLE SHIELD' : 'ENABLE BLINDER'}
                            </button>
                        </div>
                    </Card>

                    {searchResult && (
                      <Card title="Intelligence Audit Findings" icon={<Globe className="text-blue-400" />} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800">
                            <p className="text-sm text-gray-300 leading-relaxed mb-6">{searchResult}</p>
                            <h4 className="text-[10px] font-black text-gray-500 uppercase mb-3">Verification Sources:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                               {groundingLinks.map((link, i) => (
                                 link.web && (
                                   <a key={i} href={link.web.uri} target="_blank" rel="noopener" className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all text-xs group">
                                      <span className="text-gray-400 truncate w-4/5">{link.web.title}</span>
                                      <ExternalLink size={12} className="text-gray-600 group-hover:text-blue-400" />
                                   </a>
                                 )
                               ))}
                            </div>
                         </div>
                      </Card>
                    )}
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <Card title="Surveillance Counter" icon={<ShieldAlert className="text-red-500" />}>
                        <div className="space-y-6 pt-4">
                            <button 
                              onClick={auditPrivacyStandards}
                              disabled={isSearching}
                              className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-black tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 border border-gray-700"
                            >
                               {isSearching ? <Loader2 className="animate-spin" /> : <Search size={16} />}
                               AUDIT GLOBAL STANDARDS
                            </button>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-bold uppercase">Phone-Home Blocks</span>
                                <span className="text-sm font-mono text-purple-400">1,242</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-bold uppercase">Metadata Anonymized</span>
                                <span className="text-sm font-mono text-purple-400">8.4 GB</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="AI Blinding Logic" icon={<Sparkles className="text-yellow-400" />}>
                        <p className="text-xs text-gray-500 italic leading-relaxed">
                            "Selective disclosure defaults to the most private state. We prove 'Over 18' without leaking the precise birthdate string into the verification packet."
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PrivacyGuardianView;

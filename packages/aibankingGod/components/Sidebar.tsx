
import React from 'react';
import { View } from '../types';
import { NAV_SECTORS, SOVEREIGN_APPS } from '../constants';
import { ShieldCheck, LogOut, Network, ChevronRight } from 'lucide-react';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    openTab: (id: string, name: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AquariusLogo: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="8" strokeDasharray="20 10"/>
        <path d="M50 20V80M20 50H80" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="10" fill="currentColor"/>
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, openTab, isOpen, setIsOpen }) => {
    
    const handleNavClick = (view: View) => {
        setActiveView(view);
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    const handleAppClick = (appId: string, name: string) => {
        openTab(appId, name);
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Overlay */}
             <div 
                className={`fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
             ></div>

            {/* Sidebar */}
            <div className={`flex flex-col w-[300px] bg-[#020617]/95 backdrop-blur-3xl border-r border-white/5 fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between h-28 px-8 shrink-0">
                    <div className="flex items-center gap-4 text-lime-400 group cursor-pointer" onClick={() => handleNavClick(View.Dashboard)}>
                       <AquariusLogo className="h-12 w-12 group-hover:rotate-180 transition-transform duration-700" />
                       <div>
                          <h1 className="font-black text-2xl text-white tracking-tighter leading-none">AQUARIUS</h1>
                          <p className="text-[10px] font-mono text-lime-500/50 uppercase tracking-[0.3em]">Singularity OS</p>
                       </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-8">
                    {NAV_SECTORS.map((sector) => (
                        <div key={sector.label} className="space-y-1">
                            <h3 className="px-4 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">
                                {sector.label}
                            </h3>
                            <div className="space-y-0.5">
                                {sector.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (SOVEREIGN_APPS.find(a => a.id === item.id)) {
                                                handleAppClick(item.id, item.label);
                                            } else {
                                                handleNavClick(item.id as View);
                                            }
                                        }}
                                        className={`w-full flex items-center px-4 py-2.5 transition-all duration-300 rounded-[1rem] group relative ${
                                            activeView === item.id 
                                                ? 'bg-lime-500/10 text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.03)]' 
                                                : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                                        }`}
                                    >
                                        <span className={`transition-all duration-300 ${activeView === item.id ? 'scale-110 text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]' : 'group-hover:text-gray-300'}`}>
                                            {item.icon}
                                        </span>
                                        <span className={`mx-3 font-black text-[10px] uppercase tracking-[0.15em] transition-all truncate ${activeView === item.id ? 'translate-x-1' : ''}`}>
                                            {item.label}
                                        </span>
                                        {activeView === item.id && (
                                            <div className="absolute left-0 w-1 h-4 bg-lime-500 rounded-full shadow-[0_0_15px_#a3e635] -translate-x-1" />
                                        )}
                                        {activeView === item.id && (
                                            <ChevronRight size={12} className="ml-auto opacity-50" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-white/5 space-y-4 shrink-0">
                    {/* Neural Coherence HUD */}
                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-lime-500/20 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono text-lime-400">
                            <span className="flex items-center gap-1.5 font-bold uppercase">
                                <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                                Neural Coherence HUD
                            </span>
                            <span className="text-lime-300 font-bold">99.4%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-lime-500 to-emerald-400 h-1.5 rounded-full w-[99.4%] animate-pulse" />
                        </div>
                        <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase">
                            <span>TEE Biometric Link: Active</span>
                            <span>Latency: 2ms</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Coherent Link</span>
                       </div>
                       <Network size={14} className="text-gray-700" />
                    </div>
                    <button className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-red-500/20 cursor-pointer">
                       <LogOut size={16} /> Terminate Session
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

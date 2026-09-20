
import React from 'react';
import Card from './Card';
import { Shield, Sparkles, Zap, Globe, Target, Terminal } from 'lucide-react';

const TheVisionView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-6">
        <div className="flex justify-center">
           <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
              <Shield className="w-10 h-10 text-white" />
           </div>
        </div>
        <h1 className="text-7xl font-black text-white tracking-tighter leading-none">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Sovereign</span> Vision
        </h1>
        <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
          Rebuilding the global financial architecture around the individual. Zero friction. Total transparency. Neural intelligence.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="space-y-10">
            <div className="space-y-4">
               <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Target className="text-cyan-400 w-6 h-6" /> The North Star
               </h3>
               <p className="text-gray-400 leading-relaxed">
                  Our mission is to eliminate the middleman in every financial interaction. By leveraging the Gemini Real-time API and high-throughput DLT nodes, we create a direct conduit between your ambition and your capital.
               </p>
            </div>
            
            <div className="space-y-4">
               <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Zap className="text-yellow-400 w-6 h-6" /> Velocity of Capital
               </h3>
               <p className="text-gray-400 leading-relaxed">
                  Wealth is not static. It is a vector. Sovereign OS ensures that your capital is always moving towards its highest utility, whether that's reforestation, venture incubation, or yield optimization.
               </p>
            </div>
         </div>

         <Card className="bg-gray-900/50 border-gray-800 p-8 space-y-8">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-[0.4em]">Strategic Commitments</h4>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <Globe className="text-indigo-400 w-5 h-5 shrink-0" />
                  <p className="text-sm text-gray-300">100% Carbon-Neutral Digital Infrastructure by 2026.</p>
               </div>
               <div className="flex gap-4">
                  <Shield className="text-green-400 w-5 h-5 shrink-0" />
                  <p className="text-sm text-gray-300">Open-Source Transparency for all AI Governance Models.</p>
               </div>
               <div className="flex gap-4">
                  <Sparkles className="text-cyan-400 w-5 h-5 shrink-0" />
                  <p className="text-sm text-gray-300">Democratized Access to Institutional-Grade Wealth Tools.</p>
               </div>
            </div>
            <div className="pt-6 border-t border-gray-800">
               <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-gray-600" />
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Signed Protocol</span>
               </div>
               <p className="text-xs font-mono text-cyan-900 leading-none">0x8812...7701 // INTEGRITY_LOCKED</p>
            </div>
         </Card>
      </div>

      <footer className="text-center pt-16 border-t border-gray-800">
         <p className="text-sm font-black text-gray-600 uppercase tracking-[0.5em]">This is the end of the legacy era.</p>
      </footer>
    </div>
  );
};

export default TheVisionView;

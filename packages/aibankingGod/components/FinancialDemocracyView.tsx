
import React from 'react';
import Card from './Card';
import { Globe, Shield, Scale, Info, Share2, EyeOff } from 'lucide-react';

const FinancialDemocracyView: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em]">Fiscal Sovereignty Node 01</h2>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">Democracy Hub</h1>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
           <Shield className="w-4 h-4 text-emerald-400" />
           <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Transparency Protocol: V-Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card title="The Financial Democracy Manifesto" icon={<Scale className="w-5 h-5 text-emerald-400" />}>
           <div className="prose prose-invert max-w-none text-gray-400 mt-4 leading-relaxed">
             <p>This OS believes in a world where financial data belongs exclusively to the user, not the institution. The Democracy Hub is where you audit our ethics and control your treaties.</p>
             <ul className="space-y-4 mt-6">
               <li className="flex gap-4">
                 <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">01</div>
                 <div>
                    <h4 className="text-white font-bold text-sm">Zero Knowledge Storage</h4>
                    <p className="text-xs">Your keys are hashed and discarded. We never see your neural signatures.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">02</div>
                 <div>
                    <h4 className="text-white font-bold text-sm">Unrestricted Portability</h4>
                    <p className="text-xs">Export your entire fiscal trajectory to any DLT node instantly.</p>
                 </div>
               </li>
             </ul>
           </div>
        </Card>

        <div className="space-y-8">
          <Card title="Active Data Treaties" icon={<Share2 className="w-5 h-5 text-blue-400" />}>
             <div className="space-y-4 mt-4">
                <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl flex justify-between items-center group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-black">P</div>
                      <div>
                        <p className="text-sm font-bold text-white">Plaid Network Link</p>
                        <p className="text-[10px] text-gray-500">Expires: Dec 2024</p>
                      </div>
                   </div>
                   <button className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Revoke
                   </button>
                </div>
                
                <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl flex justify-between items-center group opacity-50">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 font-black">S</div>
                      <div>
                        <p className="text-sm font-bold text-white">Stripe Settlement Gate</p>
                        <p className="text-[10px] text-gray-500">Inactive since 12d</p>
                      </div>
                   </div>
                   <button className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
                      Re-Auth
                   </button>
                </div>
             </div>
          </Card>

          <Card title="System Audit Insights" icon={<Info className="w-5 h-5 text-gray-400" />}>
             <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  "No anomalous data extraction identified. Your current data sharing footprint is 34% below the average for your tier, maximizing your privacy advantage."
                </p>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialDemocracyView;

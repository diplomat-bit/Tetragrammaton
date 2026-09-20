
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { 
  Database, Cpu, Activity, Shield, Terminal, 
  RefreshCw, Layers, Globe, Server, Code, 
  Workflow, FileSearch, HardDrive, Network, 
  ArrowUpRight, BarChart3, AlertCircle, CheckCircle2,
  Clock, Zap, LayoutPanelLeft
} from 'lucide-react';
import { callGemini } from '../services/geminiService';

/**
 * AQUARIUS INSTITUTIONAL HUB
 * A high-fidelity operational command center implementing the data structures
 * described in the Persisted Query Manifest.
 */

type SubSection = 'TREASURY' | 'DATA_MESH' | 'PIPELINES' | 'LEDGERS' | 'OFX_PARSER' | 'KRYPTO_BRIDGE' | 'UNIVERSE_GRAPH';

import OFXStatementViewer from './OFXStatementViewer';
import ModernTreasuryLedgerHub from './ModernTreasuryLedgerHub';
import KryptoBridgeWidget from './KryptoBridgeWidget';
import UniverseGraphVisualizer from './UniverseGraphVisualizer';

const AquariusInstitutionalHub: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;

  // properties are now available in the expanded context
  const { internalAccounts, achSettings, pipelines, inboundBlobs, fundFlows } = context;
  const [activeSub, setActiveSub] = useState<SubSection>('TREASURY');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditInsight, setAuditInsight] = useState<string | null>(null);

  const performNeuralAudit = async () => {
    setIsAuditing(true);
    setAuditInsight(null);
    try {
      const prompt = `Analyze the current Nexus Operations state: 
      - Active Internal Accounts: ${internalAccounts.length}
      - Running Neural Pipelines: ${pipelines.filter((p: any) => p.status === 'RUNNING').length}
      - Pending Data Blobs: ${inboundBlobs.filter((b: any) => b.status === 'PENDING').length}
      - Fund Flows established: ${fundFlows.length}
      Provide an executive directive (2 sentences max) to optimize throughput and security.`;

      const { text } = await callGemini('gemini-3-flash-preview', [
        { parts: [{ text: prompt }] }
      ], {
        temperature: 0.2
      });
      setAuditInsight(text || 'Audit concluded with stable vectors.');
    } catch (e) {
      setAuditInsight('Neural audit interrupted. Protocol re-sync required.');
    } finally {
      setIsAuditing(false);
    }
  };

  const NavButton = ({ id, icon: Icon, label }: { id: SubSection, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveSub(id)}
      className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
        activeSub === id 
          ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
          : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="text-cyan-400 w-5 h-5" />
            <h2 className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.6em]">Nexus Institutional Fabric // OS_V5.4</h2>
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-none">Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">Hub</span></h1>
        </div>
        <button 
          onClick={performNeuralAudit}
          disabled={isAuditing}
          className="px-12 py-5 bg-white border border-white/10 hover:bg-cyan-500 hover:text-black text-black font-black tracking-widest rounded-3xl transition-all shadow-2xl disabled:opacity-30 flex items-center gap-3"
        >
          {isAuditing ? <RefreshCw className="animate-spin w-5 h-5" /> : <Shield size={18} />}
          INITIALIZE NEURAL AUDIT
        </button>
      </header>

      {auditInsight && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-8 rounded-[3rem] animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-6">
             <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center border border-cyan-400/50 shrink-0">
                <Cpu className="text-cyan-400 w-8 h-8" />
             </div>
             <div>
                <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-1">Executive Directive</h3>
                <p className="text-xl text-white font-light leading-relaxed italic">"{auditInsight}"</p>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 p-2 bg-gray-950/80 border border-white/5 rounded-[2.5rem] w-fit">
        <NavButton id="TREASURY" icon={Server} label="Treasury" />
        <NavButton id="OFX_PARSER" icon={Code} label="Citigroup OFX ($23.55M)" />
        <NavButton id="KRYPTO_BRIDGE" icon={Zap} label="Crypto Bridge" />
        <NavButton id="UNIVERSE_GRAPH" icon={Network} label="Universe Graph" />
        <NavButton id="DATA_MESH" icon={Layers} label="Data Mesh" />
        <NavButton id="PIPELINES" icon={Workflow} label="Pipelines" />
        <NavButton id="LEDGERS" icon={Database} label="Ledgers" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
           {activeSub === 'TREASURY' && (
             <Card title="Internal Account Ledger" subtitle="Hierarchical institutional liquidity management">
                <div className="space-y-6 mt-4 overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="text-[10px] text-gray-500 font-black uppercase tracking-widest border-b border-white/5">
                            <th className="pb-4">Identification</th>
                            <th className="pb-4">Bank Hierarchy</th>
                            <th className="pb-4">Status</th>
                            <th className="pb-4 text-right">Magnitude</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {internalAccounts.map(ia => (
                           <tr key={ia.id} className="group hover:bg-white/5 transition-colors">
                              <td className="py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                       <Globe size={20} />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{ia.bestName}</p>
                                       <p className="text-[10px] text-gray-600 font-mono">{ia.id}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-6">
                                 <p className="text-xs text-gray-400">{ia.bankName}</p>
                              </td>
                              <td className="py-6">
                                 <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[9px] font-black rounded-full uppercase border border-green-500/20">{ia.operationalStatus}</span>
                              </td>
                              <td className="py-6 text-right">
                                 <p className="text-lg font-mono font-black text-white">${ia.balance.toLocaleString()}</p>
                                 <p className="text-[10px] text-gray-600 uppercase font-bold">{ia.currency}</p>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </Card>
           )}

           {activeSub === 'DATA_MESH' && (
             <Card title="Inbound Data Blobs" subtitle="Raw ingestion signal monitoring">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                   {inboundBlobs.map((blob: any) => (
                     <div key={blob.id} className="p-8 bg-gray-900 border border-white/5 rounded-[2.5rem] group hover:border-cyan-500/30 transition-all shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                              <HardDrive className="text-cyan-400" />
                           </div>
                           <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${blob.status === 'IMPORTED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                             {blob.status}
                           </span>
                        </div>
                        <h4 className="text-white font-bold mb-1 truncate" title={blob.filePath}>{blob.filePath.split('/').pop()}</h4>
                        <p className="text-[10px] text-gray-600 font-mono mb-4 uppercase">{blob.vendorName} // {blob.interfaceType}</p>
                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                           <span className="text-[10px] text-gray-500 font-mono">{blob.createdAt.split('T')[0]}</span>
                           <button className="p-2 bg-white/5 hover:bg-cyan-500 hover:text-black rounded-xl transition-all">
                              <FileSearch size={14} />
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </Card>
           )}

           {activeSub === 'PIPELINES' && (
             <Card title="Neural Pipeline Invocations" subtitle="Background asynchronous execution logs">
                <div className="space-y-4 mt-6">
                   {pipelines.map((pipe: any) => (
                     <div key={pipe.id} className="flex items-center justify-between p-6 bg-gray-900 border border-white/5 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-6">
                           <div className={`w-3 h-3 rounded-full ${pipe.status === 'SUCCESS' ? 'bg-green-500' : pipe.status === 'RUNNING' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`} />
                           <div>
                              <p className="text-sm font-bold text-white">{pipe.name}</p>
                              <p className="text-[10px] text-gray-600 font-mono uppercase">{pipe.pipelineName}</p>
                           </div>
                        </div>
                        <div className="text-right flex items-center gap-8">
                           <div className="hidden sm:block">
                              <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Duration</p>
                              <p className="text-xs font-mono text-white">{pipe.prettyDuration}</p>
                           </div>
                           <button className="px-6 py-2 bg-white/5 hover:bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Diagnostics</button>
                        </div>
                     </div>
                   ))}
                </div>
             </Card>
           )}

           {activeSub === 'OFX_PARSER' && (
             <div className="space-y-6">
               <OFXStatementViewer />
               <ModernTreasuryLedgerHub />
             </div>
           )}

           {activeSub === 'KRYPTO_BRIDGE' && (
             <div className="space-y-6">
               <KryptoBridgeWidget />
             </div>
           )}

           {activeSub === 'UNIVERSE_GRAPH' && (
             <div className="space-y-6">
               <UniverseGraphVisualizer />
             </div>
           )}

           {activeSub === 'LEDGERS' && (
             <Card title="Fund Flow Topology" subtitle="Inter-account atomic movement patterns">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                   {fundFlows.map((flow: any) => (
                     <div key={flow.id} className="p-8 bg-gray-950 border border-white/5 rounded-[3rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                           <Database size={80} />
                        </div>
                        <div className="relative z-10">
                           <h4 className="text-xl font-black text-white mb-2">{flow.name}</h4>
                           <p className="text-[10px] text-gray-500 font-mono uppercase mb-8">LEDGER_ID: {flow.ledgerId}</p>
                           <div className="grid grid-cols-2 gap-8">
                              <div>
                                 <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Posted Events</p>
                                 <p className="text-3xl font-mono text-cyan-400 font-black">{flow.postedTxCount}</p>
                              </div>
                              <div>
                                 <p className="text-[9px] text-gray-600 font-black uppercase mb-1">In-Flight Vectors</p>
                                 <p className="text-3xl font-mono text-indigo-400 font-black">{flow.pendingTxCount}</p>
                              </div>
                           </div>
                           <button className="w-full mt-8 py-4 border border-white/10 hover:border-cyan-500 text-gray-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Audit Entries</button>
                        </div>
                     </div>
                   ))}
                </div>
             </Card>
           )}
        </div>

        {/* RIGHT: REAL-TIME TELEMETRY */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <Card title="Signal Pulse" icon={<Zap className="text-yellow-400" />}>
              <div className="space-y-8 pt-4">
                 <div className="flex flex-col items-center">
                    <div className="text-6xl font-black text-white font-mono tracking-tighter">99.98%</div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">Operational Integrity</p>
                 </div>
                 <div className="space-y-4">
                    {[
                      { label: 'Latency (Avg)', val: '12.4ms', color: 'text-cyan-400' },
                      { label: 'Throughput', val: '8.2 GB/s', color: 'text-indigo-400' },
                      { label: 'Neural Drift', val: '0.002%', color: 'text-green-400' }
                    ].map((m, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                         <span className="text-[10px] font-black text-gray-500 uppercase">{m.label}</span>
                         <span className={`text-sm font-mono font-bold ${m.color}`}>{m.val}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </Card>

           <Card title="Forge Directives" icon={<Terminal className="text-lime-400" />}>
              <div className="space-y-4 pt-2">
                 <p className="text-[10px] text-gray-500 leading-relaxed font-mono uppercase">
                   [SYS_MESSAGE]: Awaiting institutional handshake for ISO20022 compliance check. ACH vectors are locked for region APAC-7.
                 </p>
                 <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Sync Hub</button>
                    <button className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20">Poll Peers</button>
                 </div>
              </div>
           </Card>

           <Card title="Neural Process Flow">
              <div className="flex flex-col gap-6 items-center py-6">
                 <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
                       <Zap className="text-cyan-400" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-cyan-500/50 to-transparent mt-2"></div>
                 </div>
                 <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                       <Workflow className="text-indigo-400" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-indigo-500/50 to-transparent mt-2"></div>
                 </div>
                 <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 className="text-green-400" />
                 </div>
                 <p className="text-[10px] text-gray-600 uppercase font-black mt-4">Protocol Pipeline: VERIFIED</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default AquariusInstitutionalHub;

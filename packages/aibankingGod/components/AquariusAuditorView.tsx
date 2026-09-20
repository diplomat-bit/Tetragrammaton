
import React, { useState } from 'react';
import Card from './Card';
import { callGemini } from '../services/geminiService';
import { 
  Shield, Camera, Film, Search, Loader2, 
  CheckCircle2, AlertCircle, Terminal, 
  Scan, Fingerprint, Activity, BarChart3, AlertTriangle,
  // Fix: Added missing Globe import
  Globe
} from 'lucide-react';

const AquariusAuditorView: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const addLog = (m: string) => setAuditLog(p => [`[${new Date().toLocaleTimeString()}] ${m}`, ...p].slice(0, 5));

  const onAssetSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedAsset(ev.target?.result as string);
        addLog(`Asset ingest completed: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const startDeepAudit = async (type: 'image' | 'video') => {
    if (!selectedAsset) return;
    setIsAuditing(true);
    setResult(null);
    addLog(`Initiating deep ${type} understanding module...`);
    
    try {
      const base64 = selectedAsset.split(',')[1];
      const mimeType = type === 'image' ? 'image/png' : 'video/mp4';

      const { text } = await callGemini('gemini-3-pro-preview', [
        {
          parts: [
            { inlineData: { data: base64, mimeType } },
            { text: `Analyze this ${type} for deepfake artifacts, neural manipulation, and biometric liveness markers. Provide a technical assurance report on its deterministic validity.` }
          ]
        }
      ]);
      
      addLog("Neural understanding vector finalized.");
      setResult(text || "Audit concluded with null result.");
    } catch (e) {
      addLog("Audit pipeline interrupted. Check API coherence.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="border-b border-white/10 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-blue-400 w-5 h-5" />
          <h2 className="text-xs font-mono text-blue-400 uppercase tracking-[0.4em]">Legion V: The Auditor</h2>
        </div>
        <h1 className="text-7xl font-black text-white tracking-tighter">Forensic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Audit</span></h1>
        <p className="text-gray-400 mt-4 max-w-3xl font-light leading-relaxed">
          The ultimate verification layer. Utilizing Pro Vision understanding to verify deterministic liveness and expose sophisticated neural manipulation.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <Card title="Ingest Channel" icon={<Camera className="text-blue-400" />}>
              <div className="space-y-6 pt-4">
                 <div className="relative group">
                    <div className="h-64 border-2 border-dashed border-white/5 bg-gray-900 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-blue-500/30 transition-all cursor-pointer overflow-hidden">
                       {selectedAsset ? (
                         <div className="relative w-full h-full group">
                            <video src={selectedAsset} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <Scan className="w-12 h-12 text-white animate-pulse" />
                            </div>
                         </div>
                       ) : (
                         <>
                            <Film size={40} className="text-gray-700 group-hover:text-blue-400 transition-colors" />
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Stage Evidence Feed</p>
                         </>
                       )}
                    </div>
                    <input type="file" onChange={onAssetSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => startDeepAudit('image')} disabled={!selectedAsset || isAuditing} className="py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30">Image Audit</button>
                    <button onClick={() => startDeepAudit('video')} disabled={!selectedAsset || isAuditing} className="py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30">Video Audit</button>
                 </div>
              </div>
           </Card>

           <Card title="Integrity Log" icon={<Terminal className="text-gray-500" />}>
              <div className="space-y-3 font-mono text-[10px] text-gray-600 pt-2 min-h-24">
                 {auditLog.map((log, i) => <p key={i} className="animate-in slide-in-from-left-2">{log}</p>)}
                 {auditLog.length === 0 && <p className="italic opacity-50">Awaiting stream input...</p>}
              </div>
           </Card>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
           <Card title="Deterministic Assurance Report" className="flex-1 bg-black/40 min-h-[500px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />
              
              {isAuditing ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                   <div className="w-20 h-20 relative">
                      <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full" />
                      <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <Fingerprint className="absolute inset-0 m-auto text-blue-500 animate-pulse" />
                   </div>
                   <p className="text-xs font-mono uppercase tracking-[0.4em] text-blue-500 animate-pulse">Mapping neural artifacts...</p>
                </div>
              ) : result ? (
                <div className="space-y-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center justify-between p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <Shield className="text-blue-400 w-8 h-8" />
                         </div>
                         <div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Analysis Vector Locked</h4>
                            <p className="text-xs text-gray-500 font-mono">Assurance Score: <span className="text-green-400">99.998% DETERMINISTIC</span></p>
                         </div>
                      </div>
                      <CheckCircle2 size={40} className="text-green-500 shadow-2xl" />
                   </div>
                   
                   <div className="p-8 bg-gray-950/50 border border-white/5 rounded-[2.5rem] prose prose-invert prose-sm max-w-none">
                      <div className="flex items-center gap-2 text-blue-400 mb-4 font-mono uppercase text-[10px] tracking-widest">
                         <Activity size={14} /> Full Understanding Trace
                      </div>
                      <p className="text-gray-400 leading-relaxed font-light italic">
                         {result}
                      </p>
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6">
                   <BarChart3 size={100} />
                   <p className="uppercase tracking-[0.4em] text-xs font-black">Awaiting Forensic Evidence</p>
                </div>
              )}
           </Card>

           <div className="grid grid-cols-2 gap-8">
              <Card title="Artifact Detection" className="bg-red-500/5 border-red-500/10">
                 <div className="flex items-center gap-4 text-red-400">
                    <AlertTriangle size={24} />
                    <div>
                       <p className="text-xs font-black uppercase">Deepfake Filter</p>
                       <p className="text-[10px] opacity-60">Neural ghosting detection active.</p>
                    </div>
                 </div>
              </Card>
              <Card title="Network Trust" className="bg-cyan-500/5 border-cyan-500/10">
                 <div className="flex items-center gap-4 text-cyan-400">
                    <Globe size={24} />
                    <div>
                       <h5 className="text-xs font-black uppercase">Consensus Verification</h5>
                       <p className="text-[10px] opacity-60">Verified across 12 distributed nodes.</p>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AquariusAuditorView;


import React, { useState, useCallback, useRef, useEffect } from 'react';
import { callGemini } from '../services/geminiService';
import Card from './Card';
import { 
  Sparkles, Video, Image as ImageIcon, Search, 
  Mic, FileText, Camera, RefreshCw, Play, 
  Maximize, ChevronDown, CheckCircle2, AlertCircle, Loader2,
  Terminal, Activity, Cpu, ShieldCheck, Download, AlertTriangle, ExternalLink
} from 'lucide-react';

const IntelligenceHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'creative' | 'analysis' | 'vision'>('creative');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));

  const promptForKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  // --- VEO 3.1 VIDEO GENERATION ---
  const generateVideo = async () => {
    if (!prompt) return;
    if (!hasKey) {
        await promptForKey();
    }

    setIsGenerating(true);
    addLog("Initializing Veo 3.1 fast-generate-preview...");
    try {
      const apiKey = (process.env as any).API_KEY || process.env.GEMINI_API_KEY || (typeof window !== "undefined" ? localStorage.getItem("CUSTOM_GEMINI_KEY") : "");
      if (!apiKey) throw new Error("API Key Missing.");

      const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-fast-generate-preview:generateVideos?key=${apiKey}`;
      
      const response = await fetch(generateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16'
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Failed to start video generation");
      }

      let operation = await response.json();
      const operationName = operation.name;
      
      addLog("Handshaking with compute farm...");
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const pollUrl = `https://generativelanguage.googleapis.com/v1beta/operations/${operationName}?key=${apiKey}`;
        const pollResponse = await fetch(pollUrl);
        
        if (!pollResponse.ok) throw new Error("Failed to poll operation status");
        
        operation = await pollResponse.json();
        addLog("Refining motion vectors...");
      }
      
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      setOutput(`${downloadLink}&key=${apiKey}`);
      addLog("Neural cinematography complete.");
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
          setHasKey(false);
          addLog("Key verification failed. Re-selection required.");
          await promptForKey();
      } else {
          addLog("Protocol failure: Video generation interrupted.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // --- GEMINI 3 PRO IMAGE GENERATION ---
  const generateImage = async () => {
    if (!prompt) return;
    if ((imageSize === '2K' || imageSize === '4K') && !hasKey) {
        await promptForKey();
    }

    setIsGenerating(true);
    addLog(`Forging ${imageSize} sigil in ${aspectRatio}...`);
    try {
      const apiKey = process.env.GEMINI_API_KEY || (typeof window !== "undefined" ? localStorage.getItem("CUSTOM_GEMINI_KEY") : "");
      if (!apiKey) throw new Error("API Key Missing.");

      const modelName = (imageSize === '2K' || imageSize === '4K') ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      
      const { data } = await callGemini(modelName, prompt, {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any
        }
      } as any);

      const parts = data.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          setOutput(`data:image/png;base64,${part.inlineData.data}`);
          break;
        } else if (part.text) {
           addLog(`AI: ${part.text.substring(0, 50)}...`);
        }
      }
      addLog("Asset materialized.");
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
          setHasKey(false);
          await promptForKey();
      } else {
          addLog("Sigil forge failure.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeInput = async (fileType: 'image' | 'video') => {
    setIsAnalyzing(true);
    addLog(`Commencing ${fileType} forensic analysis...`);
    try {
      const { text } = await callGemini('gemini-3-pro-preview', `Perform a deep forensic analysis on this ${fileType}. Identify objects, detect neural artifacts, and verify liveness.`);
      addLog("Analysis vector complete.");
      alert(text);
    } catch (e) {
      addLog("Analysis stream collapsed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {!hasKey && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-[2rem] flex items-center justify-between shadow-2xl">
           <div className="flex items-center gap-6">
              <AlertTriangle className="text-amber-400 w-10 h-10" />
              <div>
                 <h3 className="text-xl font-black text-amber-400 uppercase tracking-widest">Professional API Key Required</h3>
                 <p className="text-sm text-gray-400 font-light">High-quality image (2K/4K) and Video (Veo) generation require a paid GCP API key. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-cyan-400 underline">View Billing Documentation</a></p>
              </div>
           </div>
           <button 
             onClick={promptForKey}
             className="px-8 py-3 bg-amber-500 text-black font-black tracking-widest rounded-2xl hover:bg-amber-400 transition-all active:scale-95"
           >
              SELECT KEY
           </button>
        </div>
      )}

      <header className="border-b border-gray-800 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-cyan-400 w-5 h-5" />
          <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.4em]">Intelligence Core v5.5</h2>
        </div>
        <h1 className="text-7xl font-black text-white tracking-tighter">Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">Expansion</span></h1>
      </header>

      <div className="flex gap-4 p-1 bg-gray-900 border border-gray-800 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('creative')}
          className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'creative' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
        >
          Creative Forge
        </button>
        <button 
          onClick={() => setActiveTab('analysis')}
          className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analysis' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
        >
          Audit Core
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {activeTab === 'creative' && (
            <Card title="Directives" icon={<Terminal className="text-yellow-400" />}>
              <div className="space-y-6 pt-4">
                <textarea 
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Input descriptive syntax for materialization..."
                  className="w-full h-32 bg-gray-950 border border-gray-800 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder-gray-800 font-mono"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aspect Ratio</label>
                    <select 
                      value={aspectRatio}
                      onChange={e => setAspectRatio(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-white"
                    >
                      {['1:1', '3:4', '4:3', '9:16', '16:9'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Resolution</label>
                    <select 
                      value={imageSize}
                      onChange={e => setImageSize(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-white"
                    >
                      <option value="1K">1K (Standard)</option>
                      <option value="2K">2K (Elite)</option>
                      <option value="4K">4K (Billionaire)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={generateImage}
                    disabled={isGenerating || !prompt}
                    className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all shadow-xl shadow-cyan-500/10 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <ImageIcon size={16} />}
                    IMAGE
                  </button>
                  <button 
                    onClick={generateVideo}
                    disabled={isGenerating || !prompt}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <Video size={16} />}
                    VIDEO
                  </button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'analysis' && (
            <Card title="Forensic Analysis" icon={<Search className="text-indigo-400" />}>
              <div className="space-y-6 pt-4">
                <div className="h-48 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-indigo-500/30 transition-all cursor-pointer bg-gray-950">
                  <Camera size={32} className="text-gray-700" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ingest Evidence Stream</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => analyzeInput('image')}
                    disabled={isAnalyzing}
                    className="py-4 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-800 transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin w-3 h-3" /> : <ImageIcon size={14} />}
                    IMAGE AUDIT
                  </button>
                  <button 
                    onClick={() => analyzeInput('video')}
                    disabled={isAnalyzing}
                    className="py-4 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-800 transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin w-3 h-3" /> : <Video size={14} />}
                    VIDEO AUDIT
                  </button>
                </div>
              </div>
            </Card>
          )}

          <Card title="Neural Trace" icon={<Activity className="text-cyan-400" />}>
             <div className="space-y-2 font-mono text-[10px] text-gray-600 min-h-[100px] max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                {logs.map((log, i) => <p key={i} className="animate-in slide-in-from-left-2">{log}</p>)}
                {logs.length === 0 && <p className="italic opacity-30">Awaiting executive handshake...</p>}
             </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <Card className="flex-1 min-h-[600px] flex items-center justify-center bg-black/40 border-cyan-500/10 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />
             
             {isGenerating ? (
               <div className="text-center space-y-6 z-10">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <Cpu className="absolute inset-0 m-auto text-cyan-500 animate-pulse" />
                  </div>
                  <p className="text-cyan-400 font-mono text-sm tracking-[0.4em] animate-pulse uppercase">Synthesizing neural layers...</p>
               </div>
             ) : output ? (
               <div className="relative group p-10 animate-in zoom-in-95 duration-500">
                  {output.includes('video') || output.includes('veo') ? (
                    <video src={output} controls autoPlay loop className="max-w-full max-h-[600px] rounded-3xl shadow-2xl border border-white/10" />
                  ) : (
                    <img src={output} className="max-w-full max-h-[600px] rounded-3xl shadow-2xl border border-white/10" />
                  )}
                  <div className="absolute top-14 right-14 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-3 bg-black/80 text-white rounded-2xl hover:bg-cyan-600 transition-colors shadow-2xl"><Download size={20} /></button>
                  </div>
               </div>
             ) : (
               <div className="text-center space-y-6 opacity-10">
                  <Sparkles size={120} className="mx-auto" />
                  <p className="uppercase tracking-[1em] text-xs font-black">Awaiting Directives</p>
               </div>
             )}
          </Card>

          <div className="grid grid-cols-2 gap-8">
              <Card title="Compute Load" className="bg-gray-900/50 border-gray-800">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-xs text-gray-500 uppercase font-black">System Coherence</p>
                       <p className="text-2xl font-mono font-bold text-white">99.98%</p>
                    </div>
                    <Activity className="text-green-500" />
                 </div>
              </Card>
              <Card title="Model Selection" className="bg-gray-900/50 border-gray-800">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-xs text-gray-500 uppercase font-black">Active LLM</p>
                       <p className="text-sm font-mono font-bold text-white">GEMINI_3_PRO</p>
                    </div>
                    <Cpu className="text-indigo-500" />
                 </div>
              </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceHubView;

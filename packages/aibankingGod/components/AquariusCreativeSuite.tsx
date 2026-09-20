
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import { callGemini } from '../services/geminiService';
import { 
  Sparkles, Video, Image as ImageIcon, Wand2, 
  Maximize, FileImage, Loader2, Play,
  Zap, Upload, Eraser, Palette, Download, Camera, AlertTriangle, Cpu, Globe, ShieldCheck, Terminal
} from 'lucide-react';

const AquariusCreativeSuite: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const addLog = (m: string) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${m}`, ...p].slice(0, 5));

  const promptForKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedFile(ev.target?.result as string);
      reader.readAsDataURL(file);
      addLog(`Asset staged: ${file.name}`);
    }
  };

  // --- GEMINI 3 PRO IMAGE GENERATION ---
  const generateImage = async () => {
    if (!prompt) return;
    if ((imageSize === '2K' || imageSize === '4K') && !hasKey) {
        await promptForKey();
    }

    setIsGenerating(true);
    addLog(`Initiating ${imageSize} forge...`);
    try {
      const modelName = (imageSize === '2K' || imageSize === '4K') ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      
      const response = await callGemini(modelName, [
        {
          parts: [{ text: prompt }]
        }
      ], {
        imageConfig: { aspectRatio: aspectRatio as any, imageSize: imageSize as any }
      });

      if (response.data.candidates?.[0]?.content?.parts) {
        for (const part of response.data.candidates[0].content.parts) {
          if (part.inlineData) {
            setOutput(`data:image/png;base64,${part.inlineData.data}`);
            addLog("Forge successful. Signal clear.");
            break;
          }
        }
      }
    } catch (e: any) { 
        if (e.message?.includes("Requested entity was not found")) {
            setHasKey(false);
            await promptForKey();
        } else {
            addLog("Forge protocol failed."); 
        }
    } finally { setIsGenerating(false); }
  };

  // --- VEO 3.1 VIDEO GENERATION ---
  const generateVideo = async () => {
    if (!prompt) return;
    if (!hasKey) {
        await promptForKey();
    }

    setIsGenerating(true);
    addLog("Initializing Veo 3.1 cinematography core...");
    try {
      const res = await fetch(`/api/v1beta/models/veo-3.1-fast-generate-preview:generateVideos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          image: selectedFile ? { 
            imageBytes: selectedFile.split(',')[1], 
            mimeType: 'image/png' 
          } : undefined,
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16'
          }
        })
      });

      if (!res.ok) throw new Error(await res.text());
      let op = await res.json();

      while (!op.done) {
        await new Promise(r => setTimeout(r, 10000));
        const pollRes = await fetch(`/api/v1beta/${op.name}`);
        op = await pollRes.json();
        addLog("Refining frame buffers...");
      }
      
      setOutput(op.response?.generatedVideos?.[0]?.video?.uri);
      addLog("Synthesis finalized.");
    } catch (e: any) { 
        addLog("Synthesis stream collapsed: " + e.message); 
    } finally { setIsGenerating(false); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {!hasKey && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-[2rem] flex items-center justify-between shadow-2xl">
           <div className="flex items-center gap-6">
              <AlertTriangle className="text-amber-400 w-10 h-10" />
              <div>
                 <h3 className="text-xl font-black text-amber-400 uppercase tracking-widest">Professional API Access</h3>
                 <p className="text-sm text-gray-400 font-light">Billionaire-tier rendering (4K/Veo) requires a dedicated API key. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-cyan-400 underline">Billing Docs</a></p>
              </div>
           </div>
           <button onClick={promptForKey} className="px-8 py-3 bg-amber-500 text-black font-black tracking-widest rounded-2xl hover:bg-amber-400">SELECT KEY</button>
        </div>
      )}

      <header className="border-b border-white/10 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-pink-400 w-5 h-5" />
          <h2 className="text-xs font-mono text-pink-400 uppercase tracking-[0.4em]">Legion III: Multi-Modal Visualization</h2>
        </div>
        <h1 className="text-7xl font-black text-white tracking-tighter">Synthetic <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">Media</span></h1>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <Card title="Forge Directives" icon={<Wand2 className="text-pink-400" />}>
             <div className="space-y-6 pt-4">
                <div className="relative group">
                   <div className={`absolute inset-0 bg-pink-500/20 rounded-3xl blur transition-opacity ${selectedFile ? 'opacity-100' : 'opacity-0'}`} />
                   <div className="relative h-40 border-2 border-dashed border-white/5 rounded-3xl bg-gray-900 flex flex-col items-center justify-center gap-3 hover:border-pink-500/30 transition-all cursor-pointer overflow-hidden">
                      {selectedFile ? (
                        <img src={selectedFile} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera className="text-gray-700" />
                          <span className="text-[10px] font-black uppercase text-gray-500">Stage Base Asset</span>
                        </>
                      )}
                      <input type="file" onChange={onFileSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                   </div>
                </div>

                <textarea 
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Input descriptive syntax..."
                  className="w-full h-32 bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-pink-500 transition-all font-mono"
                />

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Ratio</label>
                      <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl p-2 text-xs text-white">
                        {['1:1', '3:4', '4:3', '9:16', '16:9'].map(r => <option key={r}>{r}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Res</label>
                      <select value={imageSize} onChange={e => setImageSize(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl p-2 text-xs text-white">
                        {['1K', '2K', '4K'].map(s => <option key={s}>{s}</option>)}
                      </select>
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex gap-2">
                      <button onClick={generateImage} disabled={isGenerating || !prompt} className="flex-1 py-4 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2">
                        {isGenerating ? <Loader2 className="animate-spin" /> : <ImageIcon size={18} />} IMAGE
                      </button>
                      <button onClick={generateVideo} disabled={isGenerating || !prompt} className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2">
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Video size={18} />} VIDEO
                      </button>
                   </div>
                </div>
             </div>
          </Card>

          <Card title="Neural Log" className="bg-black/20 border-white/5">
             <div className="space-y-2 font-mono text-[10px] text-gray-600 h-24 overflow-auto custom-scrollbar">
                {logs.map((l, i) => <p key={i}>{l}</p>)}
                {logs.length === 0 && <p className="opacity-30 italic">Awaiting creative command...</p>}
             </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
           <Card className="flex-1 min-h-[600px] flex items-center justify-center bg-black/40 border border-white/5 rounded-[4rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent"></div>
              {isGenerating ? (
                <div className="text-center space-y-6 z-10">
                   <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 border-4 border-pink-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                   </div>
                   <p className="text-pink-400 font-mono text-xs tracking-[0.4em] animate-pulse uppercase">Compiling frame buffers...</p>
                </div>
              ) : output ? (
                <div className="relative group p-10 animate-in zoom-in-95 duration-500">
                   {output.includes('video') || output.includes('veo') ? (
                     <video src={output} controls autoPlay loop className="max-w-full max-h-[600px] rounded-3xl shadow-2xl border border-white/10" />
                   ) : (
                     <img src={output} className="max-w-full max-h-[600px] rounded-3xl shadow-2xl border border-white/10" />
                   )}
                </div>
              ) : (
                <div className="opacity-10 flex flex-col items-center gap-6">
                   <FileImage size={120} />
                   <p className="uppercase tracking-[1em] text-xs font-black">Materialization Chamber Ready</p>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
};

export default AquariusCreativeSuite;


import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Video, Sparkles, Wand2, Play, Layout, Film, Cpu, Zap, Key, AlertCircle } from 'lucide-react';

const AIAdStudioView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!prompt || isGenerating) return;
    
    const apiKey = (process.env as any).API_KEY;
    if (!apiKey) {
      setError("API Key Missing.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setStatus('Initializing Sovereign Synthesis...');

    try {
      setStatus('Submitting directive to Veo-3.1-Lite...');
      
      const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-lite-generate-preview:generateVideos?key=${apiKey}`;
      
      const response = await fetch(generateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          config: {
            numberOfVideos: 1,
            resolution: '1080p',
            aspectRatio: '16:9'
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Failed to start video generation");
      }

      let operation = await response.json();
      const operationName = operation.name;

      setStatus('Veo is processing your vision (this may take a few minutes)...');
      
      // Poll for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const pollUrl = `https://generativelanguage.googleapis.com/v1beta/operations/${operationName}?key=${apiKey}`;
        const pollResponse = await fetch(pollUrl);
        
        if (!pollResponse.ok) {
          throw new Error("Failed to poll operation status");
        }
        
        operation = await pollResponse.json();
        
        // Update status based on some logic or just keep it generic
        const progress = Math.random() > 0.5 ? 'Refining neural textures...' : 'Synthesizing cinematic frames...';
        setStatus(progress);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("No video generated.");

      setStatus('Finalizing download handshake...');
      const downloadResponse = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': apiKey,
        },
      });

      if (!downloadResponse.ok) throw new Error("Failed to download video.");

      const blob = await downloadResponse.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStatus('Synthesis Complete.');
    } catch (err: any) {
      console.error("Video Generation Error:", err);
      setError(err.message || "An unexpected error occurred during synthesis.");
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-mono text-indigo-400 uppercase tracking-[0.3em]">Cinematic Synthesizer v1.0</h2>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">Ad Studio</h1>
        </div>
        <div className="flex gap-4">
          {!hasApiKey && (
            <button 
              onClick={handleOpenKeySelector}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/50 text-amber-500 rounded-xl hover:bg-amber-500/20 transition-all"
            >
              <Key className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Select API Key</span>
            </button>
          )}
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl">
             <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Compute Token Balance</p>
             <p className="text-xl font-mono text-indigo-400 font-bold">1,242 <span className="text-[10px] text-gray-600 uppercase">VEOS</span></p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <Card title="Creative Brief" icon={<Wand2 className="w-5 h-5 text-indigo-400" />}>
             <div className="space-y-6 mt-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Narrative Prompt</label>
                   <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your vision (e.g., A golden robot walking through a neon rainforest in slow motion...)"
                    className="w-full h-48 bg-gray-950 border border-gray-800 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-700"
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aspect Ratio</label>
                      <select className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-white">
                         <option>16:9 Landscape</option>
                         <option>9:16 Portrait</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Style</label>
                      <select className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-white">
                         <option>Cinematic</option>
                         <option>Animated</option>
                         <option>Cyberpunk</option>
                      </select>
                   </div>
                </div>

                {!hasApiKey ? (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 text-xs flex flex-col gap-3">
                    <div className="flex items-center gap-2 font-bold uppercase tracking-widest">
                      <AlertCircle className="w-4 h-4" />
                      API Key Required
                    </div>
                    <p>To use Veo video generation, you must select a paid Google Cloud API key with billing enabled.</p>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline font-bold">Learn about billing</a>
                    <button 
                      onClick={handleOpenKeySelector}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all"
                    >
                      SELECT KEY
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleGenerate}
                    disabled={!prompt || isGenerating}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black tracking-[0.3em] rounded-3xl transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-30 flex items-center justify-center gap-3"
                  >
                    {isGenerating ? <Zap className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    INITIALIZE SYNTHESIS
                  </button>
                )}
             </div>
          </Card>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-bold uppercase tracking-widest mb-1">Synthesis Failure</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <Card title="Ad Performance Prediction" icon={<Cpu className="w-5 h-5 text-cyan-400" />}>
             <div className="space-y-4 pt-2">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-400">Projected Engagement</span>
                   <span className="text-cyan-400 font-bold">88.4%</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-cyan-500 h-full w-[88%] shadow-[0_0_10px_#06b6d4]"></div>
                </div>
                <p className="text-[10px] text-gray-500 italic leading-relaxed">
                   *Agora AI predicts this creative will perform well with high-net-worth demographics in the APAC region.
                </p>
             </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Card title="Synthesis Monitor" className="h-full min-h-[600px] flex items-center justify-center bg-black/40 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none"></div>
             {isGenerating ? (
               <div className="text-center space-y-6 z-10">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-indigo-400 font-mono text-sm tracking-[0.3em] animate-pulse uppercase">{status}</p>
               </div>
             ) : videoUrl ? (
               <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <video 
                    src={videoUrl} 
                    controls 
                    className="max-w-full max-h-[500px] rounded-2xl shadow-2xl border border-white/10"
                    autoPlay
                    loop
                  />
                  <button 
                    onClick={() => setVideoUrl(null)}
                    className="mt-6 text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
                  >
                    Clear Synthesis
                  </button>
               </div>
             ) : (
               <div className="text-center space-y-6 opacity-30 group hover:opacity-50 transition-opacity">
                  <Film className="w-24 h-24 text-gray-600 mx-auto" />
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500">Awaiting Creative Handshake</p>
               </div>
             )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAdStudioView;

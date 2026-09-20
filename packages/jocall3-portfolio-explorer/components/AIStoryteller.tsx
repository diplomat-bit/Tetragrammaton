
import React, { useState, useRef, useEffect } from 'react';
import { SelectedContext, ChatMessage, EpicScreenplay } from '../types';
import { geminiService } from '../services/geminiService';
import { githubService } from '../services/githubService';
import MarkdownRenderer from './MarkdownRenderer';

const AIStoryteller: React.FC<any> = ({ context, onClose, onAddMessage }) => {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string>('Production Offline');
  const [swarmState, setSwarmState] = useState<'idle' | 'analyzing' | 'ready'>('idle');
  const [activeTab, setActiveTab] = useState<'chat' | 'screenplay'>('chat');
  const [script, setScript] = useState<EpicScreenplay | null>(null);
  const [lastProductionTime, setLastProductionTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [context.chatHistory]);

  useEffect(() => {
      let timer: any;
      if (countdown > 0) {
          timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      }
      return () => clearInterval(timer);
  }, [countdown]);

  const startProduction = async () => {
    const now = Date.now();
    const cooldown = 45000; // Increased cooldown to 45s for safety
    if (now - lastProductionTime < cooldown) {
      setCountdown(Math.ceil((cooldown - (now - lastProductionTime)) / 1000));
      return;
    }

    if (!context.repo) return;
    setSwarmState('analyzing');
    setActiveTab('screenplay');
    setStatus("Initiating Safe Mode Production...");
    try {
      const files = await githubService.getAllRepoFilesRecursively(context.repo.name);
      // Grab very few files to minimize initial request load
      const eligible = files.filter(f => f.download_url).sort((a,b) => b.size - a.size).slice(0, 5);
      const fileContents = await Promise.all(eligible.map(async f => ({
        path: f.path, content: await githubService.getFileContent(f.download_url!)
      })));
      
      const epicScript = await geminiService.produceEpicScreenplay(context.repo.name, fileContents, setStatus);
      setScript(epicScript);
      setSwarmState('ready');
      setLastProductionTime(Date.now());
      setStatus("Production Complete.");
    } catch (e: any) {
      console.error(e);
      setStatus(`Production Halted: Quota Exceeded. Try in 60s.`);
      setSwarmState('idle');
      setLastProductionTime(Date.now()); // Block retries immediately
    }
  };

  const handleExport = () => {
    if (!script) return;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${script.title}</title>
          <style>
            @page { margin: 1in; }
            body { font-family: Courier, monospace; font-size: 12pt; line-height: 1.2; padding: 1in; }
            .slugline { font-weight: bold; margin: 20pt 0; text-transform: uppercase; border-bottom: 1px solid #000; }
            .action { margin-bottom: 12pt; }
            .img-box { text-align: center; margin: 30pt 0; }
            img { max-width: 100%; border: 4px solid #000; }
          </style>
        </head>
        <body>
          <h1 style="text-align:center; margin-top: 3in; text-transform:uppercase;">${script.title}</h1>
          <p style="text-align:center; font-style:italic;">${script.logline}</p>
          <div style="page-break-after:always;"></div>
          ${script.scenes.map(s => `
            <div class="slugline">SCENE ${s.id}: ${s.heading}</div>
            ${s.image ? `<div class="img-box"><img src="${s.image}"></div>` : ''}
            <div class="action">${s.content.replace(/\n/g, '<br>')}</div>
            <div style="page-break-after:always;"></div>
          `).join('')}
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.replace(/\s+/g, '_')}_SCRIPT.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-white text-black overflow-hidden font-sans border-l-[10px] border-black">
      <div className="p-8 border-b-[6px] border-black flex items-center justify-between bg-white sticky top-0 z-50">
        <div className="flex-1 min-w-0 pr-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter truncate">The Studio</h2>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">{status}</p>
        </div>
        <div className="flex gap-2 shrink-0">
            <button onClick={() => setActiveTab('chat')} className={`px-5 py-2 text-[10px] font-black uppercase border-4 transition-all ${activeTab === 'chat' ? 'bg-black text-white border-black' : 'border-neutral-100 text-neutral-300'}`}>Director</button>
            <button onClick={() => setActiveTab('screenplay')} className={`px-5 py-2 text-[10px] font-black uppercase border-4 transition-all ${activeTab === 'screenplay' ? 'bg-black text-white border-black' : 'border-neutral-100 text-neutral-300'}`}>Script</button>
            <button onClick={onClose} className="p-2 text-neutral-300 hover:text-black transition-colors"><i className="fas fa-times"></i></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50 scroll-smooth">
        {activeTab === 'chat' ? (
          <div className="p-10 space-y-8">
            {context.chatHistory.map((msg: any, i: number) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-2xl ${msg.role === 'user' ? 'bg-black text-white shadow-xl' : 'bg-white border-4 border-black shadow-lg'}`}>
                        <MarkdownRenderer content={msg.text} />
                    </div>
                </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        ) : (
          <div className="bg-white min-h-full">
            {swarmState === 'analyzing' ? (
              <div className="h-[70vh] flex flex-col items-center justify-center p-16 text-center space-y-10">
                <div className="w-48 h-1 bg-neutral-100 overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-black animate-[slide_2s_infinite]"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-tight animate-pulse">{status}</h3>
                  <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-neutral-300">Resilient Processing Mode Active</p>
                </div>
              </div>
            ) : script ? (
              <div className="p-0">
                <div className="bg-black text-white py-40 px-12 text-center border-b-[15px] border-white">
                    <h1 className="text-[10vw] font-black uppercase italic tracking-tighter leading-none">{script.title}</h1>
                    <p className="text-2xl font-serif italic text-neutral-400 mt-8 max-w-2xl mx-auto">{script.logline}</p>
                </div>
                <div className="max-w-4xl mx-auto py-20 px-8 space-y-32 pb-40">
                    <div className="text-2xl font-serif italic border-l-8 border-black pl-8 py-4 bg-neutral-50 shadow-sm">{script.worldBuilding}</div>
                    {script.scenes.map((s) => (
                        <div key={s.id} className="space-y-12">
                            {s.image && <div className="border-8 border-black shadow-2xl overflow-hidden bg-black transition-transform hover:scale-[1.01] duration-500"><img src={s.image} className="w-full grayscale hover:grayscale-0 transition-all duration-700" alt="" /></div>}
                            <div className="space-y-6">
                                <h2 className="text-5xl font-black uppercase italic tracking-tighter border-b-4 border-black pb-2">{s.id}. {s.heading}</h2>
                                <div className="font-mono text-lg leading-relaxed bg-neutral-50 p-10 border-2 border-neutral-100 shadow-inner">
                                    <MarkdownRenderer content={s.content} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="text-center opacity-10 py-20 font-black uppercase tracking-[2em]">The End</div>
                </div>
              </div>
            ) : (
              <div className="h-[70vh] flex flex-col items-center justify-center space-y-10">
                <div className="space-y-4 text-center">
                    <h3 className="text-8xl font-black uppercase italic tracking-tighter opacity-5">Silent Set</h3>
                    <p className="text-neutral-300 font-serif italic">{countdown > 0 ? `System Recovery: ${countdown}s` : 'Ready for 5-Act Production'}</p>
                </div>
                <button 
                    onClick={startProduction} 
                    disabled={countdown > 0}
                    className={`px-12 py-6 font-black uppercase tracking-widest text-xs transition-all shadow-2xl ${countdown > 0 ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed' : 'bg-black text-white hover:scale-105 active:scale-95'}`}
                >
                    {countdown > 0 ? `Wait ${countdown}s` : 'Call Action'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t-[6px] border-black">
        {activeTab === 'chat' ? (
          <form onSubmit={async (e) => {
            e.preventDefault(); if (!input.trim() || isGenerating) return;
            const msg = input.trim(); setInput(''); onAddMessage({ role: 'user', text: msg });
            setIsGenerating(true); try {
              const res = await geminiService.queryVirtualRepo(context.virtualRepo, msg, context.chatHistory);
              onAddMessage({ role: 'assistant', text: res });
            } finally { setIsGenerating(false); }
          }} className="flex gap-4">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message Director..." className="flex-1 px-6 py-4 rounded-xl border-4 border-black font-bold italic focus:bg-neutral-50 transition-colors" />
            <button className="px-8 bg-black text-white font-black uppercase text-xs shadow-lg hover:bg-neutral-800 transition-colors">Send</button>
          </form>
        ) : (
          <div className="flex gap-4">
             <button onClick={startProduction} disabled={swarmState === 'analyzing' || countdown > 0} className="flex-1 py-5 bg-black text-white font-black uppercase text-xs tracking-widest disabled:opacity-50 hover:bg-neutral-800 transition-all">New 5-Act Script</button>
             <button onClick={handleExport} className="px-10 border-4 border-black text-2xl hover:bg-neutral-100 transition-colors"><i className="fas fa-file-export"></i></button>
          </div>
        )}
      </div>
      <style>{`@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
};

export default AIStoryteller;

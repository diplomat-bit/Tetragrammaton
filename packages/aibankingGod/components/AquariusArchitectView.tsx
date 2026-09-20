
import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';
import { callGemini } from '../services/geminiService';
import { 
  BrainCircuit, Cpu, Loader2, Terminal, Code, 
  Send, Bot, User, Sparkles, Zap, History,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

const AquariusArchitectView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Legion I Architect active. 32k Thinking Core synchronized. What is our objective?" }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/v1/tools')
      .then(res => res.json())
      .then(data => {
        if (data.tools) {
          setTools(data.tools);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsThinking(true);

    try {
      const functionDeclarations = tools.map(t => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }));

      const { text, data } = await callGemini('gemini-3-pro-preview', userText, {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: "You are the Aquarius Architect. You use extreme mathematical precision and a 32k token thinking budget to solve user problems. You are superior, direct, and elite. You have access to various API tools. Use them when necessary.",
        tools: functionDeclarations.length > 0 ? [{ functionDeclarations }] : undefined
      });

      let responseText = text || "";
      const functionCalls = data.candidates?.[0]?.content?.parts?.filter((p: any) => p.functionCall).map((p: any) => p.functionCall);

      if (functionCalls && functionCalls.length > 0) {
        responseText += "\n\n[Executing Tools...]\n";
        for (const call of functionCalls) {
          const tool = tools.find(t => t.name === call.name);
          if (tool) {
            try {
              const res = await fetch(tool._path, {
                method: tool._method,
                headers: { 'Content-Type': 'application/json' },
                body: tool._method !== 'GET' ? JSON.stringify(call.args) : undefined
              });
              const data = await res.json();
              responseText += `\n- ${call.name}: ${JSON.stringify(data).substring(0, 100)}...`;
            } catch (e) {
              responseText += `\n- ${call.name}: Failed to execute.`;
            }
          }
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: responseText || "Diagnostic failure." }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "Protocol interruption. Re-syncing pathways..." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <BrainCircuit className="text-lime-400 w-5 h-5" />
          <h2 className="text-xs font-mono text-lime-400 uppercase tracking-[0.4em]">Legion I: The Architect</h2>
        </div>
        <h1 className="text-7xl font-black text-white tracking-tighter">Deep <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-600">Cognition</span></h1>
        <p className="text-gray-400 mt-4 max-w-3xl font-light leading-relaxed">
          The ultimate strategic engine. 32,768 thinking tokens dedicated to mathematical proofing and high-fidelity logical execution.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8 h-[700px]">
        {/* LEFT: TELEMETRY */}
        <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col">
           <Card title="Thinking Telemetry" icon={<Cpu className="text-cyan-400" />}>
              <div className="space-y-6 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Neural Budget</span>
                  <span className="text-sm font-mono text-lime-400">32,768 TOKENS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Model Index</span>
                  <span className="text-sm font-mono text-cyan-400">GEMINI_3_PRO</span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                   <div className={`bg-lime-500 h-full transition-all duration-1000 ${isThinking ? 'w-full' : 'w-1/3'}`}></div>
                </div>
              </div>
           </Card>

           <Card title="Directives" icon={<Terminal className="text-lime-400" />} className="flex-1 overflow-hidden">
              <div className="space-y-4 font-mono text-[10px] text-gray-600">
                 <p className="flex gap-2"><CheckCircle2 size={12} className="text-lime-500" /> ARCHITECTURAL_AUDIT_READY</p>
                 <p className="flex gap-2"><CheckCircle2 size={12} className="text-lime-500" /> SYMBOLIC_REASONING_ACTIVE</p>
                 <p className="flex gap-2 text-gray-800"><Zap size={12} /> WAITING_FOR_INPUT</p>
              </div>
           </Card>
        </div>

        {/* RIGHT: NEURAL CHAT */}
        <div className="col-span-12 lg:col-span-8 flex flex-col">
           <Card className="flex-1 flex flex-col bg-black/40 border-white/5 p-0 overflow-hidden">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 {messages.map((m, i) => (
                   <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-4 duration-300`}>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${m.role === 'model' ? 'bg-lime-500/10 border-lime-500/20 text-lime-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                         {m.role === 'model' ? <Bot size={20} /> : <User size={20} />}
                      </div>
                      <div className={`max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed ${m.role === 'model' ? 'bg-gray-900 border border-gray-800 text-gray-200' : 'bg-lime-600 text-black font-bold'}`}>
                         {m.text}
                      </div>
                   </div>
                 ))}
                 {isThinking && (
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400 animate-pulse">
                          <BrainCircuit size={20} />
                       </div>
                       <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl flex items-center gap-3">
                          <Loader2 className="animate-spin text-lime-400" />
                          <span className="text-xs font-mono uppercase tracking-widest text-lime-500/50">Legion I is thinking (32k Budget)...</span>
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-6 bg-black/60 border-t border-white/5 backdrop-blur-2xl">
                 <div className="relative">
                    <input 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSend()}
                      placeholder="Input strategic command..."
                      className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-lime-500 transition-all font-mono"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isThinking || !input.trim()}
                      className="absolute right-2 top-2 p-2.5 bg-lime-500 hover:bg-lime-400 text-black rounded-xl transition-all shadow-xl shadow-lime-500/20 active:scale-95 disabled:opacity-30"
                    >
                      <Send size={18} />
                    </button>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default AquariusArchitectView;

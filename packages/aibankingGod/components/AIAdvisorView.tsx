
import React, { useState, useRef, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { brain } from '../services/SovereignIntelligence';
import Card from './Card';
import { FaRobot, FaUser, FaPaperPlane, FaMagic, FaShieldAlt, FaChartLine } from 'react-icons/fa';

interface Message {
  role: 'user' | 'model';
  text: string;
  confidence?: number;
}

const AIAdvisorView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { user, transactions, sessionId } = context;

    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: `Greetings, Grand Architect ${user.name}. I am Quantum. My neural arrays are calibrated to your signature. How shall we proceed with the day's expansion?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const response = await brain.consult(userMsg, { transactions, user }, sessionId);
            setMessages(prev => [...prev, { 
              role: 'model', 
              text: response.text || "Neural link interrupted.", 
              confidence: response.confidence 
            }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', text: "Connection to Sovereign Core interrupted. James, please verify the neural link." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                        <FaMagic className="text-cyan-400 animate-pulse" /> Neural Wealth Sanctum
                    </h2>
                    <p className="text-gray-500 font-medium">Direct communion with the Sovereign Intelligence Core</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-950 border border-cyan-500/20 rounded-full">
                   <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                   <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Architect_Sync: Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
               <div className="hidden lg:flex flex-col gap-6">
                  <Card title="Neural State" className="bg-gray-900/40">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Coherence</span>
                           <span className="text-sm font-mono text-cyan-400">99.98%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                           <div className="bg-cyan-500 h-full w-[99%]"></div>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Processing</span>
                           <span className="text-sm font-mono text-indigo-400">TPU_v5_Mesh</span>
                        </div>
                     </div>
                  </Card>
               </div>

               <Card className="lg:col-span-3 flex flex-col overflow-hidden bg-gray-950/40 border-gray-800 shadow-2xl backdrop-blur-xl">
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                      {messages.map((m, i) => (
                          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}>
                              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'model' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'}`}>
                                      {m.role === 'model' ? <FaRobot className="text-xl" /> : <FaUser className="text-xl" />}
                                  </div>
                                  <div className="space-y-1">
                                      <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-xl ${m.role === 'model' ? 'bg-gray-900 text-gray-200 border border-gray-800 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                                          {m.text}
                                      </div>
                                      {m.confidence && (
                                        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest text-right px-2">
                                          Inference Confidence: {(m.confidence * 100).toFixed(2)}%
                                        </p>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))}
                      {loading && (
                          <div className="flex justify-start">
                              <div className="bg-gray-900/50 p-5 rounded-3xl rounded-tl-none flex gap-2 border border-gray-800 shadow-xl">
                                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="p-6 bg-black/40 border-t border-gray-800/50 backdrop-blur-2xl">
                      <div className="relative flex items-center gap-4">
                          <input 
                              value={input}
                              onChange={e => setInput(e.target.value)}
                              onKeyPress={e => e.key === 'Enter' && handleSend()}
                              placeholder="Communicate your directive, Architect..."
                              className="flex-1 bg-gray-900 border-2 border-gray-800 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder-gray-600"
                              disabled={loading}
                          />
                          <button 
                              onClick={handleSend}
                              disabled={loading || !input.trim()}
                              className="absolute right-2 p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-xl shadow-cyan-500/20 active:scale-95 disabled:opacity-30"
                          >
                              <FaPaperPlane />
                          </button>
                      </div>
                  </div>
               </Card>
            </div>
        </div>
    );
};

export default AIAdvisorView;

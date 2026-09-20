import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  RefreshCw, 
  ChevronRight, 
  User, 
  Hash, 
  Lock,
  ArrowLeft,
  Activity,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { auth, signInWithGooglePopup } from '../firebase';
import axios from 'axios';

interface Space {
  name: string;
  displayName: string;
  type: string;
}

interface Message {
  name: string;
  text: string;
  sender: {
    displayName: string;
    avatarUrl?: string;
  };
  createTime: string;
}

export default function SovereignChat() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { accessToken: token } = await signInWithGooglePopup();
      if (token) {
        setAccessToken(token);
        fetchSpaces(token);
      } else {
        throw new Error("No access token received");
      }
    } catch (err: any) {
      setError("Authorization failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpaces = async (token: string) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/google-chat/spaces', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSpaces(response.data.spaces || []);
    } catch (err: any) {
      setError("Failed to fetch spaces: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (spaceName: string) => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const spaceId = spaceName.split('/')[1];
      const response = await axios.get(`/api/google-chat/spaces/${spaceId}/messages`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setMessages(response.data.messages || []);
    } catch (err: any) {
      setError("Failed to fetch messages: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedSpace || !accessToken) return;
    const textToSend = inputText;
    setInputText('');
    
    try {
      const spaceId = selectedSpace.name.split('/')[1];
      await axios.post(`/api/google-chat/spaces/${spaceId}/messages`, {
        text: textToSend
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      fetchMessages(selectedSpace.name);
    } catch (err: any) {
      setError("Failed to send message: " + err.message);
    }
  };

  const selectSpace = (space: Space) => {
    setSelectedSpace(space);
    fetchMessages(space.name);
  };

  if (!accessToken) {
    return (
      <div className="p-12 max-w-2xl mx-auto bg-slate-950 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col items-center text-center gap-8">
        <div className="p-6 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
          <MessageSquare size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Sovereign Comms Gateway</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Secure, high-fidelity integration with Google Chat. 
            Authorize your node to access the diplomatic war room.
          </p>
        </div>
        <button 
          onClick={handleLogin}
          disabled={loading}
          className="px-10 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
          Initialize Secure Link
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[700px] bg-slate-950 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden flex font-sans">
      {/* Sidebar: Spaces */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Active Spaces</h3>
          </div>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest">Authorized Channels</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {spaces.map((space) => (
            <button
              key={space.name}
              onClick={() => selectSpace(space)}
              className={`
                w-full p-4 rounded-2xl flex items-center gap-4 transition-all
                ${selectedSpace?.name === space.name 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-white' 
                  : 'text-slate-400 hover:bg-white/5 border border-transparent'}
              `}
            >
              <div className={`p-2 rounded-xl ${selectedSpace?.name === space.name ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-500'}`}>
                {space.type === 'SPACE' ? <Hash size={16} /> : <Lock size={16} />}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest truncate">{space.displayName || "Untitled Space"}</p>
                <p className="text-[8px] opacity-50 uppercase tracking-tighter">{space.type}</p>
              </div>
              {selectedSpace?.name === space.name && <ChevronRight size={14} className="ml-auto text-emerald-500" />}
            </button>
          ))}
          {spaces.length === 0 && !loading && (
            <div className="p-8 text-center space-y-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-loose">
                No active spaces detected in this sector.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/5 bg-black/40">
          <button 
            onClick={() => accessToken && fetchSpaces(accessToken)}
            className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black text-slate-400 uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh Gateway
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900/10">
        {selectedSpace ? (
          <>
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
                  <Terminal size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">{selectedSpace.displayName}</h4>
                  <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-[0.3em]">SECURE_CHANNEL_ESTABLISHED</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Telemetry</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.name || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                      {msg.sender?.avatarUrl ? (
                        <img src={msg.sender.avatarUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{msg.sender?.displayName}</span>
                        <span className="text-[8px] text-slate-500 font-mono">
                          {new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl rounded-tl-none border border-white/5 text-[11px] text-slate-300 leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="p-8 bg-black/40 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Inject signal to diplomatic channel..."
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                />
                <button 
                  onClick={sendMessage}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-6">
            <div className="p-6 bg-slate-900 rounded-full border border-white/5 text-slate-600 animate-pulse">
              <MessageSquare size={48} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-400 uppercase tracking-tight">Channel Selection Required</h4>
              <p className="text-[9px] text-slate-600 uppercase tracking-[0.2em]">Select a diplomatic space from the gateway to begin comms.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

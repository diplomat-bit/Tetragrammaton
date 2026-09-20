
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Headphones, Volume2, Shield, Zap, Activity, MessageSquare, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * ARIA COMMS v2.0
 * Integration of the Intimacy/Command dual-channel worklet.
 * Separates high-fidelity emotional resonance from deterministic logic commands.
 */

const AriaComms: React.FC = () => {
    const [channel, setChannel] = useState<'INTIMACY' | 'COMMAND'>('COMMAND');
    const [isListening, setIsListening] = useState(false);
    const [amplitude, setAmplitude] = useState(0);
    const [messages, setMessages] = useState<{role: 'USER' | 'ARIA', text: string, channel: string}[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isListening) {
            interval = setInterval(() => {
                setAmplitude(Math.random() * 100);
            }, 100);
        } else {
            setAmplitude(0);
        }
        return () => clearInterval(interval);
    }, [isListening]);

    const toggleListening = () => {
        if (!isListening) {
            setIsListening(true);
            // Simulate start of session
        } else {
            setIsListening(false);
            // Simulate processing
            const response = channel === 'INTIMACY' 
                ? "I feel your current biometric stress. The Sovereign OS is recalibrating for your comfort."
                : "Wire transaction to Citi primary vault signed and queued for atomic settlement.";
            setMessages(prev => [{role: 'ARIA', text: response, channel}, ...prev]);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border transition-all duration-500 ${
                        channel === 'INTIMACY' ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                    }`}>
                        {channel === 'INTIMACY' ? <Heart className="animate-pulse" /> : <Shield />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Aria Dual-Channel Comms</h3>
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Neural Worklet Protocol v2.0</p>
                    </div>
                </div>

                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    <button 
                        onClick={() => setChannel('COMMAND')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${channel === 'COMMAND' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500'}`}
                    >
                        COMMAND
                    </button>
                    <button 
                        onClick={() => setChannel('INTIMACY')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${channel === 'INTIMACY' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-gray-500'}`}
                    >
                        INTIMACY
                    </button>
                </div>
            </header>

            <div className="flex-1 bg-black/20 border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]" />
                
                <div className="relative">
                    <AnimatePresence>
                        {isListening && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 -m-8 rounded-full border border-white/10"
                            >
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-full h-full rounded-full bg-white/5"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button 
                        onClick={toggleListening}
                        className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isListening 
                                ? (channel === 'INTIMACY' ? 'bg-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.4)]' : 'bg-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.4)]')
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        {isListening ? <Activity className="text-white w-12 h-12" /> : <Mic className="text-gray-400 w-12 h-12" />}
                    </button>
                </div>

                <div className="flex gap-1 h-12 items-center">
                    {[...Array(20)].map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={{ height: isListening ? Math.max(4, Math.random() * 40) : 4 }}
                            className={`w-1 rounded-full ${channel === 'INTIMACY' ? 'bg-pink-500/50' : 'bg-cyan-500/50'}`}
                        />
                    ))}
                </div>

                <div className="w-full max-w-md space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                    {messages.map((m, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-2xl border ${
                                m.channel === 'INTIMACY' ? 'bg-pink-500/5 border-pink-500/20 text-pink-100' : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-100'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <MessageSquare size={10} className="opacity-50" />
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-50">ARIA // {m.channel}</span>
                            </div>
                            <p className="text-xs leading-relaxed">{m.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <footer className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                        <Headphones size={20} />
                    </div>
                    <div>
                        <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Audio Stream</p>
                        <p className="text-xs font-bold text-white">mTLS Encrypted</p>
                    </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                        <Volume2 size={20} />
                    </div>
                    <div>
                        <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Voice Synthesis</p>
                        <p className="text-xs font-bold text-white">99% Coherence</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AriaComms;

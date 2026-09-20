import React, { useState, useCallback, useRef, useContext } from 'react';
import { View } from '../types';
import { brain } from '../services/SovereignIntelligence';
import { Mic, Zap, Loader2, Sparkles, X } from 'lucide-react';
import { DataContext } from '../context/DataContext';

interface VoiceControlProps {
    setActiveView: (view: View) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const sessionId = context?.sessionId;
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState('');
    const recognitionRef = useRef<any>(null);

    const processTranscript = async (text: string) => {
        if (!text.trim()) return;
        
        setIsProcessing(true);
        setFeedback("Parsing Directive...");
        
        try {
            const result = await brain.interpretVoiceCommand(text, sessionId);
            setFeedback(result.message);
            
            if (result.view) {
                // Flash the feedback then execute
                setTimeout(() => {
                    setActiveView(result.view as View);
                    setFeedback("");
                }, 800);
            } else {
                setTimeout(() => setFeedback(""), 3000);
            }
        } catch (e) {
            setFeedback("Command failed.");
            setTimeout(() => setFeedback(""), 2000);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleListening = useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setFeedback("Engine Unsupported");
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setFeedback("Listening...");
        };

        recognition.onresult = (event: any) => {
            const result = event.results[0][0];
            if (result.confidence < 0.4) {
                setFeedback("Signal Unclear");
                return;
            }
            processTranscript(result.transcript);
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech') return;
            setFeedback("Vocal signal lost.");
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);
        recognition.start();
    }, [isListening]);

    return (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
            {feedback && (
                <div className="bg-black/90 border border-cyan-500/40 px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3">
                    {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    ) : (
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-[10px] font-mono font-bold text-cyan-50 tracking-[0.15em] uppercase">
                        {feedback}
                    </span>
                    {!isProcessing && (
                        <button onClick={() => setFeedback("")} className="ml-2 text-gray-500 hover:text-white transition-colors">
                            <X size={14}/>
                        </button>
                    )}
                </div>
            )}
            
            <button 
                onClick={toggleListening}
                disabled={isProcessing}
                className={`relative group p-6 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 disabled:opacity-50 ${
                    isListening 
                        ? 'bg-red-600 shadow-red-500/40 ring-4 ring-red-500/20' 
                        : 'bg-cyan-600 shadow-cyan-500/40 hover:bg-cyan-500'
                }`}
            >
                {/* Orbital Rings */}
                <div className={`absolute inset-0 rounded-full border-2 border-white/10 ${isListening ? 'animate-ping' : ''}`} />
                <div className={`absolute inset-[-8px] rounded-full border border-white/5 transition-opacity ${isListening ? 'opacity-100 animate-spin-slow' : 'opacity-0'}`} />
                
                <div className="relative z-10 text-white">
                    {isListening ? <Zap className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
                </div>

                {/* Status Tooltip */}
                <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-black/80 border border-white/10 text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none backdrop-blur-md">
                    Sovereign Command Ready
                </div>
            </button>

            <style>{`
                .animate-spin-slow { animation: spin 6s infinite linear; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default VoiceControl;
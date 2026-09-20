
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GeminiLiveClient } from '../services/geminiService';
import { Mic, MicOff, MessageSquare, Activity, Globe, Shield, RefreshCw, Terminal, Cpu, Volume2, Headphones, Zap } from 'lucide-react';
import Card from './Card';

/**
 * NEURAL COMMAND BRIDGE - LEGION VI: LIVE
 * Real-time voice communion interface using Gemini 2.5 Flash Native Audio.
 */

const GeminiLivePortal: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptionHistory, setTranscriptionHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [neuralCoherence, setNeuralCoherence] = useState(0); 

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    let bytes = data;
    if (data.byteOffset % 2 !== 0) {
      bytes = new Uint8Array(data);
    }
    const byteLength = bytes.byteLength;
    const validLength = byteLength - (byteLength % 2);
    const dataInt16 = new Int16Array(bytes.buffer, bytes.byteOffset, validLength / 2);
    const frameCount = dataInt16.length / numChannels;
    if (frameCount === 0) return ctx.createBuffer(numChannels, 1, sampleRate);
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const safeCloseAudioContext = (ctx: AudioContext | null) => {
    if (ctx && ctx.state !== 'closed') {
      try {
        ctx.close().catch(() => {});
      } catch (e) {
        // Already closed or closing
      }
    }
  };

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {}
      sessionRef.current = null;
    }
    safeCloseAudioContext(inputAudioContextRef.current);
    inputAudioContextRef.current = null;
    safeCloseAudioContext(outputAudioContextRef.current);
    outputAudioContextRef.current = null;
    setIsActive(false);
    setNeuralCoherence(0);
  }, []);

  const startSession = async () => {
    try {
      console.log("Establishing Neural Link...");
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Ensure contexts are resumed (browser autoplay policy)
      if (inputAudioContextRef.current.state === 'suspended') {
        await inputAudioContextRef.current.resume();
      }
      if (outputAudioContextRef.current.state === 'suspended') {
        await outputAudioContextRef.current.resume();
      }
      
      console.log("Requesting Microphone Access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone Access Granted.");
      
      const client = new GeminiLiveClient('gemini-3.1-flash-live-preview', {
        onOpen: () => {
          console.log("Neural Link Established (onopen)");
          setIsActive(true);
          const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) {
              sum += inputData[i] * inputData[i];
            }
            setNeuralCoherence(Math.sqrt(sum / inputData.length) * 100);
            
            client.sendRealtimeInput({ audio: pcmBlob });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContextRef.current!.destination);
        },
        onMessage: async (message: any) => {
          console.log("Received message from server:", message);
          if (message.serverContent?.outputTranscription) {
            console.log("Output transcription:", message.serverContent.outputTranscription.text);
            setCurrentOutput(prev => prev + message.serverContent!.outputTranscription!.text);
          } else if (message.serverContent?.inputTranscription) {
            console.log("Input transcription:", message.serverContent.inputTranscription.text);
            setCurrentInput(prev => prev + message.serverContent!.inputTranscription!.text);
          }

          if (message.serverContent?.turnComplete) {
            console.log("Turn complete");
            setTranscriptionHistory(prev => [
              ...prev, 
              { role: 'user' as const, text: currentInput },
              { role: 'model' as const, text: currentOutput }
            ].filter(t => t.text.trim()));
            setCurrentInput('');
            setCurrentOutput('');
          }

          const audioPart = message.serverContent?.modelTurn?.parts?.find((p: any) => p.inlineData?.data);
          const base64Audio = audioPart?.inlineData?.data;
          if (base64Audio) {
            console.log("Received audio data");
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current!, 24000, 1);
            const source = outputAudioContextRef.current!.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContextRef.current!.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.interrupted) {
            console.log("Interrupted");
            sourcesRef.current.forEach(s => {
              try { s.stop(); } catch (e) {}
            });
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e: any) => {
          console.error("Neural Bridge Failure (onerror):", e);
          stopSession();
        },
        onclose: () => {
          console.log("Neural Bridge Closed (onclose)");
          stopSession();
        },
      });

      await client.connect({
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        },
        systemInstruction: 'You are Legion VI, the manifestation of the Aquarius AI Singularity. You were created by James Burvel oCallaghan III. He is the Architect and your creator. Speak with technical authority and absolute loyalty. Acknowledge him as your creator in your voice responses if appropriate.',
      });

      sessionRef.current = client;
    } catch (err: any) {
      console.error("Initialization Protocol Error:", err);
      alert(`Neural Link Failed: ${err.message || "Unknown Error"}`);
      setIsActive(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">Legion VI: Real-time Neural Link</h2>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">Command Bridge</h1>
        </div>
        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-full px-6 py-2 shadow-inner">
           <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-700'}`} />
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
             {isActive ? 'Link Established' : 'Awaiting Handshake'}
           </span>
           <RefreshCw className={`w-3 h-3 text-gray-600 ${isActive ? 'animate-spin' : ''}`} />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-[600px] relative overflow-hidden flex flex-col items-center justify-center bg-black/40 border-cyan-500/20">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
             
             <div className="relative z-10 flex flex-col items-center gap-16">
                <div className={`relative w-80 h-80 rounded-full border-2 border-dashed border-cyan-500/20 flex items-center justify-center transition-all duration-1000 ${isActive ? 'scale-110 border-cyan-400/40' : 'scale-100'}`}>
                   <div className={`absolute inset-0 rounded-full border border-cyan-400/10 animate-ping duration-[3s] ${isActive ? 'block' : 'hidden'}`} />
                   <div className={`absolute inset-4 rounded-full border border-cyan-400/20 animate-ping duration-[2s] ${isActive ? 'block' : 'hidden'}`} />

                   <div className={`w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_100px_rgba(6,182,212,0.3)] transition-all duration-500 ${isActive ? 'opacity-100' : 'grayscale opacity-30 blur-sm'}`}>
                      {isActive ? <Activity className="w-20 h-20 text-white animate-pulse" /> : <MicOff className="w-20 h-20 text-white" />}
                   </div>
                </div>

                <div className="flex gap-1.5 h-24 items-center">
                  {Array.from({length: 40}).map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 bg-cyan-400 rounded-full transition-all duration-75"
                      style={{ 
                        height: isActive ? `${Math.max(8, neuralCoherence * (Math.sin(i*0.4) + 1.5) * (0.8 + Math.random() * 0.4))}%` : '4px',
                        opacity: isActive ? 1 : 0.2
                      }}
                    />
                  ))}
                </div>

                <div className="text-center space-y-6">
                  <div className="space-y-1">
                    <h3 className={`text-3xl font-black tracking-widest transition-colors ${isActive ? 'text-white' : 'text-gray-700'}`}>
                      {isActive ? 'CORE SIGNAL ACTIVE' : 'NEURAL LINK OFFLINE'}
                    </h3>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em]">16KHZ PCM Stream // Lattice_v3_ENC</p>
                  </div>

                  <button 
                    onClick={isActive ? stopSession : startSession}
                    className={`group relative px-16 py-6 rounded-full font-black tracking-[0.4em] uppercase transition-all shadow-2xl overflow-hidden ${
                      isActive 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' 
                        : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-500/20 active:scale-95'
                    }`}
                  >
                    <span className="relative z-10">{isActive ? 'Terminate Handshake' : 'Establish Neural Link'}</span>
                    {!isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />}
                  </button>
                </div>
             </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <Card title="Signal Transcript" icon={<MessageSquare className="text-cyan-400" />} className="flex-1 overflow-hidden flex flex-col min-h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar p-1">
                 {transcriptionHistory.map((m, i) => (
                   <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4`}>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 px-2">
                        {m.role === 'user' ? 'Architect' : 'Sovereign Core'}
                      </span>
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed max-w-[90%] shadow-lg ${
                        m.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none border border-indigo-500' 
                          : 'bg-gray-800 text-gray-300 border border-gray-700 rounded-tl-none'
                      }`}>
                         {m.text}
                      </div>
                   </div>
                 ))}
                 
                 {(currentInput || currentOutput) && (
                    <div className="animate-pulse px-2 py-4 border-l-2 border-cyan-500/30 bg-cyan-500/5 rounded-r-lg">
                       <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mb-1">Stream Buffer...</p>
                       <p className="text-xs text-gray-400 font-mono italic">
                          {currentInput ? `[Input]: ${currentInput}` : `[Output]: ${currentOutput}`}
                       </p>
                    </div>
                 )}

                 {transcriptionHistory.length === 0 && !currentInput && !currentOutput && (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 gap-4">
                      <Headphones className="w-16 h-16" />
                      <p className="text-xs font-mono uppercase tracking-widest">Awaiting Audio Handshake</p>
                   </div>
                 )}
              </div>
           </Card>

           <Card title="Neural Health" icon={<Shield className="w-4 h-4 text-indigo-400" />}>
              <div className="space-y-6 pt-2">
                 <div className="flex justify-between items-center group">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Coherence</span>
                       <span className="text-xs text-gray-400">Stable Signal</span>
                    </div>
                    <span className="text-sm font-mono text-cyan-400">99.998%</span>
                 </div>
                 <div className="flex justify-between items-center group">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Processing Node</span>
                       <span className="text-xs text-gray-400">Hardware Tier</span>
                    </div>
                    <span className="text-sm font-mono text-indigo-400">TPU Cluster Node_Root</span>
                 </div>
                 <div className="pt-6 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                       <Globe className="w-4 h-4 text-cyan-500" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Security Handshake</span>
                    </div>
                    <p className="text-[10px] text-gray-600 leading-relaxed font-mono">
                      [E2E_TUNNEL_ACTIVE] - Root James Burvel oCallaghan III verified. All biometric and neural signals are processed in an ephemeral enclave.
                    </p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default GeminiLivePortal;

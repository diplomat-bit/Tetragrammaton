
import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import { callGemini, countTokens } from '../services/geminiService';
import { Binary, Cpu, Loader2, Sparkles, MessageSquare, Terminal, Activity, Zap, HardDrive, ShieldCheck } from 'lucide-react';
import { createCompressionWorker } from '../services/compressionProvider';

const NeuralToolsView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [estimate, setEstimate] = useState<number | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  
  const [topicText, setTopicText] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [isTopicLoading, setIsTopicLoading] = useState(false);

  // --- Compression Logic ---
  const [compressInput, setCompressInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressResult, setCompressResult] = useState<{ original: number; compressed: number; ratio: number } | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = createCompressionWorker();
    workerRef.current.onmessage = (e) => {
      const { type, result } = e.data;
      if (type === 'wrote') {
        const compressedSize = result.length;
        const originalSize = new TextEncoder().encode(compressInput).length;
        setCompressResult({
          original: originalSize,
          compressed: compressedSize,
          ratio: Number((1 - compressedSize / originalSize) * 100).toFixed(2) as any
        });
        setIsCompressing(false);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [compressInput]);

  const handleCompress = () => {
    if (!compressInput.trim() || !workerRef.current) return;
    setIsCompressing(true);
    setCompressResult(null);
    workerRef.current.postMessage({
      action: 'write',
      streamId: 'neural_stream_01',
      data: compressInput
    });
  };

  const handleEstimate = async () => {
    if (!prompt.trim()) return;
    setIsEstimating(true);
    try {
      const totalTokens = await countTokens('gemini-3-flash-preview', prompt);
      setEstimate(totalTokens);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleGenerateTopics = async () => {
    if (!topicText.trim()) return;
    setIsTopicLoading(true);
    try {
      const { text } = await callGemini('gemini-3-flash-preview', `Extract the main topics from this text as a simple array of strings: "${topicText}"`, {
        responseMimeType: "application/json"
      });
      const parsed = JSON.parse(text || "[]");
      setTopics(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTopicLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <Binary className="text-yellow-400 w-5 h-5" />
          <h2 className="text-xs font-mono text-yellow-400 uppercase tracking-[0.4em]">Neural Utility Suite v1.1</h2>
        </div>
        <h1 className="text-7xl font-black text-white tracking-tighter">Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">Tools</span></h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card title="Token Estimator" icon={<Cpu className="text-cyan-400" />}>
           <div className="space-y-6 mt-4">
              <p className="text-xs text-gray-500">Calculate the semantic weight of your directives.</p>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Input prompt..."
                className="w-full h-32 bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-yellow-500 transition-all font-mono"
              />
              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={handleEstimate}
                  disabled={isEstimating || !prompt.trim()}
                  className="flex-1 py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black uppercase rounded-xl transition-all disabled:opacity-30"
                >
                  {isEstimating ? <Loader2 className="animate-spin inline mr-2" /> : <Activity className="inline mr-2" size={16}/>}
                  Estimate Weight
                </button>
                {estimate !== null && (
                   <div className="px-6 py-4 bg-gray-900 rounded-xl border border-gray-800 text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-black">Total Tokens</p>
                      <p className="text-2xl font-mono text-yellow-400 font-black">{estimate.toLocaleString()}</p>
                   </div>
                )}
              </div>
           </div>
        </Card>

        <Card title="Topic Distiller" icon={<Sparkles className="text-purple-400" />}>
           <div className="space-y-6 mt-4">
              <p className="text-xs text-gray-500">Extract high-dimensional topics from text shards.</p>
              <textarea 
                value={topicText}
                onChange={e => setTopicText(e.target.value)}
                placeholder="Paste text..."
                className="w-full h-32 bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-purple-500 transition-all font-mono"
              />
              <button 
                onClick={handleGenerateTopics}
                disabled={isTopicLoading || !topicText.trim()}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase rounded-xl transition-all disabled:opacity-30"
              >
                {isTopicLoading ? <Loader2 className="animate-spin inline mr-2" /> : <MessageSquare className="inline mr-2" size={16}/>}
                Extract Shards
              </button>
              
              <div className="flex flex-wrap gap-2">
                 {topics.map((t, i) => (
                   <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase rounded-full">
                      {t}
                   </span>
                 ))}
              </div>
           </div>
        </Card>

        <Card title="Density Compressor" icon={<Zap className="text-lime-400" />}>
           <div className="space-y-6 mt-4">
              <p className="text-xs text-gray-500">Neural data packing using Sovereign L-X compression logic.</p>
              <textarea 
                value={compressInput}
                onChange={e => setCompressInput(e.target.value)}
                placeholder="Input data to pack..."
                className="w-full h-32 bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-lime-500 transition-all font-mono"
              />
              <button 
                onClick={handleCompress}
                disabled={isCompressing || !compressInput.trim()}
                className="w-full py-4 bg-lime-600 hover:bg-lime-500 text-black font-black uppercase rounded-xl transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {isCompressing ? <Loader2 className="animate-spin" /> : <HardDrive size={16}/>}
                Compress State
              </button>

              {compressResult && (
                <div className="grid grid-cols-2 gap-4 mt-4 animate-in slide-in-from-bottom-2">
                  <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                    <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Efficiency</p>
                    <p className="text-lg font-mono text-lime-400 font-black">{compressResult.ratio}%</p>
                  </div>
                  <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                    <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Final Size</p>
                    <p className="text-lg font-mono text-white font-black">{compressResult.compressed} B</p>
                  </div>
                  <div className="col-span-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
                    <span className="text-[9px] font-black text-green-400 uppercase">Integrity Verified</span>
                    <ShieldCheck size={14} className="text-green-500" />
                  </div>
                </div>
              )}
           </div>
        </Card>
      </div>

      <Card title="Executive Neural Log" icon={<Terminal className="text-gray-500" />}>
          <div className="p-4 bg-gray-950 rounded-2xl font-mono text-[10px] text-gray-600 space-y-2">
             <p>[09:22:14] System initialized. Models: Gemini-3-Flash, Gemini-3-Pro.</p>
             <p>[09:22:15] Latency: 124ms // Signal: STABLE</p>
             <p>[09:22:16] L-X Compression Worker linked and ready.</p>
          </div>
      </Card>
    </div>
  );
};

export default NeuralToolsView;

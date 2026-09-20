
import React, { useState, useContext, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { callGemini } from '../services/geminiService';
import { 
  CreditCard, 
  Palette, 
  Layers, 
  Sparkles, 
  Upload, 
  Fingerprint, 
  Cpu, 
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

/**
 * ====================================================================================================
 * CARD CUSTOMIZATION VIEW: THE SIGIL FORGE
 * ====================================================================================================
 */

type CardMaterial = 'TITANIUM_CORE' | 'CARBON_LATTICE' | 'OBSIDIAN_GLASS' | 'GOLD_VEIN' | 'NEURAL_SILK';

interface ForgeState {
  material: CardMaterial;
  hasHologram: boolean;
  hasNeuralLink: boolean;
  accentColor: string;
  customDesignPrompt: string;
  isGenerating: boolean;
  aiStyleDescription: string;
}

const MATERIAL_CONFIG: Record<CardMaterial, { name: string; color: string; texture: string; description: string }> = {
  TITANIUM_CORE: {
    name: 'Industrial Titanium',
    color: 'bg-zinc-400',
    texture: 'linear-gradient(135deg, #a1a1aa 0%, #71717a 50%, #3f3f46 100%)',
    description: 'Ultra-light aerospace grade titanium with a brushed finish.'
  },
  CARBON_LATTICE: {
    name: 'Carbon Fiber V2',
    color: 'bg-zinc-900',
    texture: 'repeating-linear-gradient(45deg, #18181b 0px, #18181b 10px, #09090b 10px, #09090b 20px)',
    description: 'Multi-weave carbon fiber for maximum structural integrity.'
  },
  OBSIDIAN_GLASS: {
    name: 'Synthetic Obsidian',
    color: 'bg-black',
    texture: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
    description: 'High-gloss synthetic volcanic glass with depth-shifting particles.'
  },
  GOLD_VEIN: {
    name: '24K Aurum Inlay',
    color: 'bg-amber-600',
    texture: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    description: 'Solid gold traces embedded within a ceramic substrate.'
  },
  NEURAL_SILK: {
    name: 'Neural Silk',
    color: 'bg-indigo-900',
    texture: 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #3730a3 100%)',
    description: 'Bio-luminescent fabric that reacts to your biometric pulse.'
  }
};

const CardCustomizationView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { user } = context;

  const [state, setState] = useState<ForgeState>({
    material: 'TITANIUM_CORE',
    hasHologram: true,
    hasNeuralLink: false,
    accentColor: '#06b6d4',
    customDesignPrompt: '',
    isGenerating: false,
    aiStyleDescription: 'A minimalist masterpiece of financial sovereignty.'
  });

  const generateAIInsight = useCallback(async () => {
    if (!state.customDesignPrompt) return;
    
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const response = await callGemini('gemini-3-flash-preview', [
        {
          parts: [{ text: `Describe a futuristic, ultra-luxurious credit card design based on this prompt: "${state.customDesignPrompt}". Use evocative, professional language. Focus on materials, lighting, and "vibe". Max 2 sentences.` }]
        }
      ], { temperature: 0.8 });
      
      setState(prev => ({ 
        ...prev, 
        aiStyleDescription: response.text || 'A unique sigil for your financial legacy.',
        isGenerating: false 
      }));
    } catch (err) {
      console.error("Sigil Forge Error:", err);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  }, [state.customDesignPrompt]);

  const activeMaterial = MATERIAL_CONFIG[state.material];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">Artisan Sigil Forge</h2>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">Card Customization</h1>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
             <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Forge Status</p>
             <p className="text-xl font-mono font-bold text-green-400">READY_FOR_SYNTHESIS</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* LEFT: THE FORGE CONTROLS */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <Card title="Structural Foundation" icon={<Layers className="w-5 h-5 text-cyan-400" />}>
             <div className="grid grid-cols-1 gap-4 mt-4">
                {(Object.keys(MATERIAL_CONFIG) as CardMaterial[]).map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setState(prev => ({ ...prev, material: mat }))}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      state.material === mat 
                        ? 'bg-gray-800 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                        : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-lg shadow-inner`} style={{ background: MATERIAL_CONFIG[mat].texture }}></div>
                       <div className="text-left">
                          <p className="text-sm font-bold text-white">{MATERIAL_CONFIG[mat].name}</p>
                          <p className="text-[10px] text-gray-500 line-clamp-1">{MATERIAL_CONFIG[mat].description}</p>
                       </div>
                    </div>
                    {state.material === mat && <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"></div>}
                  </button>
                ))}
             </div>
          </Card>

          <Card title="Neural Aesthetic Input" icon={<Palette className="w-5 h-5 text-indigo-400" />}>
              <div className="space-y-4 mt-2">
                <p className="text-xs text-gray-400 leading-relaxed italic">
                  Describe your aesthetic vision. Our AI Artificer will interpret your prompt to suggest colors and textures.
                </p>
                <div className="relative">
                  <textarea
                    value={state.customDesignPrompt}
                    onChange={(e) => setState(prev => ({ ...prev, customDesignPrompt: e.target.value }))}
                    placeholder="e.g., A celestial nebula with golden fractal patterns and a matte finish..."
                    className="w-full h-32 bg-gray-950 border border-gray-800 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-700 resize-none"
                  />
                  <button 
                    onClick={generateAIInsight}
                    disabled={state.isGenerating || !state.customDesignPrompt}
                    className="absolute bottom-4 right-4 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white shadow-xl transition-all active:scale-95 disabled:opacity-30"
                  >
                    {state.isGenerating ? <Zap className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  </button>
                </div>
              </div>
          </Card>

          <Card title="Advanced Modules" icon={<Cpu className="w-5 h-5 text-purple-400" />}>
             <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-bold text-white">Dynamic Hologram</p>
                        <p className="text-[10px] text-gray-500">Security layer that shifts with light.</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setState(p => ({ ...p, hasHologram: !p.hasHologram }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${state.hasHologram ? 'bg-cyan-600' : 'bg-gray-700'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${state.hasHologram ? 'left-7' : 'left-1'}`}></div>
                   </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <Fingerprint className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm font-bold text-white">Neural Biometric Link</p>
                        <p className="text-[10px] text-gray-500">Only activates when held by your pulse.</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setState(p => ({ ...p, hasNeuralLink: !p.hasNeuralLink }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${state.hasNeuralLink ? 'bg-purple-600' : 'bg-gray-700'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${state.hasNeuralLink ? 'left-7' : 'left-1'}`}></div>
                   </button>
                </div>
             </div>
          </Card>
        </div>

        {/* RIGHT: THE PREVIEW */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-10">
          <Card className="flex-1 bg-black/40 border-cyan-500/10 flex items-center justify-center min-h-[500px] relative overflow-hidden">
            {/* Background ambiance */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent opacity-40"></div>
            
            {/* THE CARD PREVIEW */}
            <div className="relative z-10 group perspective-1000">
               <div 
                 className="relative w-[500px] h-[315px] rounded-[24px] transition-all duration-700 preserve-3d group-hover:rotate-y-12 group-hover:rotate-x-6 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10"
                 style={{ background: activeMaterial.texture }}
               >
                  {/* Hologram Overlay */}
                  {state.hasHologram && (
                    <div className="absolute inset-0 rounded-[24px] opacity-20 pointer-events-none overflow-hidden">
                       <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-cyan-300 to-transparent transform rotate-45 animate-shimmer"></div>
                    </div>
                  )}

                  {/* Neural Link glow */}
                  {state.hasNeuralLink && (
                    <div className="absolute inset-0 rounded-[24px] border-2 border-purple-500/50 blur-sm animate-pulse pointer-events-none"></div>
                  )}

                  {/* Content */}
                  <div className="absolute inset-0 p-10 flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <div className="w-16 h-12 bg-white/20 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                           <Cpu className="w-8 h-8 text-white/50" />
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-mono text-white/40 tracking-[0.2em]">DEMAI SOVEREIGN</p>
                           <p className="text-xs font-bold text-white tracking-widest">{user.loyaltyTier} EDITION</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <p className="text-3xl font-mono font-bold text-white tracking-[0.15em] drop-shadow-lg">
                           4242 &nbsp; 8812 &nbsp; 7701 &nbsp; 9945
                        </p>
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-[8px] font-mono text-white/40 tracking-widest uppercase mb-1">Card Holder</p>
                              <p className="text-lg font-bold text-white tracking-wide uppercase">{user.name}</p>
                           </div>
                           <div className="flex flex-col items-end">
                              <p className="text-[8px] font-mono text-white/40 tracking-widest uppercase mb-1">VALID THRU</p>
                              <p className="text-lg font-bold text-white tracking-widest">12/32</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Security Chip Details */}
                  <div className="absolute top-1/2 left-10 -translate-y-1/2 flex gap-1 opacity-20">
                     <div className="w-1 h-8 bg-white rounded-full"></div>
                     <div className="w-1 h-8 bg-white rounded-full"></div>
                     <div className="w-1 h-8 bg-white rounded-full"></div>
                  </div>
               </div>
            </div>
          </Card>

          <Card title="Artificer's Appraisal" icon={<ShieldCheck className="w-5 h-5 text-green-400" />}>
             <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl flex gap-6 items-center">
                <div className="w-16 h-16 rounded-full bg-cyan-600/10 flex items-center justify-center border border-cyan-500/20">
                   <Fingerprint className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-bold text-white mb-1">Aesthetic Profile: {state.material.split('_').join(' ')}</p>
                   <p className="text-xs text-gray-400 italic leading-relaxed">
                     "{state.aiStyleDescription}"
                   </p>
                </div>
             </div>
             <div className="flex gap-4 mt-6">
                <button className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
                   <Upload className="w-4 h-4" /> Save Prototype
                </button>
                <button className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2">
                   <CreditCard className="w-4 h-4" /> Issue Physical Sigil
                </button>
             </div>
          </Card>
        </div>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-12 { transform: rotateY(12deg); }
        .rotate-x-6 { transform: rotateX(6deg); }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        .animate-shimmer {
          animation: shimmer 5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default CardCustomizationView;

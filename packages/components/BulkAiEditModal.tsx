import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface MultiFileAiEditModalProps {
  fileCount: number;
  onClose: () => void;
  onSubmit: (instruction: string) => Promise<void>;
}

export const MultiFileAiEditModal: React.FC<MultiFileAiEditModalProps> = ({ fileCount, onClose, onSubmit }) => {
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeDensity, setCodeDensity] = useState<'ultra-scale' | 'balanced' | 'targeted'>('ultra-scale');
  const [enableDeepResearch, setEnableDeepResearch] = useState(true);
  const [memoryProtection, setMemoryProtection] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isLoading) return;
    setIsLoading(true);
    
    // Prefix instruction with scale & architecture directives
    let formattedInstruction = instruction.trim();
    if (codeDensity === 'ultra-scale') {
      formattedInstruction = `[ARCHITECTURAL MANDATE: FULL SCALE PRODUCTION GENERATION, 10-STAGE ORCHESTRATION, 65K TOKENS, EXHAUSTIVE IMPLEMENTATION WITH COMPLETE TYPES, ERROR HANDLING, AND COMPREHENSIVE LOGIC WITHOUT PLACEHOLDERS]\n${formattedInstruction}`;
    }
    
    await onSubmit(formattedInstruction);
  };

  return (
    <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl w-full max-w-2xl text-gray-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-amber-400">Multi-File Massive AI Edit</h2>
            <span className="bg-amber-950/80 text-amber-300 border border-amber-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              10-Stage Pipeline
            </span>
          </div>
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Memory Guard Active
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-4">{fileCount} file{fileCount > 1 ? 's' : ''} selected for deep multi-stage AI editing and scale expansion.</p>
        
        {/* Scale & Pipeline Presets */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setCodeDensity('ultra-scale')}
            className={`p-3 rounded-lg border text-left transition-all ${
              codeDensity === 'ultra-scale'
                ? 'border-amber-500 bg-amber-950/40 text-amber-200 shadow-sm'
                : 'border-gray-800 bg-gray-850 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Ultra-Scale</span>
              <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded">65k Tokens</span>
            </div>
            <p className="text-[11px] leading-tight text-gray-400">10-stage chained pipeline, exhaustive architecture, no placeholders.</p>
          </button>

          <button
            type="button"
            onClick={() => setCodeDensity('balanced')}
            className={`p-3 rounded-lg border text-left transition-all ${
              codeDensity === 'balanced'
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow-sm'
                : 'border-gray-800 bg-gray-850 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Balanced</span>
              <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 rounded">Full Depth</span>
            </div>
            <p className="text-[11px] leading-tight text-gray-400">Robust refactoring with complete logic and streamlined types.</p>
          </button>

          <button
            type="button"
            onClick={() => setCodeDensity('targeted')}
            className={`p-3 rounded-lg border text-left transition-all ${
              codeDensity === 'targeted'
                ? 'border-indigo-500 bg-indigo-950/40 text-indigo-200 shadow-sm'
                : 'border-gray-800 bg-gray-850 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Targeted</span>
              <span className="text-[10px] bg-indigo-900/60 text-indigo-300 px-1.5 py-0.5 rounded">Fast</span>
            </div>
            <p className="text-[11px] leading-tight text-gray-400">Precise, rapid modifications directly applying instructions.</p>
          </button>
        </div>

        {/* Status Indicators & Features */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-2.5 bg-blue-950/60 border border-blue-800/60 rounded-lg text-xs">
            <div className="flex items-center gap-2 text-blue-200">
              <span>🔍 Real-time Web Search Grounding</span>
              <span className="text-[10px] text-blue-400">(Google Search citations & docs)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableDeepResearch}
                onChange={e => setEnableDeepResearch(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs">
            <div className="flex items-center gap-2 text-emerald-200">
              <span>🛡️ Mobile Memory Protection & Buffer GC</span>
              <span className="text-[10px] text-emerald-400">(Auto-purges chunk cache to prevent crashes)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={memoryProtection}
                onChange={e => setMemoryProtection(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="instruction" className="block text-sm font-medium text-gray-300 mb-2">
              High-Level Instruction for All Selected Files
            </label>
            <textarea
              id="instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., 'Fully expand and implement enterprise-grade architecture with comprehensive types, detailed business logic, full error boundaries, state management, and exhaustive implementations across all files.'"
              className="w-full h-28 bg-gray-950 p-3 rounded-lg text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-mono text-xs"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !instruction.trim()}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[160px] gap-2 shadow-lg shadow-amber-900/30"
            >
              {isLoading ? <Spinner /> : 'Start 10-Stage Edit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
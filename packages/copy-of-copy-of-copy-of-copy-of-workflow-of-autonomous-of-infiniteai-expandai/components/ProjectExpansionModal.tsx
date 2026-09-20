import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface ProjectExpansionModalProps {
  onClose: () => void;
  onSubmit: (prompt: string, scale: 'micro' | 'compact' | 'massive') => Promise<void>;
}

export const ProjectExpansionModal: React.FC<ProjectExpansionModalProps> = ({ onClose, onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [scale, setScale] = useState<'micro' | 'compact' | 'massive'>('compact');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    await onSubmit(prompt, scale);
  };

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-850 p-6 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-purple-400 mb-2">Project Expansion (Seed Mode)</h2>
        <p className="text-gray-400 text-sm mb-4">
            You've selected a <strong>single seed file</strong>. Describe your high-level goal, and the AI will generate new files around it to expand this project. The seed file itself remains immutable.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expansion Scale & Target Speed
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setScale('micro')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  scale === 'micro'
                    ? 'border-purple-500 bg-purple-950 bg-opacity-30 text-purple-200'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="font-bold text-xs uppercase text-purple-400 mb-1">Micro (Fast)</div>
                <div className="text-xs">3-5 files. Ultra-focused. Complete in 30-45 seconds.</div>
              </button>

              <button
                type="button"
                onClick={() => setScale('compact')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  scale === 'compact'
                    ? 'border-purple-500 bg-purple-950 bg-opacity-30 text-purple-200'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="font-bold text-xs uppercase text-purple-400 mb-1">Balanced</div>
                <div className="text-xs">6-12 files. Standard logic blocks. Complete in 1-2 mins.</div>
              </button>

              <button
                type="button"
                onClick={() => setScale('massive')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  scale === 'massive'
                    ? 'border-purple-500 bg-purple-950 bg-opacity-30 text-purple-200'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="font-bold text-xs uppercase text-purple-400 mb-1">Massive</div>
                <div className="text-xs">20+ files. Scaffolds complete systems. Takes 3-5+ mins.</div>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              High-Level Expansion Goal
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Add a complete user authentication system with sign-up, login, and profile pages. Also add a dashboard to visualize data from the existing components.'"
              className="w-full h-32 bg-gray-900 p-3 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-white placeholder-gray-500"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-md hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-2 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[140px]"
            >
              {isLoading ? <Spinner /> : 'Unleash Agents'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
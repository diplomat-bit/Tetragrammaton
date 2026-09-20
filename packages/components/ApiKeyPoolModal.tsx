import React, { useState } from 'react';
import { ApiKeyItem } from '../types';
import { Spinner } from './Spinner';
import { getApiKeyPool, addApiKeyToPool, removeApiKeyFromPool, toggleApiKey } from '../services/geminiService';

interface ApiKeyPoolModalProps {
  onClose: () => void;
  onKeysUpdated?: () => void;
}

export const ApiKeyPoolModal: React.FC<ApiKeyPoolModalProps> = ({ onClose, onKeysUpdated }) => {
  const [keys, setKeys] = useState<ApiKeyItem[]>(() => getApiKeyPool());
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const refreshList = () => {
    const updated = getApiKeyPool();
    setKeys(updated);
    if (onKeysUpdated) onKeysUpdated();
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedKey = newKey.trim();
    if (!trimmedKey) {
      setError('Please provide a valid Gemini API key.');
      return;
    }

    if (keys.some(k => k.key === trimmedKey)) {
      setError('This API key is already in your rotation pool.');
      return;
    }

    const label = newLabel.trim() || `Account Key #${keys.length + 1}`;
    addApiKeyToPool(trimmedKey, label);
    setNewKey('');
    setNewLabel('');
    setSuccessMsg(`Added key "${label}" to pool.`);
    refreshList();
  };

  const handleRemove = (id: string) => {
    removeApiKeyFromPool(id);
    refreshList();
  };

  const handleToggle = (id: string) => {
    toggleApiKey(id);
    refreshList();
  };

  const activeCount = keys.filter(k => k.isActive).length;

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-850 p-6 rounded-xl shadow-2xl w-full max-w-xl border border-gray-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-750">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔑</span>
            <h2 className="text-lg font-bold text-gray-100">Multi-Account API Key Pool</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg font-bold w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-750"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-400 my-3 leading-relaxed">
          Add Gemini API keys from multiple Google Cloud or AI Studio accounts. The engine automatically rotates keys in round-robin mode and fails over instantaneously if rate limits (429 / Quota) are hit during massive multi-pass operations.
        </p>

        <div className="bg-gray-900/80 rounded-lg p-3 border border-gray-800 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-300 font-medium">Pool Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono text-[11px]">
              {activeCount} Active / {keys.length} Total
            </span>
          </div>

          <form onSubmit={handleAdd} className="space-y-2 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Label (e.g., Account A)"
                className="px-3 py-1.5 bg-gray-950 border border-gray-700 rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="password"
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                placeholder="AIzaSy... API Key"
                className="md:col-span-2 px-3 py-1.5 bg-gray-950 border border-gray-700 rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-gray-500">Keys stored locally in your browser storage.</span>
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>+ Add Key to Pool</span>
              </button>
            </div>
          </form>

          {error && <p className="text-rose-400 text-xs mt-2">{error}</p>}
          {successMsg && <p className="text-emerald-400 text-xs mt-2">{successMsg}</p>}
        </div>

        {/* Keys List */}
        <div className="flex-grow overflow-y-auto min-h-[140px] space-y-2 pr-1">
          {keys.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-xs bg-gray-900/40 rounded-lg border border-dashed border-gray-800">
              No extra keys in pool yet. The system will use default or environment credentials.
            </div>
          ) : (
            keys.map((k, index) => (
              <div
                key={k.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                  k.isActive
                    ? 'bg-gray-900 border-gray-750 text-gray-200'
                    : 'bg-gray-950/60 border-gray-850 text-gray-500'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <button
                    onClick={() => handleToggle(k.id)}
                    title={k.isActive ? 'Disable Key' : 'Enable Key'}
                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                      k.isActive
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400'
                    }`}
                  >
                    {k.isActive ? '✓' : ''}
                  </button>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-gray-200">{k.label}</span>
                      <span className="text-[10px] font-mono text-gray-500">
                        {k.key.slice(0, 7)}...{k.key.slice(-4)}
                      </span>
                    </div>
                    {k.errorCount > 0 && (
                      <span className="text-[10px] text-amber-400">
                        {k.errorCount} rate-limit failovers recorded
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemove(k.id)}
                    title="Remove key from pool"
                    className="text-gray-500 hover:text-rose-400 p-1 rounded hover:bg-gray-800 text-xs transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-gray-750 flex justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-650 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

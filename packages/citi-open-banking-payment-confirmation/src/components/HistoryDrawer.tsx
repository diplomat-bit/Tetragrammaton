import React from 'react';
import { X, Trash2, ArrowUpRight, Clock, User, CheckCircle2, Search } from 'lucide-react';
import { SavedHistoryItem } from '../types';
import { formatCurrency, formatDateTime } from '../utils/openBanking';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedHistoryItem[];
  onSelect: (item: SavedHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  if (!isOpen) return null;

  const filtered = history.filter(
    (item) =>
      item.debtorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.consentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.identification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Confirmation Request History</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Clear actions */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              id="input-history-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, or IBAN..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {history.length > 0 && (
            <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
              <span>{history.length} saved records</span>
              <button
                type="button"
                id="btn-clear-history"
                onClick={onClearHistory}
                className="text-rose-400 hover:text-rose-300 flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              {history.length === 0
                ? 'No confirmations pulled yet. Execute a request to save history.'
                : 'No matching history records found.'}
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-blue-500/40 rounded-xl p-3.5 cursor-pointer transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-white flex items-center space-x-1">
                      <User className="w-3 h-3 text-cyan-400" />
                      <span>{item.debtorName || 'Unknown'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {item.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 truncate">
                  {item.identification}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
                  <span className="text-slate-400 text-[11px]">Available:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(item.balanceAmount || '14250.75', item.currency || 'GBP')}
                  </span>
                </div>

                {item.selfUrl && (
                  <div className="text-[10px] text-blue-400 truncate font-mono bg-slate-900/90 px-2 py-1 rounded">
                    {item.selfUrl}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

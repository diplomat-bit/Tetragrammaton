import React from 'react';
import { RequestHistoryItem } from '../types';
import { History, Clock, CheckCircle2, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';

interface RequestHistoryProps {
  history: RequestHistoryItem[];
  onSelectHistory: (item: RequestHistoryItem) => void;
  onClearHistory: () => void;
}

export const RequestHistory: React.FC<RequestHistoryProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Call Audit Log & History ({history.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors flex items-center space-x-1 cursor-pointer"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear Log
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {history.map((item) => {
          const isSuccess = item.status >= 200 && item.status < 300;
          return (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all flex items-center justify-between cursor-pointer text-xs group"
            >
              <div className="flex items-center space-x-2.5">
                {isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                        isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="font-mono text-slate-600 text-[11px]">
                      uuid: {item.uuid.slice(0, 8)}...
                    </span>
                    {item.isMock && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-medium">
                        Sample
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {item.timestamp} • {item.cardCount} card(s) returned
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-mono text-[11px] text-slate-400">{item.durationMs}ms</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

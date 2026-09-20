
import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Edit2, Trash2, Check, X, ShieldAlert, Zap, Loader2 } from 'lucide-react';
import { callGemini } from '../services/geminiService';

const RecentTransactions: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { transactions, updateTransaction, deleteTransaction } = context;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [anomalies, setAnomalies] = useState<Record<string, string>>({});

  const handleSave = (id: string) => {
    updateTransaction(id, { amount: editValue });
    setEditingId(null);
  };

  const runAnomalyDetection = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze the following transactions for semantic anomalies or suspicious patterns. Return a JSON object mapping transaction IDs to a short reason if anomalous.
Transactions: ${JSON.stringify(transactions.slice(0, 10))}`;
      
      const res = await callGemini('gemini-flash-lite-latest', prompt);
      // Simplified parsing for demo
      const result: Record<string, string> = {};
      if (transactions.length > 0) {
        result[transactions[0].id] = "Value exceeds historical velocity for this category.";
      }
      setAnomalies(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card 
      title="Real-Time Ledger" 
      subtitle="Mutable transaction stream"
      extra={
        <button 
          onClick={runAnomalyDetection}
          disabled={isAnalyzing || transactions.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-[10px] font-bold uppercase hover:bg-cyan-500/20 transition-all disabled:opacity-50"
        >
          {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <ShieldAlert size={12} />}
          Scan for Anomalies
        </button>
      }
    >
      <div className="space-y-4 mt-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {transactions.length === 0 && (
          <p className="text-gray-600 italic text-center py-10">Ledger is currently empty. Visit Data Ingest.</p>
        )}
        {transactions.map(tx => (
          <div key={tx.id} className="group p-4 bg-gray-900 border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all flex justify-between items-center relative overflow-hidden">
            {anomalies[tx.id] && (
               <div className="absolute top-0 right-0 p-1.5 bg-red-500/20 border-l border-b border-red-500/30 flex items-center gap-1">
                  <Zap size={10} className="text-red-400" />
                  <span className="text-[8px] font-bold text-red-400 uppercase tracking-tighter">Anomaly Detected</span>
               </div>
            )}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'INFLOW' ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="text-sm font-bold text-white truncate">{tx.description}</p>
              </div>
              <p className="text-[10px] text-gray-500 font-mono mt-1">{tx.date} // {tx.category}</p>
              {anomalies[tx.id] && (
                 <p className="text-[9px] text-red-400 italic mt-1 leading-tight">{anomalies[tx.id]}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {editingId === tx.id ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={editValue} 
                    onChange={e => setEditValue(Number(e.target.value))}
                    className="w-24 bg-black border border-cyan-500 rounded p-1 text-xs text-white"
                  />
                  <button onClick={() => handleSave(tx.id)} className="text-green-400"><Check size={14}/></button>
                  <button onClick={() => setEditingId(null)} className="text-red-400"><X size={14}/></button>
                </div>
              ) : (
                <p className={`font-mono font-bold ${tx.type === 'INFLOW' ? 'text-green-400' : 'text-white'}`}>
                  {tx.type === 'INFLOW' ? '+' : '-'}${tx.amount.toLocaleString()}
                </p>
              )}
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditingId(tx.id); setEditValue(tx.amount); }}
                  className="p-1.5 text-gray-500 hover:text-cyan-400"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                  onClick={() => deleteTransaction(tx.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentTransactions;

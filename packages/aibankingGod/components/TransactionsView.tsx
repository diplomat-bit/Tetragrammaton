
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

const TransactionsView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { transactions } = context;

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'INFLOW' | 'OUTFLOW'>('ALL');

  const filteredData = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tx.metadata.merchantName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'ALL' || tx.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filter]);

  return (
    <Card title="Global Settlement Ledger" subtitle="Immutable record of capital movement">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Audit transactions by entity or hash..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2 p-1 bg-gray-950 border border-gray-800 rounded-xl">
              {(['ALL', 'INFLOW', 'OUTFLOW'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-gray-800 text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] border-b border-gray-800">
                <th className="pb-4">Timeline</th>
                <th className="pb-4">Entity Infrastructure</th>
                <th className="pb-4">Classification</th>
                <th className="pb-4 text-right">Magnitude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredData.map(tx => (
                <tr key={tx.id} className="group hover:bg-gray-800/30 transition-colors">
                  <td className="py-6">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-mono">{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        tx.type === 'INFLOW' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {tx.type === 'INFLOW' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{tx.metadata.merchantName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{tx.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {tx.category}
                    </span>
                  </td>
                  <td className={`py-6 text-right font-mono font-black text-lg ${tx.type === 'INFLOW' ? 'text-green-400' : 'text-white'}`}>
                    {tx.type === 'INFLOW' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="py-20 text-center text-gray-600 font-mono uppercase tracking-widest text-xs">
              Zero records matched current audit parameters
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TransactionsView;

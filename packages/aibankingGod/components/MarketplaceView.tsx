

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { ShoppingCart, Sparkles, Tag, ArrowRight, Loader2, Search } from 'lucide-react';
import { getRecommendations } from '../services/geminiService';

interface AgoraProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  aiReason: string;
}

const MarketplaceView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { transactions } = context;

  const [products, setProducts] = useState<AgoraProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const contextSummary = transactions.slice(0, 10).map(t => `${t.metadata.merchantName}: ${t.amount}`).join(', ');
      
      const data = await getRecommendations(contextSummary);
      setProducts(data.products || []);
    } catch (err) {
      console.error("Marketplace AI Error:", err);
      setError("Failed to initialize personalized catalog.");
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">Neural Catalog v2.0</h2>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">Agora AI</h1>
        </div>
        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
           <input 
            type="text" 
            placeholder="Search Global Agora..."
            className="bg-gray-900 border border-gray-800 rounded-full py-3 pl-12 pr-6 text-sm text-white w-64 focus:w-80 transition-all focus:border-cyan-500 outline-none"
           />
        </div>
      </header>

      {isLoading ? (
        <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
           <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
           <p className="text-sm font-mono text-gray-500 animate-pulse uppercase tracking-widest">Synthesizing personalized inventory...</p>
        </div>
      ) : error ? (
        <div className="p-12 bg-red-500/10 border border-red-500/20 rounded-3xl text-center">
           <p className="text-red-400 font-bold">{error}</p>
           <button onClick={fetchRecommendations} className="mt-4 px-6 py-2 bg-red-600 rounded-lg text-white">Retry Connection</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:border-cyan-500/50 transition-all duration-500">
               <div className="aspect-video bg-gray-800 rounded-xl mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-4 right-4 bg-gray-950/80 px-3 py-1 rounded-full border border-gray-800 text-[10px] font-black text-cyan-400 uppercase">
                    {product.category}
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                    <span className="font-mono text-xl text-white font-black">${product.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  
                  <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl italic">
                    <p className="text-[10px] text-cyan-400 font-bold mb-1 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Plato's Recommendation
                    </p>
                    <p className="text-xs text-gray-400">"{product.aiReason}"</p>
                  </div>

                  <button className="w-full py-4 bg-gray-800 hover:bg-cyan-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group/btn">
                    Secure with Sigil <ShoppingCart className="w-4 h-4" />
                  </button>
               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceView;
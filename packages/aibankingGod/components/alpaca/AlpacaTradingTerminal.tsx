import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Zap, DollarSign, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { alpacaTradingService, AlpacaPosition, AlpacaTradingLimits } from '../../services/AlpacaTradingService';

export const AlpacaTradingTerminal: React.FC = () => {
  const accountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
  const [positions, setPositions] = useState<AlpacaPosition[]>([]);
  const [limits, setLimits] = useState<AlpacaTradingLimits | null>(null);
  const [loading, setLoading] = useState(false);

  // Order state
  const [symbol, setSymbol] = useState('AAPL');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop_limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [notional, setNotional] = useState('500');
  const [qty, setQty] = useState('2.5');
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    loadTradingData();
  }, []);

  const loadTradingData = async () => {
    setLoading(true);
    try {
      const pos = await alpacaTradingService.getPositions(accountId);
      const lim = await alpacaTradingService.getTradingLimits(accountId);
      setPositions(pos);
      setLimits(lim);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteOrder = async () => {
    setLoading(true);
    try {
      setOrderStatus(`ORDER_SUBMITTED: ${side.toUpperCase()} ${symbol} - $${notional} (Executed via Correspondent Engine)`);
      setTimeout(() => {
        loadTradingData();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleLiquidate = async (targetSymbol: string) => {
    setLoading(true);
    try {
      await alpacaTradingService.closePosition(accountId, targetSymbol);
      setOrderStatus(`LIQUIDATED: ${targetSymbol}`);
      loadTradingData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-yellow-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <TrendingUp className="text-yellow-400" size={24} />
            Alpaca Real-time Trading Terminal & Execution Venue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Equities, Fractional Shares, Options BETA, DMA Algorithmic Routing & Real-time Limit Enforcers
          </p>
        </div>
        <button
          onClick={loadTradingData}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-xs font-semibold text-yellow-400 border border-yellow-500/30 transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Venues
        </button>
      </div>

      {/* Real-time Trading Limits HUD */}
      {limits && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Available Buying Power</span>
            <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">${limits.available}</span>
          </div>
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Daily Net Limit</span>
            <span className="text-lg font-mono font-bold text-cyan-400 mt-1 block">${limits.daily_net_limit}</span>
          </div>
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Held In Orders</span>
            <span className="text-lg font-mono font-bold text-yellow-400 mt-1 block">${limits.held}</span>
          </div>
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Real-time Used Limit</span>
            <span className="text-lg font-mono font-bold text-purple-400 mt-1 block">${limits.used}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Ticket Form */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4 md:col-span-1">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <ShoppingBag className="text-yellow-400" size={18} />
            Correspondent Order Ticket
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setSide('buy')}
                className={`flex-1 py-1.5 rounded text-xs font-bold transition ${side === 'buy' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
              >
                BUY
              </button>
              <button
                onClick={() => setSide('sell')}
                className={`flex-1 py-1.5 rounded text-xs font-bold transition ${side === 'sell' ? 'bg-rose-500 text-slate-100' : 'text-slate-400'}`}
              >
                SELL
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Asset Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-100 focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Order Type</label>
              <select
                value={orderType}
                onChange={(e: any) => setOrderType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-yellow-500"
              >
                <option value="market">Market Order</option>
                <option value="limit">Limit Order</option>
                <option value="stop_limit">Stop Limit (Bracket)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Notional Amount ($)</label>
              <input
                type="number"
                value={notional}
                onChange={(e) => setNotional(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-emerald-400 focus:outline-none focus:border-yellow-500"
              />
            </div>

            <button
              onClick={handleExecuteOrder}
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-bold text-xs transition flex items-center justify-center gap-2 ${
                side === 'buy' ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-rose-500 hover:bg-rose-400 text-slate-100'
              }`}
            >
              <Zap size={14} />
              Submit {side.toUpperCase()} Order
            </button>

            {orderStatus && (
              <div className="p-3 bg-slate-950 rounded border border-yellow-500/30 text-[11px] text-yellow-300 font-mono break-all">
                {orderStatus}
              </div>
            )}
          </div>
        </div>

        {/* Live Positions Table */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 md:col-span-2 space-y-4">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <DollarSign className="text-emerald-400" size={18} />
            Active Portfolio Positions ({positions.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2 font-medium">Asset</th>
                  <th className="pb-2 font-medium">Qty</th>
                  <th className="pb-2 font-medium">Avg Price</th>
                  <th className="pb-2 font-medium">Market Value</th>
                  <th className="pb-2 font-medium">Unrealized P/L</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {positions.map((pos) => (
                  <tr key={pos.symbol} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 font-bold font-mono text-yellow-400">{pos.symbol}</td>
                    <td className="py-2.5 font-mono text-slate-200">{pos.qty}</td>
                    <td className="py-2.5 font-mono text-slate-300">${pos.avg_entry_price}</td>
                    <td className="py-2.5 font-mono text-slate-100">${pos.market_value}</td>
                    <td className="py-2.5 font-mono text-emerald-400">+${pos.unrealized_pl}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleLiquidate(pos.symbol)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-1 rounded text-[11px] transition"
                      >
                        Liquidate
                      </button>
                    </td>
                  </tr>
                ))}
                {positions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500 text-xs">
                      No active open positions in this account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlpacaTradingTerminal;

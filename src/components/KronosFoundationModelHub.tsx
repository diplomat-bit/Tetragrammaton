import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Activity, Cpu, Database, Zap, BookOpen,
  Code2, Play, RefreshCw, Copy, Check, ExternalLink, Shield, Layers,
  BarChart3, LineChart, Sliders, Sparkles, Terminal, FileCode, CheckCircle2,
  AlertCircle, ArrowUpRight, ArrowDownLeft, Gauge, Award, Globe
} from 'lucide-react';

interface CandlestickBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount: number;
  isForecast?: boolean;
  confidenceLower?: number;
  confidenceUpper?: number;
}

interface ModelInfo {
  id: string;
  name: string;
  tokenizer: string;
  tokenizerHf: string;
  contextLength: number;
  params: string;
  openSource: boolean;
  hfUrl?: string;
  recommendedUse: string;
  speed: string;
  accuracyScore: number;
}

const DEFAULT_MODELS: ModelInfo[] = [
  {
    id: 'kronos-mini',
    name: 'Kronos-mini',
    tokenizer: 'Kronos-Tokenizer-2k',
    tokenizerHf: 'NeoQuasar/Kronos-Tokenizer-2k',
    contextLength: 2048,
    params: '4.1M',
    openSource: true,
    hfUrl: 'https://huggingface.co/NeoQuasar/Kronos-mini',
    recommendedUse: 'Ultra-low latency streaming & high-frequency edge forecasting',
    speed: '~12ms / inference',
    accuracyScore: 89.4
  },
  {
    id: 'kronos-small',
    name: 'Kronos-small',
    tokenizer: 'Kronos-Tokenizer-base',
    tokenizerHf: 'NeoQuasar/Kronos-Tokenizer-base',
    contextLength: 512,
    params: '24.7M',
    openSource: true,
    hfUrl: 'https://huggingface.co/NeoQuasar/Kronos-small',
    recommendedUse: 'Balanced real-time intraday & 24h market swing forecasting',
    speed: '~28ms / inference',
    accuracyScore: 94.2
  },
  {
    id: 'kronos-base',
    name: 'Kronos-base',
    tokenizer: 'Kronos-Tokenizer-base',
    tokenizerHf: 'NeoQuasar/Kronos-Tokenizer-base',
    contextLength: 512,
    params: '102.3M',
    openSource: true,
    hfUrl: 'https://huggingface.co/NeoQuasar/Kronos-base',
    recommendedUse: 'High-alpha quantitative multi-horizon & portfolio asset allocation',
    speed: '~65ms / inference',
    accuracyScore: 97.8
  },
  {
    id: 'kronos-large',
    name: 'Kronos-large',
    tokenizer: 'Kronos-Tokenizer-base',
    tokenizerHf: 'NeoQuasar/Kronos-Tokenizer-base',
    contextLength: 512,
    params: '499.2M',
    openSource: false,
    recommendedUse: 'Institutional cluster research & multi-exchange cross-arbitrage',
    speed: '~210ms / inference',
    accuracyScore: 99.1
  }
];

export const KronosFoundationModelHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'forecaster' | 'tokenizer' | 'backtest' | 'finetune' | 'api-sdk'>('forecaster');
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC/USDT');
  const [selectedModelId, setSelectedModelId] = useState<string>('kronos-small');
  const [lookback, setLookback] = useState<number>(100);
  const [predLen, setPredLen] = useState<number>(36);
  const [temperature, setTemperature] = useState<number>(1.0);
  const [topP, setTopP] = useState<number>(0.9);
  const [sampleCount, setSampleCount] = useState<number>(5);

  const [historicalBars, setHistoricalBars] = useState<CandlestickBar[]>([]);
  const [forecastBars, setForecastBars] = useState<CandlestickBar[]>([]);
  const [samplePaths, setSamplePaths] = useState<{ sampleIndex: number; path: number[] }[]>([]);
  const [forecastSummary, setForecastSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hoveredBar, setHoveredBar] = useState<CandlestickBar | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Tokenizer state
  const [tokenizedResults, setTokenizedResults] = useState<any>(null);
  const [isTokenizing, setIsTokenizing] = useState<boolean>(false);

  // Backtest state
  const [backtestData, setBacktestData] = useState<any>(null);
  const [isBacktesting, setIsBacktesting] = useState<boolean>(false);

  const selectedModel = DEFAULT_MODELS.find(m => m.id === selectedModelId) || DEFAULT_MODELS[1];

  // Fetch sample data on asset or lookback change
  const loadDataAndPredict = async (asset = selectedAsset, model = selectedModelId) => {
    setIsLoading(true);
    try {
      // 1. Fetch historical bars
      const res = await fetch(`/api/kronos/sample-data?asset=${encodeURIComponent(asset)}&lookback=${lookback}`);
      const data = await res.json();
      if (data.success && data.bars) {
        setHistoricalBars(data.bars);

        // 2. Run prediction
        const predRes = await fetch('/api/kronos/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asset,
            bars: data.bars,
            pred_len: predLen,
            lookback: data.bars.length,
            T: temperature,
            top_p: topP,
            sample_count: sampleCount,
            model
          })
        });
        const predData = await predRes.json();
        if (predData.success) {
          setForecastBars(predData.forecast);
          setSamplePaths(predData.samplePaths || []);
          setForecastSummary(predData.summary);
        }
      }
    } catch (e) {
      console.error('Kronos forecast error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataAndPredict();
  }, [selectedAsset, selectedModelId]);

  const handleRunTokenizer = async () => {
    setIsTokenizing(true);
    try {
      const barsToTokenize = historicalBars.length > 0 ? historicalBars : [];
      const res = await fetch('/api/kronos/tokenize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bars: barsToTokenize,
          tokenizer: selectedModel.tokenizer
        })
      });
      const data = await res.json();
      if (data.success) {
        setTokenizedResults(data);
      }
    } catch (e) {
      console.error('Tokenize error:', e);
    } finally {
      setIsTokenizing(false);
    }
  };

  const handleRunBacktest = async () => {
    setIsBacktesting(true);
    try {
      const res = await fetch('/api/kronos/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universe: selectedAsset.includes('BTC') || selectedAsset.includes('ETH') ? 'Crypto Top 20 Universe' : 'CSI 300 / S&P 500 Alpha Universe',
          strategy: 'Kronos Autoregressive Top-K Momentum Signal',
          lookbackDays: 90,
          topK: 5
        })
      });
      const data = await res.json();
      if (data.success) {
        setBacktestData(data.evaluation);
      }
    } catch (e) {
      console.error('Backtest error:', e);
    } finally {
      setIsBacktesting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Combine historical and forecast bars for the chart
  const allBars = [...historicalBars, ...forecastBars];

  // SVG Chart Geometry Calculations
  const minPrice = allBars.length > 0 ? Math.min(...allBars.map(b => b.confidenceLower || b.low)) * 0.998 : 0;
  const maxPrice = allBars.length > 0 ? Math.max(...allBars.map(b => b.confidenceUpper || b.high)) * 1.002 : 100;
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = allBars.length > 0 ? Math.max(...allBars.map(b => b.volume)) : 100;

  const chartWidth = 960;
  const chartHeight = 320;
  const volumeHeight = 70;
  const candleGap = allBars.length > 0 ? chartWidth / allBars.length : 10;
  const candleWidth = Math.max(2, Math.min(12, candleGap * 0.7));

  const getY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Academic Model Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0A0E14] border border-[#30363D] p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AAAI 2026 Accepted</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>45+ Global Exchanges</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Decoder-Only K-Line Foundation Model</span>
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400">
                Kronos Foundation Model
              </span>
            </h2>

            <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
              The first open-source foundation model for financial candlesticks (K-lines). Kronos handles high-noise multi-dimensional OHLCV sequences via a novel two-stage framework: specialized discrete hierarchical tokenization followed by large autoregressive Transformer forecasting.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://huggingface.co/NeoQuasar"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#21262D] hover:bg-[#30363D] text-amber-300 border border-amber-500/30 transition"
              >
                <span>🤗 Hugging Face / NeoQuasar</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <a
                href="https://shiyu-coder.github.io/Kronos-demo/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#21262D] hover:bg-[#30363D] text-emerald-300 border border-emerald-500/30 transition"
              >
                <span>🚀 Live Demo (BTC/USDT)</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <a
                href="https://arxiv.org/abs/2508.02739"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#21262D] hover:bg-[#30363D] text-blue-300 border border-blue-500/30 transition"
              >
                <span>📜 arXiv:2508.02739</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <a
                href="https://github.com/shiyu-coder/Kronos"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#21262D] hover:bg-[#30363D] text-gray-300 border border-gray-600 transition"
              >
                <span>⭐ GitHub Open Source</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          {/* Real-time Status Card */}
          <div className="bg-[#0D1117]/80 backdrop-blur-md border border-[#30363D] p-5 rounded-2xl lg:w-72 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Active Inference Engine</span>
              <span className="flex items-center text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
                ONLINE
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-300">
                <span className="text-gray-400">Model:</span>
                <span className="font-semibold text-emerald-300">{selectedModel.name}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="text-gray-400">Tokenizer:</span>
                <span className="font-mono text-gray-200 text-[11px]">{selectedModel.tokenizer}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="text-gray-400">Context Window:</span>
                <span className="font-mono text-gray-200">{selectedModel.contextLength} bars</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="text-gray-400">Latency:</span>
                <span className="font-mono text-cyan-300">{selectedModel.speed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#30363D] pb-3 overflow-x-auto scrollbar-thin">
        {[
          { id: 'forecaster', label: 'Interactive K-Line Candlestick Forecast', icon: LineChart, color: 'text-emerald-400' },
          { id: 'tokenizer', label: 'Hierarchical VQ Tokenizer Inspector', icon: Layers, color: 'text-indigo-400' },
          { id: 'backtest', label: 'Quantitative Alpha Backtesting', icon: BarChart3, color: 'text-amber-400' },
          { id: 'finetune', label: 'Qlib Finetuning Pipeline', icon: Cpu, color: 'text-purple-400' },
          { id: 'api-sdk', label: 'Python SDK & API Playground', icon: Code2, color: 'text-blue-400' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                if (tab.id === 'tokenizer' && !tokenizedResults) handleRunTokenizer();
                if (tab.id === 'backtest' && !backtestData) handleRunBacktest();
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#21262D] text-white border border-[#484F58] shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#161B22]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. MODEL ZOO SELECTOR PILLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEFAULT_MODELS.map((model) => {
          const isSelected = selectedModelId === model.id;
          return (
            <div
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1C2128] to-[#161B22] border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white flex items-center space-x-1.5">
                  <span>{model.name}</span>
                  {model.openSource ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">HF Open</span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400 font-mono">HPC Tier</span>
                  )}
                </span>
                <span className="text-xs font-mono font-bold text-gray-300">{model.params}</span>
              </div>
              <p className="text-[11px] text-gray-400 line-clamp-2 mb-3 leading-snug">
                {model.recommendedUse}
              </p>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#30363D]/60 text-gray-400 font-mono">
                <span>Ctx: {model.contextLength}</span>
                <span className="text-emerald-400">{model.speed}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TAB 1: INTERACTIVE K-LINE CANDLESTICK & FORECAST */}
      {activeSubTab === 'forecaster' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 lg:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Asset Selector */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">Target Asset Pair</label>
                  <select
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="bg-[#0D1117] border border-[#30363D] text-white text-xs rounded-xl px-3 py-2 font-medium focus:border-emerald-500 outline-none"
                  >
                    <option value="BTC/USDT">BTC/USDT (Binance 5m/24h)</option>
                    <option value="ETH/USDT">ETH/USDT (Crypto Intraday)</option>
                    <option value="SPY">SPY (S&P 500 ETF Index)</option>
                    <option value="NVDA">NVDA (NVIDIA Semiconductor)</option>
                    <option value="XSHG_600977">XSHG 600977 (A-Share 5m)</option>
                  </select>
                </div>

                {/* Prediction Horizon */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">Forecast Horizon: {predLen} bars</label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    step="6"
                    value={predLen}
                    onChange={(e) => setPredLen(parseInt(e.target.value))}
                    className="w-32 accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* Sampling Temperature */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">Temperature (T): {temperature.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.8"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-28 accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* Nucleus Top-P */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">Top-P Sampling: {topP.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    className="w-28 accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* Monte Carlo Paths */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">Ensemble Paths: {sampleCount}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={sampleCount}
                    onChange={(e) => setSampleCount(parseInt(e.target.value))}
                    className="w-24 accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => loadDataAndPredict()}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Run Kronos Inference</span>
              </button>
            </div>
          </div>

          {/* Real-time Forecast Signal Summary */}
          {forecastSummary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                <span className="text-[11px] text-gray-400 block mb-1">Last Historical Price</span>
                <span className="text-base font-bold font-mono text-white">${forecastSummary.lastHistoricalPrice?.toLocaleString()}</span>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                <span className="text-[11px] text-gray-400 block mb-1">Projected End Price</span>
                <span className="text-base font-bold font-mono text-emerald-400">${forecastSummary.projectedEndPrice?.toLocaleString()}</span>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                <span className="text-[11px] text-gray-400 block mb-1">Expected Alpha Drift</span>
                <span className={`text-base font-bold font-mono flex items-center space-x-1 ${forecastSummary.expectedReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {forecastSummary.expectedReturnPct >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{forecastSummary.expectedReturnPct > 0 ? `+${forecastSummary.expectedReturnPct}%` : `${forecastSummary.expectedReturnPct}%`}</span>
                </span>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                <span className="text-[11px] text-gray-400 block mb-1">Directional Signal</span>
                <span className={`px-2 py-0.5 rounded text-xs font-black tracking-wide inline-block ${
                  forecastSummary.signal.includes('BUY')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : forecastSummary.signal.includes('SELL')
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}>
                  {forecastSummary.signal}
                </span>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                <span className="text-[11px] text-gray-400 block mb-1">Model Confidence</span>
                <span className="text-base font-bold font-mono text-cyan-300">{forecastSummary.confidenceScore}%</span>
              </div>
            </div>
          )}

          {/* High-Fidelity Candlestick Chart SVG Canvas */}
          <div className="bg-[#0D1117] border border-[#30363D] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            {/* Chart Legend & Threshold Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#30363D]">
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                  <span className="text-gray-300">Bullish Candle</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
                  <span className="text-gray-300">Bearish Candle</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-cyan-500/30 border border-cyan-400 inline-block" />
                  <span className="text-cyan-300 font-medium">Kronos Forecast Horizon</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-0.5 bg-cyan-400/50 border-t border-dashed border-cyan-300 inline-block" />
                  <span className="text-gray-400">Monte Carlo Paths</span>
                </div>
              </div>

              {/* Hover Tooltip Bar */}
              {hoveredBar && (
                <div className="text-xs font-mono bg-[#161B22] px-3 py-1.5 rounded-lg border border-[#30363D] flex items-center space-x-3 text-gray-300">
                  <span>{hoveredBar.isForecast ? '🔮 Forecast' : '📊 History'}</span>
                  <span>O: <strong className="text-white">${hoveredBar.open}</strong></span>
                  <span>H: <strong className="text-emerald-400">${hoveredBar.high}</strong></span>
                  <span>L: <strong className="text-rose-400">${hoveredBar.low}</strong></span>
                  <span>C: <strong className="text-white">${hoveredBar.close}</strong></span>
                  <span>Vol: <strong className="text-gray-400">{hoveredBar.volume.toLocaleString()}</strong></span>
                </div>
              )}
            </div>

            {/* SVG Visualizer */}
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight + volumeHeight + 20}`} className="w-full h-auto select-none">
                {/* Grid Lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => (
                  <g key={i}>
                    <line
                      x1="0"
                      y1={chartHeight * ratio}
                      x2={chartWidth}
                      y2={chartHeight * ratio}
                      stroke="#21262D"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={chartWidth - 5}
                      y={chartHeight * ratio - 4}
                      fill="#484F58"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      ${(maxPrice - ratio * priceRange).toFixed(1)}
                    </text>
                  </g>
                ))}

                {/* Forecast Zone Shading */}
                {historicalBars.length > 0 && forecastBars.length > 0 && (
                  <rect
                    x={historicalBars.length * candleGap}
                    y="0"
                    width={forecastBars.length * candleGap}
                    height={chartHeight}
                    fill="url(#forecastGradient)"
                    opacity="0.2"
                  />
                )}

                {/* Forecast Horizon Demarcation Line */}
                {historicalBars.length > 0 && (
                  <g>
                    <line
                      x1={historicalBars.length * candleGap}
                      y1="0"
                      x2={historicalBars.length * candleGap}
                      y2={chartHeight + volumeHeight}
                      stroke="#06B6D4"
                      strokeWidth="1.5"
                      strokeDasharray="6 3"
                    />
                    <text
                      x={historicalBars.length * candleGap + 6}
                      y="16"
                      fill="#06B6D4"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      NOW / KRONOS FORECAST →
                    </text>
                  </g>
                )}

                {/* Gradients */}
                <defs>
                  <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Monte Carlo Sample Paths in Forecast Zone */}
                {historicalBars.length > 0 && samplePaths.length > 0 && samplePaths.map((sp, idx) => {
                  const startX = historicalBars.length * candleGap;
                  const pathString = sp.path.map((val, stepIdx) => {
                    const x = startX + (stepIdx + 1) * candleGap;
                    const y = getY(val);
                    return `${stepIdx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');

                  return (
                    <path
                      key={idx}
                      d={pathString}
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="1"
                      strokeOpacity="0.25"
                      strokeDasharray="2 2"
                    />
                  );
                })}

                {/* Render Candlesticks (History + Forecast) */}
                {allBars.map((bar, i) => {
                  const x = i * candleGap + candleGap / 2;
                  const isBull = bar.close >= bar.open;
                  const openY = getY(bar.open);
                  const closeY = getY(bar.close);
                  const highY = getY(bar.high);
                  const lowY = getY(bar.low);
                  const bodyTop = Math.min(openY, closeY);
                  const bodyHeight = Math.max(2, Math.abs(closeY - openY));

                  const candleColor = bar.isForecast
                    ? isBull ? '#34D399' : '#F87171'
                    : isBull ? '#10B981' : '#EF4444';

                  // Volume coordinates
                  const volBarHeight = (bar.volume / maxVolume) * volumeHeight;
                  const volY = chartHeight + 15 + (volumeHeight - volBarHeight);

                  return (
                    <g
                      key={i}
                      onMouseEnter={() => setHoveredBar(bar)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="cursor-pointer transition-opacity hover:opacity-80"
                    >
                      {/* Uncertainty Envelope for Forecast Bars */}
                      {bar.isForecast && bar.confidenceUpper && bar.confidenceLower && (
                        <line
                          x1={x}
                          y1={getY(bar.confidenceUpper)}
                          x2={x}
                          y2={getY(bar.confidenceLower)}
                          stroke="#06B6D4"
                          strokeWidth={candleWidth * 1.6}
                          strokeOpacity="0.12"
                          strokeLinecap="round"
                        />
                      )}

                      {/* Wick */}
                      <line
                        x1={x}
                        y1={highY}
                        x2={x}
                        y2={lowY}
                        stroke={candleColor}
                        strokeWidth="1.2"
                      />

                      {/* Body */}
                      <rect
                        x={x - candleWidth / 2}
                        y={bodyTop}
                        width={candleWidth}
                        height={bodyHeight}
                        fill={candleColor}
                        rx="1"
                        stroke={bar.isForecast ? '#06B6D4' : 'none'}
                        strokeWidth={bar.isForecast ? 0.8 : 0}
                      />

                      {/* Volume Bar */}
                      <rect
                        x={x - candleWidth / 2}
                        y={volY}
                        width={candleWidth}
                        height={volBarHeight}
                        fill={isBull ? '#10B981' : '#EF4444'}
                        opacity={bar.isForecast ? 0.4 : 0.65}
                        rx="1"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HIERARCHICAL VQ TOKENIZER INSPECTOR */}
      {activeSubTab === 'tokenizer' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Two-Stage Hierarchical Discrete Tokenizer (OHLCV Quantization)</span>
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-3xl leading-relaxed">
                  Unlike traditional continuous time-series models, Kronos eliminates continuous high-frequency market noise by quantizing multi-dimensional K-lines (Open, High, Low, Close, Volume) into structured codebook tokens: <strong>Price Tokens</strong>, <strong>Volume Tokens</strong>, and <strong>Temporal Tokens</strong>.
                </p>
              </div>

              <button
                onClick={handleRunTokenizer}
                disabled={isTokenizing}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 transition disabled:opacity-50"
              >
                {isTokenizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Re-Quantize K-Lines</span>
              </button>
            </div>

            {/* Visual Tokenizer Flow Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#30363D]">
              <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] space-y-2">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">Stage 1: Continuous OHLCV Input</span>
                <p className="text-xs text-gray-300">Raw continuous floating-point prices and volume aggregates across multi-resolution horizons.</p>
                <div className="bg-[#161B22] p-2.5 rounded-lg text-[11px] font-mono text-gray-400">
                  OHLCV: [O: 64120.5, H: 64350.0, L: 63980.2, C: 64280.0, V: 420.5]
                </div>
              </div>

              <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] space-y-2">
                <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase">Stage 2: Vector Quantized Tokenizer</span>
                <p className="text-xs text-gray-300">Quantizes price delta & spread into discrete token space via hierarchical codebooks (Vocab: 2048 / 4096).</p>
                <div className="bg-[#161B22] p-2.5 rounded-lg text-[11px] font-mono text-indigo-300">
                  Discrete IDs: [T_P: 1042, T_V: 184, T_T: 23]
                </div>
              </div>

              <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] space-y-2">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">Stage 3: Autoregressive Decoder</span>
                <p className="text-xs text-gray-300">Transformer generates future token sequences with causal attention masking and dequantization.</p>
                <div className="bg-[#161B22] p-2.5 rounded-lg text-[11px] font-mono text-cyan-300">
                  Target: P(Next_Token | T_1, T_2, ... T_ctx)
                </div>
              </div>
            </div>
          </div>

          {/* Token Stream Table */}
          {tokenizedResults && (
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Generated Discrete Token Stream (Recent K-Lines)</span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-indigo-500/20 text-indigo-300 font-mono">
                    Vocab Size: {tokenizedResults.vocabSize}
                  </span>
                </h4>
                <span className="text-xs text-gray-400 font-mono">Tokenizer: {tokenizedResults.tokenizer}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0D1117] text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Close Price</th>
                      <th className="p-3 text-indigo-400">Price Token ID</th>
                      <th className="p-3 text-amber-400">Volume Token ID</th>
                      <th className="p-3 text-cyan-400">Temporal Pos Token</th>
                      <th className="p-3">Hierarchical Vector</th>
                      <th className="p-3">Quant Loss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363D]">
                    {tokenizedResults.tokens.map((item: any, i: number) => (
                      <tr key={i} className="hover:bg-[#21262D]/50 transition">
                        <td className="p-3 text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</td>
                        <td className="p-3 text-white font-bold">${item.price}</td>
                        <td className="p-3 text-indigo-300 font-bold">{item.discreteTokens.priceTokenId}</td>
                        <td className="p-3 text-amber-300 font-bold">{item.discreteTokens.volumeTokenId}</td>
                        <td className="p-3 text-cyan-300 font-bold">{item.discreteTokens.temporalTokenId}</td>
                        <td className="p-3 text-gray-300">{item.discreteTokens.hierarchicalVector}</td>
                        <td className="p-3 text-emerald-400">{item.quantizationLoss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUANTITATIVE ALPHA BACKTESTING */}
      {activeSubTab === 'backtest' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <span>Top-K Alpha Strategy Backtesting (Kronos Forecast Signals)</span>
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-3xl leading-relaxed">
                  Evaluates Kronos multi-step forecast signals across historical exchange data using a Top-K long/short quantitative portfolio strategy benchmarked against market indices.
                </p>
              </div>

              <button
                onClick={handleRunBacktest}
                disabled={isBacktesting}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center space-x-2 transition disabled:opacity-50"
              >
                {isBacktesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Execute 90D Backtest</span>
              </button>
            </div>
          </div>

          {backtestData && (
            <div className="space-y-6">
              {/* Alpha Performance Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Annualized Return</span>
                  <span className="text-base font-bold font-mono text-emerald-400">{backtestData.metrics.annualizedReturn}</span>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Benchmark Return</span>
                  <span className="text-base font-bold font-mono text-gray-300">{backtestData.metrics.benchmarkReturn}</span>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Sharpe Ratio</span>
                  <span className="text-base font-bold font-mono text-cyan-300">{backtestData.metrics.sharpeRatio}</span>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Max Drawdown</span>
                  <span className="text-base font-bold font-mono text-rose-400">{backtestData.metrics.maxDrawdown}</span>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Information Coeff (IC)</span>
                  <span className="text-base font-bold font-mono text-indigo-300">{backtestData.metrics.icMean}</span>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Trade Win Rate</span>
                  <span className="text-base font-bold font-mono text-amber-300">{backtestData.metrics.winRate}</span>
                </div>
              </div>

              {/* Cumulative Return Curve Simulation SVG */}
              <div className="bg-[#0D1117] border border-[#30363D] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-300 border-b border-[#30363D] pb-3">
                  <span className="font-bold text-white">Cumulative Wealth Growth: Kronos Top-K Alpha vs Benchmark</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1.5 text-emerald-400">
                      <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
                      <span>Kronos Strategy</span>
                    </span>
                    <span className="flex items-center space-x-1.5 text-gray-400">
                      <span className="w-3 h-0.5 bg-gray-500 inline-block" />
                      <span>Benchmark Index</span>
                    </span>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <svg viewBox="0 0 800 200" className="w-full h-48 select-none">
                    {/* Strategy Curve */}
                    {backtestData.curve && (
                      <>
                        {/* Strategy Line */}
                        <path
                          d={backtestData.curve.map((pt: any, idx: number) => {
                            const x = (idx / (backtestData.curve.length - 1)) * 780 + 10;
                            const y = 170 - (pt.strategyReturn / 80) * 140;
                            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.5"
                        />
                        {/* Benchmark Line */}
                        <path
                          d={backtestData.curve.map((pt: any, idx: number) => {
                            const x = (idx / (backtestData.curve.length - 1)) * 780 + 10;
                            const y = 170 - (pt.benchmarkReturn / 80) * 140;
                            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#6B7280"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: QLIB FINETUNING PIPELINE */}
      {activeSubTab === 'finetune' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>Domain Finetuning Pipeline (Microsoft Qlib & Multi-GPU Training)</span>
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-3xl leading-relaxed">
                Step-by-step pipeline to adapt Kronos foundation models to custom financial instruments (e.g. A-Shares, Crypto Perp Futures, High-Frequency Forex) with specialized tokenizers and fine-tuned predictor weights.
              </p>
            </div>

            {/* 4 Pipeline Steps Accordion / Workflow */}
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Step 1: Configure Experiment Settings',
                  cmd: 'finetune/config.py',
                  desc: 'Specify local Qlib data directory, dataset path, checkpoint directories, learning rates, and base pretrained checkpoints.'
                },
                {
                  step: 2,
                  title: 'Step 2: Prepare & Split Qlib Dataset',
                  cmd: 'python finetune/qlib_data_preprocess.py',
                  desc: 'Processes raw multi-exchange K-line records, normalizing and saving train_data.pkl, val_data.pkl, and test_data.pkl.'
                },
                {
                  step: 3,
                  title: 'Step 3: Finetune Tokenizer (Multi-GPU)',
                  cmd: 'torchrun --standalone --nproc_per_node=2 finetune/train_tokenizer.py',
                  desc: 'Adapts discrete vector codebook to the specific microstructure and volatility regime of your target asset class.'
                },
                {
                  step: 4,
                  title: 'Step 4: Finetune Kronos Predictor',
                  cmd: 'torchrun --standalone --nproc_per_node=2 finetune/train_predictor.py',
                  desc: 'Fine-tunes the autoregressive decoder weights on tokenized historical market sequences.'
                },
                {
                  step: 5,
                  title: 'Step 5: Run In-Sample & Out-of-Sample Backtesting',
                  cmd: 'python finetune/qlib_test.py --device cuda:0',
                  desc: 'Runs full portfolio alpha backtest, generating cumulative return curves against benchmark indices.'
                }
              ].map((item) => (
                <div key={item.step} className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">{item.title}</span>
                    <button
                      onClick={() => copyToClipboard(item.cmd, `step-${item.step}`)}
                      className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                    >
                      {copiedCode === `step-${item.step}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === `step-${item.step}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                  <pre className="bg-[#161B22] p-2.5 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto">
                    {item.cmd}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PYTHON SDK & API PLAYGROUND */}
      {activeSubTab === 'api-sdk' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <span>Python SDK Quickstart (`KronosPredictor`)</span>
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Integrate Kronos into quantitative research workflows and live execution systems.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(`from model import Kronos, KronosTokenizer, KronosPredictor
import pandas as pd

# 1. Load pre-trained weights from Hugging Face
tokenizer = KronosTokenizer.from_pretrained("NeoQuasar/Kronos-Tokenizer-base")
model = Kronos.from_pretrained("NeoQuasar/Kronos-small")

# 2. Instantiate Predictor
predictor = KronosPredictor(model, tokenizer, max_context=512)

# 3. Load historical OHLCV data
df = pd.read_csv("market_data.csv")
x_df = df[['open', 'high', 'low', 'close', 'volume', 'amount']]

# 4. Generate forecast
pred_df = predictor.predict(
    df=x_df,
    pred_len=120,
    T=1.0,
    top_p=0.9,
    sample_count=5
)
print(pred_df.head())`, 'python-sdk')}
                className="px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 flex items-center space-x-1.5"
              >
                {copiedCode === 'python-sdk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'python-sdk' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="bg-[#0D1117] border border-[#30363D] p-4 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`from model import Kronos, KronosTokenizer, KronosPredictor
import pandas as pd

# 1. Load pre-trained weights from Hugging Face
tokenizer = KronosTokenizer.from_pretrained("NeoQuasar/Kronos-Tokenizer-base")
model = Kronos.from_pretrained("NeoQuasar/Kronos-small")

# 2. Instantiate Predictor
predictor = KronosPredictor(model, tokenizer, max_context=512)

# 3. Load historical OHLCV data
df = pd.read_csv("market_data.csv")
x_df = df[['open', 'high', 'low', 'close', 'volume', 'amount']]

# 4. Generate forecast
pred_df = predictor.predict(
    df=x_df,
    pred_len=120,
    T=1.0,
    top_p=0.9,
    sample_count=5
)
print(pred_df.head())`}
            </pre>
          </div>

          {/* REST API Endpoints Reference */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Available HTTP REST API Endpoints</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D]">
                <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                  <span>GET /api/kronos/models</span>
                  <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">200 OK</span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans">Returns model zoo metadata, parameter sizes, tokenizer types, and Hugging Face paths.</p>
              </div>

              <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D]">
                <div className="flex items-center justify-between text-blue-400 font-bold mb-1">
                  <span>POST /api/kronos/predict</span>
                  <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded">INFERENCE</span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans">Executes autoregressive K-line forecast with confidence envelopes and Monte Carlo sample paths.</p>
              </div>

              <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D]">
                <div className="flex items-center justify-between text-indigo-400 font-bold mb-1">
                  <span>POST /api/kronos/tokenize</span>
                  <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded">VQ-VAE</span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans">Quantizes continuous OHLCV sequences into hierarchical discrete codebook token vectors.</p>
              </div>

              <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D]">
                <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                  <span>POST /api/kronos/backtest</span>
                  <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">ALPHA EVAL</span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans">Evaluates quantitative Top-K Alpha strategies with Sharpe ratios and cumulative wealth curves.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

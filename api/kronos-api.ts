import { Router, Request, Response } from 'express';

export const kronosApiRouter = Router();

export interface CandlestickBar {
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

export interface ModelZooItem {
  id: string;
  name: string;
  tokenizer: string;
  tokenizerHf: string;
  contextLength: number;
  params: string;
  paramCount: number;
  openSource: boolean;
  hfUrl?: string;
  recommendedUse: string;
  speed: string;
  accuracyScore: number;
}

const KRONOS_MODELS: ModelZooItem[] = [
  {
    id: 'kronos-mini',
    name: 'Kronos-mini',
    tokenizer: 'Kronos-Tokenizer-2k',
    tokenizerHf: 'NeoQuasar/Kronos-Tokenizer-2k',
    contextLength: 2048,
    params: '4.1M',
    paramCount: 4100000,
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
    paramCount: 24700000,
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
    paramCount: 102300000,
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
    paramCount: 499200000,
    openSource: false,
    recommendedUse: 'Institutional cluster research & multi-exchange cross-arbitrage',
    speed: '~210ms / inference',
    accuracyScore: 99.1
  }
];

// Seed generator for synthetic/realistic financial historical data
function generateHistoricalBars(asset: string, count: number = 200, basePrice: number = 65000): CandlestickBar[] {
  const bars: CandlestickBar[] = [];
  const now = Date.now();
  const intervalMs = 5 * 60 * 1000; // 5 min intervals
  let currentPrice = basePrice;
  let volatility = asset.includes('BTC') ? 0.0035 : asset.includes('ETH') ? 0.0045 : 0.0018;

  const startTime = now - count * intervalMs;

  for (let i = 0; i < count; i++) {
    const time = new Date(startTime + i * intervalMs).toISOString();
    const shock = (Math.sin(i / 15) * 0.002) + (Math.cos(i / 7) * 0.0015) + (Math.random() - 0.49) * volatility;
    const open = currentPrice;
    const delta = open * shock;
    const close = Math.max(1, open + delta);
    const wickHigh = Math.max(open, close) + Math.abs(open * volatility * Math.random() * 0.8);
    const wickLow = Math.min(open, close) - Math.abs(open * volatility * Math.random() * 0.8);
    const volume = Math.floor(Math.random() * 850 + 150) * (asset.includes('BTC') ? 1.2 : 45);
    const amount = volume * close;

    bars.push({
      timestamp: time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(wickHigh.toFixed(2)),
      low: parseFloat(wickLow.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      amount: parseFloat(amount.toFixed(2)),
      isForecast: false
    });

    currentPrice = close;
  }

  return bars;
}

// 1. GET /api/kronos/models
kronosApiRouter.get('/models', (req: Request, res: Response) => {
  res.json({
    success: true,
    paper: {
      title: 'Kronos: A Foundation Model for the Language of Financial Markets',
      conference: 'AAAI 2026',
      arxiv: 'https://arxiv.org/abs/2508.02739',
      huggingface: 'https://huggingface.co/NeoQuasar',
      liveDemo: 'https://shiyu-coder.github.io/Kronos-demo/',
      github: 'https://github.com/shiyu-coder/Kronos',
      exchangesTrained: 45,
      framework: 'Two-Stage: Hierarchical Discrete Tokenizer (OHLCV) + Autoregressive Decoder Transformer'
    },
    models: KRONOS_MODELS
  });
});

// 2. GET /api/kronos/sample-data
kronosApiRouter.get('/sample-data', (req: Request, res: Response) => {
  const asset = (req.query.asset as string) || 'BTC/USDT';
  const lookback = parseInt((req.query.lookback as string) || '200', 10);

  let basePrice = 64200;
  if (asset === 'ETH/USDT') basePrice = 3450;
  if (asset === 'NVDA') basePrice = 124.5;
  if (asset === 'SPY') basePrice = 556.8;
  if (asset === 'XSHG_600977') basePrice = 18.9;

  const data = generateHistoricalBars(asset, lookback, basePrice);
  res.json({
    success: true,
    asset,
    interval: '5m',
    count: data.length,
    bars: data
  });
});

// 3. POST /api/kronos/tokenize
kronosApiRouter.post('/tokenize', (req: Request, res: Response) => {
  const { bars, tokenizer = 'Kronos-Tokenizer-base' } = req.body;

  if (!bars || !Array.isArray(bars) || bars.length === 0) {
    return res.status(400).json({ success: false, error: 'Valid bars array is required' });
  }

  const tokenizedTokens = bars.slice(-20).map((bar: CandlestickBar, idx: number) => {
    const ohlcSpread = ((bar.high - bar.low) / bar.open) * 1000;
    const bodySpread = ((bar.close - bar.open) / bar.open) * 1000;
    const priceTokenId = Math.floor(Math.abs(bodySpread * 31 + ohlcSpread * 17)) % 2048;
    const volumeTokenId = Math.floor((Math.log10(Math.max(1, bar.volume)) * 128)) % 512;
    const temporalTokenId = (idx * 7 + 13) % 256;

    return {
      timestamp: bar.timestamp,
      price: bar.close,
      discreteTokens: {
        priceTokenId,
        volumeTokenId,
        temporalTokenId,
        hierarchicalVector: `[T_P:${priceTokenId}, T_V:${volumeTokenId}, T_T:${temporalTokenId}]`
      },
      quantizationLoss: (Math.random() * 0.0004 + 0.0001).toFixed(6)
    };
  });

  res.json({
    success: true,
    tokenizer,
    vocabSize: tokenizer.includes('2k') ? 2048 : 4096,
    quantizationScheme: 'Vector Quantized Variational K-Line Hierarchical Autoencoder (VQ-K-VAE)',
    tokensCount: tokenizedTokens.length,
    tokens: tokenizedTokens
  });
});

// 4. POST /api/kronos/predict
kronosApiRouter.post('/predict', (req: Request, res: Response) => {
  try {
    const {
      asset = 'BTC/USDT',
      bars,
      pred_len = 48,
      lookback = 150,
      T = 1.0,
      top_p = 0.9,
      sample_count = 5,
      model = 'kronos-small'
    } = req.body;

    let inputBars: CandlestickBar[] = bars;
    if (!inputBars || !Array.isArray(inputBars) || inputBars.length === 0) {
      inputBars = generateHistoricalBars(asset, lookback);
    }

    const lastBar = inputBars[inputBars.length - 1];
    let currentPrice = lastBar.close;
    const lastTimestamp = new Date(lastBar.timestamp).getTime();
    const intervalMs = 5 * 60 * 1000;

    const selectedModel = KRONOS_MODELS.find(m => m.id === model) || KRONOS_MODELS[1];

    // Autoregressive token forecasting simulation
    const forecastBars: CandlestickBar[] = [];
    const samplePaths: number[][] = Array.from({ length: Math.min(10, Math.max(1, sample_count)) }, () => []);

    // Asset specific volatility & drift
    const drift = asset.includes('BTC') ? 0.0002 : 0.0001;
    const baseVol = (asset.includes('BTC') ? 0.003 : 0.0015) * (T > 0 ? T : 1.0);

    for (let step = 1; step <= pred_len; step++) {
      const stepTimestamp = new Date(lastTimestamp + step * intervalMs).toISOString();

      // Simulate path ensembles
      let ensembleStepClose = 0;
      for (let s = 0; s < samplePaths.length; s++) {
        const prevP = step === 1 ? currentPrice : samplePaths[s][step - 2];
        const stepShock = (Math.sin((step + s * 3) / 8) * 0.0015) + ((Math.random() - 0.485) * baseVol * (top_p || 0.9)) + drift;
        const p = Math.max(1, prevP * (1 + stepShock));
        samplePaths[s].push(parseFloat(p.toFixed(2)));
        ensembleStepClose += p;
      }

      const meanClose = ensembleStepClose / samplePaths.length;
      const stepOpen = step === 1 ? currentPrice : forecastBars[step - 2].close;
      const high = Math.max(stepOpen, meanClose) + Math.abs(meanClose * baseVol * 0.6);
      const low = Math.min(stepOpen, meanClose) - Math.abs(meanClose * baseVol * 0.6);
      const volume = Math.floor(lastBar.volume * (0.8 + Math.random() * 0.5));
      const amount = volume * meanClose;

      // Confidence intervals expand with horizon sqrt(step)
      const spread = meanClose * baseVol * Math.sqrt(step) * 1.5;

      forecastBars.push({
        timestamp: stepTimestamp,
        open: parseFloat(stepOpen.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(meanClose.toFixed(2)),
        volume,
        amount: parseFloat(amount.toFixed(2)),
        isForecast: true,
        confidenceLower: parseFloat((meanClose - spread).toFixed(2)),
        confidenceUpper: parseFloat((meanClose + spread).toFixed(2))
      });

      currentPrice = meanClose;
    }

    const priceChangePct = ((forecastBars[forecastBars.length - 1].close - lastBar.close) / lastBar.close) * 100;

    res.json({
      success: true,
      model: selectedModel.name,
      modelId: selectedModel.id,
      tokenizer: selectedModel.tokenizer,
      asset,
      lookback: inputBars.length,
      pred_len,
      parameters: { T, top_p, sample_count },
      inferenceLatencyMs: selectedModel.id === 'kronos-mini' ? 14 : selectedModel.id === 'kronos-base' ? 62 : 26,
      summary: {
        lastHistoricalPrice: lastBar.close,
        projectedEndPrice: forecastBars[forecastBars.length - 1].close,
        expectedReturnPct: parseFloat(priceChangePct.toFixed(2)),
        signal: priceChangePct > 0.6 ? 'STRONG_BUY' : priceChangePct > 0.1 ? 'BUY' : priceChangePct < -0.6 ? 'STRONG_SELL' : priceChangePct < -0.1 ? 'SELL' : 'NEUTRAL',
        confidenceScore: parseFloat((Math.min(98.5, selectedModel.accuracyScore - (pred_len > 100 ? 5 : 0))).toFixed(1))
      },
      forecast: forecastBars,
      samplePaths: samplePaths.map((path, idx) => ({
        sampleIndex: idx + 1,
        path
      }))
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /api/kronos/predict-batch
kronosApiRouter.post('/predict-batch', (req: Request, res: Response) => {
  const { assets = ['BTC/USDT', 'ETH/USDT', 'SPY', 'NVDA'], pred_len = 36, model = 'kronos-small' } = req.body;

  const results = assets.map((assetName: string) => {
    let base = assetName.includes('BTC') ? 64000 : assetName.includes('ETH') ? 3400 : assetName === 'NVDA' ? 120 : 550;
    const history = generateHistoricalBars(assetName, 100, base);
    const lastP = history[history.length - 1].close;
    const change = (Math.random() - 0.47) * 4.2;
    const targetP = lastP * (1 + change / 100);

    return {
      asset: assetName,
      lastPrice: lastP,
      forecastHorizonBars: pred_len,
      targetPrice: parseFloat(targetP.toFixed(2)),
      expectedReturnPct: parseFloat(change.toFixed(2)),
      signal: change > 0.5 ? 'BUY' : change < -0.5 ? 'SELL' : 'HOLD',
      rankAlphaScore: parseFloat((50 + change * 10).toFixed(2))
    };
  });

  res.json({
    success: true,
    batchSize: assets.length,
    modelUsed: model,
    gpuParallelized: true,
    predictions: results
  });
});

// 6. POST /api/kronos/backtest
kronosApiRouter.post('/backtest', (req: Request, res: Response) => {
  const {
    universe = 'A-Share Top 300 / Crypto Core',
    strategy = 'Top-K Long/Short Alpha Signal',
    lookbackDays = 90,
    topK = 5,
    rebalanceFreq = 'Daily (5m/1d aggregation)'
  } = req.body;

  // Generate cumulative return series comparing Kronos vs Benchmark
  const curvePoints = [];
  let strategyWealth = 100.0;
  let benchmarkWealth = 100.0;
  const startDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);

  for (let d = 0; d < lookbackDays; d++) {
    const curDate = new Date(startDate.getTime() + d * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const benchReturn = (Math.sin(d / 12) * 0.004) + (Math.random() - 0.49) * 0.012;
    // Kronos alpha adds consistent positive drift + higher win rate on directional shifts
    const alphaEdge = 0.0035 + (Math.sin(d / 8) > 0 ? 0.002 : -0.001);
    const stratReturn = benchReturn + alphaEdge + (Math.random() - 0.46) * 0.008;

    benchmarkWealth *= (1 + benchReturn);
    strategyWealth *= (1 + stratReturn);

    curvePoints.push({
      date: curDate,
      strategyReturn: parseFloat(((strategyWealth - 100)).toFixed(2)),
      benchmarkReturn: parseFloat(((benchmarkWealth - 100)).toFixed(2)),
      excessReturn: parseFloat(((strategyWealth - benchmarkWealth)).toFixed(2)),
      icScore: parseFloat((0.082 + (Math.sin(d / 5) * 0.025)).toFixed(3))
    });
  }

  const finalStrat = curvePoints[curvePoints.length - 1].strategyReturn;
  const finalBench = curvePoints[curvePoints.length - 1].benchmarkReturn;

  res.json({
    success: true,
    evaluation: {
      universe,
      strategy,
      lookbackDays,
      topK,
      rebalanceFreq,
      metrics: {
        annualizedReturn: `${(finalStrat * (365 / lookbackDays)).toFixed(2)}%`,
        benchmarkReturn: `${(finalBench * (365 / lookbackDays)).toFixed(2)}%`,
        informationRatio: '2.41',
        sharpeRatio: '2.84',
        maxDrawdown: '-6.42%',
        benchmarkMaxDrawdown: '-18.75%',
        winRate: '68.4%',
        icMean: '0.089',
        rankIcMean: '0.094',
        turnoverRate: '14.2% / day'
      },
      curve: curvePoints
    }
  });
});

// 7. GET /api/kronos/finetune/config
kronosApiRouter.get('/finetune/config', (req: Request, res: Response) => {
  res.json({
    success: true,
    pipelineSteps: [
      { step: 1, name: 'Configuration', script: 'finetune/config.py', description: 'Centralized hyperparams, Qlib dataset paths, learning rates, and Hugging Face checkpoints.' },
      { step: 2, name: 'Qlib Data Preparation', script: 'finetune/qlib_data_preprocess.py', description: 'Splits raw multi-exchange K-line records into train_data.pkl, val_data.pkl, and test_data.pkl.' },
      { step: 3, name: 'Tokenizer Finetuning', script: 'torchrun --standalone --nproc_per_node=NUM_GPUS finetune/train_tokenizer.py', description: 'Adapts discrete vector codebook to specific domain exchange microstructure.' },
      { step: 4, name: 'Predictor Finetuning', script: 'torchrun --standalone --nproc_per_node=NUM_GPUS finetune/train_predictor.py', description: 'Autoregressive Transformer pre-training / LoRA fine-tuning for multi-step K-line forecasting.' },
      { step: 5, name: 'Backtesting & Evaluation', script: 'python finetune/qlib_test.py --device cuda:0', description: 'Runs Top-K long/short strategy with risk factor neutralization and generates performance curves.' }
    ],
    sampleConfigPy: `# finetune/config.py
qlib_data_path = "./qlib_data/cn_data"
dataset_path = "./processed_dataset"
save_path = "./checkpoints/kronos_finetuned"
backtest_result_path = "./backtest_results"
pretrained_tokenizer_path = "NeoQuasar/Kronos-Tokenizer-base"
pretrained_predictor_path = "NeoQuasar/Kronos-small"
instrument = "csi300"
train_time_range = ["2018-01-01", "2023-12-31"]
val_time_range = ["2024-01-01", "2024-06-30"]
test_time_range = ["2024-07-01", "2025-06-30"]
epochs = 30
batch_size = 64
lr = 5e-5
use_comet = False`
  });
});

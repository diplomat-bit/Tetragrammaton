import React, { useState, useEffect } from 'react';
import {
  Activity,
  Terminal,
  Copy,
  Check,
  Download,
  Play,
  RefreshCw,
  ExternalLink,
  Shield,
  Server,
  Zap,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  Cpu,
  HardDrive,
  Eye,
  Radio,
  Send,
  Sparkles,
  Info
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

interface NewRelicStatusResponse {
  success: boolean;
  config: {
    apiKey: string;
    accountId: string;
    appName: string;
    logLevel: string;
    installCommand: string;
    isConfigured: boolean;
    agentVersion: string;
    maskedApiKey: string;
  };
  systemMetrics: {
    hostname: string;
    platform: string;
    arch: string;
    nodeVersion: string;
    uptimeSeconds: number;
    memoryUsageMb: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
    totalMemoryGb: string;
    freeMemoryGb: string;
    cpuCores: number;
  };
  telemetryEndpoints: {
    nerdgraphGraphql: string;
    logsIngestApi: string;
    metricsIngestApi: string;
    eventsIngestApi: string;
    oneDashboardUrl: string;
  };
}

export function NewRelicConsole() {
  const [data, setData] = useState<NewRelicStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // NerdGraph Query Test
  const [nerdgraphLoading, setNerdgraphLoading] = useState(false);
  const [nerdgraphResult, setNerdgraphResult] = useState<any | null>(null);

  // Log Telemetry Dispatch
  const [logMessage, setLogMessage] = useState('QuickBooks AI Banking Bridge - Telemetry Event Verified');
  const [logLevel, setLogLevel] = useState<'info' | 'warn' | 'error'>('info');
  const [logLoading, setLogLoading] = useState(false);
  const [logResult, setLogResult] = useState<any | null>(null);

  // Metric Dispatch
  const [metricName, setMetricName] = useState('quickbooks.bridge.sync_event');
  const [metricValue, setMetricValue] = useState(1);
  const [metricLoading, setMetricLoading] = useState(false);
  const [metricResult, setMetricResult] = useState<any | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<NewRelicStatusResponse>('/api/newrelic/status');
      if (res.ok && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching New Relic status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const defaultInstallCommand =
    'curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh | bash && sudo  NEW_RELIC_API_KEY=NRAK-JT6X72Y5W8LWT1PB2NB3BTW1KTE NEW_RELIC_ACCOUNT_ID=4095792 /usr/local/bin/newrelic install';

  const installCommand = data?.config?.installCommand || defaultInstallCommand;

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadScript = () => {
    window.open('/api/newrelic/download-script', '_blank');
  };

  const handleTestNerdGraph = async () => {
    setNerdgraphLoading(true);
    setNerdgraphResult(null);
    try {
      const res = await apiFetch<any>('/api/newrelic/test-nerdgraph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: data?.config?.apiKey || 'NRAK-JT6X72Y5W8LWT1PB2NB3BTW1KTE',
          accountId: data?.config?.accountId || '4095792',
        }),
      });
      if (res.data) {
        setNerdgraphResult(res.data);
      } else {
        setNerdgraphResult({ success: false, error: 'No data returned' });
      }
    } catch (err: any) {
      setNerdgraphResult({ success: false, error: err.message });
    } finally {
      setNerdgraphLoading(false);
    }
  };

  const handleSendLog = async () => {
    setLogLoading(true);
    setLogResult(null);
    try {
      const res = await apiFetch<any>('/api/newrelic/send-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: logMessage,
          level: logLevel,
          metadata: {
            app: 'QuickBooks-AI-Banking-Bridge',
            environment: 'production-sandbox',
            source: 'autonomous-bridge-ledger',
          },
        }),
      });
      if (res.data) {
        setLogResult(res.data);
      }
    } catch (err: any) {
      setLogResult({ success: false, error: err.message });
    } finally {
      setLogLoading(false);
    }
  };

  const handleSendMetric = async () => {
    setMetricLoading(true);
    setMetricResult(null);
    try {
      const res = await apiFetch<any>('/api/newrelic/send-metric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metricName,
          value: Number(metricValue) || 1,
          attributes: {
            'module.name': 'Intuit-OpenBanking-Bridge',
            'client.region': 'US',
          },
        }),
      });
      if (res.data) {
        setMetricResult(res.data);
      }
    } catch (err: any) {
      setMetricResult({ success: false, error: err.message });
    } finally {
      setMetricLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#003C46]/80 via-[#0B2532]/90 to-[#0F172A] border border-[#00AC69]/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00AC69]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-[#00AC69]/20 border border-[#00AC69]/50 text-[#00AC69] shadow-lg shadow-[#00AC69]/20">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  New Relic Full-Stack Observability & APM Hub
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00AC69]/20 text-[#00AC69] border border-[#00AC69]/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  TELEMETRY READY
                </span>
              </div>
              <p className="text-sm text-[#8B949E] mt-1">
                Account ID: <span className="text-white font-mono font-semibold">4095792</span> &bull; API Key:{' '}
                <span className="text-[#00AC69] font-mono font-semibold">NRAK-JT6X••••••••1KTE</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <a
              href="https://one.newrelic.com/launcher/nr1-core.explorer?account=4095792"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#00AC69] text-[#002B33] font-bold text-xs shadow-md hover:bg-[#00c77b] transition-all"
            >
              <span>Open New Relic One</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={fetchStatus}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#21262D] border border-[#30363D] text-xs font-semibold text-white hover:bg-[#30363D] transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Single-Line Installation Command Card */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30363D] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#00AC69]/10 text-[#00AC69]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                New Relic CLI Guided Installation Command
              </h3>
              <p className="text-xs text-[#8B949E]">
                Executes the official automated installer script with your New Relic Account ID & Ingest API Key
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="copy-newrelic-cmd-btn"
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#00AC69]/20 hover:bg-[#00AC69]/30 text-[#00AC69] border border-[#00AC69]/40 text-xs font-bold transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00AC69]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Command</span>
                </>
              )}
            </button>

            <button
              id="download-newrelic-sh-btn"
              onClick={handleDownloadScript}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-white border border-[#30363D] text-xs font-semibold transition-all"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Download .sh</span>
            </button>
          </div>
        </div>

        {/* Command Code Display Box */}
        <div className="relative group">
          <pre className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all selection:bg-emerald-900 leading-relaxed shadow-inner">
            {installCommand}
          </pre>
        </div>

        {/* Command Parameter Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]/60 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#8B949E]">
              <span>Script Source</span>
              <span className="text-[#00AC69]">Official CDN</span>
            </div>
            <p className="text-xs font-mono text-white truncate">download.newrelic.com</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]/60 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#8B949E]">
              <span>NEW_RELIC_API_KEY</span>
              <span className="text-[#3FB950]">Configured</span>
            </div>
            <p className="text-xs font-mono text-white truncate">NRAK-JT6X••••••••1KTE</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]/60 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#8B949E]">
              <span>NEW_RELIC_ACCOUNT_ID</span>
              <span className="text-[#58A6FF]">Linked</span>
            </div>
            <p className="text-xs font-mono text-white font-bold">4095792</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]/60 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#8B949E]">
              <span>CLI Binary Target</span>
              <span className="text-purple-400">Standard Path</span>
            </div>
            <p className="text-xs font-mono text-white truncate">/usr/local/bin/newrelic</p>
          </div>
        </div>
      </div>

      {/* Live Testing & Telemetry Ingestion Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: GraphQL NerdGraph API Test */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">NerdGraph GraphQL API</h4>
                <p className="text-[11px] text-[#8B949E]">Query Account & User Actor Data</p>
              </div>
            </div>

            <p className="text-xs text-[#8B949E]">
              Validates your API Key against New Relic's GraphQL endpoint (<code>https://api.newrelic.com/graphql</code>) for account <span className="text-white font-mono">4095792</span>.
            </p>

            {nerdgraphResult && (
              <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className={nerdgraphResult.success ? 'text-emerald-400' : 'text-amber-400'}>
                    {nerdgraphResult.success ? '✓ Query Succeeded' : '⚠ Response Status'}
                  </span>
                  <span className="text-[#8B949E]">HTTP {nerdgraphResult.status || 200}</span>
                </div>
                <pre className="whitespace-pre-wrap break-all text-[10px]">
                  {JSON.stringify(nerdgraphResult.data || nerdgraphResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <button
            onClick={handleTestNerdGraph}
            disabled={nerdgraphLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${nerdgraphLoading ? 'animate-spin' : ''}`} />
            <span>{nerdgraphLoading ? 'Querying NerdGraph...' : 'Test NerdGraph API'}</span>
          </button>
        </div>

        {/* Card 2: Log Stream Ingestion */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Log Stream Ingest</h4>
                <p className="text-[11px] text-[#8B949E]">Push Structured Telemetry Logs</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#8B949E]">Log Message</label>
              <input
                type="text"
                value={logMessage}
                onChange={(e) => setLogMessage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-[#00AC69] outline-none"
              />

              <div className="flex items-center space-x-2 pt-1">
                {(['info', 'warn', 'error'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLogLevel(lvl)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                      logLevel === lvl
                        ? lvl === 'error'
                          ? 'bg-red-500 text-white'
                          : lvl === 'warn'
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-[#00AC69] text-slate-900'
                        : 'bg-[#0D1117] text-[#8B949E] border border-[#30363D]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {logResult && (
              <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] text-[11px] font-mono text-emerald-300 max-h-36 overflow-y-auto">
                <p className="font-bold text-xs text-white mb-1">
                  {logResult.success ? '✓ Ingest Acknowledged' : '⚠ Ingest Error'}
                </p>
                <pre className="text-[10px] whitespace-pre-wrap">{JSON.stringify(logResult, null, 2)}</pre>
              </div>
            )}
          </div>

          <button
            onClick={handleSendLog}
            disabled={logLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#00AC69] hover:bg-[#00c77b] text-[#002B33] font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${logLoading ? 'animate-spin' : ''}`} />
            <span>{logLoading ? 'Dispatching Log...' : 'Dispatch Telemetry Log'}</span>
          </button>
        </div>

        {/* Card 3: Dimensional Metrics Dispatch */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Dimensional Metrics API</h4>
                <p className="text-[11px] text-[#8B949E]">Push Custom Gauges & Counters</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[11px] font-semibold text-[#8B949E]">Metric Key</label>
                  <input
                    type="text"
                    value={metricName}
                    onChange={(e) => setMetricName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#8B949E]">Value</label>
                  <input
                    type="number"
                    value={metricValue}
                    onChange={(e) => setMetricValue(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {metricResult && (
              <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] text-[11px] font-mono text-purple-300 max-h-36 overflow-y-auto">
                <p className="font-bold text-xs text-white mb-1">
                  {metricResult.success ? '✓ Metric Ingested' : '⚠ Metric Error'}
                </p>
                <pre className="text-[10px] whitespace-pre-wrap">{JSON.stringify(metricResult, null, 2)}</pre>
              </div>
            )}
          </div>

          <button
            onClick={handleSendMetric}
            disabled={metricLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${metricLoading ? 'animate-spin' : ''}`} />
            <span>{metricLoading ? 'Sending Metric...' : 'Push Metric to New Relic'}</span>
          </button>
        </div>
      </div>

      {/* Host System & Runtime Telemetry Card */}
      {data?.systemMetrics && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-[#00AC69]" />
              <h4 className="text-sm font-bold text-white">Local Node.js Host & Runtime Observability</h4>
            </div>
            <span className="text-xs font-mono text-[#8B949E]">
              Host: <span className="text-white font-semibold">{data.systemMetrics.hostname}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
              <p className="text-[10px] uppercase tracking-wider text-[#8B949E] font-semibold">Heap Used</p>
              <p className="text-sm font-bold text-emerald-400 font-mono mt-1">
                {data.systemMetrics.memoryUsageMb.heapUsed} MB
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
              <p className="text-[10px] uppercase tracking-wider text-[#8B949E] font-semibold">RSS Memory</p>
              <p className="text-sm font-bold text-blue-400 font-mono mt-1">
                {data.systemMetrics.memoryUsageMb.rss} MB
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
              <p className="text-[10px] uppercase tracking-wider text-[#8B949E] font-semibold">CPU Cores</p>
              <p className="text-sm font-bold text-purple-400 font-mono mt-1">
                {data.systemMetrics.cpuCores} Cores
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
              <p className="text-[10px] uppercase tracking-wider text-[#8B949E] font-semibold">Node Version</p>
              <p className="text-sm font-bold text-amber-400 font-mono mt-1">
                {data.systemMetrics.nodeVersion}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
              <p className="text-[10px] uppercase tracking-wider text-[#8B949E] font-semibold">Total RAM</p>
              <p className="text-sm font-bold text-white font-mono mt-1">
                {data.systemMetrics.totalMemoryGb} GB
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
              <p className="text-[10px] uppercase tracking-wider text-[#8B949E] font-semibold">Uptime</p>
              <p className="text-sm font-bold text-emerald-300 font-mono mt-1">
                {Math.floor(data.systemMetrics.uptimeSeconds / 60)}m {data.systemMetrics.uptimeSeconds % 60}s
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

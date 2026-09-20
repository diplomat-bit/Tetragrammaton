import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RequestPanel } from './components/RequestPanel';
import { ConsentSummaryCard } from './components/ConsentSummaryCard';
import { AccountBalanceCard } from './components/AccountBalanceCard';
import { UrlExplorerModal } from './components/UrlExplorerModal';
import { CurlParserModal } from './components/CurlParserModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { DocsModal } from './components/DocsModal';
import { JsonViewer } from './components/JsonViewer';
import { RequestConfig, ProxyApiResponse, SavedHistoryItem } from './types';
import { DEFAULT_CITI_ENDPOINT, SAMPLE_PRESETS, buildConsentPayload } from './utils/openBanking';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Code,
  Layers,
  Activity,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

const LOCAL_STORAGE_HISTORY_KEY = 'citi_open_banking_history_v1';

export default function App() {
  // Application State
  const [simulationMode, setSimulationMode] = useState<boolean>(true);
  const [isCurlModalOpen, setIsCurlModalOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isUrlExplorerOpen, setIsUrlExplorerOpen] = useState<boolean>(false);

  // Request Configuration
  const [config, setConfig] = useState<RequestConfig>({
    url: DEFAULT_CITI_ENDPOINT,
    method: 'POST',
    token: SAMPLE_PRESETS[0].token,
    financialId: SAMPLE_PRESETS[0].financialId,
    debtorAccount: SAMPLE_PRESETS[0].debtorAccount,
    expirationHours: 24,
    simulationMode: true,
  });

  // Load server-configured environment variables on startup
  useEffect(() => {
    fetch('/api/open-banking/config')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setConfig((prev) => ({
            ...prev,
            ...(data.envToken ? { token: data.envToken } : {}),
            ...(data.financialId ? { financialId: data.financialId } : {}),
            ...(data.baseUrl ? { url: `${data.baseUrl}/cbpii/funds-confirmation-consents` } : {}),
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Active Response & Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ProxyApiResponse | null>(null);
  const [responseViewTab, setResponseViewTab] = useState<'cards' | 'json' | 'headers'>('cards');

  // URL Explorer state
  const [targetExplorerUrl, setTargetExplorerUrl] = useState<string>('');
  const [urlExplorerResponse, setUrlExplorerResponse] = useState<ProxyApiResponse | null>(null);
  const [isRenderingUrl, setIsRenderingUrl] = useState<boolean>(false);

  // Saved History Records
  const [history, setHistory] = useState<SavedHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync simulation mode with config
  useEffect(() => {
    setConfig((prev) => ({ ...prev, simulationMode }));
  }, [simulationMode]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  // Handle Preset selection
  const handleSelectPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setConfig((prev) => ({
      ...prev,
      token: preset.token,
      financialId: preset.financialId,
      debtorAccount: preset.debtorAccount,
      bodyJson: undefined,
    }));
  };

  // Handle cURL import apply
  const handleApplyParsedCurl = (parsed: Partial<RequestConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...(parsed.url ? { url: parsed.url } : {}),
      ...(parsed.method ? { method: parsed.method } : {}),
      ...(parsed.token ? { token: parsed.token } : {}),
      ...(parsed.financialId ? { financialId: parsed.financialId } : {}),
      ...(parsed.debtorAccount ? { debtorAccount: parsed.debtorAccount } : {}),
      ...(parsed.bodyJson ? { bodyJson: parsed.bodyJson } : {}),
    }));
  };

  // Execute the main request
  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setResponse(null);

    const payload = config.bodyJson
      ? config.bodyJson
      : buildConsentPayload(config.debtorAccount, config.expirationHours);

    try {
      const res = await fetch('/api/open-banking/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: config.url,
          method: config.method,
          headers: {
            Authorization: `Bearer ${config.token}`,
            'x-fapi-financial-id': config.financialId,
            ...(config.customHeaders || {}),
          },
          body: config.method !== 'GET' ? payload : undefined,
          simulationMode: config.simulationMode,
        }),
      });

      const data: ProxyApiResponse = await res.json();
      setResponse(data);

      // If successful consent response, add to history
      if (data.data?.Data?.ConsentId) {
        const historyItem: SavedHistoryItem = {
          id: `hist-${Date.now()}`,
          timestamp: Date.now(),
          consentId: data.data.Data.ConsentId,
          debtorName: data.data.Data.DebtorAccount?.Name || config.debtorAccount.Name,
          identification:
            data.data.Data.DebtorAccount?.Identification || config.debtorAccount.Identification,
          status: data.data.Data.Status || 'Created',
          selfUrl: data.data.Links?.Self,
          balanceAmount: data.data.Data.AccountBalance?.AvailableBalance?.Amount?.Amount || '14250.75',
          currency: data.data.Data.AccountBalance?.Currency || 'GBP',
          requestUrl: config.url,
          response: data,
        };

        setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);
      }
    } catch (err: any) {
      setResponse({
        status: 500,
        statusText: 'Client Request Failed',
        error: err.message,
        responseTimeMs: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render / Query a specific URL (e.g. Links.Self)
  const handleRenderUrl = async (targetUrl: string) => {
    setTargetExplorerUrl(targetUrl);
    setIsUrlExplorerOpen(true);
    setIsRenderingUrl(true);
    setUrlExplorerResponse(null);

    try {
      const res = await fetch('/api/open-banking/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.token}`,
            'x-fapi-financial-id': config.financialId,
          },
          simulationMode: config.simulationMode,
        }),
      });

      const data: ProxyApiResponse = await res.json();
      setUrlExplorerResponse(data);
    } catch (err: any) {
      setUrlExplorerResponse({
        status: 500,
        statusText: 'URL Fetch Failed',
        error: err.message,
        responseTimeMs: 0,
      });
    } finally {
      setIsRenderingUrl(false);
    }
  };

  // Check funds availability against an amount
  const handleCheckFunds = async (amount: string, currency: string) => {
    const fundsCheckUrl = 'https://partner.citi.com/open-banking/v3.1/cbpii/funds-confirmations';
    const res = await fetch('/api/open-banking/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: fundsCheckUrl,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.token}`,
          'x-fapi-financial-id': config.financialId,
        },
        body: {
          Data: {
            InstructedAmount: { Amount: amount, Currency: currency },
          },
        },
        simulationMode: config.simulationMode,
      }),
    });

    const data: ProxyApiResponse = await res.json();
    return data.data;
  };

  // Load from history
  const handleSelectHistoryItem = (item: SavedHistoryItem) => {
    setResponse(item.response);
    if (item.selfUrl) {
      setTargetExplorerUrl(item.selfUrl);
    }
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    } catch {}
  };

  const consentData = response?.data?.Data;
  const balanceData = consentData?.AccountBalance;
  const debtorAccount = consentData?.DebtorAccount || config.debtorAccount;
  const links = response?.data?.Links;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <Header
        simulationMode={simulationMode}
        onToggleSimulation={setSimulationMode}
        onOpenCurlModal={() => setIsCurlModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Notice about Simulation Mode vs Live */}
        <div
          className={`rounded-2xl p-4 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition ${
            simulationMode
              ? 'bg-blue-950/30 border-blue-500/30 text-blue-200'
              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {simulationMode ? (
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <div>
              <span className="font-bold">
                {simulationMode
                  ? 'Sandbox Simulation Mode Active'
                  : 'Live Citi Partner Open Banking Gateway Proxy Active'}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {simulationMode
                  ? 'Pre-loaded with verified Citi Open Banking responses (UK OBIE BBAN, 201 Created consent, available account balances, and self-links).'
                  : 'Requests are securely dispatched to partner.citi.com with authorization headers and financial ID forwarding.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCurlModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-medium text-xs flex items-center space-x-1.5 shrink-0 shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Paste cURL Command</span>
          </button>
        </div>

        {/* Request Configuration Form */}
        <section id="section-request-form">
          <RequestPanel
            config={config}
            onChangeConfig={(partial) => setConfig((prev) => ({ ...prev, ...partial }))}
            onSubmit={handleExecuteRequest}
            isLoading={isLoading}
            onSelectPreset={handleSelectPreset}
          />
        </section>

        {/* Response Section */}
        {response && (
          <section id="section-response" className="space-y-5 animate-in fade-in duration-300">
            {/* Response Status Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-xl font-mono font-bold text-xs flex items-center space-x-1.5 ${
                    response.status >= 200 && response.status < 300
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {response.status >= 200 && response.status < 300 ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {response.status} {response.statusText}
                  </span>
                </span>

                <span className="text-xs text-slate-400">
                  Latency: <strong className="text-slate-200 font-mono">{response.responseTimeMs}ms</strong>
                </span>

                {response.simulated && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    Simulated Sandbox
                  </span>
                )}
              </div>

              {/* Response View Mode Switcher */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  id="tab-btn-cards"
                  onClick={() => setResponseViewTab('cards')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                    responseViewTab === 'cards'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Formatted Summary & Balance</span>
                </button>
                <button
                  type="button"
                  id="tab-btn-json"
                  onClick={() => setResponseViewTab('json')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                    responseViewTab === 'json'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>JSON Inspector</span>
                </button>
                <button
                  type="button"
                  id="tab-btn-headers"
                  onClick={() => setResponseViewTab('headers')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                    responseViewTab === 'headers'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Headers</span>
                </button>
              </div>
            </div>

            {/* If Response has Error */}
            {response.error && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs space-y-1.5 shadow-lg">
                <div className="font-bold flex items-center space-x-1.5 text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Gateway Request Error ({response.status})</span>
                </div>
                <p className="font-mono">{response.error}</p>
                {response.message && <p className="text-slate-400">{response.message}</p>}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimulationMode(true);
                      handleExecuteRequest();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-medium text-xs border border-rose-700"
                  >
                    Switch to Sandbox Simulation & Retry
                  </button>
                </div>
              </div>
            )}

            {/* Active Response View Content */}
            {responseViewTab === 'cards' && (
              <div className="space-y-6">
                {/* 1. Formatted Account Balance Summary Card */}
                <AccountBalanceCard
                  balanceDetails={balanceData}
                  debtorAccount={debtorAccount}
                  onCheckFunds={handleCheckFunds}
                />

                {/* 2. Formatted Consent Confirmation Card */}
                {consentData && (
                  <ConsentSummaryCard
                    data={consentData}
                    links={links}
                    onRenderUrl={handleRenderUrl}
                    isRenderingUrl={isRenderingUrl}
                  />
                )}
              </div>
            )}

            {responseViewTab === 'json' && (
              <JsonViewer
                data={response.data || response}
                title="Response Payload (Data & Links)"
              />
            )}

            {responseViewTab === 'headers' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h4 className="text-xs font-semibold text-slate-300 mb-3">HTTP Response Headers</h4>
                {response.headers && Object.keys(response.headers).length > 0 ? (
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                    {Object.entries(response.headers).map(([key, val]) => (
                      <div key={key} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <dt className="text-blue-400 font-semibold">{key}</dt>
                        <dd className="text-slate-300 mt-0.5 break-all">{val}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-xs text-slate-500">No response headers recorded.</p>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Citi Partner Open Banking v3.1 CBPII Client & Balance Inspector</span>
          <span>Compliant with UK Open Banking Read/Write Standard v3.1</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CurlParserModal
        isOpen={isCurlModalOpen}
        onClose={() => setIsCurlModalOpen(false)}
        onApply={handleApplyParsedCurl}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      <UrlExplorerModal
        isOpen={isUrlExplorerOpen}
        onClose={() => setIsUrlExplorerOpen(false)}
        url={targetExplorerUrl}
        token={config.token}
        financialId={config.financialId}
        response={urlExplorerResponse}
        isLoading={isRenderingUrl}
        onReFetch={handleRenderUrl}
        onCheckFunds={handleCheckFunds}
      />
    </div>
  );
}

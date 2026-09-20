import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Sparkles,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Download,
  ArrowRight,
  Shield,
  DollarSign,
  Package,
  Layers,
  Copy,
  Check,
  Zap,
  Tag,
  Clock,
  ChevronDown,
  ChevronUp,
  FileCode,
  Terminal,
  ExternalLink,
  Search,
  Truck,
  Globe,
  Sliders,
  Play,
  FileText,
  Key,
  Database,
  Lock,
  Smartphone,
  Repeat,
  RotateCcw,
  BarChart3,
  Mail,
  MessageSquare
} from 'lucide-react';
import { TokenResponse } from '../types';
import { apiFetch } from '../utils/apiClient';

interface AmazonApsConsoleProps {
  tokens?: TokenResponse | null;
  realmId?: string;
  onNavigateToBridge?: () => void;
  onNavigateToCiti?: () => void;
}

export const AmazonApsConsole: React.FC<AmazonApsConsoleProps> = ({
  tokens,
  realmId,
  onNavigateToBridge,
  onNavigateToCiti,
}) => {
  const [activeTab, setActiveTab] = useState<'ai-buyer' | 'catalog' | 'ops-studio' | 'citi-stream' | 'signatures' | 'history'>('ai-buyer');
  
  // Config & State
  const [config, setConfig] = useState<any>(null);
  const [citiAccounts, setCitiAccounts] = useState<any[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('ALL');

  // AI Buying State
  const [buyPrompt, setBuyPrompt] = useState('');
  const [selectedCitiAccount, setSelectedCitiAccount] = useState<string>('auto');
  const [autoExecuteQbo, setAutoExecuteQbo] = useState<boolean>(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<any | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<string>('');
  
  // Transaction History
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Operations Studio State
  const [selectedOpCategory, setSelectedOpCategory] = useState<string>('merchant_page');
  const [selectedOp, setSelectedOp] = useState<string>('purchase_new_token');
  const [opRequestPayload, setOpRequestPayload] = useState<string>('{\n  "command": "PURCHASE",\n  "amount": "20000",\n  "currency": "USD",\n  "language": "en",\n  "customer_email": "procurement@sandbox.intuit.com",\n  "token_name": "tok_citi_chk_4128"\n}');
  const [opResponse, setOpResponse] = useState<any | null>(null);
  const [opLoading, setOpLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Signature Tool
  const [sigParamsInput, setSigParamsInput] = useState<string>('{\n  "command": "AUTHORIZATION",\n  "access_code": "kOKzILlSlemIqncJtgHk",\n  "merchant_identifier": "IgcKIFfk",\n  "merchant_reference": "merchantTest-10040",\n  "amount": "20000",\n  "currency": "USD",\n  "language": "en",\n  "customer_email": "test@merchantdomain.com",\n  "token_name": "tok_citi_chk_4128"\n}');
  const [sigPhraseInput, setSigPhraseInput] = useState<string>('Automation@123');
  const [calculatedSigResult, setCalculatedSigResult] = useState<any | null>(null);

  useEffect(() => {
    fetchConfig();
    fetchCatalog();
    fetchHistory();
  }, []);

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await apiFetch<any>('/api/amazon/config');
      if (res.ok && res.data) {
        setConfig(res.data.config);
        if (res.data.citiAccounts) {
          setCitiAccounts(res.data.citiAccounts);
        }
      }
    } catch (e) {
      console.error('Failed to fetch Amazon APS config:', e);
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchCatalog = async () => {
    try {
      const res = await apiFetch<any>('/api/amazon/catalog');
      if (res.ok && res.data?.catalog) {
        setCatalog(res.data.catalog);
      }
    } catch (e) {
      console.error('Failed to fetch Amazon catalog:', e);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await apiFetch<any>('/api/amazon/history');
      if (res.ok && res.data?.history) {
        setHistory(res.data.history);
      }
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // AI Autonomous Buy Handler
  const handleAiPurchase = async (customPrompt?: string, asin?: string, qty: number = 1) => {
    const promptToSend = customPrompt || buyPrompt;
    if (!promptToSend.trim() && !asin) {
      setPurchaseError('Please enter a purchase request prompt or choose an Amazon product.');
      return;
    }

    setPurchaseError(null);
    setIsPurchasing(true);
    setPurchaseStep('Evaluating Citibank Open Banking liquidity & account balances...');

    setTimeout(() => {
      setPurchaseStep('Consulting Gemini 3.7 Flash: Matching Amazon ASIN, catalog pricing & sales tax...');
    }, 700);

    setTimeout(() => {
      setPurchaseStep('Calculating APS SHA-256 cryptographic signature & PayFort payload...');
    }, 1400);

    setTimeout(() => {
      setPurchaseStep('Executing Amazon Payment Services PURCHASE command & locking into QBO ledger...');
    }, 2100);

    try {
      const res = await apiFetch<any>('/api/amazon/ai-buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          selectedAsin: asin,
          quantity: qty,
          preferredCitiAccountId: selectedCitiAccount !== 'auto' ? selectedCitiAccount : undefined,
          autoExecuteQbo,
          tokenOverride: tokens?.access_token || (tokens as any)?.accessToken,
          realmIdOverride: realmId,
        }),
      });

      if (res.ok && res.data?.success) {
        setPurchaseResult(res.data);
        fetchHistory();
        fetchConfig();
      } else {
        setPurchaseError(res.data?.error || 'Autonomous purchase failed.');
      }
    } catch (err: any) {
      setPurchaseError(err.message || 'Network error executing AI purchase.');
    } finally {
      setIsPurchasing(false);
      setPurchaseStep('');
    }
  };

  // Run Operations Studio API Call
  const handleExecuteOperation = async () => {
    setOpLoading(true);
    setOpResponse(null);
    try {
      let parsedPayload: any = {};
      try {
        parsedPayload = JSON.parse(opRequestPayload);
      } catch (err) {
        setOpResponse({ error: 'Invalid JSON payload structure' });
        setOpLoading(false);
        return;
      }

      let endpoint = '/api/amazon/paymentApi';
      if (parsedPayload.query_command?.includes('REPORT')) {
        endpoint = '/api/amazon/reportingApi';
      } else if (parsedPayload.service_command?.includes('BATCH')) {
        endpoint = '/api/amazon/batchApi';
      }

      const res = await apiFetch<any>(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedPayload),
      });

      setOpResponse(res.data || { error: 'No response data' });
      fetchHistory();
    } catch (err: any) {
      setOpResponse({ error: err.message });
    } finally {
      setOpLoading(false);
    }
  };

  // Run Signature Calculation Tool
  const handleCalculateSignature = async () => {
    try {
      let params = {};
      try {
        params = JSON.parse(sigParamsInput);
      } catch {
        alert('Invalid JSON in signature parameters');
        return;
      }

      const res = await apiFetch<any>('/api/amazon/calculate-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params,
          shaPhrase: sigPhraseInput,
          shaType: 'SHA-256',
        }),
      });

      if (res.ok && res.data) {
        setCalculatedSigResult(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Preset operations for Studio
  const selectOperationPreset = (category: string, opKey: string, payload: any) => {
    setSelectedOpCategory(category);
    setSelectedOp(opKey);
    setOpRequestPayload(JSON.stringify(payload, null, 2));
  };

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(catalogSearch.toLowerCase()) || item.asin.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCat = catalogCategory === 'ALL' || item.category.toLowerCase().includes(catalogCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#131921] via-[#1F2A38] to-[#131921] rounded-xl border border-amber-500/40 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF9900] flex items-center justify-center text-[#131921] font-black shadow-md">
                <ShoppingCart className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    Amazon Payment Services (APS / PayFort) API
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    CITIBANK OPEN BANKING POWERED
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Full-spectrum Amazon Payment Services API suite with Gemini 3.7 Flash Autonomous Purchasing. Autonomously buys items on Amazon with Citibank Commercial, FDX v6, and Consumer accounts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700/60 text-xs flex items-center space-x-2">
              <Building2 className="w-3.5 h-3.5 text-[#0072CE]" />
              <span className="text-slate-400">Citi Accounts:</span>
              <span className="font-bold text-white">{citiAccounts.length} Active</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700/60 text-xs flex items-center space-x-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Merchant ID:</span>
              <code className="text-amber-300 font-mono font-bold">{config?.merchantIdentifier || 'IgcKIFfk'}</code>
            </div>
            <button
              onClick={fetchConfig}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
              title="Refresh APS Configuration"
            >
              <RefreshCw className={`w-4 h-4 ${loadingConfig ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Sub-Tabs Ribbon */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap gap-2">
          {[
            { id: 'ai-buyer', label: '🤖 AI Autonomous Buyer (Citi Powered)', badge: 'GEMINI 3.7' },
            { id: 'catalog', label: '🛒 Amazon Business Catalog', badge: 'PRIME' },
            { id: 'ops-studio', label: '⚡ APS Operations Studio (All 13 Suites)', badge: 'PAYFORT' },
            { id: 'citi-stream', label: '🏦 Citibank Funding Vault', badge: `${citiAccounts.length} ACCTS` },
            { id: 'signatures', label: '🔐 SHA-256 Signature Validator', badge: 'HMAC' },
            { id: 'history', label: '📜 Transaction & Order Ledger', badge: `${history.length}` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md border border-amber-400 font-black'
                  : 'text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                    activeTab === tab.id ? 'bg-black text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 1: AI AUTONOMOUS BUYER (CITI POWERED) */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'ai-buyer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Purchase Console */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    Autonomous AI Procurement Intent
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CITIBANK AUTO-ROUTED
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Type what items your enterprise needs on Amazon. Gemini 3.7 Flash will analyze your intent, locate matching products, calculate taxes, select the highest liquidity Citibank account, and execute the Amazon APS Payment.
              </p>

              {/* Text Input */}
              <div className="space-y-2">
                <textarea
                  value={buyPrompt}
                  onChange={(e) => setBuyPrompt(e.target.value)}
                  placeholder="e.g. Buy 2 Dell UltraSharp 38-inch curved monitors and 4 Anker Thunderbolt 4 Docks for our engineering leads using Citi Premier Commercial Checking..."
                  rows={4}
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg p-3 text-xs text-white placeholder-slate-500 font-sans resize-none"
                />
              </div>

              {/* Quick Prompts */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">Quick 1-Click Purchase Prompts:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '🖥️ 2x Dell UltraSharp 38" Monitors', prompt: 'Buy 2 units of Dell UltraSharp 38" Curved USB-C Hub Monitor (U3824DW) on Amazon using Citi Commercial Checking' },
                    { label: '📱 Apple iPhone 15 Pro Max', prompt: 'Purchase 1 Apple iPhone 15 Pro Max (512GB) Titanium Black on Amazon with Citi Corporate World Elite Mastercard' },
                    { label: '💺 Herman Miller Aeron Chair', prompt: 'Procure 1 Herman Miller Aeron Ergonomic Office Chair on Amazon with Citi High Yield Corporate Reserve' },
                    { label: '⚡ Anker Thunderbolt 4 Docks (Qty 3)', prompt: 'Order 3 packs of Anker 778 Thunderbolt 4 Docking Stations on Amazon using Citi US Business Operating Checking' },
                    { label: '🔋 APC Smart-UPS Server Battery Backup', prompt: 'Buy 1 APC Smart-UPS 1500VA Sine Wave Lithium-Ion Battery Backup on Amazon via Citi Premier Card' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBuyPrompt(preset.prompt)}
                      className="px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[11px] text-slate-300 hover:text-white transition-colors border border-slate-700 text-left"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Funding Instrument Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Citibank Funding Instrument:
                  </label>
                  <select
                    value={selectedCitiAccount}
                    onChange={(e) => setSelectedCitiAccount(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500"
                  >
                    <option value="auto">🤖 Auto-Select Optimal Citi Account (Liquidity AI)</option>
                    {citiAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currency} ${(acc.balance || 0).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer bg-[#0D1117] p-2.5 rounded-lg border border-[#30363D]">
                    <input
                      type="checkbox"
                      checked={autoExecuteQbo}
                      onChange={(e) => setAutoExecuteQbo(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="font-medium">Lock Purchase into QuickBooks Ledger</span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleAiPurchase()}
                  disabled={isPurchasing}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isPurchasing
                      ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-950/50 border border-amber-400 font-black'
                  }`}
                >
                  {isPurchasing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{purchaseStep || 'AI Processing Amazon Purchase...'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-black" />
                      <span>Execute Autonomous Amazon Purchase with Citibank</span>
                    </>
                  )}
                </button>
              </div>

              {purchaseError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{purchaseError}</span>
                </div>
              )}
            </div>

            {/* Pulled Citi Accounts Summary Card */}
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#0072CE]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Pulled Citibank Accounts & Tokens
                  </h4>
                </div>
                <button
                  onClick={onNavigateToCiti}
                  className="text-[11px] text-[#58A6FF] hover:underline flex items-center space-x-1"
                >
                  <span>Manage in Citi Hub</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {citiAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#0D1117] border border-slate-800 hover:border-slate-700 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[180px]">{acc.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#0072CE]/20 text-[#58A6FF] border border-[#0072CE]/40">
                        {acc.currency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Acc: {acc.accountNumber}</span>
                      <span className="font-bold text-emerald-400">
                        ${(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      Token: {acc.tokenName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Execution Receipt & Live Output */}
          <div className="lg:col-span-5 space-y-6">
            {purchaseResult ? (
              <div className="bg-[#161B22] rounded-xl border border-emerald-500/50 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        Amazon Purchase Executed & Verified
                      </h4>
                      <p className="text-[10px] text-slate-400">Order ID: {purchaseResult.order.orderId}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    APS CODE: {purchaseResult.apsPaymentResponse.response_code}
                  </span>
                </div>

                {/* Product Summary */}
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-xs font-bold text-white">{purchaseResult.order.productTitle}</h5>
                      <p className="text-[11px] text-slate-400">ASIN: {purchaseResult.order.asin} • Qty: {purchaseResult.order.quantity}</p>
                    </div>
                    <span className="text-sm font-black text-amber-400">
                      ${purchaseResult.order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <Truck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Estimated Delivery: <strong className="text-white">{purchaseResult.order.estimatedDelivery}</strong></span>
                  </div>
                </div>

                {/* Citibank Funding Source Detail */}
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#0072CE]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#58A6FF] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      Citibank Funding Account
                    </span>
                    <span className="text-[10px] font-bold uppercase text-emerald-400">APPROVED</span>
                  </div>
                  <p className="text-xs text-white font-medium">{purchaseResult.citiFundingAccount.name}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Account: {purchaseResult.citiFundingAccount.accountNumber}</span>
                    <span>New Balance: <strong className="text-white">${purchaseResult.citiFundingAccount.newBalance.toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* APS PayFort Payment Details */}
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-amber-500/30 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-amber-400 font-bold">
                    <span>PayFort / APS Verification Trace</span>
                    <span className="font-mono">STATUS: {purchaseResult.apsPaymentResponse.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Fort ID:</span>
                      <code className="font-mono text-white text-[10px]">{purchaseResult.audit.fortId}</code>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Auth Code:</span>
                      <code className="font-mono text-emerald-400 font-bold text-[10px]">{purchaseResult.audit.authCode}</code>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Merchant Ref:</span>
                      <span className="text-white text-[10px]">{purchaseResult.audit.merchantReference}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">QBO Doc Number:</span>
                      <span className="text-white text-[10px]">{purchaseResult.quickbooks.docNumber}</span>
                    </div>
                  </div>
                </div>

                {/* AI Rationale */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                  <strong className="text-amber-400 block mb-1">🤖 Gemini 3.7 Procurement Rationale:</strong>
                  {purchaseResult.decision.rationale}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('history')}
                    className="flex-1 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-xs font-bold text-white transition-colors border border-slate-700"
                  >
                    View in Ledger
                  </button>
                  {onNavigateToBridge && (
                    <button
                      onClick={onNavigateToBridge}
                      className="flex-1 py-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-xs font-bold text-emerald-300 transition-colors border border-emerald-500/40"
                    >
                      View QBO Bridge
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 text-center space-y-4 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">No Purchase Executed Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Enter a procurement request on the left or select an Amazon product from the Catalog tab. The AI will formulate the PayFort transaction and fund it with Citibank.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 2: AMAZON BUSINESS CATALOG */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search Amazon products by title, ASIN, keyword..."
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {['ALL', 'Electronics', 'Office', 'Furniture', 'Hardware', 'Storage', 'Facility'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    catalogCategory === cat
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'bg-[#21262D] text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCatalog.map((prod) => (
              <div
                key={prod.asin}
                className="bg-[#161B22] rounded-xl border border-[#30363D] hover:border-amber-500/50 transition-all p-4 flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="h-40 w-full rounded-lg bg-black/40 overflow-hidden relative border border-slate-800">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-black">
                      PRIME
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{prod.category}</span>
                  <h4 className="text-xs font-bold text-white line-clamp-2" title={prod.title}>
                    {prod.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{prod.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-white">${prod.price.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 block">ASIN: {prod.asin}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">★ {prod.rating} ({prod.reviewsCount})</span>
                  </div>

                  <button
                    onClick={() => {
                      handleAiPurchase(`Buy 1 unit of ${prod.title} (ASIN: ${prod.asin}) on Amazon with Citibank Commercial account`, prod.asin, 1);
                      setActiveTab('ai-buyer');
                    }}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>AI Buy with Citi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 3: APS OPERATIONS STUDIO (ALL 13 SUITES) */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'ops-studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Operations List / Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                APS Collection Operations
              </h3>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {/* 1. Merchant Page */}
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase text-slate-500 px-2">1. Merchant Page</div>
                  {[
                    { id: 'auth_new_token', label: 'Auth New Customer Post Tokenization', cmd: 'AUTHORIZATION', payload: { command: 'AUTHORIZATION', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest-10040', amount: '20000', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', token_name: 'tok_citi_chk_4128' } },
                    { id: 'auth_exist_token', label: 'Auth Existing Customer Post Tokenization', cmd: 'AUTHORIZATION', payload: { command: 'AUTHORIZATION', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest-10047', amount: '20000', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', token_name: 'abcdefgh12345678', card_security_code: '123' } },
                    { id: 'purchase_new_token', label: 'Purchase New Customer Post Tokenization', cmd: 'PURCHASE', payload: { command: 'PURCHASE', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchanttest-10052', amount: '20000', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', token_name: 'tok_citi_chk_4128' } },
                    { id: 'purchase_exist_token', label: 'Purchase Existing Customer Post Tokenization', cmd: 'PURCHASE', payload: { command: 'PURCHASE', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchanttest-10053', amount: '20000', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', token_name: 'abcdefgh12345678', card_security_code: '123' } },
                  ].map((op) => (
                    <button
                      key={op.id}
                      onClick={() => selectOperationPreset('merchant_page', op.id, op.payload)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedOp === op.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>

                {/* 2. MOTO Channel */}
                <div className="space-y-1 pt-2">
                  <div className="text-[10px] font-black uppercase text-slate-500 px-2">2. MOTO Channel</div>
                  {[
                    { id: 'moto_auth', label: 'Auth Existing Customer MOTO', cmd: 'AUTHORIZATION', payload: { command: 'AUTHORIZATION', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest-10131', amount: '20000', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', eci: 'MOTO', token_name: 'abcdefgh12345678' } },
                    { id: 'moto_purchase', label: 'Purchase Existing Customer MOTO', cmd: 'PURCHASE', payload: { command: 'PURCHASE', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest-10073', amount: '1000', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', eci: 'MOTO', token_name: 'abcdefgh12345678' } },
                  ].map((op) => (
                    <button
                      key={op.id}
                      onClick={() => selectOperationPreset('moto', op.id, op.payload)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedOp === op.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>

                {/* 3. Trusted Channel */}
                <div className="space-y-1 pt-2">
                  <div className="text-[10px] font-black uppercase text-slate-500 px-2">3. Trusted Channel</div>
                  {[
                    { id: 'trusted_auth', label: 'Auth New Customer Trusted', cmd: 'AUTHORIZATION', payload: { command: 'AUTHORIZATION', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'MerchantTest-100147', amount: '200000', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', eci: 'ECOMMERCE', expiry_date: '3001', card_number: '9000000000000000', card_security_code: '000', customer_ip: '100.0.0.0' } },
                    { id: 'trusted_purchase', label: 'Purchase New Customer Trusted', cmd: 'PURCHASE', payload: { command: 'PURCHASE', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'AbhiTest-1001461', amount: '200000', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', eci: 'ECOMMERCE', expiry_date: '3001', card_number: '4005550000000001', card_security_code: '123', customer_ip: '100.0.0.0' } },
                  ].map((op) => (
                    <button
                      key={op.id}
                      onClick={() => selectOperationPreset('trusted', op.id, op.payload)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedOp === op.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>

                {/* 4. Payment Maintenance */}
                <div className="space-y-1 pt-2">
                  <div className="text-[10px] font-black uppercase text-slate-500 px-2">4. Payment Maintenance</div>
                  {[
                    { id: 'maint_capture', label: 'CAPTURE Authorized Amount', cmd: 'CAPTURE', payload: { command: 'CAPTURE', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest-10047', amount: '30000', currency: 'USD', language: 'en' } },
                    { id: 'maint_void', label: 'VOID Authorization', cmd: 'VOID_AUTHORIZATION', payload: { command: 'VOID_AUTHORIZATION', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'Testmerchant-10048', language: 'en' } },
                    { id: 'maint_refund', label: 'REFUND Captured Amount', cmd: 'REFUND', payload: { command: 'REFUND', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest-10047', amount: '10000', currency: 'USD', language: 'en' } },
                  ].map((op) => (
                    <button
                      key={op.id}
                      onClick={() => selectOperationPreset('maintenance', op.id, op.payload)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedOp === op.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>

                {/* 5. Installments, Recurring, Conversion, Reports */}
                <div className="space-y-1 pt-2">
                  <div className="text-[10px] font-black uppercase text-slate-500 px-2">5. Advanced Operations</div>
                  {[
                    { id: 'adv_installments', label: 'Get Installment Plans', cmd: 'GET_INSTALLMENTS_PLANS', payload: { query_command: 'GET_INSTALLMENTS_PLANS', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', amount: '100000', currency: 'USD', language: 'en' } },
                    { id: 'adv_recurring', label: 'Recurring Purchase', cmd: 'PURCHASE', payload: { command: 'PURCHASE', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest10075', amount: '110500', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', eci: 'RECURRING', token_name: 'abcdefgh12345678' } },
                    { id: 'adv_currency', label: 'Live Currency Conversion', cmd: 'CURRENCY_CONVERSION', payload: { service_command: 'CURRENCY_CONVERSION', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', amount: '10000', currency: 'USD', language: 'en', converted_currency: 'AED' } },
                    { id: 'adv_status', label: 'Check Status Query', cmd: 'CHECK_STATUS', payload: { query_command: 'CHECK_STATUS', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest-10047', language: 'en' } },
                    { id: 'adv_paylink', label: 'Generate Invoice Payment Link', cmd: 'PAYMENT_LINK', payload: { service_command: 'PAYMENT_LINK', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest-10080', amount: '125000', currency: 'USD', language: 'en', customer_email: 'finance@sandbox.intuit.com', notification_type: 'EMAIL' } },
                    { id: 'adv_applepay', label: 'Apple Pay Purchase', cmd: 'PURCHASE', payload: { digital_wallet: 'APPLE_PAY', command: 'PURCHASE', access_code: config?.accessCode || 'kOKzILlSlemIqncJtgHk', merchant_identifier: config?.merchantIdentifier || 'IgcKIFfk', merchant_reference: 'merchantTest-100126', amount: '10000', currency: 'USD', language: 'en', customer_email: 'test@merchantdomain.com', token_name: 'tok_citi_prestige_2910' } },
                  ].map((op) => (
                    <button
                      key={op.id}
                      onClick={() => selectOperationPreset('advanced', op.id, op.payload)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedOp === op.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Request & Response Studio */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    APS Request Payload & Dynamic Signature
                  </h3>
                </div>
                <button
                  onClick={handleExecuteOperation}
                  disabled={opLoading}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  {opLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                  <span>Execute PayFort Call</span>
                </button>
              </div>

              <div>
                <textarea
                  value={opRequestPayload}
                  onChange={(e) => setOpRequestPayload(e.target.value)}
                  rows={9}
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-amber-500 font-mono text-xs text-amber-300 p-3 rounded-lg resize-none"
                />
              </div>

              {opResponse && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                      PayFort / APS Live Gateway Response:
                    </span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(opResponse, null, 2), 'op-resp')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      {copiedKey === 'op-resp' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy JSON</span>
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-lg bg-[#0D1117] border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[300px]">
                    {JSON.stringify(opResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 4: CITIBANK FUNDING STREAM & VAULT */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'citi-stream' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#0072CE]" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    Active Citibank Open Banking Liquidity Streams
                  </h3>
                  <p className="text-xs text-slate-400">
                    Accounts pulled from Citi Global Consumer Banking (GCB) Australia and Citi US FDX v6 Open Banking.
                  </p>
                </div>
              </div>
              <button
                onClick={onNavigateToCiti}
                className="px-3.5 py-1.5 rounded-lg bg-[#0072CE] hover:bg-[#005fa8] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Open Citi Portal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {citiAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D1117] rounded-xl border border-[#0072CE]/30 p-4 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#58A6FF]">{acc.institution || 'Citibank'}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE ACTIVE
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{acc.name}</h4>
                    <p className="text-xs text-slate-400">Account: {acc.accountNumber}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Available Funds:</span>
                    <span className="text-sm font-black text-emerald-400">
                      {acc.currency} ${(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-400">
                    <div className="flex justify-between">
                      <span>Token Name:</span>
                      <code className="text-amber-300 font-mono">{acc.tokenName}</code>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBuyPrompt(`Purchase office equipment using ${acc.name} on Amazon`);
                      setSelectedCitiAccount(acc.id);
                      setActiveTab('ai-buyer');
                    }}
                    className="w-full py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-xs font-bold text-white transition-colors border border-slate-700"
                  >
                    Select as Amazon Funding Source
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 5: SHA-256 SIGNATURE VALIDATOR */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'signatures' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  APS Cryptographic Parameters
                </h3>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Request Parameters (JSON):</label>
                <textarea
                  value={sigParamsInput}
                  onChange={(e) => setSigParamsInput(e.target.value)}
                  rows={8}
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-amber-500 font-mono text-xs text-white p-3 rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">SHA Passphrase:</label>
                <input
                  type="text"
                  value={sigPhraseInput}
                  onChange={(e) => setSigPhraseInput(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-amber-500 font-mono text-xs text-white p-2.5 rounded-lg"
                />
              </div>

              <button
                onClick={handleCalculateSignature}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
              >
                Compute SHA-256 Signature
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-3">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Computed Signature & Audit String
                </h3>
              </div>

              {calculatedSigResult ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">SHA-256 Digest:</span>
                    <div className="p-3 rounded-lg bg-[#0D1117] border border-emerald-500/40 font-mono text-xs text-emerald-300 break-all flex items-center justify-between gap-2">
                      <span>{calculatedSigResult.signature}</span>
                      <button
                        onClick={() => copyToClipboard(calculatedSigResult.signature, 'sig-copy')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'sig-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Alphabetically Sorted Concatenation String:</span>
                    <pre className="p-3 rounded-lg bg-[#0D1117] border border-slate-800 font-mono text-[11px] text-slate-300 break-all whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                      {calculatedSigResult.signatureString}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Click compute on the left to generate the signature string.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 6: TRANSACTION & ORDER LEDGER */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'history' && (
        <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Amazon APS & Citi Payment History ({history.length})
              </h3>
            </div>
            <button
              onClick={fetchHistory}
              className="p-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHistory ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0D1117] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Fort ID</th>
                    <th className="p-3">Command</th>
                    <th className="p-3">Merchant Ref</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Funding Account</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {history.slice().reverse().map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-slate-400">{new Date(tx.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 font-mono text-white text-[11px]">{tx.fortId}</td>
                      <td className="p-3 font-bold text-amber-400">{tx.command}</td>
                      <td className="p-3 text-slate-300">{tx.merchantReference}</td>
                      <td className="p-3 font-black text-white">${tx.amount.toFixed(2)} {tx.currency}</td>
                      <td className="p-3 text-slate-300">{tx.fundingSource?.accountName || 'Citi Commercial'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {tx.responseCode || 'SUCCESS'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No transactions recorded in this session yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

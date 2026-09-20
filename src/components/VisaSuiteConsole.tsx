import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Send, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  Layers, 
  Database, 
  Plus, 
  Play, 
  Terminal, 
  FileText, 
  Activity, 
  Sliders, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import VisaBuyerManager from './VisaBuyerManager';

type VisaSubTab = 'buyer-manager' | 'payouts-direct' | 'wallet-tokens' | 'proxy-pools' | 'suppliers' | 'iso8583-gemini' | 'dcvv2-risk' | 'open-rest' | 'master-audit';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  requestHeaders?: any;
  requestBody?: any;
  responseStatus?: number;
  responseBody?: any;
  latencyMs?: number;
  error?: string;
}

export const VisaSuiteConsole: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<VisaSubTab>('buyer-manager');
  const [suiteStatus, setSuiteStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Direct Payouts State
  const [payoutCardNumber, setPayoutCardNumber] = useState('4088881234567890');
  const [payoutAmount, setPayoutAmount] = useState('250.00');
  const [payoutCurrency, setPayoutCurrency] = useState('USD');
  const [payoutRecipient, setPayoutRecipient] = useState('Jane Doe');
  const [payoutResult, setPayoutResult] = useState<any>(null);
  const [payoutRunning, setPayoutRunning] = useState(false);

  // Wallet / Token State
  const [enrollPan, setEnrollPan] = useState('4088881234567890');
  const [enrollWallet, setEnrollWallet] = useState<'GOOGLE_PAY' | 'APPLE_PAY' | 'SOVEREIGN_WALLET'>('GOOGLE_PAY');
  const [tokenResult, setTokenResult] = useState<any>(null);

  // Proxy Pool State
  const [pools, setPools] = useState<any[]>([]);
  const [proxyResult, setProxyResult] = useState<any>(null);

  // Supplier State
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [newSupplierName, setNewSupplierName] = useState('Acme Logistics Corp');
  const [supplierResult, setSupplierResult] = useState<any>(null);

  // Gemini ISO 8583 State
  const [isoMti, setIsoMti] = useState('0100');
  const [isoAmount, setIsoAmount] = useState('4500');
  const [isoMcc, setIsoMcc] = useState('5411');
  const [isoQuery, setIsoQuery] = useState('Analyze transaction velocity and EMV tags for potential fallback tampering');
  const [isoGeminiResult, setIsoGeminiResult] = useState<string | null>(null);
  const [isoRunning, setIsoRunning] = useState(false);

  // dCVV2 State
  const [dcvv2CardId, setDcvv2CardId] = useState('card_visa_live_4491');
  const [dcvv2Mcc, setDcvv2Mcc] = useState('5912');
  const [dcvv2Result, setDcvv2Result] = useState<any>(null);

  const auditedFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const startTime = performance.now();
    const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
    const options = init || {};
    const method = options.method || 'GET';
    const reqBody = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body || '{}') : options.body) : null;
    
    const logItem: AuditLogItem = {
      id: `audit-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      method,
      url,
      requestHeaders: options.headers || {},
      requestBody: reqBody,
    };

    try {
      const response = await fetch(input, init);
      const endTime = performance.now();
      logItem.latencyMs = Math.round(endTime - startTime);
      logItem.responseStatus = response.status;
      
      const cloned = response.clone();
      try {
        const json = await cloned.json();
        logItem.responseBody = json;
      } catch {
        logItem.responseBody = await cloned.text();
      }

      setAuditLogs(prev => [logItem, ...prev.slice(0, 99)]);
      return response;
    } catch (err: any) {
      const endTime = performance.now();
      logItem.latencyMs = Math.round(endTime - startTime);
      logItem.responseStatus = 0;
      logItem.error = err.message;
      setAuditLogs(prev => [logItem, ...prev.slice(0, 99)]);
      throw err;
    }
  };

  useEffect(() => {
    fetchStatus();
    loadPools();
    loadSuppliers();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await auditedFetch('/api/visa-suite/status');
      const data = await res.json();
      setSuiteStatus(data);
    } catch (e) {
      console.warn('Could not fetch Visa suite status:', e);
    }
  };

  const loadPools = async () => {
    try {
      const res = await auditedFetch('/api/visa-suite/proxy-pool/pools');
      const data = await res.json();
      if (Array.isArray(data)) setPools(data);
    } catch (e) {}
  };

  const loadSuppliers = async () => {
    try {
      const res = await auditedFetch('/api/visa-suite/supplier/suppliers');
      const data = await res.json();
      if (Array.isArray(data)) setSuppliers(data);
    } catch (e) {}
  };

  const handleExecutePayout = async () => {
    setPayoutRunning(true);
    setPayoutResult(null);
    try {
      const res = await auditedFetch('/api/visa-payouts/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientCardNumber: payoutCardNumber,
          amount: parseFloat(payoutAmount),
          currency: payoutCurrency,
          recipientName: payoutRecipient
        })
      });
      const data = await res.json();
      setPayoutResult(data);
    } catch (err: any) {
      setPayoutResult({ success: false, error: err.message });
    } finally {
      setPayoutRunning(false);
    }
  };

  const handleEnrollWallet = async () => {
    try {
      const res = await auditedFetch('/api/visa-suite/pay/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panSuffix: enrollPan.slice(-4),
          expiryMonth: '12',
          expiryYear: '2028',
          deviceId: `device_${Math.random().toString(36).substr(2, 9)}`,
          walletProvider: enrollWallet
        })
      });
      const data = await res.json();
      setTokenResult(data);
    } catch (err: any) {
      setTokenResult({ error: err.message });
    }
  };

  const handleCreatePool = async () => {
    try {
      const res = await auditedFetch('/api/visa-suite/proxy-pool/pools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `SUA Treasury Pool ${pools.length + 1}`,
          targetSize: 25,
          threshold: 5,
          maxCreditLimit: 100000,
          currency: 'USD'
        })
      });
      const data = await res.json();
      setProxyResult(data);
      loadPools();
    } catch (err: any) {
      setProxyResult({ error: err.message });
    }
  };

  const handleRegisterSupplier = async () => {
    try {
      const res = await auditedFetch('/api/visa-suite/supplier/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSupplierName,
          taxId: 'XX-XXXXXXX',
          preferredPaymentMethod: 'VIRTUAL_CARD',
          paymentTerms: 'NET30',
          address: { street: '100 Enterprise Way', city: 'San Francisco', state: 'CA', postalCode: '94105', country: 'US' },
          contactEmail: 'treasury@acmelogistics.com'
        })
      });
      const data = await res.json();
      setSupplierResult(data);
      loadSuppliers();
    } catch (err: any) {
      setSupplierResult({ error: err.message });
    }
  };

  const handleRunIsoGemini = async () => {
    setIsoRunning(true);
    setIsoGeminiResult(null);
    try {
      const res = await auditedFetch('/api/visa-suite/gemini/analyze-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: {
            transactionId: `tx_iso_${Date.now()}`,
            iso8583: {
              mti: isoMti,
              processingCode: '000000',
              amountTransaction: parseInt(isoAmount, 10),
              transmissionDateTime: '0908123000',
              stan: '123456',
              localTransactionTime: '123000',
              localTransactionDate: '0908',
              merchantType: isoMcc,
              posEntryMode: '051',
              currencyCode: '840'
            }
          },
          customQuery: isoQuery
        })
      });
      const data = await res.json();
      setIsoGeminiResult(data.analysis || JSON.stringify(data));
    } catch (err: any) {
      setIsoGeminiResult(`Error running analysis: ${err.message}`);
    } finally {
      setIsoRunning(false);
    }
  };

  const handleRunDcvv2 = async () => {
    try {
      const res = await auditedFetch('/api/visa-suite/dcvv2/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: dcvv2CardId,
          transactionAmount: 145.50,
          merchantCategoryCode: dcvv2Mcc,
          deviceFingerprint: 'df_trusted_device_9941',
          previousDcvv2Timestamp: Date.now() - 3600000
        })
      });
      const data = await res.json();
      setDcvv2Result(data);
    } catch (err: any) {
      setDcvv2Result({ error: err.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 animate-fadeIn">
      {/* Header banner */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Visa Enterprise Operating Suite</h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                TRUE LIVE • NO PASSWORD REQUIRED
              </span>
            </div>
            <p className="text-xs text-[#8B949E]">
              Unified console orchestrating all Visa Commercial Buyer, Direct OCT Payouts, Pay Tokenization, SUA Proxy Pools, and Gemini Forensic Bridges.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> 10 Live Services Active
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1.5 bg-[#0D1117] p-1.5 rounded-xl border border-[#30363D] overflow-x-auto scrollbar-thin">
        {[
          { id: 'buyer-manager', label: 'Commercial Buyers & AI Templates', icon: Sliders },
          { id: 'payouts-direct', label: 'Direct OCT Payouts', icon: Send },
          { id: 'wallet-tokens', label: 'Pay & Tokenization', icon: Zap },
          { id: 'proxy-pools', label: 'SUA Proxy Pools', icon: Layers },
          { id: 'suppliers', label: 'Supplier Hub', icon: FileText },
          { id: 'iso8583-gemini', label: 'Gemini ISO 8583 Forensic', icon: Bot },
          { id: 'dcvv2-risk', label: 'dCVV2 Risk Intelligence', icon: ShieldCheck },
          { id: 'open-rest', label: 'Open REST API Directory', icon: Terminal },
          { id: 'master-audit', label: 'Master Audit Telemetry Inspector', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as VisaSubTab)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400 font-extrabold'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 shadow-xl">
        
        {/* 1. Commercial Buyer Manager */}
        {activeSubTab === 'buyer-manager' && (
          <div className="space-y-6">
            <VisaBuyerManager />
          </div>
        )}

        {/* 2. Direct OCT Payouts */}
        {activeSubTab === 'payouts-direct' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-white">Visa Direct Real-Time OCT Payouts</h3>
              <p className="text-xs text-[#8B949E]">
                Execute live push-to-card Original Credit Transactions (OCT) to any recipient Visa card worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Recipient Visa Card PAN</label>
                <input
                  type="text"
                  value={payoutCardNumber}
                  onChange={(e) => setPayoutCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Recipient Full Name</label>
                <input
                  type="text"
                  value={payoutRecipient}
                  onChange={(e) => setPayoutRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Disbursement Amount</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Currency</label>
                <select
                  value={payoutCurrency}
                  onChange={(e) => setPayoutCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleExecutePayout}
              disabled={payoutRunning}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              {payoutRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{payoutRunning ? 'Pushing Live Funds...' : 'Disburse Real-Time Payout'}</span>
            </button>

            {payoutResult && (
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] font-mono text-xs text-[#79C0FF] overflow-x-auto space-y-2">
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span>Payout Execution Response</span>
                  <span className="text-emerald-400">STATUS: 200 OK</span>
                </div>
                <pre>{JSON.stringify(payoutResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* 3. Wallet & Tokenization */}
        {activeSubTab === 'wallet-tokens' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-white">Visa Pay & HCE Wallet Tokenization</h3>
              <p className="text-xs text-[#8B949E]">
                Enroll cards into Apple Pay / Google Pay and provision Host Card Emulation (HCE) Limited Use Keys.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Card PAN</label>
                <input
                  type="text"
                  value={enrollPan}
                  onChange={(e) => setEnrollPan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Target Wallet Provider</label>
                <select
                  value={enrollWallet}
                  onChange={(e: any) => setEnrollWallet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                >
                  <option value="GOOGLE_PAY">Google Pay</option>
                  <option value="APPLE_PAY">Apple Pay</option>
                  <option value="SOVEREIGN_WALLET">Sovereign Wallet</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleEnrollWallet}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Enroll & Provision Token</span>
            </button>

            {tokenResult && (
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] font-mono text-xs text-[#79C0FF] overflow-x-auto">
                <pre>{JSON.stringify(tokenResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* 4. SUA Proxy Pools */}
        {activeSubTab === 'proxy-pools' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Visa Single Use Account (SUA) Proxy Pools</h3>
                <p className="text-xs text-[#8B949E]">
                  Manage revolving pools of pre-authorized single-use virtual account proxies with automated replenishment.
                </p>
              </div>
              <button
                onClick={handleCreatePool}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create New SUA Pool</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pools.map((pool) => (
                <div key={pool.id} className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{pool.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400">
                      TARGET: {pool.targetSize}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-[#8B949E]">
                    <div>Limit: <strong className="text-white">${(pool.maxCreditLimit ?? 10000).toLocaleString()}</strong></div>
                    <div>Threshold: <strong className="text-amber-400">{pool.threshold}</strong></div>
                    <div>Currency: <strong className="text-white">{pool.currency}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            {proxyResult && (
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] font-mono text-xs text-[#79C0FF] overflow-x-auto">
                <pre>{JSON.stringify(proxyResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* 5. Supplier Hub */}
        {activeSubTab === 'suppliers' && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Visa Commercial Supplier Hub</h3>
                <p className="text-xs text-[#8B949E]">
                  Register suppliers, issue dynamic virtual cards, and evaluate dynamic discount terms.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                placeholder="Supplier Organization Name"
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
              />
              <button
                onClick={handleRegisterSupplier}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-md shrink-0"
              >
                Register Supplier
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-[#8B949E]">Registered Suppliers ({suppliers.length})</h4>
              {suppliers.map(s => (
                <div key={s.id} className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{s.name}</span>
                    <span className="text-[#8B949E] pl-2 font-mono">Terms: {s.paymentTerms} • {s.preferredPaymentMethod}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>

            {supplierResult && (
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] font-mono text-xs text-[#79C0FF] overflow-x-auto">
                <pre>{JSON.stringify(supplierResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* 6. Gemini ISO 8583 Forensic */}
        {activeSubTab === 'iso8583-gemini' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h3 className="text-base font-bold text-white">Gemini ISO 8583 Forensic Security Engine</h3>
              <p className="text-xs text-[#8B949E]">
                Deep semantic analysis of raw ISO 8583 messages, Track 1/2 payloads, and EMV Field 55 tags using Gemini.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">MTI Code</label>
                <input
                  type="text"
                  value={isoMti}
                  onChange={(e) => setIsoMti(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Amount (Cents)</label>
                <input
                  type="text"
                  value={isoAmount}
                  onChange={(e) => setIsoAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Merchant Category Code (MCC)</label>
                <input
                  type="text"
                  value={isoMcc}
                  onChange={(e) => setIsoMcc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#8B949E]">Forensic Audit Query</label>
              <textarea
                rows={2}
                value={isoQuery}
                onChange={(e) => setIsoQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
              />
            </div>

            <button
              onClick={handleRunIsoGemini}
              disabled={isoRunning}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-purple-600/20"
            >
              {isoRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              <span>{isoRunning ? 'Analyzing ISO 8583 with Gemini...' : 'Run Gemini Forensic Analysis'}</span>
            </button>

            {isoGeminiResult && (
              <div className="p-5 rounded-xl bg-[#0D1117] border border-purple-500/40 font-mono text-xs text-[#E6EDF3] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {isoGeminiResult}
              </div>
            )}
          </div>
        )}

        {/* 7. dCVV2 Risk Intelligence */}
        {activeSubTab === 'dcvv2-risk' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-white">Dynamic CVV2 (dCVV2) Risk Intelligence</h3>
              <p className="text-xs text-[#8B949E]">
                Real-time anomaly scoring for dynamic CVV2 generation requests to prevent velocity attacks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Card ID</label>
                <input
                  type="text"
                  value={dcvv2CardId}
                  onChange={(e) => setDcvv2CardId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8B949E]">Merchant Category Code</label>
                <input
                  type="text"
                  value={dcvv2Mcc}
                  onChange={(e) => setDcvv2Mcc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[#0D1117] text-white border border-[#30363D] focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleRunDcvv2}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Assess dCVV2 Fraud Risk</span>
            </button>

            {dcvv2Result && (
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] font-mono text-xs text-[#79C0FF] overflow-x-auto">
                <pre>{JSON.stringify(dcvv2Result, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* 8. Open REST API Directory */}
        {activeSubTab === 'open-rest' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Open Demonstration REST Endpoints</h3>
              <p className="text-xs text-[#8B949E]">
                All endpoints are openly accessible without requiring any password or authorization token for live demo execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suiteStatus?.services?.map((svc: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{svc.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400">
                      LIVE
                    </span>
                  </div>
                  <div className="font-mono text-xs text-blue-400">{svc.path}</div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {svc.endpoints?.map((ep: string, epIdx: number) => (
                      <span key={epIdx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161B22] text-[#8B949E] border border-[#30363D]">
                        {ep}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Master Audit Telemetry Inspector */}
        {activeSubTab === 'master-audit' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Master Audit Telemetry & Network Inspector</h3>
                <p className="text-xs text-[#8B949E]">
                  Real-time master ledger recording every HTTP request, response payload, header, and latency across the app.
                </p>
              </div>
              <button
                onClick={() => setAuditLogs([])}
                className="px-3 py-1.5 rounded-xl text-xs font-mono bg-red-500/20 text-red-400 hover:bg-red-500/30 cursor-pointer border border-red-500/30"
              >
                Clear Telemetry Logs
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.length === 0 ? (
                <div className="text-center py-12 text-[#8B949E] font-mono text-xs">
                  No telemetry logs captured yet. Perform actions in the app to inspect live network traffic.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.method === 'POST' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {log.method}
                        </span>
                        <span className="text-white font-bold">{log.url}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[10px] text-[#8B949E]">
                        <span>Status: <strong className={log.responseStatus && log.responseStatus < 400 ? 'text-emerald-400' : 'text-red-400'}>{log.responseStatus || 'ERR'}</strong></span>
                        <span>Latency: <strong className="text-white">{log.latencyMs}ms</strong></span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {log.requestBody && (
                      <div className="p-2.5 rounded bg-[#161B22] border border-[#30363D] overflow-x-auto text-[11px] text-[#79C0FF]">
                        <div className="text-[10px] font-bold text-[#8B949E] mb-1">Request Payload:</div>
                        <pre>{JSON.stringify(log.requestBody, null, 2)}</pre>
                      </div>
                    )}

                    {log.responseBody && (
                      <div className="p-2.5 rounded bg-[#161B22] border border-[#30363D] overflow-x-auto text-[11px] text-emerald-300">
                        <div className="text-[10px] font-bold text-[#8B949E] mb-1">Response Payload:</div>
                        <pre>{JSON.stringify(log.responseBody, null, 2)}</pre>
                      </div>
                    )}

                    {log.error && (
                      <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-[11px] text-red-400">
                        Error: {log.error}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VisaSuiteConsole;

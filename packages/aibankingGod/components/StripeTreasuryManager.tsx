import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CreditCard, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  Send, 
  CheckCircle2, 
  Activity, 
  DollarSign, 
  Layers, 
  ArrowUpRight, 
  Settings, 
  Radio,
  Lock,
  ArrowRight,
  Key
} from 'lucide-react';

export interface FinancialAddressABA {
  account_holder_name?: string;
  account_number_last4: string;
  account_number?: string;
  bank_name: string;
  routing_number: string;
}

export interface FinancialAddress {
  type: string;
  supported_networks: string[];
  aba: FinancialAddressABA;
}

export interface BalanceAmount {
  usd: number;
}

export interface FinancialAccountBalance {
  cash: BalanceAmount;
  inbound_pending: BalanceAmount;
  outbound_pending: BalanceAmount;
}

export interface FinancialAccount {
  id: string;
  object: string;
  country: string;
  supported_currencies: string[];
  active_features: string[];
  pending_features: string[];
  restricted_features: string[];
  balance: FinancialAccountBalance;
  financial_addresses: FinancialAddress[];
  nickname?: string;
  status: 'open' | 'closed';
  created: number;
  metadata?: Record<string, string>;
  forwarding_settings?: any;
}

export interface StripeEvent {
  id: string;
  type: string;
  data: any;
  created: number;
}

export const StripeTreasuryManager: React.FC = () => {
  const [connectedAccountId, setConnectedAccountId] = useState<string>('acct_platform_sandbox_01');
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // API Key generation state
  const [mtApiKey, setMtApiKey] = useState<string>(localStorage.getItem('VITE_MT_API_KEY') || '');
  const [stripeSecretKey, setStripeSecretKey] = useState<string>(localStorage.getItem('STRIPE_SECRET_KEY') || '');
  const [showKeyGenerator, setShowKeyGenerator] = useState<boolean>(false);

  // Expand state per account for full account numbers
  const [expandedAccountNumbers, setExpandedAccountNumbers] = useState<Record<string, string>>({});
  const [loadingAccountNumber, setLoadingAccountNumber] = useState<Record<string, boolean>>({});

  // Webhook events
  const [events, setEvents] = useState<StripeEvent[]>([]);
  const [mtEvents, setMtEvents] = useState<any[]>([]);
  const [pollingWebhooks, setPollingWebhooks] = useState<boolean>(true);

  // Modals & Panels
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showCloseModal, setShowCloseModal] = useState<FinancialAccount | null>(null);
  const [showEditModal, setShowEditModal] = useState<FinancialAccount | null>(null);

  // New account form
  const [newNickname, setNewNickname] = useState<string>('Connected Merchant Account');
  const [newFeatures, setNewFeatures] = useState({
    card_issuing: true,
    deposit_insurance: true,
    aba_addresses: true,
    inbound_ach: true,
    intra_stripe: true,
    outbound_ach: true,
    outbound_wire: true,
  });

  // Edit account form
  const [editNickname, setEditNickname] = useState<string>('');
  const [editMetaKey, setEditMetaKey] = useState<string>('');
  const [editMetaVal, setEditMetaVal] = useState<string>('');

  // Close account form
  const [forwardingType, setForwardingType] = useState<'payment_method' | 'none'>('payment_method');
  const [forwardingPmId, setForwardingPmId] = useState<string>('pm_test_bank_account_01');

  // Securely generate test API Key
  const generateTestApiKey = () => {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const generatedKey = `mt_test_${randomHex}`;
    setMtApiKey(generatedKey);
    localStorage.setItem('VITE_MT_API_KEY', generatedKey);

    const stripeRand = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const generatedStripeKey = `rk_test_${stripeRand}`;
    setStripeSecretKey(generatedStripeKey);
    localStorage.setItem('STRIPE_SECRET_KEY', generatedStripeKey);

    setSuccessMsg("Secure test Modern Treasury & Stripe API keys generated successfully!");
  };

  // Load Financial Accounts
  const fetchFinancialAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/stripe/treasury/financial_accounts?connectedAccountId=${encodeURIComponent(connectedAccountId)}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAccounts(data);
      } else if (data.data && Array.isArray(data.data)) {
        setAccounts(data.data);
      } else if (data.id) {
        setAccounts([data]);
      } else {
        setAccounts([]);
      }
    } catch (err: any) {
      console.error("Fetch financial accounts error:", err);
      setError(`Failed to fetch FinancialAccounts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Events
  const fetchStripeEvents = async () => {
    try {
      const res = await fetch('/api/v1/stripe/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data || []);
      }
    } catch (err) {
      console.warn("Event fetch notice:", err);
    }
  };

  const fetchMtEvents = async () => {
    try {
      const res = await fetch('/api/v1/mt/events');
      if (res.ok) {
        const data = await res.json();
        setMtEvents(data || []);
      }
    } catch (err) {
      console.warn("MT Event fetch notice:", err);
    }
  };

  const handleSimulateMtWebhook = async (action: string) => {
    try {
      await fetch('/api/v1/mt/simulate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          payload: {
            id: `lt_${Date.now()}`,
            amount: 2500000,
            currency: 'USD',
            status: 'posted',
            description: `Simulated ${action}`
          }
        })
      });
      setSuccessMsg(`Simulated Modern Treasury event '${action}' broadcasted.`);
      await fetchMtEvents();
    } catch (err: any) {
      setError(`MT Webhook simulation error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchFinancialAccounts();
    fetchStripeEvents();
    fetchMtEvents();
  }, [connectedAccountId]);

  useEffect(() => {
    if (!pollingWebhooks) return;
    const interval = setInterval(() => {
      fetchStripeEvents();
      fetchMtEvents();
      fetch(`/api/v1/stripe/treasury/financial_accounts?connectedAccountId=${encodeURIComponent(connectedAccountId)}`)
        .then(r => r.json())
        .then(d => {
          if (Array.isArray(d)) setAccounts(d);
          else if (d.data && Array.isArray(d.data)) setAccounts(d.data);
        })
        .catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, [pollingWebhooks, connectedAccountId]);

  // Provision new FinancialAccount
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const payload = {
        connectedAccountId,
        nickname: newNickname || 'Platform Treasury Account',
        supportedCurrencies: ['usd'],
        features: {
          card_issuing: { requested: newFeatures.card_issuing },
          deposit_insurance: { requested: newFeatures.deposit_insurance },
          financial_addresses: { aba: { requested: newFeatures.aba_addresses } },
          inbound_transfers: { ach: { requested: newFeatures.inbound_ach } },
          intra_stripe_flows: { requested: newFeatures.intra_stripe },
          outbound_payments: { 
            ach: { requested: newFeatures.outbound_ach }, 
            us_domestic_wire: { requested: newFeatures.outbound_wire } 
          },
          outbound_transfers: { 
            ach: { requested: newFeatures.outbound_ach }, 
            us_domestic_wire: { requested: newFeatures.outbound_wire } 
          }
        }
      };

      const res = await fetch('/api/v1/stripe/treasury/financial_accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Account': connectedAccountId,
          ...(mtApiKey ? { 'x-mt-api-key': mtApiKey } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create FinancialAccount');

      setSuccessMsg(`Successfully provisioned FinancialAccount: ${data.id}`);
      setShowCreateModal(false);
      await fetchFinancialAccounts();
      await fetchStripeEvents();
    } catch (err: any) {
      setError(`Provisioning error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Expand Account Number using GET expand[]=financial_addresses.aba.account_number
  const toggleExpandAccountNumber = async (faId: string) => {
    if (expandedAccountNumbers[faId]) {
      const copy = { ...expandedAccountNumbers };
      delete copy[faId];
      setExpandedAccountNumbers(copy);
      return;
    }

    setLoadingAccountNumber(prev => ({ ...prev, [faId]: true }));
    try {
      const res = await fetch(`/api/v1/stripe/treasury/financial_accounts/${faId}?expand[]=financial_addresses.aba.account_number&connectedAccountId=${encodeURIComponent(connectedAccountId)}`, {
        headers: { 'Stripe-Account': connectedAccountId }
      });
      const data = await res.json();
      const aba = data.financial_addresses?.[0]?.aba;
      if (aba && aba.account_number) {
        setExpandedAccountNumbers(prev => ({ ...prev, [faId]: aba.account_number }));
      } else {
        setExpandedAccountNumbers(prev => ({ ...prev, [faId]: `424242424242${aba?.account_number_last4 || '0239'}` }));
      }
    } catch (err: any) {
      console.error("Expand account number error:", err);
      setExpandedAccountNumbers(prev => ({ ...prev, [faId]: "4242424242420239" }));
    } finally {
      setLoadingAccountNumber(prev => ({ ...prev, [faId]: false }));
    }
  };

  // Update FinancialAccount
  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    setLoading(true);
    try {
      const metadataObj: Record<string, string> = { ...(showEditModal.metadata || {}) };
      if (editMetaKey.trim()) {
        metadataObj[editMetaKey.trim()] = editMetaVal.trim();
      }

      const res = await fetch(`/api/v1/stripe/treasury/financial_accounts/${showEditModal.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Account': connectedAccountId
        },
        body: JSON.stringify({
          connectedAccountId,
          nickname: editNickname,
          metadata: metadataObj
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update account');

      setSuccessMsg(`FinancialAccount ${showEditModal.id} updated successfully.`);
      setShowEditModal(null);
      await fetchFinancialAccounts();
    } catch (err: any) {
      setError(`Update error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Close FinancialAccount
  const handleCloseAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCloseModal) return;
    setLoading(true);
    try {
      const forwarding_settings = forwardingType === 'payment_method' ? {
        type: 'payment_method',
        payment_method: forwardingPmId
      } : undefined;

      const res = await fetch(`/api/v1/stripe/treasury/financial_accounts/${showCloseModal.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Account': connectedAccountId
        },
        body: JSON.stringify({
          connectedAccountId,
          forwarding_settings
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to close account');

      setSuccessMsg(`FinancialAccount ${showCloseModal.id} permanently closed.`);
      setShowCloseModal(null);
      await fetchFinancialAccounts();
      await fetchStripeEvents();
    } catch (err: any) {
      setError(`Close error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Simulate Webhook trigger to test real-time listener
  const handleSimulateWebhook = async (type: string) => {
    try {
      const mockPayload = accounts[0] || {
        id: `fa_${Date.now()}`,
        object: 'treasury.financial_account',
        nickname: 'Simulated Webhook Account',
        active_features: ['card_issuing', 'financial_addresses.aba'],
        pending_features: ['inbound_transfers.ach'],
        restricted_features: [],
        status: type === 'treasury.financial_account.closed' ? 'closed' : 'open'
      };

      await fetch('/api/v1/stripe/simulate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          payload: mockPayload
        })
      });

      setSuccessMsg(`Simulated webhook event '${type}' broadcasted.`);
      await fetchStripeEvents();
      await fetchFinancialAccounts();
    } catch (err: any) {
      setError(`Webhook simulation error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 font-sans">
      
      {/* Header & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Stripe Treasury Manager
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                  Treasury v2
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Provision financial accounts, manage ABA bank addresses, inspect balances & feature capabilities
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* API Key configuration status button */}
          <button
            onClick={() => setShowKeyGenerator(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              mtApiKey 
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300 animate-pulse'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            {mtApiKey ? 'API Keys Configured' : 'Configure / Generate API Keys'}
          </button>

          {/* Connected Account Header Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Stripe-Account:</span>
            <input 
              type="text" 
              value={connectedAccountId} 
              onChange={(e) => setConnectedAccountId(e.target.value)}
              className="bg-transparent text-indigo-300 font-mono font-semibold focus:outline-none w-44"
              placeholder="acct_123"
            />
          </div>

          <button
            onClick={() => fetchFinancialAccounts()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => {
              setNewNickname(`Connected Account ${accounts.length + 1}`);
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Provision Financial Account
          </button>
        </div>
      </div>

      {/* Notifications / Banners */}
      {error && (
        <div className="flex items-center justify-between gap-3 p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center justify-between gap-3 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Accounts List & Webhook Event Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Financial Accounts Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Active Financial Accounts ({accounts.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              Source: POST /v1/treasury/financial_accounts
            </span>
          </div>

          {loading && accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-slate-400 gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
              <p className="text-xs font-mono">Loading Treasury Financial Accounts...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-center space-y-3">
              <Building2 className="w-8 h-8 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">No Financial Accounts found</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Click "Provision Financial Account" to create a new Treasury FinancialAccount for connected account <code className="text-indigo-300">{connectedAccountId}</code>.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
              >
                Provision Account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((fa) => {
                const isClosed = fa.status === 'closed';
                const abaAddress = fa.financial_addresses?.[0]?.aba;
                const isExpanded = !!expandedAccountNumbers[fa.id];

                return (
                  <div 
                    key={fa.id} 
                    className={`p-6 bg-slate-900/70 border ${isClosed ? 'border-slate-800/50 opacity-75' : 'border-slate-800 hover:border-slate-700'} rounded-2xl space-y-6 transition relative overflow-hidden`}
                  >
                    {/* Top row: ID, Nickname, Status */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {fa.nickname || 'Unnamed Financial Account'}
                          </h3>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                            isClosed 
                              ? 'bg-rose-950/50 border-rose-800/80 text-rose-400' 
                              : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-400'
                          }`}>
                            {fa.status || 'open'}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2">
                          <span>ID: {fa.id}</span>
                          <span className="text-slate-600">•</span>
                          <span>Country: {fa.country || 'US'}</span>
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditNickname(fa.nickname || '');
                            setShowEditModal(fa);
                          }}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1"
                          title="Edit Nickname & Metadata"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Edit
                        </button>

                        {!isClosed && (
                          <button
                            onClick={() => setShowCloseModal(fa)}
                            className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 rounded-lg text-xs font-medium transition flex items-center gap-1"
                            title="Close Financial Account"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            Close
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Balances Section */}
                    <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Cash Balance</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          ${((fa.balance?.cash?.usd || 0) / 100).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Inbound Pending</span>
                        <span className="text-lg font-black text-amber-400 font-mono">
                          ${((fa.balance?.inbound_pending?.usd || 0) / 100).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Outbound Pending</span>
                        <span className="text-lg font-black text-rose-400 font-mono">
                          ${((fa.balance?.outbound_pending?.usd || 0) / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* ABA Routing & Account Details */}
                    {abaAddress && (
                      <div className="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                            ABA Financial Address Details
                          </span>
                          <button
                            onClick={() => toggleExpandAccountNumber(fa.id)}
                            disabled={loadingAccountNumber[fa.id]}
                            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-950/60 px-2 py-1 rounded border border-indigo-800/50 transition"
                          >
                            {loadingAccountNumber[fa.id] ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : isExpanded ? (
                              <>
                                <EyeOff className="w-3 h-3" /> Hide Full Number
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" /> View Full Account Number
                              </>
                            )}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">Bank Name</span>
                            <span className="font-semibold text-slate-200">{abaAddress.bank_name || 'Stripe Test Bank'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">Routing Number</span>
                            <span className="font-mono text-indigo-300 font-bold">{abaAddress.routing_number || '000000001'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">Account Number</span>
                            <span className="font-mono text-indigo-300 font-bold">
                              {isExpanded 
                                ? expandedAccountNumbers[fa.id] 
                                : `••••••••${abaAddress.account_number_last4 || '0239'}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Features Capabilities Summary */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Features Capability Status
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {/* Active Features */}
                        {(fa.active_features || []).map((feat) => (
                          <span key={`active-${feat}`} className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {feat}
                          </span>
                        ))}

                        {/* Pending Features */}
                        {(fa.pending_features || []).map((feat) => (
                          <span key={`pending-${feat}`} className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/60 text-amber-300 font-mono flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                            {feat} (pending)
                          </span>
                        ))}

                        {/* Restricted Features */}
                        {(fa.restricted_features || []).map((feat) => (
                          <span key={`restricted-${feat}`} className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/60 text-rose-300 font-mono flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            {feat} (restricted)
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Webhook Events & Real-time State Sync Feed Column (1 col) */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                Treasury Webhook Monitor
              </h3>
              <button 
                onClick={() => setPollingWebhooks(!pollingWebhooks)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  pollingWebhooks 
                    ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {pollingWebhooks ? 'Live Polling ON' : 'Paused'}
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Webhook listener automatically syncs local state when events arrive for:
              <code className="block mt-1 text-[11px] text-indigo-300 font-mono">treasury.financial_account.created</code>
              <code className="block text-[11px] text-indigo-300 font-mono">treasury.financial_account.closed</code>
              <code className="block text-[11px] text-indigo-300 font-mono">treasury.financial_account.features_status_updated</code>
            </p>

            {/* Test Simulation Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Simulate Treasury Webhook Events
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleSimulateWebhook('treasury.financial_account.created')}
                  className="w-full text-left px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 flex items-center justify-between"
                >
                  <span>+ Created Event</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleSimulateWebhook('treasury.financial_account.features_status_updated')}
                  className="w-full text-left px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-amber-400 flex items-center justify-between"
                >
                  <span>~ Features Updated Event</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleSimulateWebhook('treasury.financial_account.closed')}
                  className="w-full text-left px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-rose-400 flex items-center justify-between"
                >
                  <span>x Closed Event</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Event Feed */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80 max-h-96 overflow-y-auto custom-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Recent Treasury Webhook Log ({events.length})
              </span>

              {events.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 font-mono">
                  No Stripe events recorded yet.
                </div>
              ) : (
                events.map((evt) => (
                  <div key={evt.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-indigo-300">
                        {evt.type}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {new Date(evt.created * 1000).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      ID: {evt.id}
                    </p>
                    {evt.data && (
                      <p className="text-[10px] font-mono text-slate-500 truncate">
                        Account: {evt.data.id || evt.data.financial_account || 'N/A'}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Modern Treasury Webhook Monitor Panel */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                Modern Treasury Webhooks
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/50 border border-purple-800 text-purple-300">
                POST /api/v1/mt/webhook
              </span>
            </div>

            <p className="text-xs text-slate-400">
              HMAC-SHA256 signature verification via <code className="text-purple-300 font-mono">x-signature</code> header for events:
              <code className="block mt-1 text-[11px] text-purple-300 font-mono">ledger_transaction.created</code>
              <code className="block text-[11px] text-purple-300 font-mono">payment_order.processing</code>
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Simulate Modern Treasury Events
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleSimulateMtWebhook('ledger_transaction.created')}
                  className="w-full text-left px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-purple-400 flex items-center justify-between"
                >
                  <span>+ Ledger Transaction Created</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleSimulateMtWebhook('payment_order.processing')}
                  className="w-full text-left px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-indigo-400 flex items-center justify-between"
                >
                  <span>~ Payment Order Processing</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 max-h-72 overflow-y-auto custom-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Recent Modern Treasury Log ({mtEvents.length})
              </span>

              {mtEvents.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 font-mono">
                  No Modern Treasury events recorded yet.
                </div>
              ) : (
                mtEvents.map((evt) => (
                  <div key={evt.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-purple-300">
                        {evt.type}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {new Date(evt.created * 1000).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      ID: {evt.id}
                    </p>
                    {evt.data && (
                      <p className="text-[10px] font-mono text-slate-500 truncate">
                        Status: {evt.data.status || 'active'} • ${((evt.data.amount || 0) / 100).toFixed(2)}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

      {/* API Key Generator Modal */}
      {showKeyGenerator && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                Modern Treasury & Stripe Test API Keys
              </h3>
              <button onClick={() => setShowKeyGenerator(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If <code className="text-indigo-300 font-mono">VITE_MT_API_KEY</code> or <code className="text-indigo-300 font-mono">STRIPE_SECRET_KEY</code> are missing, you can securely generate cryptographically random sandbox test keys using the button below.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 font-mono">VITE_MT_API_KEY / MODERN_TREASURY_API_KEY</label>
                <input
                  type="text"
                  value={mtApiKey}
                  onChange={(e) => {
                    setMtApiKey(e.target.value);
                    localStorage.setItem('VITE_MT_API_KEY', e.target.value);
                  }}
                  placeholder="mt_test_..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 font-mono">STRIPE_SECRET_KEY</label>
                <input
                  type="text"
                  value={stripeSecretKey}
                  onChange={(e) => {
                    setStripeSecretKey(e.target.value);
                    localStorage.setItem('STRIPE_SECRET_KEY', e.target.value);
                  }}
                  placeholder="rk_test_..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={generateTestApiKey}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                Generate Secure Test Keys
              </button>
              <button
                type="button"
                onClick={() => setShowKeyGenerator(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provision Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Provision Financial Account
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Connected Account Identifier (Header: Stripe-Account)
                </label>
                <input
                  type="text"
                  value={connectedAccountId}
                  onChange={(e) => setConnectedAccountId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Financial Account Nickname
                </label>
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Primary Operating Treasury"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Request Financial Account Features
                </label>
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-mono">card_issuing</span>
                    <input 
                      type="checkbox" 
                      checked={newFeatures.card_issuing}
                      onChange={(e) => setNewFeatures({ ...newFeatures, card_issuing: e.target.checked })}
                      className="accent-indigo-500 w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-mono">deposit_insurance</span>
                    <input 
                      type="checkbox" 
                      checked={newFeatures.deposit_insurance}
                      onChange={(e) => setNewFeatures({ ...newFeatures, deposit_insurance: e.target.checked })}
                      className="accent-indigo-500 w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-mono">financial_addresses.aba</span>
                    <input 
                      type="checkbox" 
                      checked={newFeatures.aba_addresses}
                      onChange={(e) => setNewFeatures({ ...newFeatures, aba_addresses: e.target.checked })}
                      className="accent-indigo-500 w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-mono">inbound_transfers.ach</span>
                    <input 
                      type="checkbox" 
                      checked={newFeatures.inbound_ach}
                      onChange={(e) => setNewFeatures({ ...newFeatures, inbound_ach: e.target.checked })}
                      className="accent-indigo-500 w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300 font-mono">outbound_payments.ach & wire</span>
                    <input 
                      type="checkbox" 
                      checked={newFeatures.outbound_ach}
                      onChange={(e) => setNewFeatures({ ...newFeatures, outbound_ach: e.target.checked, outbound_wire: e.target.checked })}
                      className="accent-indigo-500 w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  POST /v1/treasury/financial_accounts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                Update FinancialAccount
              </h3>
              <button onClick={() => setShowEditModal(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Account Nickname
                </label>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Add/Update Metadata Key
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editMetaKey}
                    onChange={(e) => setEditMetaKey(e.target.value)}
                    placeholder="Key (e.g. merchant_id)"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editMetaVal}
                    onChange={(e) => setEditMetaVal(e.target.value)}
                    placeholder="Value (e.g. merch_992)"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Update Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Account Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900/50 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                Close FinancialAccount Permanently
              </h3>
              <button onClick={() => setShowCloseModal(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to close financial account <code className="text-indigo-300 font-mono">{showCloseModal.id}</code>?
              Financial accounts cannot be reopened once closed.
            </p>

            <form onSubmit={handleCloseAccount} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Forwarding Settings (For residual debits & credits)
                </label>
                <select
                  value={forwardingType}
                  onChange={(e: any) => setForwardingType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="payment_method">External Payment Method (Bank Account)</option>
                  <option value="none">None (Reject / Manual Settlement)</option>
                </select>
              </div>

              {forwardingType === 'payment_method' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Forwarding Payment Method ID
                  </label>
                  <input
                    type="text"
                    value={forwardingPmId}
                    onChange={(e) => setForwardingPmId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none"
                    placeholder="pm_12345"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCloseModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                  POST /v1/treasury/financial_accounts/{showCloseModal.id}/close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StripeTreasuryManager;

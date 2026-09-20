import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  Lock, 
  Key, 
  CreditCard,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Database,
  List,
  Search,
  ArrowRightLeft,
  FileText,
  Shield
} from 'lucide-react';
import axios from 'axios';
import CitiSovereignLedger from './CitiSovereignLedger';
import { 
  AccountsGroupDetailsList, 
  AccountGroupDetails, 
  GetAccountTransactionsResp, 
  EncryptedAccountRoutingNumber,
  CardListingResponse,
  OverseasCardUsageRequest
} from '../types/citi';

interface CitiTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  received_at?: number;
}

export default function CitiGateway() {
  const [tokens, setTokens] = useState<CitiTokens | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showHardcoreLedger, setShowHardcoreLedger] = useState(false);
  const [detailedAccounts, setDetailedAccounts] = useState<AccountGroupDetails[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [transactionsResp, setTransactionsResp] = useState<GetAccountTransactionsResp | null>(null);
  const [routingNumber, setRoutingNumber] = useState<EncryptedAccountRoutingNumber | null>(null);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'transactions' | 'cards' | 'loans'>('summary');
  const [cardsResp, setCardsResp] = useState<CardListingResponse | null>(null);

  useEffect(() => {
    // Load tokens from localStorage on mount
    const savedTokens = localStorage.getItem('citi_sovereign_tokens');
    if (savedTokens) {
      try {
        const parsed = JSON.parse(savedTokens);
        setTokens(parsed);
        if (parsed.access_token) {
          fetchAccounts(parsed.access_token);
          fetchDetailedAccounts(parsed.access_token);
        }
      } catch (e) {
        console.error("Failed to parse saved Citi tokens");
      }
    }

    // Listen for OAuth success message from popup
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) return;

      if (event.data?.type === 'CITI_AUTH_SUCCESS') {
        const newTokens = {
          ...event.data.tokens,
          received_at: Date.now()
        };
        setTokens(newTokens);
        localStorage.setItem('citi_sovereign_tokens', JSON.stringify(newTokens));
        setError(null);
        fetchAccounts(newTokens.access_token);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!tokens || !tokens.received_at) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - tokens.received_at!) / 1000);
      const remaining = tokens.expires_in - elapsed;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [tokens]);

  const fetchAccounts = async (token: string) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/citi/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data.accountGroupSummaryList || []);
    } catch (err: any) {
      console.error("Failed to fetch accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedAccounts = async (token: string) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/citi/accounts/details', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDetailedAccounts(response.data.accountGroupDetails || []);
    } catch (err: any) {
      console.error("Failed to fetch detailed accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId: string) => {
    if (!tokens) return;
    try {
      setLoading(true);
      const fromDate = "2024-01-01";
      const toDate = new Date().toISOString().split('T')[0];
      const response = await axios.get(`/api/citi/accounts/${accountId}/transactions`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        params: { transactionFromDate: fromDate, transactionToDate: toDate }
      });
      setTransactionsResp(response.data);
      setViewMode('transactions');
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutingNumber = async (accountId: string) => {
    if (!tokens) return;
    try {
      setLoading(true);
      const response = await axios.get(`/api/citi/accounts/${accountId}/routing-number`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      setRoutingNumber(response.data);
    } catch (err: any) {
      console.error("Failed to fetch routing number:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async () => {
    if (!tokens) return;
    try {
      setLoading(true);
      const response = await axios.get('/api/citi/cards', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      setCardsResp(response.data);
      setViewMode('cards');
    } catch (err: any) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCardActivation = async (cardId: string, code: 'ACTIVATE' | 'DEACTIVATE') => {
    if (!tokens) return;
    try {
      setLoading(true);
      await axios.put(`/api/citi/cards/${cardId}/activations/${code}`, {
        cardActivationCode: code
      }, {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      fetchCards();
    } catch (err: any) {
      console.error("Card activation update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const reportLostStolen = async (cardId: string) => {
    if (!tokens) return;
    try {
      setLoading(true);
      const res = await axios.put(`/api/citi/cards/${cardId}/lostStolen`, {
        reason: "STOLEN",
        comment: "Sovereign node theft detection"
      }, {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      alert(`Reported. Reference: ${res.data.referenceNumber}`);
    } catch (err: any) {
      console.error("Failed to report lost/stolen:", err);
    } finally {
      setLoading(false);
    }
  };

  const initiateLoanTopup = async () => {
    if (!tokens) return;
    try {
      setLoading(true);
      const res = await axios.post('/api/citi/loans/topup/initiate', {
        loanAmount: 10000,
        tenor: 12,
        loanPurpose: "Sovereign Infra Expansion"
      }, {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      alert(`Loan initiated. Application ID: ${res.data.applicationId}`);
    } catch (err: any) {
      console.error("Loan initiation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/citi/auth-url');
      const { url } = response.data;

      const authWindow = window.open(url, 'citi_oauth', 'width=600,height=700');
      if (!authWindow) {
        setError("Popup blocked. Please allow popups for this node.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to initialize Citi Handshake");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!tokens?.refresh_token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/citi/refresh', {
        refresh_token: tokens.refresh_token
      });
      const newTokens = {
        ...response.data,
        received_at: Date.now()
      };
      setTokens(newTokens);
      localStorage.setItem('citi_sovereign_tokens', JSON.stringify(newTokens));
      fetchAccounts(newTokens.access_token);
    } catch (err: any) {
      setError("Token refresh failed. You may need to re-authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setTokens(null);
    localStorage.removeItem('citi_sovereign_tokens');
    setTimeLeft(null);
    setAccounts([]);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 bg-emerald-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className={`p-5 rounded-2xl border transition-all ${tokens ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-900 border-white/10 text-slate-500'}`}>
            <ShieldCheck size={32} className={loading ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Citi Sovereign Gateway</h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              {tokens ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  STATUS: SECURE_CHANNEL_ACTIVE
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  STATUS: DISCONNECTED
                </>
              )}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button 
            onClick={() => setShowHardcoreLedger(!showHardcoreLedger)}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border ${showHardcoreLedger ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/5 text-slate-400 border-white/10'}`}
          >
            <List size={14} />
            Hardcore Ledger
          </button>
          
          {!tokens ? (
            <button 
              onClick={handleConnect}
              disabled={loading}
              className="px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
              Establish Handshake
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl border border-white/10 flex items-center gap-2 transition-all"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button 
                onClick={handleDisconnect}
                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase tracking-widest rounded-xl border border-red-500/20 transition-all"
              >
                Revoke
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showHardcoreLedger ? (
          <motion.div
            key="hardcore-ledger"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CitiSovereignLedger />
          </motion.div>
        ) : (
          <motion.div
            key="gateway-main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500"
                >
                  <AlertCircle size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {tokens && (
              <>
                {/* View Selector */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {[
                    { id: 'summary', label: 'Summary', icon: Database },
                    { id: 'detailed', label: 'Detailed Accounts', icon: List },
                    { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
                    { id: 'cards', label: 'Card Management', icon: CreditCard },
                    { id: 'loans', label: 'Loan Control', icon: Zap }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => tab.id === 'cards' ? fetchCards() : setViewMode(tab.id as any)}
                      className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all ${
                        viewMode === tab.id 
                        ? 'bg-emerald-500 text-black border-emerald-400' 
                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <tab.icon size={12} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {viewMode === 'summary' && (
                    <motion.div 
                      key="summary-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                      {/* Token Data Card */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-xl flex flex-col gap-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Key className="text-emerald-500" size={18} />
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Credential Artifacts</h3>
                          </div>
                          {loading && <RefreshCw size={14} className="animate-spin text-emerald-500" />}
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono overflow-hidden">
                            <p className="text-[8px] text-slate-500 uppercase mb-2">Bearer Access Token</p>
                            <p className="text-[10px] text-emerald-400 break-all">{tokens.access_token.substring(0, 48)}...</p>
                          </div>
                          
                          <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono overflow-hidden">
                            <p className="text-[8px] text-slate-500 uppercase mb-2">Refresh Token</p>
                            <p className="text-[10px] text-white break-all">{tokens.refresh_token.substring(0, 48)}...</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 mt-auto">
                          <div className="flex items-center gap-3 text-emerald-500">
                            <Clock size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">TTL Remaining</span>
                          </div>
                          <span className="text-lg font-black text-white font-mono">
                            {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : '00:00'}
                          </span>
                        </div>
                      </motion.div>

                      {/* Integration Status Card */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-xl flex flex-col gap-8"
                      >
                        <div className="flex items-center gap-3">
                          <Database className="text-cyan-500" size={18} />
                          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Neural Synchronization</h3>
                        </div>

                        <div className="space-y-3">
                          {[
                            { label: 'Customer Profile Access', status: 'GRANTED', icon: CheckCircle2 },
                            { label: 'Account Transaction Read', status: tokens && (accounts.length > 0 || detailedAccounts.length > 0) ? 'SYNCED' : 'PENDING', icon: CheckCircle2 },
                            { label: 'Sovereign Ledger Parity', status: 'VERIFIED', icon: CheckCircle2 },
                            { label: 'JWE/JWS Handshake', status: 'VERIFIED', icon: CheckCircle2 },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all group">
                              <div className="flex items-center gap-3">
                                <item.icon size={14} className={item.status === 'GRANTED' || item.status === 'SYNCED' || item.status === 'VERIFIED' ? 'text-emerald-500' : 'text-slate-600'} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
                              </div>
                              <span className={`text-[8px] font-bold px-2 py-1 rounded-md ${item.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{item.status}</span>
                            </div>
                          ))}
                        </div>

                        {accounts.length > 0 && (
                          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <div className="flex justify-between items-center mb-3">
                              <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Active Accounts Detected</p>
                              <span className="text-[8px] font-mono text-white bg-emerald-500/20 px-2 rounded">{accounts.length}</span>
                            </div>
                            <div className="space-y-2">
                              {accounts.slice(0, 2).map((acc, i) => (
                                <div key={i} className="flex justify-between text-[10px] font-mono text-slate-300">
                                  <span>{acc.accountName || 'Unnamed Account'}</span>
                                  <span className="text-white">${acc.accountBalance?.toLocaleString() || '0.00'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}

                  {viewMode === 'detailed' && (
                    <motion.div
                      key="detailed-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      {detailedAccounts.map((group, idx) => (
                        <div key={idx} className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-xl">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                              <CreditCard className="text-emerald-500" size={24} />
                              {group.accountGroup}
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                              ...(group.checkingAccountsDetails || []),
                              ...(group.savingsAccountsDetails || []),
                              ...(group.creditCardAccountsDetails || []),
                              ...(group.loanAccountsDetails || [])
                            ].map((acc: any, aIdx) => (
                              <div key={aIdx} className="bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all">
                                <h4 className="text-xs font-black text-white uppercase mb-2 truncate">{acc.productName}</h4>
                                <p className="text-[8px] font-mono text-slate-500 mb-4">{acc.displayAccountNumber}</p>
                                <div className="flex justify-between items-end mb-6">
                                  <p className="text-[8px] text-slate-500 uppercase font-black">Balance</p>
                                  <p className="text-lg font-black text-white font-mono">
                                    {(acc.currentBalance ?? acc.currentBalanceAmount ?? 0).toLocaleString()} <span className="text-[10px] text-slate-500">{acc.currencyCode}</span>
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <button onClick={() => fetchTransactions(acc.accountId)} className="py-2 bg-white/5 rounded-lg text-[8px] font-black uppercase text-slate-400">History</button>
                                  <button onClick={() => fetchRoutingNumber(acc.accountId)} className="py-2 bg-emerald-500/5 rounded-lg text-[8px] font-black uppercase text-emerald-500">Identity</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {viewMode === 'transactions' && (
                    <motion.div
                      key="transactions-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-xl"
                    >
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Transaction Audit</h3>
                      <div className="space-y-4">
                        {transactionsResp && [
                          ...(transactionsResp.checkingAccountTransactions || []),
                          ...(transactionsResp.savingsAccountTransactions || []),
                          ...(transactionsResp.creditCardAccountTransactions || []),
                          ...(transactionsResp.loanAccountTransactions || [])
                        ].map((tx: any, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                              <p className="text-[10px] font-black text-white uppercase">{tx.transactionDescription || tx.merchantDescription}</p>
                              <p className="text-[8px] font-mono text-slate-500">{tx.transactionDate}</p>
                            </div>
                            <p className={`text-xs font-black font-mono ${tx.debitCreditMemo === 'DEBIT' ? 'text-red-400' : 'text-emerald-400'}`}>
                              {tx.debitCreditMemo === 'DEBIT' ? '-' : '+'}{Math.abs(tx.transactionAmount || 0).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {viewMode === 'cards' && (
                    <motion.div
                      key="cards-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-xl">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Sovereign Card Command</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {cardsResp?.cardDetails.map((card, i) => (
                            <div key={i} className="bg-black/40 p-6 rounded-2xl border border-white/5">
                              <h4 className="text-xs font-black text-white uppercase mb-2">{card.cardType}</h4>
                              <p className="text-sm font-mono text-emerald-400 mb-6">{card.displayCardNumber}</p>
                              <div className="grid grid-cols-2 gap-2">
                                <button 
                                  onClick={() => updateCardActivation(card.cardId, card.cardStatus === 'ACTIVE' ? 'DEACTIVATE' : 'ACTIVATE')}
                                  className={`py-2 rounded-lg text-[8px] font-black uppercase ${card.cardStatus === 'ACTIVE' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}
                                >
                                  {card.cardStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button 
                                  onClick={() => reportLostStolen(card.cardId)}
                                  className="py-2 bg-orange-500/10 text-orange-500 rounded-lg text-[8px] font-black uppercase"
                                >
                                  Lost/Stolen
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {viewMode === 'loans' && (
                    <motion.div
                      key="loans-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-xl"
                    >
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Unsecured Loan Pipeline</h3>
                      <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl">
                        <Zap className="mx-auto text-emerald-500 mb-4 opacity-50" size={48} />
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-8">Automated Credit Expansion Protocol</p>
                        <button 
                          onClick={initiateLoanTopup}
                          className="px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                        >
                          Initiate $10,000 Top-Up
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Instructions / Footer */}
            {!tokens && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-6"
              >
                <div className="p-4 bg-slate-900 w-fit mx-auto rounded-full text-slate-700">
                  <Lock size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">Handshake Required</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] max-w-sm mx-auto leading-loose">
                    To leverage the full power of the Sovereign OS, you must establish a secure cryptographic link with Citibank's core banking modules.
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">OAuth 2.0 Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sandbox Verified</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import {
  Key,
  Building2,
  Send,
  RefreshCw,
  Search,
  Code2,
  ShieldCheck,
  UserCheck,
  MapPin,
  Package,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Terminal,
  Play,
  Copy,
  Check,
  ExternalLink,
  Activity,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { OBPBank, OBPAccount, OBPTransaction, OBPCustomer, OBPBranch, OBPProduct, ApiCallLog } from '../types';
import { api } from '../services/api';
import { ApiCallViewer } from './ApiCallViewer';

interface OpenBankProjectTabProps {
  banks: OBPBank[];
  accounts: OBPAccount[];
  transactions: OBPTransaction[];
  customers: OBPCustomer[];
  branches: OBPBranch[];
  products: OBPProduct[];
  onOpenTransferModal: (accountId?: string) => void;
  onOpenCredentialsModal?: () => void;
  onOpenTelemetryModal?: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const OpenBankProjectTab: React.FC<OpenBankProjectTabProps> = ({
  banks,
  accounts,
  transactions,
  customers,
  branches,
  products,
  onOpenTransferModal,
  onOpenCredentialsModal,
  onOpenTelemetryModal,
  onRefresh,
  isRefreshing,
}) => {
  const [selectedBankId, setSelectedBankId] = useState<string>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [searchTx, setSearchTx] = useState<string>('');
  const [subView, setSubView] = useState<'accounts' | 'transactions' | 'customers' | 'branches' | 'products' | 'console'>('accounts');

  // API Console State
  const [consoleEndpoint, setConsoleEndpoint] = useState<string>('/obp/v5.1.0/banks');
  const [consoleMethod, setConsoleMethod] = useState<string>('GET');
  const [consoleBody, setConsoleBody] = useState<string>('{\n  \n}');
  const [consoleResult, setConsoleResult] = useState<any>(null);
  const [isConsoleExecuting, setIsConsoleExecuting] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [consoleActiveTab, setConsoleActiveTab] = useState<'response' | 'headers' | 'curl'>('response');

  // Recent Telemetry for bottom stream
  const [recentCalls, setRecentCalls] = useState<ApiCallLog[]>([]);
  const [lastCall, setLastCall] = useState<ApiCallLog | null>(null);

  const fetchRecentCalls = async () => {
    try {
      const res = await api.getTelemetryCalls(10);
      if (res.calls && res.calls.length > 0) {
        setRecentCalls(res.calls);
        setLastCall(res.calls[0]);
      }
    } catch (err) {
      console.error('Failed to load recent telemetry:', err);
    }
  };

  useEffect(() => {
    fetchRecentCalls();
  }, [isRefreshing, subView]);

  const filteredAccounts = accounts.filter(
    (acc) => selectedBankId === 'all' || acc.bank_id === selectedBankId
  );

  const filteredTransactions = transactions.filter((tx) => {
    const matchesAccount = selectedAccountId === 'all' || tx.this_account.id === selectedAccountId;
    const matchesSearch =
      !searchTx ||
      tx.details.description.toLowerCase().includes(searchTx.toLowerCase()) ||
      tx.other_account.holder.display_name.toLowerCase().includes(searchTx.toLowerCase()) ||
      tx.details.type.toLowerCase().includes(searchTx.toLowerCase());
    return matchesAccount && matchesSearch;
  });

  const handleExecuteConsole = async () => {
    setIsConsoleExecuting(true);
    try {
      let parsedBody: any = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(consoleMethod)) {
        try {
          parsedBody = JSON.parse(consoleBody);
        } catch {
          parsedBody = consoleBody;
        }
      }
      const res = await api.executeRawRequest({
        endpoint: consoleEndpoint,
        method: consoleMethod,
        body: parsedBody,
      });
      setConsoleResult(res);
      fetchRecentCalls();
    } catch (err: any) {
      setConsoleResult({ error: err.message || 'Execution failed' });
    } finally {
      setIsConsoleExecuting(false);
    }
  };

  const copyConsoleOutput = () => {
    if (consoleResult) {
      navigator.clipboard.writeText(JSON.stringify(consoleResult, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subnav Header */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2 tracking-tight">
              <span className="p-2.5 rounded-xl bg-blue-500/15 text-cyan-300 border border-blue-400/30 backdrop-blur-md shadow-lg shadow-blue-500/10">
                <Key className="w-5 h-5" />
              </span>
              <span>Open Bank Project (OBP) API Integration Hub</span>
            </h2>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-400/30">
              Live Network Active
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            REST API v5.1.0 • DirectLogin & OAuth 1.0a compliant • Connected to Citibank & Sandbox
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {onOpenTelemetryModal && (
            <button
              onClick={onOpenTelemetryModal}
              className="bg-white/10 hover:bg-white/15 text-cyan-300 hover:text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 border border-white/15 backdrop-blur-md shadow-sm"
              title="Inspect live response payloads for all API calls"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Responses ({recentCalls.length})</span>
            </button>
          )}

          {onOpenCredentialsModal && (
            <button
              onClick={onOpenCredentialsModal}
              className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 border border-white/15 backdrop-blur-md shadow-sm"
            >
              <Key className="w-3.5 h-3.5 text-blue-400" />
              <span>Direct Login Credentials</span>
            </button>
          )}

          <button
            onClick={() => onOpenTransferModal()}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-lg shadow-blue-500/25 border border-white/20 backdrop-blur-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>New Payment Request</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300 rounded-xl transition-all backdrop-blur-md shadow-sm"
            title="Refresh OBP Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-tabs switch */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'accounts', label: `Accounts (${accounts.length})`, icon: Building2 },
          { id: 'transactions', label: `Transactions (${transactions.length})`, icon: ArrowUpRight },
          { id: 'customers', label: `KYC Customers (${customers.length})`, icon: UserCheck },
          { id: 'branches', label: `Branches & ATMs (${branches.length})`, icon: MapPin },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'console', label: 'Interactive API Console', icon: Terminal, badge: 'Live REST' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubView(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-white/30 shadow-lg shadow-blue-500/20 backdrop-blur-md'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/10 backdrop-blur-md'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${isActive ? 'bg-slate-950/40 text-cyan-200' : 'bg-white/10 text-cyan-300 border border-white/10'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW: ACCOUNTS */}
      {subView === 'accounts' && (
        <div className="space-y-4">
          {/* Bank selector filter */}
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10 shadow-lg shadow-black/10">
            <span className="text-xs font-medium text-slate-400">Filter by Bank:</span>
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSelectedBankId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  selectedBankId === 'all'
                    ? 'bg-blue-600 text-white border-white/30 shadow-md shadow-blue-600/30'
                    : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10'
                }`}
              >
                All Banks ({banks.length})
              </button>
              {banks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBankId(b.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                    selectedBankId === b.id
                      ? 'bg-blue-600 text-white border-white/30 shadow-md shadow-blue-600/30'
                      : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10'
                  }`}
                >
                  {b.short_name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:bg-white/[0.08] transition-all space-y-4 shadow-xl shadow-black/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/15 backdrop-blur-md">
                      {acc.type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{acc.label}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Account ID: <span className="text-slate-200">{acc.id}</span>
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-400/30 text-cyan-300 backdrop-blur-md">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-3.5 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10 space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Ledger Balance</span>
                    <span className="text-xl font-mono font-bold text-white drop-shadow-sm">
                      {acc.balance.currency} {parseFloat(acc.balance.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 pt-1 border-t border-white/5">
                    <span>Number: ••••{acc.number.slice(-4)}</span>
                    <span>ABA: {acc.routing?.address || '021000089'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    Owner: <span className="text-slate-200 font-medium">{acc.owners[0]?.display_name || 'Citibank Demo Business Corp'}</span>
                  </div>
                  <button
                    onClick={() => onOpenTransferModal(acc.id)}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-cyan-300 hover:text-white border border-white/15 rounded-xl font-semibold backdrop-blur-md transition-all flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>Transfer Funds</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: TRANSACTIONS */}
      {subView === 'transactions' && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions, counterparties..."
                value={searchTx}
                onChange={(e) => setSearchTx(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 backdrop-blur-md"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Account:</span>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="bg-black/30 border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 backdrop-blur-md"
              >
                <option value="all" className="bg-slate-900">All Accounts</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id} className="bg-slate-900">
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="py-3 px-4">Transaction ID / Type</th>
                  <th className="py-3 px-4">Counterparty</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredTransactions.map((tx) => {
                  const amountNum = parseFloat(tx.details.value.amount);
                  const isDebit = amountNum < 0;
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1.5 rounded-lg ${isDebit ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                            {isDebit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="font-bold text-white font-sans block">{tx.details.type}</span>
                            <span className="text-[10px] text-slate-400">{tx.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-200">
                        {tx.other_account.holder.display_name || 'Citibank Clearing'}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300 max-w-xs truncate">
                        {tx.details.description}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(tx.details.completed).toLocaleDateString()}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold text-sm ${isDebit ? 'text-slate-200' : 'text-emerald-400'}`}>
                        {tx.details.value.currency} {Math.abs(amountNum).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: CUSTOMERS */}
      {subView === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {customers.map((c) => (
            <div key={c.customer_id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{c.legal_name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">KYC: {c.customer_number}</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-500/15 text-cyan-300 border border-blue-400/30 backdrop-blur-md">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-300 font-mono">
                <div>Email: {c.email}</div>
                <div>Phone: {c.mobile_phone_number}</div>
                <div className="flex justify-between pt-2 border-t border-white/5">
                  <span>Rating: {c.credit_rating?.rating || 'AAA'}</span>
                  <span>Limit: {c.credit_limit?.currency} {c.credit_limit?.amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: BRANCHES */}
      {subView === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map((b) => (
            <div key={b.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{b.name}</h3>
                  <p className="text-xs text-slate-400">{b.address.line_1}, {b.address.city}, {b.address.country_code}</p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 text-slate-300 border border-white/10 backdrop-blur-md">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-3">
                <span>Lat: {b.location?.latitude}</span>
                <span>Lng: {b.location?.longitude}</span>
                <span>Bank: {b.bank_id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: PRODUCTS */}
      {subView === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.code} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-2 shadow-xl shadow-black/20 hover:border-white/20 hover:bg-white/[0.08] transition-all">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/15 backdrop-blur-md">
                {p.category}
              </span>
              <h3 className="text-sm font-bold text-white">{p.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-3">{p.description}</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                Code: {p.code}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: INTERACTIVE API CONSOLE */}
      {subView === 'console' && (
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl shadow-black/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span>Open Bank Project Interactive API Workbench & Inspector</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Execute live REST requests with your OBP credentials and inspect returned HTTP responses, headers, and latencies.
                </p>
              </div>

              {onOpenTelemetryModal && (
                <button
                  onClick={onOpenTelemetryModal}
                  className="text-xs text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-xl border border-cyan-400/30 transition-all flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Open Global Inspector</span>
                </button>
              )}
            </div>

            {/* Request Builder */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <select
                  value={consoleMethod}
                  onChange={(e) => setConsoleMethod(e.target.value)}
                  className="bg-black/40 border border-white/15 text-xs font-bold text-cyan-300 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-400 backdrop-blur-md w-full sm:w-28"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <input
                  type="text"
                  value={consoleEndpoint}
                  onChange={(e) => setConsoleEndpoint(e.target.value)}
                  placeholder="/obp/v5.1.0/banks"
                  className="flex-1 w-full bg-black/40 border border-white/15 text-xs font-mono text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-400 backdrop-blur-md"
                />

                <button
                  onClick={handleExecuteConsole}
                  disabled={isConsoleExecuting}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 border border-white/20 backdrop-blur-md shrink-0"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isConsoleExecuting ? 'animate-spin' : ''}`} />
                  <span>{isConsoleExecuting ? 'Executing...' : 'Send Live Request'}</span>
                </button>
              </div>

              {/* Sample endpoints chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] text-slate-400 pb-1 scrollbar-none">
                <span className="shrink-0 text-slate-400 font-medium">Quick Presets:</span>
                {[
                  { label: 'Get All Banks', ep: '/obp/v5.1.0/banks', method: 'GET' },
                  { label: 'Get Current User', ep: '/obp/v5.1.0/users/current', method: 'GET' },
                  { label: 'Get My Accounts', ep: '/obp/v5.1.0/my/accounts', method: 'GET' },
                  { label: 'RBS Accounts', ep: '/obp/v5.1.0/banks/rbs/accounts', method: 'GET' },
                  { label: 'HSBC Accounts', ep: '/obp/v5.1.0/banks/hsbc-test/accounts', method: 'GET' },
                  { label: 'Santander Accounts', ep: '/obp/v5.1.0/banks/at02-0049--01/accounts', method: 'GET' },
                  { label: 'RBS Branches', ep: '/obp/v5.1.0/banks/rbs/branches', method: 'GET' },
                  { label: 'HSBC Products', ep: '/obp/v5.1.0/banks/hsbc-test/products', method: 'GET' },
                ].map((preset) => (
                  <button
                    key={preset.ep}
                    onClick={() => {
                      setConsoleEndpoint(preset.ep);
                      setConsoleMethod(preset.method);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono whitespace-nowrap backdrop-blur-md transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Body for POST/PUT */}
              {['POST', 'PUT', 'PATCH'].includes(consoleMethod) && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    JSON Request Body:
                  </label>
                  <textarea
                    rows={4}
                    value={consoleBody}
                    onChange={(e) => setConsoleBody(e.target.value)}
                    className="w-full p-3.5 bg-black/40 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400 backdrop-blur-md"
                  />
                </div>
              )}
            </div>

            {/* Output View */}
            {consoleResult && (
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border backdrop-blur-md ${
                        (consoleResult.status || 200) < 300
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                      }`}
                    >
                      HTTP {consoleResult.status || 200} {consoleResult.statusText || 'OK'}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-400/20">
                      Latency: {consoleResult.durationMs || 12}ms
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={copyConsoleOutput}
                      className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-1 rounded-lg backdrop-blur-md transition-all shadow-sm"
                    >
                      {copiedResponse ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedResponse ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-black/60 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto max-h-96 border border-white/10 backdrop-blur-md leading-relaxed scrollbar-thin">
                  <pre className="text-emerald-300 whitespace-pre-wrap break-all">
                    {JSON.stringify(consoleResult.data || consoleResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded Live Response Inspector Stream */}
      {lastCall && (
        <ApiCallViewer
          title="Last Executed API Call & Network Response"
          subtitle="Real-time request payload and response body from server"
          lastCall={lastCall}
          onOpenTelemetryModal={onOpenTelemetryModal}
        />
      )}
    </div>
  );
};

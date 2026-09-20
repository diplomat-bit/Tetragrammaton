import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Key,
  Shield,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  Play,
  User,
  Plus,
  Zap,
  Download,
  Settings,
  Layers,
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

interface MarqetaUser {
  token: string;
  active: boolean;
  first_name: string;
  last_name: string;
  uses_parent_account?: boolean;
  corporate_card_holder?: boolean;
  created_time?: string;
  last_modified_time?: string;
  metadata?: Record<string, any>;
  account_holder_group_token?: string;
  status: string;
  email?: string;
  phone?: string;
  address1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  created_time: string;
  pin_is_set: boolean;
}

export const MarqetaConsole: React.FC = () => {
  const [users, setUsers] = useState<MarqetaUser[]>([]);
  const [cards, setCards] = useState<MarqetaCard[]>([]);
  const [selectedUser, setSelectedUser] = useState<MarqetaUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Quick env token editor state
  const [basicTokenInput, setBasicTokenInput] = useState('');
  const [savingToken, setSavingToken] = useState(false);
  const [hasTokenInEnv, setHasTokenInEnv] = useState(false);
  const [maskedToken, setMaskedToken] = useState('');

  // Create User Form State
  const [firstName, setFirstName] = useState('Marqeta');
  const [lastName, setLastName] = useState('User');
  const [userToken, setUserToken] = useState('53e44e56-dd2b-4189-9b01-fd0fa398a82d');
  const [ahgToken, setAhgToken] = useState('DEFAULT_AHG');
  const [email, setEmail] = useState('marqeta.user@example.com');
  const [activeStatus, setActiveStatus] = useState(true);

  // API Execution Result
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [gpaOrders, setGpaOrders] = useState<any[]>([]);
  const [cardProductsData, setCardProductsData] = useState<any | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'curl' | 'cards' | 'json' | 'gpa' | 'cardproducts'>('users');

  const fetchConfigAndData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Marqeta config
      const configRes = await apiFetch<any>('/api/marqeta/config');
      if (configRes.ok && configRes.data) {
        setHasTokenInEnv(configRes.data.hasToken);
        setMaskedToken(configRes.data.tokenConfiguredClean || '');
        if (configRes.data.defaultUserToken) {
          setUserToken(configRes.data.defaultUserToken);
        }
      }

      // 2. Fetch Users
      const usersRes = await apiFetch<any>('/api/marqeta/users');
      if (usersRes.ok && usersRes.data?.users) {
        setUsers(usersRes.data.users);
        if (usersRes.data.users.length > 0 && !selectedUser) {
          const defaultUser = usersRes.data.users.find((u: MarqetaUser) => u.token === '53e44e56-dd2b-4189-9b01-fd0fa398a82d') || usersRes.data.users[0];
          setSelectedUser(defaultUser);
        }
      }

      // 3. Fetch Cards
      const cardsRes = await apiFetch<any>('/api/marqeta/cards');
      if (cardsRes.ok && cardsRes.data?.cards) {
        setCards(cardsRes.data.cards);
      }

      // 4. Fetch Card Products
      const cpRes = await apiFetch<any>('/api/marqeta/cardproducts');
      if (cpRes.ok && cpRes.data?.cardproducts) {
        setCardProductsData(cpRes.data.cardproducts);
      }
    } catch (err: any) {
      console.error('Error loading Marqeta console data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigAndData();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSaveTokenToEnv = async () => {
    if (!basicTokenInput.trim()) return;
    setSavingToken(true);
    setStatusMessage(null);
    try {
      // Automatically clean the user's input by stripping "Basic " if they accidentally typed it
      const cleanToken = basicTokenInput.replace(/^Basic\s*/i, '').trim();

      const res = await apiFetch<any>('/api/env/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: {
            MARQETA_BASIC_TOKEN: cleanToken,
            MARQETA_USER_TOKEN: userToken,
            MARQETA_ACCOUNT_HOLDER_GROUP_TOKEN: ahgToken,
          },
        }),
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `MARQETA_BASIC_TOKEN saved to .env! Token formatted automatically without needing "Basic".`,
        });
        setBasicTokenInput('');
        fetchConfigAndData();
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to save token to environment' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSavingToken(false);
    }
  };

  const handleCreateUser = async () => {
    setExecuting(true);
    setStatusMessage(null);
    setApiResponse(null);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        token: userToken,
        active: activeStatus,
        uses_parent_account: false,
        corporate_card_holder: false,
        account_holder_group_token: ahgToken,
        email: email,
        customBasicToken: basicTokenInput.trim() || undefined,
      };

      const res = await apiFetch<any>('/api/marqeta/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok && res.data) {
        setApiResponse(res.data);
        setStatusMessage({
          type: 'success',
          text: res.data.message || 'Marqeta user registered and stored successfully!',
        });
        fetchConfigAndData();
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to create Marqeta user' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setExecuting(false);
    }
  };

  const handleIssueCard = async () => {
    if (!selectedUser) return;
    setExecuting(true);
    setStatusMessage(null);
    try {
      const res = await apiFetch<any>('/api/marqeta/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_token: selectedUser.token,
          card_product_token: 'cp_corporate_expense_v1',
          customBasicToken: basicTokenInput.trim() || undefined,
        }),
      });

      if (res.ok && res.data) {
        setStatusMessage({
          type: 'success',
          text: `Virtual card issued for ${selectedUser.first_name} ${selectedUser.last_name}!`,
        });
        fetchConfigAndData();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setExecuting(false);
    }
  };

  const handleExecuteGpaOrder = async () => {
    setExecuting(true);
    setStatusMessage(null);
    setApiResponse(null);
    try {
      const payload = {
        user_token: selectedUser?.token || "53e44e56-dd2b-4189-9b01-fd0fa398a82d",
        amount: "1000.00",
        currency_code: "USD",
        funding_source_token: "sandbox_program_funding",
        customBasicToken: basicTokenInput.trim() || undefined,
      };

      const res = await apiFetch<any>('/api/marqeta/gpaorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok && res.data) {
        setApiResponse(res.data);
        setGpaOrders(prev => [res.data.gpa_order, ...prev]);
        setStatusMessage({
          type: 'success',
          text: res.data.message || 'GPA Order (funding) executed successfully!',
        });
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to execute GPA order' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setExecuting(false);
    }
  };

  // Generate exact cURL snippet requested
  const tokenForCurl = basicTokenInput.trim()
    ? basicTokenInput.replace(/^Basic\s*/i, '').trim()
    : maskedToken
    ? '<YOUR_SAVED_TOKEN>'
    : '==';
  
  const formattedAuthHeader = `Basic ${tokenForCurl}`;

  const generatedCurl = `curl -X POST "https://sandbox-api.marqeta.com/v3/users" \\
  -H "accept: application/json" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: ${formattedAuthHeader}" \\
  -d '{"first_name":"${firstName}","last_name":"${lastName}"}'`;

  const sampleJsonUser = {
    token: userToken || "53e44e56-dd2b-4189-9b01-fd0fa398a82d",
    active: true,
    first_name: firstName || "Marqeta",
    last_name: lastName || "User",
    uses_parent_account: false,
    corporate_card_holder: false,
    created_time: "2022-04-06T12:18:31Z",
    last_modified_time: "2022-04-06T12:18:31Z",
    metadata: {},
    account_holder_group_token: ahgToken || "DEFAULT_AHG",
    status: "ACTIVE"
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Marqeta Card Issuing & Digital Banking</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/30">
              v3 REST API
            </span>
          </div>
          <p className="text-xs text-[#8B949E] max-w-3xl leading-relaxed">
            Direct integration with Marqeta Sandbox API. Manage cardholders, issue virtual payment cards, and execute authenticated REST operations with auto-formatted Basic authorization.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchConfigAndData}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Hub</span>
          </button>
          <a
            href="/api/env/download"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 text-xs font-semibold border border-orange-500/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download .env</span>
          </a>
        </div>
      </div>

      {/* Auto-Prefixing & ENV Manager Callout */}
      <div className="bg-[#0d1117] rounded-xl border border-orange-500/30 p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Marqeta Environment Variable: <code className="text-orange-300 font-mono text-xs">MARQETA_BASIC_TOKEN</code>
              </h2>
              {hasTokenInEnv ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>LOADED ({maskedToken})</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>NOT SET</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#8B949E]">
              <strong className="text-orange-300">Auto-Prefix Rule Active:</strong> You only enter the token string itself (e.g. <code className="bg-[#161B22] px-1 py-0.5 rounded text-orange-200">==</code> or base64 credentials). The system automatically formats the outgoing HTTP header as <code className="bg-[#161B22] px-1 py-0.5 rounded text-white">Authorization: Basic &lt;token&gt;</code> without requiring you to prefix the word &quot;Basic&quot;.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <input
                type="text"
                value={basicTokenInput}
                onChange={(e) => setBasicTokenInput(e.target.value)}
                placeholder="Paste basic token string only..."
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              onClick={handleSaveTokenToEnv}
              disabled={savingToken || !basicTokenInput.trim()}
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              {savingToken ? 'Saving...' : 'Save to .ENV'}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-sm ${
            statusMessage.type === 'success'
              ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-900/20 border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p>{statusMessage.text}</p>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#30363D] pb-2">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-[#8B949E] hover:text-white bg-[#161B22] border border-[#30363D]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Cardholders & Users</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-orange-200">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('curl')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'curl'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-[#8B949E] hover:text-white bg-[#161B22] border border-[#30363D]'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>cURL Exec & Tester</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cards')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'cards'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-[#8B949E] hover:text-white bg-[#161B22] border border-[#30363D]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Virtual Cards</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-orange-200">
            {cards.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('gpa')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'gpa'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-[#8B949E] hover:text-white bg-[#161B22] border border-[#30363D]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>GPA Orders ($1000)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-orange-200">
            {gpaOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('cardproducts')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'cardproducts'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-[#8B949E] hover:text-white bg-[#161B22] border border-[#30363D]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Card Products</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-orange-200">
            {cardProductsData?.data?.length || 1}
          </span>
        </button>
      </div>

      {/* TAB 1: USERS & USER CREATION */}
      {activeSubTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Create User Form */}
          <div className="lg:col-span-6 bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Create Marqeta User (/v3/users)</h3>
              </div>
              <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                POST /v3/users
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[#8B949E] uppercase mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#8B949E] uppercase mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#8B949E] uppercase mb-1">
                Cardholder User Token (UUID)
              </label>
              <input
                type="text"
                value={userToken}
                onChange={(e) => setUserToken(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-mono text-orange-300 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[#8B949E] uppercase mb-1">
                  Account Holder Group (AHG)
                </label>
                <input
                  type="text"
                  value={ahgToken}
                  onChange={(e) => setAhgToken(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#8B949E] uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <label className="flex items-center space-x-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.checked)}
                  className="rounded border-[#30363D] text-orange-500 focus:ring-orange-500"
                />
                <span>Set status to ACTIVE immediately</span>
              </label>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={handleCreateUser}
                disabled={executing || !firstName || !lastName}
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-orange-950/40 transition-all cursor-pointer"
              >
                {executing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>Execute POST /v3/users</span>
              </button>

              <button
                onClick={() => handleCopy(generatedCurl, 'form-curl')}
                className="px-3.5 py-2.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
                title="Copy cURL command"
              >
                {copied === 'form-curl' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-[#8B949E]" />
                )}
              </button>
            </div>
          </div>

          {/* Right: Active Users List */}
          <div className="lg:col-span-6 bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Registered Marqeta Cardholders</h3>
              </div>
              <span className="text-xs text-[#8B949E]">{users.length} record(s)</span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {users.map((u) => (
                <div
                  key={u.token}
                  onClick={() => setSelectedUser(u)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedUser?.token === u.token
                      ? 'bg-orange-950/30 border-orange-500/60 shadow-sm'
                      : 'bg-[#0d1117] border-[#30363D] hover:border-orange-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">
                          {u.first_name} {u.last_name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {u.status}
                        </span>
                        {u.token === '53e44e56-dd2b-4189-9b01-fd0fa398a82d' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            DEFAULT SPEC
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-orange-300">token: {u.token}</p>
                      <p className="text-[11px] text-[#8B949E]">
                        Group: {u.account_holder_group_token || 'DEFAULT_AHG'} • Created: {u.created_time?.slice(0, 10) || '2022-04-06'}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(JSON.stringify(u, null, 2), `user-${u.token}`);
                      }}
                      className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363D] text-[#8B949E] hover:text-white"
                      title="Copy User JSON"
                    >
                      {copied === `user-${u.token}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedUser && (
              <div className="pt-2 border-t border-[#30363D] flex items-center justify-between">
                <span className="text-xs text-[#8B949E]">
                  Selected: <strong className="text-white">{selectedUser.first_name} {selectedUser.last_name}</strong>
                </span>
                <button
                  onClick={handleIssueCard}
                  disabled={executing}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 text-xs font-semibold transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Issue Virtual Card</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: cURL COMMAND & LIVE RUNNER */}
      {activeSubTab === 'curl' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Generated Marqeta Sandbox cURL</h3>
              </div>
              <button
                onClick={() => handleCopy(generatedCurl, 'curl-main')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
              >
                {copied === 'curl-main' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-orange-400" />
                    <span>Copy cURL Command</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="bg-[#0d1117] border border-[#30363D] rounded-xl p-4 text-xs font-mono text-orange-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {generatedCurl}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-[#8B949E]">
                Target: <code className="text-white font-mono">POST https://sandbox-api.marqeta.com/v3/users</code>
              </p>
              <button
                onClick={handleCreateUser}
                disabled={executing}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-950/40 transition-all cursor-pointer"
              >
                {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>Execute cURL Request Live</span>
              </button>
            </div>
          </div>

          {/* Response Inspector */}
          {apiResponse && (
            <div className="bg-[#161B22] rounded-xl border border-emerald-500/30 p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Live Execution Response (HTTP 201 Created)</h3>
                </div>
                <button
                  onClick={() => handleCopy(JSON.stringify(apiResponse, null, 2), 'response-copy')}
                  className="p-1.5 rounded bg-[#21262d] text-[#8B949E] hover:text-white"
                >
                  {copied === 'response-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="bg-[#0d1117] border border-[#30363D] rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-80">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VIRTUAL CARDS */}
      {activeSubTab === 'cards' && (
        <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-bold text-white">Issued Marqeta Virtual Cards</h3>
            </div>
            <button
              onClick={handleIssueCard}
              disabled={executing || !selectedUser}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Virtual Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((c) => (
              <div
                key={c.token}
                className="bg-gradient-to-br from-[#1c2333] to-[#0f141f] border border-orange-500/30 rounded-2xl p-5 space-y-4 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-white tracking-wider">MARQETA VIRTUAL</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {c.state}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-[#8B949E] uppercase font-mono">Card Number</p>
                  <p className="text-base font-mono font-bold text-white tracking-widest">{c.pan}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#30363D]/50 text-xs">
                  <div>
                    <p className="text-[9px] text-[#8B949E] uppercase">Cardholder</p>
                    <p className="font-semibold text-white">
                      {selectedUser?.first_name || 'Marqeta'} {selectedUser?.last_name || 'User'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#8B949E] uppercase">Expires</p>
                    <p className="font-mono text-orange-300">{c.expiration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: GPA ORDERS / FUNDING */}
      {activeSubTab === 'gpa' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Marqeta GPA Orders (Funding Order API)</h3>
              </div>
              <button
                onClick={() => {
                  const gpaCurl = `curl -i \\
-X POST \\
-H 'Content-type: application/json' \\
--user 7fa5863c-8a79-4442-8a60-32c7b61229db:99c5448d-d81d-42d8-9d49-42f46b1d955d \\
-d '{
      "user_token": "53e44e56-dd2b-4189-9b01-fd0fa398a82d",
      "amount": "1000.00",
      "currency_code": "USD",
      "funding_source_token": "sandbox_program_funding"
    }' \\
https://sandbox-api.marqeta.com/v3/gpaorders`;
                  handleCopy(gpaCurl, 'gpa-curl');
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
              >
                {copied === 'gpa-curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-400" />}
                <span>Copy cURL Command</span>
              </button>
            </div>

            <pre className="bg-[#0d1117] border border-[#30363D] rounded-xl p-4 text-xs font-mono text-orange-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`curl -i \\
-X POST \\
-H 'Content-type: application/json' \\
--user 7fa5863c-8a79-4442-8a60-32c7b61229db:99c5448d-d81d-42d8-9d49-42f46b1d955d \\
-d '{
      "user_token": "53e44e56-dd2b-4189-9b01-fd0fa398a82d",
      "amount": "1000.00",
      "currency_code": "USD",
      "funding_source_token": "sandbox_program_funding"
    }' \\
https://sandbox-api.marqeta.com/v3/gpaorders`}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-[#8B949E]">
                Executes GPA funding order of <strong className="text-emerald-400">$1,000.00 USD</strong> for user <code className="text-white font-mono">53e44e56...</code>
              </p>
              <button
                onClick={handleExecuteGpaOrder}
                disabled={executing}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-950/40 transition-all cursor-pointer"
              >
                {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>Execute GPA Order Live</span>
              </button>
            </div>
          </div>

          {/* Response Inspector */}
          {apiResponse && (
            <div className="bg-[#161B22] rounded-xl border border-emerald-500/30 p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">GPA Order Response (HTTP 201 Created)</h3>
                </div>
                <button
                  onClick={() => handleCopy(JSON.stringify(apiResponse, null, 2), 'gpa-resp')}
                  className="p-1.5 rounded bg-[#21262d] text-[#8B949E] hover:text-white"
                >
                  {copied === 'gpa-resp' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="bg-[#0d1117] border border-[#30363D] rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-80">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}

          {/* Executed Orders History */}
          {gpaOrders.length > 0 && (
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-4 shadow-md">
              <h3 className="text-sm font-bold text-white border-b border-[#30363D] pb-3">Executed GPA Orders Log</h3>
              <div className="space-y-3">
                {gpaOrders.map((order, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0d1117] border border-[#30363D] flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-emerald-400">+${order.amount} {order.currency_code}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">{order.state}</span>
                      </div>
                      <p className="text-xs font-mono text-[#8B949E] mt-1">Order Token: {order.token} • User: {order.user_token}</p>
                    </div>
                    <span className="text-[10px] text-[#8B949E] font-mono">{order.created_time?.slice(0, 19)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: CARD PRODUCTS */}
      {activeSubTab === 'cardproducts' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Marqeta Card Products API (/v3/cardproducts)</h3>
              </div>
              <button
                onClick={() => {
                  const cpCurl = `curl -X GET "https://sandbox-api.marqeta.com/v3/cardproducts" \\
-H "accept: application/json" \\
-H "Content-Type: application/json" \\
-H "Authorization: Basic N2ZhNTg2M2MtOGE3OS00NDQyLThhNjAtMzJjN2I2MTIyOWRiOjk5YzU0NDhkLWQ4MWQtNDJkOC05ZDQ5LTQyZjQ2YjFkOTU1ZA==" \\
-d "{}"`;
                  handleCopy(cpCurl, 'cp-curl');
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
              >
                {copied === 'cp-curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-400" />}
                <span>Copy GET cURL</span>
              </button>
            </div>

            <pre className="bg-[#0d1117] border border-[#30363D] rounded-xl p-4 text-xs font-mono text-orange-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`curl -X GET "https://sandbox-api.marqeta.com/v3/cardproducts" \\
-H "accept: application/json" \\
-H "Content-Type: application/json" \\
-H "Authorization: Basic N2ZhNTg2M2MtOGE3OS00NDQyLThhNjAtMzJjN2I2MTIyOWRiOjk5YzU0NDhkLWQ4MWQtNDJkOC05ZDQ5LTQyZjQ2YjFkOTU1ZA==" \\
-d "{}"`}
            </pre>
          </div>

          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <h3 className="text-sm font-bold text-white">Card Products Response Payload</h3>
              <span className="text-xs font-mono text-emerald-400">Token: 693330ba-6ef6-4c86-911f-304978233534</span>
            </div>
            <pre className="bg-[#0d1117] border border-[#30363D] rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
              {JSON.stringify(cardProductsData || {
                count: 1,
                start_index: 0,
                end_index: 0,
                is_more: false,
                data: []
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: SCHEMA & JSON PAYLOAD */}
      {activeSubTab === 'json' && (
        <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-bold text-white">Marqeta User Payload Specification</h3>
            </div>
            <button
              onClick={() => handleCopy(JSON.stringify(sampleJsonUser, null, 2), 'schema-copy')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
            >
              {copied === 'schema-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-400" />}
              <span>Copy Schema JSON</span>
            </button>
          </div>

          <pre className="bg-[#0d1117] border border-[#30363D] rounded-xl p-5 text-xs font-mono text-orange-300 overflow-x-auto leading-relaxed">
            {JSON.stringify(sampleJsonUser, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

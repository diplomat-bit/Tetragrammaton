import React, { useState, useEffect } from 'react';
import Card from './Card';
import { 
  alpacaBrokerService, 
  AlpacaAccount, 
  AlpacaAsset, 
  AlpacaAchRelationship, 
  AlpacaTransfer, 
  AlpacaJournal, 
  AlpacaOrder,
  AlpacaCreateAccountPayload
} from '../services/AlpacaBrokerService';
import { 
  Building2, 
  Key, 
  ShieldCheck, 
  Terminal, 
  CreditCard, 
  ArrowRightLeft, 
  TrendingUp, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Code, 
  UserPlus, 
  Landmark, 
  DollarSign, 
  Zap, 
  FileJson,
  Radio
} from 'lucide-react';

export const AlpacaBrokerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'accounts' | 'ach' | 'journals' | 'orders' | 'events'>('overview');
  
  // Credentials & Config State
  const [apiKey, setApiKey] = useState('PK_ALPACA_SANDBOX_2026_KEY');
  const [apiSecret, setApiSecret] = useState('SK_ALPACA_SECRET_MOCK_SECURE_KEY');
  const [isProduction, setIsProduction] = useState(false);
  const [copiedHeader, setCopiedHeader] = useState(false);

  // System State
  const [accounts, setAccounts] = useState<AlpacaAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('b9b19618-22dd-4e80-8432-fc9e1ba0b27d');
  const [assets, setAssets] = useState<AlpacaAsset[]>([]);
  const [achRelationships, setAchRelationships] = useState<AlpacaAchRelationship[]>([]);
  const [transfers, setTransfers] = useState<AlpacaTransfer[]>([]);
  const [journals, setJournals] = useState<AlpacaJournal[]>([]);
  const [orders, setOrders] = useState<AlpacaOrder[]>([]);
  const [logs, setLogs] = useState<Array<{ id: string; time: string; endpoint: string; status: number; requestId: string; payload: any }>>([]);
  const [firmBalance, setFirmBalance] = useState<number>(45064.36);

  // Onboarding Form State
  const [newAccountEmail, setNewAccountEmail] = useState('john.doe.sovereign@alpaca.io');
  const [newAccountFirstName, setNewAccountFirstName] = useState('John');
  const [newAccountLastName, setNewAccountLastName] = useState('Doe');
  const [newAccountSsn, setNewAccountSsn] = useState('661-010-666');

  // ACH Form State
  const [achOwnerName, setAchOwnerName] = useState('Awesome Alpaca');
  const [achAccountNum, setAchAccountNum] = useState('32131231abc');
  const [achRoutingNum, setAchRoutingNum] = useState('121000358');
  const [achNickname, setAchNickname] = useState('Bank of America Checking');
  const [fundAmount, setFundAmount] = useState('1234.567');

  // Journal Form State
  const [journalAmount, setJournalAmount] = useState('500.00');

  // Order Form State
  const [orderSymbol, setOrderSymbol] = useState('AAPL');
  const [orderQty, setOrderQty] = useState('0.42');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');

  useEffect(() => {
    alpacaBrokerService.setCredentials(apiKey, apiSecret, isProduction);
    refreshAllData();
  }, [apiKey, apiSecret, isProduction]);

  const refreshAllData = async () => {
    try {
      const accRes = await alpacaBrokerService.getAccounts();
      setAccounts(accRes.data);
      logRequest('GET /v1/accounts', accRes.statusCode, accRes.requestId, accRes.data);

      const assetRes = await alpacaBrokerService.getAssets();
      setAssets(assetRes.data);

      if (selectedAccountId) {
        const achRes = await alpacaBrokerService.getAchRelationships(selectedAccountId);
        setAchRelationships(achRes.data);

        const ordRes = await alpacaBrokerService.getOrders(selectedAccountId);
        setOrders(ordRes.data);
      }

      const jnlRes = await alpacaBrokerService.getJournals();
      setJournals(jnlRes.data);

      setFirmBalance(alpacaBrokerService.getFirmBalance());
    } catch (err) {
      console.error('Failed to refresh Alpaca Broker data:', err);
    }
  };

  const logRequest = (endpoint: string, status: number, requestId: string, payload: any) => {
    setLogs(prev => [
      {
        id: Math.random().toString(),
        time: new Date().toISOString().split('T')[1].slice(0, 8),
        endpoint,
        status,
        requestId,
        payload
      },
      ...prev.slice(0, 19)
    ]);
  };

  const handleCopyBasicAuth = () => {
    const creds = alpacaBrokerService.getCredentials();
    navigator.clipboard.writeText(creds.basicAuthHeader);
    setCopiedHeader(true);
    setTimeout(() => setCopiedHeader(false), 2000);
  };

  const handleCreateAccount = async () => {
    const payload: AlpacaCreateAccountPayload = {
      contact: {
        email_address: newAccountEmail,
        phone_number: '7065912538',
        street_address: ['100 Sovereign Way'],
        city: 'San Mateo',
        postal_code: '33345',
        state: 'CA'
      },
      identity: {
        given_name: newAccountFirstName,
        family_name: newAccountLastName,
        date_of_birth: '1990-01-01',
        tax_id_type: 'USA_SSN',
        tax_id: newAccountSsn,
        country_of_citizenship: 'USA',
        country_of_birth: 'USA',
        country_of_tax_residence: 'USA',
        funding_source: ['employment_income'],
        annual_income_min: '10000',
        annual_income_max: '50000',
        total_net_worth_min: '20000',
        total_net_worth_max: '100000',
        liquid_net_worth_min: '10000',
        liquid_net_worth_max: '50000',
        liquidity_needs: 'does_not_matter',
        investment_experience_with_stocks: 'over_5_years',
        investment_experience_with_options: 'over_5_years',
        risk_tolerance: 'conservative',
        investment_objective: 'market_speculation',
        investment_time_horizon: 'more_than_10_years',
        marital_status: 'MARRIED',
        number_of_dependents: 2
      },
      disclosures: {
        is_control_person: false,
        is_affiliated_exchange_or_finra: false,
        is_affiliated_exchange_or_iiroc: false,
        is_politically_exposed: false,
        immediate_family_exposed: false
      },
      agreements: [
        { agreement: 'customer_agreement', signed_at: new Date().toISOString(), ip_address: '185.11.11.11' },
        { agreement: 'options_agreement', signed_at: new Date().toISOString(), ip_address: '185.11.11.11' },
        { agreement: 'margin_agreement', signed_at: new Date().toISOString(), ip_address: '185.11.11.11' }
      ]
    };

    const res = await alpacaBrokerService.createAccount(payload);
    logRequest('POST /v1/accounts', res.statusCode, res.requestId, res.data);
    setSelectedAccountId(res.data.id);
    refreshAllData();
  };

  const handleCreateAch = async () => {
    if (!selectedAccountId) return;
    const res = await alpacaBrokerService.createAchRelationship(selectedAccountId, {
      account_owner_name: achOwnerName,
      bank_account_type: 'CHECKING',
      bank_account_number: achAccountNum,
      bank_routing_number: achRoutingNum,
      nickname: achNickname
    });
    logRequest(`POST /v1/accounts/${selectedAccountId.slice(0,6)}.../ach_relationships`, res.statusCode, res.requestId, res.data);
    refreshAllData();
  };

  const handleFundAch = async (relationshipId: string) => {
    if (!selectedAccountId) return;
    const res = await alpacaBrokerService.fundAccountAch(selectedAccountId, {
      transfer_type: 'ach',
      relationship_id: relationshipId,
      amount: fundAmount,
      direction: 'INCOMING'
    });
    logRequest(`POST /v1/accounts/${selectedAccountId.slice(0, 6)}.../transfers`, res.statusCode, res.requestId, res.data);
    refreshAllData();
  };

  const handleJournalInstantSweep = async () => {
    if (!selectedAccountId) return;
    const res = await alpacaBrokerService.journalFunds({
      entry_type: 'JNLC',
      from_account: alpacaBrokerService.getFirmAccountId(),
      to_account: selectedAccountId,
      amount: journalAmount,
      description: 'Sandbox Instant Signup Reward Sweep'
    });
    logRequest('POST /v1/journals', res.statusCode, res.requestId, res.data);
    refreshAllData();
  };

  const handleCreateOrder = async () => {
    if (!selectedAccountId) return;
    const res = await alpacaBrokerService.createTradingOrder(selectedAccountId, {
      symbol: orderSymbol,
      qty: parseFloat(orderQty),
      side: orderSide,
      type: 'market',
      time_in_force: 'day'
    });
    logRequest(`POST /v1/trading/accounts/${selectedAccountId.slice(0, 6)}.../orders`, res.statusCode, res.requestId, res.data);
    refreshAllData();
  };

  const creds = alpacaBrokerService.getCredentials();

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 text-white font-sans">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-yellow-950/40 via-amber-900/20 to-gray-900 border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-500/20 border border-yellow-500/40 rounded-xl">
                <Building2 className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-yellow-100 flex items-center gap-2">
                  Alpaca Broker API Sovereign Gateway
                  <span className="text-[10px] font-mono uppercase bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                    Correspondent Sandbox
                  </span>
                </h1>
                <p className="text-xs text-gray-400 font-mono">
                  Full-Stack Omnibus & Fully-Disclosed Brokerage Orchestration // HTTP Basic Auth & X-Request-ID Tracking
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshAllData}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-mono rounded-lg border border-gray-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
              Sync API
            </button>
            <div className="flex items-center bg-black/50 border border-gray-800 rounded-lg p-1">
              <button
                onClick={() => setIsProduction(false)}
                className={`px-3 py-1 text-xs font-mono rounded-md transition ${!isProduction ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'text-gray-400'}`}
              >
                Sandbox
              </button>
              <button
                onClick={() => setIsProduction(true)}
                className={`px-3 py-1 text-xs font-mono rounded-md transition ${isProduction ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-gray-400'}`}
              >
                Production
              </button>
            </div>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-yellow-500/20">
          <div className="bg-black/30 border border-gray-800/80 rounded-xl p-3">
            <div className="text-[10px] font-mono text-gray-400 uppercase">Correspondent Accounts</div>
            <div className="text-xl font-mono text-yellow-400 font-bold mt-1">{accounts.length}</div>
          </div>
          <div className="bg-black/30 border border-gray-800/80 rounded-xl p-3">
            <div className="text-[10px] font-mono text-gray-400 uppercase">Firm Sweep Balance</div>
            <div className="text-xl font-mono text-emerald-400 font-bold mt-1">${firmBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-black/30 border border-gray-800/80 rounded-xl p-3">
            <div className="text-[10px] font-mono text-gray-400 uppercase">Active Asset Pool</div>
            <div className="text-xl font-mono text-cyan-400 font-bold mt-1">{assets.length} Tradable</div>
          </div>
          <div className="bg-black/30 border border-gray-800/80 rounded-xl p-3">
            <div className="text-[10px] font-mono text-gray-400 uppercase">Selected User Account</div>
            <div className="text-xs font-mono text-gray-300 truncate mt-1.5">{selectedAccountId}</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex gap-2 border-b border-gray-800 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'overview', label: 'API Credentials & Live Test', icon: Key },
          { id: 'assets', label: 'Assets Explorer', icon: TrendingUp },
          { id: 'accounts', label: 'Onboarding & Accounts', icon: UserPlus },
          { id: 'ach', label: 'ACH & Bank Funding', icon: Landmark },
          { id: 'journals', label: 'Instant Sweep Journals', icon: DollarSign },
          { id: 'orders', label: 'Trading Orders', icon: Activity },
          { id: 'events', label: 'SSE & X-Request-ID Audit', icon: Radio },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono rounded-t-xl transition whitespace-nowrap border-b-2 ${
                isActive 
                  ? 'bg-yellow-500/10 text-yellow-300 border-yellow-400' 
                  : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CREDENTIALS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="HTTP Basic Authentication & Postman Setup" icon={<ShieldCheck className="text-yellow-400" />}>
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-black/60 rounded-xl border border-gray-800 space-y-2">
                <div className="text-gray-400">Target Endpoint Base URL:</div>
                <div className="text-yellow-300 font-bold bg-yellow-950/40 p-2 rounded border border-yellow-800/40 break-all">
                  {creds.baseUrl}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400">Correspondent API Key (API_KEY):</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-yellow-200 font-mono focus:border-yellow-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400">Correspondent API Secret (API_SECRET):</label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={e => setApiSecret(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-yellow-200 font-mono focus:border-yellow-500 outline-none"
                />
              </div>

              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Base64 Encoded Authorization Header:</span>
                  <button 
                    onClick={handleCopyBasicAuth}
                    className="flex items-center gap-1 text-[10px] text-yellow-400 hover:underline"
                  >
                    {copiedHeader ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedHeader ? 'Copied!' : 'Copy Header'}
                  </button>
                </div>
                <div className="text-emerald-400 bg-black p-2 rounded text-[11px] break-all border border-emerald-900/40 font-mono">
                  Authorization: {creds.basicAuthHeader}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Postman & cURL Direct Call Generator" icon={<Terminal className="text-cyan-400" />}>
            <div className="space-y-4 text-xs font-mono">
              <p className="text-gray-400 leading-relaxed">
                Execute directly against Alpaca Broker API sandbox using cURL or import into Postman.
              </p>
              
              <div className="p-3 bg-black/80 rounded-xl border border-gray-800 text-gray-300 overflow-x-auto space-y-2 font-mono text-[11px]">
                <div className="text-cyan-400 font-bold"># GET All Available Tradable Assets</div>
                <pre className="text-gray-400">
{`curl -X GET "${creds.baseUrl}/assets" \\
  -H "Authorization: ${creds.basicAuthHeader}" \\
  -H "Accept: application/json"`}
                </pre>
              </div>

              <div className="p-3 bg-black/80 rounded-xl border border-gray-800 text-gray-300 overflow-x-auto space-y-2 font-mono text-[11px]">
                <div className="text-yellow-400 font-bold"># Create Fully-Disclosed End User Account</div>
                <pre className="text-gray-400">
{`curl -X POST "${creds.baseUrl}/accounts" \\
  -H "Authorization: ${creds.basicAuthHeader}" \\
  -H "Content-Type: application/json" \\
  -d '{"contact":{"email_address":"test1@gmail.com"...}}'`}
                </pre>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: ASSETS EXPLORER */}
      {activeTab === 'assets' && (
        <Card title="Alpaca Asset Pool (GET /v1/assets)" icon={<TrendingUp className="text-emerald-400" />}>
          <div className="space-y-4">
            <p className="text-xs font-mono text-gray-400">
              Listing all assets available for trading on Alpaca (US Equity & Fractional shares enabled).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 bg-black/40">
                    <th className="p-2.5">Symbol</th>
                    <th className="p-2.5">Asset Name</th>
                    <th className="p-2.5">Exchange</th>
                    <th className="p-2.5">Class</th>
                    <th className="p-2.5">Tradable</th>
                    <th className="p-2.5">Fractionable</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {assets.map(asset => (
                    <tr key={asset.id} className="hover:bg-gray-800/30 transition">
                      <td className="p-2.5 font-bold text-yellow-300">{asset.symbol}</td>
                      <td className="p-2.5 text-gray-200">{asset.name}</td>
                      <td className="p-2.5 text-gray-400">{asset.exchange}</td>
                      <td className="p-2.5 text-gray-400">{asset.class}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {asset.tradable ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {asset.fractionable ? 'FRACTIONAL' : 'WHOLE'}
                        </span>
                      </td>
                      <td className="p-2.5 uppercase text-gray-400">{asset.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: ACCOUNT ONBOARDING */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Fully-Disclosed Account Creation (POST /v1/accounts)" icon={<UserPlus className="text-yellow-400" />}>
            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">First Name</label>
                  <input
                    type="text"
                    value={newAccountFirstName}
                    onChange={e => setNewAccountFirstName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Last Name</label>
                  <input
                    type="text"
                    value={newAccountLastName}
                    onChange={e => setNewAccountLastName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400">Email Address</label>
                <input
                  type="email"
                  value={newAccountEmail}
                  onChange={e => setNewAccountEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400">Tax ID (USA SSN)</label>
                <input
                  type="text"
                  value={newAccountSsn}
                  onChange={e => setNewAccountSsn(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                />
              </div>

              <div className="p-3 bg-black/40 border border-gray-800 rounded-xl space-y-1 text-[11px] text-gray-400">
                <div className="text-yellow-400 font-bold">Auto-Attached Agreements:</div>
                <div>• Customer Agreement (signed_at: {new Date().toISOString().slice(0,10)})</div>
                <div>• Options Trading Agreement & Margin Agreement</div>
              </div>

              <button
                onClick={handleCreateAccount}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Submit Onboarding Application
              </button>
            </div>
          </Card>

          <Card title="Existing Accounts Registry" icon={<Building2 className="text-cyan-400" />}>
            <div className="space-y-3">
              {accounts.map(acc => (
                <div
                  key={acc.id}
                  onClick={() => setSelectedAccountId(acc.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer font-mono text-xs ${
                    selectedAccountId === acc.id 
                      ? 'bg-yellow-500/10 border-yellow-500/50' 
                      : 'bg-black/40 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-yellow-300">Acc #{acc.account_number}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {acc.status}
                    </span>
                  </div>
                  <div className="text-gray-400 text-[11px] mt-1">ID: {acc.id}</div>
                  <div className="flex justify-between items-center mt-2 text-gray-300 pt-2 border-t border-gray-800/60">
                    <span>Equity: ${acc.last_equity} {acc.currency}</span>
                    <span className="text-[10px] text-gray-400">{acc.identity?.given_name} {acc.identity?.family_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: ACH RELATIONSHIPS & TRANSFERS */}
      {activeTab === 'ach' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Establish ACH Relationship (POST /v1/accounts/.../ach_relationships)" icon={<Landmark className="text-emerald-400" />}>
            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-gray-400">Target Account ID</label>
                <input
                  type="text"
                  value={selectedAccountId}
                  readOnly
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-yellow-300 font-mono mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400">Account Owner Name</label>
                <input
                  type="text"
                  value={achOwnerName}
                  onChange={e => setAchOwnerName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Account Number</label>
                  <input
                    type="text"
                    value={achAccountNum}
                    onChange={e => setAchAccountNum(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Routing Number</label>
                  <input
                    type="text"
                    value={achRoutingNum}
                    onChange={e => setAchRoutingNum(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400">Bank Nickname</label>
                <input
                  type="text"
                  value={achNickname}
                  onChange={e => setAchNickname(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                />
              </div>

              <button
                onClick={handleCreateAch}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <Landmark className="w-4 h-4" />
                Link Bank Account (ACH)
              </button>
            </div>
          </Card>

          <Card title="Active ACH Relationships & Transfers" icon={<ArrowRightLeft className="text-cyan-400" />}>
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-gray-400">Funding Amount ($ USD)</label>
                <input
                  type="text"
                  value={fundAmount}
                  onChange={e => setFundAmount(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-emerald-300 outline-none focus:border-yellow-500"
                />
              </div>

              <div className="space-y-3 pt-2">
                {achRelationships.map(rel => (
                  <div key={rel.id} className="p-3 bg-black/40 border border-gray-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-yellow-300">{rel.nickname}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {rel.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Owner: {rel.account_owner_name} | Routing: {rel.bank_routing_number}
                    </div>
                    <button
                      onClick={() => handleFundAch(rel.id)}
                      className="w-full py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg transition text-[11px] font-bold flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Initiate ACH Transfer (${fundAmount})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: INSTANT SWEEP JOURNALS */}
      {activeTab === 'journals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Firm Sweep Journaling (JNLC Entry)" icon={<DollarSign className="text-yellow-400" />}>
            <div className="space-y-4 text-xs font-mono">
              <p className="text-gray-400 leading-relaxed">
                Fund end-user accounts instantly from your pre-funded $50,000 Sandbox Firm Account using internal journal entries.
              </p>

              <div className="p-3 bg-black/60 border border-gray-800 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Firm Sweep Account ID:</span>
                  <span className="text-yellow-300 font-bold">{alpacaBrokerService.getFirmAccountId()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Firm Account Equity:</span>
                  <span className="text-emerald-400 font-bold">${firmBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400">Target User Account ID</label>
                <input
                  type="text"
                  value={selectedAccountId}
                  readOnly
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-yellow-300 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400">Journal Amount ($ USD)</label>
                <input
                  type="text"
                  value={journalAmount}
                  onChange={e => setJournalAmount(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                />
              </div>

              <button
                onClick={handleJournalInstantSweep}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Execute Instant JNLC Journal Sweep
              </button>
            </div>
          </Card>

          <Card title="Journal Audit Log (GET /v1/journals)" icon={<FileJson className="text-cyan-400" />}>
            <div className="space-y-3 font-mono text-xs">
              {journals.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No journal entries executed yet.</div>
              ) : (
                journals.map(jnl => (
                  <div key={jnl.id} className="p-3 bg-black/40 border border-gray-800 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-yellow-300">{jnl.entry_type} | ${jnl.amount}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        {jnl.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400">From: {jnl.from_account.slice(0, 10)}... → To: {jnl.to_account.slice(0, 10)}...</div>
                    <div className="text-[10px] text-gray-500">{jnl.created_at}</div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: TRADING ORDERS */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Submit Trading Order (POST /v1/trading/accounts/.../orders)" icon={<Activity className="text-yellow-400" />}>
            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-gray-400">Target Account</label>
                <input
                  type="text"
                  value={selectedAccountId}
                  readOnly
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-yellow-300 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Symbol</label>
                  <input
                    type="text"
                    value={orderSymbol}
                    onChange={e => setOrderSymbol(e.target.value.toUpperCase())}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1 uppercase"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Quantity (Shares)</label>
                  <input
                    type="text"
                    value={orderQty}
                    onChange={e => setOrderQty(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-yellow-500 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400">Side</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    onClick={() => setOrderSide('buy')}
                    className={`py-2 rounded-lg border font-bold transition ${
                      orderSide === 'buy' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-gray-900 border-gray-800 text-gray-400'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => setOrderSide('sell')}
                    className={`py-2 rounded-lg border font-bold transition ${
                      orderSide === 'sell' ? 'bg-red-500/20 text-red-300 border-red-500' : 'bg-gray-900 border-gray-800 text-gray-400'
                    }`}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Submit Order to Alpaca Execution Engine
              </button>
            </div>
          </Card>

          <Card title="Submitted Orders History" icon={<Activity className="text-cyan-400" />}>
            <div className="space-y-3 font-mono text-xs">
              {orders.map(ord => (
                <div key={ord.id} className="p-3 bg-black/40 border border-gray-800 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-yellow-300">
                      {ord.side.toUpperCase()} {ord.qty} {ord.symbol} @ ${ord.filled_avg_price || 'MKT'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                      {ord.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">Order ID: {ord.id}</div>
                  <div className="text-[10px] text-gray-500">{ord.created_at}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 7: SSE & X-REQUEST-ID AUDIT */}
      {activeTab === 'events' && (
        <Card title="SSE Event Stream & X-Request-ID Real-Time Inspector" icon={<Radio className="text-yellow-400" />}>
          <div className="space-y-4 text-xs font-mono">
            <p className="text-gray-400">
              All Broker API responses provide a unique <code className="text-yellow-300">X-Request-ID</code> header for complete call-chain tracing in support & debugging.
            </p>

            <div className="bg-black/90 rounded-2xl border border-gray-800 p-4 font-mono space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {logs.map(log => (
                <div key={log.id} className="p-2 border border-gray-800/80 rounded-lg bg-gray-950 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-cyan-400 font-bold">{log.endpoint}</span>
                    <span className="text-emerald-400">HTTP {log.status}</span>
                  </div>
                  <div className="text-[10px] text-yellow-300">
                    X-Request-ID: <span className="text-gray-300">{log.requestId}</span>
                  </div>
                  <div className="text-[10px] text-gray-500">{log.time}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AlpacaBrokerView;

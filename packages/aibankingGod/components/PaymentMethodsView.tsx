import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import PlaidLinkButton from './PlaidLinkButton';
import { stripeBridgeService, TreasuryFinancialAccount } from '../services/StripeBridgeService';
import { 
  CreditCard, Building, Wallet, Plus, CheckCircle, AlertCircle, 
  ShieldCheck, ArrowRight, RefreshCw, ArrowUpRight, ArrowDownLeft, 
  Trash2, Globe, Activity, Lock, Layers, Coins, Terminal, ArrowRightLeft,
  Calendar, Shield, Banknote, Fingerprint, Eye, EyeOff, Edit3, XCircle, FileText
} from 'lucide-react';

const PaymentMethodsView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;

  const { linkedAccounts, linkAccount, unlinkAccount, transactions, setTransactions, showNotification } = context;

  // Stripe Treasury v2 Financial Accounts State
  const [financialAccounts, setFinancialAccounts] = useState<TreasuryFinancialAccount[]>([]);
  const [selectedFaId, setSelectedFaId] = useState<string>('fa_123_singularity');
  const [loadingFa, setLoadingFa] = useState<boolean>(false);
  const [isExpandedAccountNumber, setIsExpandedAccountNumber] = useState<boolean>(false);
  const [expandedAccountNumbers, setExpandedAccountNumbers] = useState<Record<string, string>>({});

  // Account Creation Modal State
  const [showCreateFaModal, setShowCreateFaModal] = useState<boolean>(false);
  const [newConnectedAccountId, setNewConnectedAccountId] = useState<string>('acct_1M23connected');
  const [newNickname, setNewNickname] = useState<string>('Treasury Reserve Account');
  const [reqCardIssuing, setReqCardIssuing] = useState<boolean>(true);
  const [reqDepositInsurance, setReqDepositInsurance] = useState<boolean>(true);
  const [reqInboundAch, setReqInboundAch] = useState<boolean>(true);
  const [reqOutboundAch, setReqOutboundAch] = useState<boolean>(true);
  const [reqOutboundWire, setReqOutboundWire] = useState<boolean>(true);

  // Edit Nickname State
  const [editingFaId, setEditingFaId] = useState<string | null>(null);
  const [editNicknameValue, setEditNicknameValue] = useState<string>('');

  // Close Account Modal State
  const [closingFaId, setClosingFaId] = useState<string | null>(null);
  const [forwardingType, setForwardingType] = useState<string>('payment_method');
  const [forwardingPmId, setForwardingPmId] = useState<string>('pm_1M23forwardingBank');

  // Webhook Events Stream State
  const [stripeEvents, setStripeEvents] = useState<any[]>([]);

  // Stripe Treasury balance synchronized to LocalStorage
  const [treasuryBalance, setTreasuryBalance] = useState(() => {
    const saved = localStorage.getItem('STRIPE_TREASURY_BALANCE_V2');
    return saved ? JSON.parse(saved) : {
      cash: 9480.00,
      inbound_pending: 0.00,
      outbound_pending: 1000.00
    };
  });

  // Modern Treasury persistent transaction list
  const [treasuryTx, setTreasuryTx] = useState<any[]>(() => {
    const saved = localStorage.getItem('AQUARIUS_TREASURY_TRANSACTIONS_V2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 'tx_tre_101', description: 'Stripe Card Issuing - Terminal Node Auth', amount: -150.00, type: 'debit', status: 'posted', date: new Date(Date.now() - 3600000 * 4).toISOString(), reference: 'ref_982312a' },
      { id: 'tx_tre_102', description: 'Stripe Treasury Deposit (Inbound ACH)', amount: 1200.00, type: 'credit', status: 'posted', date: new Date(Date.now() - 3600000 * 24).toISOString(), reference: 'ref_098132b' },
      { id: 'tx_tre_103', description: 'Outbound Bank Wire (ABA 000000001)', amount: -3000.00, type: 'debit', status: 'posted', date: new Date(Date.now() - 3600000 * 72).toISOString(), reference: 'ref_112003c' }
    ];
  });

  // Plaid Simulating Dialog states
  const [showPlaidSim, setShowPlaidSim] = useState(false);
  const [selectedInst, setSelectedInst] = useState<string | null>(null);
  const [simUsername, setSimUsername] = useState('user_sandbox');
  const [simPassword, setSimPassword] = useState('*********');
  const [isSimulatingLink, setIsSimulatingLink] = useState(false);

  // Stripe Cash Operations states
  const [depositAmount, setDepositAmount] = useState('1500');
  const [selectedPlaidId, setSelectedPlaidId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [payeeRouting, setPayeeRouting] = useState('');
  const [payeeAccount, setPayeeAccount] = useState('');
  const [sendAmount, setSendAmount] = useState('500');

  // Initial Load for Financial Accounts & Webhook Stream
  useEffect(() => {
    loadFinancialAccounts();
    loadStripeEvents();
  }, []);

  const loadFinancialAccounts = async () => {
    setLoadingFa(true);
    try {
      const list = await stripeBridgeService.listFinancialAccounts();
      setFinancialAccounts(list);
      if (list.length > 0 && !selectedFaId) {
        setSelectedFaId(list[0].id);
      }
    } catch (e) {
      console.error("Error loading financial accounts:", e);
    } finally {
      setLoadingFa(false);
    }
  };

  const loadStripeEvents = async () => {
    try {
      const res = await fetch('/api/v1/stripe/events');
      if (res.ok) {
        const events = await res.json();
        setStripeEvents(events);
      }
    } catch (e) {
      console.error("Error loading stripe events:", e);
    }
  };

  // Expand account number helper
  const handleToggleExpandAccountNumber = async (faId: string) => {
    if (expandedAccountNumbers[faId]) {
      const updated = { ...expandedAccountNumbers };
      delete updated[faId];
      setExpandedAccountNumbers(updated);
      setIsExpandedAccountNumber(false);
    } else {
      try {
        const account = await stripeBridgeService.getFinancialAccount(faId, undefined, true);
        const fullNumber = account.financial_addresses?.[0]?.aba?.account_number || '12345678907890';
        setExpandedAccountNumbers(prev => ({ ...prev, [faId]: fullNumber }));
        setIsExpandedAccountNumber(true);
        showNotification('Retrieved expanded ABA account number securely.', 'info');
      } catch (e) {
        showNotification('Failed to expand account number', 'error');
      }
    }
  };

  // Create Financial Account
  const handleCreateFinancialAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnectedAccountId.trim()) {
      showNotification('Connected Account ID is required', 'error');
      return;
    }
    setLoadingFa(true);
    try {
      const created = await stripeBridgeService.createFinancialAccount({
        connectedAccountId: newConnectedAccountId,
        nickname: newNickname,
        supportedCurrencies: ['usd'],
        features: {
          card_issuing: { requested: reqCardIssuing },
          deposit_insurance: { requested: reqDepositInsurance },
          financial_addresses: { aba: { requested: true } },
          inbound_transfers: { ach: { requested: reqInboundAch } },
          intra_stripe_flows: { requested: true },
          outbound_payments: { ach: { requested: reqOutboundAch }, us_domestic_wire: { requested: reqOutboundWire } }
        }
      });
      showNotification(`FinancialAccount ${created.id} created successfully!`, 'success');
      setShowCreateFaModal(false);
      await loadFinancialAccounts();
      await loadStripeEvents();
    } catch (e) {
      showNotification('Error creating financial account', 'error');
    } finally {
      setLoadingFa(false);
    }
  };

  // Update Financial Account Nickname
  const handleUpdateNickname = async (faId: string) => {
    if (!editNicknameValue.trim()) return;
    try {
      await stripeBridgeService.updateFinancialAccount(faId, {
        nickname: editNicknameValue
      });
      showNotification(`Nickname updated to "${editNicknameValue}"`, 'success');
      setEditingFaId(null);
      await loadFinancialAccounts();
      await loadStripeEvents();
    } catch (e) {
      showNotification('Failed to update nickname', 'error');
    }
  };

  // Close Financial Account
  const handleCloseAccount = async () => {
    if (!closingFaId) return;
    try {
      await stripeBridgeService.closeFinancialAccount(closingFaId, {
        forwardingSettings: {
          type: forwardingType,
          payment_method: forwardingPmId
        }
      });
      showNotification(`FinancialAccount ${closingFaId} is now closed. Debits/credits will forward to ${forwardingPmId}.`, 'info');
      setClosingFaId(null);
      await loadFinancialAccounts();
      await loadStripeEvents();
    } catch (e) {
      showNotification('Failed to close financial account', 'error');
    }
  };

  // Persist Treasury Balance & Ledger
  useEffect(() => {
    localStorage.setItem('STRIPE_TREASURY_BALANCE_V2', JSON.stringify(treasuryBalance));
  }, [treasuryBalance]);

  useEffect(() => {
    localStorage.setItem('AQUARIUS_TREASURY_TRANSACTIONS_V2', JSON.stringify(treasuryTx));
  }, [treasuryTx]);

  // Set default Plaid account selection
  useEffect(() => {
    if (linkedAccounts.length > 0 && !selectedPlaidId) {
      setSelectedPlaidId(linkedAccounts[0].id);
    }
  }, [linkedAccounts, selectedPlaidId]);

  const activeFa = financialAccounts.find(fa => fa.id === selectedFaId) || financialAccounts[0] || {
    id: "fa_123_singularity",
    nickname: "Autonomous Treasury Core",
    country: "US",
    supported_currencies: ["usd"],
    active_features: ["financial_addresses.aba", "deposit_insurance", "card_issuing"],
    pending_features: ["inbound_transfers.ach"],
    restricted_features: ["outbound_payments.ach", "outbound_payments.us_domestic_wire"],
    financial_addresses: [
      {
        type: "aba",
        supported_networks: ["ach", "domestic_wire_us"],
        aba: {
          bank_name: "Goldman Sachs",
          routing_number: "000000001",
          account_number_last4: "7890",
          account_number: "12345678907890"
        }
      }
    ],
    status: "open"
  };

  // Perform Plaid simulated linking
  const handleSimulatePlaidLink = () => {
    if (!selectedInst) {
      showNotification('Please choose an institution', 'error');
      return;
    }
    setIsSimulatingLink(true);
    setTimeout(() => {
      const generatedId = `la_${Date.now()}`;
      const mockAccounts = [
        { id: generatedId, bankName: selectedInst, accountName: 'Sovereign Checking', accountNumberLast4: Math.floor(1000 + Math.random() * 9000).toString(), routingNumber: '021000021', balance: 14500.00, type: 'checking', status: 'connected' }
      ];
      linkAccount(mockAccounts[0]);
      setIsSimulatingLink(false);
      setShowPlaidSim(false);
      setSelectedInst(null);
      showNotification(`Successfully linked ${selectedInst} via Plaid Enclave.`, 'success');
    }, 2000);
  };

  // Handle active Plaid API connection success integration
  const handlePlaidSuccess = (accessToken: string, metadata: any) => {
    const institutionName = metadata?.institution?.name || 'Plaid Linked Bank';
    const accNumber4 = metadata?.account?.mask || '4321';
    const generatedId = `la_${Date.now()}`;
    const newLink = {
      id: generatedId,
      bankName: institutionName,
      accountName: metadata?.account?.name || 'Primary Vault',
      accountNumberLast4: accNumber4,
      routingNumber: '021000021',
      balance: 10000.00,
      type: 'checking',
      status: 'connected',
      accessToken: accessToken
    };
    linkAccount(newLink);
    showNotification(`Successfully integrated ${institutionName} via live Plaid API!`, 'success');
  };

  // Fund Stripe Treasury via Plaid Link (Stripe Inbound Transfer)
  const handleStripeDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountFloat = parseFloat(depositAmount);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    const linkedBank = linkedAccounts.find(x => x.id === selectedPlaidId);
    if (!linkedBank) {
      showNotification('Please connect an active Plaid bank first', 'error');
      return;
    }

    if (linkedBank.balance < amountFloat) {
      showNotification(`Insufficient funds in Plaid linked account (${linkedBank.bankName})`, 'error');
      return;
    }

    // Deduct from Plaid bank, deposit to Stripe treasury cash balance
    linkedBank.balance = Math.max(0, linkedBank.balance - amountFloat);
    setTreasuryBalance((prev: any) => ({
      ...prev,
      cash: prev.cash + amountFloat
    }));

    // Register active Modern Treasury Transaction
    const newTx = {
      id: `tx_tre_${Date.now()}`,
      description: `Stripe Inbound Transfer (ACH via Plaid: ${linkedBank.bankName})`,
      amount: amountFloat,
      type: 'credit',
      status: 'posted',
      date: new Date().toISOString(),
      reference: `ref_ach_${Math.random().toString(16).slice(2, 8)}`
    };

    setTreasuryTx((prev: any[]) => [newTx, ...prev]);

    // Push same transaction to Global Ledger/DataContext so user sees it instantly
    if (transactions && setTransactions) {
      setTransactions([
        {
          id: `tx_${Date.now()}`,
          description: `Stripe Treasury Inbound - Plaid Funding (${linkedBank.bankName})`,
          amount: amountFloat,
          currency: 'USD',
          type: 'INFLOW',
          date: new Date().toISOString().split('T')[0],
          category: 'Banking',
          metadata: {
            merchantName: 'Stripe Treasury',
            carbonFootprint: 0,
            tags: ['treasury', 'plaid']
          }
        },
        ...transactions
      ]);
    }

    showNotification(`Stripe inbound transfer cleared. Deposited $${amountFloat.toLocaleString()} to Treasury.`, 'success');
  };

  // Spend/withdraw/send funds from Stripe Treasury Outbound ACH/Wire
  const handleStripeSend = (e: React.FormEvent) => {
    e.preventDefault();
    const amountFloat = parseFloat(sendAmount);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    if (!payeeName.trim() || !payeeRouting.trim() || !payeeAccount.trim()) {
      showNotification('Please fill in complete bank routing/accounting credentials', 'error');
      return;
    }

    if (treasuryBalance.cash < amountFloat) {
      showNotification('Insufficient funds in Stripe Treasury cash balance', 'error');
      return;
    }

    // Deduct from Stripe Treasury balance
    setTreasuryBalance((prev: any) => ({
      ...prev,
      cash: prev.cash - amountFloat
    }));

    // Save transaction
    const newTx = {
      id: `tx_tre_${Date.now()}`,
      description: `Outbound Payment to ${payeeName} (ACH / WIRE)`,
      amount: -amountFloat,
      type: 'debit',
      status: 'posted',
      date: new Date().toISOString(),
      reference: `ref_out_${Math.random().toString(16).slice(2, 8)}`
    };

    setTreasuryTx((prev: any[]) => [newTx, ...prev]);

    // Push into Global Ledger
    if (transactions && setTransactions) {
      setTransactions([
        {
          id: `tx_${Date.now()}`,
          description: `Stripe Outbound Wire to ${payeeName}`,
          amount: -amountFloat,
          currency: 'USD',
          type: 'OUTFLOW',
          date: new Date().toISOString().split('T')[0],
          category: 'Banking',
          metadata: {
            merchantName: payeeName,
            carbonFootprint: 0,
            tags: ['treasury', 'wire_transfer']
          }
        },
        ...transactions
      ]);
    }

    setPayeeName('');
    setPayeeRouting('');
    setPayeeAccount('');
    showNotification(`Outbound transfer of $${amountFloat.toLocaleString()} securely sent via Stripe Treasury.`, 'success');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 text-cyan-400 font-mono text-[10px] tracking-[0.4em] uppercase">
            <ShieldCheck size={14} className="animate-pulse" /> Banking Protocol v2 // Stripe Treasury
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase sm:text-6xl">
            Financial <span className="text-lime-500">Accounts</span> Management
          </h1>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setShowCreateFaModal(true)} 
            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs tracking-wider uppercase rounded-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-indigo-600/20"
          >
            <Plus size={16} /> Provision Financial Account
          </button>
          <PlaidLinkButton 
            onSuccess={handlePlaidSuccess}
            label="Link Bank Account (Plaid)"
          />
        </div>
      </header>

      {/* Grid of Core Handshakes (Plaid left, Stripe central) */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT: Plaid Linked Banks & Webhook Stream */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Building size={120} />
            </div>
            
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Globe className="text-cyan-400" size={18} />
              Plaid Secure Institutions
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed select-none">
              Verified banking nodes connected across standard open Plaid API gateways. Link real external bank accounts or instantiate development sandboxes.
            </p>

            <div className="space-y-4">
              {linkedAccounts.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl bg-black/30">
                  <AlertCircle className="mx-auto text-gray-600 mb-2" size={28} />
                  <p className="text-xs text-gray-400">No external institutions linked yet.</p>
                  <p className="text-[10px] text-gray-600 mt-1 uppercase">Ready for Plaid handshake</p>
                </div>
              ) : (
                linkedAccounts.map((account: any) => (
                  <div key={account.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-start justify-between hover:border-cyan-500/20 transition-all group">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-600/10 flex items-center justify-center text-cyan-400 border border-cyan-400/20 shrink-0">
                        <Building size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white leading-tight">{account.bankName}</h3>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{account.accountName} (•••• {account.accountNumberLast4})</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[9px] text-green-400 font-mono font-bold uppercase tracking-wider">Balance: ${account.balance?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        unlinkAccount(account.id);
                        showNotification(`Disconnected ${account.bankName} link.`, 'info');
                      }}
                      className="text-gray-500 hover:text-red-400 p-2 rounded-lg bg-white/5 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                      title="Delete handshake"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Live API Trigger (Plaid Web integration)</h3>
              <PlaidLinkButton 
                onSuccess={handlePlaidSuccess}
                label="Launch Sandbox Plaid SDK"
                className="w-full"
              />
            </div>
          </div>

          {/* Webhook Events Stream */}
          <div className="bg-black/40 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity size={14} className="text-indigo-400" /> Stripe Treasury Webhook Log
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-light mb-4">
              Real-time audit log of <code className="text-indigo-300">treasury.financial_account.*</code> webhooks generated upon provisioning, feature status updates, or closures.
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {stripeEvents.length === 0 ? (
                <p className="text-[10px] text-gray-600 font-mono italic">No webhooks recorded yet.</p>
              ) : (
                stripeEvents.map((evt: any) => (
                  <div key={evt.id} className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-[10px] font-mono">
                    <div className="flex justify-between items-center text-indigo-300 font-bold">
                      <span>{evt.type}</span>
                      <span className="text-gray-500 text-[8px]">{new Date(evt.created * 1000).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-400 mt-1 text-[9px] truncate">
                      FA: {evt.data?.object?.id || 'fa_123'} | Status: {evt.data?.object?.status || 'active'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Stripe Connected Financial Account (Stripe Treasury v2) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Account Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <Building size={18} className="text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Select Financial Account:</span>
              <select 
                value={selectedFaId}
                onChange={(e) => setSelectedFaId(e.target.value)}
                className="bg-black/80 border border-indigo-500/30 rounded-xl px-3 py-1.5 text-xs text-indigo-300 font-mono font-bold focus:outline-none focus:border-indigo-400"
              >
                {financialAccounts.map(fa => (
                  <option key={fa.id} value={fa.id}>
                    {fa.nickname || fa.id} ({fa.status || 'open'})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={loadFinancialAccounts}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-mono uppercase"
            >
              <RefreshCw size={12} className={loadingFa ? "animate-spin" : ""} /> Sync Treasury
            </button>
          </div>

          {/* Main Financial Account Display */}
          <div className="bg-gradient-to-br from-indigo-900/20 via-slate-900/50 to-black border border-indigo-500/20 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-12 -right-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-[9px] font-black tracking-widest uppercase rounded-full border ${activeFa.status === 'closed' ? 'bg-red-500/20 text-red-300 border-red-400/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'}`}>
                    {activeFa.status || "open"}
                  </span>
                  <span className="px-2.5 py-1 text-[9px] font-mono text-gray-400 bg-black/40 rounded-full border border-white/5">
                    Country: {activeFa.country || 'US'}
                  </span>
                </div>

                {editingFaId === activeFa.id ? (
                  <div className="flex items-center gap-2 mt-3">
                    <input 
                      type="text" 
                      value={editNicknameValue} 
                      onChange={(e) => setEditNicknameValue(e.target.value)}
                      className="bg-black/60 border border-indigo-500/50 rounded-xl px-3 py-1.5 text-lg font-black text-white focus:outline-none"
                    />
                    <button 
                      onClick={() => handleUpdateNickname(activeFa.id)}
                      className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingFaId(null)}
                      className="px-3 py-1.5 bg-white/10 text-gray-300 font-bold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-3">
                    <h2 className="text-3xl font-black text-white tracking-tight">{activeFa.nickname || activeFa.id}</h2>
                    {activeFa.status !== 'closed' && (
                      <button 
                        onClick={() => {
                          setEditingFaId(activeFa.id);
                          setEditNicknameValue(activeFa.nickname || '');
                        }}
                        className="p-1.5 text-gray-500 hover:text-indigo-400 transition-colors"
                        title="Edit account nickname"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 font-mono mt-1 uppercase">Financial Account ID: {activeFa.id}</p>
              </div>

              <div className="text-right sm:text-right space-y-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Stripe Routing Registry (ABA)</p>
                <p className="text-xs text-indigo-300 font-mono font-bold">
                  {activeFa.financial_addresses?.[0]?.aba?.bank_name || "Goldman Sachs"}
                </p>
                <div className="flex items-center justify-end gap-2 text-[11px] text-gray-300 font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                  <span>Routing: {activeFa.financial_addresses?.[0]?.aba?.routing_number || "000000001"}</span>
                  <span>|</span>
                  <span>
                    Acct: {expandedAccountNumbers[activeFa.id] 
                      ? expandedAccountNumbers[activeFa.id] 
                      : `••••••••${activeFa.financial_addresses?.[0]?.aba?.account_number_last4 || "7890"}`}
                  </span>
                  <button 
                    onClick={() => handleToggleExpandAccountNumber(activeFa.id)}
                    className="ml-1 text-cyan-400 hover:text-cyan-300 transition-colors p-1"
                    title={expandedAccountNumbers[activeFa.id] ? "Hide Account Number" : "Expand Full Account Number via API"}
                  >
                    {expandedAccountNumbers[activeFa.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Status Summaries */}
            <div className="mb-8 p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Shield size={12} className="text-indigo-400" /> Feature Capability Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] font-mono">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <span className="text-green-400 font-bold block mb-1">Active Features ({activeFa.active_features?.length || 0})</span>
                  <div className="flex flex-wrap gap-1">
                    {activeFa.active_features?.map((feat: string) => (
                      <span key={feat} className="px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded text-[9px]">
                        {feat}
                      </span>
                    )) || <span className="text-gray-500">None</span>}
                  </div>
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <span className="text-yellow-400 font-bold block mb-1">Pending Features ({activeFa.pending_features?.length || 0})</span>
                  <div className="flex flex-wrap gap-1">
                    {activeFa.pending_features?.map((feat: string) => (
                      <span key={feat} className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-[9px]">
                        {feat}
                      </span>
                    )) || <span className="text-gray-500">None</span>}
                  </div>
                </div>

                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <span className="text-red-400 font-bold block mb-1">Restricted ({activeFa.restricted_features?.length || 0})</span>
                  <div className="flex flex-wrap gap-1">
                    {activeFa.restricted_features?.map((feat: string) => (
                      <span key={feat} className="px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded text-[9px]">
                        {feat}
                      </span>
                    )) || <span className="text-gray-500">None</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/40 p-6 rounded-2xl border border-white/5 mb-8">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Cash Balance (Available)</p>
                <p className="text-3xl font-mono font-black text-lime-400">${treasuryBalance.cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-[9px] text-gray-600 font-mono mt-1">USD • Realtime Liquidity</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Inbound Pending</p>
                <p className="text-3xl font-mono font-black text-orange-400">${treasuryBalance.inbound_pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-[9px] text-gray-600 font-mono mt-1">ACH Verification</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Outbound Pending</p>
                <p className="text-3xl font-mono font-black text-gray-400">${treasuryBalance.outbound_pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-[9px] text-gray-600 font-mono mt-1">Authorized Wires</p>
              </div>
            </div>

            {/* Operations Tab / Money Movements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              
              {/* Load Funds via Linked Banks */}
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ArrowDownLeft className="text-lime-400" size={16} />
                  Inbound ACH Deposit (via Plaid)
                </h3>
                <p className="text-[11px] text-gray-500 mb-4">Move money from your linked external checking account directly into the Stripe Treasury node.</p>
                
                <form onSubmit={handleStripeDeposit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Select Connected Bank</label>
                    {linkedAccounts.length === 0 ? (
                      <div className="text-xs text-red-400 bg-red-400/5 border border-red-400/10 p-3 rounded-xl flex items-center gap-2">
                        <AlertCircle size={14} /> Link bank via Plaid first to proceed
                      </div>
                    ) : (
                      <select 
                        value={selectedPlaidId} 
                        onChange={(e) => setSelectedPlaidId(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        {linkedAccounts.map((acc: any) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.bankName} (•••• {acc.accountNumberLast4}) — Balance: ${acc.balance}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Transfer Magnitude (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-500 font-black">$</span>
                      <input 
                        type="number" 
                        value={depositAmount} 
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Amount" 
                        className="w-full bg-black/60 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs text-white focus:outline-none focus:border-lime-500 font-mono font-black"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={linkedAccounts.length === 0 || activeFa.status === 'closed'}
                    className="w-full py-3.5 bg-lime-500 hover:bg-lime-400 disabled:opacity-30 disabled:hover:bg-lime-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowDownLeft size={16} /> Fund Stripe Treasury
                  </button>
                </form>
              </div>

              {/* Pay or Send Outbound Funds */}
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ArrowUpRight className="text-orange-400" size={16} />
                  Send Outbound Payment (Stripe ACH)
                </h3>
                <p className="text-[11px] text-gray-500 mb-4">Distribute funds from the Stripe Financial Account cache to an external recipient bank account.</p>
                
                <form onSubmit={handleStripeSend} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Payee/Institution</label>
                      <input 
                        type="text" 
                        value={payeeName}
                        onChange={(e) => setPayeeName(e.target.value)}
                        placeholder="e.g. Acme Corp" 
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-500 font-black">$</span>
                        <input 
                          type="number" 
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          placeholder="500" 
                          className="w-full bg-black/60 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">ABA Routing</label>
                      <input 
                        type="text" 
                        value={payeeRouting}
                        onChange={(e) => setPayeeRouting(e.target.value)}
                        placeholder="9 digits" 
                        maxLength={9}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Account Number</label>
                      <input 
                        type="password" 
                        value={payeeAccount}
                        onChange={(e) => setPayeeAccount(e.target.value)}
                        placeholder="Acct Number" 
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={activeFa.status === 'closed'}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                    <ArrowUpRight size={16} /> Dispatch Outbound Wire
                  </button>
                </form>
              </div>

            </div>

            {/* Close Account Footer Action */}
            {activeFa.status !== 'closed' && (
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">
                  Permanent closure option for account <code className="text-gray-300">{activeFa.id}</code>
                </span>
                <button
                  onClick={() => setClosingFaId(activeFa.id)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <XCircle size={14} /> Close Financial Account
                </button>
              </div>
            )}

          </div>

          {/* Ledger History: Store and verify Transactions in modern Treasury */}
          <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Activity className="text-cyan-400" size={20} />
              Modern Treasury Ledger
            </h2>
            <p className="text-xs text-gray-500 mb-6">Real-time status tracking of all registered payment operations on financial account `{activeFa.id}`.</p>

            <div className="space-y-4">
              {treasuryTx.map((tx: any) => (
                <div key={tx.id} className="p-4 bg-black/20 border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${tx.amount > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                      {tx.amount > 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-0.5">{tx.description}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-500 font-mono">
                        <span className="uppercase">Ref: {tx.reference}</span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleString()}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded uppercase font-black bg-white/5 tracking-widest text-[8px] text-gray-400">{tx.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-mono font-black ${tx.amount > 0 ? 'text-green-400' : 'text-gray-200'}`}>
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] text-gray-600 font-mono uppercase font-bold">USD Ledger Element</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => {
                  localStorage.removeItem('STRIPE_TREASURY_BALANCE_V2');
                  localStorage.removeItem('AQUARIUS_TREASURY_TRANSACTIONS_V2');
                  window.location.reload();
                }}
                className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 uppercase font-mono tracking-wider font-extrabold cursor-pointer"
              >
                <RefreshCw size={12} /> Clear Cache Protocol
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* CREATE FINANCIAL ACCOUNT MODAL */}
      {showCreateFaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden shadow-2xl">
            <button 
              onClick={() => setShowCreateFaModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <Plus className="rotate-45" size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
                <Building size={20} />
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-black">Stripe Treasury v2</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Provision Financial Account</h2>
              <p className="text-xs text-gray-500 mt-1">Associate a new FinancialAccount with an eligible Connected Account.</p>
            </div>

            <form onSubmit={handleCreateFinancialAccount} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-black mb-1">Stripe Connected Account ID (Stripe-Account Header)</label>
                <input 
                  type="text" 
                  value={newConnectedAccountId}
                  onChange={(e) => setNewConnectedAccountId(e.target.value)}
                  placeholder="acct_1M23..." 
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-black mb-1">Account Nickname</label>
                <input 
                  type="text" 
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="e.g. Operating Treasury Vault" 
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-black mb-2">Request Features</label>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <label className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5 cursor-pointer">
                    <input type="checkbox" checked={reqCardIssuing} onChange={e => setReqCardIssuing(e.target.checked)} />
                    <span>Card Issuing</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5 cursor-pointer">
                    <input type="checkbox" checked={reqDepositInsurance} onChange={e => setReqDepositInsurance(e.target.checked)} />
                    <span>Deposit Insurance</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5 cursor-pointer">
                    <input type="checkbox" checked={reqInboundAch} onChange={e => setReqInboundAch(e.target.checked)} />
                    <span>Inbound ACH</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5 cursor-pointer">
                    <input type="checkbox" checked={reqOutboundAch} onChange={e => setReqOutboundAch(e.target.checked)} />
                    <span>Outbound ACH</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5 cursor-pointer col-span-2">
                    <input type="checkbox" checked={reqOutboundWire} onChange={e => setReqOutboundWire(e.target.checked)} />
                    <span>US Domestic Wire</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateFaModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loadingFa}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  {loadingFa ? <RefreshCw className="animate-spin" size={14} /> : <Plus size={14} />} Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLOSE FINANCIAL ACCOUNT MODAL */}
      {closingFaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-red-500/20 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden shadow-2xl">
            <button 
              onClick={() => setClosingFaId(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <Plus className="rotate-45" size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1.5 text-red-400">
                <XCircle size={20} />
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-black">Closure Protocol</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Close Financial Account</h2>
              <p className="text-xs text-gray-500 mt-1">Permanently close <code className="text-gray-300">{closingFaId}</code>. Specify forwarding settings for incoming debits/credits.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-black mb-1">Forwarding Type</label>
                <select 
                  value={forwardingType}
                  onChange={(e) => setForwardingType(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                >
                  <option value="payment_method">Payment Method (External Bank)</option>
                  <option value="financial_account">Secondary Financial Account</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-black mb-1">Forwarding Destination ID</label>
                <input 
                  type="text" 
                  value={forwardingPmId}
                  onChange={(e) => setForwardingPmId(e.target.value)}
                  placeholder="pm_123... or fa_456..." 
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-300 leading-relaxed">
                Notice: Accounts cannot be reopened once closed. Stripe automatically forwards residual debits/credits to the selected forwarding address.
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setClosingFaId(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleCloseAccount}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  Confirm Permanent Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLAID SIMULATOR MODAL PANEL */}
      {showPlaidSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-white/10 rounded-[3rem] p-8 space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <Fingerprint size={280} />
            </div>
            
            <button 
              onClick={() => {
                setShowPlaidSim(false);
                setSelectedInst(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <Plus className="rotate-45" size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Globe className="text-cyan-400 w-5 h-5" />
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.4em] font-black">Plaid Auth Node Sandbox</h3>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Link Institution via Enclave</h2>
              <p className="text-xs text-gray-500 mt-1">Select an active institution core to simulate Plaid OAuth authorization handshake.</p>
            </div>

            {selectedInst ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-400/30">
                    <Building size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedInst}</h4>
                    <p className="text-[10px] text-cyan-400 font-mono">VERIFICATION_STAGE_AWAITING_OAUTH</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black mb-1.5">Sovereign Gateway User</label>
                    <input 
                      type="text" 
                      value={simUsername}
                      onChange={(e) => setSimUsername(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black mb-1.5">Verification Keyphrase</label>
                    <input 
                      type="password" 
                      value={simPassword}
                      onChange={(e) => setSimPassword(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setSelectedInst(null)} 
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all"
                  >
                    Back to Grid
                  </button>
                  <button 
                    onClick={handleSimulatePlaidLink}
                    disabled={isSimulatingLink}
                    className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    {isSimulatingLink ? (
                      <>
                        <RefreshCw className="animate-spin w-4 h-4" /> Spawning verification...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} /> Finalize Handshake
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'JPMorgan Chase',
                    'Bank of America',
                    'Wells Fargo',
                    'Citibank',
                    'Silicon Valley Bank',
                    'Capital One',
                    'Fidelity Investments',
                    'Barclays Direct'
                  ].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => setSelectedInst(bank)}
                      className="p-4 bg-white/5 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all rounded-2xl text-left flex items-center gap-3 shrink-0"
                    >
                      <Building className="text-gray-500 shrink-0" size={16} />
                      <span className="text-xs font-bold text-white truncate">{bank}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setShowPlaidSim(false)} 
                  className="w-full py-4 bg-white/5 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all"
                >
                  Cancel Connection
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentMethodsView;

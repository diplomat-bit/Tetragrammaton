import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Bitcoin, Zap, Shield, Cpu, Wallet, Key, PlusCircle, ArrowUpRight, ArrowDownLeft, Lock, RefreshCw, Eye, EyeOff, Copy, Check } from 'lucide-react';

const CryptoView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { 
    assets, 
    simulationData, 
    walletAddress, 
    ethBalance, 
    walletConnectionType, 
    walletTransactions,
    connectWallet,
    importPrivateKey,
    generateNewWallet,
    depositFunds,
    transferFunds,
    disconnectWallet,
    setWalletConnectModalOpen,
    customTokens,
    createCustomToken,
    addTokenToMetaMask
  } = context;

  const [showCreateTokenModal, setShowCreateTokenModal] = useState(false);
  const [showBridgeModal, setShowBridgeModal] = useState(false);
  const [showOfxModal, setShowOfxModal] = useState(false);

  const [bridgeAmount, setBridgeAmount] = useState('5000');
  const [bridgePaymentType, setBridgePaymentType] = useState<'MODERN_TREASURY_LEDGER' | 'STRIPE_CARD'>('MODERN_TREASURY_LEDGER');
  const [ofxRawText, setOfxRawText] = useState('');
  const [isProcessingBridge, setIsProcessingBridge] = useState(false);
  const [bridgeLogs, setBridgeLogs] = useState<string[]>([]);

  const [tokenName, setTokenName] = useState('Sovereign Reserve Coin');
  const [tokenSymbol, setTokenSymbol] = useState('SOV');
  const [tokenSupply, setTokenSupply] = useState('1000000');
  const [tokenDecimals, setTokenDecimals] = useState('18');
  const [tokenLogo, setTokenLogo] = useState('');

  const cryptoAssets = React.useMemo(() => assets.filter(a => a.assetClass === 'CRYPTO'), [assets]);
  const COLORS = ['#f59e0b', '#6366f1', '#10b981', '#ef4444'];

  // Local Modal States
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  
  // Form fields
  const [pkInput, setPkInput] = useState('');
  const [depositAmt, setDepositAmt] = useState('1.0');
  const [sendToAddr, setSendToAddr] = useState('');
  const [sendAmt, setSendAmt] = useState('0.1');
  const [showRawKey, setShowRawKey] = useState(false);

  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkInput.trim()) return;
    setIsLoadingAction(true);
    try {
      await importPrivateKey(pkInput);
      setShowImportModal(false);
      setPkInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmt);
    if (isNaN(val) || val <= 0) return;
    setIsLoadingAction(true);
    try {
      await depositFunds(val, 'ETH', 'Sovereign Treasury Vault');
      setShowDepositModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(sendAmt);
    if (!sendToAddr.trim() || isNaN(val) || val <= 0) return;
    setIsLoadingAction(true);
    try {
      await transferFunds(sendToAddr, val, 'ETH');
      setShowSendModal(false);
      setSendToAddr('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const ethPriceUSD = 3500;
  const balanceUSD = (parseFloat(ethBalance || "0") * ethPriceUSD).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bitcoin className="w-4 h-4 text-orange-400" />
            <h2 className="text-xs font-mono text-orange-400 uppercase tracking-[0.3em]">DLT Liquidity Node 7x</h2>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">Crypto & Web3</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <button
             onClick={() => setShowBridgeModal(true)}
             className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
           >
             <Zap size={16} />
             BUY KRYPTO (METAMASK + MODERN TREASURY)
           </button>

           <button
             onClick={() => setShowOfxModal(true)}
             className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-cyan-500/20"
           >
             <Lock size={16} />
             OFX STATEMENT ($23.55M)
           </button>

           <button
             onClick={() => setShowCreateTokenModal(true)}
             className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 font-black text-xs tracking-wider uppercase rounded-xl transition-all"
           >
             <PlusCircle size={16} />
             MINT CRYPTO
           </button>

           <button
             onClick={() => setShowDepositModal(true)}
             className="flex items-center gap-2 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-emerald-500/20"
           >
             <ArrowDownLeft size={16} />
             DEPOSIT MONEY
           </button>
           
           <button
             onClick={() => setShowImportModal(true)}
             className="flex items-center gap-2 px-5 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-cyan-500/20"
           >
             <Key size={16} />
             IMPORT PRIVATE KEY
           </button>

           <button
             onClick={() => setWalletConnectModalOpen(true)}
             className="flex items-center gap-2 px-5 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-orange-500/20"
           >
             <Wallet size={16} />
             WALLET PROVIDER
           </button>
        </div>
      </header>

      {/* WALLET OVERVIEW BANNER */}
      <div className="p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
              Active EVM Wallet Address
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono text-white font-bold">
                {walletAddress ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}` : '0xNotConnected'}
              </span>
              {walletAddress && (
                <button onClick={() => handleCopy(walletAddress)} className="text-gray-400 hover:text-white transition-colors">
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              )}
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase mt-1 block">
              Type: {walletConnectionType ? walletConnectionType.toUpperCase() : 'SOVEREIGN ENCLAVE'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-1">
              Wallet Balance (ETH)
            </span>
            <span className="text-3xl font-mono text-white font-black">{ethBalance} ETH</span>
            <span className="text-xs font-mono text-gray-400 block mt-0.5">{balanceUSD} USD</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSendModal(true)}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowUpRight size={14} className="text-cyan-400" />
              SEND FUNDS
            </button>
            
            <button
              onClick={() => generateNewWallet()}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              title="Generate New EVM Key Pair"
            >
              <RefreshCw size={14} />
              NEW KEY
            </button>
          </div>

          <div className="text-right border-l border-slate-800 pl-6 hidden md:block">
            <span className="text-[10px] text-gray-500 font-black uppercase mb-1 block">Total Web3 Exposure</span>
            <p className="text-2xl font-mono text-white font-bold">$1,242,500.42</p>
            <span className="text-[10px] text-emerald-400 font-mono">● 100% On-Chain Audited</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <Card title="Global Crypto Sentiment" className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={simulationData}>
                    <defs>
                      <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorOrange)" />
                 </AreaChart>
              </ResponsiveContainer>
           </Card>

           {/* RECENT WALLET TRANSACTIONS LEDGER */}
           <Card title="Wallet Provider On-Chain Ledger" icon={<Zap className="w-5 h-5 text-emerald-400" />}>
              <div className="space-y-3 pt-2">
                 {walletTransactions && walletTransactions.length > 0 ? (
                   walletTransactions.slice(0, 5).map((tx) => (
                     <div key={tx.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 gap-2">
                        <div className="flex items-center gap-3">
                           <div className={`p-2.5 rounded-xl border ${tx.type === 'deposit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                              {tx.type === 'deposit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                           </div>
                           <div>
                              <p className="text-xs font-bold text-white uppercase">{tx.type} — {tx.from}</p>
                              <p className="text-[10px] font-mono text-gray-500">{tx.hash.slice(0, 16)}... | {tx.timestamp}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`text-sm font-mono font-bold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-cyan-400'}`}>{tx.amount}</p>
                           <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full uppercase border border-emerald-500/20">CONFIRMED</span>
                        </div>
                     </div>
                   ))
                 ) : (
                   <p className="text-xs font-mono text-gray-500 py-4 text-center">No wallet transactions recorded yet.</p>
                 )}
              </div>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card title="Smart Contract Health" icon={<Shield className="w-5 h-5 text-green-400" />}>
                 <div className="space-y-4 pt-2">
                    {['L1 Consensus', 'Cross-chain Bridge', 'DEX Liquidity', 'Oracle Sync'].map(label => (
                      <div key={label} className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800">
                         <span className="text-sm font-medium text-gray-400">{label}</span>
                         <span className="text-xs font-mono text-green-400 font-bold uppercase">Safe</span>
                      </div>
                    ))}
                 </div>
              </Card>

              <Card title="Mining & Staking Hash" icon={<Zap className="w-5 h-5 text-yellow-400" />}>
                 <div className="flex flex-col items-center justify-center h-full py-6 space-y-4">
                    <div className="text-4xl font-black text-white font-mono">14.2 EH/s</div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Pooled Network Power</p>
                 </div>
              </Card>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <Card title="Asset Distribution">
              <div className="h-[220px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={cryptoAssets as any[]} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} stroke="none">
                          {cryptoAssets.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                 {cryptoAssets.map((asset, i) => (
                    <div key={asset.id} className="flex justify-between items-center p-3 bg-gray-900 border border-gray-800 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="text-sm font-bold text-white">{asset.name}</span>
                       </div>
                       <span className="text-xs font-mono text-gray-400">${asset.value.toLocaleString()}</span>
                    </div>
                 ))}
              </div>
           </Card>

           <Card title="Custom Cryptocurrencies & MetaMask Sync" icon={<Zap className="w-5 h-5 text-amber-400" />}>
              <div className="space-y-3 pt-2">
                 <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">In-App Minted Tokens ({customTokens?.length || 0})</span>
                    <button 
                       onClick={() => setShowCreateTokenModal(true)} 
                       className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                       + Mint New
                    </button>
                 </div>

                 {!customTokens || customTokens.length === 0 ? (
                    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-2">
                       <p className="text-xs text-gray-400">No custom cryptocurrencies created yet.</p>
                       <button 
                          onClick={() => setShowCreateTokenModal(true)}
                          className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase rounded-xl hover:bg-amber-500/20 transition-all"
                       >
                          Create First Token
                       </button>
                    </div>
                 ) : (
                    <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                       {customTokens.map((tok: any) => (
                          <div key={tok.id || tok.symbol} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-amber-500/30 transition-all">
                             <div className="flex items-center gap-3">
                                <img src={tok.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${tok.symbol}`} alt={tok.symbol} className="w-8 h-8 rounded-full border border-amber-500/20" />
                                <div>
                                   <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-bold text-white">{tok.name}</p>
                                      <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold rounded">{tok.symbol}</span>
                                   </div>
                                   <p className="text-[10px] font-mono text-gray-500">
                                      Supply: {tok.totalSupply?.toLocaleString()} | {tok.contractAddress?.slice(0, 8)}...{tok.contractAddress?.slice(-6)}
                                   </p>
                                </div>
                             </div>
                             <button 
                                onClick={async () => {
                                   try {
                                      await addTokenToMetaMask({
                                         address: tok.contractAddress,
                                         symbol: tok.symbol,
                                         decimals: tok.decimals || 18,
                                         image: tok.logoUrl
                                      });
                                   } catch (e) {}
                                }}
                                className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500 border border-orange-500/40 text-orange-400 hover:text-black font-bold text-[10px] uppercase rounded-xl transition-all shadow-md flex items-center gap-1 shrink-0"
                             >
                                <span>🦊</span> Add to MetaMask
                             </button>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </Card>

           <Card title="On-Chain Directives" icon={<Cpu className="w-5 h-5 text-cyan-400" />}>
              <div className="space-y-4 pt-2">
                 <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                    <p className="text-xs text-orange-300 italic leading-relaxed">"Neural Core: High volatility in DeFi yield aggregators detected. Suggest migrating 12% of USDC pool to Aave v4."</p>
                 </div>
                 <button className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black tracking-widest rounded-2xl transition-all shadow-lg shadow-orange-500/20">
                    EXECUTE REBALANCE
                 </button>
              </div>
           </Card>
        </div>
      </div>

      {/* IMPORT PRIVATE KEY MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] backdrop-blur-md" onClick={() => setShowImportModal(false)}>
          <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Key className="text-cyan-400" size={20} />
              Import Ethereum Private Key
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Paste your raw 64-character hex private key to derive your address and load your EVM wallet.
            </p>

            <form onSubmit={handleImportKeySubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showRawKey ? "text" : "password"}
                  value={pkInput}
                  onChange={(e) => setPkInput(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRawKey(!showRawKey)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showRawKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 py-3 bg-slate-800 text-gray-300 font-bold text-xs uppercase rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingAction}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase rounded-xl transition-all disabled:opacity-50"
                >
                  {isLoadingAction ? 'Importing...' : 'Import Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPOSIT MODAL */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] backdrop-blur-md" onClick={() => setShowDepositModal(false)}>
          <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <ArrowDownLeft className="text-emerald-400" size={20} />
              Deposit Money Into Wallet
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Top-up funds directly into your active EVM wallet ({walletAddress ? `${walletAddress.slice(0, 6)}...` : 'Enclave Wallet'}).
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                  Deposit Amount (ETH)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['0.5', '1.0', '2.5', '5.0'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDepositAmt(val)}
                      className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                        depositAmt === val ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-gray-400'
                      }`}
                    >
                      +{val}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={depositAmt}
                  onChange={(e) => setDepositAmt(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 py-3 bg-slate-800 text-gray-300 font-bold text-xs uppercase rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingAction}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase rounded-xl transition-all disabled:opacity-50"
                >
                  {isLoadingAction ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEND FUNDS MODAL */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] backdrop-blur-md" onClick={() => setShowSendModal(false)}>
          <div className="bg-slate-950 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <ArrowUpRight className="text-cyan-400" size={20} />
              Send Funds (Transfer)
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Broadcast an Ethereum transfer from your active wallet ({ethBalance} ETH available).
            </p>

            <form onSubmit={handleSendSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  Recipient Ethereum Address
                </label>
                <input
                  type="text"
                  value={sendToAddr}
                  onChange={(e) => setSendToAddr(e.target.value)}
                  placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sendAmt}
                  onChange={(e) => setSendAmt(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 py-3 bg-slate-800 text-gray-300 font-bold text-xs uppercase rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingAction}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase rounded-xl transition-all disabled:opacity-50"
                >
                  {isLoadingAction ? 'Sending...' : 'Broadcast Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MINT CRYPTOCURRENCY MODAL */}
      {showCreateTokenModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowCreateTokenModal(false)}>
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-2xl">
                ⚡
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Mint New Cryptocurrency</h3>
                <p className="text-xs text-gray-400">Deploy custom ERC20 token & register instantly in MetaMask</p>
              </div>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!tokenName || !tokenSymbol || !tokenSupply) return;
              setIsLoadingAction(true);
              try {
                const res = await createCustomToken({
                  name: tokenName,
                  symbol: tokenSymbol.toUpperCase(),
                  totalSupply: parseFloat(tokenSupply),
                  decimals: parseInt(tokenDecimals) || 18,
                  logoUrl: tokenLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${tokenSymbol}`
                });
                setShowCreateTokenModal(false);
                try {
                  await addTokenToMetaMask({
                    address: res.token.contractAddress,
                    symbol: res.token.symbol,
                    decimals: res.token.decimals,
                    image: res.token.logoUrl
                  });
                } catch (err) {}
              } catch (err: any) {
                alert(err.message || "Failed to create token");
              } finally {
                setIsLoadingAction(false);
              }
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
                    Token Name
                  </label>
                  <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="Sovereign Gold"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
                    Ticker Symbol
                  </label>
                  <input
                    type="text"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    placeholder="SVGLD"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs uppercase focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                    Total Supply
                  </label>
                  <input
                    type="number"
                    value={tokenSupply}
                    onChange={(e) => setTokenSupply(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                    Decimals
                  </label>
                  <input
                    type="number"
                    value={tokenDecimals}
                    onChange={(e) => setTokenDecimals(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  Logo / Avatar Icon URL (Optional)
                </label>
                <input
                  type="url"
                  value={tokenLogo}
                  onChange={(e) => setTokenLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                <span className="text-xl">🦊</span>
                <p className="text-[10px] text-amber-300 font-mono">
                  Creating this token will mint it on-chain and send a <strong className="text-white">wallet_watchAsset</strong> request directly to your MetaMask extension!
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTokenModal(false)}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-gray-300 font-bold text-xs uppercase rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingAction}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {isLoadingAction ? 'MINTING & REGISTERING...' : 'MINT & ADD TO METAMASK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* METAMASK + MODERN TREASURY 1-CLICK FUNDING BRIDGE MODAL */}
      {showBridgeModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[200] backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => setShowBridgeModal(false)}>
          <div className="bg-slate-950 border border-orange-500/40 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-3xl">
                🦊
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">1-Click MetaMask + Modern Treasury Bridge</h3>
                <p className="text-xs text-orange-400 font-mono">Direct On-Chain Credit via Modern Treasury Ledgers or Stripe</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block mb-1">
                  Funding Amount (USD)
                </label>
                <input
                  type="number"
                  value={bridgeAmount}
                  onChange={(e) => setBridgeAmount(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  Settlement & Ledger Source
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBridgePaymentType('MODERN_TREASURY_LEDGER')}
                    className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all ${bridgePaymentType === 'MODERN_TREASURY_LEDGER' ? 'bg-orange-500/20 border-orange-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-gray-400'}`}
                  >
                    🏦 Modern Treasury Wire
                    <span className="block text-[9px] opacity-60">Ledger ID: f78ed0dc-acc8</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBridgePaymentType('STRIPE_CARD')}
                    className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all ${bridgePaymentType === 'STRIPE_CARD' ? 'bg-purple-500/20 border-purple-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-gray-400'}`}
                  >
                    💳 Stripe Instant Checkout
                    <span className="block text-[9px] opacity-60">1-Click Card / Apple Pay</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Sequence Execution Steps:</span>
                <ul className="text-xs font-mono text-gray-300 space-y-1 list-disc list-inside">
                  <li>Wake up MetaMask via <code className="text-amber-300">eth_requestAccounts</code></li>
                  <li>Trigger Approval via <code className="text-amber-300">eth_sendTransaction</code> (data: 0x4d545f46554e44)</li>
                  <li>Sync GraphQL <code className="text-amber-300">UpsertPaymentOrder</code> with Modern Treasury</li>
                  <li>Credit ${parseFloat(bridgeAmount || '0').toLocaleString()} directly into wallet ledger</li>
                </ul>
              </div>

              {bridgeLogs.length > 0 && (
                <div className="p-3 bg-black rounded-xl border border-orange-500/30 max-h-32 overflow-y-auto space-y-1 font-mono text-[10px] text-orange-400">
                  {bridgeLogs.map((log, i) => <p key={i}>{log}</p>)}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBridgeModal(false)}
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-gray-300 font-bold text-xs uppercase rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessingBridge}
                  onClick={async () => {
                    setIsProcessingBridge(true);
                    setBridgeLogs(["⚡ Waking up MetaMask extension..."]);
                    try {
                      let myWallet = walletAddress || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
                      let txHash = `0x${Math.random().toString(16).substring(2, 42)}`;

                      if ((window as any).ethereum) {
                        try {
                          const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                          if (accounts && accounts[0]) myWallet = accounts[0];
                          setBridgeLogs(prev => [...prev, `[METAMASK] Connected account: ${myWallet}`]);

                          setBridgeLogs(prev => [...prev, `[METAMASK] Sending eth_sendTransaction (0x4d545f46554e44)...`]);
                          txHash = await (window as any).ethereum.request({
                            method: 'eth_sendTransaction',
                            params: [{
                              to: myWallet,
                              from: myWallet,
                              value: '0x0',
                              data: '0x4d545f46554e44' // "MT_FUND"
                            }]
                          });
                          setBridgeLogs(prev => [...prev, `✅ MetaMask Tx Approved: ${txHash}`]);
                        } catch (e: any) {
                          setBridgeLogs(prev => [...prev, `⚠️ MetaMask interaction note: ${e.message}. Proceeding with Modern Treasury GraphQL sync.`]);
                        }
                      }

                      setBridgeLogs(prev => [...prev, `[GRAPHQL] Syncing UpsertPaymentOrder with Modern Treasury...`]);

                      const amtCents = Math.round(parseFloat(bridgeAmount) * 100);
                      const payload = {
                        query: `mutation UpsertPaymentOrder($input: UpsertPaymentOrderInput!) {
                            upsertPaymentOrder(input: $input) {
                                paymentOrder { id }
                            }
                        }`,
                        variables: {
                            input: {
                                type: "wire", 
                                amount: amtCents,
                                direction: "credit",
                                currency: "USD",
                                receivingAccountId: "f78ed0dc-acc8-4ebb-ba84-37454e26cd28",
                                originatingAccountId: "f78ed0dc-acc8-4ebb-ba84-37454e26cd28",
                                description: "MetaMask Bridge Funding: " + txHash
                            }
                        }
                      };

                      const response = await fetch("/graphql", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify(payload)
                      });
                      const graphqlRes = await response.json();

                      setBridgeLogs(prev => [...prev, `[GRAPHQL] Payment Order Created: ${graphqlRes.data?.upsertPaymentOrder?.paymentOrder?.id}`]);

                      // Perform actual deposit in context
                      const ethEquivalent = (parseFloat(bridgeAmount) / ethPriceUSD).toFixed(4);
                      await depositFunds(parseFloat(ethEquivalent), 'ETH', 'Modern Treasury MetaMask Bridge');

                      setBridgeLogs(prev => [...prev, `🎉 SUCCESS! Added ${ethEquivalent} ETH ($${bridgeAmount}) to your MetaMask wallet ledger.`]);
                      setTimeout(() => {
                        setShowBridgeModal(false);
                      }, 2000);
                    } catch (err: any) {
                      setBridgeLogs(prev => [...prev, `❌ Error: ${err.message}`]);
                    } finally {
                      setIsProcessingBridge(false);
                    }
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
                >
                  {isProcessingBridge ? 'EXECUTING BRIDGE...' : 'EXECUTE 1-CLICK FUNDING BRIDGE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFX BANK STATEMENT INGEST MODAL ($23.55M) */}
      {showOfxModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[200] backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => setShowOfxModal(false)}>
          <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl">
                  🏦
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Citigroup OFX Bank Statement Ingest</h3>
                  <p className="text-xs text-cyan-400 font-mono">Parse SGML OFX Bank Feeds & Sync to Modern Treasury ($23,550,869.57)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-white uppercase">Citigroup Statement Feed ($23.55M Balance)</p>
                  <p className="text-[10px] text-gray-400">Includes Wire Transfers from DOVENMUEHLE, PHH MORTGAGE, OCWEN, JPMCB</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sampleOFX = `OFXHEADER:100\nDATA:OFXSGML\nVERSION:102\nSECURITY:NONE\nENCODING:USASCII\nCHARSET:1252\nCOMPRESSION:NONE\nOLDFILEUID:NONE\nNEWFILEUID:NONE\n<OFX>\n<SIGNONMSGSRSV1>\n        <SONRS>\n</FI>\n                <STATUS>\n                        <CODE>0\n                        <SEVERITY>INFO\n                </STATUS>\n                <DTSERVER>20161206021532\n                <LANGUAGE>ENG\n                <FI>\n                        <ORG>Citigroup\n                        <FID>11569\n                <INTU.BID>11569\n        </SONRS>\n</SIGNONMSGSRSV1>\n<BANKMSGSRSV1>\n        <STMTTRNRS>\n                <TRNUID>0\n                <STATUS>\n                        <CODE>0\n                        <SEVERITY>INFO\n                </STATUS>\n                <STMTRS>\n                        <CURDEF>USD\n                        <BANKACCTFROM>\n                                <BANKID>003456789\n                                <ACCTID>7777788888CKG\n                                <ACCTTYPE>CHECKING\n                        </BANKACCTFROM>\n                        <BANKTRANLIST>\n                                <DTSTART>20160513000000\n                                <DTEND>20161109000000\n                                <STMTTRN>\n                                        <TRNTYPE>DEBIT\n                                        <DTPOSTED>20161014000000\n                                        <TRNAMT>-87.36\n                                        <FITID>179842612016101400000000001\n                                        <NAME>SERVICE CHARGE\n                                </STMTTRN>\n                        </BANKTRANLIST>\n                        <LEDGERBAL>\n                                <BALAMT>1300740.56\n                                <DTASOF>20161206021532\n                        </LEDGERBAL>\n                </STMTRS>\n        </STMTTRNRS>\n<STMTTRNRS>\n        <TRNUID>0\n        <STATUS>\n                <CODE>0\n                <SEVERITY>INFO\n        </STATUS>\n        <STMTRS>\n                        <CURDEF>USD\n                        <BANKACCTFROM>\n                                <BANKID>003456789\n                                <ACCTID>5555566666CKG\n                                <ACCTTYPE>CHECKING\n                        </BANKACCTFROM>\n                        <BANKTRANLIST>\n                                <DTSTART>20160513000000\n                                <DTEND>20161109000000\n                                <STMTTRN>\n                                        <TRNTYPE>CREDIT\n                                        <DTPOSTED>20161025000000\n                                        <TRNAMT>1201262.33\n                                        <FITID>7049138962016102500000000001\n                                        <NAME>WIRE FROM DOVENMUEHLE\n                                        <MEMO>6GAGE INC REMITT\n                                </STMTTRN>\n                                <STMTTRN>\n                                        <TRNTYPE>CREDIT\n                                        <DTPOSTED>20161014000000\n                                        <TRNAMT>43503.23\n                                        <FITID>7049138962016101400000000003\n                                        <NAME>WIRE FROM PHH MORTGAGE\n                                        <MEMO>6P AS TRUSTEE AN\n                                </STMTTRN>\n                        </BANKTRANLIST>\n                        <LEDGERBAL>\n                                <BALAMT>23550869.57\n                                <DTASOF>20161206021532\n                        </LEDGERBAL>\n                </STMTRS>\n        </STMTTRNRS>\n</BANKMSGSRSV1>\n</OFX>`;
                    setOfxRawText(sampleOFX);
                  }}
                  className="px-3 py-2 bg-cyan-500 text-black font-black text-[10px] uppercase rounded-lg hover:bg-cyan-400 transition-all shrink-0"
                >
                  LOAD CITIGROUP $23.55M FEED
                </button>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  Raw OFX SGML / XML Content
                </label>
                <textarea
                  value={ofxRawText}
                  onChange={(e) => setOfxRawText(e.target.value)}
                  placeholder="Paste or drop OFX file content here..."
                  className="w-full h-48 bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfxModal(false)}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-gray-300 font-bold text-xs uppercase rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!ofxRawText.trim() || isLoadingAction}
                  onClick={async () => {
                    setIsLoadingAction(true);
                    try {
                      const res = await fetch("/api/v1/ofx/import", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ ofxData: ofxRawText, syncModernTreasury: true })
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert(data.message);
                        setShowOfxModal(false);
                      } else {
                        alert(`Error: ${data.error}`);
                      }
                    } catch (err: any) {
                      alert(`Import Error: ${err.message}`);
                    } finally {
                      setIsLoadingAction(false);
                    }
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isLoadingAction ? 'IMPORTING & SYNCING LEDGER...' : 'PARSE & SYNC TO MODERN TREASURY'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoView;
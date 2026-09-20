
import React, { useState, useContext, useEffect, useRef } from 'react';
import { DataContext } from '../context/DataContext';
import { RefreshCw, Command as CommandIcon, Bell, User, Zap, Activity, ShieldCheck, Wallet, Sparkles, Search, FileText, DatabaseZap, ShieldAlert, Cpu } from 'lucide-react';
import { View, Notification } from '../types';
import { SOVEREIGN_APPS } from '../constants';
import { securityService } from '../services/SecurityService';

const HardwareIdentityStatus: React.FC = () => {
    const [status, setStatus] = useState<'IDLE' | 'VERIFYING' | 'SECURE' | 'FAILED'>('IDLE');
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        setStatus('VERIFYING');
        const result = await securityService.attestAndLinkNode();
        if (result.success) {
            setStatus('SECURE');
            setError(null);
        } else {
            setStatus('FAILED');
            setError(result.error || 'Verification Failed');
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    return (
        <button 
            onClick={handleVerify}
            disabled={status === 'VERIFYING' || status === 'SECURE'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all truncate max-w-[140px] lg:max-w-none ${
                status === 'SECURE' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                status === 'FAILED' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
        >
            {status === 'VERIFYING' ? <RefreshCw size={14} className="animate-spin" /> : 
             status === 'SECURE' ? <ShieldCheck size={14} /> : 
             status === 'FAILED' ? <ShieldAlert size={14} /> :
             <Cpu size={14} />}
            <span className="text-[9px] font-black uppercase tracking-widest">
                {status === 'VERIFYING' ? 'ATTESTING...' :
                 status === 'SECURE' ? 'HARDWARE_BOUND' :
                 status === 'FAILED' ? 'BOUND_FAILED' :
                 'ATTEST_HARDWARE'}
            </span>
        </button>
    );
};

const GeminiBar: React.FC = () => {
    const context = useContext(DataContext);
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim() || !context) {
            setResults([]);
            return;
        }

        const searchResults: any[] = [];
        const q = query.toLowerCase();

        // Search Views
        Object.entries(View).forEach(([key, value]) => {
            if (key.toLowerCase().includes(q) || value.toLowerCase().includes(q)) {
                searchResults.push({ type: 'view', id: value, title: key, subtitle: 'System Module', icon: <CommandIcon size={14} /> });
            }
        });

        // Search Apps
        SOVEREIGN_APPS.forEach(app => {
            if (app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q)) {
                searchResults.push({ type: 'app', id: app.id, title: app.name, subtitle: 'External App', icon: <Zap size={14} /> });
            }
        });

        // Search Transactions
        context.transactions.forEach(tx => {
            if (tx.description.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q)) {
                searchResults.push({ type: 'transaction', id: tx.id, title: tx.description, subtitle: `Transaction • $${tx.amount}`, icon: <FileText size={14} /> });
            }
        });

        // Search Accounts
        context.internalAccounts.forEach(acc => {
            if (acc.bestName.toLowerCase().includes(q) || acc.bankName.toLowerCase().includes(q)) {
                searchResults.push({ type: 'account', id: acc.id, title: acc.bestName, subtitle: `Account • ${acc.bankName}`, icon: <Wallet size={14} /> });
            }
        });

        setResults(searchResults.slice(0, 8)); // Limit to 8 results
        setIsOpen(true);
    }, [query, context]);

    const handleSelect = (result: any) => {
        if (!context) return;
        
        if (result.type === 'view') {
            context.setView(result.id);
        } else if (result.type === 'app') {
            const app = SOVEREIGN_APPS.find(a => a.id === result.id);
            if (app) context.setView(app.viewId || app.id);
        } else if (result.type === 'transaction') {
            context.setView(View.Transactions);
        } else if (result.type === 'account') {
            context.setView(View.Dashboard);
        }
        
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-xl group hidden md:block z-50">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-500 transition-colors">
                <Search size={16} />
            </div>
            <input
                type="text"
                className="w-full bg-gray-900/50 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all text-xs text-white placeholder-gray-600"
                placeholder="Search modules, apps, transactions, accounts..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => query.trim() && setIsOpen(true)}
            />
            
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                    <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                        {results.map((result, idx) => (
                            <button
                                key={`${result.type}-${result.id}-${idx}`}
                                onClick={() => handleSelect(result)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left group/item"
                            >
                                <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover/item:text-cyan-400 group-hover/item:bg-cyan-500/10 transition-colors">
                                    {result.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">{result.title}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">{result.subtitle}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const GeminiEngineStatus: React.FC = () => {
    const context = useContext(DataContext);
    const isSyncing = context?.isSyncing;

    const messages = [
        "Gemini: Mapping risk vectors...",
        "Gemini: All systems hyper-nominal.",
        "Gemini: Calibrating data mesh..."
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hidden xl:flex items-center space-x-4 text-[10px] text-cyan-300/80 bg-gray-950/80 px-4 py-2 rounded-full border border-cyan-500/20 backdrop-blur-md shadow-inner">
            <div className="flex space-x-1 items-end h-4">
                <span className={`w-1 h-2 bg-cyan-400 rounded-full ${isSyncing ? 'animate-bounce' : 'animate-pulse'}`}></span>
                <span className={`w-1 h-3 bg-cyan-400 rounded-full ${isSyncing ? 'animate-bounce [animation-delay:0.1s]' : 'animate-pulse [animation-delay:-0.2s]'}`}></span>
                <span className={`w-1 h-4 bg-cyan-400 rounded-full ${isSyncing ? 'animate-bounce [animation-delay:0.2s]' : 'animate-pulse'}`}></span>
            </div>
            <span className="font-mono uppercase tracking-widest">{isSyncing ? "Neural Synchronizing..." : messages[currentIndex]}</span>
            <span className="w-px h-3 bg-cyan-500/20"></span>
            <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                <span className="font-mono uppercase">Mesh: Active</span>
            </div>
        </div>
    );
};

const MetaMaskHeaderWidget: React.FC<{ setActiveView: (view: any) => void }> = ({ setActiveView }) => {
  const context = useContext(DataContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!context) return null;
  const { 
    walletAddress, 
    ethBalance, 
    networkName, 
    customTokens, 
    connectWallet, 
    disconnectWallet, 
    addTokenToMetaMask, 
    setWalletConnectModalOpen 
  } = context;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (txt: string) => {
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isConnected = !!walletAddress;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => {
          if (!isConnected) {
            connectWallet().catch(() => setWalletConnectModalOpen(true));
          } else {
            setDropdownOpen(!dropdownOpen);
          }
        }}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all duration-300 shadow-lg ${
          isConnected 
            ? 'bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border-orange-500/30 text-orange-400 hover:border-orange-500/60' 
            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-orange-500/40'
        }`}
      >
        <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center font-black text-[10px] text-orange-400">
          🦊
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <p className="text-[9px] font-black uppercase tracking-widest text-white leading-none">
              {isConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect MetaMask'}
            </p>
            {isConnected && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <p className="text-[10px] font-mono text-orange-400/90 font-bold mt-0.5 leading-none">
            {isConnected ? `${ethBalance} ETH` : 'Web3 Vault'}
          </p>
        </div>
      </button>

      {/* DROPDOWN MENU */}
      {dropdownOpen && isConnected && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-950/95 border border-orange-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">🦊</span>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">MetaMask Connected</p>
                <p className="text-[9px] font-mono text-emerald-400 uppercase font-bold">{networkName || 'Ethereum Node'}</p>
              </div>
            </div>
            <button 
              onClick={() => handleCopy(walletAddress!)} 
              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-[10px] flex items-center gap-1"
            >
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
          </div>

          <div className="py-3 space-y-2">
            <div className="p-3 bg-black/50 border border-white/5 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Balance</p>
                <p className="text-lg font-mono font-black text-white">{ethBalance} ETH</p>
              </div>
              <p className="text-xs font-mono text-emerald-400 font-bold">
                ${(parseFloat(ethBalance || "0") * 3500).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <button 
              onClick={() => {
                setActiveView(View.Crypto);
                setDropdownOpen(false);
              }}
              className="w-full p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>⚡</span> Create / Mint Cryptocurrency
            </button>
          </div>

          {/* CUSTOM TOKENS SECTION */}
          <div className="pt-3 border-t border-gray-800 space-y-2">
            <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">
              Custom App Cryptocurrencies ({customTokens?.length || 0})
            </p>
            <div className="max-h-36 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
              {!customTokens || customTokens.length === 0 ? (
                <p className="text-[10px] text-gray-500 italic py-1">No custom tokens created yet.</p>
              ) : (
                customTokens.map((tok: any) => (
                  <div key={tok.id || tok.symbol} className="p-2.5 bg-gray-900/80 border border-gray-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={tok.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${tok.symbol}`} alt={tok.symbol} className="w-5 h-5 rounded-full" />
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{tok.symbol}</p>
                        <p className="text-[8px] font-mono text-gray-500">{tok.totalSupply?.toLocaleString()} supply</p>
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        await addTokenToMetaMask({
                          address: tok.contractAddress,
                          symbol: tok.symbol,
                          decimals: tok.decimals || 18,
                          image: tok.logoUrl
                        });
                      }}
                      className="px-2.5 py-1 bg-orange-500/20 hover:bg-orange-500 border border-orange-500/40 text-orange-400 hover:text-black font-bold text-[9px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1"
                    >
                      <span>🦊</span> Add to MetaMask
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
            <button 
              onClick={() => {
                setWalletConnectModalOpen(true);
                setDropdownOpen(false);
              }} 
              className="text-[10px] font-mono text-gray-400 hover:text-white uppercase"
            >
              Provider Options
            </button>
            <button 
              onClick={() => {
                disconnectWallet();
                setDropdownOpen(false);
              }} 
              className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase font-bold"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC<{ setActiveView: (view: any) => void; onMenuClick: () => void; }> = ({ setActiveView, onMenuClick }) => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { notifications, isSyncing, walletAddress, ethBalance, setWalletConnectModalOpen } = context;
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;
  
  return (
    <header className="py-4 px-8 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 flex justify-between items-center z-40 shrink-0">
      <div className="flex items-center space-x-6">
        <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-white transition-colors">
            <CommandIcon size={24} />
        </button>
        <div className="flex flex-col cursor-pointer" onClick={() => setActiveView(View.Dashboard)}>
           <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase leading-none">
             James Burvel oCallaghan III
           </h1>
           <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-widest leading-none">
             Sovereign Node_07 // {isSyncing ? "SYNC_IN_PROGRESS" : "CONNECTED"}
           </p>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
         <GeminiBar />
      </div>

      <div className="flex items-center space-x-6">
        <HardwareIdentityStatus />
        <GeminiEngineStatus />

        {/* MetaMask Header Widget */}
        <MetaMaskHeaderWidget setActiveView={setActiveView} />
        
        <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5 gap-1">
            <button 
              className={`p-2 rounded-full transition-all ${isSyncing ? 'text-cyan-400' : 'text-gray-500 hover:text-cyan-400'}`}
              title="Neural Sync"
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            </button>
            <div className="relative">
                <button className={`p-2 rounded-full transition-all ${unreadCount > 0 ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}`}>
                  <Bell size={18} />
                  {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></span>
                  )}
                </button>
            </div>
        </div>

        <button onClick={() => setActiveView(View.Settings)} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-600 p-[1px] shadow-lg group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#020617] rounded-[15px] flex items-center justify-center overflow-hidden">
                    <User size={20} className="text-lime-400" />
                </div>
            </div>
        </button>
      </div>
    </header>
  );
};

export default Header;

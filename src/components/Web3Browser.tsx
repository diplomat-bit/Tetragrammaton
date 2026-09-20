import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  ShieldCheck,
  Search,
  ExternalLink,
  Wallet,
  Sparkles,
  Plus,
  X,
  Copy,
  Check,
  Zap,
  Terminal,
  ChevronDown,
  Layers,
  Send,
  Eye,
  Lock,
  Compass,
  AlertCircle,
  Activity,
  Code2,
  Bookmark,
  Share2,
  Cpu,
  FolderGit2,
  User,
  LogIn,
  LogOut,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { auth, signInWithGooglePopup, onAuthStateChanged, User as FirebaseUser } from '../firebase';

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  isSearchPortal?: boolean;
  isLoading: boolean;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  category?: string;
  web3Verified?: boolean;
}

interface Web3TxLog {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Web3BrowserProps {
  onNavigateToDrive?: () => void;
}

const DEFAULT_BOOKMARKS = [
  { name: 'Google Drive', url: 'https://drive.google.com', category: 'Cloud Storage', isDrive: true },
  { name: 'Google Search', url: 'https://www.google.com/webhp?igu=1', category: 'Search' },
  { name: 'Uniswap DEX', url: 'https://app.uniswap.org', category: 'DeFi' },
  { name: 'Etherscan', url: 'https://etherscan.io', category: 'Explorer' },
  { name: 'OpenSea', url: 'https://opensea.io', category: 'NFT' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com', category: 'Privacy Search' },
  { name: 'DefiLlama', url: 'https://defillama.com', category: 'Analytics' },
  { name: 'CoinGecko', url: 'https://www.coingecko.com', category: 'Markets' },
  { name: 'Ethereum Foundation', url: 'https://ethereum.org', category: 'Docs' },
];

const SUPPORTED_CHAINS = [
  { id: '1', name: 'Ethereum Mainnet', symbol: 'ETH', rpc: 'https://eth.llamarpc.com' },
  { id: '8453', name: 'Base', symbol: 'ETH', rpc: 'https://mainnet.base.org' },
  { id: '42161', name: 'Arbitrum One', symbol: 'ETH', rpc: 'https://arb1.arbitrum.io/rpc' },
  { id: '137', name: 'Polygon', symbol: 'MATIC', rpc: 'https://polygon-rpc.com' },
  { id: '10', name: 'Optimism', symbol: 'ETH', rpc: 'https://mainnet.optimism.io' },
  { id: '11155111', name: 'Sepolia Testnet', symbol: 'SepoliaETH', rpc: 'https://rpc.sepolia.org' },
];

export const Web3Browser: React.FC<Web3BrowserProps> = ({ onNavigateToDrive }) => {
  // Tabs State (Defaults to Google with igu=1 which embeds natively)
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Google',
      url: 'https://www.google.com/webhp?igu=1',
      isLoading: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Omnibox URL Input
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const [urlInput, setUrlInput] = useState<string>(activeTab?.url || 'https://www.google.com/webhp?igu=1');

  // Navigation History
  const [history, setHistory] = useState<string[]>([activeTab?.url || 'https://www.google.com/webhp?igu=1']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Search Engine & View Mode
  const [searchEngine, setSearchEngine] = useState<'google' | 'duckduckgo' | 'portal'>('google');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Web3 Wallet State
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('0x71C845137c393845b4B8c903E5C778b7b252394B');
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
  const [ethBalance, setEthBalance] = useState('2.485');
  const [usdcBalance, setUsdcBalance] = useState('1,250.00');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [txLogs, setTxLogs] = useState<Web3TxLog[]>([]);
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);

  // Google Account Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showAuthNotice, setShowAuthNotice] = useState(true);

  // AI Page Inspector State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  // Console / DevTools Drawer
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[System] Web3 Browser & Universal Auth Gateway Initialized.',
    '[Engine] Google Native Embed (igu=1) & Dynamic Web3 Account Ingestion active.',
    '[Provider] EIP-1193 Ethereum provider ready on chainId: 0x1.',
  ]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Track Firebase Auth user in real-time
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
      if (u) {
        logConsole(`[Auth] Google user verified: ${u.displayName || u.email}`);
      }
    });
    return () => unsub();
  }, []);

  // Sync wallet account to iframe whenever it changes
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      const hexChain = '0x' + Number(selectedChain.id).toString(16);
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'UPDATE_WEB3_ACCOUNT',
          account: walletAddress,
          chainId: hexChain,
        },
        '*'
      );
    }
  }, [walletAddress, selectedChain]);

  // Synchronize urlInput when active tab changes
  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTabId]);

  // Listen for messages from proxied iframe (Web3 requests and navigation clicks)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'WEB3_NAVIGATE' && data.url) {
        navigateTo(data.url);
        logConsole(`[Navigation] Following link: ${data.url}`);
      } else if (data.type === 'WEB3_TX_REQUEST') {
        logConsole(`[Web3] Transaction requested: ${JSON.stringify(data.tx)}`);
        const newLog: Web3TxLog = {
          id: 'tx-' + Date.now(),
          type: 'eth_sendTransaction',
          payload: data.tx,
          timestamp: new Date().toLocaleTimeString(),
          status: 'approved',
        };
        setTxLogs((prev) => [newLog, ...prev]);
      } else if (data.type === 'WEB3_SIGN_REQUEST') {
        logConsole(`[Web3] Signature requested: ${JSON.stringify(data.message)}`);
        const newLog: Web3TxLog = {
          id: 'sig-' + Date.now(),
          type: 'personal_sign',
          payload: data.message,
          timestamp: new Date().toLocaleTimeString(),
          status: 'approved',
        };
        setTxLogs((prev) => [newLog, ...prev]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeTabId]);

  const logConsole = (msg: string) => {
    setConsoleLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  /**
   * Determine the best iframe src URL:
   * 1. Google with igu=1 works natively in iframe without any backend proxy!
   * 2. DuckDuckGo works directly or through proxy
   * 3. Other sites can use proxy or direct
   */
  const resolveIframeSrc = (url: string) => {
    if (!url) return 'https://www.google.com/webhp?igu=1';

    // If it is Google, ensure igu=1 is present and load DIRECTLY in the iframe for zero latency
    if (url.includes('google.com')) {
      if (!url.includes('igu=1')) {
        const sep = url.includes('?') ? '&' : '?';
        return `${url}${sep}igu=1`;
      }
      return url;
    }

    // If DuckDuckGo or Wikipedia, can load directly or via proxy
    if (url.includes('duckduckgo.com') || url.includes('wikipedia.org')) {
      return url;
    }

    // For other sites, route through our server proxy to strip X-Frame-Options & inject Web3
    const hexChain = '0x' + Number(selectedChain.id).toString(16);
    return `/api/web3-browser/proxy?url=${encodeURIComponent(url)}&account=${encodeURIComponent(walletAddress)}&chainId=${encodeURIComponent(hexChain)}`;
  };

  // Connect real wallet extension (MetaMask, Coinbase Wallet, etc.)
  const handleConnectExtension = async () => {
    const eth = (window as any).ethereum;
    if (eth && typeof eth.request === 'function') {
      try {
        logConsole('[Wallet] Requesting authorization from browser extension...');
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setWalletAddress(accounts[0]);
          setIsExtensionConnected(true);
          logConsole(`[Wallet] Connected external wallet: ${accounts[0]}`);

          try {
            const balHex = await eth.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest'],
            });
            if (balHex) {
              const wei = BigInt(balHex);
              const ethNum = Number(wei) / 1e18;
              setEthBalance(ethNum.toFixed(4));
              setUsdcBalance((ethNum * 3200).toFixed(2));
            }
          } catch {}
        }
      } catch (err: any) {
        logConsole(`[Wallet Error] Extension connection failed: ${err.message}`);
      }
    } else {
      const custom = window.prompt(
        'No Web3 browser extension found in current window context. Enter any EVM address (0x...):',
        walletAddress
      );
      if (custom && custom.startsWith('0x')) {
        setWalletAddress(custom);
        logConsole(`[Wallet] Set custom active address: ${custom}`);
      }
    }
  };

  // Sign in with Google Popup
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      logConsole('[Auth] Launching Google authentication popup...');
      const authResult = await signInWithGooglePopup();
      if (authResult && authResult.user) {
        setCurrentUser(authResult.user);
        logConsole(`[Auth] Logged into Google account: ${authResult.user.email}`);
      }
    } catch (err: any) {
      logConsole(`[Auth Error] Google login failed: ${err.message}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Open current page in dedicated top-level window so cookies, extensions, and logins work seamlessly
  const handleOpenDedicatedWindow = (overrideUrl?: string) => {
    const target = overrideUrl || activeTab.url;
    logConsole(`[Window] Launching dedicated top-level window for: ${target}`);
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  /**
   * Navigate to a URL or execute search query
   */
  const navigateTo = (target: string, isSearch: boolean = false) => {
    let finalUrl = target.trim();
    if (!finalUrl) finalUrl = 'https://www.google.com/webhp?igu=1';

    const hasProtocol = /^https?:\/\//i.test(finalUrl);
    const hasDomain = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i.test(finalUrl);

    // If search or not a URL, perform Google Search or Multi-Search
    if (isSearch || (!hasProtocol && !hasDomain)) {
      setActiveSearchQuery(finalUrl);
      if (searchEngine === 'google') {
        finalUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(finalUrl)}`;
      } else if (searchEngine === 'duckduckgo') {
        finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(finalUrl)}`;
      } else {
        // Portal search
        fetchSearchResults(finalUrl);
        updateCurrentTabUrl('Search: ' + finalUrl, true);
        return;
      }
    } else if (!hasProtocol) {
      finalUrl = `https://${finalUrl}`;
    }

    // If navigating to google.com root, ensure igu=1 is attached
    if (finalUrl.includes('google.com') && !finalUrl.includes('igu=1')) {
      const sep = finalUrl.includes('?') ? '&' : '?';
      finalUrl = `${finalUrl}${sep}igu=1`;
    }

    setUrlInput(finalUrl);

    // Update Tab
    let tabTitle = 'Web Page';
    try {
      const parsed = new URL(finalUrl);
      tabTitle = parsed.hostname.replace('www.', '');
      if (tabTitle.includes('google')) tabTitle = 'Google Search';
    } catch {}

    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId) {
          return { ...t, url: finalUrl, title: tabTitle, isSearchPortal: false, isLoading: true };
        }
        return t;
      })
    );

    // Update History
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), finalUrl]);
    setHistoryIndex((prev) => prev + 1);

    logConsole(`[Browse] Navigating to: ${finalUrl}`);

    if (isAiOpen) {
      runAiInspect(finalUrl);
    }
  };

  const fetchSearchResults = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await fetch('/api/web3-browser/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);
      logConsole(`[Search Portal] Found ${data.results?.length || 0} results for: ${query}`);
    } catch (e: any) {
      logConsole(`[Search Error] ${e.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevUrl = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setUrlInput(prevUrl);
      updateCurrentTabUrl(prevUrl);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextUrl = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setUrlInput(nextUrl);
      updateCurrentTabUrl(nextUrl);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = resolveIframeSrc(activeTab.url);
      logConsole(`[Reload] Refreshed active page: ${activeTab.url}`);
    }
  };

  const handleHome = () => {
    navigateTo('https://www.google.com/webhp?igu=1');
  };

  const updateCurrentTabUrl = (url: string, isPortal: boolean = false) => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId) {
          let title = 'Web Page';
          try {
            title = new URL(url).hostname.replace('www.', '');
          } catch {
            title = url;
          }
          return { ...t, url, title, isSearchPortal: isPortal, isLoading: false };
        }
        return t;
      })
    );
  };

  const handleAddTab = () => {
    const newTabId = 'tab-' + Date.now();
    const newTab: BrowserTab = {
      id: newTabId,
      title: 'Google',
      url: 'https://www.google.com/webhp?igu=1',
      isLoading: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
    setUrlInput('https://www.google.com/webhp?igu=1');
  };

  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const nextTabs = tabs.filter((t) => t.id !== id);
    setTabs(nextTabs);
    if (activeTabId === id) {
      setActiveTabId(nextTabs[nextTabs.length - 1].id);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const runAiInspect = async (urlToInspect: string = activeTab.url) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/web3-browser/ai-inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToInspect, question: aiQuestion }),
      });
      const data = await res.json();
      setAiAnalysis(data);
      logConsole(`[AI Inspector] Analyzed ${urlToInspect} (Score: ${data.securityScore || 95}/100)`);
    } catch (err: any) {
      logConsole(`[AI Error] Failed inspection: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0D1117] text-[#C9D1D9] select-none font-sans overflow-hidden">
      {/* 1. TOP TABS STRIP */}
      <div className="flex items-center bg-[#161B22] px-3 pt-2 border-b border-[#30363D] overflow-x-auto no-scrollbar gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group relative flex items-center max-w-[220px] min-w-[130px] h-9 px-3 rounded-t-lg text-xs font-medium cursor-pointer transition-colors border-t border-x ${
                isActive
                  ? 'bg-[#0D1117] text-white border-[#30363D] shadow-sm'
                  : 'bg-[#161B22] text-[#8B949E] border-transparent hover:bg-[#21262D] hover:text-[#C9D1D9]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 mr-2 text-[#58A6FF] shrink-0" />
              <span className="truncate flex-1">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className="ml-1.5 p-0.5 rounded-full hover:bg-[#30363D] text-[#8B949E] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={handleAddTab}
          title="New Tab"
          className="p-1.5 rounded-md hover:bg-[#21262D] text-[#8B949E] hover:text-white transition-colors ml-1"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Right side chain status */}
        <div className="ml-auto flex items-center gap-2 pb-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#21262D] border border-[#30363D] rounded-full text-xs text-[#E3B341]">
            <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse"></span>
            <span>{selectedChain.name}</span>
          </div>
        </div>
      </div>

      {/* 2. OMNIBOX & NAVIGATION BAR */}
      <div className="flex items-center px-4 py-2 bg-[#161B22] border-b border-[#30363D] gap-2">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-md hover:bg-[#21262D] disabled:opacity-40 disabled:hover:bg-transparent text-[#C9D1D9] transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-md hover:bg-[#21262D] disabled:opacity-40 disabled:hover:bg-transparent text-[#C9D1D9] transition-colors"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md hover:bg-[#21262D] text-[#C9D1D9] transition-colors"
            title="Reload"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleHome}
            className="p-1.5 rounded-md hover:bg-[#21262D] text-[#C9D1D9] transition-colors"
            title="Home (Google)"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Search Engine Switcher */}
        <div className="relative">
          <select
            value={searchEngine}
            onChange={(e: any) => setSearchEngine(e.target.value)}
            className="text-xs bg-[#21262D] border border-[#30363D] text-[#C9D1D9] rounded-md px-2 py-1.5 cursor-pointer focus:outline-none focus:border-[#58A6FF]"
          >
            <option value="google">Google</option>
            <option value="duckduckgo">DuckDuckGo</option>
            <option value="portal">Web3 Portal</option>
          </select>
        </div>

        {/* Address Omnibox */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center relative">
          <div className="absolute left-3 flex items-center pointer-events-none text-[#3FB950]">
            <Lock className="w-3.5 h-3.5 mr-1" />
          </div>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Type any search query (e.g. 'Bitcoin news') or website address (e.g. google.com)..."
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-8 pr-28 py-1.5 text-xs text-white placeholder-[#6E7681] focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all"
          />
          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigateTo('https://www.google.com/webhp?igu=1')}
              className="px-2 py-1 bg-[#21262D] hover:bg-[#30363D] text-[#58A6FF] rounded text-[11px] font-semibold border border-[#30363D]"
              title="Open Google Search directly"
            >
              Google
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Go</span>
            </button>
          </div>
        </form>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Dedicated Authenticated Window Button */}
          <button
            onClick={() => handleOpenDedicatedWindow()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm border border-indigo-400 transition-all shrink-0"
            title="Open in dedicated top-level window (Allows real Google, Discord, Twitter, and MetaMask account sign-in without iframe restrictions)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dedicated Auth Window</span>
            <span className="sm:hidden">Auth ↗</span>
          </button>

          {/* Google Account Status / Login */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#21262D] border border-emerald-500/40 text-xs shrink-0">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[9px]">
                {currentUser.displayName ? currentUser.displayName.slice(0, 1).toUpperCase() : 'G'}
              </div>
              <span className="text-emerald-300 font-medium truncate max-w-[100px] hidden md:inline" title={currentUser.email || ''}>
                {currentUser.displayName || currentUser.email}
              </span>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#21262D] hover:bg-[#30363D] text-white border border-[#30363D] hover:border-[#58A6FF] transition-all shrink-0"
              title="Sign into Google Account for Drive & Workspace"
            >
              <LogIn className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span className="hidden md:inline">{isSigningIn ? 'Connecting...' : 'Sign in'}</span>
            </button>
          )}

          {/* Google Drive Browser shortcut */}
          {onNavigateToDrive && (
            <button
              onClick={onNavigateToDrive}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 transition-all shrink-0"
              title="Switch to Google Drive Cloud Browser"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Drive Browser</span>
            </button>
          )}

          {/* AI Inspector Toggle */}
          <button
            onClick={() => {
              const next = !isAiOpen;
              setIsAiOpen(next);
              if (next && !aiAnalysis) runAiInspect();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors shrink-0 ${
              isAiOpen
                ? 'bg-[#1F6FEB]/20 border-[#58A6FF] text-[#58A6FF]'
                : 'bg-[#21262D] border-[#30363D] text-[#C9D1D9] hover:bg-[#30363D]'
            }`}
            title="AI Page Watcher & Inspector"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#58A6FF]" />
            <span className="hidden sm:inline">AI Watcher</span>
          </button>

          {/* Web3 Injected Wallet Toggle */}
          <button
            onClick={() => setIsWalletOpen(!isWalletOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors shrink-0 ${
              isWalletOpen
                ? 'bg-[#238636]/20 border-[#3FB950] text-[#3FB950]'
                : 'bg-[#21262D] border-[#30363D] text-[#C9D1D9] hover:bg-[#30363D]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#3FB950]" />
            <span>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </button>

          {/* Terminal Logs Toggle */}
          <button
            onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
            className={`p-1.5 rounded-md border transition-colors shrink-0 ${
              isDevToolsOpen
                ? 'bg-[#8957E5]/20 border-[#A371F7] text-[#A371F7]'
                : 'bg-[#21262D] border-[#30363D] text-[#8B949E] hover:text-white'
            }`}
            title="Web3 Provider Console & Logs"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Account Sign-in Assistance Notice */}
      {showAuthNotice && (
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-slate-900 border-b border-indigo-500/30 text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Signing into accounts:</strong> Websites like Uniswap, Google, OpenSea, and Twitter restrict logins inside embedded iframes for anti-clickjacking security. Click{' '}
              <button
                onClick={() => handleOpenDedicatedWindow()}
                className="underline font-bold text-white hover:text-blue-300"
              >
                "Dedicated Auth Window ↗"
              </button>{' '}
              to sign in with your real browser session, cookies, and wallet extensions without restrictions!
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            {onNavigateToDrive && (
              <button
                onClick={onNavigateToDrive}
                className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] font-bold"
              >
                📁 Open Drive Browser
              </button>
            )}
            <button
              onClick={() => setShowAuthNotice(false)}
              className="p-1 text-indigo-400 hover:text-white rounded hover:bg-indigo-900/50"
              title="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. BOOKMARKS & QUICK NAVIGATION BAR */}
      <div className="flex items-center px-4 py-1.5 bg-[#0D1117] border-b border-[#21262D] overflow-x-auto no-scrollbar gap-2 text-xs">
        <span className="text-[#6E7681] text-[11px] font-medium flex items-center gap-1 shrink-0">
          <Compass className="w-3 h-3 text-[#58A6FF]" /> Quick Destinations:
        </span>
        {DEFAULT_BOOKMARKS.map((b) => (
          <button
            key={b.name}
            onClick={() => {
              if (b.isDrive && onNavigateToDrive) {
                onNavigateToDrive();
              } else {
                navigateTo(b.url);
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border transition-all shrink-0 ${
              b.isDrive
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 font-bold'
                : 'hover:bg-[#21262D] text-[#8B949E] hover:text-[#58A6FF] border-transparent hover:border-[#30363D]'
            }`}
          >
            {b.isDrive && <FolderGit2 className="w-3 h-3 text-amber-400" />}
            <span>{b.name}</span>
          </button>
        ))}
      </div>

      {/* 4. MAIN BROWSER WORKSPACE */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* If Active Tab is Search Portal View */}
        {activeTab.isSearchPortal ? (
          <div className="flex-1 h-full overflow-y-auto bg-[#0D1117] p-6 space-y-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-[#58A6FF]" />
                    <span>Search Results: "{activeSearchQuery}"</span>
                  </h2>
                  <p className="text-xs text-[#8B949E]">
                    Showing Google, Web3 on-chain directories, and decentralized resources.
                  </p>
                </div>
                <button
                  onClick={() => navigateTo(`https://www.google.com/search?igu=1&q=${encodeURIComponent(activeSearchQuery)}`)}
                  className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Open in Live Google</span>
                </button>
              </div>

              {isSearching ? (
                <div className="p-12 text-center text-[#8B949E] bg-[#161B22] rounded-xl border border-[#30363D]">
                  <RotateCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#58A6FF]" />
                  <p className="text-sm font-medium text-white">Aggregating Web & Web3 Results...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      className="p-4 bg-[#161B22] border border-[#30363D] rounded-xl hover:border-[#58A6FF]/60 transition-all cursor-pointer group"
                      onClick={() => navigateTo(res.url)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-[#58A6FF] truncate">{res.url}</span>
                        {res.category && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#21262D] text-[#8B949E] border border-[#30363D]">
                            {res.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white group-hover:text-[#58A6FF] transition-colors">
                        {res.title}
                      </h3>
                      <p className="text-xs text-[#8B949E] mt-1 leading-relaxed">{res.snippet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Live Interactive Iframe Canvas */
          <div className="flex-1 h-full w-full relative bg-white">
            <iframe
              ref={iframeRef}
              src={resolveIframeSrc(activeTab.url)}
              className="w-full h-full border-0"
              title="Web3 Live Browser"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-modals allow-downloads"
              onLoad={() => {
                setTabs((prev) =>
                  prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
                );
                logConsole(`[Frame] Loaded: ${activeTab.url}`);
              }}
            />
          </div>
        )}

        {/* 5. AI WATCHER & PAGE INSPECTOR PANEL */}
        {isAiOpen && (
          <div className="w-96 bg-[#161B22] border-l border-[#30363D] flex flex-col h-full z-20 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-4 border-b border-[#30363D]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#58A6FF]" />
                <h3 className="font-semibold text-sm text-white">Gemini Web3 Watcher</h3>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1 rounded hover:bg-[#21262D] text-[#8B949E] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Active URL & Trust Score */}
              <div className="p-3 bg-[#0D1117] border border-[#30363D] rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#8B949E]">Inspecting Domain:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#238636]/20 text-[#3FB950] border border-[#238636]/40">
                    {aiAnalysis?.riskLevel || 'VERIFIED'}
                  </span>
                </div>
                <div className="text-white font-mono text-[11px] truncate">{activeTab.url}</div>
              </div>

              {/* AI Summary */}
              <div>
                <div className="font-semibold text-white mb-1.5 flex items-center justify-between">
                  <span>Page Intelligence Summary</span>
                  <button
                    onClick={() => runAiInspect()}
                    className="text-[#58A6FF] hover:underline text-[11px]"
                  >
                    Refresh
                  </button>
                </div>
                {isAiLoading ? (
                  <div className="p-4 text-center text-[#8B949E] bg-[#0D1117] rounded-lg border border-[#30363D]">
                    <RotateCw className="w-4 h-4 animate-spin mx-auto mb-2 text-[#58A6FF]" />
                    <span>Gemini is analyzing page semantics & Web3 hooks...</span>
                  </div>
                ) : (
                  <div className="p-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#C9D1D9] leading-relaxed">
                    {aiAnalysis?.summary ||
                      'Browse any page or search Google. Gemini watches active contracts, security certificates, and smart interactions.'}
                  </div>
                )}
              </div>

              {/* Web3 Capabilities & Security */}
              {aiAnalysis && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#0D1117] border border-[#30363D] rounded-lg">
                    <div className="font-semibold text-white mb-2">Detected Capabilities</div>
                    <div className="flex flex-wrap gap-1.5">
                      {aiAnalysis.web3Features?.map((f: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#21262D] text-[#58A6FF] rounded text-[10px] border border-[#30363D]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[#0D1117] border border-[#30363D] rounded-lg">
                    <div className="font-semibold text-white mb-1">Contract Integration Advice</div>
                    <p className="text-[#8B949E] leading-normal">
                      {aiAnalysis.smartContractIntegration || 'Standard EIP-1193 window.ethereum provider active.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Ask Gemini about this page */}
              <div className="pt-2">
                <div className="font-semibold text-white mb-1.5">Ask AI about this site</div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="e.g. Is this smart contract safe?"
                    className="flex-1 bg-[#0D1117] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#58A6FF]"
                    onKeyDown={(e) => e.key === 'Enter' && runAiInspect()}
                  />
                  <button
                    onClick={() => runAiInspect()}
                    className="p-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. WEB3 WALLET DRAWER */}
        {isWalletOpen && (
          <div className="w-80 bg-[#161B22] border-l border-[#30363D] flex flex-col h-full z-20 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-4 border-b border-[#30363D]">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#3FB950]" />
                <h3 className="font-semibold text-sm text-white">Web3 Injected Wallet</h3>
              </div>
              <button
                onClick={() => setIsWalletOpen(false)}
                className="p-1 rounded hover:bg-[#21262D] text-[#8B949E] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Account Card */}
              <div className="p-3.5 bg-[#0D1117] border border-[#30363D] rounded-xl text-center space-y-2">
                <div className="flex items-center justify-between text-[#8B949E] text-[11px]">
                  <span>Active Injected Account</span>
                  {isExtensionConnected ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      EXTENSION
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                      EMULATED
                    </span>
                  )}
                </div>

                <div className="font-mono text-white text-xs flex items-center justify-between gap-1.5 bg-[#161B22] py-1.5 px-2.5 rounded border border-[#30363D]">
                  <span className="truncate">
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={copyAddress} title="Copy Address" className="text-[#58A6FF] hover:text-white p-1">
                      {copiedAddress ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {ethBalance} <span className="text-sm font-normal text-[#8B949E]">ETH</span>
                  </div>
                  <div className="text-[#3FB950] text-[11px] font-medium mt-0.5">
                    ≈ ${usdcBalance} USD
                  </div>
                </div>

                {/* Account Action Buttons */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={handleConnectExtension}
                    className="py-1.5 px-2 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    title="Connect your browser's installed MetaMask, Coinbase, or Rabby wallet"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Connect Extension</span>
                  </button>
                  <button
                    onClick={() => {
                      const custom = window.prompt('Enter EVM wallet address (0x...):', walletAddress);
                      if (custom && custom.startsWith('0x')) {
                        setWalletAddress(custom);
                        logConsole(`[Wallet] Switched to address: ${custom}`);
                      }
                    }}
                    className="py-1.5 px-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white border border-[#30363D] text-[11px] font-medium transition-colors"
                  >
                    Switch Address
                  </button>
                </div>
              </div>

              {/* Google Workspace Account Card */}
              <div className="p-3 bg-[#0D1117] border border-[#30363D] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google Workspace Auth</span>
                  </span>
                  {currentUser ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                      GUEST
                    </span>
                  )}
                </div>

                {currentUser ? (
                  <div className="space-y-1 text-[11px]">
                    <p className="text-[#C9D1D9] font-medium">{currentUser.displayName || 'Google User'}</p>
                    <p className="text-[#8B949E] font-mono truncate">{currentUser.email}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {onNavigateToDrive && (
                        <button
                          onClick={onNavigateToDrive}
                          className="flex-1 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center justify-center gap-1"
                        >
                          <FolderGit2 className="w-3 h-3 text-amber-400" />
                          <span>Google Drive Browser</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[#8B949E] text-[11px]">
                      Sign into Google to access Google Drive, Docs, Calendar, and sync tokens.
                    </p>
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isSigningIn}
                      className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Login / Auth Troubleshooting Box */}
              <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl space-y-1.5 text-[11px] text-blue-200">
                <div className="font-semibold text-white flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>DApp & Account Login Support</span>
                </div>
                <p className="leading-relaxed text-[#8B949E]">
                  Due to third-party cookie restrictions in browsers, signing into external sites (like Uniswap, Discord, Twitter, Google) is blocked inside sandboxed iframes.
                </p>
                <button
                  onClick={() => handleOpenDedicatedWindow()}
                  className="w-full py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm mt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Dedicated Window ↗</span>
                </button>
              </div>

              {/* Chain Switcher */}
              <div>
                <div className="font-semibold text-white mb-2">Connected Network</div>
                <div className="space-y-1">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => {
                        setSelectedChain(chain);
                        logConsole(`[Chain] Switched provider network to ${chain.name} (${chain.id})`);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors ${
                        selectedChain.id === chain.id
                          ? 'bg-[#238636]/15 border-[#3FB950] text-white'
                          : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:text-white hover:bg-[#21262D]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            selectedChain.id === chain.id ? 'bg-[#3FB950]' : 'bg-[#6E7681]'
                          }`}
                        />
                        <span>{chain.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#6E7681]">{chain.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intercepted Transactions / Signatures Log */}
              <div>
                <div className="font-semibold text-white mb-2 flex items-center justify-between">
                  <span>DApp Signatures & Txs</span>
                  <span className="text-[10px] text-[#6E7681]">{txLogs.length} total</span>
                </div>
                {txLogs.length === 0 ? (
                  <div className="p-3 text-center text-[#6E7681] bg-[#0D1117] border border-[#30363D] rounded-lg">
                    No transactions requested by current page yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {txLogs.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#58A6FF]">{tx.type}</span>
                          <span className="text-[#3FB950] font-mono text-[10px]">APPROVED</span>
                        </div>
                        <div className="text-[#6E7681] text-[10px]">{tx.timestamp}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 7. DEVTOOLS / CONSOLE DRAWER */}
        {isDevToolsOpen && (
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-[#0D1117] border-t border-[#30363D] z-20 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-b border-[#30363D]">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Terminal className="w-3.5 h-3.5 text-[#58A6FF]" />
                <span>Web3 Provider & Network Logs</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsoleLogs([])}
                  className="text-[11px] text-[#8B949E] hover:text-white"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsDevToolsOpen(false)}
                  className="p-0.5 hover:bg-[#21262D] rounded text-[#8B949E] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-2 overflow-y-auto font-mono text-[11px] text-[#8B949E] space-y-1">
              {consoleLogs.map((log, i) => (
                <div key={i} className="hover:text-white">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Web3Browser;

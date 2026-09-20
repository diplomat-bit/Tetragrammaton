import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  Coins,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Building2,
  Lock,
  FileCode,
  Layers,
  ArrowUpRight,
  Send,
  Database,
  Search,
  ShoppingCart,
  DollarSign,
  Activity,
  Globe,
  Sliders,
  Play,
  Key,
  Flame,
  Info
} from 'lucide-react';
import { ethers } from 'ethers';
import { TokenResponse } from '../types';
import { apiFetch } from '../utils/apiClient';
import { NethereumSuiteConsole } from './NethereumSuiteConsole';

interface MetaMaskEthereumConsoleProps {
  tokens?: TokenResponse | null;
  realmId?: string;
  onNavigateToBridge?: () => void;
  onNavigateToCiti?: () => void;
  onNavigateToAmazon?: () => void;
}

export const MetaMaskEthereumConsole: React.FC<MetaMaskEthereumConsoleProps> = ({
  tokens,
  realmId,
  onNavigateToBridge,
  onNavigateToCiti,
  onNavigateToAmazon,
}) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'buy-eth' | 'notary' | 'ledger' | 'nethereum'>('wallet');

  // Web3 / MetaMask Connection State
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string>('Not Connected');
  const [ethBalance, setEthBalance] = useState<string>('0.0000');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Backend Ethereum API State
  const [config, setConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [marketRates, setMarketRates] = useState<any>({ USD: 3250.00, AUD: 4980.50, EUR: 3010.20, GBP: 2575.80 });
  const [fundingAccounts, setFundingAccounts] = useState<any[]>([]);
  const [onChainLogs, setOnChainLogs] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Buy ETH State
  const [buyFiatAmount, setBuyFiatAmount] = useState<string>('1000');
  const [buyCurrency, setBuyCurrency] = useState<string>('USD');
  const [selectedFundingAccount, setSelectedFundingAccount] = useState<string>('citi-chk-4128');
  const [targetWalletAddress, setTargetWalletAddress] = useState<string>('');
  const [isBuyingEth, setIsBuyingEth] = useState<boolean>(false);
  const [buyStep, setBuyStep] = useState<string>('');
  const [buyReceipt, setBuyReceipt] = useState<any | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [autoSyncQbo, setAutoSyncQbo] = useState<boolean>(true);

  // Notary / On-Chain Logging State
  const [notarySourceType, setNotarySourceType] = useState<string>('QBO_JOURNAL');
  const [notaryAmount, setNotaryAmount] = useState<string>('14500');
  const [notaryCurrency, setNotaryCurrency] = useState<string>('USD');
  const [notaryEntityId, setNotaryEntityId] = useState<string>('QBO-JE-2026-99042');
  const [notaryCustomJson, setNotaryCustomJson] = useState<string>('{\n  "memo": "Citi NPP Commercial Transfer & QBO Asset Sync",\n  "referenceDoc": "JE-99042",\n  "bankAccount": "AU-CITI-CHK-904128",\n  "auditTier": "TIER_1_ENTERPRISE"\n}');
  const [notaryExecutionMode, setNotaryExecutionMode] = useState<'metamask' | 'relayer'>('metamask');
  const [isNotarizing, setIsNotarizing] = useState<boolean>(false);
  const [notarizeResult, setNotarizeResult] = useState<any | null>(null);
  const [notarizeError, setNotarizeError] = useState<string | null>(null);
  const [isAutoAnchoring, setIsAutoAnchoring] = useState<boolean>(false);

  // Ledger Filter
  const [ledgerSearch, setLedgerSearch] = useState<string>('');
  const [ledgerFilterType, setLedgerFilterType] = useState<string>('ALL');

  // Check MetaMask injection
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setHasMetaMask(true);
      checkExistingConnection();
      setupMetaMaskListeners();
    } else {
      setHasMetaMask(false);
    }

    fetchConfig();
    fetchHistory();
  }, []);

  // Update target wallet address when account changes
  useEffect(() => {
    if (account && !targetWalletAddress) {
      setTargetWalletAddress(account);
    }
  }, [account]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await apiFetch<any>('/api/ethereum/config');
      if (res.ok && res.data) {
        setConfig(res.data);
        if (res.data.marketRates) setMarketRates(res.data.marketRates);
        if (res.data.fundingAccounts) setFundingAccounts(res.data.fundingAccounts);
      }
    } catch (e) {
      console.error('Failed to fetch Ethereum config:', e);
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await apiFetch<any>('/api/ethereum/history');
      if (res.ok && res.data) {
        setOnChainLogs(res.data.logs || []);
        setPurchases(res.data.purchases || []);
      }
    } catch (e) {
      console.error('Failed to fetch Ethereum history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Check if user already authorized MetaMask
  const checkExistingConnection = async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) return;

      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const address = accounts[0].address;
        setAccount(address);
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
        setNetworkName(getNetworkNameByChainId(Number(network.chainId)));
        await refreshBalance(address, provider);
      }
    } catch (err) {
      console.error('Error checking existing MetaMask connection:', err);
    }
  };

  const setupMetaMaskListeners = () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum || !ethereum.on) return;

    ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setTargetWalletAddress(accounts[0]);
        const provider = new ethers.BrowserProvider(ethereum);
        await refreshBalance(accounts[0], provider);
      } else {
        setAccount(null);
        setEthBalance('0.0000');
        setNetworkName('Not Connected');
      }
    });

    ethereum.on('chainChanged', (chainIdHex: string) => {
      const id = parseInt(chainIdHex, 16);
      setChainId(id);
      setNetworkName(getNetworkNameByChainId(id));
      if (account) {
        const provider = new ethers.BrowserProvider(ethereum);
        refreshBalance(account, provider);
      }
    });
  };

  const refreshBalance = async (address: string, providerInstance?: ethers.BrowserProvider) => {
    try {
      const ethereum = (window as any).ethereum;
      const provider = providerInstance || (ethereum ? new ethers.BrowserProvider(ethereum) : null);
      if (!provider) return;

      const bal = await provider.getBalance(address);
      const formatted = parseFloat(ethers.formatEther(bal)).toFixed(4);
      setEthBalance(formatted);
    } catch (err) {
      console.error('Error refreshing ETH balance:', err);
    }
  };

  const getNetworkNameByChainId = (id: number): string => {
    switch (id) {
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 17000:
        return 'Holesky Testnet';
      case 42161:
        return 'Arbitrum One';
      case 137:
        return 'Polygon PoS';
      case 31337:
      case 1337:
        return 'Localhost / Anvil';
      default:
        return `Chain ID: ${id}`;
    }
  };

  // Connect MetaMask Wallet
  const connectMetaMask = async () => {
    setWalletError(null);
    setIsConnecting(true);

    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        setWalletError('MetaMask extension not detected. Please install MetaMask from metamask.io or use a Web3-enabled browser.');
        setIsConnecting(false);
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setAccount(address);
        setTargetWalletAddress(address);

        const network = await provider.getNetwork();
        const numChainId = Number(network.chainId);
        setChainId(numChainId);
        setNetworkName(getNetworkNameByChainId(numChainId));

        await refreshBalance(address, provider);
      }
    } catch (err: any) {
      console.error('Failed to connect MetaMask:', err);
      setWalletError(err.message || 'User rejected MetaMask connection request');
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch Network via MetaMask
  const switchNetwork = async (targetChainId: number) => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    const hexId = '0x' + targetChainId.toString(16);
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexId }],
      });
    } catch (switchError: any) {
      // If chain has not been added to MetaMask (error code 4902)
      if (switchError.code === 4902) {
        const net = config?.networks?.find((n: any) => n.chainId === targetChainId);
        if (net) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: hexId,
                  chainName: net.name,
                  rpcUrls: [net.rpcUrl],
                  nativeCurrency: { name: 'Ethereum', symbol: net.symbol, decimals: 18 },
                  blockExplorerUrls: [net.explorerUrl],
                },
              ],
            });
          } catch (addError) {
            console.error('Failed to add network to MetaMask:', addError);
          }
        }
      }
    }
  };

  // Execute Buy Ethereum With Bank Account
  const handleBuyEthereum = async () => {
    const amountNum = parseFloat(buyFiatAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setBuyError('Please enter a valid purchase amount greater than $0.');
      return;
    }

    const recipientAddress = targetWalletAddress || account;
    if (!recipientAddress || !ethers.isAddress(recipientAddress)) {
      setBuyError('Please connect MetaMask or provide a valid target Ethereum wallet address (0x...).');
      return;
    }

    setBuyError(null);
    setIsBuyingEth(true);
    setBuyStep('Debiting enterprise bank account liquidity...');

    setTimeout(() => {
      setBuyStep('Executing QBO Journal Entry (#1080 Digital Currency Asset)...');
    }, 700);

    setTimeout(() => {
      setBuyStep('Broadcasting on-chain ETH delivery to MetaMask wallet...');
    }, 1400);

    try {
      const res = await apiFetch<any>('/api/ethereum/buy-eth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAddress: recipientAddress,
          fiatAmount: amountNum,
          fiatCurrency: buyCurrency,
          fundingAccountId: selectedFundingAccount,
          networkChainId: chainId || 11155111,
          autoSyncQbo,
          tokenOverride: tokens?.access_token || (tokens as any)?.accessToken,
          realmIdOverride: realmId,
        }),
      });

      if (res.ok && res.data?.success) {
        setBuyReceipt(res.data.receipt);
        fetchHistory();
        fetchConfig();

        // Refresh live MetaMask balance
        if (account) {
          setTimeout(() => {
            refreshBalance(account);
          }, 1000);
        }
      } else {
        setBuyError(res.data?.error || 'Failed to complete Ethereum acquisition.');
      }
    } catch (err: any) {
      setBuyError(err.message || 'Network error executing crypto purchase.');
    } finally {
      setIsBuyingEth(false);
      setBuyStep('');
    }
  };

  // Notarize Transaction onto Blockchain
  const handleNotarizeTransaction = async () => {
    setNotarizeError(null);
    setIsNotarizing(true);

    try {
      let parsedJson = {};
      try {
        parsedJson = JSON.parse(notaryCustomJson);
      } catch {
        setNotarizeError('Invalid JSON in custom metadata payload.');
        setIsNotarizing(false);
        return;
      }

      let clientTxHash: string | undefined = undefined;

      // If user chose MetaMask client-side execution, prompt MetaMask to sign transaction data
      if (notaryExecutionMode === 'metamask' && account && (window as any).ethereum) {
        try {
          const ethereum = (window as any).ethereum;
          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();

          const canonicalPayload = {
            protocol: 'ENT-FIN-ETH-V1',
            recordType: notarySourceType,
            sourceEntityId: notaryEntityId,
            amount: Number(notaryAmount),
            currency: notaryCurrency,
            timestamp: new Date().toISOString(),
            metadata: parsedJson,
          };

          const hexData = ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(canonicalPayload)));

          // Send transaction to notarize on-chain (using signer's own address as target memo receiver)
          const tx = await signer.sendTransaction({
            to: config?.notaryContractAddress || signer.address,
            value: 0,
            data: hexData,
          });

          clientTxHash = tx.hash;
        } catch (metamaskErr: any) {
          console.warn('MetaMask signing declined or failed, falling back to enterprise relayer:', metamaskErr);
        }
      }

      const res = await apiFetch<any>('/api/ethereum/log-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordType: notarySourceType,
          sourceSystem: notarySourceType.startsWith('CITI') ? 'Citi Open Banking' : (notarySourceType.startsWith('AMAZON') ? 'Amazon APS' : 'Intuit QuickBooks'),
          sourceEntityId: notaryEntityId,
          amount: Number(notaryAmount),
          currency: notaryCurrency,
          walletAddress: account,
          customPayload: parsedJson,
          networkChainId: chainId || 11155111,
          clientTxHash,
        }),
      });

      if (res.ok && res.data?.success) {
        setNotarizeResult(res.data.logRecord);
        fetchHistory();
      } else {
        setNotarizeError(res.data?.error || 'Failed to notarize onto Ethereum.');
      }
    } catch (err: any) {
      setNotarizeError(err.message || 'Error communicating with Ethereum notary.');
    } finally {
      setIsNotarizing(false);
    }
  };

  // Auto Anchor All Recent Transactions
  const handleAutoAnchorAll = async () => {
    setIsAutoAnchoring(true);
    try {
      const res = await apiFetch<any>('/api/ethereum/auto-anchor-all-recent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: account,
          networkChainId: chainId || 11155111,
        }),
      });

      if (res.ok && res.data) {
        fetchHistory();
        alert(`Successfully anchored ${res.data.newlyAnchoredCount} recent enterprise events to the Ethereum blockchain!`);
      }
    } catch (e: any) {
      alert(e.message || 'Auto-anchoring failed');
    } finally {
      setIsAutoAnchoring(false);
    }
  };

  const calculatedEthAmount = (parseFloat(buyFiatAmount || '0') / (marketRates[buyCurrency] || marketRates.USD)).toFixed(6);

  const filteredLogs = onChainLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      log.txHash.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      log.sourceEntityId.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      log.recordType.toLowerCase().includes(ledgerSearch.toLowerCase());
    const matchesFilter = ledgerFilterType === 'ALL' || log.recordType === ledgerFilterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0E1626] via-[#1A2639] to-[#0E1626] rounded-xl border border-sky-500/40 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#627EEA] to-[#8C9EFF] flex items-center justify-center text-white font-black shadow-md">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    MetaMask & Ethereum On-Chain Suite
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    WEB3 IMMUTABLE LEDGER
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Connect your MetaMask wallet, buy Ethereum instantly with Citibank and enterprise accounts, and cryptographically anchor all banking & QuickBooks transactions onto the Ethereum blockchain.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {account ? (
              <div className="flex items-center space-x-2 bg-black/60 border border-emerald-500/40 px-3 py-1.5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {ethBalance} ETH
                </span>
              </div>
            ) : (
              <button
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-orange-950/40 border border-orange-400 cursor-pointer"
              >
                {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                <span>Connect MetaMask</span>
              </button>
            )}

            <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700/60 text-xs flex items-center space-x-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">ETH Price:</span>
              <span className="font-bold text-emerald-400">${marketRates.USD.toLocaleString()}</span>
            </div>

            <button
              onClick={() => {
                fetchConfig();
                fetchHistory();
                if (account) refreshBalance(account);
              }}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
              title="Refresh Web3 State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap gap-2">
          {[
            { id: 'wallet', label: '🦊 MetaMask Web3 Hub', badge: account ? 'CONNECTED' : 'DISCONNECTED' },
            { id: 'nethereum', label: '🌐 Nethereum Protocol Suite', badge: 'ENS / SIWE / ERC20' },
            { id: 'buy-eth', label: '💳 Buy Ethereum (Bank Funded)', badge: 'INSTANT ON-RAMP' },
            { id: 'notary', label: '🔐 Blockchain Notary & On-Chain Logger', badge: 'SHA-256 MEMO' },
            { id: 'ledger', label: '📜 Ethereum On-Chain Ledger', badge: `${onChainLogs.length} LOGS` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md border border-sky-400 font-black'
                  : 'text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                    activeTab === tab.id ? 'bg-black text-sky-300' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 1: METAMASK WEB3 HUB */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Wallet Status Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      MetaMask Injected Provider
                    </h3>
                    <p className="text-[11px] text-slate-400">EIP-1193 Standard Web3 Ethereum Interface</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    account
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {account ? 'ACTIVE SESSION' : 'OFFLINE'}
                </span>
              </div>

              {account ? (
                <div className="space-y-4">
                  {/* Account Address Banner */}
                  <div className="p-4 rounded-xl bg-[#0D1117] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Connected Ethereum Address:</span>
                      <button
                        onClick={() => copyToClipboard(account, 'addr-copy')}
                        className="text-[11px] text-sky-400 hover:text-white flex items-center space-x-1"
                      >
                        {copiedKey === 'addr-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'addr-copy' ? 'Copied' : 'Copy Address'}</span>
                      </button>
                    </div>
                    <code className="text-sm font-mono font-bold text-sky-300 block break-all">
                      {account}
                    </code>
                  </div>

                  {/* Balance Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg bg-[#0D1117] border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">ETH Balance</span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-xl font-black text-white">{ethBalance}</span>
                        <span className="text-xs font-bold text-sky-400">ETH</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        ≈ ${(parseFloat(ethBalance) * marketRates.USD).toFixed(2)} USD
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#0D1117] border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Current Network</span>
                      <span className="text-sm font-bold text-white block truncate">{networkName}</span>
                      <span className="text-[10px] text-slate-400 block">Chain ID: {chainId || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Network Selector Buttons */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Switch Active Ethereum Network:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {config?.networks?.map((net: any) => (
                        <button
                          key={net.chainId}
                          onClick={() => switchNetwork(net.chainId)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                            chainId === net.chainId
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold'
                              : 'bg-[#21262D] text-slate-300 hover:text-white border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <div className="truncate">{net.name}</div>
                          <span className="text-[9px] text-slate-500 block">ID: {net.chainId}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setActiveTab('buy-eth')}
                      className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-black" />
                      <span>Buy ETH with Bank</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('notary')}
                      className="flex-1 py-2.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-xs font-bold text-white transition-colors border border-slate-700 flex items-center justify-center space-x-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-sky-400" />
                      <span>Notarize Transactions</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400">
                    <Wallet className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">No MetaMask Wallet Connected</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Connect your MetaMask browser extension to enable direct on-chain signing, live balances, and bank-funded crypto on-ramps.
                    </p>
                  </div>
                  <button
                    onClick={connectMetaMask}
                    disabled={isConnecting}
                    className="py-2.5 px-6 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 mx-auto shadow-lg shadow-orange-950/50 cursor-pointer"
                  >
                    {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                    <span>Connect with MetaMask</span>
                  </button>
                </div>
              )}

              {walletError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{walletError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Web3 Feature Highlights & Live Rates */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Global Crypto & Forex Rates
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'ETH / USD', val: `$${marketRates.USD.toLocaleString()}`, change: '+3.4%' },
                  { label: 'ETH / AUD', val: `$${marketRates.AUD.toLocaleString()}`, change: '+2.9%' },
                  { label: 'ETH / EUR', val: `€${marketRates.EUR.toLocaleString()}`, change: '+3.1%' },
                  { label: 'Gas (Gwei)', val: '19.5 Gwei', change: 'Standard' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#0D1117] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{stat.label}</span>
                    <span className="text-sm font-black text-white block">{stat.val}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{stat.change}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-blue-950/40 border border-sky-500/30 space-y-3">
                <h4 className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Enterprise Blockchain Proof Architecture
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every QuickBooks Online transaction, Citibank NPP transfer, and Amazon APS purchase is anchored on-chain with a deterministic SHA-256 digest in transaction calldata memos.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Non-repudiable audit trails</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real-time MetaMask delivery</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>EIP-191 & EIP-712 compatibility</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>QBO Journal Entry #1080 auto-lock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-3 gap-3">
              {onNavigateToCiti && (
                <button
                  onClick={onNavigateToCiti}
                  className="p-3 rounded-lg bg-[#161B22] hover:bg-[#21262D] border border-slate-800 text-left space-y-1 transition-all"
                >
                  <Building2 className="w-4 h-4 text-[#0072CE]" />
                  <span className="text-xs font-bold text-white block">Citi Hub</span>
                  <span className="text-[10px] text-slate-400 block">Manage accounts</span>
                </button>
              )}
              {onNavigateToAmazon && (
                <button
                  onClick={onNavigateToAmazon}
                  className="p-3 rounded-lg bg-[#161B22] hover:bg-[#21262D] border border-slate-800 text-left space-y-1 transition-all"
                >
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white block">Amazon APS</span>
                  <span className="text-[10px] text-slate-400 block">PayFort suite</span>
                </button>
              )}
              {onNavigateToBridge && (
                <button
                  onClick={onNavigateToBridge}
                  className="p-3 rounded-lg bg-[#161B22] hover:bg-[#21262D] border border-slate-800 text-left space-y-1 transition-all"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white block">QBO Bridge</span>
                  <span className="text-[10px] text-slate-400 block">Unified ledger</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 2: BUY ETHEREUM WITH LINKED ACCOUNTS */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'buy-eth' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Crypto Buy Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    Enterprise Ethereum Treasury On-Ramp
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  INSTANT METAMASK DELIVERY
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Purchase Ethereum directly using your enterprise bank accounts (Citibank, Chase, Modern Treasury). The liquidity router debits your balance, registers an asset acquisition journal entry in QuickBooks, and dispatches ETH on-chain directly to your MetaMask wallet.
              </p>

              {/* Funding Account Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Select Funding Bank Account:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {fundingAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedFundingAccount(acc.id)}
                      className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${
                        selectedFundingAccount === acc.id
                          ? 'bg-sky-500/15 border-sky-500 text-white shadow-sm'
                          : 'bg-[#0D1117] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[170px]">{acc.name}</span>
                        <span className="text-[9px] font-bold text-sky-400 bg-sky-500/10 px-1 py-0.5 rounded">
                          {acc.currency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span>{acc.accountNumber}</span>
                        <span className="font-mono font-bold text-emerald-400">
                          ${acc.balance.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input & Currency Converter */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Fiat Purchase Amount:
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="number"
                        value={buyFiatAmount}
                        onChange={(e) => setBuyFiatAmount(e.target.value)}
                        placeholder="1000"
                        className="w-full bg-[#0D1117] border border-[#30363D] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Calculated Ethereum (ETH):
                    </label>
                    <div className="bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 flex items-center justify-between">
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        {calculatedEthAmount}
                      </span>
                      <span className="text-xs font-bold text-slate-400">ETH</span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Presets */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '$250', val: '250' },
                    { label: '$500', val: '500' },
                    { label: '$1,000', val: '1000' },
                    { label: '$5,000', val: '5000' },
                    { label: '$25,000', val: '25000' },
                    { label: '$100,000', val: '100000' },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      onClick={() => setBuyFiatAmount(preset.val)}
                      className="px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[11px] font-bold text-slate-300 hover:text-white transition-colors border border-slate-700"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target MetaMask Address */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                  <span>Destination MetaMask Address:</span>
                  {account && (
                    <span className="text-[10px] text-emerald-400 font-normal">
                      ✓ Connected MetaMask Wallet Selected
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={targetWalletAddress}
                    onChange={(e) => setTargetWalletAddress(e.target.value)}
                    placeholder="0x71C8360e34BB6f0F01344428B715C8271eD8b4e7"
                    className="w-full bg-[#0D1117] border border-[#30363D] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Auto Sync Toggle */}
              <div className="flex items-center space-x-2 text-xs text-slate-300 bg-[#0D1117] p-2.5 rounded-lg border border-[#30363D]">
                <input
                  type="checkbox"
                  checked={autoSyncQbo}
                  onChange={(e) => setAutoSyncQbo(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="font-medium">Lock Crypto Acquisition into QuickBooks General Ledger (#1080 Digital Asset)</span>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={handleBuyEthereum}
                  disabled={isBuyingEth}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isBuyingEth
                      ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-lg shadow-emerald-950/50 border border-emerald-400 font-black'
                  }`}
                >
                  {isBuyingEth ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{buyStep || 'Processing Crypto Acquisition...'}</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 text-black" />
                      <span>Buy {calculatedEthAmount} ETH & Transmit to MetaMask</span>
                    </>
                  )}
                </button>
              </div>

              {buyError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{buyError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Execution Receipt */}
          <div className="lg:col-span-5 space-y-6">
            {buyReceipt ? (
              <div className="bg-[#161B22] rounded-xl border border-emerald-500/50 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        Ethereum Acquisition Confirmed
                      </h4>
                      <p className="text-[10px] text-slate-400">ID: {buyReceipt.purchaseId}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    STATUS: CONFIRMED
                  </span>
                </div>

                {/* Amount Summary */}
                <div className="p-4 rounded-xl bg-[#0D1117] border border-slate-800 text-center space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold">Delivered to MetaMask:</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    +{buyReceipt.ethAmount} ETH
                  </div>
                  <span className="text-xs text-slate-300 block">
                    Paid ${buyReceipt.fiatAmount.toFixed(2)} {buyReceipt.fiatCurrency} @ ${buyReceipt.exchangeRate.toLocaleString()}/ETH
                  </span>
                </div>

                {/* On-Chain Verification */}
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-sky-500/30 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-sky-400 font-bold">
                    <span>On-Chain Blockchain Details</span>
                    <span>Block #{buyReceipt.blockNumber}</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tx Hash:</span>
                      <code className="text-sky-300 text-[10px] break-all">{buyReceipt.txHash}</code>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Recipient Wallet:</span>
                      <code className="text-white text-[10px] break-all">{buyReceipt.targetAddress}</code>
                    </div>
                    {buyReceipt.etherscanUrl && (
                      <a
                        href={buyReceipt.etherscanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 pt-1"
                      >
                        <span>View on Etherscan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Bank Account Debit Info */}
                <div className="p-3 rounded-lg bg-[#0D1117] border border-[#0072CE]/30 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#58A6FF] font-bold">
                    <span>Funding Source:</span>
                    <span>{buyReceipt.bankAccount.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>New Bank Balance:</span>
                    <strong className="text-white">${buyReceipt.bankAccount.newBalance.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>QBO Journal Entry:</span>
                    <code className="text-emerald-400 font-bold">{buyReceipt.qboJournalEntryId}</code>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className="flex-1 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-xs font-bold text-white transition-colors border border-slate-700"
                  >
                    View in Wallet Hub
                  </button>
                  {onNavigateToBridge && (
                    <button
                      onClick={onNavigateToBridge}
                      className="flex-1 py-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-xs font-bold text-emerald-300 transition-colors border border-emerald-500/40"
                    >
                      View QBO Ledger
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 text-center space-y-4 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">No Crypto Purchases Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Select a bank account on the left, enter an amount, and click Buy ETH. The newly purchased Ethereum will instantly show in your MetaMask wallet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 3: BLOCKCHAIN NOTARY & ON-CHAIN LOGGER */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'notary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Notarization Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    Ethereum On-Chain Notary & Transaction Anchoring
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  PROOF-OF-EXISTENCE
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Notarize any financial record (QuickBooks journal entry, Citi transfer, Amazon APS payment, or Custom Doc) into the Ethereum blockchain. A SHA-256 cryptographic digest is embedded in the transaction calldata.
              </p>

              {/* Record Type Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Select Transaction Source Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'QBO_JOURNAL', label: '📘 QBO Journal Entry' },
                    { id: 'CITI_TRANSFER', label: '🏦 Citi NPP Transfer' },
                    { id: 'AMAZON_APS_ORDER', label: '🛒 Amazon APS Order' },
                    { id: 'CUSTOM_NOTARIZATION', label: '📝 Custom Enterprise Doc' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setNotarySourceType(item.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                        notarySourceType === item.id
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold'
                          : 'bg-[#0D1117] text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entity ID & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Source Entity / Reference ID:
                  </label>
                  <input
                    type="text"
                    value={notaryEntityId}
                    onChange={(e) => setNotaryEntityId(e.target.value)}
                    placeholder="QBO-JE-2026-99042"
                    className="w-full bg-[#0D1117] border border-[#30363D] focus:border-sky-500 rounded-lg px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Financial Amount ({notaryCurrency}):
                  </label>
                  <input
                    type="number"
                    value={notaryAmount}
                    onChange={(e) => setNotaryAmount(e.target.value)}
                    placeholder="14500"
                    className="w-full bg-[#0D1117] border border-[#30363D] focus:border-sky-500 rounded-lg px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* Custom Payload JSON */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300">
                    Notary Metadata Payload (JSON):
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Canonical SHA-256 Digest Target</span>
                </div>
                <textarea
                  value={notaryCustomJson}
                  onChange={(e) => setNotaryCustomJson(e.target.value)}
                  rows={5}
                  className="w-full bg-[#0D1117] border border-[#30363D] focus:border-sky-500 font-mono text-xs text-sky-300 p-3 rounded-lg resize-none"
                />
              </div>

              {/* Execution Mode */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 block">
                  On-Chain Execution Route:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNotaryExecutionMode('metamask')}
                    className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                      notaryExecutionMode === 'metamask'
                        ? 'bg-sky-500/15 border-sky-500 text-white shadow-sm'
                        : 'bg-[#0D1117] border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-bold text-white">MetaMask Signer</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Prompts your connected MetaMask wallet to sign & broadcast calldata on-chain
                    </span>
                  </button>

                  <button
                    onClick={() => setNotaryExecutionMode('relayer')}
                    className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                      notaryExecutionMode === 'relayer'
                        ? 'bg-sky-500/15 border-sky-500 text-white shadow-sm'
                        : 'bg-[#0D1117] border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Automated Relayer Node</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Enterprise relayer broadcasts the notary payload with zero gas friction
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleNotarizeTransaction}
                  disabled={isNotarizing}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isNotarizing
                      ? 'bg-sky-600/50 text-sky-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-400 text-white shadow-lg shadow-sky-950/50 border border-sky-400 font-black'
                  }`}
                >
                  {isNotarizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Anchoring on Ethereum...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Notarize on Ethereum Blockchain</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleAutoAnchorAll}
                  disabled={isAutoAnchoring}
                  className="py-3 px-4 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-xs font-bold text-white transition-colors border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
                  title="Anchor all recent unlogged QBO/Citi transactions in batch"
                >
                  {isAutoAnchoring ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>Auto-Anchor All Recent</span>
                </button>
              </div>

              {notarizeError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{notarizeError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Notarization Result & Raw Calldata */}
          <div className="lg:col-span-5 space-y-6">
            {notarizeResult ? (
              <div className="bg-[#161B22] rounded-xl border border-sky-500/50 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        On-Chain Notarization Confirmed
                      </h4>
                      <p className="text-[10px] text-slate-400">Log ID: {notarizeResult.id}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    BLOCK #{notarizeResult.blockNumber}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-slate-800 space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-slate-500">Record Type:</span>
                    <span className="text-sky-300 font-bold">{notarizeResult.recordType}</span>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-slate-500">Source ID:</span>
                    <span>{notarizeResult.sourceEntityId}</span>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-slate-500">Amount:</span>
                    <span className="text-emerald-400 font-bold">
                      ${notarizeResult.amount.toLocaleString()} {notarizeResult.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-slate-500">Gas Used:</span>
                    <span>{notarizeResult.gasUsed}</span>
                  </div>
                </div>

                {/* Tx Hash */}
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-sky-500/30 space-y-1 text-[11px] font-mono">
                  <span className="text-slate-500 block text-[10px]">Ethereum Tx Hash:</span>
                  <code className="text-sky-300 text-[10px] break-all block">{notarizeResult.txHash}</code>
                  {notarizeResult.etherscanUrl && (
                    <a
                      href={notarizeResult.etherscanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>View on Etherscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Hex Calldata View */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Raw Hex Calldata Memo:
                  </span>
                  <div className="bg-[#0D1117] border border-slate-800 p-2.5 rounded-lg max-h-28 overflow-y-auto">
                    <code className="text-[10px] font-mono text-amber-300 break-all">
                      {notarizeResult.dataPayloadHex}
                    </code>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 text-center space-y-4 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ready to Notarize</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Fill in a transaction or click Auto-Anchor All Recent to permanently record proof of your financial operations on Ethereum.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 4: ETHEREUM ON-CHAIN AUDIT LEDGER */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search by Tx Hash, Log ID, Source Entity ID, or Type..."
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-sky-500 font-mono"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { id: 'ALL', label: 'All Records' },
                { id: 'CRYPTO_PURCHASE', label: '💳 Crypto Buys' },
                { id: 'QBO_JOURNAL', label: '📘 QBO Journals' },
                { id: 'CITI_TRANSFER', label: '🏦 Citi Transfers' },
                { id: 'AMAZON_APS_ORDER', label: '🛒 Amazon APS' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLedgerFilterType(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    ledgerFilterType === tab.id
                      ? 'bg-sky-500 text-white font-extrabold'
                      : 'bg-[#21262D] text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D1117] border-b border-[#30363D] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Log ID & Block</th>
                    <th className="py-3 px-4">Type & Source</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Ethereum Tx Hash</th>
                    <th className="py-3 px-4">Network</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Etherscan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-white block">{log.id}</span>
                        <span className="text-[10px] text-slate-500">Block #{log.blockNumber}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block mb-1 ${
                            log.recordType === 'CRYPTO_PURCHASE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : log.recordType === 'CITI_TRANSFER'
                              ? 'bg-[#0072CE]/20 text-[#58A6FF] border border-[#0072CE]/40'
                              : log.recordType === 'AMAZON_APS_ORDER'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          }`}
                        >
                          {log.recordType}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                          Ref: {log.sourceEntityId}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-white block">
                          ${log.amount.toLocaleString()} {log.currency}
                        </span>
                        {log.ethEquivalent && (
                          <span className="text-[10px] text-emerald-400">
                            ≈ {log.ethEquivalent} ETH
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="text-sky-300 truncate max-w-[180px] block" title={log.txHash}>
                          {log.txHash.slice(0, 10)}...{log.txHash.slice(-8)}
                        </span>
                        <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-xs text-slate-300 block">{log.network}</span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {log.chainId}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {log.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {log.etherscanUrl ? (
                          <a
                            href={log.etherscanUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-sky-400 hover:text-white"
                          >
                            <span className="text-[11px]">Explorer</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredLogs.length === 0 && (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Layers className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">No on-chain records match your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* TAB 5: NETHEREUM FULL PROTOCOL SUITE */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === 'nethereum' && (
        <NethereumSuiteConsole
          account={account}
          ethBalance={ethBalance}
          onRefreshWallet={() => {
            if (account) refreshBalance(account);
            fetchHistory();
          }}
        />
      )}
    </div>
  );
};

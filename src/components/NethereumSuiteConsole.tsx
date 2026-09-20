import React, { useState, useEffect } from 'react';
import {
  Globe,
  Key,
  Shield,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Send,
  Database,
  Search,
  Zap,
  Lock,
  Layers,
  Activity,
  Cpu,
  Terminal,
  ExternalLink,
  Coins,
  ArrowRight,
  FileCode,
  Sliders,
  CheckSquare
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

interface NethereumSuiteConsoleProps {
  account?: string | null;
  ethBalance?: string;
  onRefreshWallet?: () => void;
}

export const NethereumSuiteConsole: React.FC<NethereumSuiteConsoleProps> = ({
  account,
  ethBalance,
  onRefreshWallet,
}) => {
  const [subTab, setSubTab] = useState<'ens' | 'siwe' | 'erc20' | 'ibft' | 'tracer'>('ens');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ENS State
  const [ensSearchName, setEnsSearchName] = useState('sovereign.eth');
  const [ensDurationDays, setEnsDurationDays] = useState(365);
  const [ensOwnerAddress, setEnsOwnerAddress] = useState(account || '0x71C8360e34BB6f0F01344428B715C8271eD8b4e7');
  const [ensSecret, setEnsSecret] = useState('0x7f8c9b12a3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abc');
  const [ensRentResult, setEnsRentResult] = useState<any | null>(null);
  const [ensCommitResult, setEnsCommitResult] = useState<any | null>(null);
  const [ensRegisterResult, setEnsRegisterResult] = useState<any | null>(null);
  const [ensResolveResult, setEnsResolveResult] = useState<any | null>(null);
  const [ensLoading, setEnsLoading] = useState(false);
  const [ensError, setEnsError] = useState<string | null>(null);

  // ENS Text Records
  const [textKey, setTextKey] = useState('email');
  const [textValue, setTextValue] = useState('treasury@kronosapex.io');
  const [textUpdateResult, setTextUpdateResult] = useState<any | null>(null);

  // SIWE State
  const [siweChallenge, setSiweChallenge] = useState<any | null>(null);
  const [siweSignature, setSiweSignature] = useState<string>('');
  const [siweVerification, setSiweVerification] = useState<any | null>(null);
  const [siweLoading, setSiweLoading] = useState(false);
  const [siweError, setSiweError] = useState<string | null>(null);

  // ERC-20 State
  const [tokensList, setTokensList] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [transferTo, setTransferTo] = useState('0x889218F12a02b115Ec467773f324838Fbc51B122');
  const [transferAmount, setTransferAmount] = useState('500');
  const [erc20Loading, setErc20Loading] = useState(false);
  const [erc20Result, setErc20Result] = useState<any | null>(null);
  const [erc20Error, setErc20Error] = useState<string | null>(null);

  // Quorum IBFT State
  const [ibftStartBlock, setIbftStartBlock] = useState(19842000);
  const [ibftEndBlock, setIbftEndBlock] = useState(19842064);
  const [ibftStatus, setIbftStatus] = useState<any | null>(null);
  const [ibftLoading, setIbftLoading] = useState(false);

  // Parity & VM Stack Tracer State
  const [traceTxHash, setTraceTxHash] = useState('0xa8f4c2e17912a5db39cf4081efb829370146059d28e718b5294029c78103d421');
  const [vmStackData, setVmStackData] = useState<any | null>(null);
  const [parityTraceData, setParityTraceData] = useState<any | null>(null);
  const [traceLoading, setTraceLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setEnsOwnerAddress(account);
    }
  }, [account]);

  useEffect(() => {
    fetchEnsRentPrice();
    fetchEnsResolve();
    fetchTokens();
    fetchIbftStatus();
    fetchVmStack();
  }, []);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ENS Actions
  const fetchEnsRentPrice = async () => {
    setEnsLoading(true);
    setEnsError(null);
    try {
      const clean = ensSearchName.replace('.eth', '');
      const res = await apiFetch<any>(`/api/ethereum/ens/rent-price?name=${encodeURIComponent(clean)}&durationDays=${ensDurationDays}`);
      if (res.ok && res.data) {
        setEnsRentResult(res.data);
      }
    } catch (e: any) {
      setEnsError(e.message || 'Failed to fetch rent price');
    } finally {
      setEnsLoading(false);
    }
  };

  const handleEnsCommit = async () => {
    setEnsLoading(true);
    setEnsError(null);
    try {
      const clean = ensSearchName.replace('.eth', '');
      const res = await apiFetch<any>('/api/ethereum/ens/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clean,
          owner: ensOwnerAddress,
          secret: ensSecret,
        }),
      });
      if (res.ok && res.data) {
        setEnsCommitResult(res.data);
      } else {
        setEnsError(res.error || 'Failed to generate commitment');
      }
    } catch (e: any) {
      setEnsError(e.message || 'Error generating commitment');
    } finally {
      setEnsLoading(false);
    }
  };

  const handleEnsRegister = async () => {
    setEnsLoading(true);
    setEnsError(null);
    try {
      const res = await apiFetch<any>('/api/ethereum/ens/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ensSearchName,
          owner: ensOwnerAddress,
          durationDays: ensDurationDays,
          secret: ensSecret,
        }),
      });
      if (res.ok && res.data) {
        setEnsRegisterResult(res.data);
        fetchEnsResolve();
        if (onRefreshWallet) onRefreshWallet();
      } else {
        setEnsError(res.error || 'Failed to register domain');
      }
    } catch (e: any) {
      setEnsError(e.message || 'Error registering domain');
    } finally {
      setEnsLoading(false);
    }
  };

  const fetchEnsResolve = async () => {
    try {
      const res = await apiFetch<any>(`/api/ethereum/ens/resolve?name=${encodeURIComponent(ensSearchName)}`);
      if (res.ok && res.data) {
        setEnsResolveResult(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetTextRecord = async () => {
    try {
      const res = await apiFetch<any>('/api/ethereum/ens/set-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ensSearchName,
          key: textKey,
          value: textValue,
        }),
      });
      if (res.ok && res.data) {
        setTextUpdateResult(res.data);
        fetchEnsResolve();
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  // SIWE Actions
  const handleGenerateSiweChallenge = async () => {
    setSiweLoading(true);
    setSiweError(null);
    setSiweVerification(null);
    try {
      const targetAddr = account || ensOwnerAddress;
      const res = await apiFetch<any>(`/api/ethereum/siwe/challenge?address=${encodeURIComponent(targetAddr)}`);
      if (res.ok && res.data) {
        setSiweChallenge(res.data);
      }
    } catch (e: any) {
      setSiweError(e.message || 'Failed to generate SIWE challenge');
    } finally {
      setSiweLoading(false);
    }
  };

  const handleSignSiweMetaMask = async () => {
    if (!siweChallenge?.rawMessage) return;
    const ethereum = (window as any).ethereum;
    if (!ethereum || !account) {
      setSiweError('MetaMask not connected. Please connect your wallet in the Web3 tab.');
      return;
    }

    setSiweLoading(true);
    setSiweError(null);
    try {
      const sig = await ethereum.request({
        method: 'personal_sign',
        params: [siweChallenge.rawMessage, account],
      });
      setSiweSignature(sig);

      // Verify immediately
      const verifyRes = await apiFetch<any>('/api/ethereum/siwe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: siweChallenge.rawMessage,
          signature: sig,
          address: account,
        }),
      });

      if (verifyRes.ok && verifyRes.data) {
        setSiweVerification(verifyRes.data);
      } else {
        setSiweError(verifyRes.error || 'Verification failed');
      }
    } catch (e: any) {
      setSiweError(e.message || 'Signing was cancelled or failed');
    } finally {
      setSiweLoading(false);
    }
  };

  // ERC-20 Actions
  const fetchTokens = async () => {
    try {
      const targetAddr = account || ensOwnerAddress;
      const res = await apiFetch<any>(`/api/ethereum/erc20/tokens?address=${encodeURIComponent(targetAddr)}`);
      if (res.ok && res.data && res.data.tokens) {
        setTokensList(res.data.tokens);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleErc20Transfer = async () => {
    setErc20Loading(true);
    setErc20Error(null);
    setErc20Result(null);
    try {
      const res = await apiFetch<any>('/api/ethereum/erc20/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedToken,
          from: account || ensOwnerAddress,
          to: transferTo,
          amount: transferAmount,
        }),
      });

      if (res.ok && res.data) {
        setErc20Result(res.data);
        fetchTokens();
        if (onRefreshWallet) onRefreshWallet();
      } else {
        setErc20Error(res.error || 'Transfer failed');
      }
    } catch (e: any) {
      setErc20Error(e.message || 'Error executing transfer');
    } finally {
      setErc20Loading(false);
    }
  };

  // Quorum IBFT Actions
  const fetchIbftStatus = async () => {
    setIbftLoading(true);
    try {
      const res = await apiFetch<any>(`/api/ethereum/quorum/ibft-status?startBlock=${ibftStartBlock}&endBlock=${ibftEndBlock}`);
      if (res.ok && res.data) {
        setIbftStatus(res.data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIbftLoading(false);
    }
  };

  // Parity & VM Stack Tracer Actions
  const fetchVmStack = async () => {
    setTraceLoading(true);
    try {
      const res1 = await apiFetch<any>(`/api/ethereum/blockchain/vm-stack?txHash=${encodeURIComponent(traceTxHash)}`);
      if (res1.ok && res1.data) {
        setVmStackData(res1.data);
      }

      const res2 = await apiFetch<any>(`/api/ethereum/parity/trace?txHash=${encodeURIComponent(traceTxHash)}`);
      if (res2.ok && res2.data) {
        setParityTraceData(res2.data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTraceLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Protocol Selector Bar */}
      <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Nethereum Sovereign Web3 Engine
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                EIP / PROTOCOL SUITE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Complete implementation of Nethereum ENS, SIWE (EIP-4361), EIP-20 Standard Token, Quorum IBFT 2.0, and Parity VM Stack Tracer.
            </p>
          </div>
        </div>

        {/* Sub tabs */}
        <div className="flex flex-wrap gap-1.5 bg-[#0D1117] p-1.5 rounded-lg border border-slate-800">
          {[
            { id: 'ens', label: 'ENS Registrar & Resolver', icon: Globe },
            { id: 'siwe', label: 'SIWE (EIP-4361)', icon: Lock },
            { id: 'erc20', label: 'EIP-20 Token Engine', icon: Coins },
            { id: 'ibft', label: 'Quorum IBFT 2.0', icon: Activity },
            { id: 'tracer', label: 'Parity & VM Stack Tracer', icon: Terminal },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSubTab(item.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  subTab === item.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow font-black border border-cyan-400'
                    : 'text-slate-300 hover:text-white bg-slate-900/50 hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 1. Nethereum ENS Registrar & PublicResolver */}
      {/* ---------------------------------------------------------------------- */}
      {subTab === 'ens' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Rent Price & Register */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    EthTLSService & ETHRegistrarController
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  MIN 28 DAYS
                </span>
              </div>

              {/* Name & Duration Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">ENS Domain Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={ensSearchName}
                      onChange={(e) => setEnsSearchName(e.target.value)}
                      placeholder="sovereign.eth"
                      className="w-full px-3 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Duration (Days)</label>
                  <input
                    type="number"
                    min="28"
                    value={ensDurationDays}
                    onChange={(e) => setEnsDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Owner Address (Registrant)</label>
                <input
                  type="text"
                  value={ensOwnerAddress}
                  onChange={(e) => setEnsOwnerAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={fetchEnsRentPrice}
                  disabled={ensLoading}
                  className="flex-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Calculate Rent Price</span>
                </button>
                <button
                  onClick={handleEnsCommit}
                  disabled={ensLoading}
                  className="flex-1 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white rounded-lg border border-blue-400 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>1. Generate Commitment</span>
                </button>
              </div>

              {/* Rent Calculation Breakdown */}
              {ensRentResult && (
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Target Domain:</span>
                    <span className="font-mono font-bold text-cyan-300">{ensRentResult.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Duration in Seconds:</span>
                    <span className="font-mono text-slate-300">{ensRentResult.durationSeconds.toLocaleString()} s</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Estimated Rent Price:</span>
                    <div className="text-right">
                      <span className="font-mono font-black text-emerald-400">{ensRentResult.rentPriceEth} ETH</span>
                      <span className="text-[10px] text-slate-400 block font-mono">≈ ${ensRentResult.rentPriceUsd} USD</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Commitment Card */}
              {ensCommitResult && (
                <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-500/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300">Commitment Hash (Keccak-256):</span>
                    <button
                      onClick={() => copyText(ensCommitResult.commitmentHash, 'commit-hash')}
                      className="text-[10px] text-cyan-400 hover:text-white flex items-center space-x-1"
                    >
                      {copiedId === 'commit-hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <code className="text-[11px] font-mono text-indigo-200 break-all block bg-black/50 p-2 rounded">
                    {ensCommitResult.commitmentHash}
                  </code>
                  <p className="text-[11px] text-slate-300">
                    Secret: <span className="font-mono text-amber-300">{ensCommitResult.secret.slice(0, 16)}...</span>
                  </p>

                  <button
                    onClick={handleEnsRegister}
                    disabled={ensLoading}
                    className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-black text-white rounded-lg border border-emerald-400 flex items-center justify-center space-x-2 shadow cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>2. Execute Register (ETHRegistrarController)</span>
                  </button>
                </div>
              )}

              {ensRegisterResult && (
                <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Domain Registered Successfully!</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Tx Hash: <code className="font-mono text-cyan-300">{ensRegisterResult.txHash}</code>
                  </p>
                  <a
                    href={ensRegisterResult.etherscanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-cyan-400 hover:underline"
                  >
                    <span>View on Sepolia Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {ensError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{ensError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: PublicResolver Text Records & Multi-Coin Resolution */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    PublicResolver & TextDataKey Engine
                  </h4>
                </div>
                <button
                  onClick={fetchEnsResolve}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Reload Resolution"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Resolved Card */}
              {ensResolveResult && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#0D1117] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ensResolveResult.resolved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {ensResolveResult.resolved ? 'RESOLVED ON-CHAIN' : 'UNREGISTERED'}
                      </span>
                    </div>
                    <div className="text-xs flex items-center justify-between">
                      <span className="text-slate-400">Resolved Address (addr):</span>
                      <code className="text-cyan-300 font-mono text-[11px] font-bold">{ensResolveResult.addr || 'None'}</code>
                    </div>
                    <div className="text-xs flex items-center justify-between">
                      <span className="text-slate-400">Resolver Contract:</span>
                      <code className="text-slate-300 font-mono text-[11px]">{ensResolveResult.resolver || 'None'}</code>
                    </div>
                    {ensResolveResult.expiresAt && (
                      <div className="text-xs flex items-center justify-between">
                        <span className="text-slate-400">Expiry Date:</span>
                        <span className="text-slate-300 text-[11px] font-mono">
                          {new Date(ensResolveResult.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Text Records Matrix */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      Text Records (TextDataKey Extensions)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {ensResolveResult.textRecords ? (
                        Object.entries(ensResolveResult.textRecords).map(([k, val]) => (
                          <div key={k} className="p-2.5 rounded-lg bg-[#0D1117] border border-slate-800 space-y-1">
                            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">{k}</span>
                            <p className="text-[11px] text-white font-mono truncate">{String(val)}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">No text records stored.</p>
                      )}
                    </div>
                  </div>

                  {/* Update Text Record Form */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 pt-3">
                    <span className="text-xs font-bold text-white block">Update Text Record (SetTextRequestAsync)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={textKey}
                        onChange={(e) => setTextKey(e.target.value)}
                        className="px-2.5 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="email">email</option>
                        <option value="url">url</option>
                        <option value="avatar">avatar</option>
                        <option value="description">description</option>
                        <option value="notice">notice</option>
                        <option value="keywords">keywords</option>
                        <option value="vnd_twitter">vnd.twitter</option>
                        <option value="vnd_github">vnd.github</option>
                      </select>

                      <input
                        type="text"
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder="Value..."
                        className="sm:col-span-2 px-3 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <button
                      onClick={handleSetTextRecord}
                      className="w-full px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white rounded-lg border border-cyan-400 cursor-pointer"
                    >
                      Update Record on PublicResolver
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 2. Nethereum SIWE (Sign-In with Ethereum - EIP-4361) */}
      {/* ---------------------------------------------------------------------- */}
      {subTab === 'siwe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Nethereum.Siwe.Core Challenge Engine
                </h4>
              </div>

              <p className="text-xs text-slate-300">
                Generate an EIP-4361 compliant cryptographic authentication challenge message binding domain, wallet address, URI, and randomized cryptographic nonce.
              </p>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Signer Wallet Address</label>
                <input
                  type="text"
                  value={account || ensOwnerAddress}
                  disabled
                  className="w-full px-3 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-cyan-300 font-mono"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={handleGenerateSiweChallenge}
                  disabled={siweLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-black text-xs font-black rounded-lg border border-amber-400 flex items-center justify-center space-x-2 shadow cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>1. Generate EIP-4361 Message</span>
                </button>

                {account && (
                  <button
                    onClick={handleSignSiweMetaMask}
                    disabled={siweLoading || !siweChallenge}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-lg border border-emerald-400 flex items-center justify-center space-x-2 shadow cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>2. Sign with MetaMask</span>
                  </button>
                )}
              </div>

              {siweError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{siweError}</span>
                </div>
              )}

              {/* Raw Message Card */}
              {siweChallenge && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">EIP-4361 Formatted Challenge:</span>
                    <button
                      onClick={() => copyText(siweChallenge.rawMessage, 'siwe-msg')}
                      className="text-[11px] text-cyan-400 hover:text-white flex items-center space-x-1"
                    >
                      {copiedId === 'siwe-msg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-[#0D1117] border border-slate-800 rounded-lg text-[11px] font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {siweChallenge.rawMessage}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Right: Signature & Verification */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Cryptographic Session Verification
                </h4>
              </div>

              {siweSignature ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Cryptographic Signature (r, s, v):</span>
                    <code className="text-xs font-mono text-amber-300 break-all block">{siweSignature}</code>
                  </div>

                  {siweVerification && (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2.5">
                      <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Authentication Confirmed (EIP-4361)!</span>
                      </div>
                      <div className="text-xs flex items-center justify-between">
                        <span className="text-slate-400">Authenticated Address:</span>
                        <code className="text-cyan-300 font-mono text-[11px] font-bold">{siweVerification.authenticatedAddress}</code>
                      </div>
                      <div className="text-xs flex items-center justify-between">
                        <span className="text-slate-400">Session Token:</span>
                        <code className="text-emerald-300 font-mono text-[11px]">{siweVerification.sessionToken}</code>
                      </div>
                      <div className="text-xs flex items-center justify-between">
                        <span className="text-slate-400">Valid For:</span>
                        <span className="text-slate-300 font-mono">{siweVerification.expiresIn}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Lock className="w-8 h-8 mx-auto text-slate-700" />
                  <p className="text-xs">Generate challenge and sign with MetaMask to view verification token.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 3. Nethereum EIP-20 Standard Token Engine */}
      {/* ---------------------------------------------------------------------- */}
      {subTab === 'erc20' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Token Directory & Balances */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    StandardTokenEIP20 Directory
                  </h4>
                </div>
                <button
                  onClick={fetchTokens}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Reload Tokens"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {tokensList.map((tok) => (
                  <div
                    key={tok.symbol}
                    onClick={() => setSelectedToken(tok.symbol)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedToken === tok.symbol
                        ? 'bg-slate-800/80 border-cyan-400 shadow'
                        : 'bg-[#0D1117] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                          {tok.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">{tok.name}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">{tok.address}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-emerald-400">{tok.userBalance}</span>
                        <span className="text-[10px] text-slate-400 block">{tok.symbol}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Transfer Engine */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Nethereum TransferRequestAsync
                </h4>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Selected Asset</label>
                  <input
                    type="text"
                    value={selectedToken}
                    disabled
                    className="w-full px-3 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Recipient Address (to)</label>
                  <input
                    type="text"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Transfer Amount</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-emerald-400 font-mono font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleErc20Transfer}
                  disabled={erc20Loading}
                  className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-black text-white rounded-lg border border-cyan-400 flex items-center justify-center space-x-2 shadow cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Execute ERC-20 Transfer</span>
                </button>

                {erc20Result && (
                  <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{erc20Result.message}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Tx Hash: <code className="font-mono text-cyan-300">{erc20Result.txHash}</code>
                    </p>
                  </div>
                )}

                {erc20Error && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{erc20Error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 4. Nethereum Quorum IBFT 2.0 Consensus Engine */}
      {/* ---------------------------------------------------------------------- */}
      {subTab === 'ibft' && (
        <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Nethereum.Quorum.RPC.IBFT IstanbulStatus
                </h4>
                <p className="text-xs text-slate-400">Enterprise Byzantine Fault Tolerance Validator Activity Matrix</p>
              </div>
            </div>
            <button
              onClick={fetchIbftStatus}
              disabled={ibftLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${ibftLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          {ibftStatus && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#0D1117] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Consensus Engine</span>
                  <p className="text-xs font-bold text-cyan-300 font-mono mt-0.5">{ibftStatus.consensusEngine}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Scanned Blocks</span>
                  <p className="text-xs font-bold text-white font-mono mt-0.5">{ibftStatus.numBlocks} Blocks</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Active Validators</span>
                  <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{ibftStatus.activeValidatorsCount} Nodes</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Health Status</span>
                  <p className="text-xs font-bold text-emerald-300 font-mono mt-0.5">{ibftStatus.healthStatus}</p>
                </div>
              </div>

              {/* Validator Sealer Activity Table */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider">Validator Sealer Distribution</label>
                <div className="space-y-2">
                  {Object.entries(ibftStatus.sealerActivity).map(([val, count]: any) => (
                    <div key={val} className="p-3 rounded-lg bg-[#0D1117] border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <code className="text-xs font-mono text-cyan-300">{val}</code>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono font-bold text-white">{count} Blocks Sealed</span>
                        <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${(count / ibftStatus.numBlocks) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 5. Parity & Blockchain Processing EVM VM Stack Tracer */}
      {/* ---------------------------------------------------------------------- */}
      {subTab === 'tracer' && (
        <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Nethereum.BlockchainProcessing & Parity Trace Engine
                </h4>
                <p className="text-xs text-slate-400">TransactionVmStack structLogs step execution & Opcode analysis</p>
              </div>
            </div>

            <button
              onClick={fetchVmStack}
              disabled={traceLoading}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${traceLoading ? 'animate-spin' : ''}`} />
              <span>Trace Transaction</span>
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Transaction Hash to Dissect</label>
            <input
              type="text"
              value={traceTxHash}
              onChange={(e) => setTraceTxHash(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-slate-700 rounded-lg text-xs text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {vmStackData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#0D1117] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Gas Used</span>
                  <p className="text-xs font-bold text-amber-400 font-mono mt-0.5">{vmStackData.gasUsed}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Gas Limit</span>
                  <p className="text-xs font-bold text-white font-mono mt-0.5">{vmStackData.gasLimit}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Base Fee Per Gas</span>
                  <p className="text-xs font-bold text-cyan-300 font-mono mt-0.5">{vmStackData.baseFeePerGas}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Block Miner</span>
                  <p className="text-xs font-bold text-slate-300 font-mono mt-0.5 truncate">{vmStackData.miner}</p>
                </div>
              </div>

              {/* StructLogs Table */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  EVM Execution Trace Steps (structLogs)
                </label>
                <div className="overflow-x-auto border border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#0D1117] text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="px-3 py-2">PC</th>
                        <th className="px-3 py-2">Opcode</th>
                        <th className="px-3 py-2">Gas Remaining</th>
                        <th className="px-3 py-2">Gas Cost</th>
                        <th className="px-3 py-2">Depth</th>
                        <th className="px-3 py-2">Stack Top</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                      {vmStackData.structLogs.map((log: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="px-3 py-1.5 text-cyan-400 font-bold">{log.pc}</td>
                          <td className="px-3 py-1.5 text-emerald-400 font-bold">{log.op}</td>
                          <td className="px-3 py-1.5 text-slate-300">{log.gas.toLocaleString()}</td>
                          <td className="px-3 py-1.5 text-amber-400">{log.gasCost}</td>
                          <td className="px-3 py-1.5 text-slate-400">{log.depth}</td>
                          <td className="px-3 py-1.5 text-indigo-300">
                            {log.stack && log.stack.length > 0 ? log.stack.join(', ') : '[]'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

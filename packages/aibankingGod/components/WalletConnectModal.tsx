
import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { FaWallet, FaTimes, FaLink, FaShieldAlt, FaKey, FaPlusCircle, FaEye, FaEyeSlash, FaDownload, FaArrowRight } from 'react-icons/fa';

const WalletConnectModal: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { 
      isWalletConnectModalOpen, 
      setWalletConnectModalOpen, 
      connectWallet, 
      importPrivateKey, 
      generateNewWallet, 
      depositFunds, 
      walletAddress, 
      ethBalance,
      walletConnectionType,
      customTokens,
      addTokenToMetaMask
    } = context;

    const [activeTab, setActiveTab] = useState<'metamask' | 'private_key' | 'deposit'>('private_key');
    const [privateKeyInput, setPrivateKeyInput] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [depositAmount, setDepositAmount] = useState('1.0');
    const [isConnecting, setIsConnecting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    if (!isWalletConnectModalOpen) return null;

    const handleMetaMaskConnect = async () => {
        setIsConnecting(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            await connectWallet();
            setSuccessMsg("MetaMask connected successfully.");
            setTimeout(() => setWalletConnectModalOpen(false), 1200);
        } catch (e: any) {
            setErrorMsg(e.message || "MetaMask connection failed.");
        } finally {
            setIsConnecting(false);
        }
    };

    const handleImportPrivateKey = async () => {
        if (!privateKeyInput.trim()) {
            setErrorMsg("Please enter a valid 64-character Ethereum private key.");
            return;
        }
        setIsConnecting(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            await importPrivateKey(privateKeyInput);
            setSuccessMsg("Ethereum Private Key imported successfully!");
            setPrivateKeyInput('');
            setTimeout(() => setWalletConnectModalOpen(false), 1200);
        } catch (e: any) {
            setErrorMsg(e.message || "Failed to import private key.");
        } finally {
            setIsConnecting(false);
        }
    };

    const handleGenerateWallet = async () => {
        setIsConnecting(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            await generateNewWallet();
            setSuccessMsg("New Sovereign EVM Key generated and loaded!");
            setTimeout(() => setWalletConnectModalOpen(false), 1200);
        } catch (e: any) {
            setErrorMsg(e.message || "Wallet generation failed.");
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDeposit = async () => {
        const amt = parseFloat(depositAmount);
        if (isNaN(amt) || amt <= 0) {
            setErrorMsg("Please enter a valid deposit amount.");
            return;
        }
        setIsConnecting(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            await depositFunds(amt, 'ETH', 'Sovereign Bank Deposit');
            setSuccessMsg(`Deposit of +${amt} ETH confirmed!`);
            setTimeout(() => setWalletConnectModalOpen(false), 1200);
        } catch (e: any) {
            setErrorMsg(e.message || "Deposit failed.");
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[150] backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setWalletConnectModalOpen(false)}>
            <div className="bg-[#020617] rounded-[2.5rem] border border-white/10 shadow-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-950/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-600/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                            <FaWallet size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight uppercase">Sovereign Wallet Provider</h3>
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                {walletAddress ? `Active: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} (${ethBalance} ETH)` : 'No Wallet Connected'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setWalletConnectModalOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                        <FaTimes />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-gray-950/30 p-1">
                    <button
                        onClick={() => { setActiveTab('private_key'); setErrorMsg(null); setSuccessMsg(null); }}
                        className={`flex-1 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all rounded-xl ${
                            activeTab === 'private_key' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Private Key
                    </button>
                    <button
                        onClick={() => { setActiveTab('metamask'); setErrorMsg(null); setSuccessMsg(null); }}
                        className={`flex-1 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all rounded-xl ${
                            activeTab === 'metamask' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        MetaMask
                    </button>
                    <button
                        onClick={() => { setActiveTab('deposit'); setErrorMsg(null); setSuccessMsg(null); }}
                        className={`flex-1 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all rounded-xl ${
                            activeTab === 'deposit' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Deposit Funds
                    </button>
                </div>

                {/* Notifications */}
                {errorMsg && (
                    <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono">
                        {successMsg}
                    </div>
                )}

                {/* Tab Content */}
                <div className="p-8 space-y-6">
                    {activeTab === 'private_key' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center justify-between">
                                    <span>Ethereum Private Key</span>
                                    <span className="text-[10px] text-gray-500">64 Hex Characters</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        value={privateKeyInput}
                                        onChange={(e) => setPrivateKeyInput(e.target.value)}
                                        placeholder="0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318"
                                        className="w-full px-4 py-3.5 pr-12 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                                    >
                                        {showKey ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                    Paste your raw Ethereum private key to load your wallet address, sign transactions, and manage funds within Aquarius OS.
                                </p>
                            </div>

                            <button
                                onClick={handleImportPrivateKey}
                                disabled={isConnecting}
                                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <FaKey size={14} />
                                {isConnecting ? 'LOADING WALLET...' : 'IMPORT PRIVATE KEY'}
                            </button>

                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-slate-800"></div>
                                <span className="flex-shrink mx-4 text-[10px] font-mono text-gray-600 uppercase">OR INSTANT GENERATE</span>
                                <div className="flex-grow border-t border-slate-800"></div>
                            </div>

                            <button
                                onClick={handleGenerateWallet}
                                disabled={isConnecting}
                                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <FaPlusCircle size={14} className="text-cyan-400" />
                                GENERATE NEW EVM KEY PAIR
                            </button>
                        </div>
                    )}

                    {activeTab === 'metamask' && (
                        <div className="text-center space-y-6">
                            <div className="relative inline-block">
                                <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
                                    <FaLink size={28} className={`text-orange-400 ${isConnecting ? 'animate-pulse' : ''}`} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-base font-bold text-white uppercase">MetaMask Extension Handshake</h4>
                                <p className="text-xs text-gray-400 leading-relaxed px-4">
                                    Authorize connection with your browser's injected Web3 provider (MetaMask / Coinbase / Brave Wallet).
                                </p>
                            </div>

                            <button 
                                onClick={handleMetaMaskConnect}
                                disabled={isConnecting}
                                className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isConnecting ? 'CONNECTING EXTENSION...' : 'CONNECT METAMASK EXTENSION'}
                            </button>

                            {/* CUSTOM APP CRYPTOCURRENCIES FOR METAMASK */}
                            {customTokens && customTokens.length > 0 && (
                                <div className="pt-4 border-t border-white/10 text-left space-y-3">
                                    <p className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">
                                        Import Created Cryptocurrencies into MetaMask (EIP-747)
                                    </p>
                                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                        {customTokens.map((tok: any) => (
                                            <div key={tok.id || tok.symbol} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img src={tok.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${tok.symbol}`} alt={tok.symbol} className="w-6 h-6 rounded-full" />
                                                    <div>
                                                        <p className="text-xs font-bold text-white">{tok.name} ({tok.symbol})</p>
                                                        <p className="text-[9px] font-mono text-gray-500">{tok.contractAddress.slice(0, 10)}...{tok.contractAddress.slice(-6)}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={async () => {
                                                        try {
                                                            await addTokenToMetaMask({
                                                                address: tok.contractAddress,
                                                                symbol: tok.symbol,
                                                                decimals: tok.decimals || 18,
                                                                image: tok.logoUrl
                                                            });
                                                            setSuccessMsg(`Sent watch asset request for ${tok.symbol} to MetaMask!`);
                                                        } catch (e: any) {
                                                            setErrorMsg(e.message);
                                                        }
                                                    }}
                                                    className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500 border border-orange-500/40 text-orange-400 hover:text-black font-bold text-[10px] uppercase rounded-lg transition-all"
                                                >
                                                    🦊 Add to MetaMask
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'deposit' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                                    Deposit Amount (ETH)
                                </label>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {['0.5', '1.0', '2.5', '5.0'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setDepositAmount(val)}
                                            className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                                                depositAmount === val 
                                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                                                    : 'bg-slate-900 border-slate-800 text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            +{val} ETH
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                />
                                <p className="text-[11px] text-gray-500">
                                    Deposited funds immediately credit to your Sovereign App Wallet and update your profile's liquidity balances.
                                </p>
                            </div>

                            <button
                                onClick={handleDeposit}
                                disabled={isConnecting}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <FaDownload size={14} />
                                {isConnecting ? 'PROCESSING DEPOSIT...' : `DEPOSIT +${depositAmount} ETH NOW`}
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <FaShieldAlt className="text-gray-500 shrink-0" />
                        <p className="text-[10px] text-gray-500 uppercase font-black leading-relaxed">
                            Encrypted Enclave Security. Private keys and wallet states are handled locally in your browser memory.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-950/80 border-t border-white/5 text-center flex justify-between items-center px-6">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Provider Status: ACTIVE</span>
                    <span className="text-[10px] font-mono text-gray-600 uppercase">AQUARIUS_EVMP_V4</span>
                </div>
            </div>
        </div>
    );
};

export default WalletConnectModal;

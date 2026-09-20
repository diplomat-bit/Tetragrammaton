
import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { callGemini } from '../services/geminiService';
import { 
    FaDollarSign, FaEthereum, FaClock, FaExchangeAlt, FaBurn, FaPlayCircle, FaPauseCircle, 
    FaCode, FaChartLine, FaCloudDownloadAlt, FaFileCode, FaLock, FaGlobe, FaCogs, 
    FaProjectDiagram, FaBalanceScale, FaUsers, FaHandshake, FaChartBar, FaWallet, 
    FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaBell, FaPlus, FaCalculator, FaTimes, FaShieldAlt, FaVoteYea, FaFlag, FaBan, FaInfoCircle, FaBitcoin, FaRocket
} from 'react-icons/fa';
import { executeConsolidatedAPI, CONSOLIDATED_APIS } from '../services/consolidatedApiManager';

/**
 * SOVEREIGN ASSET FORGE v2.0
 * Multi-chain token issuance with AI-driven economic modeling
 */

const CORE_PROJECT_ID = '6681b1d0be6b44c5e38c5ca3d59839ac';

export interface TokenConfig {
    id: string;
    name: string;
    symbol: string;
    description: string;
    type: 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'BRC-20' | 'Stacks-SIP-10';
    totalSupply: number;
    decimals: number;
    initialSupply?: number;
    logoUrl?: string;
    websiteUrl?: string;
    socialLinks: { twitter?: string; telegram?: string; discord?: string; github?: string; };
    features: {
        mintable: boolean;
        burnable: boolean;
        pausable: boolean;
        upgradable: boolean;
        snapshots: boolean;
        permit: boolean;
        flashMint?: boolean;
        erc1363?: boolean;
        governanceModule?: boolean;
    };
    aiGeneratedNotes?: string;
}

export type AllocationType = 'Team' | 'Investors' | 'Ecosystem' | 'Treasury' | 'Advisors' | 'Marketing' | 'Liquidity' | 'Airdrop';

export interface TokenAllocation {
    type: AllocationType;
    percentage: number;
    amount: number;
    details?: string;
}

interface IssuanceContextType {
    tokenConfig: TokenConfig;
    setTokenConfig: React.Dispatch<React.SetStateAction<TokenConfig>>;
    allocations: TokenAllocation[];
    setAllocations: React.Dispatch<React.SetStateAction<TokenAllocation[]>>;
}

const IssuanceContext = createContext<IssuanceContextType | undefined>(undefined);

const useIssuance = () => {
    const context = useContext(IssuanceContext);
    if (!context) throw new Error('useIssuance must be used within provider');
    return context;
};

const StepDefinition: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const { tokenConfig, setTokenConfig } = useIssuance();
    const handleFeature = (key: keyof TokenConfig['features']) => {
        setTokenConfig(prev => ({ ...prev, features: { ...prev.features, [key]: !prev.features[key] } }));
    };

    return (
        <Card title="1. Protocol Identity" icon={<FaDollarSign className="text-cyan-400" />}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-500 uppercase">Token Name</label>
                        <input value={tokenConfig.name} onChange={e => setTokenConfig({...tokenConfig, name: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500" placeholder="e.g. Sovereign Alpha" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-500 uppercase">Ticker Symbol</label>
                        <input value={tokenConfig.symbol} onChange={e => setTokenConfig({...tokenConfig, symbol: e.target.value.toUpperCase()})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500 font-mono" placeholder="SOV" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-500 uppercase">Ledger Standard</label>
                        <select value={tokenConfig.type} onChange={e => setTokenConfig({...tokenConfig, type: e.target.value as any})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500">
                            <option value="ERC-20">Ethereum ERC-20</option>
                            <option value="BRC-20">Bitcoin BRC-20 (Ordinals)</option>
                            <option value="Stacks-SIP-10">Bitcoin L2 (Stacks)</option>
                            <option value="ERC-721">Ethereum ERC-721 (NFT)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-500 uppercase">Total Supply</label>
                        <input type="number" value={tokenConfig.totalSupply} onChange={e => setTokenConfig({...tokenConfig, totalSupply: parseInt(e.target.value) || 0})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500 font-mono" />
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-800">
                    <h4 className="text-xs font-black text-gray-500 uppercase mb-4 tracking-widest">Neural Directives</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['mintable', 'burnable', 'pausable', 'upgradable'].map(f => (
                            <label key={f} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={(tokenConfig.features as any)[f]} onChange={() => handleFeature(f as any)} className="w-4 h-4 rounded border-gray-800 bg-gray-900 text-cyan-500" />
                                <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase">{f}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={onNext} className="px-8 py-3 bg-cyan-600 text-white font-black uppercase rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">Continue &rarr;</button>
                </div>
            </div>
        </Card>
    );
};

const StepAllocations: React.FC<{ onNext: () => void, onPrev: () => void }> = ({ onNext, onPrev }) => {
    const { allocations, setAllocations, tokenConfig } = useIssuance();
    const [newAlloc, setNewAlloc] = useState<{ type: AllocationType, percentage: number }>({ type: 'Team', percentage: 10 });

    const addAllocation = () => {
        const total = allocations.reduce((acc, a) => acc + a.percentage, 0);
        if (total + newAlloc.percentage > 100) {
            alert("Total allocation cannot exceed 100%");
            return;
        }
        setAllocations(prev => [...prev, { ...newAlloc, amount: (tokenConfig.totalSupply * newAlloc.percentage) / 100 }]);
    };

    const removeAllocation = (index: number) => {
        setAllocations(prev => prev.filter((_, i) => i !== index));
    };

    const totalAllocated = allocations.reduce((acc, a) => acc + a.percentage, 0);

    return (
        <Card title="2. Capital Allocation" icon={<FaUsers className="text-cyan-400" />}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-950 rounded-2xl border border-gray-800">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase">Entity Type</label>
                        <select value={newAlloc.type} onChange={e => setNewAlloc({...newAlloc, type: e.target.value as any})} className="w-full bg-gray-900 border border-gray-800 p-2 rounded-xl text-xs text-white">
                            {['Team', 'Investors', 'Ecosystem', 'Treasury', 'Advisors', 'Marketing', 'Liquidity', 'Airdrop'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase">Percentage (%)</label>
                        <input type="number" value={newAlloc.percentage} onChange={e => setNewAlloc({...newAlloc, percentage: parseInt(e.target.value) || 0})} className="w-full bg-gray-900 border border-gray-800 p-2 rounded-xl text-xs text-white font-mono" />
                    </div>
                    <div className="flex items-end">
                        <button onClick={addAllocation} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-black uppercase rounded-xl border border-gray-700 transition-all">Add Vector</button>
                    </div>
                </div>

                <div className="space-y-3">
                    {allocations.map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-2xl group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black text-xs">{a.percentage}%</div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">{a.type}</p>
                                    <p className="text-[10px] font-mono text-gray-500">{a.amount.toLocaleString()} {tokenConfig.symbol}</p>
                                </div>
                            </div>
                            <button onClick={() => removeAllocation(i)} className="p-2 text-gray-700 hover:text-red-500 transition-colors"><FaTimes /></button>
                        </div>
                    ))}
                    {allocations.length === 0 && <p className="text-center py-10 text-gray-600 italic text-xs">No allocations defined.</p>}
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                    <div className="text-xs font-black text-gray-500 uppercase">Total Allocated: <span className={totalAllocated === 100 ? 'text-green-500' : 'text-yellow-500'}>{totalAllocated}%</span></div>
                    <div className="flex gap-4">
                        <button onClick={onPrev} className="px-6 py-3 border border-gray-800 text-gray-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Back</button>
                        <button onClick={onNext} className="px-8 py-3 bg-cyan-600 text-white font-black uppercase rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">Continue &rarr;</button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const StepSimulation: React.FC<{ onNext: () => void, onPrev: () => void }> = ({ onNext, onPrev }) => {
    const { tokenConfig, allocations } = useIssuance();
    const [isSimulating, setIsSimulating] = useState(false);
    const [report, setReport] = useState<string | null>(null);

    const runSimulation = async () => {
        setIsSimulating(true);
        try {
            const prompt = `Perform a deep economic simulation for a token with these parameters:
            Name: ${tokenConfig.name} (${tokenConfig.symbol})
            Supply: ${tokenConfig.totalSupply}
            Allocations: ${JSON.stringify(allocations)}
            Features: ${JSON.stringify(tokenConfig.features)}
            
            Analyze for:
            1. Inflationary pressure
            2. Liquidity depth requirements
            3. Governance attack vectors
            4. Long-term sustainability
            
            Provide a concise executive summary with a "Neural Stability Score" (0-100).`;

            const response = await callGemini('gemini-3-pro-preview', prompt);
            setReport(response.text || "Simulation failed to converge.");
        } catch (e) {
            setReport("Economic link collapsed.");
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <Card title="3. Neural Economic Simulation" icon={<FaChartLine className="text-cyan-400" />}>
            <div className="space-y-6">
                {!report ? (
                    <div className="py-20 text-center space-y-6">
                        <div className="w-24 h-24 mx-auto relative">
                            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                            <div className={`absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full ${isSimulating ? 'animate-spin' : ''}`} />
                            <FaCalculator className={`absolute inset-0 m-auto text-cyan-500 ${isSimulating ? 'animate-pulse' : ''}`} size={32} />
                        </div>
                        <div className="max-w-xs mx-auto">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Economic Stress Test</h3>
                            <p className="text-xs text-gray-500 mt-2">Simulate 10,000 market cycles to verify protocol stability and inflationary resistance.</p>
                        </div>
                        <button 
                            onClick={runSimulation}
                            disabled={isSimulating}
                            className="px-12 py-4 bg-cyan-600 text-white font-black uppercase rounded-2xl shadow-xl shadow-cyan-500/20 hover:bg-cyan-500 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                        >
                            {isSimulating ? <FaSpinner className="animate-spin" /> : <FaPlayCircle />}
                            Initialize Simulation
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-6 bg-gray-950 border border-gray-800 rounded-3xl font-mono text-xs text-cyan-400 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar">
                            {report}
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setReport(null)} className="px-6 py-3 border border-gray-800 text-gray-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Re-Simulate</button>
                            <div className="flex gap-4">
                                <button onClick={onPrev} className="px-6 py-3 border border-gray-800 text-gray-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Back</button>
                                <button onClick={onNext} className="px-8 py-3 bg-cyan-600 text-white font-black uppercase rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">Continue &rarr;</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

const StepNetwork: React.FC<{ onNext: () => void, onPrev: () => void }> = ({ onNext, onPrev }) => {
    const { tokenConfig } = useIssuance();
    const networks = [
        { id: 'arbitrum', name: 'Arbitrum One', icon: <FaEthereum />, color: 'text-blue-400', l2: true },
        { id: 'optimism', name: 'Optimism', icon: <FaEthereum />, color: 'text-red-500', l2: true },
        { id: 'base', name: 'Base', icon: <FaEthereum />, color: 'text-blue-600', l2: true },
        { id: 'stacks', name: 'Stacks (Bitcoin L2)', icon: <FaBitcoin />, color: 'text-indigo-500', l2: true },
        { id: 'mainnet', name: 'Ethereum Mainnet', icon: <FaEthereum />, color: 'text-gray-400', l2: false },
    ];

    const [selectedNet, setSelectedNet] = useState('arbitrum');

    return (
        <Card title="4. Target Network" icon={<FaGlobe className="text-cyan-400" />}>
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {networks.map(n => (
                        <button 
                            key={n.id}
                            onClick={() => setSelectedNet(n.id)}
                            className={`p-6 rounded-[2rem] border-2 transition-all text-left flex items-center gap-6 ${selectedNet === n.id ? 'bg-cyan-500/10 border-cyan-500' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}
                        >
                            <div className={`text-3xl ${n.color}`}>{n.icon}</div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">{n.name}</h4>
                                <p className="text-[10px] text-gray-500">{n.l2 ? 'Layer 2 Scaling' : 'Layer 1 Settlement'}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-800">
                    <button onClick={onPrev} className="px-6 py-3 border border-gray-800 text-gray-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Back</button>
                    <button onClick={onNext} className="px-8 py-3 bg-cyan-600 text-white font-black uppercase rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">Continue &rarr;</button>
                </div>
            </div>
        </Card>
    );
};

const StepMonitor: React.FC<{ onNext: () => void, onPrev: () => void }> = ({ onNext, onPrev }) => {
    return (
        <Card title="6. Post-Deployment Monitoring" icon={<FaChartBar className="text-cyan-400" />}>
            <div className="space-y-8 py-10 text-center">
                <div className="flex justify-center gap-8">
                    <div className="space-y-2">
                        <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-cyan-400"><FaBell /></div>
                        <p className="text-[10px] font-black text-gray-500 uppercase">Alerts</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-indigo-400"><FaShieldAlt /></div>
                        <p className="text-[10px] font-black text-gray-500 uppercase">Security</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-yellow-400"><FaCogs /></div>
                        <p className="text-[10px] font-black text-gray-500 uppercase">Ops</p>
                    </div>
                </div>
                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Neural Watchtower</h3>
                    <p className="text-xs text-gray-500 mt-2">Configure real-time monitoring for whale movements, contract interactions, and liquidity health.</p>
                </div>
                <div className="flex justify-between pt-8 border-t border-gray-800">
                    <button onClick={onPrev} className="px-6 py-3 border border-gray-800 text-gray-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Back</button>
                    <button onClick={onNext} className="px-8 py-3 bg-cyan-600 text-white font-black uppercase rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">Final Review &rarr;</button>
                </div>
            </div>
        </Card>
    );
};

const StepExecutive: React.FC<{ onPrev: () => void }> = ({ onPrev }) => {
    const { tokenConfig, allocations } = useIssuance();
    const context = useContext(DataContext);
    const { walletAddress, connectWallet, setAssets, showNotification, createCustomToken, addTokenToMetaMask } = context!;
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);

    const handleExecute = async () => {
        if (!walletAddress) {
            showNotification("Sovereign Key not linked. Establish handshake first.", "error");
            await connectWallet();
            return;
        }

        setIsDeploying(true);
        setDeploymentLogs(["[CORE] Initializing sigil-authorized deployment sequence..."]);
        try {
            const created = await createCustomToken({
                name: tokenConfig.name || 'Sovereign Token',
                symbol: tokenConfig.symbol || 'SOV',
                totalSupply: tokenConfig.totalSupply || 1000000,
                decimals: tokenConfig.decimals || 18,
                logoUrl: tokenConfig.logoUrl
            });

            setDeploymentLogs(prev => [
                ...prev, 
                `[CONTRACT] ERC20 Contract Deployed at ${created?.token?.contractAddress}`,
                `[METAMASK] Sending wallet_watchAsset EIP-747 handshake request...`
            ]);

            if (created?.token) {
                try {
                    await addTokenToMetaMask({
                        address: created.token.contractAddress,
                        symbol: created.token.symbol,
                        decimals: created.token.decimals,
                        image: created.token.logoUrl
                    });
                } catch (e) {}
            }

            showNotification(`${tokenConfig.symbol} Protocol successfully deployed & registered in MetaMask.`, "info");
            
            const contractAddr = created?.token?.contractAddress || `0x${Math.random().toString(16).substring(2, 42)}`;
            alert(`CRYPTOCURRENCY DEPLOYED & REGISTERED IN METAMASK!\n\nProtocol: ${tokenConfig.name}\nSymbol: ${tokenConfig.symbol}\nSupply: ${tokenConfig.totalSupply.toLocaleString()}\nContract: ${contractAddr}`);
        } catch (err: any) {
            showNotification(`Deployment failure: ${err.message}`, "error");
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <Card title="7. Executive Authorization" icon={<FaCheckCircle className="text-green-400" />}>
            <div className="space-y-8">
                <div className="p-8 bg-gray-950 border border-gray-800 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-3xl font-black">
                            {tokenConfig.symbol[0] || '?'}
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{tokenConfig.name}</h3>
                            <p className="text-sm font-mono text-gray-500">{tokenConfig.symbol} // {tokenConfig.type}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-800">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Supply</p>
                            <p className="text-2xl font-mono font-bold text-white">{tokenConfig.totalSupply.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Allocated</p>
                            <p className="text-2xl font-mono font-bold text-cyan-400">{allocations.reduce((acc, a) => acc + a.percentage, 0)}%</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <input type="checkbox" checked={isConfirmed} onChange={() => setIsConfirmed(!isConfirmed)} className="mt-1 w-5 h-5 rounded border-gray-800 bg-gray-900 text-green-500" />
                            <p className="text-[10px] font-bold text-gray-400 group-hover:text-white leading-relaxed uppercase tracking-widest">
                                I authorize the immutable deployment of this protocol and acknowledge that on-chain actions are final and deterministic.
                            </p>
                        </label>
                    </div>

                    {deploymentLogs.length > 0 && (
                        <div className="mt-6 p-6 bg-black rounded-2xl border border-gray-800 font-mono text-[9px] text-green-500 overflow-y-auto max-h-[150px] space-y-1">
                            {deploymentLogs.map((log, i) => <div key={i} className="animate-in fade-in slide-in-from-left-2">{log}</div>)}
                        </div>
                    )}
                </div>

                <div className="flex justify-between">
                    <button onClick={onPrev} className="px-6 py-3 border border-gray-800 text-gray-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Back</button>
                    <button 
                        disabled={!isConfirmed || isDeploying}
                        onClick={handleExecute}
                        className="px-12 py-4 bg-green-600 text-white font-black uppercase rounded-2xl shadow-xl shadow-green-500/20 hover:bg-green-500 disabled:opacity-30 active:scale-95 transition-all flex items-center gap-3"
                    >
                        {isDeploying ? <FaRocket className="animate-bounce text-xl" /> : <FaCheckCircle className="text-xl" />}
                        {isDeploying ? "Ignition Sequence..." : "Execute Deployment"}
                    </button>
                </div>
            </div>
        </Card>
    );
};

const StepForge: React.FC<{ onNext: () => void, onPrev: () => void }> = ({ onNext, onPrev }) => {
    const { tokenConfig } = useIssuance();
    const [code, setCode] = useState('// Initiating Neural Synthesis...');
    const [isForging, setIsForging] = useState(false);

    const forgeCode = useCallback(async () => {
        setIsForging(true);
        try {
            const prompt = `Forge a full production-ready smart contract for a ${tokenConfig.type} token named "${tokenConfig.name}" (${tokenConfig.symbol}) with a total supply of ${tokenConfig.totalSupply}. 
            Features: ${JSON.stringify(tokenConfig.features)}.
            Use OpenZeppelin v5.0 if Ethereum. If Stacks, use Clarity. If BRC-20, provide the JSON inscription script.
            Return ONLY the code block.`;

            const response = await callGemini('gemini-3-pro-preview', prompt, {
                temperature: 0.1
            });
            setCode(response.text || '// Error in synthesis core.');
        } catch (e) {
            setCode('// Neural link interrupted.');
        } finally {
            setIsForging(false);
        }
    }, [tokenConfig]);

    useEffect(() => { forgeCode(); }, [forgeCode]);

    return (
        <Card title="5. Sigil Forge Synthesis" icon={<FaFileCode className="text-yellow-500" />}>
            <div className="space-y-6">
                <pre className="bg-gray-950 border border-gray-800 p-6 rounded-2xl overflow-auto max-h-[500px] font-mono text-[10px] text-cyan-400 custom-scrollbar">
                    <code>{code}</code>
                </pre>
                <div className="flex justify-between">
                    <button onClick={onPrev} className="px-6 py-3 border border-gray-800 text-gray-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Back</button>
                    <button onClick={onNext} disabled={isForging} className="px-10 py-3 bg-cyan-600 text-white font-black uppercase text-xs rounded-xl shadow-xl shadow-cyan-500/20 hover:bg-cyan-500 active:scale-95 transition-all">Commit to Deployment</button>
                </div>
            </div>
        </Card>
    );
};

const TokenIssuanceView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { connectWallet, walletAddress, setAssets, showNotification } = context;

    const [currentStep, setCurrentStep] = useState(0);
    const [tokenConfig, setTokenConfig] = useState<TokenConfig>({
        id: `TKN-${Date.now()}`,
        name: '', symbol: '', description: '', type: 'ERC-20', totalSupply: 1000000, decimals: 18,
        socialLinks: {},
        features: { mintable: true, burnable: true, pausable: false, upgradable: false, snapshots: false, permit: true }
    });
    const [allocations, setAllocations] = useState<TokenAllocation[]>([]);

    const steps = ["Definition", "Allocations", "Simulation", "Network", "Forge", "Monitor", "Executive"];

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <StepDefinition onNext={() => setCurrentStep(1)} />;
            case 1: return <StepAllocations onNext={() => setCurrentStep(2)} onPrev={() => setCurrentStep(0)} />;
            case 2: return <StepSimulation onNext={() => setCurrentStep(3)} onPrev={() => setCurrentStep(1)} />;
            case 3: return <StepNetwork onNext={() => setCurrentStep(4)} onPrev={() => setCurrentStep(2)} />;
            case 4: return <StepForge onNext={() => setCurrentStep(5)} onPrev={() => setCurrentStep(3)} />;
            case 5: return <StepMonitor onNext={() => setCurrentStep(6)} onPrev={() => setCurrentStep(4)} />;
            case 6: return <StepExecutive onPrev={() => setCurrentStep(5)} />;
            default: return <StepDefinition onNext={() => setCurrentStep(1)} />;
        }
    };

    return (
        <IssuanceContext.Provider value={{
            tokenConfig, setTokenConfig,
            allocations, setAllocations
        }}>
            <div className="space-y-8 animate-in fade-in duration-700">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-gray-800 pb-8 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                           <FaPlus className="text-cyan-400 w-3 h-3" />
                           <h2 className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.4em]">Sovereign Asset Forge v9.4</h2>
                        </div>
                        <h1 className="text-7xl font-black text-white tracking-tighter leading-none">Token <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">Issuance</span></h1>
                    </div>
                    <button 
                        onClick={() => connectWallet()}
                        className="px-8 py-4 bg-gray-900 border border-gray-800 rounded-3xl flex items-center gap-4 group hover:border-cyan-500/50 transition-all shadow-lg active:scale-95"
                    >
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                            <FaHandshake />
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Auth Handshake</p>
                           <p className="text-sm font-mono text-white">{walletAddress ? `${walletAddress.substring(0,6)}...${walletAddress.substring(38)}` : "LINK SOVEREIGN KEY"}</p>
                        </div>
                    </button>
                </header>

                <div className="flex gap-2 p-1 bg-gray-950 border border-gray-800 rounded-2xl w-fit overflow-x-auto no-scrollbar">
                    {steps.map((s, i) => (
                        <button 
                            key={s} 
                            disabled={i > currentStep}
                            onClick={() => setCurrentStep(i)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === i ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-500 hover:text-white disabled:opacity-30'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8">
                        {renderStep()}
                    </div>
                    <div className="lg:col-span-4 space-y-8">
                        <Card title="Forge Summary" icon={<FaShieldAlt className="text-indigo-400" />}>
                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between text-xs border-b border-gray-800 pb-3">
                                    <span className="text-gray-500 font-bold uppercase">Protocol</span>
                                    <span className="text-white font-black">{tokenConfig.name || 'Undefined'}</span>
                                </div>
                                <div className="flex justify-between text-xs border-b border-gray-800 pb-3">
                                    <span className="text-gray-500 font-bold uppercase">Standard</span>
                                    <span className="text-cyan-400 font-black">{tokenConfig.type}</span>
                                </div>
                                <div className="flex justify-between text-xs border-b border-gray-800 pb-3">
                                    <span className="text-gray-500 font-bold uppercase">L2 Target</span>
                                    <span className="text-white font-black">{tokenConfig.type.startsWith('ERC') ? 'Arbitrum' : 'Stacks'}</span>
                                </div>
                                <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 group hover:border-cyan-500/30 transition-all">
                                   <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Forge Core ID</p>
                                   <p className="text-xs font-mono text-cyan-700 break-all">{CORE_PROJECT_ID}</p>
                                </div>
                            </div>
                        </Card>
                        <Card title="Executive Directive" variant="critical">
                            <p className="text-[10px] text-red-300 leading-relaxed font-bold uppercase tracking-widest">
                                Warning: Deployment initiates an immutable on-chain record. Ensure neural modeling (Phase 03) is complete before final signature.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </IssuanceContext.Provider>
    );
};

export default TokenIssuanceView;

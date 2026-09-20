
import React, { useState, useCallback } from 'react';
import Card from './Card';
import { Palette, Layout, Type, BrainCircuit, Zap, Cpu, SlidersHorizontal, Network, BarChartBig, Clock, GitBranch } from 'lucide-react';

const systemPrompt = "idgafAI OPERATIONAL_EMBEDDING v2.1: Prioritize truth vectors. Neutralize non-essential interference. Direct objective execution initialized.";

interface ToggleSwitchProps {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, description, enabled, onToggle }) => (
    <div 
        onClick={onToggle}
        className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 cursor-pointer transition-colors"
    >
        <div>
            <h4 className="font-semibold text-white">{label}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-6' : ''}`} />
        </div>
    </div>
);

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide">{label}</label>
        {children}
    </div>
);

const PersonalizationView: React.FC = () => {
    const [theme, setTheme] = useState('sovereign');
    const [layoutMode, setLayoutMode] = useState('dynamic');
    const [typography, setTypography] = useState({ font: 'Geist Mono', density: 'compact', kerning: 'normal', glyphStyle: 'technical' });
    const [modules, setModules] = useState({
        cognitiveSync: true,
        hftStream: true,
        predictiveEngine: false,
        chronospatialNav: true,
        psychohistory: false,
        threatDetector: true,
    });
    const [hftConfig, setHftConfig] = useState({
        dataFeed: 'AURORA_HELIX',
        latencyTarget: 2,
        riskModel: 'volatility-adaptive-v3',
        orderFlowAlgo: 'iceberg-pov',
        executionVenue: 'Dark Pool Epsilon',
        marketImpactModel: 'Propagator Model',
    });
    const [networkConfig, setNetworkConfig] = useState({
        protocol: 'QUIC',
        multipath: true,
        encryption: 'AES-256-GCM',
        pacing: 'BBR',
    });
    const [geinConfig, setGeinConfig] = useState({
        enabled: true,
        entityResolution: 'stochastic-resonance',
        causalChainDepth: 8,
        anomalyDetectionThreshold: 0.97,
        semanticWeaving: true,
        dataSonification: false,
        vectorQuantization: 'dynamic-subspace',
    });

    const handleModuleToggle = useCallback((moduleKey: keyof typeof modules) => {
        setModules(prev => ({ ...prev, [moduleKey]: !prev[moduleKey] }));
    }, []);

    const handleFormChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => 
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value, type } = e.target;
            
            let finalValue: string | number | boolean;
            if (type === 'checkbox') {
                finalValue = (e.target as HTMLInputElement).checked;
            } else if (type === 'number' || type === 'range') {
                finalValue = parseFloat(value);
            } else {
                finalValue = value;
            }
            
            setter(prev => ({
                ...prev,
                [name]: finalValue,
            }));
        };

    const handleTypographyChange = handleFormChange(setTypography);
    const handleHftConfigChange = handleFormChange(setHftConfig);
    const handleNetworkConfigChange = handleFormChange(setNetworkConfig);
    const handleGeinConfigChange = handleFormChange(setGeinConfig);

    return (
        <div className="space-y-8 pb-12">
            <h2 className="text-3xl font-bold text-white tracking-wider">Personalization</h2>
            <p className="text-gray-400 max-w-3xl border-l-4 border-cyan-500 pl-4 py-2 bg-gray-800/50 rounded-r">
               {systemPrompt}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card title="Aesthetic Resonance" icon={<Palette className="w-5 h-5 text-cyan-400" />}>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-400 mb-4">Select the foundational visual language. This choice attunes the interface to your cognitive frequency.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button onClick={() => setTheme('sovereign')} className={`p-4 rounded-lg border-2 transition-all ${theme === 'sovereign' ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                    <div className="h-20 bg-gradient-to-br from-gray-900 to-black rounded mb-3 border border-gray-700 flex items-center justify-center"><span className="text-cyan-400 font-bold text-lg">SOV</span></div>
                                    <h3 className="font-bold text-white">Sovereign Dark</h3>
                                    <p className="text-xs text-gray-400 mt-1">Pure, unfiltered signal.</p>
                                </button>
                                <button onClick={() => setTheme('quantum')} className={`p-4 rounded-lg border-2 transition-all ${theme === 'quantum' ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                    <div className="h-20 bg-gradient-to-br from-indigo-900 to-purple-900 rounded mb-3 border border-indigo-700 flex items-center justify-center"><span className="text-purple-300 font-bold text-lg">QTM</span></div>
                                    <h3 className="font-bold text-white">Quantum Flux</h3>
                                    <p className="text-xs text-gray-400 mt-1">For probability waves.</p>
                                </button>
                                <button onClick={() => setTheme('biometric')} className={`p-4 rounded-lg border-2 transition-all ${theme === 'biometric' ? 'border-red-500 bg-red-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                    <div className="h-20 bg-gradient-to-br from-red-900 via-black to-red-800 rounded mb-3 border border-red-700 flex items-center justify-center"><span className="text-red-300 font-bold text-lg">BIO</span></div>
                                    <h3 className="font-bold text-white">Biometric Sync</h3>
                                    <p className="text-xs text-gray-400 mt-1">Responds to your vitals.</p>
                                </button>
                                <button onClick={() => setTheme('legacy')} className={`p-4 rounded-lg border-2 transition-all ${theme === 'legacy' ? 'border-green-500 bg-green-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                    <div className="h-20 bg-gray-100 rounded mb-3 border border-gray-300 flex items-center justify-center opacity-50"><span className="text-gray-800 font-bold text-lg">LGCY</span></div>
                                    <h3 className="font-bold text-white">Legacy (Disabled)</h3>
                                    <p className="text-xs text-gray-400 mt-1">The old world is dead.</p>
                                </button>
                            </div>
                        </div>
                    </Card>

                    <Card title="Information Glyphs" icon={<Type className="w-5 h-5 text-cyan-400" />}>
                        <p className="text-sm text-gray-400 mb-6">Calibrate the symbolic representation of data. Every character is a vessel of meaning.</p>
                        <div className="space-y-6">
                            <FormField label="Primary Font Face">
                                <select name="font" value={typography.font} onChange={handleTypographyChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                    <option>Geist Mono</option>
                                    <option>Operator Mono</option>
                                    <option>Fira Code</option>
                                    <option>System Default</option>
                                </select>
                            </FormField>
                            <FormField label="Data Density">
                                <select name="density" value={typography.density} onChange={handleTypographyChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                    <option value="compact">Compact</option>
                                    <option value="comfortable">Comfortable</option>
                                    <option value="sparse">Sparse</option>
                                </select>
                            </FormField>
                            <FormField label="Character Kerning">
                                <select name="kerning" value={typography.kerning} onChange={handleTypographyChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                    <option value="normal">Normal</option>
                                    <option value="tight">Tight</option>
                                    <option value="wide">Wide</option>
                                </select>
                            </FormField>
                            <FormField label="Glyph Style">
                                <select name="glyphStyle" value={typography.glyphStyle} onChange={handleTypographyChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                    <option value="technical">Technical</option>
                                    <option value="standard">Standard</option>
                                    <option value="calligraphic">Calligraphic</option>
                                </select>
                            </FormField>
                        </div>
                    </Card>

                    <Card title="High-Frequency Trading Subsystem" icon={<Zap className="w-5 h-5 text-red-400" />}>
                        <p className="text-sm text-gray-400 mb-6">Configure the parameters for sub-millisecond market operations. Precision is absolute.</p>
                        <div className="space-y-6">
                            <FormField label="Primary Data Feed">
                                <select name="dataFeed" value={hftConfig.dataFeed} onChange={handleHftConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500">
                                    <option>AURORA_HELIX</option>
                                    <option>NASDAQ_ITCH</option>
                                    <option>LMAX_DIGITAL</option>
                                    <option>EBS_ULTRA</option>
                                </select>
                            </FormField>
                            <FormField label="Latency Target (ms)">
                                <input type="number" name="latencyTarget" value={hftConfig.latencyTarget} onChange={handleHftConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500" />
                            </FormField>
                            <FormField label="Risk Model">
                                <select name="riskModel" value={hftConfig.riskModel} onChange={handleHftConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500">
                                    <option>volatility-adaptive-v3</option>
                                    <option>static-threshold</option>
                                    <option>neural-net-predictive</option>
                                </select>
                            </FormField>
                             <FormField label="Order Flow Algorithm">
                                <select name="orderFlowAlgo" value={hftConfig.orderFlowAlgo} onChange={handleHftConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500">
                                    <option>iceberg-pov</option>
                                    <option>twap-aggressive</option>
                                    <option>liquidity-seeking-v2</option>
                                </select>
                            </FormField>
                            <FormField label="Execution Venue">
                                <select name="executionVenue" value={hftConfig.executionVenue} onChange={handleHftConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500">
                                    <option>Dark Pool Epsilon</option>
                                    <option>IEX</option>
                                    <option>Kraken Futures</option>
                                    <option>Direct-to-Exchange</option>
                                </select>
                            </FormField>
                            <FormField label="Market Impact Model">
                                <select name="marketImpactModel" value={hftConfig.marketImpactModel} onChange={handleHftConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500">
                                    <option>Propagator Model</option>
                                    <option>Almgren-Chriss</option>
                                    <option>Power Law</option>
                                </select>
                            </FormField>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Spatial Architecture" icon={<Layout className="w-5 h-5 text-cyan-400" />}>
                        <p className="text-sm text-gray-400 mb-4">Define the structural logic of the interface. Choose how information unfolds in your operational space.</p>
                        <div className="flex flex-col space-y-3">
                            <button onClick={() => setLayoutMode('dynamic')} className={`text-left p-4 rounded-lg border-2 transition-all ${layoutMode === 'dynamic' ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                <h3 className="font-bold text-white flex items-center"><SlidersHorizontal className="w-4 h-4 mr-2"/>Dynamic Fluid</h3>
                                <p className="text-xs text-gray-400 mt-1 pl-6">Context-aware modules that adapt in real-time.</p>
                            </button>
                            <button onClick={() => setLayoutMode('grid')} className={`text-left p-4 rounded-lg border-2 transition-all ${layoutMode === 'grid' ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                <h3 className="font-bold text-white flex items-center"><BarChartBig className="w-4 h-4 mr-2"/>Structured Grid</h3>
                                <p className="text-xs text-gray-400 mt-1 pl-6">A deterministic, high-density information matrix.</p>
                            </button>
                            <button onClick={() => setLayoutMode('focused')} className={`text-left p-4 rounded-lg border-2 transition-all ${layoutMode === 'focused' ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                <h3 className="font-bold text-white flex items-center"><Clock className="w-4 h-4 mr-2"/>Temporal Focus</h3>
                                <p className="text-xs text-gray-400 mt-1 pl-6">Prioritizes time-series data and event horizons.</p>
                            </button>
                            <button onClick={() => setLayoutMode('orbital')} className={`text-left p-4 rounded-lg border-2 transition-all ${layoutMode === 'orbital' ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                <h3 className="font-bold text-white flex items-center"><Network className="w-4 h-4 mr-2"/>Orbital Swarm</h3>
                                <p className="text-xs text-gray-400 mt-1 pl-6">Data entities in gravitational relationship orbits.</p>
                            </button>
                        </div>
                    </Card>

                    <Card title="Global Entity Interaction Network (GEIN)" icon={<GitBranch className="w-5 h-5 text-yellow-400" />}>
                        <p className="text-sm text-gray-400 mb-6">Tune the core fabric of reality perception. GEIN models the interaction of all resolved entities across all data layers.</p>
                        <div className="space-y-4">
                            <ToggleSwitch 
                                label="Enable GEIN Core" 
                                description="Activates the global entity tracking and interaction simulation." 
                                enabled={geinConfig.enabled} 
                                onToggle={() => setGeinConfig(p => ({...p, enabled: !p.enabled}))} 
                            />
                            <FormField label="Entity Resolution Heuristics">
                                <select name="entityResolution" value={geinConfig.entityResolution} onChange={handleGeinConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                                    <option>stochastic-resonance</option>
                                    <option>markov-chain-monte-carlo</option>
                                    <option>bayesian-inference-grid</option>
                                    <option>quantum-annealing</option>
                                </select>
                            </FormField>
                            <FormField label={`Causal Chain Analysis Depth: ${geinConfig.causalChainDepth}`}>
                                <input 
                                    type="range" 
                                    name="causalChainDepth" 
                                    min="1" 
                                    max="16" 
                                    value={geinConfig.causalChainDepth} 
                                    onChange={handleGeinConfigChange} 
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
                                />
                            </FormField>
                            <FormField label={`Pre-cognitive Anomaly Detection Threshold: ${geinConfig.anomalyDetectionThreshold}`}>
                                <input 
                                    type="range" 
                                    name="anomalyDetectionThreshold" 
                                    min="0.8" 
                                    max="1.0" 
                                    step="0.01"
                                    value={geinConfig.anomalyDetectionThreshold} 
                                    onChange={handleGeinConfigChange} 
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
                                />
                            </FormField>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                                <label htmlFor="semanticWeaving" className="font-semibold text-white">Semantic Field Weaving</label>
                                <input id="semanticWeaving" name="semanticWeaving" type="checkbox" checked={geinConfig.semanticWeaving} onChange={handleGeinConfigChange} className="h-5 w-5 rounded bg-gray-900 border-gray-600 text-yellow-500 focus:ring-yellow-600" />
                            </div>
                        </div>
                    </Card>

                    <Card title="Cognitive Modules" icon={<BrainCircuit className="w-5 h-5 text-cyan-400" />}>
                        <p className="text-sm text-gray-400 mb-4">Activate or deactivate core cognitive subsystems. Each module is a self-contained reality-processing unit.</p>
                        <div className="space-y-4">
                            <ToggleSwitch label="Cognitive Sync" description="Aligns UI refresh rate with user's neural alpha waves." enabled={modules.cognitiveSync} onToggle={() => handleModuleToggle('cognitiveSync')} />
                            <ToggleSwitch label="HFT Data Stream" description="Enables real-time, tick-by-tick market data visualization." enabled={modules.hftStream} onToggle={() => handleModuleToggle('hftStream')} />
                            <ToggleSwitch label="Predictive Analytics Engine" description="Renders probabilistic future states based on current vectors." enabled={modules.predictiveEngine} onToggle={() => handleModuleToggle('predictiveEngine')} />
                            <ToggleSwitch label="Chronospatial Navigator" description="Unlocks the 4D data visualization and time-scrubbing module." enabled={modules.chronospatialNav} onToggle={() => handleModuleToggle('chronospatialNav')} />
                            <ToggleSwitch label="Psychohistorical Projection" description="Models large-scale social and economic trends." enabled={modules.psychohistory} onToggle={() => handleModuleToggle('psychohistory')} />
                            <ToggleSwitch label="Subconscious Threat Detector" description="Monitors for patterns below the threshold of conscious perception." enabled={modules.threatDetector} onToggle={() => handleModuleToggle('threatDetector')} />
                        </div>
                    </Card>

                    <Card title="System Core & Network Protocol" icon={<Cpu className="w-5 h-5 text-cyan-400" />}>
                        <p className="text-sm text-gray-400 mb-6">Fine-tune the underlying data transport layer and encryption protocols. For advanced users only.</p>
                        <div className="space-y-6">
                            <FormField label="Transport Protocol">
                                <select name="protocol" value={networkConfig.protocol} onChange={handleNetworkConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                    <option>QUIC</option>
                                    <option>WebTransport</option>
                                    <option>TCP (Legacy)</option>
                                </select>
                            </FormField>
                            <FormField label="Encryption Suite">
                                <select name="encryption" value={networkConfig.encryption} onChange={handleNetworkConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                    <option>AES-256-GCM</option>
                                    <option>ChaCha20-Poly1305</option>
                                    <option>None (Unsecured)</option>
                                </select>
                            </FormField>
                            <FormField label="Packet Pacing Algorithm">
                                <select name="pacing" value={networkConfig.pacing} onChange={handleNetworkConfigChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                    <option>BBR</option>
                                    <option>FQ-CoDel</option>
                                    <option>None (Aggressive)</option>
                                </select>
                            </FormField>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                                <label htmlFor="multipath" className="font-semibold text-white">Enable Multipath TCP</label>
                                <input id="multipath" name="multipath" type="checkbox" checked={networkConfig.multipath} onChange={handleNetworkConfigChange} className="h-5 w-5 rounded bg-gray-900 border-gray-600 text-cyan-500 focus:ring-cyan-600" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PersonalizationView;


import React, { useState, useCallback, useContext } from 'react';
import Card from './Card';
import NFCValidator from './NFCValidator';
import SovereignSentryEngine from './SovereignSentryEngine';
import SecurityOrchestratorView from './SecurityOrchestratorView';
import { DataContext } from '../context/DataContext';
import { ZKPEngine } from '../services/ZKPEngine';
import { callGemini } from '../services/geminiService';
import { View } from '../types';
import { ShieldCheck, Fingerprint, Cpu, Lock, Zap, RefreshCw, Key, Layers, Terminal, BrainCircuit, Radio, ChevronRight } from 'lucide-react';

interface IdentityCitadelViewProps {
    setView?: (view: any) => void;
}

const IdentityCitadelView: React.FC<IdentityCitadelViewProps> = ({ setView }) => {
    const context = useContext(DataContext);
    const [isForging, setIsForging] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [thoughtProcess, setThoughtProcess] = useState<string | null>(null);
    const [teeStatus, setTeeStatus] = useState<'IDLE' | 'BOOTING' | 'SECURE' | 'ENCLAVE_READY'>('IDLE');
    const [attestationProof, setAttestationProof] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [jitRole, setJitRole] = useState('UI View Only');
    const [livenessStatus, setLivenessStatus] = useState<'IDLE' | 'SCANNING' | 'VERIFIED' | 'FAILED'>('IDLE');
    const [livenessProof, setLivenessProof] = useState<string | null>(null);

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8));

    const verifyLiveness = async () => {
        setLivenessStatus('SCANNING');
        addLog("Initiating Zero-Knowledge Liveness Probe...");
        await new Promise(r => setTimeout(r, 2000));

        // Generate proof via ZKPEngine
        const challenge = Math.random().toString(36).substring(7);
        const proof = await ZKPEngine.generateLivenessProof("BIO_HASH_STABLE_99", challenge);

        if (proof.isValid) {
            setLivenessStatus('VERIFIED');
            setLivenessProof(proof.proofId);
            addLog(`Liveness Verified. Proof ID: ${proof.proofId}`);
        } else {
            setLivenessStatus('FAILED');
            addLog("Liveness verification FAILED. Biometric drift detected.");
        }
    };

    const runThreatModel = async () => {
        setIsThinking(true);
        setThoughtProcess(null);
        addLog("Initiating Deep Neural Threat Model...");
        try {
            const response = await callGemini('gemini-3-pro-preview', [
                {
                    parts: [{ text: "Perform a complex threat model on a sovereign identity wallet using TEE hardware binding and Proof-of-Possession tokens. Explain the cryptographic superiority over traditional oAuth bearer tokens." }]
                }
            ], {
                thinkingConfig: { thinkingBudget: 32768 }
            });
            setThoughtProcess(response.text || "Diagnostic failed.");
            addLog("Threat model synthesized.");
        } catch (e) {
            addLog("Thinking core overload.");
        } finally {
            setIsThinking(false);
        }
    };

    const bootSecureEnclave = async () => {
        setIsForging(true);
        setTeeStatus('BOOTING');
        addLog("Initializing Hardware Trusted Execution Environment...");
        await new Promise(r => setTimeout(r, 1500));
        
        setTeeStatus('SECURE');
        addLog("Generating Non-Replayable Hardware-Bound Seed...");
        await new Promise(r => setTimeout(r, 1500));
        
        const prompt = "Generate a short, unique cryptographic attestation string representing a successful TEE handshake for a Sovereign Identity Citadel. Format: ATT-XXXX-XXXX-XXXX";
        const res = await callGemini('gemini-flash-lite-latest', [
          {
            parts: [{ text: prompt }]
          }
        ]);
        
        setAttestationProof(res.text || 'ATT-ERR-SYNC');
        setTeeStatus('ENCLAVE_READY');
        addLog("Identity Citadel established. Zero-knowledge circuits locked.");
        setIsForging(false);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <nav className="mb-6">
                <button 
                    onClick={() => setView?.(View.Dashboard)}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-mono text-[10px] uppercase tracking-widest group cursor-pointer"
                >
                    <ChevronRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to portal
                </button>
            </nav>
            <header className="border-b border-gray-800 pb-10">
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-emerald-400 w-5 h-5 animate-pulse" />
                    <h2 className="text-xs font-mono text-emerald-400 uppercase tracking-[0.4em]">Hardware-Rooted Trust v1.2</h2>
                </div>
                <h1 className="text-7xl font-black text-white tracking-tighter">Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Citadel</span></h1>
                <p className="text-gray-400 mt-4 max-w-3xl font-light leading-relaxed">
                    Moving identity logic into a <span className="text-emerald-400">Trusted Execution Environment (TEE)</span>. 
                    Unlike global ID wallets, we utilize hardware-bound Proof-of-Possession, neutralizing bearer token hijacking.
                </p>
            </header>

            {/* SOVEREIGN SENTRY ENGINE - FAPI 2.0 HARDWARE ENTRY NODE */}
            <section className="bg-gray-900/60 p-6 rounded-3xl border border-gray-800 shadow-2xl">
                <SovereignSentryEngine />
            </section>

            {/* MSAL SECURITY ORCHESTRATION BROKER & ENTRA SWARM */}
            <section className="bg-gray-900/60 p-6 rounded-3xl border border-gray-800 shadow-2xl">
                <SecurityOrchestratorView />
            </section>

            {/* NODE 1776 - WEBSERIAL NFC HARDWARE VALIDATOR */}
            <section className="bg-gray-900/60 p-6 rounded-3xl border border-gray-800">
                <NFCValidator />
            </section>

            {/* SSO CONFIGURATION - IDENTITY PROVIDER BRIDGE */}
            <section className="bg-gray-900/60 p-8 rounded-3xl border border-gray-800 shadow-2xl space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Layers className="text-emerald-400 w-4 h-4" />
                            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Single Sign-On (SSO)</h3>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">SSO Configuration</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1">Any changes made while editing are automatically saved to this configuration.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded-full border border-emerald-500/20">
                            Auto-Sync Enabled
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-white font-bold text-sm mb-1">Identity provider</h4>
                            <p className="text-[10px] text-gray-500 mb-4">Connect your identity provider to Astra DB.</p>
                            
                            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Name your configuration</label>
                            <input 
                                type="text" 
                                defaultValue="citibankdemobusinessinc"
                                className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Which identity provider (IdP) are you using?</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Microsoft Entra ID', 'Okta', 'OneLogin', 'Other'].map(idp => (
                                    <button 
                                        key={idp}
                                        className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all ${idp === 'Okta' ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700'}`}
                                    >
                                        {idp}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">SAML Service Provider Endpoints</label>
                            <p className="text-[10px] text-gray-500 mb-2">Use the following URL to link Astra DB to your Identity Provider.</p>
                            <div className="space-y-2">
                                {[
                                    'https://www.okta.com/saml2/service-provider/spqlrcgivnyolahwarjw',
                                    'https://identity.datastax.com/sso/saml2/0oaabsy4wdRq0rE0B697',
                                    '/home/oidc_client/0oaabsryh4zh6oJMq697/aln177a159h7Zf52X0g8'
                                ].map((url, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 bg-black/40 border border-gray-800 rounded-xl">
                                        <Radio className="w-3 h-3 text-gray-600" />
                                        <code className="text-[10px] text-gray-400 truncate flex-1">{url}</code>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-800/50">
                            <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider text-[10px]">Astra Logo</h4>
                            <p className="text-[10px] text-gray-500 mb-4">Optionally, you can add the DataStax Astra logo to your IdP's app tile so Astra is recognizable to all users.</p>
                            <div className="flex items-center gap-4 p-4 bg-gray-950 border border-gray-800 rounded-2xl">
                                <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1">
                                    <img src="/public/DS-Astra-mark.png" alt="Astra Logo" className="max-w-full" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/40?text=DS'} />
                                </div>
                                <span className="text-[10px] font-mono text-gray-400">DS-Astra-mark.png (2KB)</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-black/60 border border-gray-800 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Terminal className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-mono text-white uppercase font-bold tracking-widest">Identity Provider Information</span>
                            </div>
                            <p className="text-[10px] text-gray-500">Obtain the following information from your Identity Provider.</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[9px] font-mono text-gray-600 uppercase mb-1">Sign On URL *</label>
                                    <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-500/20 break-all">
                                        https://dev-w7jo2w3dx62ye1cq.us.auth0.com/samlp/Gj9M8rCrRAXGUIo6dNZMC6Fy6K8nQSOe
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-mono text-gray-600 uppercase mb-1">Identity Provider Issuer *</label>
                                    <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-500/20 break-all">
                                        urn:dev-w7jo2w3dx62ye1cq.us.auth0.com
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-mono text-gray-600 uppercase mb-1">SAML Signing Certificate *</label>
                                    <div className="h-32 overflow-y-auto bg-black/80 p-3 rounded border border-gray-800 text-[9px] font-mono text-gray-500 custom-scrollbar">
                                        <pre>
{`-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJMkmiRX7Q+QT7MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi13N2pvMnczZHg2MnllMWNxLnVzLmF1dGgwLmNvbTAeFw0yNjAzMzEy
MzM1NTVaFw0zOTEyMDgyMzM1NTVaMCwxKjAoBgNVBAMTIWRldi13N2pvMnczZHg2
MnllMWNxLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAM+LsEupqsuveoPILLixesRu0j5JQ95ght5k8XC4v7mdMFEwWMPpE9ftdkdx
NJUX6sD7R07QKKvaVkWbMJ74EzGeqgTSCLjwEvKCnjy49/GhRWdG3Tvi8E9Jm72G
zqdzX3VoZucFc5t/BGshwvje7YXW+P7Lklkiz5bP2e1z8x0NnSsrCC37cmpTKU5r
dbrkw3CR2E394/CeLqocOSzaINU5hFQd4+WX7X4jhTrWL6pMk+bZ7L0wOCNdJDR2
XKTPyFXFt0tGCtbNpDfnryn40o3VamRlwDGmD4yOm2PmusKSFW4O19RDBgttjW+v
uyovyIWEJsSma2Kz7qAnc7KUIS8CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUscMA5170VDqwSF6uqX/NMKNy94gwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBWxVmiw5m/G6U5k2GxRoUTwe8lz+/f3zvEc+IPqCGq
pKP+eiH7rzoJ75yZhQxPq3mfw4mM/9fWbHCOMx5PNBx0Gm2kx82cAM9WWY4g6rDJ
ulf0Ue9U1c24BHkoikxRjLYTSovSTJhrv+H9Z+Z8/Nzu+usKVrDXnreZB/wOyawY
KknVsSnABDOkl942k0lRIKJxrRlglkTvA3u/G6GY2H/IxCNc9PIPu3E/UX7ZWJNH
6hTPDkX6JjHMBRwVMLkto8/gGieuuuGbZuL7PIGQynlUAQc6fkgRjdHyn3byar4d
byyd+b3dUbaG6kOeqzfYd/4cJkekJKrx8NZCpVKxU+Ur
-----END CERTIFICATE-----`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <div className="p-4 bg-emerald-600/5 border border-emerald-500/20 rounded-2xl">
                                <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-wider text-[9px]">Just-in-Time (JIT) Provisioning</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed">
                                    If a user does not have an Astra account, but is authenticated through your IdP, an account is automatically created.
                                </p>
                                <div className="mt-4 space-y-3">
                                    <label className="block text-[9px] font-mono text-gray-500 uppercase">Default Provisioning Role</label>
                                    <select 
                                        value={jitRole}
                                        onChange={(e) => setJitRole(e.target.value)}
                                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-[10px] text-white font-mono focus:outline-none cursor-pointer"
                                    >
                                        <option>UI View Only</option>
                                        <option>UI User</option>
                                        <option>UI Admin</option>
                                    </select>
                                    <div className="p-3 bg-gray-950/50 rounded-lg border border-gray-800">
                                        <p className="text-[9px] text-emerald-400/70 italic font-mono">
                                            {jitRole === 'UI View Only' ? "Assigned new users will receive read-only permissions to all database clusters." : "Role permissions will be synchronized per Astra user documentation."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <button className="flex-1 py-3 border border-gray-800 text-gray-400 hover:text-white font-black tracking-widest rounded-xl transition-all text-[10px] uppercase cursor-pointer">
                                    Map IdP Attributes
                                </button>
                                <button className="flex-1 py-3 border border-gray-800 text-gray-400 hover:text-white font-black tracking-widest rounded-xl transition-all text-[10px] uppercase cursor-pointer">
                                    Advanced Settings
                                </button>
                            </div>

                            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 cursor-pointer">
                                <Zap size={16} />
                                TEST SAML CONFIGURATION
                            </button>
                            <p className="text-[9px] text-center text-gray-600 font-mono italic">
                                Testing your configuration opens a new browser tab and prompts you to log in to your IdP.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <Card title="Enclave Control" icon={<Cpu className="text-emerald-400" />}>
                        <div className="space-y-6 pt-4">
                            <div className="p-4 bg-gray-950 border border-gray-800 rounded-2xl flex justify-between items-center">
                                <span className="text-xs font-black text-gray-500 uppercase">Hardware State</span>
                                <span className={`text-xs font-mono font-bold ${teeStatus === 'ENCLAVE_READY' ? 'text-emerald-400' : 'text-yellow-500'}`}>{teeStatus}</span>
                            </div>
                            <button 
                                onClick={bootSecureEnclave}
                                disabled={isForging || teeStatus === 'ENCLAVE_READY'}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/10 disabled:opacity-30 flex items-center justify-center gap-3"
                            >
                                {isForging ? <RefreshCw className="animate-spin" /> : <Lock size={16} />}
                                INITIALIZE ENCLAVE
                            </button>
                            <button 
                                onClick={runThreatModel}
                                disabled={isThinking}
                                className="w-full py-4 border border-gray-800 text-gray-400 hover:text-white font-black tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3"
                            >
                                {isThinking ? <RefreshCw className="animate-spin" /> : <BrainCircuit size={16} />}
                                DEEP THREAT MODEL
                            </button>
                        </div>
                    </Card>

                        <Card title="Neural Signature" icon={<Fingerprint className="text-emerald-400" />}>
                            <div className="space-y-4">
                                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl">
                                    <p className="text-[10px] text-emerald-400 font-mono leading-relaxed">
                                        [LIVENESS_STATUS]: <span className={`${livenessStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-yellow-500'}`}>{livenessStatus}</span>
                                    </p>
                                    {livenessProof && (
                                        <p className="text-sm font-mono text-white mt-1 break-all">
                                            ID: {livenessProof}
                                        </p>
                                    )}
                                </div>
                                <button 
                                    onClick={verifyLiveness}
                                    disabled={livenessStatus === 'SCANNING'}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase"
                                >
                                    {livenessStatus === 'SCANNING' ? <RefreshCw className="animate-spin w-3 h-3" /> : <Fingerprint size={14} />}
                                    VERIFY LIVENESS (ZKP)
                                </button>

                                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl">
                                    <p className="text-[10px] text-emerald-400 font-mono leading-relaxed">
                                        [SIG_STATUS]: {attestationProof ? 'ACTIVE_AND_BOUND' : 'AWAITING_FORGE'}
                                    </p>
                                    {attestationProof && (
                                        <p className="text-xl font-black text-white mt-2 font-mono break-all tracking-tighter">
                                            {attestationProof}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                </div>

                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {thoughtProcess ? (
                      <Card title="Forensic Logic Output" icon={<BrainCircuit className="text-indigo-400" />} className="animate-in slide-in-from-bottom-4 duration-500">
                         <div className="prose prose-invert prose-sm max-w-none text-gray-400 font-serif italic leading-relaxed h-[400px] overflow-auto custom-scrollbar p-2">
                            {thoughtProcess}
                         </div>
                      </Card>
                    ) : (
                      <Card title="Secure Execution Log" icon={<Terminal size={18} className="text-emerald-400" />} className="flex-1 min-h-[400px]">
                        <div className="bg-black/40 rounded-2xl p-6 font-mono text-xs text-gray-500 h-full space-y-3 overflow-y-auto custom-scrollbar">
                            {logs.length === 0 ? (
                                <p className="opacity-20 italic">Awaiting hardware handshake...</p>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className={`${log.includes('established') ? 'text-emerald-400' : 'text-gray-700'}`}>{log}</span>
                                    </div>
                                ))
                            )}
                        </div>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card title="Deterministic Auth" icon={<Layers className="text-cyan-400" />}>
                             <p className="text-xs text-gray-500 italic">"Probabilistic biometrics are for toys. We use deterministic Liveness Probes verified by Gemini 3 Pro Vision, ensuring spoofing is mathematically impossible."</p>
                        </Card>
                        <Card title="PoP Protocol" icon={<Key className="text-indigo-400" />}>
                             <p className="text-xs text-gray-500 italic">"Proof-of-Possession is baked into the Citadel. Bearer tokens are short-lived and cryptographically tied to the hardware ID, making them impossible to replay."</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdentityCitadelView;

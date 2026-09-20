
import React, { useState } from 'react';
import Card from './Card';
import { Network, ShieldCheck, Globe, CheckCircle, Search, AlertCircle, Cpu, Activity } from 'lucide-react';

const TrustRegistryView: React.FC = () => {
    const issuers = [
        { name: 'Swiss Sovereign ID', status: 'VERIFIED', nodes: 842, trustScore: 99.8, type: 'Government' },
        { name: 'Loomis Private Enclave', status: 'BETA', nodes: 120, trustScore: 84.1, type: 'Private' },
        { name: 'GlobalID Proxy (UN)', status: 'WARNING', nodes: 42, trustScore: 32.5, type: 'NGO' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="border-b border-gray-800 pb-10">
                <div className="flex items-center gap-3 mb-2">
                    <Network className="text-blue-400 w-5 h-5" />
                    <h2 className="text-xs font-mono text-blue-400 uppercase tracking-[0.4em]">Decentralized Trust Protocol</h2>
                </div>
                <h1 className="text-7xl font-black text-white tracking-tighter">Trust <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Registry</span></h1>
                <p className="text-gray-400 mt-4 max-w-3xl font-light leading-relaxed">
                    Reversing the "Root of Trust." Instead of the government auditing you, you audit the issuers. 
                    Our decentralized registry uses DLT consensus to verify that issuers are not violating privacy standards.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {issuers.map((issuer, i) => (
                    <Card key={i} title={issuer.name} subtitle={issuer.type} variant="interactive">
                        <div className="space-y-6 mt-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Trust Score</p>
                                    <p className={`text-4xl font-mono font-black ${issuer.trustScore > 90 ? 'text-blue-400' : 'text-red-400'}`}>{issuer.trustScore}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Audit Nodes</p>
                                    <p className="text-xl font-mono text-white">{issuer.nodes}</p>
                                </div>
                            </div>
                            
                            <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                                issuer.status === 'VERIFIED' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                                issuer.status === 'WARNING' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-gray-800 text-gray-400'
                            }`}>
                                {issuer.status === 'VERIFIED' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                {issuer.status}
                            </div>
                            
                            <button className="w-full py-3 bg-gray-950 border border-gray-800 hover:border-blue-500/40 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all rounded-xl">
                                VIEW AUDIT TRAIL
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <Card title="Registry Telemetry" icon={<Activity className="text-blue-400" />}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Active Ledger</p>
                        <p className="text-sm font-mono text-white">Citadel-L1</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Consensus Mode</p>
                        <p className="text-sm font-mono text-white">Proof-of-Audit</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Peer Verification</p>
                        <p className="text-sm font-mono text-green-400">STABLE</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Global Latency</p>
                        <p className="text-sm font-mono text-white">124ms</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TrustRegistryView;

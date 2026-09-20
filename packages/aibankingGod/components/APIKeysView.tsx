import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { Key, Shield, Copy, Eye, EyeOff, Plus } from 'lucide-react';

const APIKeysView: React.FC = () => {
    const context = useContext(DataContext);
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});

    if (!context) return null;

    const toggleKeyVisibility = (id: string) => {
        setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">API Key Management</h1>
                    <p className="text-gray-400">Manage your application programming interface keys securely.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors">
                    <Plus size={16} />
                    Generate New Key
                </button>
            </header>

            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Key className="text-cyan-400" size={20} />
                    Active Keys
                </h2>
                
                <div className="space-y-4">
                    {/* Mock API Keys for demonstration */}
                    {[
                        { id: '1', name: 'Production environment', key: 'sk_live_51Nx...', lastUsed: '2 hours ago', created: '2023-10-15' },
                        { id: '2', name: 'Development environment', key: 'sk_test_51Nx...', lastUsed: 'Just now', created: '2023-11-02' }
                    ].map((apiKey) => (
                        <div key={apiKey.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-white">{apiKey.name}</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-green-500/20 text-green-400">Active</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                    {showKey[apiKey.id] ? apiKey.key.padEnd(32, 'a1b2c3d4') : '••••••••••••••••••••••••••••••••'}
                                    <button onClick={() => toggleKeyVisibility(apiKey.id)} className="hover:text-white transition-colors">
                                        {showKey[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button className="hover:text-white transition-colors" title="Copy to clipboard">
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col md:items-end text-xs text-gray-500">
                                <div>Created: {apiKey.created}</div>
                                <div>Last used: {apiKey.lastUsed}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                    Revoke
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
                <Shield className="text-blue-400 shrink-0" size={24} />
                <div>
                    <h3 className="text-sm font-bold text-blue-400 mb-1">Security Best Practices</h3>
                    <p className="text-xs text-blue-300/80 leading-relaxed">
                        Never share your secret keys. Keep them guarded and secure. Do not commit them to version control or expose them in client-side code. Consider rotating your keys periodically to maintain optimal security.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default APIKeysView;

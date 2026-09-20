
import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import HoKTokenMint from './HoKTokenMint';

const DeveloperView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DeveloperView must be within a DataProvider");

    // Destructuring missing properties from expanded context
    const { authorizedApps, authorizeApp, revokeApp, userProfile } = context;
    const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState(false);
    const [newAppInfo, setNewAppInfo] = useState({ name: '', description: '' });

    const handleAuthorize = () => {
        if (newAppInfo.name) {
            authorizeApp({
                id: `app_${Date.now()}`,
                name: newAppInfo.name,
                description: newAppInfo.description,
                scopes: ['read_profile', 'read_transactions']
            });
            setIsAuthorizeModalOpen(false);
            setNewAppInfo({ name: '', description: '' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Developer Portal</h2>
                <button 
                    onClick={() => setIsAuthorizeModalOpen(true)}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors"
                >
                    Register External App
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Demai Connect API Credentials">
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <label className="block text-xs text-gray-500 uppercase mb-1">User Client ID</label>
                            <p className="font-mono text-cyan-400 break-all">{userProfile?.id || 'HIDDEN'}</p>
                        </div>
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <label className="block text-xs text-gray-500 uppercase mb-1">Active Scopes</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {['transactions.read', 'profile.read', 'payments.write'].map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Authorized Third-Party Apps">
                    <div className="space-y-4">
                        {authorizedApps.length === 0 ? (
                            <p className="text-gray-500 italic text-center py-4">No external applications connected.</p>
                        ) : (
                            authorizedApps.map(app => (
                                <div key={app.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-white flex items-center gap-2">
                                            {app.name}
                                            <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${app.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                {app.status}
                                            </span>
                                        </h4>
                                        <p className="text-sm text-gray-400 mt-1">{app.description}</p>
                                        <p className="text-[10px] text-gray-500 mt-2 italic">Authorized: {new Date(app.authorizedAt).toLocaleDateString()}</p>
                                    </div>
                                    {app.status === 'active' && (
                                        <button 
                                            onClick={() => revokeApp(app.id)}
                                            className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 px-2 py-1 rounded"
                                        >
                                            Revoke
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            <HoKTokenMint />

            {isAuthorizeModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setIsAuthorizeModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">Connect External Application</h3>
                        <p className="text-sm text-gray-400 mb-6">Simulate an OAuth2 flow by registering a name for a new authorized partner application.</p>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="App Name (e.g., TaxBot Pro)" 
                                value={newAppInfo.name}
                                onChange={e => setNewAppInfo(prev => ({...prev, name: e.target.value}))}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none"
                            />
                            <textarea 
                                placeholder="Description of intended use" 
                                value={newAppInfo.description}
                                onChange={e => setNewAppInfo(prev => ({...prev, description: e.target.value}))}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none h-24"
                            />
                            <button 
                                onClick={handleAuthorize}
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
                            >
                                Authorize Connection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeveloperView;

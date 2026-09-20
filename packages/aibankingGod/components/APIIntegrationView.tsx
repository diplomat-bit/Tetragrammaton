import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { APIStatus } from '../types';
import Card from './Card';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip } from 'recharts';


function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

const APIIntegrationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("APIIntegrationView must be within a DataProvider.");
    
    const { 
        apiStatus, 
        modernTreasuryApiKey, setModernTreasuryApiKey,
        modernTreasuryOrganizationId, setModernTreasuryOrganizationId,
        modernTreasuryPublishableKey, setModernTreasuryPublishableKey,
        modernTreasuryWebhookUrl, setModernTreasuryWebhookUrl,
        modernTreasuryWebhookSigningKey, setModernTreasuryWebhookSigningKey
    } = context;

    const [isMtModalOpen, setIsMtModalOpen] = useState(false);
    const [mtApiKeyInput, setMtApiKeyInput] = useState(modernTreasuryApiKey || '');
    const [mtOrgIdInput, setMtOrgIdInput] = useState(modernTreasuryOrganizationId || '');
    const [mtPublishableKeyInput, setMtPublishableKeyInput] = useState(modernTreasuryPublishableKey || '');
    const [mtWebhookUrlInput, setMtWebhookUrlInput] = useState(modernTreasuryWebhookUrl || '');
    const [mtWebhookSigningKeyInput, setMtWebhookSigningKeyInput] = useState(modernTreasuryWebhookSigningKey || '');

    const handleSaveMtKey = async () => {
        setModernTreasuryApiKey(mtApiKeyInput);
        setModernTreasuryOrganizationId(mtOrgIdInput);
        setModernTreasuryPublishableKey(mtPublishableKeyInput);
        setModernTreasuryWebhookUrl(mtWebhookUrlInput);
        setModernTreasuryWebhookSigningKey(mtWebhookSigningKeyInput);
        
        try {
            await fetch('/api/v1/config/secrets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    MODERN_TREASURY_API_KEY: mtApiKeyInput,
                    MODERN_TREASURY_ORGANIZATION_ID: mtOrgIdInput,
                    MT_PUBLISHABLE_KEY: mtPublishableKeyInput,
                    MT_WEBHOOK_URL: mtWebhookUrlInput,
                    MT_WEBHOOK_KEY: mtWebhookSigningKeyInput
                })
            });
            console.log("Modern Treasury config secrets saved to server.");
        } catch (e) {
            console.error("Failed to save Modern Treasury config secrets to backend", e);
        }
        
        setIsMtModalOpen(false);
    };

    const StatusIndicator: React.FC<{ status: APIStatus['status'] }> = ({ status }) => {
        const colors = {
            'Operational': { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400' },
            'Degraded Performance': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400' },
            'Partial Outage': { bg: 'bg-orange-500/20', text: 'text-orange-300', dot: 'bg-orange-400' },
            'Major Outage': { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
        };
        const style = colors[status];
        return (
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                {status}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">API Integrations</h1>
                <button 
                    onClick={() => setIsMtModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <SettingsIcon className="w-4 h-4" />
                    Configure Modern Treasury
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="col-span-full p-6 bg-blue-900/10 border-blue-800/50">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                                </svg>
                                Webhook Orchestration
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">Monitor real-time event streams from Modern Treasury and Stripe.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-mono tracking-wider">LISTENING</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/50">
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-mono">Modern Treasury</div>
                            <div className="text-lg font-bold text-white truncate">{modernTreasuryWebhookUrl || "None"}</div>
                            <div className="mt-2 h-1 w-full bg-gray-800 overflow-hidden rounded-full">
                                <div className="h-full bg-blue-500 w-3/4 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/50">
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-mono">Status</div>
                            <div className="text-lg font-bold text-green-400">Synchronized</div>
                            <div className="text-[10px] text-gray-500 mt-1">Last handshake: 2m ago</div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/50">
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-mono">Events (24h)</div>
                            <div className="text-lg font-bold text-white">1,248</div>
                            <div className="text-[10px] text-gray-500 mt-1 font-mono text-blue-400">+12% vs yesterday</div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/50">
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-mono">Success Rate</div>
                            <div className="text-lg font-bold text-white">99.98%</div>
                            <div className="mt-2 h-1 w-full bg-gray-800 overflow-hidden rounded-full">
                                <div className="h-full bg-green-500 w-[99.98%]"></div>
                            </div>
                        </div>
                    </div>
                </Card>

                {apiStatus.map((api) => (
                    <Card key={api.id} className="p-6 bg-gray-900/50 border-gray-800">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">{api.name}</h3>
                                <p className="text-sm text-gray-400">{api.description}</p>
                            </div>
                            <StatusIndicator status={api.status} />
                        </div>
                        <div className="h-24 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={api.latencyHistory}>
                                    <Area 
                                        type="monotone" 
                                        dataKey="latency" 
                                        stroke="#3b82f6" 
                                        fill="#3b82f622" 
                                        strokeWidth={2} 
                                    />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                                        itemStyle={{ color: '#3b82f6' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                            <span>Last 24h Latency</span>
                            <span>{api.latencyHistory[api.latencyHistory.length - 1]?.latency}ms</span>
                        </div>
                    </Card>
                ))}
            </div>

            {isMtModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-8 bg-gray-900 border-gray-800">
                        <h2 className="text-2xl font-bold text-white mb-6">Modern Treasury Config</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
                                <input 
                                    type="password"
                                    value={mtApiKeyInput}
                                    onChange={(e) => setMtApiKeyInput(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="sk_live_..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Organization ID</label>
                                <input 
                                    type="text"
                                    value={mtOrgIdInput}
                                    onChange={(e) => setMtOrgIdInput(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="org_..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Publishable Key</label>
                                <input 
                                    type="text"
                                    value={mtPublishableKeyInput}
                                    onChange={(e) => setMtPublishableKeyInput(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="pk_live_..."
                                />
                            </div>
                            <div className="pt-4 border-t border-gray-800">
                                <h3 className="text-sm font-semibold text-gray-300 mb-3">Webhook Configuration</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Endpoint URL</label>
                                        <input 
                                            type="text"
                                            value={mtWebhookUrlInput}
                                            onChange={(e) => setMtWebhookUrlInput(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="https://your-app.com/api/v1/mt/webhook"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Signing Key</label>
                                        <input 
                                            type="password"
                                            value={mtWebhookSigningKeyInput}
                                            onChange={(e) => setMtWebhookSigningKeyInput(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="whsec_..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button 
                                    onClick={() => setIsMtModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveMtKey}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Save Config
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default APIIntegrationView;


// components/SecurityView.tsx
import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';

import HoKTokenMint from './HoKTokenMint';

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================

export interface LoginActivity {
    id: string;
    device: string;
    location: string;
    ip: string;
    timestamp: string;
    isCurrent: boolean;
    browser: string;
    os: string;
    userAgent: string;
}

export interface Device {
    id: string;
    name: string;
    type: string;
    model?: string;
    osVersion?: string;
    appVersion?: string;
    lastActivity: string;
    location: string;
    ip: string;
    isCurrent: boolean;
    permissions: string[];
    status: 'active' | 'locked' | 'revoked' | 'pending';
    firstSeen: string;
    userAgent: string;
    pushNotificationsEnabled: boolean;
    biometricAuthEnabled: boolean;
    macAddress?: string;
    encryptionStatus: 'full' | 'partial' | 'none';
}

export interface DataSharingPolicy {
    id: string;
    partner: string;
    dataCategories: ('account_balances' | 'transaction_history' | 'personal_info' | 'investment_holdings' | 'credit_score_data' | 'identity_verification' | 'spending_patterns' | 'demographic_info')[];
    purpose: string;
    active: boolean;
    lastUpdated: string;
    startDate: string;
    endDate?: string;
    revocationReason?: string;
    consentMethod: 'implicit' | 'explicit' | 'opt_out';
    dataRetentionPeriod: '30_days' | '90_days' | '1_year' | '3_years' | '7_years' | 'indefinite';
    dataLocation: 'US' | 'EU' | 'GLOBAL';
    privacyPolicyURL?: string;
}

export interface TransactionRule {
    id: string;
    name: string;
    type: 'spend_limit' | 'unusual_location' | 'large_withdrawal' | 'new_beneficiary' | 'foreign_currency' | 'merchant_category_block' | 'recurring_subscription';
    threshold?: number;
    currency?: string;
    location?: string;
    merchantCategory?: string;
    active: boolean;
    alertOnly: boolean;
    lastModified: string;
    createdBy: string;
    description: string;
    appliesToAccountIds?: string[];
    effectiveDate: string;
}

export interface ThreatAlert {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    category: string;
    description: string;
    timestamp: string;
    status: 'new' | 'investigating' | 'resolved' | 'dismissed' | 'false_positive';
    actionableItems?: string[];
    affectedEntities?: string[];
    resolutionNotes?: string;
    aiAnalysisSummary?: string;
    threatVector?: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    action: string;
    user: string;
    details: string;
    ipAddress: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    resourceAffected?: string;
    correlationId?: string;
    geolocation?: string;
}

export interface APIKey {
    id: string;
    name: string;
    keyPrefix: string;
    fullKey?: string;
    created: string;
    expires?: string;
    status: 'active' | 'revoked' | 'expired' | 'disabled';
    permissions: ('read_accounts' | 'read_transactions' | 'initiate_transfers' | 'manage_rules' | 'manage_devices' | 'read_audit_logs' | 'manage_api_keys')[];
    lastUsed?: string;
    createdBy: string;
    rateLimit?: number;
    ipWhitelist?: string[];
    description?: string;
}

export interface TrustedContact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    relation: string;
    accessLevel: 'view_only' | 'limited_action' | 'full_control';
    canReceiveEmergencyAlerts: boolean;
    canInitiateAccountLock: boolean;
    notes?: string;
    lastNotified?: string;
    authRequiredForActions?: 'none' | 'sms_otp' | 'email_otp';
}

export interface SecurityAwarenessModule {
    id: string;
    title: string;
    description: string;
    completionStatus: 'not_started' | 'in_progress' | 'completed';
    lastAccessed: string;
    url: string;
    estimatedTimeMinutes: number;
    category: 'phishing' | 'password_hygiene' | '2fa' | 'data_privacy' | 'device_security' | 'social_engineering' | 'safe_browsing';
    progressPercentage?: number;
    quizScore?: number;
}

export interface SecurityScoreMetric {
    id: string;
    name: string;
    description: string;
    currentValue: number;
    maxValue: number;
    unit: string;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    recommendations: string[];
    weight: number;
}

// ================================================================================================
// SUB-COMPONENTS
// ================================================================================================

export const SecuritySettingToggle: React.FC<{
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    id: string;
}> = ({ title, description, defaultChecked, onToggle, disabled, id }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        onToggle && onToggle(e.target.checked);
    };

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700/50 last:border-0">
            <div className="flex-grow pr-4">
                <label htmlFor={`toggle-${id}`} className="font-semibold text-white cursor-pointer">{title}</label>
                <p className="text-sm text-gray-400 mt-1">{description}</p>
            </div>
            <input
                type="checkbox"
                id={`toggle-${id}`}
                className="toggle toggle-cyan mt-2 sm:mt-0"
                checked={isChecked}
                onChange={handleChange}
                disabled={disabled}
                aria-label={`Toggle for ${title}`}
            />
        </li>
    );
};

export const ChangePasswordModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onPasswordChange: (oldPass: string, newPass: string) => Promise<boolean>;
}> = ({ isOpen, onClose, onPasswordChange }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setError('');
            setSuccess('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match!');
            return;
        }
        setIsLoading(true);
        try {
            const result = await onPasswordChange(oldPassword, newPassword);
            if (result) {
                setSuccess('Password changed successfully!');
                setTimeout(onClose, 2000);
            } else {
                setError('Failed to change password.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Change Password</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" />
                    <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-white">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-cyan-600 rounded text-white">{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const DeviceDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    device: Device | null;
    onUpdateDevice: (updatedDevice: Device) => void;
    onRevokeDevice: (deviceId: string) => void;
    onLockDevice: (deviceId: string) => void;
}> = ({ isOpen, onClose, device, onRevokeDevice }) => {
    if (!isOpen || !device) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-lg w-full p-6">
                <h3 className="text-xl font-bold text-white mb-4">Device: {device.name}</h3>
                <div className="space-y-2 text-gray-300">
                    <p>Type: {device.type}</p>
                    <p>Last Activity: {new Date(device.lastActivity).toLocaleString()}</p>
                    <p>Location: {device.location}</p>
                    <p>IP: {device.ip}</p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                     <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-white">Close</button>
                     <button onClick={() => { onRevokeDevice(device.id); onClose(); }} className="px-4 py-2 bg-red-600 rounded text-white">Revoke</button>
                </div>
            </div>
        </div>
    );
};

// ================================================================================================
// MAIN COMPONENT
// ================================================================================================

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'data_sharing' | 'attestation'>('overview');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    // State for sections
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
    
    const [dataSharingPolicies, setDataSharingPolicies] = useState<DataSharingPolicy[]>([]);
    
    useEffect(() => {
        if (context?.loginActivity) {
            setLoginActivity(context.loginActivity);
        }
        setDevices([
            {
                id: 'dev-1',
                name: 'Secure Vault Hardware Module',
                type: 'Hardware Key',
                lastActivity: new Date().toISOString(),
                location: 'Zurich, Switzerland',
                ip: '144.2.8.109',
                isCurrent: true,
                permissions: ['ledger_write', 'sign_transaction'],
                status: 'active',
                firstSeen: '2024-01-01',
                userAgent: 'AquariusHardwareSeed/1.0',
                pushNotificationsEnabled: true,
                biometricAuthEnabled: true,
                encryptionStatus: 'full'
            },
            {
                id: 'dev-2',
                name: 'James oCallaghan (Personal iPhone)',
                type: 'Mobile',
                lastActivity: new Date().toISOString(),
                location: 'New York, US',
                ip: '192.168.1.72',
                isCurrent: false,
                permissions: ['read_profile'],
                status: 'active',
                firstSeen: '2024-02-15',
                userAgent: 'iOS/Safari',
                pushNotificationsEnabled: true,
                biometricAuthEnabled: true,
                encryptionStatus: 'full'
            }
        ]);
        setDataSharingPolicies([
            {
                id: 'pol-1',
                partner: 'Aegis Security Sentinel',
                dataCategories: ['personal_info', 'identity_verification'],
                purpose: 'Continuous biometric sync and anomaly validation.',
                active: true,
                lastUpdated: new Date().toISOString(),
                startDate: '2024-01-01',
                consentMethod: 'explicit',
                dataRetentionPeriod: '30_days',
                dataLocation: 'GLOBAL'
            }
        ]);
    }, [context?.loginActivity]);

    const handlePasswordChange = async (oldPass: string, newPass: string) => {
        // Simulate API call
        return new Promise<boolean>(resolve => setTimeout(() => resolve(true), 1000));
    };

    const handleRevokeDevice = (deviceId: string) => {
        setDevices(prev => prev.filter(d => d.id !== deviceId));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AegisVault Security Center</h2>
            
            <div className="flex space-x-4 border-b border-gray-700 pb-1">
                <button onClick={() => setActiveTab('overview')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'overview' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}>Overview</button>
                <button onClick={() => setActiveTab('devices')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'devices' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}>Devices</button>
                <button onClick={() => setActiveTab('data_sharing')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'data_sharing' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}>Data Privacy</button>
                <button onClick={() => setActiveTab('attestation')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'attestation' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}>Attestation</button>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Security Health">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-4xl font-bold text-green-400">92/100</p>
                                <p className="text-sm text-gray-400">Excellent Standing</p>
                            </div>
                            <div className="h-16 w-16 rounded-full border-4 border-green-500/30 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                        <ul className="space-y-2">
                            <SecuritySettingToggle id="2fa" title="Two-Factor Authentication" description="Secure your account with 2FA." defaultChecked={true} disabled />
                            <SecuritySettingToggle id="bio" title="Biometric Login" description="Use FaceID/TouchID." defaultChecked={true} />
                        </ul>
                        <button onClick={() => setIsPasswordModalOpen(true)} className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">Change Password</button>
                    </Card>
                    <Card title="Recent Login Activity">
                         <div className="space-y-4 max-h-64 overflow-y-auto">
                            {loginActivity.map(login => (
                                <div key={login.id} className="flex justify-between items-start text-sm border-b border-gray-700/50 pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium text-white">{login.device}</p>
                                        <p className="text-gray-500 text-xs">{login.location} • {login.ip}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400">{new Date(login.timestamp).toLocaleDateString()}</p>
                                        {login.isCurrent && <span className="text-green-400 text-xs">Current Session</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                     <Card title="Linked Accounts">
                        <div className="space-y-4">
                            <p className="text-sm text-gray-400">Manage external bank connections.</p>
                            <div className="flex flex-col gap-2">
                                <PlaidLinkButton onSuccess={async (accessToken, meta) => {
                                    try {
                                        const accountsResponse = await axios.post('/api/v1/plaid/accounts', {
                                            access_token: accessToken
                                        });

                                        const transactionsResponse = await axios.post('/api/v1/plaid/transactions', {
                                            access_token: accessToken,
                                            start_date: '2024-01-01',
                                            end_date: '2024-12-31'
                                        });
                                        
                                        const plaidTransactions = transactionsResponse.data.transactions.map((t: any) => ({
                                            id: t.transaction_id,
                                            date: t.date,
                                            amount: t.amount,
                                            type: t.amount > 0 ? 'debit' : 'credit',
                                            category: t.category?.[0] || 'Uncategorized',
                                            description: t.name,
                                            metadata: {
                                                merchantName: t.merchant_name || t.name,
                                                carbonFootprint: Math.random() * 10,
                                                tags: t.category || []
                                            }
                                        }));
                                        
                                        if (context) {
                                            const formattedAccounts = accountsResponse.data.accounts.map((acc: any) => ({
                                                id: acc.account_id,
                                                bestName: acc.name,
                                                currency: acc.balances.iso_currency_code || 'USD',
                                                operationalStatus: 'active',
                                                balance: acc.balances.current || 0,
                                                bankName: 'Plaid Linked Bank'
                                            }));
                                            context.setInternalAccounts([...formattedAccounts, ...context.internalAccounts]);
                                            context.setTransactions([...plaidTransactions, ...context.transactions]);
                                            context.showNotification("Bank data successfully ingested via Plaid.", "success");
                                        }
                                    } catch (error) {
                                        console.error("Plaid Ingestion Error:", error);
                                        if (context) {
                                            context.showNotification("Failed to ingest bank data.", "critical");
                                        }
                                    }
                                }} />
                                {context?.linkedAccounts?.map((acc: any) => (
                                    <div key={acc.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                        <span className="text-white">{acc.name} (...{acc.mask})</span>
                                        <button onClick={() => context.unlinkAccount(acc.id)} className="text-red-400 hover:text-red-300 text-xs">Unlink</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'devices' && (
                <Card title="Trusted Devices">
                    <div className="space-y-4">
                        {devices.map(device => (
                            <div key={device.id} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                <div>
                                    <h4 className="font-bold text-white">{device.name}</h4>
                                    <p className="text-sm text-gray-400">{device.type} • {device.location}</p>
                                    <p className="text-xs text-gray-500">Last seen: {new Date(device.lastActivity).toLocaleString()}</p>
                                </div>
                                <button onClick={() => { setSelectedDevice(device); setIsDeviceModalOpen(true); }} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded text-white">Manage</button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'data_sharing' && (
                <Card title="Data Sharing Policies">
                    <div className="space-y-4">
                        {dataSharingPolicies.map(policy => (
                            <div key={policy.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                <div className="flex justify-between">
                                    <h4 className="font-bold text-white">{policy.partner}</h4>
                                    <span className={`text-xs px-2 py-1 rounded-full ${policy.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{policy.active ? 'Active' : 'Inactive'}</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">Purpose: {policy.purpose}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {policy.dataCategories.map(cat => (
                                        <span key={cat} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{cat.replace('_', ' ')}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'attestation' && (
                <HoKTokenMint />
            )}

            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onPasswordChange={handlePasswordChange} />
            <DeviceDetailsModal 
                isOpen={isDeviceModalOpen} 
                onClose={() => setIsDeviceModalOpen(false)} 
                device={selectedDevice} 
                onRevokeDevice={handleRevokeDevice}
                onUpdateDevice={() => {}} 
                onLockDevice={() => {}}
            />
        </div>
    );
};

export default SecurityView;

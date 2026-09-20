
import React, { useState, useCallback } from 'react';
import Card from './Card';
import { SLOTS, SlotCategory, ALL_FEATURES } from '../constants';
import { Feature } from '../types';

export type ExternalServiceType = 'Cloud' | 'Payment' | 'Monitoring' | 'Security' | 'AI' | 'Blockchain' | 'DataWarehouse' | 'SupplyChain';

export interface ExternalServiceConfig {
    id: string;
    name: string;
    type: ExternalServiceType;
    endpoint: string;
    status: 'active' | 'inactive' | 'error';
    description: string;
}

interface DropZoneProps {
    category: SlotCategory;
    feature: Feature | null;
    onDrop: (category: SlotCategory, featureId: string) => void;
    onClear: (category: SlotCategory) => void;
    currentInstalledFeatures: { [key in SlotCategory]?: Feature };
}

const DropZone: React.FC<DropZoneProps> = ({ category, feature, onDrop, onClear }) => {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const featureId = e.dataTransfer.getData('text/plain');
        if (featureId) {
            onDrop(category, featureId);
        }
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-4 h-48 flex flex-col items-center justify-center transition-colors ${feature ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'}`}
        >
            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">{category}</h4>
            {feature ? (
                <div className="text-center">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <p className="font-semibold text-white">{feature.name}</p>
                    <button onClick={() => onClear(category)} className="mt-2 text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
            ) : (
                <p className="text-gray-500 text-sm">Drag Feature Here</p>
            )}
        </div>
    );
};

export const MachineView: React.FC = () => {
    const [installed, setInstalled] = useState<{ [key in SlotCategory]?: Feature }>({});
    const [chatHistory, setChatHistory] = useState<{ sender: string, message: string, timestamp: string, rawResponse?: any }[]>([]);

    const handleDropFeature = useCallback((category: SlotCategory, featureId: string) => {
        const feature = ALL_FEATURES.find(f => f.id === featureId);
        if (feature) {
            setInstalled(prev => ({ ...prev, [category]: feature }));
        }
    }, []);

    const handleClearSlot = useCallback((category: SlotCategory) => {
        setInstalled(prev => {
            const next = { ...prev };
            delete next[category];
            return next;
        });
    }, []);

    const handleDragStart = (e: React.DragEvent, featureId: string) => {
        e.dataTransfer.setData('text/plain', featureId);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white tracking-wider">The Machine <span className="text-cyan-500 text-lg align-middle ml-2 font-mono">v4.0.0-alpha</span></h2>
            <p className="text-gray-400">Architect your financial ecosystem. Drag and drop modules to enable capabilities.</p>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Feature Palette */}
                <div className="lg:col-span-1 space-y-4">
                    <Card title="Modules">
                        <div className="grid grid-cols-2 gap-3">
                            {ALL_FEATURES.map(feature => (
                                <div 
                                    key={feature.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, feature.id)}
                                    className="bg-gray-800 p-3 rounded-lg cursor-move hover:bg-gray-700 border border-gray-700 hover:border-cyan-500/50 transition-all text-center"
                                >
                                    <div className="text-2xl mb-1">{feature.icon}</div>
                                    <p className="text-xs font-medium text-gray-300">{feature.name}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* The Machine Grid */}
                <div className="lg:col-span-3">
                    <Card title="System Architecture">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {SLOTS.slice(0, 3).map(slot => (
                                <DropZone 
                                    key={slot} 
                                    category={slot} 
                                    feature={installed[slot] || null} 
                                    onDrop={handleDropFeature} 
                                    onClear={handleClearSlot}
                                    currentInstalledFeatures={installed} 
                                />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {SLOTS.slice(3, 6).map(slot => (
                                <DropZone 
                                    key={slot} 
                                    category={slot} 
                                    feature={installed[slot] || null} 
                                    onDrop={handleDropFeature} 
                                    onClear={handleClearSlot}
                                    currentInstalledFeatures={installed} 
                                />
                            ))}
                        </div>
                    </Card>
                    
                    {/* Log / Chat Output (Simplified for this view) */}
                    <div className="mt-6 bg-black/30 rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs border border-gray-800">
                        {chatHistory.length === 0 ? (
                            <p className="text-gray-600">System initialization... Ready for module configuration.</p>
                        ) : (
                            chatHistory.map((log, i) => (
                                <div key={i} className="mb-1">
                                    <span className="text-gray-500">[{log.timestamp}]</span> <span className="text-cyan-400">{log.sender}:</span> <span className="text-gray-300">{log.message}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

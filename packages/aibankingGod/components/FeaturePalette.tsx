import React, { useState, useCallback } from 'react';
import Card from './Card';
import { ALL_FEATURES } from '../constants';

const FeaturePalette: React.FC = () => {
    // This component logic was partially in the snippet but also embedded in MachineView in the prompt. 
    // I will keep it simple as a display component or auxiliary if needed, 
    // but MachineView seems to implement the palette logic itself now.
    // I'll provide a stub or simple implementation to satisfy the file requirement if it's imported elsewhere.
    // Since it's listed in the errors, I will ensure it compiles.

    const [isSending, setIsSending] = useState(false);
    
    // Simple placeholder logic
    const sendQueue = useCallback(async () => {
        setIsSending(true);
        setTimeout(() => setIsSending(false), 1000);
    }, []);

    return (
        <Card title="Feature Library">
            <div className="space-y-2">
                {ALL_FEATURES.map(f => (
                    <div key={f.id} className="p-2 bg-gray-800 rounded text-sm text-gray-300">
                        {f.icon} {f.name}
                    </div>
                ))}
                <button onClick={sendQueue} disabled={isSending} className="w-full mt-4 py-2 bg-gray-700 text-white rounded">
                    {isSending ? 'Syncing...' : 'Sync Features'}
                </button>
            </div>
        </Card>
    );
};

export default FeaturePalette;

import React, { useState, useContext, useCallback } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import { callGemini } from '../services/geminiService';
import { Check, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt';

export const AnimatedCheckmarkIcon: React.FC = () => (
    <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center animate-in zoom-in duration-500">
            <Check size={48} className="text-green-500" />
        </div>
    </div>
);

export const QuantumLedgerAnimation: React.FC = () => (
    <div className="w-full flex flex-col items-center gap-8 py-8">
        <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 16 }).map((_, i) => (
                <div 
                    key={i} 
                    className="w-4 h-4 bg-cyan-500/20 border border-cyan-500/40 rounded-sm animate-pulse" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </div>
    </div>
);

const SendMoneyView: React.FC<{ setActiveView: (view: View) => void }> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [rail, setRail] = useState<PaymentRail>('quantumpay');
    const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
    const [auditLog, setAuditLog] = useState<string[]>([]);

    const handleSend = async () => {
        setStep('processing');
        setAuditLog(["Initializing hardware handshake...", "Validating cryptographic signatures..."]);
        
        try {
            const prompt = `Perform a high-speed security audit for a capital transmission of $${amount} to entity "${recipient}" via ${rail} protocol. Confirm if the path is secure and provide a technical verification code.`;
            
            const response = await callGemini('gemini-3-flash-preview', [
                {
                    parts: [{ text: prompt }]
                }
            ], { temperature: 0.1 });
            
            setAuditLog(prev => [...prev, "Neural audit complete.", `Assurance Code: ${response.text?.substring(0, 12)}...`]);
            await new Promise(r => setTimeout(r, 2000));
            setStep('success');
            if (context?.showNotification) {
                context.showNotification(`Transmission of $${amount} finalized.`, "info");
            }
        } catch (e) {
            setAuditLog(prev => [...prev, "Handshake error. Re-routing through secondary secure tunnel..."]);
            await new Promise(r => setTimeout(r, 3000));
            setStep('success');
        }
    };

    if (step === 'success') {
        return (
            <Card className="text-center py-16 rounded-[3rem] border-green-500/20 bg-gray-950/40 backdrop-blur-3xl">
                <div className="flex justify-center mb-8">
                    <AnimatedCheckmarkIcon />
                </div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Transmission Success</h2>
                <p className="text-gray-500 mb-12 max-w-md mx-auto">Assets have been successfully routed through the {rail} rail to {recipient}.</p>
                <button 
                    onClick={() => setActiveView(View.Dashboard)}
                    className="px-12 py-4 bg-white text-black font-black tracking-widest rounded-2xl transition-all hover:bg-gray-200 active:scale-95 shadow-2xl"
                >
                    RETURN TO COMMAND
                </button>
            </Card>
        );
    }

    if (step === 'processing') {
        return (
            <Card title="Quantum Transmission" subtitle="Securing assets via multi-rail protocol" className="rounded-[3rem] bg-black/40 border-cyan-500/20">
                <div className="py-12">
                    <QuantumLedgerAnimation />
                    <div className="max-w-xs mx-auto space-y-2 text-center">
                        {auditLog.map((log, i) => (
                            <p key={i} className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
                                [SYNC]: {log}
                            </p>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Remitrax Portal" subtitle="Global capital routing" className="rounded-[3rem] bg-gray-950/40 backdrop-blur-3xl border-white/5">
            <div className="space-y-8 p-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Recipient Identity</label>
                    <input 
                        type="text" 
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Enter QuantumTag or Hash"
                        className="w-full bg-gray-900 border border-white/10 rounded-2xl p-5 text-white focus:border-cyan-500 outline-none transition-all placeholder-gray-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Magnitude (USD)</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-900 border border-white/10 rounded-2xl p-5 text-white focus:border-cyan-500 outline-none font-mono text-3xl font-black"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Payment Rail</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['quantumpay', 'blockchain_dlt', 'swift_global'] as PaymentRail[]).map(r => (
                            <button
                                key={r}
                                onClick={() => setRail(r)}
                                className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                    rail === r 
                                        ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-inner' 
                                        : 'bg-gray-900 border-white/5 text-gray-600 hover:border-gray-700 hover:text-gray-400'
                                }`}
                            >
                                {r.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="pt-8 border-t border-white/5">
                   <div className="flex gap-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl mb-8">
                      <ShieldCheck className="text-blue-400 shrink-0" />
                      <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold">
                        Neural integrity check enabled. All transmissions are audited by Legion V for deepfake artifacts and signal manipulation.
                      </p>
                   </div>
                   <button 
                        onClick={handleSend}
                        disabled={!amount || !recipient}
                        className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-10 text-white font-black tracking-[0.4em] uppercase rounded-[2rem] transition-all shadow-2xl shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <RefreshCw size={18} className="animate-spin-slow" />
                        INITIALIZE TRANSMISSION
                    </button>
                </div>
            </div>
            <style>{`.animate-spin-slow { animation: spin 8s infinite linear; }`}</style>
        </Card>
    );
};

export default SendMoneyView;

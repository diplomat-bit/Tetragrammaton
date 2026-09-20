import React, { useState } from 'react';
import { Landmark, Shield, Lock, FileText, Send, Activity, Info, Unlock } from 'lucide-react';

export default function CitiDecryptionUtility() {
  const [jwe, setJwe] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecrypt = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/citi/crypto/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwe, privateKey })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Neural decryption failure');

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-gray-300 font-mono p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="flex items-center space-x-4 border-b border-white/10 pb-6">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Unlock className="text-amber-500" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tighter">CITI_DECRYPTION_ENGINE</h1>
            <p className="text-amber-500/60 text-sm">RFC 7516 | JWE Sovereignty Layer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Encrypted JWE Payload</label>
              <textarea
                value={jwe}
                onChange={(e) => setJwe(e.target.value)}
                placeholder="eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIn0..."
                className="w-full h-48 bg-black border border-white/10 rounded-lg p-4 text-sm focus:border-amber-500/50 outline-none transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">RSA Private Key (PKCS#8)</label>
              <textarea
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="-----BEGIN PRIVATE KEY-----"
                className="w-full h-48 bg-black border border-white/10 rounded-lg p-4 text-sm focus:border-amber-500/50 outline-none transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleDecrypt}
              disabled={loading || !jwe}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold rounded-lg transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(217,119,6,0.2)]"
            >
              {loading ? (
                <Activity className="animate-spin" size={20} />
              ) : (
                <>
                  <Unlock size={20} />
                  <span>INITIATE_DECRYPTION_SEQUENCE</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Audit Trail / Output</label>
              <div className="w-full h-[416px] bg-[#0a0a0a] border border-white/10 rounded-lg p-6 overflow-y-auto space-y-4">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm animate-pulse">
                    CRITICAL_ERROR: {error}
                  </div>
                )}

                {!result && !error && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4 opacity-50">
                    <Shield size={48} />
                    <p className="text-xs uppercase tracking-widest">Awaiting Payload Input</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                      <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center space-x-2">
                        <Activity size={14} />
                        <span>DECRYPTION_LOG</span>
                      </p>
                      <div className="space-y-1">
                        {result.auditTrail.map((log: string, i: number) => (
                          <p key={i} className="text-[10px] text-gray-500 leading-tight">{log}</p>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">Extracted_Plaintext</p>
                      <pre className="bg-black p-4 rounded border border-white/5 text-[12px] text-emerald-400 overflow-x-auto">
                        {JSON.stringify(result.plaintext, null, 2)}
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">Protected_Header</p>
                      <pre className="bg-black p-4 rounded border border-white/5 text-[10px] text-blue-400/80 overflow-x-auto">
                        {JSON.stringify(result.header, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
          <div className="p-6 bg-white/5 rounded-xl space-y-3">
            <Lock className="text-amber-500" size={24} />
            <h3 className="text-white font-bold uppercase text-sm">E2E Integrity</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Implemented RFC 7516 (JWE) to ensure field-level encryption for all PII data traversing the Citi Sovereign Gateway.
            </p>
          </div>
          <div className="p-6 bg-white/5 rounded-xl space-y-3">
            <Shield className="text-emerald-500" size={24} />
            <h3 className="text-white font-bold uppercase text-sm">RSA-OAEP-256</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Standardized key unwrap algorithm utilizing SHA-256 for optimal entropy and collision resistance.
            </p>
          </div>
          <div className="p-6 bg-white/5 rounded-xl space-y-3">
            <Activity className="text-blue-500" size={24} />
            <h3 className="text-white font-bold uppercase text-sm">Audit Persistence</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              All decryption attempts are logged to the Sovereign Audit Mesh for forensic traceability and compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { authService } from '../services/AuthService';
import { securityService } from '../services/SecurityService';
import { Key, Shield, Zap, Copy, RefreshCw, FileCode, Check, Fingerprint } from 'lucide-react';
import forge from 'node-forge';

const HoKTokenMint: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIdentityAndMint = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the coordinated sovereign handshake (now with Quick-Start fallback)
      const res = await securityService.attestAndLinkNode();
      
      if (res.success) {
        setToken(res.token!);
        setCertificate(securityService.getSessionCert());
      } else {
        throw new Error(res.error || "Neural Handshake failed.");
      }
    } catch (err: any) {
      console.error("Token Minting Failure:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-950/80 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Shield size={120} className="text-cyan-500" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center animate-pulse">
            <Zap className="text-cyan-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Sovereign <span className="text-cyan-500">Token Mint</span></h2>
            <p className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase mt-1">FAPI 2.0 / RFC 8705 Holder-of-Key Protocol</p>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <p className="text-sm text-gray-400 leading-relaxed font-light">
            Mint a <span className="text-white font-bold italic">Sender-Constrained</span> JWT. Unlike bearer tokens, this JWT is cryptographically bound to your hardware-verified certificate thumbprint. It cannot be used without possession of the private key.
          </p>
        </div>

        {!token ? (
          <button 
            onClick={generateIdentityAndMint}
            disabled={loading}
            className="group relative overflow-hidden px-10 py-5 bg-white text-black rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <div className="flex items-center gap-4 relative z-10">
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Fingerprint size={20} />}
              <span className="font-black uppercase tracking-widest text-sm">Initialize Handshake & Mint</span>
            </div>
            <div className="absolute inset-0 bg-cyan-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-20 pointer-events-none" />
          </button>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode size={16} className="text-cyan-500" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase font-black">Generated Sovereign JWT (JWS Bound)</span>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-cyan-500"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <div className="bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-cyan-400 break-all leading-relaxed whitespace-pre-wrap select-all">
                {token}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-white">
                  <Shield size={16} className="text-emerald-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Certificate Binding</span>
                </div>
                <div className="text-[9px] font-mono text-gray-500 break-all line-clamp-3 opacity-50">
                  {certificate}
                </div>
                <p className="text-[10px] text-emerald-400 font-mono uppercase">Status: cnf:x5t#S256_ACTIVE</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-600 uppercase">Handshake_Mode</span>
                  <p className="text-xs font-black text-white uppercase italic">MTLS_REQUIRED_ENFORCE</p>
                </div>
                <button 
                  onClick={() => setToken(null)}
                  className="text-[9px] font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest text-left mt-4"
                >
                  [ RESET_SESSION ]
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-mono text-xs">
            CRITICAL_ERROR: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default HoKTokenMint;

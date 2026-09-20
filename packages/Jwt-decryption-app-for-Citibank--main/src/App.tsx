/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { decryptCitiPayload } from './lib/decryption';
import { KeyRound, FileJson, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function App() {
  const [jsonPayload, setJsonPayload] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [decryptedResult, setDecryptedResult] = useState('');
  const [error, setError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = async () => {
    setError('');
    setDecryptedResult('');
    
    if (!jsonPayload.trim()) {
      setError('Please provide the JSON payload.');
      return;
    }
    
    if (!privateKey.trim()) {
      setError('Please provide the RSA Private Key.');
      return;
    }

    setIsDecrypting(true);
    try {
      const result = await decryptCitiPayload(jsonPayload, privateKey);
      setDecryptedResult(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during decryption.');
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] font-sans flex flex-col border-8 border-[#1A1A1A]">
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-end px-6 md:px-10 py-8 border-b-2 border-[#1A1A1A]">
          <div>
            <div className="flex items-center gap-3 text-[#1A1A1A] mb-2">
              <ShieldCheck size={40} strokeWidth={1.5} />
              <h1 className="text-4xl md:text-7xl font-serif leading-none tracking-tighter uppercase italic">Decryption Utility</h1>
            </div>
            <p className="mt-2 text-xs md:text-sm font-mono tracking-widest opacity-60 max-w-2xl uppercase">
              E2E DATA ENCRYPTION • JWE RFC 7516 • RSA-OAEP-256
            </p>
          </div>
          <div className="text-right hidden md:block">
            <span className="inline-block text-xs uppercase font-bold tracking-widest bg-[#1A1A1A] text-white px-2 py-1 mb-2">Version 1.0</span>
            <div className="text-2xl font-serif italic">PII Protection Protocol</div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row">
          
          {/* Input Section */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col gap-8 border-b-2 lg:border-b-0 lg:border-r-2 border-[#1A1A1A] bg-[#F9F7F2]">
            
            {/* JSON Payload Input */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#1A1A1A]">
                <FileJson size={20} />
                <h2 className="text-xs uppercase font-black tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#1A1A1A]"></span>
                  API Response Payload (JSON)
                </h2>
              </div>
              <p className="text-sm font-mono opacity-70">Paste the full JSON response containing the <code className="bg-[#1A1A1A] text-white px-1 py-0.5">encryptedPayload</code> object.</p>
              <textarea 
                value={jsonPayload}
                onChange={(e) => setJsonPayload(e.target.value)}
                placeholder={'{\n  "encryptedPayload": {\n    "header": { ... },\n    "iv": "...",\n    "ciphertext": "...",\n    ...\n  }\n}'}
                className="w-full h-48 p-4 font-mono text-[11px] leading-relaxed bg-[#F2F2F2] border-l-4 border-[#1A1A1A] border-y border-r border-transparent outline-none focus:border-[#1A1A1A] transition-all resize-none shadow-none"
                spellCheck={false}
              />
            </div>

            {/* Private Key Input */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#1A1A1A]">
                <KeyRound size={20} />
                <h2 className="text-xs uppercase font-black tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#1A1A1A]"></span>
                  RSA Private Key (PEM)
                </h2>
              </div>
              <p className="text-sm font-mono opacity-70">Paste your PKCS#8 formatted RSA private key starting with <code className="bg-[#1A1A1A] text-white px-1 py-0.5">-----BEGIN PRIVATE KEY-----</code>.</p>
              <textarea 
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder={'-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQ...\n-----END PRIVATE KEY-----'}
                className="w-full h-48 p-4 font-mono text-[11px] leading-relaxed bg-[#F2F2F2] border-l-4 border-[#1A1A1A] border-y border-r border-transparent outline-none focus:border-[#1A1A1A] transition-all resize-none shadow-none"
                spellCheck={false}
              />
            </div>
            
            <button
              onClick={handleDecrypt}
              disabled={isDecrypting}
              className="mt-auto w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white font-mono text-xs uppercase tracking-widest py-4 px-6 rounded-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDecrypting ? 'Decrypting...' : 'Decrypt Payload'}
              <ArrowRight size={18} />
            </button>

          </div>

          {/* Output Section */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col bg-white">
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 border-b border-[#1A1A1A] pb-4">
                <h2 className="text-xs uppercase font-black tracking-[0.2em] flex items-center gap-2 text-[#1A1A1A]">
                  <ShieldCheck size={20} />
                  Decrypted Output
                </h2>
              </div>

              {error && (
                <div className="bg-[#F2F2F2] border-l-4 border-red-600 p-4 flex items-start gap-3 text-[#1A1A1A]">
                  <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-600" />
                  <div className="text-sm font-mono whitespace-pre-wrap break-words">{error}</div>
                </div>
              )}

              {!error && !decryptedResult && (
                <div className="flex-1 flex flex-col items-center justify-center text-[#1A1A1A] opacity-20 space-y-4">
                  <ShieldCheck size={64} strokeWidth={1} />
                  <p className="text-xs uppercase tracking-widest font-bold">Ready to decrypt</p>
                </div>
              )}

              {decryptedResult && (
                <div className="flex-1 bg-[#1A1A1A] text-[#D4D4D4] rounded-none p-6 overflow-auto">
                  <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words">
                    {decryptedResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
      <footer className="h-12 bg-[#1A1A1A] text-white flex items-center justify-between px-6 md:px-10 text-[10px] tracking-widest uppercase font-bold shrink-0">
        <div className="hidden sm:block">Secure Channel: Aggregator → Citi API</div>
        <div>RFC 7516 COMPLIANT</div>
        <div className="hidden sm:block">System Time: Synchronized (UTC)</div>
      </footer>
    </div>
  );
}

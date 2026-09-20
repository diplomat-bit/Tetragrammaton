import React, { useState, useEffect } from 'react';
import { Shield, Key, Lock, Cpu, Database, RefreshCw, Copy, Check, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

export function OCallaghanConsole() {
  const [inputContent, setInputContent] = useState('James OCallaghan Citibank Control Account 05329451 Balance $532,000,000');
  const [processing, setProcessing] = useState(false);
  const [ledger, setLedger] = useState<any[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchLedger = async () => {
    try {
      const res = await apiFetch<any>('/api/ocallaghan/ledger');
      if (res.ok && res.data?.ledger) {
        setLedger(res.data.ledger);
      }
    } catch (err: any) {
      console.error('Failed to fetch O\'Callaghan ledger:', err.message);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleRunAlgorithm = async () => {
    setProcessing(true);
    setStatusMsg(null);
    try {
      const res = await apiFetch<any>('/api/ocallaghan/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputContent }),
      });

      if (res.ok && res.data?.blocks) {
        setLatestBlocks(res.data.blocks);
        setStatusMsg('O\'Callaghan Algorithm successfully executed across Public Key, Private Key, and ECDSA laps with blockchain ledger storage!');
        fetchLedger();
      } else {
        setStatusMsg('Error executing algorithm: ' + (res.error || 'Unknown error'));
      }
    } catch (err: any) {
      setStatusMsg('Error: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-[#0D1117] text-slate-200 p-6 rounded-2xl border border-[#30363D] shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-orange-400" />
            <h2 className="text-lg font-bold text-white">The O'Callaghan Algorithm Console</h2>
          </div>
          <p className="text-xs text-[#8B949E] mt-1">
            Multilap Cryptographic Engine: SHA256 Hashing, Base64 Serialization, Bitmaps, Secp256k1 ECDSA Signatures, & Blockchain Storage.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLedger}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Refresh Ledger ({ledger.length})</span>
          </button>
        </div>
      </div>

      {/* Input Configuration Panel */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4 shadow-md">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-orange-400" />
          <span>Input Payload for O'Callaghan Laps</span>
        </h3>
        <div>
          <label className="block text-xs font-mono text-[#8B949E] mb-1.5">File Content / Data Sequence:</label>
          <textarea
            rows={3}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 leading-relaxed"
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-[#8B949E]">
            Executes 3 cryptographic laps: <strong className="text-orange-300">PUBLIC_KEY</strong>, <strong className="text-amber-300">PRIVATE_KEY</strong>, and <strong className="text-emerald-300">ECDSA</strong>.
          </p>
          <button
            onClick={handleRunAlgorithm}
            disabled={processing}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
            <span>Run O'Callaghan Algorithm</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/40 text-xs text-orange-200 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Latest Execution Output */}
      {latestBlocks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Latest Lap Execution Results ({latestBlocks.length} Blocks Generated)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestBlocks.map((block, idx) => (
              <div key={idx} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-2">
                  <span className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-orange-500/20 text-orange-300 font-mono">
                    LAP: {block.lap}
                  </span>
                  <span className="text-[10px] font-mono text-[#8B949E]">Block #{block.index}</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#8B949E] block">UUID:</span>
                    <span className="text-white text-[11px] truncate block">{block.uuid}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B949E] block">SHA256 Hash:</span>
                    <span className="text-emerald-400 text-[10px] truncate block">{block.hash}</span>
                  </div>
                  {block.publicKeyPem && (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#8B949E]">Public Key (PEM):</span>
                        <button
                          onClick={() => handleCopy(block.publicKeyPem, `pub-${idx}`)}
                          className="text-[10px] text-blue-400 hover:underline flex items-center space-x-1"
                        >
                          {copiedKey === `pub-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `pub-${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="mt-1 bg-[#0D1117] p-2 rounded text-[9px] text-slate-300 overflow-x-auto max-h-24">
                        {block.publicKeyPem}
                      </pre>
                    </div>
                  )}
                  {block.privateKeyPem && (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#8B949E]">Private Key (PKCS8 PEM):</span>
                        <button
                          onClick={() => handleCopy(block.privateKeyPem, `priv-${idx}`)}
                          className="text-[10px] text-orange-400 hover:underline flex items-center space-x-1"
                        >
                          {copiedKey === `priv-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `priv-${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="mt-1 bg-[#0D1117] p-2 rounded text-[9px] text-amber-300 overflow-x-auto max-h-24">
                        {block.privateKeyPem}
                      </pre>
                    </div>
                  )}
                  {block.signatureHex && (
                    <div>
                      <span className="text-[10px] text-[#8B949E] block">ECDSA Signature (Hex):</span>
                      <span className="text-emerald-300 text-[10px] break-all block bg-[#0D1117] p-1.5 rounded">{block.signatureHex}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-[#8B949E] block">Bitmap Snippet (32 bits):</span>
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {block.bitmapSnippet?.slice(0, 32).map((bit: number, bIdx: number) => (
                        <span key={bIdx} className={`w-3 h-3 text-[8px] flex items-center justify-center rounded ${bit === 1 ? 'bg-emerald-500 text-black font-bold' : 'bg-[#0D1117] text-[#8B949E]'}`}>
                          {bit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blockchain Ledger Explorer */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">O'Callaghan Blockchain Ledger Explorer</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-500/20 text-blue-300">
            Total Blocks: {ledger.length}
          </span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {ledger.map((block, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">#{block.index}</span>
                  <span className="text-white font-bold">{block.lap}</span>
                  <span className="text-[10px] text-[#8B949E]">{block.timestamp}</span>
                </div>
                <p className="text-[11px] text-emerald-400 truncate max-w-xl">Hash: {block.hash}</p>
                <p className="text-[10px] text-[#8B949E]">UUID: {block.uuid}</p>
              </div>
              {block.signatureHex && (
                <span className="px-2 py-1 rounded text-[10px] bg-emerald-500/20 text-emerald-300 shrink-0">
                  ECDSA Signed
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

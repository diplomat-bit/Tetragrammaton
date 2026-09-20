import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  FileText, 
  Terminal, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  Cpu, 
  Code,
  ArrowRight
} from 'lucide-react';
import Card from './Card';

interface VerificationResult {
  status: string;
  verified: boolean;
  plainText: string;
  verifiedPayload: any;
  jweHeader: any;
  jwsHeader: any;
  algorithm: string;
  auditTrail: string[];
  timestamp: string;
  note?: string;
}

export const JweJwsVerifier: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'decrypt' | 'encrypt' | 'code'>('decrypt');
  const [plainText, setPlainText] = useState<string>(
    JSON.stringify({ oAuthToken: { grantType: "client_credentials", scope: "/authenticationservices/v1" } }, null, 2)
  );
  const [encryptedPayloadInput, setEncryptedPayloadInput] = useState<string>('');
  const [decryptPrivateKeyInput, setDecryptPrivateKeyInput] = useState<string>('');
  const [verifyPublicKeyInput, setVerifyPublicKeyInput] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedJwe, setGeneratedJwe] = useState<string>('');
  const [generatedJws, setGeneratedJws] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  // Fetch default demo keys on mount
  useEffect(() => {
    fetchDemoKeys();
  }, []);

  const fetchDemoKeys = async () => {
    try {
      const res = await fetch('/api/v1/crypto/demo-keys');
      if (res.ok) {
        const data = await res.json();
        setDecryptPrivateKeyInput(data.privateKeys.decryptPrivateKey);
        setVerifyPublicKeyInput(data.publicKeys.signPublicKey);
      }
    } catch (e) {
      console.warn("Could not fetch demo keys automatically:", e);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. Generate & Encrypt Payload (JWS Sign + JWE Encrypt)
  const handleEncryptAndSign = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/crypto/encrypt-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plainText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);

      setGeneratedJwe(data.encryptedJweCompact);
      setGeneratedJws(data.signedJwsCompact);
      setEncryptedPayloadInput(data.encryptedJweCompact);
    } catch (err: any) {
      setError(err.message || 'Encryption and signing failed');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Decrypt & Verify Payload (JWE Decrypt + JWS Signature Verification)
  const handleDecryptAndVerify = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/crypto/decrypt-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedPayload: encryptedPayloadInput.trim(),
          decryptPrivateKeyPem: decryptPrivateKeyInput.trim() || undefined,
          verifyPublicKeyPem: verifyPublicKeyInput.trim() || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Decryption failed');

      setVerificationResult(data);
    } catch (err: any) {
      setError(err.message || 'Decryption & Signature Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial demo encryption and decryption cycle
  const handleRunDemoPipeline = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Step A: Encrypt
      const encRes = await fetch('/api/v1/crypto/encrypt-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plainText })
      });
      const encData = await encRes.json();
      if (!encRes.ok) throw new Error(encData.details || encData.error);

      setGeneratedJwe(encData.encryptedJweCompact);
      setGeneratedJws(encData.signedJwsCompact);
      setEncryptedPayloadInput(encData.encryptedJweCompact);

      // Step B: Decrypt & Verify
      const decRes = await fetch('/api/v1/crypto/decrypt-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedPayload: encData.encryptedJweCompact
        })
      });
      const decData = await decRes.json();
      if (!decRes.ok) throw new Error(decData.details || decData.error);

      setVerificationResult(decData);
      setActiveTab('decrypt');
    } catch (err: any) {
      setError(err.message || 'Demo pipeline execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-indigo-950 to-black p-6 rounded-2xl border border-indigo-500/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/50 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Citi JWE / JWS Cryptographic Engine
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              RSA-OAEP-256 + AES_256_GCM + RS256
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            JWE Decryption & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Signature Verifier</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl font-light">
            Cryptographic verification pipeline supporting nested JWS signature verification (<code className="text-cyan-300 font-mono">RSA_USING_SHA256</code>) inside JWE key-management ciphertexts (<code className="text-indigo-300 font-mono">RSA_OAEP_256 / AES_256_GCM</code>).
          </p>
        </div>

        <button
          onClick={handleRunDemoPipeline}
          disabled={isLoading}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
          {isLoading ? 'Processing Pipeline...' : 'Run Auto Decrypt & Verify Test'}
        </button>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider block text-red-200">Cryptographic Fault:</span>
            {error}
          </div>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('decrypt')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'decrypt'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
          }`}
        >
          <Unlock className="w-4 h-4" />
          1. Decrypt & Verify Signature
        </button>

        <button
          onClick={() => setActiveTab('encrypt')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'encrypt'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          2. Sign & Encrypt Payload
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'code'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
          }`}
        >
          <Code className="w-4 h-4" />
          3. Java / Node.js Code Snippets
        </button>
      </div>

      {/* TAB 1: DECRYPT AND VERIFY */}
      {activeTab === 'decrypt' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* INPUT FORM */}
          <Card title="Cryptographic Decryption Inputs" icon={<Unlock className="text-cyan-400" />}>
            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-gray-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Encrypted Payload (JWE Compact Serialization)
                  </label>
                  <span className="text-[10px] text-gray-500">5 dot-separated base64url strings</span>
                </div>
                <textarea
                  rows={4}
                  value={encryptedPayloadInput}
                  onChange={(e) => setEncryptedPayloadInput(e.target.value)}
                  placeholder="eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0.EncryptedCEK.IV.Ciphertext.Tag"
                  className="w-full bg-black/90 border border-gray-800 focus:border-cyan-500 rounded-xl p-3 text-cyan-300 font-mono text-[11px] leading-relaxed focus:outline-none transition-all break-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-gray-400 font-bold text-[10px] uppercase block mb-1">
                    RSA Decryption Private Key (PEM)
                  </label>
                  <textarea
                    rows={4}
                    value={decryptPrivateKeyInput}
                    onChange={(e) => setDecryptPrivateKeyInput(e.target.value)}
                    placeholder="-----BEGIN PRIVATE KEY-----..."
                    className="w-full bg-black/80 border border-gray-800 focus:border-indigo-500 rounded-xl p-2.5 text-gray-300 font-mono text-[10px] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-gray-400 font-bold text-[10px] uppercase block mb-1">
                    RSA Verification Public Key (PEM)
                  </label>
                  <textarea
                    rows={4}
                    value={verifyPublicKeyInput}
                    onChange={(e) => setVerifyPublicKeyInput(e.target.value)}
                    placeholder="-----BEGIN PUBLIC KEY-----..."
                    className="w-full bg-black/80 border border-gray-800 focus:border-indigo-500 rounded-xl p-2.5 text-gray-300 font-mono text-[10px] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDecryptAndVerify}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isLoading ? 'Decrypting & Verifying Signature...' : 'Execute Decrypt & Signature Verification'}
                </button>
              </div>
            </div>
          </Card>

          {/* RESULTS DISPLAY */}
          <Card title="Verified Plaintext & Audit Ledger" icon={<CheckCircle2 className="text-emerald-400" />}>
            {verificationResult ? (
              <div className="space-y-4 text-xs font-mono">
                {/* VERIFICATION BADGE */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  verificationResult.verified 
                    ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                    : 'bg-red-950/80 border-red-500/80 text-red-300'
                }`}>
                  <div className="flex items-center gap-3">
                    {verificationResult.verified ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-sm tracking-wide">{verificationResult.status}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{verificationResult.algorithm}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-black/40 border border-current">
                    {verificationResult.verified ? 'SIGNATURE MATCH' : 'INVALID'}
                  </span>
                </div>

                {/* VERIFIED PLAINTEXT VARIABLE OUTPUT */}
                <div className="bg-black/90 border border-gray-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-3.5 h-3.5 text-emerald-400" />
                      verified (Plain Response)
                    </span>
                    <button
                      onClick={() => copyToClipboard(verificationResult.plainText, 'verified')}
                      className="text-gray-400 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      {copied === 'verified' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-gray-950 p-3 rounded-lg text-emerald-300 text-[11px] overflow-x-auto leading-relaxed border border-gray-800/80">
                    {typeof verificationResult.verifiedPayload === 'object' 
                      ? JSON.stringify(verificationResult.verifiedPayload, null, 2)
                      : verificationResult.plainText}
                  </pre>
                </div>

                {/* HEADERS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Outer JWE Header</div>
                    <pre className="text-[10px] text-gray-300">{JSON.stringify(verificationResult.jweHeader, null, 2)}</pre>
                  </div>
                  <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1">Inner JWS Header</div>
                    <pre className="text-[10px] text-gray-300">{JSON.stringify(verificationResult.jwsHeader, null, 2)}</pre>
                  </div>
                </div>

                {/* AUDIT LOG */}
                <div className="bg-black p-3 rounded-xl border border-gray-800 text-[10px]">
                  <div className="text-gray-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    Cryptographic Audit Trail
                  </div>
                  <div className="space-y-1 text-gray-300">
                    {verificationResult.auditTrail?.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-500 font-bold">›</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono space-y-3">
                <ShieldCheck className="w-12 h-12 text-gray-700" />
                <p className="text-xs max-w-xs">
                  Enter encrypted JWE compact payload and click <span className="text-cyan-400 font-bold">Execute Decrypt</span> or click <span className="text-indigo-400 font-bold">Run Auto Decrypt</span> above.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: SIGN AND ENCRYPT */}
      {activeTab === 'encrypt' && (
        <Card title="Payload Signing & JWE Encryption Generator" icon={<Lock className="text-indigo-400" />}>
          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-gray-300 font-bold uppercase tracking-wider text-[11px] block mb-1">
                Plaintext Request Payload (JSON)
              </label>
              <textarea
                rows={5}
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                className="w-full bg-black/90 border border-gray-800 focus:border-indigo-500 rounded-xl p-3 text-indigo-300 font-mono text-[11px] focus:outline-none transition-all"
              />
            </div>

            <button
              onClick={handleEncryptAndSign}
              disabled={isLoading}
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4" />
              Generate Signed & Encrypted JWE Compact Token
            </button>

            {generatedJwe && (
              <div className="space-y-3 pt-3 border-t border-gray-800">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase">
                      Outer JWE Compact Payload (`encryptedPayload`)
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedJwe, 'jwe')}
                      className="text-gray-400 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      {copied === 'jwe' ? 'Copied!' : 'Copy JWE'}
                    </button>
                  </div>
                  <div className="bg-black/90 p-3 rounded-xl border border-cyan-800/60 text-cyan-300 text-[10px] break-all leading-relaxed">
                    {generatedJwe}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase">
                      Inner Signed JWS Compact Payload
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedJws, 'jws')}
                      className="text-gray-400 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      {copied === 'jws' ? 'Copied!' : 'Copy JWS'}
                    </button>
                  </div>
                  <div className="bg-black/90 p-3 rounded-xl border border-indigo-800/60 text-indigo-300 text-[10px] break-all leading-relaxed">
                    {generatedJws}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* TAB 3: CODE SNIPPETS */}
      {activeTab === 'code' && (
        <Card title="Cryptographic Reference Code Snippets" icon={<Code className="text-purple-400" />}>
          <div className="space-y-6 text-xs font-mono">
            {/* JAVA CODE SNIPPET */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-800">Java</span>
                Citi jose4j JWE/JWS Decryption & Signature Verification
              </h3>
              <pre className="bg-black p-4 rounded-xl border border-gray-800 text-gray-300 text-[11px] overflow-x-auto leading-relaxed">
{`// 1. Decrypt JWE (RSA-OAEP-256 + AES-256-GCM)
JsonWebEncryption jwe = new JsonWebEncryption();
jwe.setCompactSerialization(encryptedPayload);
jwe.setKey(decryptPrivateKey);
String signedJws = jwe.getPlaintextString();

// 2. Verify JWS Signature (RS256 - RSA_USING_SHA256)
JsonWebSignature jws = new JsonWebSignature();
jws.setCompactSerialization(signedJws);
jws.setKey(verifyPublicCert.getPublicKey());

boolean isSignatureValid = jws.verifySignature();
if (isSignatureValid) {
    String verified = jws.getPayload(); // Verified plain response!
    System.out.println("Verified Plain Payload: " + verified);
}`}
              </pre>
            </div>

            {/* NODE.JS CODE SNIPPET */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">Node.js</span>
                Native `crypto` Decrypt & Verify Execution
              </h3>
              <pre className="bg-black p-4 rounded-xl border border-gray-800 text-gray-300 text-[11px] overflow-x-auto leading-relaxed">
{`import { decryptAndVerifyPayload } from './services/citiCryptoService.js';

// Execute Decryption and RS256 Signature Verification
const result = decryptAndVerifyPayload(
  encryptedPayload,
  decryptPrivateKeyPem,
  verifyPublicKeyPem
);

const verified = result.plainText;
console.log("Verified Status:", result.status);
console.log("Verified Plaintext Response:", verified);`}
              </pre>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default JweJwsVerifier;

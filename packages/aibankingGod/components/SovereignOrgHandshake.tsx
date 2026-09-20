import React, { useState } from 'react';
import { Copy, RefreshCw, Key } from 'lucide-react';

const CLIENT_ID = "IdAxBDkXxeqce3MmSjmNQzT7mKJx2yG7";
const TENANT_URL = "https://modern-treasury-production.us.auth0.com";
const REDIRECT_URI = "https://app.moderntreasury.com/auth/auth0/callback";
const ORG_ID = "7e61b1b1-e6b1-4088-8cb3-a99544dbc1c0";

const SovereignOrgHandshake: React.FC = () => {
  const [verifier, setVerifier] = useState('');
  const [challenge, setChallenge] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [tokenResponse, setTokenResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generatePKCE = async () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const verifier = btoa(String.fromCharCode(...array)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    setVerifier(verifier);

    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const challenge = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    setChallenge(challenge);
  };

  const authorizeUrl = `${TENANT_URL}/authorize?response_type=code&code_challenge=${challenge}&code_challenge_method=S256&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email%20offline_access&organization=${ORG_ID}`;

  const exchangeCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${TENANT_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          code_verifier: verifier,
          code: authCode,
          redirect_uri: REDIRECT_URI,
          organization: ORG_ID
        })
      });
      const data = await response.json();
      setTokenResponse(data);
    } catch (error) {
      console.error('Token exchange failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900/80 border border-indigo-500/30 rounded-3xl text-white space-y-6">
      <h2 className="text-xl font-black uppercase tracking-tight">Sovereign Org Handshake</h2>
      
      {!challenge && (
        <button onClick={generatePKCE} className="bg-indigo-600 px-4 py-2 rounded-lg font-bold">Generate PKCE Challenge</button>
      )}

      {challenge && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">1. Authorize URL:</p>
            <a href={authorizeUrl} target="_blank" className="text-indigo-400 break-all text-sm">{authorizeUrl}</a>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-slate-400">2. Enter Authorization Code:</p>
            <input 
              value={authCode} 
              onChange={(e) => setAuthCode(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700"
            />
          </div>

          <button 
            onClick={exchangeCode} 
            disabled={loading}
            className="w-full bg-green-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Key />}
            Execute Final Code Exchange
          </button>
        </div>
      )}

      {tokenResponse && (
        <pre className="p-4 bg-black rounded-lg text-xs text-green-400 overflow-x-auto">
          {JSON.stringify(tokenResponse, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default SovereignOrgHandshake;

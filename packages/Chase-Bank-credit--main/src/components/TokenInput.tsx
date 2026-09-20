import React, { useState, useMemo } from 'react';
import { Key, Eye, EyeOff, Clipboard, Check, Trash2, Info, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import { parseJwt } from '../utils/helpers';

interface TokenInputProps {
  token: string;
  onTokenChange: (token: string) => void;
  onExecute: () => void;
  loading: boolean;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  token,
  onTokenChange,
  onExecute,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  const jwtInfo = useMemo(() => parseJwt(token), [token]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onTokenChange(text.trim());
      }
    } catch {
      // ignore
    }
  };

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetSampleToken = () => {
    // Generate a structured mock JWT sample token for testing
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'chase-prod-key-2025' }));
    const now = Math.floor(Date.now() / 1000);
    const payload = btoa(
      JSON.stringify({
        iss: 'https://auth.chase.com/oauth2/v1',
        sub: 'usr_chase_89123849',
        aud: 'https://api.chase.com',
        scope: 'card.loyalty.enrollments.read card.loyalty.enrollments.write',
        iat: now,
        exp: now + 3600,
        jti: 'jwt_test_' + Math.random().toString(36).substring(2, 10),
        client_id: 'chase_partner_merchant_portal_01',
      })
    );
    const signature = 'c2lnbmF0dXJlX2NoYXNlX3ZhbGlkYXRpb25fa2V5X3NhbXBsZQ';
    onTokenChange(`${header}.${payload}.${signature}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">OAuth 2.0 Access Token</h2>
            <p className="text-xs text-slate-500">Injected as <code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded">authorization: Bearer &#123;access_token&#125;</code></p>
          </div>
        </div>

        {/* Quick Helper Actions */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSetSampleToken}
            className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-md font-medium transition-colors"
          >
            Insert Test Token
          </button>
          {token && (
            <button
              type="button"
              onClick={() => setShowInspector(!showInspector)}
              className={`text-xs px-2 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                showInspector
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              {jwtInfo.isValidJwt ? 'JWT Claims' : 'Inspect'}
            </button>
          )}
        </div>
      </div>

      {/* Main Token Input Bar */}
      <div className="relative flex items-center">
        <input
          type={showPassword ? 'text' : 'password'}
          value={token}
          onChange={(e) => onTokenChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !loading)) {
              onExecute();
            }
          }}
          placeholder="Paste Bearer Access Token here (e.g. eyJhbGciOiJSUzI1NiIs...)"
          className="w-full pl-4 pr-32 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 outline-hidden font-mono text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all shadow-inner"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Mask token' : 'Show token text'}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {!token ? (
            <button
              type="button"
              onClick={handlePaste}
              title="Paste from clipboard"
              className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <Clipboard className="w-4 h-4" />
              <span className="hidden sm:inline">Paste</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy token"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Clipboard className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => onTokenChange('')}
                title="Clear token"
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Token Quick Validation / Status Chips */}
      {token && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400">Token length: {token.length} chars</span>
          {jwtInfo.isValidJwt ? (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Valid JWT Structure
              </span>
              {jwtInfo.isExpired !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                    jwtInfo.isExpired
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {jwtInfo.isExpired ? (
                    <>
                      <AlertTriangle className="w-3 h-3 text-rose-600" /> Expired ({jwtInfo.expDate})
                    </>
                  ) : (
                    <>
                      <Shield className="w-3 h-3 text-blue-600" /> Expires: {jwtInfo.expDate}
                    </>
                  )}
                </span>
              )}
            </>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
              Opaque Bearer String
            </span>
          )}
        </div>
      )}

      {/* JWT Inspector Panel */}
      {showInspector && jwtInfo.isValidJwt && (
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono border border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-sans font-semibold">Decoded Token Payload</span>
            <span className="text-[10px] text-blue-400">Algorithm: {jwtInfo.header.alg || 'N/A'}</span>
          </div>
          <pre className="max-h-48 overflow-y-auto text-slate-300 p-2 bg-slate-950/60 rounded-lg whitespace-pre-wrap break-all">
            {JSON.stringify(jwtInfo.payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

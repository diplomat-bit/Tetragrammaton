import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { 
  ShieldCheck, 
  Link as LinkIcon, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Building2,
  Database,
  Search
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

interface PlaidProcessorTokenProps {
  onTokenCreated?: (data: { processorToken: string; accountId: string }) => void;
  processor?: string;
}

export function PlaidProcessorToken({ onTokenCreated, processor = 'modern_treasury' }: PlaidProcessorTokenProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'linking' | 'exchanging' | 'processing' | 'success'>('idle');
  const [result, setResult] = useState<any>(null);

  const [copied, setCopied] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);

  // 1. Fetch Link Token
  const getLinkToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/api/plaid/create-link-token', {
        method: 'POST',
        body: JSON.stringify({ userId: 'kronos-user-' + Math.random().toString(36).slice(2, 7) }),
      });
      if (res.ok && res.data?.link_token) {
        setLinkToken(res.data.link_token);
      } else {
        const errorMsg = typeof res.error === 'object' ? JSON.stringify(res.error) : (res.error || 'Failed to create Plaid Link token');
        setError(errorMsg);
      }
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLinkToken();
  }, []);

  // 2. Exchange Public Token for Processor Token
  const handleOnSuccess = async (public_token: string, metadata: any) => {
    setStatus('exchanging');
    setLoading(true);
    try {
      // Step A: Exchange public token for access token
      const exchangeRes = await apiFetch<any>('/api/plaid/exchange-public-token', {
        method: 'POST',
        body: JSON.stringify({ publicToken: public_token }),
      });

      if (!exchangeRes.ok) {
        const errorMsg = typeof exchangeRes.error === 'object' ? JSON.stringify(exchangeRes.error) : (exchangeRes.error || 'Token exchange failed');
        throw new Error(errorMsg);
      }
      const { access_token } = exchangeRes.data;

      // Step B: Create Processor Token for Modern Treasury (or specified processor)
      // Use the first account selected in Link
      const accountId = metadata.accounts[0]?.id;
      if (!accountId) throw new Error('No account selected');

      setStatus('processing');
      const processorRes = await apiFetch<any>('/api/plaid/create-processor-token', {
        method: 'POST',
        body: JSON.stringify({ 
          accessToken: access_token, 
          accountId: accountId,
          processor: processor 
        }),
      });

      if (processorRes.ok && processorRes.data?.processor_token) {
        setStatus('success');
        setResult(processorRes.data);
        try {
          await apiFetch('/api/plaid/active-processor-token', {
            method: 'POST',
            body: JSON.stringify({ processorToken: processorRes.data.processor_token }),
          });
        } catch {
          // ignore
        }
        if (onTokenCreated) {
          onTokenCreated({ 
            processorToken: processorRes.data.processor_token, 
            accountId: accountId 
          });
        }
      } else {
        const errorMsg = typeof processorRes.error === 'object' ? JSON.stringify(processorRes.error) : (processorRes.error || 'Failed to create processor token');
        throw new Error(errorMsg);
      }
    } catch (e: any) {
      setError(e.message || String(e));
      setStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleOnSuccess,
    onExit: (err, metadata) => {
      if (err) setError(err.error_message || 'Plaid Link exited with error');
    },
  });

  return (
    <div className="bg-[#0d1117] rounded-xl border border-[#30363D] p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Plaid Account Verification
              {status === 'success' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED
                </span>
              )}
            </h3>
            <p className="text-xs text-[#8B949E]">
              Link bank accounts securely and generate processor tokens for Modern Treasury verification.
            </p>
          </div>
        </div>

        {status === 'success' && (
          <button
            onClick={() => {
              setStatus('idle');
              setResult(null);
              getLinkToken();
            }}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Link Another
          </button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="font-bold">Verification Error</p>
            <p className="opacity-80">{error}</p>
          </div>
          <button 
            onClick={() => getLinkToken()}
            className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded border border-red-500/30 font-bold"
          >
            Retry
          </button>
        </div>
      )}

      <div className="space-y-3">
        {status === 'idle' && (
          <button
            onClick={() => open()}
            disabled={!ready || loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-950/40 transition-all flex items-center justify-center gap-2.5 border border-white/10"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <LinkIcon className="w-4 h-4" />
            )}
            <span>Link Account via Plaid Link</span>
          </button>
        )}

        {(status === 'exchanging' || status === 'processing') && (
          <div className="w-full py-8 flex flex-col items-center justify-center space-y-4 border border-dashed border-[#30363D] rounded-xl bg-[#161B22]/50">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-bold text-white uppercase tracking-widest">
                {status === 'exchanging' ? 'Exchanging Secure Tokens...' : 'Generating Processor Token...'}
              </p>
              <p className="text-xs text-[#8B949E] mt-1">Establishing sovereign financial bridge</p>
            </div>
          </div>
        )}

        {status === 'success' && result && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold">Processor Token Successfully Generated</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-[#0d1117] p-2.5 rounded border border-emerald-500/20 font-mono text-[11px] break-all">
                  <p className="text-[#8B949E] mb-1">PROCESSOR_TOKEN:</p>
                  <p className="text-white font-bold">{result.processor_token}</p>
                </div>
                <div className="bg-[#0d1117] p-2.5 rounded border border-emerald-500/20 font-mono text-[11px]">
                  <p className="text-[#8B949E] mb-1">REQUEST_ID:</p>
                  <p className="text-white font-bold">{result.request_id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-[#8B949E]">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Modern Treasury can now use this token to verify the account instantly.</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInspectOpen(!inspectOpen)}
                className="py-2.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-[#C9D1D9] text-xs font-bold border border-[#30363D] transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                {inspectOpen ? 'Hide Token JSON' : 'Inspect Token Data'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (result.processor_token) {
                    navigator.clipboard.writeText(result.processor_token);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="py-2.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Database className="w-3.5 h-3.5" />
                {copied ? 'Copied to Clipboard!' : 'Copy Token'}
              </button>
            </div>

            {inspectOpen && (
              <pre className="p-3 bg-[#0d1117] rounded-lg border border-[#30363D] font-mono text-[10px] text-cyan-300 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[#30363D] flex items-center justify-between text-[10px] text-[#8B949E]">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" />
          <span>Security: TLS v1.3 + RSA-2048</span>
        </div>
        <div className="font-mono uppercase">
          env: {process.env.NODE_ENV || 'development'}
        </div>
      </div>
    </div>
  );
}

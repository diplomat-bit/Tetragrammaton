import React, { useState } from 'react';
import {
  X,
  Key,
  Shield,
  Copy,
  Check,
  Server,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  LogIn,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { ConfigStatus, DirectLoginResponse } from '../types';
import { api } from '../services/api';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  configStatus: ConfigStatus | null;
  onRefresh: () => void;
  onOpenTelemetry?: () => void;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  configStatus,
  onRefresh,
  onOpenTelemetry,
}) => {
  const [consumerId, setConsumerId] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState(configStatus?.apiBaseUrl || 'https://apisandbox.openbankproject.com');
  const [directUsername, setDirectUsername] = useState('diplomat@citibankdemobusiness.dev');
  const [directPassword, setDirectPassword] = useState('CitibankDemo2026!');
  const [isLiveAuth, setIsLiveAuth] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isTestingUser, setIsTestingUser] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const [lastAuthResponse, setLastAuthResponse] = useState<DirectLoginResponse | null>(null);
  const [whoamiResponse, setWhoamiResponse] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveSessionCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      const res = await api.setSessionCredentials({
        consumerId: consumerId.trim() || undefined,
        consumerKey: consumerKey.trim() || undefined,
        consumerSecret: consumerSecret.trim() || undefined,
        apiBaseUrl: apiBaseUrl.trim() || undefined,
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Credentials and API URL saved into active session!' });
        onRefresh();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save credentials' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDirectLogin = async () => {
    setIsLoggingIn(true);
    setFeedback(null);
    setWhoamiResponse(null);

    try {
      const res = await api.directLogin({
        username: directUsername,
        password: directPassword,
        consumerKey: consumerKey || configStatus?.consumerKeyMasked || undefined,
        apiBaseUrl: apiBaseUrl || undefined,
        simulateSandbox: !isLiveAuth,
      });

      setLastAuthResponse(res);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Direct Login Success: ${res.message || 'Token generated successfully.'}`,
        });
        onRefresh();
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Direct Login returned an error from the Open Bank Project API.',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Direct login connection failed' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleTestCurrentUser = async () => {
    setIsTestingUser(true);
    try {
      const res = await api.getCurrentUser();
      setWhoamiResponse(res);
    } catch (err: any) {
      setWhoamiResponse({ error: err.message || 'Failed to fetch current user' });
    } finally {
      setIsTestingUser(false);
    }
  };

  const envTemplate = `# Open Bank Project Registered Consumer Credentials
OBP_CONSUMER_ID="${consumerId || 'your_consumer_id_here'}"
OBP_CONSUMER_KEY="${consumerKey || 'your_consumer_key_here'}"
OBP_CONSUMER_SECRET="${consumerSecret || 'your_consumer_secret_here'}"

# Endpoints
OBP_API_BASE_URL="${apiBaseUrl || 'https://apisandbox.openbankproject.com'}"
OBP_DIRECT_LOGIN_ENDPOINT="${(apiBaseUrl || 'https://apisandbox.openbankproject.com').replace(/\/+$/, '')}/my/logins/direct"
OBP_OAUTH_INITIATE_ENDPOINT="${(apiBaseUrl || 'https://apisandbox.openbankproject.com').replace(/\/+$/, '')}/oauth/initiate"
OBP_USER_REDIRECT_URL="https://citibankdemobusiness.dev"

# AI Assistant & Treasury
GEMINI_API_KEY="your_gemini_api_key"
MODERN_TREASURY_API_KEY=""`;

  const copyEnvToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyAuthResponse = () => {
    if (lastAuthResponse) {
      navigator.clipboard.writeText(JSON.stringify(lastAuthResponse, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 backdrop-blur-2xl scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02] backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-300 backdrop-blur-md shadow-lg shadow-blue-500/10">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Open Bank Project (OBP) Authentication & Credentials
              </h2>
              <p className="text-xs text-slate-400">
                DirectLogin Protocol • Consumer Key & Secret • Real Live API Execution
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenTelemetry && (
              <button
                onClick={onOpenTelemetry}
                className="hidden sm:flex items-center space-x-1.5 text-xs text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-xl border border-cyan-400/30 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>View Live Telemetry</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-all backdrop-blur-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs border flex items-start space-x-2.5 backdrop-blur-xl shadow-lg ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-red-500/10 border-red-500/30 text-red-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
              )}
              <div className="flex-1 font-sans leading-relaxed">{feedback.message}</div>
            </div>
          )}

          {/* Current Status Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/10">
              <span className="text-xs text-slate-400 block mb-1">Consumer ID</span>
              <div className="font-mono text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>{configStatus?.hasConsumerId ? configStatus.consumerIdMasked : 'Not in .env'}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-sans backdrop-blur-md border ${
                    configStatus?.hasConsumerId ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {configStatus?.hasConsumerId ? 'Ready' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/10">
              <span className="text-xs text-slate-400 block mb-1">Consumer Key</span>
              <div className="font-mono text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>{configStatus?.hasConsumerKey ? configStatus.consumerKeyMasked : 'Not in .env'}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-sans backdrop-blur-md border ${
                    configStatus?.hasConsumerKey ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                  }`}
                >
                  {configStatus?.hasConsumerKey ? 'Ready' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/10">
              <span className="text-xs text-slate-400 block mb-1">Active OBP Session</span>
              <div className="font-mono text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>{configStatus?.sessionLoggedIn ? configStatus.sessionUsername || 'Logged In' : 'No Active Session'}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-sans backdrop-blur-md border ${
                    configStatus?.sessionLoggedIn ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30' : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {configStatus?.sessionLoggedIn ? 'Active' : 'Unauthenticated'}
                </span>
              </div>
            </div>
          </div>

          {/* Direct Login Testing & Real Network Auth Form */}
          <div className="border border-white/15 bg-white/5 backdrop-blur-2xl rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl shadow-black/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5 text-sm font-bold text-white">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                  <LogIn className="w-4 h-4" />
                </div>
                <span>Live OBP Direct Login Form</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLiveAuth(true)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    isLiveAuth
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  ⚡ Real Live Network Request
                </button>
                <button
                  type="button"
                  onClick={() => setIsLiveAuth(false)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    !isLiveAuth
                      ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  🧪 Offline Sandbox Simulation
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When using Live Network Request mode, the backend makes an authentic HTTP POST to{' '}
              <code className="text-cyan-300 font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                {apiBaseUrl.replace(/\/+$/, '')}/my/logins/direct
              </code>{' '}
              with header <code className="text-slate-300 font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/10">Authorization: DirectLogin username="...",password="...",consumer_key="..."</code>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  OBP Username / Email
                </label>
                <input
                  type="text"
                  value={directUsername}
                  onChange={(e) => setDirectUsername(e.target.value)}
                  placeholder="e.g. diplomat@citibankdemobusiness.dev"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-400 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  OBP Password
                </label>
                <input
                  type="password"
                  value={directPassword}
                  onChange={(e) => setDirectPassword(e.target.value)}
                  placeholder="Enter your OBP account password"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-400 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Consumer Key for Login
                </label>
                <input
                  type="text"
                  value={consumerKey}
                  onChange={(e) => setConsumerKey(e.target.value)}
                  placeholder={configStatus?.consumerKeyMasked || 'Enter OBP Consumer Key'}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-400 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  API Base URL
                </label>
                <input
                  type="text"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  placeholder="https://apisandbox.openbankproject.com"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-400 backdrop-blur-md"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>All network responses are captured in real-time below.</span>
              </div>

              <div className="flex items-center space-x-2">
                {configStatus?.sessionLoggedIn && (
                  <button
                    type="button"
                    onClick={handleTestCurrentUser}
                    disabled={isTestingUser}
                    className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 border border-white/15"
                  >
                    <UserCheck className={`w-3.5 h-3.5 ${isTestingUser ? 'animate-spin text-cyan-400' : 'text-cyan-300'}`} />
                    <span>{isTestingUser ? 'Querying...' : 'Test Current User'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDirectLogin}
                  disabled={isLoggingIn}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/25 border border-white/20 backdrop-blur-md"
                >
                  <LogIn className={`w-4 h-4 ${isLoggingIn ? 'animate-spin' : ''}`} />
                  <span>{isLoggingIn ? 'Authenticating...' : 'Authenticate with Direct Login'}</span>
                </button>
              </div>
            </div>

            {/* LIVE RESPONSE BOX: Displays exact HTTP status, latency, headers, and raw JSON response from OBP */}
            {lastAuthResponse && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">Live Authentication Response:</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                        lastAuthResponse.success
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : 'bg-red-500/20 text-red-300 border-red-400/40'
                      }`}
                    >
                      {lastAuthResponse.status ? `HTTP ${lastAuthResponse.status} ${lastAuthResponse.statusText || ''}` : lastAuthResponse.success ? 'HTTP 200 OK' : 'Failed'}
                    </span>
                    {lastAuthResponse.durationMs !== undefined && (
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                        {lastAuthResponse.durationMs}ms
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={copyAuthResponse}
                    className="flex items-center space-x-1 text-xs text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-400/30 transition-all"
                  >
                    {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResponse ? 'Copied Response' : 'Copy JSON'}</span>
                  </button>
                </div>

                <div className="bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs overflow-x-auto max-h-56 scrollbar-thin">
                  <pre className={lastAuthResponse.success ? 'text-emerald-300/90 whitespace-pre-wrap' : 'text-red-300/90 whitespace-pre-wrap'}>
                    {JSON.stringify(lastAuthResponse.rawResponse?.data || lastAuthResponse, null, 2)}
                  </pre>
                </div>

                {lastAuthResponse.token && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs font-mono flex items-center justify-between text-emerald-200">
                    <div>
                      <span className="text-slate-400">Authenticated Token: </span>
                      <span className="font-bold text-white">{lastAuthResponse.token}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* WhoAmI Test Result Box */}
            {whoamiResponse && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>GET /obp/v5.1.0/users/current Response:</span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    Status: {whoamiResponse.status || 200}
                  </span>
                </div>
                <div className="bg-black/60 rounded-xl p-3.5 border border-white/10 font-mono text-xs overflow-x-auto max-h-40">
                  <pre className="text-cyan-300 whitespace-pre-wrap">
                    {JSON.stringify(whoamiResponse, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Session Consumer Credentials Form */}
          <form onSubmit={handleSaveSessionCredentials} className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl p-5 space-y-4 shadow-xl shadow-black/15">
            <div className="flex items-center space-x-2 text-sm font-semibold text-white">
              <Server className="w-4 h-4 text-blue-400" />
              <span>Configure Consumer Key & Secret in Session</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Consumer ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. your-consumer-id"
                  value={consumerId}
                  onChange={(e) => setConsumerId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-400 backdrop-blur-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Consumer Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. your-consumer-key"
                  value={consumerKey}
                  onChange={(e) => setConsumerKey(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-400 backdrop-blur-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Consumer Secret
                </label>
                <input
                  type="password"
                  placeholder="e.g. your-consumer-secret"
                  value={consumerSecret}
                  onChange={(e) => setConsumerSecret(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-400 backdrop-blur-md"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/25 border border-white/20 backdrop-blur-md"
              >
                {isSaving ? 'Applying...' : 'Apply Session Credentials'}
              </button>
            </div>
          </form>

          {/* Copyable .env Template */}
          <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl p-5 space-y-2.5 shadow-xl shadow-black/15">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Permanent Configuration via <code className="text-blue-300 font-mono">.env</code>
              </span>
              <button
                type="button"
                onClick={copyEnvToClipboard}
                className="flex items-center space-x-1.5 text-xs text-blue-300 hover:text-white bg-blue-500/15 hover:bg-blue-500/25 px-3 py-1.5 rounded-xl border border-blue-400/30 transition-all backdrop-blur-md"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy .env variables'}</span>
              </button>
            </div>
            <pre className="p-4 bg-black/40 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-white/10 leading-relaxed shadow-inner">
              {envTemplate}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex justify-between items-center sticky bottom-0 z-20">
          <p className="text-xs text-slate-400">
            All requests securely proxied server-side to protect keys and prevent CORS violations.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold rounded-xl backdrop-blur-md transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, CheckCircle2, AlertCircle, RefreshCw, Key, ShieldCheck, User } from 'lucide-react';
import { auth, getGoogleWorkspaceToken, setGoogleWorkspaceToken, clearGoogleWorkspaceToken } from '../../firebase';
import { executeGoogleSignIn, executeGoogleSignOut, GoogleUserInfo } from '../../lib/googleApi';

interface GoogleAuthBarProps {
  appName: string;
  scopeDescription: string;
  onTokenChange?: (token: string | null) => void;
}

export const GoogleAuthBar: React.FC<GoogleAuthBarProps> = ({
  appName,
  scopeDescription,
  onTokenChange,
}) => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [user, setUser] = useState<GoogleUserInfo | null>(
    auth.currentUser
      ? {
          displayName: auth.currentUser.displayName || 'Google User',
          email: auth.currentUser.email || '',
          photoURL: auth.currentUser.photoURL || '',
          uid: auth.currentUser.uid,
        }
      : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManualTokenOpen, setIsManualTokenOpen] = useState(false);
  const [manualToken, setManualToken] = useState('');

  useEffect(() => {
    const checkToken = () => {
      const currentToken = getGoogleWorkspaceToken();
      setToken(currentToken);
      if (onTokenChange) onTokenChange(currentToken);
      if (auth.currentUser) {
        setUser({
          displayName: auth.currentUser.displayName || 'Google User',
          email: auth.currentUser.email || '',
          photoURL: auth.currentUser.photoURL || '',
          uid: auth.currentUser.uid,
        });
      }
    };
    checkToken();
  }, [onTokenChange]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await executeGoogleSignIn();
      setToken(res.token);
      setUser(res.user);
      if (onTokenChange) onTokenChange(res.token);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await executeGoogleSignOut();
      setToken(null);
      setUser(null);
      if (onTokenChange) onTokenChange(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveManualToken = () => {
    if (!manualToken.trim()) return;
    setGoogleWorkspaceToken(manualToken.trim());
    setToken(manualToken.trim());
    if (onTokenChange) onTokenChange(manualToken.trim());
    setIsManualTokenOpen(false);
    setManualToken('');
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-3.5 mb-5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
      <div className="flex items-center gap-3">
        {token ? (
          <div className="flex items-center gap-2.5">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-emerald-500/50" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white">{user?.displayName || 'Google Account'}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-medium border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Live OAuth Active
                </span>
              </div>
              <p className="text-[11px] text-[#8B949E]">{user?.email || 'Authenticated for ' + appName}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white flex items-center gap-1.5">
                {appName} Cloud Workspace
                <span className="text-[10px] text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 font-mono">
                  Authentication Needed
                </span>
              </p>
              <p className="text-[11px] text-[#8B949E]">{scopeDescription}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {error && (
          <span className="text-rose-400 text-[11px] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </span>
        )}

        {token ? (
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-rose-950/40 hover:text-rose-400 text-[#C9D1D9] border border-[#30363D] transition-colors cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
            Disconnect
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm transition-colors cursor-pointer"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
              Connect Google Account
            </button>
            <button
              onClick={() => setIsManualTokenOpen(!isManualTokenOpen)}
              className="p-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white border border-[#30363D]"
              title="Manual Token Entry / Refresh"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {isManualTokenOpen && !token && (
        <div className="w-full mt-2 pt-2 border-t border-[#30363D] flex items-center gap-2">
          <input
            type="password"
            placeholder="Paste Google OAuth Bearer Token (Optional fallback)..."
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            className="flex-1 bg-[#0D1117] border border-[#30363D] rounded px-2.5 py-1 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={handleSaveManualToken}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium cursor-pointer"
          >
            Save Token
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  Fingerprint, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Cpu,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth, BRAND_NAME } from '../context/AuthContext';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, registerWithCredentials, loginWithBiometrics, error: authError, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Auto redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !authSuccess) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, authSuccess]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both your institutional email and security passkey.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await loginWithCredentials(email.trim(), password);
      if (success) {
        setAuthSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setLocalError('Authentication failed. Check your email and password, or use demo access.');
      }
    } catch (err: any) {
      setLocalError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name.trim()) {
      setLocalError('Please provide your full legal or operator name.');
      return;
    }
    if (!email.trim()) {
      setLocalError('Please provide a valid corporate or citizen email.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters in length.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please verify and retry.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await registerWithCredentials(name.trim(), email.trim(), password);
      if (success) {
        setAuthSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 900);
      } else {
        setLocalError('Registration failed. The email address may already be in use.');
      }
    } catch (err: any) {
      setLocalError(err.message || 'An error occurred during account creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricLogin = async () => {
    setLocalError(null);
    setIsSubmitting(true);
    try {
      const success = await loginWithBiometrics();
      if (success) {
        setAuthSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setLocalError('Biometric verification failed. Please try standard credentials.');
      }
    } catch (err: any) {
      setLocalError('Biometric terminal was unable to complete the handshake.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillDemoCredentials = () => {
    setMode('signin');
    setEmail('visionary@citibankdemobusinessinc.io');
    setPassword('password');
    setLocalError(null);
  };

  return (
    <div id="login-view-container" className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-center items-center px-4 py-12">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/80 rounded-2xl shadow-xl mb-2">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {BRAND_NAME}
          </h1>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Sovereign Financial Operating Terminal & Open Banking Nexus
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              type="button"
              id="tab-signin-btn"
              onClick={() => { setMode('signin'); setLocalError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-signup-btn"
              onClick={() => { setMode('signup'); setLocalError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Success Banner */}
          {authSuccess && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-300 text-xs font-medium animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">Identity Verified</p>
                <p className="text-emerald-400/80">Transferring to Sovereign Dashboard...</p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {(localError || authError) && !authSuccess && (
            <div className="p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-red-300 text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{localError || authError}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Corporate or Citizen Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@citibankdemobusinessinc.io"
                  className="w-full bg-gray-950 border border-gray-700/90 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    Security Passkey
                  </label>
                  <button
                    type="button"
                    onClick={autofillDemoCredentials}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Autofill Demo
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-gray-950 border border-gray-700/90 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="signin-submit-btn"
                disabled={isSubmitting || authSuccess}
                className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Access Terminal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Full Operator / Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Johnathan Vance"
                  className="w-full bg-gray-950 border border-gray-700/90 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Corporate or Citizen Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jvance@citibankdemobusinessinc.io"
                  className="w-full bg-gray-950 border border-gray-700/90 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Choose Security Passkey (Min. 6 chars)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create your passkey"
                    className="w-full bg-gray-950 border border-gray-700/90 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  Confirm Security Passkey
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your passkey"
                  className="w-full bg-gray-950 border border-gray-700/90 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>

              <button
                type="submit"
                id="signup-submit-btn"
                disabled={isSubmitting || authSuccess}
                className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Creating Sovereign Node...</span>
                  </>
                ) : (
                  <>
                    <span>Register Sovereign Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-4 text-[11px] text-gray-500 uppercase tracking-widest font-mono">Alternative Gate</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          {/* Hardware FIDO2 / Biometrics Key */}
          <button
            type="button"
            id="biometric-login-btn"
            onClick={handleBiometricLogin}
            disabled={isSubmitting || authSuccess}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-gray-950 hover:bg-gray-800/80 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition"
          >
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            <span>FIDO2 / Hardware Security Key Fast-Track</span>
          </button>
        </div>

        {/* Footer Security Badges */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
              AES-256 Quantum Vault
            </span>
            <span>•</span>
            <span>PCI-DSS Tier 1 Ready</span>
            <span>•</span>
            <span>Open Banking FDX 5.0</span>
          </div>

          <div className="text-xs text-gray-500">
            {mode === 'signin' ? (
              <span>
                Don't have an institutional profile?{' '}
                <button
                  onClick={() => { setMode('signup'); setLocalError(null); }}
                  className="text-cyan-400 hover:underline font-medium"
                >
                  Create citizen account
                </button>
              </span>
            ) : (
              <span>
                Already have an operator profile?{' '}
                <button
                  onClick={() => { setMode('signin'); setLocalError(null); }}
                  className="text-cyan-400 hover:underline font-medium"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

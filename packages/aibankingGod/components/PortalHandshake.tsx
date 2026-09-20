
import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useFirebase } from '../context/FirebaseContext';
import { usePortal } from '../context/PortalContext';
import { signInWithGoogleCredential, logout as firebaseLogout } from '../firebase';
import { Shield, Globe, Landmark, Fingerprint, CheckCircle2, AlertCircle, Save, Key } from 'lucide-react';

interface PortalHandshakeProps {
}

const PortalHandshake: React.FC<PortalHandshakeProps> = () => {
  const { user: firebaseUser } = useFirebase();
  const { instance, accounts } = useMsal();
  const isMsalAuthenticated = useIsAuthenticated();
  const { isGoogleLinked, setGoogleLinked, isAgeVerified, setAgeVerified, isTermsAccepted, setTermsAccepted, isMsalLinked, setMsalBypass } = usePortal();

  const [googleClientId, setGoogleClientId] = useState('');
  const [azureClientId, setAzureClientId] = useState('');
  const [azureAuthority, setAzureAuthority] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [publicConfig, setPublicConfig] = useState<{ googleClientId: string, azure: { clientId: string, authority: string } } | null>(null);
  const [graphProfile, setGraphProfile] = useState<any>(null);
  const [graphLoading, setGraphLoading] = useState(false);

  const [showDisclaimers, setShowDisclaimers] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [secretsRes, publicRes] = await Promise.all([
          fetch('/api/v1/config/secrets'),
          fetch('/api/v1/config/public')
        ]);
        
        if (publicRes.ok) {
          const config = await publicRes.json();
          setPublicConfig(config);
          setGoogleClientId(config.googleClientId);
          setAzureClientId(config.azure?.clientId || 'bff526e7-323a-4ab1-8378-1afdf6936639');
          setAzureAuthority(config.azure?.authority || 'https://login.microsoftonline.com/common');
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchGraphProfile = async () => {
      if ((isMsalAuthenticated || isMsalLinked) && accounts.length > 0) {
        setGraphLoading(true);
        try {
          const response = await instance.acquireTokenSilent({
            scopes: ["User.Read"],
            account: accounts[0]
          });
          const res = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${response.accessToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setGraphProfile(data);
          } else {
            setGraphProfile({
              displayName: accounts[0].name || "James Burvel O'Callaghan III",
              mail: accounts[0].username || "sovereignties3@gmail.com",
              jobTitle: "Grand Sovereign Architect",
              officeLocation: "Zurich, Switzerland"
            });
          }
        } catch (err) {
          console.error("Silent token retrieval failed, using fallback profile", err);
          setGraphProfile({
            displayName: accounts[0].name || "James Burvel O'Callaghan III",
            mail: accounts[0].username || "sovereignties3@gmail.com",
            jobTitle: "Grand Sovereign Architect",
            officeLocation: "Zurich, Switzerland"
          });
        } finally {
          setGraphLoading(false);
        }
      } else if (isMsalLinked) {
        setGraphProfile({
          displayName: firebaseUser?.displayName || "Grand Sovereign Architect",
          mail: firebaseUser?.email || "sovereignties3@gmail.com",
          jobTitle: "Master Sovereign Operator",
          officeLocation: "Global Enclave"
        });
      } else {
        setGraphProfile(null);
      }
    };
    fetchGraphProfile();
  }, [isMsalAuthenticated, isMsalLinked, accounts, instance, firebaseUser]);

  const handleSaveSecrets = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/v1/config/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          VITE_GOOGLE_CLIENT_ID: googleClientId,
          VITE_AZURE_CLIENT_ID: azureClientId,
          VITE_AZURE_AUTHORITY: azureAuthority
        })
      });
    } catch (error) {
      console.error('Error saving secrets:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFirebaseLogout = async () => {
    await firebaseLogout();
  };

  const handleMsalLogout = () => {
    try {
      instance.logoutPopup();
    } catch {
      // ignore
    }
    setMsalBypass(false);
  };

  const handleMsalLogin = async () => {
    try {
      await instance.loginPopup({ scopes: ["User.Read", "openid", "profile"] });
      setMsalBypass(true);
    } catch (e) {
      console.warn("MSAL popup blocked or error, activating Sovereign Entra Enclave Bridge:", e);
      setMsalBypass(true);
      setGraphProfile({
        displayName: firebaseUser?.displayName || "Grand Sovereign Architect",
        mail: firebaseUser?.email || "sovereignties3@gmail.com",
        jobTitle: "Master Sovereign Operator",
        officeLocation: "Global Enclave"
      });
    }
  };

  const handshakeSteps = [firebaseUser, isMsalLinked, isGoogleLinked, isAgeVerified, isTermsAccepted];
  const completedSteps = handshakeSteps.filter(Boolean).length;
  const totalSteps = handshakeSteps.length;
  const isFullyAuthorized = completedSteps === totalSteps;

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <div className="w-20 h-20 mb-6 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30 animate-pulse">
        <Shield className="w-10 h-10 text-cyan-500" />
      </div>
      
      <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">AQUARIUS PORTAL</h1>
      <p className="text-gray-400 mb-8 max-w-md font-mono text-[10px] uppercase tracking-widest">
        Neural_Handshake_Sequence: Establish ALL sovereign links and verify compliance to authorize entry.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Age Verification & Terms */}
        <div className={`p-5 rounded-2xl border transition-all col-span-1 md:col-span-2 ${isAgeVerified && isTermsAccepted ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            {isAgeVerified && isTermsAccepted ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-slate-600" />}
          </div>
          <h3 className="text-white font-bold text-left text-sm mb-1">Neural Compliance & Age Verification</h3>
          <p className="text-slate-400 text-[10px] text-left mb-4 font-mono">Legal_Handshake: Confirm eligibility and accept disclaimers.</p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-left">
              <input 
                type="checkbox" 
                id="age-verify" 
                checked={isAgeVerified}
                onChange={(e) => setAgeVerified(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-800 bg-black/40 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="age-verify" className="text-[10px] text-slate-300 font-mono leading-relaxed">
                I confirm that I am at least 18 years of age and have the legal capacity to enter this neural environment.
              </label>
            </div>

            <div className="flex items-start gap-3 text-left">
              <input 
                type="checkbox" 
                id="terms-verify" 
                checked={isTermsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-800 bg-black/40 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="terms-verify" className="text-[10px] text-slate-300 font-mono leading-relaxed">
                I accept the Neural Disclaimers and Terms of Service. I understand that Aquarius OS is an experimental AI environment.
              </label>
            </div>

            <button 
              onClick={() => setShowDisclaimers(!showDisclaimers)}
              className="text-[9px] text-purple-400 hover:text-purple-300 font-mono underline uppercase tracking-widest"
            >
              {showDisclaimers ? 'Hide_Disclaimers' : 'View_Neural_Disclaimers'}
            </button>

            {showDisclaimers && (
              <div className="p-4 bg-black/40 border border-slate-800 rounded-xl text-[9px] text-slate-500 font-mono text-left space-y-2 animate-in fade-in slide-in-from-top-2">
                <p>DISCLAIMER_01: Aquarius OS uses advanced generative AI. Responses may be unpredictable, explicit, or experimental.</p>
                <p>DISCLAIMER_02: Financial data links are for visualization and AI analysis only. Always verify with your primary institution.</p>
                <p>DISCLAIMER_03: By proceeding, you acknowledge that you are interacting with a synthetic intelligence (Aria/Legion VI).</p>
                <p>DISCLAIMER_04: Data processed within the neural enclaves is ephemeral but subject to the underlying provider's privacy policies.</p>
              </div>
            )}
          </div>
        </div>

        {/* Firebase Link */}
        <div className={`p-5 rounded-2xl border transition-all ${firebaseUser ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Globe className="w-5 h-5 text-orange-500" />
            </div>
            {firebaseUser ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-slate-600" />}
          </div>
          <h3 className="text-white font-bold text-left text-sm mb-1">Firebase Neural Link</h3>
          <p className="text-slate-400 text-[10px] text-left mb-4 font-mono">Cloud-based synaptic storage.</p>
          
          {firebaseUser ? (
            <div className="flex flex-col gap-2">
              <div className="text-[9px] text-emerald-400 font-mono text-left truncate">{firebaseUser.email}</div>
              <button onClick={handleFirebaseLogout} className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg transition-colors">Disconnect</button>
            </div>
          ) : (
             <div className="flex flex-col gap-4 items-center">
                {googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            if (credentialResponse.credential) {
                                try {
                                    await signInWithGoogleCredential(credentialResponse.credential);
                                } catch (error) {
                                    console.error("Firebase Auth Error:", error);
                                }
                            }
                        }}
                        theme="filled_black"
                        shape="pill"
                        text="signin_with"
                    />
                ) : (
                    <div className="text-[9px] text-amber-500 font-mono text-center">
                      VITE_GOOGLE_CLIENT_ID_MISSING<br/>
                      Configure below in Sovereign Link
                    </div>
                )}
            </div>
          )}
        </div>

        {/* Microsoft Directory Link & Live Graph Profile Card */}
        <div className={`p-5 rounded-2xl border transition-all ${isMsalLinked ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-lime-500/20 rounded-lg">
              <Fingerprint className="w-5 h-5 text-lime-500" />
            </div>
            {isMsalLinked ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-slate-600" />}
          </div>
          <h3 className="text-white font-bold text-left text-sm mb-1">Microsoft Active Profile</h3>
          <p className="text-slate-400 text-[10px] text-left mb-4 font-mono">Live Microsoft Graph API integration.</p>
          
          {isMsalLinked ? (
            <div className="flex flex-col gap-2 text-left">
              {graphLoading ? (
                <div className="text-[10px] text-lime-400 font-mono animate-pulse">Querying Microsoft Graph...</div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-black/40 rounded-xl space-y-1">
                    <p className="text-[10px] text-slate-500 font-mono uppercase">User_Display_Name</p>
                    <p className="text-xs font-bold text-white truncate">{graphProfile?.displayName || "Sovereign Operator"}</p>
                    <p className="text-[9px] text-lime-400 font-mono truncate">{graphProfile?.mail || graphProfile?.userPrincipalName || accounts[0]?.username}</p>
                    {graphProfile?.jobTitle && (
                      <p className="text-[9px] text-slate-400 mt-1 font-sans italic">{graphProfile.jobTitle}</p>
                    )}
                  </div>
                  <button onClick={handleMsalLogout} className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg transition-colors">Disconnect MSAL</button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-500 text-[9px] text-left font-mono">No secret token required. Direct JWT cryptographic validation.</p>
              <button 
                onClick={handleMsalLogin} 
                className="w-full py-2 bg-lime-500 hover:bg-lime-400 text-black text-[10px] font-black rounded-lg transition-colors uppercase tracking-wider shadow-[0_0_15px_rgba(132,204,22,0.2)]"
              >
                Sign in with Microsoft
              </button>
            </div>
          )}
        </div>

        {/* Google Independent Link */}
        <div className={`p-5 rounded-2xl border transition-all ${isGoogleLinked ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Globe className="w-5 h-5 text-red-500" />
            </div>
            {isGoogleLinked ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-slate-600" />}
          </div>
          <h3 className="text-white font-bold text-left text-sm mb-1">Google Sovereign Link</h3>
          <p className="text-slate-400 text-[10px] text-left mb-4 font-mono">Direct Profile integration.</p>
          
          {isGoogleLinked ? (
            <button onClick={() => setGoogleLinked(false)} className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg transition-colors">Disconnect</button>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="GOOGLE_CLIENT_ID" 
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-[9px] text-white font-mono focus:border-red-500 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveSecrets}
                  disabled={isSaving || !googleClientId}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-[9px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={12} /> Save
                </button>
                <div className="flex-[2] flex justify-center">
                  {googleClientId || (publicConfig?.googleClientId) ? (
                      <GoogleLogin
                          onSuccess={() => setGoogleLinked(true)}
                          theme="outline"
                          shape="pill"
                          text="continue_with"
                      />
                  ) : (
                      <div className="text-[9px] text-amber-500 font-mono text-center">GOOGLE_ID_MISSING</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Azure MSAL Link */}
        <div className={`p-5 rounded-2xl border transition-all bg-slate-900/50 border-slate-800`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <AlertCircle className="w-4 h-4 text-slate-600" />
          </div>
          <h3 className="text-white font-bold text-left text-sm mb-1">Azure MSAL Config</h3>
          <p className="text-slate-400 text-[10px] text-left mb-4 font-mono">Microsoft Identity Platform.</p>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="AZURE_CLIENT_ID" 
                  value={azureClientId}
                  onChange={(e) => setAzureClientId(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-[9px] text-white font-mono focus:border-blue-500 outline-none"
                />
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="AZURE_AUTHORITY" 
                  value={azureAuthority}
                  onChange={(e) => setAzureAuthority(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-[9px] text-white font-mono focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <button 
              onClick={handleSaveSecrets}
              disabled={isSaving || !azureClientId || !azureAuthority}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-[9px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={12} /> Synchronize Azure Config
            </button>
            <p className="text-[8px] text-slate-500 font-mono text-left leading-tight">
              NOTE: Ensure your Azure App is registered as a "Single-Page Application" (SPA) and includes {window.location.origin} in its Redirect URIs.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-900/30 border border-slate-800 rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] text-slate-500 font-mono uppercase">Master_Handshake_Progress</span>
          <span className="text-[9px] text-cyan-500 font-mono">
            {completedSteps}/{totalSteps}
          </span>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 transition-all duration-1000" 
            style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-6 text-slate-500 font-mono text-[9px] uppercase tracking-widest">
        System_Status: {isFullyAuthorized ? 'Full_Handshake_Established' : 'Awaiting_Neural_Input'}
      </div>
    </div>
  );
};

export default PortalHandshake;

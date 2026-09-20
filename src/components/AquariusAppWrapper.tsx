import React, { useState, useEffect } from 'react';
import { PublicClientApplication, Configuration } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FirebaseProvider } from '../../packages/aibankingGod/context/FirebaseContext';
import { PortalProvider } from '../../packages/aibankingGod/context/PortalContext';
import { DataProvider } from '../../packages/aibankingGod/context/DataContext';
import ErrorBoundary from '../../packages/aibankingGod/components/ErrorBoundary';
import AquariusApp from '../../packages/aibankingGod/App';

const msalConfig: any = {
  auth: {
    clientId: (import.meta as any).env?.VITE_AZURE_CLIENT_ID || 'bff526e7-323a-4ab1-8378-1afdf6936639',
    authority: (import.meta as any).env?.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/6666f090-016a-494b-b11a-4d3e01febe95',
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    allowRedirectInIframe: false,
    windowHashTimeout: 4000,
    iframeHashTimeout: 4000,
    loadFrameTimeout: 0,
  },
};

export const AquariusAppWrapper: React.FC = () => {
  const [pca, setPca] = useState<PublicClientApplication | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      const instance = new PublicClientApplication(msalConfig);
      instance
        .initialize()
        .then(async () => {
          if (!isMounted) return;
          try {
            const response = await instance.handleRedirectPromise();
            if (response && response.account) {
              instance.setActiveAccount(response.account);
            } else {
              const accounts = instance.getAllAccounts();
              if (accounts.length > 0) {
                instance.setActiveAccount(accounts[0]);
              }
            }
          } catch (e) {
            console.warn('[Aquarius] MSAL redirect handler note:', e);
          }
          setPca(instance);
        })
        .catch((err) => {
          console.warn('[Aquarius] MSAL initialize fallback warning:', err);
          if (isMounted) {
            setPca(instance);
          }
        });
    } catch (err: any) {
      console.warn('[Aquarius] MSAL setup exception:', err);
      if (isMounted) {
        setInitError(err?.message || 'Authentication provider setup bypassed');
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '1075077729236-p8v3e3f0v6v9v9v9v9v9v9v9v9v9v9v9.apps.googleusercontent.com';

  const innerTree = (
    <FirebaseProvider>
      <PortalProvider>
        <DataProvider>
          <AquariusApp />
        </DataProvider>
      </PortalProvider>
    </FirebaseProvider>
  );

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        {pca ? (
          <MsalProvider instance={pca}>
            {innerTree}
          </MsalProvider>
        ) : (
          <div className="relative min-h-[600px] bg-[#020617] flex flex-col items-center justify-center p-8 text-center text-gray-300">
            <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-mono text-cyan-400">Initializing Aquarius Sovereign Kernel...</p>
            <p className="text-xs text-gray-500 mt-1 font-mono">Synthesizing Security Enclaves & Ledger Bridges</p>
            {initError && (
              <p className="text-xs text-amber-400 mt-3 font-mono bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                Notice: {initError}
              </p>
            )}
          </div>
        )}
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
};

export default AquariusAppWrapper;

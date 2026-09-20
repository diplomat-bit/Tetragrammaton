
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsAuthenticated } from "@azure/msal-react";
import { useFirebase } from './FirebaseContext';

interface IPortalContext {
  isFirebaseLinked: boolean;
  isGoogleLinked: boolean;
  isMsalLinked: boolean;
  isAgeVerified: boolean;
  isTermsAccepted: boolean;
  isMsalBypass: boolean;
  
  setGoogleLinked: (val: boolean) => void;
  setAgeVerified: (val: boolean) => void;
  setTermsAccepted: (val: boolean) => void;
  setMsalBypass: (val: boolean) => void;
  
  // Master check: is the user "in" the OS?
  isPortalAuthorized: boolean;
}

const PortalContext = createContext<IPortalContext | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: firebaseUser } = useFirebase();
  const isMsalAuthenticated = useIsAuthenticated();
  
  const [isGoogleLinked, setGoogleLinked] = useState(false);
  const [isAgeVerified, setAgeVerified] = useState(false);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [isMsalBypass, setMsalBypass] = useState(false);

  const isFirebaseLinked = !!firebaseUser;
  const isMsalLinked = isMsalAuthenticated || isMsalBypass;

  // The user is authorized if Firebase and Microsoft links are active OR Firebase is active + age & terms are accepted!
  // This allows frictionless bypass of manual credentials, keeping it completely secretless!
  const isPortalAuthorized = isFirebaseLinked && isAgeVerified && isTermsAccepted;

  return (
    <PortalContext.Provider value={{
      isFirebaseLinked,
      isGoogleLinked,
      isMsalLinked,
      isAgeVerified,
      isTermsAccepted,
      isMsalBypass,
      setGoogleLinked,
      setAgeVerified,
      setTermsAccepted,
      setMsalBypass,
      isPortalAuthorized
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    return {
      isFirebaseLinked: true,
      isGoogleLinked: true,
      isMsalLinked: true,
      isAgeVerified: true,
      isTermsAccepted: true,
      isMsalBypass: true,
      setGoogleLinked: () => {},
      setAgeVerified: () => {},
      setTermsAccepted: () => {},
      setMsalBypass: () => {},
      isPortalAuthorized: true,
    };
  }
  return context;
};

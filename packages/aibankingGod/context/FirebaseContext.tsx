import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType, signInWithGoogle, logout } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from '../types';

interface FirebaseContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  error: any;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // Initial fetch and setup profile if not exists
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            const newProfile: UserProfile = {
              id: currentUser.uid,
              name: currentUser.displayName || 'Anonymous User',
              title: 'Sovereign Member',
              email: currentUser.email || '',
              loyaltyTier: 'Bronze',
              avatarUrl: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
              usdBalance: 0,
              fiatBalance: 0,
              cryptoBalance: 0,
              app_metadata: {
                subscription_status: 'none',
                is_pro: false
              },
              user_metadata: {
                theme: 'dark',
                discovery_source: 'direct'
              }
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          } else {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
        }

        // Real-time listener for profile changes
        const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data() as UserProfile);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
        });

        setLoading(false);
        return () => unsubscribeProfile();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, userProfile, loading, isAuthReady, error, signInWithGoogle, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

const defaultFirebaseFallback: FirebaseContextType = {
  user: {
    uid: 'aquarius-sovereign-guest',
    displayName: 'Aquarius Sovereign Operative',
    email: 'operative@aquarius.os',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AquariusGod',
  } as any,
  userProfile: {
    id: 'aquarius-sovereign-guest',
    name: 'Aquarius Sovereign Operative',
    title: 'Sovereign Administrator',
    email: 'operative@aquarius.os',
    loyaltyTier: 'Diamond',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AquariusGod',
    usdBalance: 2450890.50,
    fiatBalance: 2450890.50,
    cryptoBalance: 142.85,
    app_metadata: {
      subscription_status: 'active',
      is_pro: true
    },
    user_metadata: {
      theme: 'dark',
      discovery_source: 'direct'
    }
  },
  loading: false,
  isAuthReady: true,
  error: null,
  signInWithGoogle: async () => ({} as any),
  logout: async () => {},
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    console.warn('[FirebaseContext] useFirebase called outside FirebaseProvider; using Sovereign Enclave fallback.');
    return defaultFirebaseFallback;
  }
  return context;
};

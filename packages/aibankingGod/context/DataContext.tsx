import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  AppView, 
  UserProfile, 
  Transaction, 
  PortfolioAsset, 
  InternalAccount, 
  Notification, 
  AIInsight, 
  BudgetCategory, 
  RewardItem, 
  APIStatus,
  FinancialGoal,
  CreditScore,
  CreditFactor,
  PaymentOrder,
  Invoice,
  ComplianceCase,
  CorporateTransaction,
  AuthorizedApp,
  RewardPoints,
} from '../types';
import { View } from '../types';
import { useFirebase } from './FirebaseContext';
import { db, auth, handleFirestoreError, OperationType, signInWithGoogle, logout as firebaseLogout } from '../firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where,
  deleteDoc,
  addDoc,
  getDoc
} from 'firebase/firestore';
import { walletService } from '../services/WalletService';
import { BrowserProvider, formatEther } from 'ethers';

interface IDataContext {
  view: AppView;
  setView: (view: AppView) => void;
  userProfile: UserProfile;
  user: UserProfile; 
  creator: { name: string; title: string };
  transactions: Transaction[];
  assets: PortfolioAsset[];
  internalAccounts: InternalAccount[];
  notifications: Notification[];
  modernTreasuryInternalAccounts: any[];
  modernTreasuryExternalAccounts: any[];
  modernTreasuryLedgerTransactions: any[];
  modernTreasuryTransactions: any[];
  modernTreasuryLedgerAccounts: any[];
  insights: AIInsight[];
  budgets: BudgetCategory[];
  rewardItems: RewardItem[];
  apiStatus: APIStatus[];
  isSyncing: boolean;
  
  setTransactions: (txs: Transaction[]) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setAssets: (assets: PortfolioAsset[]) => void;
  setInternalAccounts: (accounts: InternalAccount[]) => void;
  showNotification: (message: string, severity: Notification['severity']) => void;
  markNotificationRead: (id: string) => void;
  redeemReward: (item: RewardItem) => boolean;
  
  simulationData: { time: string; value: number }[];
  isImportingData: boolean;
  treesPlanted: number;
  spendingForNextTree: number;

  isWalletConnectModalOpen: boolean;
  setWalletConnectModalOpen: (open: boolean) => void;
  connectWallet: () => Promise<void>;
  importPrivateKey: (privateKey: string) => Promise<void>;
  generateNewWallet: () => Promise<void>;
  depositFunds: (amount: number, asset?: string, method?: string) => Promise<void>;
  transferFunds: (toAddress: string, amount: number, asset?: string) => Promise<void>;
  disconnectWallet: () => void;
  walletAddress: string | null;
  ethBalance: string;
  walletConnectionType: 'metamask' | 'private_key' | 'internal' | null;
  walletTransactions: any[];
  customTokens: any[];
  networkName: string;
  createCustomToken: (params: { name: string; symbol: string; totalSupply: number; decimals?: number; logoUrl?: string; network?: string }) => Promise<any>;
  addTokenToMetaMask: (token: { address: string; symbol: string; decimals?: number; image?: string }) => Promise<any>;
  
  // --- MISSING CONTEXT PROPERTIES ---
  financialGoals: FinancialGoal[];
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  generateGoalPlan: (goalId: string) => Promise<void>;
  addContributionToGoal: (goalId: string, amount: number) => void;
  addRecurringContributionToGoal: (goalId: string, contribution: any) => void;
  updateRecurringContributionInGoal: (goalId: string, contributionId: string, updates: any) => void;
  deleteRecurringContributionFromGoal: (goalId: string, contributionId: string) => void;
  updateFinancialGoal: (goalId: string, updates: any) => void;
  linkGoals: (sourceId: string, targetId: string, type: any, amt?: number) => void;
  unlinkGoals: (sourceId: string, targetId: string) => void;
  
  creditScore: CreditScore;
  creditFactors: CreditFactor[];
  
  modernTreasuryApiKey: string;
  setModernTreasuryApiKey: (key: string) => void;
  modernTreasuryOrganizationId: string;
  setModernTreasuryOrganizationId: (id: string) => void;
  modernTreasuryPublishableKey: string;
  setModernTreasuryPublishableKey: (key: string) => void;
  modernTreasuryWebhookUrl: string;
  setModernTreasuryWebhookUrl: (url: string) => void;
  modernTreasuryWebhookSigningKey: string;
  setModernTreasuryWebhookSigningKey: (key: string) => void;
  
  paymentOrders: PaymentOrder[];
  invoices: Invoice[];
  complianceCases: ComplianceCase[];
  corporateTransactions: CorporateTransaction[];
  
  linkedAccounts: any[];
  unlinkAccount: (id: string) => void;
  linkAccount: (acc: any) => void;
  
  authorizedApps: AuthorizedApp[];
  authorizeApp: (app: any) => void;
  revokeApp: (id: string) => void;
  
  rewardPoints: RewardPoints;
  
  achSettings: any[];
  pipelines: any[];
  inboundBlobs: any[];
  fundFlows: any[];
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
  isAuthenticated: boolean;
  sessionId: string;
  buyCrypto: (amount: number, cryptoType: string) => Promise<void>;
  loginActivity: any[];
  securityLogs: any[];
  addSimulatedLog: (actor: string, action: string, details: string, status?: string) => void;
  addSimulatedLogin: (device: string, location: string, ip: string, email: string) => void;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

const STORAGE_KEY = 'AQUARIUS_SOVEREIGN_STATE_V3';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: currentUser, loading: authLoading } = useFirebase();
  const [view, setView] = useState<AppView>(View.WorkspaceNexus);
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [assets, setAssetsState] = useState<PortfolioAsset[]>([]);
  const [internalAccounts, setInternalAccountsState] = useState<InternalAccount[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('AQUARIUS_SESSION_ID');
    if (saved) return saved;
    const newId = `session_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('AQUARIUS_SESSION_ID', newId);
    return newId;
  });
  const [modernTreasuryInternalAccounts, setModernTreasuryInternalAccounts] = useState<any[]>([]);
  const [modernTreasuryExternalAccounts, setModernTreasuryExternalAccounts] = useState<any[]>([]);
  const [modernTreasuryLedgerTransactions, setModernTreasuryLedgerTransactions] = useState<any[]>([]);
  const [modernTreasuryTransactions, setModernTreasuryTransactions] = useState<any[]>([]);
  const [modernTreasuryLedgerAccounts, setModernTreasuryLedgerAccounts] = useState<any[]>([]);

  // Sync Modern Treasury Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          '/api/v1/mt/internal-accounts',
          '/api/v1/mt/external-accounts',
          '/api/v1/mt/ledger-transactions',
          '/api/v1/mt/transactions',
          '/api/v1/mt/ledger-accounts'
        ];
        
        const results = await Promise.all(
          endpoints.map(async (e) => {
            try {
              const res = await fetch(e, {
                headers: { 
                  'x-session-id': sessionId,
                  'Accept': 'application/json'
                }
              });
              if (!res.ok) return [];
              const contentType = res.headers.get('content-type') || '';
              if (!contentType.includes('application/json')) return [];
              return await res.json();
            } catch (fetchErr: any) {
              console.warn(`[Aquarius MT] Resilient fallback for ${e}:`, fetchErr?.message || fetchErr);
              return [];
            }
          })
        );
        
        const [intAcc, extAcc, ledTx, tx, ledAcc] = results;
        
        const getItems = (res: any) => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          return res.items || res.data || [];
        };

        setModernTreasuryInternalAccounts(getItems(intAcc));
        setModernTreasuryExternalAccounts(getItems(extAcc));
        setModernTreasuryLedgerTransactions(getItems(ledTx));
        setModernTreasuryTransactions(getItems(tx));
        setModernTreasuryLedgerAccounts(getItems(ledAcc));
        console.log("[Aquarius MT] Data Fetched Successfully", { intAcc, extAcc, ledTx, tx, ledAcc });
      } catch (err) {
        console.error("Failed to fetch MT data", err);
      }
    };
    fetchData();
  }, [sessionId]);

  const [linkedAccounts, setLinkedAccounts] = useState<any[]>(() => {
    const local = localStorage.getItem('AQUARIUS_LINKED_ACCOUNTS');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return [];
  });

  const linkAccount = useCallback((acc: any) => {
    setLinkedAccounts(prev => {
      const updated = [...prev, acc];
      localStorage.setItem('AQUARIUS_LINKED_ACCOUNTS', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const unlinkAccount = useCallback((id: string) => {
    setLinkedAccounts(prev => {
      const updated = prev.filter((x: any) => x.id !== id);
      localStorage.setItem('AQUARIUS_LINKED_ACCOUNTS', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const [isWalletConnectModalOpen, setWalletConnectModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(() => walletService.getWalletInfo().address);
  const [ethBalance, setEthBalance] = useState<string>(() => walletService.getWalletInfo().balance);
  const [walletConnectionType, setWalletConnectionType] = useState<'metamask' | 'private_key' | 'internal' | null>(() => walletService.getWalletInfo().connectionType);
  const [walletTransactions, setWalletTransactions] = useState<any[]>(() => walletService.getWalletInfo().transactions);
  const [customTokens, setCustomTokens] = useState<any[]>(() => walletService.getWalletInfo().customTokens || []);
  const [networkName, setNetworkName] = useState<string>(() => walletService.getWalletInfo().networkName || 'Ethereum Mainnet');

  useEffect(() => {
    const info = walletService.getWalletInfo();
    setWalletAddress(info.address);
    setEthBalance(info.balance);
    setWalletConnectionType(info.connectionType);
    setWalletTransactions(info.transactions);
    setCustomTokens(info.customTokens || []);
    setNetworkName(info.networkName || 'Ethereum Mainnet');
  }, []);
  
  const [mtApiKey, setMtApiKey] = useState("");
  const [mtOrgId, setMtOrgId] = useState("");
  const [mtPublishableKey, setMtPublishableKey] = useState("");
  const [mtWebhookUrl, setMtWebhookUrl] = useState("");
  const [mtWebhookSigningKey, setMtWebhookSigningKey] = useState("");

  const [loginActivity, setLoginActivity] = useState<any[]>([
    {
      id: 'log-current',
      device: 'Secure Enclave Node (Current)',
      location: 'Authenticating...',
      ip: 'Detected',
      timestamp: new Date().toISOString(),
      isCurrent: true,
      browser: 'Sovereign Browser',
      os: 'Sovereign OS',
      userAgent: 'Nexus Core'
    }
  ]);

  const [securityLogs, setSecurityLogs] = useState<any[]>([
    { timestamp: new Date().toISOString(), actor: 'Kernel_Boot', action: 'Identity Handshake Initialized', status: 'SUCCESS', details: 'Awaiting mTLS attestation.' }
  ]);

  const addSimulatedLog = useCallback((actor: string, action: string, details: string, status = 'SUCCESS') => {
    setSecurityLogs(prev => [
      { timestamp: new Date().toISOString(), actor, action, status, details },
      ...prev
    ]);
  }, []);

  const addSimulatedLogin = useCallback((device: string, location: string, ip: string, email: string) => {
    const id = `sim-login-${Date.now()}`;
    setLoginActivity(prev => [
      { id, device, location, ip, timestamp: new Date().toISOString(), isCurrent: false, browser: 'Sovereign Browser', os: 'Sovereign OS', userAgent: email },
      ...prev
    ]);
  }, []);

  // Sync Profile and Data
  useEffect(() => {
    if (!currentUser) return;
    
    // Log physical access event
    addSimulatedLog(currentUser.email || 'Root', 'System Access', 'Physical enclave entry authorized via Microsoft/Google SSO.', 'SUCCESS');
  }, [currentUser]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '',
    name: 'Guest User',
    title: 'Explorer',
    email: '',
    loyaltyTier: 'BRONZE',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    usdBalance: 0, 
    fiatBalance: 0,
    cryptoBalance: 0,
    app_metadata: {
      subscription_status: 'none',
      is_pro: false,
    },
    user_metadata: {
      theme: 'sovereign_dark',
      discovery_source: 'Neural Referral'
    }
  });

  // Sync Profile and Data
  useEffect(() => {
    // Load local pro status if exists (for non-logged in users)
    const localPro = localStorage.getItem('AQUARIUS_PRO_STATUS');
    if (localPro === 'active') {
      setUserProfile(prev => ({
        ...prev,
        app_metadata: { ...prev.app_metadata, is_pro: true, subscription_status: 'active' }
      }));
    }

    if (!currentUser || authLoading) return;

    // Sync profile
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubProfile = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        const initialProfile: UserProfile = {
          id: currentUser.uid,
          name: currentUser.displayName || 'Sovereign User',
          title: 'New Architect',
          email: currentUser.email || '',
          loyaltyTier: 'BRONZE',
          avatarUrl: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
          usdBalance: 1000,
          fiatBalance: 1000,
          cryptoBalance: 0,
          app_metadata: { subscription_status: 'none', is_pro: false },
          user_metadata: { theme: 'sovereign_dark', discovery_source: 'Direct' }
        };
        setDoc(userRef, initialProfile).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${currentUser.uid}`));
        setUserProfile(initialProfile);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`));

    // Sync collections
    const txPath = `users/${currentUser.uid}/transactions`;
    const unsubTx = onSnapshot(collection(db, txPath), (snapshot) => {
      setTransactionsState(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, txPath));

    const assetPath = `users/${currentUser.uid}/portfolio`;
    const unsubAssets = onSnapshot(collection(db, assetPath), (snapshot) => {
      setAssetsState(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioAsset)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, assetPath));

    const accountPath = `users/${currentUser.uid}/accounts`;
    const unsubAccounts = onSnapshot(collection(db, accountPath), (snapshot) => {
      setInternalAccountsState(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalAccount)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, accountPath));

    const goalPath = `users/${currentUser.uid}/goals`;
    const unsubGoals = onSnapshot(collection(db, goalPath), (snapshot) => {
      setFinancialGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FinancialGoal)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, goalPath));

    const notifyPath = `users/${currentUser.uid}/notifications`;
    const unsubNotify = onSnapshot(collection(db, notifyPath), (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, notifyPath));

    return () => {
      unsubProfile();
      unsubTx();
      unsubAssets();
      unsubAccounts();
      unsubGoals();
      unsubNotify();
    };
  }, [currentUser, authLoading]);

  const synchronizeState = useCallback(async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSyncing(false);
  }, []);

  const connectWallet = async () => {
    try {
      const result = await walletService.connect();
      setWalletAddress(result.address);
      setEthBalance(result.balance);
      setWalletConnectionType('metamask');
      const info = walletService.getWalletInfo();
      setWalletTransactions(info.transactions);
      showNotification(`MetaMask Sovereign Link Established: ${result.address.slice(0, 6)}...${result.address.slice(-4)}`, "info");
    } catch (err: any) {
      showNotification(`MetaMask Link Error: ${err.message || 'Extension not detected'}`, "error");
      throw err;
    }
  };

  const importPrivateKey = async (privateKeyInput: string) => {
    try {
      const result = await walletService.importPrivateKey(privateKeyInput);
      setWalletAddress(result.address);
      setEthBalance(result.balance);
      setWalletConnectionType('private_key');
      const info = walletService.getWalletInfo();
      setWalletTransactions(info.transactions);
      showNotification(`Ethereum Private Key Loaded Successfully: ${result.address}`, "info");
    } catch (err: any) {
      showNotification(`Key Import Failed: ${err.message}`, "error");
      throw err;
    }
  };

  const generateNewWallet = async () => {
    try {
      const result = await walletService.generateNewWallet();
      setWalletAddress(result.address);
      setEthBalance(result.balance);
      setWalletConnectionType('private_key');
      const info = walletService.getWalletInfo();
      setWalletTransactions(info.transactions);
      showNotification(`New Sovereign EVM Key Generated: ${result.address}`, "info");
    } catch (err: any) {
      showNotification(`Key Generation Failed: ${err.message}`, "error");
      throw err;
    }
  };

  const depositFunds = async (amount: number, asset: string = 'ETH', method: string = 'Instant Sovereign Vault') => {
    try {
      const res = await walletService.depositFunds(amount, asset, method);
      setEthBalance(res.balance);
      setWalletAddress(res.address);
      const info = walletService.getWalletInfo();
      setWalletTransactions(info.transactions);
      
      // Also update user profile USD balance if currentUser exists
      if (currentUser && userProfile) {
        const userRef = doc(db, 'users', currentUser.uid);
        const addedUsd = amount * 3500; // ETH to USD rate
        await updateDoc(userRef, {
          usdBalance: (userProfile.usdBalance || 0) + addedUsd,
          cryptoBalance: (userProfile.cryptoBalance || 0) + amount
        }).catch(() => {});
      }

      showNotification(`Deposit Confirmed! +${amount} ${asset} credited to ${res.address.slice(0, 6)}...`, "info");
    } catch (err: any) {
      showNotification(`Deposit Failed: ${err.message}`, "error");
      throw err;
    }
  };

  const transferFunds = async (toAddress: string, amount: number, asset: string = 'ETH') => {
    try {
      const res = await walletService.transferFunds(toAddress, amount, asset);
      setEthBalance(res.balance);
      const info = walletService.getWalletInfo();
      setWalletTransactions(info.transactions);
      showNotification(`Transaction Broadcasted: -${amount} ${asset} to ${toAddress.slice(0, 6)}...`, "info");
    } catch (err: any) {
      showNotification(`Transfer Error: ${err.message}`, "error");
      throw err;
    }
  };

  const disconnectWallet = () => {
    walletService.disconnect();
    setWalletAddress(null);
    setEthBalance("0.00");
    setWalletConnectionType('internal');
    setWalletTransactions([]);
    setCustomTokens([]);
    showNotification("Wallet Disconnected", "info");
  };

  const createCustomToken = async (params: {
    name: string;
    symbol: string;
    totalSupply: number;
    decimals?: number;
    logoUrl?: string;
    network?: string;
  }) => {
    try {
      const res = await walletService.createCustomToken(params);
      const info = walletService.getWalletInfo();
      setCustomTokens(info.customTokens);
      setWalletTransactions(info.transactions);
      
      const newAsset: PortfolioAsset = {
        id: res.token.id,
        name: `${res.token.name} (${res.token.symbol})`,
        value: res.token.totalSupply * 0.05,
        assetClass: 'CRYPTO',
        performanceYTD: 24.8,
        color: '#06b6d4',
        riskLevel: 'Medium'
      };
      setAssetsState(prev => [newAsset, ...prev]);

      showNotification(`Cryptocurrency Created Successfully: ${res.token.name} (${res.token.symbol}) [${res.token.contractAddress.slice(0, 8)}...]`, "info");
      return res;
    } catch (err: any) {
      showNotification(`Token Creation Error: ${err.message}`, "error");
      throw err;
    }
  };

  const addTokenToMetaMask = async (token: { address: string; symbol: string; decimals?: number; image?: string }) => {
    try {
      const res = await walletService.addTokenToMetaMask(token);
      const info = walletService.getWalletInfo();
      setCustomTokens(info.customTokens);
      showNotification(res.message, "info");
      return res;
    } catch (err: any) {
      showNotification(`MetaMask Watch Asset Error: ${err.message}`, "error");
      throw err;
    }
  };

  const showNotification = useCallback(async (message: string, severity: Notification['severity']) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/notifications`;
    try {
      await addDoc(collection(db, path), {
        message,
        timestamp: new Date().toISOString(),
        read: false,
        severity
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }, [currentUser]);

  // Sharded Geographic Firebase Encrypts Wrapper
  const sovereignStore = useCallback(async (path: string, data: any, op: 'SET' | 'UPDATE' | 'ADD') => {
    if (!currentUser) return;
    
    // Deterministic Sharding Logic (simulate multi-region sharding)
    const regions = ['us-east-1', 'eu-west-1', 'ap-southeast-1'];
    const shardKey = currentUser.uid.charCodeAt(0) % regions.length;
    const region = regions[shardKey];
    
    // Mock Encryption (Deterministic Metal)
    const encryptedData = {
      ...data,
      _sovereign_metadata: {
        shard: shardKey,
        region,
        encrypted_at: new Date().toISOString(),
        cipher: 'AES-256-GCM-HKDF'
      }
    };

    const docRef = doc(db, path);
    try {
      if (op === 'SET') await setDoc(docRef, encryptedData);
      if (op === 'UPDATE') await updateDoc(docRef, encryptedData);
      if (op === 'ADD') await addDoc(collection(db, path), encryptedData);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }, [currentUser]);

  const value: IDataContext = {
    view,
    setView,
    userProfile,
    user: userProfile,
    creator: { name: 'James Burvel oCallaghan III', title: 'Grand Architect' },
    transactions,
    assets,
    modernTreasuryInternalAccounts,
    modernTreasuryExternalAccounts,
    modernTreasuryLedgerTransactions,
    modernTreasuryTransactions,
    modernTreasuryLedgerAccounts,
    internalAccounts,
    notifications,
    insights: [],
    budgets: [],
    rewardItems: [],
    apiStatus: [],
    isSyncing,
    setTransactions: async (txs) => {
      if (!currentUser) return;
      const path = `users/${currentUser.uid}/transactions`;
      try {
        for (const tx of txs) {
          // Check if transaction already exists locally to avoid double processing in this simple implementation
          const exists = transactions.some(t => t.id === tx.id);
          if (!exists) {
            await addDoc(collection(db, path), tx);
            
            // Register in Modern Treasury Ledger if we have an account mapping
            const mtAccountId = tx.metadata?.mt_ledger_account_id;
            if (mtAccountId) {
              fetch('/api/v1/ledger/register-transaction', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'x-session-id': sessionId
                },
                body: JSON.stringify({
                  transaction: tx,
                  ledger_account_id: mtAccountId
                })
              }).catch(e => console.error("MT Ledger Auto-Sync Error", e));
            }
          }
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    },
    updateTransaction: async (id, updates) => {
      if (!currentUser) return;
      const path = `users/${currentUser.uid}/transactions/${id}`;
      try {
        await updateDoc(doc(db, path), updates);
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, path);
      }
    },
    deleteTransaction: async (id) => {
      if (!currentUser) return;
      const path = `users/${currentUser.uid}/transactions/${id}`;
      try {
        await deleteDoc(doc(db, path));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, path);
      }
    },
    setAssets: async (assets) => {
      if (!currentUser) return;
      const path = `users/${currentUser.uid}/portfolio`;
      try {
        for (const asset of assets) {
          await addDoc(collection(db, path), asset);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    },
    setInternalAccounts: async (accounts) => {
      if (!currentUser) return;
      const path = `users/${currentUser.uid}/accounts`;
      try {
        for (const acc of accounts) {
          await addDoc(collection(db, path), acc);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    },
    showNotification,
    markNotificationRead: async (id) => {
      if (!currentUser) return;
      const path = `users/${currentUser.uid}/notifications/${id}`;
      try {
        await updateDoc(doc(db, path), { read: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, path);
      }
    },
    redeemReward: (item) => {
      showNotification(`Redeemed ${item.name}`, 'info');
      return true;
    },
    simulationData: Array.from({length: 30}, (_, i) => ({ time: `T-${30-i}`, value: 2450000000 + Math.random() * 50000000 })),
    isImportingData: false,
    treesPlanted: 142,
    spendingForNextTree: 120,
    isWalletConnectModalOpen,
    setWalletConnectModalOpen,
    connectWallet,
    importPrivateKey,
    generateNewWallet,
    depositFunds,
    transferFunds,
    disconnectWallet,
    walletAddress,
    ethBalance,
    walletConnectionType,
    walletTransactions,
    customTokens,
    networkName,
    createCustomToken,
    addTokenToMetaMask,
    
    // --- FIREBASE IMPLEMENTATIONS FOR MISSING PROPERTIES ---
    financialGoals,
    addFinancialGoal: async (goal) => {
      if (!currentUser) return;
      const path = `users/${currentUser.uid}/goals`;
      try {
        await addDoc(collection(db, path), { ...goal, status: 'on_track' });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    },
    generateGoalPlan: async () => {},
    addContributionToGoal: async (goalId, amount) => {
      if (!currentUser) return;
      const goal = financialGoals.find(g => g.id === goalId);
      if (!goal) return;
      const path = `users/${currentUser.uid}/goals/${goalId}`;
      try {
        await updateDoc(doc(db, path), { currentAmount: goal.currentAmount + amount });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, path);
      }
    },
    addRecurringContributionToGoal: () => {},
    updateRecurringContributionInGoal: () => {},
    deleteRecurringContributionFromGoal: () => {},
    updateFinancialGoal: async (goalId, updates) => {
      if (!currentUser) return;
      const path = `users/${currentUser.uid}/goals/${goalId}`;
      try {
        await updateDoc(doc(db, path), updates);
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, path);
      }
    },
    linkGoals: () => {},
    unlinkGoals: () => {},
    
    creditScore: { score: 750, rating: 'Excellent', lastUpdated: new Date().toISOString() },
    creditFactors: [],
    
    modernTreasuryApiKey: mtApiKey,
    setModernTreasuryApiKey: setMtApiKey,
    modernTreasuryOrganizationId: mtOrgId,
    setModernTreasuryOrganizationId: setMtOrgId,
    modernTreasuryPublishableKey: mtPublishableKey,
    setModernTreasuryPublishableKey: setMtPublishableKey,
    modernTreasuryWebhookUrl: mtWebhookUrl,
    setModernTreasuryWebhookUrl: setMtWebhookUrl,
    modernTreasuryWebhookSigningKey: mtWebhookSigningKey,
    setModernTreasuryWebhookSigningKey: setMtWebhookSigningKey,
    
    paymentOrders: [],
    invoices: [],
    complianceCases: [],
    corporateTransactions: [],
    
    linkedAccounts,
    unlinkAccount,
    linkAccount,
    
    authorizedApps: [],
    authorizeApp: () => {},
    revokeApp: () => {},
    
    rewardPoints: { balance: 0, lastEarned: 0, lastRedeemed: 0, currency: 'USD', total: 0, pending: 0, history: [] },
    
    achSettings: [],
    pipelines: [],
    inboundBlobs: [],
    fundFlows: [],
    login: async () => {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error("Login failed", error);
      }
    },
    logout: async () => {
      try {
        await firebaseLogout();
      } catch (error) {
        console.error("Logout failed", error);
      }
    },
    isAuthReady: !authLoading,
    isAuthenticated: !!currentUser,
    sessionId,
    buyCrypto: async (amount: number, cryptoType: string) => {
      if (!currentUser) return;
      if (userProfile.usdBalance < amount) {
        showNotification("Insufficient USD balance", "error");
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const cryptoAmount = amount / 50000; // Mock rate: 1 BTC = $50,000

      try {
        await updateDoc(userRef, {
          usdBalance: userProfile.usdBalance - amount,
          cryptoBalance: userProfile.cryptoBalance + cryptoAmount
        });
        showNotification(`Successfully purchased ${cryptoAmount.toFixed(6)} ${cryptoType}`, "success");
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    },
    loginActivity,
    securityLogs,
    addSimulatedLog,
    addSimulatedLogin,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

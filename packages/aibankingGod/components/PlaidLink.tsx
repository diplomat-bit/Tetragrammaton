
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess } from 'react-plaid-link';
import { Landmark, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const PlaidLink: React.FC = () => {
  const context = useContext(DataContext);
  const sessionId = context?.sessionId;
  const [linkToken, setLinkToken] = useState<string | null>(() => {
    return sessionStorage.getItem('plaid_link_token');
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOAuthRedirect = typeof window !== 'undefined' && (
    window.location.search.includes('oauth_state_id') ||
    window.location.search.includes('link_token')
  );

  // 1. Generate a link token
  const generateToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/plaid/create-link-token', { 
        method: 'POST',
        headers: { 'x-session-id': sessionId || '' }
      });
      const data = await response.json();
      if (data.link_token) {
        setLinkToken(data.link_token);
        sessionStorage.setItem('plaid_link_token', data.link_token);
      } else {
        setError(data.error || "Failed to generate link token");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Exchange public token for access token
  const exchangeToken = async (publicToken: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/plaid/exchange-public-token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId || ''
        },
        body: JSON.stringify({ public_token: publicToken }),
      });
      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        // data.accounts now contains the registered MT IDs and Stripe tokens
        if (context) {
          const formattedAccounts = (data.accounts || []).map((acc: any) => ({
            id: acc.plaid_id,
            mt_account_id: acc.mt_id,
            stripe_bank_token: acc.stripe_token,
            bestName: acc.name,
            operationalStatus: 'active',
            bankName: 'Sovereign Distributed Node',
            mask: acc.mask
          }));
          context.setInternalAccounts([...formattedAccounts, ...context.internalAccounts]);
        }
        // 3. Get accounts and transactions (this can now use the new IDs)
        await fetchAccounts(data.access_token, data.accounts);
      } else {
        setError("Failed to establish robust neural link");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch accounts and transactions
  const fetchAccounts = async (token: string, registeredAccounts: any[] = []) => {
    setLoading(true);
    try {
      // Fetch transactions
      const txResponse = await fetch('/api/v1/plaid/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId || ''
        },
        body: JSON.stringify({
          access_token: token,
          start_date: '2024-01-01',
          end_date: new Date().toISOString().split('T')[0]
        }),
      });
      const txData = await txResponse.json();
      if (txData.transactions && context) {
        const plaidTransactions = txData.transactions.map((t: any) => {
          // Find the MT account ID for this transaction's account
          const mapping = registeredAccounts.find(a => a.plaid_id === t.account_id);
          return {
            id: t.transaction_id,
            date: t.date,
            amount: t.amount,
            type: t.amount > 0 ? 'debit' : 'credit',
            category: t.category?.[0] || 'Uncategorized',
            description: t.name,
            metadata: {
              merchantName: t.merchant_name || t.name,
              carbonFootprint: Math.random() * 10,
              tags: t.category || [],
              plaid_account_id: t.account_id,
              mt_ledger_account_id: mapping?.mt_id
            }
          };
        });
        
        // Push to local context (this will sync to Firebase)
        context.setTransactions([...plaidTransactions, ...context.transactions]);
        
        // OPTIONAL: Also ping the server to register these into the MT ledger officially
        // Users said "every transaction in the app need to register in modern treasury"
        for (const tx of plaidTransactions.slice(0, 10)) { // Just first 10 for demo/performance
          if (tx.metadata.mt_ledger_account_id) {
            fetch('/api/v1/ledger/register-transaction', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-session-id': sessionId || ''
              },
              body: JSON.stringify({
                transaction: tx,
                ledger_account_id: tx.metadata.mt_ledger_account_id
              })
            }).catch(e => console.error("Auto-registration in MT failed for transaction", tx.id, e));
          }
        }

        context.showNotification("Sovereign Ledger Synchronized with MT & Stripe.", "success");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = useCallback<PlaidLinkOnSuccess>((public_token, metadata) => {
    exchangeToken(public_token);
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken!,
    onSuccess,
    ...(isOAuthRedirect ? { receivedRedirectUri: window.location.href } : {})
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900/80 border border-indigo-500/30 rounded-3xl shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <Landmark className="text-indigo-400 w-6 h-6" />
        <h2 className="text-lg font-black text-white tracking-tight uppercase">Neural Ledger Sync</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!accessToken ? (
        <div className="space-y-6">
          <p className="text-slate-400 text-sm font-light leading-relaxed">
            Synchronize your external financial nodes with the Aquarius Sovereign Singularity. 
            This establishes a direct neural link to your capital reserves.
          </p>
          <button
            onClick={generateToken}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Landmark size={20} />}
            {loading ? 'INITIALIZING LINK...' : 'ESTABLISH PLAID LINK'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-400 text-sm">
            <CheckCircle2 size={18} />
            <span>Neural Link Established</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Detected Nodes</h3>
            {accounts.map((account) => (
              <div key={account.account_id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="text-white font-bold text-sm">{account.name}</div>
                  <div className="text-slate-500 text-[10px] uppercase font-mono">{account.subtype} • ••••{account.mask}</div>
                </div>
                <div className="text-indigo-400 font-mono font-bold">
                  ${account.balances.current?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setAccessToken(null); setAccounts([]); setLinkToken(null); }}
            className="w-full py-3 text-[10px] text-slate-500 hover:text-indigo-400 font-mono uppercase tracking-widest transition-colors"
          >
            Reset Neural Link
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaidLink;

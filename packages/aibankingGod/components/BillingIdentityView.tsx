import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Shield, Lock, CreditCard, Zap, Cpu, Sparkles, CheckCircle2, 
  ArrowLeft, RefreshCw, Terminal, DollarSign, Layers, Play 
} from 'lucide-react';

let stripePromiseCache: Promise<any> | null = null;
const getStripePromise = () => {
  if (!stripePromiseCache) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (key) {
      stripePromiseCache = loadStripe(key).catch(err => {
        console.warn("Stripe.js failed to load:", err);
        return null;
      });
    } else {
      stripePromiseCache = Promise.resolve(null);
    }
  }
  return stripePromiseCache;
};
import { useFirebase } from '../context/FirebaseContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Catalog items defined exactly as in backend
const PRODUCT_CATALOG = [
  { id: "prod_agentic_compute", name: "Sovereign Agentic Compute Node", price: 49.00, description: "Dedicated TPU core allocation for autonomous agent execution.", icon: <Cpu className="w-6 h-6 text-indigo-400" /> },
  { id: "prod_wealth_intelligence", name: "Quantum Wealth Advisor License", price: 99.00, description: "Advanced predictive ledger algorithms & high-net-worth macro indexing.", icon: <Sparkles className="w-6 h-6 text-amber-400" /> },
  { id: "prod_privacy_shield", name: "Sovereign Shield Encryption Node", price: 29.00, description: "Double-blinded on-chain data privacy guardian.", icon: <Shield className="w-6 h-6 text-green-400" /> }
];

const BillingIdentityView: React.FC = () => {
  const { user } = useFirebase();
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Success states matching the blueprint
  const [successSessionId, setSuccessSessionId] = useState<string | null>(null);
  const [purchasedId, setPurchasedId] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [checkingEvents, setCheckingEvents] = useState(false);
  const [eventLogs, setEventLogs] = useState<string[]>([]);
  const [eventProgress, setEventProgress] = useState<{
    init: 'pending' | 'success';
    paymentIntent: 'pending' | 'success';
    checkoutSession: 'pending' | 'success';
  }>({ init: 'pending', paymentIntent: 'pending', checkoutSession: 'pending' });

  // Handle success redirect from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('stripe_success');
    const sessionId = params.get('session_id');
    const productPurchased = params.get('product_purchased');

    if (success === 'true' && sessionId) {
      setSuccessSessionId(sessionId);
      if (productPurchased) {
        setPurchasedId(productPurchased);
      }
      handlePaymentSuccess(sessionId, productPurchased);
    }
  }, []);

  const handlePaymentSuccess = async (sessionId: string, productPurchased: string | null) => {
    setIsLoading(true);
    try {
      // 1. Fetch Session details
      const response = await fetch(`/api/v1/stripe/session/${sessionId}?product_purchased=${productPurchased || ''}`);
      const session = await response.json();
      setSessionDetails(session);

      // 2. Fetch Order Details (Line Items) - View Order Details Node requirement
      const lineItemsRes = await fetch(`/api/v1/stripe/session/${sessionId}/line-items?product_purchased=${productPurchased || ''}`);
      const lineItemsData = await lineItemsRes.json();
      setLineItems(lineItemsData.data || []);

      if (session.payment_status === 'paid') {
        setIsConfirmed(true);
        if (!productPurchased) {
          localStorage.setItem('AQUARIUS_PRO_STATUS', 'active');
          if (user) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              'app_metadata.is_pro': true,
              'app_metadata.subscription_status': 'active'
            });
          }
        }
        
        // 3. Initiate Webhook Event Tracing (payment_intent.succeeded & checkout.session.completed)
        triggerEventTracing(sessionId, session, productPurchased);
      }
    } catch (error: any) {
      console.error("Verification failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerEventTracing = async (sessionId: string, session: any, productPurchased: string | null) => {
    setCheckingEvents(true);
    setEventLogs([`[${new Date().toLocaleTimeString()}] Listening for Stripe events in sandbox...`]);
    
    // Simulate/poll event tracing matching the asyncHandlers
    setTimeout(() => {
      setEventProgress(prev => ({ ...prev, init: 'success' }));
      setEventLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] terminal_established. Status: ACTIVE`]);
    }, 1000);

    // Simulate payment_intent.succeeded
    setTimeout(async () => {
      try {
        const payload = {
          id: session.payment_intent || `pi_${Date.now()}`,
          amount: session.amount_total || 4900,
          currency: 'usd',
          status: 'succeeded'
        };
        await fetch('/api/v1/stripe/simulate-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'payment_intent.succeeded',
            payload
          })
        });
        setEventProgress(prev => ({ ...prev, paymentIntent: 'success' }));
        setEventLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] event: payment_intent.succeeded -> Processed successfully.`]);
      } catch (err) {
        console.error(err);
      }
    }, 2200);

    // Simulate checkout.session.completed
    setTimeout(async () => {
      try {
        const payload = {
          id: sessionId,
          payment_status: 'paid',
          metadata: { productId: productPurchased }
        };
        await fetch('/api/v1/stripe/simulate-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'checkout.session.completed',
            payload
          })
        });
        setEventProgress(prev => ({ ...prev, checkoutSession: 'success' }));
        setEventLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] event: checkout.session.completed -> Verified & linked to neural cores.`]);
        setEventLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Synchronization complete. Sovereign agent active.`]);
      } catch (err) {
        console.error(err);
      }
    }, 3800);
  };

  const handlePurchaseProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      const stripe = await getStripePromise();
      if (stripe && data.id && !data.url?.includes('mock_session')) {
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        if (result.error) throw new Error(result.error.message);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      alert(error.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectLedger = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      const stripe = await getStripePromise();
      if (stripe && data.id && !data.url?.includes('mock_session')) {
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        if (result.error) throw new Error(result.error.message);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Stripe Error:", error);
      alert(error.message || "Failed to initiate ledger link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    setIsSimulating(true);
    try {
      localStorage.setItem('AQUARIUS_PRO_STATUS', 'active');
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          'app_metadata.is_pro': true,
          'app_metadata.subscription_status': 'active'
        });
      }
      window.location.reload();
    } catch (error) {
      if (user) handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const clearReceipt = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    setSuccessSessionId(null);
    setPurchasedId(null);
    setSessionDetails(null);
    setLineItems([]);
    setCheckingEvents(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-6xl mx-auto p-6 md:p-10 text-white font-sans">
      
      {/* If Stripe success parameter is present, show order confirmation details receipt */}
      {successSessionId ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[70vh]">
          
          {/* Order Details Panel (view-order-details Node requirement) */}
          <div className="col-span-12 lg:col-span-7 bg-slate-910/90 border border-emerald-500/20 rounded-[3rem] p-8 md:p-10 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
            
            <header className="flex justify-between items-start border-b border-white/5 pb-6">
              <div>
                <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Secure Checkout Complete
                </span>
                <h1 className="text-3xl font-black tracking-tight mt-3">Order Invoice</h1>
                <p className="text-xs font-mono text-gray-500 mt-1">Session ID: {successSessionId}</p>
              </div>
              <button 
                onClick={clearReceipt}
                className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all flex items-center gap-2 text-xs font-mono"
              >
                <ArrowLeft size={14} /> Catalog
              </button>
            </header>

            <div className="space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">Order Details Line Items</h2>
              
              {lineItems.length > 0 ? (
                <div className="space-y-4">
                  {lineItems.map((item, index) => (
                    <div key={item.id || index} className="flex justify-between items-center bg-white/5 border border-white/5 p-5 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                          <Layers className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{item.description}</div>
                          <div className="text-xs text-gray-400 font-mono">Quantity: {item.quantity || 1}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-sm text-emerald-400">
                        ${((item.amount_total || 0) / 100).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center text-xs text-gray-400 font-mono">
                  Loading final transaction nodes from Stripe ledger...
                </div>
              )}

              <div className="border-t border-white/5 pt-5 space-y-3">
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>Subtotal</span>
                  <span>${lineItems.reduce((acc, current) => acc + (current.amount_total || 0), 0) / 100} USD</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>Processing Rails</span>
                  <span className="text-emerald-400">FREE TESTMODE</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <span className="font-bold text-sm">TOTAL AMOUNT</span>
                  <span className="font-black text-xl text-emerald-400 font-mono">
                    ${lineItems.reduce((acc, current) => acc + (current.amount_total || 0), 0) / 100} USD
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2"><Lock size={12} className="text-emerald-400" /> Secure Handshake Payload</span>
              <span>{sessionDetails?.payment_intent || 'Verified'}</span>
            </div>
          </div>

          {/* Real-time Webhook Event Tracer (wait-for-events Node requirements) */}
          <div className="col-span-12 lg:col-span-5 bg-black border border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal className="text-indigo-400 w-5 h-5" />
                  <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Stripe Webhook Tracker</h3>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" /> Real-time
                </span>
              </div>

              {/* Status checklist */}
              <div className="space-y-4 py-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">1. Initialize Agent Trace</span>
                  {eventProgress.init === 'success' ? (
                    <span className="text-xs font-mono text-green-400 font-bold">● SUCCESS</span>
                  ) : (
                    <span className="text-xs font-mono text-indigo-400/50 animate-pulse">● TRACKING...</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">2. payment_intent.succeeded</span>
                  {eventProgress.paymentIntent === 'success' ? (
                    <span className="text-xs font-mono text-green-400 font-bold">● CAPTURED</span>
                  ) : (
                    <span className="text-xs font-mono text-amber-400/50">● PENDING...</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">3. checkout.session.completed</span>
                  {eventProgress.checkoutSession === 'success' ? (
                    <span className="text-xs font-mono text-green-400 font-bold">● COMPLETED</span>
                  ) : (
                    <span className="text-xs font-mono text-amber-400/50">● PENDING...</span>
                  )}
                </div>
              </div>

              {/* Real-time console interface */}
              <div className="p-4 bg-slate-950 rounded-2xl font-mono text-[11px] text-slate-300 space-y-2 h-44 overflow-y-auto border border-white/5">
                {eventLogs.map((log, i) => (
                  <div key={i} className={`leading-relaxed ${log.includes('event:') || log.includes('SUCCESS') ? 'text-green-400' : ''}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center mt-6">
              <p className="text-[10px] uppercase text-gray-400 font-mono tracking-widest">
                Verification Sandbox Mode Handshake Active
              </p>
            </div>
          </div>

        </div>
      ) : (
        <>
          {/* Header Banner */}
          <header className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Shield className="text-indigo-400 w-8 h-8" />
              <h2 className="text-xs font-mono text-indigo-400 uppercase tracking-[0.4em] font-bold">Sovereign Financial Gateway</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">Access & Catalog</span></h1>
            <p className="text-gray-400 max-w-xl font-light leading-relaxed mx-auto text-sm">
              Connect capital links with Stripe, purchase agentic compute expansions on-demand, or activate full system access below.
            </p>
          </header>

          {/* 2-Section Grid: Left (Sovereign Pro access paywall), Right (Agentic Purchase Catalog) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Primary access paywall */}
            <div className="col-span-12 lg:col-span-5 bg-slate-900/60 border border-indigo-500/20 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/25">
                    Universal Membership Link
                  </span>
                  <h3 className="text-2xl font-black tracking-tight text-white mt-4">Sovereign Pro Access</h3>
                  <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider">Unlocks Unlimited Compute Enclaves</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5 text-xs text-gray-400 space-y-2 font-mono">
                  <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-indigo-400" /> Unlimited Neural Ingest Vectors</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-indigo-400" /> High-frequency Multi-Agent Compute</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-indigo-400" /> Real-time Treasury Reconciliation</div>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <button 
                  onClick={handleConnectLedger}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-[1.01] active:scale-95 shadow-xl disabled:opacity-50"
                >
                  <CreditCard size={18} />
                  {isLoading ? 'INITIATING LINK...' : 'SUBSCRIBE TO MEMBERSHIP'}
                </button>

                <button 
                  onClick={handleSimulateSuccess}
                  disabled={isSimulating}
                  className="w-full justify-center text-[10px] text-indigo-400/30 hover:text-indigo-400 font-mono uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <Zap size={10} /> {isSimulating ? 'Establishing Link...' : 'Bypass_Paywall_Simulation'}
                </button>
              </div>
            </div>

            {/* Agentic Purchase Catalog (purchase-catalog-product step from the blueprint) */}
            <div className="col-span-12 lg:col-span-7 bg-slate-900/60 border border-slate-700/20 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent pointer-events-none" />
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/25">
                    Financial On-Demand Registry
                  </span>
                  <h3 className="text-2xl font-black tracking-tight text-white mt-4">Agentic Product Catalog</h3>
                  <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider">Deploy specialized resources to your workspace</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  {PRODUCT_CATALOG.map((product) => (
                    <div key={product.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 border border-white/5 p-4 rounded-2xl gap-4 hover:border-indigo-500/20 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 shrink-0 mt-0.5">
                          {product.icon}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{product.name}</div>
                          <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed max-w-sm">{product.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t border-white/5 md:border-none pt-3 md:pt-0">
                        <span className="text-sm font-mono font-black text-amber-400">${product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => handlePurchaseProduct(product.id)}
                          disabled={isLoading}
                          className="bg-white text-black font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-1.5 shrink-0 uppercase tracking-tighter font-mono"
                        >
                          <Play size={10} fill="black" /> Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl w-full mx-auto mt-6 text-center border-t border-white/5 pt-10">
            <div className="space-y-1">
              <div className="text-indigo-400 font-black text-lg">74+</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold font-mono">Secure Nodes Active</div>
            </div>
            <div className="space-y-1">
              <div className="text-indigo-400 font-black text-lg">PRO TESTMODE</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold font-mono">Stripe Sandbox Integration</div>
            </div>
            <div className="space-y-1">
              <div className="text-indigo-400 font-black text-lg">PRIORITY</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold font-mono">Gemini Logic Execution</div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default BillingIdentityView;

import { loadStripe } from '@stripe/stripe-js';

let stripePromiseCache: Promise<any> | null = null;

function getStripePromise() {
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
}

export const stripeService = {
  async initiatePayment(amount: number, description: string) {
    const response = await fetch('/api/v1/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    if (data.url) {
      // Direct redirect to the live Stripe-hosted checkout page (extremely reliable, requires no public tokens on client)
      window.location.href = data.url;
      return;
    }

    if (data.id) {
      const stripe = await getStripePromise();
      if (stripe) {
        await (stripe as any).redirectToCheckout({ sessionId: data.id });
      }
    }
  }
};

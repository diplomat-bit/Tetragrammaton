
import { UserProfile } from '../types';

/**
 * THE LAST BOSS: ARCHITECTURAL CODEX SERVICE
 * 
 * Pillar 1: Identity (Auth0)
 * Pillar 2: Accounting (Stripe)
 * Pillar 3: Governance (Middleware Simulation)
 */

class LastBossService {
  private user: UserProfile | null = null;

  init(user: UserProfile) {
    this.user = user;
  }

  /**
   * Governance (The Steel Door)
   * Check if user is allowed to access premium enclaves.
   */
  canAccess(feature: string): boolean {
    if (!this.user) return false;
    
    // app_metadata is the VAULT (Source of truth cache)
    const isPro = this.user.app_metadata.is_pro;
    const status = this.user.app_metadata.subscription_status;

    // Direct objective execution: status must be active
    return isPro && status === 'active';
  }

  /**
   * Simulate a Webhook update (The central nervous system)
   */
  async simulatePaymentSuccess() {
    if (!this.user) return;
    
    // Simulate server-side update of app_metadata via M2M
    this.user.app_metadata = {
      ...this.user.app_metadata,
      stripe_customer_id: 'cus_LAST_BOSS_777',
      subscription_status: 'active',
      is_pro: true
    };
    
    return this.user;
  }

  /**
   * User Metadata (The Closet)
   * Data the user can potentially modify
   */
  updateCloset(updates: Partial<UserProfile['user_metadata']>) {
    if (!this.user) return;
    this.user.user_metadata = { ...this.user.user_metadata, ...updates };
  }

  getSubscriptionStatus() {
    return this.user?.app_metadata.subscription_status || 'none';
  }
}

export const lastBossService = new LastBossService();

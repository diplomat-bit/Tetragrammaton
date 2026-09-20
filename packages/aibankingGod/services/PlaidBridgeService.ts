import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { alpacaFundingService } from './AlpacaFundingService';

export interface PlaidLinkedAccount {
  id: string;
  institution_name: string;
  account_name: string;
  mask: string;
  type: 'checking' | 'savings';
  processor_token: string;
  alpaca_ach_id?: string;
  linked_at: string;
}

export class PlaidBridgeService {
  private static instance: PlaidBridgeService;
  // We should ultimately store this in Astra DB or Firebase.
  // For the sake of the client service, we can keep a local cache,
  // but it should pull from the server.
  private linkedAccounts: Map<string, PlaidLinkedAccount[]> = new Map();

  public static getInstance(): PlaidBridgeService {
    if (!PlaidBridgeService.instance) {
      PlaidBridgeService.instance = new PlaidBridgeService();
    }
    return PlaidBridgeService.instance;
  }

  public async createLinkToken(userId: string): Promise<{ link_token: string; expiration: string }> {
    try {
      const res = await axios.post('/api/v1/plaid/create-link-token', { client_user_id: userId });
      return {
        link_token: res.data.link_token,
        expiration: res.data.expiration
      };
    } catch (e) {
      console.error("[PLAID] createLinkToken error", e);
      throw e;
    }
  }

  public async exchangePublicTokenAndLinkAlpaca(
    accountId: string,
    publicToken: string,
    accountMetadata: { institutionName: string; accountName: string; mask: string; accountType: 'checking' | 'savings' }
  ): Promise<PlaidLinkedAccount> {
    try {
      // Hit backend to exchange the token
      const res = await axios.post('/api/v1/plaid/exchange-public-token', {
        public_token: publicToken,
        metadata: accountMetadata
      });
      // The server could handle the Alpaca linkage or we handle it here
      // if the server returned a processor_token.
      // Usually Plaid provides a processor token for Alpaca.
      const processorToken = res.data.processor_token || `processor-alpaca-sandbox-${uuidv4().replace(/-/g, '')}`;

      // Create Alpaca ACH Relationship automatically
      const achRel = await alpacaFundingService.createRecipientBank(accountId, {
        name: `${accountMetadata.institutionName} (${accountMetadata.mask})`,
        bank_code: '021000089',
        bank_code_type: 'ABA',
        account_number: `*******${accountMetadata.mask}`,
        city: 'New York',
        country: 'USA'
      });

      const item: PlaidLinkedAccount = {
        id: uuidv4(),
        institution_name: accountMetadata.institutionName,
        account_name: accountMetadata.accountName,
        mask: accountMetadata.mask,
        type: accountMetadata.accountType,
        processor_token: processorToken,
        alpaca_ach_id: achRel.id,
        linked_at: new Date().toISOString()
      };

      const existing = this.linkedAccounts.get(accountId) || [];
      this.linkedAccounts.set(accountId, [...existing, item]);

      return item;
    } catch (e) {
      console.error("[PLAID] exchange error", e);
      throw e;
    }
  }

  public async getLinkedAccounts(accountId: string): Promise<PlaidLinkedAccount[]> {
    return this.linkedAccounts.get(accountId) || [];
  }
}

export const plaidBridgeService = PlaidBridgeService.getInstance();
export default PlaidBridgeService;

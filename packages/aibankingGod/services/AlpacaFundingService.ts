import { v4 as uuidv4 } from 'uuid';

export interface AlpacaRecipientBank {
  id: string;
  account_id: string;
  name: string;
  bank_code: string;
  bank_code_type: 'ABA' | 'BIC';
  account_number: string;
  city: string;
  country: string;
  status: 'APPROVED' | 'QUEUED' | 'REJECTED';
  created_at: string;
}

export interface AlpacaInstantFunding {
  id: string;
  account_no: string;
  source_account_no: string;
  amount: string;
  status: 'PENDING' | 'EXECUTED' | 'COMPLETED' | 'CANCELED';
  system_date: string;
  deadline: string;
  created_at: string;
}

export interface AlpacaFundingWallet {
  account_id: string;
  status: 'active' | 'disabled';
  created_at: string;
}

export interface AlpacaCryptoWallet {
  address: string;
  chain: string;
  created_at: string;
  asset: string;
}

export interface AlpacaCryptoWhitelist {
  id: string;
  address: string;
  asset: string;
  chain: string;
  status: 'APPROVED' | 'PENDING';
  created_at: string;
}

export class AlpacaFundingService {
  private static instance: AlpacaFundingService;

  private recipientBanks: Map<string, AlpacaRecipientBank[]> = new Map();
  private instantFundings: Map<string, AlpacaInstantFunding[]> = new Map();
  private fundingWallets: Map<string, AlpacaFundingWallet> = new Map();
  private cryptoWallets: Map<string, AlpacaCryptoWallet[]> = new Map();
  private cryptoWhitelists: Map<string, AlpacaCryptoWhitelist[]> = new Map();

  private constructor() {
    this.seedDefaults();
  }

  public static getInstance(): AlpacaFundingService {
    if (!AlpacaFundingService.instance) {
      AlpacaFundingService.instance = new AlpacaFundingService();
    }
    return AlpacaFundingService.instance;
  }

  private seedDefaults() {
    const sampleAccountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
    this.recipientBanks.set(sampleAccountId, [
      {
        id: uuidv4(),
        account_id: sampleAccountId,
        name: 'Citi Sovereign Institutional Vault',
        bank_code: '021000089',
        bank_code_type: 'ABA',
        account_number: '777888999111',
        city: 'New York',
        country: 'USA',
        status: 'APPROVED',
        created_at: new Date().toISOString()
      }
    ]);

    this.fundingWallets.set(sampleAccountId, {
      account_id: sampleAccountId,
      status: 'active',
      created_at: new Date().toISOString()
    });

    this.cryptoWallets.set(sampleAccountId, [
      {
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        chain: 'ETH',
        asset: 'USDC',
        created_at: new Date().toISOString()
      },
      {
        address: 'Sol11111111111111111111111111111111111111111',
        chain: 'SOL',
        asset: 'SOL',
        created_at: new Date().toISOString()
      }
    ]);

    this.cryptoWhitelists.set(sampleAccountId, [
      {
        id: uuidv4(),
        address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88',
        asset: 'USDC',
        chain: 'ETH',
        status: 'APPROVED',
        created_at: new Date().toISOString()
      }
    ]);
  }

  public async getRecipientBanks(accountId: string): Promise<AlpacaRecipientBank[]> {
    return this.recipientBanks.get(accountId) || [];
  }

  public async createRecipientBank(accountId: string, bank: Omit<AlpacaRecipientBank, 'id' | 'account_id' | 'status' | 'created_at'>): Promise<AlpacaRecipientBank> {
    const newBank: AlpacaRecipientBank = {
      id: uuidv4(),
      account_id: accountId,
      ...bank,
      status: 'APPROVED',
      created_at: new Date().toISOString()
    };
    const existing = this.recipientBanks.get(accountId) || [];
    this.recipientBanks.set(accountId, [...existing, newBank]);
    return newBank;
  }

  public async getFundingWallet(accountId: string): Promise<AlpacaFundingWallet> {
    let wallet = this.fundingWallets.get(accountId);
    if (!wallet) {
      wallet = { account_id: accountId, status: 'active', created_at: new Date().toISOString() };
      this.fundingWallets.set(accountId, wallet);
    }
    return wallet;
  }

  public async createInstantFunding(accountNo: string, amount: string): Promise<AlpacaInstantFunding> {
    const item: AlpacaInstantFunding = {
      id: uuidv4(),
      account_no: accountNo,
      source_account_no: '927721227', // Firm sweep account
      amount,
      status: 'EXECUTED',
      system_date: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    const list = this.instantFundings.get(accountNo) || [];
    this.instantFundings.set(accountNo, [item, ...list]);
    return item;
  }

  public async getCryptoWallets(accountId: string): Promise<AlpacaCryptoWallet[]> {
    return this.cryptoWallets.get(accountId) || [];
  }

  public async addCryptoWhitelist(accountId: string, address: string, asset: string, chain: string): Promise<AlpacaCryptoWhitelist> {
    const item: AlpacaCryptoWhitelist = {
      id: uuidv4(),
      address,
      asset,
      chain,
      status: 'APPROVED',
      created_at: new Date().toISOString()
    };
    const existing = this.cryptoWhitelists.get(accountId) || [];
    this.cryptoWhitelists.set(accountId, [...existing, item]);
    return item;
  }

  public async getCryptoWhitelists(accountId: string): Promise<AlpacaCryptoWhitelist[]> {
    return this.cryptoWhitelists.get(accountId) || [];
  }
}

export const alpacaFundingService = AlpacaFundingService.getInstance();
export default AlpacaFundingService;

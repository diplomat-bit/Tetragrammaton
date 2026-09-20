import { v4 as uuidv4 } from 'uuid';

export interface AlpacaTokenizationRequest {
  tokenization_request_id: string;
  type: 'mint' | 'redeem';
  status: 'pending' | 'completed' | 'rejected';
  underlying_symbol: string;
  token_symbol: string;
  qty: string;
  issuer: 'st0x' | 'xstocks';
  network: 'ethereum' | 'arbitrum' | 'solana' | 'binance' | 'ton' | 'mantle';
  wallet_address: string;
  tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export class AlpacaTokenizationService {
  private static instance: AlpacaTokenizationService;
  private requests: Map<string, AlpacaTokenizationRequest> = new Map();

  private constructor() {
    this.seedDefaults();
  }

  public static getInstance(): AlpacaTokenizationService {
    if (!AlpacaTokenizationService.instance) {
      AlpacaTokenizationService.instance = new AlpacaTokenizationService();
    }
    return AlpacaTokenizationService.instance;
  }

  private seedDefaults() {
    const id = uuidv4();
    this.requests.set(id, {
      tokenization_request_id: id,
      type: 'mint',
      status: 'completed',
      underlying_symbol: 'AAPL',
      token_symbol: 'sAAPL',
      qty: '100.0',
      issuer: 'st0x',
      network: 'ethereum',
      wallet_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      tx_hash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  public async requestMint(symbol: string, qty: string, issuer: 'st0x' | 'xstocks', network: any, walletAddress: string): Promise<AlpacaTokenizationRequest> {
    const id = uuidv4();
    const req: AlpacaTokenizationRequest = {
      tokenization_request_id: id,
      type: 'mint',
      status: 'pending',
      underlying_symbol: symbol.toUpperCase(),
      token_symbol: `s${symbol.toUpperCase()}`,
      qty,
      issuer,
      network,
      wallet_address: walletAddress,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.requests.set(id, req);
    return req;
  }

  public async confirmMintCallback(requestId: string, txHash: string): Promise<AlpacaTokenizationRequest> {
    const req = this.requests.get(requestId);
    if (!req) throw new Error('Tokenization request not found');
    req.status = 'completed';
    req.tx_hash = txHash;
    req.updated_at = new Date().toISOString();
    this.requests.set(requestId, req);
    return req;
  }

  public async requestRedeem(issuerRequestId: string, underlyingSymbol: string, tokenSymbol: string, qty: string, network: any, walletAddress: string, txHash: string): Promise<AlpacaTokenizationRequest> {
    const id = uuidv4();
    const req: AlpacaTokenizationRequest = {
      tokenization_request_id: id,
      type: 'redeem',
      status: 'completed',
      underlying_symbol: underlyingSymbol,
      token_symbol: tokenSymbol,
      qty,
      issuer: 'st0x',
      network,
      wallet_address: walletAddress,
      tx_hash: txHash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.requests.set(id, req);
    return req;
  }

  public async getRequests(): Promise<AlpacaTokenizationRequest[]> {
    return Array.from(this.requests.values());
  }
}

export const alpacaTokenizationService = AlpacaTokenizationService.getInstance();
export default AlpacaTokenizationService;

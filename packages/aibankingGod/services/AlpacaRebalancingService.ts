import { v4 as uuidv4 } from 'uuid';

export interface PortfolioWeight {
  symbol: string;
  percent: string;
  type: string;
}

export interface AlpacaPortfolio {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'needs_adjustment';
  cooldown_days: number;
  weights: PortfolioWeight[];
  created_at: string;
  updated_at: string;
}

export interface AlpacaRebalanceRun {
  id: string;
  portfolio_id: string;
  account_id: string;
  type: 'full_rebalance' | 'invest_cash';
  status: 'QUEUED' | 'BUYS_IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  initiated_from: 'api' | 'system';
  created_at: string;
  updated_at: string;
}

export interface AlpacaSubscription {
  id: string;
  account_id: string;
  portfolio_id: string;
  created_at: string;
  last_rebalanced_at: string;
}

export class AlpacaRebalancingService {
  private static instance: AlpacaRebalancingService;
  private portfolios: Map<string, AlpacaPortfolio> = new Map();
  private runs: Map<string, AlpacaRebalanceRun> = new Map();
  private subscriptions: Map<string, AlpacaSubscription> = new Map();

  private constructor() {
    this.seedPortfolios();
  }

  public static getInstance(): AlpacaRebalancingService {
    if (!AlpacaRebalancingService.instance) {
      AlpacaRebalancingService.instance = new AlpacaRebalancingService();
    }
    return AlpacaRebalancingService.instance;
  }

  private seedPortfolios() {
    const techId = uuidv4();
    this.portfolios.set(techId, {
      id: techId,
      name: 'Sovereign Megacap Tech',
      description: '80% Equities (AAPL, NVDA, MSFT, GOOGL), 20% Cash',
      status: 'active',
      cooldown_days: 7,
      weights: [
        { symbol: 'AAPL', percent: '25.0', type: 'asset' },
        { symbol: 'NVDA', percent: '25.0', type: 'asset' },
        { symbol: 'MSFT', percent: '20.0', type: 'asset' },
        { symbol: 'GOOGL', percent: '10.0', type: 'asset' },
        { symbol: 'USD', percent: '20.0', type: 'cash' }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  public async getPortfolios(): Promise<AlpacaPortfolio[]> {
    return Array.from(this.portfolios.values());
  }

  public async createPortfolio(name: string, description: string, weights: PortfolioWeight[]): Promise<AlpacaPortfolio> {
    const id = uuidv4();
    const portfolio: AlpacaPortfolio = {
      id,
      name,
      description,
      status: 'active',
      cooldown_days: 3,
      weights,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  public async createRun(portfolioId: string, accountId: string, type: 'full_rebalance' | 'invest_cash' = 'full_rebalance'): Promise<AlpacaRebalanceRun> {
    const run: AlpacaRebalanceRun = {
      id: uuidv4(),
      portfolio_id: portfolioId,
      account_id: accountId,
      type,
      status: 'COMPLETED',
      initiated_from: 'api',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.runs.set(run.id, run);
    return run;
  }

  public async getRuns(accountId?: string): Promise<AlpacaRebalanceRun[]> {
    const all = Array.from(this.runs.values());
    if (accountId) {
      return all.filter(r => r.account_id === accountId);
    }
    return all;
  }

  public async createSubscription(accountId: string, portfolioId: string): Promise<AlpacaSubscription> {
    const sub: AlpacaSubscription = {
      id: uuidv4(),
      account_id: accountId,
      portfolio_id: portfolioId,
      created_at: new Date().toISOString(),
      last_rebalanced_at: new Date().toISOString()
    };
    this.subscriptions.set(sub.id, sub);
    return sub;
  }

  public async getSubscriptions(accountId?: string): Promise<AlpacaSubscription[]> {
    const all = Array.from(this.subscriptions.values());
    if (accountId) return all.filter(s => s.account_id === accountId);
    return all;
  }
}

export const alpacaRebalancingService = AlpacaRebalancingService.getInstance();
export default AlpacaRebalancingService;

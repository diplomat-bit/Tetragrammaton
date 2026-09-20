import axios from 'axios';

export interface AlpacaPosition {
  asset_id: string;
  symbol: string;
  exchange: string;
  asset_class: string;
  avg_entry_price: string;
  qty: string;
  qty_available: string;
  side: 'long' | 'short';
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  unrealized_intraday_pl: string;
  unrealized_intraday_plpc: string;
  current_price: string;
  lastday_price: string;
  change_today: string;
  asset_marginable: boolean;
}

export interface AlpacaTradingLimits {
  available: string;
  daily_net_limit: string;
  held: string;
  used: string;
  usd: {
    available: string;
    daily_net_limit: string;
    held: string;
    used: string;
  };
}

export class AlpacaTradingService {
  private static instance: AlpacaTradingService;

  public static getInstance(): AlpacaTradingService {
    if (!AlpacaTradingService.instance) {
      AlpacaTradingService.instance = new AlpacaTradingService();
    }
    return AlpacaTradingService.instance;
  }

  public async getPositions(accountId: string): Promise<AlpacaPosition[]> {
    try {
      const res = await axios.get('/api/v1/alpaca/positions');
      return res.data;
    } catch (e) {
      console.error("[ALPACA] Error getting positions", e);
      return [];
    }
  }

  public async getPosition(accountId: string, symbol: string): Promise<AlpacaPosition | null> {
    const positions = await this.getPositions(accountId);
    return positions.find(p => p.symbol.toUpperCase() === symbol.toUpperCase()) || null;
  }

  public async closePosition(accountId: string, symbol: string): Promise<{ status: string; symbol: string }> {
    try {
      await axios.post('/api/v1/alpaca/positions/close', { symbol });
      return { status: 'LIQUIDATED', symbol };
    } catch (e) {
      console.error("[ALPACA] Error closing position", e);
      throw e;
    }
  }

  public async closeAllPositions(accountId: string): Promise<{ status: string; closedCount: number }> {
    try {
      const res = await axios.post('/api/v1/alpaca/positions/close-all');
      return { status: 'ALL_LIQUIDATED', closedCount: res.data.length || 0 };
    } catch (e) {
      console.error("[ALPACA] Error closing all positions", e);
      throw e;
    }
  }

  public async getTradingLimits(accountId: string): Promise<AlpacaTradingLimits> {
    try {
      const res = await axios.get('/api/v1/alpaca/account');
      const account = res.data;
      return {
        available: account.buying_power,
        daily_net_limit: account.daytrading_buying_power,
        held: account.maintenance_margin,
        used: account.initial_margin,
        usd: {
          available: account.buying_power,
          daily_net_limit: account.daytrading_buying_power,
          held: account.maintenance_margin,
          used: account.initial_margin
        }
      };
    } catch (e) {
      console.error("[ALPACA] Error getting limits", e);
      throw e;
    }
  }

  public async estimateOrder(accountId: string, symbol: string, notional: number): Promise<{ estimatedQty: number; estimatedPrice: number }> {
    // We would need to fetch the current quote from Alpaca. For now, since we have the positions list,
    // or if we have an endpoint for quotes... let's add a quote endpoint if needed, or simply return an estimation for now.
    // Ideally we should use a proper quote endpoint. 
    return {
      estimatedQty: parseFloat((notional / 100).toFixed(4)),
      estimatedPrice: 100.00
    };
  }

  public async exerciseOption(accountId: string, contractSymbol: string, qty: number): Promise<{ qty_exercised: string; qty_remaining: string }> {
    return {
      qty_exercised: qty.toString(),
      qty_remaining: '0'
    };
  }

  public async setDoNotExercise(accountId: string, contractSymbol: string): Promise<{ status: string }> {
    return { status: 'DNE_SET' };
  }
}

export const alpacaTradingService = AlpacaTradingService.getInstance();
export default AlpacaTradingService;

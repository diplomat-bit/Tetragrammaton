export interface AlpacaAsset {
  id: string;
  class: 'us_equity' | 'crypto' | 'us_option';
  exchange: string;
  symbol: string;
  name: string;
  status: 'active' | 'inactive';
  tradable: boolean;
  marginable: boolean;
  shortable: boolean;
  fractionable: boolean;
}

export interface AlpacaCorporateActionAnnouncement {
  id: string;
  ca_type: 'dividend' | 'spinoff' | 'split' | 'merger';
  initiating_symbol: string;
  declaration_date: string;
  ex_date: string;
  payable_date: string;
  cash?: string;
  new_rate?: string;
}

export interface AlpacaIpoOffering {
  ipo_reference: string;
  name: string;
  ticker_symbol: string;
  availability: 'available' | 'not_available' | 'closed';
  min_price: string;
  max_price: string;
  trade_date: string;
}

export class AlpacaMarketDataService {
  private static instance: AlpacaMarketDataService;

  private constructor() {}

  public static getInstance(): AlpacaMarketDataService {
    if (!AlpacaMarketDataService.instance) {
      AlpacaMarketDataService.instance = new AlpacaMarketDataService();
    }
    return AlpacaMarketDataService.instance;
  }

  public async getAssets(): Promise<AlpacaAsset[]> {
    return [
      { id: 'b0b6dd9d-8b9b-48a9-ba46-b9d54906e415', class: 'us_equity', exchange: 'NASDAQ', symbol: 'AAPL', name: 'Apple Inc.', status: 'active', tradable: true, marginable: true, shortable: true, fractionable: true },
      { id: '1d6d84ed-2022-498c-9bf4-e75c61d563a3', class: 'us_equity', exchange: 'NASDAQ', symbol: 'NVDA', name: 'NVIDIA Corporation', status: 'active', tradable: true, marginable: true, shortable: true, fractionable: true },
      { id: 'f72a819b-22b0-4660-84c2-63200922e39e', class: 'crypto', exchange: 'FTX', symbol: 'BTC/USD', name: 'Bitcoin / USD', status: 'active', tradable: true, marginable: false, shortable: false, fractionable: true },
      { id: '9a2a7111-9a77-4309-a10d-2b7e90820e11', class: 'crypto', exchange: 'FTX', symbol: 'ETH/USD', name: 'Ethereum / USD', status: 'active', tradable: true, marginable: false, shortable: false, fractionable: true }
    ];
  }

  public async getMarketClock(): Promise<{ timestamp: string; is_open: boolean; next_open: string; next_close: string }> {
    const now = new Date();
    return {
      timestamp: now.toISOString(),
      is_open: true,
      next_open: new Date(now.getTime() + 86400000).toISOString(),
      next_close: new Date(now.getTime() + 28800000).toISOString()
    };
  }

  public async getCorporateActions(): Promise<AlpacaCorporateActionAnnouncement[]> {
    return [
      {
        id: 'ca_div_001',
        ca_type: 'dividend',
        initiating_symbol: 'AAPL',
        declaration_date: '2026-08-01',
        ex_date: '2026-08-15',
        payable_date: '2026-08-28',
        cash: '0.25'
      },
      {
        id: 'ca_spn_002',
        ca_type: 'spinoff',
        initiating_symbol: 'CITI',
        declaration_date: '2026-07-20',
        ex_date: '2026-08-10',
        payable_date: '2026-08-25',
        new_rate: '1:5'
      }
    ];
  }

  public async getIpoOfferings(): Promise<AlpacaIpoOffering[]> {
    return [
      {
        ipo_reference: 'IPO_SINGULARITY_01',
        name: 'Singularity Quantum AI Inc.',
        ticker_symbol: 'SQAI',
        availability: 'available',
        min_price: '28.00',
        max_price: '34.00',
        trade_date: '2026-08-20'
      },
      {
        ipo_reference: 'IPO_SOVEREIGN_02',
        name: 'Sovereign Space Defense Corp',
        ticker_symbol: 'SSDC',
        availability: 'available',
        min_price: '50.00',
        max_price: '62.00',
        trade_date: '2026-09-01'
      }
    ];
  }
}

export const alpacaMarketDataService = AlpacaMarketDataService.getInstance();
export default AlpacaMarketDataService;

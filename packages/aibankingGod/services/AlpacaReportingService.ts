export interface FpslLoanAnalytics {
  account_number: string;
  total_lending_activities: number;
  in_progress_lending_activities: number;
  interest: {
    customer: number;
    partner: number;
  };
}

export interface EodCashInterest {
  account_id: string;
  cash_balance: string;
  account_rate_bps: number;
  account_accrued_interest: string;
  date: string;
}

export class AlpacaReportingService {
  private static instance: AlpacaReportingService;

  private constructor() {}

  public static getInstance(): AlpacaReportingService {
    if (!AlpacaReportingService.instance) {
      AlpacaReportingService.instance = new AlpacaReportingService();
    }
    return AlpacaReportingService.instance;
  }

  public async getFpslAnalytics(accountId: string): Promise<FpslLoanAnalytics> {
    return {
      account_number: 'AQ88900122',
      total_lending_activities: 142,
      in_progress_lending_activities: 18,
      interest: {
        customer: 1425.80,
        partner: 475.20
      }
    };
  }

  public async getEodCashInterest(accountId: string): Promise<EodCashInterest[]> {
    return [
      {
        account_id: accountId,
        cash_balance: '125000.00',
        account_rate_bps: 450,
        account_accrued_interest: '15.41',
        date: new Date().toISOString().split('T')[0]
      }
    ];
  }

  public async getJitSettlements(): Promise<any[]> {
    return [
      {
        id: 'jit_settle_9901',
        total_amount: '50000.00',
        status: 'COMPLETED',
        asset_class: 'us_equity',
        created_at: new Date().toISOString()
      }
    ];
  }
}

export const alpacaReportingService = AlpacaReportingService.getInstance();
export default AlpacaReportingService;

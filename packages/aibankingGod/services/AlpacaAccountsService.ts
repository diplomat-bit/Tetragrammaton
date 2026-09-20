import { v4 as uuidv4 } from 'uuid';

export interface AlpacaCipData {
  account_id: string;
  id: string;
  created_at: string;
  provider_name: string[];
  kyc: {
    id: string;
    applicant_name: string;
    approval_status: 'approved' | 'rejected' | 'pending';
    approved_at?: string;
    risk_level: string;
    risk_score: number;
  };
  identity?: {
    result: string;
    matched_address: string;
    tax_id: string;
  };
}

export interface AlpacaDocumentUpload {
  document_type: 'w9' | 'w8ben' | 'identity_verification' | 'address_verification' | 'tax_id_verification';
  content: string; // base64 encoded
  mime_type: string;
  document_sub_type?: string;
}

export interface AlpacaOptionsApprovalRequest {
  id: string;
  account_id: string;
  requested_level: number;
  approved_level: number;
  status: 'PENDING' | 'APPROVED' | 'LOWER_LEVEL_APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
}

export class AlpacaAccountsService {
  private static instance: AlpacaAccountsService;
  private cipRecords: Map<string, AlpacaCipData> = new Map();
  private optionsApprovals: Map<string, AlpacaOptionsApprovalRequest> = new Map();

  private constructor() {
    this.seedDefaultData();
  }

  public static getInstance(): AlpacaAccountsService {
    if (!AlpacaAccountsService.instance) {
      AlpacaAccountsService.instance = new AlpacaAccountsService();
    }
    return AlpacaAccountsService.instance;
  }

  private seedDefaultData() {
    const sampleAccountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
    this.cipRecords.set(sampleAccountId, {
      account_id: sampleAccountId,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      provider_name: ['Onfido', 'Jumio_CIP'],
      kyc: {
        id: uuidv4(),
        applicant_name: 'John Doe',
        approval_status: 'approved',
        approved_at: new Date().toISOString(),
        risk_level: 'LOW',
        risk_score: 12
      },
      identity: {
        result: 'CLEAR',
        matched_address: '100 Sovereign Way, San Mateo, CA 33345',
        tax_id: '***-**-666'
      }
    });

    this.optionsApprovals.set(sampleAccountId, {
      id: uuidv4(),
      account_id: sampleAccountId,
      requested_level: 3,
      approved_level: 2,
      status: 'APPROVED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  public async getCip(accountId: string): Promise<AlpacaCipData> {
    const record = this.cipRecords.get(accountId);
    if (!record) {
      const newRecord: AlpacaCipData = {
        account_id: accountId,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        provider_name: ['Sovereign_ZKP_Enclave'],
        kyc: {
          id: uuidv4(),
          applicant_name: 'Verified Sovereign Identity',
          approval_status: 'approved',
          approved_at: new Date().toISOString(),
          risk_level: 'LOW',
          risk_score: 5
        }
      };
      this.cipRecords.set(accountId, newRecord);
      return newRecord;
    }
    return record;
  }

  public async uploadCip(accountId: string, data: Partial<AlpacaCipData>): Promise<AlpacaCipData> {
    const existing = await this.getCip(accountId);
    const updated: AlpacaCipData = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString()
    } as any;
    this.cipRecords.set(accountId, updated);
    return updated;
  }

  public async uploadDocuments(accountId: string, docs: AlpacaDocumentUpload[]): Promise<{ status: string; count: number }> {
    return {
      status: 'SUCCESS',
      count: docs.length
    };
  }

  public async requestOptionsApproval(accountId: string, level: number): Promise<AlpacaOptionsApprovalRequest> {
    const req: AlpacaOptionsApprovalRequest = {
      id: uuidv4(),
      account_id: accountId,
      requested_level: level,
      approved_level: level, // auto-approve in sandbox
      status: 'APPROVED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.optionsApprovals.set(accountId, req);
    return req;
  }

  public async getOptionsApproval(accountId: string): Promise<AlpacaOptionsApprovalRequest | null> {
    return this.optionsApprovals.get(accountId) || null;
  }

  public async getOnfidoSdkToken(accountId: string): Promise<{ token: string }> {
    return {
      token: `api_sandbox_onfido_tok_${uuidv4().replace(/-/g, '')}`
    };
  }

  public async updateOnfidoOutcome(accountId: string, outcome: string, token: string): Promise<{ status: string }> {
    return { status: 'ACCEPTED' };
  }
}

export const alpacaAccountsService = AlpacaAccountsService.getInstance();
export default AlpacaAccountsService;

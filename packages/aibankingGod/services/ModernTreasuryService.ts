import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

/**
 * MODERN TREASURY SERVICE v2.0
 * Direct REST integration to the Node API which maps to actual MT SDK.
 */

export interface TreasuryBalance {
    amount: number;
    currency: string;
    accountId: string;
    status: 'ACTIVE' | 'FROZEN' | 'RESTRICTED';
}

export interface WireRequest {
    amount: number;
    currency: string;
    beneficiaryId: string;
    memo?: string;
}

export interface MTPaymentOrderResponse {
    id: string;
    status: string;
    amount: number;
    currency: string;
    createdAt: string;
}

export class ModernTreasuryService {
    private static instance: ModernTreasuryService;

    public static getInstance(): ModernTreasuryService {
        if (!ModernTreasuryService.instance) {
            ModernTreasuryService.instance = new ModernTreasuryService();
        }
        return ModernTreasuryService.instance;
    }

    async getInstitutionalBalance(accountId: string): Promise<TreasuryBalance> {
        try {
            const res = await axios.get('/api/v1/mt/internal-accounts');
            const target = res.data.find((acc: any) => acc.id === accountId);
            return {
                amount: target?.balances?.available_balance?.amount || 0,
                currency: target?.balances?.available_balance?.currency || 'USD',
                accountId: accountId,
                status: 'ACTIVE'
            };
        } catch (error) {
            console.error("[TREASURY] Balance fetch failed", error);
            throw error;
        }
    }

    async initiateSovereignWire(request: WireRequest) {
        try {
            const res = await axios.post('/api/v1/mt/payment-orders', {
                type: 'wire',
                amount: request.amount,
                currency: request.currency,
                direction: 'credit',
                receiving_account_id: request.beneficiaryId,
                description: request.memo
            });
            return {
                txnId: res.data.id,
                status: res.data.status,
                estimatedArrival: 'T+0 (Atomic)'
            };
        } catch (error) {
            console.error("[TREASURY] Wire initiate failed", error);
            throw error;
        }
    }

    // Static helpers for compatibility
    public static async getInternalAccounts(): Promise<Array<{ id: string; name: string }>> {
        try {
            const res = await axios.get('/api/v1/mt/internal-accounts');
            return res.data.map((acc: any) => ({
                id: acc.id,
                name: acc.name
            }));
        } catch (error) {
            console.error("[TREASURY] Internal accounts failed", error);
            return [];
        }
    }

    public static async upsertPaymentOrder(params: {
        type: string;
        amount: number;
        direction: string;
        currency: string;
        originatingAccountId: string;
        receivingAccountId: string;
        description: string;
    }): Promise<MTPaymentOrderResponse> {
        try {
            const res = await axios.post('/api/v1/mt/payment-orders', {
                type: params.type,
                amount: Math.round(params.amount * 100),
                direction: params.direction,
                currency: params.currency,
                originating_account_id: params.originatingAccountId,
                receiving_account_id: params.receivingAccountId,
                description: params.description
            });
            return {
                id: res.data.id,
                status: res.data.status,
                amount: res.data.amount / 100,
                currency: res.data.currency,
                createdAt: res.data.created_at
            };
        } catch (error) {
            console.error("[TREASURY] upsertPaymentOrder Failed", error);
            throw error;
        }
    }
}

export const modernTreasuryService = ModernTreasuryService.getInstance();
export default ModernTreasuryService;


import {
    UserProfile, AccountDetails, Portfolio, SimulationResult, CorporateAnomaly, ComplianceReport, CashFlowForecast, FraudRule, WebhookSubscription, APIKey, Transaction, CorporateCard, CorporateTransaction,
    BudgetCategory, PaginatedResponse
} from '../types';

const BASE_URL = '/api/v1';

export class QuantumClient {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${BASE_URL}${endpoint}`;
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`[QuantumClient] API Error for ${endpoint}:`, error);
            throw error;
        }
    }

    public users = {
        getMe: (): Promise<UserProfile> => this.request<UserProfile>('/users/me'),
    };
    public accounts = {
        list: (): Promise<PaginatedResponse<AccountDetails>> => this.request<PaginatedResponse<AccountDetails>>('/accounts/me'),
    };
    public transactions = {
        list: (): Promise<PaginatedResponse<Transaction>> => this.request<PaginatedResponse<Transaction>>('/transactions'),
    };
    public budgets = {
        list: (): Promise<PaginatedResponse<BudgetCategory>> => this.request<PaginatedResponse<BudgetCategory>>('/budgets'),
    };
    public investments = {
        getPortfolios: (): Promise<PaginatedResponse<Portfolio>> => this.request<PaginatedResponse<Portfolio>>('/investments/portfolios'),
    };
    public corporate = {
        cards: {
            list: (): Promise<PaginatedResponse<CorporateCard>> => this.request<PaginatedResponse<CorporateCard>>('/corporate/cards'),
            issueVirtual: (data: any) => this.request('/corporate/cards/virtual', { method: 'POST', body: JSON.stringify(data) }),
            freeze: (id: string, freeze: boolean) => this.request(`/corporate/cards/${id}/freeze`, { method: 'POST', body: JSON.stringify({ freeze }) }),
            updateControls: (id: string, controls: any) => this.request(`/corporate/cards/${id}/controls`, { method: 'PUT', body: JSON.stringify(controls) }),
        },
        anomalies: {
            list: (): Promise<PaginatedResponse<CorporateAnomaly>> => this.request<PaginatedResponse<CorporateAnomaly>>('/corporate/anomalies'),
        }
    };
    public ai = {
        incubator: {
            submitPitch: (data: any) => this.request('/ai/incubator/pitch', { method: 'POST', body: JSON.stringify(data) }),
            getPitchDetails: (id: string) => this.request(`/ai/incubator/pitch/${id}/details`),
            submitFeedback: (id: string, data: any) => this.request(`/ai/incubator/pitch/${id}/feedback`, { method: 'PUT', body: JSON.stringify(data) }),
            listPitches: () => this.request('/ai/incubator/pitches'),
        },
        oracle: {
            simulate: (prompt: string) => this.request('/ai/oracle/simulate', { method: 'POST', body: JSON.stringify({ prompt }) }),
        },
        advisor: {
             chat: (message: string) => this.request('/ai/advisor/chat', { method: 'POST', body: JSON.stringify({ message }) }),
        }
    };
    public notifications = {
        markRead: (id: string) => this.request(`/notifications/${id}/mark-read`, { method: 'POST', body: JSON.stringify({}) }),
    }
}

export const quantumClient = new QuantumClient();

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export function safeJsonStringify(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return String(obj);
  }
}

export function generateCryptoHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function generateUETR(): string {
  // Unique End-to-End Transaction Reference (UETR) compliant with ISO 20022 and SWIFT gpi (UUID v4)
  return uuidv4();
}

export interface LedgerEntry {
  id: string;
  uetr: string;
  account: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  description: string;
  status: 'PENDING' | 'SETTLED' | 'RECONCILED' | 'FAILED';
  metadata?: Record<string, any>;
  timestamp: string;
  hash: string;
}

class LedgerSyncEngine {
  private entries: LedgerEntry[] = [];

  public async recordTransaction(entry: Omit<LedgerEntry, 'id' | 'timestamp' | 'hash'>): Promise<LedgerEntry> {
    const id = `ledg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const timestamp = new Date().toISOString();
    const hash = generateCryptoHash(`${id}:${entry.uetr}:${entry.amount}:${entry.currency}:${timestamp}`);

    const newEntry: LedgerEntry = {
      ...entry,
      id,
      timestamp,
      hash,
    };

    this.entries.unshift(newEntry);
    if (this.entries.length > 2000) {
      this.entries.pop();
    }

    return newEntry;
  }

  public getEntries(): LedgerEntry[] {
    return [...this.entries];
  }

  public async sync(): Promise<{ success: boolean; count: number }> {
    return { success: true, count: this.entries.length };
  }

  public async syncTransaction(entry: any): Promise<{ success: boolean; id: string; entry: any }> {
    const recorded = await this.recordTransaction({
      uetr: entry.id || generateUETR(),
      account: entry.metadata?.cardId || 'ACC-001',
      type: entry.type === 'REFUND' ? 'CREDIT' : 'DEBIT',
      amount: entry.amount || 0,
      currency: entry.currency || 'USD',
      description: `${entry.source || 'Bridge'}: ${entry.metadata?.merchantName || entry.type || 'Transaction'}`,
      status: entry.status === 'SETTLED' ? 'SETTLED' : 'PENDING',
      metadata: entry.metadata,
    });
    return { success: true, id: recorded.id, entry: recorded };
  }
}

export const ledgerSync = new LedgerSyncEngine();
export default ledgerSync;

import { v4 as uuidv4 } from 'uuid';
import { AlpacaJournal } from './AlpacaBrokerService';

export interface BatchJournalEntry {
  to_account: string;
  amount: string;
  description?: string;
}

export interface ReverseBatchJournalEntry {
  from_account: string;
  amount: string;
  description?: string;
}

export class AlpacaJournalsService {
  private static instance: AlpacaJournalsService;
  private journals: AlpacaJournal[] = [];

  private constructor() {
    this.seedDefaultJournals();
  }

  public static getInstance(): AlpacaJournalsService {
    if (!AlpacaJournalsService.instance) {
      AlpacaJournalsService.instance = new AlpacaJournalsService();
    }
    return AlpacaJournalsService.instance;
  }

  private seedDefaultJournals() {
    this.journals.push({
      id: uuidv4(),
      entry_type: 'JNLC',
      from_account: '8f8c8cee-2591-4f83-be12-82c659b5e748',
      to_account: 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d',
      amount: '5000.00',
      status: 'executed',
      created_at: new Date().toISOString(),
      description: 'Initial Sovereign Capital Injection'
    });
  }

  public async getJournals(): Promise<AlpacaJournal[]> {
    return this.journals;
  }

  public async createSingleJournal(fromAccount: string, toAccount: string, amount: string, entryType: 'JNLC' | 'JNLS' = 'JNLC', description?: string): Promise<AlpacaJournal> {
    const journal: AlpacaJournal = {
      id: uuidv4(),
      entry_type: entryType,
      from_account: fromAccount,
      to_account: toAccount,
      amount,
      status: 'executed',
      created_at: new Date().toISOString(),
      description: description || 'Single Journal Execution'
    };
    this.journals.unshift(journal);
    return journal;
  }

  public async createBatchJournal(fromAccount: string, entries: BatchJournalEntry[]): Promise<AlpacaJournal[]> {
    const created: AlpacaJournal[] = [];
    for (const entry of entries) {
      const journal: AlpacaJournal = {
        id: uuidv4(),
        entry_type: 'JNLC',
        from_account: fromAccount,
        to_account: entry.to_account,
        amount: entry.amount,
        status: 'executed',
        created_at: new Date().toISOString(),
        description: entry.description || 'Batch 1-to-Many Sweep'
      };
      this.journals.unshift(journal);
      created.push(journal);
    }
    return created;
  }

  public async createReverseBatchJournal(toAccount: string, entries: ReverseBatchJournalEntry[]): Promise<AlpacaJournal[]> {
    const created: AlpacaJournal[] = [];
    for (const entry of entries) {
      const journal: AlpacaJournal = {
        id: uuidv4(),
        entry_type: 'JNLC',
        from_account: entry.from_account,
        to_account: toAccount,
        amount: entry.amount,
        status: 'executed',
        created_at: new Date().toISOString(),
        description: entry.description || 'Reverse Batch Many-to-1 Sweep'
      };
      this.journals.unshift(journal);
      created.push(journal);
    }
    return created;
  }
}

export const alpacaJournalsService = AlpacaJournalsService.getInstance();
export default AlpacaJournalsService;

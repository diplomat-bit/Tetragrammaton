export interface OFXHeader {
  version: string;
  security: string;
  encoding: string;
  charset: string;
  compression: string;
}

export interface OFXAccount {
  id: string;
  bankId: string;
  acctId: string;
  acctType: 'CHECKING' | 'SAVINGS' | 'MONEYMRKT' | 'CREDITLINE';
  org: string;
  fid: string;
  ledgerBalance: number;
  currency: string;
  asOfDate?: string;
}

export interface OFXTransaction {
  id: string;
  accountId: string;
  type: 'DEBIT' | 'CREDIT' | 'INT' | 'DIV' | 'FEE' | 'SRVCHG' | 'DEP' | 'ATM' | 'POS' | 'XFER' | 'CHECK' | 'PAYMENT' | 'CASH' | 'DIRECTDEP' | 'DIRECTDEBIT' | 'REPEATPMT' | 'OTHER';
  postedDate: string;
  amount: number;
  fitid: string;
  name: string;
  memo?: string;
  checkNumber?: string;
  category?: string;
}

export interface ParsedOFXStatement {
  organization: string;
  fid: string;
  accountCount: number;
  transactionCount: number;
  totalBalance: number;
  accounts: OFXAccount[];
  transactions: OFXTransaction[];
  rawHeader?: OFXHeader;
}

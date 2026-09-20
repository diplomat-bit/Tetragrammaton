export interface Account {
  accountUID: string;
  cardholderName: string;
  last4: string;
  expirationDate?: string;
  status: string;
  creditLimit: number;
  availableCash?: number;
  currentBalance: number;
  address?: {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
  }
}

export interface Transaction {
  transactionID: string;
  date: string;
  merchant: string;
  amount: number;
  status: string;
}

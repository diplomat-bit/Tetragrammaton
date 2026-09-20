import { CitiAccount, AccountGroupTotal, CitiTransaction } from '../types';

export function parseCitiAccountsResponse(rawData: any): {
  accounts: CitiAccount[];
  groupTotals: AccountGroupTotal[];
  customerId?: string;
} {
  if (!rawData) {
    return { accounts: [], groupTotals: [] };
  }

  const accounts: CitiAccount[] = [];
  const groupTotals: AccountGroupTotal[] = [];
  let customerId = rawData.customer?.customerId || '';

  // Case 1: Citi Partner Sandbox/Production structure with accountGroupSummary array
  if (rawData.accountGroupSummary && Array.isArray(rawData.accountGroupSummary)) {
    for (const groupObj of rawData.accountGroupSummary) {
      const groupName = groupObj.accountGroup || 'OTHER';
      
      // Calculate group totals from payload if present
      const currBalObj = groupObj.totalCurrentBalance;
      const availBalObj = groupObj.totalAvailableBalance;
      
      let groupCurrBal = currBalObj?.localCurrencyBalanceAmount ?? 0;
      let groupAvailBal = availBalObj?.localCurrencyBalanceAmount;
      let currencyCode = currBalObj?.localCurrencyCode || 'USD';

      // Look through all possible account detail sub-arrays
      const detailArrays = [
        { array: groupObj.creditCardAccountsDetails, classification: 'CREDITCARD' },
        { array: groupObj.savingsAccountsDetails, classification: 'SAVINGS' },
        { array: groupObj.loanAccountsDetails, classification: 'LOAN' },
        { array: groupObj.retirementAccountsDetails, classification: 'RETIREMENT' },
        { array: groupObj.checkingAccountsDetails, classification: 'CHECKING' },
        { array: groupObj.investmentAccountsDetails, classification: 'INVESTMENT' },
        { array: groupObj.accounts, classification: groupName },
        { array: groupObj.accountList, classification: groupName },
      ];

      let count = 0;
      for (const item of detailArrays) {
        if (Array.isArray(item.array)) {
          for (const acct of item.array) {
            const parsed = normalizeCitiAccount(acct, groupName, item.classification);
            accounts.push(parsed);
            count++;
          }
        }
      }

      // If group balance was not directly provided, sum from accounts
      if (groupCurrBal === 0 && count > 0) {
        groupCurrBal = accounts
          .filter((a) => a.accountGroup === groupName)
          .reduce((sum, a) => sum + a.currentBalance, 0);
      }

      groupTotals.push({
        group: groupName,
        totalCurrentBalance: groupCurrBal,
        totalAvailableBalance: groupAvailBal,
        currencyCode,
        accountCount: count,
      });
    }

    if (accounts.length > 0) {
      return { accounts, groupTotals, customerId };
    }
  }

  // Case 2: Direct flat array of accounts
  const genericArrays = [
    rawData.accounts,
    rawData.accountDetails,
    rawData.accountsDetails,
    rawData.creditCardAccountsDetails,
    rawData.savingsAccountsDetails,
    rawData.loanAccountsDetails,
    rawData.retirementAccountsDetails,
    rawData.data,
  ];

  for (const arr of genericArrays) {
    if (Array.isArray(arr) && arr.length > 0) {
      for (const item of arr) {
        accounts.push(normalizeCitiAccount(item, item.accountGroup || 'GENERAL', item.accountClassification));
      }
      return { accounts, groupTotals: [], customerId };
    }
  }

  return { accounts, groupTotals, customerId };
}

function normalizeCitiAccount(raw: any, defaultGroup: string, defaultClassification?: string): CitiAccount {
  const accountGroup = (raw.accountGroup || defaultGroup || 'OTHER').toUpperCase();
  const balanceType = raw.balanceType || (accountGroup === 'LOAN' || accountGroup === 'CREDITCARD' ? 'LIABILITY' : 'ASSET');
  
  // Clean account ID
  const displayNum = raw.displayAccountNumber || raw.accountNumberMasked || 'XXXX-0000';
  const lastDigits = displayNum.replace(/\D/g, '').slice(-4) || Math.floor(1000 + Math.random() * 9000).toString();
  const accountId = raw.accountId && raw.accountId.trim() !== '' 
    ? raw.accountId 
    : `citi-${accountGroup.toLowerCase()}-${lastDigits}`;

  const currentBal = typeof raw.currentBalance === 'number' 
    ? raw.currentBalance 
    : parseFloat(raw.currentBalance || raw.ledgerBalance || '0') || 0;

  const availBal = typeof raw.availableBalance === 'number'
    ? raw.availableBalance
    : (raw.availableBalance !== undefined ? parseFloat(raw.availableBalance) : undefined);

  const availCred = typeof raw.availableCredit === 'number'
    ? raw.availableCredit
    : (raw.availableCredit !== undefined ? parseFloat(raw.availableCredit) : undefined);

  return {
    accountId,
    displayAccountNumber: displayNum,
    productName: raw.productName || raw.accountNickname || raw.accountName || `${accountGroup} Account`,
    accountDescription: raw.accountDescription || raw.description || `${raw.productName || accountGroup}-${lastDigits}`,
    accountGroup,
    accountClassification: defaultClassification || raw.accountClassification || accountGroup,
    balanceType,
    accountStatus: (raw.accountStatus || 'ACTIVE').toUpperCase(),
    currencyCode: raw.currencyCode || 'USD',

    currentBalance: currentBal,
    availableBalance: availBal,
    availableCredit: availCred,
    creditLimit: raw.creditLimit !== undefined ? Number(raw.creditLimit) : undefined,

    purchasesAPR: raw.purchasesAPR !== undefined ? Number(raw.purchasesAPR) : undefined,
    advancesAPR: raw.advancesAPR !== undefined ? Number(raw.advancesAPR) : undefined,
    interestRate: raw.interestRate !== undefined ? Number(raw.interestRate) : undefined,
    totalInterestAmount: raw.totalInterestAmount !== undefined ? Number(raw.totalInterestAmount) : undefined,

    minimumDueAmount: raw.minimumDueAmount !== undefined ? Number(raw.minimumDueAmount) : undefined,
    paymentDueDate: raw.paymentDueDate,
    lastStatementBalance: raw.lastStatementBalance !== undefined ? Number(raw.lastStatementBalance) : undefined,
    lastStatementDate: raw.lastStatementDate,

    cashAdvanceLimit: raw.cashAdvanceLimit !== undefined ? Number(raw.cashAdvanceLimit) : undefined,
    cashAdvanceAvailableAmount: raw.cashAdvanceAvailableAmount !== undefined ? Number(raw.cashAdvanceAvailableAmount) : undefined,
    lastPaymentAmount: raw.lastPaymentAmount !== undefined ? Number(raw.lastPaymentAmount) : undefined,
    lastPaymentDate: raw.lastPaymentDate,

    lastUpdated: new Date().toISOString(),
    rawItem: raw,
  };
}

export function parseCitiTransactionsResponse(rawData: any, fallbackAccounts: CitiAccount[] = []): CitiTransaction[] {
  if (!rawData) return [];

  const transactions: CitiTransaction[] = [];
  const acctMap = new Map<string, CitiAccount>();
  for (const acct of fallbackAccounts) {
    if (acct.accountId) acctMap.set(acct.accountId, acct);
    if (acct.displayAccountNumber) acctMap.set(acct.displayAccountNumber, acct);
  }

  // Look for transactions array in various standard Citi structures
  const possibleArrays: any[] = [];

  if (Array.isArray(rawData)) {
    possibleArrays.push(rawData);
  }
  if (Array.isArray(rawData.transactions)) {
    possibleArrays.push(rawData.transactions);
  }
  if (Array.isArray(rawData.accountTransactions)) {
    possibleArrays.push(rawData.accountTransactions);
  }
  if (Array.isArray(rawData.transactionList)) {
    possibleArrays.push(rawData.transactionList);
  }
  if (Array.isArray(rawData.data)) {
    possibleArrays.push(rawData.data);
  }

  // Also check if accountGroupSummary contains transaction arrays inside details
  if (rawData.accountGroupSummary && Array.isArray(rawData.accountGroupSummary)) {
    for (const grp of rawData.accountGroupSummary) {
      const detailKeys = [
        'creditCardAccountsDetails',
        'savingsAccountsDetails',
        'checkingAccountsDetails',
        'loanAccountsDetails',
        'accounts',
      ];
      for (const k of detailKeys) {
        if (Array.isArray(grp[k])) {
          for (const acct of grp[k]) {
            if (Array.isArray(acct.transactions)) possibleArrays.push(acct.transactions);
            if (Array.isArray(acct.recentTransactions)) possibleArrays.push(acct.recentTransactions);
          }
        }
      }
    }
  }

  for (const list of possibleArrays) {
    for (const item of list) {
      if (!item) continue;
      const normalized = normalizeCitiTransaction(item, acctMap);
      if (normalized) {
        transactions.push(normalized);
      }
    }
  }

  return transactions;
}

function normalizeCitiTransaction(raw: any, acctMap: Map<string, CitiAccount>): CitiTransaction | null {
  const acctId = raw.accountId || raw.accountNumber || '';
  const matchedAcct = acctMap.get(acctId);

  const amountVal = typeof raw.amount === 'number'
    ? raw.amount
    : typeof raw.transactionAmount === 'number'
      ? raw.transactionAmount
      : parseFloat(raw.amount || raw.transactionAmount || raw.transactionDebitAmount || raw.transactionCreditAmount || '0') || 0;

  const txnId = raw.transactionId || raw.referenceNumber || raw.referenceId || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const rawType = (raw.transactionType || raw.type || (amountVal < 0 ? 'DEBIT' : 'DEBIT')).toUpperCase();
  const transactionType: 'DEBIT' | 'CREDIT' = rawType.includes('CREDIT') || rawType === 'CR' ? 'CREDIT' : 'DEBIT';

  return {
    transactionId: txnId,
    accountId: acctId || (matchedAcct ? matchedAcct.accountId : 'PRIMARY-ACCOUNT'),
    productName: matchedAcct?.productName || raw.productName || raw.accountNickname || 'Citi Account',
    displayAccountNumber: matchedAcct?.displayAccountNumber || raw.displayAccountNumber || raw.accountNumberMasked || 'XXXX-0000',
    transactionDate: raw.transactionDate || raw.bookingDate || raw.date || new Date().toISOString().split('T')[0],
    postDate: raw.postDate || raw.valueDate || raw.transactionDate,
    description: raw.description || raw.transactionDescription || raw.merchantName || 'Citi Transaction',
    merchantName: raw.merchantName || raw.description || 'Merchant',
    transactionType,
    category: raw.category || raw.merchantCategoryDescription || raw.transactionCategory || 'General',
    amount: Math.abs(amountVal),
    currency: raw.currency || raw.currencyCode || matchedAcct?.currencyCode || 'USD',
    runningBalance: raw.runningBalance !== undefined ? Number(raw.runningBalance) : undefined,
    referenceId: raw.referenceId || raw.referenceNumber || raw.transactionReferenceId || txnId,
    status: (raw.status || raw.transactionStatus || 'CLEARED').toUpperCase() === 'PENDING' ? 'PENDING' : 'CLEARED',
  };
}

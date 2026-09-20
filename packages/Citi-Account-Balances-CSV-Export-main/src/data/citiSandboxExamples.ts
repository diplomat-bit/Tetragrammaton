export const citiSandboxAccountDetailsExample = {
  "accountGroupSummary": [
    {
      "accountGroup": "CHECKING",
      "accountGroupTotal": {
        "balanceType": "ASSET",
        "currentBalance": 24850.75,
        "availableBalance": 24850.75,
        "currencyCode": "USD"
      },
      "checkingAccountsDetails": [
        {
          "accountId": "CHK-99210-44",
          "displayAccountNumber": "xxxx-xxxx-xxxx-3912",
          "productName": "Citi Priority Checking",
          "accountNickname": "Primary Operating",
          "accountStatus": "ACTIVE",
          "currencyCode": "USD",
          "currentBalance": 24850.75,
          "availableBalance": 24850.75,
          "interestRate": 0.05
        }
      ]
    },
    {
      "accountGroup": "SAVINGS",
      "accountGroupTotal": {
        "balanceType": "ASSET",
        "currentBalance": 68420.50,
        "availableBalance": 68420.50,
        "currencyCode": "USD"
      },
      "savingsAccountsDetails": [
        {
          "accountId": "SAV-10492-88",
          "displayAccountNumber": "xxxx-xxxx-xxxx-8840",
          "productName": "Citi Accelerate High Yield Savings",
          "accountNickname": "Emergency Reserve",
          "accountStatus": "ACTIVE",
          "currencyCode": "USD",
          "currentBalance": 68420.50,
          "availableBalance": 68420.50,
          "interestRate": 4.45,
          "interestPaidYTD": 1892.40
        }
      ]
    },
    {
      "accountGroup": "CREDITCARD",
      "accountGroupTotal": {
        "balanceType": "LIABILITY",
        "currentBalance": 3845.20,
        "availableBalance": 21154.80,
        "currencyCode": "USD"
      },
      "creditCardAccountsDetails": [
        {
          "accountId": "CC-55102-19",
          "displayAccountNumber": "xxxx-xxxx-xxxx-9014",
          "productName": "Citi Premier® Card Mastercard",
          "accountNickname": "Travel & Dining Rewards",
          "accountStatus": "ACTIVE",
          "currencyCode": "USD",
          "currentBalance": 2450.80,
          "availableCredit": 17549.20,
          "creditLimit": 20000.00,
          "purchasesAPR": 21.24,
          "paymentDueDate": "2026-09-15",
          "minimumDueAmount": 75.00
        },
        {
          "accountId": "CC-33918-05",
          "displayAccountNumber": "xxxx-xxxx-xxxx-4419",
          "productName": "Citi® Double Cash Card",
          "accountNickname": "Everyday Cash Back",
          "accountStatus": "ACTIVE",
          "currencyCode": "USD",
          "currentBalance": 1394.40,
          "availableCredit": 3605.60,
          "creditLimit": 5000.00,
          "purchasesAPR": 18.99,
          "paymentDueDate": "2026-09-22",
          "minimumDueAmount": 35.00
        }
      ]
    },
    {
      "accountGroup": "LOAN",
      "accountGroupTotal": {
        "balanceType": "LIABILITY",
        "currentBalance": 12500.00,
        "currencyCode": "USD"
      },
      "loanAccountsDetails": [
        {
          "accountId": "LN-77219-01",
          "displayAccountNumber": "xxxx-xxxx-xxxx-6102",
          "productName": "Citi Custom Personal Loan",
          "accountNickname": "Home Renovation",
          "accountStatus": "ACTIVE",
          "currencyCode": "USD",
          "currentBalance": 12500.00,
          "originalLoanAmount": 18000.00,
          "interestRate": 7.99,
          "paymentDueDate": "2026-09-01",
          "minimumDueAmount": 385.00
        }
      ]
    }
  ]
};

export const citiSandboxTransactionsExample = [
  {
    transactionId: "TXN-CITI-901401",
    accountId: "CC-55102-19",
    productName: "Citi Premier® Card Mastercard",
    displayAccountNumber: "xxxx-xxxx-xxxx-9014",
    transactionDate: "2026-08-19",
    postDate: "2026-08-20",
    description: "DELTA AIR LINES ATLANTA GA",
    merchantName: "Delta Air Lines",
    transactionType: "DEBIT" as const,
    category: "Travel & Airlines",
    amount: 489.20,
    currency: "USD",
    runningBalance: 2450.80,
    referenceId: "REF-DL-8829104",
    status: "CLEARED" as const
  },
  {
    transactionId: "TXN-CITI-901402",
    accountId: "CC-55102-19",
    productName: "Citi Premier® Card Mastercard",
    displayAccountNumber: "xxxx-xxxx-xxxx-9014",
    transactionDate: "2026-08-18",
    postDate: "2026-08-19",
    description: "MARRIOTT HOTEL NEW YORK NY",
    merchantName: "Marriott Hotels",
    transactionType: "DEBIT" as const,
    category: "Lodging & Hotels",
    amount: 342.15,
    currency: "USD",
    runningBalance: 1961.60,
    referenceId: "REF-MR-9912041",
    status: "CLEARED" as const
  },
  {
    transactionId: "TXN-CITI-391201",
    accountId: "CHK-99210-44",
    productName: "Citi Priority Checking",
    displayAccountNumber: "xxxx-xxxx-xxxx-3912",
    transactionDate: "2026-08-15",
    postDate: "2026-08-15",
    description: "PAYROLL DIRECT DEP TECH GLOBAL",
    merchantName: "Tech Global Inc",
    transactionType: "CREDIT" as const,
    category: "Income & Payroll",
    amount: 6250.00,
    currency: "USD",
    runningBalance: 24850.75,
    referenceId: "ACH-DEP-002941",
    status: "CLEARED" as const
  },
  {
    transactionId: "TXN-CITI-441901",
    accountId: "CC-33918-05",
    productName: "Citi® Double Cash Card",
    displayAccountNumber: "xxxx-xxxx-xxxx-4419",
    transactionDate: "2026-08-17",
    postDate: "2026-08-18",
    description: "WHOLE FOODS MARKET AUSTIN TX",
    merchantName: "Whole Foods Market",
    transactionType: "DEBIT" as const,
    category: "Groceries & Supermarkets",
    amount: 148.65,
    currency: "USD",
    runningBalance: 1394.40,
    referenceId: "REF-WF-7729104",
    status: "CLEARED" as const
  },
  {
    transactionId: "TXN-CITI-884001",
    accountId: "SAV-10492-88",
    productName: "Citi Accelerate High Yield Savings",
    displayAccountNumber: "xxxx-xxxx-xxxx-8840",
    transactionDate: "2026-07-31",
    postDate: "2026-07-31",
    description: "INTEREST PAYMENT DEPOSIT",
    merchantName: "Citibank N.A.",
    transactionType: "CREDIT" as const,
    category: "Interest Income",
    amount: 254.10,
    currency: "USD",
    runningBalance: 68420.50,
    referenceId: "INT-PAY-202607",
    status: "CLEARED" as const
  },
  {
    transactionId: "TXN-CITI-610201",
    accountId: "LN-77219-01",
    productName: "Citi Custom Personal Loan",
    displayAccountNumber: "xxxx-xxxx-xxxx-6102",
    transactionDate: "2026-08-01",
    postDate: "2026-08-01",
    description: "AUTOPAY LOAN PAYMENT PROCESSED",
    merchantName: "Citi Loan Services",
    transactionType: "CREDIT" as const,
    category: "Loan Principal & Interest",
    amount: 385.00,
    currency: "USD",
    runningBalance: 12500.00,
    referenceId: "ACH-LN-449102",
    status: "CLEARED" as const
  }
];

import crypto from 'crypto';

export interface CitiAccountSummaryGroup {
  accountGroup: string;
  totalCurrentBalance?: { localCurrencyCode: string; localCurrencyBalanceAmount: number };
  totalAvailableBalance?: { localCurrencyCode: string; localCurrencyBalanceAmount: number };
  totalOutstandingBalance?: { localCurrencyCode: string; localCurrencyBalanceAmount: number };
  accounts: any[];
  insurancePolicies?: any[];
}

export interface CitiCustomerParticulars {
  names: Array<{
    firstName: string;
    lastName: string;
    nameType: string;
  }>;
}

export interface CitiOutageItem {
  outageTimestamp: string;
  plannedDuration: string;
  partialOutageFlag: boolean;
  outageExplanation: string;
}

export class CitiOpenApiService {
  // 1. Account Listing & Details Mock Engine
  static getAccountsGroupList(): { accountGroupSummary: CitiAccountSummaryGroup[]; nextStartIndex?: string } {
    return {
      accountGroupSummary: [
        {
          accountGroup: 'CHECKING',
          totalCurrentBalance: { localCurrencyCode: 'USD', localCurrencyBalanceAmount: 245890.50 },
          totalAvailableBalance: { localCurrencyCode: 'USD', localCurrencyBalanceAmount: 245890.50 },
          accounts: [
            {
              checkingAccountSummary: {
                productName: 'Citigold Commercial Checking',
                productCode: '0100_VC300',
                accountNickname: 'Citi Sovereign Operations Checking',
                displayAccountNumber: 'XXXXXXXXXXXX4921',
                accountId: '3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
                currencyCode: 'USD',
                accountStatus: 'ACTIVE',
                accountClassification: 'ASSET',
                currentBalance: 245890.50,
                availableBalance: 245890.50,
                localCurrencyCurrentBalance: 245890.50,
              }
            }
          ]
        },
        {
          accountGroup: 'SAVINGS',
          totalCurrentBalance: { localCurrencyCode: 'USD', localCurrencyBalanceAmount: 1850000.00 },
          totalAvailableBalance: { localCurrencyCode: 'USD', localCurrencyBalanceAmount: 1850000.00 },
          accounts: [
            {
              savingsAccountSummary: {
                productName: 'Citi High Yield Institutional Treasury Reserve',
                productCode: '0200_VC400',
                accountNickname: 'Autonomous Sovereign Moat Reserve',
                displayAccountNumber: 'XXXXXXXXXXXX8819',
                accountId: '8845129983416f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
                currencyCode: 'USD',
                accountStatus: 'ACTIVE',
                accountClassification: 'ASSET',
                currentBalance: 1850000.00,
                availableBalance: 1850000.00,
                localCurrencyCurrentBalance: 1850000.00,
              }
            }
          ]
        },
        {
          accountGroup: 'CREDIT_CARD',
          totalOutstandingBalance: { localCurrencyCode: 'USD', localCurrencyBalanceAmount: 14250.75 },
          accounts: [
            {
              creditCardAccountSummary: {
                productName: 'Citi Prestige World Elite Business Mastercard',
                productCode: '0500_VC901',
                accountNickname: 'Executive Travel & Ops Card',
                displayAccountNumber: 'XXXXXXXXXXXX2391',
                accountId: '7729104482916f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
                currencyCode: 'USD',
                accountStatus: 'ACTIVE',
                accountClassification: 'LIABILITY',
                outstandingBalance: 14250.75,
                availableCredit: 135749.25,
                creditLimit: 150000.00,
                minimumDueAmount: 450.00,
                paymentDueDate: '2026-10-15',
                cardHolderType: 'PRIMARY'
              }
            }
          ]
        },
        {
          accountGroup: 'SECURITIES_BROKERAGE',
          totalCurrentBalance: { localCurrencyCode: 'USD', localCurrencyBalanceAmount: 5600000.00 },
          accounts: [
            {
              securitiesBrokerageAccountSummary: {
                productName: 'Citi Wealth Sovereign Custody Brokerage',
                productCode: '0101_VC801',
                accountNickname: 'RWA & Tokenized Equity Vault',
                displayAccountNumber: 'XXXXXXXXXXXX9014',
                accountId: '9928103348216f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
                currencyCode: 'USD',
                accountStatus: 'ACTIVE',
                accountClassification: 'ASSET',
                currentBalance: 5600000.00,
                localCurrencyCurrentBalance: 5600000.00
              }
            }
          ]
        }
      ],
      nextStartIndex: '11'
    };
  }

  static getAccountDetails(accountId: string): any {
    return {
      primaryCustomerIndicator: 'P',
      checkingAccount: {
        productName: 'Citigold Commercial Checking',
        productCode: '0100_VC300',
        displayAccountNumber: 'XXXXXXXXXXXX4921',
        currentBalance: 245890.50,
        availableBalance: 245890.50,
        overdraftLimit: 50000.00,
        availableOverdraftLimit: 50000.00,
        currencyCode: 'USD',
        lastStatementDate: '2026-08-31',
        holdAmount: 0.00,
        floatAmount: 0.00,
        totalInterestAmount: 1420.50,
        openingDate: '2023-01-15',
        bankCode: '021',
        branchCode: '00021'
      },
      creditCardAccount: {
        productName: 'Citi Prestige World Elite Business Mastercard',
        productCode: '0500_VC901',
        displayAccountNumber: 'XXXXXXXXXXXX2391',
        currencyCode: 'USD',
        outstandingBalance: 14250.75,
        lastStatementBalance: 12100.00,
        lastStatementDate: '2026-08-25',
        creditUsed: 14250.75,
        creditLimit: 150000.00,
        availableCredit: 135749.25,
        cashAdvanceLimit: 30000.00,
        cashAdvanceAvailableAmount: 30000.00,
        lastPaymentAmount: 12100.00,
        lastPaymentDate: '2026-08-12',
        minimumDueAmount: 450.00,
        paymentDueDate: '2026-10-15',
        availablePointBalance: 485200,
        unbilledPurchaseAmount: 2150.75,
        unbilledPaymentAmount: 0.00
      },
      timeDepositAccount: {
        productName: 'Citi Institutional 90-Day Fixed Time Deposit',
        productCode: '0600_VC101',
        displayAccountNumber: 'XXXXXXXXXXXX7731',
        depositPlacementNumber: '11001123456',
        originalPrincipalAmount: 1000000.00,
        currentPrincipalAmount: 1012875.00,
        interestEffectiveDate: '2026-07-01',
        currencyCode: 'USD',
        interestRate: 0.0515,
        openingDate: '2026-07-01',
        maturityDate: '2026-09-30',
        nextInterestPaymentDate: '2026-09-30',
        interestAmountDue: 12875.00,
        renewalInstructions: 'RENEW_PRINCIPAL_AND_INTEREST',
        tenorTerm: 90,
        tenorPeriod: 'DAYS',
        baseCurrencyMaturityAmount: 1012875.00,
        maturityInterestAmount: 12875.00
      }
    };
  }

  // 2. Transaction Listing & Details
  static getAccountTransactions(accountId: string, options?: any): any {
    return {
      transactions: [
        {
          displayAccountNumber: 'XXXXXXXXXXXX4921',
          transactionDate: '2026-09-12',
          transactionTime: '14:22:10 UTC',
          statementDate: '2026-08-31',
          transactionDescription: 'FEDWIRE INCOMING SETTLEMENT - SOVEREIGN CAPITAL TIER-2',
          transactionReferenceId: 'CITI-TRX-20260912-88391',
          transactionDetailViewFlag: true,
          transactionAmount: 1000000.00,
          accountCurrencyTransactionAmount: 1000000.00,
          sourceAccountCurrencyCode: 'USD',
          currencyCode: 'USD',
          transactionType: 'CREDIT',
          transactionStatus: 'BILLED',
          runningBalance: 245890.50,
          transactionPostingDate: '2026-09-12',
          transactionCode: 'FEDWIRE_IMAD_021000021',
          merchantName: 'Federal Reserve Bank of New York / Fedwire',
          merchantCategoryCode: '6011',
          eligibleForEqualPaymentPlan: 'NOT_ELIGIBLE'
        },
        {
          displayAccountNumber: 'XXXXXXXXXXXX4921',
          transactionDate: '2026-09-11',
          transactionTime: '10:05:40 UTC',
          statementDate: '2026-08-31',
          transactionDescription: 'INTERNAL DOMESTIC TRANSFER - SBA SPECIAL INITIATIVES',
          transactionReferenceId: 'CITI-TRX-20260911-44120',
          transactionDetailViewFlag: true,
          transactionAmount: 500000.00,
          accountCurrencyTransactionAmount: 500000.00,
          sourceAccountCurrencyCode: 'USD',
          currencyCode: 'USD',
          transactionType: 'DEBIT',
          transactionStatus: 'BILLED',
          runningBalance: 145890.50,
          transactionPostingDate: '2026-09-11',
          transactionCode: 'INT_DOMESTIC_TRANSFER',
          merchantName: 'SBA Special Initiatives Account',
          merchantCategoryCode: '9399'
        },
        {
          displayAccountNumber: 'XXXXXXXXXXXX2391',
          transactionDate: '2026-09-10',
          transactionTime: '18:45:12 UTC',
          statementDate: '2026-08-25',
          transactionDescription: 'AWS CLOUD ENTERPRISE HOSTING & COMPUTING',
          transactionReferenceId: 'CITI-TRX-20260910-11928',
          transactionDetailViewFlag: true,
          transactionAmount: 3450.25,
          accountCurrencyTransactionAmount: 3450.25,
          sourceAccountCurrencyCode: 'USD',
          currencyCode: 'USD',
          transactionType: 'DEBIT',
          transactionStatus: 'BILLED',
          runningBalance: 14250.75,
          transactionPostingDate: '2026-09-10',
          transactionCode: 'CARD_PURCHASE',
          merchantName: 'Amazon Web Services Inc.',
          merchantCategoryCode: '5734',
          eligibleForEqualPaymentPlan: 'ELIGIBLE'
        }
      ],
      investmentTransaction: [
        {
          orderDate: '2026-09-08',
          orderReferenceId: 'ORD-CITI-INV-99812',
          orderType: 'BUY',
          code: 'NVDA_TOKEN',
          name: 'Tokenized NVIDIA Corp (ERC-3643)',
          securityType: 'EQUITIES',
          currencyCode: 'USD',
          transactionAmount: 50000.00,
          price: 128.50,
          orderStatus: 'SETTLED',
          grossAmount: 50000.00,
          orderQuantity: 389.10,
          orderMedium: 'INTERNET_API',
          filledQuantity: 389.10,
          balanceQuantity: 0.0,
          stockMarketCode: 'NASDAQ_RWA',
          isinCode: 'US67066G1040',
          settlementDate: '2026-09-08'
        }
      ],
      nextStartIndex: '11'
    };
  }

  // 3. Funds Sufficiency Check
  static checkSufficiency(accountId: string, amount: number, currency: string): { sufficientFundsFlag: boolean; availableBalance: number } {
    const available = 245890.50;
    return {
      sufficientFundsFlag: available >= amount,
      availableBalance: available
    };
  }

  // 4. Customer Demographics
  static getCustomerDemographics(): CitiCustomerParticulars {
    return {
      names: [
        {
          firstName: 'James Burvel',
          lastName: "O'Callaghan III",
          nameType: 'LEGAL_NAME'
        },
        {
          firstName: 'Autonomous Architect',
          lastName: 'Citibank Demo Business Inc.',
          nameType: 'CORPORATE_TITLE'
        }
      ]
    };
  }

  // 5. Clear Data Unmasking
  static retrieveClearData(accountInfo: Array<{ accountId: string }>): any {
    return {
      accounts: accountInfo.map((item, idx) => ({
        accountId: item.accountId,
        unmaskedAccountNumber: `US89CITI021000021${49281 + idx}`
      }))
    };
  }

  // 6. Outage Discovery
  static getScheduledOutages(): { data: { outages: CitiOutageItem[] } } {
    return {
      data: {
        outages: [
          {
            outageTimestamp: '2026-10-18T02:00:00.000Z',
            plannedDuration: 'PT2H',
            partialOutageFlag: false,
            outageExplanation: 'Citibank Open Banking Global API maintenance window for ISO 20022 and FDX v6 real-time ledger synchronization.'
          }
        ]
      }
    };
  }

  // 7. OAuth2 Token Generation (Client Credentials & Auth Code)
  static generateOAuthToken(grantType: string, scope: string = '/api'): any {
    const accessToken = 'citi_sec_' + crypto.randomBytes(32).toString('hex');
    const refreshToken = 'citi_ref_' + crypto.randomBytes(32).toString('hex');
    return {
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: scope,
      consented_on: Math.floor(Date.now() / 1000)
    };
  }

  // 8. Dynamic Client Registration (DCR)
  static registerDynamicClient(softwareStatement: string): any {
    const clientId = 'PSDGB-OB-CITI-' + crypto.randomUUID();
    const clientSecret = 'citi_sec_' + crypto.randomBytes(24).toString('base64');
    return {
      client_id: clientId,
      client_secret: clientSecret,
      client_secret_expires_at: '0',
      redirect_uris: 'https://autonomous-architect.internal/citi/oauth2/callback',
      token_endpoint_auth_method: 'client_secret_basic',
      response_types: ['code', 'code id_token', 'refresh_token'],
      grant_type: ['client_credentials', 'authorization_code', 'refresh_token'],
      scope: ['openid', 'payments', 'accounts', 'move_money'],
      software_Id: 'citi_soft_id_' + crypto.randomBytes(6).toString('hex')
    };
  }

  // 9. Money Movement - Domestic & External Transfers
  static preprocessDomesticTransfer(params: any): any {
    const controlFlowId = crypto.randomBytes(32).toString('hex');
    return {
      controlFlowId,
      debitDetails: {
        transactionDebitAmount: params.transactionAmount || 1000.00,
        currencyCode: params.currencyCode || 'USD',
        totalTransactionDebitAmount: (params.transactionAmount || 1000.00) + 15.00
      },
      creditDetails: {
        transactionCreditAmount: params.transactionAmount || 1000.00,
        currencyCode: params.currencyCode || 'USD'
      },
      foreignExchangeRate: 1.0000,
      forexType: 'LIVE',
      forexConversionIndicator: 'SOURCE_TO_DESTINATION',
      transactionFee: 15.00,
      feeCurrencyCode: 'USD',
      localCurrencyTransactionFee: 15.00,
      localCurrencyCode: 'USD',
      paymentMethod: params.paymentMethod || 'GIRO_FEDWIRE'
    };
  }

  static confirmTransfer(controlFlowId: string): any {
    const txRef = 'CITI-TX-CONF-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    return {
      transactionReferenceId: txRef,
      transactionStatus: 'SUCCESS',
      referenceNumber: 'REF_' + crypto.randomBytes(6).toString('hex').toUpperCase(),
      transactionDate: new Date().toISOString().split('T')[0],
      transactionTime: new Date().toLocaleTimeString(),
      payeeEnrollmentStatus: 'SUCCESS',
      sourceAccount: {
        displaySourceAccountNumber: 'XXXXXXXXXXXX4921',
        sourceAccountAvailableBalance: 244875.50,
        sourceCurrencyCode: 'USD',
        currentBalanceAmount: 244875.50
      }
    };
  }

  // 10. Payee Management
  static getPayeeList(): any {
    return {
      payeeList: [
        {
          favoritePayeeId: 'PAYEE_CITI_DOM_001',
          payeeName: 'Trump Administration Policy Transition Trust',
          payeeNickname: 'Trump Transition Trust',
          paymentType: 'LOCAL_CITI',
          displayAccountNumber: 'XXXXXXXXXXXX49281',
          accountId: '3255613852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
          currencyCode: 'USD',
          payeeStatus: 'ACTIVE',
          paymentMethods: [{ paymentMethod: 'FEDWIRE' }, { paymentMethod: 'ACH' }]
        },
        {
          favoritePayeeId: 'PAYEE_CITI_DOM_002',
          payeeName: 'SBA Special Initiatives Account (Kelly Loeffler)',
          payeeNickname: 'SBA Initiatives',
          paymentType: 'LOCAL_CITI',
          displayAccountNumber: 'XXXXXXXXXXXX83190',
          accountId: '8845129983416f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d',
          currencyCode: 'USD',
          payeeStatus: 'ACTIVE',
          paymentMethods: [{ paymentMethod: 'FEDWIRE' }, { paymentMethod: 'US_TREASURY_BFS' }]
        }
      ],
      nextStartIndex: '11'
    };
  }

  // 11. EMEA Onboarding & IPA Credit Decisions
  static evaluateEmeaInPrincipleApproval(applicationId: string, params: any): any {
    return {
      applicationStage: 'APPROVED_IPA',
      ipaExpiryDate: '2026-12-31',
      kycCustomerRiskLevelFlag: true,
      kbaRequiredFlag: false,
      bureauPullExpiredFlag: false,
      ekycRecommendedFlag: true,
      requestedProductDecision: [
        {
          productCode: 'VC830',
          organisationCode: '888',
          sourceCode: 'WW5ARCE1',
          creditDecision: '000', // APPROVED
          offerProductCategory: 'AM',
          offerDocumentCriteria: 'WO',
          ipaRecommendation: '10', // FULL
          offerSequenceId: 'SEQ_IPA_9981',
          creditSpecificRecommendations: [
            {
              recommendedCreditLimit: 150000.0,
              effectiveInterestRate: 4.85,
              annualPercentageRate: 5.15,
              eligibleForEqualPaymentPlanFlag: true,
              equalPaymentPlanId: 'EPP_SOV_2026'
            }
          ],
          loanSpecificRecommendations: [
            {
              loanAmount: 1850000.0,
              tenor: '60',
              interestRate: 4.5,
              annualPercentageRate: 4.75,
              installmentAmount: 34500.0,
              monthlyFeeAmount: 120.0,
              grossLoanAmount: 1850000.0,
              totalCostOfCreditWithInsurance: 2077200.0,
              pricingPlanId: 'PRICING_SOV_TIER2'
            }
          ]
        }
      ]
    };
  }
}

import { CitiAccount, CitiTransaction, CsvExportOptions } from '../types';

export const defaultTransactionCsvHeaders = [
  'Transaction ID',
  'Date',
  'Post Date',
  'Product Name',
  'Account Number',
  'Description',
  'Merchant Name',
  'Category',
  'Type',
  'Amount ($)',
  'Currency',
  'Running Balance ($)',
  'Reference ID',
  'Status'
];

function escapeCsv(val: any, delimiter: string = ','): string {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(delimiter) || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatDate(dateStr?: string, format: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' = 'YYYY-MM-DD'): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    if (format === 'MM/DD/YYYY') return `${m}/${day}/${y}`;
    if (format === 'DD/MM/YYYY') return `${day}/${m}/${y}`;
    return `${y}-${m}-${day}`;
  } catch {
    return dateStr;
  }
}

export function exportTransactionsToCsv(
  transactions: CitiTransaction[],
  options: Partial<CsvExportOptions> = {}
): string {
  const delimiter = options.delimiter || ',';
  const includeHeaders = options.includeHeaders !== false;
  const dateFormat = options.dateFormat || 'YYYY-MM-DD';

  const rows: string[] = [];

  if (includeHeaders) {
    rows.push(defaultTransactionCsvHeaders.map((h) => escapeCsv(h, delimiter)).join(delimiter));
  }

  for (const t of transactions) {
    const row = [
      escapeCsv(t.transactionId, delimiter),
      escapeCsv(formatDate(t.transactionDate, dateFormat), delimiter),
      escapeCsv(formatDate(t.postDate, dateFormat), delimiter),
      escapeCsv(t.productName, delimiter),
      escapeCsv(t.displayAccountNumber, delimiter),
      escapeCsv(t.description, delimiter),
      escapeCsv(t.merchantName || '', delimiter),
      escapeCsv(t.category, delimiter),
      escapeCsv(t.transactionType, delimiter),
      escapeCsv(t.amount.toFixed(2), delimiter),
      escapeCsv(t.currency, delimiter),
      escapeCsv(t.runningBalance !== undefined ? t.runningBalance.toFixed(2) : '', delimiter),
      escapeCsv(t.referenceId, delimiter),
      escapeCsv(t.status, delimiter),
    ];
    rows.push(row.join(delimiter));
  }

  return rows.join('\r\n');
}

export function exportAccountsSummaryToCsv(
  accounts: CitiAccount[],
  delimiter: string = ','
): string {
  const headers = [
    'Product Name',
    'Account Description',
    'Account Number',
    'Group / Classification',
    'Balance Type',
    'Status',
    'Currency',
    'Current Balance',
    'Available Balance / Credit',
    'Credit Limit',
    'Purchases APR (%)',
    'Interest Rate (%)',
    'Minimum Due Amount',
    'Payment Due Date',
    'Last Statement Balance',
    'Last Statement Date',
    'Last Payment Amount',
    'Last Payment Date',
    'Last Synced'
  ];

  const rows: string[] = [headers.map((h) => escapeCsv(h, delimiter)).join(delimiter)];

  for (const a of accounts) {
    const avail = a.availableCredit !== undefined ? a.availableCredit : (a.availableBalance !== undefined ? a.availableBalance : '');
    const row = [
      escapeCsv(a.productName, delimiter),
      escapeCsv(a.accountDescription || '', delimiter),
      escapeCsv(a.displayAccountNumber, delimiter),
      escapeCsv(a.accountGroup, delimiter),
      escapeCsv(a.balanceType, delimiter),
      escapeCsv(a.accountStatus, delimiter),
      escapeCsv(a.currencyCode, delimiter),
      escapeCsv(a.currentBalance.toFixed(2), delimiter),
      escapeCsv(typeof avail === 'number' ? avail.toFixed(2) : avail, delimiter),
      escapeCsv(a.creditLimit !== undefined ? a.creditLimit.toFixed(2) : '', delimiter),
      escapeCsv(a.purchasesAPR !== undefined ? a.purchasesAPR.toFixed(2) : '', delimiter),
      escapeCsv(a.interestRate !== undefined ? a.interestRate.toFixed(2) : '', delimiter),
      escapeCsv(a.minimumDueAmount !== undefined ? a.minimumDueAmount.toFixed(2) : '', delimiter),
      escapeCsv(a.paymentDueDate || '', delimiter),
      escapeCsv(a.lastStatementBalance !== undefined ? a.lastStatementBalance.toFixed(2) : '', delimiter),
      escapeCsv(a.lastStatementDate || '', delimiter),
      escapeCsv(a.lastPaymentAmount !== undefined ? a.lastPaymentAmount.toFixed(2) : '', delimiter),
      escapeCsv(a.lastPaymentDate || '', delimiter),
      escapeCsv(a.lastUpdated, delimiter),
    ];
    rows.push(row.join(delimiter));
  }

  return rows.join('\r\n');
}

export function exportCombinedFinancialCsv(
  accounts: CitiAccount[],
  transactions: CitiTransaction[],
  options: Partial<CsvExportOptions> = {}
): string {
  const delimiter = options.delimiter || ',';
  const accountsCsv = exportAccountsSummaryToCsv(accounts, delimiter);
  const transactionsCsv = exportTransactionsToCsv(transactions, options);

  return [
    `# ==========================================`,
    `# CITI PARTNER API FINANCIAL SUMMARY EXPORT`,
    `# Export Date: ${new Date().toISOString()}`,
    `# ==========================================`,
    ``,
    `[SECTION: ACCOUNTS AND BALANCES]`,
    accountsCsv,
    ``,
    `[SECTION: TRANSACTION HISTORY]`,
    transactionsCsv
  ].join('\r\n');
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  TableProperties,
  Layers,
  Sparkles
} from 'lucide-react';
import { CitiTransaction, CitiAccount, CsvExportOptions } from '../types';
import { 
  exportTransactionsToCsv, 
  exportAccountsSummaryToCsv, 
  exportCombinedFinancialCsv, 
  downloadCsv 
} from '../utils/csvExporter';

interface CsvExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: CitiTransaction[];
  accounts: CitiAccount[];
}

export const CsvExportModal: React.FC<CsvExportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  accounts,
}) => {
  const [exportType, setExportType] = useState<'transactions' | 'accounts' | 'both'>('transactions');
  const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
  const [dateFormat, setDateFormat] = useState<'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY'>('YYYY-MM-DD');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [customFilename, setCustomFilename] = useState(
    `citi_transactions_${new Date().toISOString().split('T')[0]}`
  );

  if (!isOpen) return null;

  const handleDownload = () => {
    let csvData = '';
    const options: Partial<CsvExportOptions> = {
      delimiter,
      dateFormat,
      includeHeaders,
    };

    if (exportType === 'transactions') {
      csvData = exportTransactionsToCsv(transactions, options);
    } else if (exportType === 'accounts') {
      csvData = exportAccountsSummaryToCsv(accounts, delimiter);
    } else {
      csvData = exportCombinedFinancialCsv(accounts, transactions, options);
    }

    downloadCsv(csvData, customFilename || 'citi_export.csv');
    onClose();
  };

  // Preview generated first few lines
  const previewCsv = exportType === 'transactions'
    ? exportTransactionsToCsv(transactions.slice(0, 3), { delimiter, dateFormat, includeHeaders })
    : exportType === 'accounts'
    ? exportAccountsSummaryToCsv(accounts.slice(0, 3), delimiter)
    : exportCombinedFinancialCsv(accounts.slice(0, 2), transactions.slice(0, 2), { delimiter, dateFormat, includeHeaders });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1E293B] text-base">Export Financial Data to CSV</h3>
              <p className="text-xs text-[#64748B]">Generate formatted CSV spreadsheets for accounting and analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8F9FB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Export Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Dataset to Export
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setExportType('transactions');
                  setCustomFilename(`citi_transactions_${new Date().toISOString().split('T')[0]}`);
                }}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                  exportType === 'transactions'
                    ? 'border-[#0052FF] bg-blue-50/50 text-[#0052FF]'
                    : 'border-[#E2E8F0] hover:bg-[#F8F9FB] text-[#475569]'
                }`}
              >
                <TableProperties className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Transactions</div>
                  <div className="text-[11px] text-[#64748B]">{transactions.length} records</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExportType('accounts');
                  setCustomFilename(`citi_accounts_summary_${new Date().toISOString().split('T')[0]}`);
                }}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                  exportType === 'accounts'
                    ? 'border-[#0052FF] bg-blue-50/50 text-[#0052FF]'
                    : 'border-[#E2E8F0] hover:bg-[#F8F9FB] text-[#475569]'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Account Balances</div>
                  <div className="text-[11px] text-[#64748B]">{accounts.length} accounts</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExportType('both');
                  setCustomFilename(`citi_full_portfolio_${new Date().toISOString().split('T')[0]}`);
                }}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                  exportType === 'both'
                    ? 'border-[#0052FF] bg-blue-50/50 text-[#0052FF]'
                    : 'border-[#E2E8F0] hover:bg-[#F8F9FB] text-[#475569]'
                }`}
              >
                <Layers className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Combined Report</div>
                  <div className="text-[11px] text-[#64748B]">Full portfolio & txns</div>
                </div>
              </button>
            </div>
          </div>

          {/* Delimiter, Date format, Filename */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                Delimiter
              </label>
              <select
                aria-label="CSV Delimiter"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value as any)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#0052FF]"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="&#9;">Tab (\t)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                Date Format
              </label>
              <select
                aria-label="Date Format"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value as any)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#0052FF]"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                Filename (.csv)
              </label>
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#0052FF]"
              />
            </div>
          </div>

          {/* Header row toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include-headers"
              checked={includeHeaders}
              onChange={(e) => setIncludeHeaders(e.target.checked)}
              className="rounded border-[#CBD5E1] text-[#0052FF] focus:ring-[#0052FF]"
            />
            <label htmlFor="include-headers" className="text-xs text-[#475569] font-medium cursor-pointer">
              Include column header titles in the first row
            </label>
          </div>

          {/* CSV Live Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
              Live CSV Output Preview (Sample rows)
            </label>
            <pre className="bg-[#1E293B] text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-36 leading-relaxed">
              {previewCsv}
            </pre>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8F9FB] rounded-lg text-xs font-semibold text-[#475569] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

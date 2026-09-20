import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Download,
  X,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { CitiTransaction, CitiAccount } from '../types';
import { exportTransactionsToCsv, downloadCsv } from '../utils/csvExporter';

interface TransactionsTableProps {
  transactions: CitiTransaction[];
  accounts: CitiAccount[];
  selectedAccountId: string | null;
  onClearAccountFilter: () => void;
  onOpenExportModal: () => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  accounts,
  selectedAccountId,
  onClearAccountFilter,
  onOpenExportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
  const [sortField, setSortField] = useState<'transactionDate' | 'amount' | 'description'>('transactionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((tx) => {
      if (tx.category) set.add(tx.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Account filter
      if (selectedAccountId && tx.accountId !== selectedAccountId) {
        return false;
      }
      // Type filter
      if (selectedType !== 'ALL' && tx.transactionType !== selectedType) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches = 
          tx.description.toLowerCase().includes(query) ||
          (tx.merchantName && tx.merchantName.toLowerCase().includes(query)) ||
          tx.transactionId.toLowerCase().includes(query) ||
          tx.referenceId.toLowerCase().includes(query) ||
          tx.productName.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortField === 'transactionDate') {
        const dateA = new Date(a.transactionDate).getTime();
        const dateB = new Date(b.transactionDate).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
      if (sortField === 'amount') {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      if (sortField === 'description') {
        return sortOrder === 'desc' 
          ? b.description.localeCompare(a.description)
          : a.description.localeCompare(b.description);
      }
      return 0;
    });
  }, [transactions, selectedAccountId, selectedType, selectedCategory, searchTerm, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleQuickExport = () => {
    const csvContent = exportTransactionsToCsv(filteredTransactions);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCsv(csvContent, `citi_transactions_${dateStr}.csv`);
  };

  const selectedAccountName = useMemo(() => {
    if (!selectedAccountId) return null;
    return accounts.find((a) => a.accountId === selectedAccountId)?.productName || selectedAccountId;
  }, [selectedAccountId, accounts]);

  const toggleSort = (field: 'transactionDate' | 'amount' | 'description') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col flex-1 overflow-hidden">
      {/* Header with Title & Export Actions */}
      <div className="px-6 py-4 border-b border-[#F1F5F9] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#1E293B] text-base">Account Transaction History</h3>
            {selectedAccountId && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-[#0052FF] font-medium px-2 py-0.5 rounded-full border border-blue-100">
                Filtered: {selectedAccountName}
                <button
                  onClick={onClearAccountFilter}
                  className="hover:text-blue-800 p-0.5 rounded-full"
                  title="Clear account filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Viewing {filteredTransactions.length} of {transactions.length} total reconciled ledger records
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick 1-click CSV Export */}
          <button
            id="quick-export-csv-btn"
            onClick={handleQuickExport}
            className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-xs"
            title="Download CSV immediately with default settings"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>

          {/* Advanced CSV Export Modal */}
          <button
            id="custom-export-csv-btn"
            onClick={onOpenExportModal}
            className="bg-white hover:bg-[#F8F9FB] text-[#1E293B] border border-[#E2E8F0] px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            title="Customize export options, formats, and dataset"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#64748B]" />
            <span className="hidden sm:inline">Options</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-6 py-3 bg-[#F8F9FB] border-b border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search description, merchant, reference ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#1A1C1E] placeholder-[#94A3B8] focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            aria-label="Filter by Category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#475569] font-medium focus:outline-none focus:border-[#0052FF] cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            aria-label="Filter by Transaction Type"
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#475569] font-medium focus:outline-none focus:border-[#0052FF] cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="DEBIT">Debits Only (-)</option>
            <option value="CREDIT">Credits Only (+)</option>
          </select>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="flex-1 overflow-x-auto min-h-[360px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F8F9FB] sticky top-0 z-10">
            <tr className="text-[11px] uppercase tracking-wider text-[#64748B] font-bold">
              <th className="px-6 py-3 border-b border-[#F1F5F9]">Transaction ID</th>
              <th 
                className="px-6 py-3 border-b border-[#F1F5F9] cursor-pointer hover:text-[#1A1C1E]"
                onClick={() => toggleSort('transactionDate')}
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                </div>
              </th>
              <th 
                className="px-6 py-3 border-b border-[#F1F5F9] cursor-pointer hover:text-[#1A1C1E]"
                onClick={() => toggleSort('description')}
              >
                <div className="flex items-center gap-1">
                  <span>Description & Account</span>
                  <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                </div>
              </th>
              <th className="px-6 py-3 border-b border-[#F1F5F9]">Category</th>
              <th className="px-6 py-3 border-b border-[#F1F5F9] text-right">Status</th>
              <th 
                className="px-6 py-3 border-b border-[#F1F5F9] text-right cursor-pointer hover:text-[#1A1C1E]"
                onClick={() => toggleSort('amount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-[#F1F5F9]">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#94A3B8]">
                  <p className="text-sm font-medium text-[#64748B]">No transactions found</p>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Try adjusting your search criteria or clear selected filters.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((tx) => {
                const isCredit = tx.transactionType === 'CREDIT';
                const formattedAmount = `${isCredit ? '+' : '-'}$${tx.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;

                const categoryBadge = isCredit ? (
                  <span className="bg-[#ECFDF5] text-[#059669] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {tx.category || 'INCOME'}
                  </span>
                ) : (
                  <span className="bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {tx.category || 'EXPENSE'}
                  </span>
                );

                return (
                  <tr key={tx.transactionId} className="hover:bg-[#F8F9FB] transition-colors group">
                    {/* Transaction ID */}
                    <td className="px-6 py-4 font-mono text-xs text-[#94A3B8]">
                      {tx.transactionId || tx.referenceId}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-medium text-[#475569] whitespace-nowrap">
                      {tx.transactionDate}
                    </td>

                    {/* Description & Account */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#1E293B] text-xs">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] flex items-center gap-2 mt-0.5">
                        <span>{tx.productName}</span>
                        <span className="font-mono text-[#64748B]">({tx.displayAccountNumber})</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {categoryBadge}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-[11px] font-medium text-[#64748B] bg-[#F8F9FB] px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {tx.status}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      className={`px-6 py-4 text-right font-semibold text-xs whitespace-nowrap ${
                        isCredit ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formattedAmount}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Summary Footer */}
      <div className="px-6 py-3 border-t border-[#F1F5F9] bg-[#F8F9FB] flex items-center justify-between text-xs text-[#64748B]">
        <p>
          Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions (Page {currentPage} of {totalPages})
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white border border-[#E2E8F0] rounded shadow-xs hover:bg-gray-50 text-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-white border border-[#E2E8F0] rounded shadow-xs hover:bg-gray-50 text-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

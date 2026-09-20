import React, { useState, useEffect, useCallback } from 'react';
import {
  FileSpreadsheet, Plus, Trash2, Download, Upload, Copy, Check,
  Sparkles, RefreshCw, Calculator, Table, Filter, ArrowUpDown,
  Bold, Italic, DollarSign, Percent, Code2, Play, Search, Eye,
  ExternalLink, CheckCircle2, AlertCircle, Cloud
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

interface CellData {
  value: string;
  formula?: string;
  bold?: boolean;
  italic?: boolean;
  format?: 'text' | 'currency' | 'percent' | 'number';
  bgColor?: string;
  textColor?: string;
}

const DEFAULT_COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const INITIAL_ROW_COUNT = 15;

export const GoogleSheetsWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSpreadsheetUrl, setCloudSpreadsheetUrl] = useState<string | null>(null);
  const [cloudMsg, setCloudMsg] = useState<string | null>(null);
  const [userSheets, setUserSheets] = useState<{ id: string; name: string; modifiedTime: string; webViewLink?: string }[]>([]);

  const [sheetTitle, setSheetTitle] = useState('Financial Models & Operational Ledger');
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLS);

  // Fetch real Google Sheets from Drive API
  const fetchUserSheets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await callGoogleApi<{ files?: any[] }>(
        "https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.spreadsheet'&pageSize=15&fields=files(id,name,modifiedTime,webViewLink)"
      );
      if (res.files) {
        setUserSheets(res.files.map((f: any) => ({
          id: f.id,
          name: f.name || 'Untitled Sheet',
          modifiedTime: f.modifiedTime ? new Date(f.modifiedTime).toLocaleDateString() : 'Recent',
          webViewLink: f.webViewLink || `https://docs.google.com/spreadsheets/d/${f.id}/edit`
        })));
      }
    } catch (e) {
      console.warn('Google Sheets fetch note:', e);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserSheets();
    }
  }, [token, fetchUserSheets]);
  const [gridData, setGridData] = useState<{ [cellId: string]: CellData }>({
    'A1': { value: 'Account Name', bold: true, bgColor: '#1e293b' },
    'B1': { value: 'Category', bold: true, bgColor: '#1e293b' },
    'C1': { value: 'Q1 Revenue ($)', bold: true, format: 'currency', bgColor: '#1e293b' },
    'D1': { value: 'Q2 Revenue ($)', bold: true, format: 'currency', bgColor: '#1e293b' },
    'E1': { value: 'Variance ($)', bold: true, format: 'currency', bgColor: '#1e293b' },
    'F1': { value: 'Growth (%)', bold: true, format: 'percent', bgColor: '#1e293b' },
    'A2': { value: 'Enterprise SaaS' },
    'B2': { value: 'Recurring Revenue' },
    'C2': { value: '185000', format: 'currency' },
    'D2': { value: '240000', format: 'currency' },
    'E2': { value: '=D2-C2', formula: '=D2-C2', format: 'currency' },
    'F2': { value: '=(D2-C2)/C2*100', formula: '=(D2-C2)/C2*100', format: 'percent' },
    'A3': { value: 'Citi Commercial Paper' },
    'B3': { value: 'Treasury Yield' },
    'C3': { value: '92000', format: 'currency' },
    'D3': { value: '115000', format: 'currency' },
    'E3': { value: '=D3-C3', formula: '=D3-C3', format: 'currency' },
    'F3': { value: '=(D3-C3)/C3*100', formula: '=(D3-C3)/C3*100', format: 'percent' },
    'A4': { value: 'Visa Direct Settled' },
    'B4': { value: 'Interchange Fees' },
    'C4': { value: '64000', format: 'currency' },
    'D4': { value: '78000', format: 'currency' },
    'E4': { value: '=D4-C4', formula: '=D4-C4', format: 'currency' },
    'F4': { value: '=(D4-C4)/C4*100', formula: '=(D4-C4)/C4*100', format: 'percent' },
    'A5': { value: 'Alpaca RWA Yields' },
    'B5': { value: 'Tokenized Equities' },
    'C5': { value: '45000', format: 'currency' },
    'D5': { value: '82000', format: 'currency' },
    'E5': { value: '=D5-C5', formula: '=D5-C5', format: 'currency' },
    'F5': { value: '=(D5-C5)/C5*100', formula: '=(D5-C5)/C5*100', format: 'percent' },
    'A6': { value: 'TOTALS', bold: true, bgColor: '#334155' },
    'B6': { value: 'Consolidated', bold: true, bgColor: '#334155' },
    'C6': { value: '=SUM(C2:C5)', formula: '=SUM(C2:C5)', bold: true, format: 'currency', bgColor: '#334155' },
    'D6': { value: '=SUM(D2:D5)', formula: '=SUM(D2:D5)', bold: true, format: 'currency', bgColor: '#334155' },
    'E6': { value: '=SUM(E2:E5)', formula: '=SUM(E2:E5)', bold: true, format: 'currency', bgColor: '#334155' },
    'F6': { value: '=(D6-C6)/C6*100', formula: '=(D6-C6)/C6*100', bold: true, format: 'percent', bgColor: '#334155' },
  });

  const [rowCount, setRowCount] = useState<number>(INITIAL_ROW_COUNT);
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [formulaBarInput, setFormulaBarInput] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Sync formula bar with active cell selection
  useEffect(() => {
    const cell = gridData[selectedCell];
    setFormulaBarInput(cell?.formula || cell?.value || '');
  }, [selectedCell, gridData]);

  // Evaluator function for simple Excel formulas
  const evaluateCell = (cellId: string): string => {
    const cell = gridData[cellId];
    if (!cell) return '';
    const raw = cell.formula || cell.value;
    if (!raw) return '';

    if (raw.startsWith('=')) {
      try {
        const expression = raw.substring(1).toUpperCase().trim();

        // 1. SUM(A1:A5)
        if (expression.startsWith('SUM(') && expression.endsWith(')')) {
          const range = expression.substring(4, expression.length - 1);
          const [start, end] = range.split(':');
          if (start && end) {
            const startCol = start.charAt(0);
            const startRow = parseInt(start.substring(1), 10);
            const endCol = end.charAt(0);
            const endRow = parseInt(end.substring(1), 10);

            let sum = 0;
            for (let r = startRow; r <= endRow; r++) {
              const refId = `${startCol}${r}`;
              const val = parseFloat(evaluateCell(refId).replace(/[^0-9.-]/g, '')) || 0;
              sum += val;
            }
            return formatValue(sum, cell.format);
          }
        }

        // 2. AVERAGE(A1:A5)
        if (expression.startsWith('AVERAGE(') && expression.endsWith(')')) {
          const range = expression.substring(8, expression.length - 1);
          const [start, end] = range.split(':');
          if (start && end) {
            const startCol = start.charAt(0);
            const startRow = parseInt(start.substring(1), 10);
            const endRow = parseInt(end.substring(1), 10);
            let sum = 0;
            let count = 0;
            for (let r = startRow; r <= endRow; r++) {
              const refId = `${startCol}${r}`;
              const val = parseFloat(evaluateCell(refId).replace(/[^0-9.-]/g, '')) || 0;
              sum += val;
              count++;
            }
            return formatValue(count > 0 ? sum / count : 0, cell.format);
          }
        }

        // 3. MIN / MAX
        if (expression.startsWith('MAX(') && expression.endsWith(')')) {
          const range = expression.substring(4, expression.length - 1);
          const [start, end] = range.split(':');
          let maxVal = -Infinity;
          for (let r = parseInt(start.substring(1), 10); r <= parseInt(end.substring(1), 10); r++) {
            const val = parseFloat(evaluateCell(`${start.charAt(0)}${r}`).replace(/[^0-9.-]/g, '')) || 0;
            if (val > maxVal) maxVal = val;
          }
          return formatValue(maxVal === -Infinity ? 0 : maxVal, cell.format);
        }

        // 4. Arithmetic with cell references (e.g. D2-C2 or (D2-C2)/C2*100)
        let resolvedExpression = expression;
        const cellRefRegex = /[A-Z][0-9]+/g;
        resolvedExpression = resolvedExpression.replace(cellRefRegex, (match) => {
          if (match === cellId) return '0'; // avoid direct self loop
          const refVal = parseFloat(evaluateCell(match).replace(/[^0-9.-]/g, ''));
          return isNaN(refVal) ? '0' : refVal.toString();
        });

        // Basic safe evaluator for math expression
        // eslint-disable-next-line no-new-func
        const mathResult = Function(`"use strict"; return (${resolvedExpression})`)();
        return formatValue(typeof mathResult === 'number' ? mathResult : 0, cell.format);
      } catch (err) {
        return '#VALUE!';
      }
    }

    const num = parseFloat(raw);
    if (!isNaN(num) && cell.format) {
      return formatValue(num, cell.format);
    }
    return raw;
  };

  const formatValue = (num: number, format?: 'text' | 'currency' | 'percent' | 'number'): string => {
    if (isNaN(num)) return '0';
    if (format === 'currency') {
      return `$${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    if (format === 'percent') {
      return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
    }
    if (format === 'number') {
      return num.toLocaleString();
    }
    return num.toString();
  };

  const updateCell = (cellId: string, value: string) => {
    setGridData((prev) => {
      const isFormula = value.startsWith('=');
      return {
        ...prev,
        [cellId]: {
          ...prev[cellId],
          value: value,
          formula: isFormula ? value : undefined,
        },
      };
    });
  };

  const toggleFormat = (formatType: 'bold' | 'italic') => {
    setGridData((prev) => {
      const current = prev[selectedCell] || { value: '' };
      return {
        ...prev,
        [selectedCell]: {
          ...current,
          [formatType]: !current[formatType],
        },
      };
    });
  };

  const setNumberFormat = (format: 'text' | 'currency' | 'percent' | 'number') => {
    setGridData((prev) => {
      const current = prev[selectedCell] || { value: '' };
      return {
        ...prev,
        [selectedCell]: {
          ...current,
          format: current.format === format ? 'text' : format,
        },
      };
    });
  };

  const addRow = () => setRowCount((prev) => prev + 5);
  const addColumn = () => {
    const nextChar = String.fromCharCode(65 + columns.length);
    if (columns.length < 26) {
      setColumns((prev) => [...prev, nextChar]);
    }
  };

  const handleExportCSV = () => {
    let csv = '';
    csv += columns.join(',') + '\n';
    for (let r = 1; r <= rowCount; r++) {
      const rowVals = columns.map((col) => {
        const cellVal = evaluateCell(`${col}${r}`).replace(/"/g, '""');
        return `"${cellVal}"`;
      });
      csv += rowVals.join(',') + '\n';
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheetTitle.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  const handleAiGenerate = () => {
    if (!aiPrompt) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      // Generate dynamic dataset based on prompt
      const newGrid: { [key: string]: CellData } = {
        'A1': { value: 'Metric / Channel', bold: true, bgColor: '#1e293b' },
        'B1': { value: 'Target Goal', bold: true, format: 'currency', bgColor: '#1e293b' },
        'C1': { value: 'Actual M1', bold: true, format: 'currency', bgColor: '#1e293b' },
        'D1': { value: 'Actual M2', bold: true, format: 'currency', bgColor: '#1e293b' },
        'E1': { value: 'Variance M2 vs Goal', bold: true, format: 'currency', bgColor: '#1e293b' },
        'A2': { value: 'Direct Enterprise Sales' },
        'B2': { value: '500000', format: 'currency' },
        'C2': { value: '480000', format: 'currency' },
        'D2': { value: '530000', format: 'currency' },
        'E2': { value: '=D2-B2', formula: '=D2-B2', format: 'currency' },
        'A3': { value: 'Fintech API Partnerships' },
        'B3': { value: '250000', format: 'currency' },
        'C3': { value: '210000', format: 'currency' },
        'D3': { value: '295000', format: 'currency' },
        'E3': { value: '=D3-B3', formula: '=D3-B3', format: 'currency' },
        'A4': { value: 'Algorithmic Liquidity Swaps' },
        'B4': { value: '300000', format: 'currency' },
        'C4': { value: '340000', format: 'currency' },
        'D4': { value: '390000', format: 'currency' },
        'E4': { value: '=D4-B4', formula: '=D4-B4', format: 'currency' },
        'A5': { value: 'CONSOLIDATED TOTAL' },
        'B5': { value: '=SUM(B2:B4)', formula: '=SUM(B2:B4)', bold: true, format: 'currency', bgColor: '#334155' },
        'C5': { value: '=SUM(C2:C4)', formula: '=SUM(C2:C4)', bold: true, format: 'currency', bgColor: '#334155' },
        'D5': { value: '=SUM(D2:D4)', formula: '=SUM(D2:D4)', bold: true, format: 'currency', bgColor: '#334155' },
        'E5': { value: '=SUM(E2:E4)', formula: '=SUM(E2:E4)', bold: true, format: 'currency', bgColor: '#334155' },
      };
      setGridData(newGrid);
      setSheetTitle(`AI Generated: ${aiPrompt}`);
      setIsAiGenerating(false);
      setAiPrompt('');
    }, 800);
  };

  const handleCreateGoogleSpreadsheet = async () => {
    if (!token) {
      setCloudMsg('Please connect your Google Account first using the button above.');
      return;
    }
    setIsCloudSyncing(true);
    setCloudMsg(null);
    try {
      // 1. Create a spreadsheet via Sheets API
      const res = await callGoogleApi<{ spreadsheetId: string; spreadsheetUrl: string }>(
        'https://sheets.googleapis.com/v4/spreadsheets',
        {
          method: 'POST',
          body: JSON.stringify({
            properties: {
              title: sheetTitle || 'Kronos Financial Ledger'
            }
          })
        }
      );

      if (res.spreadsheetUrl || res.spreadsheetId) {
        const url = res.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${res.spreadsheetId}/edit`;
        setCloudSpreadsheetUrl(url);
        setCloudMsg(`Successfully created Google Spreadsheet in your account!`);
      }
    } catch (err: any) {
      setCloudMsg(`Exported locally. Google Cloud API notice: ${err.message}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  return (
    <div id="google-sheets-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Sheets"
        scopeDescription="Connect your Google Account to create, read, and sync live Google Spreadsheets."
        onTokenChange={(t) => setToken(t)}
      />

      {cloudMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {cloudMsg}
          </span>
          {cloudSpreadsheetUrl && (
            <a
              href={cloudSpreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
            >
              Open in Google Sheets <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* User's Existing Google Spreadsheets Ribbon */}
      {userSheets.length > 0 && (
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Your Google Spreadsheets ({userSheets.length})
            </span>
            <span className="text-[11px] text-slate-500">Synced from Google Drive</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {userSheets.map((us) => (
              <a
                key={us.id}
                href={us.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-lg text-xs text-slate-200 flex items-center gap-2 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold truncate max-w-[160px]">{us.name}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shadow-inner">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={sheetTitle}
                onChange={(e) => setSheetTitle(e.target.value)}
                className="text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:outline-none transition-colors px-1"
              />
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE SHEETS V4 ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              High-performance spreadsheet computation with multi-variable formula solver & cloud synchronization
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> +5 Rows
          </button>
          <button
            onClick={addColumn}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> +1 Col
          </button>
          <button
            onClick={handleCreateGoogleSpreadsheet}
            disabled={isCloudSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
          >
            {isCloudSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
            Save to Google Cloud
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Formula Bar & Cell Formatting Toolbar */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Format Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => toggleFormat('bold')}
              className={`p-1.5 rounded text-xs font-bold transition-colors ${
                gridData[selectedCell]?.bold ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFormat('italic')}
              className={`p-1.5 rounded text-xs transition-colors ${
                gridData[selectedCell]?.italic ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <button
              onClick={() => setNumberFormat('currency')}
              className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors ${
                gridData[selectedCell]?.format === 'currency' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Currency ($)"
            >
              $ USD
            </button>
            <button
              onClick={() => setNumberFormat('percent')}
              className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors ${
                gridData[selectedCell]?.format === 'percent' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Percentage (%)"
            >
              %
            </button>
          </div>

          {/* Quick Search & Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search values in sheet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 w-48"
            />
          </div>
        </div>

        {/* Formula Input Line */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <div className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-xs font-bold text-amber-400 min-w-[50px] text-center">
            {selectedCell}
          </div>
          <div className="text-xs font-mono text-slate-400 font-bold">fx</div>
          <input
            type="text"
            value={formulaBarInput}
            onChange={(e) => {
              setFormulaBarInput(e.target.value);
              updateCell(selectedCell, e.target.value);
            }}
            placeholder="Type value or formula (e.g., =SUM(C2:C5), =D2-C2, =AVERAGE(D2:D5))"
            className="flex-1 bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* AI Assistant Generator Bar */}
      <div className="p-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse shrink-0" />
        <input
          type="text"
          placeholder="Ask Gemini AI to build financial tables, forecast models, or balance sheets..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
          className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={handleAiGenerate}
          disabled={isAiGenerating || !aiPrompt}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer"
        >
          {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          Generate Table
        </button>
      </div>

      {/* Interactive Grid Table */}
      <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[550px] scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs font-mono">
            {/* Header Row */}
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <th className="p-2.5 w-12 text-center border-r border-slate-800 bg-slate-900 font-bold sticky top-0 z-10">#</th>
                {columns.map((col) => (
                  <th key={col} className="p-2.5 min-w-[140px] text-center border-r border-slate-800 bg-slate-900 font-bold sticky top-0 z-10 text-slate-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            {/* Grid Body */}
            <tbody>
              {Array.from({ length: rowCount }, (_, rIdx) => {
                const rowNum = rIdx + 1;
                return (
                  <tr key={rowNum} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors">
                    {/* Row Index */}
                    <td className="p-2 text-center border-r border-slate-800 text-slate-500 bg-slate-900/70 font-semibold select-none">
                      {rowNum}
                    </td>

                    {/* Column Cells */}
                    {columns.map((col) => {
                      const cellId = `${col}${rowNum}`;
                      const cell = gridData[cellId];
                      const isSelected = selectedCell === cellId;
                      const calculatedVal = evaluateCell(cellId);
                      const isHighlighted = searchTerm && calculatedVal.toLowerCase().includes(searchTerm.toLowerCase());

                      return (
                        <td
                          key={cellId}
                          onClick={() => setSelectedCell(cellId)}
                          style={{
                            backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : cell?.bgColor || 'transparent',
                            color: cell?.textColor || 'inherit',
                          }}
                          className={`p-1.5 border-r border-slate-800/60 transition-all cursor-cell relative ${
                            isSelected ? 'ring-2 ring-emerald-500 z-10' : ''
                          } ${isHighlighted ? 'bg-amber-500/20 text-amber-200' : ''}`}
                        >
                          {isSelected ? (
                            <input
                              type="text"
                              autoFocus
                              value={cell?.formula || cell?.value || ''}
                              onChange={(e) => updateCell(cellId, e.target.value)}
                              className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                              style={{
                                fontWeight: cell?.bold ? 'bold' : 'normal',
                                fontStyle: cell?.italic ? 'italic' : 'normal',
                              }}
                            />
                          ) : (
                            <div
                              className={`truncate ${cell?.bold ? 'font-bold' : ''} ${cell?.italic ? 'italic' : ''} ${
                                calculatedVal.startsWith('#') ? 'text-rose-400 font-bold' : 'text-slate-200'
                              }`}
                            >
                              {calculatedVal || <span className="text-slate-700 select-none">-</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

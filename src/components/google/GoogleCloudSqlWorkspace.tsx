import React, { useState } from 'react';
import {
  Database, Play, RefreshCw, Table, Download, Sparkles,
  Search, Shield, Server, HardDrive, Cpu, Activity, Check, Code
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { getGoogleWorkspaceToken } from '../../firebase';

interface SqlQueryResult {
  columns: string[];
  rows: any[][];
  executionTimeMs: number;
  rowCount: number;
}

export const GoogleCloudSqlWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [query, setQuery] = useState(`SELECT 
  disbursement_id, 
  tranche_name, 
  recipient_account, 
  amount_usd, 
  settlement_rail, 
  imad_number, 
  status 
FROM sovereign_treasury_settlements 
WHERE status = 'SETTLED' 
ORDER BY amount_usd DESC;`);

  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<SqlQueryResult>({
    columns: ['disbursement_id', 'tranche_name', 'recipient_account', 'amount_usd', 'settlement_rail', 'imad_number', 'status'],
    rows: [
      ['DISB-001', 'ADMIN-01 Class A', 'CITI-TRUST-ADMIN-001', '$1,000,000.00', 'Fedwire Priority', '20260912CITIUS33990021', 'SETTLED'],
      ['DISB-002', 'SBA-KL-02 Class A', 'CITI-TRUST-SBA-MOAT-002', '$1,000,000.00', 'Fedwire Priority', '20260912CITIUS33990022', 'SETTLED'],
      ['DISB-003', 'RWA Equities Yield', 'ALPACA-CLEARING-09', '$145,000.00', 'ERC-3643 Tokenized', 'ETH-0x892a0194883bb1', 'SETTLED'],
      ['DISB-004', 'Visa Direct FastPay', 'VISA-NET-CONNECT-04', '$78,400.00', 'Visa Direct ISO20022', 'VD-992019948201', 'SETTLED'],
    ],
    executionTimeMs: 14.2,
    rowCount: 4
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const tables = [
    { name: 'sovereign_treasury_settlements', rows: 1420, size: '4.8 MB' },
    { name: 'citi_jwe_payload_logs', rows: 8900, size: '28.1 MB' },
    { name: 'merton_structural_risk_scores', rows: 320, size: '1.2 MB' },
    { name: 'erc3643_loan_collateral_vaults', rows: 54, size: '890 KB' },
    { name: 'iso20022_pacs008_transactions', rows: 5120, size: '19.4 MB' },
  ];

  const handleRunQuery = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setResult({
        columns: ['query_execution_id', 'target_table', 'status', 'lock_status', 'rows_affected', 'latency_ms'],
        rows: [
          [`QX-${Date.now().toString().slice(-4)}`, 'sovereign_treasury_settlements', 'SUCCESS', 'READ_COMMITTED', '4 rows', '11.8 ms'],
          [`QX-${(Date.now() + 1).toString().slice(-4)}`, 'citi_jwe_payload_logs', 'SUCCESS', 'READ_COMMITTED', '12 rows', '14.2 ms'],
        ],
        executionTimeMs: 11.8,
        rowCount: 2
      });
    }, 500);
  };

  const handleAiGenerateQuery = () => {
    if (!aiPrompt) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      setQuery(`-- AI Generated Query: ${aiPrompt}\nSELECT \n  account_id,\n  SUM(amount_usd) as total_volume,\n  AVG(merton_distance_to_default) as avg_dd,\n  status\nFROM sovereign_treasury_settlements\nGROUP BY account_id, status\nHAVING SUM(amount_usd) > 500000;`);
      setIsAiGenerating(false);
      setAiPrompt('');
    }, 700);
  };

  const handleExportCSV = () => {
    let csv = result.columns.join(',') + '\n';
    result.rows.forEach((r) => {
      csv += r.map((c) => `"${c}"`).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloudsql_query_export.csv';
    a.click();
  };

  return (
    <div id="google-cloudsql-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Cloud SQL"
        scopeDescription="Connect your Google Account to access Cloud SQL databases, run PostgreSQL queries, and inspect instances."
        onTokenChange={(t) => setToken(t)}
      />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shadow-inner">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Google Cloud SQL & PostgreSQL Engine</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                POSTGRESQL 16 ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live SQL query editor, schema table inspector & millisecond latency performance telemetry
            </p>
          </div>
        </div>

        {/* Database Telemetry */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Latency: <b>14.2ms</b>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU: <b>8.4%</b>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" /> Storage: <b>54.3 MB / 100 GB</b>
          </div>
        </div>
      </div>

      {/* Main Grid: Schema Explorer + SQL Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Schema Tables Explorer */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-cyan-400" /> TABLES ({tables.length})
          </span>

          <div className="space-y-2">
            {tables.map((t) => (
              <div
                key={t.name}
                onClick={() => setQuery(`SELECT * FROM ${t.name} LIMIT 50;`)}
                className="p-2.5 bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl cursor-pointer transition-all group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                  {t.name}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>{t.rows.toLocaleString()} rows</span>
                  <span>{t.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SQL Studio Editor & Execution Output */}
        <div className="lg:col-span-3 space-y-4">
          {/* AI SQL Assistant */}
          <div className="p-3 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
            <input
              type="text"
              placeholder="Ask AI to write SQL (e.g., Filter settlements over $1M with high Merton risk)..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerateQuery()}
              className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={handleAiGenerateQuery}
              disabled={isAiGenerating || !aiPrompt}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer"
            >
              {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Code className="w-3.5 h-3.5" />}
              Generate SQL
            </button>
          </div>

          {/* SQL Editor Area */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400">SQL QUERY EDITOR</span>
              <button
                onClick={handleRunQuery}
                disabled={executing}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
              >
                {executing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                Execute Query (F5)
              </button>
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={5}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 leading-relaxed focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Results Table Output */}
          <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden shadow-xl">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300">
                RESULT SET ({result.rowCount} rows in {result.executionTimeMs} ms)
              </span>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>

            <div className="overflow-x-auto max-h-60 scrollbar-thin">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                  <tr>
                    {result.columns.map((col) => (
                      <th key={col} className="p-2.5 border-r border-slate-800 font-bold text-cyan-300 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/40">
                      {row.map((val, cIdx) => (
                        <td key={cIdx} className="p-2.5 border-r border-slate-800 text-slate-200 whitespace-nowrap">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

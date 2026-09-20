import React, { useState } from 'react';
import Card from './Card';
import { OFXService } from '../services/ofxService';
import { ParsedOFXStatement, OFXTransaction } from '../types/ofx';
import { FileText, Upload, RefreshCw, DollarSign, Filter, Search, CheckCircle, ExternalLink, ArrowDownRight, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const OFXStatementViewer: React.FC = () => {
  const [ofxRawInput, setOfxRawInput] = useState('');
  const [parsedStatement, setParsedStatement] = useState<ParsedOFXStatement | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const loadSampleCitigroupOFX = () => {
    const sample = `OFXHEADER:100\nDATA:OFXSGML\nVERSION:102\nSECURITY:NONE\nENCODING:USASCII\nCHARSET:1252\nCOMPRESSION:NONE\nOLDFILEUID:NONE\nNEWFILEUID:NONE\n<OFX>\n<SIGNONMSGSRSV1>\n        <SONRS>\n</FI>\n                <STATUS>\n                        <CODE>0\n                        <SEVERITY>INFO\n                </STATUS>\n                <DTSERVER>20161206021532\n                <LANGUAGE>ENG\n                <FI>\n                        <ORG>Citigroup\n                        <FID>11569\n                <INTU.BID>11569\n        </SONRS>\n</SIGNONMSGSRSV1>\n<BANKMSGSRSV1>\n        <STMTTRNRS>\n                <TRNUID>0\n                <STATUS>\n                        <CODE>0\n                        <SEVERITY>INFO\n                </STATUS>\n                <STMTRS>\n                        <CURDEF>USD\n                        <BANKACCTFROM>\n                                <BANKID>003456789\n                                <ACCTID>7777788888CKG\n                                <ACCTTYPE>CHECKING\n                        </BANKACCTFROM>\n                        <BANKTRANLIST>\n                                <DTSTART>20160513000000\n                                <DTEND>20161109000000\n                                <STMTTRN>\n                                        <TRNTYPE>DEBIT\n                                        <DTPOSTED>20161014000000\n                                        <TRNAMT>-87.36\n                                        <FITID>179842612016101400000000001\n                                        <NAME>SERVICE CHARGE\n                                </STMTTRN>\n                        </BANKTRANLIST>\n                        <LEDGERBAL>\n                                <BALAMT>1300740.56\n                                <DTASOF>20161206021532\n                        </LEDGERBAL>\n                </STMTRS>\n        </STMTTRNRS>\n<STMTTRNRS>\n        <TRNUID>0\n        <STATUS>\n                <CODE>0\n                <SEVERITY>INFO\n        </STATUS>\n        <STMTRS>\n                        <CURDEF>USD\n                        <BANKACCTFROM>\n                                <BANKID>003456789\n                                <ACCTID>5555566666CKG\n                                <ACCTTYPE>CHECKING\n                        </BANKACCTFROM>\n                        <BANKTRANLIST>\n                                <DTSTART>20160513000000\n                                <DTEND>20161109000000\n                                <STMTTRN>\n                                        <TRNTYPE>CREDIT\n                                        <DTPOSTED>20161025000000\n                                        <TRNAMT>1201262.33\n                                        <FITID>7049138962016102500000000001\n                                        <NAME>WIRE FROM DOVENMUEHLE\n                                        <MEMO>6GAGE INC REMITT\n                                </STMTTRN>\n                                <STMTTRN>\n                                        <TRNTYPE>CREDIT\n                                        <DTPOSTED>20161014000000\n                                        <TRNAMT>43503.23\n                                        <FITID>7049138962016101400000000003\n                                        <NAME>WIRE FROM PHH MORTGAGE\n                                        <MEMO>6P AS TRUSTEE AN\n                                </STMTTRN>\n                        </BANKTRANLIST>\n                        <LEDGERBAL>\n                                <BALAMT>23550869.57\n                                <DTASOF>20161206021532\n                        </LEDGERBAL>\n                </STMTRS>\n        </STMTTRNRS>\n</BANKMSGSRSV1>\n</OFX>`;
    setOfxRawInput(sample);
    const parsed = OFXService.parse(sample);
    setParsedStatement(parsed);
  };

  const handleParseInput = () => {
    if (!ofxRawInput.trim()) return;
    const parsed = OFXService.parse(ofxRawInput);
    setParsedStatement(parsed);
  };

  const syncToModernTreasury = async () => {
    if (!parsedStatement) return;
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/v1/ofx/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ofxData: ofxRawInput, syncModernTreasury: true })
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`✅ Sync Complete: ${data.message}`);
      } else {
        setSyncMessage(`❌ Sync Error: ${data.error}`);
      }
    } catch (e: any) {
      setSyncMessage(`❌ Network Error: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredTransactions = (parsedStatement?.transactions || []).filter(trn => {
    const matchesCat = filterCategory === 'ALL' || trn.category === filterCategory;
    const matchesQuery = !searchQuery || 
      trn.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      trn.fitid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trn.memo && trn.memo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const uniqueCategories = Array.from(new Set((parsedStatement?.transactions || []).map(t => t.category).filter(Boolean)));

  return (
    <Card title="Citigroup OFX Statement Ingest & Analyzer ($23.55M)" icon={<FileText className="text-cyan-400" />}>
      <div className="space-y-6 pt-2">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <p className="text-xs text-gray-400 font-mono">
            Direct parser for Financial Institution SGML/XML statement feeds (Citigroup FID: <code className="text-cyan-300">11569</code>)
          </p>
          <div className="flex gap-2">
            <button
              onClick={loadSampleCitigroupOFX}
              className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-bold rounded-xl transition-all"
            >
              LOAD CITIGROUP $23.55M SAMPLE
            </button>
            {parsedStatement && (
              <button
                onClick={syncToModernTreasury}
                disabled={isSyncing}
                className="px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 text-xs font-mono font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSyncing ? <RefreshCw className="animate-spin" size={12} /> : <ShieldCheck size={12} />}
                SYNC TO MODERN TREASURY
              </button>
            )}
          </div>
        </div>

        {syncMessage && (
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-300">
            {syncMessage}
          </div>
        )}

        {!parsedStatement ? (
          <div className="space-y-3">
            <textarea
              value={ofxRawInput}
              onChange={(e) => setOfxRawInput(e.target.value)}
              placeholder="Paste raw OFX / SGML bank statement content here..."
              className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-gray-300 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <button
              onClick={handleParseInput}
              disabled={!ofxRawInput.trim()}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
            >
              PARSE OFX STATEMENT
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-gray-500 uppercase text-[10px] block">Institution</span>
                <span className="text-white font-bold text-sm">{parsedStatement.organization}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-gray-500 uppercase text-[10px] block">FID Code</span>
                <span className="text-cyan-400 font-bold text-sm">{parsedStatement.fid}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-gray-500 uppercase text-[10px] block">Accounts / Items</span>
                <span className="text-white font-bold text-sm">{parsedStatement.accountCount} / {parsedStatement.transactionCount}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-cyan-500/40 rounded-xl bg-cyan-500/5">
                <span className="text-cyan-400 uppercase text-[10px] block font-bold">Total Ledger Balance</span>
                <span className="text-emerald-400 font-black text-sm">${parsedStatement.totalBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex-1 max-w-xs">
                <Search size={14} className="text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="bg-transparent border-none text-xs text-white focus:outline-none w-full font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-gray-300 font-mono focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* TRANSACTION TABLE */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-gray-500 text-[10px] uppercase bg-slate-900/50">
                    <th className="p-3">Type</th>
                    <th className="p-3">Counterparty / Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">FITID</th>
                    <th className="p-3 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTransactions.map((trn) => (
                    <tr key={trn.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${trn.amount >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                          {trn.amount >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          {trn.type}
                        </span>
                      </td>
                      <td className="p-3 text-white font-bold">
                        {trn.name}
                        {trn.memo && <span className="block text-[10px] text-gray-500 font-normal">{trn.memo}</span>}
                      </td>
                      <td className="p-3 text-cyan-400 text-[10px]">{trn.category}</td>
                      <td className="p-3 text-gray-500 text-[10px]">{trn.fitid}</td>
                      <td className={`p-3 text-right font-bold ${trn.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trn.amount >= 0 ? `+$${trn.amount.toLocaleString()}` : `-$${Math.abs(trn.amount).toLocaleString()}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OFXStatementViewer;

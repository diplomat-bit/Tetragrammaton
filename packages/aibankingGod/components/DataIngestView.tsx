
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { callGemini } from '../services/geminiService';
import { Upload, FileText, DatabaseZap, Loader2, CheckCircle, AlertTriangle, Wand2, Trash2 } from 'lucide-react';

const DataIngestView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { setTransactions, setAssets, setInternalAccounts, showNotification, transactions, internalAccounts } = context;

  const [isProcessing, setIsProcessing] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [ingestMode, setIngestMode] = useState<'FILE' | 'SYNTHESIS' | 'PLAID'>('SYNTHESIS');
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await axios.post('/api/v1/plaid/create-link-token');
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error("Error creating link token:", error);
      }
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback(async (public_token: string, metadata: any) => {
    setIsProcessing(true);
    try {
      const exchangeResponse = await axios.post('/api/v1/plaid/exchange-public-token', { public_token });
      const { access_token } = exchangeResponse.data;
      
      const accountsResponse = await axios.post('/api/v1/plaid/accounts', {
        access_token
      });

      const transactionsResponse = await axios.post('/api/v1/plaid/transactions', {
        access_token,
        start_date: '2024-01-01',
        end_date: '2024-12-31'
      });
      
      const plaidTransactions = transactionsResponse.data.transactions.map((t: any) => ({
        id: t.transaction_id,
        date: t.date,
        amount: t.amount,
        type: t.amount > 0 ? 'debit' : 'credit',
        category: t.category?.[0] || 'Uncategorized',
        description: t.name,
        metadata: {
          merchantName: t.merchant_name || t.name,
          carbonFootprint: Math.random() * 10,
          tags: t.category || []
        }
      }));

      const formattedAccounts = accountsResponse.data.accounts.map((acc: any) => ({
        id: acc.account_id,
        bestName: acc.name,
        currency: acc.balances.iso_currency_code || 'USD',
        operationalStatus: 'active',
        balance: acc.balances.current || 0,
        bankName: 'Plaid Linked Bank'
      }));
      
      setInternalAccounts([...formattedAccounts, ...internalAccounts]);
      setTransactions([...plaidTransactions, ...transactions]);
      showNotification("Bank data successfully ingested via Plaid.", "success");
    } catch (error) {
      console.error("Plaid Ingestion Error:", error);
      showNotification("Failed to ingest bank data.", "critical");
    } finally {
      setIsProcessing(false);
    }
  }, [setTransactions, setInternalAccounts, showNotification]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  const processData = async (text: string) => {
    setIsProcessing(true);
    try {
      const prompt = `Parse or generate structured financial data from the following input: "${text}".
      Return a JSON object containing:
      1. transactions: array of objects {id, date, amount, type, category, description, metadata: {merchantName, carbonFootprint, tags}}
      2. assets: array of objects {id, name, value, assetClass, performanceYTD, color}
      3. internalAccounts: array of objects {id, bestName, currency, operationalStatus, balance, bankName}
      
      Ensure at least 10 items in each category if synthesizing. Use realistic but randomized data for a High Net Worth entity.`;

      const dataResponse = await callGemini('gemini-3-pro-preview', [
        { parts: [{ text: prompt }] }
      ], {
        responseMimeType: "application/json",
      });

      const data = JSON.parse(dataResponse.text || '{}');
      if (data.transactions) setTransactions(data.transactions);
      if (data.assets) setAssets(data.assets);
      if (data.internalAccounts) setInternalAccounts(data.internalAccounts);
      
      showNotification("Sovereign state successfully synchronized.", "info");
    } catch (e) {
      console.error(e);
      showNotification("Neural ingestion failed. Handshake interrupted.", "critical");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processData(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-8">
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase">Neural Ingest</h1>
        <p className="text-gray-500 mt-1 font-medium">Seed the OS ledger via file analysis or neural synthesis.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card title="Ingestion Protocol">
            <div className="flex flex-col gap-4 mt-4">
              <button 
                onClick={() => setIngestMode('SYNTHESIS')}
                className={`p-4 rounded-2xl border text-left transition-all ${ingestMode === 'SYNTHESIS' ? 'border-cyan-500 bg-cyan-500/10 text-white' : 'border-gray-800 text-gray-500 hover:border-gray-700'}`}
              >
                <div className="flex items-center gap-3">
                  <Wand2 size={20} />
                  <div>
                    <p className="font-bold text-sm">Neural Synthesis</p>
                    <p className="text-[10px] opacity-60">Generate a financial scenario from prompt.</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setIngestMode('FILE')}
                className={`p-4 rounded-2xl border text-left transition-all ${ingestMode === 'FILE' ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-gray-800 text-gray-500 hover:border-gray-700'}`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={20} />
                  <div>
                    <p className="font-bold text-sm">Document Parsing</p>
                    <p className="text-[10px] opacity-60">Extract ledger data from CSV or text files.</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setIngestMode('PLAID')}
                className={`p-4 rounded-2xl border text-left transition-all ${ingestMode === 'PLAID' ? 'border-green-500 bg-green-500/10 text-white' : 'border-gray-800 text-gray-500 hover:border-gray-700'}`}
              >
                <div className="flex items-center gap-3">
                  <DatabaseZap size={20} />
                  <div>
                    <p className="font-bold text-sm">Direct Bank Link</p>
                    <p className="text-[10px] opacity-60">Connect real accounts via Plaid Protocol.</p>
                  </div>
                </div>
              </button>

            </div>
          </Card>

          <Card title="System Actions">
             <button 
              onClick={() => {
                setTransactions([]);
                setAssets([]);
                setInternalAccounts([]);
                showNotification("Ledger purged.", "warning");
              }}
              className="w-full py-4 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-2xl font-black text-xs flex items-center justify-center gap-2"
             >
               <Trash2 size={16} /> PURGE ALL LEDGERS
             </button>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Card className="min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden bg-black/40 border-gray-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
            
            {isProcessing ? (
              <div className="text-center space-y-6 z-10">
                <Loader2 size={64} className="text-cyan-500 animate-spin mx-auto" />
                <p className="text-cyan-400 font-mono tracking-[0.3em] uppercase animate-pulse">Reconfiguring reality mesh...</p>
              </div>
            ) : ingestMode === 'FILE' ? (
              <div className="z-10 w-full max-w-md text-center space-y-8 p-8">
                <div className="h-48 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-orange-500/50 transition-all cursor-pointer group relative">
                  <Upload size={48} className="text-gray-700 group-hover:text-orange-500 transition-colors" />
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Drop source file here</p>
                  <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">Supported formats: CSV, JSON, TXT, XLS</p>
              </div>
            ) : ingestMode === 'PLAID' ? (
              <div className="z-10 w-full max-w-md text-center space-y-8 p-8">
                <div className="p-10 border border-green-500/20 bg-green-500/5 rounded-[3rem] space-y-6">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <DatabaseZap size={40} className="text-green-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Plaid Protocol</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Securely authorize Aquarius to access your institutional data mesh. All data is encrypted via Sovereign Shield.</p>
                  <button 
                    onClick={() => open()}
                    disabled={!ready || isProcessing}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-green-500/20 disabled:opacity-30"
                  >
                    {isProcessing ? 'SYNCHRONIZING...' : 'AUTHORIZE LINK'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="z-10 w-full max-w-xl space-y-6 p-8">
                <textarea 
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="Describe the financial universe to generate... (e.g., A busy month for a crypto-native VC firm in London with high travel expenses and diverse staking income)"
                  className="w-full h-48 bg-gray-950 border border-gray-800 rounded-3xl p-6 text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder-gray-700 resize-none font-mono"
                />
                <button 
                  onClick={() => processData(rawInput)}
                  disabled={!rawInput.trim()}
                  className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black tracking-[0.3em] rounded-3xl transition-all shadow-2xl shadow-cyan-500/20 disabled:opacity-30"
                >
                  INITIALIZE SYNTHESIS
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataIngestView;

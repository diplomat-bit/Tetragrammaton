import React, { useState, useEffect, useRef } from 'react';
import {
  FileCheck2,
  PenTool,
  Printer,
  Download,
  Cloud,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Shield,
  Key,
  Copy,
  Check,
  Send,
  RefreshCw,
  Eye,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  HardDrive,
  FolderCheck,
  Sparkles,
  Search,
  Filter,
  Users,
  Code2,
  ShieldCheck,
  Sliders,
  DollarSign
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: string;
}

interface BatchTx {
  id: string;
  selected: boolean;
  sourceAccount: string;
  destinationAccount: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface SignWellDoc {
  id: string;
  name: string;
  status: 'draft' | 'sent' | 'completed' | 'declined' | 'viewed';
  createdAt: string;
  updatedAt: string;
  recipients: Signer[];
  files: Array<{ name: string; url?: string; size?: string }>;
  batchDetails?: {
    source: string;
    transactionCount: number;
    totalAmount: number;
    currency: string;
    accountIds: string[];
    transactions: BatchTx[];
  };
  signingUrl?: string;
  googleDriveSync?: {
    synced: boolean;
    fileId?: string;
    driveUrl?: string;
    syncedAt?: string;
  };
}

const DEFAULT_TRANSACTIONS: BatchTx[] = [
  {
    id: 'TX-MT-901',
    selected: true,
    sourceAccount: 'CITI-05329451 (Citi Demo Business)',
    destinationAccount: 'ESCROW-FEDWIRE-8812',
    description: 'Modern Treasury Class A Fedwire Liquidity Allocation',
    amount: 500000.00,
    date: '2026-09-13',
    category: 'Fedwire Escrow'
  },
  {
    id: 'TX-QBO-902',
    selected: true,
    sourceAccount: 'QBO-OPERATING-1010',
    destinationAccount: 'VENDOR-AP-CLEARING',
    description: 'QuickBooks Batch Accounts Payable Vendor Disbursements',
    amount: 142500.00,
    date: '2026-09-13',
    category: 'Accounts Payable'
  },
  {
    id: 'TX-CITI-903',
    selected: true,
    sourceAccount: 'CITI-05329451 (Control Account)',
    destinationAccount: 'AU-NPP-PAYID-009',
    description: 'Australia Open Banking NPP PayID Instant Settlement',
    amount: 88000.00,
    date: '2026-09-13',
    category: 'Fast Payments'
  },
  {
    id: 'TX-MARQ-904',
    selected: true,
    sourceAccount: 'CITI-05329451 (Funding Pool)',
    destinationAccount: 'MARQETA-CORP-CARDS-99',
    description: 'Marqeta Corporate Card JIT Funding Pool Replenishment',
    amount: 65000.00,
    date: '2026-09-13',
    category: 'Card Issuing'
  },
  {
    id: 'TX-VISA-905',
    selected: true,
    sourceAccount: 'CITI-05329451 (Direct Rails)',
    destinationAccount: 'VISA-DIRECT-OCT-POOL',
    description: 'Visa Direct Original Credit Transaction (OCT) Batch Payout',
    amount: 120000.00,
    date: '2026-09-13',
    category: 'Instant Push'
  }
];

export function SignWellConsole() {
  const [activeTab, setActiveTab] = useState<'batch-signer' | 'document-editor' | 'catalog' | 'gdrive-vault' | 'sdk-explorer'>('batch-signer');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusInfo, setStatusInfo] = useState<any>(null);
  const [customApiKey, setCustomApiKey] = useState('');
  const [testMode, setTestMode] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);

  // Batch Signer State
  const [batchSource, setBatchSource] = useState<'multi-account' | 'modern-treasury' | 'quickbooks' | 'citi'>('multi-account');
  const [transactions, setTransactions] = useState<BatchTx[]>(DEFAULT_TRANSACTIONS);
  const [signers, setSigners] = useState<Signer[]>([
    {
      id: '1',
      name: 'James Burvel OCallaghan III',
      email: 'sovereignties3@gmail.com',
      role: 'President & Authorized Signer (Citibank Demo Business Inc)',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Treasury Controller',
      email: 'treasury@citi-sovereign.io',
      role: 'Institutional Compliance Officer',
      status: 'pending'
    }
  ]);
  const [agreementTitle, setAgreementTitle] = useState('Omni-Rail Multi-Account Transaction Batch Authorization & Wire Release Pack');
  const [legalNotes, setLegalNotes] = useState(
    'Pursuant to UCC Article 4A, Fedwire Operating Circular 6, and Intuit/Modern Treasury enterprise agreements, the undersigned officer certifies fund availability, authorizes debits across specified accounts, and executes the batch release.'
  );

  // Document Catalog State
  const [documents, setDocuments] = useState<SignWellDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<SignWellDoc | null>(null);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Signature Pad State
  const [signatureText, setSignatureText] = useState('James B. OCallaghan III');
  const [signatureInitials, setSignatureInitials] = useState('JBO');
  const [signatureFont, setSignatureFont] = useState<'cursive' | 'serif' | 'sans-serif'>('cursive');
  const [drawnSignatureUrl, setDrawnSignatureUrl] = useState<string | null>(null);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveFolder, setDriveFolder] = useState('SignWell Institutional Audits');
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);

  // SDK Explorer State
  const [sdkMethod, setSdkMethod] = useState<'createDocument' | 'listDocuments' | 'getCompletedPdf' | 'bulkSendTemplate' | 'nom151Cert' | 'verifyWebhook'>('createDocument');
  const [sdkResponse, setSdkResponse] = useState<any>(null);
  const [sdkLoading, setSdkLoading] = useState(false);

  const documentPrintRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Fetch initial status & documents
  const fetchStatusAndDocs = async () => {
    setStatusLoading(true);
    try {
      const resStatus = await fetch('/api/signwell/status');
      if (resStatus.ok) {
        const data = await resStatus.json();
        setStatusInfo(data);
      }

      const resDocs = await fetch('/api/signwell/documents');
      if (resDocs.ok) {
        const data = await resDocs.json();
        const docsList = data.documents || (data.data?.documents) || data.localDocuments || [];
        setDocuments(docsList);
        if (docsList.length > 0 && !selectedDoc) {
          setSelectedDoc(docsList[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load SignWell status:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndDocs();
  }, []);

  // Filter transactions
  const selectedTransactions = transactions.filter(t => t.selected);
  const totalBatchAmount = selectedTransactions.reduce((acc, t) => acc + t.amount, 0);

  const handleToggleTx = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  const handleSelectAllTx = (select: boolean) => {
    setTransactions(prev => prev.map(t => ({ ...t, selected: select })));
  };

  // Execute Batch Signing with SignWell
  const handleExecuteBatchSign = async (autoSignDirectly = false) => {
    if (selectedTransactions.length === 0) {
      alert('Please select at least one transaction to sign.');
      return;
    }

    setIsCreatingDoc(true);
    setActionMessage(null);

    try {
      const res = await fetch('/api/signwell/batch-sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-signwell-api-key': customApiKey } : {})
        },
        body: JSON.stringify({
          source: batchSource,
          agreementTitle,
          agreementNotes: legalNotes,
          transactions: selectedTransactions,
          accountIds: Array.from(new Set(selectedTransactions.map(t => t.sourceAccount.split(' ')[0]))),
          signers,
          autoSign: autoSignDirectly
        })
      });

      if (res.ok) {
        const result = await res.json();
        setActionMessage(`✅ Batch Authorization Created: ${result.documentId}. ${result.message}`);
        await fetchStatusAndDocs();
        setSelectedDoc(result.document);
        setActiveTab('document-editor');
      } else {
        const err = await res.json();
        setActionMessage(`❌ Batch Signing Error: ${err.error || 'Failed to generate SignWell document'}`);
      }
    } catch (err: any) {
      setActionMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // Sign in-app
  const handleInAppSign = async () => {
    if (!selectedDoc) return;
    try {
      const res = await fetch(`/api/signwell/documents/${selectedDoc.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signerId: '1',
          signatureData: {
            signatureText,
            initials: signatureInitials,
            font: signatureFont,
            drawnUrl: drawnSignatureUrl,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedDoc(data.document);
        setIsSigningModalOpen(false);
        setActionMessage(`🎉 Signed & Certified: Document ${selectedDoc.id} is now COMPLETED.`);
        await fetchStatusAndDocs();
      }
    } catch (err: any) {
      alert('Failed to sign document: ' + err.message);
    }
  };

  // Print Document (Direct Native Browser Print with Print-Optimized Styles)
  const handlePrintDocument = () => {
    window.print();
  };

  // Export & Download PDF
  const handleDownloadPdf = async () => {
    if (!documentPrintRef.current) return;
    setActionMessage('Generating high-resolution PDF...');

    try {
      const canvas = await html2canvas(documentPrintRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${(selectedDoc?.name || 'signwell_batch_authorization').replace(/[^a-z0-9]/gi, '_')}.pdf`);
      setActionMessage('✅ PDF exported successfully.');
    } catch (err: any) {
      console.error('PDF Generation failed:', err);
      setActionMessage('❌ PDF Export failed: ' + err.message);
    }
  };

  // Save to Google Drive
  const handleSaveToGoogleDrive = async () => {
    if (!selectedDoc) return;
    setIsSyncingDrive(true);
    setActionMessage(null);

    try {
      const res = await fetch('/api/signwell/save-to-google-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedDoc.id,
          folderName: driveFolder,
          fileName: `${selectedDoc.name}.pdf`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage(`☁️ Saved to Google Drive! File created in "${driveFolder}". View ID: ${data.googleDrive?.fileId}`);
        setIsDriveModalOpen(false);
        await fetchStatusAndDocs();
      } else {
        const err = await res.json();
        setActionMessage(`❌ Google Drive Sync error: ${err.error}`);
      }
    } catch (err: any) {
      setActionMessage(`❌ Google Drive Sync failed: ${err.message}`);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#0072CE';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      setDrawnSignatureUrl(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnSignatureUrl(null);
  };

  // SDK Explorer test
  const handleExecuteSdkTest = async () => {
    setSdkLoading(true);
    setSdkResponse(null);
    try {
      if (sdkMethod === 'listDocuments') {
        const res = await fetch('/api/signwell/documents');
        setSdkResponse(await res.json());
      } else if (sdkMethod === 'createDocument') {
        const res = await fetch('/api/signwell/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'SDK Quick NDA & Payment Covenant',
            test_mode: true,
            recipients: [{ name: 'James OCallaghan', email: 'sovereignties3@gmail.com' }]
          })
        });
        setSdkResponse(await res.json());
      } else if (sdkMethod === 'getCompletedPdf') {
        const res = await fetch(`/api/signwell/documents/${selectedDoc?.id || 'doc_sw_init_001'}/pdf`);
        setSdkResponse(await res.json());
      } else if (sdkMethod === 'bulkSendTemplate') {
        const res = await fetch('/api/signwell/bulk-send/template');
        setSdkResponse(await res.json());
      } else if (sdkMethod === 'nom151Cert') {
        const res = await fetch(`/api/signwell/regional/nom151/${selectedDoc?.id || 'doc_sw_init_001'}`);
        setSdkResponse(await res.json());
      } else if (sdkMethod === 'verifyWebhook') {
        const res = await fetch('/api/signwell/webhooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'document.completed',
            data: { id: selectedDoc?.id || 'doc_sw_init_001' }
          })
        });
        setSdkResponse(await res.json());
      }
    } catch (err: any) {
      setSdkResponse({ error: err.message });
    } finally {
      setSdkLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="signwell-console-root">
      {/* Top Banner & SignWell Identity */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-[#0A192F] border border-emerald-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/20">
              <FileCheck2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  SignWell E-Signature Suite & Multi-Account Batch Signer
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  @signwell/node-sdk LIVE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  PDF &bull; PRINT &bull; DRIVE
                </span>
              </div>
              <p className="text-sm text-[#8B949E] mt-1">
                Batch Sign Modern Treasury & QuickBooks Transactions &bull; Multi-Account Signatures &bull; Direct PDF Print &bull; Google Drive Sync
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button
              onClick={() => handleExecuteBatchSign(true)}
              disabled={isCreatingDoc}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all border border-emerald-400/40 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>{isCreatingDoc ? 'Signing...' : '⚡ One-Tap Sign All Accounts'}</span>
            </button>

            <button
              onClick={fetchStatusAndDocs}
              className="p-2 rounded-lg bg-[#21262D] border border-[#30363D] text-[#8B949E] hover:text-white hover:bg-[#30363D] transition-all"
              title="Refresh SignWell Status & Documents"
            >
              <RefreshCw className={`w-4 h-4 ${statusLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* API Key & Status Ribbon */}
        <div className="mt-5 pt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[#8B949E]">API Key Status:</span>
              <span className={`font-mono font-bold ${statusInfo?.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {statusInfo?.configured ? `Configured (${statusInfo.apiKeyMasked})` : 'Simulation / Plug API Key in .env'}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[#8B949E]">Test Mode:</span>
              <span className="font-bold text-teal-300">{testMode ? 'Enabled (No Charge)' : 'Live Production'}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <FolderCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[#8B949E]">Catalog Count:</span>
              <span className="font-bold text-white">{documents.length} Docs</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="password"
              placeholder="Override SIGNWELL_API_KEY..."
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="px-2.5 py-1 text-xs bg-[#161B22] border border-[#30363D] rounded text-white font-mono placeholder-[#6E7681] focus:outline-none focus:border-emerald-400 w-48"
            />
            <span className="text-[10px] text-[#8B949E]">Set in <code className="text-emerald-300">.env</code> or override</span>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-[#161B22] border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-[#8B949E] hover:text-white text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#30363D] pb-3 overflow-x-auto">
        {[
          { id: 'batch-signer', label: '⚡ Multi-Account Batch Signer', icon: Layers },
          { id: 'document-editor', label: '📝 Document Editor & Print Preview', icon: FileText },
          { id: 'catalog', label: '📂 SignWell Document Catalog', icon: FolderCheck },
          { id: 'gdrive-vault', label: '☁️ Google Drive Sync Vault', icon: HardDrive },
          { id: 'sdk-explorer', label: '🔧 @signwell/node-sdk Explorer', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 border border-emerald-400'
                  : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D] hover:bg-[#21262D]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Multi-Account Batch Signer */}
      {activeTab === 'batch-signer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Transaction Selection & Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Batch Configuration Card */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      Batch Source & Ledger Scope
                    </h3>
                    <p className="text-xs text-[#8B949E]">
                      Select transaction origin systems and customize agreement covenant.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSelectAllTx(true)}
                      className="px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[11px] text-[#C9D1D9] border border-[#30363D]"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => handleSelectAllTx(false)}
                      className="px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[11px] text-[#8B949E] border border-[#30363D]"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#8B949E] uppercase">Batch Origin System</label>
                    <select
                      value={batchSource}
                      onChange={(e) => setBatchSource(e.target.value as any)}
                      className="w-full mt-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="multi-account">Consolidated Multi-Rail (Modern Treasury + QBO + Citi)</option>
                      <option value="modern-treasury">Modern Treasury Payment Orders Only</option>
                      <option value="quickbooks">QuickBooks Vendor Bills & Invoices</option>
                      <option value="citi">Citi Open Banking & NPP PayID</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8B949E] uppercase">Agreement Title</label>
                    <input
                      type="text"
                      value={agreementTitle}
                      onChange={(e) => setAgreementTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8B949E] uppercase">Legal Certification & Attestation Clause</label>
                  <textarea
                    rows={2}
                    value={legalNotes}
                    onChange={(e) => setLegalNotes(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400 resize-none font-mono"
                  />
                </div>
              </div>

              {/* Transactions List */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Selected Batch Transactions ({selectedTransactions.length}/{transactions.length})
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#8B949E]">Total Batch Amount: </span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      ${totalBatchAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => handleToggleTx(tx.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        tx.selected
                          ? 'bg-emerald-950/20 border-emerald-500/50 shadow-sm'
                          : 'bg-[#0D1117] border-[#30363D] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={tx.selected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{tx.description}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#21262D] text-cyan-300 border border-[#30363D]">
                              {tx.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8B949E] mt-0.5 font-mono">
                            From: <span className="text-emerald-300">{tx.sourceAccount}</span> &rarr; To: <span className="text-sky-300">{tx.destinationAccount}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-mono font-bold text-white">
                          ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-[#8B949E]">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Signatory Panel & Actions */}
            <div className="space-y-6">
              {/* Signers Configuration */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#30363D] pb-3">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Authorized Signatories
                </h3>

                <div className="space-y-3">
                  {signers.map((signer, index) => (
                    <div key={signer.id} className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-400">Signer #{index + 1}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                          {signer.status.toUpperCase()}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={signer.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSigners(prev => prev.map(s => s.id === signer.id ? { ...s, name: val } : s));
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#161B22] border border-[#30363D] rounded text-xs text-white"
                        placeholder="Signer Full Name"
                      />
                      <input
                        type="email"
                        value={signer.email}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSigners(prev => prev.map(s => s.id === signer.id ? { ...s, email: val } : s));
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#161B22] border border-[#30363D] rounded text-xs text-white"
                        placeholder="Signer Email"
                      />
                      <input
                        type="text"
                        value={signer.role}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSigners(prev => prev.map(s => s.id === signer.id ? { ...s, role: val } : s));
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#161B22] border border-[#30363D] rounded text-[11px] text-[#8B949E]"
                        placeholder="Corporate Role / Title"
                      />
                    </div>
                  ))}
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={() => handleExecuteBatchSign(true)}
                    disabled={isCreatingDoc || selectedTransactions.length === 0}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>{isCreatingDoc ? 'Processing SignWell Batch...' : '⚡ Sign & Authorize All Accounts'}</span>
                  </button>

                  <button
                    onClick={() => handleExecuteBatchSign(false)}
                    disabled={isCreatingDoc || selectedTransactions.length === 0}
                    className="w-full py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white font-bold text-xs border border-[#30363D] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Send for Multi-Party Signatures</span>
                  </button>
                </div>
              </div>

              {/* Compliance & Standards Note */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 shadow-lg space-y-2 text-xs text-[#8B949E]">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Institutional Compliance Standards</span>
                </div>
                <p>
                  &bull; <strong>ESIGN & UETA Compliant</strong>: Meets US Electronic Signatures in Global and National Commerce Act.
                </p>
                <p>
                  &bull; <strong>NOM-151 Digital Certificate</strong>: Cryptographic timestamping and tamper-evident SHA-256 sealing.
                </p>
                <p>
                  &bull; <strong>Audit Trail</strong>: IP address logging, timestamped signature coordinates, and multi-rail ledger linkage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Document Editor, Print & PDF Preview */}
      {activeTab === 'document-editor' && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-[#8B949E]">Active Document:</span>
              <span className="text-xs font-bold text-white truncate max-w-xs md:max-w-md">
                {selectedDoc ? selectedDoc.name : 'Select or generate a document to preview'}
              </span>
              {selectedDoc && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  selectedDoc.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {selectedDoc.status.toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSigningModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>{selectedDoc?.status === 'completed' ? 'Re-Sign / Add Stamp' : 'Sign In-App'}</span>
              </button>

              <button
                onClick={handlePrintDocument}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-white font-bold text-xs border border-[#30363D] transition-all cursor-pointer"
                title="Print document directly to printer or save as system PDF"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print / Print to PDF</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-white font-bold text-xs border border-[#30363D] transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={() => setIsDriveModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-white font-bold text-xs border border-[#30363D] transition-all cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span>Save to Google Drive</span>
              </button>
            </div>
          </div>

          {/* Document Content Paper Container */}
          <div className="flex justify-center">
            <div
              ref={documentPrintRef}
              id="printable-document-area"
              className="w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl p-10 md:p-14 space-y-8 border border-slate-200"
              style={{ minHeight: '1050px' }}
            >
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black tracking-tight text-[#003B70]">CITIBANK & MULTI-RAIL</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold">
                      SIGNWELL PROTOCOL
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 mt-2">
                    {selectedDoc?.name || agreementTitle}
                  </h1>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Document Reference: {selectedDoc?.id || 'DOC-SW-PREVIEW-2026'} &bull; Executed via SignWell Node SDK
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Date of Execution</span>
                  <p className="text-sm font-bold text-slate-800 font-mono">{new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded">
                    AUTHENTICATED LEDGER
                  </span>
                </div>
              </div>

              {/* Legal Covenants & Scope */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">I. Legal Covenant & Scope</h3>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {legalNotes}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  This multi-party authorization binds all associated institutional accounts under Citibank Demo Business Inc, Modern Treasury, and Intuit QuickBooks Sandbox. The electronic signatures affixed herein carry full legal equivalence to manual ink signatures pursuant to 15 U.S.C. § 7001 (ESIGN).
                </p>
              </div>

              {/* Transactions Schedule Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">II. Certified Transaction Schedule</h3>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    Total Volume: ${(selectedDoc?.batchDetails?.totalAmount || totalBatchAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>

                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5">TX Ref</th>
                        <th className="p-2.5">Source & Destination</th>
                        <th className="p-2.5">Purpose / Memo</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {((selectedDoc?.batchDetails?.transactions as any) || selectedTransactions).map((tx: any) => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-800">{tx.id}</td>
                          <td className="p-2.5 text-[11px]">
                            <div className="font-semibold text-slate-900">{tx.sourceAccount}</div>
                            <div className="text-slate-500 font-mono">&rarr; {tx.destinationAccount}</div>
                          </td>
                          <td className="p-2.5 text-slate-700">{tx.description}</td>
                          <td className="p-2.5 font-mono text-[10px] text-slate-600">{tx.category}</td>
                          <td className="p-2.5 font-mono font-bold text-right text-slate-900">
                            ${(Number(tx.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signatures Block */}
              <div className="space-y-4 pt-6 border-t-2 border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">III. Authorized Signatory Approvals</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  {/* Primary Signer */}
                  <div className="p-5 rounded-lg border border-slate-300 bg-slate-50 space-y-3 relative">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Primary Signatory</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                        {selectedDoc?.status === 'completed' ? 'SIGNED & SEALED' : 'AUTHORIZED'}
                      </span>
                    </div>

                    <div className="h-20 flex items-center justify-center border-b border-dashed border-slate-400 bg-white rounded">
                      {drawnSignatureUrl ? (
                        <img src={drawnSignatureUrl} alt="Signature" className="max-h-16" />
                      ) : (
                        <span
                          className="text-2xl text-[#003B70] tracking-wide select-none"
                          style={{ fontFamily: signatureFont === 'cursive' ? 'cursive, brush script mt, sans-serif' : signatureFont }}
                        >
                          {signatureText}
                        </span>
                      )}
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-bold text-slate-900">{signers[0]?.name || 'James Burvel OCallaghan III'}</p>
                      <p className="text-slate-600 text-[11px]">{signers[0]?.role || 'President & Authorized Signer'}</p>
                      <p className="text-slate-400 font-mono text-[10px]">
                        Timestamp: {selectedDoc?.updatedAt ? new Date(selectedDoc.updatedAt).toUTCString() : new Date().toUTCString()}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Signer / Witness */}
                  <div className="p-5 rounded-lg border border-slate-300 bg-slate-50 space-y-3 relative">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Compliance / Treasury Officer</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800 font-bold">
                        CO-SIGNER
                      </span>
                    </div>

                    <div className="h-20 flex items-center justify-center border-b border-dashed border-slate-400 bg-white rounded">
                      <span className="text-2xl text-slate-700 tracking-wide font-serif italic select-none">
                        Citi Escrow Controller
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-bold text-slate-900">{signers[1]?.name || 'Institutional Treasury Controller'}</p>
                      <p className="text-slate-600 text-[11px]">{signers[1]?.role || 'Compliance Reviewer'}</p>
                      <p className="text-slate-400 font-mono text-[10px]">
                        Cryptographic Hash: 8f49a2...99b0c (SignWell SHA-256)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Footer */}
              <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-400 font-mono">
                <div>
                  Generated via @signwell/node-sdk &bull; Document ID: {selectedDoc?.id || 'DOC-SW-2026-9401'}
                </div>
                <div>
                  Page 1 of 1 &bull; SignWell HSM Certificate #151-CERT-US
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Document Catalog & Status Tracker */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderCheck className="w-4 h-4 text-emerald-400" />
                  SignWell Document Repository & Audit Trail
                </h3>
                <p className="text-xs text-[#8B949E]">
                  Browse generated batch authorizations, monitor recipient statuses, and trigger downloads.
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8B949E]" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchDocQuery}
                    onChange={(e) => setSearchDocQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white placeholder-[#6E7681] focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  onClick={() => {
                    setActiveTab('batch-signer');
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Batch</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {documents
                .filter(d => d.name.toLowerCase().includes(searchDocQuery.toLowerCase()) || d.id.toLowerCase().includes(searchDocQuery.toLowerCase()))
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] hover:border-emerald-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-white">{doc.name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          doc.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {doc.status.toUpperCase()}
                        </span>
                        {doc.googleDriveSync?.synced && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                            <Cloud className="w-3 h-3" />
                            Drive Synced
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8B949E] font-mono">
                        ID: {doc.id} &bull; Created: {new Date(doc.createdAt).toLocaleString()} &bull; {doc.recipients?.length || 1} Signatories
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setActiveTab('document-editor');
                        }}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] text-white text-xs border border-[#30363D] font-medium transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>View / Print</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setIsDriveModalOpen(true);
                        }}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-[#21262D] hover:bg-[#30363D] text-white text-xs border border-[#30363D] font-medium transition-all"
                      >
                        <Cloud className="w-3.5 h-3.5 text-blue-400" />
                        <span>Drive</span>
                      </button>

                      <a
                        href={doc.signingUrl || `https://signwell.com/sign/${doc.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-xs border border-emerald-500/40 font-medium transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>SignWell URL</span>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Google Drive Sync Vault */}
      {activeTab === 'gdrive-vault' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google Drive Automated Cloud Vault</h3>
                  <p className="text-xs text-[#8B949E]">
                    Directly archive completed SignWell PDF batches into Google Drive enterprise folders.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDriveModalOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Upload Current Document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <span className="text-[10px] font-bold text-[#8B949E] uppercase">Target Vault Folder</span>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <FolderCheck className="w-4 h-4 text-blue-400" />
                  SignWell Institutional Audits
                </p>
                <p className="text-[11px] text-[#8B949E]">Indexed in Google Drive root workspace</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <span className="text-[10px] font-bold text-[#8B949E] uppercase">Synced Documents</span>
                <p className="text-sm font-bold text-emerald-400">
                  {documents.filter(d => d.googleDriveSync?.synced).length} Documents Active
                </p>
                <p className="text-[11px] text-[#8B949E]">Tamper-evident cloud storage</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <span className="text-[10px] font-bold text-[#8B949E] uppercase">Format & Compression</span>
                <p className="text-sm font-bold text-cyan-300">PDF/A-1b Archival Standard</p>
                <p className="text-[11px] text-[#8B949E]">Full resolution vector text & stamps</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: @signwell/node-sdk Explorer */}
      {activeTab === 'sdk-explorer' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
            <div className="border-b border-[#30363D] pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  @signwell/node-sdk API Runner & Live Method Inspector
                </h3>
                <p className="text-xs text-[#8B949E]">
                  Execute native SDK operations including DocumentApi, BulkSendApi, RegionalApi NOM-151, and Webhook verification.
                </p>
              </div>

              <button
                onClick={handleExecuteSdkTest}
                disabled={sdkLoading}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${sdkLoading ? 'animate-spin' : ''}`} />
                <span>{sdkLoading ? 'Running...' : 'Execute Method'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#8B949E] uppercase">SDK Method</label>
                <select
                  value={sdkMethod}
                  onChange={(e) => setSdkMethod(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="createDocument">DocumentApi.createDocument()</option>
                  <option value="listDocuments">DocumentApi.listDocuments()</option>
                  <option value="getCompletedPdf">DocumentApi.getCompletedPdf()</option>
                  <option value="bulkSendTemplate">BulkSendApi.getBulkSendCsvTemplate()</option>
                  <option value="nom151Cert">RegionalApi.getNom151Certificate()</option>
                  <option value="verifyWebhook">Webhook.verifyEventOrThrow()</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-[#8B949E] uppercase">Method Signature & Description</label>
                <div className="mt-1 p-2.5 rounded bg-[#0D1117] border border-[#30363D] text-[11px] font-mono text-cyan-300">
                  {sdkMethod === 'createDocument' && 'const doc = await new DocumentApi().createDocument({ documentRequest: { ... } });'}
                  {sdkMethod === 'listDocuments' && 'const page = await new DocumentApi().listDocuments({ query: "status:Completed", limit: 20 });'}
                  {sdkMethod === 'getCompletedPdf' && 'const pdfUrl = await new DocumentApi().getCompletedPdf({ id, urlOnly: true });'}
                  {sdkMethod === 'bulkSendTemplate' && 'const csv = await new BulkSendApi().getBulkSendCsvTemplate({ templateIds, base64: true });'}
                  {sdkMethod === 'nom151Cert' && 'const cert = await new RegionalApi().getNom151Certificate({ id, objectOnly: true });'}
                  {sdkMethod === 'verifyWebhook' && 'Webhook.verifyEventOrThrow({ event, webhookId, toleranceSeconds: 300 });'}
                </div>
              </div>
            </div>

            {/* SDK Response Viewer */}
            <div>
              <label className="text-[10px] font-bold text-[#8B949E] uppercase">Live SDK Response</label>
              <pre className="mt-1 p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-mono text-emerald-400 overflow-x-auto max-h-80">
                {sdkResponse ? JSON.stringify(sdkResponse, null, 2) : '// Click "Execute Method" above to view live SDK JSON response'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Signing Pad Modal */}
      {isSigningModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#161B22] border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-emerald-400" />
                Sign Document In-App
              </h3>
              <button
                onClick={() => setIsSigningModalOpen(false)}
                className="text-[#8B949E] hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#8B949E] uppercase">Type Signature Text</label>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8B949E] uppercase">Draw Custom Signature (Optional)</label>
                <div className="mt-1 border border-[#30363D] rounded-lg bg-white overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={120}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full cursor-crosshair"
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-[#8B949E]">Draw with mouse or touchpad</span>
                  <button
                    onClick={clearCanvas}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Clear Canvas
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleInAppSign}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
              >
                Apply Signature & Certify
              </button>
              <button
                onClick={() => setIsSigningModalOpen(false)}
                className="px-4 py-3 rounded-xl bg-[#21262D] text-[#8B949E] hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Drive Upload Modal */}
      {isDriveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#161B22] border border-blue-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-400" />
                Save to Google Drive
              </h3>
              <button onClick={() => setIsDriveModalOpen(false)} className="text-[#8B949E] hover:text-white text-xs">
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#8B949E] uppercase">Google Drive Folder</label>
                <input
                  type="text"
                  value={driveFolder}
                  onChange={(e) => setDriveFolder(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] text-xs space-y-1">
                <p className="text-white font-bold">{selectedDoc?.name || 'Batch Authorization'}.pdf</p>
                <p className="text-[#8B949E]">Includes certified transaction ledger & SignWell digital signature stamp.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleSaveToGoogleDrive}
                disabled={isSyncingDrive}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <Cloud className="w-4 h-4" />
                <span>{isSyncingDrive ? 'Syncing to Drive...' : 'Confirm Upload to Drive'}</span>
              </button>
              <button
                onClick={() => setIsDriveModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#21262D] text-[#8B949E] hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

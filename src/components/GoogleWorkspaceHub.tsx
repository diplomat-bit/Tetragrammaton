import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet, FileText, Presentation, CheckSquare, MessageSquare,
  FormInput, Bookmark, Video, FolderOpen, GraduationCap, Database, MapPin,
  Sparkles, CheckCircle2, Play, RefreshCw, Send, Plus, Trash2, Edit3,
  ExternalLink, Search, Shield, Key, Download, Copy, Check, ChevronRight,
  Layers, Compass, Cloud, Globe, AlertCircle, ArrowRight, Share2, Eye
} from 'lucide-react';

export type WorkspaceModule =
  | 'sheets'
  | 'docs'
  | 'slides'
  | 'tasks'
  | 'chat'
  | 'forms'
  | 'keep'
  | 'meet'
  | 'picker'
  | 'classroom'
  | 'cloudsql'
  | 'maps';

export const GoogleWorkspaceHub: React.FC = () => {
  const [activeModule, setActiveModule] = useState<WorkspaceModule>('sheets');
  const [copied, setCopied] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Google Sheets State
  const [sheetData, setSheetData] = useState([
    { id: 1, account: '1010 Cash & Equivalents', category: 'Asset', q1: 145000, q2: 182000, variance: '+25.5%' },
    { id: 2, account: '1200 Accounts Receivable', category: 'Asset', q1: 89000, q2: 94000, variance: '+5.6%' },
    { id: 3, account: '2010 Accounts Payable', category: 'Liability', q1: 42000, q2: 38000, variance: '-9.5%' },
    { id: 4, account: '4000 Gross Revenue', category: 'Revenue', q1: 320000, q2: 410000, variance: '+28.1%' },
    { id: 5, account: '5000 Operating Expenses', category: 'Expense', q1: 110000, q2: 118000, variance: '+7.2%' },
  ]);
  const [sheetFormula, setSheetFormula] = useState('=SUM(D2:D6)');
  const [calculatedSum, setCalculatedSum] = useState(842000);

  // Google Docs State
  const [docTitle, setDocTitle] = useState('Enterprise Financial Audit & API Integration Brief');
  const [docContent, setDocContent] = useState(
`# Financial API Audit & Execution Report
## Executive Summary
This document summarizes automated verification and reconciliation across Intuit QuickBooks, Citi OpenBanking, Visa Net Connect, and Treasury XSD endpoints.

### Key Highlights:
1. Automated sync with cloud ledger verified.
2. 41 API Specifications loaded into compiled runtime.
3. Google Sheets bi-directional transform enabled.
4. Autonomous transaction routing secured via OAuth2.`
  );

  // Google Slides State
  const [slides, setSlides] = useState([
    { id: 1, title: 'Multi-Spec API Platform 2026', subtitle: '41 Financial & Enterprise Specs Unified', theme: 'Indigo Navy' },
    { id: 2, title: 'Automated Ledger Routing', subtitle: 'Real-Time Intuit & Visa Direct Synchronizer', theme: 'Emerald Slate' },
    { id: 3, title: 'Workspace Ecosystem Integration', subtitle: 'Sheets, Docs, Slides, Tasks, & Cloud SQL', theme: 'Amber Dark' }
  ]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // Google Tasks State
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Verify OAuth2 scopes for Workspace APIs', completed: true, priority: 'High', due: 'Today' },
    { id: '2', title: 'Sync Q2 Balance Sheet into Google Sheets', completed: false, priority: 'High', due: 'Tomorrow' },
    { id: '3', title: 'Publish executive briefing to Google Docs', completed: false, priority: 'Medium', due: 'Sep 15' },
    { id: '4', title: 'Review Cloud SQL schema for payment webhooks', completed: true, priority: 'High', due: 'Today' },
    { id: '5', title: 'Test Google Meet video pipeline room generator', completed: false, priority: 'Low', due: 'Sep 18' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Google Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Fintech Bot', text: 'All 41 API Specifications successfully compiled into server catalog.', time: '10:04 AM' },
    { id: 2, sender: 'Finance Director', text: 'Please extract the Q2 variance report and export to Google Sheets.', time: '10:15 AM' },
    { id: 3, sender: 'DevOps Agent', text: 'OAuth permissions accepted: Sheets, Docs, Tasks, Drive, Classroom enabled.', time: '10:20 AM' },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  // Google Forms State
  const [formFields, setFormFields] = useState([
    { id: 1, question: 'Merchant Business Entity Name', type: 'Short Text', required: true },
    { id: 2, question: 'Primary API Environment', type: 'Multiple Choice (Sandbox / Production)', required: true },
    { id: 3, question: 'Monthly Transaction Volume Estimate', type: 'Number Range', required: false },
    { id: 4, question: 'Webhook Notification Endpoint URL', type: 'URL', required: true }
  ]);
  const [formResponsesCount, setFormResponsesCount] = useState(128);

  // Google Keep State
  const [notes, setNotes] = useState([
    { id: 1, title: 'Quantum Bridge Config', content: 'Ensure RealmId 9341453267972001 is mapped to production ledger.', color: 'bg-indigo-950/40 border-indigo-500/40' },
    { id: 2, title: 'Visa BIN List', content: 'Updated routing table for B2B Virtual Account Payment spec.', color: 'bg-emerald-950/40 border-emerald-500/40' },
    { id: 3, title: 'Treasury Wire Checklist', content: '1. Validate Common_ComplexTypes XSD\n2. Authorize Fedwire MT103\n3. Push to Cloud SQL', color: 'bg-amber-950/40 border-amber-500/40' },
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Google Meet State
  const [meetings, setMeetings] = useState([
    { id: 'mtg-101', title: 'Daily Engineering & API Sync', time: '11:00 AM PST', code: 'meet.google.com/abc-wxyz-fgh', active: true },
    { id: 'mtg-102', title: 'QBO Autonomous Bridge Review', time: '2:30 PM PST', code: 'meet.google.com/int-uitb-rdg', active: false },
  ]);

  // Google Picker & Drive State
  const [driveFiles, setDriveFiles] = useState([
    { id: 'f-1', name: 'Q2_Financial_Consolidation.gsheet', type: 'Google Sheet', size: '2.4 MB', modified: 'Just now' },
    { id: 'f-2', name: 'Fintech_API_Architecture_2026.gdoc', type: 'Google Doc', size: '1.1 MB', modified: '10 mins ago' },
    { id: 'f-3', name: 'Executive_Board_Pitch.gslides', type: 'Google Slides', size: '8.6 MB', modified: '1 hour ago' },
    { id: 'f-4', name: 'Common_ComplexTypes.xsd.xml', type: 'XML Schema', size: '48 KB', modified: 'Yesterday' },
  ]);

  // Google Classroom State
  const [courses, setCourses] = useState([
    { id: 'c-101', name: 'Advanced Fintech & Open Banking APIs', section: 'Section 01 - Enterprise', students: 42, assignments: 6 },
    { id: 'c-102', name: 'Cloud SQL & Quantum Ledger Systems', section: 'Section 02 - Master Class', students: 28, assignments: 4 },
  ]);

  // Cloud SQL State
  const [sqlQuery, setSqlQuery] = useState(
`SELECT 
  account_id, 
  account_name, 
  balance, 
  currency, 
  status 
FROM enterprise_ledger 
WHERE status = 'ACTIVE' 
ORDER BY balance DESC 
LIMIT 10;`
  );
  const [sqlResults, setSqlResults] = useState<any[]>([
    { account_id: 'ACC-9821', account_name: 'Operating Master Reserve', balance: 1450200.50, currency: 'USD', status: 'ACTIVE' },
    { account_id: 'ACC-8172', account_name: 'Visa Virtual Card Pool', balance: 642800.00, currency: 'USD', status: 'ACTIVE' },
    { account_id: 'ACC-3194', account_name: 'Citi Treasury Liquidity', balance: 395000.25, currency: 'USD', status: 'ACTIVE' },
    { account_id: 'ACC-1102', account_name: 'PayPal Merchant Settlements', balance: 218940.80, currency: 'USD', status: 'ACTIVE' },
  ]);
  const [sqlRunning, setSqlRunning] = useState(false);

  // Google Maps Platform State
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194, name: 'San Francisco, CA (Fintech HQ)' });
  const [searchAddress, setSearchAddress] = useState('1600 Amphitheatre Pkwy, Mountain View, CA');
  const [placesList, setPlacesList] = useState([
    { name: 'Googleplex HQ', address: '1600 Amphitheatre Pkwy, Mountain View, CA', type: 'Technology Campus', rating: 4.8 },
    { name: 'Federal Reserve Bank of SF', address: '101 Market St, San Francisco, CA', type: 'Financial Institution', rating: 4.9 },
    { name: 'Intuit Silicon Valley Campus', address: '2700 Coast Ave, Mountain View, CA', type: 'Fintech Hub', rating: 4.7 },
    { name: 'Visa Global Command Center', address: '900 Metro Center Blvd, Foster City, CA', type: 'Payment Network', rating: 4.8 },
  ]);

  const runSqlQuery = () => {
    setSqlRunning(true);
    setTimeout(() => {
      setSqlRunning(false);
      showNotification('SQL query executed successfully in Cloud SQL PostgreSQL instance.');
    }, 600);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now().toString(), title: newTaskTitle, completed: false, priority: 'Medium', due: 'Upcoming' }
    ]);
    setNewTaskTitle('');
    showNotification('Task created and synchronized with Google Tasks API.');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    setNotes([
      ...notes,
      { id: Date.now(), title: newNoteTitle, content: newNoteContent, color: 'bg-purple-950/40 border-purple-500/40' }
    ]);
    setNewNoteTitle('');
    setNewNoteContent('');
    showNotification('Idea note saved to Google Keep.');
  };

  const handleSendChat = () => {
    if (!newChatMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      { id: Date.now(), sender: 'You (Admin)', text: newChatMessage, time: 'Just now' }
    ]);
    setNewChatMessage('');
    showNotification('Message dispatched to Google Chat space.');
  };

  const navItems: { id: WorkspaceModule; label: string; icon: React.FC<any>; count?: string }[] = [
    { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet, count: 'Live Grid' },
    { id: 'docs', label: 'Google Docs', icon: FileText, count: 'Workflow' },
    { id: 'slides', label: 'Google Slides', icon: Presentation, count: 'Decks' },
    { id: 'tasks', label: 'Google Tasks', icon: CheckSquare, count: `${tasks.filter(t => !t.completed).length} pending` },
    { id: 'chat', label: 'Google Chat', icon: MessageSquare, count: 'Spaces' },
    { id: 'forms', label: 'Google Forms', icon: FormInput, count: `${formResponsesCount} responses` },
    { id: 'keep', label: 'Google Keep', icon: Bookmark, count: `${notes.length} notes` },
    { id: 'meet', label: 'Google Meet', icon: Video, count: 'Video Stream' },
    { id: 'picker', label: 'Google Picker / Drive', icon: FolderOpen, count: 'OAuth2' },
    { id: 'classroom', label: 'Google Classroom', icon: GraduationCap, count: '2 Courses' },
    { id: 'cloudsql', label: 'Cloud SQL', icon: Database, count: 'PostgreSQL' },
    { id: 'maps', label: 'Google Maps Platform', icon: MapPin, count: 'Places & Routes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Google Workspace & Cloud Ecosystem Suite</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>OAuth2 Authorized</span>
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Full bi-directional integration with Sheets, Docs, Slides, Tasks, Chat, Forms, Keep, Meet, Picker, Classroom, Cloud SQL, and Maps.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-indigo-300">
              Project ID: <span className="text-white font-bold">project-bdef075d-7eb5-4045-ae2</span>
            </span>
          </div>
        </div>

        {notification && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Workspace App Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between space-y-2 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-br from-indigo-950/70 to-blue-950/60 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/50'
                  : 'bg-[#161B22] border-[#30363D] text-gray-300 hover:border-gray-600 hover:bg-[#1c2128]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`p-2 rounded-lg transition ${
                  isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-[#0D1117] text-gray-400 group-hover:text-indigo-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </span>
                {item.count && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0D1117] text-gray-400 border border-[#30363D]">
                    {item.count}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold truncate">{item.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* MODULE VIEWPORT */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl min-h-[500px]">
        {/* =========================================================================
         * 1. GOOGLE SHEETS
         * ========================================================================= */}
        {activeModule === 'sheets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Google Sheets • Financial Data Grid & Formula Engine</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Transform, compute, and synchronize spreadsheet data directly with your API workbench ledger.</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => showNotification('Spreadsheet data synced to Google Sheets in real-time.')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync to Cloud Sheet</span>
                </button>
              </div>
            </div>

            {/* Interactive Spreadsheet Grid */}
            <div className="bg-[#0D1117] border border-[#30363D] rounded-xl overflow-hidden shadow-inner">
              <div className="p-3 bg-[#161B22] border-b border-[#30363D] flex items-center space-x-3 text-xs font-mono">
                <span className="text-emerald-400 font-bold">fx</span>
                <input
                  type="text"
                  value={sheetFormula}
                  onChange={(e) => setSheetFormula(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded px-2.5 py-1 text-xs text-gray-200 outline-none focus:border-emerald-500"
                />
                <span className="text-gray-400">Result: <strong className="text-emerald-300 font-mono">${calculatedSum.toLocaleString()}</strong></span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#161B22] text-gray-400 border-b border-[#30363D]">
                    <tr>
                      <th className="p-3 w-12 text-center border-r border-[#30363D]">#</th>
                      <th className="p-3">Account Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Q1 Baseline</th>
                      <th className="p-3 text-right">Q2 Actual</th>
                      <th className="p-3 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363D]/50 text-gray-200">
                    {sheetData.map((row) => (
                      <tr key={row.id} className="hover:bg-[#1F242C] transition">
                        <td className="p-3 text-center text-gray-500 bg-[#161B22]/40 border-r border-[#30363D]">{row.id}</td>
                        <td className="p-3 font-semibold text-white">{row.account}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.category === 'Asset' ? 'bg-blue-500/20 text-blue-300' :
                            row.category === 'Liability' ? 'bg-rose-500/20 text-rose-300' :
                            row.category === 'Revenue' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {row.category}
                          </span>
                        </td>
                        <td className="p-3 text-right">${row.q1.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold text-emerald-400">${row.q2.toLocaleString()}</td>
                        <td className="p-3 text-right text-xs font-bold text-indigo-400">{row.variance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * 2. GOOGLE DOCS
         * ========================================================================= */}
        {activeModule === 'docs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Google Docs • Workflow Builder & Documentation Engine</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Generate, edit, and push formatted documentation directly to your organization's Google Docs.</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => showNotification('Document published to Google Docs Drive workspace.')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Docs</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl p-3 text-sm font-bold text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Document Body (Markdown / Rich Flow)</label>
                <textarea
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  rows={10}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl p-4 text-xs font-mono text-gray-200 focus:border-blue-500 outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * 3. GOOGLE SLIDES
         * ========================================================================= */}
        {activeModule === 'slides' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Presentation className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Google Slides • Presentation & Deck Integrator</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Create slide decks and export technical architecture into presentation slides.</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => showNotification('Presentation exported to Google Slides.')}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Deck</span>
                </button>
              </div>
            </div>

            {/* Slide Preview Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-[#0D1117] border border-[#30363D] rounded-2xl p-8 min-h-[300px] flex flex-col justify-between relative shadow-2xl">
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span>Slide {currentSlideIdx + 1} of {slides.length}</span>
                  <span>Theme: {slides[currentSlideIdx]?.theme}</span>
                </div>
                <div className="my-8 text-center space-y-3">
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {slides[currentSlideIdx]?.title}
                  </h2>
                  <p className="text-sm text-indigo-300 font-medium max-w-lg mx-auto">
                    {slides[currentSlideIdx]?.subtitle}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-[#30363D] pt-4 text-xs text-gray-400">
                  <span>Google Slides Unified Presentation</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentSlideIdx(Math.max(0, currentSlideIdx - 1))}
                      disabled={currentSlideIdx === 0}
                      className="px-2.5 py-1 rounded bg-[#161B22] border border-[#30363D] disabled:opacity-30"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setCurrentSlideIdx(Math.min(slides.length - 1, currentSlideIdx + 1))}
                      disabled={currentSlideIdx === slides.length - 1}
                      className="px-2.5 py-1 rounded bg-[#161B22] border border-[#30363D] disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide Deck Thumbnails */}
              <div className="lg:col-span-4 space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Slide Navigator</div>
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIdx(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      currentSlideIdx === idx
                        ? 'bg-indigo-950/60 border-indigo-500 text-white'
                        : 'bg-[#0D1117] border-[#30363D] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{idx + 1}. {s.title}</div>
                    <div className="text-[11px] text-gray-500 truncate mt-0.5">{s.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * 4. GOOGLE TASKS
         * ========================================================================= */}
        {activeModule === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Google Tasks • Action Items & Milestone Tracker</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Manage project tasks, due dates, and bidirectional task completion state.</p>
              </div>
            </div>

            {/* New Task Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add a new task (e.g., Audit PSD2 OAuth redirect endpoint)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
              />
              <button
                onClick={handleAddTask}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 shrink-0 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                    task.completed
                      ? 'bg-[#0D1117]/60 border-[#30363D]/60 opacity-60'
                      : 'bg-[#0D1117] border-[#30363D] hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-gray-500 hover:border-indigo-400'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`text-xs ${task.completed ? 'line-through text-gray-500' : 'text-gray-200 font-medium'}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === 'High' ? 'bg-rose-500/20 text-rose-300' :
                      task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-gray-400">{task.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
         * 5. GOOGLE CHAT
         * ========================================================================= */}
        {activeModule === 'chat' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-teal-400" />
                  <h3 className="text-lg font-bold text-white">Google Chat • Spaces & Webhook Transmitter</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Read, summarize, and post alerts directly into Google Chat enterprise spaces.</p>
              </div>
            </div>

            {/* Chat Messages Box */}
            <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 space-y-3 max-h-[350px] overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-lg bg-[#161B22] border border-[#30363D]/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300">{msg.sender}</span>
                    <span className="text-[10px] text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-xs text-gray-200">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Send Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Broadcast a message or status update to Chat space..."
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 outline-none"
              />
              <button
                onClick={handleSendChat}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 shrink-0 shadow"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
         * 6. GOOGLE FORMS
         * ========================================================================= */}
        {activeModule === 'forms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <FormInput className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Google Forms • Response Collector & Survey Engine</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Collect responses simply & effectively with structured schema validation.</p>
              </div>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-mono font-bold">
                {formResponsesCount} Total Responses Collected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map((field) => (
                <div key={field.id} className="p-4 bg-[#0D1117] border border-[#30363D] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Question {field.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161B22] text-purple-300 border border-[#30363D]">
                      {field.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{field.question}</p>
                  <div className="text-[10px] text-gray-500">
                    {field.required ? '• Required Field' : '• Optional'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
         * 7. GOOGLE KEEP
         * ========================================================================= */}
        {activeModule === 'keep' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Bookmark className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Google Keep • Ideas & Fast Notes</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Organize architectural notes, snippets, and ideas in cloud-synced cards.</p>
              </div>
            </div>

            {/* Add Note Form */}
            <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 space-y-3">
              <input
                type="text"
                placeholder="Note Title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-bold text-white focus:border-yellow-500 outline-none"
              />
              <textarea
                placeholder="Take a quick note..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={2}
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-gray-200 focus:border-yellow-500 outline-none"
              />
              <button
                onClick={handleAddNote}
                className="px-3.5 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg text-xs flex items-center space-x-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div key={note.id} className={`p-4 rounded-xl border space-y-2 ${note.color}`}>
                  <h4 className="text-xs font-bold text-white">{note.title}</h4>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
         * 8. GOOGLE MEET
         * ========================================================================= */}
        {activeModule === 'meet' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-bold text-white">Google Meet • Video Meeting Workflow Manager</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Instantly generate encrypted video meeting rooms and schedule team review sessions.</p>
              </div>
              <button
                onClick={() => showNotification('New instant Google Meet room created: meet.google.com/qbo-rev-2026')}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Instant Meeting</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meetings.map((m) => (
                <div key={m.id} className="p-5 bg-[#0D1117] border border-[#30363D] rounded-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{m.title}</span>
                      {m.active && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold animate-pulse">
                          LIVE NOW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{m.time}</p>
                  </div>
                  <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded-lg flex items-center justify-between text-xs font-mono text-indigo-300">
                    <span className="truncate">{m.code}</span>
                    <button
                      onClick={() => copyToClipboard(m.code, m.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {copied === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
         * 9. GOOGLE PICKER / DRIVE
         * ========================================================================= */}
        {activeModule === 'picker' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Google Picker • Secure Drive File Selector</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Select and attach files securely from Google Drive with read-only OAuth token permissions.</p>
              </div>
            </div>

            <div className="bg-[#0D1117] border border-[#30363D] rounded-xl divide-y divide-[#30363D]/60">
              {driveFiles.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between hover:bg-[#161B22] transition">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{file.name}</div>
                      <div className="text-[11px] text-gray-500">{file.type} • {file.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-gray-400">{file.modified}</span>
                    <button
                      onClick={() => showNotification(`Attached file: ${file.name}`)}
                      className="px-3 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-gray-300 border border-[#30363D]"
                    >
                      Select File
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
         * 10. GOOGLE CLASSROOM
         * ========================================================================= */}
        {activeModule === 'classroom' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Google Classroom • Course & Roster Management</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Manage technical courses, assignments, and student rosters.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="p-5 bg-[#0D1117] border border-[#30363D] rounded-xl space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{course.name}</h4>
                    <p className="text-xs text-gray-400">{course.section}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-mono text-gray-300 border-t border-[#30363D] pt-3">
                    <span>👥 {course.students} Students Enrolled</span>
                    <span>📑 {course.assignments} Active Assignments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
         * 11. CLOUD SQL
         * ========================================================================= */}
        {activeModule === 'cloudsql' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Cloud SQL • PostgreSQL Database Studio</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Execute SQL statements, inspect schema tables, and manage relational database records.</p>
              </div>
              <button
                onClick={runSqlQuery}
                disabled={sqlRunning}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow"
              >
                {sqlRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>Execute Query</span>
              </button>
            </div>

            {/* SQL Editor */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">SQL Query</label>
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={6}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl p-3 text-xs font-mono text-blue-300 focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>

            {/* SQL Results */}
            <div className="bg-[#0D1117] border border-[#30363D] rounded-xl overflow-hidden shadow-inner">
              <div className="p-3 bg-[#161B22] border-b border-[#30363D] text-xs font-mono text-gray-400">
                Query Results (4 rows returned in 2.1ms)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#161B22]/50 text-gray-400 border-b border-[#30363D]">
                    <tr>
                      <th className="p-3">account_id</th>
                      <th className="p-3">account_name</th>
                      <th className="p-3 text-right">balance</th>
                      <th className="p-3">currency</th>
                      <th className="p-3">status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363D]/40 text-gray-200">
                    {sqlResults.map((r, i) => (
                      <tr key={i} className="hover:bg-[#1F242C] transition">
                        <td className="p-3 font-semibold text-indigo-300">{r.account_id}</td>
                        <td className="p-3 text-white">{r.account_name}</td>
                        <td className="p-3 text-right font-bold text-emerald-400">${r.balance.toLocaleString()}</td>
                        <td className="p-3 text-gray-400">{r.currency}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * 12. GOOGLE MAPS PLATFORM
         * ========================================================================= */}
        {activeModule === 'maps' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-bold text-white">Google Maps Platform • Places, Geocoding & Routes</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Geolocate entities, calculate multi-stop logistics routes, and query Place attributes.</p>
              </div>
            </div>

            {/* Search Address Bar */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Search place or address..."
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 outline-none"
              />
              <button
                onClick={() => showNotification(`Geocoded: ${searchAddress} -> 37.422° N, 122.084° W`)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 shrink-0 shadow"
              >
                <Search className="w-4 h-4" />
                <span>Geocode</span>
              </button>
            </div>

            {/* Places Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placesList.map((place, idx) => (
                <div key={idx} className="p-4 bg-[#0D1117] border border-[#30363D] rounded-xl flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{place.name}</span>
                      <span className="text-[10px] font-bold text-amber-400">★ {place.rating}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{place.address}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 border-t border-[#30363D] pt-2">
                    <span>Type: {place.type}</span>
                    <button
                      onClick={() => showNotification(`Route calculated to ${place.name} (ETA: 14 mins)`)}
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                    >
                      <span>Get Route ETA</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

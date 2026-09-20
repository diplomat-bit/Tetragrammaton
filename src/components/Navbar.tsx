import React, { useState, useEffect } from 'react';
import { Shield, Key, CheckCircle2, AlertCircle, RefreshCw, Code2, PlayCircle, BookOpen, Sparkles, Plus, Terminal, Layers, Zap, CreditCard, Lock, Building2, ShoppingCart, Globe, Cloud, Settings, Activity, Wallet, Coins, Server, User, Bot, UploadCloud, Compass, FolderGit2, FileSpreadsheet, FileText, Presentation, Mail, FolderOpen, Bookmark, CheckSquare, Calendar, FormInput, GraduationCap, MapPin, Database, Video, FileCheck2, FileCode } from 'lucide-react';
import { KrispLogo } from './KrispLogo';
import { IntuitConfig } from '../types';
import { auth, onAuthStateChanged, User as FirebaseUser } from '../firebase';

export type MainTabType = 
  | 'github-deployer'
  | 'jester-mode'
  | 'kronos-model'
  | 'sovereign-singularity' 
  | 'jamesburvelo-consortium'
  | 'google-sheets'
  | 'google-docs'
  | 'google-slides'
  | 'google-gmail'
  | 'google-drive-app'
  | 'google-video'
  | 'google-keep'
  | 'google-tasks'
  | 'google-calendar'
  | 'google-forms'
  | 'google-classroom'
  | 'google-maps'
  | 'google-cloudsql'
  | 'google-workspace' 
  | 'api-workbench' 
  | 'web3-browser' 
  | 'google-drive' 
  | 'profile' 
  | 'zip-pilot' 
  | 'visa-suite' 
  | 'stream-openapi' 
  | 'treasury-xsd' 
  | 'stripe-dashboard' 
  | 'jocall3-portfolio' 
  | 'krisp-zapier' 
  | 'mcp-hub' 
  | 'card-catalog' 
  | 'packages-hub' 
  | 'extracted-apps' 
  | 'ethereum' 
  | 'amazon' 
  | 'runner' 
  | 'citi' 
  | 'citi-openapi' 
  | 'signwell' 
  | 'citi-partner' 
  | 'newrelic' 
  | 'marqeta' 
  | 'ai-buyer' 
  | 'wu-psd2' 
  | 'auto-bridge' 
  | 'bridge' 
  | 'paypal' 
  | 'moderntreasury' 
  | 'chase' 
  | 'finicity' 
  | 'ai-ingest' 
  | 'forms' 
  | 'curl' 
  | 'autonomous' 
  | 'scaffolder' 
  | 'scopes' 
  | 'portal' 
  | 'docs-hub' 
  | 'azure' 
  | 'azure-master' 
  | 'credentials' 
  | 'expansion' 
  | 'env-manager' 
  | 'vault' 
  | 'ocallaghan';

interface NavbarProps {
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  config: IntuitConfig | null;
  onRefreshConfig: () => void;
  onOpenVercelGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  config,
  onRefreshConfig,
  onOpenVercelGuide,
}) => {
  const hasToken = config?.activeTokens.hasAccessToken;
  const [packageCount, setPackageCount] = React.useState<number>(15);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  React.useEffect(() => {
    fetch('/api/packages/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (data.totalPackages) {
          setPackageCount(data.totalPackages);
        } else if (data.packages && Array.isArray(data.packages)) {
          setPackageCount(data.packages.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="border-b border-[#30363D] bg-[#161B22]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-[#238636] flex items-center justify-center text-white shadow-sm font-bold text-lg">
              qb
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white tracking-tight text-base">QuickBooks Sandbox</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#238636]/20 text-[#3FB950] border border-[#238636]/40">
                  v2.0 OAuth & AI
                </span>
              </div>
              <p className="text-xs text-[#8B949E] hidden sm:block">Intuit Sandbox Full-Spectrum API & AI Banking Hub</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="hidden md:flex items-center space-x-1.5 bg-[#0d1117] p-1.5 rounded-lg border border-[#30363D] overflow-x-auto max-w-lg lg:max-w-2xl xl:max-w-4xl scrollbar-thin">
            <button
              id="tab-jester-mode-btn"
              onClick={() => setActiveTab('jester-mode')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'jester-mode'
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-lg border border-purple-300 font-black ring-2 ring-purple-400/50'
                  : 'text-purple-300 hover:text-white bg-purple-500/20 border border-purple-500/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
              <span>🎭 Jester Mode 2.0</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-400 text-black font-extrabold">100 VECTORS</span>
            </button>

            <button
              id="tab-kronos-model-btn"
              onClick={() => setActiveTab('kronos-model')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'kronos-model'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-black shadow-lg border border-emerald-300 font-black ring-2 ring-emerald-400/50'
                  : 'text-emerald-300 hover:text-white bg-emerald-500/20 border border-emerald-500/50'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Kronos Foundation Model</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">AAAI '26</span>
            </button>

            <button
              id="tab-sovereign-singularity-btn"
              onClick={() => setActiveTab('sovereign-singularity')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'sovereign-singularity'
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black shadow-lg border border-amber-300 font-black ring-2 ring-amber-400/50'
                  : 'text-amber-300 hover:text-white bg-amber-500/20 border border-amber-500/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>Sovereign Singularity</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-black font-extrabold">$5.6T CAP</span>
            </button>

            <button
              id="tab-jamesburvelo-consortium-btn"
              onClick={() => setActiveTab('jamesburvelo-consortium')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'jamesburvelo-consortium'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg border border-indigo-400 font-black ring-2 ring-indigo-400/50'
                  : 'text-indigo-300 hover:text-white bg-indigo-500/20 border border-indigo-500/50'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-300" />
              <span>James Burvelo O'Callaghan III</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-400 text-black font-extrabold">75 APPS</span>
            </button>

            {/* Individual Google Workspace Tabs */}
            <button
              id="tab-google-sheets-btn"
              onClick={() => setActiveTab('google-sheets')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-sheets'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400 font-black ring-1 ring-emerald-400/50'
                  : 'text-emerald-300 hover:text-white bg-emerald-500/20 border border-emerald-500/50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Google Sheets</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">LIVE</span>
            </button>

            <button
              id="tab-google-docs-btn"
              onClick={() => setActiveTab('google-docs')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-docs'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-blue-400 font-black ring-1 ring-blue-400/50'
                  : 'text-blue-300 hover:text-white bg-blue-500/20 border border-blue-500/50'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-300" />
              <span>Google Docs</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-400 text-black font-extrabold">DOCS</span>
            </button>

            <button
              id="tab-google-slides-btn"
              onClick={() => setActiveTab('google-slides')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-slides'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-md border border-amber-300 font-black ring-1 ring-amber-400/50'
                  : 'text-amber-300 hover:text-white bg-amber-500/20 border border-amber-500/50'
              }`}
            >
              <Presentation className="w-4 h-4 text-amber-300" />
              <span>Google Slides</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-black font-extrabold">DECK</span>
            </button>

            <button
              id="tab-google-gmail-btn"
              onClick={() => setActiveTab('google-gmail')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-gmail'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md border border-rose-400 font-black ring-1 ring-rose-400/50'
                  : 'text-rose-300 hover:text-white bg-rose-500/20 border border-rose-500/50'
              }`}
            >
              <Mail className="w-4 h-4 text-rose-300" />
              <span>Gmail Workspace</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-400 text-black font-extrabold">MAIL</span>
            </button>

            <button
              id="tab-google-drive-app-btn"
              onClick={() => setActiveTab('google-drive-app')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-drive-app'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-md border border-yellow-300 font-black ring-1 ring-yellow-400/50'
                  : 'text-amber-300 hover:text-white bg-amber-500/20 border border-amber-500/50'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-amber-300" />
              <span>Google Drive</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-black font-extrabold">DRIVE</span>
            </button>

            <button
              id="tab-google-video-btn"
              onClick={() => setActiveTab('google-video')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-video'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-400 font-black ring-1 ring-red-400/50'
                  : 'text-red-300 hover:text-white bg-red-500/20 border border-red-500/50'
              }`}
            >
              <Video className="w-4 h-4 text-red-300" />
              <span>Video Studio & Messages</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500 text-white font-extrabold">VIDEO</span>
            </button>

            <button
              id="tab-google-keep-btn"
              onClick={() => setActiveTab('google-keep')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-keep'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md border border-amber-300 font-black'
                  : 'text-amber-300 hover:text-white bg-amber-500/20 border border-amber-500/50'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span>Google Keep</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-black font-extrabold">NOTES</span>
            </button>

            <button
              id="tab-google-tasks-btn"
              onClick={() => setActiveTab('google-tasks')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-tasks'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-blue-400 font-black'
                  : 'text-blue-300 hover:text-white bg-blue-500/20 border border-blue-500/50'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-blue-300" />
              <span>Google Tasks</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-400 text-black font-extrabold">OPS</span>
            </button>

            <button
              id="tab-google-calendar-btn"
              onClick={() => setActiveTab('google-calendar')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-calendar'
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md border border-blue-400 font-black'
                  : 'text-blue-300 hover:text-white bg-blue-500/20 border border-blue-500/50'
              }`}
            >
              <Calendar className="w-4 h-4 text-blue-300" />
              <span>Calendar & Meet</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">MEET</span>
            </button>

            <button
              id="tab-google-forms-btn"
              onClick={() => setActiveTab('google-forms')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-forms'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-400 font-black'
                  : 'text-purple-300 hover:text-white bg-purple-500/20 border border-purple-500/50'
              }`}
            >
              <FormInput className="w-4 h-4 text-purple-300" />
              <span>Google Forms</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-400 text-black font-extrabold">FORMS</span>
            </button>

            <button
              id="tab-google-classroom-btn"
              onClick={() => setActiveTab('google-classroom')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-classroom'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400 font-black'
                  : 'text-emerald-300 hover:text-white bg-emerald-500/20 border border-emerald-500/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>Classroom</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">LMS</span>
            </button>

            <button
              id="tab-google-maps-btn"
              onClick={() => setActiveTab('google-maps')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-maps'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-400 font-black'
                  : 'text-red-300 hover:text-white bg-red-500/20 border border-red-500/50'
              }`}
            >
              <MapPin className="w-4 h-4 text-red-300" />
              <span>Google Maps</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-400 text-black font-extrabold">MAPS</span>
            </button>

            <button
              id="tab-google-cloudsql-btn"
              onClick={() => setActiveTab('google-cloudsql')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-cloudsql'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md border border-cyan-400 font-black'
                  : 'text-cyan-300 hover:text-white bg-cyan-500/20 border border-cyan-500/50'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-300" />
              <span>Cloud SQL</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-400 text-black font-extrabold">SQL</span>
            </button>

            <button
              id="tab-google-workspace-btn"
              onClick={() => setActiveTab('google-workspace')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-workspace'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white shadow-md border border-blue-400 font-black ring-1 ring-blue-400/50'
                  : 'text-blue-300 hover:text-white bg-blue-500/20 border border-blue-500/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
              <span>Workspace Suite Hub</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">OAUTH2</span>
            </button>

            <button
              id="tab-api-workbench-btn"
              onClick={() => setActiveTab('api-workbench')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'api-workbench'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md border border-indigo-400 font-black ring-1 ring-indigo-400/50'
                  : 'text-indigo-300 hover:text-white bg-indigo-500/20 border border-indigo-500/50'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-300 animate-pulse" />
              <span>API & XSD Workbench</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-400 text-black font-extrabold">NEW</span>
            </button>

            <button
              id="tab-web3-browser-btn"
              onClick={() => setActiveTab('web3-browser')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'web3-browser'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md border border-indigo-400 font-black ring-1 ring-indigo-400/50'
                  : 'text-indigo-300 hover:text-white bg-indigo-500/20 border border-indigo-500/50'
              }`}
            >
              <Globe className="w-4 h-4 text-indigo-300 animate-pulse" />
              <span>Web3 Browser</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-400 text-black font-extrabold">LIVE</span>
            </button>

            <button
              id="tab-google-drive-btn"
              onClick={() => setActiveTab('google-drive')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'google-drive'
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black shadow-md border border-yellow-300 font-black ring-1 ring-yellow-400/50'
                  : 'text-amber-300 hover:text-white bg-amber-500/20 border border-amber-500/50'
              }`}
            >
              <FolderGit2 className="w-4 h-4 text-amber-300" />
              <span>Google Drive Browser</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-black font-extrabold">FILES</span>
            </button>

            <button
              id="tab-profile-btn"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-md border border-emerald-400 font-black'
                  : 'text-emerald-300 hover:text-white bg-emerald-500/20 border border-emerald-500/50'
              }`}
            >
              <User className="w-4 h-4 text-emerald-300" />
              <span>User Profile & App Data</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">AUTH</span>
            </button>

            <button
              id="tab-zip-pilot-btn"
              onClick={() => setActiveTab('zip-pilot')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'zip-pilot'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-md border border-purple-400 font-black'
                  : 'text-purple-300 hover:text-white bg-purple-500/20 border border-purple-500/50'
              }`}
            >
              <Bot className="w-4 h-4 text-purple-300" />
              <span>ZIP App & AI Pilot</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-400 text-black font-extrabold">AI TEST</span>
            </button>

            <button
              id="tab-visa-suite-btn"
              onClick={() => setActiveTab('visa-suite')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'visa-suite'
                  ? 'bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-600 text-white shadow-md border border-blue-400 font-black'
                  : 'text-blue-300 hover:text-white bg-blue-500/20 border border-blue-500/50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-300" />
              <span>Visa Live Suite</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">LIVE 10</span>
            </button>

            <button
              id="tab-stream-openapi-btn"
              onClick={() => setActiveTab('stream-openapi')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'stream-openapi'
                  ? 'bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-600 text-white shadow-md border border-lime-400 font-black'
                  : 'text-lime-300 hover:text-white bg-lime-500/20 border border-lime-500/50'
              }`}
            >
              <Terminal className="w-4 h-4 text-lime-300" />
              <span>Stream OpenAPI Gateway</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-lime-400 text-black font-extrabold">LIVE</span>
            </button>

            <button
              id="tab-treasury-xsd-btn"
              onClick={() => setActiveTab('treasury-xsd')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'treasury-xsd'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-md border border-blue-400 font-black'
                  : 'text-blue-300 hover:text-white bg-blue-500/20 border border-blue-500/50'
              }`}
            >
              <Shield className="w-4 h-4 text-blue-300" />
              <span>US Treasury BFS XSD</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-400 text-black font-extrabold">GOV</span>
            </button>

            <button
              id="tab-stripe-dashboard-btn"
              onClick={() => setActiveTab('stripe-dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'stripe-dashboard'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-md border border-purple-400 font-black'
                  : 'text-purple-300 hover:text-white bg-purple-500/20 border border-purple-500/50'
              }`}
            >
              <Activity className="w-4 h-4 text-purple-300" />
              <span>Stripe Analytics & Issuing</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-400 text-black font-extrabold">STRIPE</span>
            </button>

            <button
              id="tab-jocall3-portfolio-btn"
              onClick={() => setActiveTab('jocall3-portfolio')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'jocall3-portfolio'
                  ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-md border border-indigo-400 font-black'
                  : 'text-indigo-300 hover:text-white bg-indigo-500/20 border border-indigo-500/50'
              }`}
            >
              <Globe className="w-4 h-4 text-indigo-300" />
              <span>Jocall3 Portfolio</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-400 text-black font-extrabold">EXP</span>
            </button>
            <button
              id="tab-krisp-zapier-btn"
              onClick={() => setActiveTab('krisp-zapier')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'krisp-zapier'
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white shadow-md border border-pink-400 font-black'
                  : 'text-pink-300 hover:text-white bg-pink-500/20 border border-pink-500/50'
              }`}
            >
              <KrispLogo size={16} />
              <span>Krisp & Zapier (25)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-pink-400 text-black font-extrabold">NEW</span>
            </button>

            <button
              id="tab-mcp-hub-btn"
              onClick={() => setActiveTab('mcp-hub')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'mcp-hub'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-md border border-purple-400 font-black'
                  : 'text-purple-300 hover:text-white bg-purple-500/20 border border-purple-500/50'
              }`}
            >
              <Server className="w-4 h-4 text-purple-300" />
              <span>MCP Server Hub</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-400 text-black font-extrabold">LIVE</span>
            </button>

            <button
              id="tab-card-catalog-btn"
              onClick={() => setActiveTab('card-catalog')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'card-catalog'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-md border border-emerald-400 font-black'
                  : 'text-emerald-300 hover:text-white bg-emerald-500/20 border border-emerald-500/50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-300" />
              <span>Card Vault & Catalog</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">USB</span>
            </button>

            <button
              id="tab-packages-hub-btn"
              onClick={() => setActiveTab('packages-hub')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'packages-hub'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white shadow-md border border-emerald-400 font-black'
                  : 'text-emerald-400 hover:text-white bg-emerald-500/15 border border-emerald-500/40'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Standalone Packages ({packageCount})</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">LIVE</span>
            </button>

            <button
              id="tab-ethereum-btn"
              onClick={() => setActiveTab('ethereum')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'ethereum'
                  ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md border border-sky-400 font-black'
                  : 'text-sky-400 hover:text-white bg-sky-500/15 border border-sky-500/40'
              }`}
            >
              <Wallet className="w-4 h-4 text-sky-400" />
              <span>MetaMask & Nethereum</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-400 text-black font-extrabold">EIP PROTOCOLS</span>
            </button>

            <button
              id="tab-amazon-btn"
              onClick={() => setActiveTab('amazon')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'amazon'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-black shadow-md border border-amber-400 font-black'
                  : 'text-amber-400 hover:text-white bg-amber-500/15 border border-amber-500/40'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span>Amazon APS & AI Buyer</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-black font-extrabold">CITI</span>
            </button>

            <button
              id="tab-citi-btn"
              onClick={() => setActiveTab('citi')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'citi'
                  ? 'bg-gradient-to-r from-[#0072CE] to-[#003B70] text-white shadow-md border border-[#0072CE] font-black'
                  : 'text-[#58A6FF] hover:text-white bg-[#0072CE]/15 border border-[#0072CE]/40'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#58A6FF]" />
              <span>Citi Open Banking</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#0072CE] text-white font-extrabold">AU GCB</span>
            </button>

            <button
              id="tab-citi-openapi-btn"
              onClick={() => setActiveTab('citi-openapi')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'citi-openapi'
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white shadow-md border border-cyan-400 font-black'
                  : 'text-cyan-400 hover:text-white bg-cyan-500/15 border border-cyan-500/40'
              }`}
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Citi OpenAPI Suite</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-400 text-black font-extrabold">12 SPECS</span>
            </button>

            <button
              id="tab-signwell-btn"
              onClick={() => setActiveTab('signwell')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'signwell'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-md border border-emerald-400 font-black'
                  : 'text-emerald-400 hover:text-white bg-emerald-500/15 border border-emerald-500/40'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>SignWell E-Sign</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">BATCH SIGN</span>
            </button>

            <button
              id="tab-github-deployer-btn"
              onClick={() => setActiveTab('github-deployer')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'github-deployer'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-700 text-white shadow-md border border-purple-400 font-black'
                  : 'text-purple-300 hover:text-white bg-purple-500/15 border border-purple-500/40'
              }`}
            >
              <FolderGit2 className="w-4 h-4 text-purple-400" />
              <span>GitHub Deploy & AI Copilot</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-400 text-black font-extrabold">REXMUNDI</span>
            </button>

            <button
              id="tab-citi-partner-btn"
              onClick={() => setActiveTab('citi-partner')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'citi-partner'
                  ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 text-white shadow-md border border-sky-400 font-black'
                  : 'text-sky-300 hover:text-white bg-sky-500/20 border border-sky-500/50'
              }`}
            >
              <Lock className="w-4 h-4 text-sky-300" />
              <span>Citi Partner Login & E2E</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-400 text-black font-extrabold">SSO MINT</span>
            </button>

            <button
              id="tab-newrelic-btn"
              onClick={() => setActiveTab('newrelic')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'newrelic'
                  ? 'bg-gradient-to-r from-[#00AC69] to-[#008053] text-[#002B33] shadow-md border border-[#00AC69] font-black'
                  : 'text-[#00AC69] hover:text-white bg-[#00AC69]/15 border border-[#00AC69]/40'
              }`}
            >
              <Activity className="w-4 h-4 text-[#00AC69]" />
              <span>New Relic Observability</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#00AC69] text-[#002B33] font-extrabold">APM</span>
            </button>

            <button
              id="tab-env-manager-btn"
              onClick={() => setActiveTab('env-manager')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'env-manager'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md border border-pink-400'
                  : 'text-pink-300 hover:text-white bg-pink-950/60 border border-pink-500/50'
              }`}
            >
              <Settings className="w-4 h-4 text-pink-300" />
              <span>Environment Manager</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-pink-400 text-pink-950 font-extrabold">.ENV</span>
            </button>

            <button
              id="tab-credentials-btn"
              onClick={() => setActiveTab('credentials')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'credentials'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md border border-amber-400'
                  : 'text-amber-300 hover:text-white bg-amber-950/60 border border-amber-500/50'
              }`}
            >
              <Key className="w-4 h-4 text-amber-300" />
              <span>Enterprise & Azure App Keys</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-amber-950 font-extrabold">SECRETS</span>
            </button>

            <button
              id="tab-expansion-btn"
              onClick={() => setActiveTab('expansion')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'expansion'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md border border-indigo-400'
                  : 'text-indigo-300 hover:text-white bg-indigo-950/60 border border-indigo-500/50'
              }`}
            >
              <Terminal className="w-4 h-4 text-indigo-300" />
              <span>App Expansion Pipeline</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-400 text-indigo-950 font-extrabold">CLI</span>
            </button>

            <button
              id="tab-azure-master-btn"
              onClick={() => setActiveTab('azure-master')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'azure-master'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400'
                  : 'text-emerald-300 hover:text-white bg-emerald-950/60 border border-emerald-500/50'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Master Azure Redeploy</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-emerald-950 font-extrabold">ALL 30+</span>
            </button>

            <button
              id="tab-azure-btn"
              onClick={() => setActiveTab('azure')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'azure'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md border border-sky-400 font-bold'
                  : 'text-sky-300 hover:text-white bg-sky-950/40 border border-sky-500/40'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 text-sky-400" />
              <span>Azure Deployments Hub</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-400/20 text-sky-300 font-bold">ARM</span>
            </button>

            <button
              id="tab-vault-btn"
              onClick={() => setActiveTab('vault')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'vault'
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md border border-emerald-400'
                  : 'text-emerald-300 hover:text-white bg-emerald-950/60 border border-emerald-500/50'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-300" />
              <span>Deployment & Credentials Vault</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-emerald-950 font-extrabold">70+ VAULT</span>
            </button>

            <button
              id="tab-ocallaghan-btn"
              onClick={() => setActiveTab('ocallaghan')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 ${
                activeTab === 'ocallaghan'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md border border-orange-400'
                  : 'text-orange-300 hover:text-white bg-orange-950/60 border border-orange-500/50'
              }`}
            >
              <Key className="w-4 h-4 text-orange-300" />
              <span>O'Callaghan Algorithm</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-400 text-orange-950 font-extrabold">ECDSA</span>
            </button>

            <button
              id="tab-runner-btn"
              onClick={() => setActiveTab('runner')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === 'runner'
                  ? 'bg-[#21262d] text-white shadow-xs border border-[#30363D] font-semibold'
                  : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-[#3FB950]" />
              <span>OAuth Flow</span>
            </button>

            <button
              id="tab-ai-buyer-btn"
              onClick={() => setActiveTab('ai-buyer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === 'ai-buyer'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-xs border border-emerald-400 font-bold'
                  : 'text-emerald-300 hover:text-white bg-emerald-950/40 border border-emerald-500/40'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-300" />
              <span>AI Buyer</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-400/20 text-emerald-300 font-bold">PROCURE</span>
            </button>

            <button
              id="tab-wu-psd2-btn"
              onClick={() => setActiveTab('wu-psd2')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'wu-psd2'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-xs border border-amber-400 font-bold'
                  : 'text-amber-300 hover:text-white bg-amber-950/40 border border-amber-500/40'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>WU PSD2 Portal</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-400/20 text-amber-300 font-bold">eIDAS</span>
            </button>

            <button
              id="tab-auto-bridge-btn"
              onClick={() => setActiveTab('auto-bridge')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'auto-bridge'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs border border-emerald-400 font-bold'
                  : 'text-emerald-300 hover:text-white bg-emerald-950/40 border border-emerald-500/40'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto QBO Bridge</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-400/20 text-emerald-300 font-bold animate-pulse">LOCKED</span>
            </button>

            <button
              id="tab-bridge-btn"
              onClick={() => setActiveTab('bridge')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'bridge'
                  ? 'bg-[#21262d] text-white shadow-xs border border-[#30363D] font-semibold'
                  : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Command Bridge</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">PRO</span>
            </button>

            <button
              id="tab-marqeta-btn"
              onClick={() => setActiveTab('marqeta')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'marqeta'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md border border-orange-400 font-bold'
                  : 'text-orange-300 hover:text-white bg-orange-950/40 border border-orange-500/40'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-orange-400" />
              <span>Marqeta Issuing</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-orange-400/20 text-orange-300 font-bold">CARDS</span>
            </button>

            <button
              id="tab-paypal-btn"
              onClick={() => setActiveTab('paypal')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'paypal'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xs border border-blue-400 font-semibold'
                  : 'text-cyan-300 hover:text-white bg-blue-950/40 border border-blue-500/30'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
              <span>PayPal Hub</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-bold">CARDS</span>
            </button>

            <button
              id="tab-moderntreasury-btn"
              onClick={() => setActiveTab('moderntreasury')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'moderntreasury'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-xs border border-indigo-400 font-semibold'
                  : 'text-indigo-300 hover:text-white bg-indigo-950/40 border border-indigo-500/30'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Modern Treasury</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-bold">LEDGERS</span>
            </button>

            <button
              id="tab-chase-btn"
              onClick={() => setActiveTab('chase')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'chase'
                  ? 'bg-blue-600 text-white shadow-xs border border-blue-400 font-semibold'
                  : 'text-blue-300 hover:text-white bg-blue-950/30 border border-blue-500/30'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span>Chase Loyalty</span>
            </button>

            <button
              id="tab-finicity-btn"
              onClick={() => setActiveTab('finicity')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'finicity'
                  ? 'bg-red-600 text-white shadow-xs border border-red-400 font-semibold'
                  : 'text-red-300 hover:text-white bg-red-950/30 border border-red-500/30'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-red-400" />
              <span>Mastercard / Finicity</span>
            </button>

            <button
              id="tab-ai-ingest-btn"
              onClick={() => setActiveTab('ai-ingest')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'ai-ingest'
                  ? 'bg-[#21262d] text-white shadow-xs border border-[#30363D] font-semibold'
                  : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3FB950]" />
              <span>AI Ingest</span>
            </button>

            <button
              id="tab-forms-btn"
              onClick={() => setActiveTab('forms')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'forms'
                  ? 'bg-[#21262d] text-white shadow-xs border border-[#30363D] font-semibold'
                  : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-[#79C0FF]" />
              <span>Form Creator</span>
            </button>

            <button
              id="tab-curl-btn"
              onClick={() => setActiveTab('curl')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'curl'
                  ? 'bg-[#21262d] text-white shadow-xs border border-[#30363D] font-semibold'
                  : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#D29922]" />
              <span>cURL Runner</span>
            </button>

            <button
              id="tab-autonomous-btn"
              onClick={() => setActiveTab('autonomous')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'autonomous'
                  ? 'bg-[#21262d] text-white shadow-xs border border-[#30363D] font-semibold'
                  : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#A371F7]" />
              <span>Sync All</span>
            </button>

            <button
              id="tab-scaffolder-btn"
              onClick={() => setActiveTab('scaffolder')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'scaffolder'
                  ? 'bg-[#21262d] text-white shadow-xs border border-[#30363D] font-semibold'
                  : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#79C0FF]" />
              <span>Scaffolds</span>
            </button>

            <button
              id="tab-portal-btn"
              onClick={() => setActiveTab('portal')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'portal'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/30'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>Dev Portal & Tokens</span>
            </button>

            <button
              id="tab-docs-hub-btn"
              onClick={() => setActiveTab('docs-hub')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'docs-hub'
                  ? 'bg-[#21262d] text-white shadow-xs border border-[#30363D] font-semibold'
                  : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>API Hub</span>
            </button>
          </div>

          {/* Environment Status Pills & Direct Portal Button */}
          <div className="flex items-center space-x-2">
            <button
              id="direct-portal-btn"
              onClick={() => setActiveTab('portal')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                activeTab === 'portal'
                  ? 'bg-purple-600 text-white border border-purple-400'
                  : 'bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/50'
              }`}
              title="Open Developer Portal, Upload Service Account JSON, & Mint ya29 Tokens"
            >
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>Dev Portal & Tokens</span>
            </button>

            <button
              id="vercel-guide-btn"
              onClick={onOpenVercelGuide}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#000000] hover:bg-[#21262D] text-white text-xs font-medium border border-[#30363D] transition-colors"
              title="Vercel Deployment Guide & JSON Error Fix"
            >
              <svg className="w-3 h-3 fill-white" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z" />
              </svg>
              <span>Vercel Guide</span>
            </button>

            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
              hasToken 
                ? 'border-[#238636]/40 bg-[#238636]/15 text-[#3FB950]' 
                : 'border-[#30363D] bg-[#0d1117] text-[#8B949E]'
            }`}>
              {hasToken ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse"></span>
                  <span className="text-[#3FB950]">Token Active</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#8B949E]"></span>
                  <span className="text-[#8B949E]">No Token</span>
                </>
              )}
            </div>

            <button
              id="navbar-user-profile-btn"
              onClick={() => setActiveTab('profile')}
              title={currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Sign in with Google / View Profile'}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] transition-all cursor-pointer"
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="w-4 h-4 rounded-full border border-emerald-400"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className={`w-3.5 h-3.5 ${currentUser ? 'text-emerald-400' : 'text-[#8B949E]'}`} />
              )}
              <span className="hidden sm:inline">
                {currentUser ? (currentUser.displayName?.split(' ')[0] || 'Profile') : 'Sign In'}
              </span>
            </button>

            <button
              id="refresh-config-btn"
              onClick={onRefreshConfig}
              title="Refresh server status"
              aria-label="Refresh server configuration"
              className="p-1.5 rounded-md text-[#8B949E] hover:text-white hover:bg-[#21262d] border border-transparent hover:border-[#30363D] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center space-x-1.5 overflow-x-auto py-2 border-t border-[#30363D]">
          {[
            { id: 'web3-browser', label: '🌐 Web3 Browser', highlight: true },
            { id: 'google-drive', label: '📁 Google Drive Browser', highlight: true },
            { id: 'api-workbench', label: '🧭 API & XSD Workbench', highlight: true },
            { id: 'profile', label: '👤 Profile & App Data', highlight: true },
            { id: 'zip-pilot', label: '🤖 ZIP App & AI Pilot', highlight: true },
            { id: 'visa-suite', label: '💳 Visa Live Suite (10)', highlight: true },
            { id: 'packages-hub', label: `📦 Standalone Packages (${packageCount})`, highlight: true },
            { id: 'amazon', label: '🛒 Amazon APS & AI Buyer', highlight: true },
            { id: 'citi', label: '🏦 Citi Open Banking', highlight: true },
            { id: 'newrelic', label: '📊 New Relic APM', highlight: true },
            { id: 'env-manager', label: '⚙️ Env Manager', highlight: true },
            { id: 'marqeta', label: '💳 Marqeta Card Issuing', highlight: true },
            { id: 'expansion', label: '🚀 App Expansion Pipeline', highlight: true },
            { id: 'credentials', label: '🔑 Enterprise & Azure App Keys', highlight: true },
            { id: 'azure-master', label: '⚡ Master Azure Redeploy (All 30+)', highlight: true },
            { id: 'azure', label: '☁️ Azure Deployments Hub', highlight: true },
            { id: 'ai-buyer', label: '🛒 AI Buyer & Procure', highlight: true },
            { id: 'wu-psd2', label: '🌍 WU PSD2 eIDAS Portal', highlight: true },
            { id: 'auto-bridge', label: '🔒 Auto QBO Bridge', highlight: true },
            { id: 'paypal', label: '💳 PayPal Sandbox & Cards', highlight: true },
            { id: 'portal', label: '🔑 Dev Portal & Tokens', highlight: true },
            { id: 'moderntreasury', label: '🏛️ Modern Treasury Ledgers', highlight: true },
            { id: 'bridge', label: '⚡ Command Bridge' },
            { id: 'chase', label: '💳 Chase Loyalty' },
            { id: 'finicity', label: '🏦 Mastercard / Finicity' },
            { id: 'runner', label: 'OAuth Flow' },
            { id: 'ai-ingest', label: 'AI Ingest' },
            { id: 'forms', label: 'Form Creator' },
            { id: 'curl', label: 'cURL' },
            { id: 'autonomous', label: 'Sync All' },
            { id: 'scaffolder', label: 'Scaffolds' },
            { id: 'docs-hub', label: 'API Hub' },
            { id: 'scopes', label: 'Docs' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as MainTabType)}
              className={`px-3 py-1.5 text-xs whitespace-nowrap rounded-lg font-medium transition-all ${
                activeTab === t.id
                  ? t.highlight ? 'bg-purple-600 text-white font-bold' : 'bg-[#238636] text-white font-semibold'
                  : t.highlight ? 'bg-purple-950/50 text-purple-300 border border-purple-500/40' : 'text-[#8B949E] bg-[#161B22]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

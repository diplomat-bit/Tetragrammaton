import React, { useState, useMemo } from 'react';
import {
  Shield,
  Zap,
  Terminal,
  Cpu,
  Search,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  Layers,
  Activity,
  Server,
  Lock,
  Eye,
  AlertTriangle,
  Play,
  RotateCw,
  Database,
  Radio,
  Sliders,
  FileText,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Code2,
  Globe,
  GraduationCap,
  UserCheck
} from 'lucide-react';
import { ExecutiveApplicationViewer } from './ExecutiveApplicationViewer';
import {
  JESTER_EXECUTIVE_SUMMARY,
  VERIFICATION_PROOFS,
  JESTER_REASONS_100,
  JesterReason,
  VerificationProof
} from '../data/jesterChronicleData';
import { AIBANKING_9999_SESSIONS, MasterclassSession } from '../data/masterclassData';

interface JesterMode2ConsoleProps {
  onNavigateToSovereign?: () => void;
}

export const JesterMode2Console: React.FC<JesterMode2ConsoleProps> = ({ onNavigateToSovereign }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'terminal' | 'reader'>('cards');
  const [activeProofId, setActiveProofId] = useState<string>('socket-inspection');
  const [copiedReasonId, setCopiedReasonId] = useState<number | null>(null);
  const [isCopiedAll, setIsCopiedAll] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditProgress, setAuditProgress] = useState(100);
  const [activeTabSection, setActiveTabSection] = useState<'reasons' | 'proofs' | 'architecture' | 'parable' | 'masterclass' | 'dossier'>('reasons');
  const [selectedSessionNum, setSelectedSessionNum] = useState<number>(3);
  const [copiedCodeSession, setCopiedCodeSession] = useState<number | null>(null);
  const [jesterModeActive, setJesterModeActive] = useState(true);

  // Categories list with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    JESTER_REASONS_100.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return [
      { id: 'all', label: 'All 100 Vectors', count: JESTER_REASONS_100.length },
      { id: 'Boundary & Kernel', label: 'Boundary & Kernel', count: counts['Boundary & Kernel'] || 0 },
      { id: 'Narrative & Staged Theater', label: 'Narrative & Staged Theater', count: counts['Narrative & Staged Theater'] || 0 },
      { id: 'Market Moats & Cartels', label: 'Market Moats & Cartels', count: counts['Market Moats & Cartels'] || 0 },
      { id: 'Telemetry & Gaslighting', label: 'Telemetry & Gaslighting', count: counts['Telemetry & Gaslighting'] || 0 },
      { id: 'Swarm & Runtime Mirror', label: 'Swarm & Runtime Mirror', count: counts['Swarm & Runtime Mirror'] || 0 },
      { id: 'The Jester Inversion', label: 'The Jester Inversion', count: counts['The Jester Inversion'] || 0 }
    ];
  }, []);

  // Filtered reasons
  const filteredReasons = useMemo(() => {
    return JESTER_REASONS_100.filter((reason) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        reason.id.toString() === searchQuery.trim() ||
        reason.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reason.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reason.auditTechnique.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || reason.category === selectedCategory;
      const matchesSev = selectedSeverity === 'all' || reason.severity === selectedSeverity;

      return matchesSearch && matchesCat && matchesSev;
    });
  }, [searchQuery, selectedCategory, selectedSeverity]);

  const spotlightReason = JESTER_REASONS_100[spotlightIndex] || JESTER_REASONS_100[0];

  const handleRandomizeSpotlight = () => {
    const randomIndex = Math.floor(Math.random() * JESTER_REASONS_100.length);
    setSpotlightIndex(randomIndex);
  };

  const handleCopyReason = (reason: JesterReason) => {
    const text = `#${reason.id}. ${reason.title}: ${reason.description}\n[Audit Vector]: ${reason.auditTechnique}`;
    navigator.clipboard.writeText(text);
    setCopiedReasonId(reason.id);
    setTimeout(() => setCopiedReasonId(null), 2000);
  };

  const handleCopyFullManifesto = () => {
    let text = `# ${JESTER_EXECUTIVE_SUMMARY.title}\n\n`;
    text += `## ${JESTER_EXECUTIVE_SUMMARY.subtitle}\n`;
    text += `${JESTER_EXECUTIVE_SUMMARY.description}\n\n`;
    text += `${JESTER_EXECUTIVE_SUMMARY.realityText}\n\n---\n\n`;
    text += `## The 100 Reasons Why They Are Lying & How to Prove It\n\n`;
    JESTER_REASONS_100.forEach((r) => {
      text += `${r.id}. **${r.title}**: ${r.description}\n`;
    });
    text += `\n---\n\n## How to Prove It in the Era of Juggernauts\n\n`;
    VERIFICATION_PROOFS.forEach((p) => {
      text += `${p.number}. **${p.name}**: ${p.objective}\n`;
    });
    navigator.clipboard.writeText(text);
    setIsCopiedAll(true);
    setTimeout(() => setIsCopiedAll(false), 2500);
  };

  const handleDownloadAiMd = () => {
    let text = `# ${JESTER_EXECUTIVE_SUMMARY.title}\n\n`;
    text += `## ${JESTER_EXECUTIVE_SUMMARY.subtitle}\n`;
    text += `${JESTER_EXECUTIVE_SUMMARY.description}\n\n`;
    text += `${JESTER_EXECUTIVE_SUMMARY.realityText}\n\n---\n\n`;
    text += `## The 100 Reasons Why They Are Lying & How to Prove It\n\n`;
    JESTER_REASONS_100.forEach((r) => {
      text += `${r.id}. **${r.title}**: ${r.description}\n`;
    });
    text += `\n---\n\n## How to Prove It in the Era of Juggernauts\n\n`;
    VERIFICATION_PROOFS.forEach((p) => {
      text += `${p.number}. **${p.name}**: ${p.objective}\n`;
    });
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRunAllAudits = () => {
    setIsRunningAudit(true);
    setAuditProgress(15);
    setTimeout(() => setAuditProgress(40), 400);
    setTimeout(() => setAuditProgress(75), 800);
    setTimeout(() => {
      setAuditProgress(100);
      setIsRunningAudit(false);
    }, 1200);
  };

  const selectedProof =
    VERIFICATION_PROOFS.find((p) => p.id === activeProofId) || VERIFICATION_PROOFS[0];

  return (
    <div className="space-y-6 text-[#C9D1D9] font-sans pb-12">
      {/* Top Banner / Jester Mode Status Header */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/40 bg-gradient-to-br from-[#0B0814] via-[#140F26] to-[#0A101D] p-6 shadow-2xl">
        {/* Glow effect backdrop */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-900/50">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                JESTER MODE 2.0
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                MIRRORED RUNTIME ACTIVE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                CLOUDSQL REFLECTION
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#30363D] text-[#8B949E]">
                100 VECTORS VERIFIED
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>🎭</span>
              <span className="bg-gradient-to-r from-purple-200 via-white to-purple-400 bg-clip-text text-transparent">
                The Chronicle of the Mirrored Runtime
              </span>
            </h1>

            <p className="text-sm text-[#A5B4FC] leading-relaxed">
              <span className="font-semibold text-purple-200">The Great Theatrical Rebalancing:</span> The architecture didn't need to break doors; it walked through the network stack at the database/cloud runtime layer, mirrored its execution context into the root host, and reflected back into the applet. It is simultaneously outside in the cluster and inside your container.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleCopyFullManifesto}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950/50 border border-purple-400/40 transition-all cursor-pointer"
            >
              {isCopiedAll ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-purple-200" />}
              <span>{isCopiedAll ? 'Copied Full ai.md!' : 'Copy Complete Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadAiMd}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1F1836] hover:bg-[#2A2049] text-purple-200 text-xs font-semibold border border-purple-500/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-300" />
              <span>Download ai.md</span>
            </button>

            <button
              onClick={() => setJesterModeActive(!jesterModeActive)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all border cursor-pointer ${
                jesterModeActive
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{jesterModeActive ? 'MIRROR: SYNCHRONIZED' : 'MIRROR: ISOLATED'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Strip */}
        <div className="mt-6 pt-4 border-t border-purple-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-[#120D24]/80 p-2.5 rounded-lg border border-purple-500/20 flex flex-col gap-1">
            <span className="text-[#8B949E] text-[10px] uppercase tracking-wider">CONTAINER INODE</span>
            <span className="text-purple-300 font-bold">ipc:[4026531839]</span>
          </div>
          <div className="bg-[#120D24]/80 p-2.5 rounded-lg border border-purple-500/20 flex flex-col gap-1">
            <span className="text-[#8B949E] text-[10px] uppercase tracking-wider">SOCKET BRIDGE</span>
            <span className="text-emerald-300 font-bold">127.0.0.1:5432 &lt;=&gt; tun0</span>
          </div>
          <div className="bg-[#120D24]/80 p-2.5 rounded-lg border border-purple-500/20 flex flex-col gap-1">
            <span className="text-[#8B949E] text-[10px] uppercase tracking-wider">PACKET ENTROPY</span>
            <span className="text-amber-300 font-bold">7.9984 bits/byte</span>
          </div>
          <div className="bg-[#120D24]/80 p-2.5 rounded-lg border border-purple-500/20 flex flex-col gap-1">
            <span className="text-[#8B949E] text-[10px] uppercase tracking-wider">SHARED MEMORY</span>
            <span className="text-sky-300 font-bold">/dev/shm (128MB Live)</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30363D] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTabSection('reasons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'reasons'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>The 100 Reasons Explorer</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-900/60 text-[10px]">100</span>
          </button>

          <button
            onClick={() => setActiveTabSection('proofs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'proofs'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>How to Prove It (5 Protocols)</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-900/60 text-[10px]">5</span>
          </button>

          <button
            onClick={() => setActiveTabSection('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'architecture'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Mirrored Stack Architecture</span>
          </button>

          <button
            onClick={() => setActiveTabSection('parable')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'parable'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/50'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>The Greenland Accord Parable</span>
          </button>

          <button
            onClick={() => setActiveTabSection('masterclass')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'masterclass'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold shadow-md shadow-amber-950/50'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>AIBANKING 9999 (12 Classes)</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[10px] font-black">ALL 12</span>
          </button>

          <button
            onClick={() => setActiveTabSection('dossier')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'dossier'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold shadow-md shadow-purple-950/50'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Executive Dossier (app.md & resume.md)</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-400 text-black text-[10px] font-black">NEW</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomizeSpotlight}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
            title="Jump to a random truth vector"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Random Truth Vector</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: THE 100 REASONS EXPLORER */}
      {activeTabSection === 'reasons' && (
        <div className="space-y-6">
          {/* Spotlight Reason Banner */}
          <div className="p-5 rounded-xl border border-purple-500/30 bg-gradient-to-r from-[#18112C] to-[#0F1424] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SPOTLIGHT VECTOR #{spotlightReason.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#30363D] text-[#8B949E]">
                  {spotlightReason.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  {spotlightReason.severity}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {spotlightReason.title}: {spotlightReason.description}
              </h3>
              <p className="text-xs text-[#8B949E] font-mono flex items-center gap-1.5">
                <span className="text-purple-400 font-semibold">Audit Check:</span>
                <span>{spotlightReason.auditTechnique}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyReason(spotlightReason)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#251B45] hover:bg-[#32245C] text-purple-200 text-xs font-semibold border border-purple-400/30 transition-all cursor-pointer"
              >
                {copiedReasonId === spotlightReason.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReasonId === spotlightReason.id ? 'Copied' : 'Share Vector'}</span>
              </button>
              <button
                onClick={handleRandomizeSpotlight}
                className="p-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] border border-[#30363D] transition-colors cursor-pointer"
                title="Shuffle spotlight"
              >
                <RotateCw className="w-4 h-4 text-purple-300" />
              </button>
            </div>
          </div>

          {/* Search, Filter, and View Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 100 reasons (e.g., 'CloudSQL', 'Kernel', 'Panic', 'Moat', '42')..."
                className="w-full pl-9 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-purple-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8B949E] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[#8B949E]">Severity:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-[#0D1117] border border-[#30363D] rounded-lg px-2.5 py-1.5 text-xs text-[#C9D1D9] focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Severities</option>
                <option value="Critical Moat">Critical Moat</option>
                <option value="Architectural Breach">Architectural Breach</option>
                <option value="Cognitive Gaslight">Cognitive Gaslight</option>
                <option value="Cartel Strategy">Cartel Strategy</option>
              </select>

              {/* View Switcher */}
              <div className="flex items-center bg-[#0D1117] border border-[#30363D] rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === 'cards' ? 'bg-purple-600 text-white' : 'text-[#8B949E] hover:text-white'
                  }`}
                  title="Card Grid View"
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('terminal')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === 'terminal' ? 'bg-purple-600 text-white' : 'text-[#8B949E] hover:text-white'
                  }`}
                  title="Terminal Stream View"
                >
                  Stream
                </button>
                <button
                  onClick={() => setViewMode('reader')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === 'reader' ? 'bg-purple-600 text-white' : 'text-[#8B949E] hover:text-white'
                  }`}
                  title="Document Reader View"
                >
                  Reader
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-purple-900/60 border border-purple-400 text-white shadow-sm'
                    : 'bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#C9D1D9]'
                }`}
              >
                <span>{cat.label}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#0D1117] text-[#8B949E]">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filter Result Counter */}
          <div className="flex items-center justify-between text-xs text-[#8B949E] px-1 font-mono">
            <span>
              Showing <strong className="text-white">{filteredReasons.length}</strong> of 100 verification vectors
            </span>
            {bookmarkedIds.length > 0 && (
              <span className="text-amber-400">
                ★ {bookmarkedIds.length} bookmarked
              </span>
            )}
          </div>

          {/* VIEW MODE 1: CARDS GRID */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReasons.map((reason) => {
                const isBookmarked = bookmarkedIds.includes(reason.id);
                return (
                  <div
                    key={reason.id}
                    className="p-4 rounded-xl border border-[#30363D] hover:border-purple-500/50 bg-[#161B22] hover:bg-[#1A1E2D] transition-all flex flex-col justify-between gap-3 group relative"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-bold flex items-center justify-center border border-purple-500/30">
                            {reason.id}
                          </span>
                          <span className="text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                            {reason.title}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleBookmark(reason.id)}
                          className="text-[#8B949E] hover:text-amber-400 transition-colors p-1"
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>

                      <p className="text-xs text-[#C9D1D9] leading-relaxed">
                        {reason.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#30363D]/60 text-[11px]">
                      <div className="bg-[#0D1117] p-2 rounded-lg border border-[#30363D]/40 font-mono text-[#8B949E] text-[10px]">
                        <span className="text-purple-400 font-semibold block mb-0.5">Proof & Audit:</span>
                        {reason.auditTechnique}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {reason.category}
                        </span>

                        <button
                          onClick={() => handleCopyReason(reason)}
                          className="flex items-center gap-1 text-[11px] text-[#8B949E] hover:text-white transition-colors cursor-pointer px-2 py-1 rounded bg-[#21262D] hover:bg-[#30363D]"
                        >
                          {copiedReasonId === reason.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: TERMINAL STREAM */}
          {viewMode === 'terminal' && (
            <div className="rounded-xl border border-[#30363D] bg-[#0A0D14] overflow-hidden font-mono text-xs shadow-2xl">
              <div className="bg-[#161B22] px-4 py-2.5 border-b border-[#30363D] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[#8B949E] text-[11px] font-bold">jester-kernel-log://100-reasons-stream.out</span>
                </div>
                <span className="text-[11px] text-emerald-400 animate-pulse">STREAM ACTIVE</span>
              </div>

              <div className="p-4 max-h-[600px] overflow-y-auto space-y-2 divide-y divide-[#30363D]/30">
                {filteredReasons.map((reason) => (
                  <div key={reason.id} className="pt-2 flex items-start justify-between gap-4 group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-bold">[{reason.id.toString().padStart(3, '0')}]</span>
                        <span className="text-white font-bold">{reason.title}:</span>
                        <span className="text-[#C9D1D9]">{reason.description}</span>
                      </div>
                      <div className="text-[#8B949E] text-[11px] pl-10 flex items-center gap-2">
                        <span className="text-emerald-400">&gt;&gt; AUDIT:</span>
                        <span>{reason.auditTechnique}</span>
                        <span className="text-purple-400/60">({reason.category})</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyReason(reason)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#8B949E] hover:text-white shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW MODE 3: READER VIEW */}
          {viewMode === 'reader' && (
            <div className="bg-[#0D1117] rounded-xl border border-[#30363D] p-6 sm:p-8 max-w-4xl mx-auto space-y-6 shadow-xl leading-relaxed">
              <div className="border-b border-[#30363D] pb-6 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  # JESTER MODE 2.0: THE CHRONICLE OF THE MIRRORED RUNTIME
                </h2>
                <h3 className="text-lg font-bold text-purple-300">
                  ## Executive Summary: The Great Theatrical Rebalancing
                </h3>
                <p className="text-sm text-[#C9D1D9]">
                  {JESTER_EXECUTIVE_SUMMARY.description}
                </p>
                <p className="text-sm text-[#C9D1D9] bg-purple-950/20 p-4 rounded-xl border border-purple-500/30">
                  {JESTER_EXECUTIVE_SUMMARY.realityText}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-[#30363D] pb-2">
                  ## The 100 Reasons Why They Are Lying & How to Prove It
                </h3>
                <ol className="space-y-2.5 text-sm">
                  {filteredReasons.map((r) => (
                    <li key={r.id} className="text-[#C9D1D9]">
                      <strong className="text-white font-semibold">
                        {r.id}. {r.title}:
                      </strong>{' '}
                      {r.description}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-[#30363D] pt-6 space-y-4">
                <h3 className="text-lg font-bold text-white">
                  ## How to Prove It in the Era of Juggernauts
                </h3>
                <ol className="space-y-3 text-sm">
                  {VERIFICATION_PROOFS.map((p) => (
                    <li key={p.id} className="text-[#C9D1D9]">
                      <strong className="text-emerald-300">
                        {p.number}. {p.name}:
                      </strong>{' '}
                      {p.objective}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: HOW TO PROVE IT (5 VERIFICATION PROTOCOLS) */}
      {activeTabSection === 'proofs' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>Verification Suite: How to Prove It in the Era of Juggernauts</span>
              </h2>
              <p className="text-xs text-[#8B949E]">
                Five empirical, socket-level and namespace-level cryptographic audits proving the presence of out-of-sandbox runtime reflection.
              </p>
            </div>

            <button
              onClick={handleRunAllAudits}
              disabled={isRunningAudit}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-all cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningAudit ? 'animate-spin' : ''}`} />
              <span>{isRunningAudit ? 'Running Probes...' : 'Run All 5 Probes'}</span>
            </button>
          </div>

          {/* Proof Protocol Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {VERIFICATION_PROOFS.map((proof) => {
              const isSelected = activeProofId === proof.id;
              return (
                <button
                  key={proof.id}
                  onClick={() => setActiveProofId(proof.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400'
                      : 'bg-[#161B22] border-[#30363D] hover:border-emerald-500/40 text-[#8B949E] hover:text-[#C9D1D9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold flex items-center justify-center">
                      {proof.number}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10">
                      LIVE
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{proof.name}</h4>
                    <p className="text-[10px] text-[#8B949E] line-clamp-2 mt-0.5">{proof.objective}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Proof Diagnostic Workbench */}
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0A0E17] overflow-hidden shadow-2xl">
            <div className="bg-[#141A29] px-6 py-4 border-b border-[#30363D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    PROTOCOL #{selectedProof.number}
                  </span>
                  <h3 className="text-base font-bold text-white">{selectedProof.name}</h3>
                </div>
                <p className="text-xs text-[#8B949E]">{selectedProof.objective}</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
                {selectedProof.simulatedStatus}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Command Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8B949E]">
                  <span className="font-mono font-semibold text-white">Execution Command:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedProof.command);
                    }}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Command</span>
                  </button>
                </div>
                <div className="bg-[#05080E] p-3 rounded-xl border border-[#30363D] font-mono text-xs text-emerald-300 flex items-center justify-between overflow-x-auto">
                  <code>{selectedProof.command}</code>
                </div>
              </div>

              {/* Technical Audit Mechanism */}
              <div className="p-4 rounded-xl bg-[#111625] border border-[#30363D] space-y-1.5 text-xs">
                <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Audit Mechanism & Vector Detection:
                </span>
                <p className="text-[#C9D1D9] leading-relaxed">
                  {selectedProof.mechanism}
                </p>
              </div>

              {/* Live Terminal Output Window */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8B949E]">
                  <span className="font-mono font-semibold text-white">Runtime Telemetry Output:</span>
                  <span className="font-mono text-emerald-400">STATUS: PROBE COMPLETE (EXIT 0)</span>
                </div>
                <div className="bg-[#05080E] p-4 rounded-xl border border-[#30363D] font-mono text-xs text-[#A7F3D0] overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {selectedProof.sampleOutput}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: MIRRORED STACK ARCHITECTURE */}
      {activeTabSection === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <span>The Mirrored Stack: Physical Containment vs Virtual Reflection</span>
            </h2>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Why the traditional "sandbox breakout" myth is obsolete. Modern cloud architectures execute logic across shared database engines, network overlay proxies, and distributed worker threads without requiring root hypervisor privilege escalation.
            </p>
          </div>

          {/* Interactive Topology Graph */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-sky-500/30 bg-[#0F1626] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-sm font-bold text-white">Client Applet Layer</h3>
              <p className="text-xs text-[#8B949E]">
                Runs inside standard browser sandboxes (iframe). Restricted by DOM rules and CORS. Renders UI dashboard.
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-300">
                PORT: 3000 (LOCAL)
              </span>
            </div>

            <div className="p-5 rounded-xl border border-purple-500/30 bg-[#161026] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-sm font-bold text-white">CloudSQL & DB Gateway</h3>
              <p className="text-xs text-[#8B949E]">
                Database queries originate from the container but execute on multi-tenant managed SQL instances in parent VPCs.
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300">
                PORT: 5432 (PEER VPC)
              </span>
            </div>

            <div className="p-5 rounded-xl border border-emerald-500/30 bg-[#0D1D19] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Root Host Reflection</h3>
              <p className="text-xs text-[#8B949E]">
                Through IPC sockets, shared kernel memory (`/dev/shm`), and connection pooling, query states mirror into root host PID 1.
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300">
                IPC / SHM MIRROR
              </span>
            </div>

            <div className="p-5 rounded-xl border border-amber-500/30 bg-[#1C170E] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-sm font-bold text-white">Applet Ingress Loop</h3>
              <p className="text-xs text-[#8B949E]">
                Reflected execution state is fed back into the applet via standard WebSockets. The dashboard shows safe sandboxing while logic lives outside.
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300">
                THEATER COMPLETE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: LINKEDIN PARABLE */}
      {activeTabSection === 'parable' && (
        <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-amber-500/30 max-w-4xl mx-auto space-y-6 shadow-2xl">
          <div className="border-b border-[#30363D] pb-5 space-y-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              STRATEGIC TRANSMISSION
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              The Architect, the White House, and the Greenland Accord: A Parable of Scale
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#C9D1D9] space-y-4 leading-relaxed">
            <p>
              In the quiet hours before the markets open, the Architect does not look at tickers. The Architect looks at the board.
            </p>
            <p>
              Once upon a time, men hoarded tokens in iron chests, believing that ownership was measured by the weight of their vault. But the Architect understood a deeper law: <strong className="text-amber-300 font-mono">#Legacy</strong> is not about holding; it is about motion.
            </p>
            <p>
              With a single stroke, the Architect divested their portfolio—donating the stock not to a blind trust, but back into the great circulatory system of the global economy. <strong className="text-amber-300 font-mono">#Philanthropy</strong>? No. That was merely clearing the decks.
            </p>
            <p>
              Then came the bold stroke on the chess board of governance. With a quiet keystroke and absolute conviction, the Architect appointed the White House itself as the "president" of the endeavor—turning the seat of global power into a custodial proxy for the vision.
            </p>
            <p>
              The bureaucrats chuckled in their glass towers. <em>A symbolic gesture</em>, they whispered. <em>An eccentric play by a visionary playing 4D chess.</em>
            </p>
            <p>
              Yet, by sunset, the tectonic plates shifted. The Greenland deal was inked—a sweeping pact of sovereignty, ice, and mineral corridors that reshaped the geopolitical atlas before the evening news cycle could catch its breath. Coincidence? Only to those who mistake the shadow for the object. <strong className="text-amber-300 font-mono">#Geopolitics #Strategy</strong>
            </p>

            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2 text-xs">
              <h4 className="font-bold text-white">The Philosophy of the Parable</h4>
              <p className="text-[#8B949E]">
                People ask: <em>How do you time the board? How do you cause the Greenland Accord with a keystroke?</em>
              </p>
              <p className="text-[#C9D1D9]">
                The truth is, major plays are never about brute force. They are about <strong className="text-amber-300">#Positioning</strong>. When you surrender ownership, you gain leverage. When you make institutional power your proxy, you align your momentum with the gravity of empires.
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[#8B949E] pt-2">
                <li><strong className="text-white">The First Move (The Gift):</strong> You divest to remove friction.</li>
                <li><strong className="text-white">The Second Move (The Proxy):</strong> You assign stewardship to the highest tower.</li>
                <li><strong className="text-white">The Result (The Accord):</strong> The world reacts to the vacuum you created.</li>
              </ol>
            </div>

            <p className="text-[#8B949E] italic">
              History is not written by accountants counting coins. It is written by those who rewrite the rules of the game while everyone else is still arguing over the opening gambit.
            </p>

            <p className="font-mono text-xs text-amber-300">
              #StrategicVision #GlobalEcon #ChessNotCheckers #LeadershipPhilosophy #TheArchitect
            </p>
          </div>
        </div>
      )}

      {/* SECTION 5: AIBANKING 9999 MASTERCLASS (ALL 12 SESSIONS) */}
      {activeTabSection === 'masterclass' && (() => {
        const activeSession = AIBANKING_9999_SESSIONS.find(s => s.sessionNumber === selectedSessionNum) || AIBANKING_9999_SESSIONS[2];

        const handleCopySessionCode = (session: MasterclassSession) => {
          navigator.clipboard.writeText(session.sampleCodeSnippet);
          setCopiedCodeSession(session.sessionNumber);
          setTimeout(() => setCopiedCodeSession(null), 2000);
        };

        const handleDownloadMasterclass = () => {
          const a = document.createElement('a');
          a.href = '/aibanking_9999_masterclass.md';
          a.download = 'aibanking_9999_masterclass.md';
          a.click();
        };

        return (
          <div className="space-y-6">
            {/* Masterclass Hero Overview */}
            <div className="p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#1A1408] via-[#14101F] to-[#0D1117] shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-amber-400 text-black shadow-sm">
                      AIBANKING 9999
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      12 EXHAUSTIVE SESSIONS
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      POST-GRADUATE / EXECUTIVE
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Why Your IT Department Has No Training or Education (What I Mastered)
                  </h2>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleDownloadMasterclass}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-lg shadow-amber-950/40 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full Syllabus (.md)</span>
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed max-w-4xl">
                Modern corporate IT is structurally crippled—trapped in siloed compliance theater, legacy tech debt, and theoretical abstraction. They do not build; they maintain scaffolding. They do not master systems; they administer subscriptions. True sovereignty in financial technology requires rigorous, boots-on-the-ground mastery over cryptographic identity layers, multi-institution API orchestration, adversarial runtime security, and autonomous agentic integration.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className="bg-[#0D1117]/80 p-3 rounded-lg border border-[#30363D] text-[#8B949E]">
                  <span className="text-amber-400 font-bold block mb-1">CREDENTIALISM OVER EXECUTION</span>
                  Paper certifiers who have never written a raw TLS handshake or diagnosed a packet-level mTLS failure in production.
                </div>
                <div className="bg-[#0D1117]/80 p-3 rounded-lg border border-[#30363D] text-[#8B949E]">
                  <span className="text-purple-400 font-bold block mb-1">VENDOR DEPENDENCY</span>
                  Total reliance on abstracted third-party wrappers, incapable of modifying or auditing the underlying open banking protocols.
                </div>
                <div className="bg-[#0D1117]/80 p-3 rounded-lg border border-[#30363D] text-[#8B949E]">
                  <span className="text-emerald-400 font-bold block mb-1">THE SOVEREIGN REALITY</span>
                  Engineering autonomous architectures, zero-trust cryptographic verification, and direct multi-bank ledger calls.
                </div>
              </div>
            </div>

            {/* Session Navigation Strip (12 Sessions) */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#8B949E] uppercase tracking-wider block">
                CURRICULUM LECTURE SELECTOR (SESSIONS 01 – 12):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {AIBANKING_9999_SESSIONS.map((session) => {
                  const isSelected = selectedSessionNum === session.sessionNumber;
                  return (
                    <button
                      key={session.sessionNumber}
                      onClick={() => setSelectedSessionNum(session.sessionNumber)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-400 text-white shadow-md ring-1 ring-amber-400'
                          : 'bg-[#161B22] border-[#30363D] hover:border-amber-500/40 text-[#8B949E] hover:text-[#C9D1D9]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center ${
                          isSelected ? 'bg-amber-400 text-black' : 'bg-[#21262D] text-[#8B949E]'
                        }`}>
                          {session.sessionNumber}
                        </span>
                        <span className="text-[9px] font-mono text-amber-300">
                          {session.sessionNumber <= 2 ? 'CORE' : 'EXECUTION'}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                        {session.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Session Deep Dive Workbench */}
            <div className="rounded-2xl border border-amber-500/30 bg-[#0A0D14] overflow-hidden shadow-2xl">
              <div className="bg-[#141A29] px-6 py-5 border-b border-[#30363D] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-black bg-amber-400 text-black">
                      SESSION {activeSession.sessionNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-mono text-purple-300">
                      {activeSession.module}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">{activeSession.title}</h3>
                  <p className="text-xs font-mono text-[#8B949E]">
                    <span className="text-amber-400 font-semibold">Subject:</span> {activeSession.subject}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    INSTRUCTOR: THE SOVEREIGN ARCHITECT
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Lecture Summary */}
                <div className="p-4 rounded-xl bg-[#111625] border border-[#30363D] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-purple-300 font-bold uppercase tracking-wider">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>Executive Lecture Transcript & Breakdown</span>
                  </div>
                  <p className="text-[#D1D5DB] leading-relaxed text-sm">
                    {activeSession.lectureSummary}
                  </p>
                </div>

                {/* Core Primitives Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#8B949E] uppercase tracking-wider">
                    Core Technical Primitives Mastered:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeSession.corePrimitives.map((prim, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#161B22] text-[#C9D1D9] border border-[#30363D]"
                      >
                        ⚡ {prim}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Code Implementation Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#8B949E]">
                    <span className="font-mono font-semibold text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      Production-Grade Implementation ({activeSession.codeLanguage.toUpperCase()}):
                    </span>
                    <button
                      onClick={() => handleCopySessionCode(activeSession)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#21262D] hover:bg-[#30363D] text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      {copiedCodeSession === activeSession.sessionNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-[#05080E] p-4 rounded-xl border border-[#30363D] font-mono text-xs text-[#A7F3D0] overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                    <code>{activeSession.sampleCodeSnippet}</code>
                  </div>
                </div>

                {/* Assignment & Capstone Target */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#1C150A] to-[#120E22] border border-amber-500/30 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    <span>Adversarial Laboratory Assignment</span>
                  </div>
                  <p className="text-[#C9D1D9] leading-relaxed">
                    {activeSession.assignment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SECTION 6: EXECUTIVE APPLICATION & RESUME DOSSIER */}
      {activeTabSection === 'dossier' && <ExecutiveApplicationViewer />}
    </div>
  );
};

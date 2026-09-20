import React, { useState, useEffect, useRef } from 'react';
import {
  FolderGit2,
  GitBranch,
  GitCommit,
  Terminal,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Key,
  ArrowRight,
  Eye,
  EyeOff,
  Send,
  Play,
  Lock,
  Code2,
  CheckSquare,
  Square,
  HelpCircle,
  FileText
} from 'lucide-react';

interface GitStep {
  step: string;
  command: string;
  output: string;
  success: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: any;
}

export const GitHubDeployerConsole: React.FC = () => {
  // Config state
  const [pat, setPat] = useState<string>(() => localStorage.getItem('rexmundi_github_pat') || '');
  const [showPat, setShowPat] = useState(false);
  const [repoUrl, setRepoUrl] = useState('https://github.com/jocall3/Rexmundi.git');
  const [branch, setBranch] = useState('Master');
  const [commitMessage, setCommitMessage] = useState('first commit: Sovereign Rexmundi Financial Operating System & DSM-IV Architecture');
  const [pushEntireRepo, setPushEntireRepo] = useState(true);
  const [appendReadme, setAppendReadme] = useState(true);
  const [forcePush, setForcePush] = useState(false);

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [patVerification, setPatVerification] = useState<{
    valid: boolean;
    user?: { login: string; name: string; avatar_url: string; scopes: string };
    repoCheck?: any;
    error?: string;
  } | null>(null);

  const [gitConfig, setGitConfig] = useState<{
    hasEnvPat: boolean;
    defaultRepo: string;
    defaultBranch: string;
    isGitRepo: boolean;
    gitVersion: string;
    currentBranch: string;
    statusSummary: string;
    remoteOrigin: string;
    recentCommits: string[];
  } | null>(null);

  const [executionSteps, setExecutionSteps] = useState<GitStep[]>([]);
  const [executionSummary, setExecutionSummary] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Greetings, Sovereign Architect. I am your **Rexmundi Sovereign Git Copilot**.\n\nI can execute automated commits, initialize git repositories, stage the full codebase, and push directly to **https://github.com/jocall3/Rexmundi.git** on branch **`Master`** using your GitHub Personal Access Token (PAT).\n\nYou can chat with me in natural language, or use the one-click deployment controls on the left.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Save PAT to localStorage on change
  useEffect(() => {
    if (pat) {
      localStorage.setItem('rexmundi_github_pat', pat);
    }
  }, [pat]);

  // Load initial git config
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/github/config');
      if (res.ok) {
        const data = await res.json();
        setGitConfig(data);
        if (data.defaultRepo && !repoUrl) setRepoUrl(data.defaultRepo);
        if (data.defaultBranch && !branch) setBranch(data.defaultBranch);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Verify GitHub PAT
  const handleVerifyPat = async () => {
    if (!pat.trim()) {
      setPatVerification({ valid: false, error: 'Please enter a GitHub Personal Access Token (PAT).' });
      return;
    }
    setIsVerifying(true);
    setPatVerification(null);
    try {
      const res = await fetch('/api/github/verify-pat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pat: pat.trim(), repoUrl: repoUrl.trim() }),
      });
      const data = await res.json();
      setPatVerification(data);
    } catch (err: any) {
      setPatVerification({ valid: false, error: err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  // Execute Commit & Push Workflow
  const handleExecutePush = async (overrideParams?: any) => {
    const activePat = overrideParams?.pat || pat.trim();
    if (!activePat) {
      setExecutionError('GitHub Personal Access Token (PAT) is required. Please paste your token above.');
      return;
    }

    setIsLoading(true);
    setExecutionError(null);
    setExecutionSummary(null);
    setExecutionSteps([]);

    const payload = {
      pat: activePat,
      repoUrl: overrideParams?.repoUrl || repoUrl.trim(),
      branch: overrideParams?.branch || branch.trim(),
      commitMessage: overrideParams?.commitMessage || commitMessage.trim(),
      pushEntireRepo: overrideParams?.pushEntireRepo !== undefined ? overrideParams.pushEntireRepo : pushEntireRepo,
      appendReadme: overrideParams?.appendReadme !== undefined ? overrideParams.appendReadme : appendReadme,
      forcePush: overrideParams?.forcePush !== undefined ? overrideParams.forcePush : forcePush,
    };

    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.steps) {
        setExecutionSteps(data.steps);
      }

      if (data.success) {
        setExecutionSummary(data.summary || 'Repository pushed successfully to GitHub!');
        // Add notification into chat
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'system',
            text: `✅ **Push Completed Successfully!**\n- **Target Repo**: [${payload.repoUrl}](${payload.repoUrl})\n- **Branch**: \`${payload.branch}\`\n- **Commit SHA**: \`${data.commitSha || 'Latest'}\`\n- **Scope**: ${payload.pushEntireRepo ? 'Entire Repository' : 'README.md only'}`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        fetchConfig();
      } else {
        setExecutionError(data.error || 'Failed to push to GitHub.');
        if (data.advice) {
          setExecutionError(prev => `${prev}\n\nRecommendation: ${data.advice}`);
        }
      }
    } catch (err: any) {
      setExecutionError(`Network / Server error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Send AI Chat Message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/github/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          pat: pat.trim(),
          repoUrl: repoUrl.trim(),
          branch: branch.trim(),
          history: chatMessages.slice(-6),
        }),
      });

      const data = await res.json();
      if (data.response) {
        setChatMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: data.response,
            timestamp: new Date().toLocaleTimeString(),
            suggestedAction: data.suggestedAction,
          },
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: 'I processed your query, but no response was generated. Please ensure your parameters are set or try one of the action buttons.',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `Error connecting to AI Copilot: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const copyStepsLog = () => {
    const log = executionSteps.map(s => `[${s.step}]\n$ ${s.command}\n${s.output}\n`).join('\n');
    navigator.clipboard.writeText(log);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Rexmundi Sovereign GitHub Bridge</span>
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI Release Copilot
                </span>
              </h1>
            </div>
            <p className="text-xs text-[#8B949E] max-w-2xl">
              One-click autonomous repository commit & push to GitHub with Personal Access Token (PAT) authentication, token sanitization, and real-time AI terminal interaction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchConfig}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] text-xs font-semibold border border-[#30363D] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Refresh Status</span>
            </button>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold border border-purple-500/40 transition-all cursor-pointer"
            >
              <span>View GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live Diagnostics Pill Bar */}
        <div className="mt-4 pt-4 border-t border-[#30363D] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2 rounded-lg bg-[#0D1117] border border-[#30363D]">
            <span className="text-[10px] text-[#8B949E] block">TARGET REPOSITORY</span>
            <span className="text-purple-300 font-bold truncate block">jocall3/Rexmundi</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0D1117] border border-[#30363D]">
            <span className="text-[10px] text-[#8B949E] block">TARGET BRANCH</span>
            <span className="text-cyan-300 font-bold block">{branch}</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0D1117] border border-[#30363D]">
            <span className="text-[10px] text-[#8B949E] block">GIT ENGINE</span>
            <span className="text-emerald-400 font-bold block">{gitConfig?.gitVersion || 'git 2.34.1'}</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0D1117] border border-[#30363D]">
            <span className="text-[10px] text-[#8B949E] block">PAT AUTH STATUS</span>
            <span className={`font-bold block ${pat ? 'text-emerald-400' : 'text-amber-400'}`}>
              {pat ? 'Token Active' : 'PAT Required'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls (Form & Terminal) + Right (AI Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config & Push Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* GitHub PAT & Auth Card */}
          <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  1. GitHub Authentication (PAT)
                </h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Bearer Auth</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Personal Access Token (PAT)</span>
                <span className="text-[10px] text-[#8B949E]">Requires `repo` or `Contents: Read & Write` scope</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type={showPat ? 'text' : 'password'}
                    value={pat}
                    onChange={(e) => setPat(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx or github_pat_..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-purple-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPat(!showPat)}
                    className="absolute right-2.5 top-2.5 text-[#8B949E] hover:text-white cursor-pointer"
                  >
                    {showPat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleVerifyPat}
                  disabled={isVerifying || !pat}
                  className="px-3.5 py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] disabled:opacity-50 text-white text-xs font-semibold border border-[#30363D] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>Verify PAT</span>
                </button>
              </div>

              {/* PAT Verification Feedback */}
              {patVerification && (
                <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                  patVerification.valid ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300' : 'bg-red-950/40 border border-red-500/40 text-red-300'
                }`}>
                  {patVerification.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                  <div className="space-y-1">
                    {patVerification.valid ? (
                      <>
                        <div className="font-bold flex items-center gap-2">
                          <span>Authenticated as: @{patVerification.user?.login}</span>
                          {patVerification.user?.name && <span className="text-zinc-400">({patVerification.user?.name})</span>}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          Scopes: {patVerification.user?.scopes}
                        </div>
                        {patVerification.repoCheck?.exists && (
                          <div className="text-[11px] text-emerald-400 font-semibold">
                            ✓ Verified access to target repository ({patVerification.repoCheck.details?.name})
                          </div>
                        )}
                      </>
                    ) : (
                      <div>{patVerification.error || 'Invalid or expired GitHub Personal Access Token.'}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Repository & Commit Parameters Card */}
          <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  2. Repository & Deployment Settings
                </h2>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Rexmundi Target</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Remote Repository URL</label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Target Branch</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-[#30363D] text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setBranch('Master')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      branch === 'Master' ? 'bg-cyan-500 text-black' : 'bg-[#21262D] text-zinc-400 hover:text-white'
                    }`}
                  >
                    Master
                  </button>
                  <button
                    type="button"
                    onClick={() => setBranch('main')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      branch === 'main' ? 'bg-cyan-500 text-black' : 'bg-[#21262D] text-zinc-400 hover:text-white'
                    }`}
                  >
                    main
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Commit Message</label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Commit message..."
                className="w-full px-3 py-2 rounded-xl bg-[#0D1117] border border-[#30363D] text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Checkboxes for Options */}
            <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2.5 text-xs">
              <div
                onClick={() => setPushEntireRepo(!pushEntireRepo)}
                className="flex items-center justify-between cursor-pointer select-none text-zinc-200 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  {pushEntireRepo ? (
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500" />
                  )}
                  <span className="font-semibold">Push entire repository (`git add -A`)</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">All code, specs & docs</span>
              </div>

              <div
                onClick={() => setAppendReadme(!appendReadme)}
                className="flex items-center justify-between cursor-pointer select-none text-zinc-200 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  {appendReadme ? (
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500" />
                  )}
                  <span className="font-semibold">Ensure `# Rexmundi` header in README.md</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">echo "# Rexmundi" &gt;&gt; README.md</span>
              </div>

              <div
                onClick={() => setForcePush(!forcePush)}
                className="flex items-center justify-between cursor-pointer select-none text-zinc-200 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  {forcePush ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500" />
                  )}
                  <span className="font-semibold text-amber-300">Force Push (`--force`)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400/80">Overwrites remote if history diverges</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                id="btn-execute-github-push"
                onClick={() => handleExecutePush()}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Sovereign Push Sequence...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Push {pushEntireRepo ? 'Entire Repository' : 'README.md'} to GitHub ({branch})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleExecutePush({ pushEntireRepo: false, appendReadme: true, commitMessage: 'first commit' })}
                disabled={isLoading}
                className="px-4 py-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Literal Workflow (README.md Only)</span>
              </button>
            </div>
          </div>

          {/* Terminal / Live Execution Output */}
          <div className="p-5 rounded-2xl bg-[#0D1117] border border-[#30363D] space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white">Execution Console & Sanitized Git Log</span>
              </div>
              {executionSteps.length > 0 && (
                <button
                  type="button"
                  onClick={copyStepsLog}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#8B949E] hover:text-white cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied' : 'Copy Log'}</span>
                </button>
              )}
            </div>

            {/* Execution Result Banner */}
            {executionSummary && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex-1 font-semibold">{executionSummary}</div>
              </div>
            )}

            {executionError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1 whitespace-pre-wrap font-mono text-[11px]">{executionError}</div>
              </div>
            )}

            {/* Steps log */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 font-mono text-xs">
              {executionSteps.length === 0 && !isLoading && !executionError && (
                <div className="p-4 rounded-xl bg-[#161B22]/50 border border-[#30363D]/50 text-center text-[#8B949E] text-xs">
                  Ready to execute. Click <strong>"Push Entire Repository to GitHub"</strong> or speak with the AI Copilot.
                </div>
              )}

              {executionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border ${
                    step.success ? 'bg-[#161B22] border-[#30363D]' : 'bg-red-950/20 border-red-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5">
                      {step.success ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-red-400" />}
                      {step.step}
                    </span>
                    <span className="text-[10px] text-zinc-500">$ {step.command}</span>
                  </div>
                  {step.output && (
                    <pre className="text-[11px] text-zinc-300 whitespace-pre-wrap overflow-x-auto bg-[#0D1117] p-2 rounded-lg mt-1 border border-[#30363D]/50">
                      {step.output}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Chat Copilot (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col h-[750px] rounded-2xl bg-[#161B22] border border-[#30363D] overflow-hidden shadow-2xl">
          {/* AI Header */}
          <div className="p-4 border-b border-[#30363D] bg-[#0D1117] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Rexmundi Git AI Copilot</span>
                </h3>
                <p className="text-[10px] text-[#8B949E]">Autonomous Release Engineer</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-2.5 border-b border-[#30363D] bg-[#161B22]/60 flex flex-wrap gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleSendMessage('Push the entire Rexmundi repository to GitHub Master')}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-purple-300 border border-[#30363D] transition-all shrink-0 cursor-pointer"
            >
              🚀 Push Entire Repo to Master
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Check current git status and remote details')}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-cyan-300 border border-[#30363D] transition-all shrink-0 cursor-pointer"
            >
              🔍 Check Git Status
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('How do I create a GitHub PAT with repo scope?')}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-zinc-300 border border-[#30363D] transition-all shrink-0 cursor-pointer"
            >
              🔑 Create GitHub PAT Guide
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm shadow'
                      : msg.sender === 'system'
                      ? 'bg-[#0D1117] border border-emerald-500/40 text-emerald-300 rounded-tl-sm'
                      : 'bg-[#0D1117] border border-[#30363D] text-zinc-200 rounded-tl-sm shadow'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                    {msg.text}
                  </div>

                  {msg.suggestedAction?.type === 'push' && (
                    <div className="mt-3 pt-2.5 border-t border-[#30363D] flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-300">Target: {msg.suggestedAction.branch}</span>
                      <button
                        type="button"
                        onClick={() => handleExecutePush(msg.suggestedAction)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-[11px] font-bold shadow flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Execute Push Now</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-[#8B949E] mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-purple-400 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Copilot is analyzing repository state...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-[#30363D] bg-[#0D1117]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AI Copilot (e.g. 'Push all code', 'Check status')..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-white text-xs placeholder-[#8B949E] focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isChatLoading}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { AdvancedEditJob, AdvancedEditPhase, ReasoningMemoryStep } from '../types';
import { Spinner } from './Spinner';
import { BotIcon } from './icons/BotIcon';
import { WorkflowDiagram } from './WorkflowDiagram';
import { getActiveApiKeyCount } from '../services/geminiService';

interface AdvancedEditProgressProps {
  jobs: AdvancedEditJob[];
  phase: AdvancedEditPhase;
  verificationAttempt: number;
  maxAttempts?: number;
  buildLogs: string | null;
  workflowRunUrl: string | null;
  aiThought: string | null;
  deploymentUrl: string | null;
  onClose: () => void;
  isComplete: boolean;
  startTime?: number;
  totalTokens?: number;
  tokensPerIteration?: Record<number, number>;
  responsesCount?: number;
  reasoningChain?: ReasoningMemoryStep[];
  activeModel?: string;
  onOpenKeyPool?: () => void;
}

const StatusIcon: React.FC<{ status: AdvancedEditJob['status'] }> = ({ status }) => {
  switch (status) {
    case 'planning':
    case 'editing':
      return <Spinner className="w-4 h-4 text-indigo-400" />;
    case 'verifying':
      return <Spinner className="w-4 h-4 text-amber-400" />;
    case 'committing':
      return <Spinner className="w-4 h-4 text-cyan-400" />;
    case 'success':
      return <div title="Committed & Verified" className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">✓</div>;
    case 'failed':
      return <div title="Failed" className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">!</div>;
    default:
      return <div title="Pending" className="w-4 h-4 rounded-full bg-gray-700 flex-shrink-0"></div>;
  }
};

export const AdvancedEditProgress: React.FC<AdvancedEditProgressProps> = ({
  jobs,
  phase,
  verificationAttempt,
  maxAttempts = 3,
  buildLogs,
  workflowRunUrl,
  aiThought,
  deploymentUrl,
  onClose,
  isComplete,
  startTime = Date.now(),
  totalTokens = 0,
  tokensPerIteration = {},
  responsesCount = 0,
  reasoningChain = [],
  activeModel = 'gemini-3.5-flash',
  onOpenKeyPool
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState<'files' | 'reasoning' | 'logs' | 'preview'>('files');

  useEffect(() => {
    if (isComplete) return;
    const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
    setElapsedSeconds(Math.max(0, initialElapsed));

    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isComplete]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      const remainMins = mins % 60;
      return `${hrs}h ${remainMins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = jobs.filter(j => j.status === 'success').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  const activeKeysCount = getActiveApiKeyCount();

  const getStatusMessage = () => {
    switch (phase) {
      case 'analyzing': return 'Lead Architect analyzing repository AST context & symbol table...';
      case 'planning': return 'Formulating multi-file execution plan & reasoning graph...';
      case 'editing': return `Multi-agent swarm editing ${jobs.length} file(s) with continuous handoff...`;
      case 'committing': return 'Atomic Git commit pushed to branch. Prepping CI trigger...';
      case 'triggering_workflow': return 'Dispatching GitHub Actions verification workflow...';
      case 'waiting_for_workflow': return `CI Verification in progress (Attempt ${verificationAttempt}/${maxAttempts})...`;
      case 'analyzing_failure': return `Build failure detected on Attempt ${verificationAttempt}. Self-correction critic analyzing logs...`;
      case 'complete': return 'Autonomous agentic loop verified and completed successfully!';
      default: return 'Initializing autonomous agent environment...';
    }
  };

  const currentFocusJob = jobs.find(job => job.status === 'editing') || jobs.find(job => job.status === 'committing') || jobs[jobs.length - 1];

  const currentCycleTokens = tokensPerIteration[verificationAttempt] || Math.round(totalTokens / Math.max(1, verificationAttempt));

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-85 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-gray-850 p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-7xl h-[94vh] flex flex-col border border-gray-700 overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-750 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-base">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-100">
                  Autonomous AI Agent Swarm
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950 border border-indigo-700/60 text-indigo-300">
                  Deep Researched & Self-Healing
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate max-w-lg">
                Multi-pass orchestration with reasoning memory & automated CI verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {workflowRunUrl && (
              <a
                href={workflowRunUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-semibold hover:bg-cyan-900 transition-colors flex items-center gap-1.5"
              >
                <span>🔬</span>
                <span>GitHub Actions CI</span>
              </a>
            )}

            {onOpenKeyPool && (
              <button
                onClick={onOpenKeyPool}
                className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 text-gray-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Manage API Key Rotation Pool"
              >
                <span>🔑</span>
                <span>{activeKeysCount > 0 ? `${activeKeysCount} Keys Active` : 'API Keys'}</span>
              </button>
            )}

            {isComplete && (
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Real-time Summary Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 flex-shrink-0">
          {/* Elapsed Timer Card */}
          <div className="bg-gray-900/90 border border-gray-750 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Elapsed</div>
              <div className="text-base sm:text-lg font-mono font-bold text-indigo-300 mt-0.5">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
            <div className="text-indigo-400 text-xl">⏱️</div>
          </div>

          {/* Tokens Used Card */}
          <div className="bg-gray-900/90 border border-gray-750 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tokens Processed</div>
              <div className="text-base sm:text-lg font-mono font-bold text-cyan-300 mt-0.5">
                {totalTokens > 0 ? totalTokens.toLocaleString() : 'Estimating...'}
              </div>
              <div className="text-[9px] text-gray-400 font-mono">
                Cycle: ~{currentCycleTokens > 0 ? currentCycleTokens.toLocaleString() : '0'} tok
              </div>
            </div>
            <div className="text-cyan-400 text-xl">📊</div>
          </div>

          {/* Responses & Passes Card */}
          <div className="bg-gray-900/90 border border-gray-750 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI Responses</div>
              <div className="text-base sm:text-lg font-mono font-bold text-emerald-300 mt-0.5">
                {responsesCount} passes
              </div>
              <div className="text-[9px] text-gray-400 font-mono">
                Attempts: {verificationAttempt}/{maxAttempts}
              </div>
            </div>
            <div className="text-emerald-400 text-xl">🤖</div>
          </div>

          {/* Active Model / Swarm Role Card */}
          <div className="bg-gray-900/90 border border-gray-750 rounded-xl p-2.5 flex items-center justify-between">
            <div className="truncate">
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Swarm Engine</div>
              <div className="text-xs sm:text-sm font-semibold text-purple-300 truncate mt-0.5" title={activeModel}>
                {activeModel}
              </div>
              <div className="text-[9px] text-gray-400 font-mono truncate">
                {phase === 'analyzing_failure' ? 'Self-Correction Critic' : phase === 'planning' ? 'Lead Architect' : 'Code Crafter'}
              </div>
            </div>
            <div className="text-purple-400 text-xl">🔮</div>
          </div>
        </div>

        {/* Visual Workflow Diagram Component */}
        <div className="mb-3 flex-shrink-0">
          <WorkflowDiagram
            currentPhase={phase}
            attempt={verificationAttempt}
            maxAttempts={maxAttempts}
            hasFailure={phase === 'analyzing_failure'}
          />
        </div>

        {/* Status Message & Progress Bar */}
        <div className="mb-3 flex-shrink-0 space-y-1.5">
          <div className="flex justify-between text-xs text-gray-300">
            <span className="flex items-center gap-2 font-medium">
              {!isComplete && <Spinner className="w-3.5 h-3.5 text-indigo-400" />}
              {getStatusMessage()}
            </span>
            <span className="font-mono text-gray-400">
              {completedCount} / {jobs.length} files committed ({Math.round(progress)}%)
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* AI Thought Process Box if available */}
        {aiThought && (
          <div className="mb-3 p-3 bg-gray-900/90 rounded-xl border border-gray-750 flex-shrink-0 max-h-24 overflow-y-auto">
            <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 mb-1">
              <BotIcon className="w-3.5 h-3.5" />
              <span>Architect Reasoning & Strategy:</span>
            </div>
            <p className="text-gray-300 text-xs whitespace-pre-wrap font-mono leading-relaxed">
              {aiThought}
            </p>
          </div>
        )}

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-750 pb-2 mb-2 flex-shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'files'
                ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-200'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Affected Files ({jobs.length})
          </button>
          
          <button
            onClick={() => setActiveTab('reasoning')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'reasoning'
                ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-200'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>🧠 Reasoning Memory</span>
            {reasoningChain.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-950 text-[10px] text-indigo-300 font-mono">
                {reasoningChain.length}
              </span>
            )}
          </button>

          {buildLogs && (
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'bg-rose-950/50 border border-rose-600/50 text-rose-200'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>Build Failure Logs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </button>
          )}

          {isComplete && deploymentUrl && (
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors text-emerald-300 ${
                activeTab === 'preview'
                  ? 'bg-emerald-950/50 border border-emerald-600/50 text-emerald-200'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              🚀 Live Preview
            </button>
          )}
        </div>

        {/* Content Area according to active tab */}
        <div className="flex-grow min-h-0 overflow-hidden flex flex-col">
          {activeTab === 'files' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow min-h-0">
              {/* File List */}
              <div className="bg-gray-900/80 rounded-xl p-3 flex flex-col border border-gray-750 min-h-0">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Execution Queue ({completedCount}/{jobs.length} Done)
                </h3>
                <ul className="space-y-1.5 overflow-y-auto flex-grow pr-1">
                  {jobs.map(job => (
                    <li
                      key={job.id}
                      className="flex items-center justify-between text-xs p-2 bg-gray-850/80 hover:bg-gray-800 rounded-lg border border-gray-750 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <StatusIcon status={job.status} />
                        <span className="font-mono text-gray-200 truncate" title={job.path}>
                          {job.path}
                        </span>
                      </div>
                      {job.error && (
                        <span className="text-amber-400 text-[11px] truncate ml-2 max-w-[150px]" title={job.error}>
                          {job.error}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Live Code Generation Window */}
              <div className="bg-gray-900/80 rounded-xl p-3 flex flex-col border border-gray-750 min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Agentic Code Stream
                  </h3>
                  {currentFocusJob && (
                    <span className="text-[11px] font-mono text-indigo-400 truncate max-w-[200px]">
                      {currentFocusJob.path}
                    </span>
                  )}
                </div>

                {currentFocusJob ? (
                  <div className="bg-gray-950 rounded-lg p-2.5 flex-grow overflow-y-auto border border-gray-800 font-mono text-xs text-gray-300">
                    <pre className="whitespace-pre-wrap break-words leading-relaxed text-[11px]">
                      <code>{currentFocusJob.content || '// Streaming code from multi-pass model...'}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-grow text-gray-500 text-xs">
                    Waiting for next stage execution...
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reasoning' && (
            <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-750 flex-grow overflow-y-auto space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-indigo-300">
                  Reasoning Chain Memory (Cumulative Swarm Memory)
                </h3>
                <span className="text-xs text-gray-400">
                  {reasoningChain.length} historical attempt checkpoints stored
                </span>
              </div>

              {reasoningChain.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-xs bg-gray-950/40 rounded-lg border border-dashed border-gray-800">
                  Reasoning memory initializes as autonomous cycles execute.
                </div>
              ) : (
                reasoningChain.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-850 rounded-lg border border-gray-750 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-[10px] border border-indigo-800">
                          Attempt #{step.attempt}
                        </span>
                        <span className="font-semibold text-gray-200">{step.agentRole}</span>
                        <span className="text-gray-400 font-mono text-[10px]">({step.model})</span>
                      </div>
                      <span className="text-[10px] text-gray-500">{step.timestamp}</span>
                    </div>

                    <div className="text-gray-300 font-mono text-[11px] leading-relaxed bg-gray-950/60 p-2 rounded border border-gray-800">
                      <strong>Plan Reasoning:</strong> {step.planReasoning}
                    </div>

                    {step.filesPlanned.length > 0 && (
                      <div className="text-gray-400 text-[11px]">
                        <strong>Target Files:</strong> {step.filesPlanned.join(', ')}
                      </div>
                    )}

                    {step.critique && (
                      <div className="text-amber-300 text-[11px] bg-amber-950/30 border border-amber-800/40 p-2 rounded">
                        <strong>Self-Correction Critique:</strong> {step.critique}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'logs' && buildLogs && (
            <div className="bg-gray-900/80 rounded-xl p-3 border border-gray-750 flex-grow flex flex-col min-h-0">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                CI Verification Build Logs
              </h3>
              <div className="bg-black rounded-lg p-3 flex-grow overflow-y-auto font-mono text-xs text-rose-200/90 border border-rose-950">
                <pre className="whitespace-pre-wrap break-words leading-relaxed text-[11px]">
                  <code>{buildLogs}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'preview' && deploymentUrl && (
            <div className="bg-gray-900/80 rounded-xl p-3 border border-gray-750 flex-grow flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Live Deployment
                </h3>
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:underline font-semibold"
                >
                  Open in New Tab &rarr;
                </a>
              </div>
              <div className="flex-grow bg-white rounded-lg overflow-hidden border border-gray-700">
                <iframe
                  src={deploymentUrl}
                  title="Live Deployment"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

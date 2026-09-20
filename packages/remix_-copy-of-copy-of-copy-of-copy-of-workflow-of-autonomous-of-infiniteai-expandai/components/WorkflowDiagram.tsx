import React from 'react';
import { AdvancedEditPhase } from '../types';

interface WorkflowDiagramProps {
  currentPhase: AdvancedEditPhase;
  attempt: number;
  maxAttempts?: number;
  hasFailure?: boolean;
}

interface StepDef {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  phases: AdvancedEditPhase[];
  icon: string;
  agentRole: string;
}

const STEPS: StepDef[] = [
  {
    id: 'plan',
    name: 'Plan & Reason',
    shortLabel: '1. Plan',
    description: 'Repo context & multi-file strategy',
    phases: ['analyzing', 'planning'],
    icon: '🧠',
    agentRole: 'Architect Agent'
  },
  {
    id: 'edit',
    name: 'Multi-File Edit',
    shortLabel: '2. Edit',
    description: 'Autonomous code crafting',
    phases: ['editing'],
    icon: '⚡',
    agentRole: 'Coder Agent'
  },
  {
    id: 'commit',
    name: 'Commit & Push',
    shortLabel: '3. Commit',
    description: 'Atomic git commit to branch',
    phases: ['committing'],
    icon: '📦',
    agentRole: 'Git Controller'
  },
  {
    id: 'verify',
    name: 'CI Verify',
    shortLabel: '4. Verify',
    description: 'GitHub Actions build & test',
    phases: ['triggering_workflow', 'waiting_for_workflow', 'analyzing_failure'],
    icon: '🔬',
    agentRole: 'CI Inspector'
  },
  {
    id: 'done',
    name: 'Verified Done',
    shortLabel: '5. Complete',
    description: 'Production-ready deployment',
    phases: ['complete'],
    icon: '🚀',
    agentRole: 'Release Lead'
  }
];

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({
  currentPhase,
  attempt,
  maxAttempts = 3,
  hasFailure = false
}) => {
  const getStepStatus = (step: StepDef, index: number) => {
    if (currentPhase === 'complete') {
      return 'completed';
    }

    const isCurrent = step.phases.includes(currentPhase);
    if (isCurrent) {
      if (currentPhase === 'analyzing_failure') {
        return 'warning';
      }
      return 'active';
    }

    // Determine if step is in the past
    const currentStepIndex = STEPS.findIndex(s => s.phases.includes(currentPhase));
    if (currentStepIndex > index) {
      return 'completed';
    }

    return 'upcoming';
  };

  const isSelfCorrecting = currentPhase === 'analyzing_failure';

  return (
    <div className="bg-gray-900/90 border border-gray-750 rounded-xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
      {/* Header bar of the workflow */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span className="font-semibold text-gray-300 uppercase tracking-wider text-[11px]">
            Autonomous Agentic Pipeline
          </span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-700/50 text-indigo-300 font-mono text-[10px]">
            Cycle {attempt} / {maxAttempts}
          </span>
        </div>

        {isSelfCorrecting && (
          <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px] animate-pulse">
            <span>🔄</span>
            <span>Self-Correction Feedback Loop Active</span>
          </div>
        )}
      </div>

      {/* Visual Step Node Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 relative z-10">
        {STEPS.map((step, idx) => {
          const status = getStepStatus(step, idx);
          const isActive = status === 'active';
          const isWarning = status === 'warning';
          const isDone = status === 'completed';

          return (
            <div key={step.id} className="relative flex flex-col">
              {/* Connector line on desktop */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`hidden md:block absolute top-6 -right-2 w-4 h-0.5 z-0 transition-colors duration-500 ${
                    isDone ? 'bg-emerald-500/80' : 'bg-gray-700'
                  }`}
                />
              )}

              {/* Node Card */}
              <div
                className={`p-3 rounded-lg border transition-all duration-300 relative z-10 flex flex-col justify-between min-h-[90px] ${
                  isActive
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400/40'
                    : isWarning
                    ? 'bg-amber-950/50 border-amber-500 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/50'
                    : isDone
                    ? 'bg-emerald-950/30 border-emerald-600/60 text-gray-300'
                    : 'bg-gray-950/40 border-gray-800 text-gray-500'
                }`}
              >
                {/* Top row with icon & status */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{step.icon}</span>
                    <span
                      className={`font-semibold text-xs ${
                        isActive
                          ? 'text-indigo-200'
                          : isWarning
                          ? 'text-amber-200'
                          : isDone
                          ? 'text-emerald-300'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.shortLabel}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  {isActive && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  )}
                  {isWarning && (
                    <span className="text-amber-400 font-bold text-xs">⚠️</span>
                  )}
                  {isDone && (
                    <span className="text-emerald-400 font-bold text-xs">✓</span>
                  )}
                </div>

                {/* Subtitle / Description */}
                <p
                  className={`text-[10px] leading-tight line-clamp-1 mb-2 ${
                    isActive || isWarning ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {step.description}
                </p>

                {/* Agent role badge */}
                <div className="mt-auto">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono tracking-tight ${
                      isActive
                        ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-700/60'
                        : isWarning
                        ? 'bg-amber-900/80 text-amber-200 border border-amber-700/60'
                        : isDone
                        ? 'bg-gray-800/80 text-emerald-300/80'
                        : 'bg-gray-900 text-gray-600'
                    }`}
                  >
                    {step.agentRole}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Self-Correction Loop Arc Visual when attempt > 1 */}
      {attempt > 1 && (
        <div className="mt-2.5 pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400 bg-gray-950/40 px-3 py-1.5 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">↻ Memory Loop:</span>
            <span>
              Attempt #{attempt} utilizes root-cause reasoning logs from Attempt #{attempt - 1} to prevent recurring failures.
            </span>
          </div>
          <span className="font-mono text-[10px] text-indigo-400">Autonomous Self-Healing</span>
        </div>
      )}
    </div>
  );
};

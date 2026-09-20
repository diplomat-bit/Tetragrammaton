import React, { useState } from 'react';
import { ProjectExpansionJob, ProjectExpansionPhase } from '../types';
import { Spinner } from './Spinner';

const StatusIcon: React.FC<{ status: ProjectExpansionJob['status'] }> = ({ status }) => {
    switch (status) {
        case 'queued': 
            return <div title="Queued" className="w-4 h-4 rounded-full bg-gray-600 flex-shrink-0"></div>;
        case 'generating': 
            return <Spinner className="w-4 h-4 text-blue-400" />;
        case 'committing': 
            return <Spinner className="w-4 h-4 text-yellow-400" />;
        case 'retrying':
            return <Spinner className="w-4 h-4 text-orange-400" />;
        case 'success': 
            return <div title="Success" className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>;
        case 'failed': 
            return <div title="Failed" className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">!</div>;
        default: 
            return null;
    }
};

interface ProjectExpansionProgressProps {
  jobs: ProjectExpansionJob[];
  phase: ProjectExpansionPhase;
  onClose: () => void;
  isComplete: boolean;
}

const PhaseIndicator: React.FC<{title: string, isActive: boolean, isComplete: boolean}> = ({ title, isActive, isComplete }) => (
    <div className="flex items-center gap-2">
        {isActive && <Spinner className="h-4 w-4" />}
        {isComplete && <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>}
        <span className={isActive ? "text-purple-300" : isComplete ? "text-gray-300" : "text-gray-500"}>{title}</span>
    </div>
);

export const ProjectExpansionProgress: React.FC<ProjectExpansionProgressProps> = ({ jobs, phase, onClose, isComplete }) => {
  const completedCount = jobs.filter(j => j.status === 'success' || j.status === 'failed').length;
  const successCount = jobs.filter(j => j.status === 'success').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  
  const activeJobs = jobs.filter(j => j.status === 'generating' || j.status === 'committing' || j.status === 'retrying');

  const getStatusMessage = () => {
    switch(phase) {
        case 'planning': return 'Master agent is analyzing the seed file and planning massive expansion...';
        case 'generating': return `Executing plan: ${jobs.length} file operations...`;
        case 'complete': return 'Project expansion complete!';
        default: return 'Initializing...';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-850 p-6 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col border border-gray-700">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-purple-400">AI Project Expansion</h2>
            {isComplete && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            )}
        </div>
        
        <div className="mb-4 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-around p-2 bg-gray-900 rounded-md">
                <PhaseIndicator title="1. Planning" isActive={phase === 'planning'} isComplete={['generating', 'complete'].includes(phase)} />
                <div className="flex-grow h-px bg-gray-700 mx-4"></div>
                <PhaseIndicator title="2. Execution" isActive={phase === 'generating'} isComplete={phase === 'complete'} />
            </div>
             <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span className="flex items-center gap-2">
                    {phase !== 'complete' && <Spinner className="h-4 w-4" />}
                    {getStatusMessage()}
                </span>
                <span>{`${successCount} / ${jobs.length} file operations successful`}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        
        {phase === 'planning' ? (
             <div className="flex-grow min-h-0 bg-gray-900 rounded-md p-4 flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <Spinner className="h-8 w-8 mx-auto mb-4" />
                    <p>Master agent is analyzing the seed file...</p>
                    <p className="text-sm text-gray-500">This may take a few moments.</p>
                </div>
             </div>
        ) : (
            <div className="flex-grow min-h-0 flex flex-col bg-gray-900 rounded-xl p-4 border border-gray-800 overflow-hidden">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Expansion Operations Plan</h3>
                  <span className="text-xs text-gray-400 font-mono">{jobs.length} Operations</span>
                </div>

                <div className="flex-grow overflow-y-auto pr-1 space-y-2">
                    {jobs.map(job => {
                        const fileName = job.path.split('/').pop() || job.path;
                        const dirPath = job.path.includes('/') ? job.path.substring(0, job.path.lastIndexOf('/')) : '';

                        return (
                          <div 
                            key={job.id} 
                            className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-all ${
                              job.status === 'generating' 
                                ? 'bg-purple-950/30 border-purple-800/60 shadow-sm'
                                : job.status === 'committing'
                                ? 'bg-amber-950/30 border-amber-800/60'
                                : job.status === 'success'
                                ? 'bg-emerald-950/20 border-emerald-900/40'
                                : job.status === 'failed'
                                ? 'bg-rose-950/30 border-rose-800/60'
                                : 'bg-gray-850 border-gray-800'
                            }`}
                          >
                             <div className="flex items-center gap-3 min-w-0 flex-1">
                                 <StatusIcon status={job.status} />
                                 <div className="min-w-0 flex-1">
                                   <div className="flex items-center gap-2">
                                     {job.type === 'edit' ? 
                                         <span className="text-[10px] font-mono text-yellow-400 bg-yellow-950/80 border border-yellow-800 px-1.5 py-0.2 rounded flex-shrink-0">EDIT</span> :
                                         <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded flex-shrink-0">NEW</span>
                                     }
                                     <span className="font-bold text-gray-100 truncate font-mono">{fileName}</span>
                                     {dirPath && <span className="text-gray-500 text-[10px] truncate">({dirPath})</span>}
                                   </div>
                                   <p className="text-gray-400 text-[11px] truncate mt-0.5">{job.description}</p>
                                   {job.error && (
                                     <p className="text-rose-400 text-[11px] mt-0.5 truncate">{job.error}</p>
                                   )}
                                 </div>
                             </div>

                             <div className="flex items-center gap-2 pl-3">
                               <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider ${
                                 job.status === 'success'
                                   ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                                   : job.status === 'generating'
                                   ? 'bg-purple-900/80 text-purple-300 border border-purple-700 animate-pulse'
                                   : job.status === 'committing'
                                   ? 'bg-amber-900/80 text-amber-300 border border-amber-700 animate-pulse'
                                   : job.status === 'failed'
                                   ? 'bg-rose-900/80 text-rose-300 border border-rose-700'
                                   : 'bg-gray-800 text-gray-400 border border-gray-700'
                               }`}>
                                 {job.status}
                               </span>
                             </div>
                          </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
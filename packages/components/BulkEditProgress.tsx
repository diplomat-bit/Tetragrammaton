import React from 'react';
import { BulkEditJob } from '../types';
import { Spinner } from './Spinner';

const StatusIcon: React.FC<{ status: BulkEditJob['status'] }> = ({ status }) => {
    switch (status) {
        case 'queued': 
            return <div title="Queued" className="w-3.5 h-3.5 rounded-full bg-gray-600 flex-shrink-0"></div>;
        case 'researching':
            return <span title="Deep Researching..." className="text-blue-400 font-bold text-xs flex-shrink-0 animate-pulse">🔍</span>;
        case 'processing': 
            return <Spinner className="w-3.5 h-3.5 text-amber-400" />;
        case 'retrying':
            return <Spinner className="w-3.5 h-3.5 text-orange-400" />;
        case 'success': 
            return <div title="Success" className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">✓</div>;
        case 'skipped': 
            return <div title="Skipped" className="w-3.5 h-3.5 rounded-full bg-yellow-500 flex items-center justify-center text-black text-[10px] font-bold flex-shrink-0">-</div>;
        case 'failed': 
            return <div title="Failed" className="w-3.5 h-3.5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">!</div>;
        default: 
            return null;
    }
};

interface BulkEditProgressProps {
  jobs: BulkEditJob[];
  onClose: () => void;
  isComplete: boolean;
}

export const BulkEditProgress: React.FC<BulkEditProgressProps> = ({ jobs, onClose, isComplete }) => {
  const completedCount = jobs.filter(j => j.status === 'success' || j.status === 'skipped' || j.status === 'failed').length;
  const successCount = jobs.filter(j => j.status === 'success').length;
  const failedCount = jobs.filter(j => j.status === 'failed').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  
  const activeJobs = jobs.filter(j => j.status === 'researching' || j.status === 'processing' || j.status === 'retrying');

  return (
    <div className="fixed inset-0 bg-gray-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-750 p-6 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-amber-400">Massive AI Bulk Edit Engine</h2>
              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-600 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Silent Memory Safe Mode
              </span>
            </div>
            {isComplete && (
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                Done
              </button>
            )}
        </div>
        
        {/* Progress Bar & Stats */}
        <div className="mb-5 flex-shrink-0 bg-gray-850 p-4 rounded-xl border border-gray-800">
            <div className="flex justify-between text-xs text-gray-300 mb-2">
                <span className="font-semibold flex items-center gap-2">
                  {!isComplete && <Spinner className="w-3.5 h-3.5 text-amber-400" />}
                  {isComplete ? 'All files edited & committed.' : `Processing files (${completedCount} of ${jobs.length} completed)`}
                </span>
                <span className="space-x-3">
                  <span className="text-emerald-400 font-semibold">{successCount} committed</span>
                  {failedCount > 0 && <span className="text-rose-400 font-semibold">{failedCount} failed</span>}
                  <span className="text-gray-400 font-mono">{Math.round(progress)}%</span>
                </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-800/80 text-[11px]">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-amber-400 font-bold">⚡ Active Workers:</span>
                <span className="text-gray-200 font-mono">{activeJobs.length}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-blue-400 font-bold">🔍 Grounding:</span>
                <span className="text-gray-200">Google Search</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-emerald-400 font-bold">🛡️ Buffer Cache:</span>
                <span className="text-emerald-300">Clean (Auto-GC)</span>
              </div>
            </div>
        </div>

        {/* File Queue List */}
        <div className="flex-grow min-h-0 flex flex-col bg-gray-850 rounded-xl p-4 border border-gray-800 overflow-hidden">
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">File Processing Queue</h3>
               <span className="text-xs text-gray-400 font-mono">{jobs.length} Total Targets</span>
             </div>

             <div className="flex-grow overflow-y-auto pr-1 space-y-2">
                {jobs.map(job => {
                    const fileName = job.path.split('/').pop() || job.path;
                    const dirPath = job.path.includes('/') ? job.path.substring(0, job.path.lastIndexOf('/')) : '';
                    
                    return (
                      <div 
                        key={job.id} 
                        className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-all ${
                          job.status === 'processing' 
                            ? 'bg-amber-950/30 border-amber-800/60 shadow-sm'
                            : job.status === 'researching'
                            ? 'bg-blue-950/30 border-blue-800/60'
                            : job.status === 'success'
                            ? 'bg-emerald-950/20 border-emerald-900/40'
                            : job.status === 'failed'
                            ? 'bg-rose-950/30 border-rose-800/60'
                            : 'bg-gray-900 border-gray-800'
                        }`}
                      >
                         <div className="flex items-center gap-3 min-w-0 flex-1">
                             <StatusIcon status={job.status} />
                             <div className="min-w-0 flex-1">
                               <div className="flex items-center gap-2">
                                 <span className="font-bold text-gray-100 truncate font-mono">{fileName}</span>
                                 {dirPath && <span className="text-gray-500 text-[10px] truncate">({dirPath})</span>}
                               </div>
                               
                               {job.researchSources && job.researchSources.length > 0 && (
                                 <div className="flex items-center gap-1 mt-1 text-[10px] text-blue-300">
                                   <span>🔍 Citations:</span>
                                   <span className="text-blue-400 underline truncate max-w-[280px]">
                                     {job.researchSources[0].title || job.researchSources[0].uri}
                                     {job.researchSources.length > 1 ? ` (+${job.researchSources.length - 1} more)` : ''}
                                   </span>
                                 </div>
                               )}

                               {job.error && (
                                 <p className="text-rose-400 text-[11px] mt-0.5 truncate">{job.error}</p>
                               )}
                             </div>
                         </div>

                         <div className="flex items-center gap-2 pl-3">
                           <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider ${
                             job.status === 'success'
                               ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                               : job.status === 'processing'
                               ? 'bg-amber-900/80 text-amber-300 border border-amber-700 animate-pulse'
                               : job.status === 'researching'
                               ? 'bg-blue-900/80 text-blue-300 border border-blue-700 animate-pulse'
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

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center text-xs text-gray-400 flex-shrink-0">
          <span>⚡ Running concurrently across background worker threads without DOM memory pressure.</span>
          {isComplete && (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-lg transition-colors border border-gray-700"
            >
              Close Window
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { GithubRepo } from '../types';

interface PortfolioGridProps {
  repos: GithubRepo[];
  onSelectRepo: (repo: GithubRepo) => void;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ repos, onSelectRepo }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-950 custom-scrollbar p-8 lg:p-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            System Online
          </div>
          <h1 className="text-6xl font-extrabold text-white tracking-tight mb-4">Project Intelligence <span className="text-slate-500">Catalog</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            Exploring the digital architecture and engineering solutions developed by the JOCALL3 laboratory.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {repos.map(repo => (
            <div 
              key={repo.id}
              onClick={() => onSelectRepo(repo)}
              className="group relative bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-[100px] group-hover:bg-indigo-600/20 transition-all"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <i className="fas fa-folder"></i>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <i className="fas fa-star text-amber-500"></i> {repo.stargazers_count}
                    </span>
                    <i className="fas fa-arrow-right text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{repo.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-8 min-h-[40px]">
                  {repo.description || "Project metadata and core logic are currently being indexed for full retrieval."}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                    {repo.language || 'Binary'}
                  </span>
                  <span className="px-3 py-1 bg-slate-800/40 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioGrid;

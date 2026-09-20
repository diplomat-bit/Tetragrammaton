
import React, { useState } from 'react';
import { GithubRepo } from '../types';

interface SidebarProps {
  repos: GithubRepo[];
  selectedRepo: GithubRepo | null;
  onSelectRepo: (repo: GithubRepo) => void;
  isOpen: boolean;
  onToggle: () => void;
  onGoHome: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ repos, selectedRepo, onSelectRepo, isOpen, onToggle, onGoHome }) => {
  const [search, setSearch] = useState('');
  const filtered = repos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300 h-full ${isOpen ? 'w-80' : 'w-20'}`}>
      {/* Branding */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <button onClick={onGoHome} className={`flex items-center gap-3 transition-opacity ${!isOpen && 'opacity-0'}`}>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-terminal text-white"></i>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Portfolio.OS</span>
        </button>
        <button onClick={onToggle} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <i className={`fas ${isOpen ? 'fa-angle-left' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {isOpen && (
          <div className="mb-6">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find Project..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <p className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 ${!isOpen && 'hidden'}`}>Modules</p>
          <button 
            onClick={onGoHome}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all ${!selectedRepo ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
          >
            <i className="fas fa-th-large w-5 text-center"></i>
            {isOpen && <span className="text-sm font-medium">Dashboard</span>}
          </button>
        </div>

        <div className="mt-8 space-y-1">
          <p className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 ${!isOpen && 'hidden'}`}>Repositories</p>
          {filtered.map(repo => (
            <button
              key={repo.id}
              onClick={() => onSelectRepo(repo)}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all group ${selectedRepo?.id === repo.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <div className={`w-2 h-2 rounded-full ${selectedRepo?.id === repo.id ? 'bg-indigo-500' : 'bg-slate-700 group-hover:bg-slate-500'}`}></div>
              {isOpen && <span className="text-sm font-medium truncate">{repo.name}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/50 ${!isOpen && 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">JO</div>
          {isOpen && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">jocall3</p>
              <p className="text-[10px] text-slate-500 truncate">Senior Explorer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


import React from 'react';
import { GithubRepo, GithubFile } from '../types';

interface HeaderProps {
  repo: GithubRepo | null;
  file: GithubFile | null;
  toggleAI: () => void;
  isAIPanelOpen: boolean;
  isSidebarOpen: boolean;
  auditCount: number;
  onToggleSidebar: () => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ repo, toggleAI, isAIPanelOpen, isSidebarOpen, onToggleSidebar, onGoHome }) => {
  return (
    <header className="h-20 border-b border-neutral-100 bg-white flex items-center justify-between px-8 z-40">
      <div className="flex items-center gap-6">
        <button onClick={onToggleSidebar} className="text-neutral-400 hover:text-black">
            <i className={`fas ${isSidebarOpen ? 'fa-align-left' : 'fa-align-justify'}`}></i>
        </button>
        <button onClick={onGoHome} className="text-xl font-black italic uppercase tracking-tighter">Business Inc</button>
      </div>

      <div className="flex items-center gap-8">
        {repo && (
          <button
            onClick={toggleAI}
            className={`px-8 py-2 rounded-full font-black uppercase text-[10px] tracking-[0.2em] transition-all ${isAIPanelOpen ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400 hover:text-black'}`}
          >
            {isAIPanelOpen ? "Close Issue" : "Open Issue"}
          </button>
        )}
        <div onClick={onGoHome} className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white text-[10px] font-black cursor-pointer">JO</div>
      </div>
    </header>
  );
};

export default Header;

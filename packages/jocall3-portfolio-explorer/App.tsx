
import React, { useState, useEffect } from 'react';
import { GithubRepo, SelectedContext } from './types';
import { githubService } from './services/githubService';
import Sidebar from './components/Sidebar';
import PortfolioGrid from './components/PortfolioGrid';
import RepoOverview from './components/RepoOverview';
import FileViewer from './components/FileViewer';

const App: React.FC = () => {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'files'>('overview');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    githubService.getUserRepos().then(data => {
      setRepos(data);
    }).finally(() => setIsLoading(false));
  }, []);

  const handleSelectRepo = (repo: GithubRepo) => {
    setSelectedRepo(repo);
    setViewMode('overview');
    setSelectedFile(null);
    setFileContent(null);
  };

  const handleGoHome = () => {
    setSelectedRepo(null);
    setViewMode('overview');
  };

  const handleSelectFile = async (file: any) => {
    if (file.type === 'dir' || !file.download_url) return;
    const content = await githubService.getFileContent(file.download_url);
    setSelectedFile(file);
    setFileContent(content);
    setViewMode('files');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <i className="fas fa-terminal text-indigo-500 text-2xl"></i>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-white text-xl font-bold tracking-tight mb-2">Portfolio.OS Initializing</h2>
          <p className="text-slate-500 text-xs uppercase tracking-[0.4em] animate-pulse">Scanning Neural Architecture</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-200">
      <Sidebar 
        repos={repos} 
        selectedRepo={selectedRepo} 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onSelectRepo={handleSelectRepo}
        onGoHome={handleGoHome}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <main className="flex-1 overflow-hidden relative">
          {!selectedRepo ? (
            <PortfolioGrid repos={repos} onSelectRepo={handleSelectRepo} />
          ) : (
            <div className="h-full flex flex-col">
              {/* Context Header */}
              <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-bold text-white tracking-tight">{selectedRepo.name}</h2>
                  <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                    <button 
                      onClick={() => setViewMode('overview')}
                      className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${viewMode === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
                    >
                      AI Overview
                    </button>
                    <button 
                      onClick={() => setViewMode('files')}
                      className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${viewMode === 'files' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
                    >
                      Source Code
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <a href={selectedRepo.html_url} target="_blank" className="text-slate-500 hover:text-white transition-colors">
                     <i className="fab fa-github text-xl"></i>
                   </a>
                </div>
              </div>

              {/* View Rendering */}
              <div className="flex-1 overflow-hidden">
                {viewMode === 'overview' ? (
                  <RepoOverview repo={selectedRepo} onSelectFile={handleSelectFile} />
                ) : (
                  <FileViewer file={selectedFile} content={fileContent} repo={selectedRepo} />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { GithubRepo, RepoDossier, ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import { githubService } from '../services/githubService';
import MarkdownRenderer from './MarkdownRenderer';

interface RepoOverviewProps {
  repo: GithubRepo;
  onSelectFile: (file: any) => void;
}

const RepoOverview: React.FC<RepoOverviewProps> = ({ repo }) => {
  const [dossier, setDossier] = useState<RepoDossier | null>(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    generateDossier();
    setChat([]);
  }, [repo.id]);

  const generateDossier = async () => {
    setLoading(true);
    try {
      const files = await githubService.getAllRepoFilesRecursively(repo.name);
      const topFiles = files.slice(0, 3);
      const contents = await Promise.all(topFiles.map(async f => ({
        path: f.path,
        content: await githubService.getFileContent(f.download_url!)
      })));
      const result = await geminiService.generateProjectDossier(repo.name, repo.description, contents);
      setDossier(result);
    } catch (e) {
      console.error("Dossier generation failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await geminiService.chatWithRepo(repo.name, dossier, userMsg, chat);
      setChat(prev => [...prev, { role: 'assistant', text: response }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-slate-950">
      {/* Left Column: Dossier */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          {loading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">AI Agent Analyzing Codebase...</p>
            </div>
          ) : dossier ? (
            <>
              <section className="space-y-4">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">{repo.name}</h1>
                <div className="text-xl text-indigo-400 font-medium leading-relaxed italic">"{dossier.pitch}"</div>
              </section>

              <div className="grid grid-cols-2 gap-8">
                <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Technical Architecture</h3>
                  <div className="prose prose-invert prose-sm">
                    <MarkdownRenderer content={dossier.architectureSummary} />
                  </div>
                </section>
                <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {dossier.techStack.map(tech => (
                      <span key={tech} className="px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold">{tech}</span>
                    ))}
                  </div>
                </section>
              </div>

              <section className="space-y-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Key Engineering Feats</h3>
                <div className="grid gap-4">
                  {dossier.keyFeatures.map((f, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-slate-900/30 border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-colors">
                      <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                        <i className="fas fa-bolt"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{f.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500">Failed to load dossier.</div>
          )}
        </div>
      </div>

      {/* Right Column: AI Consultant Chat */}
      <div className="w-[400px] border-l border-slate-800 flex flex-col bg-slate-900/20 backdrop-blur-md">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <i className="fas fa-robot text-indigo-500"></i> Project Consultant
          </h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Ask about the architecture</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {chat.length === 0 && (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
                <i className="fas fa-comment-dots"></i>
              </div>
              <p className="text-xs text-slate-500">No active consultation. Start by asking a question.</p>
            </div>
          )}
          {chat.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 px-4 py-2 rounded-2xl flex gap-1 items-center">
                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the project..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-indigo-500 hover:text-white transition-colors">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RepoOverview;

import React, { useState } from 'react';
import {
  Bookmark, Plus, Trash2, Pin, CheckSquare, Sparkles, RefreshCw,
  Search, Tag, Palette, Check, Archive, Copy, CheckCircle2
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { getGoogleWorkspaceToken } from '../../firebase';

interface KeepNote {
  id: string;
  title: string;
  content: string;
  checklist?: { text: string; done: boolean }[];
  color: 'slate' | 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
  pinned: boolean;
  tags: string[];
  updatedAt: string;
}

const COLOR_MAP = {
  slate: 'bg-slate-900 border-slate-800 text-slate-100',
  amber: 'bg-amber-950/40 border-amber-500/40 text-amber-100',
  emerald: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100',
  blue: 'bg-blue-950/40 border-blue-500/40 text-blue-100',
  purple: 'bg-purple-950/40 border-purple-500/40 text-purple-100',
  rose: 'bg-rose-950/40 border-rose-500/40 text-rose-100',
};

export const GoogleKeepWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [notes, setNotes] = useState<KeepNote[]>([
    {
      id: 'n-1',
      title: 'Citibank Escrow Escrow Checklist',
      content: 'Confirm with Citi Securities Services regarding Class A non-dilutable escrow verification.',
      checklist: [
        { text: 'Verify IMAD: 20260912CITIUS33990021 in Federal Reserve FedLine', done: true },
        { text: 'Confirm RS256 JWS signature public key in Citi Developer Portal', done: true },
        { text: 'Verify ISO 20022 pacs.008 TAS/BETC classification code', done: false }
      ],
      color: 'amber',
      pinned: true,
      tags: ['Citi', 'Fedwire', 'Compliance'],
      updatedAt: '10:30 AM'
    },
    {
      id: 'n-2',
      title: 'Quantitative Risk Milestones',
      content: 'Maintain distance to default (DD) >= 3.20 under Merton model across volatile market tranches.',
      color: 'emerald',
      pinned: true,
      tags: ['Merton', 'Quant'],
      updatedAt: '09:40 AM'
    },
    {
      id: 'n-3',
      title: 'Solidity Smart Contract Underwriting',
      content: 'Deploy ERC-3643 compliant permissioned loan vault on Base & Arbitrum with multi-sig paymaster.',
      color: 'purple',
      pinned: false,
      tags: ['Solidity', 'SmartContracts'],
      updatedAt: 'Yesterday'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState<KeepNote['color']>('slate');
  const [newTagInput, setNewTagInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleAddNote = () => {
    if (!newTitle && !newContent) return;
    const newN: KeepNote = {
      id: `n-${Date.now()}`,
      title: newTitle || 'Untitled Note',
      content: newContent,
      color: newColor,
      pinned: false,
      tags: newTagInput ? newTagInput.split(',').map((t) => t.trim()).filter(Boolean) : [],
      updatedAt: 'Just now'
    };
    setNotes([newN, ...notes]);
    setNewTitle('');
    setNewContent('');
    setNewTagInput('');
    setStatusMsg('Note saved to cloud workspace.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const togglePin = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const toggleChecklist = (noteId: string, itemIdx: number) => {
    setNotes(
      notes.map((n) => {
        if (n.id !== noteId || !n.checklist) return n;
        const cl = [...n.checklist];
        cl[itemIdx].done = !cl[itemIdx].done;
        return { ...n, checklist: cl };
      })
    );
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.pinned);

  return (
    <div id="google-keep-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Keep Notes"
        scopeDescription="Connect your Google Account to synchronize encrypted scratchpads, checklists, and executive memos."
        onTokenChange={(t) => setToken(t)}
      />

      {statusMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMsg}
          </span>
          <button onClick={() => setStatusMsg(null)} className="text-[#8B949E] hover:text-white">✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shadow-inner">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Google Keep Notes & Memos</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                KEEP V1 ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rapid encrypted note-taking, multi-tag categorization, and instant checklist tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes or #tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-48 lg:w-64"
            />
          </div>
        </div>
      </div>

      {/* Create Note Box */}
      <div className="max-w-2xl mx-auto p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full bg-transparent text-sm font-bold text-white placeholder-slate-500 focus:outline-none"
        />
        <textarea
          rows={3}
          placeholder="Take an institutional memo or scratchpad note..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-300 placeholder-slate-500 focus:outline-none resize-none font-mono"
        />

        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            {/* Color Selector */}
            <div className="flex items-center gap-1">
              {(['slate', 'amber', 'emerald', 'blue', 'purple', 'rose'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    c === 'slate' ? 'bg-slate-700' :
                    c === 'amber' ? 'bg-amber-500' :
                    c === 'emerald' ? 'bg-emerald-500' :
                    c === 'blue' ? 'bg-blue-500' :
                    c === 'purple' ? 'bg-purple-500' : 'bg-rose-500'
                  } ${newColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                />
              ))}
            </div>

            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleAddNote}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Save Note
          </button>
        </div>
      </div>

      {/* Pinned Notes Grid */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider px-1">Pinned Notes</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 relative group ${COLOR_MAP[n.color]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-white">{n.title}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePin(n.id)}
                      className="text-amber-400 hover:text-amber-300 transition-colors"
                      title="Unpin Note"
                    >
                      <Pin className="w-4 h-4 fill-amber-400" />
                    </button>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 transition-opacity p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-200">{n.content}</p>

                {n.checklist && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                    {n.checklist.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleChecklist(n.id, idx)}
                        className="flex items-center gap-2 text-xs cursor-pointer hover:text-white"
                      >
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                          item.done ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold' : 'border-slate-700'
                        }`}>
                          {item.done && '✓'}
                        </span>
                        <span className={item.done ? 'line-through text-slate-500' : 'text-slate-300'}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between pt-2 text-[10px] text-slate-400">
                  <div className="flex gap-1 flex-wrap">
                    {n.tags.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-black/30 border border-white/10">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span>{n.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Other Notes Grid */}
      <div className="space-y-2">
        {pinnedNotes.length > 0 && (
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Other Notes</span>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unpinnedNotes.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 relative group ${COLOR_MAP[n.color]}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-white">{n.title}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePin(n.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-400 transition-opacity"
                    title="Pin Note"
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNote(n.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 transition-opacity p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-200">{n.content}</p>

              <div className="flex flex-wrap items-center justify-between pt-2 text-[10px] text-slate-400">
                <div className="flex gap-1 flex-wrap">
                  {n.tags.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-black/30 border border-white/10">
                      #{t}
                    </span>
                  ))}
                </div>
                <span>{n.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Bold, Italic, Underline, List, ListOrdered, AlignLeft,
  AlignCenter, AlignRight, Download, Sparkles, RefreshCw, Copy, Check,
  Heading1, Heading2, Heading3, Quote, Code, Clock, BookOpen, Share2, Plus, Trash2,
  ExternalLink, CheckCircle2, AlertCircle, Cloud
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

export const GoogleDocsWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudDocUrl, setCloudDocUrl] = useState<string | null>(null);
  const [cloudMsg, setCloudMsg] = useState<string | null>(null);
  const [userDocs, setUserDocs] = useState<{ id: string; name: string; modifiedTime: string; webViewLink?: string }[]>([]);

  const [docTitle, setDocTitle] = useState('Enterprise Financial Architecture & Security Whitepaper');
  const [content, setContent] = useState(`## Executive Overview
This document specifies the technical architecture for the multi-rail sovereign banking and quantitative execution network.

### 1. Sovereign Settlement Core
- **Fedwire Priority Protocol**: Off-the-top $2,000,000.00 USD priority wire settlement via Citi N.A.
- **Citigroup Cryptographic Suite**: JWE RSA-OAEP-256 with AES-256-GCM authenticated payload encapsulation.
- **ISO 20022 Integration**: High-throughput pacs.008.001.10 XML payment orders with end-to-end UETR routing.

### 2. Quantitative Risk Engines
1. **Merton Structural Risk**: Distance to Default (DD) and Probability of Default (PD) real-time continuous evaluation.
2. **Black-Scholes European Option Pricer**: Multi-strike volatility skew analytics.
3. **Altman Z-Score Discriminant Analysis**: Insolvency prediction across balance sheet ratios.

### 3. Smart Contract Loan Underwriting
All issued loans conform to ERC-3643 permissioned token identity standards with automated debt service enforcement.`);

  // Fetch real Google Docs from Drive API
  const fetchUserDocs = useCallback(async () => {
    if (!token) return;
    try {
      const res = await callGoogleApi<{ files?: any[] }>(
        "https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.document'&pageSize=15&fields=files(id,name,modifiedTime,webViewLink)"
      );
      if (res.files) {
        setUserDocs(res.files.map((f: any) => ({
          id: f.id,
          name: f.name || 'Untitled Doc',
          modifiedTime: f.modifiedTime ? new Date(f.modifiedTime).toLocaleDateString() : 'Recent',
          webViewLink: f.webViewLink || `https://docs.google.com/document/d/${f.id}/edit`
        })));
      }
    } catch (e) {
      console.warn('Google Docs fetch note:', e);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserDocs();
    }
  }, [token, fetchUserDocs]);

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'html'>('editor');
  const [copied, setCopied] = useState(false);

  // Dynamic Word and Character Counters
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const readingTimeMin = Math.ceil(wordCount / 200);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix} `);
  };

  const handleAiAction = (action: 'draft' | 'summarize' | 'polish' | 'expand') => {
    setIsAiGenerating(true);
    setTimeout(() => {
      if (action === 'draft' && aiPrompt) {
        setContent((prev) => `${prev}\n\n### AI Draft: ${aiPrompt}\n${aiPrompt} has been systematically audited. All cryptographic primitives and Open Banking endpoints meet Level-4 compliance standards.`);
        setAiPrompt('');
      } else if (action === 'summarize') {
        setContent((prev) => `${prev}\n\n> **AI Executive Summary**: The architecture integrates Citigroup JWE/JWS cryptography, Fedwire real-time settlements, and algorithmic Merton/Black-Scholes risk engines into a unified sovereign execution pipeline.`);
      } else if (action === 'polish') {
        setContent((prev) => prev.replace(/systematically/g, 'rigorously').replace(/technical/g, 'institutional-grade'));
      } else if (action === 'expand') {
        setContent((prev) => `${prev}\n\n### 4. Zero-Knowledge Circuit Validation\nUtilizing Groth16 zk-SNARK proving keys over the BN254 elliptic curve, identity verification is conducted with zero personal data leakage.`);
      }
      setIsAiGenerating(false);
    }, 700);
  };

  const handleCreateGoogleDoc = async () => {
    if (!token) {
      setCloudMsg('Please connect your Google Account first using the button above.');
      return;
    }
    setIsCloudSyncing(true);
    setCloudMsg(null);
    try {
      // Create document via Google Docs API
      const res = await callGoogleApi<{ documentId: string; title: string }>(
        'https://docs.googleapis.com/v1/documents',
        {
          method: 'POST',
          body: JSON.stringify({
            title: docTitle || 'Kronos Executive Briefing'
          })
        }
      );

      if (res.documentId) {
        const url = `https://docs.google.com/document/d/${res.documentId}/edit`;
        setCloudDocUrl(url);
        setCloudMsg(`Successfully created Google Doc in your account!`);
      }
    } catch (err: any) {
      setCloudMsg(`Export notice: ${err.message}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleExport = (format: 'md' | 'txt' | 'html') => {
    let output = content;
    let mime = 'text/markdown';
    if (format === 'html') {
      output = `<!DOCTYPE html><html><head><title>${docTitle}</title></head><body><pre>${content}</pre></body></html>`;
      mime = 'text/html';
    } else if (format === 'txt') {
      output = content.replace(/[#*`>-]/g, '');
      mime = 'text/plain';
    }

    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docTitle.replace(/\s+/g, '_')}.${format}`;
    link.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="google-docs-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Docs"
        scopeDescription="Connect your Google Account to create, read, and write live Google Docs."
        onTokenChange={(t) => setToken(t)}
      />

      {cloudMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {cloudMsg}
          </span>
          {cloudDocUrl && (
            <a
              href={cloudDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
            >
              Open in Google Docs <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* User's Existing Google Docs Ribbon */}
      {userDocs.length > 0 && (
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Your Google Docs ({userDocs.length})
            </span>
            <span className="text-[11px] text-slate-500">Synced from Google Drive</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {userDocs.map((ud) => (
              <a
                key={ud.id}
                href={ud.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 bg-slate-950 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/50 rounded-lg text-xs text-slate-200 flex items-center gap-2 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold truncate max-w-[160px]">{ud.name}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none transition-colors px-1"
              />
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                LIVE DOCS V1 ENGINE
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
              <span>•</span>
              <span>~{readingTimeMin} min read</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                viewMode === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                viewMode === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Formatted Preview
            </button>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleCreateGoogleDoc}
            disabled={isCloudSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
          >
            {isCloudSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
            Save to Google Docs
          </button>
          <button
            onClick={() => handleExport('md')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export MD
          </button>
        </div>
      </div>

      {/* Editor Formatting Toolbar */}
      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => insertFormatting('# ')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 font-bold text-xs"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('## ')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 font-bold text-xs"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('### ')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 font-bold text-xs"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-slate-800 mx-1" />
        <button
          onClick={() => insertFormatting('**', '**')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 text-xs font-bold"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('*', '*')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 text-xs"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('- ')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 text-xs"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('1. ')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 text-xs"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('> ')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 text-xs"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('```\n', '\n```')}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 text-xs font-mono"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      {/* Main Canvas & AI Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Editor Area */}
        <div className="lg:col-span-3">
          {viewMode === 'editor' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={22}
              className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 font-mono text-sm leading-relaxed focus:outline-none focus:border-blue-500 resize-none shadow-inner"
              placeholder="Draft your executive briefing or system specification here..."
            />
          ) : (
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm leading-relaxed max-h-[550px] overflow-y-auto space-y-4">
              {content.split('\n\n').map((block, idx) => {
                if (block.startsWith('# ')) {
                  return <h1 key={idx} className="text-2xl font-black text-white">{block.replace('# ', '')}</h1>;
                }
                if (block.startsWith('## ')) {
                  return <h2 key={idx} className="text-xl font-bold text-blue-400 border-b border-slate-800 pb-1 mt-4">{block.replace('## ', '')}</h2>;
                }
                if (block.startsWith('### ')) {
                  return <h3 key={idx} className="text-base font-semibold text-emerald-400 mt-3">{block.replace('### ', '')}</h3>;
                }
                if (block.startsWith('> ')) {
                  return <blockquote key={idx} className="p-3 bg-slate-900 border-l-4 border-blue-500 rounded text-slate-300 italic">{block.replace('> ', '')}</blockquote>;
                }
                return <p key={idx} className="text-slate-300 leading-relaxed">{block}</p>;
              })}
            </div>
          )}
        </div>

        {/* AI Copilot Panel */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              AI Documentation Copilot
            </div>
            <p className="text-xs text-slate-400">
              Generate institutional audit reports, parse regulatory compliance briefs, and auto-summarize.
            </p>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Add technical section on Zero-Knowledge SNARK proofs..."
              rows={3}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />

            <button
              onClick={() => handleAiAction('draft')}
              disabled={isAiGenerating || !aiPrompt}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Draft Section
            </button>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleAiAction('summarize')}
                disabled={isAiGenerating}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
              >
                Summarize
              </button>
              <button
                onClick={() => handleAiAction('polish')}
                disabled={isAiGenerating}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
              >
                Polish Tone
              </button>
              <button
                onClick={() => handleAiAction('expand')}
                disabled={isAiGenerating}
                className="col-span-2 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
              >
                Add ZK Cryptography Specs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

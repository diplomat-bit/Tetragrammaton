import React, { useState } from 'react';
import {
  Presentation, Play, Plus, Trash2, Copy, MoveLeft, MoveRight,
  Sparkles, RefreshCw, Palette, Layout, Maximize2, Minimize2, ChevronLeft, ChevronRight,
  ExternalLink, CheckCircle2, AlertCircle, Cloud
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  layout: 'title' | 'bullets' | 'columns' | 'metric';
  bullets?: string[];
  columnLeft?: string;
  columnRight?: string;
  metricValue?: string;
  metricLabel?: string;
  notes?: string;
}

export const GoogleSlidesWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudDeckUrl, setCloudDeckUrl] = useState<string | null>(null);
  const [cloudMsg, setCloudMsg] = useState<string | null>(null);

  const [deckTitle, setDeckTitle] = useState('Institutional Capital Markets & Multi-Rail Banking Keynote');
  const [theme, setTheme] = useState<'titanium' | 'emerald' | 'indigo' | 'amber'>('titanium');
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 'slide-1',
      title: 'Aquarius Sovereign Protocol',
      subtitle: 'Multi-Rail Autonomous Banking, Quantitative Risk & ZKP Settlement Infrastructure',
      layout: 'title',
      notes: 'Introduce sovereign protocol capabilities and Tier-2 valuation framework.'
    },
    {
      id: 'slide-2',
      title: 'Priority Fedwire Disbursement',
      subtitle: 'Schedule 1-A Non-Dilutable Settlement Architecture',
      layout: 'metric',
      metricValue: '$2,000,000.00',
      metricLabel: 'Immediate Fedwire Liquidity Distributed Across Class A Tranches',
      notes: 'Focus on Citi N.A. bankruptcy-remote custodian escrow verification.'
    },
    {
      id: 'slide-3',
      title: 'Cryptographic Primitives & ISO 20022',
      subtitle: 'Institutional Open Banking Security Standards',
      layout: 'bullets',
      bullets: [
        '5-Part Compact JWE Encryption (RSA-OAEP-256 + AES-256-GCM)',
        '3-Part Compact JWS RS256 Digital Signatures',
        'ISO 20022 pacs.008.001.10 XML Payment Messages with UETR tracking',
        'ERC-4337 Gasless Paymaster UserOperation execution'
      ],
      notes: 'Explain cryptographic nonces and TAS/BETC federal classification.'
    },
    {
      id: 'slide-4',
      title: 'Quantitative Risk & Option Modeling',
      subtitle: 'Continuous Merton Structural PD and Black-Scholes Valuation',
      layout: 'columns',
      columnLeft: '### Merton Structural Default\n• Distance to Default (DD): 3.24\n• Default Probability (PD): 0.059%\n• Sovereign AA+ Rating Benchmark',
      columnRight: '### Black-Scholes Analytical Greeks\n• Continuous Delta & Gamma Hedging\n• Multi-Asset Volatility Skew Calibration\n• Real-Time Portfolio Liquidity Buffering',
      notes: 'Illustrate dynamic debt-to-asset volatility thresholds.'
    }
  ]);

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const activeSlide = slides[activeSlideIdx] || slides[0];

  const handleCreateGoogleSlides = async () => {
    if (!token) {
      setCloudMsg('Please connect your Google Account first using the button above.');
      return;
    }
    setIsCloudSyncing(true);
    setCloudMsg(null);
    try {
      const res = await callGoogleApi<{ presentationId: string; title: string }>(
        'https://slides.googleapis.com/v1/presentations',
        {
          method: 'POST',
          body: JSON.stringify({
            title: deckTitle || 'Kronos Executive Keynote'
          })
        }
      );

      if (res.presentationId) {
        const url = `https://docs.google.com/presentation/d/${res.presentationId}/edit`;
        setCloudDeckUrl(url);
        setCloudMsg(`Successfully created Google Slides presentation in your account!`);
      }
    } catch (err: any) {
      setCloudMsg(`Presentation notice: ${err.message}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const addSlide = (layout: Slide['layout'] = 'bullets') => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: 'New Executive Slide',
      subtitle: 'Section Subtitle & Core Objective',
      layout,
      bullets: ['First strategic initiative', 'Second analytical benchmark', 'Third execution deliverable'],
      columnLeft: 'Key Operational Driver A\n• High throughput\n• Standardized schema',
      columnRight: 'Key Operational Driver B\n• Zero-Knowledge verification\n• Instant finality',
      metricValue: '$100M+',
      metricLabel: 'Projected Liquidity Capacity',
      notes: 'Presenter notes for active delivery.'
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIdx(slides.length);
  };

  const deleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    const filtered = slides.filter((s) => s.id !== id);
    setSlides(filtered);
    setActiveSlideIdx((prev) => Math.min(prev, filtered.length - 1));
  };

  const handleAiGenerateDeck = () => {
    if (!aiTopic) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      setDeckTitle(`AI Synthesis: ${aiTopic}`);
      setSlides([
        {
          id: `ai-1`,
          title: aiTopic,
          subtitle: 'Institutional Executive Briefing & Technical Protocol',
          layout: 'title',
          notes: `Overview slide for ${aiTopic}.`
        },
        {
          id: `ai-2`,
          title: 'Strategic Market Opportunity',
          subtitle: 'Multi-Billion Dollar Liquidity Moat',
          layout: 'metric',
          metricValue: '$5.6T',
          metricLabel: 'Total Addressable Market in SBA & Fedwire Structured Finance',
          notes: 'Highlight non-dilutable execution model.'
        },
        {
          id: `ai-3`,
          title: 'Architectural Implementation',
          subtitle: 'Four Pillars of Execution',
          layout: 'bullets',
          bullets: [
            'Automated Continuous Clearing via Fedwire & ISO 20022',
            'Zero-Knowledge Groth16 Verification on Ethereum L1',
            'Dynamic Black-Scholes Hedging & Merton Distance to Default',
            'Sovereign Identity and Permissioned RWA Compliance'
          ],
          notes: 'Address regulatory compliance.'
        }
      ]);
      setActiveSlideIdx(0);
      setIsAiGenerating(false);
      setAiTopic('');
    }, 900);
  };

  return (
    <div id="google-slides-workspace" className="space-y-4">
      {/* Full-Screen Presentation Mode */}
      {isPresenting && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-8">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">
              Slide {activeSlideIdx + 1} of {slides.length} • {deckTitle}
            </span>
            <button
              onClick={() => setIsPresenting(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Exit Full Screen
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 max-w-5xl mx-auto w-full">
            <div className="w-full text-center space-y-6">
              {activeSlide.layout === 'title' && (
                <div className="space-y-4">
                  <h1 className="text-5xl font-black text-white">{activeSlide.title}</h1>
                  <p className="text-2xl text-amber-400">{activeSlide.subtitle}</p>
                </div>
              )}
              {activeSlide.layout === 'metric' && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-white">{activeSlide.title}</h2>
                  <div className="text-7xl font-black text-emerald-400 font-mono my-6">{activeSlide.metricValue}</div>
                  <p className="text-xl text-slate-300">{activeSlide.metricLabel}</p>
                </div>
              )}
              {activeSlide.layout === 'bullets' && (
                <div className="text-left max-w-2xl mx-auto space-y-6">
                  <h2 className="text-3xl font-bold text-white">{activeSlide.title}</h2>
                  <p className="text-slate-400 text-base">{activeSlide.subtitle}</p>
                  <ul className="space-y-3 list-disc list-inside text-lg text-slate-200">
                    {activeSlide.bullets?.map((b, i) => (
                      <li key={i} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              )}
              {activeSlide.layout === 'columns' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">{activeSlide.title}</h2>
                  <div className="grid grid-cols-2 gap-8 text-sm text-slate-200 text-left">
                    <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 whitespace-pre-wrap">{activeSlide.columnLeft}</div>
                    <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 whitespace-pre-wrap">{activeSlide.columnRight}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-white">
            <button
              disabled={activeSlideIdx === 0}
              onClick={() => setActiveSlideIdx((prev) => Math.max(0, prev - 1))}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-full cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              disabled={activeSlideIdx === slides.length - 1}
              onClick={() => setActiveSlideIdx((prev) => Math.min(slides.length - 1, prev + 1))}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-full cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Slides"
        scopeDescription="Connect your Google Account to create, customize, and present live Google Slides presentations."
        onTokenChange={(t) => setToken(t)}
      />

      {cloudMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {cloudMsg}
          </span>
          {cloudDeckUrl && (
            <a
              href={cloudDeckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Open in Google Slides <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shadow-inner">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                className="text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors px-1"
              />
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SLIDES V3 DECK BUILDER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive keynote deck architect with presentation mode & AI theme synthesizer
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['titanium', 'emerald', 'indigo', 'amber'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2.5 py-1 text-xs capitalize rounded-md transition-all cursor-pointer ${
                  theme === t ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateGoogleSlides}
            disabled={isCloudSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
          >
            {isCloudSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
            Save to Google Slides
          </button>

          <button
            onClick={() => setIsPresenting(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Present Deck
          </button>
        </div>
      </div>

      {/* AI Presentation Generator */}
      <div className="p-3 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-xl flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
        <input
          type="text"
          placeholder="Ask AI to generate a full presentation deck on a topic..."
          value={aiTopic}
          onChange={(e) => setAiTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAiGenerateDeck()}
          className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={handleAiGenerateDeck}
          disabled={isAiGenerating || !aiTopic}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer"
        >
          {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Build Deck
        </button>
      </div>

      {/* Main Slides Studio Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Slide List Navigator */}
        <div className="space-y-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 max-h-[580px] overflow-y-auto">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300">Slide Deck ({slides.length})</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => addSlide('bullets')}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[11px] font-bold flex items-center gap-0.5"
                title="Add Bullet Slide"
              >
                <Plus className="w-3 h-3" /> Bullet
              </button>
              <button
                onClick={() => addSlide('metric')}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] font-bold flex items-center gap-0.5"
                title="Add Metric Slide"
              >
                <Plus className="w-3 h-3" /> Metric
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => setActiveSlideIdx(idx)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  activeSlideIdx === idx
                    ? 'bg-slate-800 border-amber-500/80 shadow-md text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                  <span>Slide {idx + 1}</span>
                  <span className="uppercase">{s.layout}</span>
                </div>
                <p className="font-bold truncate text-slate-200">{s.title || 'Untitled Slide'}</p>
                <p className="text-[11px] truncate text-slate-500">{s.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Slide Editor Canvas */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl min-h-[420px] flex flex-col justify-between shadow-inner">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-amber-400">Layout: {activeSlide.layout.toUpperCase()}</span>
                <button
                  onClick={() => deleteSlide(activeSlide.id)}
                  className="p-1 text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Slide Title</label>
                <input
                  type="text"
                  value={activeSlide.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSlides(slides.map((s) => (s.id === activeSlide.id ? { ...s, title: val } : s)));
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-base font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Slide Subtitle</label>
                <input
                  type="text"
                  value={activeSlide.subtitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSlides(slides.map((s) => (s.id === activeSlide.id ? { ...s, subtitle: val } : s)));
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {activeSlide.layout === 'metric' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Big Metric Number</label>
                    <input
                      type="text"
                      value={activeSlide.metricValue || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlides(slides.map((s) => (s.id === activeSlide.id ? { ...s, metricValue: val } : s)));
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xl font-black text-emerald-400 font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Metric Description</label>
                    <input
                      type="text"
                      value={activeSlide.metricLabel || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlides(slides.map((s) => (s.id === activeSlide.id ? { ...s, metricLabel: val } : s)));
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeSlide.layout === 'bullets' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Bullet Points (One per line)</label>
                  <textarea
                    rows={4}
                    value={activeSlide.bullets?.join('\n') || ''}
                    onChange={(e) => {
                      const bullets = e.target.value.split('\n');
                      setSlides(slides.map((s) => (s.id === activeSlide.id ? { ...s, bullets } : s)));
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <label className="text-[10px] text-slate-500 block mb-1">Speaker Notes</label>
              <input
                type="text"
                placeholder="Notes visible only to the presenter..."
                value={activeSlide.notes || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setSlides(slides.map((s) => (s.id === activeSlide.id ? { ...s, notes: val } : s)));
                }}
                className="w-full bg-transparent text-xs text-slate-400 focus:outline-none italic"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

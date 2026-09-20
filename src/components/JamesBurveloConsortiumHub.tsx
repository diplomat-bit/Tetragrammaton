import React, { useState, useEffect } from 'react';
import {
  Building2,
  Cpu,
  Layers,
  ShieldCheck,
  TrendingUp,
  Coins,
  FileCode,
  Code2,
  Play,
  Search,
  Sliders,
  Globe2,
  CheckCircle2,
  Zap,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Database,
  Terminal,
  BarChart3,
  Server,
  Boxes,
  FileText,
  DollarSign,
  Briefcase
} from 'lucide-react';

interface OmniGridApp {
  id: string;
  domain: string;
  function: string;
  description: string;
  integrations: string[];
  dependencies: string[];
  revenue_model: string;
}

interface FinancialModel {
  fileName: string;
  modelName: string;
  exports: string[];
  sizeBytes: number;
}

interface Bond {
  isin: string;
  name: string;
  issuer: string;
  coupon: number;
  maturityDate: string;
  rating: string;
  price: number;
  yield: number;
  currency: string;
  duration: number;
}

interface SimulationResult {
  isin: string;
  name: string;
  originalPrice: number;
  simulatedPrice: number;
  priceChangePct: number;
  originalYield: number;
  simulatedYield: number;
  duration: number;
  estimatedPnL: number;
}

interface SubPackage {
  name: string;
  folder: string;
  version: string;
  description: string;
  hasSrc: boolean;
}

export function JamesBurveloConsortiumHub() {
  const [activeTab, setActiveTab] = useState<'omnigrid' | 'iso20022' | 'models' | 'bonds' | 'subpackages' | 'manifest'>('omnigrid');
  
  // OmniGrid Manifest State
  const [omniApps, setOmniApps] = useState<OmniGridApp[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<OmniGridApp | null>(null);

  // ISO 20022 State
  const [isoCodeSets, setIsoCodeSets] = useState<Record<string, string[]>>({});
  const [isoSearch, setIsoSearch] = useState('');
  const [selectedIsoKey, setSelectedIsoKey] = useState<string>('');

  // Models State
  const [models, setModels] = useState<FinancialModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<FinancialModel | null>(null);
  const [modelFileContent, setModelFileContent] = useState<string>('');
  const [loadingModelFile, setLoadingModelFile] = useState(false);

  // Bonds & Simulation State
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [basisPointsShock, setBasisPointsShock] = useState<number>(25);
  const [simResults, setSimResults] = useState<{
    aggregatePnL: number;
    aggregateReturnPct: number;
    riskAssessment: string;
    bonds: SimulationResult[];
  } | null>(null);
  const [simulating, setSimulating] = useState(false);

  // Subpackages State
  const [subpackages, setSubpackages] = useState<SubPackage[]>([]);
  const [selectedSubpackage, setSelectedSubpackage] = useState<SubPackage | null>(null);

  // Architecture Manifest State
  const [archManifest, setArchManifest] = useState<{
    version: string;
    compliance: string;
    architecture: string;
    primitives: Array<{ name: string; standard: string; description: string }>;
    markdown: string;
  } | null>(null);

  // Ecosystem Overview
  const [ecosystemStatus, setEcosystemStatus] = useState<any>(null);

  useEffect(() => {
    fetchEcosystemStatus();
    fetchOmniGridManifest();
    fetchIso20022();
    fetchModels();
    fetchBonds();
    fetchSubpackages();
    fetchArchitecture();
  }, []);

  const fetchEcosystemStatus = async () => {
    try {
      const res = await fetch('/api/jamesburvelo/status');
      const data = await res.json();
      if (data.success) setEcosystemStatus(data);
    } catch (e) {
      console.error('Failed to fetch status:', e);
    }
  };

  const fetchOmniGridManifest = async () => {
    setLoadingApps(true);
    try {
      const res = await fetch('/api/jamesburvelo/manifest');
      const data = await res.json();
      if (data.success && data.applications) {
        setOmniApps(data.applications);
        if (data.applications.length > 0) {
          setSelectedApp(data.applications[0]);
        }
      }
    } catch (e) {
      console.error('Failed to fetch manifest:', e);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchIso20022 = async () => {
    try {
      const res = await fetch('/api/jamesburvelo/iso20022');
      const data = await res.json();
      if (data.success && data.codeSets) {
        setIsoCodeSets(data.codeSets);
        const firstKey = Object.keys(data.codeSets)[0];
        if (firstKey) setSelectedIsoKey(firstKey);
      }
    } catch (e) {
      console.error('Failed to fetch ISO 20022 codes:', e);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/jamesburvelo/models');
      const data = await res.json();
      if (data.success && data.models) {
        setModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0]);
          loadModelCode(data.models[0].fileName);
        }
      }
    } catch (e) {
      console.error('Failed to fetch models:', e);
    }
  };

  const loadModelCode = async (fileName: string) => {
    setLoadingModelFile(true);
    try {
      const res = await fetch(`/api/app-file?appFolder=jamesburvelocallaghaniiiand&filePath=models/${encodeURIComponent(fileName)}`);
      const data = await res.json();
      if (data.success) {
        setModelFileContent(data.content);
      } else {
        setModelFileContent(`// Unable to fetch file: ${data.error}`);
      }
    } catch (e: any) {
      setModelFileContent(`// Error loading file: ${e.message}`);
    } finally {
      setLoadingModelFile(false);
    }
  };

  const fetchBonds = async () => {
    try {
      const res = await fetch('/api/jamesburvelo/bonds');
      const data = await res.json();
      if (data.success && data.bonds) {
        setBonds(data.bonds);
        runSimulation(25);
      }
    } catch (e) {
      console.error('Failed to fetch bonds:', e);
    }
  };

  const runSimulation = async (bps: number) => {
    setSimulating(true);
    setBasisPointsShock(bps);
    try {
      const res = await fetch('/api/jamesburvelo/simulations/interest-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changeBasisPoints: bps, portfolioValue: 10000000 })
      });
      const data = await res.json();
      if (data.success && data.simulation) {
        setSimResults(data.simulation);
      }
    } catch (e) {
      console.error('Simulation failed:', e);
    } finally {
      setSimulating(false);
    }
  };

  const fetchSubpackages = async () => {
    try {
      const res = await fetch('/api/jamesburvelo/subpackages');
      const data = await res.json();
      if (data.success && data.packages) {
        setSubpackages(data.packages);
        if (data.packages.length > 0) setSelectedSubpackage(data.packages[0]);
      }
    } catch (e) {
      console.error('Failed to fetch subpackages:', e);
    }
  };

  const fetchArchitecture = async () => {
    try {
      const res = await fetch('/api/jamesburvelo/architecture');
      const data = await res.json();
      if (data.success) setArchManifest(data);
    } catch (e) {
      console.error('Failed to fetch architecture:', e);
    }
  };

  // Domains for filtering OmniGrid apps
  const domains = ['All', ...Array.from(new Set(omniApps.map((a) => a.domain)))];

  const filteredApps = omniApps.filter((a) => {
    const matchesDomain = selectedDomain === 'All' || a.domain === selectedDomain;
    const matchesSearch =
      a.id.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.function.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.description.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.integrations.some((i) => i.toLowerCase().includes(appSearch.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const filteredIsoKeys = Object.keys(isoCodeSets).filter((k) =>
    k.toLowerCase().includes(isoSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sovereign Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0B0F19] p-8 border border-indigo-500/20 shadow-2xl text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                James Burvelo O'Callaghan III
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                ACTIVE IN PACKAGES
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-indigo-400" />
              DonOne AI Banking Consortium & Aether Mesh
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Enterprise financial architecture featuring 75 standalone OmniGrid AI applications, 150 ISO 20022 external code sets,
              14 full-lifecycle data models, bond trading sensitivity engine, and 21 monorepo subpackages unpacked in <code className="text-indigo-300 bg-slate-800/80 px-1.5 py-0.5 rounded font-mono text-xs">packages/jamesburvelocallaghaniiiand</code>.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm">
            <div className="text-center px-3 py-2 bg-slate-800/50 rounded-lg">
              <div className="text-xl font-bold text-indigo-400 font-mono">75</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">AI Apps</div>
            </div>
            <div className="text-center px-3 py-2 bg-slate-800/50 rounded-lg">
              <div className="text-xl font-bold text-emerald-400 font-mono">150</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">ISO 20022</div>
            </div>
            <div className="text-center px-3 py-2 bg-slate-800/50 rounded-lg">
              <div className="text-xl font-bold text-amber-400 font-mono">14</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Data Models</div>
            </div>
            <div className="text-center px-3 py-2 bg-slate-800/50 rounded-lg">
              <div className="text-xl font-bold text-sky-400 font-mono">21</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Packages</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex items-center gap-2 border-b border-slate-700/60 overflow-x-auto pb-px">
          {[
            { id: 'omnigrid', label: '75 OmniGrid Apps', icon: Cpu },
            { id: 'iso20022', label: 'ISO 20022 Standards', icon: Globe2 },
            { id: 'models', label: '14 Financial Models', icon: Database },
            { id: 'bonds', label: 'Bond Trading & Yield Shock', icon: TrendingUp },
            { id: 'subpackages', label: '21 Monorepo Packages', icon: Boxes },
            { id: 'manifest', label: 'Master Architecture', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-indigo-400 text-white bg-slate-800/60 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: 75 OmniGrid AI Applications */}
      {activeTab === 'omnigrid' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Search by ID, function, vendor (OpenAI, Groq, Cohere)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Domain:
              </span>
              {domains.map((dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedDomain === dom
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Apps List */}
            <div className="lg:col-span-1 space-y-2 max-h-[640px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredApps.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-sm">
                  No matching OmniGrid applications found.
                </div>
              ) : (
                filteredApps.map((app) => {
                  const isSelected = selectedApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono font-semibold text-indigo-400 truncate max-w-[200px]">
                          {app.id}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {app.domain}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-white mb-1">{app.function}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* App Detail Inspector */}
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              {selectedApp ? (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {selectedApp.id}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                          Domain: {selectedApp.domain}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white">{selectedApp.function}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block mb-1">Architecture</span>
                      <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Production Ready
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      Functional Description
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-4 rounded-lg border border-slate-700/60">
                      {selectedApp.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                      <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-2.5 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> Vendor Integrations
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedApp.integrations.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-200 border border-slate-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                      <h4 className="text-xs uppercase tracking-wider text-sky-400 font-semibold mb-2.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> System Dependencies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedApp.dependencies.map((dep) => (
                          <span
                            key={dep}
                            className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 text-indigo-300 border border-slate-700"
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" /> Monetization & Revenue Model
                    </h4>
                    <p className="text-sm text-slate-300">{selectedApp.revenue_model}</p>
                  </div>

                  <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-indigo-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">Universal AetherLink Adapter</div>
                        <div className="text-xs text-slate-400">Circuit breakers & automated dynamic fallback routing active</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                      HEALTHY
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                  Select an OmniGrid application to inspect its architecture.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ISO 20022 Standards */}
      {activeTab === 'iso20022' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-400" />
                ISO 20022 External Code Sets & Message Standards
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Extracted directly from <code className="text-emerald-300 font-mono">packages/jamesburvelocallaghaniiiand/iso20022.ts</code> (150 standard code sets).
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={isoSearch}
                onChange={(e) => setIsoSearch(e.target.value)}
                placeholder="Search code set (e.g. Account, Clearing, Agent)..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-1.5 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredIsoKeys.map((key) => {
                const isSelected = selectedIsoKey === key;
                const count = isoCodeSets[key]?.length || 0;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedIsoKey(key)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-white font-semibold'
                        : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-xs font-mono truncate">{key}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {count} codes
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              {selectedIsoKey ? (
                <div className="space-y-5">
                  <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                        ISO 20022 External Code Group
                      </span>
                      <h3 className="text-lg font-bold text-white font-mono mt-1">{selectedIsoKey}</h3>
                    </div>
                    <span className="px-3 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
                      {(isoCodeSets[selectedIsoKey] || []).length} Valid Codes
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                      Permitted Code Values
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(isoCodeSets[selectedIsoKey] || []).map((code) => (
                        <div
                          key={code}
                          className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-300 hover:border-emerald-500/60 transition-colors shadow-sm"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                      <span>TypeScript Declaration</span>
                      <span className="text-slate-500">iso20022.ts</span>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
{`export type ${selectedIsoKey} = ${(isoCodeSets[selectedIsoKey] || [])
  .map((c) => `'${c}'`)
  .join(' | ')};`}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                  Select an ISO 20022 standard to inspect permitted codes.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 14 Financial Data Models */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              14 Financial Lifecycle Data Models
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Extracted from <code className="text-amber-300 font-mono">packages/jamesburvelocallaghaniiiand/models</code>: Full schema interfaces for subscriptions, customers, plans, invoices, and accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
              {models.map((m) => {
                const isSelected = selectedModel?.fileName === m.fileName;
                return (
                  <div
                    key={m.fileName}
                    onClick={() => {
                      setSelectedModel(m);
                      loadModelCode(m.fileName);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-md'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 truncate">
                        {m.modelName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {(m.sizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {m.exports.map((exp) => (
                        <span key={exp} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              {selectedModel ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-mono text-amber-400 uppercase font-bold">Data Model Schema</span>
                      <h3 className="text-lg font-bold text-white font-mono">{selectedModel.fileName}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Exports: {selectedModel.exports.join(', ')}
                    </span>
                  </div>

                  <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-4 max-h-[480px] overflow-y-auto font-mono text-xs text-slate-300">
                    {loadingModelFile ? (
                      <div className="py-12 text-center text-slate-500">Loading model definition...</div>
                    ) : (
                      <pre className="whitespace-pre-wrap">{modelFileContent}</pre>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                  Select a data model to view its TypeScript schema.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Bond Trading & Yield Shock Simulator */}
      {activeTab === 'bonds' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  Institutional Bond Portfolio & Macro Yield Shock Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluates portfolio duration risk and estimated P&L shifts across sovereign and investment-grade corporate bonds using Modified Duration (ΔP/P ≈ -D × Δy).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Shock Basis Points:</span>
                {[-50, -25, 0, 25, 50, 100].map((bps) => (
                  <button
                    key={bps}
                    onClick={() => runSimulation(bps)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                      basisPointsShock === bps
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {bps > 0 ? `+${bps}` : bps} bps
                  </button>
                ))}
              </div>
            </div>

            {simResults && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Aggregate Portfolio Impact ($10M AUM)</div>
                  <div className={`text-xl font-mono font-bold mt-1 ${simResults.aggregatePnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {simResults.aggregatePnL >= 0 ? '+' : ''}${simResults.aggregatePnL.toLocaleString()} ({simResults.aggregateReturnPct >= 0 ? '+' : ''}{simResults.aggregateReturnPct}%)
                  </div>
                </div>

                <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Applied Interest Rate Shift</div>
                  <div className="text-xl font-mono font-bold text-indigo-400 mt-1">
                    {basisPointsShock > 0 ? `+${basisPointsShock}` : basisPointsShock} bps ({basisPointsShock / 100}%)
                  </div>
                </div>

                <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Duration Risk Classification</div>
                  <div className="text-base font-mono font-bold text-amber-400 mt-1">
                    {simResults.riskAssessment}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Sovereign & Corporate Bond Inventory</span>
              <span className="text-xs font-mono text-slate-400">5 Active Benchmark Positions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">ISIN</th>
                    <th className="py-3 px-4">Bond Name</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Base Price</th>
                    <th className="py-3 px-4">Simulated Price</th>
                    <th className="py-3 px-4">Price Change</th>
                    <th className="py-3 px-4">Base Yield</th>
                    <th className="py-3 px-4">Simulated Yield</th>
                    <th className="py-3 px-4 text-right">Est. P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(simResults ? simResults.bonds : bonds.map((b) => ({
                    isin: b.isin,
                    name: b.name,
                    originalPrice: b.price,
                    simulatedPrice: b.price,
                    priceChangePct: 0,
                    originalYield: b.yield,
                    simulatedYield: b.yield,
                    duration: b.duration,
                    estimatedPnL: 0,
                  }))).map((item) => (
                    <tr key={item.isin} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-indigo-400 font-semibold">{item.isin}</td>
                      <td className="py-3 px-4 text-white font-sans font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                          {bonds.find((b) => b.isin === item.isin)?.rating || 'A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{item.duration} yrs</td>
                      <td className="py-3 px-4 text-slate-400">${item.originalPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-white font-bold">${item.simulatedPrice.toFixed(3)}</td>
                      <td className={`py-3 px-4 ${item.priceChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.priceChangePct >= 0 ? '+' : ''}{item.priceChangePct}%
                      </td>
                      <td className="py-3 px-4 text-slate-400">{item.originalYield}%</td>
                      <td className="py-3 px-4 text-indigo-300 font-semibold">{item.simulatedYield}%</td>
                      <td className={`py-3 px-4 text-right font-bold ${item.estimatedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.estimatedPnL >= 0 ? '+' : ''}${item.estimatedPnL.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 21 Monorepo Subpackages */}
      {activeTab === 'subpackages' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-sky-400" />
              21 Monorepo Subpackages in packages/
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Extracted directly into the workspace root <code className="text-sky-300 font-mono">packages/</code> directory, each package is modularized with its own manifest and source tree.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subpackages.map((pkg) => (
              <div
                key={pkg.folder}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-slate-700 hover:bg-slate-900/80 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-400 truncate max-w-[200px]">
                    {pkg.folder}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    v{pkg.version}
                  </span>
                </div>
                <div className="text-sm font-medium text-white">{pkg.name}</div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>packages/{pkg.folder}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Master Architecture Manifest */}
      {activeTab === 'manifest' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Aether Financial Ecosystem: Master Manifest & Primitives
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Architecture specification, Object-Capability security model, and CloudEvents v1.0 messaging.
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono">
                v1.0.0-alpha
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {archManifest?.primitives.map((prim) => (
                <div key={prim.name} className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-indigo-400">{prim.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {prim.standard}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{prim.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono max-h-[400px] overflow-y-auto whitespace-pre-wrap">
              {archManifest?.markdown || 'Loading ecosystem specification...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo, useEffect, useContext } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { CONSOLIDATED_APIS, ConsolidatedAPI } from '../services/consolidatedApiManager';
import { 
  Puzzle, Globe, Zap, Activity, ShieldCheck, Cpu, ArrowRight, 
  CheckCircle2, Trash2, Command, Sparkles, Terminal, Search, 
  RefreshCw, Code2, Rocket, Play, Layers, User, ShieldAlert,
  Sliders, Database, AlignLeft, Send, ExternalLink, HelpCircle
} from 'lucide-react';

// --- Types ---
type MarketplaceSection = 'EXPLORE' | 'CONSOLIDATED_APIS' | 'AGENT_PLAYGROUND' | 'FORGE';

interface Integration {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'beta' | 'new';
  rating: number;
  installs: number;
  uptime: number;
  latency: number;
  tags: string[];
}

// --- Installed Apps ---
const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'int_1', name: 'Salesforce Connect', provider: 'Salesforce', category: 'CRM', description: 'Bi-directional sync of executive relationship data.', icon: <Globe className="text-blue-400" />, status: 'active', rating: 4.9, installs: 12400, uptime: 99.99, latency: 45, tags: ['Enterprise', 'Secure'] },
  { id: 'int_2', name: 'Slack Neural Relay', provider: 'Slack', category: 'Communication', description: 'Direct AI insights pushed to mission-critical channels.', icon: <Zap className="text-purple-400" />, status: 'active', rating: 4.8, installs: 8900, uptime: 99.95, latency: 12, tags: ['Real-time', 'Alerts'] },
  { id: 'int_3', name: 'Dune Analytics Link', provider: 'Dune', category: 'Web3', description: 'Import on-chain whale activity directly into Global Ledger.', icon: <Activity className="text-cyan-400" />, status: 'beta', rating: 4.7, installs: 3200, uptime: 98.4, latency: 120, tags: ['DeFi', 'Analytics'] },
  { id: 'int_4', name: 'Stripe Global Gateway', provider: 'Stripe', category: 'Payments', description: 'Hyper-scale settlement across 135+ currencies.', icon: <ShieldCheck className="text-indigo-400" />, status: 'active', rating: 5.0, installs: 45000, uptime: 100, latency: 8, tags: ['Finance', 'Stable'] },
  { id: 'int_5', name: 'Datadog Sentinel', provider: 'Datadog', category: 'DevOps', description: 'Monitor infrastructure integrity via neural telemetry.', icon: <Cpu className="text-orange-400" />, status: 'active', rating: 4.9, installs: 15600, uptime: 99.99, latency: 32, tags: ['Monitoring', 'Cloud'] },
  { id: 'int_marqeta', name: 'Marqeta Card Issuing', provider: 'Marqeta', category: 'Payments', description: 'Programmatic card issuing and management.', icon: <Zap className="text-yellow-400" />, status: 'active', rating: 4.9, installs: 2100, uptime: 99.99, latency: 15, tags: ['Payments', 'Cards'] },
  { id: 'int_modtreasury', name: 'Modern Treasury', provider: 'Modern Treasury', category: 'Payments', description: 'Automated payment operations and reconciliation.', icon: <ShieldCheck className="text-green-400" />, status: 'active', rating: 4.9, installs: 3500, uptime: 99.99, latency: 10, tags: ['Payments', 'Treasury'] },
];

// --- AI Agent Options ---
interface AIAgent {
  id: string;
  name: string;
  role: string;
  avatar: React.ReactNode;
  specialty: string;
  presetDirectives: string[];
}

const AI_AGENTS: AIAgent[] = [
  {
    id: 'agent_architect',
    name: 'Legion I (Architect AI)',
    role: 'API schema and data structure modeling specialist',
    avatar: <Code2 className="text-cyan-400" />,
    specialty: 'Validates request schemas, drafts JSON templates, and maps candidate models.',
    presetDirectives: [
      'Draft JSON payloader model for CI-051: Identity Verification',
      'Describe field relationships for LS-035: Double-Entry Postings',
      'Explain model properties of CC-069: Issuing Corporate Cards'
    ]
  },
  {
    id: 'agent_auditor',
    name: 'Legion V (Auditor Compliance AI)',
    role: 'Security bounds, SOX compliance and risk auditor',
    avatar: <ShieldCheck className="text-green-400" />,
    specialty: 'Audits transaction limits, verifies data privacy blindings, and processes compliance flags.',
    presetDirectives: [
      'Audit privacy parameters of CI-060: Privacy Blinder',
      'Check transaction compliance for PO-023: ACH reversal',
      'Validate terms of service clearance on CI-063'
    ]
  },
  {
    id: 'agent_quantum',
    name: 'Quantum Advisor XI',
    role: 'Predictive financial modeling & macro simulation vector',
    avatar: <Activity className="text-purple-400" />,
    specialty: 'Forecasts cash flow impact, treasury margins, and suggests yield optimizations.',
    presetDirectives: [
      'Simulate treasury liquidity positions on AI-111',
      'Predict portfolio cash flow yield models with W3-095',
      'Suggest margin safeguards for LS-042 credit limits'
    ]
  }
];

const IntegrationsMarketplaceView: React.FC = () => {
  const context = useContext(DataContext);
  const sessionId = context?.sessionId;
  const [section, setSection] = useState<MarketplaceSection>('CONSOLIDATED_APIS');
  
  // --- Search & Filtering States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | ConsolidatedAPI['category']>('All');
  const [apis, setApis] = useState<ConsolidatedAPI[]>(CONSOLIDATED_APIS);

  // --- Active Selected API ---
  const [selectedApiId, setSelectedApiId] = useState<string>('CB-001');
  const currentSelectedApi = useMemo(() => {
    return apis.find(a => a.id === selectedApiId) || apis[0];
  }, [apis, selectedApiId]);

  // --- JSON Editor State ---
  const [inputPayload, setInputPayload] = useState<string>('{}');

  // Trigger loading payload template whenever selected API changes
  useEffect(() => {
    if (currentSelectedApi) {
      setInputPayload(JSON.stringify(currentSelectedApi.payloadTemplate, null, 2));
    }
  }, [currentSelectedApi]);

  // --- Live Execution States ---
  const [execStatus, setExecStatus] = useState<'idle' | 'executing' | 'success' | 'error'>('idle');
  const [execResponse, setExecResponse] = useState<any>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [rtLatency, setRtLatency] = useState<number | null>(null);

  // --- AI Agent States ---
  const [activeAgent, setActiveAgent] = useState<AIAgent>(AI_AGENTS[0]);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiConsulting, setIsAiConsulting] = useState<boolean>(false);

  // --- Fetch API list dynamically from server on load to ensure sync ---
  useEffect(() => {
    const fetchApis = async () => {
      try {
        const resp = await fetch('/api/v1/consolidated/list', {
          headers: { 'x-session-id': sessionId || '' }
        });
        if (!resp.ok) throw new Error('API server unavailable');
        const data = await resp.json();
        if (data.success && data.apis && data.apis.length > 0) {
          setApis(data.apis);
        }
      } catch (e) {
        console.warn("Could not load dynamic consolidated API list from server, holding native registry.", e);
      }
    };
    fetchApis();
  }, []);

  // Filter list
  const filteredApis = useMemo(() => {
    return apis.filter(api => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        api.id.toLowerCase().includes(query) ||
        api.name.toLowerCase().includes(query) ||
        api.path.toLowerCase().includes(query) ||
        api.model.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === 'All' || api.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [apis, searchQuery, categoryFilter]);

  // Categories extraction
  const categoriesList = useMemo(() => {
    const list: Array<'All' | ConsolidatedAPI['category']> = ['All'];
    apis.forEach(a => {
      if (!list.includes(a.category)) {
        list.push(a.category);
      }
    });
    return list;
  }, [apis]);

  // --- Trigger API Execution ---
  const handleExecuteAPI = async () => {
    setExecStatus('executing');
    setExecResponse(null);
    setRtLatency(null);
    
    const startTime = performance.now();
    const tempLogs = [
      `[${new Date().toLocaleTimeString()}] Request dispatched to secure endpoint gateway...`,
      `[${new Date().toLocaleTimeString()}] Method: ${currentSelectedApi.method} | Path: ${currentSelectedApi.path}`,
    ];
    setTerminalLogs(tempLogs);

    try {
      let parsedJson = {};
      try {
        parsedJson = JSON.parse(inputPayload);
      } catch (err) {
        throw new Error("Invalid Input JSON syntax. Please verify commas and braces.");
      }

      tempLogs.push(`[${new Date().toLocaleTimeString()}] Input payload parsed. Validation matched target Model: ${currentSelectedApi.model}`);
      setTerminalLogs([...tempLogs]);

      const resp = await fetch('/api/v1/consolidated/execute', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId || ''
        },
        body: JSON.stringify({
          apiId: currentSelectedApi.id,
          payload: parsedJson
        })
      });

      if (!resp.ok) {
        throw new Error(`Endpoint returned status ${resp.status}`);
      }

      const resData = await resp.json();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      setRtLatency(latency);

      setExecResponse(resData.response);
      setExecStatus(resData.status === 'success' ? 'success' : 'error');
      
      const allLogs = [
        ...tempLogs,
        ...(resData.logs || []),
        `[${new Date().toLocaleTimeString()}] Transit completed in ${latency}ms with status code ${resp.status}.`
      ];
      setTerminalLogs(allLogs);
    } catch (error: any) {
      setExecStatus('error');
      const errorLogs = [
        ...tempLogs,
        `[${new Date().toLocaleTimeString()}] Transaction Interrupted: ${error.message}`
      ];
      setTerminalLogs(errorLogs);
      setExecResponse({
        error: "Execution interrupted",
        reason: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };

  // --- Trigger AI Agent Consultation ---
  const handleAIConsult = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || aiPrompt || `Provide an architectural breakdown of Consolidated API ${currentSelectedApi.id} (${currentSelectedApi.name}) using model target ${currentSelectedApi.model}. Give code snippets.`;
    if (!overridePrompt && !aiPrompt.trim()) {
      setAiPrompt(promptToSend);
    }
    
    setIsAiConsulting(true);
    setAiResponse('');

    try {
      const response = await fetch('/api/v1/ai/forge', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId || ''
        },
        body: JSON.stringify({
          aiPrompt: `You are ${activeAgent.name}. Role: ${activeAgent.role}. Specialty: ${activeAgent.specialty}.
          The user has selected Consolidated API: ${currentSelectedApi.id} (${currentSelectedApi.name}). 
          Path: ${currentSelectedApi.path}.
          Model Class Type: ${currentSelectedApi.model}.
          
          User Instruction / Directive: ${promptToSend}
          
          Formulate a detailed, elegant, structured breakdown explaining how this API functions, what inputs are matched, 
          which of the 1,500 candidate types (such as ${currentSelectedApi.model} or closely related request subcategories) are referenced, 
          and provide illustrative code blocks or payloads. Keep it clean and executive.`
        })
      });

      if (!response.ok) throw new Error('AI Bridge link interrupted.');
      
      const resJSON = await response.json();
      setAiResponse(resJSON.text);
    } catch (err: any) {
      setAiResponse(`Neural link connection breached. Exception: ${err.message}. Recommended action: Deploy security blinder and try again.`);
    } finally {
      setIsAiConsulting(false);
    }
  };

  // Helpers for formatting response method capsules
  const getMethodStyle = (m: string) => {
    switch (m) {
      case 'GET': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'POST': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'PATCH':
      case 'PUT': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DELETE': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen space-y-8 p-6 md:p-8 animate-in fade-in duration-500 bg-black text-white selection:bg-cyan-500 selection:text-black">
      {/* Top Banner / Navigation */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-gray-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.4em]">Sovereignty API Mesh Fabric</h2>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
            Consolidation Center
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-light">
            We mapped and unified 1,500 backend candidate types down to <span className="text-cyan-400 font-bold">120 elegant system APIs</span> managed by our interactive AI Agent Legions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 p-1.5 bg-gray-950 border border-gray-800 rounded-2xl md:rounded-3xl">
          {(['CONSOLIDATED_APIS', 'AGENT_PLAYGROUND', 'EXPLORE', 'FORGE'] as MarketplaceSection[]).map(sec => (
            <button 
              key={sec}
              onClick={() => setSection(sec)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl md:rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                section === sec 
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.35)]' 
                  : 'text-gray-500 hover:text-white hover:bg-gray-900'
              }`}
            >
              {sec === 'CONSOLIDATED_APIS' && <Sliders size={14} />}
              {sec === 'AGENT_PLAYGROUND' && <User size={14} />}
              {sec === 'EXPLORE' && <Globe size={14} />}
              {sec === 'FORGE' && <Sparkles size={14} />}
              {sec.replace('_', ' ')}
            </button>
          ))}
        </div>
      </header>

      {/* SECTION 1: CONSOLIDATED 120 API INTERACTIVE LAB */}
      {section === 'CONSOLIDATED_APIS' && (
        <div className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Filtering & 120 API List (Width 4/12) */}
          <div className="col-span-12 xl:col-span-5 flex flex-col gap-4">
            
            <div className="bg-gray-950 border border-gray-900 p-5 rounded-[2rem] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                  <Database size={16} /> Directory Indexes
                </h3>
                <span className="text-xs font-mono text-gray-400 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded-full uppercase">
                  {filteredApis.length} of {apis.length}
                </span>
              </div>
              
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input 
                  type="text"
                  placeholder="Search API Name, Model, or Path (e.g. CB-010)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-black/60 border border-gray-900 focus:border-cyan-500/50 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none font-sans text-white transition-all placeholder:text-gray-600"
                />
              </div>

              {/* Category Pill Filters */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all ${
                      categoryFilter === cat 
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                        : 'bg-black text-gray-500 border-gray-900 hover:text-white hover:border-gray-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable list of 120 APIs */}
            <div className="bg-gray-950 border border-gray-900 rounded-[2rem] p-4 h-[550px] overflow-y-auto space-y-2 select-none scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              {filteredApis.length > 0 ? (
                filteredApis.map(api => {
                  const isSelected = api.id === selectedApiId;
                  return (
                    <div
                      key={api.id}
                      onClick={() => setSelectedApiId(api.id)}
                      className={`group p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-3.5 ${
                        isSelected 
                          ? 'bg-cyan-500/5 border-cyan-500/30 shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]' 
                          : 'bg-black/30 border-transparent hover:border-gray-800 hover:bg-gray-900/10'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-mono text-cyan-500/80 font-black mb-1.5 uppercase bg-black px-1.5 py-0.5 rounded border border-gray-900">
                          {api.id}
                        </span>
                        <div className={`text-[10px] font-mono font-bold uppercase border px-1.5 py-0.5 rounded min-w-[50px] text-center ${getMethodStyle(api.method)}`}>
                          {api.method}
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <h4 className={`text-sm font-bold text-left transition-colors font-sans ${
                          isSelected ? 'text-cyan-400' : 'text-gray-300 group-hover:text-white'
                        }`}>
                          {api.name}
                        </h4>
                        <p className="text-[11px] font-mono text-gray-600 truncate text-left select-text">
                          {api.path}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[9px] font-mono text-gray-500 font-bold uppercase">
                            Model: <span className="text-cyan-500/75 select-text">{api.model}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-3">
                  <Database className="animate-bounce" size={28} />
                  <p className="text-sm font-mono uppercase tracking-widest text-center">No unified APIs match parameters</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Code Sandbox & AI Auditor (Width 7/12) */}
          <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">

            {/* Title / Info card of the selected API */}
            <div className="bg-gray-950 border border-gray-900 p-6 rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Code2 size={120} />
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-black uppercase">
                  {currentSelectedApi.id}
                </span>
                <span className={`text-xs font-mono border px-3 py-1 rounded-full font-black uppercase ${getMethodStyle(currentSelectedApi.method)}`}>
                  {currentSelectedApi.method}
                </span>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest border border-gray-800 px-3 py-1 rounded-full bg-black/40">
                  Target Model: <span className="text-white select-text">{currentSelectedApi.model}</span>
                </p>
              </div>

              <h2 className="text-3xl font-black font-sans text-white tracking-tight text-left">
                {currentSelectedApi.name}
              </h2>
              <p className="text-sm text-gray-400 mt-2 text-left font-light leading-relaxed">
                {currentSelectedApi.description}
              </p>
              <div className="mt-4 p-3 bg-black border border-gray-900/60 rounded-xl font-mono text-xs text-cyan-400 text-left select-text break-all">
                {currentSelectedApi.method} <span className="text-white ml-2">{currentSelectedApi.path}</span>
              </div>
            </div>

            {/* Split Panel: Left input JSON Payload, Right Terminal Logs & Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Input JSON Editor */}
              <div className="bg-gray-950 border border-gray-900 rounded-[2rem] p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                    <Sliders size={14} /> Request Body JSON [Payload]
                  </h3>
                  <button 
                    onClick={() => setInputPayload(JSON.stringify(currentSelectedApi.payloadTemplate, null, 2))}
                    className="text-[10px] font-mono text-gray-400 hover:text-white uppercase transition-colors"
                  >
                    Reset Template
                  </button>
                </div>
                
                <textarea
                  value={inputPayload}
                  onChange={e => setInputPayload(e.target.value)}
                  className="w-full h-80 bg-black/80 font-mono text-xs p-4 rounded-xl text-cyan-300 border border-gray-900 focus:border-cyan-500/50 focus:outline-none resize-none select-text"
                />

                <button
                  onClick={handleExecuteAPI}
                  disabled={execStatus === 'executing'}
                  className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50"
                >
                  {execStatus === 'executing' ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                  Execute API Transaction
                </button>
              </div>

              {/* Execution Console & Live Feed */}
              <div className="bg-gray-950 border border-gray-900 rounded-[2rem] p-5 flex flex-col gap-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                    <Terminal size={14} /> Live Gateway Terminal
                  </h3>
                  {rtLatency && (
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      {rtLatency}ms
                    </span>
                  )}
                </div>

                {/* Simulated Terminal logs */}
                <div className="bg-black/80 p-3 rounded-lg border border-gray-900 h-36 overflow-y-auto text-left font-mono text-[9px] text-gray-500 space-y-1 select-text scrollbar-thin scrollbar-thumb-gray-800">
                  {terminalLogs.length > 0 ? (
                    terminalLogs.map((log, index) => (
                      <div key={index} className={log.includes('error') ? 'text-rose-400' : 'text-gray-400'}>
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-600 italic">Console is currently offline. Execute API above to wake.</div>
                  )}
                </div>

                {/* Consolidated Response JSON Viewer */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="text-left text-[11px] font-mono text-gray-400 font-bold">Structured JSON Response:</div>
                  <div className="bg-black/90 p-4 rounded-xl border border-gray-900 flex-1 overflow-y-auto max-h-48 text-left font-mono text-xs text-emerald-300 select-text scrollbar-thin scrollbar-thumb-gray-800">
                    {execResponse ? (
                      <pre className="whitespace-pre-wrap">{JSON.stringify(execResponse, null, 2)}</pre>
                    ) : (
                      <div className="text-gray-600 italic">No transaction data loaded. Click 'Execute API' to query the dynamic synthesis mock generator.</div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* AI Legion Consultation box linked directly to this API */}
            <div className="bg-gradient-to-r from-gray-950 via-slate-950 to-gray-950 border border-cyan-500/10 p-6 rounded-[2.5rem] flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-gray-900">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-cyan-950/40 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                    <Sparkles className="text-cyan-400" size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-white">AI Legion Advisory Service</h4>
                    <p className="text-[11px] font-mono text-gray-500">Selected Agent: <span className="text-cyan-400 font-bold">{activeAgent.name}</span></p>
                  </div>
                </div>
                
                {/* Agent Dropdown Selector */}
                <div className="flex gap-1.5 p-1 bg-black border border-gray-800 rounded-xl">
                  {AI_AGENTS.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setActiveAgent(agent);
                        setAiResponse('');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all tracking-wider ${
                        activeAgent.id === agent.id 
                          ? 'bg-cyan-500 text-black font-bold' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {agent.id.replace('agent_', '')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-left text-xs bg-black/40 p-3.5 rounded-xl border border-gray-900/40 text-gray-300 font-light leading-relaxed">
                <span className="font-mono text-cyan-400 uppercase font-black tracking-widest text-[10px] block mb-1">Agent Specialty:</span>
                {activeAgent.specialty}
              </div>

              {/* Preset prompts */}
              <div className="text-left space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Suggested Agent Consultations:</span>
                <div className="flex flex-wrap gap-2">
                  {activeAgent.presetDirectives.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAiPrompt(`Provide deep-level details and draft the model for: ${preset}`);
                        handleAIConsult(`Provide deep-level details and draft the models, structure, and constraints for: ${preset}`);
                      }}
                      className="text-[10px] text-left px-3 py-1.5 bg-black border border-gray-900 hover:border-cyan-500/30 rounded-xl text-gray-400 hover:text-white transition-all font-mono"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversational Prompt Box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Ask ${activeAgent.name} to write, model, or check this API (e.g., Explain model schema mappings)...`}
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAIConsult();
                  }}
                  className="flex-1 bg-black border border-gray-950 focus:border-cyan-500/30 rounded-2xl p-4 text-xs font-mono focus:outline-none select-text"
                />
                <button
                  onClick={() => handleAIConsult()}
                  disabled={isAiConsulting}
                  className="px-6 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAiConsulting ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                  Ask
                </button>
              </div>

              {/* Markdown Response Render Box */}
              {isAiConsulting || aiResponse ? (
                <div className="bg-black/90 rounded-2xl border border-gray-900 p-5 font-mono text-xs text-left max-h-72 overflow-y-auto select-text scrollbar-thin scrollbar-thumb-gray-800">
                  {isAiConsulting ? (
                    <div className="flex items-center gap-2.5 text-cyan-400 font-bold animate-pulse uppercase tracking-[0.2em]">
                      <RefreshCw className="animate-spin" size={14} /> Synaptic response compiling...
                    </div>
                  ) : (
                    <div className="space-y-4 text-gray-300 text-sm font-sans font-light leading-relaxed whitespace-pre-wrap">
                      {aiResponse}
                    </div>
                  )}
                </div>
              ) : null}

            </div>

          </div>

        </div>
      )}

      {/* SECTION 2: AI AGENT INTERACTIVE PLAYGROUND (The central AI adviser panel) */}
      {section === 'AGENT_PLAYGROUND' && (
        <div className="grid grid-cols-12 gap-8 items-stretch">
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <Card title="Active Agent Legion" icon={<User className="text-cyan-400" />}>
              <div className="space-y-4 mt-6">
                {AI_AGENTS.map(agent => (
                  <div
                    key={agent.id}
                    onClick={() => {
                      setActiveAgent(agent);
                      setAiResponse('');
                    }}
                    className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex gap-4 text-left items-start ${
                      activeAgent.id === agent.id 
                        ? 'bg-cyan-500/5 border-cyan-500/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.05)]' 
                        : 'bg-gray-950 border-gray-900 hover:border-gray-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-black border border-gray-800 flex items-center justify-center font-bold">
                      {agent.avatar}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-md font-bold text-white group-hover:text-cyan-400">{agent.name}</h4>
                      <p className="text-xs text-cyan-500">{agent.role}</p>
                      <p className="text-[11px] text-gray-500 pt-1 font-light leading-relaxed">{agent.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="bg-gray-950 border border-gray-900 rounded-[2rem] p-6 text-left space-y-4">
              <h4 className="text-sm font-mono text-cyan-400 uppercase tracking-widest font-black">Consolidated Telemetry</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/60 p-4 rounded-xl border border-gray-900">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Unified Models</span>
                  <p className="text-2xl font-black text-white mt-1">120 APIs</p>
                </div>
                <div className="bg-black/60 p-4 rounded-xl border border-gray-900">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Source Candidates</span>
                  <p className="text-2xl font-black text-white mt-1">1,500 types</p>
                </div>
                <div className="bg-black/60 p-4 rounded-xl border border-gray-900">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Linked Core Enums</span>
                  <p className="text-2xl font-black text-white mt-1">45 classes</p>
                </div>
                <div className="bg-black/60 p-4 rounded-xl border border-gray-900">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">System Uptime</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">100.0%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="bg-gray-950 border border-gray-900 p-8 rounded-[2.5rem] flex-1 flex flex-col gap-5 justify-between">
              
              <div className="flex items-center gap-4 pb-4 border-b border-gray-900 text-left">
                <div className="w-12 h-12 bg-cyan-950 border border-cyan-500/25 rounded-2xl flex items-center justify-center">
                  {activeAgent.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">{activeAgent.name} Workspace</h3>
                  <p className="text-xs text-gray-500 select-all font-mono">{activeAgent.role}</p>
                </div>
              </div>

              {/* Context prompt log */}
              <div className="flex-1 bg-black/50 border border-gray-900 rounded-2xl p-6 min-h-[350px] overflow-y-auto text-left flex flex-col gap-4 select-text scrollbar-thin scrollbar-thumb-gray-800">
                <div className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center font-mono text-[10px] font-bold text-gray-400">
                    HOST
                  </div>
                  <div className="bg-gray-900/30 px-4 py-3 rounded-2xl border border-gray-900 max-w-[85%] text-xs font-light text-gray-300 leading-relaxed">
                    Agent initialized. Consolidated API directory containing 120 endpoints is fully mapped in memory context.
                    Select a preset scenario below or input custom questions to compile dynamic schema blueprints.
                  </div>
                </div>

                {aiResponse && (
                  <>
                    <div className="flex gap-3.5 items-start justify-end">
                      <div className="bg-cyan-500/5 px-4 py-3 rounded-2xl border border-cyan-500/20 max-w-[85%] text-xs font-mono text-cyan-300 text-left">
                        {aiPrompt || "Analyze targeted API models."}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center font-mono text-[10px] font-bold text-cyan-400">
                        USER
                      </div>
                    </div>

                    <div className="flex gap-3.5 items-start">
                      <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center font-mono">
                        {activeAgent.avatar}
                      </div>
                      <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 max-w-[85%] text-sm font-sans font-light text-gray-300 space-y-4 leading-relaxed whitespace-pre-wrap">
                        {aiResponse}
                      </div>
                    </div>
                  </>
                )}

                {isAiConsulting && (
                  <div className="flex gap-3.5 items-center justify-center py-10 text-cyan-400 animate-pulse font-mono tracking-widest uppercase text-xs">
                    <RefreshCw className="animate-spin" size={14} /> Agent actively reconciling schema mappings...
                  </div>
                )}
              </div>

              {/* Playground Controls */}
              <div className="space-y-4">
                <div className="text-left space-y-1.5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Launch Multi-Agent Preset Directives:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setAiPrompt("Generate full schema audit of all 120 Consolidated APIs highlighting high risk payment paths.");
                        handleAIConsult("Generate full schema audit of all 120 Consolidated APIs highlighting high risk payment paths.");
                      }}
                      className="text-[10px] px-3.5 py-2 bg-black border border-gray-900 hover:border-cyan-500/30 rounded-xl text-gray-400 hover:text-white transition-all font-mono"
                    >
                      Audit Payment APIs Trace
                    </button>
                    <button
                      onClick={() => {
                        setAiPrompt("Map dual balanced debits and credits triggers across our Ledgers & Settlement endpoints (LS-031 to LS-050).");
                        handleAIConsult("Map dual balanced debits and credits triggers across our Ledgers & Settlement endpoints (LS-031 to LS-050).");
                      }}
                      className="text-[10px] px-3.5 py-2 bg-black border border-gray-900 hover:border-cyan-500/30 rounded-xl text-gray-400 hover:text-white transition-all font-mono"
                    >
                      Map Dual Balancing Triggers
                    </button>
                    <button
                      onClick={() => {
                        setAiPrompt("Simulate automated cash forecasts mapping against standard Web3 staking yield positions (W3-095).");
                        handleAIConsult("Simulate automated cash forecasts mapping against standard Web3 staking yield positions (W3-095).");
                      }}
                      className="text-[10px] px-3.5 py-2 bg-black border border-gray-900 hover:border-cyan-500/30 rounded-xl text-gray-400 hover:text-white transition-all font-mono"
                    >
                      Simulate Web3 Yield Safeguards
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder={`Instruct ${activeAgent.name}...`}
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAIConsult();
                    }}
                    className="flex-1 bg-black border border-gray-900 focus:border-cyan-500/30 rounded-2xl p-4 text-xs font-mono focus:outline-none select-text"
                  />
                  <button
                    onClick={() => handleAIConsult()}
                    disabled={isAiConsulting}
                    className="px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-wider text-xs transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isAiConsulting ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                    Execute Prompt
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: EXPLORE APP INTEGRATIONS */}
      {section === 'EXPLORE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {MOCK_INTEGRATIONS.map(app => (
             <div 
               key={app.id}
               className="group bg-gray-950 border border-gray-900 hover:border-cyan-500/30 p-6 rounded-[2rem] transition-all duration-500 relative overflow-hidden text-left"
             >
               <div className="flex items-start gap-4 mb-4">
                 <div className="w-12 h-12 bg-black border border-gray-800 rounded-xl flex items-center justify-center">
                   {app.icon}
                 </div>
                 <div>
                   <h4 className="text-md font-bold text-white group-hover:text-cyan-400 transition-colors uppercase">{app.name}</h4>
                   <p className="text-[10px] font-mono text-gray-500 leading-tight uppercase tracking-widest">{app.provider}</p>
                 </div>
               </div>

               <p className="text-xs text-gray-400 mb-5 leading-relaxed min-h-[40px] font-light">
                 {app.description}
               </p>

               <div className="flex items-center justify-between pt-4 border-t border-gray-900 text-xs">
                 <span className="text-[10px] font-mono font-bold bg-gray-900 border border-gray-800 px-2 py-0.5 rounded text-gray-400">
                    {app.category}
                 </span>
                 <div className="flex items-center gap-1 text-[10px] font-mono uppercase font-black text-cyan-400">
                    <CheckCircle2 size={12} /> Live Sync
                 </div>
               </div>
             </div>
           ))}
        </div>
      )}

      {/* SECTION 4: AI FORGE DESIGN BOARD */}
      {section === 'FORGE' && (
        <div className="grid grid-cols-12 gap-8 items-stretch">
          <div className="col-span-12 lg:col-span-4">
            <Card title="Forge Integration Mesh" icon={<Sparkles className="text-cyan-400" />}>
              <div className="space-y-4 mt-6">
                <p className="text-xs text-gray-400 text-left font-light leading-relaxed">
                  Submit design instructions describing a custom payment mesh, zero-knowledge ledger, or cross-chain gateway. The advisor will synthesize an ISO-compliant technical roadmap.
                </p>
                <textarea 
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="e.g., Synthesize a balanced zero-knowledge credit card billing system mapped with modern treasury ACH returns..."
                  className="w-full h-40 bg-black border border-gray-900 rounded-xl p-4 text-xs font-mono text-white focus:border-cyan-500 outline-none resize-none select-text"
                />
                <button 
                  onClick={() => handleAIConsult(`FORGE INTEGRATION SYSTEM DIRECTIVE: ${aiPrompt}`)}
                  disabled={isAiConsulting}
                  className="w-full py-4 bg-cyan-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-400 text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAiConsulting ? <RefreshCw className="animate-spin" size={14} /> : <Rocket size={14} />}
                  INITIALIZE FORGE MESH
                </button>
              </div>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-gray-950 border border-gray-900 rounded-[2.5rem] p-6 h-full min-h-[500px] flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-900 pb-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                  <Code2 size={14} /> Synthesized Enterprise Blueprint
                </h3>
                <span className="text-[9px] font-mono text-gray-500 uppercase">ISO20022 Schema Standard</span>
              </div>
              
              <div className="flex-1 bg-black/60 border border-gray-900/60 rounded-xl p-6 overflow-y-auto text-left font-mono text-xs text-cyan-300 max-h-[480px] select-text scrollbar-thin scrollbar-thumb-gray-800">
                {isAiConsulting ? (
                  <div className="flex flex-col items-center justify-center h-full text-cyan-400 animate-pulse gap-3 font-bold uppercase tracking-widest">
                    <RefreshCw className="animate-spin" size={32} />
                    SYNTHESIZING SYSTEM INTEGRATION DIRECTIVES...
                  </div>
                ) : aiResponse ? (
                  <div className="whitespace-pre-wrap text-sm font-sans font-light text-gray-300 leading-relaxed space-y-4">
                    {aiResponse}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-25">
                    <Code2 size={48} className="mb-4 text-gray-500" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Awaiting Directive Input</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsMarketplaceView;

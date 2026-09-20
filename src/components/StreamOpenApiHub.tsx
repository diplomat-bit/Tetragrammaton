import React, { useState, useEffect } from 'react';
import {
  Layers,
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Code2,
  RefreshCw,
  Terminal,
  Send,
  Database,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

interface SpecSummary {
  filename: string;
  title: string;
  version: string;
  description: string;
  endpointCount: number;
  endpoints: Array<{
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    summary: string;
    tags?: string[];
  }>;
}

interface EndpointDetail {
  id: string;
  specFile: string;
  specTitle: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  summary: string;
  description?: string;
  tags?: string[];
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema?: any;
    example?: any;
  }>;
  requestBody?: {
    required?: boolean;
    description?: string;
    example?: any;
    schema?: any;
  };
  responses?: Record<string, any>;
}

export function StreamOpenApiHub() {
  const [specs, setSpecs] = useState<SpecSummary[]>([]);
  const [selectedSpecFilename, setSelectedSpecFilename] = useState<string>('openapi.yaml');
  const [endpoints, setEndpoints] = useState<EndpointDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({});

  // Execution state per endpoint
  const [requestStates, setRequestStates] = useState<Record<string, {
    pathParams: Record<string, string>;
    queryParams: Record<string, string>;
    headers: Record<string, string>;
    body: string;
  }>>({});

  const [responseStates, setResponseStates] = useState<Record<string, {
    loading: boolean;
    result?: any;
    error?: string;
  }>>({});

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecs();
  }, []);

  const fetchSpecs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stream/specs');
      const data = await res.json();
      if (data.success && data.specs) {
        setSpecs(data.specs);
        const defaultSpec = data.specs.find((s: any) => s.filename === 'openapi.yaml') || data.specs[0];
        if (defaultSpec) {
          setSelectedSpecFilename(defaultSpec.filename);
          fetchSpecDetails(defaultSpec.filename);
        }
      }
    } catch (err) {
      console.error('Error fetching stream specs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecDetails = async (filename: string) => {
    try {
      const res = await fetch(`/api/stream/spec/${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (data.success && data.endpoints) {
        setEndpoints(data.endpoints);
        // Expand the first 2 endpoints automatically
        const initExpanded: Record<string, boolean> = {};
        const initReqStates: Record<string, any> = {};

        data.endpoints.forEach((ep: EndpointDetail, idx: number) => {
          if (idx < 2) initExpanded[ep.id] = true;

          // Default request body example
          let defaultBody = '';
          if (ep.requestBody?.example) {
            defaultBody = JSON.stringify(ep.requestBody.example, null, 2);
          } else if (['POST', 'PUT', 'PATCH'].includes(ep.method)) {
            defaultBody = JSON.stringify({ exampleField: 'test_value' }, null, 2);
          }

          // Default params
          const initPathParams: Record<string, string> = {};
          const initQueryParams: Record<string, string> = {};
          const initHeaders: Record<string, string> = {
            'x-api-key': 'sk_live_aibanking_9f83a82e71d4b609c217',
          };

          ep.parameters?.forEach(p => {
            if (p.in === 'path') initPathParams[p.name] = p.example || 'key-master-001';
            if (p.in === 'query') initQueryParams[p.name] = p.example || '';
            if (p.in === 'header') initHeaders[p.name] = p.example || '';
          });

          initReqStates[ep.id] = {
            pathParams: initPathParams,
            queryParams: initQueryParams,
            headers: initHeaders,
            body: defaultBody,
          };
        });

        setExpandedEndpoints(initExpanded);
        setRequestStates(initReqStates);
      }
    } catch (err) {
      console.error('Error fetching spec detail:', err);
    }
  };

  const handleSelectSpec = (filename: string) => {
    setSelectedSpecFilename(filename);
    fetchSpecDetails(filename);
  };

  const toggleEndpoint = (id: string) => {
    setExpandedEndpoints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCallEndpoint = async (ep: EndpointDetail) => {
    const reqState = requestStates[ep.id] || { pathParams: {}, queryParams: {}, headers: {}, body: '' };

    setResponseStates(prev => ({
      ...prev,
      [ep.id]: { loading: true },
    }));

    try {
      let parsedBody: any = null;
      if (['POST', 'PUT', 'PATCH'].includes(ep.method) && reqState.body.trim()) {
        try {
          parsedBody = JSON.parse(reqState.body);
        } catch {
          parsedBody = reqState.body;
        }
      }

      const payload = {
        specFile: ep.specFile,
        method: ep.method,
        path: ep.path,
        pathParams: reqState.pathParams,
        queryParams: reqState.queryParams,
        headers: reqState.headers,
        body: parsedBody,
      };

      const res = await fetch('/api/stream/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponseStates(prev => ({
        ...prev,
        [ep.id]: { loading: false, result: data },
      }));
    } catch (err: any) {
      setResponseStates(prev => ({
        ...prev,
        [ep.id]: { loading: false, error: err.message },
      }));
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'POST':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PUT':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  const filteredEndpoints = endpoints.filter(ep => {
    const matchesSearch =
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ep.description && ep.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMethod = selectedMethod === 'ALL' || ep.method === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-lime-500/20 to-emerald-500/20 rounded-xl border border-lime-500/30 text-lime-400">
              <FolderOpen size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Stream OpenAPI Live Gateway</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-lime-500/10 text-lime-400 border border-lime-500/20">
                  /stream directory
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Dynamic components & live client engine for all OpenAPI specifications in <span className="font-mono text-white">stream/</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSpecs}
              className="flex items-center space-x-2 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-gray-200 rounded-lg text-xs font-medium border border-[#30363D] transition-colors"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-lime-400' : ''} />
              <span>Refresh Specs</span>
            </button>
          </div>
        </div>

        {/* Spec Switcher Pills */}
        <div className="mt-6 pt-5 border-t border-[#30363D]/60 flex flex-wrap gap-2">
          {specs.map(spec => (
            <button
              key={spec.filename}
              onClick={() => handleSelectSpec(spec.filename)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedSpecFilename === spec.filename
                  ? 'bg-lime-500/15 text-lime-400 border border-lime-500/40 shadow-sm'
                  : 'bg-[#0D1117] text-gray-400 hover:text-gray-200 border border-[#30363D]'
              }`}
            >
              <Code2 size={13} />
              <span className="font-mono">{spec.filename}</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/10 text-gray-300">
                {spec.endpointCount} endpoints
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="text"
            placeholder="Search paths, summaries, tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-lime-500/60"
          />
        </div>

        <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map(method => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                selectedMethod === method
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {filteredEndpoints.length === 0 ? (
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-12 text-center text-gray-400">
            <Layers size={32} className="mx-auto mb-3 text-gray-500" />
            <p className="text-sm font-medium">No endpoints matching your filter.</p>
          </div>
        ) : (
          filteredEndpoints.map(ep => {
            const isExpanded = !!expandedEndpoints[ep.id];
            const reqState = requestStates[ep.id] || { pathParams: {}, queryParams: {}, headers: {}, body: '' };
            const respState = responseStates[ep.id];

            return (
              <div
                key={ep.id}
                className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                {/* Endpoint Header Row */}
                <div
                  onClick={() => toggleEndpoint(ep.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] select-none"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getMethodBadgeClass(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-sm font-semibold text-white truncate">
                      {ep.path}
                    </span>
                    <span className="text-xs text-gray-400 hidden md:inline truncate">
                      — {ep.summary}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-400">
                    {respState?.result && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        respState.result.statusCode >= 200 && respState.result.statusCode < 300
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {respState.result.statusCode} {respState.result.statusText}
                      </span>
                    )}
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>

                {/* Expanded Interactive Body */}
                {isExpanded && (
                  <div className="border-t border-[#30363D] p-6 bg-[#0D1117]/80 space-y-6">
                    {ep.description && (
                      <p className="text-xs text-gray-300 leading-relaxed bg-[#161B22] p-3 rounded-xl border border-[#30363D]/60">
                        {ep.description}
                      </p>
                    )}

                    {/* Parameters Grid */}
                    {ep.parameters && ep.parameters.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Request Parameters
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {ep.parameters.map(p => (
                            <div key={p.name} className="bg-[#161B22] p-3 rounded-xl border border-[#30363D] space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-mono font-bold text-lime-400">{p.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                                  {p.in}
                                </span>
                              </div>
                              {p.description && <p className="text-[11px] text-gray-400">{p.description}</p>}
                              <input
                                type="text"
                                placeholder={p.example ? `Example: ${p.example}` : `Value for ${p.name}`}
                                value={
                                  p.in === 'path'
                                    ? reqState.pathParams[p.name] ?? ''
                                    : p.in === 'query'
                                    ? reqState.queryParams[p.name] ?? ''
                                    : reqState.headers[p.name] ?? ''
                                }
                                onChange={e => {
                                  const val = e.target.value;
                                  setRequestStates(prev => ({
                                    ...prev,
                                    [ep.id]: {
                                      ...reqState,
                                      pathParams: p.in === 'path' ? { ...reqState.pathParams, [p.name]: val } : reqState.pathParams,
                                      queryParams: p.in === 'query' ? { ...reqState.queryParams, [p.name]: val } : reqState.queryParams,
                                      headers: p.in === 'header' ? { ...reqState.headers, [p.name]: val } : reqState.headers,
                                    },
                                  }));
                                }}
                                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg py-1 px-2 text-xs text-white font-mono focus:outline-none focus:border-lime-500/60"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Request Body Editor */}
                    {['POST', 'PUT', 'PATCH'].includes(ep.method) && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Request Body (JSON)
                          </h4>
                          {ep.requestBody?.example && (
                            <button
                              onClick={() => {
                                setRequestStates(prev => ({
                                  ...prev,
                                  [ep.id]: {
                                    ...reqState,
                                    body: JSON.stringify(ep.requestBody!.example, null, 2),
                                  },
                                }));
                              }}
                              className="text-[11px] text-lime-400 hover:underline"
                            >
                              Reset to Spec Example
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={6}
                          value={reqState.body}
                          onChange={e => {
                            const val = e.target.value;
                            setRequestStates(prev => ({
                              ...prev,
                              [ep.id]: { ...reqState, body: val },
                            }));
                          }}
                          className="w-full bg-[#161B22] border border-[#30363D] rounded-xl p-3 font-mono text-xs text-gray-200 focus:outline-none focus:border-lime-500/60"
                        />
                      </div>
                    )}

                    {/* Execute Action Bar */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
                        <span>Target:</span>
                        <span className="text-white">http://localhost:3000{ep.path}</span>
                      </div>

                      <button
                        onClick={() => handleCallEndpoint(ep)}
                        disabled={respState?.loading}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        <Send size={13} className={respState?.loading ? 'animate-spin' : ''} />
                        <span>{respState?.loading ? 'Executing Call...' : 'Send Request'}</span>
                      </button>
                    </div>

                    {/* Live Response Panel */}
                    {respState && (
                      <div className="mt-4 pt-4 border-t border-[#30363D]/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                              Response
                            </span>
                            {respState.result && (
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                                  respState.result.statusCode >= 200 && respState.result.statusCode < 300
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  Status: {respState.result.statusCode}
                                </span>
                                <span className="flex items-center space-x-1 text-xs text-gray-400 font-mono">
                                  <Clock size={12} />
                                  <span>{respState.result.durationMs}ms</span>
                                </span>
                              </div>
                            )}
                          </div>

                          {respState.result && (
                            <button
                              onClick={() => copyToClipboard(JSON.stringify(respState.result.data, null, 2), ep.id)}
                              className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white"
                            >
                              <Copy size={12} />
                              <span>{copiedId === ep.id ? 'Copied!' : 'Copy Body'}</span>
                            </button>
                          )}
                        </div>

                        {respState.error ? (
                          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-mono">
                            Error: {respState.error}
                          </div>
                        ) : (
                          <pre className="bg-[#090D13] border border-[#30363D] p-4 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-80 custom-scrollbar">
                            {respState.result?.data ? JSON.stringify(respState.result.data, null, 2) : 'No response content'}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

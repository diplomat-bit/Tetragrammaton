import React, { useState, useEffect } from 'react';
import {
  Layers, Code2, Play, Copy, Check, RefreshCw, Download, Upload,
  Server, Terminal, FileCode, CheckCircle2, Search, Filter, Globe,
  Sparkles, ExternalLink, Box, ChevronRight, ChevronDown, Send,
  AlertCircle, Shield, FileText, Database, Compass, Eye, TrendingUp, CreditCard, Award
} from 'lucide-react';
import { GeneratedApiExplorer } from '../../api-workbench/generated/components/GeneratedApiExplorer';
import { workbenchSdk } from '../../api-workbench/generated/configs/api-clients';

interface ParameterDef {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  required?: boolean;
  type?: string;
  description?: string;
  example?: any;
  default?: any;
  schema?: any;
}

interface ResponseDef {
  status: string;
  description?: string;
  schema?: any;
  example?: any;
}

interface EndpointDef {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
  operationId?: string;
  summary?: string;
  description?: string;
  tags: string[];
  parameters: ParameterDef[];
  requestBody?: {
    description?: string;
    required?: boolean;
    contentTypes: string[];
    schema?: any;
    samplePayload?: any;
  };
  responses: ResponseDef[];
}

interface ServerDef {
  url: string;
  description?: string;
  environment?: 'production' | 'sandbox' | 'mock' | 'custom';
}

interface XsdElement {
  name: string;
  type?: string;
  documentation?: string;
  minOccurs?: string | number;
  maxOccurs?: string | number;
  ref?: string;
}

interface XsdComplexType {
  name: string;
  documentation?: string;
  baseType?: string;
  derivationType?: 'extension' | 'restriction';
  elements: XsdElement[];
  attributes: Array<{
    name: string;
    type?: string;
    use?: string;
    documentation?: string;
  }>;
}

interface XsdSimpleType {
  name: string;
  documentation?: string;
  baseType?: string;
  enumerations?: string[];
  pattern?: string;
}

interface XsdGroup {
  name: string;
  documentation?: string;
  elements: XsdElement[];
}

interface XsdAttributeGroup {
  name: string;
  documentation?: string;
  attributes: Array<{
    name: string;
    type?: string;
    use?: string;
    documentation?: string;
  }>;
}

interface ParsedSpec {
  id: string;
  fileName: string;
  fileSize: number;
  format: 'openapi_3' | 'swagger_2' | 'xsd' | 'postman' | 'unknown';
  title: string;
  version: string;
  description: string;
  servers: ServerDef[];
  tags: string[];
  endpoints: EndpointDef[];
  schemasCount: number;
  rawSchemas?: Record<string, any>;
  xsdDetails?: {
    targetNamespace?: string;
    version?: string;
    complexTypes: XsdComplexType[];
    simpleTypes: XsdSimpleType[];
    elements: XsdElement[];
    groups: XsdGroup[];
    attributeGroups?: XsdAttributeGroup[];
  };
}

interface WorkbenchCatalog {
  generatedAt: string;
  totalSpecs: number;
  totalEndpoints: number;
  totalXsdTypes: number;
  totalServers: number;
  specs: ParsedSpec[];
}

export const WorkbenchGenerator: React.FC = () => {
  const [catalog, setCatalog] = useState<WorkbenchCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'live-components' | 'specs' | 'endpoints' | 'xsd' | 'artifacts' | 'upload'>('live-components');
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<'all' | 'openapi_3' | 'swagger_2' | 'xsd' | 'postman'>('all');
  const [selectedSpecId, setSelectedSpecId] = useState<string>('');
  
  // Endpoint Explorer state
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef | null>(null);
  const [selectedEndpointSpec, setSelectedEndpointSpec] = useState<ParsedSpec | null>(null);
  const [activeBaseUrl, setActiveBaseUrl] = useState<string>('');
  const [paramInputs, setParamInputs] = useState<Record<string, string>>({});
  const [headerInputs, setHeaderInputs] = useState<Record<string, string>>({
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json',
  });
  const [bodyInput, setBodyInput] = useState<string>('');
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // XSD Explorer state
  const [selectedXsdSpecId, setSelectedXsdSpecId] = useState<string>('');
  const [selectedXsdType, setSelectedXsdType] = useState<XsdComplexType | null>(null);
  const [xsdSearch, setXsdSearch] = useState('');

  // Artifacts state
  const [activeArtifactTab, setActiveArtifactTab] = useState<'catalog' | 'client' | 'env' | 'types' | 'component' | 'readme'>('client');
  const [artifactContents, setArtifactContents] = useState<Record<string, string>>({});

  // Upload modal state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/workbench/catalog');
      if (res.ok) {
        const data: WorkbenchCatalog = await res.json();
        setCatalog(data);
        if (data.specs.length > 0) {
          if (!selectedSpecId) setSelectedSpecId(data.specs[0].id);
          const firstApiSpec = data.specs.find(s => s.endpoints.length > 0);
          if (firstApiSpec && firstApiSpec.endpoints.length > 0) {
            setSelectedEndpointSpec(firstApiSpec);
            setSelectedEndpoint(firstApiSpec.endpoints[0]);
            if (firstApiSpec.servers.length > 0) {
              setActiveBaseUrl(firstApiSpec.servers[0].url);
            }
          }
          const firstXsd = data.specs.find(s => s.format === 'xsd');
          if (firstXsd) {
            setSelectedXsdSpecId(firstXsd.id);
            if (firstXsd.xsdDetails?.complexTypes?.length) {
              setSelectedXsdType(firstXsd.xsdDetails.complexTypes[0]);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  // Update endpoint body when selectedEndpoint changes
  useEffect(() => {
    if (selectedEndpoint) {
      if (selectedEndpoint.requestBody?.samplePayload) {
        setBodyInput(JSON.stringify(selectedEndpoint.requestBody.samplePayload, null, 2));
      } else {
        setBodyInput('');
      }
      setExecutionResult(null);
    }
  }, [selectedEndpoint]);

  const handleRescan = async () => {
    setScanning(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/workbench/scan', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: `Scan complete: Parsed ${data.totalSpecs} specs (${data.totalEndpoints} endpoints, ${data.totalXsdTypes} XSD types).`,
        });
        await fetchCatalog();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to rescan specs.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setScanning(false);
    }
  };

  const handleExecute = async () => {
    if (!selectedEndpoint) return;
    setExecuting(true);
    setExecutionResult(null);

    let fullPath = selectedEndpoint.path;
    const queryParams: Record<string, string> = {};

    selectedEndpoint.parameters.forEach(p => {
      const val = paramInputs[p.name];
      if (val !== undefined && val !== '') {
        if (p.in === 'path') {
          fullPath = fullPath.replace(new RegExp(`\\{${p.name}\\}|:${p.name}`, 'g'), encodeURIComponent(val));
        } else if (p.in === 'query') {
          queryParams[p.name] = val;
        }
      }
    });

    const targetUrl = activeBaseUrl
      ? `${activeBaseUrl.replace(/\/$/, '')}/${fullPath.replace(/^\//, '')}`
      : fullPath;

    let parsedBody: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && bodyInput.trim()) {
      try {
        parsedBody = JSON.parse(bodyInput);
      } catch {
        parsedBody = bodyInput;
      }
    }

    try {
      const res = await fetch('/api/workbench/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          method: selectedEndpoint.method,
          headers: headerInputs,
          queryParams,
          body: parsedBody,
        }),
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err: any) {
      setExecutionResult({ ok: false, error: err.message, status: 0 });
    } finally {
      setExecuting(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName || !uploadContent) return;
    setUploading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/workbench/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: uploadFileName,
          content: uploadContent,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: `File "${uploadFileName}" uploaded and workbench regenerated successfully!`,
        });
        setUploadFileName('');
        setUploadContent('');
        await fetchCatalog();
        setActiveTab('specs');
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Upload failed.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUploadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadContent(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filter specs
  const filteredSpecs = (catalog?.specs || []).filter(s => {
    if (formatFilter !== 'all' && s.format !== formatFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.fileName.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Selected XSD Spec
  const currentXsdSpec = (catalog?.specs || []).find(s => s.id === selectedXsdSpecId);

  // Synthesize XML from XSD complexType
  const generateSampleXml = (ct: XsdComplexType): string => {
    const attrs = (ct.attributes || []).map(a => ` ${a.name}="sample_${a.type || 'str'}"`).join('');
    if (!ct.elements || ct.elements.length === 0) {
      return `<${ct.name}${attrs}>SampleData</${ct.name}>`;
    }
    const children = ct.elements.map(el => {
      return `  <${el.name}>${el.type ? `[${el.type}]` : 'sample_value'}</${el.name}>`;
    }).join('\n');
    return `<${ct.name}${attrs}>\n${children}\n</${ct.name}>`;
  };

  // Generate Curl snippet for selected endpoint
  const generateCurlSnippet = (): string => {
    if (!selectedEndpoint) return '';
    const fullPath = selectedEndpoint.path;
    const targetUrl = activeBaseUrl
      ? `${activeBaseUrl.replace(/\/$/, '')}/${fullPath.replace(/^\//, '')}`
      : `https://api.example.com${fullPath}`;

    let curl = `curl -X ${selectedEndpoint.method} "${targetUrl}"`;
    Object.entries(headerInputs).forEach(([k, v]) => {
      curl += ` \\\n  -H "${k}: ${v}"`;
    });
    if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && bodyInput.trim()) {
      curl += ` \\\n  -d '${bodyInput.replace(/\n/g, ' ')}'`;
    }
    return curl;
  };

  return (
    <div className="space-y-6 text-gray-100">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-[#161b22] via-[#1c2128] to-[#161b22] border border-[#30363D] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    Multi-Spec API & XSD Documentation Workbench
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Automated Generator
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Universal parser for OpenAPI 3.0, Swagger 2.0, Treasury XSD Schemas & Postman Collections.
                </p>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRescan}
              disabled={scanning}
              className="flex items-center space-x-2 px-3.5 py-2 bg-[#21262D] hover:bg-[#30363D] text-gray-200 rounded-lg text-xs font-medium border border-[#30363D] transition shadow-sm"
              title="Rescans api-workbench/source_specs/ and regenerates code"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{scanning ? 'Scanning Specs...' : 'Re-scan & Generate'}</span>
            </button>

            <a
              href="/api/workbench/export-zip"
              download="workbench-generated.zip"
              className="flex items-center space-x-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition shadow-sm shadow-indigo-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Bundle (.ZIP)</span>
            </a>

            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center space-x-2 px-3.5 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-xs font-medium transition shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Spec</span>
            </button>
          </div>
        </div>

        {/* Status banner */}
        {statusMessage && (
          <div className={`mt-4 p-3 rounded-lg text-xs flex items-center justify-between border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
          }`}>
            <span className="flex items-center space-x-2">
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{statusMessage.text}</span>
            </span>
            <button onClick={() => setStatusMessage(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {/* High Level Metrics Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#30363D]/60">
          <div className="bg-[#0D1117]/80 rounded-xl p-3 border border-[#30363D]">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Source Specifications</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-white">{catalog?.totalSpecs ?? '--'}</span>
              <span className="text-[11px] text-indigo-400">Scanned files</span>
            </div>
          </div>

          <div className="bg-[#0D1117]/80 rounded-xl p-3 border border-[#30363D]">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">API Endpoints</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-white">{catalog?.totalEndpoints ?? '--'}</span>
              <span className="text-[11px] text-emerald-400">Interactive</span>
            </div>
          </div>

          <div className="bg-[#0D1117]/80 rounded-xl p-3 border border-[#30363D]">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">XSD Schema Types</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-white">{catalog?.totalXsdTypes ?? '--'}</span>
              <span className="text-[11px] text-purple-400">XML Models</span>
            </div>
          </div>

          <div className="bg-[#0D1117]/80 rounded-xl p-3 border border-[#30363D]">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Server Base URLs</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-white">{catalog?.totalServers ?? '--'}</span>
              <span className="text-[11px] text-amber-400">Environments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center justify-between border-b border-[#30363D] pb-1 overflow-x-auto scrollbar-thin">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('live-components')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === 'live-components'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg ring-1 ring-emerald-400'
                : 'text-emerald-400 hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>⚡ Live Generated Components & SDK</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400 text-black font-extrabold">LIVE</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-400 hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Specifications Catalog ({catalog?.totalSpecs || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('endpoints')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'endpoints'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-400 hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Endpoint Explorer & Tester ({catalog?.totalEndpoints || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('xsd')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'xsd'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-400 hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>XSD Schema Visualizer ({catalog?.totalXsdTypes || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('artifacts')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'artifacts'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-400 hover:text-white hover:bg-[#21262D]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Generated Code & Models</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-[11px] text-gray-500 hidden lg:inline">
            CLI: <code className="bg-[#0D1117] px-2 py-1 rounded text-gray-300">npm run generate:workbench</code>
          </span>
        </div>
      </div>

      {/* =========================================================================
       * TAB 0: LIVE GENERATED REACT COMPONENTS & CLIENT SDK
       * ========================================================================= */}
      {activeTab === 'live-components' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Interactive Generated React Components</p>
                <p className="text-gray-400 text-[11px]">
                  These components are built with the typed Workbench SDK (<code className="text-emerald-300 font-mono">workbenchSdk</code>) and execute live endpoint requests.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30">
                CLIENT: WorkbenchApiClient
              </span>
            </div>
          </div>

          <GeneratedApiExplorer />
        </div>
      )}

      {/* =========================================================================
       * TAB 1: SPECIFICATIONS CATALOG
       * ========================================================================= */}
      {activeTab === 'specs' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161B22] p-3 rounded-xl border border-[#30363D]">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search specs, endpoints, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
              {(['all', 'openapi_3', 'swagger_2', 'xsd', 'postman'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition ${
                    formatFilter === fmt
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                      : 'text-gray-400 hover:bg-[#21262D]'
                  }`}
                >
                  {fmt === 'all' ? 'All' : fmt.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpecs.map(spec => (
              <div
                key={spec.id}
                className="bg-[#161B22] border border-[#30363D] hover:border-indigo-500/50 rounded-xl p-5 flex flex-col justify-between transition group shadow-sm hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      spec.format === 'openapi_3' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      spec.format === 'swagger_2' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      spec.format === 'xsd' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      {spec.format.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">v{spec.version}</span>
                  </div>

                  <h3 className="font-semibold text-sm text-gray-100 line-clamp-1 group-hover:text-indigo-400 transition">
                    {spec.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-1 truncate" title={spec.fileName}>
                    {spec.fileName}
                  </p>

                  {spec.description && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {spec.description}
                    </p>
                  )}

                  {/* Server Base URLs Preview */}
                  {spec.servers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#30363D]/60 space-y-1">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Base URL:</span>
                      <div className="flex items-center justify-between text-[11px] font-mono bg-[#0D1117] p-1.5 rounded border border-[#30363D]/40">
                        <span className="text-indigo-300 truncate max-w-[200px]" title={spec.servers[0].url}>
                          {spec.servers[0].url}
                        </span>
                        <button
                          onClick={() => copyToClipboard(spec.servers[0].url, spec.id)}
                          className="text-gray-400 hover:text-white ml-1 p-0.5"
                          title="Copy Base URL"
                        >
                          {copiedKey === spec.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#30363D] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 text-gray-400">
                    {spec.format === 'xsd' ? (
                      <span className="flex items-center space-x-1 text-purple-300">
                        <Database className="w-3.5 h-3.5" />
                        <span>{spec.schemasCount} Types</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-emerald-400">
                        <Play className="w-3.5 h-3.5" />
                        <span>{spec.endpoints.length} Endpoints</span>
                      </span>
                    )}
                    <span className="text-gray-500">{(spec.fileSize / 1024).toFixed(1)} KB</span>
                  </div>

                  <button
                    onClick={() => {
                      if (spec.format === 'xsd') {
                        setSelectedXsdSpecId(spec.id);
                        if (spec.xsdDetails?.complexTypes?.length) {
                          setSelectedXsdType(spec.xsdDetails.complexTypes[0]);
                        }
                        setActiveTab('xsd');
                      } else {
                        setSelectedEndpointSpec(spec);
                        if (spec.endpoints.length > 0) {
                          setSelectedEndpoint(spec.endpoints[0]);
                        }
                        if (spec.servers.length > 0) {
                          setActiveBaseUrl(spec.servers[0].url);
                        }
                        setActiveTab('endpoints');
                      }
                    }}
                    className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 2: INTERACTIVE ENDPOINT EXPLORER & TESTER
       * ========================================================================= */}
      {activeTab === 'endpoints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Spec & Endpoint Selector */}
          <div className="lg:col-span-4 bg-[#161B22] border border-[#30363D] rounded-2xl p-4 space-y-3 flex flex-col h-[760px]">
            {/* Spec Selector Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Active Specification</label>
              <select
                value={selectedEndpointSpec?.id || ''}
                onChange={(e) => {
                  const targetSpec = (catalog?.specs || []).find(s => s.id === e.target.value);
                  if (targetSpec) {
                    setSelectedEndpointSpec(targetSpec);
                    if (targetSpec.endpoints.length > 0) {
                      setSelectedEndpoint(targetSpec.endpoints[0]);
                    }
                    if (targetSpec.servers.length > 0) {
                      setActiveBaseUrl(targetSpec.servers[0].url);
                    }
                  }
                }}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-indigo-500 font-medium"
              >
                {(catalog?.specs || []).filter(s => s.endpoints.length > 0).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.endpoints.length} endpoints)
                  </option>
                ))}
              </select>
            </div>

            {/* Search within endpoints */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter endpoints by path or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Endpoints List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {(selectedEndpointSpec?.endpoints || [])
                .filter(ep => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return ep.path.toLowerCase().includes(q) || ep.method.toLowerCase().includes(q) || ep.tags.some(t => t.toLowerCase().includes(q));
                })
                .map(ep => {
                  const isSelected = selectedEndpoint?.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEndpoint(ep)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-center space-x-2.5 border ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500/60 text-white shadow-sm'
                          : 'bg-[#0D1117]/50 border-transparent hover:bg-[#21262D] text-gray-300'
                      }`}
                    >
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        ep.method === 'GET' ? 'bg-blue-500/20 text-blue-300' :
                        ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-300' :
                        ep.method === 'PUT' ? 'bg-amber-500/20 text-amber-300' :
                        ep.method === 'DELETE' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {ep.method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[11px] truncate">{ep.path}</p>
                        {ep.summary && <p className="text-[10px] text-gray-500 truncate mt-0.5">{ep.summary}</p>}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Right Column: Interactive Tester & Runner */}
          <div className="lg:col-span-8 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-5 flex flex-col h-[760px] overflow-y-auto scrollbar-thin">
            {selectedEndpoint ? (
              <>
                {/* Header with Path and Run Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded text-xs font-black font-mono tracking-wider ${
                      selectedEndpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                      selectedEndpoint.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      selectedEndpoint.method === 'PUT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}>
                      {selectedEndpoint.method}
                    </span>
                    <div>
                      <h2 className="text-base font-bold font-mono text-white break-all">
                        {selectedEndpoint.path}
                      </h2>
                      {selectedEndpoint.summary && (
                        <p className="text-xs text-gray-400 mt-0.5">{selectedEndpoint.summary}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(generateCurlSnippet(), 'curl')}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition"
                    >
                      {copiedKey === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy cURL</span>
                    </button>

                    <button
                      onClick={handleExecute}
                      disabled={executing}
                      className="flex items-center space-x-2 px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-xs font-semibold shadow-md transition"
                    >
                      {executing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{executing ? 'Sending...' : 'Send Request'}</span>
                    </button>
                  </div>
                </div>

                {/* Server Base URL Selector */}
                <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D] space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                    <span className="flex items-center space-x-1.5">
                      <Server className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Target Base URL</span>
                    </span>
                    {selectedEndpointSpec?.servers && selectedEndpointSpec.servers.length > 1 && (
                      <div className="flex items-center space-x-1.5">
                        {selectedEndpointSpec.servers.map(srv => (
                          <button
                            key={srv.url}
                            onClick={() => setActiveBaseUrl(srv.url)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              activeBaseUrl === srv.url
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-[#21262D] text-gray-400 hover:text-white'
                            }`}
                          >
                            {srv.environment || 'Server'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={activeBaseUrl}
                    onChange={(e) => setActiveBaseUrl(e.target.value)}
                    placeholder="https://sandbox.api.example.com"
                    className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs font-mono text-indigo-300 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Parameters Section */}
                {selectedEndpoint.parameters.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Parameters ({selectedEndpoint.parameters.length})
                      </span>
                    </div>
                    <div className="bg-[#0D1117] border border-[#30363D] rounded-xl divide-y divide-[#30363D]/60 max-h-52 overflow-y-auto">
                      {selectedEndpoint.parameters.map(param => (
                        <div key={param.name} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="space-y-0.5 min-w-[140px]">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-indigo-300 font-semibold">{param.name}</span>
                              {param.required && (
                                <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1 rounded">req</span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              in: {param.in} | type: {param.type || 'string'}
                            </div>
                            {param.description && <p className="text-[11px] text-gray-400">{param.description}</p>}
                          </div>

                          <div className="flex-1 max-w-sm">
                            <input
                              type="text"
                              placeholder={param.default ? String(param.default) : `Value for ${param.name}`}
                              value={paramInputs[param.name] || ''}
                              onChange={(e) => setParamInputs(prev => ({ ...prev, [param.name]: e.target.value }))}
                              className="w-full bg-[#161B22] border border-[#30363D] rounded px-2.5 py-1 text-xs font-mono text-gray-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Body Editor */}
                {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Request Payload (JSON)</span>
                      {selectedEndpoint.requestBody?.samplePayload && (
                        <button
                          onClick={() => setBodyInput(JSON.stringify(selectedEndpoint.requestBody?.samplePayload, null, 2))}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Reset to Sample Data</span>
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={5}
                      value={bodyInput}
                      onChange={(e) => setBodyInput(e.target.value)}
                      placeholder={'{\n  "key": "value"\n}'}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Execution Response Panel */}
                {executionResult && (
                  <div className="space-y-2 pt-2 border-t border-[#30363D]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-300 uppercase tracking-wider">Execution Response</span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          executionResult.ok ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {executionResult.status ? `${executionResult.status} ${executionResult.statusText || ''}` : 'Execution Complete'}
                        </span>
                        {executionResult.durationMs !== undefined && (
                          <span className="text-gray-400 font-mono text-xs">{executionResult.durationMs} ms</span>
                        )}
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(executionResult.data || executionResult, null, 2), 'resp')}
                          className="text-gray-400 hover:text-white p-1"
                          title="Copy JSON Response"
                        >
                          {copiedKey === 'resp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <pre className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 text-xs font-mono text-gray-200 max-h-64 overflow-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(executionResult.data || executionResult, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 space-y-3">
                <Play className="w-12 h-12 stroke-[1.5] text-gray-600" />
                <p className="text-sm font-medium">Select an endpoint on the left to start interactive testing.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 3: XSD XML SCHEMA VISUALIZER
       * ========================================================================= */}
      {activeTab === 'xsd' && (
        <div className="space-y-4">
          {/* Spec Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Select XSD Specification</label>
              <div className="flex items-center space-x-2">
                {(catalog?.specs || []).filter(s => s.format === 'xsd').map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedXsdSpecId(s.id);
                      if (s.xsdDetails?.complexTypes?.length) {
                        setSelectedXsdType(s.xsdDetails.complexTypes[0]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                      selectedXsdSpecId === s.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-[#0D1117] text-gray-300 hover:bg-[#21262D]'
                    }`}
                  >
                    {s.fileName} ({s.schemasCount} types)
                  </button>
                ))}
              </div>
            </div>

            {currentXsdSpec?.xsdDetails?.targetNamespace && (
              <div className="text-right">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Target Namespace</span>
                <span className="font-mono text-xs text-purple-300">{currentXsdSpec.xsdDetails.targetNamespace}</span>
              </div>
            )}
          </div>

          {/* Explorer Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Complex Types & Elements List */}
            <div className="lg:col-span-4 bg-[#161B22] border border-[#30363D] rounded-2xl p-4 space-y-3 h-[700px] flex flex-col">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter complex types or elements..."
                  value={xsdSearch}
                  onChange={(e) => setXsdSearch(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                {(currentXsdSpec?.xsdDetails?.complexTypes || [])
                  .filter(ct => !xsdSearch || ct.name.toLowerCase().includes(xsdSearch.toLowerCase()))
                  .map(ct => (
                    <button
                      key={ct.name}
                      onClick={() => setSelectedXsdType(ct)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                        selectedXsdType?.name === ct.name
                          ? 'bg-purple-600/20 border border-purple-500/50 text-purple-200 font-semibold'
                          : 'bg-[#0D1117]/50 text-gray-300 hover:bg-[#21262D]'
                      }`}
                    >
                      <span className="truncate">{ct.name}</span>
                      <span className="text-[10px] text-gray-500 ml-2 font-sans">
                        {ct.elements?.length || 0} fields
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Right: Type Inspection & Synthesized XML */}
            <div className="lg:col-span-8 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-5 h-[700px] overflow-y-auto scrollbar-thin">
              {selectedXsdType ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-purple-400 font-bold tracking-wider">
                        XSD ComplexType
                      </span>
                      <h3 className="text-lg font-bold font-mono text-white mt-0.5">
                        {selectedXsdType.name}
                      </h3>
                      {selectedXsdType.documentation && (
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed bg-[#0D1117] p-2.5 rounded-lg border border-[#30363D]/60">
                          {selectedXsdType.documentation}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => copyToClipboard(generateSampleXml(selectedXsdType), 'sample-xml')}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-200 rounded-lg border border-[#30363D] transition shrink-0"
                    >
                      {copiedKey === 'sample-xml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Sample XML</span>
                    </button>
                  </div>

                  {/* Child Elements Table */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Child Elements ({selectedXsdType.elements?.length || 0})
                    </h4>
                    <div className="bg-[#0D1117] border border-[#30363D] rounded-xl overflow-hidden divide-y divide-[#30363D]">
                      {(selectedXsdType.elements || []).map(el => (
                        <div key={el.name} className="p-3 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <span className="font-mono text-emerald-400 font-semibold">{el.name}</span>
                            {el.documentation && (
                              <p className="text-[11px] text-gray-400 line-clamp-1">{el.documentation}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-indigo-300 text-[11px] block">{el.type || 'string'}</span>
                            <span className="text-[10px] text-gray-500">min: {el.minOccurs}, max: {el.maxOccurs}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attributes Table */}
                  {selectedXsdType.attributes && selectedXsdType.attributes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Attributes ({selectedXsdType.attributes.length})
                      </h4>
                      <div className="bg-[#0D1117] border border-[#30363D] rounded-xl divide-y divide-[#30363D]">
                        {selectedXsdType.attributes.map(attr => (
                          <div key={attr.name} className="p-2.5 flex items-center justify-between text-xs">
                            <span className="font-mono text-amber-300 font-medium">@{attr.name}</span>
                            <span className="text-gray-400 text-[11px] font-mono">{attr.type || 'string'} ({attr.use})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Synthesized XML Payload */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Synthesized Sample XML Document</span>
                      </span>
                    </div>
                    <pre className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 text-xs font-mono text-amber-300 max-h-56 overflow-auto whitespace-pre leading-relaxed">
                      {generateSampleXml(selectedXsdType)}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500">
                  <Database className="w-12 h-12 text-gray-600 mb-2" />
                  <p className="text-sm">Select an XSD complex type to inspect structure and sample XML.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 4: GENERATED ARTIFACTS BROWSER
       * ========================================================================= */}
      {activeTab === 'artifacts' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <span>Generated Code & Data Models</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Output directory: <code className="bg-[#0D1117] px-2 py-0.5 rounded text-indigo-300">api-workbench/generated/</code>
              </p>
            </div>

            <a
              href="/api/workbench/export-zip"
              download="workbench-generated.zip"
              className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP Bundle</span>
            </a>
          </div>

          {/* Sub-tabs for generated files */}
          <div className="flex items-center space-x-2 border-b border-[#30363D] pb-2 overflow-x-auto scrollbar-thin">
            {[
              { id: 'client', label: 'api-clients.ts (HTTP Client)' },
              { id: 'env', label: 'environments.ts (Base URLs)' },
              { id: 'types', label: 'types.ts (Data Models)' },
              { id: 'component', label: 'GeneratedApiExplorer.tsx (React)' },
              { id: 'readme', label: 'README.md (Documentation)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveArtifactTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition whitespace-nowrap ${
                  activeArtifactTab === tab.id
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 font-semibold'
                    : 'text-gray-400 hover:bg-[#21262D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 relative">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2 border-b border-[#30363D]/60 pb-2">
              <span className="font-mono text-indigo-300">
                {activeArtifactTab === 'client' && 'api-workbench/generated/configs/api-clients.ts'}
                {activeArtifactTab === 'env' && 'api-workbench/generated/configs/environments.ts'}
                {activeArtifactTab === 'types' && 'api-workbench/generated/components/types.ts'}
                {activeArtifactTab === 'component' && 'api-workbench/generated/components/GeneratedApiExplorer.tsx'}
                {activeArtifactTab === 'readme' && 'api-workbench/generated/README.md'}
              </span>
              <button
                onClick={() => {
                  const el = document.getElementById('generated-code-pre');
                  if (el) copyToClipboard(el.innerText, 'artifact-code');
                }}
                className="flex items-center space-x-1 text-gray-400 hover:text-white"
              >
                {copiedKey === 'artifact-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy File</span>
              </button>
            </div>

            <pre
              id="generated-code-pre"
              className="text-xs font-mono text-gray-200 max-h-[500px] overflow-auto whitespace-pre leading-relaxed scrollbar-thin"
            >
              {activeArtifactTab === 'client' && `import { workbenchSdk, createWorkbenchClient } from './api-clients';

// 1. Initialize client or use singleton
const client = createWorkbenchClient({
  baseUrl: 'https://sandbox.api.workbench.local',
  apiKey: 'API_KEY_HERE',
  bearerToken: 'BEARER_TOKEN_HERE'
});

// 2. Brokerage Service: Execute orders & view positions
const accounts = await workbenchSdk.broker.getAccounts();
const order = await workbenchSdk.broker.createOrder({
  symbol: 'NVDA',
  qty: 10,
  side: 'buy',
  type: 'market',
  time_in_force: 'day'
});
console.log('Order Executed:', order.data);

// 3. Digital Banking: Fetch balances & real-time transactions
const transactions = await workbenchSdk.banking.getTransactions('acc_citibank_8820', 10);
const eligibility = await workbenchSdk.banking.checkBalanceTransferEligibility('acc_citibank_8820');

// 4. Rewards & Shop With Points: Check eligibility & redeem
const points = await workbenchSdk.rewards.getShopWithPointsStatus('SWP-MEM-9941');
const redemption = await workbenchSdk.rewards.redeemPoints({
  partnerMemberId: 'SWP-MEM-9941',
  pointsToRedeem: 5000,
  redemptionContext: 'CHECKOUT',
  orderAmount: 50.00,
  currency: 'USD'
});`}

              {activeArtifactTab === 'env' && `export const SPEC_ENVIRONMENTS = {
  "Broker_Trading_Alpaca": {
    "title": "Alpaca Broker API Suite",
    "servers": [
      { "url": "https://broker-api.sandbox.alpaca.markets", "environment": "sandbox" },
      { "url": "https://broker-api.alpaca.markets", "environment": "production" }
    ]
  },
  "Citi_Accounts": {
    "title": "Citi Account Transactions API",
    "servers": [
      { "url": "https://sandbox.api.citibank.com", "environment": "sandbox" },
      { "url": "https://api.citibank.com", "environment": "production" }
    ]
  },
  "PayPal_Checkout": {
    "title": "PayPal Orders & Payments v2",
    "servers": [
      { "url": "https://api-m.sandbox.paypal.com", "environment": "sandbox" },
      { "url": "https://api-m.paypal.com", "environment": "production" }
    ]
  }
};`}

              {activeArtifactTab === 'types' && `// Clean, unambiguous domain models for all specs
export interface BrokerAccount {
  id: string;
  account_number: string;
  status: 'ACTIVE' | 'PENDING' | 'DISABLED';
  currency: string;
  cash: string | number;
  portfolio_value: string | number;
}

export interface BrokerOrderRequest {
  symbol: string;
  qty?: string | number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  time_in_force: 'day' | 'gtc';
}

export interface AccountFinancialDetails {
  accountId: string;
  accountNumberMasked: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';
  currentBalance: number;
  availableBalance: number;
}

export interface RewardShopWithPointsLinkage {
  partnerMemberId: string;
  availablePoints: number;
  pointsConversionRate: number;
  cashEquivalentValue: number;
}`}

              {activeArtifactTab === 'component' && `import React from 'react';
import {
  BrokerTradingComponent,
  BankingTransactionsComponent,
  RewardsPointsComponent,
  PayPalPaymentsComponent
} from './GeneratedApiExplorer';

export default function GeneratedDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <BrokerTradingComponent />
      <BankingTransactionsComponent />
      <RewardsPointsComponent />
      <PayPalPaymentsComponent />
    </div>
  );
}`}

              {activeArtifactTab === 'readme' && `# Multi-Spec API & XSD Documentation Workbench
Auto-generated by Kronos Apex Multi-Spec Generator.
Total specs parsed: ${catalog?.totalSpecs || 41}
Total endpoints: ${catalog?.totalEndpoints || 620}
Total XSD types: ${catalog?.totalXsdTypes || 522}

Run build anytime via:
npm run generate:workbench`}
            </pre>
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 5: UPLOAD SPECIFICATION MODAL / FORM
       * ========================================================================= */}
      {activeTab === 'upload' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 max-w-2xl mx-auto space-y-4">
          <div className="border-b border-[#30363D] pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              <span>Upload New Specification</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Add any OpenAPI JSON/YAML, Swagger 2.0, or XSD XML schema file into the workbench.
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Choose File</label>
              <input
                type="file"
                accept=".json,.yaml,.yml,.xsd,.xml,.txt"
                onChange={handleFileUploadInput}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Specification File Name</label>
              <input
                type="text"
                placeholder="e.g. payment-service.yaml or user-types.xsd"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                required
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">File Content (JSON / YAML / XML)</label>
              <textarea
                rows={8}
                placeholder="Paste raw OpenAPI JSON/YAML, Swagger, or XSD XML schema here..."
                value={uploadContent}
                onChange={(e) => setUploadContent(e.target.value)}
                required
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg p-3 text-xs font-mono text-gray-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] text-gray-300 rounded-lg text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center space-x-2 px-5 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploading ? 'Parsing & Generating...' : 'Upload & Regenerate'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

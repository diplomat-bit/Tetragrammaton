import fs from 'fs';
import path from 'path';

export function sanitizeIdentifier(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '') || 'SpecComponent';
}

export function generateAllSpecUiFiles() {
  const catalogPath = path.join(process.cwd(), 'api-workbench', 'generated', 'data', 'workbench-catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.error('Catalog file not found:', catalogPath);
    return;
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  const targetDir = path.join(process.cwd(), 'api-workbench', 'generated', 'components', 'specs');
  fs.mkdirSync(targetDir, { recursive: true });

  const registryItems: { id: string; title: string; componentName: string; fileName: string; endpointsCount: number }[] = [];

  for (const spec of catalog.specs) {
    const rawName = spec.title || spec.fileName || spec.id;
    const baseId = sanitizeIdentifier(rawName);
    const componentName = `SpecUI_${baseId}`;
    const fileName = `${componentName}.tsx`;
    const filePath = path.join(targetDir, fileName);

    registryItems.push({
      id: spec.id,
      title: spec.title || spec.fileName,
      componentName,
      fileName,
      endpointsCount: spec.endpoints ? spec.endpoints.length : 0,
    });

    // Generate individual full React component file
    const content = `import React, { useState } from 'react';
import { 
  Play, Copy, Check, RefreshCw, Layers, Terminal, Globe, 
  Code2, CheckCircle2, ChevronRight, ChevronDown, ExternalLink,
  Shield, Database, Sparkles, Send, FileCode
} from 'lucide-react';
import { workbenchSdk } from '../../configs/api-clients';

export interface ${componentName}Props {
  onExecute?: (endpoint: any, response: any) => void;
}

export const ${componentName}: React.FC<${componentName}Props> = () => {
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'execute' | 'code' | 'schema'>('execute');
  const [requestHeaders, setRequestHeaders] = useState<string>('{\\n  "Accept": "application/json",\\n  "Content-Type": "application/json"\\n}');
  const [requestBody, setRequestBody] = useState<string>('{\\n  "sample": "payload"\\n}');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const specMeta = {
    id: ${JSON.stringify(spec.id)},
    title: ${JSON.stringify(spec.title || spec.fileName)},
    version: ${JSON.stringify(spec.version || '1.0.0')},
    format: ${JSON.stringify(spec.format || 'openapi_3')},
    servers: ${JSON.stringify(spec.servers || [])},
    endpoints: ${JSON.stringify((spec.endpoints || []).slice(0, 30))},
    xsdDetails: ${JSON.stringify(spec.xsdDetails || null)}
  };

  const currentEndpoint = specMeta.endpoints[selectedEndpointIndex] || specMeta.endpoints[0];

  const handleExecute = async () => {
    if (!currentEndpoint) return;
    setLoading(true);
    const startTime = performance.now();
    try {
      let parsedBody: any = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(currentEndpoint.method)) {
        try { parsedBody = JSON.parse(requestBody); } catch { parsedBody = requestBody; }
      }
      let parsedHeaders: Record<string, string> = {};
      try { parsedHeaders = JSON.parse(requestHeaders); } catch {}

      const res = await workbenchSdk.request({
        method: currentEndpoint.method as any,
        path: currentEndpoint.path,
        baseUrl: specMeta.servers[0]?.url,
        headers: parsedHeaders,
        body: parsedBody
      });
      setResponseOutput(res);
    } catch (err: any) {
      setResponseOutput({
        ok: false,
        status: 500,
        statusText: 'Execution Error',
        data: { error: err.message },
        durationMs: Math.round(performance.now() - startTime)
      });
    } finally {
      setLoading(false);
    }
  };

  const copySnippet = () => {
    if (!currentEndpoint) return;
    const snippet = \`import { workbenchSdk } from './api-clients';

const response = await workbenchSdk.request({
  method: '\${currentEndpoint.method}',
  path: '\${currentEndpoint.path}',
  baseUrl: '\${specMeta.servers[0]?.url || 'https://api.sandbox.local'}'
});
console.log(response.data);\`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-white space-y-6 shadow-xl">
      {/* Spec Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white font-mono">{specMeta.title}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              v{specMeta.version} • {specMeta.format.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Generated Interactive Spec Explorer with {specMeta.endpoints.length} endpoints & server routing.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copySnippet}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy SDK Snippet</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector Sidebar + Request/Response Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-4 bg-[#0D1117] border border-[#30363D] rounded-xl p-3 space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
            Endpoints ({specMeta.endpoints.length})
          </div>
          {specMeta.endpoints.length === 0 ? (
            <div className="p-4 text-xs text-gray-400 text-center">
              XML / XSD Schema definition without direct HTTP endpoints.
            </div>
          ) : (
            specMeta.endpoints.map((ep, idx) => (
              <button
                key={ep.id || idx}
                onClick={() => setSelectedEndpointIndex(idx)}
                className={\`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between gap-2 \${
                  selectedEndpointIndex === idx
                    ? 'bg-[#1F242C] border border-indigo-500/60 text-white shadow-sm'
                    : 'text-gray-400 hover:bg-[#161B22] hover:text-gray-200'
                }\`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className={\`text-[10px] font-bold px-1.5 py-0.5 rounded \${
                    ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                    ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                    ep.method === 'PUT' ? 'bg-amber-500/20 text-amber-400' :
                    ep.method === 'DELETE' ? 'bg-rose-500/20 text-rose-400' : 'bg-purple-500/20 text-purple-400'
                  }\`}>
                    {ep.method}
                  </span>
                  <span className="truncate">{ep.path}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-500" />
              </button>
            ))
          )}
        </div>

        {/* Interactive Runner Console */}
        <div className="lg:col-span-8 bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-4">
          {currentEndpoint ? (
            <>
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <span className={\`text-xs font-bold font-mono px-2 py-1 rounded \${
                    currentEndpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                    currentEndpoint.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-amber-500/20 text-amber-400'
                  }\`}>
                    {currentEndpoint.method}
                  </span>
                  <span className="text-sm font-mono text-white font-bold">{currentEndpoint.path}</span>
                </div>
                <div className="text-[11px] text-gray-400">
                  {specMeta.servers[0]?.url || 'https://sandbox.api.workbench.local'}
                </div>
              </div>

              {currentEndpoint.summary && (
                <p className="text-xs text-gray-300">{currentEndpoint.summary}</p>
              )}

              {/* Subtabs */}
              <div className="flex items-center space-x-2 border-b border-[#30363D] pb-2 text-xs">
                <button
                  onClick={() => setActiveTab('execute')}
                  className={\`px-3 py-1 rounded-md font-semibold transition \${
                    activeTab === 'execute' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }\`}
                >
                  Live Runner
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={\`px-3 py-1 rounded-md font-semibold transition \${
                    activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }\`}
                >
                  SDK Code
                </button>
                <button
                  onClick={() => setActiveTab('schema')}
                  className={\`px-3 py-1 rounded-md font-semibold transition \${
                    activeTab === 'schema' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }\`}
                >
                  Parameters & Responses
                </button>
              </div>

              {activeTab === 'execute' && (
                <div className="space-y-3">
                  {['POST', 'PUT', 'PATCH'].includes(currentEndpoint.method) && (
                    <div>
                      <label className="block text-[11px] text-gray-400 font-medium mb-1">Request Body (JSON)</label>
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        rows={4}
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-2.5 text-xs font-mono text-gray-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleExecute}
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>Execute {currentEndpoint.method} {currentEndpoint.path}</span>
                  </button>

                  {responseOutput && (
                    <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-xl text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="text-emerald-400 font-bold">
                          Status: {responseOutput.status} {responseOutput.statusText}
                        </span>
                        <span>{responseOutput.durationMs}ms</span>
                      </div>
                      <pre className="text-gray-200 max-h-48 overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(responseOutput.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'code' && (
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-xl text-xs font-mono text-indigo-300 overflow-auto">
                  <pre>{\`// Generated SDK Usage for \${specMeta.title}
import { workbenchSdk } from './api-clients';

const response = await workbenchSdk.request({
  method: '\${currentEndpoint.method}',
  path: '\${currentEndpoint.path}',
  baseUrl: '\${specMeta.servers[0]?.url || 'https://sandbox.api.workbench.local'}',
  headers: {
    'Accept': 'application/json'
  }
});

console.log('Status:', response.status);
console.log('Data:', response.data);\`}
                  </pre>
                </div>
              )}

              {activeTab === 'schema' && (
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-xl text-xs space-y-2 max-h-56 overflow-auto">
                  <div className="font-bold text-gray-300">Declared Parameters ({currentEndpoint.parameters?.length || 0})</div>
                  {(currentEndpoint.parameters || []).map((p: any, i: number) => (
                    <div key={i} className="p-2 rounded bg-[#0D1117] border border-[#30363D] text-[11px] font-mono">
                      <span className="text-indigo-400 font-bold">{p.name}</span> in <span className="text-amber-400">{p.in}</span>: {p.description || 'No description provided'}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-xs text-gray-400">
              Select an endpoint to start execution
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`;

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  // Create Master Registry
  const registryPath = path.join(targetDir, 'SpecComponentRegistry.tsx');
  const importStatements = registryItems.map(item => `import { ${item.componentName} } from './${item.componentName}';`).join('\n');
  const mappingEntries = registryItems.map(item => `  ${JSON.stringify(item.id)}: ${item.componentName},`).join('\n');
  const metadataList = registryItems.map(item => `  { id: ${JSON.stringify(item.id)}, title: ${JSON.stringify(item.title)}, endpointsCount: ${item.endpointsCount}, component: ${item.componentName} },`).join('\n');

  const registryContent = `import React from 'react';
${importStatements}

export const SPEC_COMPONENTS_MAP: Record<string, React.FC<any>> = {
${mappingEntries}
};

export const SPEC_COMPONENTS_LIST = [
${metadataList}
];

export function getSpecComponent(specId: string): React.FC<any> | null {
  return SPEC_COMPONENTS_MAP[specId] || null;
}
`;

  fs.writeFileSync(registryPath, registryContent, 'utf-8');
  console.log(`Successfully generated ${registryItems.length} spec UI components and registry in ${targetDir}`);
}

generateAllSpecUiFiles();

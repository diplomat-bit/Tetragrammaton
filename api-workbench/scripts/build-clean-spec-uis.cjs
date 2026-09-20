const fs = require('fs');
const path = require('path');

const catalogPath = path.join(process.cwd(), 'api-workbench', 'generated', 'data', 'workbench-catalog.json');
if (!fs.existsSync(catalogPath)) {
  console.error('Catalog not found:', catalogPath);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
const targetDir = path.join(process.cwd(), 'api-workbench', 'generated', 'components', 'specs');
fs.mkdirSync(targetDir, { recursive: true });

const mappings = [
  { file: 'SpecUI_Access_Online_Transactions_and_Orders', match: 'openapi__4__json' },
  { file: 'SpecUI_Account_Statements', match: 'Statement_Digital_Orchestration_Api-5-swagger_yaml__1_' },
  { file: 'SpecUI_Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI', match: 'Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI-2-swagger__1__yaml' },
  { file: 'SpecUI_B2B_Virtual_Account_Payment_Method', match: 'api_reference__10__json' },
  { file: 'SpecUI_Broker_API', match: 'Broker_API_postman_collection_json_txt' },
  { file: 'SpecUI_CardAccountBalanceTransferEligibility_OpenAPI', match: 'CardAccountBalanceTransferEligibility_OpenAPI-4-swagger_yaml' },
  { file: 'SpecUI_Card_on_File_Data_Inquiry', match: 'api_reference__17__json' },
  { file: 'SpecUI_Click_to_Pay', match: 'api_reference__13__json' },
  { file: 'SpecUI_Consent_Authorization', match: 'Oauth2_Security_Idp_Api-4-swagger_yaml' },
  { file: 'SpecUI_Corporate_Account_Information', match: 'openapi__6__json' },
  { file: 'SpecUI_Custody', match: 'openapi__3__json' },
  { file: 'SpecUI_Customers_Profiles', match: 'Openbanking_Customerprofile_Orchestrator_Api-5-swagger_yaml' },
  { file: 'SpecUI_DPS_Card_and_Account_Services', match: 'api_reference__3__json' },
  { file: 'SpecUI_Finicity_API', match: 'finicity-apimatic-20220106_yaml' },
  { file: 'SpecUI_Foreign_Exchange_Rates', match: 'api_reference__16__json' },
  { file: 'SpecUI_IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI', match: 'IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI-3-swagger__1__yaml' },
  { file: 'SpecUI_Incoming_webhooks', match: 'openapi_json' },
  { file: 'SpecUI_Kernel_in_the_Cloud', match: 'api_reference__8__json' },
  { file: 'SpecUI_PayPal_APIs', match: 'PayPal_APIs_postman_collection_json_txt' },
  { file: 'SpecUI_RewardLinkageShopWithPoints_OpenAPI', match: 'RewardLinkageShopWithPoints_OpenAPI-4-swagger_yaml__1_' },
  { file: 'SpecUI_RewardRedemptionSelectAndCredit_OpenAPI', match: 'RewardRedemptionSelectAndCredit_OpenAPI-5-swagger_yaml__1_' },
  { file: 'SpecUI_SecurityE2EKeyExchangePreLogin_Partner_OpenAPI', match: 'SecurityE2EKeyExchangePreLogin_Partner_OpenAPI-5-swagger_yaml' },
  { file: 'SpecUI_TaxStatement_Digital_Orchestation', match: 'TaxStatement_Digital_Orchestration_Api-1-swagger_yaml__1_' },
  { file: 'SpecUI_Token_Authorization', match: 'Auth_Digital_Public_Token_Api-2-swagger__1__yaml' },
  { file: 'SpecUI_Virtual_Card_Payments', match: 'openapi__5__json' },
  { file: 'SpecUI_VisaNet_Connect_Issuing', match: 'api_reference__1__json' },
  { file: 'SpecUI_Visa_Accounts_Receivable_Manager', match: 'api_reference__9__json' },
  { file: 'SpecUI_Visa_BIN_Attribute_Sharing_Service', match: 'api_reference__15__json' },
  { file: 'SpecUI_Visa_Card_Program_Management', match: 'api_reference__14__json' },
  { file: 'SpecUI_Visa_Consumer_Authentication_Service', match: 'api_reference__19__json' },
  { file: 'SpecUI_Visa_Credit_Card_Application', match: 'api_reference__5__json' },
  { file: 'SpecUI_Visa_DCVV2_Generate', match: 'api_reference__11__json' },
  { file: 'SpecUI_Visa_Direct', match: 'api_reference_json' },
  { file: 'SpecUI_Visa_Direct_Connect', match: 'api_reference__6__json' },
  { file: 'SpecUI_Visa_Pay', match: 'api_reference__12__json' },
  { file: 'SpecUI_Visa_Payment_Passkey', match: 'api_reference__18__json' },
  { file: 'SpecUI_Visa_Travel_Notification_Service', match: 'api_reference__4__json' },
  { file: 'SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml', match: 'Common_ComplexTypes_xsd_xml' },
  { file: 'SpecUI_XML_Schema_Common_Groups_xsd_xml', match: 'Common_Groups_xsd_xml' }
];

function sanitizeDescription(desc) {
  if (!desc) return '';
  return desc
    .replace(/<table[\s\S]*?<\/table>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 240);
}

const registryItems = [];

for (const m of mappings) {
  const spec = catalog.specs.find(s => s.id === m.match);
  if (!spec) {
    console.error('Spec not found for:', m.match);
    continue;
  }

  const componentName = m.file;
  const fileName = `${componentName}.tsx`;
  const filePath = path.join(targetDir, fileName);

  const isXsd = spec.format === 'xsd';
  const cleanTitle = (spec.title || spec.fileName || m.file).replace(/[\r\n]+/g, ' ').trim();
  const cleanDesc = sanitizeDescription(spec.description) || `Interactive API console and live execution suite for ${cleanTitle}.`;
  const version = spec.version || '1.0.0';
  const format = spec.format || 'openapi_3';
  const defaultBaseUrl = spec.servers && spec.servers.length > 0 ? spec.servers[0].url : 'https://api.sandbox.local';

  // Sanitize endpoints (keep at most 30 to avoid excessive bundle size, but full fidelity)
  const rawEndpoints = spec.endpoints || [];
  const endpoints = rawEndpoints.slice(0, 30).map((ep, idx) => {
    return {
      id: ep.id || `ep_${idx}`,
      path: ep.path || '/',
      method: (ep.method || 'GET').toUpperCase(),
      summary: sanitizeDescription(ep.summary || ep.description) || `${ep.method} ${ep.path}`,
      operationId: ep.operationId || `op_${idx}`,
      parameters: (ep.parameters || []).slice(0, 10).map(p => ({
        name: p.name || 'param',
        in: p.in || 'query',
        required: Boolean(p.required),
        type: p.type || (p.schema && p.schema.type) || 'string',
        description: sanitizeDescription(p.description) || '',
        example: p.example || (p.schema && p.schema.example) || ''
      })),
      hasBody: ['POST', 'PUT', 'PATCH'].includes((ep.method || '').toUpperCase()),
      samplePayload: ep.requestBody?.samplePayload || {
        referenceId: `REF-${Date.now()}`,
        status: 'PENDING',
        metadata: { client: 'API_WORKBENCH_SDK' }
      }
    };
  });

  const xsdTypes = isXsd ? {
    complexTypes: (spec.xsdDetails?.complexTypes || []).slice(0, 50).map(ct => ({
      name: ct.name,
      documentation: sanitizeDescription(ct.documentation),
      baseType: ct.baseType || '',
      elementsCount: ct.elements?.length || 0,
      elements: (ct.elements || []).slice(0, 8).map(el => ({
        name: el.name,
        type: el.type || '',
        minOccurs: el.minOccurs || '0',
        maxOccurs: el.maxOccurs || '1'
      }))
    })),
    simpleTypes: (spec.xsdDetails?.simpleTypes || []).slice(0, 30).map(st => ({
      name: st.name,
      baseType: st.baseType || '',
      enumerations: (st.enumerations || []).slice(0, 10)
    })),
    groups: (spec.xsdDetails?.groups || []).slice(0, 20).map(g => ({
      name: g.name,
      documentation: sanitizeDescription(g.documentation),
      elements: (g.elements || []).slice(0, 6).map(el => el.name)
    }))
  } : null;

  registryItems.push({
    id: spec.id,
    title: cleanTitle,
    componentName,
    fileName,
    endpointsCount: endpoints.length,
    xsdTypesCount: isXsd ? (spec.xsdDetails?.complexTypes?.length || 0) : 0,
    format
  });

  let fileContent = '';

  if (isXsd) {
    // Dedicated, robust XSD Schema Explorer Component
    fileContent = `import React, { useState } from 'react';
import { 
  FileCode, Copy, Check, Search, Layers, Box, Code2, 
  ChevronRight, ChevronDown, Sparkles, Filter, Database
} from 'lucide-react';

export interface ${componentName}Props {
  onSelectType?: (typeName: string) => void;
}

const XSD_META = {
  id: ${JSON.stringify(spec.id)},
  title: ${JSON.stringify(cleanTitle)},
  version: ${JSON.stringify(version)},
  format: ${JSON.stringify(format)},
  description: ${JSON.stringify(cleanDesc)},
  complexTypes: ${JSON.stringify(xsdTypes.complexTypes)},
  simpleTypes: ${JSON.stringify(xsdTypes.simpleTypes)},
  groups: ${JSON.stringify(xsdTypes.groups)}
};

export const ${componentName}: React.FC<${componentName}Props> = () => {
  const [activeTab, setActiveTab] = useState<'complex' | 'simple' | 'groups' | 'xml'>('complex');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeName, setSelectedTypeName] = useState<string>(XSD_META.complexTypes[0]?.name || '');
  const [copied, setCopied] = useState(false);

  const filteredComplexTypes = XSD_META.complexTypes.filter(ct => 
    ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ct.documentation && ct.documentation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSimpleTypes = XSD_META.simpleTypes.filter(st =>
    st.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = XSD_META.groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedComplexType = XSD_META.complexTypes.find(ct => ct.name === selectedTypeName) || XSD_META.complexTypes[0];

  const handleCopyXml = () => {
    const sampleXml = \`<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:iso:std:iso:20022:tech:xsd" elementFormDefault="qualified">
  <!-- \${XSD_META.title} Schema Definition -->
  <xs:complexType name="\${selectedComplexType?.name || 'Item'}">
    <xs:sequence>
\${(selectedComplexType?.elements || []).map(el => \`      <xs:element name="\${el.name}" type="\${el.type || 'xs:string'}" minOccurs="\${el.minOccurs}" maxOccurs="\${el.maxOccurs}"/>\`).join('\\n')}
    </xs:sequence>
  </xs:complexType>
</xs:schema>\`;
    navigator.clipboard.writeText(sampleXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-white space-y-6 shadow-xl">
      {/* Spec Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileCode className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white font-mono">{XSD_META.title}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              XSD XML SCHEMA
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{XSD_META.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyXml}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy XML Schema</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('complex')}
            className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${
              activeTab === 'complex' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }\`}
          >
            Complex Types ({XSD_META.complexTypes.length})
          </button>
          <button
            onClick={() => setActiveTab('simple')}
            className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${
              activeTab === 'simple' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }\`}
          >
            Simple Types ({XSD_META.simpleTypes.length})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${
              activeTab === 'groups' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }\`}
          >
            Model Groups ({XSD_META.groups.length})
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${
              activeTab === 'xml' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }\`}
          >
            XML Preview
          </button>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search schema elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white focus:border-indigo-500 outline-none w-56"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Type Navigator */}
        <div className="lg:col-span-4 bg-[#0D1117] border border-[#30363D] rounded-xl p-3 max-h-[480px] overflow-y-auto space-y-1 scrollbar-thin">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
            Schema Definitions
          </div>
          {activeTab === 'complex' && filteredComplexTypes.map((ct) => (
            <button
              key={ct.name}
              onClick={() => setSelectedTypeName(ct.name)}
              className={\`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between gap-2 \${
                selectedTypeName === ct.name
                  ? 'bg-[#1F242C] border border-indigo-500/60 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-[#161B22] hover:text-gray-200'
              }\`}
            >
              <div className="truncate">
                <div className="text-indigo-300 font-semibold truncate">{ct.name}</div>
                <div className="text-[10px] text-gray-500 truncate">{ct.elementsCount} sub-elements</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            </button>
          ))}
          {activeTab === 'simple' && filteredSimpleTypes.map((st) => (
            <div key={st.name} className="p-2.5 rounded-lg text-xs font-mono bg-[#161B22] border border-[#30363D]">
              <div className="text-amber-300 font-semibold">{st.name}</div>
              <div className="text-[10px] text-gray-400">Base: {st.baseType || 'xs:string'}</div>
              {st.enumerations.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {st.enumerations.map((val) => (
                    <span key={val} className="px-1.5 py-0.2 bg-black/40 text-[9px] rounded text-emerald-300 border border-[#30363D]">
                      {val}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {activeTab === 'groups' && filteredGroups.map((g) => (
            <div key={g.name} className="p-2.5 rounded-lg text-xs font-mono bg-[#161B22] border border-[#30363D]">
              <div className="text-purple-300 font-semibold">{g.name}</div>
              <div className="text-[10px] text-gray-400 mt-1">Elements: {g.elements.join(', ') || 'none'}</div>
            </div>
          ))}
        </div>

        {/* Selected Type Inspector */}
        <div className="lg:col-span-8 bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-4">
          {activeTab === 'xml' ? (
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-300">Generated XML Schema Definition</div>
              <pre className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-mono text-indigo-300 max-h-[400px] overflow-auto whitespace-pre">
{\`<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:citi:financial:schema:v1" elementFormDefault="qualified">
  <!-- \${XSD_META.title} -->
\${XSD_META.complexTypes.map(ct => \`  <xs:complexType name="\${ct.name}">
    <xs:sequence>
\${ct.elements.map(el => \`      <xs:element name="\${el.name}" type="\${el.type || 'xs:string'}" minOccurs="\${el.minOccurs}" maxOccurs="\${el.maxOccurs}"/>\`).join('\\n')}
    </xs:sequence>
  </xs:complexType>\`).join('\\n\\n')}
</xs:schema>\`}
              </pre>
            </div>
          ) : selectedComplexType ? (
            <div className="space-y-4">
              <div className="border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-indigo-400 font-bold">ComplexType:</span>
                  <span className="text-base font-bold text-white font-mono">{selectedComplexType.name}</span>
                </div>
                {selectedComplexType.documentation && (
                  <p className="text-xs text-gray-400 mt-1">{selectedComplexType.documentation}</p>
                )}
                {selectedComplexType.baseType && (
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">Base Type: {selectedComplexType.baseType}</div>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-gray-300 mb-2">Child Elements ({selectedComplexType.elements.length})</div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {selectedComplexType.elements.map((el, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-emerald-400 font-bold">{el.name}</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-indigo-300">{el.type || 'xs:string'}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-gray-400 border border-[#30363D]">
                        [{el.minOccurs}..{el.maxOccurs}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500">Select a schema type to inspect attributes</div>
          )}
        </div>
      </div>
    </div>
  );
};
`;
  } else {
    // Fully featured, Interactive OpenAPI / Swagger / Postman Spec Runner
    fileContent = `import React, { useState, useEffect } from 'react';
import { 
  Play, Copy, Check, RefreshCw, Layers, Terminal, Globe, 
  Code2, ChevronRight, Send, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { workbenchSdk } from '../../configs/api-clients';

export interface ${componentName}Props {
  onExecute?: (endpoint: any, response: any) => void;
}

const SPEC_META = {
  id: ${JSON.stringify(spec.id)},
  title: ${JSON.stringify(cleanTitle)},
  version: ${JSON.stringify(version)},
  format: ${JSON.stringify(format)},
  description: ${JSON.stringify(cleanDesc)},
  baseUrl: ${JSON.stringify(defaultBaseUrl)},
  endpoints: ${JSON.stringify(endpoints)}
};

export const ${componentName}: React.FC<${componentName}Props> = ({ onExecute }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'execute' | 'code' | 'schema'>('execute');
  const [pathParamValues, setPathParamValues] = useState<Record<string, string>>({});
  const [queryParamValues, setQueryParamValues] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test_token_api_workbench'
  });
  const [requestBodyText, setRequestBodyText] = useState<string>('{}');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const currentEndpoint = SPEC_META.endpoints[selectedIdx] || SPEC_META.endpoints[0];

  // Initialize defaults on endpoint change
  useEffect(() => {
    if (!currentEndpoint) return;
    const initialPaths: Record<string, string> = {};
    const initialQueries: Record<string, string> = {};

    currentEndpoint.parameters.forEach(p => {
      if (p.in === 'path') {
        initialPaths[p.name] = p.example || '12345';
      } else if (p.in === 'query') {
        initialQueries[p.name] = p.example || '';
      }
    });

    setPathParamValues(initialPaths);
    setQueryParamValues(initialQueries);

    if (currentEndpoint.hasBody) {
      setRequestBodyText(JSON.stringify(currentEndpoint.samplePayload || { sampleKey: 'sampleValue' }, null, 2));
    }
  }, [selectedIdx]);

  // Compute interpolated path
  const resolvedPath = currentEndpoint ? currentEndpoint.path.replace(/\\{([^}]+)\\}/g, (_, key) => {
    return pathParamValues[key] || \`{\${key}}\`;
  }) : '';

  const handleExecute = async () => {
    if (!currentEndpoint) return;
    setLoading(true);
    const startTime = performance.now();

    try {
      let bodyData: any = undefined;
      if (currentEndpoint.hasBody) {
        try { bodyData = JSON.parse(requestBodyText); } catch { bodyData = requestBodyText; }
      }

      const res = await workbenchSdk.request({
        method: currentEndpoint.method as any,
        path: resolvedPath,
        baseUrl: SPEC_META.baseUrl,
        queryParams: queryParamValues,
        headers: headers,
        body: bodyData
      });

      setResponseOutput(res);
      if (onExecute) onExecute(currentEndpoint, res);
    } catch (err: any) {
      setResponseOutput({
        ok: false,
        status: 500,
        statusText: 'Client Error',
        data: { error: err.message || 'Execution failed' },
        durationMs: Math.round(performance.now() - startTime)
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurlCommand = () => {
    if (!currentEndpoint) return '';
    let cmd = \`curl -X \${currentEndpoint.method} "\${SPEC_META.baseUrl}\${resolvedPath}"\`;
    const queryParts = Object.entries(queryParamValues).filter(([_, v]) => Boolean(v)).map(([k, v]) => \`\${k}=\${encodeURIComponent(v)}\`);
    if (queryParts.length > 0) cmd += \`?\${queryParts.join('&')}\`;
    cmd += \`"\\\\\`;
    Object.entries(headers).forEach(([k, v]) => {
      cmd += \`\\n  -H "\${k}: \${v}" \\\\\`;
    });
    if (currentEndpoint.hasBody && requestBodyText.trim()) {
      cmd += \`\\n  -d '\${requestBodyText.replace(/'/g, "\\\\'")}'\`;
    }
    return cmd;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const copySnippet = () => {
    if (!currentEndpoint) return;
    const snippet = \`import { workbenchSdk } from '../../configs/api-clients';

// Call \${currentEndpoint.operationId} on \${SPEC_META.title}
const response = await workbenchSdk.request({
  method: '\${currentEndpoint.method}',
  path: '\${resolvedPath}',
  baseUrl: '\${SPEC_META.baseUrl}',
  headers: \${JSON.stringify(headers, null, 2)},
  \${currentEndpoint.hasBody ? \`body: \${requestBodyText}\` : ''}
});

console.log('Status:', response.status);
console.log('Data:', response.data);\`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
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
            <h3 className="text-lg font-bold text-white font-mono">{SPEC_META.title}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              v{SPEC_META.version} • {SPEC_META.format.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{SPEC_META.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyCurl}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition font-mono"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy cURL</span>
          </button>
          <button
            onClick={copySnippet}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition font-mono"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>Copy SDK Code</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector Sidebar + Interactive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints Sidebar */}
        <div className="lg:col-span-4 bg-[#0D1117] border border-[#30363D] rounded-xl p-3 space-y-1.5 max-h-[520px] overflow-y-auto scrollbar-thin">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Endpoints ({SPEC_META.endpoints.length})</span>
            <span className="text-[10px] text-gray-500 font-mono">Live</span>
          </div>
          {SPEC_META.endpoints.map((ep, idx) => (
            <button
              key={ep.id || idx}
              onClick={() => setSelectedIdx(idx)}
              className={\`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between gap-2 \${
                selectedIdx === idx
                  ? 'bg-[#1F242C] border border-indigo-500/60 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-[#161B22] hover:text-gray-200'
              }\`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className={\`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 \${
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
          ))}
        </div>

        {/* Console & Runner */}
        <div className="lg:col-span-8 bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-4">
          {currentEndpoint ? (
            <>
              {/* Endpoint Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <span className={\`text-xs font-bold font-mono px-2 py-0.5 rounded \${
                    currentEndpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                    currentEndpoint.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-amber-500/20 text-amber-400'
                  }\`}>
                    {currentEndpoint.method}
                  </span>
                  <span className="text-sm font-mono text-white font-bold">{resolvedPath}</span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">
                  Base: {SPEC_META.baseUrl}
                </div>
              </div>

              {currentEndpoint.summary && (
                <p className="text-xs text-gray-300">{currentEndpoint.summary}</p>
              )}

              {/* Mode Tabs */}
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
                  SDK & cURL
                </button>
                <button
                  onClick={() => setActiveTab('schema')}
                  className={\`px-3 py-1 rounded-md font-semibold transition \${
                    activeTab === 'schema' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }\`}
                >
                  Parameters ({currentEndpoint.parameters.length})
                </button>
              </div>

              {/* Live Runner Tab */}
              {activeTab === 'execute' && (
                <div className="space-y-4">
                  {/* Path Parameters Inputs */}
                  {Object.keys(pathParamValues).length > 0 && (
                    <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-2">
                      <div className="text-[11px] font-bold text-gray-300">Path Parameters</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(pathParamValues).map(([paramName, val]) => (
                          <div key={paramName}>
                            <label className="block text-[10px] font-mono text-indigo-400 mb-0.5">{paramName}</label>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => setPathParamValues({ ...pathParamValues, [paramName]: e.target.value })}
                              className="w-full bg-[#0D1117] border border-[#30363D] rounded px-2.5 py-1 text-xs text-white font-mono outline-none focus:border-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body (if supported) */}
                  {currentEndpoint.hasBody && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-gray-400 font-medium">Request Payload (JSON)</label>
                        <button
                          onClick={() => setRequestBodyText(JSON.stringify(currentEndpoint.samplePayload, null, 2))}
                          className="text-[10px] text-indigo-400 hover:underline"
                        >
                          Load Sample Payload
                        </button>
                      </div>
                      <textarea
                        value={requestBodyText}
                        onChange={(e) => setRequestBodyText(e.target.value)}
                        rows={4}
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-2.5 text-xs font-mono text-gray-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  )}

                  {/* Run Button */}
                  <button
                    onClick={handleExecute}
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>Execute {currentEndpoint.method} {resolvedPath}</span>
                  </button>

                  {/* Response Window */}
                  {responseOutput && (
                    <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-xl text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between text-gray-400">
                        <span className={\`font-bold \${responseOutput.ok ? 'text-emerald-400' : 'text-rose-400'}\`}>
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

              {/* Code Tab */}
              {activeTab === 'code' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-bold text-gray-300 mb-1">TypeScript SDK Snippet</div>
                    <pre className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-mono text-indigo-300 overflow-auto whitespace-pre">
{\`import { workbenchSdk } from '../../configs/api-clients';

const response = await workbenchSdk.request({
  method: '\${currentEndpoint.method}',
  path: '\${resolvedPath}',
  baseUrl: '\${SPEC_META.baseUrl}',
  headers: {
    'Accept': 'application/json'
  }\${currentEndpoint.hasBody ? \`,\\n  body: \${requestBodyText}\` : ''}
});

console.log(response.data);
\`}
                    </pre>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-300 mb-1">cURL Command</div>
                    <pre className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-mono text-emerald-300 overflow-auto whitespace-pre">
{getCurlCommand()}
                    </pre>
                  </div>
                </div>
              )}

              {/* Schema Tab */}
              {activeTab === 'schema' && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-300">Declared Parameters ({currentEndpoint.parameters.length})</div>
                  {currentEndpoint.parameters.length === 0 ? (
                    <div className="p-4 text-xs text-gray-500 text-center">No explicit query or path parameters declared</div>
                  ) : (
                    currentEndpoint.parameters.map((p, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] text-xs font-mono flex flex-col gap-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-indigo-400 font-bold">{p.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0D1117] text-amber-400 border border-[#30363D]">{p.in}</span>
                          <span className="text-[10px] text-gray-400">({p.type})</span>
                          {p.required && <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300">required</span>}
                        </div>
                        {p.description && <div className="text-[11px] text-gray-400 font-sans">{p.description}</div>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500">Select an endpoint to execute</div>
          )}
        </div>
      </div>
    </div>
  );
};
`;
  }

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`Generated: ${fileName} (${endpoints.length} endpoints)`);
}

// Generate SpecComponentRegistry.tsx
const registryPath = path.join(targetDir, 'SpecComponentRegistry.tsx');
const importStatements = registryItems.map(item => `import { ${item.componentName} } from './${item.componentName}';`).join('\n');
const mappingEntries = registryItems.map(item => `  ${JSON.stringify(item.id)}: ${item.componentName},`).join('\n');
const byNameEntries = registryItems.map(item => `  ${JSON.stringify(item.componentName)}: ${item.componentName},`).join('\n');
const listEntries = registryItems.map(item => `  {
    id: ${JSON.stringify(item.id)},
    title: ${JSON.stringify(item.title)},
    componentName: ${JSON.stringify(item.componentName)},
    fileName: ${JSON.stringify(item.fileName)},
    endpointsCount: ${item.endpointsCount},
    xsdTypesCount: ${item.xsdTypesCount},
    format: ${JSON.stringify(item.format)},
    component: ${item.componentName}
  },`).join('\n');

const registryContent = `import React from 'react';
${importStatements}

export interface SpecRegistryItem {
  id: string;
  title: string;
  componentName: string;
  fileName: string;
  endpointsCount: number;
  xsdTypesCount: number;
  format: string;
  component: React.FC<any>;
}

export const SPEC_COMPONENTS_MAP: Record<string, React.FC<any>> = {
${mappingEntries}
};

export const SPEC_COMPONENTS_BY_NAME: Record<string, React.FC<any>> = {
${byNameEntries}
};

export const SPEC_COMPONENTS_LIST: SpecRegistryItem[] = [
${listEntries}
];

export function getSpecComponent(specIdOrName: string): React.FC<any> | null {
  if (!specIdOrName) return null;
  return SPEC_COMPONENTS_MAP[specIdOrName] || SPEC_COMPONENTS_BY_NAME[specIdOrName] || null;
}
`;

fs.writeFileSync(registryPath, registryContent, 'utf-8');
console.log(`Successfully generated SpecComponentRegistry.tsx with ${registryItems.length} spec components!`);

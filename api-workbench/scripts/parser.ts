import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { XMLParser } from 'fast-xml-parser';

export interface ParameterDef {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  required?: boolean;
  type?: string;
  description?: string;
  example?: any;
  default?: any;
  schema?: any;
}

export interface ResponseDef {
  status: string;
  description?: string;
  schema?: any;
  example?: any;
}

export interface EndpointDef {
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
  security?: any[];
}

export interface ServerDef {
  url: string;
  description?: string;
  environment?: 'production' | 'sandbox' | 'mock' | 'custom';
}

export interface XsdElement {
  name: string;
  type?: string;
  documentation?: string;
  minOccurs?: string | number;
  maxOccurs?: string | number;
  ref?: string;
}

export interface XsdComplexType {
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

export interface XsdSimpleType {
  name: string;
  documentation?: string;
  baseType?: string;
  enumerations?: string[];
  pattern?: string;
}

export interface XsdGroup {
  name: string;
  documentation?: string;
  elements: XsdElement[];
}

export interface XsdAttributeGroup {
  name: string;
  documentation?: string;
  attributes: Array<{
    name: string;
    type?: string;
    use?: string;
    documentation?: string;
  }>;
}

export interface ParsedSpec {
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
  errors?: string[];
}

export interface WorkbenchCatalog {
  generatedAt: string;
  totalSpecs: number;
  totalEndpoints: number;
  totalXsdTypes: number;
  totalServers: number;
  specs: ParsedSpec[];
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  removeNSPrefix: false,
  trimValues: true,
});

/**
 * Parses an OpenAPI 3.x document
 */
function parseOpenApi3(raw: any, fileName: string, fileSize: number): ParsedSpec {
  const title = raw.info?.title || fileName;
  const version = raw.info?.version || '1.0.0';
  const description = raw.info?.description || '';

  const servers: ServerDef[] = (raw.servers || []).map((s: any) => {
    let env: ServerDef['environment'] = 'custom';
    const urlLower = (s.url || '').toLowerCase();
    if (urlLower.includes('sandbox') || urlLower.includes('qa') || urlLower.includes('stage') || urlLower.includes('test') || urlLower.includes('dev')) {
      env = 'sandbox';
    } else if (urlLower.includes('mock') || urlLower.includes('prism')) {
      env = 'mock';
    } else if (urlLower.includes('prod') || urlLower.startsWith('https://api.')) {
      env = 'production';
    }
    return {
      url: s.url,
      description: s.description || (env ? `${env.toUpperCase()} Server` : ''),
      environment: env,
    };
  });

  if (servers.length === 0) {
    servers.push({
      url: 'https://sandbox.api.example.com',
      description: 'Default Sandbox Base URL',
      environment: 'sandbox',
    });
  }

  const tagsSet = new Set<string>();
  const endpoints: EndpointDef[] = [];
  const paths = raw.paths || {};

  for (const [pathKey, pathObj] of Object.entries<any>(paths)) {
    if (!pathObj || typeof pathObj !== 'object') continue;

    const commonParams = Array.isArray(pathObj.parameters) ? pathObj.parameters : [];
    const methods: Array<'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'> = [
      'get', 'post', 'put', 'delete', 'patch', 'options', 'head'
    ];

    for (const m of methods) {
      const op = pathObj[m];
      if (!op) continue;

      const opTags = Array.isArray(op.tags) && op.tags.length > 0 ? op.tags : ['General'];
      opTags.forEach((t: string) => tagsSet.add(t));

      const mergedParams = [...commonParams, ...(Array.isArray(op.parameters) ? op.parameters : [])];
      const parsedParams: ParameterDef[] = mergedParams.map((p: any) => ({
        name: p.name || 'param',
        in: p.in || 'query',
        required: !!p.required,
        type: p.schema?.type || (p.type ? String(p.type) : 'string'),
        description: p.description || '',
        example: p.example ?? p.schema?.example ?? p.schema?.default,
        default: p.schema?.default,
        schema: p.schema,
      }));

      // Request body
      let requestBodyDef: EndpointDef['requestBody'] = undefined;
      if (op.requestBody) {
        const content = op.requestBody.content || {};
        const contentTypes = Object.keys(content);
        const firstType = contentTypes[0] || 'application/json';
        const bodySchema = content[firstType]?.schema;
        const samplePayload = content[firstType]?.example || generateMockData(bodySchema);

        requestBodyDef = {
          description: op.requestBody.description,
          required: !!op.requestBody.required,
          contentTypes: contentTypes.length > 0 ? contentTypes : ['application/json'],
          schema: bodySchema,
          samplePayload,
        };
      }

      // Responses
      const responses: ResponseDef[] = [];
      if (op.responses) {
        for (const [status, respObj] of Object.entries<any>(op.responses)) {
          const respContent = respObj?.content || {};
          const firstRespType = Object.keys(respContent)[0];
          const respSchema = firstRespType ? respContent[firstRespType]?.schema : undefined;
          responses.push({
            status,
            description: respObj?.description || '',
            schema: respSchema,
            example: respContent[firstRespType]?.example || generateMockData(respSchema),
          });
        }
      }

      endpoints.push({
        id: `${m.toUpperCase()}_${pathKey.replace(/[^a-zA-Z0-9_]/g, '_')}`,
        path: pathKey,
        method: m.toUpperCase() as any,
        operationId: op.operationId || `${m}_${pathKey}`,
        summary: op.summary || `${m.toUpperCase()} ${pathKey}`,
        description: op.description || '',
        tags: opTags,
        parameters: parsedParams,
        requestBody: requestBodyDef,
        responses,
        security: op.security || raw.security,
      });
    }
  }

  const schemasCount = Object.keys(raw.components?.schemas || {}).length;

  return {
    id: fileName.replace(/[^a-zA-Z0-9_-]/g, '_'),
    fileName,
    fileSize,
    format: 'openapi_3',
    title,
    version,
    description,
    servers,
    tags: Array.from(tagsSet),
    endpoints,
    schemasCount,
    rawSchemas: raw.components?.schemas,
  };
}

/**
 * Parses a Swagger 2.0 document
 */
function parseSwagger2(raw: any, fileName: string, fileSize: number): ParsedSpec {
  const title = raw.info?.title || fileName;
  const version = raw.info?.version || '1.0.0';
  const description = raw.info?.description || '';

  const host = raw.host || '';
  const basePath = raw.basePath || '';
  const schemes = Array.isArray(raw.schemes) && raw.schemes.length > 0 ? raw.schemes : ['https'];
  
  const servers: ServerDef[] = [];
  if (host) {
    schemes.forEach((sch: string) => {
      const fullUrl = `${sch}://${host}${basePath}`;
      servers.push({
        url: fullUrl,
        description: `${sch.toUpperCase()} Server`,
        environment: host.includes('sandbox') ? 'sandbox' : host.includes('mock') ? 'mock' : 'production',
      });
    });
  } else {
    servers.push({
      url: basePath ? basePath : 'https://sandbox.api.example.com',
      description: 'Default Swagger 2.0 Base URL',
      environment: 'sandbox',
    });
  }

  const tagsSet = new Set<string>();
  const endpoints: EndpointDef[] = [];
  const paths = raw.paths || {};

  for (const [pathKey, pathObj] of Object.entries<any>(paths)) {
    if (!pathObj || typeof pathObj !== 'object') continue;

    const commonParams = Array.isArray(pathObj.parameters) ? pathObj.parameters : [];
    const methods: Array<'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'> = [
      'get', 'post', 'put', 'delete', 'patch', 'options', 'head'
    ];

    for (const m of methods) {
      const op = pathObj[m];
      if (!op) continue;

      const opTags = Array.isArray(op.tags) && op.tags.length > 0 ? op.tags : ['General'];
      opTags.forEach((t: string) => tagsSet.add(t));

      const mergedParams = [...commonParams, ...(Array.isArray(op.parameters) ? op.parameters : [])];
      const parsedParams: ParameterDef[] = [];
      let bodyParam: any = null;

      for (const p of mergedParams) {
        if (p.in === 'body') {
          bodyParam = p;
        } else {
          parsedParams.push({
            name: p.name || 'param',
            in: p.in || 'query',
            required: !!p.required,
            type: p.type || 'string',
            description: p.description || '',
            example: p['x-example'] ?? p.default,
            default: p.default,
            schema: p.schema,
          });
        }
      }

      let requestBodyDef: EndpointDef['requestBody'] = undefined;
      if (bodyParam) {
        const bodySchema = bodyParam.schema;
        requestBodyDef = {
          description: bodyParam.description,
          required: !!bodyParam.required,
          contentTypes: raw.consumes || ['application/json'],
          schema: bodySchema,
          samplePayload: generateMockData(bodySchema),
        };
      }

      const responses: ResponseDef[] = [];
      if (op.responses) {
        for (const [status, respObj] of Object.entries<any>(op.responses)) {
          const respSchema = respObj?.schema;
          responses.push({
            status,
            description: respObj?.description || '',
            schema: respSchema,
            example: respObj?.examples?.['application/json'] || generateMockData(respSchema),
          });
        }
      }

      endpoints.push({
        id: `${m.toUpperCase()}_${pathKey.replace(/[^a-zA-Z0-9_]/g, '_')}`,
        path: pathKey,
        method: m.toUpperCase() as any,
        operationId: op.operationId || `${m}_${pathKey}`,
        summary: op.summary || `${m.toUpperCase()} ${pathKey}`,
        description: op.description || '',
        tags: opTags,
        parameters: parsedParams,
        requestBody: requestBodyDef,
        responses,
        security: op.security || raw.security,
      });
    }
  }

  const schemasCount = Object.keys(raw.definitions || {}).length;

  return {
    id: fileName.replace(/[^a-zA-Z0-9_-]/g, '_'),
    fileName,
    fileSize,
    format: 'swagger_2',
    title,
    version,
    description,
    servers,
    tags: Array.from(tagsSet),
    endpoints,
    schemasCount,
    rawSchemas: raw.definitions,
  };
}

/**
 * Parses an XSD / XML Schema document
 */
function parseXsd(xmlString: string, fileName: string, fileSize: number): ParsedSpec {
  let parsed: any;
  try {
    parsed = xmlParser.parse(xmlString);
  } catch (err: any) {
    return {
      id: fileName.replace(/[^a-zA-Z0-9_-]/g, '_'),
      fileName,
      fileSize,
      format: 'xsd',
      title: fileName,
      version: '1.0',
      description: 'Failed to parse XML schema: ' + err.message,
      servers: [],
      tags: ['XSD'],
      endpoints: [],
      schemasCount: 0,
      errors: [err.message],
    };
  }

  // Find root schema
  const schemaRootKey = Object.keys(parsed).find(
    k => k.toLowerCase().endsWith(':schema') || k.toLowerCase() === 'schema'
  );
  const schema = schemaRootKey ? parsed[schemaRootKey] : parsed;

  const targetNamespace = schema?.['@_targetNamespace'] || schema?.['@_xmlns'] || 'urn:custom:schema';
  const version = schema?.['@_version'] || '1.0.0';

  // Helper to extract documentation
  const getDoc = (node: any): string => {
    if (!node) return '';
    const annotation = node['xsd:annotation'] || node['xs:annotation'] || node['annotation'];
    if (!annotation) return '';
    const doc = annotation['xsd:documentation'] || annotation['xs:documentation'] || annotation['documentation'];
    if (!doc) return '';
    if (typeof doc === 'string') return doc;
    if (doc['#text']) return doc['#text'];
    return JSON.stringify(doc);
  };

  // Helper to normalize array
  const toArray = (v: any) => {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  // Extract Top-Level Elements
  const rawElements = toArray(schema['xsd:element'] || schema['xs:element'] || schema['element']);
  const elements: XsdElement[] = rawElements.map((el: any) => ({
    name: el['@_name'] || el['@_ref'] || 'UnnamedElement',
    type: el['@_type'] || (el['xsd:complexType'] ? 'InlineComplexType' : 'string'),
    documentation: getDoc(el),
    minOccurs: el['@_minOccurs'] ?? 1,
    maxOccurs: el['@_maxOccurs'] ?? 1,
    ref: el['@_ref'],
  }));

  // Extract Complex Types
  const rawComplexTypes = toArray(schema['xsd:complexType'] || schema['xs:complexType'] || schema['complexType']);
  const complexTypes: XsdComplexType[] = rawComplexTypes.map((ct: any) => {
    const name = ct['@_name'] || 'AnonymousComplexType';
    const doc = getDoc(ct);

    let baseType: string | undefined;
    let derivationType: 'extension' | 'restriction' | undefined;
    let seqOrChoiceNode: any = null;

    // Check simpleContent or complexContent
    const contentNode = ct['xsd:complexContent'] || ct['xs:complexContent'] || ct['complexContent'] ||
                        ct['xsd:simpleContent'] || ct['xs:simpleContent'] || ct['simpleContent'];
    if (contentNode) {
      const ext = contentNode['xsd:extension'] || contentNode['xs:extension'] || contentNode['extension'];
      const rest = contentNode['xsd:restriction'] || contentNode['xs:restriction'] || contentNode['restriction'];
      if (ext) {
        baseType = ext['@_base'];
        derivationType = 'extension';
        seqOrChoiceNode = ext['xsd:sequence'] || ext['xs:sequence'] || ext['sequence'] ||
                          ext['xsd:choice'] || ext['xs:choice'] || ext['choice'] ||
                          ext['xsd:all'] || ext['xs:all'] || ext['all'];
      } else if (rest) {
        baseType = rest['@_base'];
        derivationType = 'restriction';
        seqOrChoiceNode = rest['xsd:sequence'] || rest['xs:sequence'] || rest['sequence'];
      }
    } else {
      seqOrChoiceNode = ct['xsd:sequence'] || ct['xs:sequence'] || ct['sequence'] ||
                        ct['xsd:choice'] || ct['xs:choice'] || ct['choice'] ||
                        ct['xsd:all'] || ct['xs:all'] || ct['all'];
    }

    const childElements: XsdElement[] = [];
    if (seqOrChoiceNode) {
      const innerRawEls = toArray(seqOrChoiceNode['xsd:element'] || seqOrChoiceNode['xs:element'] || seqOrChoiceNode['element']);
      for (const el of innerRawEls) {
        childElements.push({
          name: el['@_name'] || el['@_ref'] || 'Element',
          type: el['@_type'] || 'string',
          documentation: getDoc(el),
          minOccurs: el['@_minOccurs'] ?? 1,
          maxOccurs: el['@_maxOccurs'] ?? 1,
          ref: el['@_ref'],
        });
      }
    }

    // Attributes
    const rawAttrs = toArray(ct['xsd:attribute'] || ct['xs:attribute'] || ct['attribute']);
    const attributes = rawAttrs.map((attr: any) => ({
      name: attr['@_name'] || attr['@_ref'] || 'attr',
      type: attr['@_type'] || 'string',
      use: attr['@_use'] || 'optional',
      documentation: getDoc(attr),
    }));

    return {
      name,
      documentation: doc,
      baseType,
      derivationType,
      elements: childElements,
      attributes,
    };
  });

  // Extract Simple Types
  const rawSimpleTypes = toArray(schema['xsd:simpleType'] || schema['xs:simpleType'] || schema['simpleType']);
  const simpleTypes: XsdSimpleType[] = rawSimpleTypes.map((st: any) => {
    const name = st['@_name'] || 'AnonymousSimpleType';
    const doc = getDoc(st);
    const rest = st['xsd:restriction'] || st['xs:restriction'] || st['restriction'];
    const baseType = rest ? rest['@_base'] : 'string';
    
    let enums: string[] | undefined;
    if (rest) {
      const rawEnums = toArray(rest['xsd:enumeration'] || rest['xs:enumeration'] || rest['enumeration']);
      if (rawEnums.length > 0) {
        enums = rawEnums.map((e: any) => e['@_value'] || String(e));
      }
    }

    const pattern = rest?.['xsd:pattern']?.['@_value'] || rest?.['xs:pattern']?.['@_value'];

    return {
      name,
      documentation: doc,
      baseType,
      enumerations: enums,
      pattern,
    };
  });

  // Extract Groups
  const rawGroups = toArray(schema['xsd:group'] || schema['xs:group'] || schema['group']);
  const groups: XsdGroup[] = rawGroups.map((g: any) => {
    const name = g['@_name'] || 'AnonymousGroup';
    const seq = g['xsd:sequence'] || g['xs:sequence'] || g['sequence'] ||
                g['xsd:choice'] || g['xs:choice'] || g['choice'];
    const innerRawEls = seq ? toArray(seq['xsd:element'] || seq['xs:element'] || seq['element']) : [];
    return {
      name,
      documentation: getDoc(g),
      elements: innerRawEls.map((el: any) => ({
        name: el['@_name'] || el['@_ref'] || 'GroupElement',
        type: el['@_type'] || 'string',
        documentation: getDoc(el),
        minOccurs: el['@_minOccurs'] ?? 1,
        maxOccurs: el['@_maxOccurs'] ?? 1,
        ref: el['@_ref'],
      })),
    };
  });

  // Extract Attribute Groups
  const rawAttrGroups = toArray(schema['xsd:attributeGroup'] || schema['xs:attributeGroup'] || schema['attributeGroup']);
  const attributeGroups: XsdAttributeGroup[] = rawAttrGroups.map((ag: any) => {
    const name = ag['@_name'] || 'AnonymousAttributeGroup';
    const rawAttrs = toArray(ag['xsd:attribute'] || ag['xs:attribute'] || ag['attribute']);
    return {
      name,
      documentation: getDoc(ag),
      attributes: rawAttrs.map((attr: any) => ({
        name: attr['@_name'] || attr['@_ref'] || 'attr',
        type: attr['@_type'] || 'string',
        use: attr['@_use'] || 'optional',
        documentation: getDoc(attr),
      })),
    };
  });

  const totalTypes = complexTypes.length + simpleTypes.length + groups.length + elements.length + attributeGroups.length;

  return {
    id: fileName.replace(/[^a-zA-Z0-9_-]/g, '_'),
    fileName,
    fileSize,
    format: 'xsd',
    title: `XML Schema: ${fileName}`,
    version,
    description: `Target Namespace: ${targetNamespace}. Defined ${complexTypes.length} complex types, ${simpleTypes.length} simple types, ${elements.length} global elements, ${groups.length} groups, ${attributeGroups.length} attribute groups.`,
    servers: [],
    tags: ['XSD Schema', 'XML Data Model'],
    endpoints: [],
    schemasCount: totalTypes,
    xsdDetails: {
      targetNamespace,
      version,
      complexTypes,
      simpleTypes,
      elements,
      groups,
      attributeGroups,
    },
  };
}

/**
 * Parses a Postman collection
 */
function parsePostman(raw: any, fileName: string, fileSize: number): ParsedSpec {
  const info = raw.info || {};
  const title = info.name || fileName;
  const description = info.description || 'Postman API Collection';
  const version = '2.1.0';

  const endpoints: EndpointDef[] = [];
  const tagsSet = new Set<string>();

  const traverse = (items: any[], currentTag: string) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (item.item) {
        traverse(item.item, item.name || currentTag);
      } else if (item.request) {
        const req = item.request;
        const tag = currentTag || 'General';
        tagsSet.add(tag);

        const method = (req.method || 'GET').toUpperCase() as any;
        let urlPath = '';
        let serverUrl = '';

        if (typeof req.url === 'string') {
          urlPath = req.url;
        } else if (req.url) {
          const rawUrl = req.url.raw || '';
          const pathSegments = Array.isArray(req.url.path) ? '/' + req.url.path.join('/') : '';
          urlPath = pathSegments || rawUrl;
          if (req.url.host) {
            serverUrl = (req.url.protocol ? req.url.protocol + '://' : 'https://') +
              (Array.isArray(req.url.host) ? req.url.host.join('.') : req.url.host);
          }
        }

        const headers = Array.isArray(req.header) ? req.header : [];
        const params: ParameterDef[] = headers.map((h: any) => ({
          name: h.key || 'Header',
          in: 'header',
          required: false,
          type: 'string',
          description: h.description || '',
          example: h.value,
        }));

        let requestBodyDef: EndpointDef['requestBody'] = undefined;
        if (req.body && req.body.raw) {
          let parsedBody: any = req.body.raw;
          try {
            parsedBody = JSON.parse(req.body.raw);
          } catch {
            // raw text
          }
          requestBodyDef = {
            description: 'Postman raw payload',
            contentTypes: ['application/json'],
            samplePayload: parsedBody,
          };
        }

        endpoints.push({
          id: `POSTMAN_${item.name?.replace(/[^a-zA-Z0-9_]/g, '_') || Math.random().toString(36).substring(7)}`,
          path: urlPath || '/',
          method,
          operationId: item.name,
          summary: item.name || `${method} ${urlPath}`,
          description: req.description || '',
          tags: [tag],
          parameters: params,
          requestBody: requestBodyDef,
          responses: [
            {
              status: '200',
              description: 'Successful Postman execution',
            },
          ],
        });
      }
    }
  };

  traverse(raw.item, 'Root');

  return {
    id: fileName.replace(/[^a-zA-Z0-9_-]/g, '_'),
    fileName,
    fileSize,
    format: 'postman',
    title,
    version,
    description,
    servers: [
      {
        url: 'https://sandbox.api.example.com',
        description: 'Postman Target Environment',
        environment: 'sandbox',
      },
    ],
    tags: Array.from(tagsSet),
    endpoints,
    schemasCount: 0,
  };
}

/**
 * Generates mock sample data from a schema object
 */
export function generateMockData(schema: any, depth = 0): any {
  if (!schema || depth > 4) return {};

  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  const type = schema.type;

  if (type === 'string') {
    if (schema.format === 'date-time') return new Date().toISOString();
    if (schema.format === 'date') return '2026-09-15';
    if (schema.format === 'email') return 'developer@example.com';
    if (schema.format === 'uuid') return 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    if (schema.enum && schema.enum.length > 0) return schema.enum[0];
    return schema.title ? `${schema.title} sample` : 'sample_string';
  }

  if (type === 'integer' || type === 'number') {
    if (schema.minimum !== undefined) return schema.minimum;
    return 100;
  }

  if (type === 'boolean') {
    return true;
  }

  if (type === 'array') {
    return [generateMockData(schema.items, depth + 1)];
  }

  if (type === 'object' || schema.properties) {
    const obj: Record<string, any> = {};
    const props = schema.properties || {};
    for (const [key, propSchema] of Object.entries<any>(props)) {
      obj[key] = generateMockData(propSchema, depth + 1);
    }
    return obj;
  }

  return {};
}

/**
 * Main function to parse a file from disk
 */
export function parseSpecFile(filePath: string): ParsedSpec | null {
  const fileName = path.basename(filePath);
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check XSD or XML
  if (fileName.toLowerCase().endsWith('.xsd') || fileName.toLowerCase().endsWith('.xsd.xml') ||
      content.includes('<xsd:schema') || content.includes('<xs:schema') || content.includes('<schema')) {
    return parseXsd(content, fileName, stats.size);
  }

  // Check JSON
  if (fileName.toLowerCase().endsWith('.json') || fileName.toLowerCase().endsWith('.txt')) {
    try {
      const parsedJson = JSON.parse(content);

      if (parsedJson.info && parsedJson.item && (parsedJson.info.schema || parsedJson.info._postman_id)) {
        return parsePostman(parsedJson, fileName, stats.size);
      }

      if (parsedJson.openapi && String(parsedJson.openapi).startsWith('3.')) {
        return parseOpenApi3(parsedJson, fileName, stats.size);
      }

      if (parsedJson.swagger === '2.0' || parsedJson.swagger === 2.0) {
        return parseSwagger2(parsedJson, fileName, stats.size);
      }

      // Generic JSON containing paths
      if (parsedJson.paths) {
        return parseOpenApi3(parsedJson, fileName, stats.size);
      }
    } catch {
      // Not JSON, try YAML fallback
    }
  }

  // Check YAML
  try {
    const parsedYaml = YAML.parse(content);
    if (parsedYaml && typeof parsedYaml === 'object') {
      if (parsedYaml.openapi && String(parsedYaml.openapi).startsWith('3.')) {
        return parseOpenApi3(parsedYaml, fileName, stats.size);
      }
      if (parsedYaml.swagger === '2.0' || parsedYaml.swagger === 2.0) {
        return parseSwagger2(parsedYaml, fileName, stats.size);
      }
      if (parsedYaml.paths) {
        return parseOpenApi3(parsedYaml, fileName, stats.size);
      }
    }
  } catch (err: any) {
    return {
      id: fileName.replace(/[^a-zA-Z0-9_-]/g, '_'),
      fileName,
      fileSize: stats.size,
      format: 'unknown',
      title: fileName,
      version: '1.0.0',
      description: `Parsing error: ${err.message}`,
      servers: [],
      tags: [],
      endpoints: [],
      schemasCount: 0,
      errors: [err.message],
    };
  }

  return null;
}

/**
 * Generates sample XML string from XSD complexType or element
 */
export function generateSampleXml(
  name: string,
  complexType: XsdComplexType,
  allTypes?: Record<string, XsdComplexType>,
  depth = 0
): string {
  if (depth > 5) return `<${name}>...</${name}>`;

  const attrs = (complexType.attributes || [])
    .map(a => ` ${a.name}="sample_${a.type || 'value'}"`)
    .join('');

  if (!complexType.elements || complexType.elements.length === 0) {
    return `<${name}${attrs}>SampleValue</${name}>`;
  }

  const indent = '  '.repeat(depth + 1);
  const childXml = complexType.elements.map(el => {
    const childName = el.name;
    const refChildType = allTypes && el.type ? allTypes[el.type] : undefined;
    if (refChildType) {
      return generateSampleXml(childName, refChildType, allTypes, depth + 1);
    }
    return `${indent}<${childName}>${el.type || 'sample_data'}</${childName}>`;
  }).join('\n');

  return `<${name}${attrs}>\n${childXml}\n${'  '.repeat(depth)}</${name}>`;
}

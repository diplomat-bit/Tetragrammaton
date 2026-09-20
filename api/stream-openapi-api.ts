import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import * as yamlModule from 'yaml';
const YAML: any = (yamlModule as any).default || yamlModule;

export const streamOpenApiRouter = Router();

const STREAM_DIR = path.resolve(process.cwd(), 'stream');

export interface ParsedEndpoint {
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
    in: 'query' | 'header' | 'path' | 'cookie';
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

function loadSpecsFromStream() {
  if (!fs.existsSync(STREAM_DIR)) {
    fs.mkdirSync(STREAM_DIR, { recursive: true });
  }

  const files = fs.readdirSync(STREAM_DIR).filter(f => f.endsWith('.yaml') || f.endsWith('.yml') || f.endsWith('.json'));
  const specs: Array<{ filename: string; spec: any; endpoints: ParsedEndpoint[] }> = [];

  for (const filename of files) {
    try {
      const fullPath = path.join(STREAM_DIR, filename);
      const content = fs.readFileSync(fullPath, 'utf8');
      let parsed: any;
      if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
        parsed = YAML.parse(content);
      } else {
        parsed = JSON.parse(content);
      }

      if (!parsed || !parsed.paths) continue;

      const title = parsed.info?.title || filename;
      const endpoints: ParsedEndpoint[] = [];

      for (const [pathStr, pathItem] of Object.entries(parsed.paths as Record<string, any>)) {
        if (!pathItem || typeof pathItem !== 'object') continue;

        const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;
        for (const m of methods) {
          const op = pathItem[m];
          if (!op) continue;

          let reqExample: any = null;
          if (op.requestBody?.content?.['application/json']) {
            const jsonContent = op.requestBody.content['application/json'];
            reqExample = jsonContent.example || jsonContent.schema?.example || null;
            if (!reqExample && jsonContent.schema?.properties) {
              reqExample = {};
              for (const [propName, propDef] of Object.entries(jsonContent.schema.properties as Record<string, any>)) {
                reqExample[propName] = propDef.example ?? (propDef.type === 'string' ? 'example' : propDef.type === 'number' ? 100 : true);
              }
            }
          }

          endpoints.push({
            id: `${filename}:${m.toUpperCase()}:${pathStr}`,
            specFile: filename,
            specTitle: title,
            path: pathStr,
            method: m.toUpperCase() as any,
            summary: op.summary || `${m.toUpperCase()} ${pathStr}`,
            description: op.description || '',
            tags: op.tags || [title],
            parameters: [
              ...(pathItem.parameters || []),
              ...(op.parameters || []),
            ],
            requestBody: op.requestBody ? {
              required: op.requestBody.required,
              description: op.requestBody.description,
              example: reqExample,
              schema: op.requestBody.content?.['application/json']?.schema,
            } : undefined,
            responses: op.responses || {},
          });
        }
      }

      specs.push({
        filename,
        spec: {
          info: parsed.info || { title: filename },
          servers: parsed.servers || [],
          openapi: parsed.openapi || '3.0.0',
        },
        endpoints,
      });
    } catch (e: any) {
      console.warn(`Error reading stream spec ${filename}:`, e.message);
    }
  }

  return specs;
}

/**
 * GET /api/stream/specs
 */
streamOpenApiRouter.get('/specs', (req: Request, res: Response) => {
  const specs = loadSpecsFromStream();
  const summary = specs.map(s => ({
    filename: s.filename,
    title: s.spec.info?.title || s.filename,
    version: s.spec.info?.version || '1.0.0',
    description: s.spec.info?.description || '',
    endpointCount: s.endpoints.length,
    endpoints: s.endpoints.map(e => ({
      id: e.id,
      method: e.method,
      path: e.path,
      summary: e.summary,
      tags: e.tags,
    })),
  }));

  const totalEndpoints = specs.reduce((acc, s) => acc + s.endpoints.length, 0);

  return res.json({
    success: true,
    totalSpecs: specs.length,
    totalEndpoints,
    specs: summary,
  });
});

/**
 * GET /api/stream/spec/:filename
 */
streamOpenApiRouter.get('/spec/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const specs = loadSpecsFromStream();
  const found = specs.find(s => s.filename === filename);

  if (!found) {
    return res.status(404).json({ success: false, error: `Spec ${filename} not found in stream/` });
  }

  return res.json({
    success: true,
    spec: found.spec,
    endpoints: found.endpoints,
  });
});

/**
 * POST /api/stream/call
 * Live execution engine for OpenAPI endpoints
 */
streamOpenApiRouter.post('/call', async (req: Request, res: Response) => {
  const {
    method = 'GET',
    path: endpointPath,
    headers = {},
    queryParams = {},
    body = null,
    specFile,
  } = req.body;

  if (!endpointPath) {
    return res.status(400).json({ success: false, error: 'Endpoint path is required' });
  }

  const startTime = Date.now();
  let resolvedUrl = endpointPath;

  // Replace path parameters like {id} or :id
  if (req.body.pathParams && typeof req.body.pathParams === 'object') {
    for (const [key, val] of Object.entries(req.body.pathParams)) {
      resolvedUrl = resolvedUrl.replace(`{${key}}`, String(val)).replace(`:${key}`, String(val));
    }
  }

  // Construct target URL
  const queryStr = Object.keys(queryParams).length > 0
    ? '?' + new URLSearchParams(queryParams as Record<string, string>).toString()
    : '';

  // Check if target is internal /api or relative
  const isInternal = resolvedUrl.startsWith('/api') || resolvedUrl.startsWith('/ajax');
  const targetUrl = isInternal
    ? `http://localhost:3000${resolvedUrl}${queryStr}`
    : resolvedUrl.startsWith('http')
    ? `${resolvedUrl}${queryStr}`
    : `http://localhost:3000${resolvedUrl.startsWith('/') ? '' : '/'}${resolvedUrl}${queryStr}`;

  try {
    const fetchHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-stream-gateway': 'active',
      ...headers,
    };

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: fetchHeaders,
    };

    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const durationMs = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || '';

    let responseData: any;
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    const resHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      resHeaders[key] = val;
    });

    return res.json({
      success: true,
      statusCode: response.status,
      statusText: response.statusText,
      durationMs,
      targetUrl,
      method: method.toUpperCase(),
      responseHeaders: resHeaders,
      data: responseData,
    });
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    return res.status(502).json({
      success: false,
      error: err.message,
      targetUrl,
      method: method.toUpperCase(),
      durationMs,
    });
  }
});

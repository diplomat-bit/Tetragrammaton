import { JwtClaims, RequestPayload } from '../types';

export interface ValidationIssue {
  id: string;
  title: string;
  description: string;
  severity: 'error' | 'warning' | 'success';
}

export function validateHeaders(headers: Record<string, string>, token: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const traceId = headers['trace-id'] || headers['Trace-Id'];
  if (!traceId) {
    issues.push({
      id: 'trace-id',
      title: 'Missing trace-id Header',
      description: 'Chase API requires a unique trace-id for distributed telemetry and logging.',
      severity: 'error',
    });
  } else if (!/^[0-9a-fA-F]{32}$/.test(traceId) && !/^[0-9a-fA-F-]{36}$/.test(traceId)) {
    issues.push({
      id: 'trace-id-format',
      title: 'Invalid trace-id Format',
      description: 'trace-id should be 32-character hex or UUID.',
      severity: 'warning',
    });
  } else {
    issues.push({
      id: 'trace-id-valid',
      title: 'trace-id Validated',
      description: 'trace-id matches required formatting specifications.',
      severity: 'success',
    });
  }

  const enrollmentCode = headers['enrollment-type-code'] || headers['Enrollment-Type-Code'];
  if (!enrollmentCode) {
    issues.push({
      id: 'enrollment-code',
      title: 'Missing enrollment-type-code',
      description: 'Required for partner enrollment channel authentication.',
      severity: 'error',
    });
  } else {
    issues.push({
      id: 'enrollment-code-valid',
      title: 'enrollment-type-code Present',
      description: `Value: ${enrollmentCode}`,
      severity: 'success',
    });
  }

  const extAccount = headers['external-account-identifier'] || headers['External-Account-Identifier'];
  if (!extAccount) {
    issues.push({
      id: 'ext-account',
      title: 'Missing external-account-identifier',
      description: 'Required to map partner institution records to Chase core banking state.',
      severity: 'warning',
    });
  } else {
    issues.push({
      id: 'ext-account-valid',
      title: 'external-account-identifier Present',
      description: `Value: ${extAccount}`,
      severity: 'success',
    });
  }

  const authHeader = headers['authorization'] || headers['Authorization'] || token;
  if (!authHeader) {
    issues.push({
      id: 'auth-header',
      title: 'Missing Authorization Token',
      description: 'Bearer token or OAuth signature is required for API requests.',
      severity: 'error',
    });
  } else if (!authHeader.toLowerCase().includes('bearer')) {
    issues.push({
      id: 'auth-bearer',
      title: 'Bearer Prefix Recommended',
      description: 'Authorization header should typically start with "Bearer ".',
      severity: 'warning',
    });
  } else {
    issues.push({
      id: 'auth-valid',
      title: 'Authorization Header Configured',
      description: 'Bearer token is correctly attached.',
      severity: 'success',
    });
  }

  return issues;
}

export function generateTraceId(): string {
  return generateRandomHex(32);
}

export function generateMockToken(): string {
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'chase-prod-key-1' }));
  const payload = btoa(
    JSON.stringify({
      sub: 'corporate-client-9981',
      iss: 'https://api.chase.com/oauth/v2/token',
      aud: 'https://api.chase.com/commercial',
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
      scope: 'payments.initiate accounts.read balance.read',
    })
  );
  const signature = generateRandomHex(64);
  return `Bearer ${header}.${payload}.${signature}`;
}

export function buildRawHttpRequest(payload: RequestPayload): string {
  const host = payload.host || 'api.chase.com';
  const endpointPath = payload.endpointPath || '/';
  const method = payload.method || 'GET';
  const headers = payload.headers || {};
  const body = payload.body || '';

  let raw = `${method} ${endpointPath} HTTP/1.1\r\n`;
  raw += `Host: ${host}\r\n`;
  for (const [k, v] of Object.entries(headers)) {
    raw += `${k}: ${v}\r\n`;
  }
  raw += `Content-Type: application/json\r\n`;
  if (body) {
    raw += `Content-Length: ${body.length}\r\n`;
  }
  raw += `\r\n${body}`;
  return raw;
}

export function formatCurl(
  methodOrPayload: string | RequestPayload,
  url?: string,
  headers?: Record<string, string>,
  body?: string
): string {
  if (typeof methodOrPayload === 'object') {
    return buildCurlCommand(methodOrPayload);
  }
  const method = methodOrPayload || 'GET';
  const targetUrl = url || 'https://api.chase.com';
  let cmd = `curl -X ${method} "${targetUrl}"`;
  if (headers) {
    for (const [k, v] of Object.entries(headers)) {
      if (v) cmd += ` \\\n  -H "${k}: ${v}"`;
    }
  }
  if (body && ['PUT', 'POST', 'PATCH'].includes(method.toUpperCase())) {
    cmd += ` \\\n  -d '${body}'`;
  }
  return cmd;
}

export function formatRawHttp(payload: RequestPayload): string {
  return buildRawHttpRequest(payload);
}

export function formatFetch(
  methodOrPayload: string | RequestPayload,
  url?: string,
  headers?: Record<string, string>,
  body?: string
): string {
  if (typeof methodOrPayload === 'object') {
    return `fetch("https://" + host + endpointPath, {
  method: "${methodOrPayload.method}",
  headers: ${JSON.stringify(methodOrPayload.headers, null, 2)},
  body: ${methodOrPayload.body ? JSON.stringify(methodOrPayload.body) : 'null'}
})
.then(res => res.json())
.then(data => console.log(data));`;
  }
  return `fetch("${url || 'https://api.chase.com'}", {
  method: "${methodOrPayload}",
  headers: ${JSON.stringify(headers || {}, null, 2)},
  body: ${body ? JSON.stringify(body) : 'null'}
})
.then(res => res.json())
.then(data => console.log(data));`;
}

export function formatPython(
  methodOrPayload: string | RequestPayload,
  url?: string,
  headers?: Record<string, string>,
  body?: string
): string {
  const targetUrl = typeof methodOrPayload === 'object' ? 'https://api.chase.com' : (url || 'https://api.chase.com');
  const hdrs = typeof methodOrPayload === 'object' ? methodOrPayload.headers : (headers || {});
  const m = typeof methodOrPayload === 'object' ? methodOrPayload.method : methodOrPayload;
  const b = typeof methodOrPayload === 'object' ? methodOrPayload.body : body;

  return `import requests

url = "${targetUrl}"
headers = ${JSON.stringify(hdrs, null, 4)}
data = ${b ? JSON.stringify(b, null, 4) : 'None'}

response = requests.request("${m}", url, headers=headers, json=data)
print(response.json())`;
}

export function formatNodeAxios(
  methodOrPayload: string | RequestPayload,
  url?: string,
  headers?: Record<string, string>,
  body?: string
): string {
  const targetUrl = typeof methodOrPayload === 'object' ? 'https://api.chase.com' : (url || 'https://api.chase.com');
  const hdrs = typeof methodOrPayload === 'object' ? methodOrPayload.headers : (headers || {});
  const m = typeof methodOrPayload === 'object' ? methodOrPayload.method : methodOrPayload;
  const b = typeof methodOrPayload === 'object' ? methodOrPayload.body : body;

  return `const axios = require('axios');

let config = {
  method: '${(m || 'GET').toLowerCase()}',
  maxBodyLength: Infinity,
  url: '${targetUrl}',
  headers: ${JSON.stringify(hdrs, null, 2)},
  data: ${b ? JSON.stringify(b) : 'null'}
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});`;
}

export function formatGo(
  methodOrPayload: string | RequestPayload,
  url?: string,
  headers?: Record<string, string>,
  body?: string
): string {
  const targetUrl = typeof methodOrPayload === 'object' ? 'https://api.chase.com' : (url || 'https://api.chase.com');
  const hdrs = typeof methodOrPayload === 'object' ? methodOrPayload.headers : (headers || {});
  const m = typeof methodOrPayload === 'object' ? methodOrPayload.method : methodOrPayload;
  const b = typeof methodOrPayload === 'object' ? methodOrPayload.body : body;

  return `package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {
	client := &http.Client{}
	req, err := http.NewRequest("${m}", "${targetUrl}", nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	${Object.entries(hdrs)
    .map(([k, v]) => `req.Header.Add("${k}", "${v}")`)
    .join('\n\t')}
	
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`;
}

export function parseJwt(token: string): JwtClaims {
  const clean = (token || '').replace(/^Bearer\s+/i, '').trim();
  const parts = clean.split('.');

  if (parts.length !== 3) {
    return {
      header: {},
      payload: {},
      isValidJwt: false,
    };
  }

  try {
    const decodePart = (str: string) => {
      const base64 = (str || '').replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    };

    const header = decodePart(parts[0]);
    const payload = decodePart(parts[1]);

    const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : undefined;
    const expDate = payload.exp ? new Date(payload.exp * 1000).toLocaleString() : undefined;
    const issuedAt = payload.iat ? new Date(payload.iat * 1000).toLocaleString() : undefined;

    return {
      header,
      payload,
      isValidJwt: true,
      isExpired,
      expDate,
      issuedAt,
      issuer: payload.iss,
      subject: payload.sub,
    };
  } catch {
    return {
      header: {},
      payload: {},
      isValidJwt: false,
    };
  }
}

export function generateRandomHex(length = 32): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function buildCurlCommand(payload: RequestPayload): string {
  if (!payload) return '';
  const cleanToken = (payload.token || '').replace(/^Bearer\s+/i, '').trim();
  const host = payload.host || 'api.chase.com';
  const endpointPath = payload.endpointPath || '';
  const url = `https://${host.replace(/^https?:\/\//, '').replace(/\/+$/, '')}${endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`}`;

  let cmd = `curl -X ${payload.method || 'GET'} "${url}" \\\n`;
  cmd += `  -H "Host: ${host}" \\\n`;
  cmd += `  -H "Content-Type: application/json" \\\n`;
  cmd += `  -H "Accept: application/json" \\\n`;
  cmd += `  -H "authorization: Bearer ${cleanToken || '<access_token>'}" \\\n`;
  cmd += `  -H "enrollment-type-code: ${payload.headers?.['enrollment-type-code'] || 'ENROLL'}" \\\n`;
  cmd += `  -H "external-account-identifier: ${payload.headers?.['external-account-identifier'] || '9876543210'}" \\\n`;
  cmd += `  -H "trace-id: ${payload.headers?.['trace-id'] || '4a7b1e2c3d4f5a6b7c8d9e0f1a2b3c4d'}" \\\n`;
  cmd += `  -H "channel-type: ${payload.headers?.['channel-type'] || 'WEB'}"`;

  if (payload.body && payload.method !== 'GET') {
    try {
      const minifiedBody = JSON.stringify(JSON.parse(payload.body || '{}'));
      cmd += ` \\\n  -d '${minifiedBody}'`;
    } catch {
      cmd += ` \\\n  -d '${payload.body}'`;
    }
  }

  return cmd;
}

export function generateCurlCommand(
  methodOrPayload: string | RequestPayload,
  url?: string,
  token?: string,
  headers?: Record<string, string>,
  body?: string | null
): string {
  if (typeof methodOrPayload === 'object' && methodOrPayload !== null) {
    return buildCurlCommand(methodOrPayload);
  }
  const method = methodOrPayload || 'GET';
  const targetUrl = url || 'https://api.chase.com/v1/payments';
  const cleanToken = (token || '').replace(/^Bearer\s+/i, '').trim();
  const hdrs = headers || {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'trace-id': '4a7b1e2c3d4f5a6b7c8d9e0f1a2b3c4d',
  };

  let cmd = `curl -X ${method} "${targetUrl}" \\\n`;
  for (const [k, v] of Object.entries(hdrs)) {
    cmd += `  -H "${k}: ${v}" \\\n`;
  }
  if (cleanToken) {
    cmd += `  -H "authorization: Bearer ${cleanToken}" \\\n`;
  }
  cmd = cmd.replace(/\\\n$/, '');
  if (body && method !== 'GET') {
    try {
      const minified = JSON.stringify(JSON.parse(body));
      cmd += ` \\\n  -d '${minified}'`;
    } catch {
      cmd += ` \\\n  -d '${body}'`;
    }
  }
  return cmd;
}

export function generateFetchSnippet(
  methodOrPayload: string | RequestPayload,
  url?: string,
  token?: string,
  headers?: Record<string, string>,
  body?: string | null
): string {
  if (typeof methodOrPayload === 'object' && methodOrPayload !== null) {
    const p = methodOrPayload;
    return formatFetch(p);
  }
  const method = methodOrPayload || 'GET';
  const targetUrl = url || 'https://api.chase.com/v1/payments';
  const cleanToken = (token || '').replace(/^Bearer\s+/i, '').trim();
  const hdrs = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(headers || {}),
    ...(cleanToken ? { 'Authorization': `Bearer ${cleanToken}` } : {}),
  };

  return `const response = await fetch("${targetUrl}", {
  method: "${method}",
  headers: ${JSON.stringify(hdrs, null, 2)},
  body: ${body && method !== 'GET' ? JSON.stringify(body) : 'null'}
});
const data = await response.json();
console.log(data);`;
}

export function generateAxiosSnippet(
  methodOrPayload: string | RequestPayload,
  url?: string,
  token?: string,
  headers?: Record<string, string>,
  body?: string | null
): string {
  if (typeof methodOrPayload === 'object' && methodOrPayload !== null) {
    return formatNodeAxios(methodOrPayload);
  }
  const methodStr = typeof methodOrPayload === 'string' ? methodOrPayload : (methodOrPayload?.method || 'GET');
  const method = methodStr.toLowerCase();
  const targetUrl = url || 'https://api.chase.com/v1/payments';
  const cleanToken = (token || '').replace(/^Bearer\s+/i, '').trim();
  const hdrs = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(headers || {}),
    ...(cleanToken ? { 'Authorization': `Bearer ${cleanToken}` } : {}),
  };

  return `const axios = require('axios');

let config = {
  method: '${method}',
  url: '${targetUrl}',
  headers: ${JSON.stringify(hdrs, null, 2)},
  data: ${body && method !== 'get' ? body : 'null'}
};

axios.request(config)
  .then((response) => console.log(response.data))
  .catch((error) => console.log(error));`;
}

export function generatePythonSnippet(
  methodOrPayload: string | RequestPayload,
  url?: string,
  token?: string,
  headers?: Record<string, string>,
  body?: string | null
): string {
  if (typeof methodOrPayload === 'object' && methodOrPayload !== null) {
    return formatPython(methodOrPayload);
  }
  const method = methodOrPayload || 'GET';
  const targetUrl = url || 'https://api.chase.com/v1/payments';
  const cleanToken = (token || '').replace(/^Bearer\s+/i, '').trim();
  const hdrs = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(headers || {}),
    ...(cleanToken ? { 'Authorization': `Bearer ${cleanToken}` } : {}),
  };

  return `import requests

url = "${targetUrl}"
headers = ${JSON.stringify(hdrs, null, 4)}
payload = ${body && method !== 'GET' ? body : 'None'}

response = requests.request("${method}", url, headers=headers, json=payload if payload else None)
print(response.json())`;
}

export function generateJavaSnippet(
  methodOrPayload: string | RequestPayload,
  url?: string,
  token?: string,
  headers?: Record<string, string>,
  body?: string | null
): string {
  const method = typeof methodOrPayload === 'object' ? methodOrPayload.method : (methodOrPayload || 'GET');
  const targetUrl = typeof methodOrPayload === 'object' ? `https://${methodOrPayload.host}${methodOrPayload.endpointPath}` : (url || 'https://api.chase.com/v1/payments');
  return `HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${targetUrl}"))
    .method("${method}", HttpRequest.BodyPublishers.noBody())
    .header("Content-Type", "application/json")
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`;
}

export function generateGoSnippet(
  methodOrPayload: string | RequestPayload,
  url?: string,
  token?: string,
  headers?: Record<string, string>,
  body?: string | null
): string {
  if (typeof methodOrPayload === 'object' && methodOrPayload !== null) {
    return formatGo(methodOrPayload);
  }
  const method = methodOrPayload || 'GET';
  const targetUrl = url || 'https://api.chase.com/v1/payments';
  return `package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {
	client := &http.Client{}
	req, err := http.NewRequest("${method}", "${targetUrl}", nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	req.Header.Add("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`;
}


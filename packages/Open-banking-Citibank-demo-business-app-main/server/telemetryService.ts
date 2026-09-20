export interface ApiCallLog {
  id: string;
  timestamp: string;
  service: 'OBP_AUTH' | 'OBP_DATA' | 'COMMERCIAL_PAPER' | 'MODERN_TREASURY' | 'QUANTUM_COPILOT' | 'CONFIG' | 'CUSTOM_API';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  targetUrl?: string;
  status: number;
  statusText: string;
  durationMs: number;
  requestHeaders?: Record<string, string>;
  requestBody?: any;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
  mode: 'LIVE_OBP_API' | 'LOCAL_SANDBOX' | 'INTERNAL_ENGINE' | 'API_PROXY';
  isError?: boolean;
}

// In-memory ring buffer of recent API calls (up to 150 items)
const callLogs: ApiCallLog[] = [];
const MAX_LOGS = 150;

export function recordApiCall(log: Omit<ApiCallLog, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): ApiCallLog {
  const fullLog: ApiCallLog = {
    id: log.id || `call_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: log.timestamp || new Date().toISOString(),
    service: log.service,
    method: log.method,
    url: log.url,
    targetUrl: log.targetUrl,
    status: log.status,
    statusText: log.statusText,
    durationMs: log.durationMs,
    requestHeaders: sanitizeHeaders(log.requestHeaders),
    requestBody: log.requestBody,
    responseHeaders: log.responseHeaders,
    responseBody: log.responseBody,
    mode: log.mode,
    isError: log.isError !== undefined ? log.isError : (log.status >= 400),
  };

  callLogs.unshift(fullLog);
  if (callLogs.length > MAX_LOGS) {
    callLogs.pop();
  }
  return fullLog;
}

export function getApiCallLogs(limit: number = 100): ApiCallLog[] {
  return callLogs.slice(0, limit);
}

export function clearApiCallLogs(): void {
  callLogs.length = 0;
}

function sanitizeHeaders(headers?: Record<string, string>): Record<string, string> | undefined {
  if (!headers) return undefined;
  const sanitized: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === 'authorization') {
      if (v.startsWith('DirectLogin token="')) {
        sanitized[k] = `DirectLogin token="${v.slice(19, 25)}...${v.slice(-4)}"`;
      } else if (v.startsWith('DirectLogin username=')) {
        sanitized[k] = v.replace(/password="[^"]+"/, 'password="••••••••"');
      } else if (v.startsWith('Bearer ')) {
        sanitized[k] = `Bearer ${v.slice(7, 12)}...`;
      } else {
        sanitized[k] = '••••••••';
      }
    } else {
      sanitized[k] = v;
    }
  }
  return sanitized;
}

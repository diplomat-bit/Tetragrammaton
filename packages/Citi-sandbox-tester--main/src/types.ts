export interface Telemetry {
  url: string;
  requestHeaders: Record<string, string>;
  requestBody: any;
  status: number;
  statusText: string;
  responseTimeMs: number;
}

export interface ApiResponse {
  id: string;
  timestamp: string;
  telemetry: Telemetry;
  data: any;
  error?: string;
}

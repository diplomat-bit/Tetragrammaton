import { InsuranceBookingPayload, RequestHeadersConfig } from './types';

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

export function buildCurlCommand(
  headers: RequestHeadersConfig,
  payload: InsuranceBookingPayload
): string {
  const tokenPart = headers.bearerToken ? `Bearer ${headers.bearerToken}` : 'Bearer ';
  const jsonPayload = JSON.stringify(payload, null, 2);

  return `curl --request POST \\
  --url '${headers.apiUrl}' \\
  --header 'Accept: ${headers.accept}' \\
  --header 'Authorization: ${tokenPart}' \\
  --header 'Content-Type: ${headers.contentType}' \\
  --header 'client_id: ${headers.clientId}' \\
  --header 'uuid: ${headers.uuid}' \\
  --data '${jsonPayload.replace(/'/g, "'\\''")}'`;
}

export async function fetchEnvConfig(): Promise<Partial<RequestHeadersConfig & Record<string, string>>> {
  try {
    const res = await fetch('/api/env-config');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch server env config, using defaults:', e);
  }
  return {};
}

export async function sendProxyBookingRequest(
  headers: RequestHeadersConfig,
  payload: InsuranceBookingPayload
) {
  try {
    const res = await fetch('/api/proxy-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetUrl: headers.apiUrl,
        headers: {
          accept: headers.accept,
          contentType: headers.contentType,
          clientId: headers.clientId,
          uuid: headers.uuid,
          bearerToken: headers.bearerToken,
        },
        payload,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      status: 500,
      statusText: 'Client Network Error',
      durationMs: 0,
      requestHeaders: {
        'Accept': headers.accept,
        'Content-Type': headers.contentType,
        'client_id': headers.clientId,
        'uuid': headers.uuid,
        'Authorization': headers.bearerToken ? `Bearer ${headers.bearerToken}` : 'Bearer ',
      },
      responseHeaders: {},
      error: err?.message || 'Failed to dispatch proxy request',
      data: {
        error: 'Failed to send request',
        message: err?.message || 'Check network or backend dev server status.',
      },
    };
  }
}

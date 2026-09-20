export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ChaseHeaders {
  'enrollment-type-code'?: string;
  'external-account-identifier'?: string;
  'trace-id'?: string;
  'channel-type'?: string;
  authorization?: string;
  'partner-id'?: string;
  'client-request-id'?: string;
  'request-timestamp'?: string;
  [key: string]: string | undefined;
}

export interface RequestPayload {
  token?: string;
  host?: string;
  endpointPath?: string;
  method: string;
  headers: Record<string, string>;
  body?: string | null;
  simulate?: boolean;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  durationMs: number;
  timestamp: string;
  isSimulated?: boolean;
  latencyMs?: number;
}

export interface ExecutionResponse {
  success: boolean;
  status: number;
  statusText: string;
  durationMs: number;
  headers: Record<string, string>;
  data: any;
  rawResponse: string;
  requestDetails: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: any;
  };
  isSimulated: boolean;
  error: string | null;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  method: HttpMethod | string;
  url: string;
  headers: Record<string, string>;
  body: string;
  externalAccountIdentifier: string;
  enrollmentId: string;
  responseStatus: number;
  responseDuration: number;
}

export interface JwtClaims {
  header: Record<string, any>;
  payload: Record<string, any>;
  isValidJwt: boolean;
  isExpired?: boolean;
  expDate?: string;
  issuedAt?: string;
  issuer?: string;
  subject?: string;
  iss?: string;
  sub?: string;
  scope?: string;
  client_id?: string;
}

export const DEFAULT_HEADERS: Record<string, string> = {
  authorization: 'Bearer chase_live_mock_sec_token_99182',
  'enrollment-type-code': 'ENROLL',
  'external-account-identifier': '9876543210',
  'trace-id': '4a7b1e2c3d4f5a6b7c8d9e0f1a2b3c4d',
  'channel-type': 'WEB',
  'partner-id': 'PRT-CHASE-00921',
  'client-request-id': 'req-9921820-chase',
};

export interface PresetEndpointItem {
  name: string;
  method: HttpMethod;
  externalAccountIdentifier: string;
  enrollmentId: string;
  headers: Record<string, string>;
  body: string;
}

export const PRESETS: Record<string, PresetEndpointItem> = {
  standardEnrollment: {
    name: 'Enroll Cardmember In Loyalty Program',
    method: 'PUT',
    externalAccountIdentifier: 'ACC-CHASE-88910',
    enrollmentId: 'ENR-99281-CHASE',
    headers: {
      'enrollment-type-code': 'ENROLL',
      'channel-type': 'WEB',
    },
    body: JSON.stringify(
      {
        partnerProgramId: 'ULTIMATE_REWARDS_ECOMMERCE',
        autoRedeemOption: true,
        notificationPreferences: {
          email: true,
          sms: false,
        },
      },
      null,
      2
    ),
  },
  inquirePoints: {
    name: 'Check Rewards & Points Balance',
    method: 'GET',
    externalAccountIdentifier: 'ACC-CHASE-88910',
    enrollmentId: 'ENR-99281-CHASE',
    headers: {
      'enrollment-type-code': 'INQUIRE',
      'channel-type': 'API',
    },
    body: '',
  },
  cancelEnrollment: {
    name: 'Disenroll Cardmember',
    method: 'PUT',
    externalAccountIdentifier: 'ACC-CHASE-88910',
    enrollmentId: 'ENR-99281-CHASE',
    headers: {
      'enrollment-type-code': 'DISENROLL',
      'channel-type': 'WEB',
    },
    body: JSON.stringify(
      {
        reasonCode: 'CUSTOMER_REQUESTED',
        retentionNotes: 'Member migrated to Corporate Diamond fleet',
      },
      null,
      2
    ),
  },
  missingTraceIdError: {
    name: 'Simulate 400 Bad Header (Missing Trace)',
    method: 'PUT',
    externalAccountIdentifier: 'ACC-CHASE-88910',
    enrollmentId: 'ENR-99281-CHASE',
    headers: {
      'trace-id': '',
      'enrollment-type-code': 'ENROLL',
    },
    body: '{}',
  },
};

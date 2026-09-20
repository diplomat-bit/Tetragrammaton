import { DebtorAccount, RequestConfig } from '../types';

export const DEFAULT_CITI_ENDPOINT =
  'https://partner.citi.com/gcgapi/sandbox/prod/openapi/open-banking/v3.1/cbpii/funds-confirmation-consents';

export const SAMPLE_PRESETS = [
  {
    label: 'James (UK BBAN) - Default Example',
    debtorAccount: {
      SchemeName: 'UK.OBIE.BBAN',
      Identification: 'GB29CITI60161331926819',
      Name: 'James',
      SecondaryIdentification: 'ROLL-882910',
    },
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.sandbox_token_demo_98231',
    financialId: 'citi-sandbox-fid-001',
  },
  {
    label: 'Sarah Jenkins (UK IBAN)',
    debtorAccount: {
      SchemeName: 'UK.OBIE.IBAN',
      Identification: 'GB82CITI08321012345678',
      Name: 'Sarah Jenkins',
      SecondaryIdentification: 'ROLL-449102',
    },
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.sandbox_token_demo_44122',
    financialId: 'citi-sandbox-fid-001',
  },
  {
    label: 'Alex Rivera (Sort Code & Account)',
    debtorAccount: {
      SchemeName: 'UK.OBIE.SortCodeAccountNumber',
      Identification: '18500812345678',
      Name: 'Alex Rivera',
      SecondaryIdentification: 'ROLL-102938',
    },
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.sandbox_token_demo_77189',
    financialId: 'citi-sandbox-fid-001',
  },
];

/**
 * Parses a raw cURL command string into structured Open Banking parameters
 */
export function parseCurlCommand(rawCurl: string): Partial<RequestConfig> {
  const result: Partial<RequestConfig> = {
    method: 'POST',
    customHeaders: {},
  };

  const clean = rawCurl.replace(/\\\n/g, ' ').replace(/\\\r\n/g, ' ').trim();

  // Extract URL
  const urlMatch = clean.match(/--url\s+['"]?([^'"\s]+)['"]?/) || clean.match(/curl\s+(?:--request\s+\w+\s+)?['"]?(https?:\/\/[^'"\s]+)['"]?/);
  if (urlMatch && urlMatch[1]) {
    result.url = urlMatch[1];
  }

  // Extract Method
  const methodMatch = clean.match(/(?:-X|--request)\s+['"]?([A-Za-z]+)['"]?/);
  if (methodMatch && methodMatch[1]) {
    result.method = methodMatch[1].toUpperCase() as any;
  }

  // Extract Headers
  const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = headerRegex.exec(clean)) !== null) {
    const headerLine = match[1];
    const colonIdx = headerLine.indexOf(':');
    if (colonIdx > 0) {
      const key = headerLine.substring(0, colonIdx).trim();
      const val = headerLine.substring(colonIdx + 1).trim();

      if (key.toLowerCase() === 'authorization') {
        const tokenVal = val.replace(/^Bearer\s+/i, '');
        result.token = tokenVal;
      } else if (key.toLowerCase() === 'x-fapi-financial-id') {
        result.financialId = val;
      } else {
        if (!result.customHeaders) result.customHeaders = {};
        result.customHeaders[key] = val;
      }
    }
  }

  // Extract Body data if present (-d, --data, --data-raw)
  const dataMatch = clean.match(/(?:-d|--data|--data-raw)\s+['"](\{[\s\S]*?\})['"]/);
  if (dataMatch && dataMatch[1]) {
    try {
      const parsedData = JSON.parse(dataMatch[1]);
      result.bodyJson = JSON.stringify(parsedData, null, 2);
      if (parsedData?.Data?.DebtorAccount) {
        result.debtorAccount = parsedData.Data.DebtorAccount;
      }
    } catch {
      result.bodyJson = dataMatch[1];
    }
  }

  return result;
}

/**
 * Builds the canonical cURL command string based on current inputs
 */
export function buildCurlCommand(config: {
  url: string;
  method?: string;
  token?: string;
  financialId?: string;
  body?: any;
}): string {
  const method = config.method || 'POST';
  const lines: string[] = [`curl --request ${method} \\`];
  lines.push(`  --url '${config.url}' \\`);
  lines.push(`  --header 'Accept: application/json' \\`);
  lines.push(`  --header 'Authorization: Bearer ${config.token || '$token'}' \\`);
  lines.push(`  --header 'Content-Type: application/json' \\`);
  lines.push(`  --header 'x-fapi-financial-id: ${config.financialId || '$fid'}'`);

  if (method !== 'GET' && method !== 'HEAD' && config.body) {
    lines[lines.length - 1] += ' \\';
    const bodyStr = typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
    lines.push(`  --data '${bodyStr}'`);
  }

  return lines.join('\n');
}

/**
 * Formats standard ISO date time
 */
export function formatDateTime(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Formats currency amount
 */
export function formatCurrency(amount?: string | number, currency = 'GBP'): string {
  if (amount === undefined || amount === null || amount === '') return '—';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return `${currency} ${amount}`;

  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency || 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currency} ${num.toFixed(2)}`;
  }
}

/**
 * Builds the canonical Open Banking Consent creation payload
 */
export function buildConsentPayload(debtor: DebtorAccount, expirationHours = 24) {
  const expiry = new Date(Date.now() + expirationHours * 60 * 60 * 1000).toISOString();
  return {
    Data: {
      ExpirationDateTime: expiry,
      DebtorAccount: {
        SchemeName: debtor.SchemeName || 'UK.OBIE.BBAN',
        Identification: debtor.Identification || 'GB29CITI60161331926819',
        Name: debtor.Name || 'James',
        ...(debtor.SecondaryIdentification ? { SecondaryIdentification: debtor.SecondaryIdentification } : {}),
      },
    },
  };
}

/**
 * Universal QuickBooks Realm ID Sanitizer & Resolver for Backend Express
 * Eliminates prefix pollution such as "IDrealmid=", "realmid=", "realmId=", "id=",
 * URL query fragments, quotes, and trailing parameters.
 */
export function sanitizeRealmId(input?: string | number | null): string {
  if (input === null || input === undefined) return '';
  let str = String(input).trim();
  if (!str) return '';

  // 1. If full URL or query string passed (e.g. ?code=...&realmId=9341457771341574)
  if (str.includes('?') || str.includes('&') || str.includes('http') || str.includes('=')) {
    const match = str.match(/(?:realmId|realmid|realm_id|companyId|company_id|IDrealmid|id)\s*=\s*([0-9a-zA-Z_-]+)/i);
    if (match && match[1]) {
      str = match[1].trim();
    }
  }

  // 2. Strip leading prefix words and symbols like "IDrealmid=", "realmId:", "id = "
  str = str.replace(/^(?:IDrealmid|realm_?id|company_?id|id)\s*[:=]\s*/i, '');

  // 3. Strip wrapping quotes, brackets, and spaces
  str = str.replace(/^[{"'(\[]+|[}"')\]]+$/g, '').trim();

  // 4. If there's a trailing delimiter like &... or ;... or ?...
  if (str.includes('&')) str = str.split('&')[0].trim();
  if (str.includes(';')) str = str.split(';')[0].trim();
  if (str.includes('?')) str = str.split('?')[0].trim();

  // 5. Look for standard QuickBooks Realm ID numeric pattern (typically 10 to 25 digits)
  const digitMatch = str.match(/\b\d{10,25}\b/);
  if (digitMatch) {
    return digitMatch[0];
  }

  // Fallback to cleanly trimmed string with non-alphanumerics removed
  return str.replace(/[^a-zA-Z0-9_-]/g, '').trim();
}

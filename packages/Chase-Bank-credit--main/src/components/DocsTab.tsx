import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Key, Code, HelpCircle, ArrowRight, ExternalLink, Terminal, AlertTriangle, Layers, Zap } from 'lucide-react';

export const DocsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'headers' | 'schemas' | 'errors' | 'auth'>('overview');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Navigation tabs within Docs */}
      <div className="border-b border-slate-200 px-6 py-3 bg-slate-50 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'API Overview & Endpoints' },
          { id: 'headers', label: 'Header Specifications' },
          { id: 'schemas', label: 'Payload Schemas' },
          { id: 'errors', label: 'Error Codes & Troubleshooting' },
          { id: 'auth', label: 'OAuth 2.0 & Security' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSection === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
        {activeSection === 'overview' && (
          <div className="space-y-6 text-sm text-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Chase Pay-With-Points (PWP) Partner Integration</h2>
              <p className="leading-relaxed text-slate-600">
                The Chase Pay-With-Points (PWP) API enables authorized partners and merchants to allow Chase cardmembers to redeem Ultimate Rewards points at checkout.
                Enrollment links a partner customer's account to their Chase rewards account.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                Target URI Template
              </h3>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                <span className="text-emerald-400 font-bold">PUT</span>{' '}
                https://api.chase.com/chase/digital/v1/external-accounts/<span className="text-amber-300">{'{external-account-identifier}'}</span>/enrollments/<span className="text-cyan-300">{'{enrollment-id}'}</span>
              </div>
              <p className="text-xs text-slate-500">
                Path parameters must be URL-encoded. The <code className="text-slate-800 font-mono">external-account-identifier</code> represents the partner customer identifier, and <code className="text-slate-800 font-mono">enrollment-id</code> is the unique enrollment token or identifier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-blue-700">
                  <Zap className="w-4 h-4" /> Operations Supported
                </h4>
                <ul className="text-xs space-y-1.5 text-slate-600">
                  <li><strong className="text-slate-900">PUT /enrollments:</strong> Create or update cardmember enrollment</li>
                  <li><strong className="text-slate-900">GET /enrollments:</strong> Query current enrollment state & points balance</li>
                  <li><strong className="text-slate-900">DELETE /enrollments:</strong> Disenroll customer from Pay-with-Points</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" /> Compliance & SLA
                </h4>
                <ul className="text-xs space-y-1.5 text-slate-600">
                  <li><strong>TLS 1.3:</strong> Mandatory encrypted transit with mTLS mutual authentication in production</li>
                  <li><strong>Target Latency:</strong> &lt; 250ms p99 SLA</li>
                  <li><strong>Idempotency:</strong> Handled via unique <code className="font-mono text-slate-800">trace-id</code> header</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'headers' && (
          <div className="space-y-6 text-sm text-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Mandatory & Optional HTTP Headers</h2>
              <p className="text-slate-600">
                Chase requires strict header conformity for routing, distributed logging, and audit verification.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Header Name</th>
                    <th className="p-3">Required</th>
                    <th className="p-3">Format / Example</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="p-3 font-mono font-bold text-blue-700">authorization</td>
                    <td className="p-3 text-rose-600 font-bold">REQUIRED</td>
                    <td className="p-3 font-mono text-slate-600">Bearer eyJhbGciOi...</td>
                    <td className="p-3 text-slate-600">OAuth 2.0 Access token obtained from Chase Token Endpoint.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-blue-700">trace-id</td>
                    <td className="p-3 text-rose-600 font-bold">REQUIRED</td>
                    <td className="p-3 font-mono text-slate-600">e3b0c44298fc1c149afbf4c8996fb924</td>
                    <td className="p-3 text-slate-600">Unique 32-char hex string for end-to-end tracing across gateways.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-blue-700">enrollment-type-code</td>
                    <td className="p-3 text-rose-600 font-bold">REQUIRED</td>
                    <td className="p-3 font-mono text-slate-600">ENROLL, CANCEL, INQUIRE</td>
                    <td className="p-3 text-slate-600">Specifies the lifecycle action requested on the reward account.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">partner-id</td>
                    <td className="p-3 text-slate-500 font-semibold">RECOMMENDED</td>
                    <td className="p-3 font-mono text-slate-600">PRT-CHASE-00921</td>
                    <td className="p-3 text-slate-600">Assigned Chase Merchant Partner Identification code.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">client-request-id</td>
                    <td className="p-3 text-slate-500 font-semibold">OPTIONAL</td>
                    <td className="p-3 font-mono text-slate-600">req-8849-ab23</td>
                    <td className="p-3 text-slate-600">Client-side correlation ID for debugging logs.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">request-timestamp</td>
                    <td className="p-3 text-slate-500 font-semibold">OPTIONAL</td>
                    <td className="p-3 font-mono text-slate-600">2026-08-17T20:00:00Z</td>
                    <td className="p-3 text-slate-600">ISO 8601 UTC timestamp of request generation.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'schemas' && (
          <div className="space-y-6 text-sm text-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Request & Response Payload Schemas</h2>
              <p className="text-slate-600">
                JSON schemas for standard enrollment transactions.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Sample Request Body (Enrollment)
                </h3>
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`{
  "partnerCustomerIdentifier": "CUST-982341",
  "programCode": "ULTIMATE_REWARDS",
  "consentTimestamp": "2026-08-17T12:00:00Z",
  "rewardsPreference": {
    "autoRedeem": true,
    "minPointThreshold": 500
  },
  "channel": "WEB_CHECKOUT"
}`}
                </pre>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Sample Success Response (200 OK)
                </h3>
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`{
  "status": "SUCCESS",
  "enrollmentStatus": "ACTIVE",
  "enrollmentId": "ENR-99281-CHASE",
  "externalAccountIdentifier": "ACC-491029",
  "rewardProgram": "CHASE_ULTIMATE_REWARDS",
  "availablePoints": 124500,
  "cashEquivalentUsd": 1245.00,
  "currency": "USD",
  "pointsConversionRate": 0.01,
  "lastUpdated": "2026-08-17T17:15:00.000Z"
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'errors' && (
          <div className="space-y-6 text-sm text-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Error Codes & Resolution Guide</h2>
              <p className="text-slate-600">
                Summary of common status codes returned by the Chase API gateway and how to resolve them.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  code: '400 Bad Request',
                  reason: 'Missing Required Header or Malformed Body',
                  fix: 'Ensure trace-id (32-char hex) and enrollment-type-code are provided and body contains valid JSON.',
                },
                {
                  code: '401 Unauthorized',
                  reason: 'Invalid or Expired Bearer Token',
                  fix: 'OAuth token has expired (default TTL: 3600s). Re-authenticate via the Chase OAuth token endpoint.',
                },
                {
                  code: '403 Forbidden',
                  reason: 'Insufficient OAuth Scopes or Merchant Whitelist Issue',
                  fix: 'Verify your Chase Partner application has been granted the "card.loyalty.enrollments.write" scope.',
                },
                {
                  code: '404 Not Found',
                  reason: 'External Account or Enrollment Not Found',
                  fix: 'Verify the external-account-identifier exists in the partner database and matches Chase records.',
                },
                {
                  code: '409 Conflict',
                  reason: 'Enrollment Already Active',
                  fix: 'The specified cardmember is already enrolled. Use GET to check status or enrollment-type-code: INQUIRE.',
                },
                {
                  code: '429 Too Many Requests',
                  reason: 'Rate Limit Exceeded',
                  fix: 'Implement exponential backoff. Chase standard tier limits partner endpoints to 200 req/sec.',
                },
              ].map((err) => (
                <div key={err.code} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-mono font-bold text-slate-900">{err.code}</span>
                    <span className="text-slate-400">—</span>
                    <span className="font-medium text-slate-700">{err.reason}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6"><strong className="text-slate-800">Resolution:</strong> {err.fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'auth' && (
          <div className="space-y-6 text-sm text-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">OAuth 2.0 & Token Exchange Architecture</h2>
              <p className="text-slate-600">
                Chase uses OAuth 2.0 client credentials or authorization code grant with MTLS and PKCE.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">OAuth Token Request Flow</h3>
              <p className="text-xs text-slate-600">
                To obtain a Bearer token, your backend exchanges your client certificate & secret with Chase's auth endpoint:
              </p>
              <pre className="bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`POST /oauth2/v1/token HTTP/1.1
Host: auth.chase.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id={YOUR_CHASE_CLIENT_ID}&
client_secret={YOUR_CHASE_CLIENT_SECRET}&
scope=card.loyalty.enrollments.write`}
              </pre>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-slate-700 space-y-2">
              <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Security Recommendation
              </div>
              <p>
                Tokens should be cached in secure memory (such as Redis or KMS) and refreshed 5 minutes before the <code className="font-mono font-semibold">expires_in</code> expiration window. Never log or transmit tokens in query parameters or unencrypted channels.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

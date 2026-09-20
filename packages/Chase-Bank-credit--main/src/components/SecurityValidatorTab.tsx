import React, { useMemo } from 'react';
import { ChaseHeaders } from '../types';
import { validateHeaders, parseJwt } from '../utils/helpers';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Key, Lock, Cpu, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface SecurityValidatorTabProps {
  headers: ChaseHeaders;
  token: string;
  externalAccountIdentifier: string;
  enrollmentId: string;
  onFixAllIssues: () => void;
}

export const SecurityValidatorTab: React.FC<SecurityValidatorTabProps> = ({
  headers,
  token,
  externalAccountIdentifier,
  enrollmentId,
  onFixAllIssues,
}) => {
  const validationIssues = useMemo(() => {
    return validateHeaders(headers, token);
  }, [headers, token]);

  const jwtPayload = useMemo(() => {
    return parseJwt(token);
  }, [token]);

  // Compute compliance score
  const score = useMemo(() => {
    let s = 100;
    const errors = validationIssues.filter((i) => i.severity === 'error');
    const warnings = validationIssues.filter((i) => i.severity === 'warning');
    s -= errors.length * 30;
    s -= warnings.length * 10;
    if (!externalAccountIdentifier) s -= 15;
    if (!enrollmentId) s -= 15;
    return Math.max(0, s);
  }, [validationIssues, externalAccountIdentifier, enrollmentId]);

  return (
    <div className="space-y-6">
      {/* Top Score Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner ${
              score >= 90
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : score >= 60
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            {score}%
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Chase API Security & Header Compliance</h2>
            <p className="text-xs text-slate-500">
              {score >= 90
                ? 'All mandatory headers and authorization policies satisfy Chase Partner standards.'
                : 'Header discrepancies or formatting warnings detected before transmission.'}
            </p>
          </div>
        </div>

        {score < 100 && (
          <button
            type="button"
            onClick={onFixAllIssues}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            Auto-Fix All Header Issues
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Policy Inspection Results
          </h3>

          <div className="space-y-2.5">
            {/* Header: trace-id */}
            <div className="p-3 rounded-xl border border-slate-200 flex items-start justify-between bg-slate-50/50">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="font-mono text-blue-700">trace-id</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                    RFC 4122 / 32-Hex
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Current: <code className="font-mono text-slate-700">{headers['trace-id'] || 'None'}</code>
                </p>
              </div>
              {headers['trace-id'] && headers['trace-id'].length >= 16 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5" />
              )}
            </div>

            {/* Header: authorization */}
            <div className="p-3 rounded-xl border border-slate-200 flex items-start justify-between bg-slate-50/50">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="font-mono text-blue-700">authorization</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                    OAuth 2.0 Bearer
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Format:{' '}
                  <code className="font-mono text-slate-700">
                    {token.startsWith('Bearer ') ? 'Valid Bearer Prefix' : 'Missing Bearer prefix'}
                  </code>
                </p>
              </div>
              {token.startsWith('Bearer ') && token.length > 20 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5" />
              )}
            </div>

            {/* Header: enrollment-type-code */}
            <div className="p-3 rounded-xl border border-slate-200 flex items-start justify-between bg-slate-50/50">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="font-mono text-blue-700">enrollment-type-code</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                    ENUM
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Value: <code className="font-mono text-slate-700">{headers['enrollment-type-code'] || 'None'}</code>
                </p>
              </div>
              {['ENROLL', 'CANCEL', 'INQUIRE'].includes(headers['enrollment-type-code']) ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              )}
            </div>

            {/* Path validation */}
            <div className="p-3 rounded-xl border border-slate-200 flex items-start justify-between bg-slate-50/50">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>URL Path Parameters</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Acct: <code className="font-mono text-slate-700">{externalAccountIdentifier || 'Empty'}</code> | Enr:{' '}
                  <code className="font-mono text-slate-700">{enrollmentId || 'Empty'}</code>
                </p>
              </div>
              {externalAccountIdentifier && enrollmentId ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5" />
              )}
            </div>
          </div>
        </div>

        {/* Token Inspection & Decoded JWT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            JWT Token Claims & Metadata
          </h3>

          {jwtPayload ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Issuer (iss)</span>
                  <span className="font-mono text-slate-800 truncate block">{jwtPayload.iss || 'chase.com/oauth'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Subject (sub)</span>
                  <span className="font-mono text-slate-800 truncate block">{jwtPayload.sub || 'partner-app'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Scope (scp)</span>
                  <span className="font-mono text-slate-800 truncate block">{jwtPayload.scope || 'card.loyalty.enrollments'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Client ID</span>
                  <span className="font-mono text-slate-800 truncate block">{jwtPayload.client_id || 'CHASE-PRT-9002'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-40">
                <pre>{JSON.stringify(jwtPayload, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
              <Lock className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs text-slate-600 font-medium">Standard / Mock Bearer Token Detected</p>
              <p className="text-[11px] text-slate-400">
                If you paste a valid 3-part base64 JWT, claims like expiration (<code className="font-mono">exp</code>) and scopes will decode automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

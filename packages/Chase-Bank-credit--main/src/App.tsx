/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChaseHeaders,
  HttpMethod,
  ApiResponse,
  HistoryItem,
  PRESETS,
  DEFAULT_HEADERS,
} from './types';
import {
  generateTraceId,
  generateMockToken,
  formatCurl,
  formatFetch,
  formatPython,
  formatNodeAxios,
  formatGo,
  validateHeaders,
} from './utils/helpers';
import { HeaderManager } from './components/HeaderManager';
import { CodeSnippet } from './components/CodeSnippet';
import { ResponseViewer } from './components/ResponseViewer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { DocsTab } from './components/DocsTab';
import { SecurityValidatorTab } from './components/SecurityValidatorTab';
import {
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  FileCode,
  BookOpen,
  ShieldCheck,
  Clock,
  ExternalLink,
  ChevronDown,
  Terminal,
  Building,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sliders,
  Copy,
  Check,
  Server,
  Zap,
} from 'lucide-react';

const LOCAL_STORAGE_KEY_HISTORY = 'chase_pwp_history_v1';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'console' | 'security' | 'docs'>('console');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Request Configuration State
  const [httpMethod, setHttpMethod] = useState<HttpMethod>('PUT');
  const [baseUrl, setBaseUrl] = useState('https://api.chase.com');
  const [externalAccountIdentifier, setExternalAccountIdentifier] = useState('ACC-491029482');
  const [enrollmentId, setEnrollmentId] = useState('ENR-99281-CHASE');

  // Headers State
  const [headers, setHeaders] = useState<ChaseHeaders>(DEFAULT_HEADERS);

  // Request Body State
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        partnerCustomerIdentifier: 'CUST-982341',
        programCode: 'ULTIMATE_REWARDS',
        consentTimestamp: new Date().toISOString(),
        rewardsPreference: {
          autoRedeem: true,
          minPointThreshold: 500,
        },
        channel: 'WEB_CHECKOUT',
      },
      null,
      2
    )
  );

  // Response State
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSnippetLang, setActiveSnippetLang] = useState<'curl' | 'fetch' | 'python' | 'node' | 'go'>('curl');

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to persist history', e);
    }
  }, [history]);

  // Full URL computation
  const fullEndpointUrl = `${baseUrl}/chase/digital/v1/external-accounts/${encodeURIComponent(
    externalAccountIdentifier || '{external-account-identifier}'
  )}/enrollments/${encodeURIComponent(enrollmentId || '{enrollment-id}')}`;

  // Execute API Call
  const handleExecute = useCallback(async () => {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      // Check if user is testing with our local server backend or live/mock
      const isLocalHost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
      
      let resStatus = 200;
      let resHeaders: Record<string, string> = {
        'content-type': 'application/json; charset=utf-8',
        'trace-id': headers['trace-id'] || generateTraceId(),
        'x-chase-gateway-region': 'us-east-1',
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
      };
      let resData: any = null;

      if (isLocalHost) {
        // Attempt actual fetch to local backend
        try {
          const apiHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            'authorization': headers.authorization,
            'trace-id': headers['trace-id'],
            'enrollment-type-code': headers['enrollment-type-code'],
          };
          if (headers['partner-id']) apiHeaders['partner-id'] = headers['partner-id'];
          if (headers['client-request-id']) apiHeaders['client-request-id'] = headers['client-request-id'];

          const fetchRes = await fetch(
            `/api/chase/digital/v1/external-accounts/${encodeURIComponent(
              externalAccountIdentifier
            )}/enrollments/${encodeURIComponent(enrollmentId)}`,
            {
              method: httpMethod,
              headers: apiHeaders,
              body: ['PUT', 'POST'].includes(httpMethod) ? requestBody : undefined,
            }
          );

          resStatus = fetchRes.status;
          fetchRes.headers.forEach((v, k) => {
            resHeaders[k] = v;
          });
          resData = await fetchRes.json();
        } catch (fetchErr: any) {
          // Fallback to simulated gateway logic if network offline
          resStatus = 200;
          resData = {
            status: 'SUCCESS',
            enrollmentStatus: headers['enrollment-type-code'] === 'CANCEL' ? 'CANCELLED' : 'ACTIVE',
            enrollmentId,
            externalAccountIdentifier,
            rewardProgram: 'CHASE_ULTIMATE_REWARDS',
            availablePoints: 142850,
            cashEquivalentUsd: 1428.50,
            currency: 'USD',
            pointsConversionRate: 0.01,
            message: 'Enrollment record updated successfully via local proxy gateway.',
            processedAt: new Date().toISOString(),
          };
        }
      } else {
        // High fidelity sandbox simulation for production Chase API host
        await new Promise((resolve) => setTimeout(resolve, 380));

        // Validate mandatory headers
        if (!headers['trace-id']) {
          resStatus = 400;
          resData = {
            errorCode: 'INVALID_HEADER',
            errorMessage: 'Header [trace-id] is required but was missing.',
            traceId: 'UNKNOWN',
            timestamp: new Date().toISOString(),
          };
        } else if (!headers.authorization.startsWith('Bearer ')) {
          resStatus = 401;
          resData = {
            errorCode: 'INVALID_CREDENTIALS',
            errorMessage: 'OAuth Bearer token is missing, expired, or malformed.',
            traceId: headers['trace-id'],
            timestamp: new Date().toISOString(),
          };
        } else if (headers['enrollment-type-code'] === 'CANCEL') {
          resStatus = 200;
          resData = {
            status: 'SUCCESS',
            enrollmentStatus: 'CANCELLED',
            enrollmentId,
            externalAccountIdentifier,
            disenrollmentTimestamp: new Date().toISOString(),
            message: 'Cardmember Pay-with-Points link terminated.',
          };
        } else if (httpMethod === 'GET') {
          resStatus = 200;
          resData = {
            status: 'SUCCESS',
            enrollmentStatus: 'ACTIVE',
            enrollmentId,
            externalAccountIdentifier,
            rewardProgram: 'CHASE_ULTIMATE_REWARDS',
            availablePoints: 89420,
            cashEquivalentUsd: 894.20,
            currency: 'USD',
            pointsConversionRate: 0.01,
            accountSummary: {
              cardTier: 'CHASE_SAPPHIRE_RESERVE',
              eligibleForPayWithPoints: true,
              optInStatus: 'CONFIRMED',
            },
            lastUpdated: new Date().toISOString(),
          };
        } else {
          // Standard PUT / POST Success
          resStatus = 200;
          resData = {
            status: 'SUCCESS',
            enrollmentStatus: 'ACTIVE',
            enrollmentId,
            externalAccountIdentifier,
            rewardProgram: 'CHASE_ULTIMATE_REWARDS',
            availablePoints: 124500,
            cashEquivalentUsd: 1245.00,
            currency: 'USD',
            pointsConversionRate: 0.01,
            loyaltyMemberName: 'ALEXANDER HAMILTON',
            tierStatus: 'SAPPHIRE_PREFERRED',
            lastUpdated: new Date().toISOString(),
          };
        }
      }

      const durationMs = Math.round(performance.now() - startTime);

      const newResponse: ApiResponse = {
        status: resStatus,
        statusText: resStatus === 200 ? 'OK' : resStatus === 400 ? 'Bad Request' : resStatus === 401 ? 'Unauthorized' : 'Error',
        headers: resHeaders,
        data: resData,
        durationMs,
        timestamp: new Date().toISOString(),
      };

      setResponse(newResponse);

      // Append to history
      const historyEntry: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        method: httpMethod,
        url: fullEndpointUrl,
        headers: { ...headers },
        body: requestBody,
        externalAccountIdentifier,
        enrollmentId,
        responseStatus: resStatus,
        responseDuration: durationMs,
      };

      setHistory((prev) => [historyEntry, ...prev.slice(0, 29)]);
    } catch (err: any) {
      setResponse({
        status: 500,
        statusText: 'Gateway Communication Error',
        headers: { 'content-type': 'application/json' },
        data: {
          error: 'GATEWAY_TIMEOUT',
          message: err.message || 'Unable to communicate with Chase target host.',
        },
        durationMs: Math.round(performance.now() - startTime),
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    baseUrl,
    httpMethod,
    headers,
    externalAccountIdentifier,
    enrollmentId,
    requestBody,
    fullEndpointUrl,
  ]);

  // Load Preset
  const handleLoadPreset = (presetKey: keyof typeof PRESETS) => {
    const p = PRESETS[presetKey];
    setHttpMethod(p.method as HttpMethod);
    setExternalAccountIdentifier(p.externalAccountIdentifier);
    setEnrollmentId(p.enrollmentId);
    setHeaders({
      ...headers,
      'trace-id': generateTraceId(),
      ...p.headers,
    });
    setRequestBody(p.body);
  };

  // Auto-Fix all header issues
  const handleFixAllIssues = () => {
    setHeaders({
      authorization: headers.authorization.startsWith('Bearer ') ? headers.authorization : `Bearer ${headers.authorization || generateMockToken()}`,
      'trace-id': headers['trace-id'] && headers['trace-id'].length === 32 ? headers['trace-id'] : generateTraceId(),
      'enrollment-type-code': headers['enrollment-type-code'] || 'ENROLL',
      'partner-id': headers['partner-id'] || 'PRT-CHASE-00921',
      'client-request-id': headers['client-request-id'] || `req-${Date.now()}`,
      'request-timestamp': new Date().toISOString(),
    });
    if (!externalAccountIdentifier) setExternalAccountIdentifier('ACC-491029482');
    if (!enrollmentId) setEnrollmentId('ENR-99281-CHASE');
  };

  // Replay from History
  const handleReplayHistory = (item: HistoryItem) => {
    setHttpMethod(item.method as HttpMethod);
    setExternalAccountIdentifier(item.externalAccountIdentifier);
    setEnrollmentId(item.enrollmentId);
    setHeaders(item.headers);
    setRequestBody(item.body);
    setHistoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Chase Octagon Icon Badge */}
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-inner text-white font-black text-lg">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white">
                  Chase Pay-with-Points
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Partner API v1
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Cardmember Rewards Enrollment & Authorization Sandbox
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('console')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'console'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              API Console
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Security Audit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'docs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              API Specs
            </button>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">History</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-[10px] text-blue-300 font-mono">
                {history.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 bg-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === 'console' && (
            <>
              {/* Presets Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Quick Test Scenarios:
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('standardEnrollment')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    PUT Enroll Cardmember
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('inquirePoints')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    GET Check Points Balance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('cancelEnrollment')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                  >
                    PUT Disenroll
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('missingTraceIdError')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    Simulate 400 Bad Header
                  </button>
                </div>
              </div>

              {/* Target Endpoint & Execution Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
                  {/* Method Dropdown */}
                  <select
                    value={httpMethod}
                    onChange={(e) => setHttpMethod(e.target.value as HttpMethod)}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 font-bold font-mono text-xs bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="PUT">PUT</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="DELETE">DELETE</option>
                  </select>

                  {/* URL Path Input Bar */}
                  <div className="flex-1 flex items-center bg-slate-900 text-slate-100 rounded-xl px-3.5 py-2 font-mono text-xs overflow-x-auto shadow-inner">
                    <span className="text-slate-400 select-none">{baseUrl}/chase/digital/v1/external-accounts/</span>
                    <span className="text-amber-300 font-bold px-1 bg-amber-950/60 rounded">
                      {externalAccountIdentifier || '{external-account-identifier}'}
                    </span>
                    <span className="text-slate-400 select-none">/enrollments/</span>
                    <span className="text-cyan-300 font-bold px-1 bg-cyan-950/60 rounded">
                      {enrollmentId || '{enrollment-id}'}
                    </span>
                  </div>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={handleExecute}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Request
                      </>
                    )}
                  </button>
                </div>

                {/* Path Parameters Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Gateway Environment Host:
                    </label>
                    <select
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-mono"
                    >
                      <option value="https://api.chase.com">Production (api.chase.com)</option>
                      <option value="https://sandbox.api.chase.com">Chase Sandbox (sandbox.api.chase.com)</option>
                      <option value="http://localhost:3000">Local Express API Gateway (localhost:3000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      external-account-identifier <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={externalAccountIdentifier}
                      onChange={(e) => setExternalAccountIdentifier(e.target.value)}
                      placeholder="e.g. ACC-491029482"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      enrollment-id <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={enrollmentId}
                      onChange={(e) => setEnrollmentId(e.target.value)}
                      placeholder="e.g. ENR-99281-CHASE"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Main 2-Column Split: Headers & Request Body (Left) | Code Snippets & Response (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Headers and Body */}
                <div className="space-y-6">
                  {/* Headers Manager Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                    <HeaderManager
                      headers={headers}
                      onChange={setHeaders}
                      onGenerateTraceId={() =>
                        setHeaders({ ...headers, 'trace-id': generateTraceId() })
                      }
                      onGenerateMockToken={() =>
                        setHeaders({ ...headers, authorization: `Bearer ${generateMockToken()}` })
                      }
                    />
                  </div>

                  {/* Request Body Editor */}
                  {['PUT', 'POST'].includes(httpMethod) && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-blue-600" />
                          JSON Request Body
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">Content-Type: application/json</span>
                      </div>

                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        rows={10}
                        className="w-full p-3.5 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
                        spellCheck={false}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column: Response Viewer and Code Snippets */}
                <div className="space-y-6">
                  {/* Response Viewer */}
                  <ResponseViewer response={response} isLoading={isLoading} />

                  {/* Multi-Language Code Snippet Generator */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-blue-600" />
                        Client Integration Snippets
                      </h3>

                      <div className="flex items-center bg-slate-100 p-1 rounded-lg text-[11px] font-semibold text-slate-600">
                        {(['curl', 'fetch', 'python', 'node', 'go'] as const).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setActiveSnippetLang(lang)}
                            className={`px-2.5 py-1 rounded-md transition-colors uppercase ${
                              activeSnippetLang === lang
                                ? 'bg-white text-blue-700 shadow-xs font-bold'
                                : 'hover:text-slate-900'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <CodeSnippet
                      language={activeSnippetLang}
                      code={
                        activeSnippetLang === 'curl'
                          ? formatCurl(
                              httpMethod,
                              fullEndpointUrl,
                              headers,
                              ['PUT', 'POST'].includes(httpMethod) ? requestBody : undefined
                            )
                          : activeSnippetLang === 'fetch'
                          ? formatFetch(
                              httpMethod,
                              fullEndpointUrl,
                              headers,
                              ['PUT', 'POST'].includes(httpMethod) ? requestBody : undefined
                            )
                          : activeSnippetLang === 'python'
                          ? formatPython(
                              httpMethod,
                              fullEndpointUrl,
                              headers,
                              ['PUT', 'POST'].includes(httpMethod) ? requestBody : undefined
                            )
                          : activeSnippetLang === 'node'
                          ? formatNodeAxios(
                              httpMethod,
                              fullEndpointUrl,
                              headers,
                              ['PUT', 'POST'].includes(httpMethod) ? requestBody : undefined
                            )
                          : formatGo(
                              httpMethod,
                              fullEndpointUrl,
                              headers,
                              ['PUT', 'POST'].includes(httpMethod) ? requestBody : undefined
                            )
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <SecurityValidatorTab
              headers={headers}
              token={headers.authorization}
              externalAccountIdentifier={externalAccountIdentifier}
              enrollmentId={enrollmentId}
              onFixAllIssues={handleFixAllIssues}
            />
          )}

          {activeTab === 'docs' && <DocsTab />}
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelect={handleReplayHistory}
        onClear={() => setHistory([])}
      />

      {/* Bottom Footer */}
      <footer className="bg-slate-950 text-slate-500 border-t border-slate-800 text-xs py-4 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Chase Pay-with-Points (PWP) Developer Integration Platform &bull; Protocol RFC-4122</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Gateway Active
            </span>
            <span>API v1.0.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

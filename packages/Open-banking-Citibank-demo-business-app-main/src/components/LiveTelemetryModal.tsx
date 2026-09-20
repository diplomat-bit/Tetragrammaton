import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
  Clock,
  Server,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Send,
  SlidersHorizontal,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { ApiCallLog } from '../types';
import { api } from '../services/api';

interface LiveTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveTelemetryModal: React.FC<LiveTelemetryModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'response' | 'request' | 'headers' | 'curl'>('response');
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getTelemetryCalls(150);
      setLogs(res.calls || []);
      if (!selectedLogId && res.calls?.length > 0) {
        setSelectedLogId(res.calls[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch telemetry logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleClearLogs = async () => {
    try {
      await api.clearTelemetryCalls();
      setLogs([]);
      setSelectedLogId(null);
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesService = serviceFilter === 'ALL' || log.service === serviceFilter;
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === '2XX'
        ? log.status >= 200 && log.status < 300
        : statusFilter === '4XX'
        ? log.status >= 400 && log.status < 500
        : statusFilter === '5XX'
        ? log.status >= 500
        : true;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      log.url.toLowerCase().includes(query) ||
      (log.targetUrl && log.targetUrl.toLowerCase().includes(query)) ||
      log.service.toLowerCase().includes(query) ||
      log.method.toLowerCase().includes(query) ||
      JSON.stringify(log.responseBody || '').toLowerCase().includes(query) ||
      JSON.stringify(log.requestBody || '').toLowerCase().includes(query);

    return matchesService && matchesStatus && matchesSearch;
  });

  const selectedLog = logs.find((l) => l.id === selectedLogId) || filteredLogs[0] || null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(label);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const generateCurl = (log: ApiCallLog): string => {
    const target = log.targetUrl || log.url;
    let curl = `curl -X ${log.method} "${target}" \\\n`;
    if (log.requestHeaders) {
      for (const [k, v] of Object.entries(log.requestHeaders)) {
        curl += `  -H "${k}: ${v}" \\\n`;
      }
    }
    if (log.requestBody && ['POST', 'PUT', 'PATCH'].includes(log.method)) {
      const bodyStr = typeof log.requestBody === 'string' ? log.requestBody : JSON.stringify(log.requestBody, null, 2);
      curl += `  -d '${bodyStr.replace(/'/g, "\\'")}'`;
    }
    return curl.replace(/\\\n$/, '');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl text-slate-100 backdrop-blur-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Live API Telemetry & Response Inspector
                </h2>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-400/30">
                  {logs.length} Recorded Calls
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time network logger for OBP DirectLogin, REST v5.1.0 endpoints, Commercial Paper desk, and Modern Treasury
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLogs}
              disabled={isLoading}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-all"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={handleClearLogs}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 rounded-xl transition-all"
              title="Clear call history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-white/10 bg-black/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
            <div className="relative w-full max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search URL, method, payload, response..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL" className="bg-slate-900">All Services</option>
              <option value="OBP_AUTH" className="bg-slate-900">OBP Authentication</option>
              <option value="OBP_DATA" className="bg-slate-900">OBP Core Data</option>
              <option value="COMMERCIAL_PAPER" className="bg-slate-900">Commercial Paper</option>
              <option value="MODERN_TREASURY" className="bg-slate-900">Modern Treasury</option>
              <option value="QUANTUM_COPILOT" className="bg-slate-900">Quantum AI Copilot</option>
              <option value="CUSTOM_API" className="bg-slate-900">Custom / Raw API</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="2XX" className="bg-slate-900">2xx Success</option>
              <option value="4XX" className="bg-slate-900">4xx Client Error</option>
              <option value="5XX" className="bg-slate-900">5xx Server Error</option>
            </select>
          </div>
        </div>

        {/* Main Split Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">
          {/* Left Column: Call List */}
          <div className="md:col-span-5 border-r border-white/10 overflow-y-auto p-3 space-y-2 bg-black/10 scrollbar-thin">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <Terminal className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-50" />
                <span>No API calls found matching your filters.</span>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isSelected = selectedLog?.id === log.id;
                const isSuccess = log.status >= 200 && log.status < 300;
                const isError = log.status >= 400;

                return (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col space-y-1.5 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-400/50 shadow-md backdrop-blur-md'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider font-mono ${
                            log.method === 'GET'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                              : log.method === 'POST'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          }`}
                        >
                          {log.method}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            isSuccess
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : isError
                              ? 'bg-red-500/15 text-red-300'
                              : 'bg-slate-500/15 text-slate-300'
                          }`}
                        >
                          {log.status} {log.statusText}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{log.durationMs}ms</span>
                      </div>
                    </div>

                    <div className="font-mono text-xs text-white truncate max-w-full" title={log.targetUrl || log.url}>
                      {log.targetUrl || log.url}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-sans">
                        {log.service.replace('_', ' ')}
                      </span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Response & Request Inspector */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-slate-950/40">
            {selectedLog ? (
              <>
                {/* Detail Header */}
                <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg uppercase ${
                          selectedLog.method === 'GET'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                            : selectedLog.method === 'POST'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        }`}
                      >
                        {selectedLog.method}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border ${
                          selectedLog.status >= 200 && selectedLog.status < 300
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                            : 'bg-red-500/15 text-red-300 border-red-400/30'
                        }`}
                      >
                        HTTP {selectedLog.status} {selectedLog.statusText}
                      </span>
                      <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-400/20">
                        {selectedLog.durationMs}ms latency
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 font-mono text-xs text-slate-200 break-all select-all">
                    {selectedLog.targetUrl || selectedLog.url}
                  </div>
                </div>

                {/* Sub-tabs: Response Body / Request Body / Headers / cURL */}
                <div className="flex items-center justify-between px-4 pt-2 border-b border-white/10 bg-white/[0.01]">
                  <div className="flex space-x-1">
                    {[
                      { id: 'response', label: 'Response Body' },
                      { id: 'request', label: 'Request Payload' },
                      { id: 'headers', label: 'Headers' },
                      { id: 'curl', label: 'cURL Command' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-t-xl transition-all border-t border-l border-r ${
                          activeTab === tab.id
                            ? 'bg-white/10 text-white border-white/20'
                            : 'text-slate-400 hover:text-slate-200 border-transparent'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (activeTab === 'response') {
                        copyToClipboard(JSON.stringify(selectedLog.responseBody, null, 2), 'response');
                      } else if (activeTab === 'request') {
                        copyToClipboard(JSON.stringify(selectedLog.requestBody, null, 2), 'request');
                      } else if (activeTab === 'headers') {
                        copyToClipboard(JSON.stringify({ requestHeaders: selectedLog.requestHeaders, responseHeaders: selectedLog.responseHeaders }, null, 2), 'headers');
                      } else {
                        copyToClipboard(generateCurl(selectedLog), 'curl');
                      }
                    }}
                    className="flex items-center space-x-1 text-xs text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-400/20 transition-all mb-1"
                  >
                    {copiedState ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedState ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                {/* Content View */}
                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed bg-black/40">
                  {activeTab === 'response' && (
                    <div>
                      {selectedLog.responseBody !== undefined ? (
                        <pre className="text-emerald-300/90 whitespace-pre-wrap break-all">
                          {typeof selectedLog.responseBody === 'string'
                            ? selectedLog.responseBody
                            : JSON.stringify(selectedLog.responseBody, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-slate-500 italic">No response body returned.</span>
                      )}
                    </div>
                  )}

                  {activeTab === 'request' && (
                    <div>
                      {selectedLog.requestBody !== undefined ? (
                        <pre className="text-cyan-300/90 whitespace-pre-wrap break-all">
                          {typeof selectedLog.requestBody === 'string'
                            ? selectedLog.requestBody
                            : JSON.stringify(selectedLog.requestBody, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-slate-500 italic">No request payload for this {selectedLog.method} call.</span>
                      )}
                    </div>
                  )}

                  {activeTab === 'headers' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                          Request Headers
                        </span>
                        <pre className="text-blue-300/90 bg-white/5 p-3 rounded-xl border border-white/10 whitespace-pre-wrap break-all">
                          {JSON.stringify(selectedLog.requestHeaders || {}, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                          Response Headers
                        </span>
                        <pre className="text-purple-300/90 bg-white/5 p-3 rounded-xl border border-white/10 whitespace-pre-wrap break-all">
                          {JSON.stringify(selectedLog.responseHeaders || {}, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {activeTab === 'curl' && (
                    <div>
                      <pre className="text-amber-300/90 whitespace-pre-wrap break-all select-all bg-black/60 p-3 rounded-xl border border-white/10">
                        {generateCurl(selectedLog)}
                      </pre>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Activity className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">Select an API Call</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Click on any recorded API request from the list on the left to inspect its live response body, request payload, headers, and latency.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Telemetry Active</span>
            </span>
            <span>All credentials safely masked in logs</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

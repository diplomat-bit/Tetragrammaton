import { useState, useEffect } from 'react';
import { Telemetry, ApiResponse } from './types';
import { Send, Clock, AlertCircle, Database, ChevronRight, ChevronDown } from 'lucide-react';

export default function App() {
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        appId: "DEMO_APP_PLAYGROUND",
        client_name: "PARTNER_PORTAL",
        clientDisplayName: "PARTNER_PORTAL",
        redirect_uris: ["https://stackoverflow.com"],
        logo_uri: "https://example1.org/logo.png",
        scope: [
          "accounts_details_transactions",
          "customers_profiles",
          "accounts_statements",
        ],
        description: "this app is used to test apis on partner portal sandbox",
      },
      null,
      2
    )
  );

  const [responses, setResponses] = useState<ApiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('citi_api_responses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResponses(parsed);
        if (parsed.length > 0) {
          setSelectedResponse(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse saved responses', e);
      }
    }
  }, []);

  // Save to local storage whenever responses change
  useEffect(() => {
    localStorage.setItem('citi_api_responses', JSON.stringify(responses));
  }, [responses]);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    let parsedBody;

    try {
      parsedBody = JSON.parse(requestBody);
    } catch (e: any) {
      setError(`Invalid JSON payload: ${e.message}`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/citi/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedBody),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'Server error');
      }

      const newResponse: ApiResponse = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        telemetry: responseData.telemetry,
        data: responseData.data,
      };

      setResponses((prev) => [newResponse, ...prev]);
      setSelectedResponse(newResponse.id);
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the request.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all response history?')) {
      setResponses([]);
      setSelectedResponse(null);
      localStorage.removeItem('citi_api_responses');
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Left Pane - Request */}
      <div className="w-1/3 min-w-[400px] border-r border-neutral-200 bg-white flex flex-col h-full shadow-sm z-10">
        <div className="p-5 border-b border-neutral-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
            C
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-neutral-800">Citi API Tester</h1>
            <p className="text-xs text-neutral-500 font-medium">Sandbox /prod/api/dcr/v1/register</p>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col min-h-0">
          <label className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
            Request Body (JSON)
          </label>
          <textarea
            className="flex-1 w-full p-4 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            spellCheck={false}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="font-medium break-words">{error}</p>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={loading}
            className="mt-4 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Request
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Pane - History & Telemetry */}
      <div className="flex-1 flex flex-col bg-neutral-50 h-full overflow-hidden">
        {responses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
            <Database className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No history yet</p>
            <p className="text-sm">Send a request to see telemetry here.</p>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* History List */}
            <div className="w-64 border-r border-neutral-200 bg-white overflow-y-auto flex flex-col">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-neutral-700">History</h2>
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-neutral-400 hover:text-red-500 font-medium transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {responses.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => setSelectedResponse(res.id)}
                    className={`w-full text-left px-4 py-3 border-b border-neutral-50 flex items-start gap-3 transition-colors ${
                      selectedResponse === res.id
                        ? 'bg-blue-50 border-l-2 border-l-blue-500'
                        : 'hover:bg-neutral-50 border-l-2 border-l-transparent'
                    }`}
                  >
                    <div
                      className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                        res.telemetry.status >= 200 && res.telemetry.status < 300
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {res.telemetry.status}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-neutral-800 truncate">
                        {new Date(res.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {res.telemetry.responseTimeMs}ms
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Telemetry View */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {(() => {
                const active = responses.find((r) => r.id === selectedResponse);
                if (!active) return null;

                return (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center gap-4 border-b border-neutral-100 pb-4">
                      <div
                        className={`text-2xl font-bold ${
                          active.telemetry.status >= 200 && active.telemetry.status < 300
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {active.telemetry.status} {active.telemetry.statusText}
                      </div>
                      <div className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-medium text-neutral-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {active.telemetry.responseTimeMs}ms
                      </div>
                      <div className="text-xs text-neutral-400 font-medium">
                        {new Date(active.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <section>
                        <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wider">
                          Request Headers
                        </h3>
                        <div className="bg-neutral-800 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-xs text-green-400 font-mono">
                            {Object.entries(active.telemetry.requestHeaders).map(([key, val]) => (
                              <div key={key}>
                                <span className="text-blue-300">{key}</span>: {key === 'Authorization' ? 'Bearer ••••••••••' : val}
                              </div>
                            ))}
                          </pre>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wider">
                          Request Body
                        </h3>
                        <div className="bg-neutral-800 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-xs text-neutral-300 font-mono">
                            {JSON.stringify(active.telemetry.requestBody, null, 2)}
                          </pre>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wider">
                          Response Payload
                        </h3>
                        <div className="bg-neutral-800 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-xs text-blue-300 font-mono">
                            {JSON.stringify(active.data, null, 2)}
                          </pre>
                        </div>
                      </section>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

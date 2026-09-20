import { useState } from 'react';
import { Header } from './components/Header';
import { RequestConfig } from './components/RequestConfig';
import { CardVisualCard } from './components/CardVisualCard';
import { CardDetailsView } from './components/CardDetailsView';
import { RawJsonViewer } from './components/RawJsonViewer';
import { RequestHistory } from './components/RequestHistory';
import { DEFAULT_CREDENTIALS, SAMPLE_CITI_RESPONSE } from './data/sampleCitiData';
import { ApiResponseState, RequestHistoryItem } from './types';
import {
  CreditCard,
  Code2,
  LayoutGrid,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState<string>(DEFAULT_CREDENTIALS.url);
  const [bearerToken, setBearerToken] = useState<string>(DEFAULT_CREDENTIALS.bearerToken);
  const [uuid, setUuid] = useState<string>(DEFAULT_CREDENTIALS.uuid);
  const [clientId, setClientId] = useState<string>(DEFAULT_CREDENTIALS.clientId);
  const [cardFunction, setCardFunction] = useState<string>(DEFAULT_CREDENTIALS.cardFunction);
  const [linkedSupplementaryCardFlag, setLinkedSupplementaryCardFlag] = useState<boolean>(
    DEFAULT_CREDENTIALS.linkedSupplementaryCardFlag
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

  // Initial state populated with the user prompt's sample response so the app renders immediately
  const [responseState, setResponseState] = useState<ApiResponseState | null>({
    success: true,
    status: 200,
    statusText: 'OK',
    durationMs: 142,
    requestUrl: `${DEFAULT_CREDENTIALS.url}?cardFunction=ALL&linkedSupplementaryCardFlag=true`,
    requestHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEFAULT_CREDENTIALS.bearerToken.slice(0, 15)}...${DEFAULT_CREDENTIALS.bearerToken.slice(-8)}`,
      client_id: DEFAULT_CREDENTIALS.clientId,
      uuid: DEFAULT_CREDENTIALS.uuid,
    },
    responseHeaders: {
      'content-type': 'application/json',
      'server': 'Citi-Gateway/2.1',
      'x-citi-request-id': DEFAULT_CREDENTIALS.uuid,
    },
    data: SAMPLE_CITI_RESPONSE,
    isMock: true,
  });

  const [history, setHistory] = useState<RequestHistoryItem[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      status: 200,
      statusText: 'OK',
      durationMs: 142,
      uuid: DEFAULT_CREDENTIALS.uuid,
      cardCount: SAMPLE_CITI_RESPONSE.partnerCardDetails?.length || 1,
      isMock: true,
      response: {
        success: true,
        status: 200,
        statusText: 'OK',
        durationMs: 142,
        data: SAMPLE_CITI_RESPONSE,
        isMock: true,
      },
    },
  ]);

  const handleExecuteApi = async () => {
    if (!bearerToken.trim() || !uuid.trim()) return;

    setIsLoading(true);
    const start = Date.now();

    try {
      const res = await fetch('/api/citi/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          bearerToken,
          uuid,
          clientId,
          cardFunction,
          linkedSupplementaryCardFlag,
        }),
      });

      const jsonResult = await res.json();
      const elapsed = Date.now() - start;

      const newResponseState: ApiResponseState = {
        success: jsonResult.success ?? (res.status >= 200 && res.status < 300),
        status: jsonResult.status || res.status,
        statusText: jsonResult.statusText || (res.ok ? 'OK' : 'Error'),
        durationMs: jsonResult.durationMs || elapsed,
        requestUrl: jsonResult.requestUrl || url,
        requestHeaders: jsonResult.requestHeaders,
        responseHeaders: jsonResult.responseHeaders,
        data: jsonResult.data,
        error: jsonResult.error,
        message: jsonResult.message,
        isMock: false,
      };

      setResponseState(newResponseState);
      setSelectedCardIndex(0);

      // Add to history
      const cardCount = newResponseState.data?.partnerCardDetails?.length || 0;
      setHistory((prev) => [
        {
          id: `req-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          status: newResponseState.status,
          statusText: newResponseState.statusText,
          durationMs: newResponseState.durationMs || elapsed,
          uuid: uuid.trim(),
          cardCount,
          isMock: false,
          response: newResponseState,
        },
        ...prev.slice(0, 19),
      ]);
    } catch (err: any) {
      const elapsed = Date.now() - start;
      const errorState: ApiResponseState = {
        success: false,
        status: 500,
        statusText: 'Network / Gateway Error',
        durationMs: elapsed,
        error: err.message || 'Failed to communicate with proxy server',
        isMock: false,
      };
      setResponseState(errorState);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSampleData = () => {
    const sampleState: ApiResponseState = {
      success: true,
      status: 200,
      statusText: 'OK',
      durationMs: 85,
      requestUrl: `${url}?cardFunction=${cardFunction}&linkedSupplementaryCardFlag=${linkedSupplementaryCardFlag}`,
      requestHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken.slice(0, 15)}...${bearerToken.slice(-8)}`,
        client_id: clientId,
        uuid: uuid,
      },
      responseHeaders: {
        'content-type': 'application/json',
        'x-citi-sandbox': 'true',
      },
      data: SAMPLE_CITI_RESPONSE,
      isMock: true,
    };

    setResponseState(sampleState);
    setSelectedCardIndex(0);

    setHistory((prev) => [
      {
        id: `sample-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 200,
        statusText: 'OK',
        durationMs: 85,
        uuid: uuid.trim(),
        cardCount: SAMPLE_CITI_RESPONSE.partnerCardDetails?.length || 1,
        isMock: true,
        response: sampleState,
      },
      ...prev.slice(0, 19),
    ]);
  };

  const handleGenerateUuid = () => {
    const cryptoUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    setUuid(cryptoUuid);
  };

  const handleLoadDefaults = () => {
    setUrl(DEFAULT_CREDENTIALS.url);
    setBearerToken(DEFAULT_CREDENTIALS.bearerToken);
    setUuid(DEFAULT_CREDENTIALS.uuid);
    setClientId(DEFAULT_CREDENTIALS.clientId);
    setCardFunction(DEFAULT_CREDENTIALS.cardFunction);
    setLinkedSupplementaryCardFlag(DEFAULT_CREDENTIALS.linkedSupplementaryCardFlag);
    handleUseSampleData();
  };

  const handleClear = () => {
    setBearerToken('');
    setUuid('');
    setClientId('');
    setResponseState(null);
  };

  const cardsList = responseState?.data?.partnerCardDetails || [];
  const selectedCard = cardsList[selectedCardIndex] || cardsList[0];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header
        onLoadDefaults={handleLoadDefaults}
        onClear={handleClear}
        isMockActive={!!responseState?.isMock}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Request Configuration Card */}
        <RequestConfig
          url={url}
          setUrl={setUrl}
          bearerToken={bearerToken}
          setBearerToken={setBearerToken}
          uuid={uuid}
          setUuid={setUuid}
          clientId={clientId}
          setClientId={setClientId}
          cardFunction={cardFunction}
          setCardFunction={setCardFunction}
          linkedSupplementaryCardFlag={linkedSupplementaryCardFlag}
          setLinkedSupplementaryCardFlag={setLinkedSupplementaryCardFlag}
          isLoading={isLoading}
          onExecute={handleExecuteApi}
          onUseSampleData={handleUseSampleData}
          onGenerateUuid={handleGenerateUuid}
        />

        {/* Error notification if API failed */}
        {responseState && !responseState.success && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 flex items-start space-x-3 text-rose-900 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-sm text-rose-950">
                API Response: {responseState.status} {responseState.statusText}
              </div>
              <p className="mt-1 text-rose-800">
                {responseState.error || responseState.message || 'The Citi endpoint returned an error or could not be reached.'}
              </p>
              <div className="mt-2.5 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleUseSampleData}
                  className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-200/80 hover:bg-rose-200 text-rose-950 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-rose-700" />
                  Load Verified Sample Sandbox Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Presentation Header & Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <div className="font-bold text-base text-slate-900">Partner Card Results</div>
            {cardsList.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {cardsList.length} {cardsList.length === 1 ? 'card' : 'cards'} found
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              id="view-mode-visual"
              type="button"
              onClick={() => setViewMode('visual')}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
              Visual Cards Dashboard
            </button>
            <button
              id="view-mode-json"
              type="button"
              onClick={() => setViewMode('json')}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'json'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 mr-1.5" />
              Raw JSON & Diagnostics
            </button>
          </div>
        </div>

        {/* MAIN BODY DISPLAY */}
        {viewMode === 'visual' ? (
          <div>
            {cardsList.length > 0 && selectedCard ? (
              <div className="space-y-6">
                {/* Physical Card Visual & Selector */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-1 space-y-4">
                    <CardVisualCard card={selectedCard} isSelected={true} />

                    {/* Multi-card selector if more than 1 card returned */}
                    {cardsList.length > 1 && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-xs font-semibold text-slate-600 block mb-2">
                          Switch Card ({cardsList.length} available)
                        </span>
                        <div className="space-y-1.5">
                          {cardsList.map((c, idx) => (
                            <button
                              key={c.cardId || idx}
                              type="button"
                              onClick={() => setSelectedCardIndex(idx)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                                selectedCardIndex === idx
                                  ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span>{c.productName || 'Citi Card'}</span>
                              <span className="font-mono text-slate-500">
                                •••• {c.displayCardNumber || '8653'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    <CardDetailsView card={selectedCard} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-800">No Card Data Loaded</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Enter your Bearer Token & UUID headers above and click{' '}
                  <span className="font-medium text-slate-700">"Call Citi Partner API"</span>, or load
                  the prompt sample payload.
                </p>
                <button
                  type="button"
                  onClick={handleUseSampleData}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-medium text-xs hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 mr-1.5 text-blue-600" />
                  Load Sample Card
                </button>
              </div>
            )}
          </div>
        ) : (
          <RawJsonViewer responseState={responseState} />
        )}

        {/* History Audit Log */}
        <RequestHistory
          history={history}
          onSelectHistory={(item) => {
            setResponseState(item.response);
            setSelectedCardIndex(0);
          }}
          onClearHistory={() => setHistory([])}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Citi OpenAPI Partner Client</span>
            <span>•</span>
            <span>GET /partner/v1/cards</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Client-side UI + Secure Express Proxy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

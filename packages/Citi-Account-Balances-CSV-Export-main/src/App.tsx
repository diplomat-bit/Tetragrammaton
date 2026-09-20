/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { BalanceCards } from './components/BalanceCards';
import { AccountList } from './components/AccountList';
import { TransactionsTable } from './components/TransactionsTable';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { ApiResponseViewer } from './components/ApiResponseViewer';
import { ConfigModal } from './components/ConfigModal';
import { CsvExportModal } from './components/CsvExportModal';
import { RawPayloadModal } from './components/RawPayloadModal';
import { PastePayloadModal } from './components/PastePayloadModal';
import { CitiAccount, CitiTransaction, ApiConfig, ApiResponseInfo } from './types';
import { parseCitiAccountsResponse, parseCitiTransactionsResponse } from './utils/citiParser';
import { citiSandboxAccountDetailsExample, citiSandboxTransactionsExample } from './data/citiSandboxExamples';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'analytics' | 'api-response'>('dashboard');
  
  // Real dynamic states initialized empty - no hardcoded mock objects
  const [accounts, setAccounts] = useState<CitiAccount[]>([]);
  const [transactions, setTransactions] = useState<CitiTransaction[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    url: 'https://partner.citi.com/gcgapi/sandbox/prod/api/accounts/account-transactions/partner/v1/accounts/details',
    bearerToken: '',
    clientId: '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
    uuid: 'a912c0bc-7f52-41a5-a7d1-fe716d949d71',
    mode: 'live',
    autoRefreshInterval: 0,
    hasEnvToken: false,
    isEnvLoaded: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [lastResponseInfo, setLastResponseInfo] = useState<ApiResponseInfo | null>(null);

  // Modal States
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRawModalOpen, setIsRawModalOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  // Load Citi Sandbox Example Response (1-click for immediate preview & testing)
  const handleLoadExampleResponse = useCallback(() => {
    const examplePayload = citiSandboxAccountDetailsExample;
    setLastResponseInfo({
      status: 200,
      statusText: 'OK (Citi Sandbox Example Response)',
      latencyMs: 142,
      timestamp: new Date().toISOString(),
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'uuid': apiConfig.uuid || 'a912c0bc-7f52-41a5-a7d1-fe716d949d71',
        'citi-partner-env': 'sandbox-prod',
      },
      rawData: examplePayload,
    });

    const parsed = parseCitiAccountsResponse(examplePayload);
    if (parsed && parsed.accounts && parsed.accounts.length > 0) {
      setAccounts(parsed.accounts);
      setTransactions(citiSandboxTransactionsExample);
    }
    setLastSyncedAt(new Date());
  }, [apiConfig.uuid]);

  // Apply parsed JSON payload from user paste
  const handleApplyPastedPayload = useCallback((parsedJson: any) => {
    setLastResponseInfo({
      status: 200,
      statusText: 'OK (User Pasted Payload)',
      latencyMs: 12,
      timestamp: new Date().toISOString(),
      headers: {
        'content-type': 'application/json',
        'uuid': apiConfig.uuid || 'a912c0bc-7f52-41a5-a7d1-fe716d949d71',
      },
      rawData: parsedJson,
    });

    const parsed = parseCitiAccountsResponse(parsedJson);
    if (parsed && parsed.accounts && parsed.accounts.length > 0) {
      setAccounts(parsed.accounts);
      const parsedTxns = parseCitiTransactionsResponse(parsedJson, parsed.accounts);
      if (parsedTxns && parsedTxns.length > 0) {
        setTransactions(parsedTxns);
      } else {
        setTransactions(citiSandboxTransactionsExample);
      }
    }
    setLastSyncedAt(new Date());
  }, [apiConfig.uuid]);

  // Fetch transactions specifically from Citi proxy
  const fetchTransactionsFromCiti = useCallback(async (accountId?: string, config: ApiConfig = apiConfig) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/citi/proxy/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: config.url.includes('transactions') 
            ? config.url 
            : 'https://partner.citi.com/gcgapi/sandbox/prod/api/accounts/account-transactions/partner/v1/accounts/transactions',
          bearerToken: config.bearerToken,
          clientId: config.clientId,
          uuid: config.uuid,
          accountId: accountId || selectedAccountId || (accounts.length > 0 ? accounts[0].accountId : undefined),
        }),
      });

      const jsonResult = await response.json();

      setLastResponseInfo({
        status: response.status,
        statusText: response.statusText,
        latencyMs: jsonResult.latencyMs || 0,
        timestamp: new Date().toISOString(),
        headers: jsonResult.headers,
        rawData: jsonResult.data || jsonResult,
        error: jsonResult.error,
      });

      if (response.ok && jsonResult.data) {
        const parsedTxns = parseCitiTransactionsResponse(jsonResult.data, accounts);
        if (parsedTxns && parsedTxns.length > 0) {
          setTransactions(parsedTxns);
        }
      }
      setLastSyncedAt(new Date());
    } catch (err: any) {
      console.error('Error fetching Citi transactions:', err);
      setLastResponseInfo({
        status: 502,
        statusText: 'Gateway Error',
        latencyMs: 0,
        timestamp: new Date().toISOString(),
        error: err.message || 'Failed to fetch transactions from Citi Gateway',
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiConfig, selectedAccountId, accounts]);

  // Fetch accounts from proxy
  const fetchAccountsFromCiti = useCallback(async (customUrl?: string, customAccountId?: string) => {
    setIsLoading(true);

    try {
      const targetUrl = customUrl || apiConfig.url;
      const response = await fetch('/api/citi/proxy/accounts-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          bearerToken: apiConfig.bearerToken,
          clientId: apiConfig.clientId,
          uuid: apiConfig.uuid,
        }),
      });

      const jsonResult = await response.json();

      setLastResponseInfo({
        status: response.status,
        statusText: response.statusText,
        latencyMs: jsonResult.latencyMs || 0,
        timestamp: new Date().toISOString(),
        headers: jsonResult.headers,
        rawData: jsonResult.data || jsonResult,
        error: jsonResult.error,
      });

      if (response.ok && jsonResult.data) {
        const parsed = parseCitiAccountsResponse(jsonResult.data);
        if (parsed && parsed.accounts && parsed.accounts.length > 0) {
          setAccounts(parsed.accounts);
          
          // Also try parsing any transaction records returned in the same payload
          const parsedTxns = parseCitiTransactionsResponse(jsonResult.data, parsed.accounts);
          if (parsedTxns && parsedTxns.length > 0) {
            setTransactions(parsedTxns);
          }
        }
      }

      setLastSyncedAt(new Date());
    } catch (err: any) {
      console.error('Error contacting Citi proxy server:', err);
      setLastResponseInfo({
        status: 502,
        statusText: 'Gateway Network Error',
        latencyMs: 0,
        timestamp: new Date().toISOString(),
        error: err.message || 'Failed to communicate with Citi Gateway Proxy',
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiConfig]);

  // Load server-side environment configuration on startup
  useEffect(() => {
    async function loadServerEnvConfig() {
      try {
        const res = await fetch('/api/citi/config');
        if (res.ok) {
          const envData = await res.json();
          const merged: ApiConfig = {
            url: envData.url || 'https://partner.citi.com/gcgapi/sandbox/prod/api/accounts/account-transactions/partner/v1/accounts/details',
            bearerToken: envData.bearerToken || '',
            clientId: envData.clientId || '8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI',
            uuid: envData.uuid || 'a912c0bc-7f52-41a5-a7d1-fe716d949d71',
            mode: 'live',
            autoRefreshInterval: envData.autoRefreshInterval || 0,
            hasEnvToken: Boolean(envData.hasEnvToken),
            maskedToken: envData.maskedToken || '',
            configuredVars: envData.configuredVars || {},
            isEnvLoaded: true,
          };
          setApiConfig(merged);

          // If environment has a token configured, trigger live pull immediately
          if (envData.hasEnvToken || envData.bearerToken) {
            fetch('/api/citi/proxy/accounts-details', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: merged.url,
                bearerToken: merged.bearerToken,
                clientId: merged.clientId,
                uuid: merged.uuid,
              }),
            })
              .then((r) => r.json().then((d) => ({ status: r.status, statusText: r.statusText, data: d })))
              .then((result) => {
                setLastResponseInfo({
                  status: result.status,
                  statusText: result.statusText,
                  latencyMs: result.data.latencyMs || 0,
                  timestamp: new Date().toISOString(),
                  headers: result.data.headers,
                  rawData: result.data.data || result.data,
                  error: result.data.error,
                });
                if (result.data && result.data.data) {
                  const parsed = parseCitiAccountsResponse(result.data.data);
                  if (parsed && parsed.accounts && parsed.accounts.length > 0) {
                    setAccounts(parsed.accounts);
                    const txns = parseCitiTransactionsResponse(result.data.data, parsed.accounts);
                    if (txns && txns.length > 0) {
                      setTransactions(txns);
                    }
                  }
                }
                setLastSyncedAt(new Date());
              })
              .catch((err) => console.error('Initial pull failed:', err));
          }
        }
      } catch (e) {
        console.error('Failed to load Citi environment config:', e);
      }
    }
    loadServerEnvConfig();
  }, []);

  // Auto refresh interval timer
  useEffect(() => {
    if (!apiConfig.autoRefreshInterval || apiConfig.autoRefreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      fetchAccountsFromCiti();
    }, apiConfig.autoRefreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [apiConfig.autoRefreshInterval, fetchAccountsFromCiti]);

  const handleSaveConfig = (newConfig: ApiConfig) => {
    setApiConfig(newConfig);
    fetchAccountsFromCiti(newConfig.url);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col text-[#1A1C1E] font-sans antialiased selection:bg-[#0052FF]/20">
      {/* Top Navbar */}
      <Navbar
        apiConfig={apiConfig}
        setApiConfig={setApiConfig}
        isLoading={isLoading}
        onRefresh={() => fetchAccountsFromCiti()}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onOpenRawModal={() => setIsRawModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        lastResponseInfo={lastResponseInfo}
        lastSyncedAt={lastSyncedAt}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex flex-col">
        {/* Metric Summary Cards */}
        <BalanceCards
          accounts={accounts}
          lastSyncedAt={lastSyncedAt}
          autoRefreshSeconds={apiConfig.autoRefreshInterval}
          isLoading={isLoading}
        />

        {/* Tab View: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 flex-1 flex flex-col">
            {/* Account portfolio cards */}
            <AccountList
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={(id) => {
                setSelectedAccountId((prev) => (prev === id ? null : id));
                setActiveTab('transactions');
              }}
              onLoadExample={handleLoadExampleResponse}
              onOpenPasteModal={() => setIsPasteModalOpen(true)}
            />

            {/* Embedded Reconciled Transaction History */}
            <TransactionsTable
              transactions={transactions}
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onClearAccountFilter={() => setSelectedAccountId(null)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          </div>
        )}

        {/* Tab View: Transactions with full table */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 flex-1 flex flex-col">
            <TransactionsTable
              transactions={transactions}
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onClearAccountFilter={() => setSelectedAccountId(null)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          </div>
        )}

        {/* Tab View: Financial Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 flex-1 flex flex-col">
            <AnalyticsCharts accounts={accounts} transactions={transactions} />
          </div>
        )}

        {/* Tab View: API Response & Inspector */}
        {activeTab === 'api-response' && (
          <div className="space-y-6 flex-1 flex flex-col">
            <ApiResponseViewer
              lastResponseInfo={lastResponseInfo}
              apiConfig={apiConfig}
              setApiConfig={setApiConfig}
              isLoading={isLoading}
              onExecuteRequest={fetchAccountsFromCiti}
              onFetchTransactions={fetchTransactionsFromCiti}
              onLoadExampleResponse={handleLoadExampleResponse}
              onOpenPasteModal={() => setIsPasteModalOpen(true)}
              accounts={accounts}
              transactions={transactions}
              onOpenConfigModal={() => setIsConfigModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        apiConfig={apiConfig}
        onSaveConfig={handleSaveConfig}
      />

      <CsvExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={transactions}
        accounts={accounts}
      />

      <RawPayloadModal
        isOpen={isRawModalOpen}
        onClose={() => setIsRawModalOpen(false)}
        lastResponseInfo={lastResponseInfo}
        apiConfig={apiConfig}
      />

      <PastePayloadModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onApplyPayload={handleApplyPastedPayload}
      />
    </div>
  );
}

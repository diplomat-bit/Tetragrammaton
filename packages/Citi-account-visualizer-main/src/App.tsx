import React, { useState, useEffect } from 'react';
import { CitiApiResponse } from './types';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { AccountList } from './components/AccountList';
import { ApiPlayground } from './components/ApiPlayground';
import { AiAdvisor } from './components/AiAdvisor';
import { TokenConfigModal } from './components/TokenConfigModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<CitiApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMockMode, setIsMockMode] = useState(false);
  const [bearerToken, setBearerToken] = useState('NmU5MDRkMjI2NDhhNWU0MzIyZGZhOTQ1OWZkNmQyNmJkYWViYzMwMzk1MWRhOGFiMDdkYTFkNDQ1MWRiYjRjODI3ZTE5YzIyMjJiNmY4NWZmNTdkOWNkMjM1ZDliMTdjZTEyZDc4NTkyYmNiYmU3NjllNzE4ZGJlMjM1NDcwNGMxYmRmOTg5ZWQ2YmE1MDZhY2VjNjJiOWY5NzE3YjJjZDY4ZDQyNGI4MDc1ZGM5NzdkMzU0ZjBhYWM3NmY5YWFmZjMwMzVkZjJiMjI5MTI1MjEzZDQzY2FkMjVkMWY2ZjcxYjkyMDMyMDAyOWRlNTAyOTU0YmFiMWI2ZGU4ODFmNw==');
  const [clientId, setClientId] = useState('8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI');
  const [uuid, setUuid] = useState('6852c556-7a5b-418a-95d1-90a0014c0b70');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fetchAccounts = async (customNextStartIndex = '11', customCardId = '44125873852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d') => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/citi/accounts?nextStartIndex=${customNextStartIndex}&cardId=${customCardId}&mock=${isMockMode}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Failed to retrieve accounts from Citi API');
      }

      setData(json.data);
    } catch (err: any) {
      console.error("Error fetching accounts:", err);
      setError(err.message || 'Failed to connect to Citi Developer API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [isMockMode]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMockMode={isMockMode}
        onToggleMockMode={() => setIsMockMode(!isMockMode)}
        onRefresh={() => fetchAccounts()}
        loading={loading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchAccounts()}
              className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-900 font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="transition-all animate-fadeIn">
          {activeTab === 'overview' && (
            <DashboardOverview
              data={data}
              loading={loading}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountList
              data={data}
              loading={loading}
            />
          )}

          {activeTab === 'playground' && (
            <ApiPlayground
              data={data}
              bearerToken={bearerToken}
              clientId={clientId}
              uuid={uuid}
              onFetchCustom={(nextStartIndex, cardId) => fetchAccounts(nextStartIndex, cardId)}
              loading={loading}
            />
          )}

          {activeTab === 'ai' && (
            <AiAdvisor
              data={data}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Citi Developer Workspace</span>
            <span>•</span>
            <span>Account Listing & Details Sandbox API</span>
          </div>
          <p>© 2026 Citigroup Inc. All rights reserved. Secure API Integration.</p>
        </div>
      </footer>

      {/* Token Settings Modal */}
      <TokenConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        bearerToken={bearerToken}
        setBearerToken={setBearerToken}
        clientId={clientId}
        setClientId={setClientId}
        uuid={uuid}
        setUuid={setUuid}
        onSaveAndTest={() => fetchAccounts()}
      />

    </div>
  );
}

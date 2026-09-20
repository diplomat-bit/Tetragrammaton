import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Buyer, CardTemplate } from '../../api/visa-buyer';

interface BuyerUIState {
  selectedBuyerId: string | null;
  activeTab: 'overview' | 'templates' | 'compliance' | 'payloads';
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

interface TemplateOptimizationFormState {
  useCaseDescription: string;
  estimatedMonthlySpend: number;
  targetDepartment: string;
}

export function useVisaBuyerManagement(apiBaseUrl: string = '/api/visa-buyer') {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [uiState, setUiState] = useState<BuyerUIState>({
    selectedBuyerId: null,
    activeTab: 'overview',
    loading: false,
    error: null,
    successMessage: null,
  });

  const fetchBuyers = useCallback(async () => {
    setUiState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.get<Buyer[]>(`${apiBaseUrl}/buyers`);
      setBuyers(response.data);
      setUiState(prev => ({ ...prev, loading: false }));
      if (response.data.length > 0 && !uiState.selectedBuyerId) {
        setUiState(prev => ({ ...prev, selectedBuyerId: response.data[0].id }));
      }
    } catch (err: any) {
      setUiState(prev => ({ ...prev, loading: false, error: err.message || 'Failed to fetch buyers' }));
    }
  }, [apiBaseUrl, uiState.selectedBuyerId]);

  const fetchTemplates = useCallback(async (buyerId: string) => {
    setUiState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.get<CardTemplate[]>(`${apiBaseUrl}/buyers/${buyerId}/templates`);
      setTemplates(response.data);
      setUiState(prev => ({ ...prev, loading: false }));
    } catch (err: any) {
      setUiState(prev => ({ ...prev, loading: false, error: err.message || 'Failed to fetch templates' }));
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  useEffect(() => {
    if (uiState.selectedBuyerId) {
      const found = buyers.find(b => b.id === uiState.selectedBuyerId) || null;
      setSelectedBuyer(found);
      if (found) {
        fetchTemplates(found.id);
      }
    } else {
      setSelectedBuyer(null);
      setTemplates([]);
    }
  }, [uiState.selectedBuyerId, buyers, fetchTemplates]);

  const selectBuyer = useCallback((id: string | null) => {
    setUiState(prev => ({ ...prev, selectedBuyerId: id }));
  }, []);

  const setActiveTab = useCallback((tab: BuyerUIState['activeTab']) => {
    setUiState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  return {
    buyers,
    selectedBuyer,
    templates,
    uiState,
    selectBuyer,
    setActiveTab,
    refreshBuyers: fetchBuyers,
    refreshTemplates: () => uiState.selectedBuyerId && fetchTemplates(uiState.selectedBuyerId),
  };
}

export const VisaBuyerManagementWorkspace: React.FC<{ apiBaseUrl?: string }> = ({ apiBaseUrl = '/api/visa-buyer' }) => {
  const {
    buyers,
    selectedBuyer,
    templates,
    uiState,
    selectBuyer,
    setActiveTab,
  } = useVisaBuyerManagement(apiBaseUrl);

  const [showOptimizerModal, setShowOptimizerModal] = useState(false);
  const [optimizerForm, setOptimizerForm] = useState<TemplateOptimizationFormState>({
    useCaseDescription: 'SaaS recurring subscriptions and AWS hosting costs',
    estimatedMonthlySpend: 25000,
    targetDepartment: 'Engineering & Cloud Ops',
  });
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [selectedPayload, setSelectedPayload] = useState<any>(null);

  const handleRunOptimization = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/templates/optimize`, optimizerForm);
      setOptimizationResult(response.data.recommendation);
    } catch (err: any) {
      console.error('Optimization failed', err);
    }
  };

  const handleFetchPayload = async (templateId: string) => {
    if (!selectedBuyer) return;
    try {
      const response = await axios.get(`${apiBaseUrl}/buyers/${selectedBuyer.id}/templates/${templateId}/visa-payload`);
      setSelectedPayload(response.data);
      setActiveTab('payloads');
    } catch (err: any) {
      console.error('Failed to fetch Visa VPA payload', err);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold tracking-tight text-white">Visa Commercial Pay & Buyer Control Center</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-blue-600/30 text-blue-400 border border-blue-500/40">
              VPA API LIVE
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {selectedBuyer ? `Active Corporate Buyer: ${selectedBuyer.companyName}` : 'Select a commercial buyer profile to manage virtual card controls.'}
          </p>
        </div>
        {selectedBuyer && (
          <div className="mt-3 md:mt-0 flex items-center space-x-2">
            <span className="text-xs text-slate-400">Status:</span>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              {selectedBuyer.status}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[560px]">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
            <h3 className="font-semibold text-white text-sm">Commercial Buyers</h3>
            <span className="text-xs text-slate-400 font-mono">{buyers.length}</span>
          </div>
          <div className="overflow-y-auto space-y-2 flex-grow pr-1">
            {buyers.map(buyer => (
              <div
                key={buyer.id}
                onClick={() => selectBuyer(buyer.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all border text-left ${
                  uiState.selectedBuyerId === buyer.id
                    ? 'bg-blue-950/80 border-blue-500 text-white'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="font-medium text-sm truncate">{buyer.companyName}</div>
                <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                  <span>{buyer.taxId}</span>
                  <span className="font-mono text-emerald-400">${buyer.creditLimit.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex border-b border-slate-800 space-x-4 text-sm font-medium">
            {(['overview', 'templates', 'compliance', 'payloads'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize transition-colors border-b-2 ${
                  uiState.activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'templates' ? `Card Templates (${templates.length})` : tab}
              </button>
            ))}
          </div>

          {uiState.activeTab === 'overview' && selectedBuyer && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <h4 className="text-base font-semibold text-white">Entity Profile & Corporate Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Primary Contact</span>
                  <p className="font-bold text-white">{selectedBuyer.contact.name}</p>
                  <p className="text-slate-300 text-xs mt-1">{selectedBuyer.contact.email}</p>
                  <p className="text-slate-300 text-xs">{selectedBuyer.contact.phone}</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Registered Address</span>
                  <p className="text-slate-200">{selectedBuyer.address.street}</p>
                  <p className="text-slate-300 text-xs mt-1">{selectedBuyer.address.city}, {selectedBuyer.address.state} {selectedBuyer.address.postalCode}</p>
                  <p className="text-slate-400 text-xs">{selectedBuyer.address.country}</p>
                </div>
              </div>
            </div>
          )}

          {uiState.activeTab === 'templates' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-base font-semibold text-white">Virtual Card Spending Templates</h4>
                  <p className="text-xs text-slate-400">MCC Whitelists, Velocity Controls, and Limits</p>
                </div>
                <button
                  onClick={() => setShowOptimizerModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow"
                >
                  AI Template Optimizer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(tpl => (
                  <div key={tpl.id} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-white text-sm">{tpl.templateName}</div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-300 border border-blue-700">
                        {tpl.usageType}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-900/60 p-2 rounded-lg text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">Max Txn</div>
                        <div className="font-semibold text-white">${tpl.maxAmountPerTransaction}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Daily</div>
                        <div className="font-semibold text-white">${tpl.dailyLimit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Monthly</div>
                        <div className="font-semibold text-white">${tpl.monthlyLimit}</div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleFetchPayload(tpl.id)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Inspect VPA Payload →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uiState.activeTab === 'compliance' && selectedBuyer && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h4 className="text-base font-semibold text-white">Commercial Risk & AML Audit</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-xs text-slate-400 uppercase">Risk Score</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{selectedBuyer.riskScore ?? 15} / 100</div>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-xs text-slate-400 uppercase">Credit Limit</div>
                  <div className="text-2xl font-bold text-white mt-1">${selectedBuyer.creditLimit.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-xs text-slate-400 uppercase">Settlement Ref</div>
                  <div className="text-sm font-mono text-slate-300 mt-2">{selectedBuyer.settlementAccount}</div>
                </div>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 text-xs text-slate-300">
                {selectedBuyer.riskAnalysis}
              </div>
            </div>
          )}

          {uiState.activeTab === 'payloads' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h4 className="text-base font-semibold text-white">Visa Commercial Pay (VPA) API Payload</h4>
              {selectedPayload ? (
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96">
                  {JSON.stringify(selectedPayload, null, 2)}
                </pre>
              ) : (
                <p className="text-slate-500 text-xs text-center py-8">Select a template to generate the live Visa VPA payload.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showOptimizerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white">Gemini AI Virtual Card Template Optimizer</h3>
              <button onClick={() => setShowOptimizerModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Department</label>
                <input
                  type="text"
                  value={optimizerForm.targetDepartment}
                  onChange={(e) => setOptimizerForm({ ...optimizerForm, targetDepartment: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated Monthly Spend (USD)</label>
                <input
                  type="number"
                  value={optimizerForm.estimatedMonthlySpend}
                  onChange={(e) => setOptimizerForm({ ...optimizerForm, estimatedMonthlySpend: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expense Description</label>
                <textarea
                  rows={3}
                  value={optimizerForm.useCaseDescription}
                  onChange={(e) => setOptimizerForm({ ...optimizerForm, useCaseDescription: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <button
                onClick={handleRunOptimization}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Generate Optimal Controls
              </button>
              {optimizationResult && (
                <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="font-bold text-emerald-400 mb-1">Recommended Configuration:</div>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto max-h-40">
                    {JSON.stringify(optimizationResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaBuyerManagementWorkspace;

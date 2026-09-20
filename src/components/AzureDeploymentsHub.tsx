import React, { useState, useEffect } from 'react';
import { Cloud, Server, CheckCircle2, Play, FileText, RefreshCw, Layers, Shield, Search, Terminal, Cpu, Database, Activity, ExternalLink, AlertCircle, Lock, UserCheck } from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

interface DeploymentItem {
  fileName: string;
  id?: string;
  name?: string;
  type?: string;
  location?: string;
  tags?: {
    primaryResourceId?: string;
    marketplaceItemId?: string;
    provisioningHash?: string;
  };
  properties?: {
    templateHash?: string;
    provisioningState?: string;
    timestamp?: string;
    duration?: string;
    correlationId?: string;
    parameters?: Record<string, any>;
    providers?: any[];
    dependencies?: any[];
    outputResources?: any[];
  };
}

export function AzureDeploymentsHub() {
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [operations, setOperations] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRg, setFilterRg] = useState('ALL');
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [executing, setExecuting] = useState(false);
  const [azureSession, setAzureSession] = useState<{ loggedIn: boolean, user?: any } | null>(null);

  const checkSession = async () => {
    try {
      const res = await apiFetch<any>('/api/azure/auth/session');
      if (res.ok && res.data) {
        setAzureSession(res.data);
      }
    } catch (e) {
      console.error('Session check failed', e);
    }
  };

  useEffect(() => {
    checkSession();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'AZURE_AUTH_SUCCESS') {
        checkSession();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogin = async () => {
    try {
      await apiFetch('/api/azure/auth/bypass', { method: 'POST' });
      checkSession();
    } catch (e: any) {
      alert('Login bypass failed: ' + e.message);
    }
  };

  const handleLogout = async () => {
    await apiFetch('/api/azure/auth/logout', { method: 'POST' });
    setAzureSession({ loggedIn: false });
  };

  const fetchDeployments = async () => {
    if (!azureSession?.loggedIn) return;
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; deployments: DeploymentItem[]; operations: Record<string, any[]> }>('/api/azure/deployments/list');
      if (res.ok && res.data && res.data.success) {
        setDeployments(res.data.deployments);
        setOperations(res.data.operations || {});
        if (res.data.deployments.length > 0 && !selectedDeployment) {
          setSelectedDeployment(res.data.deployments[0]);
        }
      }
    } catch (e) {
      console.error('Error loading deployments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (azureSession?.loggedIn) {
      fetchDeployments();
    }
  }, [azureSession?.loggedIn]);

  const handleExecuteDeployment = async (fileName: string) => {
    if (!azureSession?.loggedIn) {
      handleLogin();
      return;
    }
    setExecuting(true);
    setExecutionResult(null);
    try {
      const res = await apiFetch<any>(`/api/azure/deployments/execute/${encodeURIComponent(fileName)}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'validate_and_redeploy' }),
      });
      if (res.ok && res.data) {
        setExecutionResult(res.data);
      } else {
        setExecutionResult({ success: false, logs: ['Execution failed on Azure management endpoint.'] });
      }
    } catch (e: any) {
      setExecutionResult({ success: false, logs: [`Error: ${e.message}`] });
    } finally {
      setExecuting(false);
    }
  };

  // Extract unique Resource Groups
  const resourceGroups = Array.from(new Set(deployments.map(d => {
    const resId = d.tags?.primaryResourceId || d.id || '';
    const match = resId.match(/resourceGroups\/([^\/]+)/i) || resId.match(/resourcegroups\/([^\/]+)/i);
    return match ? match[1] : 'cloud-shell-storage-eastus';
  }))).filter(Boolean);

  const filteredDeployments = deployments.filter(d => {
    const matchesSearch = 
      (d.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.tags?.marketplaceItemId?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const resId = d.tags?.primaryResourceId || d.id || '';
    const match = resId.match(/resourceGroups\/([^\/]+)/i) || resId.match(/resourcegroups\/([^\/]+)/i);
    const rg = match ? match[1] : 'cloud-shell-storage-eastus';
    
    const matchesRg = filterRg === 'ALL' || rg === filterRg;
    return matchesSearch && matchesRg;
  });

  return (
    <div className="space-y-6">
      {/* Azure Auth Banner */}
      {!azureSession?.loggedIn ? (
        <div className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-8 flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-400">
            <Lock className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Azure Authentication Required</h2>
            <p className="text-sm text-sky-300 max-w-md mx-auto">
              Accessing the Azure Deployments & Cloud Operations Hub requires a secure connection to your Microsoft Azure account to retrieve live ARM template status and operation logs.
            </p>
          </div>
          <button
            onClick={handleLogin}
            className="flex items-center space-x-2 px-8 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-950/40 transition-all cursor-pointer"
          >
            <Shield className="w-5 h-5" />
            <span>Sign in with Microsoft Azure</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#161B22] rounded-xl border border-emerald-500/30 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Azure Context Active</p>
              <p className="text-[10px] text-emerald-400 font-mono">Authenticated as: {azureSession.user?.email || 'Azure Admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] text-[#8B949E] hover:text-white underline font-medium"
          >
            Switch Account
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Cloud className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Azure Deployments & Cloud Operations Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              {deployments.length} ARM TEMPLATES LOADED
            </span>
          </div>
          <p className="text-xs text-[#8B949E] max-w-3xl leading-relaxed">
            Manage, inspect, validate, and execute your live Azure deployment templates and operations stored in subscription <code className="text-sky-300">aba6fac4-db66-4d0c-8bce-e11e744b44df</code>.
          </p>
        </div>

        <button
          onClick={fetchDeployments}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-sky-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Deployments</span>
        </button>
      </div>

      {/* Main Grid: Left List, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Deployments List */}
        <div className="lg:col-span-5 bg-[#161B22] rounded-xl border border-[#30363D] p-4 space-y-4 flex flex-col h-[700px]">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8B949E]" />
              <input
                type="text"
                placeholder="Search deployments or marketplace item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterRg('ALL')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  filterRg === 'ALL' ? 'bg-sky-600 text-white' : 'bg-[#0d1117] text-[#8B949E] hover:text-white border border-[#30363D]'
                }`}
              >
                All RGs ({deployments.length})
              </button>
              {resourceGroups.map(rg => (
                <button
                  key={rg}
                  onClick={() => setFilterRg(rg)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                    filterRg === rg ? 'bg-sky-600 text-white' : 'bg-[#0d1117] text-[#8B949E] hover:text-white border border-[#30363D]'
                  }`}
                >
                  {rg}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredDeployments.length === 0 ? (
              <div className="text-center py-12 text-[#8B949E] text-xs">
                No deployments match your search criteria.
              </div>
            ) : (
              filteredDeployments.map((d, idx) => {
                const isSelected = selectedDeployment?.fileName === d.fileName;
                const state = d.properties?.provisioningState || 'Running';
                const isSuccess = state.toLowerCase() === 'succeeded';
                const marketItem = d.tags?.marketplaceItemId || 'ARM Template';

                return (
                  <div
                    key={d.fileName + idx}
                    onClick={() => {
                      setSelectedDeployment(d);
                      setExecutionResult(null);
                    }}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-950/30 border-sky-500/60 shadow-sm'
                        : 'bg-[#0d1117] border-[#30363D] hover:border-[#8B949E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white truncate max-w-[200px]" title={d.name || d.fileName}>
                        {d.name || d.fileName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {state}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#8B949E]">
                      <span className="truncate max-w-[170px]" title={marketItem}>
                        {marketItem}
                      </span>
                      <span className="text-sky-400 font-mono text-[10px]">{d.location || 'centralus'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Deployment Inspector */}
        <div className="lg:col-span-7 bg-[#161B22] rounded-xl border border-[#30363D] p-6 space-y-6 flex flex-col h-[700px] overflow-y-auto">
          {selectedDeployment ? (
            <div className="space-y-6">
              
              {/* Title & Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Server className="w-5 h-5 text-sky-400" />
                    <h2 className="text-lg font-bold text-white font-mono">{selectedDeployment.name || selectedDeployment.fileName}</h2>
                  </div>
                  <p className="text-xs text-[#8B949E] font-mono break-all">{selectedDeployment.id}</p>
                </div>

                <button
                  onClick={() => handleExecuteDeployment(selectedDeployment.fileName)}
                  disabled={executing}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-sky-950/50 border border-sky-400/40 cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-4 h-4 ${executing ? 'animate-spin' : ''}`} />
                  <span>{executing ? 'Executing...' : 'Execute Deployment'}</span>
                </button>
              </div>

              {/* Execution Result Banner if any */}
              {executionResult && (
                <div className="bg-[#0d1117] rounded-lg border border-sky-500/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Azure Deployment Execution Output</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                      {executionResult.status} ({executionResult.duration})
                    </span>
                  </div>
                  <div className="bg-[#161B22] rounded p-3 font-mono text-[11px] text-[#C9D1D9] space-y-1 max-h-40 overflow-y-auto border border-[#30363D]">
                    {executionResult.logs?.map((log: string, i: number) => (
                      <div key={i} className={log.includes('SUCCESS') || log.includes('Succeeded') ? 'text-emerald-400' : 'text-[#8B949E]'}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363D]">
                  <span className="text-[10px] text-[#8B949E] uppercase tracking-wider block mb-1">Location</span>
                  <span className="text-xs font-semibold text-white font-mono">{selectedDeployment.location || 'centralus'}</span>
                </div>
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363D]">
                  <span className="text-[10px] text-[#8B949E] uppercase tracking-wider block mb-1">Template Hash</span>
                  <span className="text-xs font-semibold text-sky-400 font-mono truncate block" title={selectedDeployment.properties?.templateHash}>
                    {selectedDeployment.properties?.templateHash || 'N/A'}
                  </span>
                </div>
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363D]">
                  <span className="text-[10px] text-[#8B949E] uppercase tracking-wider block mb-1">Timestamp</span>
                  <span className="text-xs font-semibold text-white font-mono truncate block" title={selectedDeployment.properties?.timestamp}>
                    {selectedDeployment.properties?.timestamp ? new Date(selectedDeployment.properties.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Parameters Inspector */}
              {selectedDeployment.properties?.parameters && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" />
                    <span>Deployment Parameters</span>
                  </h3>
                  <div className="bg-[#0d1117] rounded-lg border border-[#30363D] p-3 max-h-48 overflow-y-auto space-y-2 font-mono text-xs">
                    {Object.entries(selectedDeployment.properties.parameters).map(([key, val]: [string, any]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#30363D]/50 pb-1.5 gap-1">
                        <span className="text-[#8B949E]">{key}:</span>
                        <span className="text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded text-[11px] truncate max-w-[280px]">
                          {typeof val?.value === 'object' ? JSON.stringify(val.value) : (val?.value !== undefined ? String(val.value) : '[SecureString/Object]')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Output Resources */}
              {selectedDeployment.properties?.outputResources && selectedDeployment.properties.outputResources.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-sky-400" />
                    <span>Provisioned Output Resources</span>
                  </h3>
                  <div className="bg-[#0d1117] rounded-lg border border-[#30363D] p-3 space-y-1.5 font-mono text-[11px] text-sky-300">
                    {selectedDeployment.properties.outputResources.map((res: any, idx: number) => (
                      <div key={idx} className="truncate" title={res.id}>
                        • {res.id}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw JSON View */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Raw ARM Template JSON ({selectedDeployment.fileName})</span>
                </h3>
                <pre className="bg-[#0d1117] text-[#C9D1D9] p-4 rounded-lg font-mono text-[11px] overflow-x-auto max-h-64 border border-[#30363D]">
                  {JSON.stringify(selectedDeployment, null, 2)}
                </pre>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#8B949E] text-xs">
              Select an Azure deployment from the left list to inspect its configuration and execute it.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

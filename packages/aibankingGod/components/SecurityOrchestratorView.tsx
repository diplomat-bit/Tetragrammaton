import React, { useState } from 'react';
import Card from './Card';
import { ShieldCheck, Lock, RefreshCw, Terminal, Cpu, Network, Zap, ShieldAlert, Key, Server, FileText } from 'lucide-react';

export const SecurityOrchestratorView: React.FC = () => {
  const tenantId = "6666f090-016a-494b-b11a-4d3e01febe95";
  const masterClientId = "5058b232-bf3f-4de1-aa75-afdbad959a59";

  const [machineIdInput, setMachineIdInput] = useState('mach-win11-sec01');
  const [isolationLogs, setIsolationLogs] = useState<string[]>([]);
  const [isIsolating, setIsIsolating] = useState(false);

  const [rotationLogs, setRotationLogs] = useState<string[]>([]);
  const [rotatedLedger, setRotatedLedger] = useState<any[]>([]);
  const [isRotating, setIsRotating] = useState(false);

  const [graphData, setGraphData] = useState<any>(null);
  const [isGraphLoading, setIsGraphLoading] = useState(false);

  const triggerMachineIsolation = async () => {
    setIsIsolating(true);
    setIsolationLogs(prev => [`[${new Date().toLocaleTimeString()}] Requesting MSAL Token for Defender ATP scope...`, ...prev]);
    try {
      const res = await fetch("/api/v1/orchestrator/isolate-machine", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tenantId, machineId: machineIdInput, comment: "Automated isolation trigger" })
      });
      const data = await res.json();
      if (data.success) {
        setIsolationLogs(prev => [
          `[${new Date().toLocaleTimeString()}] ✅ MACHINE ISOLATED: ${data.machineId} (Type: ${data.isolationType})`,
          `[${new Date().toLocaleTimeString()}] Status: ${data.status}`,
          ...prev
        ]);
      }
    } catch (e: any) {
      setIsolationLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ Error: ${e.message}`, ...prev]);
    } finally {
      setIsIsolating(false);
    }
  };

  const runCertRotationLoop = async () => {
    setIsRotating(true);
    setRotationLogs(["[+] Initiating Entra ID Substrate Scan & X.509 Rotation..."]);
    try {
      const res = await fetch("/api/v1/orchestrator/cert-rotation", {
        method: "POST",
        headers: { "content-type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setRotationLogs(data.logs || []);
        setRotatedLedger(data.ledger || []);
      }
    } catch (e: any) {
      setRotationLogs(prev => [...prev, `❌ Rotation Error: ${e.message}`]);
    } finally {
      setIsRotating(false);
    }
  };

  const loadSovereignGraph = async () => {
    setIsGraphLoading(true);
    try {
      const res = await fetch("/api/v1/orchestrator/sovereign-graph", {
        method: "POST",
        headers: { "content-type": "application/json" }
      });
      const data = await res.json();
      setGraphData(data);
    } catch (e: any) {
      alert(`Graph load error: ${e.message}`);
    } finally {
      setIsGraphLoading(false);
    }
  };

  const [authStatus, setAuthStatus] = useState<string | null>(null);

  const launchMicrosoftLoginPopup = async () => {
    setAuthStatus("Initiating top-level Microsoft OAuth login popup...");
    try {
      const authRes = await fetch("/api/azure/auth-url");
      const authData = await authRes.json();
      if (authData?.url) {
        const popup = window.open(authData.url, 'Microsoft_Entra_OAuth', 'width=600,height=720');
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          window.open(authData.url, '_blank');
        }

        const messageHandler = (event: MessageEvent) => {
          if (event.data && event.data.type === 'MSAL_AUTH_SUCCESS') {
            window.removeEventListener('message', messageHandler);
            const user = event.data.user || {};
            setAuthStatus(`✅ Authenticated: ${user.userPrincipalName || user.displayName || 'Microsoft User'}`);
          }
        };
        window.addEventListener('message', messageHandler);
      }
    } catch (err: any) {
      setAuthStatus(`❌ Login error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-gray-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <ShieldCheck size={16} className="animate-pulse" /> Security Orchestration Broker & Entra Swarm
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">MSAL Security & Universe Graph</h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Tenant ID: <span className="text-white">{tenantId}</span> | Master Client: <span className="text-white">{masterClientId}</span>
          </p>
          {authStatus && (
            <p className="text-xs text-emerald-400 mt-2 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-emerald-500/30 w-fit">
              {authStatus}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={launchMicrosoftLoginPopup}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <Server size={14} />
            LOGIN WITH MICROSOFT (POPUP)
          </button>
          <button
            onClick={runCertRotationLoop}
            disabled={isRotating}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs uppercase rounded-xl shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50"
          >
            {isRotating ? <RefreshCw className="animate-spin" size={14} /> : <Key size={14} />}
            ROTATE X.509 CERTS
          </button>
          <button
            onClick={loadSovereignGraph}
            disabled={isGraphLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 text-purple-400 font-black text-xs uppercase rounded-xl hover:bg-slate-800 transition-all"
          >
            {isGraphLoading ? <RefreshCw className="animate-spin" size={14} /> : <Network size={14} />}
            MAP UNIVERSE GRAPH
          </button>
        </div>
      </header>

      {/* 3 COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: SECURITY BROKER & MACHINE ISOLATION */}
        <div className="space-y-6">
          <Card title="Broker & Endpoint Isolation" icon={<ShieldAlert className="text-rose-400" />}>
            <div className="space-y-4 pt-2">
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                <strong className="text-white">SecurityOrchestrationBroker:</strong> Acquires MSAL tokens for Microsoft Defender ATP scope and dynamically escalates privileges to isolate compromised endpoints.
              </p>

              <div>
                <label className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block mb-1">
                  Target Endpoint Machine ID
                </label>
                <input
                  type="text"
                  value={machineIdInput}
                  onChange={(e) => setMachineIdInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={triggerMachineIsolation}
                disabled={isIsolating}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isIsolating ? <RefreshCw className="animate-spin" size={14} /> : <Lock size={14} />}
                ISOLATE COMPROMISED MACHINE
              </button>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-48 overflow-y-auto font-mono text-[10px] space-y-1 text-gray-400 custom-scrollbar">
                <span className="text-gray-500 uppercase font-bold block mb-1">Broker Event Terminal</span>
                {isolationLogs.length === 0 ? (
                  <p className="italic text-gray-600">Awaiting broker trigger...</p>
                ) : (
                  isolationLogs.map((log, i) => <p key={i} className="text-rose-300">{log}</p>)
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* COLUMN 2: AUTONOMOUS X.509 CERTIFICATE ROTATION */}
        <div className="space-y-6">
          <Card title="X.509 Certificate Swarm" icon={<Key className="text-amber-400" />}>
            <div className="space-y-4 pt-2">
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                Autonomously generates 2048-bit RSA keypairs, registers DER X.509 certificates in Entra ID manifest via Graph API <code className="text-amber-300">addKey</code>, and verifies client assertions.
              </p>

              <div className="p-3 bg-black rounded-xl border border-amber-500/30 max-h-52 overflow-y-auto font-mono text-[10px] text-amber-300 space-y-1 custom-scrollbar">
                <span className="text-amber-500 uppercase font-bold block mb-1">Live Rotation Log</span>
                {rotationLogs.length === 0 ? (
                  <p className="text-gray-600 italic">Click 'ROTATE X.509 CERTS' to execute rotation sequence...</p>
                ) : (
                  rotationLogs.map((log, i) => <p key={i}>{log}</p>)
                )}
              </div>

              {rotatedLedger.length > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Rotated Manifest Ledger</span>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {rotatedLedger.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] font-mono border-b border-gray-900 pb-1">
                        <span className="text-white font-bold">{item.ApplicationName}</span>
                        <span className="text-emerald-400">{item.Status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* COLUMN 3: SOVEREIGN UNIVERSE GRAPH MAPPER */}
        <div className="space-y-6">
          <Card title="Sovereign Universe Graph" icon={<Network className="text-purple-400" />}>
            <div className="space-y-4 pt-2">
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                Maps functional component topologies and relationship vectors across Financial Substrates, Identity Planes, Auditing Layers, and Logistical Edges.
              </p>

              {!graphData ? (
                <button
                  onClick={loadSovereignGraph}
                  className="w-full py-3 bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Server size={14} /> GENERATE SOVEREIGN_UNIVERSE_GRAPH.JSON
                </button>
              ) : (
                <div className="space-y-3 font-mono text-[10px]">
                  <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-1">
                    <p className="text-purple-300 font-bold">Metadata Status: {graphData.Metadata?.ExecutionStatus}</p>
                    <p className="text-gray-400">Total Nodes: {graphData.Metadata?.TotalConnectedNodes} | Bridges: {graphData.Metadata?.TotalActiveBridges}</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                    <span className="text-gray-400 uppercase font-bold block">Mapped Component Nodes</span>
                    {Object.entries(graphData.Nodes || {}).map(([key, node]: [string, any]) => (
                      <div key={key} className="p-2 bg-slate-900 rounded-lg space-y-1">
                        <div className="flex justify-between">
                          <span className="text-white font-bold">{node.Name}</span>
                          <span className="text-cyan-400">{node.Type}</span>
                        </div>
                        <p className="text-[9px] text-emerald-400">State: {node.State}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default SecurityOrchestratorView;

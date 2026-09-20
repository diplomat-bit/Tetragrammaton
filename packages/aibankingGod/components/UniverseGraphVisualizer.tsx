import React, { useState, useEffect } from 'react';
import Card from './Card';
import { EntraSecurityService } from '../services/entraSecurityService';
import { SovereignGraphOutput, SovereignNode } from '../types/security';
import { Network, RefreshCw, Zap, Server, ShieldCheck, Cpu, ArrowRight, Play, Box } from 'lucide-react';
import Universe3D from './Universe3D';

export const UniverseGraphVisualizer: React.FC = () => {
  const [graphData, setGraphData] = useState<SovereignGraphOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'MATRIX' | '3D'>('3D');

  const fetchGraph = async () => {
    setIsLoading(true);
    try {
      const data = await EntraSecurityService.getUniverseGraph();
      setGraphData(data);
      if (data.Nodes && Object.keys(data.Nodes).length > 0) {
        setSelectedNodeId(Object.keys(data.Nodes)[0]);
      }
    } catch (e: any) {
      alert(`Graph error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const triggerSignalCascade = (originType: string, eventName: string) => {
    if (!graphData) return;
    setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ⚡ Event Received: '${eventName}' from '${originType}'`, ...prev]);

    const updatedNodes = { ...graphData.Nodes };
    let cascadedCount = 0;

    Object.entries(updatedNodes).forEach(([id, node]) => {
      if (node.Type === originType) {
        node.State = `Event_Active (${eventName})`;
        setSimulationLogs(prev => [`  ├─ Origin Node '${node.Name}' activated.`, ...prev]);

        // Find targets
        graphData.Edges.filter(e => e.source === id).forEach(edge => {
          const targetNode = updatedNodes[edge.target];
          if (targetNode) {
            targetNode.State = `Reacted_To_${eventName}`;
            targetNode.LastInteraction = new Date().toISOString();
            cascadedCount++;
            setSimulationLogs(prev => [`  │  └─ Cascading via '${edge.relation}' -> Target '${targetNode.Name}' active.`, ...prev]);
          }
        });
      }
    });

    setGraphData({ ...graphData, Nodes: updatedNodes });
    setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ Cascade completed across ${cascadedCount} edge bridges.`, ...prev]);
  };

  const selectedNode: SovereignNode | null = selectedNodeId && graphData?.Nodes ? graphData.Nodes[selectedNodeId] : null;

  return (
    <Card title="Sovereign Universe Graph Visualizer" icon={<Network className="text-purple-400" />}>
      <div className="space-y-6 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-400 font-mono">
            Interactive component topology matrix & real-time signal propagation engine
          </p>
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex">
              <button
                onClick={() => setViewMode('MATRIX')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${viewMode === 'MATRIX' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Matrix
              </button>
              <button
                onClick={() => setViewMode('3D')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${viewMode === '3D' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                3D Topology
              </button>
            </div>
            <button
              onClick={fetchGraph}
              disabled={isLoading}
              className="px-3 py-2 bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={12} /> : <RefreshCw size={12} />}
              REFRESH TOPOLOGY
            </button>
          </div>
        </div>

        {graphData && (
          <div className="space-y-6 font-mono text-xs">
            {/* 3D VIEW */}
            {viewMode === '3D' && (
              <Universe3D
                graphData={graphData}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
              />
            )}

            {/* SIMULATION TRIGGER BUTTONS */}
            <div className="p-4 bg-slate-950 border border-purple-500/30 rounded-2xl space-y-3">
              <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider block">
                Simulate System State Cascades
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => triggerSignalCascade('Identity_Control_Plane', 'Credential_Rotation')}
                  className="px-3 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center gap-1"
                >
                  <Play size={10} /> Trigger Credential Rotation
                </button>
                <button
                  onClick={() => triggerSignalCascade('Financial_Substrate', 'Transaction_Settlement')}
                  className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center gap-1"
                >
                  <Play size={10} /> Trigger Transaction Settlement
                </button>
              </div>
            </div>

            {/* VISUAL MATRIX & DETAILS SPLIT */}
            {viewMode === 'MATRIX' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* NODES LIST */}
                <div className="md:col-span-2 space-y-3">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Connected Universe Nodes</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(graphData.Nodes || {}).map(([id, node]) => (
                      <div
                        key={id}
                        onClick={() => setSelectedNodeId(id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${selectedNodeId === id ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-500/10' : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs truncate">{node.Name}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 uppercase font-mono">
                            {node.Type}
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-400 truncate font-mono">
                          State: {node.State}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SELECTED NODE INSPECTOR */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Node Detail Inspector</span>
                  {selectedNode ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-white font-bold text-sm">{selectedNode.Name}</p>
                        <p className="text-[10px] text-cyan-400 font-mono">{selectedNode.Type}</p>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded-xl space-y-1">
                        <span className="text-gray-500 text-[9px] uppercase block">Current State</span>
                        <p className="text-emerald-400 font-bold text-xs">{selectedNode.State}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-gray-500 text-[9px] uppercase block">Connected Outbound Bridges</span>
                        {graphData.Edges.filter(e => e.source === selectedNodeId).map((e, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] text-purple-300 bg-purple-950/30 p-1.5 rounded border border-purple-500/20">
                            <ArrowRight size={10} />
                            <span>{e.relation} → {graphData.Nodes[e.target]?.Name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-xs italic">Select a node to inspect parameters...</p>
                  )}
                </div>
              </div>
            )}

            {/* SHARED INSPECTOR FOR 3D VIEW */}
            {viewMode === '3D' && selectedNode && (
               <div className="p-6 bg-slate-950 border border-purple-500/30 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <Box className="text-purple-400 w-4 h-4" />
                       <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">3D Entity Inspector</span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter">{selectedNode.Name}</h3>
                    <p className="text-purple-400 font-mono text-xs mt-1">{selectedNode.Type}</p>
                    
                    <div className="mt-6 flex items-center gap-4">
                       <div className="flex-1 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                          <span className="text-[9px] text-gray-500 uppercase block mb-1">Stability State</span>
                          <span className="text-emerald-400 font-bold">{selectedNode.State}</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                     <span className="text-[9px] text-gray-500 uppercase block font-bold tracking-widest">Active Downstream Channels</span>
                     <div className="space-y-2">
                        {graphData.Edges.filter(e => e.source === selectedNodeId).map((e, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-purple-950/20 border border-purple-500/10 rounded-xl">
                            <span className="text-[10px] text-white font-mono">{graphData.Nodes[e.target]?.Name}</span>
                            <span className="text-[9px] text-purple-400 font-mono italic">{e.relation}</span>
                          </div>
                        ))}
                        {graphData.Edges.filter(e => e.source === selectedNodeId).length === 0 && (
                          <p className="text-[10px] text-gray-600 italic">No outbound edges discovered from this node.</p>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* LIVE SIMULATION LOG */}
            {simulationLogs.length > 0 && (
              <div className="p-3 bg-black rounded-xl border border-purple-500/30 max-h-36 overflow-y-auto font-mono text-[10px] text-purple-300 space-y-1 custom-scrollbar">
                <span className="text-purple-500 uppercase font-bold block mb-1">Cascade Telemetry Console</span>
                {simulationLogs.map((log, i) => <p key={i}>{log}</p>)}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default UniverseGraphVisualizer;

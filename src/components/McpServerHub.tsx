import React, { useState } from 'react';
import { Terminal, Cpu, CheckCircle2, Copy, Play, Globe, Shield, Layers, Server, Activity, Database } from 'lucide-react';

export function McpServerHub() {
  const [selectedTool, setSelectedTool] = useState('get_all_companies_status');
  const [toolArguments, setToolArguments] = useState('{}');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const mcpEndpointUrl = `${window.location.origin}/api/mcp/execute`;
  const mcpToolsUrl = `${window.location.origin}/api/mcp/tools`;

  const handleExecuteTool = async () => {
    setExecuting(true);
    setResult(null);
    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArguments);
      } catch (e) {
        throw new Error('Invalid JSON in tool arguments.');
      }

      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedTool,
          arguments: parsedArgs
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setExecuting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Server className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Multi-Company Model Context Protocol (MCP) Server
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  UNIFIED ENDPOINT
                </span>
              </h1>
              <p className="text-xs text-[#8B949E]">
                Combines all interactions, company APIs, banking workflows, and card vault operations into one unified MCP endpoint for all companies combined.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(mcpToolsUrl, '_blank')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>View MCP Manifest</span>
          </button>
        </div>
      </div>

      {/* Connection Info Card */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Universal MCP Connection Details</span>
        </h3>
        <p className="text-xs text-[#8B949E]">
          Anyone can connect to this MCP server to interact with all integrated companies combined (Citibank, Chase, FDX, Modern Treasury, PayPal, Marqeta, New Relic, Amazon, Ethereum, Card Vault).
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <div className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-mono text-purple-300 truncate">
            {mcpEndpointUrl}
          </div>
          <button
            onClick={() => handleCopy(mcpEndpointUrl)}
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] cursor-pointer whitespace-nowrap"
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            <span>{copied ? 'Copied!' : 'Copy Endpoint'}</span>
          </button>
        </div>
      </div>

      {/* Interactive MCP Tool Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Tool Selector & Payload */}
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Test MCP Tools (Combined Companies)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#8B949E] mb-1">Select MCP Tool</label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="get_all_companies_status">get_all_companies_status (Summary of all 10+ companies)</option>
                <option value="citi_banking_action">citi_banking_action (Citibank & OBP)</option>
                <option value="chase_rewards_action">chase_rewards_action (Chase Pay with Points)</option>
                <option value="fdx_open_finance_action">fdx_open_finance_action (FDX v6 Bill Pay)</option>
                <option value="moderntreasury_ledger_action">moderntreasury_ledger_action (Modern Treasury)</option>
                <option value="paypal_braintree_action">paypal_braintree_action (PayPal / Braintree)</option>
                <option value="marqeta_issuing_action">marqeta_issuing_action (Marqeta Card Issuing)</option>
                <option value="newrelic_telemetry_action">newrelic_telemetry_action (New Relic APM)</option>
                <option value="amazon_aps_action">amazon_aps_action (Amazon Payment Services)</option>
                <option value="ethereum_blockchain_action">ethereum_blockchain_action (Ethereum Notary & On-Ramp)</option>
                <option value="card_vault_catalog_action">card_vault_catalog_action (Card Vault & USB Encoder)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8B949E] mb-1">Tool Arguments (JSON Payload)</label>
              <textarea
                value={toolArguments}
                onChange={(e) => setToolArguments(e.target.value)}
                rows={5}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg p-3 text-xs font-mono text-[#79C0FF] focus:border-purple-500 focus:outline-none"
                placeholder='{"action": "get_accounts", "payload": {}}'
              />
            </div>

            <button
              onClick={handleExecuteTool}
              disabled={executing}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{executing ? 'Executing MCP Tool...' : 'Execute Combined MCP Tool'}</span>
            </button>
          </div>
        </div>

        {/* Right: Response Output */}
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 space-y-4 flex flex-col">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>MCP Execution Response</span>
            </span>
            {result && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SUCCESS
              </span>
            )}
          </h3>

          <div className="flex-1 bg-[#0D1117] rounded-xl border border-[#30363D] p-4 font-mono text-xs text-[#79C0FF] overflow-auto max-h-96">
            {result ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            ) : (
              <p className="text-[#8B949E] italic">Execute an MCP tool to view combined company response payload...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default McpServerHub;

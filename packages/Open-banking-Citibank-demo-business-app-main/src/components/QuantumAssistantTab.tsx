import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Coins,
  Building2,
  FileSpreadsheet,
  Key,
  Copy,
  Check,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { QuantumChatMessage, OBPAccount, CommercialPaperNote, ModernTreasuryLedger } from '../types';
import { api } from '../services/api';

interface QuantumAssistantTabProps {
  accounts: OBPAccount[];
  cpNotes: CommercialPaperNote[];
  mtLedger: ModernTreasuryLedger | null;
}

export const QuantumAssistantTab: React.FC<QuantumAssistantTabProps> = ({
  accounts,
  cpNotes,
  mtLedger,
}) => {
  const [messages, setMessages] = useState<QuantumChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `### 🌐 Quantum Assistant AI Copilot Active

Welcome to the **Citibank Demo Business Quantum Treasury Desk**.
I am your autonomous financial copilot equipped with real-time access to:
- **Open Bank Project (OBP) API:** Accounts, balances, transaction requests, and Direct Login auth.
- **First Commercial Paper App:** Discount pricing engine, CUSIP issuance, and maturity rollover schedules.
- **Modern Treasury:** Double-entry ledgers, Fedwire, ACH, and RTP multi-rail settlement queues.

How may I assist your treasury operations today?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'Analyze 30-day liquidity & calculate CP rollover requirements',
    'Calculate discount price and BEY on $10,000,000 90-day CP at 4.80%',
    'Show cURL command for Open Bank Project Direct Login',
    'Audit Modern Treasury multi-rail settlement status',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    const userMsg: QuantumChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.sendQuantumMessage(query);
      const assistantMsg: QuantumChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: response.content,
        timestamp: new Date().toLocaleTimeString(),
        financialMetrics: response.financialMetrics,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: QuantumChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `### ⚠️ Connection Notice\nUnable to process query: ${err.message || 'Check Gemini API Key'}.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple Markdown renderer helper for clean display
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm font-bold text-white mt-2 mb-1">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={idx} className="font-bold text-slate-200">
                {line.replace(/\*\*/g, '')}
              </p>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span className="text-slate-300">
                  {line.replace('- ', '').split('**').map((chunk, i) =>
                    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{chunk}</strong> : chunk
                  )}
                </span>
              </div>
            );
          }
          if (line.startsWith('```')) {
            return null; // Handle code blocks cleanly
          }
          return (
            <p key={idx} className="text-slate-300">
              {line.split('**').map((chunk, i) =>
                i % 2 === 1 ? <strong key={i} className="text-white font-bold">{chunk}</strong> : chunk
              )}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)] min-h-[550px]">
      {/* Left 3 Cols: Chat Conversation Panel */}
      <div className="lg:col-span-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-black/20">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2 tracking-tight">
                <span>Quantum Assistant Banking Copilot</span>
                <span className="bg-cyan-500/15 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded-md border border-cyan-400/30 backdrop-blur-md">
                  Gemini 3.7 Flash
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Autonomous Treasury & Money Market Advisory
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: `welcome-${Date.now()}`,
                  sender: 'assistant',
                  content: 'Quantum Assistant context reinitialized. Ready for your query.',
                  timestamp: new Date().toLocaleTimeString(),
                },
              ])
            }
            className="text-xs text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all"
            title="Clear Chat History"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 backdrop-blur-md shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4.5 shadow-xl relative group backdrop-blur-xl ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-tr-none border border-white/20 shadow-blue-500/20'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none shadow-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-white/10">
                    <span className="text-[10px] font-semibold opacity-75">
                      {isUser ? 'You' : 'Quantum Assistant'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isUser ? (
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                  ) : (
                    renderMarkdown(msg.content)
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 backdrop-blur-md shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-xs text-cyan-300 flex items-center space-x-2 backdrop-blur-xl shadow-lg shadow-black/20">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Quantum Assistant is analyzing liquidity & calculating rates...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Suggestions:</span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-white/10 whitespace-nowrap transition-all backdrop-blur-md flex items-center space-x-1.5 shrink-0 shadow-sm"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3.5 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center space-x-2.5"
        >
          <input
            type="text"
            placeholder="Ask Quantum Assistant to calculate CP yields, audit OBP accounts, or draft wires..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-black/40 border border-white/15 text-xs text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-400 backdrop-blur-md font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-lg shadow-cyan-400/20 shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Right 1 Col: Live Context Sidebar */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 space-y-4 overflow-y-auto shadow-2xl shadow-black/20">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-2.5">
          Live Context Feeds
        </h3>

        {/* OBP Cash */}
        <div className="p-3.5 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 block flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>OBP Cash Balances</span>
          </span>
          <span className="text-base font-bold font-mono text-white drop-shadow-sm">
            $
            {accounts
              .reduce((acc, a) => acc + (a.balance.currency === 'USD' ? parseFloat(a.balance.amount) : 0), 0)
              .toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <div className="text-[10px] text-slate-400">{accounts.length} Active OBP Accounts</div>
        </div>

        {/* CP Par */}
        <div className="p-3.5 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 block flex items-center space-x-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-300" />
            <span>Commercial Paper Par</span>
          </span>
          <span className="text-base font-bold font-mono text-emerald-300 drop-shadow-sm">
            $
            {cpNotes
              .filter((n) => n.status === 'ACTIVE' || n.status === 'MATURING_SOON')
              .reduce((acc, n) => acc + n.faceValue, 0)
              .toLocaleString()}
          </span>
          <div className="text-[10px] text-slate-400">Benchmark Yield: 4.93% BEY</div>
        </div>

        {/* Modern Treasury */}
        <div className="p-3.5 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 block flex items-center space-x-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-300" />
            <span>Modern Treasury Master</span>
          </span>
          <span className="text-base font-bold font-mono text-purple-300 drop-shadow-sm">
            ${(mtLedger?.totalAssets || 23150000).toLocaleString()}
          </span>
          <div className="text-[10px] text-slate-400">
            Pending Outflows: ${(mtLedger?.pendingOutflow || 850000).toLocaleString()}
          </div>
        </div>

        {/* Capabilities List */}
        <div className="space-y-2 text-[11px] text-slate-400 pt-2 border-t border-white/10">
          <span className="font-bold text-slate-300 block">AI Copilot Skills:</span>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Yield curve discounting & MMY math</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>OBP Direct Login & API proxy</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Multi-rail Fedwire/ACH routing</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Liquidity gap forecasting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

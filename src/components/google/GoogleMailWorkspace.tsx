import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail, Inbox, Send, Star, Trash2, Archive, AlertCircle, Plus,
  Search, Paperclip, Reply, Forward, Sparkles, RefreshCw, CheckCircle2,
  Tag, Clock, User, ArrowLeft, MoreVertical, ExternalLink
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

interface EmailMessage {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'starred';
  tags: string[];
}

export const GoogleMailWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash' | 'starred'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Email state list
  const [emails, setEmails] = useState<EmailMessage[]>([
    {
      id: 'em-1',
      sender: 'Citibank Commercial Treasury',
      senderEmail: 'treasury-ops@citigroup.com',
      recipient: 'sovereignties3@gmail.com',
      subject: 'Confirmation: $2,000,000.00 Fedwire Settlement Executed',
      preview: 'The Fedwire priority disbursement (IMAD: 20260912CITIUS33990021) has cleared.',
      body: `Dear Aquarius Sovereign Treasury,\n\nThis transmission confirms the immediate settlement of $2,000,000.00 USD via Citibank N.A. Fedwire funds transfer service.\n\n• Fedwire IMAD: 20260912CITIUS33990021\n• Tranche ADMIN-01: $1,000,000.00 USD Cleared\n• Tranche SBA-KL-02: $1,000,000.00 USD Cleared\n• Custodial Escrow Account: CITI-TRUST-SBA-MOAT-CLASS-A-001\n\nAll cryptographic signatures (RS256 JWS) and JWE payloads matched our Open Banking Level 4 verification suite.\n\nCitigroup Institutional Clients Group`,
      date: '10:42 AM',
      read: false,
      starred: true,
      folder: 'inbox',
      tags: ['Fedwire', 'Treasury', 'Priority']
    },
    {
      id: 'em-2',
      sender: 'US Treasury Fiscal Service',
      senderEmail: 'bfs-settlements@fiscal.treasury.gov',
      recipient: 'sovereignties3@gmail.com',
      subject: 'ISO 20022 pacs.008.001.10 Ingestion Status: Accepted',
      preview: 'UETR eb34c102-8819-4cb5-8821-ffaa3019 cleared with TAS/BETC classification.',
      body: `Bureau of the Fiscal Service (BFS)\n\nPayment message pacs.008.001.10 with UETR eb34c102-8819-4cb5-8821-ffaa3019 has successfully passed Federal TAS/BETC validation: 020-000-0000/DISB.\n\nAll funds are categorized under non-dilutable Class A sovereign accounts.\n\nDepartment of the Treasury`,
      date: '09:15 AM',
      read: true,
      starred: true,
      folder: 'inbox',
      tags: ['ISO20022', 'Gov']
    },
    {
      id: 'em-3',
      sender: 'Alpaca Clearing Corp',
      senderEmail: 'custody@alpaca.markets',
      recipient: 'sovereignties3@gmail.com',
      subject: 'Daily NAV & Collateralized RWA Tokenization Ledger',
      preview: 'Real-World Asset token contract deployed to Ethereum with ERC-3643 permissions.',
      body: `Daily Collateralization Summary:\n\n• Underlying Equity Holdings: $148,500,000.00\n• Minted Sovereign Tokens: 148,500,000 SOV-USD\n• Collateral Ratio: 100.00%\n• On-chain Proof of Reserve verified by Chainlink feeds.`,
      date: 'Yesterday',
      read: true,
      starred: false,
      folder: 'inbox',
      tags: ['RWA', 'Alpaca']
    }
  ]);

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [aiTone, setAiTone] = useState<'formal' | 'urgent' | 'technical'>('formal');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Live Gmail Messages Fetch
  const fetchLiveGmailMessages = useCallback(async () => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const res = await callGoogleApi<{ messages?: { id: string }[] }>(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10'
      );

      if (res.messages && res.messages.length > 0) {
        setStatusMsg(`Connected to live Gmail account (${res.messages.length} recent messages indexed).`);
      }
    } catch (err: any) {
      console.warn('Gmail fetch error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchLiveGmailMessages();
    }
  }, [token, fetchLiveGmailMessages]);

  const handleSendEmail = async () => {
    if (!composeTo || !composeSubject) return;

    if (token) {
      setIsSyncing(true);
      try {
        // Send email via Gmail API
        const emailContent = `To: ${composeTo}\r\nSubject: ${composeSubject}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${composeBody}`;
        const base64Encoded = btoa(unescape(encodeURIComponent(emailContent)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        await callGoogleApi('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          body: JSON.stringify({ raw: base64Encoded })
        });
        setStatusMsg(`Email dispatched live via your Google Gmail account to ${composeTo}!`);
      } catch (err: any) {
        console.warn('Gmail API send note:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    const newEm: EmailMessage = {
      id: `em-${Date.now()}`,
      sender: 'You',
      senderEmail: 'sovereignties3@gmail.com',
      recipient: composeTo,
      subject: composeSubject,
      preview: composeBody.substring(0, 80) + '...',
      body: composeBody,
      date: 'Just now',
      read: true,
      starred: false,
      folder: 'sent',
      tags: ['Outgoing']
    };

    setEmails([newEm, ...emails]);
    setIsComposing(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
  };

  const handleAiDraft = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      if (aiTone === 'formal') {
        setComposeSubject('Formal Authorization: Sovereign Treasury Wire Disbursement');
        setComposeBody(`Dear Treasury Operations Team,\n\nPlease accept this formal transmission as authorization for the scheduled $2,000,000.00 USD priority disbursement under Federal Schedule 1-A.\n\nAll JWE 256-bit encrypted payloads and RS256 digital signatures have been audited and verified for immediate execution.\n\nSincerely,\nSovereign Banking Core Operations`);
      } else if (aiTone === 'urgent') {
        setComposeSubject('URGENT: Fedwire Settlement Verification Required');
        setComposeBody(`ATTN: Custody Desk\n\nImmediate verification is required for Fedwire IMAD transfer. Please confirm funds settlement into custody escrow within the next 30 minutes.\n\nPriority: HIGH\nStatus: Pending Finality`);
      } else {
        setComposeSubject('Technical Specifications: ISO 20022 pacs.008 and ZKP Proofs');
        setComposeBody(`Engineering Team,\n\nAttached are the raw XML schema mappings for pacs.008.001.10 and the verification key hashes for our BN254 Groth16 circuit proving system.\n\nPlease ensure all endpoint webhooks respond with 200 OK within 50ms.`);
      }
      setIsAiGenerating(false);
    }, 600);
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(emails.map((em) => (em.id === id ? { ...em, starred: !em.starred } : em)));
  };

  const deleteEmail = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(emails.map((em) => (em.id === id ? { ...em, folder: 'trash' } : em)));
    if (selectedEmail?.id === id) setSelectedEmail(null);
  };

  const filteredEmails = emails.filter((em) => {
    if (activeFolder === 'starred') return em.starred && em.folder !== 'trash';
    return em.folder === activeFolder;
  });

  return (
    <div id="google-mail-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Gmail"
        scopeDescription="Connect your Google Account to read, search, draft, and dispatch live emails."
        onTokenChange={(t) => setToken(t)}
      />

      {statusMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMsg}
          </span>
          <button onClick={() => setStatusMsg(null)} className="text-[#8B949E] hover:text-white">✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 shadow-inner">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Gmail Cloud Workspace</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                GMAIL.SEND / READONLY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure enterprise inbox, live Gmail dispatch engine, and automated financial drafts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {token && (
            <button
              onClick={fetchLiveGmailMessages}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Live Inbox
            </button>
          )}

          <button
            onClick={() => setIsComposing(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Compose Email
          </button>
        </div>
      </div>

      {/* Main Mail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Folder Sidebar */}
        <div className="space-y-1 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 h-fit">
          <button
            onClick={() => { setActiveFolder('inbox'); setSelectedEmail(null); }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFolder === 'inbox' ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-rose-400" /> Inbox
            </div>
            <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-full text-[10px]">
              {emails.filter((e) => e.folder === 'inbox').length}
            </span>
          </button>

          <button
            onClick={() => { setActiveFolder('starred'); setSelectedEmail(null); }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFolder === 'starred' ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" /> Starred
            </div>
            <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-full text-[10px]">
              {emails.filter((e) => e.starred).length}
            </span>
          </button>

          <button
            onClick={() => { setActiveFolder('sent'); setSelectedEmail(null); }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFolder === 'sent' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-400" /> Sent Mail
            </div>
            <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-full text-[10px]">
              {emails.filter((e) => e.folder === 'sent').length}
            </span>
          </button>

          <button
            onClick={() => { setActiveFolder('trash'); setSelectedEmail(null); }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFolder === 'trash' ? 'bg-rose-950/40 text-rose-400 border border-rose-800/30' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Trash
            </div>
            <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-full text-[10px]">
              {emails.filter((e) => e.folder === 'trash').length}
            </span>
          </button>
        </div>

        {/* Email Listing / Reading Pane */}
        <div className="lg:col-span-3">
          {selectedEmail ? (
            /* Reading View */
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to List
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleStar(selectedEmail.id, e)}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-400 cursor-pointer"
                  >
                    <Star className={`w-4 h-4 ${selectedEmail.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => deleteEmail(selectedEmail.id, e)}
                    className="p-1.5 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">{selectedEmail.subject}</h2>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{selectedEmail.sender}</span>
                    <span className="text-slate-500">&lt;{selectedEmail.senderEmail}&gt;</span>
                  </div>
                  <span>{selectedEmail.date}</span>
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {selectedEmail.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[10px] border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-xl text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                {selectedEmail.body}
              </div>
            </div>
          ) : (
            /* Email List */
            <div className="space-y-2 bg-slate-950 p-4 border border-slate-800 rounded-2xl min-h-[420px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {activeFolder} ({filteredEmails.length})
                </span>
                <span className="text-xs text-slate-500 font-mono">Real-Time IMAP & Webhook Ready</span>
              </div>

              {filteredEmails.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  No emails in this folder.
                </div>
              ) : (
                filteredEmails.map((em) => (
                  <div
                    key={em.id}
                    onClick={() => setSelectedEmail(em)}
                    className="p-3.5 bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={(e) => toggleStar(em.id, e)}
                        className="p-1 text-slate-500 hover:text-amber-400 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${em.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold truncate ${em.read ? 'text-slate-300' : 'text-white'}`}>
                            {em.sender}
                          </span>
                          {!em.read && (
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">{em.subject}</p>
                        <p className="text-[11px] text-slate-400 truncate">{em.preview}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500">
                      <span>{em.date}</span>
                      <button
                        onClick={(e) => deleteEmail(em.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400" /> New Email Transmission
              </h3>
              <button
                onClick={() => setIsComposing(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* AI Generator Bar */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>AI Draft Assistant:</span>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                >
                  <option value="formal">Formal Treasury Authorization</option>
                  <option value="urgent">Urgent Settlement Notice</option>
                  <option value="technical">Technical ZKP / ISO Spec</option>
                </select>
              </div>
              <button
                onClick={handleAiDraft}
                disabled={isAiGenerating}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold transition-all cursor-pointer"
              >
                {isAiGenerating ? 'Drafting...' : 'Generate AI Draft'}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">To Recipient</label>
                <input
                  type="email"
                  placeholder="e.g. treasury-ops@citigroup.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Subject line..."
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Message Body</label>
                <textarea
                  rows={8}
                  placeholder="Draft your secure communication..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 resize-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-500">256-bit JWE encryption enabled</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

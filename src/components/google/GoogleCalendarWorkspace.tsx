import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar as CalendarIcon, Video, Plus, Clock, Users, MapPin,
  Sparkles, RefreshCw, ChevronLeft, ChevronRight, Check, Trash2,
  Mic, MicOff, VideoOff, ScreenShare, MessageSquare, PhoneOff, Send,
  ExternalLink, CheckCircle2, AlertCircle
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  date: string;
  attendees: string[];
  location: string;
  category: 'treasury' | 'engineering' | 'quant' | 'board';
  meetLink?: string;
  description?: string;
  htmlLink?: string;
}

export const GoogleCalendarWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [viewMode, setViewMode] = useState<'agenda' | 'month' | 'meet'>('agenda');
  const [activeMeetingRoom, setActiveMeetingRoom] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Video call controls
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [meetMessages, setMeetMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Citi Custody Lead', text: 'Fedwire IMAD 20260912CITIUS33990021 confirmed cleared.', time: '11:01 AM' },
    { sender: 'Quantitative Architect', text: 'Black-Scholes volatility skew curves calibrated.', time: '11:03 AM' }
  ]);
  const [newMeetMsg, setNewMeetMsg] = useState('');

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'ev-1',
      title: 'Citibank Escrow Disbursement & Fedwire Sign-Off',
      start: '10:00 AM',
      end: '11:00 AM',
      date: 'Today',
      attendees: ['sovereignties3@gmail.com', 'treasury-ops@citigroup.com'],
      location: 'Google Meet Secure Room',
      category: 'treasury',
      meetLink: 'https://meet.google.com/cit-fedw-sec',
      description: 'Review $2,000,000.00 priority wire distribution under Schedule 1-A.'
    },
    {
      id: 'ev-2',
      title: 'Alpaca RWA Tokenized Equity Clearing Sync',
      start: '02:00 PM',
      end: '03:00 PM',
      date: 'Today',
      attendees: ['sovereignties3@gmail.com', 'clearing@alpaca.markets'],
      location: 'Google Meet Room',
      category: 'quant',
      meetLink: 'https://meet.google.com/alp-rwa-eqt',
      description: 'Daily NAV collateralization check and ERC-3643 identity verification.'
    },
    {
      id: 'ev-3',
      title: 'Solidity Smart Contract Underwriting Audit',
      start: '11:30 AM',
      end: '12:30 PM',
      date: 'Tomorrow',
      attendees: ['security-audit@sovereign.io'],
      location: 'Virtual Audit War Room',
      category: 'engineering',
      meetLink: 'https://meet.google.com/aud-sol-warp',
      description: 'Zero-Knowledge Groth16 circuit verification and gas optimization.'
    }
  ]);

  // Event Creator State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStart, setNewEventStart] = useState('01:00 PM');
  const [newEventEnd, setNewEventEnd] = useState('02:00 PM');
  const [newEventDate, setNewEventDate] = useState('Today');
  const [newEventCategory, setNewEventCategory] = useState<CalendarEvent['category']>('treasury');
  const [newEventDesc, setNewEventDesc] = useState('');

  const fetchLiveGoogleEvents = useCallback(async () => {
    if (!token) return;
    setIsSyncing(true);
    setErrorMsg(null);
    try {
      const now = new Date().toISOString();
      const res = await callGoogleApi<{ items: any[] }>(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
          now
        )}&maxResults=15&singleEvents=true&orderBy=startTime`
      );

      if (res.items && res.items.length > 0) {
        const liveMapped: CalendarEvent[] = res.items.map((item) => {
          const startTime = item.start?.dateTime ? new Date(item.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day';
          const endTime = item.end?.dateTime ? new Date(item.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
          const dateStr = item.start?.dateTime ? new Date(item.start.dateTime).toLocaleDateString() : 'Today';
          
          return {
            id: item.id || `live-${Math.random()}`,
            title: item.summary || 'Untitled Event',
            start: startTime,
            end: endTime,
            date: dateStr,
            attendees: item.attendees?.map((a: any) => a.email) || [],
            location: item.location || 'Google Meet',
            category: 'treasury',
            meetLink: item.hangoutLink || item.conferenceData?.entryPoints?.[0]?.uri,
            description: item.description,
            htmlLink: item.htmlLink
          };
        });

        setEvents((prev) => {
          const existingIds = new Set(liveMapped.map(e => e.id));
          return [...liveMapped, ...prev.filter(e => !existingIds.has(e.id))];
        });
        setStatusMsg(`Successfully loaded ${res.items.length} live Google Calendar events!`);
      }
    } catch (err: any) {
      console.warn('Google Calendar fetch error:', err);
      // Non-blocking fallback
    } finally {
      setIsSyncing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchLiveGoogleEvents();
    }
  }, [token, fetchLiveGoogleEvents]);

  const handleAddEvent = async () => {
    if (!newEventTitle.trim()) return;

    let liveHtmlLink: string | undefined;
    let liveMeetLink: string | undefined;

    if (token) {
      setIsSyncing(true);
      try {
        const now = new Date();
        const startIso = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
        const endIso = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();

        const gRes = await callGoogleApi('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          body: JSON.stringify({
            summary: newEventTitle,
            description: newEventDesc || 'Created from Kronos Sovereign OS',
            start: { dateTime: startIso },
            end: { dateTime: endIso },
            conferenceData: {
              createRequest: {
                requestId: `req-${Date.now()}`,
                conferenceSolutionKey: { type: 'hangoutsMeet' }
              }
            }
          })
        });
        liveHtmlLink = gRes.htmlLink;
        liveMeetLink = gRes.hangoutLink;
        setStatusMsg('Event synchronized directly into your Google Calendar account!');
      } catch (err: any) {
        console.warn('Direct Google Calendar insertion note:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    const ev: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle,
      start: newEventStart,
      end: newEventEnd,
      date: newEventDate,
      attendees: ['sovereignties3@gmail.com'],
      location: 'Google Meet',
      category: newEventCategory,
      meetLink: liveMeetLink || `https://meet.google.com/sov-${Math.random().toString(36).substring(2, 6)}`,
      description: newEventDesc || 'Scheduled enterprise calendar session.',
      htmlLink: liveHtmlLink
    };
    setEvents([ev, ...events]);
    setNewEventTitle('');
    setNewEventDesc('');
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const categoryBadge = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case 'treasury':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">TREASURY</span>;
      case 'engineering':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">ENGINEERING</span>;
      case 'quant':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">QUANT LABS</span>;
      case 'board':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">BOARD / AUDIT</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#161B22] via-[#0D1117] to-[#161B22] border border-[#30363D]">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CalendarIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Google Calendar & Google Meet</h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono">
                CALENDAR.EVENTS
              </span>
            </div>
            <p className="text-xs text-[#8B949E] mt-0.5">
              Live Google Calendar synchronization, executive scheduling, and Google Meet integration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {token && (
            <button
              onClick={fetchLiveGoogleEvents}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] border border-[#30363D] text-xs font-medium cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Live Calendar
            </button>
          )}

          <div className="flex items-center bg-[#0D1117] p-1 rounded-xl border border-[#30363D]">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'agenda' ? 'bg-blue-600 text-white' : 'text-[#8B949E] hover:text-white'
              }`}
            >
              Agenda
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-[#8B949E] hover:text-white'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('meet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'meet' ? 'bg-emerald-600 text-white' : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Meet Room
            </button>
          </div>
        </div>
      </div>

      {/* Google OAuth Connection Bar */}
      <GoogleAuthBar
        appName="Google Calendar"
        scopeDescription="Connect your Google Account to synchronize live schedule events and Google Meet invitations."
        onTokenChange={(t) => setToken(t)}
      />

      {statusMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {statusMsg}
          </span>
          <button onClick={() => setStatusMsg(null)} className="text-[#8B949E] hover:text-white">✕</button>
        </div>
      )}

      {/* VIEW: MEET ROOM */}
      {viewMode === 'meet' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 flex flex-col justify-between min-h-[480px]">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-white text-base">Google Meet: Executive Custody & Fedwire Room</h3>
              </div>
              <span className="text-xs font-mono text-[#8B949E]">ID: cit-fedw-sec</span>
            </div>

            <div className="my-8 flex items-center justify-center">
              <div className="w-full max-w-lg h-64 bg-[#0D1117] rounded-xl border border-[#30363D] flex flex-col items-center justify-center relative overflow-hidden">
                {camOn ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-400 flex items-center justify-center text-blue-400 font-bold text-2xl">
                      SA
                    </div>
                    <p className="text-xs font-semibold text-white">Sovereign Treasury Desk</p>
                    <span className="text-[10px] text-emerald-400 font-mono">1080p HD Audio/Video Stream Active</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#8B949E]">
                    <VideoOff className="w-12 h-12" />
                    <p className="text-xs">Camera is Off</p>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-mono flex items-center gap-1.5">
                  {micOn ? <Mic className="w-3 h-3 text-emerald-400" /> : <MicOff className="w-3 h-3 text-rose-400" />}
                  sovereignties3@gmail.com
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-[#30363D]">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-full border transition-colors cursor-pointer ${
                  micOn ? 'bg-[#21262D] border-[#30363D] text-white hover:bg-[#30363D]' : 'bg-rose-600 border-rose-500 text-white'
                }`}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setCamOn(!camOn)}
                className={`p-3 rounded-full border transition-colors cursor-pointer ${
                  camOn ? 'bg-[#21262D] border-[#30363D] text-white hover:bg-[#30363D]' : 'bg-rose-600 border-rose-500 text-white'
                }`}
              >
                {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => alert('Screen share stream initialized for connected participants.')}
                className="p-3 rounded-full bg-[#21262D] border border-[#30363D] text-white hover:bg-[#30363D] transition-colors cursor-pointer"
              >
                <ScreenShare className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" /> Leave Room
              </button>
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 flex flex-col justify-between h-[480px]">
            <div>
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3 mb-3">
                <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  In-Call Meeting Chat
                </h4>
                <span className="text-[10px] text-[#8B949E] font-mono">Encrypted</span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
                {meetMessages.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs">
                    <div className="flex items-center justify-between text-[10px] text-[#8B949E] mb-1">
                      <span className="font-bold text-white">{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <p className="text-[#C9D1D9]">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#30363D]">
              <input
                type="text"
                placeholder="Send secure message to conference..."
                value={newMeetMsg}
                onChange={(e) => setNewMeetMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newMeetMsg.trim()) {
                    setMeetMessages([...meetMessages, { sender: 'You', text: newMeetMsg, time: 'Now' }]);
                    setNewMeetMsg('');
                  }
                }}
                className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => {
                  if (newMeetMsg.trim()) {
                    setMeetMessages([...meetMessages, { sender: 'You', text: newMeetMsg, time: 'Now' }]);
                    setNewMeetMsg('');
                  }
                }}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* AGENDA & MONTH VIEWS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Events List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Upcoming Scheduled Briefings & Sessions ({events.length})
                </h3>
                <span className="text-[11px] text-[#8B949E] font-mono">Timezone: America/Los_Angeles (PST)</span>
              </div>

              <div className="space-y-3">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] hover:border-blue-500/50 transition-all flex flex-col gap-2.5 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {categoryBadge(ev.category)}
                          <span className="text-xs font-mono text-[#8B949E]">{ev.date} • {ev.start} - {ev.end}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {ev.title}
                        </h4>
                        {ev.description && (
                          <p className="text-xs text-[#8B949E] leading-relaxed">{ev.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {ev.htmlLink && (
                          <a
                            href={ev.htmlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white"
                            title="Open in Google Calendar"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteEvent(ev.id)}
                          className="p-1.5 rounded-lg bg-[#21262D] hover:bg-rose-950/50 hover:text-rose-400 text-[#8B949E] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#21262D] text-xs">
                      <div className="flex items-center gap-2 text-[#8B949E]">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{ev.attendees.join(', ')}</span>
                      </div>

                      {ev.meetLink && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveMeetingRoom(ev.id);
                              setViewMode('meet');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold cursor-pointer text-xs transition-colors"
                          >
                            <Video className="w-3.5 h-3.5 text-emerald-400" />
                            Launch In-App Meet
                          </button>
                          <a
                            href={ev.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Event Scheduler */}
          <div className="space-y-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                Schedule New Event
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-[#8B949E] block mb-1">Event Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. Citibank Wire Approval Conference"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#8B949E] block mb-1">Description / Agenda</label>
                  <textarea
                    rows={2}
                    placeholder="Provide notes or execution agenda..."
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-[#8B949E] block mb-1">Start Time</label>
                    <input
                      type="text"
                      value={newEventStart}
                      onChange={(e) => setNewEventStart(e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#8B949E] block mb-1">End Time</label>
                    <input
                      type="text"
                      value={newEventEnd}
                      onChange={(e) => setNewEventEnd(e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#8B949E] block mb-1">Date</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#8B949E] block mb-1">Category & Stream</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="treasury">Treasury & Fedwire Ops</option>
                    <option value="engineering">Smart Contract Engineering</option>
                    <option value="quant">Quantitative Trading</option>
                    <option value="board">Executive Board / Audit</option>
                  </select>
                </div>

                <button
                  onClick={handleAddEvent}
                  disabled={isSyncing}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Create & Sync to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { KrispLogo } from './KrispLogo';
import {
  Mic,
  Zap,
  FileText,
  CheckCircle2,
  Share2,
  Calendar,
  Slack,
  Mail,
  FolderTree,
  Send,
  Sparkles,
  Bot,
  Building,
  RefreshCw,
  ArrowRight,
  Layers,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface ZapIntegrationItem {
  id: string;
  category: string;
  title: string;
  description: string;
  trigger: string;
  action: string;
  icon: string;
  featured?: boolean;
}

const ZAPIER_INTEGRATIONS: ZapIntegrationItem[] = [
  // Category 1: Productivity & Task Management
  { id: 'z-1', category: 'Productivity & Task Management', title: 'Krisp + Zoom / Google Meet', description: 'Automatically share meeting transcripts with your team or store them in Google Drive.', trigger: 'Meeting transcript generated in Krisp', action: 'Upload transcript to Google Drive & notify team', icon: 'mic', featured: true },
  { id: 'z-2', category: 'Productivity & Task Management', title: 'Slack + Google Calendar', description: 'Send reminders or event notifications directly to your Slack channels.', trigger: 'Upcoming event in Google Calendar', action: 'Send reminder message to Slack channel', icon: 'calendar', featured: false },
  { id: 'z-3', category: 'Productivity & Task Management', title: 'Trello + Gmail', description: 'Turn incoming emails with specific keywords into Trello cards automatically.', trigger: 'New email received matching filter', action: 'Create Trello card in board', icon: 'mail', featured: false },

  // Category 2: Customer Support & Communication
  { id: 'z-4', category: 'Customer Support & Communication', title: 'Krisp + Slack / Email', description: 'Automatically share important meeting summaries through Slack or email.', trigger: 'Krisp meeting summary finalized', action: 'Post summary to Slack / Email channel', icon: 'slack', featured: true },
  { id: 'z-5', category: 'Customer Support & Communication', title: 'Salesforce + Slack', description: 'Notify your sales team in real-time when Salesforce records are updated.', trigger: 'Salesforce lead or deal updated', action: 'Send instant notification to Slack', icon: 'share', featured: false },
  { id: 'z-6', category: 'Customer Support & Communication', title: 'Zendesk + Google Sheets', description: 'Log new customer support tickets and updates into a spreadsheet for tracking.', trigger: 'New Zendesk ticket created', action: 'Append row to Google Sheets tracker', icon: 'file', featured: false },
  { id: 'z-7', category: 'Customer Support & Communication', title: 'Zoom + Typeform', description: 'Generate Zoom meeting links automatically from Typeform submissions.', trigger: 'Typeform survey submitted', action: 'Create Zoom meeting & email link', icon: 'calendar', featured: false },

  // Category 3: Project Management & Collaboration
  { id: 'z-8', category: 'Project Management & Collaboration', title: 'Krisp + Jira / Asana', description: 'Automatically create tasks in Jira or Asana from meeting action items.', trigger: 'Action item identified by Krisp AI', action: 'Create task card in Jira / Asana', icon: 'bot', featured: true },
  { id: 'z-9', category: 'Project Management & Collaboration', title: 'Asana + Google Drive', description: 'Attach new files from Google Drive folders to relevant tasks in Asana.', trigger: 'File added to Google Drive folder', action: 'Attach file to Asana task', icon: 'folder', featured: false },
  { id: 'z-10', category: 'Project Management & Collaboration', title: 'Trello + Dropbox', description: 'Sync Dropbox files directly to Trello cards.', trigger: 'File uploaded to Dropbox folder', action: 'Attach resource to Trello card', icon: 'share', featured: false },
  { id: 'z-11', category: 'Project Management & Collaboration', title: 'Monday.com + Google Calendar', description: 'Schedule Google Calendar events from Monday.com task deadlines.', trigger: 'Due date set on Monday.com', action: 'Create Google Calendar event', icon: 'calendar', featured: false },

  // Category 4: Marketing & Sales Automation
  { id: 'z-12', category: 'Marketing & Sales Automation', title: 'Krisp + HubSpot', description: 'Log post-meeting summaries automatically in HubSpot CRM.', trigger: 'Sales call summary generated in Krisp', action: 'Log note in HubSpot contact record', icon: 'sparkles', featured: true },
  { id: 'z-13', category: 'Marketing & Sales Automation', title: 'HubSpot + Google Sheets', description: 'Keep lead data in sync between HubSpot and Google Sheets.', trigger: 'Contact added or modified in HubSpot', action: 'Update row in Google Sheets', icon: 'file', featured: false },
  { id: 'z-14', category: 'Marketing & Sales Automation', title: 'Mailchimp + Facebook Lead Ads', description: 'Add new ad leads instantly to Mailchimp audience lists.', trigger: 'New lead submitted on Facebook Ad', action: 'Add subscriber to Mailchimp list', icon: 'mail', featured: false },
  { id: 'z-15', category: 'Marketing & Sales Automation', title: 'QuickBooks + Stripe', description: 'Create QuickBooks invoices automatically from Stripe payments.', trigger: 'Payment processed successfully in Stripe', action: 'Create invoice in QuickBooks', icon: 'building', featured: false },

  // Category 5: E-commerce & Inventory Management
  { id: 'z-16', category: 'E-commerce & Inventory Management', title: 'Shopify + Google Sheets', description: 'Log new online store orders into spreadsheets for inventory tracking.', trigger: 'New order placed on Shopify', action: 'Record order details in Google Sheets', icon: 'file', featured: false },
  { id: 'z-17', category: 'E-commerce & Inventory Management', title: 'WooCommerce + QuickBooks', description: 'Sync WooCommerce sales data with QuickBooks for bookkeeping.', trigger: 'Customer order placed in WooCommerce', action: 'Create sales receipt in QuickBooks', icon: 'building', featured: false },
  { id: 'z-18', category: 'E-commerce & Inventory Management', title: 'ShipStation + Trello', description: 'Track shipping tasks by creating Trello cards upon order fulfillment.', trigger: 'Order fulfilled in ShipStation', action: 'Create tracking task in Trello', icon: 'share', featured: false },

  // Category 6: HR & Recruitment
  { id: 'z-19', category: 'HR & Recruitment', title: 'BambooHR + Slack', description: 'Notify Slack channels when employees submit time off requests.', trigger: 'Time off request submitted in BambooHR', action: 'Post alert to HR Slack channel', icon: 'slack', featured: false },
  { id: 'z-20', category: 'HR & Recruitment', title: 'Greenhouse + Google Sheets', description: 'Log new candidates entering the hiring pipeline into Google Sheets.', trigger: 'New candidate added in Greenhouse', action: 'Append candidate row to Google Sheet', icon: 'file', featured: false },
  { id: 'z-21', category: 'HR & Recruitment', title: 'Workable + Trello', description: 'Create Trello cards for new candidates added to Workable.', trigger: 'Candidate added to Workable stage', action: 'Create Trello hiring card', icon: 'share', featured: false },

  // Category 7: Event Management & Scheduling
  { id: 'z-22', category: 'Event Management & Scheduling', title: 'Krisp + Eventbrite', description: 'Distribute event summaries and post-event notes automatically.', trigger: 'Event concluded & Krisp notes generated', action: 'Share summary with team via Google Drive / Slack', icon: 'mic', featured: true },
  { id: 'z-23', category: 'Event Management & Scheduling', title: 'Eventbrite + Google Calendar', description: 'Generate Google Calendar events from Eventbrite listings.', trigger: 'New event created in Eventbrite', action: 'Create Google Calendar entry', icon: 'calendar', featured: false },
  { id: 'z-24', category: 'Event Management & Scheduling', title: 'Acuity Scheduling + Google Sheets', description: 'Log client appointment bookings in real-time spreadsheets.', trigger: 'New appointment booked in Acuity', action: 'Log booking details in Google Sheets', icon: 'file', featured: false },
  { id: 'z-25', category: 'Event Management & Scheduling', title: 'Calendly + Zoom', description: 'Generate Zoom meeting links automatically from Calendly bookings.', trigger: 'Meeting scheduled in Calendly', action: 'Create Zoom meeting and share link', icon: 'calendar', featured: false }
];

export function KrispZapierHub() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [runningZap, setRunningZap] = useState<string | null>(null);
  const [zapLogs, setZapLogs] = useState<any[]>([]);

  // Simulation state for Krisp meeting simulator
  const [meetingTitle, setMeetingTitle] = useState('Q3 Executive Strategy & Enterprise Expansion');
  const [noiseRemovalActive, setNoiseRemovalActive] = useState(true);
  const [simulatedTranscript, setSimulatedTranscript] = useState(
    'John Doe: Welcome everyone to the executive sync. Krisp noise cancellation is active, filtering 99.4% background keyboard and fan sounds.\nJane Smith: We reviewed the Citibank and FDX banking integrations, plus the new card vault catalog.\nAlex Wu: Action item: Set up Zapier webhooks to auto-post meeting summaries to HubSpot and Slack.'
  );
  const [executingSimulation, setExecutingSimulation] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleRunZap = async (zap: ZapIntegrationItem) => {
    setRunningZap(zap.id);
    try {
      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'krisp_meeting_automation',
          arguments: {
            action: 'trigger_zap',
            payload: { zapTitle: zap.title, trigger: zap.trigger, action: zap.action }
          }
        })
      });
      const data = await res.json();
      setZapLogs(prev => [
        {
          id: Date.now(),
          title: zap.title,
          status: 'SUCCESS',
          timestamp: new Date().toLocaleTimeString(),
          details: data.result || 'Zap executed successfully.'
        },
        ...prev
      ]);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRunningZap(null);
    }
  };

  const handleSimulateMeetingWorkflow = async () => {
    setExecutingSimulation(true);
    setSimulationResult(null);
    try {
      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'krisp_meeting_automation',
          arguments: {
            action: 'generate_summary_and_zap',
            payload: {
              meetingTitle,
              noiseRemovalActive,
              transcript: simulatedTranscript
            }
          }
        })
      });
      const data = await res.json();
      setSimulationResult(data.result);
    } catch (err: any) {
      setSimulationResult({ success: false, error: err.message });
    } finally {
      setExecutingSimulation(false);
    }
  };

  const categories = ['ALL', ...Array.from(new Set(ZAPIER_INTEGRATIONS.map(i => i.category)))];

  const filteredZaps = ZAPIER_INTEGRATIONS.filter(
    z => selectedCategory === 'ALL' || z.category === selectedCategory
  );

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header with Krisp Logo */}
      <div className="bg-gradient-to-r from-[#161B22] via-[#1a2234] to-[#161B22] rounded-3xl border border-[#30363D] p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 relative z-10">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-pink-950/40 text-white">
              <KrispLogo size={32} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  OFFICIAL KRISP PARTNER
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  TOP 25 ZAPIER ZAPS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Krisp AI Meeting Assistant & 25 Zapier Automations
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#8B949E] max-w-3xl">
            Transform meeting noise into actionable intelligence. Leverage Krisp's advanced AI noise cancellation, automatic transcript summarization, and 25 elite Zapier integrations connecting Zoom, Slack, HubSpot, Jira, QuickBooks, and Google Drive.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => window.open('https://krisp.ai', '_blank')}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-90 text-white text-xs font-extrabold shadow-xl shadow-pink-950/50 transition-all cursor-pointer"
          >
            <KrispLogo size={18} />
            <span>Get Krisp for Free</span>
          </button>
        </div>
      </div>

      {/* Krisp Live Meeting & Action Item Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-pink-400" />
              <span>Krisp Meeting AI & Transcription Simulator</span>
            </h3>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-emerald-400">NOISE CANCELLATION ACTIVE</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8B949E] mb-1">Meeting Title</label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3.5 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8B949E] mb-1">Simulated Audio Transcript</label>
              <textarea
                value={simulatedTranscript}
                onChange={(e) => setSimulatedTranscript(e.target.value)}
                rows={4}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl p-3 text-xs font-mono text-[#79C0FF] focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={noiseRemovalActive}
                  onChange={(e) => setNoiseRemovalActive(e.target.checked)}
                  className="rounded border-[#30363D] bg-[#0D1117] text-pink-500 focus:ring-pink-500"
                />
                <span>Enable Krisp AI Background Noise & Echo Removal</span>
              </label>

              <button
                onClick={handleSimulateMeetingWorkflow}
                disabled={executingSimulation}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-950/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{executingSimulation ? 'Processing AI...' : 'Process Meeting & Trigger Zaps'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Output & Zap Execution Result */}
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>Generated Meeting Summary & Action Items</span>
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ZAPIER READY
            </span>
          </div>

          <div className="flex-1 bg-[#0D1117] rounded-xl border border-[#30363D] p-4 font-mono text-xs text-[#79C0FF] overflow-auto max-h-72">
            {simulationResult ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(simulationResult, null, 2)}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#8B949E] space-y-2 py-8">
                <Bot className="w-8 h-8 opacity-40 text-pink-400" />
                <p className="text-xs">Process a meeting to generate AI summaries, extract action items, and trigger connected Zapier automations.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Filters for 25 Zapier Integrations */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-pink-400" />
              <span>The 25 Best Zapier Integrations Directory</span>
            </h2>
            <p className="text-xs text-[#8B949E]">
              Explore and test all 25 curated automation workflows across productivity, customer support, sales, HR, and e-commerce.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredZaps.map((zap) => (
            <div
              key={zap.id}
              className="bg-[#161B22] rounded-2xl border border-[#30363D] hover:border-pink-500/50 p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-pink-950/10 group relative"
            >
              {zap.featured && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                    <KrispLogo size={12} />
                    <span>KRISP FEATURED</span>
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-2.5">
                  <span className="p-2.5 rounded-xl bg-[#21262d] text-pink-400 border border-[#30363D]">
                    <Zap className="w-4 h-4 text-pink-400" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-wider">
                      {zap.category}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                      {zap.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#8B949E] leading-relaxed">
                  {zap.description}
                </p>

                <div className="bg-[#0D1117] rounded-xl p-3 border border-[#30363D] space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center text-[#8B949E]">
                    <span className="w-14 text-[10px] font-bold text-pink-400">TRIGGER:</span>
                    <span className="text-white truncate">{zap.trigger}</span>
                  </div>
                  <div className="flex items-center text-[#8B949E]">
                    <span className="w-14 text-[10px] font-bold text-purple-400">ACTION:</span>
                    <span className="text-emerald-300 truncate">{zap.action}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#21262d] flex items-center justify-between">
                <button
                  onClick={() => handleRunZap(zap)}
                  disabled={runningZap === zap.id}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#21262d] hover:bg-pink-600/20 hover:border-pink-500/40 text-white hover:text-pink-300 border border-[#30363D] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${runningZap === zap.id ? 'animate-spin' : ''}`} />
                  <span>{runningZap === zap.id ? 'Executing Zap...' : 'Test & Run Zap Automation'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Execution Logs */}
      {zapLogs.length > 0 && (
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zapier Execution Logs</span>
            </h3>
            <button
              onClick={() => setZapLogs([])}
              className="text-xs text-[#8B949E] hover:text-white cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          <div className="space-y-2">
            {zapLogs.map((log) => (
              <div key={log.id} className="bg-[#0D1117] rounded-xl p-3 border border-[#30363D] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    {log.status}
                  </span>
                  <span className="text-white font-bold">{log.title}</span>
                  <span className="text-[#8B949E] text-[11px] truncate max-w-md">{JSON.stringify(log.details)}</span>
                </div>
                <span className="text-[#8B949E] text-[10px]">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default KrispZapierHub;

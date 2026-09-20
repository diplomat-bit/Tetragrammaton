import React, { useState } from 'react';
import {
  Lock,
  Code2,
  FileCode2,
  Copy,
  Check,
  Shield,
  Key,
  Terminal,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { ConfigStatus } from '../types';

interface DeveloperGuideTabProps {
  configStatus: ConfigStatus | null;
  onOpenCredentials: () => void;
}

export const DeveloperGuideTab: React.FC<DeveloperGuideTabProps> = ({
  configStatus,
  onOpenCredentials,
}) => {
  const [selectedSnippet, setSelectedSnippet] = useState<'curl' | 'nodejs' | 'python'>('curl');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const curlSnippet = `# 1. Open Bank Project Direct Login Authentication
curl -X POST "https://apisandbox.openbankproject.com/my/logins/direct" \\
  -H "Content-Type: application/json" \\
  -H 'Authorization: DirectLogin username="diplomat@citibankdemobusiness.dev",password="YOUR_PASSWORD",consumer_key="${configStatus?.consumerKeyMasked || 'YOUR_CONSUMER_KEY'}"'

# Response:
# {"token": "obp_live_tok_example99201..."}

# 2. Get Real Bank Accounts using DirectLogin Token
curl -X GET "https://apisandbox.openbankproject.com/obp/v5.1.0/banks/rbs/accounts" \\
  -H 'Authorization: DirectLogin token="YOUR_OBP_TOKEN"'

# 3. Create OBP Transaction Request (Transfer / Payment)
curl -X POST "https://apisandbox.openbankproject.com/obp/v5.1.0/banks/rbs/accounts/rbs-op-acc-7701/owner/transaction-request-types/SANDBOX_TAN/transaction-requests" \\
  -H "Content-Type: application/json" \\
  -H 'Authorization: DirectLogin token="YOUR_OBP_TOKEN"' \\
  -d '{
    "to": {
      "bank_id": "hsbc-test",
      "account_id": "hsbc-cp-escrow-9920"
    },
    "value": {
      "currency": "USD",
      "amount": "50000.00"
    },
    "description": "Inter-account Commercial Paper settlement transfer",
    "challenge_type": "SANDBOX_TAN"
  }'`;

  const nodeSnippet = `import fetch from 'node-fetch';

const CONSUMER_KEY = process.env.OBP_CONSUMER_KEY;
const USERNAME = 'diplomat@citibankdemobusiness.dev';
const PASSWORD = process.env.OBP_USER_PASSWORD;

// 1. Direct Login
async function loginOBP() {
  const authHeader = \`DirectLogin username="\${USERNAME}",password="\${PASSWORD}",consumer_key="\${CONSUMER_KEY}"\`;
  const res = await fetch('https://apisandbox.openbankproject.com/my/logins/direct', {
    method: 'POST',
    headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  return data.token;
}

// 2. Fetch Accounts
async function getAccounts(token, bankId = 'rbs') {
  const res = await fetch(\`https://apisandbox.openbankproject.com/obp/v5.1.0/banks/\${bankId}/accounts\`, {
    headers: { 'Authorization': \`DirectLogin token="\${token}"\` },
  });
  return res.json();
}`;

  const pythonSnippet = `import os
import requests

CONSUMER_KEY = os.getenv("OBP_CONSUMER_KEY")
USERNAME = "diplomat@citibankdemobusiness.dev"
PASSWORD = os.getenv("OBP_USER_PASSWORD")

# 1. Direct Login
auth_header = f'DirectLogin username="{USERNAME}",password="{PASSWORD}",consumer_key="{CONSUMER_KEY}"'
resp = requests.post(
    "https://apisandbox.openbankproject.com/my/logins/direct",
    headers={"Authorization": auth_header, "Content-Type": "application/json"}
)
token = resp.json().get("token")

# 2. Get Accounts
headers = {"Authorization": f'DirectLogin token="{token}"'}
accounts_resp = requests.get(
    "https://apisandbox.openbankproject.com/obp/v5.1.0/banks/rbs/accounts",
    headers=headers
)
print("Accounts:", accounts_resp.json())`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-400/30 backdrop-blur-md shadow-lg shadow-blue-500/10">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Developer API & Integration Guide</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Registered Open Bank Project Consumer Specifications & Code Snippets.
          </p>
        </div>

        <button
          onClick={onOpenCredentials}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 shadow-lg shadow-blue-500/25 border border-white/20 backdrop-blur-md"
        >
          <Key className="w-3.5 h-3.5" />
          <span>Configure Credentials</span>
        </button>
      </div>

      {/* Registration Details Specification Card */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center space-x-2.5 text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="tracking-tight">Open Bank Project API Consumer Registration</span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
            Registered Status: Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 text-xs">
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <span className="text-slate-400 block mb-0.5">Application Name:</span>
            <span className="font-semibold text-white">Citibank Demo Business App</span>
          </div>
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <span className="text-slate-400 block mb-0.5">Application Type:</span>
            <span className="font-semibold text-slate-200">Public Consumer</span>
          </div>
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <span className="text-slate-400 block mb-0.5">Developer Email:</span>
            <span className="font-mono text-cyan-300 font-medium">diplomat@citibankdemobusiness.dev</span>
          </div>
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <span className="text-slate-400 block mb-0.5">User Redirect URL:</span>
            <span className="font-mono text-slate-200">https://citibankdemobusiness.dev</span>
          </div>
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <span className="text-slate-400 block mb-0.5">Direct Login Endpoint:</span>
            <span className="font-mono text-slate-300 text-[11px] break-all">https://apisandbox.openbankproject.com/my/logins/direct</span>
          </div>
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <span className="text-slate-400 block mb-0.5">OAuth 1.0a Endpoint:</span>
            <span className="font-mono text-slate-300 text-[11px] break-all">https://apisandbox.openbankproject.com/oauth/initiate</span>
          </div>
          <div className="md:col-span-2 p-3.5 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-1 font-medium">Registered App Capabilities:</span>
            <p className="text-slate-300 italic text-xs leading-relaxed">
              "It can do everything we have the first commercial paper app also have api to connect with modern treasury and we have the quantum assistant chat bot that can do it all"
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="tracking-tight">Open Bank Project API Code Snippets</span>
          </div>

          <div className="flex items-center space-x-2">
            {[
              { id: 'curl', label: 'cURL' },
              { id: 'nodejs', label: 'Node.js / TS' },
              { id: 'python', label: 'Python' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSnippet(s.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all backdrop-blur-md ${
                  selectedSnippet === s.id
                    ? 'bg-blue-600 text-white border border-white/30 shadow-md shadow-blue-600/30'
                    : 'bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {s.label}
              </button>
            ))}

            <button
              onClick={() => {
                const text =
                  selectedSnippet === 'curl'
                    ? curlSnippet
                    : selectedSnippet === 'nodejs'
                    ? nodeSnippet
                    : pythonSnippet;
                copyToClipboard(text, 'snippet');
              }}
              className="p-2 bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 rounded-xl transition-all flex items-center space-x-1 text-xs backdrop-blur-md"
              title="Copy snippet"
            >
              {copiedSection === 'snippet' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <pre className="p-4 bg-black/40 backdrop-blur-xl rounded-xl text-xs font-mono text-slate-200 overflow-x-auto border border-white/10 leading-relaxed shadow-inner">
          {selectedSnippet === 'curl' && curlSnippet}
          {selectedSnippet === 'nodejs' && nodeSnippet}
          {selectedSnippet === 'python' && pythonSnippet}
        </pre>
      </div>
    </div>
  );
};

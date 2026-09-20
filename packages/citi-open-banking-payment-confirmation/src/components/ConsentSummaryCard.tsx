import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  UserCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  Hash,
  Sparkles,
} from 'lucide-react';
import { ConsentData, OpenBankingLinks } from '../types';
import { formatDateTime } from '../utils/openBanking';

interface ConsentSummaryCardProps {
  data: ConsentData;
  links?: OpenBankingLinks;
  onRenderUrl: (url: string) => void;
  isRenderingUrl?: boolean;
}

export const ConsentSummaryCard: React.FC<ConsentSummaryCardProps> = ({
  data,
  links,
  onRenderUrl,
  isRenderingUrl = false,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyId = () => {
    if (data.ConsentId) {
      navigator.clipboard.writeText(data.ConsentId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Status styling logic
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'authorised':
      case 'authorized':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Authorised',
          desc: 'Consent is active & authorized by PSU for funds confirmation.',
        };
      case 'awaitingauthorisation':
      case 'awaitingauthorization':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <Clock className="w-3.5 h-3.5 animate-pulse" />,
          label: 'Awaiting Authorisation',
          desc: 'Consent created successfully (201 Created). Awaiting PSU authorization or CBPII verification.',
        };
      case 'rejected':
      case 'revoked':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          label: status,
          desc: 'Consent was rejected or revoked by debtor account holder.',
        };
      default:
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: <Layers className="w-3.5 h-3.5" />,
          label: status || 'Pending',
          desc: 'Open Banking consent record status.',
        };
    }
  };

  const statusInfo = getStatusBadge(data.Status);
  const selfUrl = links?.Self;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Top Header with Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white tracking-tight">Payment & Funds Consent Confirmation</h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              201 Created
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            OBIE UK v3.1 Confirmation of Funds Consent Record
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col sm:items-end">
          <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusInfo.bg}`}>
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 max-w-xs text-right hidden sm:inline">
            {statusInfo.desc}
          </span>
        </div>
      </div>

      {/* Grid of Key Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Consent ID */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 mb-1">
            <Hash className="w-3 h-3 text-blue-400" />
            <span>Consent ID</span>
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono font-semibold text-slate-100 truncate mr-2" title={data.ConsentId}>
              {data.ConsentId || '—'}
            </span>
            <button
              type="button"
              id="btn-copy-consent-id"
              onClick={handleCopyId}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition"
              title="Copy Consent ID"
            >
              {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Debtor Name & Scheme */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 mb-1">
            <UserCheck className="w-3 h-3 text-cyan-400" />
            <span>Debtor Account Name</span>
          </span>
          <div className="mt-1">
            <div className="text-sm font-semibold text-white">{data.DebtorAccount?.Name || '—'}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Scheme: {data.DebtorAccount?.SchemeName || 'UK.OBIE.BBAN'}
            </div>
          </div>
        </div>

        {/* Debtor Identification / IBAN */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 mb-1">
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>Account Identification</span>
          </span>
          <div className="mt-1">
            <div className="text-xs font-mono font-bold text-cyan-300 truncate" title={data.DebtorAccount?.Identification}>
              {data.DebtorAccount?.Identification || '—'}
            </div>
            {data.DebtorAccount?.SecondaryIdentification && (
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Roll: {data.DebtorAccount.SecondaryIdentification}
              </div>
            )}
          </div>
        </div>

        {/* Expiration & Creation */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 mb-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>Expiration Date</span>
          </span>
          <div className="mt-1">
            <div className="text-xs font-medium text-slate-200">
              {formatDateTime(data.ExpirationDateTime)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Created: {formatDateTime(data.CreationDateTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Render URL / Self Link Bar */}
      {selfUrl && (
        <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-950/70 border border-blue-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 text-xs font-medium text-blue-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Confirmation Self URL (Links.Self)</span>
            </div>
            <p className="text-xs font-mono text-slate-300 break-all bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800/80 select-all">
              {selfUrl}
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
            <button
              type="button"
              id="btn-copy-self-url"
              onClick={() => handleCopyUrl(selfUrl)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-render-self-url"
              onClick={() => onRenderUrl(selfUrl)}
              disabled={isRenderingUrl}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isRenderingUrl ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Rendering URL...</span>
                </>
              ) : (
                <>
                  <span>Render & Inspect URL</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

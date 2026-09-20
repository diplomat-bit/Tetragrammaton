import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, FileText, CheckCircle, AlertCircle, RefreshCw, Key, Building } from 'lucide-react';
import { alpacaAccountsService, AlpacaCipData, AlpacaOptionsApprovalRequest } from '../../services/AlpacaAccountsService';

export const AlpacaAccountsManager: React.FC = () => {
  const accountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
  const [cipData, setCipData] = useState<AlpacaCipData | null>(null);
  const [optionsApproval, setOptionsApproval] = useState<AlpacaOptionsApprovalRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestedLevel, setRequestedLevel] = useState<number>(3);
  const [onfidoToken, setOnfidoToken] = useState<string>('');

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    setLoading(true);
    try {
      const cip = await alpacaAccountsService.getCip(accountId);
      const opt = await alpacaAccountsService.getOptionsApproval(accountId);
      setCipData(cip);
      setOptionsApproval(opt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOptions = async () => {
    setLoading(true);
    try {
      const res = await alpacaAccountsService.requestOptionsApproval(accountId, requestedLevel);
      setOptionsApproval(res);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOnfido = async () => {
    const res = await alpacaAccountsService.getOnfidoSdkToken(accountId);
    setOnfidoToken(res.token);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-yellow-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <UserCheck className="text-yellow-400" size={24} />
            Alpaca Correspondent Account & KYC Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Correspondent Brokerage Lifecycle, CIP Validation, Options Level Approval & Onfido SDK Integration
          </p>
        </div>
        <button
          onClick={loadAccountData}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-xs font-semibold text-yellow-400 border border-yellow-500/30 transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CIP & Identity Validation Card */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
              <ShieldCheck className="text-emerald-400" size={18} />
              CIP & Sanctions Result
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {cipData?.kyc.approval_status.toUpperCase() || 'APPROVED'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Account ID:</span>
              <span className="font-mono text-cyan-400">{accountId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Primary Holder:</span>
              <span className="text-slate-200">{cipData?.kyc.applicant_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Verified Providers:</span>
              <span className="text-emerald-400">{cipData?.provider_name.join(', ')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Risk Assessment:</span>
              <span className="text-yellow-400 font-bold">{cipData?.kyc.risk_level} (Score: {cipData?.kyc.risk_score})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Matched Address:</span>
              <span className="text-slate-300">{cipData?.identity?.matched_address}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerateOnfido}
              className="w-full bg-slate-800 hover:bg-slate-700 text-yellow-400 font-semibold py-2 px-3 rounded-lg text-xs border border-yellow-500/20 flex items-center justify-center gap-2 transition"
            >
              <Key size={14} />
              Issue Onfido SDK Web Token
            </button>
            {onfidoToken && (
              <div className="mt-2 p-2 bg-slate-950 rounded text-[10px] font-mono text-cyan-300 break-all border border-cyan-500/20">
                Token: {onfidoToken}
              </div>
            )}
          </div>
        </div>

        {/* Options Approval Beta Card */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
              <Building className="text-yellow-400" size={18} />
              Options Trading Level Approval (BETA)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              LEVEL {optionsApproval?.approved_level || 2}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Submit correspondent options trading authorization request (Level 1: Covered Calls, Level 2: Long Calls/Puts, Level 3: Spreads & Multi-leg).
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Options Level</label>
              <select
                value={requestedLevel}
                onChange={(e) => setRequestedLevel(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-yellow-500"
              >
                <option value={1}>Level 1 - Covered Calls & Cash-Secured Puts</option>
                <option value={2}>Level 2 - Long Equity/Option Contracts</option>
                <option value={3}>Level 3 - Spreads, Straddles & Multi-leg Options</option>
              </select>
            </div>

            <button
              onClick={handleRequestOptions}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition"
            >
              <CheckCircle size={14} />
              Submit Options Approval Request
            </button>

            {optionsApproval && (
              <div className="p-3 bg-slate-950/60 rounded-lg border border-emerald-500/20 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">{optionsApproval.status}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Approved Level:</span>
                  <span className="text-yellow-400 font-mono">{optionsApproval.approved_level}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlpacaAccountsManager;

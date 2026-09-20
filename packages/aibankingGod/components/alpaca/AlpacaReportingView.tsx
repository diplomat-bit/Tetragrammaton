import React, { useState, useEffect } from 'react';
import { BarChart3, Landmark, FileCheck } from 'lucide-react';
import { alpacaReportingService, FpslLoanAnalytics, EodCashInterest } from '../../services/AlpacaReportingService';

export const AlpacaReportingView: React.FC = () => {
  const accountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d';
  const [fpslData, setFpslData] = useState<FpslLoanAnalytics | null>(null);
  const [cashInterest, setCashInterest] = useState<EodCashInterest[]>([]);
  const [jitSettlements, setJitSettlements] = useState<any[]>([]);

  useEffect(() => {
    alpacaReportingService.getFpslAnalytics(accountId).then(setFpslData);
    alpacaReportingService.getEodCashInterest(accountId).then(setCashInterest);
    alpacaReportingService.getJitSettlements().then(setJitSettlements);
  }, []);

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-yellow-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <BarChart3 className="text-yellow-400" size={24} />
            Alpaca EOD Reporting & FPSL Lending Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            End-Of-Day Cash Interest Accruals, Fully Paid Securities Lending Splits & JIT Settlements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FPSL Analytics */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <Landmark className="text-cyan-400" size={18} />
            FPSL Lending Program Analytics
          </h3>
          {fpslData && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Total Lending Activities:</span>
                <span className="font-mono text-slate-200">{fpslData.total_lending_activities}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Customer Yield Share:</span>
                <span className="font-mono text-emerald-400 font-bold">${fpslData.interest.customer.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Partner Revenue Share:</span>
                <span className="font-mono text-yellow-400 font-bold">${fpslData.interest.partner.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* EOD Cash Interest */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <DollarIcon className="text-emerald-400" size={18} />
            EOD Uninvested Cash Interest
          </h3>
          {cashInterest.map((item, idx) => (
            <div key={idx} className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Cash Balance:</span>
                <span className="font-mono text-slate-200">${item.cash_balance}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Rate (BPS):</span>
                <span className="font-mono text-cyan-400 font-bold">{item.account_rate_bps} BPS (4.50%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Daily Accrual:</span>
                <span className="font-mono text-emerald-400 font-bold">+${item.account_accrued_interest}</span>
              </div>
            </div>
          ))}
        </div>

        {/* JIT Settlements */}
        <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-3 text-sm flex items-center gap-2">
            <FileCheck className="text-yellow-400" size={18} />
            JIT Omnibus Settlements
          </h3>
          {jitSettlements.map((jit) => (
            <div key={jit.id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-yellow-400">${jit.total_amount}</span>
                <span className="text-emerald-400 font-bold">{jit.status}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Ref: {jit.id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DollarIcon: React.FC<any> = (props) => <span {...props}>💵</span>;

export default AlpacaReportingView;

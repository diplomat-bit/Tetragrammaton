import React, { useState } from 'react';
import { CitiApiResponse, AiInsights } from '../types';
import { Sparkles, ShieldAlert, CheckCircle, TrendingUp, AlertTriangle, RefreshCw, Award } from 'lucide-react';

interface AiAdvisorProps {
  data: CitiApiResponse | null;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ data }) => {
  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountsData: data })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate AI insights.');
      }
      setInsights(json);
    } catch (err: any) {
      setError(err.message || 'Error communicating with Gemini AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-purple-950 p-6 sm:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 w-fit text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Powered by Gemini 2.5 Flash</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 tracking-tight">
            AI Financial Health & Portfolio Advisor
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Instantly analyze your Citi accounts, assets, liabilities, and mortgage obligations with AI-driven financial modeling and personalized strategic advice.
          </p>

          <div className="mt-5">
            <button
              onClick={fetchInsights}
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing Portfolio...' : insights ? 'Re-run Portfolio Analysis' : 'Generate AI Portfolio Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !insights && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-700 font-medium text-sm">Gemini AI is examining account liquidity, asset allocation, and mortgage status...</p>
        </div>
      )}

      {insights && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Executive Summary & Health Score */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Executive Summary</h3>
              <p className="text-slate-800 text-base leading-relaxed font-medium">
                {insights.executiveSummary}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Net Worth Overview</h4>
                <p className="text-slate-700 text-sm">{insights.netWorthOverview}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-amber-400">
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Portfolio Health Score</span>
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-5xl font-extrabold tracking-tight">{insights.portfolioHealthScore}</span>
                  <span className="text-slate-400 text-lg">/ 100</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-4 pt-4 border-t border-slate-800">
                Calculated based on asset liquidity, credit utilization ratio, and delinquency status.
              </p>
            </div>
          </div>

          {/* Risk & Status Alerts */}
          {insights.alerts && insights.alerts.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 p-6 rounded-2xl">
              <h3 className="font-bold text-amber-900 text-base mb-3 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Risk & Account Status Alerts</span>
              </h3>
              <ul className="space-y-2">
                {insights.alerts.map((alert, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-sm text-amber-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Strategic Financial Recommendations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                        rec.impact === 'High' ? 'bg-rose-100 text-rose-800' :
                        rec.impact === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.impact} Impact
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {!insights && !loading && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-slate-900 font-semibold text-base">Ready to analyze your accounts</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Click the button above to generate a professional financial review of your Citi assets, liabilities, and investment accounts using Gemini AI.
          </p>
        </div>
      )}

    </div>
  );
};

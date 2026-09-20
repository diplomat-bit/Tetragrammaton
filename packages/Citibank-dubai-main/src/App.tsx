/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptOffer = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/accept-offer', {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans flex flex-col text-[#333]">
      <nav className="h-16 bg-[#1A2B45] flex items-center justify-between px-8 border-b-4 border-[#C5A059]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C5A059] rounded-sm flex items-center justify-center font-bold text-white text-xl">
            D
          </div>
          <span className="text-white font-semibold text-lg tracking-tight uppercase">
            Dubai-USA Capital <span className="text-[#C5A059] font-light">| Partner Portal</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-white uppercase tracking-widest hidden sm:flex">
          <span className="opacity-70">Partner ID: 8bJV5Au7B80L...</span>
          <div className="bg-emerald-500 w-2 h-2 rounded-full"></div>
          <span className="font-medium">API Connection Stable</span>
        </div>
      </nav>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-8">
        <section className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded shadow-sm border border-[#E2E8F0]">
            <h2 className="text-xs font-bold text-[#1A2B45] uppercase tracking-wider mb-4 border-b pb-2">
              Active Loan Offer
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase">Application Reference</label>
                <p className="text-lg font-mono font-semibold text-[#1A2B45]">ZOW9IO793859</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-medium">
                    Interbank Offered Rate (IBOR)
                  </label>
                  <p className="text-2xl font-light text-[#C5A059]">
                    12.2<span className="text-sm">%</span>
                  </p>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-medium">Loan Index Rate</label>
                  <p className="text-2xl font-light text-[#C5A059]">
                    12.2<span className="text-sm">%</span>
                  </p>
                </div>
              </div>
              <div className="bg-[#F8F9FA] p-3 rounded">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-mono font-medium">XXXXXXX-0092</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow-sm border border-[#E2E8F0] flex-1 hidden lg:block">
            <h2 className="text-xs font-bold text-[#1A2B45] uppercase tracking-wider mb-4 border-b pb-2">Environment Variables</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase block mb-1">BEARER_TOKEN</label>
                <div className="relative">
                  <input type="password" value="*********************" className="w-full bg-[#F1F5F9] border border-[#CBD5E1] p-2 rounded text-xs font-mono text-gray-500" readOnly />
                  <span className="absolute right-2 top-2 text-[9px] text-blue-600 font-bold">SECURED</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase block mb-1">UUID</label>
                <input type="text" value="54074e69-34b1-457d-9b35-0d21cfa7ed54" className="w-full bg-[#F1F5F9] border border-[#CBD5E1] p-2 rounded text-xs font-mono text-gray-500" readOnly />
              </div>
            </div>
          </div>
        </section>

        <section className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#1E293B] rounded shadow-lg overflow-hidden flex flex-col flex-1 border border-black">
            <div className="bg-[#334155] px-4 py-2 flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-300">POST /emea/onboarding/applications/offerAcceptance</span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
              </div>
            </div>
            
            <div className="p-6 flex-1 font-mono text-sm leading-relaxed overflow-x-auto">
              <div className="mb-4 whitespace-pre">
                <span className="text-emerald-400">curl</span> <span className="text-white">--request POST \</span><br />
                {"  "}<span className="text-gray-400">--url</span> <span className="text-orange-300">'https://partner.citi.com/gcgapi/...'</span> <span className="text-white">\</span><br />
                {"  "}<span className="text-gray-400">--header</span> <span className="text-orange-300">'Accept: application/json'</span> <span className="text-white">\</span><br />
                {"  "}<span className="text-gray-400">--header</span> <span className="text-orange-300">'Authorization: Bearer {'{BEARER_TOKEN}'}'</span>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                {loading ? (
                  <div className="flex items-center text-emerald-400 gap-2 mb-2 font-bold animate-pulse">
                     <Loader2 className="h-4 w-4 animate-spin" />
                     // Executing request...
                  </div>
                ) : result ? (
                  <>
                    <p className="text-emerald-400 mb-2 font-bold">// Response: 200 OK</p>
                    <pre className="text-gray-300 bg-[#0F172A] p-4 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </>
                ) : error ? (
                   <>
                    <p className="text-red-400 mb-2 font-bold">// Response: Error</p>
                    <pre className="text-red-300 bg-[#0F172A] p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {error}
                    </pre>
                  </>
                ) : (
                  <p className="text-gray-500 mb-2 italic">// Waiting for execution...</p>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-[#0F172A] border-t border-gray-700 flex justify-end">
              <button
                onClick={handleAcceptOffer}
                disabled={loading}
                className="bg-[#C5A059] hover:bg-[#B48F48] disabled:opacity-50 disabled:hover:bg-[#C5A059] disabled:cursor-not-allowed text-white px-8 py-3 rounded-sm font-bold text-sm transition-colors uppercase tracking-widest flex items-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Confirm Offer Acceptance
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="h-12 bg-white border-t flex items-center px-4 md:px-8 text-[10px] text-gray-400 gap-4 md:gap-8 shrink-0">
        <span>© 2024 Dubai-USA Financial Services</span>
        <span className="hidden sm:inline">Authorized by Citi Partner Program</span>
        <span className="ml-auto uppercase tracking-widest text-[#C5A059] font-bold text-right">
          System Environment: Sandbox/v1
        </span>
      </footer>
    </div>
  );
}

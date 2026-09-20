import React from 'react';
import { X, BookOpen, ExternalLink, ShieldCheck, CheckCircle2, Terminal } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Citi Open Banking & CBPII Guide</h3>
              <p className="text-xs text-slate-400">UK Open Banking (OBIE) v3.1 Confirmation of Funds Spec</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="font-semibold text-white flex items-center space-x-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Confirmation of Funds Consent (CBPII)</span>
            </h4>
            <p>
              In Open Banking v3.1, a Card-Based Payment Instrument Issuer (CBPII) requests a consent from the Payment Service User (PSU) to confirm whether sufficient funds are available on their debtor account before authorizing payments.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-blue-400">
              Standard Request Headers
            </h4>
            <ul className="space-y-1.5 list-disc list-inside bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px]">
              <li><strong className="text-slate-100">Authorization:</strong> Bearer &lt;access_token&gt;</li>
              <li><strong className="text-slate-100">x-fapi-financial-id:</strong> &lt;fid&gt; (Financial Institution ID)</li>
              <li><strong className="text-slate-100">Accept:</strong> application/json</li>
              <li><strong className="text-slate-100">Content-Type:</strong> application/json</li>
              <li><strong className="text-slate-100">x-fapi-interaction-id:</strong> UUID tracking string</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-blue-400">
              Workflow Steps
            </h4>
            <div className="space-y-2 bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <span className="font-bold text-cyan-400">1.</span>
                <div>
                  <strong className="text-slate-100">Create Funds Confirmation Consent (POST)</strong>:
                  Sends debtor account info & receives 201 Created with <code className="text-blue-300">ConsentId</code> and <code className="text-blue-300">Links.Self</code>.
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-cyan-400">2.</span>
                <div>
                  <strong className="text-slate-100">Render and Query Self URL (GET)</strong>:
                  Retrieves current state, authorized status, and account balance summary directly.
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-cyan-400">3.</span>
                <div>
                  <strong className="text-slate-100">Funds Confirmation Check (POST)</strong>:
                  Verifies whether specific instructed transaction amounts (e.g. £500) can be covered by the account in real-time.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition text-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

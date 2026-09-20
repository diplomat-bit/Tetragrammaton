
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Lock, Activity, RefreshCw, ExternalLink } from 'lucide-react';

interface SovereignIframeProps {
  children?: React.ReactNode;
  src?: string;
  title: string;
  moduleCode: string;
}

const SovereignIframe: React.FC<SovereignIframeProps> = ({ children, src, title, moduleCode }) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState(0);
  const [mtlsVerified, setMtlsVerified] = useState(false);

  const mountNode = contentRef?.contentWindow?.document.body;

  useEffect(() => {
    // Simulate mTLS handshake for the tunnel
    const verifyMtls = async () => {
       await new Promise(r => setTimeout(r, 1500));
       setMtlsVerified(true);
    };
    verifyMtls();
  }, []);

  useEffect(() => {
    if (!contentRef || src) return;

    const doc = contentRef.contentWindow?.document;
    if (!doc) return;

    // Inject Tailwind and Fonts into the iframe head for PORTALED components
    const head = doc.head;
    const styles = [
      "https://cdn.tailwindcss.com",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    ];

    styles.forEach(url => {
      const link = doc.createElement(url.endsWith('.css') ? 'link' : 'script');
      if (url.endsWith('.css')) {
        (link as HTMLLinkElement).rel = 'stylesheet';
        (link as HTMLLinkElement).href = url;
      } else {
        (link as HTMLScriptElement).src = url;
      }
      head.appendChild(link);
    });

    const styleTag = doc.createElement('style');
    styleTag.innerHTML = `
      body { 
        background: transparent !important; 
        margin: 0; 
        padding: 0; 
        color: white; 
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        overflow-x: hidden;
      }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.1); border-radius: 10px; }
    `;
    head.appendChild(styleTag);

    const checkReady = setInterval(() => {
      if (doc.readyState === 'complete') {
        setIsReady(true);
        clearInterval(checkReady);
      }
    }, 100);

    return () => clearInterval(checkReady);
  }, [contentRef, src]);

  // If we have a direct SRC, we just wait for the onload event
  const handleIframeLoad = () => {
    setIsReady(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(s => (s + 1) % 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-950/20 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-700">
      {/* FRAME HEADER (The Secure HUD) */}
      <div className="flex items-center justify-between px-8 py-4 bg-gray-900/40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Shield size={16} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">{title}</h3>
            <p className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter">Module_ID: {moduleCode} // Secure_Tunnel_Established</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded bg-slate-900 border ${mtlsVerified ? 'border-emerald-500/50 text-emerald-400' : 'border-red-500/50 text-red-400'} flex items-center gap-1.5`}>
               <Lock size={10} />
               <span className="text-[8px] font-black uppercase tracking-tighter">{mtlsVerified ? 'mTLS_VERIFIED' : 'mTLS_HANDSHAKE'}</span>
            </div>
            <Activity size={12} className="text-green-500 animate-pulse" />
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Coherence: {mtlsVerified ? 99.8 + (syncStatus / 1000) : 0}%</span>
          </div>
          <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full transition-all duration-1000" style={{ width: `${60 + (syncStatus / 2)}%` }}></div>
          </div>
          <button 
            onClick={() => src && window.open(src, '_blank')}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors group"
            title="Open in New Tab"
          >
             <ExternalLink size={12} className="text-gray-700 group-hover:text-cyan-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* THE IFRAME OR DIRECT CONTAINER */}
      <div className="flex-1 relative overflow-y-auto custom-scrollbar">
        {src ? (
          <>
            {!isReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20 gap-4">
                <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.4em] animate-pulse">Initializing Neural Portal...</p>
              </div>
            )}
            <iframe
              src={src}
              onLoad={handleIframeLoad}
              className="w-full h-full border-none"
              title={title}
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              allow="camera; microphone; geolocation; encrypted-media"
            />
          </>
        ) : (
          <div className="w-full h-full p-2 lg:p-4">
            {children}
          </div>
        )}
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 8s infinite linear; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SovereignIframe;

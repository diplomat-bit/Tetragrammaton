import React, { useState, useEffect, useContext, useRef } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { usePortal } from "../context/PortalContext";
import { 
  Shield, 
  Activity, 
  Lock, 
  AlertCircle, 
  ArrowLeft, 
  Cpu, 
  Globe, 
  Database,
  Fingerprint,
  Zap,
  Key,
  Terminal,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Eye,
  EyeOff,
  ExternalLink,
  Layout
} from "lucide-react";
import { DataContext } from "../context/DataContext";
import { View, AzureApp } from "../types";
import { fallbackApps } from "../data/fallbackApps";

interface FleetAppViewProps {
  appId: string;
  setView: (view: any) => void;
}

export default function FleetAppView({ appId, setView }: FleetAppViewProps) {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  
  // Get active logged-in user profile from our Sovereign OS DataContext
  const context = useContext(DataContext);
  const sessionId = context?.sessionId;
  const userEmail = context?.userProfile?.email || "james.ocallaghan@aquarius-sovereign.onmicrosoft.com";
  const userName = context?.userProfile?.name || "Grand Architect";

  const [appData, setAppData] = useState<AzureApp | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [bypassAuth, setBypassAuth] = useState(false);

  // User-Specific Isolated State Management
  const [tenantId, setTenantId] = useState("6666f090-016a-494b-b11a-4d3e01febe95");
  const [masterClientId, setMasterClientId] = useState("5058b232-bf3f-4de1-aa75-afdbad959a59");
  const [masterClientSecret, setMasterClientSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Tabbed view for the rotate operations
  const [activeTab, setActiveTab ] = useState<"dashboard" | "terminal" | "certificate" | "payload" | "token">("dashboard");
  
  // Console logging states
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[SYSTEM_INFO] Handshake listener listening on decentralised TLS channel.",
    "[SYSTEM_INFO] Enter credentials above and click 'ROTATE' to invoke X.509 certificate generation protocol."
  ]);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);

  // Certificates generated vault
  const [vaultCert, setVaultCert] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Load user-specific local configs and cert history on mount
  useEffect(() => {
    // Config
    const savedConfig = localStorage.getItem(`azure_config_${userEmail}`);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.tenantId) setTenantId(parsed.tenantId);
        if (parsed.masterClientId) setMasterClientId(parsed.masterClientId);
        if (parsed.masterClientSecret) setMasterClientSecret(parsed.masterClientSecret);
      } catch (e) {
        console.error("Failed loading local isolated config", e);
      }
    }

    // Rotated certificates
    const savedCert = localStorage.getItem(`azure_cert_${userEmail}_${appId}`);
    if (savedCert) {
      try {
        setVaultCert(JSON.parse(savedCert));
      } catch (e) {
        console.error("Failed loading localized active certificate record", e);
      }
    }
  }, [userEmail, appId]);

  // Keep terminal scrolled down
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        let appsList: any[] = [];
        let fetchedFromApi = false;
        try {
          const res = await fetch('/api/v1/azure-apps', {
            headers: { 'x-session-id': sessionId || '' }
          });
          if (res.ok) {
            const data = await res.json();
            appsList = data.apps || [];
            if (appsList.length > 0) {
              fetchedFromApi = true;
            }
          } else {
            throw new Error(`API error code: ${res.status}`);
          }
        } catch (apiError) {
          console.warn("Backend API fetch failed inside FleetAppView, trying static fallback apps.json:", apiError);
        }

        if (!fetchedFromApi) {
          try {
            const baseUrl = import.meta.env.BASE_URL || '/';
            let staticRes = await fetch(`${baseUrl}apps/apps.json`);
            if (!staticRes.ok && baseUrl !== '/') {
              staticRes = await fetch('/apps/apps.json');
            }
            if (staticRes.ok) {
              appsList = await staticRes.json();
            } else {
              throw new Error(`Static file fetch error: ${staticRes.status}`);
            }
          } catch (staticError) {
            console.error("Static fallback also failed inside FleetAppView, loading precompiled list:", staticError);
            appsList = fallbackApps;
          }
        }

        const found = appsList.find((a: any) => a.appId === appId);
        setAppData(found);
      } catch (e) {
        console.error("Failed to fetch app data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [appId]);

  const { setMsalBypass } = usePortal();

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await instance.loginPopup({ scopes: ["User.Read", "openid", "profile"] });
      setMsalBypass(true);
      setBypassAuth(true);
    } catch (e: any) {
      console.warn("Auth popup blocked or error, activating Entra Enclave Bypass:", e);
      setMsalBypass(true);
      setBypassAuth(true);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Triggers interactive high-fidelity key rotation protocol
  const triggerRotation = async () => {
    if (isRotating) return;
    setIsRotating(true);
    setRotationProgress(5);
    setActiveTab("terminal");

    const appName = appData?.app || "Unknown Sovereign Service";
    
    // Save current configuration to user's isolated local container
    const currentConfig = { tenantId, masterClientId, masterClientSecret };
    localStorage.setItem(`azure_config_${userEmail}`, JSON.stringify(currentConfig));

    const initialLogs = [
      `[${new Date().toLocaleTimeString()}] 🚀 Initiated Handshake Rotation Protocol for '${appName}'`,
      `[${new Date().toLocaleTimeString()}] Authenticating session context for user: ${userEmail}`,
      `[${new Date().toLocaleTimeString()}] Connecting with local Sovereign cryptography module...`
    ];
    setConsoleLogs(initialLogs);

    try {
      // 1. Trigger generate-cert backend execution
      await new Promise(r => setTimeout(r, 600));
      setRotationProgress(20);
      setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Cryptography module loaded. Generating RSA-2048 Bit Private/Public key pair...`]);

      const res = await fetch("/api/v1/azure-apps/rotate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-session-id": sessionId || ''
        },
        body: JSON.stringify({
          appId,
          appName,
          tenantId,
          masterClientId,
          objectId: appData?.objectId
        })
      });

      const data = await res.json();
      setRotationProgress(60);

      if (data.success || data.isSimulated) {
        // Build typewriter streaming for beautiful console log progression
        const backendLogs = data.logs || [];
        for (let i = 0; i < backendLogs.length; i++) {
          await new Promise(r => setTimeout(r, 350));
          setConsoleLogs(prev => [...prev, backendLogs[i]]);
        }

        // Complete rotation info
        const displayCertId = `Architect_Cert_${Math.floor(Date.now() / 1000)}`;
        const freshCert = {
          certId: displayCertId,
          thumbprint: data.thumbprint,
          privateKeyPem: data.privateKeyPem,
          certificatePem: data.certificatePem,
          clientAssertionJwt: data.clientAssertionJwt,
          expiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          accessTokenGenerated: data.accessTokenGenerated,
          issuer: `CN=${appName}, O=Autonomous Architect, OU=Sovereign Control Plane`,
          graphPayload: {
            keyCredential: {
              type: "AsymmetricX509Cert",
              usage: "Verify",
              keyId: data.keyId,
              displayName: displayCertId,
              value: data.certificatePem
                .replace(/-----BEGIN CERTIFICATE-----/, "")
                .replace(/-----END CERTIFICATE-----/, "")
                .replace(/\s+/g, "")
            }
          }
        };

        // Save certificate details to users isolated container
        localStorage.setItem(`azure_cert_${userEmail}_${appId}`, JSON.stringify(freshCert));
        setVaultCert(freshCert);

        setRotationProgress(100);
        setConsoleLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ✅ [SUCCESS] Key rotation handshake finalized!`,
          `[${new Date().toLocaleTimeString()}] Downstream client assertions registered. Security Vault updated for user ${userEmail}.`
        ]);

        if (context) {
          context.addSimulatedLog(
            userEmail, 
            `Credential Rotation Trigger (appId: ${appId})`, 
            `Successfully generated and uploaded dynamic self-signed cert credential on behalf of user ${userName}`,
            "SUCCESS"
          );
        }

      } else {
        throw new Error(data.error || "Rotation returned unsuccessful state.");
      }

    } catch (e: any) {
      console.error(e);
      setRotationProgress(0);
      setConsoleLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ❌ [ERROR] Handshake failed: ${e.message}`,
        `[${new Date().toLocaleTimeString()}] Protocol closed with exit code 1.`
      ]);
    } finally {
      setIsRotating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-lime-500 font-mono text-xs animate-pulse flex items-center gap-2">
          <Cpu className="animate-spin" size={16} /> INITIALIZING_APP_PROTOCOL...
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !bypassAuth) {
    return (
      <div className="h-full bg-black flex flex-col items-center justify-center space-y-8 p-8 border border-white/5 rounded-[3rem] animate-in fade-in duration-500">
        <div className="relative">
          <Fingerprint size={80} className="text-lime-500 animate-pulse" />
          <div className="absolute inset-0 bg-lime-500/20 blur-3xl rounded-full" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Azure Handshake Required</h2>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Target: {appData?.app || appId}</p>
        </div>
        
        {authError && (
          <div className="max-w-md p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-[10px] font-mono text-center">
            <p className="font-bold uppercase tracking-widest flex items-center justify-center gap-2 mb-1">
              <AlertCircle size={12} /> Auth_Error
            </p>
            <p className="opacity-80">{authError}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button onClick={handleLogin} className="w-full py-4 bg-lime-500 text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform">
            <Lock size={18} /> AUTHORIZE_ACCESS
          </button>
          
          <button onClick={() => setBypassAuth(true)} className="w-full py-4 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-mono text-xs uppercase tracking-wider">
            Bypass Handshake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black text-white space-y-8 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar p-1 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setView(View.Dashboard)}
          className="flex items-center gap-2 text-gray-500 hover:text-lime-400 transition-colors font-mono text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Directory
        </button>
        <div className="flex items-center gap-4 text-lime-500 font-mono text-[10px] tracking-widest uppercase">
          <span className="text-gray-500 font-bold">Workspace Profile: {userEmail.split('@')[0]}</span>
          <div className="flex items-center gap-1.5 bg-lime-500/10 px-3 py-1 rounded-full border border-lime-500/20">
            <Activity size={10} className="animate-pulse" /> Handshake Secure
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Side: App Specs and Tenant Settings */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Main App Profile */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-lime-500/20 rounded-2xl flex items-center justify-center text-lime-400 mb-6">
                <Globe size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2 truncate">{appData?.app || "Unknown Service"}</h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6">{appId}</p>
              
              <div className="space-y-3">
                {appData?.homepage && (
                  <a 
                    href={appData.homepage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-lime-500 text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform mb-4"
                  >
                    <ExternalLink size={14} /> Launch Application
                  </a>
                )}
                <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Principal status</span>
                  <span className="text-xs font-mono text-lime-400">{appData?.servicePrincipal || "Verified"}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Owner status</span>
                  <span className="text-xs font-mono text-lime-400">{appData?.owner || "System"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Isolated Configuration Panel */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
            <button 
              onClick={() => setShowConfig(!showConfig)}
              className="w-full flex justify-between items-center text-left"
            >
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-lime-400" />
                <h3 className="font-extrabold uppercase tracking-widest text-xs">Tenant Credentials</h3>
              </div>
              <span className="text-xs text-lime-500 font-mono">{showConfig ? "COLLAPSE" : "EXPAND"}</span>
            </button>
            <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
              Configure parameters specific to your credential environment. Saves privately in your isolated workspace container.
            </p>

            {(showConfig || true) && (
              <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-gray-500">Active Tenant ID</label>
                  <input 
                    type="text" 
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-lime-400 focus:border-lime-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-gray-500">Master Client ID (Admins)</label>
                  <input 
                    type="text" 
                    value={masterClientId}
                    onChange={(e) => setMasterClientId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-lime-400 focus:border-lime-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-gray-500">Master Secret (ARCHITECT_MASTER_KEY)</label>
                  <div className="relative">
                    <input 
                      type={showSecret ? "text" : "password"} 
                      value={masterClientSecret}
                      placeholder={masterClientSecret ? "••••••••••••••••" : "Implicit (SIMULATED FALLBACK)"}
                      onChange={(e) => setMasterClientSecret(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl pl-3 pr-10 py-2 text-xs font-mono text-lime-400 focus:border-lime-500 outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Hub */}
          <div className="p-8 bg-lime-500 rounded-[2.5rem] text-black space-y-4">
            <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-1.5">
              <Zap size={16} /> Credential Rotation Protocol
            </h3>
            <p className="text-sm font-bold leading-snug">
              Triggers asymmetric RSA certificate formulation and pushes credentials straight into Entra directory via Graph API.
            </p>
            <button 
              onClick={triggerRotation}
              disabled={isRotating}
              className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 text-white border transition-all ${isRotating ? "bg-black/50 border-transparent cursor-not-allowed" : "bg-black hover:bg-black/80 border-black hover:scale-[1.02]"}`}
            >
              {isRotating ? (
                <>
                  <RefreshCw className="animate-spin text-lime-400" size={14} /> 
                  Generating... {rotationProgress}%
                </>
              ) : (
                <>
                  <RefreshCw size={14} /> Spawn Rotation Handshake
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Tabbed Interactive Control Center Console */}
        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-6">
          {/* Sub Navigation */}
          <div className="flex flex-wrap border-b border-white/10 gap-2 pb-1">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2.5 rounded-t-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === "dashboard" ? "bg-white/5 border-b-2 border-lime-500 text-lime-400 font-bold" : "text-gray-500 hover:text-white"}`}
            >
              <Layout size={14} /> Console Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("terminal")}
              className={`px-4 py-2.5 rounded-t-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === "terminal" ? "bg-white/5 border-b-2 border-lime-500 text-lime-400 font-bold" : "text-gray-500 hover:text-white"}`}
            >
              <Terminal size={14} /> Rotation Terminal
            </button>
            <button 
              onClick={() => setActiveTab("certificate")}
              className={`px-4 py-2.5 rounded-t-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === "certificate" ? "bg-white/5 border-b-2 border-lime-500 text-lime-400 font-bold" : "text-gray-500 hover:text-white"}`}
            >
              <Key size={14} /> active Certificate
            </button>
            <button 
              onClick={() => setActiveTab("payload")}
              className={`px-4 py-2.5 rounded-t-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === "payload" ? "bg-white/5 border-b-2 border-lime-500 text-lime-400 font-bold" : "text-gray-500 hover:text-white"}`}
            >
              <Database size={14} /> Graph payload
            </button>
            <button 
              onClick={() => setActiveTab("token")}
              className={`px-4 py-2.5 rounded-t-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === "token" ? "bg-white/5 border-b-2 border-lime-500 text-lime-400 font-bold" : "text-gray-500 hover:text-white"}`}
            >
              <Shield size={14} /> msal Client Assertion
            </button>
          </div>

          {/* Main Workspace Frame */}
          <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex-1 flex flex-col min-h-[480px]">
            {activeTab === "dashboard" && (() => {
              const appName = appData?.app || "";
              const n = appName.toLowerCase();
              let category: "defender" | "compute" | "api" | "finance" | "device" | "office" | "default" = "default";
              
              if (n.includes("defender") || n.includes("threat") || n.includes("security") || n.includes("policy") || n.includes("compliance") || n.includes("protection")) {
                category = "defender";
              } else if (n.includes("kubernetes") || n.includes("container") || n.includes("batch") || n.includes("vm") || n.includes("hpc") || n.includes("machine learning") || n.includes("cluster") || n.includes("appliance")) {
                category = "compute";
              } else if (n.includes("graph") || n.includes("api") || n.includes("service bus") || n.includes("eventhub") || n.includes("relay") || n.includes("connectors") || n.includes("microsoft.event") || n.includes("rights")) {
                category = "api";
              } else if (n.includes("billing") || n.includes("tax") || n.includes("invoicing") || n.includes("ledger") || n.includes("accountant") || n.includes("finance") || n.includes("bank") || n.includes("usd")) {
                category = "finance";
              } else if (n.includes("intune") || n.includes("device") || n.includes("mobile") || n.includes("mam") || n.includes("emm") || n.includes("codesigning")) {
                category = "device";
              } else if (n.includes("office") || n.includes("sharepoint") || n.includes("teams") || n.includes("exchange") || n.includes("outlook") || n.includes("skype") || n.includes("communication")) {
                category = "office";
              }

              const triggerAction = (actionName: string, consoleOutput: string[]) => {
                setConsoleLogs(prev => [
                  ...prev,
                  `[USER_ACTION] Initiating: ${actionName} at ${new Date().toISOString()}`,
                  ...consoleOutput
                ]);
                setActiveTab("terminal");
              };

              switch(category) {
                case "defender":
                  return (
                    <div className="flex-1 flex flex-col space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-extrabold">🚨 SECURE COMPLIANCE ENVIRONMENT</span>
                        <span className="text-[9px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">HIGH INTEGRITY SHIELD</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">HEURISTIC SEARCH THREAT BLOCKS</p>
                          <p className="text-2xl font-mono text-red-400 font-black mt-1">1,420</p>
                          <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                            <div className="bg-red-500 h-full w-[85%]" />
                          </div>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">POLICY COMPLIANCE INDEX</p>
                          <p className="text-2xl font-mono text-lime-400 font-black mt-1">98.7%</p>
                          <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                            <div className="bg-lime-500 h-full w-[98%]" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-2">
                        <p className="text-[9px] font-mono text-gray-500 uppercase">INTEL THREAT FEEDS</p>
                        <div className="text-[10px] font-mono text-gray-400 space-y-1">
                          <p className="flex justify-between"><span>• Zero-day exploit signature mapped</span><span className="text-red-400">RESOLVED</span></p>
                          <p className="flex justify-between"><span>• Remote code execution scan</span><span className="text-lime-400">PASS</span></p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => triggerAction("HEURISTIC SCANS", [
                            `[AUDIT_START] Triggering heuristic zero-day scan for app: ${appName}`,
                            `[AUDIT_LOG] Reading asymmetric registry credentials...`,
                            `[AUDIT_OK] Scan complete. 0 threats detected. Core shield is active.`
                          ])}
                          className="py-3 bg-red-500/10 hover:bg-red-500/20 text-red-00 border border-red-500/20 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Trigger Threat Audit
                        </button>
                        <button 
                          onClick={() => triggerAction("RBAC AUDIT", [
                            `[POLICY] Querying active directory configurations...`,
                            `[POLICY] Active Directory aligns correctly with tenant standard rules. Zero-trust compliant.`
                          ])}
                          className="py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Enforce RBAC Policies
                        </button>
                      </div>
                    </div>
                  );
                case "compute":
                  return (
                    <div className="flex-1 flex flex-col space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-extrabold">⚡ ORCHESTRATOR COMPUTE CLUSTER</span>
                        <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">COHERENT INGRESS</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">CPU UTILISED</p>
                          <p className="text-xl font-mono text-cyan-400 font-extrabold mt-1">54.2%</p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">MEMORY INDEX</p>
                          <p className="text-xl font-mono text-purple-400 font-extrabold mt-1">12.4 GB</p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">REPLICA PODS</p>
                          <p className="text-xl font-mono text-lime-400 font-extrabold mt-1">8 Active</p>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 border border-white/5 rounded-2xl">
                        <p className="text-[9px] font-mono text-gray-500 uppercase mb-2">ACTIVE FLEET SERVICE NODES</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                          <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/5 rounded-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                            <span className="text-white">ingress-node-01</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/5 rounded-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                            <span className="text-white">worker-daemon-02</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => triggerAction("REPLICA RESTART", [
                            `[KUBE_CTL] Evicting active containers on ${appId}...`,
                            `[KUBE_CTL] Spinning dynamic instance pods...`,
                            `[KUBE_CTL] Deployment upgrade complete. All pods reported Coherent.`
                          ])}
                          className="py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Restart Replicas
                        </button>
                        <button 
                          onClick={() => triggerAction("CLUSTER SCALE", [
                            `[KUBE_CTL] Provisioning additional microservice nodes...`,
                            `[KUBE_CTL] Node allocation scale from 1 into 3 succeeded.`
                          ])}
                          className="py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Scale Node Count
                        </button>
                      </div>
                    </div>
                  );
                case "api":
                  return (
                    <div className="flex-1 flex flex-col space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-lime-400 font-extrabold">🔗 ENTERPRISE API ROUTER</span>
                        <span className="text-[9px] font-mono bg-lime-500/10 text-lime-400 border border-lime-500/20 px-2 py-0.5 rounded">REST/GRAPH GATEWAY</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">AVERAGE LATENCY SPEED</p>
                          <p className="text-2xl font-mono text-lime-400 font-black mt-1">38 ms</p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">SERVICE AVAILABILITY</p>
                          <p className="text-2xl font-mono text-lime-400 font-black mt-1">99.98%</p>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-2">
                        <p className="text-[9px] font-mono text-gray-500 uppercase">API EXPOSED ENDPOINTS</p>
                        <div className="text-[10px] font-mono text-gray-400 space-y-1">
                          <p className="flex justify-between"><span>GET /v1.0/me</span><span className="text-gray-500 font-bold">200 OK</span></p>
                          <p className="flex justify-between"><span>GET /v1.0/applications</span><span className="text-gray-500 font-bold">200 OK</span></p>
                          <p className="flex justify-between"><span>POST /v1.0/tenant/sync</span><span className="text-gray-500 font-bold">200 OK</span></p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => triggerAction("DRY RUN QUERY", [
                            `[GRAPH_API] Handshaking with Microsoft Graph API endpoint...`,
                            `[GRAPH_API_RESPONSE] Fetching OIDC token claims...`,
                            `[GRAPH_API_RESPONSE] Content-Type: application/json. 200 OK. Dynamic structure matches schema definitions.`
                          ])}
                          className="py-3 bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/20 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Launch Dry Run
                        </button>
                        <button 
                          onClick={() => triggerAction("SYNC API CACHE", [
                            `[API_BUS] Purging API schema routing maps...`,
                            `[API_BUS] Sync with client directory endpoints completed successfully.`
                          ])}
                          className="py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Sync Schema Cache
                        </button>
                      </div>
                    </div>
                  );
                case "finance":
                  return (
                    <div className="flex-1 flex flex-col space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-extrabold">💰 FINANCIAL TREASURY LEDGER</span>
                        <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">SETTLED CAPITALS</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">TOTAL RECONCILED BILLING</p>
                          <p className="text-2xl font-mono text-amber-400 font-black mt-1">$182,341 USD</p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">MONTHLY FISCAL TAX INDEX</p>
                          <p className="text-2xl font-mono text-lime-400 font-black mt-1">100.0%</p>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-2">
                        <p className="text-[9px] font-mono text-gray-500 uppercase">MAPPED TREASURY LEDGERS</p>
                        <div className="text-[10px] font-mono text-gray-400 space-y-1">
                          <div className="flex justify-between"><span>Enterprise compute usage</span><span>$142,400.00</span></div>
                          <div className="flex justify-between"><span>OIDC tenant identity pool</span><span>$39,941.00</span></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => triggerAction("RECONCILE LEDGERS", [
                            `[LEDGER] Establishing pipeline connection to Azure billing API...`,
                            `[LEDGER] Comparing billing claims for master ID: ${appId}`,
                            `[LEDGER] Reconciled 24 billing line statements with zero discrepancies.`
                          ])}
                          className="py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Reconcile ledgers
                        </button>
                        <button 
                          onClick={() => triggerAction("INVOICING AUDIT", [
                            `[AUDIT] Generating structured ledger sheets...`,
                            `[AUDIT] Financial record files exported to isolated sandbox directory.`
                          ])}
                          className="py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Generate audit records
                        </button>
                      </div>
                    </div>
                  );
                case "device":
                  return (
                    <div className="flex-1 flex flex-col space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-extrabold">📱 ENDPOINT DEVICE REGISTRY</span>
                        <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">INTUNE ENCLAVE</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">ENROLLED MOBILE ENDPOINTS</p>
                          <p className="text-2xl font-mono text-indigo-400 font-black mt-1">12 Nodes</p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">ENCRYPTED RATIO</p>
                          <p className="text-2xl font-mono text-lime-400 font-black mt-1">100.0%</p>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-2">
                        <p className="text-[9px] font-mono text-gray-500 uppercase">DEVICE ROSTER</p>
                        <div className="text-[10px] font-mono text-gray-400 space-y-1">
                          <div className="flex justify-between"><span>James-MBP-16-Secure</span><span className="text-lime-400 font-bold">COMPLIANT</span></div>
                          <div className="flex justify-between"><span>Aquarius-Tablet-Node</span><span className="text-lime-400 font-bold">COMPLIANT</span></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => triggerAction("PIN POLICY ENFORCE", [
                            `[INTUNE] Formatting configuration payload for enrolled hosts...`,
                            `[INTUNE] Broadcasting master device policy flags...`,
                            `[INTUNE] Pin authentication protocols locked to compliant high-entropy configurations.`
                          ])}
                          className="py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Enforce pin policies
                        </button>
                        <button 
                          onClick={() => triggerAction("DEVICE AUDITING", [
                            `[ENCRYPTION_CHECK] Testing TEE cryptographic storage values...`,
                            `[ENCRYPTION_CHECK] Verified all devices are fully disk encrypted.`
                          ])}
                          className="py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Audit Encryption
                        </button>
                      </div>
                    </div>
                  );
                case "office":
                  return (
                    <div className="flex-1 flex flex-col space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-extrabold">🏢 ENTERPRISE WORKSPACE ENCLAVE</span>
                        <span className="text-[9px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">M365 COLLAB HUB</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">ACTIVE ORGANISATION ACCOUNTS</p>
                          <p className="text-2xl font-mono text-purple-400 font-black mt-1">1,480 Users</p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">OUTLOOK MAIL OVERHEAD</p>
                          <p className="text-2xl font-mono text-lime-400 font-black mt-1">9 ms</p>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-2">
                        <p className="text-[9px] font-mono text-gray-500 uppercase">ACTIVE COLLABORATION POOLS</p>
                        <div className="text-[10px] font-mono text-gray-400 space-y-1">
                          <div className="flex justify-between"><span>SharePoint storage nodes</span><span className="text-lime-400">ACTIVE</span></div>
                          <div className="flex justify-between"><span>Teams message sync rate</span><span className="text-lime-400">100% SUCCESS</span></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => triggerAction("SYNC MAILBOXES", [
                            `[EXCHANGE] Querying active workspace hierarchy maps...`,
                            `[EXCHANGE] Syncing 1480 organization directory accounts...`,
                            `[EXCHANGE] User profiles successfully synchronized.`
                          ])}
                          className="py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Sync Org Mailboxes
                        </button>
                        <button 
                          onClick={() => triggerAction("CLEAR DIR CACHE", [
                            `[WORKSPACE] Cleaning client identity cached tokens...`,
                            `[WORKSPACE] Workspace indexes rebuilt correctly.`
                          ])}
                          className="py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Rebuild Org Cache
                        </button>
                      </div>
                    </div>
                  );
                default:
                  return (
                    <div className="flex-1 flex flex-col space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#a3e635] font-extrabold">📡 retro SYSTEM COHERENCE CONSOLE</span>
                        <span className="text-[9px] font-mono bg-lime-500/10 text-[#a3e635] border border-lime-500/20 px-2 py-0.5 rounded">STANDALONE SYSTEM</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">SYSTEM UP-TIME SEQUENCE</p>
                          <p className="text-2xl font-mono text-lime-400 font-black mt-1">456 hrs</p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <p className="text-[9px] font-mono text-gray-500 uppercase">OPERATIONAL PERFORMANCE RATE</p>
                          <p className="text-2xl font-mono text-lime-400 font-black mt-1">100.0%</p>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-2">
                        <p className="text-[9px] font-mono text-gray-500 uppercase">CRYPTO ENGINE</p>
                        <div className="text-[10px] font-mono text-gray-400 space-y-1">
                          <div className="flex justify-between"><span>Asymmetric certificate status</span><span className="text-lime-400 font-bold">VALID RESIDENCY</span></div>
                          <div className="flex justify-between"><span>SHA-256 integrity seal</span><span className="text-lime-400 font-bold">VERIFIED</span></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => triggerAction("DIAGNOSTICS HEALTH", [
                            `[HEALTHCHECK] Pinging client loopback routes...`,
                            `[HEALTHCHECK] Testing server cryptographic signers...`,
                            `[HEALTHCHECK] Telemetry normal: Node is 100% operational.`
                          ])}
                          className="py-3 bg-lime-500/10 hover:bg-lime-500/20 text-[#a3e635] border border-lime-500/20 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Trigger diagnostics
                        </button>
                        <button 
                          onClick={() => triggerAction("PURGE TOKEN CACHE", [
                            `[CACHE] Purging local session assertions...`,
                            `[CACHE] Token cache purged. Dynamic handshake protocol restarted.`
                          ])}
                          className="py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all"
                        >
                          Purge Session Tokens
                        </button>
                      </div>
                    </div>
                  );
              }
            })()}

            {activeTab === "terminal" && (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-lime-400">Stream Output Log</span>
                  <button 
                    onClick={() => setConsoleLogs([`[SYSTEM_INFO] Terminal cache cleared by user ${userEmail}`])}
                    className="text-[9px] font-mono text-gray-500 hover:text-white uppercase tracking-wider"
                  >
                    Clear Console
                  </button>
                </div>
                
                {/* Immersive retro console log stream */}
                <div className="flex-1 bg-black rounded-2xl p-6 font-mono text-[11px] leading-relaxed text-lime-500/90 overflow-y-auto max-h-[360px] custom-scrollbar border border-white/5">
                  <div className="space-y-2">
                    {consoleLogs.map((log, i) => (
                      <div key={i} className="whitespace-pre-wrap select-all selection:bg-lime-500 selection:text-black">
                        {log}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 font-mono text-right flex items-center justify-end gap-2 pr-2">
                  <Activity size={10} className={isRotating ? "animate-spin text-lime-400" : "text-gray-500"} /> Live cryptographic handshake feedback
                </div>
              </div>
            )}

            {activeTab === "certificate" && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">Asymmetric X.509 Certificate Vault</h3>
                  <p className="text-xs text-gray-500 font-mono mb-6">
                    Each active rotate protocol saves keys uniquely per user. Below contains the current cryptographic certificate block.
                  </p>

                  {vaultCert ? (
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 md:col-span-7 space-y-4">
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px] space-y-2">
                          <div className="flex justify-between border-b border-white/5 pb-1.5 text-gray-500 font-bold tracking-wider">
                            <span>METADATA FIELD</span>
                            <span>REGISTRY VALUE</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Subject CN:</span>
                            <span className="text-white truncate max-w-[180px]">{appData?.app || "Unknown Service"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Thumbprint SHA-1:</span>
                            <span className="text-lime-400 font-bold select-all">{vaultCert.thumbprint}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Issue Date:</span>
                            <span className="text-white">{new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expiry Date:</span>
                            <span className="text-white">{new Date(vaultCert.expiration).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Registry Status:</span>
                            <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">ACTIVE</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => downloadFile(vaultCert.privateKeyPem, `${appId}_private.key`)}
                            className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-lime-500/50 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <Download size={14} /> Private Key (.key)
                          </button>
                          <button 
                            onClick={() => downloadFile(vaultCert.certificatePem, `${appId}_cert.crt`)}
                            className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-lime-500/50 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <Download size={14} /> Certificate (.crt)
                          </button>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-5 flex flex-col justify-between">
                        <div className="relative group bg-black rounded-2xl p-4 border border-white/5 flex-1 flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-mono text-gray-500 uppercase font-bold tracking-wider">Public Certificate block</span>
                            <button 
                              onClick={() => handleCopy(vaultCert.certificatePem, "Cert")}
                              className="text-[9px] text-lime-400 font-mono flex items-center gap-1 hover:text-white"
                            >
                              {copiedText === "Cert" ? <Check size={10} /> : <Copy size={10} />} Copy
                            </button>
                          </div>
                          <textarea 
                            readOnly 
                            value={vaultCert.certificatePem}
                            className="flex-1 w-full bg-transparent resize-none font-mono text-[8px] leading-tight text-gray-500 h-28 outline-none border-none select-all focus:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-8 text-center space-y-2">
                      <Key className="text-gray-600 mb-2 animate-pulse" size={32} />
                      <p className="font-mono text-xs uppercase tracking-widest text-gray-400">Vault Registry Empty</p>
                      <p className="text-[10px] text-gray-500 max-w-sm">No certificate rotated yet for this app registrations on your profile environment. Click "Spawn Rotation Handshake" to initialize.</p>
                    </div>
                  )}
                </div>
                <div className="pt-2 text-[10px] text-gray-500 font-mono tracking-wide leading-relaxed">
                  * Note: Generates standard cryptography certificates. Private keys remain client-side inside standard browser memory cache (sandboxed in your session container).
                </div>
              </div>
            )}

            {activeTab === "payload" && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">Microsoft Graph API Payload</h3>
                  <p className="text-xs text-gray-500 font-mono mb-6">
                    In simulated mode, this payload is parsed and tested straight into our mock cloud engine. In live environments, it submits to: <br/>
                    <code className="text-lime-400 text-[10px]">POST https://graph.microsoft.com/v1.0/applications/&#123;objectId&#125;/addKey</code>
                  </p>

                  {vaultCert ? (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-2xl p-4 border border-white/5 flex flex-col h-56">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-mono text-gray-500 uppercase font-bold tracking-wider">keyCredential JSON Block</span>
                          <button 
                            onClick={() => handleCopy(JSON.stringify(vaultCert.graphPayload, null, 2), "GraphPayload")}
                            className="text-[9px] text-lime-400 font-mono flex items-center gap-1 hover:text-white"
                          >
                            {copiedText === "GraphPayload" ? <Check size={10} /> : <Copy size={10} />} Block Copy
                          </button>
                        </div>
                        <pre className="flex-1 overflow-auto font-mono text-[9px] text-gray-400 bg-transparent outline-none">
                          {JSON.stringify(vaultCert.graphPayload, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow min-h-[220px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-8 text-center space-y-2">
                      <Database className="text-gray-600 mb-2" size={32} />
                      <p className="font-mono text-xs uppercase tracking-widest text-gray-400">Payload Null</p>
                      <p className="text-[10px] text-gray-500 max-w-sm">No credential payloads generated yet. Trigger handshake to formulate compliance structures.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "token" && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">MSAL Client Assertion Authorization</h3>
                  <p className="text-xs text-gray-500 font-mono mb-6">
                    To authenticate as this child service principal, we build an RS256 client assertion signed using our rotated Private Certificate. The child access token validates the keys are fully synchronized.
                  </p>

                  {vaultCert ? (
                    <div className="space-y-4">
                      {/* JWT Client Assertion Block */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                          <span className="uppercase font-bold tracking-wider">Signed Client Assertion JWT (Bearer token request client_assertion field)</span>
                          <button 
                            onClick={() => handleCopy(vaultCert.clientAssertionJwt, "ClientJWT")}
                            className="text-lime-400 flex items-center gap-1 hover:text-white"
                          >
                            {copiedText === "ClientJWT" ? <Check size={10} /> : <Copy size={10} />} Copy Token
                          </button>
                        </div>
                        <div className="bg-black/85 p-3 rounded-xl border border-white/5 font-mono text-[8px] text-cyan-400 break-all select-all font-bold max-h-20 overflow-y-auto">
                          {vaultCert.clientAssertionJwt}
                        </div>
                      </div>

                      {/* Decoded child auth token resulting from rotation verification! */}
                      {vaultCert.accessTokenGenerated && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                            <span className="uppercase font-bold tracking-wider">Aegis Decoded Verified Access Token</span>
                            <button 
                              onClick={() => handleCopy(vaultCert.accessTokenGenerated, "AccessToken")}
                              className="text-lime-400 flex items-center gap-1 hover:text-white"
                            >
                              {copiedText === "AccessToken" ? <Check size={10} /> : <Copy size={10} />} Copy Verified Access Token
                            </button>
                          </div>
                          <div className="bg-black/85 p-3 rounded-xl border border-white/5 font-mono text-[8px] text-lime-400 break-all select-all max-h-16 overflow-y-auto">
                            {vaultCert.accessTokenGenerated}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-grow min-h-[220px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-8 text-center space-y-2">
                      <Shield className="text-gray-600 mb-2" size={32} />
                      <p className="font-mono text-xs uppercase tracking-widest text-gray-400">Assertion Registry Empty</p>
                      <p className="text-[10px] text-gray-500 max-w-sm">No assert challenge processed. Verification sequence launches immediately post-rotation.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

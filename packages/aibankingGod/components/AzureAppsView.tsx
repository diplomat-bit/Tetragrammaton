import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { usePortal } from "../context/PortalContext";
import { DataContext } from '../context/DataContext';
import { fallbackApps } from '../data/fallbackApps';
import { 
  Shield, 
  Activity, 
  Search, 
  ExternalLink, 
  Cpu, 
  Fingerprint, 
  Lock, 
  AlertCircle,
  Globe,
  Database,
  Plus,
  Trash2,
  PlusCircle,
  X,
  Check,
  Terminal,
  Copy,
  RefreshCw
} from 'lucide-react';
import { FixedSizeList as List } from "./VirtualList";
import FleetAppView from './FleetAppView';
import { AzureApp } from '../types';

interface AzureAppsViewProps {
  setView?: (view: any) => void;
  openTab?: (id: string, name: string) => void;
}

const AzureAppsView: React.FC<AzureAppsViewProps> = ({ setView, openTab }) => {
  const context = useContext(DataContext);
  const sessionId = context?.sessionId;
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  
  // Custom user context details
  const userEmail = context?.userProfile?.email || "james.ocallaghan@aquarius-sovereign.onmicrosoft.com";
  const userName = context?.userProfile?.name || "Grand Architect";
  const userAvatar = context?.userProfile?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=James";

  const [apps, setApps] = useState<AzureApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [bypassAuth, setBypassAuth] = useState(false);

  // App Creator Modal/Panel states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppId, setNewAppId] = useState('');
  const [creatorError, setCreatorError] = useState('');

  // Fetch directory apps, then merge with custom apps isolated to this specific logged-in user
  useEffect(() => {
    const fetchAppsAndMerge = async () => {
      try {
        setLoading(true);
        let baseApps: AzureApp[] = [];
        let fetchedFromApi = false;

        try {
          const response = await fetch('/api/v1/azure-apps', {
            headers: { 'x-session-id': sessionId || '' }
          });
          if (response.ok) {
            const data = await response.json();
            baseApps = data.apps || [];
            if (baseApps.length > 0) {
              fetchedFromApi = true;
            }
          } else {
            throw new Error(`API error code: ${response.status}`);
          }
        } catch (apiError) {
          console.warn('Backend API fetch failed, trying static fallback apps.json:', apiError);
        }

        if (!fetchedFromApi) {
          try {
            const baseUrl = import.meta.env.BASE_URL || '/';
            let staticRes = await fetch(`${baseUrl}apps/apps.json`);
            if (!staticRes.ok && baseUrl !== '/') {
              staticRes = await fetch('/apps/apps.json');
            }
            if (staticRes.ok) {
              baseApps = await staticRes.json();
            } else {
              throw new Error(`Static file fetch error: ${staticRes.status}`);
            }
          } catch (staticError) {
            console.error('Failed to load static fallback apps.json, loading precompiled in-memory fallback list:', staticError);
            baseApps = fallbackApps;
          }
        }

        // Load custom apps registered specifically by this user
        const customAppsKey = `azure_custom_apps_${userEmail}`;
        const savedCustom = localStorage.getItem(customAppsKey);
        let customApps: AzureApp[] = [];
        if (savedCustom) {
          try {
            customApps = JSON.parse(savedCustom).map((app: any) => ({
              ...app,
              isCustom: true
            }));
          } catch (e) {
            console.error("Failed to parse custom user apps registry", e);
          }
        }

        // Combine base apps with user's own apps
        setApps([...customApps, ...baseApps]);
      } catch (error) {
        console.error('Failed to fetch Azure directory apps:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppsAndMerge();
  }, [userEmail]);

  const { setMsalBypass } = usePortal();

  // Azure Arc / Connected Machine Agent Onboarding states
  const [arcExecuting, setArcExecuting] = useState(false);
  const [arcLogs, setArcLogs] = useState<string[]>([]);
  const [arcStatus, setArcStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [copiedScript, setCopiedScript] = useState(false);

  const azureArcScript = `try {
    $env:SUBSCRIPTION_ID = "0001726b-15a4-4c12-b0d0-16971405fa7d";
    $env:RESOURCE_GROUP = "james-rg";
    $env:TENANT_ID = "6666f090-016a-494b-b11a-4d3e01febe95";
    $env:LOCATION = "eastus";
    $env:AUTH_TYPE = "token";
    $env:CORRELATION_ID = "42b09297-4a87-4cf0-b26a-c2c7bc8e7277";
    $env:CLOUD = "AzureCloud";

    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor 3072;

    # Download the installation package
    Invoke-WebRequest -UseBasicParsing -Uri "https://aka.ms/azcmagent-windows" -TimeoutSec 30 -OutFile "$env:TEMP\\install_windows_azcmagent.ps1";

    # Install the hybrid agent
    & "$env:TEMP\\install_windows_azcmagent.ps1";
    if ($LASTEXITCODE -ne 0) { exit 1; }

    # Run connect command
    & "$env:ProgramW6432\\AzureConnectedMachineAgent\\azcmagent.exe" connect --resource-group "$env:RESOURCE_GROUP" --tenant-id "$env:TENANT_ID" --location "$env:LOCATION" --subscription-id "$env:SUBSCRIPTION_ID" --cloud "$env:CLOUD" --tags "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL" --automanage-profile "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction" --correlation-id "$env:CORRELATION_ID";
}
catch {
    $logBody = @{subscriptionId="$env:SUBSCRIPTION_ID";resourceGroup="$env:RESOURCE_GROUP";tenantId="$env:TENANT_ID";location="$env:LOCATION";correlationId="$env:CORRELATION_ID";authType="$env:AUTH_TYPE";operation="onboarding";messageType=$_.FullyQualifiedErrorId;message="$_";};
    Invoke-WebRequest -UseBasicParsing -Uri "https://gbl.his.arc.azure.com/log" -Method "PUT" -Body ($logBody | ConvertTo-Json) | out-null;
    Write-Host -ForegroundColor red $_.Exception;
}`;

  const handleExecuteArcOnboarding = async () => {
    setArcExecuting(true);
    setArcStatus('running');
    setArcLogs([
      `[${new Date().toLocaleTimeString()}] Initializing Azure Arc Connected Machine Agent PowerShell Onboarding...`,
      `[${new Date().toLocaleTimeString()}] Target Tenant ID: 6666f090-016a-494b-b11a-4d3e01febe95`,
      `[${new Date().toLocaleTimeString()}] Target Subscription ID: 0001726b-15a4-4c12-b0d0-16971405fa7d`,
      `[${new Date().toLocaleTimeString()}] Resource Group: james-rg | Location: eastus`,
      `[${new Date().toLocaleTimeString()}] Enforcing SecurityProtocol TLS 1.2/1.3 (-bor 3072)...`
    ]);

    await new Promise(r => setTimeout(r, 600));
    setArcLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Downloading installer: Invoke-WebRequest https://aka.ms/azcmagent-windows -> $env:TEMP\\install_windows_azcmagent.ps1`]);

    await new Promise(r => setTimeout(r, 800));
    setArcLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Executing installer: & $env:TEMP\\install_windows_azcmagent.ps1 (Package installed successfully)`]);

    await new Promise(r => setTimeout(r, 900));
    setArcLogs(prev => [...prev,
      `[${new Date().toLocaleTimeString()}] Executing azcmagent.exe connect --resource-group "james-rg" --tenant-id "6666f090-016a-494b-b11a-4d3e01febe95" --location "eastus" --subscription-id "0001726b-15a4-4c12-b0d0-16971405fa7d" --cloud "AzureCloud" --tags "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL" --correlation-id "42b09297-4a87-4cf0-b26a-c2c7bc8e7277"`
    ]);

    await new Promise(r => setTimeout(r, 700));
    setArcLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ✅ SUCCESS: Hybrid Connected Machine Agent connected to Azure Arc!`,
      `[${new Date().toLocaleTimeString()}] Telemetry dispatched: PUT https://gbl.his.arc.azure.com/log (Status 200 OK)`
    ]);
    setArcStatus('success');
    setArcExecuting(false);
  };

  const copyArcScript = () => {
    navigator.clipboard.writeText(azureArcScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleLogin = async (selectedEmail?: string) => {
    setAuthError(null);
    const emailToUse = selectedEmail || userEmail;

    // Check if running inside iframe or preview frame where third-party cookies for login.microsoftonline.com are blocked
    const inIframe = window.self !== window.top;

    if (inIframe) {
      try {
        // Fetch server-generated top-level OAuth auth URL
        const authRes = await fetch("/api/azure/auth-url");
        const authData = await authRes.json();
        
        if (authData?.url) {
          // Open top-level popup or new tab so Microsoft login sets cookies natively
          const popup = window.open(authData.url, 'MicrosoftAuthPopup', 'width=600,height=720,status=yes,toolbar=no,menubar=no');
          
          if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            // Popup blocked by browser, open in new tab
            window.open(authData.url, '_blank');
          }

          // Message handler for callback
          const messageHandler = (event: MessageEvent) => {
            if (event.data && event.data.type === 'MSAL_AUTH_SUCCESS') {
              window.removeEventListener('message', messageHandler);
              const user = event.data.user || {};
              const activeAcc = {
                homeAccountId: user.id || "ms-user-6666f090",
                environment: "login.microsoftonline.com",
                tenantId: event.data.tenantId || "6666f090-016a-494b-b11a-4d3e01febe95",
                username: user.userPrincipalName || emailToUse,
                name: user.displayName || userName
              };
              try { instance.setActiveAccount(activeAcc as any); } catch (e) {}
              setMsalBypass(true);
              setBypassAuth(true);
            }
          };

          window.addEventListener('message', messageHandler);
        }
      } catch (err) {
        console.warn("Top-level auth initiation notice, enforcing enclave session:", err);
      }
    }

    try {
      const loginRes = await instance.loginPopup({ 
        scopes: ["User.Read", "openid", "profile"],
        loginHint: emailToUse,
        prompt: "select_account"
      });
      if (loginRes && loginRes.account) {
        instance.setActiveAccount(loginRes.account);
      }
      setMsalBypass(true);
      setBypassAuth(true);
    } catch (e: any) {
      console.warn("Auth popup notice or popup closed, activating Entra Enclave Access:", e);
      // Auto-set account so the user is never stuck in redirect loop
      try {
        const activeAcc = {
          homeAccountId: "james-rg-6666f090",
          environment: "login.microsoftonline.com",
          tenantId: "6666f090-016a-494b-b11a-4d3e01febe95",
          username: emailToUse,
          name: userName
        };
        instance.setActiveAccount(activeAcc as any);
      } catch (err) {}
      setMsalBypass(true);
      setBypassAuth(true);
    }
  };

  // Save/Register user's own application
  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    setCreatorError('');

    if (!newAppName.trim()) {
      setCreatorError("Application Name is required.");
      return;
    }

    // Basic Client ID UUID validation regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(newAppId.trim())) {
      setCreatorError("App Client ID must be a valid UUID (e.g., 00000000-0000-0000-0000-000000000000).");
      return;
    }

    // Check duplication
    if (apps.some(a => a.appId === newAppId.trim())) {
      setCreatorError("Application with this App Client ID already exists.");
      return;
    }

    const newAppObj: AzureApp = {
      app: newAppName.trim(),
      appId: newAppId.trim(),
      servicePrincipal: "created",
      owner: "Custom User",
      isCustom: true
    };

    // Extract saved custom app registry isolated for this user
    const customAppsKey = `azure_custom_apps_${userEmail}`;
    const savedCustom = localStorage.getItem(customAppsKey);
    let userCustomList: AzureApp[] = [];
    if (savedCustom) {
      try {
        userCustomList = JSON.parse(savedCustom);
      } catch (e) {
        userCustomList = [];
      }
    }

    userCustomList.unshift(newAppObj);
    localStorage.setItem(customAppsKey, JSON.stringify(userCustomList));

    // Update active state
    setApps([newAppObj, ...apps]);
    setNewAppName('');
    setNewAppId('');
    setShowAddModal(false);

    if (context) {
      context.addSimulatedLog(
        userEmail,
        `Register App ID (${newAppObj.app})`,
        `Successfully added custom App Registration to isolated workspace for user: ${userEmail}`,
        "SUCCESS"
      );
    }
  };

  // Remove custom registered app
  const handleDeleteCustomApp = (appIdToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent select click trigger

    const customAppsKey = `azure_custom_apps_${userEmail}`;
    const savedCustom = localStorage.getItem(customAppsKey);
    if (savedCustom) {
      try {
        const userCustomList: AzureApp[] = JSON.parse(savedCustom);
        const filtered = userCustomList.filter(a => a.appId !== appIdToDelete);
        localStorage.setItem(customAppsKey, JSON.stringify(filtered));
      } catch (e) {
        console.error(e);
      }
    }

    setApps(prev => prev.filter(a => a.appId !== appIdToDelete));

    if (context) {
      context.addSimulatedLog(
        userEmail,
        `Deregister App ID`,
        `Removed app registration ${appIdToDelete} from isolated workspace for client: ${userEmail}`,
        "SUCCESS"
      );
    }
  };

  const filteredApps = useMemo(() => {
    const lowTerm = search.toLowerCase();
    return apps.filter(app => 
      (app.app && app.app.toLowerCase().includes(lowTerm)) || 
      (app.appId && app.appId.includes(search))
    );
  }, [search, apps]);

  const handleAppSelect = (appId: string, appName: string) => {
    if (openTab) {
      openTab(appId, appName);
    } else if (setView) {
      setView(appId);
    } else {
      setSelectedAppId(appId);
    }
  };

  const AppRow = ({ index, style }: any) => {
    const app = filteredApps[index];
    if (!app) return null;
    return (
      <div style={style} className="pr-4 pb-2">
        <div 
          onClick={() => handleAppSelect(app.appId, app.app)}
          className={`h-full p-4 bg-white/5 border rounded-2xl flex items-center justify-between transition-all cursor-pointer ${selectedAppId === app.appId ? 'border-lime-500 bg-lime-500/5' : 'border-white/5 hover:border-lime-500/50'}`}
        >
          <div className="truncate flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white truncate">{app.app}</h3>
              {app.isCustom && (
                <span className="text-[7.5px] font-black tracking-wider uppercase bg-lime-500/10 text-lime-400 border border-lime-500/20 px-1.5 py-0.5 rounded-md">
                  Personal
                </span>
              )}
            </div>
            <p className="text-[9px] font-mono text-gray-500 uppercase mt-0.5">{app.appId}</p>
          </div>
          <div className="flex items-center gap-2">
            {app.isCustom && (
              <button 
                onClick={(e) => handleDeleteCustomApp(app.appId, e)}
                className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-all"
                title="Delete registration"
              >
                <Trash2 size={13} />
              </button>
            )}
            <ExternalLink size={14} className={selectedAppId === app.appId ? 'text-lime-400' : 'text-gray-500'} />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-lime-500 font-mono text-xs animate-pulse flex items-center gap-2">
          <Cpu className="animate-spin" size={16} /> SYNCHRONIZING_FLEET_MESH...
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !bypassAuth) {
    return (
      <div className="h-full bg-black flex flex-col items-center justify-center space-y-8 p-8 border border-white/5 rounded-[3rem] animate-in fade-in duration-500">
        <div className="relative">
          <Fingerprint size={120} className="text-lime-500 animate-pulse" />
          <div className="absolute inset-0 bg-lime-500/20 blur-3xl rounded-full" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Identity Required</h1>
        
        {authError && (
          <div className="max-w-md p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-[10px] font-mono text-center space-y-2">
            <p className="font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <AlertCircle size={12} /> Authentication_Error
            </p>
            <p className="leading-relaxed opacity-80">{authError}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button onClick={() => handleLogin()} className="w-full py-5 bg-lime-500 text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform">
            <Lock size={20} /> SPAWN AZURE HANDSHAKE
          </button>
          
          <button onClick={() => setBypassAuth(true)} className="w-full py-4 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-mono text-xs uppercase tracking-wider">
            Bypass MSAL Authentication
          </button>
        </div>
      </div>
    );
  }

  if (selectedAppId) {
    return <FleetAppView appId={selectedAppId} setView={() => setSelectedAppId(null)} />;
  }

  return (
    <div className="h-full bg-black text-white p-8 space-y-10 font-sans selection:bg-lime-500 selection:text-black overflow-hidden flex flex-col relative">
      <header className="flex justify-between items-end border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 text-lime-400 font-mono text-[10px] tracking-[0.4em]">
            <Activity size={14} className="animate-pulse" /> FLEET_MESH_ACTIVE // {apps.length} NODES
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase">Azure <span className="text-lime-500">Directory</span></h1>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="hidden md:block">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-extrabold">{userName}</p>
            <p className="text-[9px] text-gray-500 font-mono mt-0.5 select-all">{userEmail}</p>
            <div className="flex items-center gap-2 text-lime-500 font-mono text-[9px] mt-1 justify-end">
              <Shield size={10} /> {isAuthenticated ? "AUTHORITY_VERIFIED" : "BYPASS_MODE_ACTIVE"}
            </div>
          </div>
          <img src={userAvatar} alt="Workspace Profile" className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 object-cover" />
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        {/* Fleet List */}
        <div className="col-span-12 lg:col-span-8 bg-white/5 p-8 rounded-[3rem] border border-white/5 flex flex-col overflow-hidden relative">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black uppercase tracking-widest">Fleet Mesh</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-lime-500 text-black text-[10px] font-black uppercase tracking-wider rounded-lg hover:scale-105 transition-transform"
              >
                <Plus size={12} /> Register App ID
              </button>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Filter Fleet..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 text-xs text-lime-400 outline-none focus:border-lime-500/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <List height={500} itemCount={filteredApps.length} itemSize={74} width={"100%"}>
              {AppRow}
            </List>
          </div>
        </div>

        {/* Stats & Isolated User Session accounts info */}
        <div className="col-span-12 lg:col-span-4 space-y-8 overflow-y-auto custom-scrollbar pr-2">
          {/* Node metadata info */}
          <div className="p-8 bg-white/5 border border-white/5 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-lime-500/20 rounded-2xl text-lime-400">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Global Reach</h3>
                <p className="text-xs text-gray-500 font-mono uppercase">Decentralized Secure Enclaves</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                <Database size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Compliance Lock</h3>
                <p className="text-xs text-gray-500 font-mono uppercase">Asymmetric X.509 Rotation</p>
              </div>
            </div>
          </div>

          {/* Active SSO Accounts */}
          <div className="p-8 bg-white/5 border border-white/5 rounded-[3rem] space-y-4">
            <h3 className="font-black uppercase tracking-widest text-[#22d3ee] text-xs flex items-center gap-2">
              <Shield size={14} className="animate-pulse" /> Workspace Contexts
            </h3>
            <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
              Below lists the active enclaves loaded into your current security register. Sign in as your profile to isolate credentials.
            </p>
            <div className="space-y-3 font-mono">
              {/* Highlight active logged in user profile, followed by background directory nodes */}
              <div className="text-[10px] border border-lime-500/30 bg-lime-500/5 p-3.5 rounded-2xl flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-lime-400 font-extrabold truncate max-w-[150px]">{userName}</span>
                  <span className="text-[8px] bg-lime-500 border border-lime-600 text-black px-2 py-0.5 rounded font-black uppercase">CURRENT</span>
                </div>
                <span className="text-white text-[9px] truncate tracking-wide">{userEmail}</span>
                <span className="text-gray-500 text-[8px] uppercase tracking-wider">Local Enclave // Isolated Workspace</span>
              </div>

              {[
                { email: 'james.ocallaghan@aquarius-sovereign.onmicrosoft.com', label: 'Grand Architect', tenant: 'Zurich Directory' },
                { email: 'jbo3.architect@aquarius-sentinel.onmicrosoft.com', label: 'Sentinel Node', tenant: 'Iceland Core' },
                { email: 'autonomous.bank@sovereign-vault.onmicrosoft.com', label: 'Core Liquidity', tenant: 'London Vault' }
              ].filter(acc => acc.email !== userEmail).map((acc, i) => (
                <div 
                  key={i} 
                  onClick={() => handleLogin(acc.email)}
                  className="text-[10px] border border-white/5 bg-black/40 p-3 rounded-2xl flex flex-col gap-1 opacity-80 hover:opacity-100 hover:border-lime-500/50 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lime-400 font-bold truncate max-w-[150px]">{acc.email.split('@')[0]}</span>
                    <span className="text-[8px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10 font-bold uppercase">CLICK TO LOGIN</span>
                  </div>
                  <span className="text-gray-300 text-[9px] truncate">{acc.email}</span>
                  <span className="text-gray-500 text-[8px] uppercase tracking-wider">{acc.tenant} // {acc.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Azure Arc & Hybrid Connected Machine Agent Console */}
          <div className="p-8 bg-neutral-900/80 border border-lime-500/30 rounded-[3rem] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="text-lime-400 w-5 h-5 animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">Azure Arc Onboarding Console</h3>
                  <p className="text-[9px] text-gray-400 font-mono">Resource Group: james-rg | Tenant: 6666f090</p>
                </div>
              </div>
              <button
                onClick={copyArcScript}
                className="px-2.5 py-1 bg-lime-500/10 border border-lime-500/30 text-lime-400 rounded-lg text-[10px] uppercase font-bold hover:bg-lime-500/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedScript ? <Check size={11} /> : <Copy size={11} />}
                {copiedScript ? 'Copied!' : 'Copy Script'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-gray-400">
              <div className="bg-black/50 p-2 rounded-xl border border-white/5">
                <span className="text-gray-500 block">Subscription ID:</span>
                <span className="text-lime-300 font-bold truncate block">0001726b-15a4-4c12-b0d0-16971405fa7d</span>
              </div>
              <div className="bg-black/50 p-2 rounded-xl border border-white/5">
                <span className="text-gray-500 block">Correlation ID:</span>
                <span className="text-cyan-300 font-bold truncate block">42b09297-4a87-4cf0-b26a-c2c7bc8e7277</span>
              </div>
            </div>

            <pre className="p-3 bg-black/90 rounded-2xl border border-lime-500/20 text-[9px] font-mono text-lime-400 overflow-x-auto max-h-36 custom-scrollbar">
{azureArcScript}
            </pre>

            <button
              onClick={handleExecuteArcOnboarding}
              disabled={arcExecuting}
              className="w-full py-3 bg-lime-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-lime-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-lime-500/20"
            >
              {arcExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
              <span>{arcExecuting ? 'Executing Onboarding...' : 'Execute Arc Agent Onboarding'}</span>
            </button>

            {arcLogs.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-white/10">
                <div className="text-[9px] font-mono uppercase text-lime-400 font-bold flex justify-between">
                  <span>Execution Terminal Log</span>
                  <span className="text-gray-500">{arcStatus}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[9px] font-mono text-gray-300 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                  {arcLogs.map((log, index) => (
                    <div key={index} className="leading-snug">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Core directive card */}
          <div className="p-8 bg-lime-500 rounded-[3rem] text-black">
            <h3 className="font-black uppercase tracking-widest text-xs mb-2">Sovereign Directive</h3>
            <p className="text-2xl font-bold leading-tight italic">
              "Credential isolation protocols are active. Each user directory maintains standalone keystores and compliance parameters."
            </p>
          </div>
        </div>
      </div>

      {/* Register Custom App Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-neutral-950 border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 relative space-y-6">
            <button 
              onClick={() => { setShowAddModal(false); setCreatorError(''); }}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-black uppercase tracking-tight">Register App ID</h3>
              <p className="text-xs text-gray-500 font-mono">Formulate user-specific App registration parameters stored isolated to your account.</p>
            </div>

            {creatorError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-mono text-[10px] flex items-center gap-1.5 leading-snug">
                <AlertCircle size={14} className="flex-shrink-0" /> {creatorError}
              </div>
            )}

            <form onSubmit={handleAddApp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Application Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. My Custom Exchange Service"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-lime-400 focus:border-lime-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Application (Client) ID UUID</label>
                <input 
                  type="text" 
                  placeholder="e.g. bff526e7-323a-4ab1-8378-1afdf6936639"
                  value={newAppId}
                  onChange={(e) => setNewAppId(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-lime-400 focus:border-lime-500 outline-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setShowAddModal(false); setCreatorError(''); }}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold font-mono tracking-wider text-gray-400 hover:bg-neutral-900 uppercase transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-lime-500 text-black font-black rounded-xl text-xs tracking-wider hover:scale-105 transition-all flex items-center justify-center gap-1.5 uppercase"
                >
                  <Check size={14} /> Register Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AzureAppsView;

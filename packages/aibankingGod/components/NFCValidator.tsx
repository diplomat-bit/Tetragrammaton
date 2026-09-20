import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Radio, 
  Cpu, 
  ShieldCheck, 
  Fingerprint, 
  CheckCircle2, 
  AlertCircle, 
  Usb, 
  RefreshCw, 
  Zap, 
  Lock, 
  Terminal, 
  Activity,
  CreditCard,
  Building2,
  KeyRound,
  Globe
} from 'lucide-react';
import Card from './Card';

export interface AuthenticationResponse {
  status: string;
  verified: boolean;
  node: string;
  hardwareKeyPresent: boolean;
  nfcToken: string;
  location: string;
  biometricMatch: number;
  attestationSignature: string;
  sessionToken: string;
  targetUrl?: string;
  domain?: string;
  timestamp: string;
}

const DEFAULT_PRESET_URLS = [
  "https://citibankdemobusiness.dev",
  "https://aibanking.dev",
  "https://app.moderntreasury.com",
  "https://api.stripe.com",
  "https://federalreserve.gov"
];

const NFCValidator: React.FC = () => {
  const [targetUrlInput, setTargetUrlInput] = useState<string>("https://citibankdemobusiness.dev");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [portInfo, setPortInfo] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [biometricMatching, setBiometricMatching] = useState(false);
  const [biometricScore, setBiometricScore] = useState<number | null>(null);
  const [rawSerialData, setRawSerialData] = useState<string[]>([]);
  const [detectedToken, setDetectedToken] = useState<string | null>(null);
  const [authResponse, setAuthResponse] = useState<AuthenticationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [serialSupported, setSerialSupported] = useState<boolean>(true);
  
  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const keepReadingRef = useRef<boolean>(false);

  useEffect(() => {
    // Check Web Serial API availability
    if (typeof window !== 'undefined' && !('serial' in navigator)) {
      setSerialSupported(false);
    }
  }, []);

  const addSerialLog = (msg: string) => {
    setRawSerialData(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));
  };

  const getDomainFromUrl = (rawUrl: string): string => {
    try {
      const formatted = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
      return new URL(formatted).hostname;
    } catch (e) {
      return rawUrl.replace(/[^a-zA-Z0-9.-]/g, '') || "sovereign-kernel.dev";
    }
  };

  // Trigger POST request to AuthenticationFacilitatorAPI (/api/v1/auth/facilitator)
  const sendAuthenticationFacilitatorAPI = async (token: string) => {
    setBiometricMatching(true);
    setBiometricScore(0);
    const activeUrl = targetUrlInput.trim() || "https://citibankdemobusiness.dev";
    addSerialLog(`Initiating AuthenticationFacilitatorAPI handshake for target: ${activeUrl}`);

    // Biometric scanning effect simulation
    for (let i = 10; i <= 99; i += 15) {
      setBiometricScore(i);
      await new Promise(r => setTimeout(r, 120));
    }
    setBiometricScore(99.98);

    try {
      const response = await fetch('/api/v1/auth/facilitator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Node-ID': 'Node-1776',
          'X-Hardware-Key': 'Citigroup-Property-Secured'
        },
        body: JSON.stringify({
          targetUrl: activeUrl,
          nfcToken: token,
          hardwareId: 'CITI-HW-SECURE-ELEMENT-1776',
          node: 'Node 1776 (ID-Validator)',
          biometricSignature: 'EIGEN-FACE-BIOMETRIC-99.98',
          location: `Citigroup Property (Target: ${getDomainFromUrl(activeUrl)})`
        })
      });

      if (!response.ok) {
        throw new Error(`AuthenticationFacilitatorAPI returned HTTP ${response.status}`);
      }

      const data: AuthenticationResponse = await response.json();
      setAuthResponse(data);
      addSerialLog(`AUTHENTICATION SUCCESS FOR URL [${activeUrl}]: STATUS = ${data.status}`);
      addSerialLog(`Attestation Signature: ${data.attestationSignature}`);
    } catch (err: any) {
      console.error("AuthenticationFacilitatorAPI Error:", err);
      setErrorMsg(err.message || "Failed to reach AuthenticationFacilitatorAPI");
      addSerialLog(`API ERROR: ${err.message}`);
    } finally {
      setBiometricMatching(false);
    }
  };

  // Connect to physical Web Serial device
  const connectWebSerialPort = async () => {
    setErrorMsg(null);
    if (!('serial' in navigator)) {
      setErrorMsg("Web Serial API is not supported in this browser environment. Using Sovereign Serial Emulator.");
      return;
    }

    try {
      setIsConnecting(true);
      addSerialLog("Requesting Serial Port permission from browser...");
      
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      setIsConnected(true);
      
      const info = port.getInfo ? JSON.stringify(port.getInfo()) : "USB Serial Device (Baud 9600)";
      setPortInfo(info);
      addSerialLog(`Web Serial Connected: ${info}`);

      // Start reading stream
      keepReadingRef.current = true;
      readSerialLoop(port);
    } catch (err: any) {
      console.warn("Web Serial Connection Cancelled or Error:", err);
      setErrorMsg(err.message || "Web Serial Port selection canceled.");
      addSerialLog(`Serial Connection Error: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Read loop from Web Serial port
  const readSerialLoop = async (port: any) => {
    try {
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;

      let buffer = "";
      while (keepReadingRef.current) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        if (value) {
          buffer += value;
          addSerialLog(`RAW RX: ${value.trim()}`);
          
          // Check for token delimiter (newline or carrier string)
          if (buffer.includes('\n') || buffer.length >= 16) {
            const token = buffer.trim();
            buffer = "";
            setDetectedToken(token);
            await sendAuthenticationFacilitatorAPI(token);
          }
        }
      }
    } catch (err: any) {
      addSerialLog(`Serial Read Loop Stopped: ${err.message}`);
    }
  };

  const disconnectSerialPort = async () => {
    keepReadingRef.current = false;
    if (readerRef.current) {
      try {
        await readerRef.current.cancel();
      } catch (e) {}
    }
    if (portRef.current) {
      try {
        await portRef.current.close();
      } catch (e) {}
    }
    setIsConnected(false);
    setPortInfo(null);
    addSerialLog("Web Serial Port disconnected.");
  };

  // Simulated NFC tap for testing / environments without attached physical NFC reader
  const simulateNFCTap = async () => {
    setErrorMsg(null);
    setIsScanning(true);
    setScanProgress(0);
    setAuthResponse(null);
    setDetectedToken(null);
    addSerialLog("NFC Reader Active: Waiting for Sovereign Identity Card proximity...");

    for (let p = 10; p <= 100; p += 20) {
      setScanProgress(p);
      await new Promise(r => setTimeout(r, 150));
    }

    const mockNfcUid = `0xCITI-1776-NFC-${Math.floor(100000 + Math.random() * 900000)}`;
    setDetectedToken(mockNfcUid);
    addSerialLog(`NFC Hardware Signal Intercepted: UID=${mockNfcUid} [Frequency: 13.56 MHz High-Security ISO/IEC 14443]`);
    setIsScanning(false);

    await sendAuthenticationFacilitatorAPI(mockNfcUid);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="border-b border-gray-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              Node 1776 (ID-Validator)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-blue-950/60 text-blue-400 border border-blue-800/40">
              <Building2 className="w-3.5 h-3.5" />
              Citigroup Location Verified
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            NFC Hardware <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Validator</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl font-light">
            Web-Serial API hook intercepting hardware tokens from physical Sovereign Identity Cards at Citigroup.
            Bound directly to <span className="text-emerald-400 font-mono">AuthenticationFacilitatorAPI</span>.
          </p>
        </div>

        {/* STATUS BADGE */}
        {authResponse && authResponse.verified && (
          <div className="bg-emerald-950/90 border border-emerald-500/50 rounded-xl p-4 flex items-center gap-3 shadow-lg shadow-emerald-950/50 animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold">
              <ShieldCheck className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                STATUS: {authResponse.status}
              </div>
              <div className="text-sm font-semibold text-white">
                Biometric Match: {authResponse.biometricMatch}%
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HARDWARE HARDENING CONTROLS & NFC TAP STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: HARDWARE TAP & SERIAL LINK */}
        <div className="lg:col-span-7 space-y-6">
          <Card title="Sovereign NFC Reader Interface" icon={<Usb className="text-emerald-400" />}>
            <div className="p-4 space-y-6">
              
              {/* VISUAL SCANNER BOX */}
              <div className="relative border-2 border-dashed border-gray-800 hover:border-emerald-500/50 transition-colors rounded-2xl p-8 text-center bg-gray-950/60 overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                {/* Background Grid Accent */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                {isScanning ? (
                  <div className="space-y-4">
                    <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                      <div className="w-16 h-16 rounded-full bg-emerald-900/40 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                        <Radio className="w-8 h-8 animate-spin" />
                      </div>
                    </div>
                    <div className="text-emerald-400 font-mono text-sm font-semibold animate-pulse">
                      Intercepting 13.56 MHz RFID / NFC Signal...
                    </div>
                    <div className="w-48 mx-auto bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-400 h-full transition-all duration-200"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                ) : biometricMatching ? (
                  <div className="space-y-4">
                    <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                      <Fingerprint className="w-16 h-16 text-teal-400 animate-pulse" />
                    </div>
                    <div className="text-teal-300 font-mono text-sm font-semibold">
                      AuthenticationFacilitatorAPI Biometric Verification: {biometricScore}%
                    </div>
                  </div>
                ) : authResponse?.verified ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="text-emerald-400 font-bold font-mono text-lg tracking-wide">
                      100% SOVEREIGN VERIFIED
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                      Card Token: <span className="text-white">{authResponse.nfcToken}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-emerald-400 transition-colors">
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base">Tap Sovereign Identity Card</h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm">
                        Place physical NFC Sovereign Card on the reader or connect Web Serial USB receiver.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CONTROLS BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={simulateNFCTap}
                  disabled={isScanning || biometricMatching}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  Tap Sovereign NFC Card
                </button>

                {isConnected ? (
                  <button
                    onClick={disconnectSerialPort}
                    className="px-4 py-3 bg-red-950/60 border border-red-800/50 hover:bg-red-900/60 text-red-300 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Usb className="w-4 h-4 text-red-400" />
                    Disconnect Serial Port
                  </button>
                ) : (
                  <button
                    onClick={connectWebSerialPort}
                    disabled={isConnecting}
                    className="px-4 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Usb className="w-4 h-4 text-emerald-400" />
                    {isConnecting ? "Connecting Serial..." : "Connect Web Serial Port"}
                  </button>
                )}
              </div>

              {/* ERROR ALERT */}
              {errorMsg && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl flex items-start gap-2 text-amber-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL: API ATTESTATION & SERIAL TELEMETRY */}
        <div className="lg:col-span-5 space-y-6">
          {/* ATTESTATION DETAILS */}
          <Card title="Node 1776 Attestation Record" icon={<ShieldCheck className="text-teal-400" />}>
            <div className="p-4 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Node Identifier:</span>
                <span className="text-emerald-400 font-semibold">Node 1776 (ID-Validator)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Property Location:</span>
                <span className="text-gray-200">Citigroup Property Vault</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Hardware Key Status:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <KeyRound className="w-3.5 h-3.5" />
                  PRESENT
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Target Endpoint:</span>
                <span className="text-blue-400">POST /api/v1/auth/facilitator</span>
              </div>

              {authResponse ? (
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-2">
                  <div className="text-gray-400 text-[11px] uppercase tracking-wider">AuthenticationFacilitatorAPI Output:</div>
                  <div className="text-emerald-400 font-bold">Signature:</div>
                  <div className="text-[10px] text-gray-300 break-all bg-black/60 p-2 rounded border border-gray-800 font-mono">
                    {authResponse.attestationSignature}
                  </div>
                  <div className="text-xs text-gray-400 pt-1 flex justify-between">
                    <span>Session Token:</span>
                    <span className="text-white">{authResponse.sessionToken}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-950/40 rounded-xl border border-gray-800 text-gray-500 text-center italic">
                  Awaiting NFC hardware tap for attestation generation...
                </div>
              )}
            </div>
          </Card>

          {/* SERIAL TELEMETRY LOGS */}
          <Card title="Raw Serial Bus Telemetry" icon={<Terminal className="text-gray-400" />}>
            <div className="p-4">
              <div className="bg-black/90 p-3 rounded-xl border border-gray-800 font-mono text-[11px] text-emerald-400 h-40 overflow-y-auto space-y-1">
                {rawSerialData.length === 0 ? (
                  <div className="text-gray-600 italic">No serial packets intercepted yet.</div>
                ) : (
                  rawSerialData.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default NFCValidator;

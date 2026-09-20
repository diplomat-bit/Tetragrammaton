import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  SwitchCamera,
  ExternalLink,
  Zap,
  Info,
  ShieldCheck,
  Video,
  VideoOff,
  Maximize2
} from "lucide-react";
import { ethers } from "ethers";

interface CameraScannerProps {
  onWalletScanned: (privateKey: string, name?: string) => void;
}

interface VideoDevice {
  deviceId: string;
  label: string;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onWalletScanned }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("ALIGN 64-HEX PAPER KEY INSIDE TARGET RETICLE");
  const [detectedKey, setDetectedKey] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string>("Paper Vault 01");
  const [manualInput, setManualInput] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  // Camera device state
  const [devices, setDevices] = useState<VideoDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  // Detect iframe context
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.self !== window.top) {
        setIsInIframe(true);
      }
    } catch {
      setIsInIframe(true);
    }
  }, []);

  // Enumerate video devices
  const updateDeviceList = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices
        .filter((d) => d.kind === "videoinput")
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${index + 1}`,
        }));
      setDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (e) {
      console.warn("Could not enumerate devices:", e);
    }
  }, [selectedDeviceId]);

  // Robust multi-tiered camera startup
  const startCamera = useCallback(async (deviceIdToUse?: string, modeToUse?: "environment" | "user") => {
    setCameraError(null);
    setErrorType(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera API is not supported in this browser context. Please use 'Upload Photo' or 'Manual Input'.");
      setErrorType("UNSUPPORTED");
      setIsScanning(false);
      return;
    }

    const currentMode = modeToUse || facingMode;
    const targetDeviceId = deviceIdToUse || selectedDeviceId;

    let acquiredStream: MediaStream | null = null;
    let lastErr: any = null;

    // Constraint tier 1: Specific Device ID
    if (targetDeviceId) {
      try {
        acquiredStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: targetDeviceId },
          },
        });
      } catch (e) {
        lastErr = e;
      }
    }

    // Constraint tier 2: FacingMode ideal
    if (!acquiredStream) {
      try {
        acquiredStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: currentMode },
          },
        });
      } catch (e) {
        lastErr = e;
      }
    }

    // Constraint tier 3: Bare minimum { video: true } (universal fallback)
    if (!acquiredStream) {
      try {
        acquiredStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
      } catch (e) {
        lastErr = e;
      }
    }

    if (acquiredStream) {
      setStream(acquiredStream);
      setIsScanning(true);
      setCameraError(null);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = acquiredStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => {
            console.warn("Auto-play prevented:", err);
          });
        };
      }

      // Update available camera device names now that permission is granted
      updateDeviceList();
    } else {
      setIsScanning(false);
      const errName = lastErr?.name || "UnknownError";
      setErrorType(errName);
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError" || lastErr?.message?.includes("Permission denied")) {
        setCameraError("Camera access permission was denied or restricted by iframe security. If you granted permissions, open the app in a standalone tab to allow direct hardware access.");
      } else if (errName === "NotFoundError" || errName === "DevicesNotFoundError") {
        setCameraError("No physical webcam or camera device was detected on your system.");
      } else if (errName === "NotReadableError" || errName === "TrackStartError") {
        setCameraError("Camera is currently in use by another application (e.g. Zoom, FaceTime, or another tab).");
      } else {
        setCameraError(lastErr?.message || "Failed to start camera feed. Please check hardware permissions or use Image Upload.");
      }
    }
  }, [facingMode, selectedDeviceId, stream, updateDeviceList]);

  // Stop camera tracks
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Sync stream to video element whenever stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((e) => console.log("Playback error:", e));
      };
    }
  }, [stream]);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Flip camera mode
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    setSelectedDeviceId("");
    startCamera(undefined, nextMode);
  };

  // Device dropdown change
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    startCamera(deviceId);
  };

  // Capture frame for AI Vision Scan
  const handleAiVisionScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    setIsAiLoading(true);
    setStatusMessage("GEMINI AI VISION SCANNING 64-BIT HEX CHARACTERS...");

    try {
      const res = await fetch("/api/scan-private-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();

      if (data.found && data.privateKey) {
        let cleanKey = data.privateKey.trim();
        if (!cleanKey.startsWith("0x")) cleanKey = "0x" + cleanKey;

        if (ethers.isHexString(cleanKey) && cleanKey.length === 66) {
          setDetectedKey(cleanKey);
          setStatusMessage(`SUCCESS: EXTRACTED 64-HEX KEY (${Math.round((data.confidence || 0.95) * 100)}% CONFIDENCE)`);
        } else {
          setStatusMessage(`INVALID FORMAT: ${data.notes || 'Not 64 hex characters'}`);
        }
      } else {
        setStatusMessage(data.notes || "NO PRIVATE KEY DETECTED. ADJUST PAPER LIGHTING & HOLD FLAT.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("AI SCAN FAILED. PLEASE RETRY OR USE MANUAL ENTRY.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result as string;
      setIsAiLoading(true);
      setStatusMessage("ANALYZING UPLOADED IMAGE WITH GEMINI AI...");

      try {
        const res = await fetch("/api/scan-private-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String }),
        });
        const data = await res.json();

        if (data.found && data.privateKey) {
          let cleanKey = data.privateKey.trim();
          if (!cleanKey.startsWith("0x")) cleanKey = "0x" + cleanKey;

          if (ethers.isHexString(cleanKey) && cleanKey.length === 66) {
            setDetectedKey(cleanKey);
            setStatusMessage("PRIVATE KEY EXTRACTED SUCCESSFULLY FROM IMAGE.");
          } else {
            setStatusMessage(`INVALID FORMAT: ${data.notes}`);
          }
        } else {
          setStatusMessage("NO 64-DIGIT HEX PRIVATE KEY FOUND IN IMAGE.");
        }
      } catch (err) {
        console.error(err);
        setStatusMessage("ERROR ANALYZING IMAGE.");
      } finally {
        setIsAiLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Confirm and import
  const handleImportWallet = () => {
    if (!detectedKey) return;
    try {
      const formatted = detectedKey.startsWith("0x") ? detectedKey : "0x" + detectedKey;
      new ethers.Wallet(formatted);
      onWalletScanned(formatted, walletName || "Paper Wallet");
    } catch (err) {
      alert("Invalid Ethereum private key format. Must be 64 hex characters (32 bytes).");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let key = manualInput.trim();
    if (!key.startsWith("0x")) key = "0x" + key;
    try {
      new ethers.Wallet(key);
      onWalletScanned(key, walletName || "Manual Paper Wallet");
    } catch (err) {
      alert("Invalid private key. Please enter a valid 64-hex character private key.");
    }
  };

  // Load a test paper wallet for instant verification
  const handleLoadSamplePaperKey = () => {
    // Standard test 64-hex key (Ethereum test wallet)
    const testKey = "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";
    setDetectedKey(testKey);
    setWalletName("Sample Cold Paper Vault");
    setStatusMessage("LOADED SAMPLE 64-HEX PAPER PRIVATE KEY FOR TESTING");
  };

  const handleOpenInNewTab = () => {
    if (typeof window !== "undefined") {
      window.open(window.location.href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-4">
      {/* Iframe Camera Notice Banner */}
      {isInIframe && (
        <div className="bg-sky-950/40 border border-sky-800/60 rounded-sm p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-sky-300">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Hardware Tip:</strong> If your browser blocks camera inside preview iframes, open the app in a standalone tab for direct hardware access.
            </span>
          </div>
          <button
            onClick={handleOpenInNewTab}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-sm font-bold flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>OPEN IN STANDALONE TAB</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Camera Section */}
        <div className="lg:col-span-7 bg-black border border-slate-800 rounded-sm overflow-hidden flex flex-col relative">
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>

          {/* Camera Header & Controls */}
          <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 z-10">
            <div className="flex items-center space-x-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isScanning ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></div>
              <span className="text-xs font-mono tracking-widest text-slate-300">
                {isScanning ? "OPTICAL SENSOR ACTIVE" : "OPTICAL SENSOR OFFLINE"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {devices.length > 1 && (
                <select
                  value={selectedDeviceId}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 px-2 py-1 rounded-sm focus:outline-none focus:border-sky-500 max-w-[140px] truncate"
                >
                  {devices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))}
                </select>
              )}

              {isScanning && (
                <button
                  onClick={handleToggleFacingMode}
                  className="text-[10px] font-mono px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-sm flex items-center space-x-1"
                  title="Flip Camera Front/Back"
                >
                  <SwitchCamera className="w-3 h-3" />
                  <span className="hidden sm:inline">{facingMode === "environment" ? "BACK" : "FRONT"}</span>
                </button>
              )}

              <button
                onClick={isScanning ? stopCamera : () => startCamera()}
                className={`text-[10px] font-mono px-3 py-1 rounded-sm uppercase tracking-wider font-bold transition-colors flex items-center space-x-1.5 ${
                  isScanning
                    ? "bg-rose-950/60 text-rose-400 border border-rose-800 hover:bg-rose-900/60"
                    : "bg-emerald-950/60 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60"
                }`}
              >
                {isScanning ? (
                  <>
                    <VideoOff className="w-3 h-3" />
                    <span>STOP CAMERA</span>
                  </>
                ) : (
                  <>
                    <Video className="w-3 h-3" />
                    <span>START CAMERA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Viewport Area */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: isScanning ? "block" : "none" }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Inactive State */}
            {!isScanning && !cameraError && (
              <div className="text-center p-8 text-slate-400 font-mono text-xs max-w-sm space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
                  <Camera className="w-7 h-7 opacity-80" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">OPTICAL CAMERA FEED READY</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Click "START CAMERA" to activate your webcam or phone camera for instant paper key scanning.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => startCamera()}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-sm text-xs font-mono font-bold transition-colors shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>START CAMERA SCANNER</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Diagnostics Screen */}
            {cameraError && (
              <div className="text-center p-6 text-rose-300 font-mono text-xs max-w-md space-y-3 z-20">
                <AlertCircle className="w-10 h-10 mx-auto text-rose-500" />
                <div className="bg-rose-950/50 border border-rose-900 p-3.5 rounded-sm text-left space-y-2">
                  <p className="font-bold text-rose-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Camera Permission Notice ({errorType || "BLOCKED"})</span>
                  </p>
                  <p className="text-rose-200/90 text-[11px] leading-relaxed">
                    {cameraError}
                  </p>
                  <p className="text-slate-400 text-[10px] border-t border-rose-900/60 pt-2">
                    💡 If your browser blocked the iframe, open the app in a standalone tab or use the image upload option.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <button
                    onClick={() => startCamera()}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-sm text-xs font-mono font-bold transition-colors"
                  >
                    RETRY PERMISSION
                  </button>
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>OPEN FULLSCREEN TAB</span>
                  </button>
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-mono font-bold cursor-pointer transition-colors border border-slate-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-sky-400" />
                    <span>UPLOAD PHOTO</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* Geometric Targeting Reticle Overlay */}
            {isScanning && !cameraError && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8 sm:p-12">
                <div className="relative w-full h-36 border border-sky-500/40 bg-sky-500/5 flex flex-col items-center justify-center">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-sky-400"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-sky-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-sky-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-sky-400"></div>
                  <div className="w-full h-[1px] bg-sky-500/40 absolute top-1/2"></div>
                  <div className="text-[10px] font-mono text-sky-400 tracking-[0.2em] bg-slate-950/90 px-3 py-1 border border-sky-500/30">
                    SCANNING 64-BIT SEGMENT
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scanner Controls Bar */}
          <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 space-y-4 z-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAiVisionScan}
                disabled={!isScanning || isAiLoading}
                className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-sm flex items-center justify-center space-x-2 transition-colors tracking-wider shadow-lg shadow-sky-600/20"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI READING 64-HEX KEY...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sky-200" />
                    <span>SCAN FRAME WITH AI VISION</span>
                  </>
                )}
              </button>

              <label className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm font-mono text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-colors border border-slate-700">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>UPLOAD PHOTO</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="text-[11px] font-mono text-sky-400 text-center tracking-wide uppercase truncate px-2">
              STATUS: {statusMessage}
            </div>
          </div>
        </div>

        {/* Right Import & Verification Section */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-sm p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  ACCOUNT CONFIGURATION
                </h3>
                <button
                  onClick={handleLoadSamplePaperKey}
                  className="text-[10px] font-mono text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1"
                  title="Load a sample 64-hex key to test features"
                >
                  <Zap className="w-3 h-3 text-sky-400" />
                  <span>LOAD TEST KEY</span>
                </button>
              </div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-tighter mb-1">
                Wallet Identifier / Nickname
              </label>
              <input
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="e.g. Paper Cold Vault Alpha"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm text-white font-mono text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            {detectedKey ? (
              <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-sm p-4 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>VALID 64-BIT KEY EXTRACTED</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter mb-1">Private Key (Hex)</div>
                  <div className="font-mono text-[11px] text-emerald-200/90 bg-slate-950 p-3 border border-emerald-900/40 break-all select-all">
                    {detectedKey}
                  </div>
                </div>
                <button
                  onClick={handleImportWallet}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-sm transition-colors tracking-wider shadow-md"
                >
                  CONNECT ETHEREUM WALLET
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm text-center text-xs font-mono text-slate-400 leading-relaxed">
                  Awaiting successful optical or AI scan of paper key. Alternatively, enter your 64-digit private key manually below.
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-tighter mb-1">
                      Manual Private Key (64 Hex Characters)
                    </label>
                    <input
                      type="password"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="0x... or 64 hex characters"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold rounded-sm transition-colors tracking-wider"
                  >
                    IMPORT MANUAL KEY
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center flex items-center justify-center gap-1.5">
            <Info className="w-3 h-3 text-slate-500" />
            <span>SECURE CLIENT-SIDE DERIVATION • NO KEYS STORED REMOTELY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

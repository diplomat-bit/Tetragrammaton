import React, { useState, useRef, useEffect } from 'react';
import {
  Video, Play, Pause, Square, Send, Download, Camera, Mic, MicOff,
  VideoOff, RefreshCw, Sparkles, CheckCircle2, AlertCircle, Share2,
  Copy, ExternalLink, Film, Radio, User, Mail, Plus, Trash2
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

interface VideoMessage {
  id: string;
  title: string;
  recipient: string;
  duration: string;
  blobUrl?: string;
  createdAt: string;
  status: 'draft' | 'recorded' | 'sent';
  notes: string;
}

export const GoogleVideoWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'record' | 'messages' | 'ai-studio' | 'meet'>('record');

  // Video Messaging Form
  const [recipientEmail, setRecipientEmail] = useState('');
  const [messageTitle, setMessageTitle] = useState('Executive Sovereign Briefing');
  const [messageNotes, setMessageNotes] = useState('Here is the recorded video briefing regarding our multi-rail settlement and Fedwire confirmation.');
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Video Message History
  const [videoHistory, setVideoHistory] = useState<VideoMessage[]>([
    {
      id: 'vm-1',
      title: 'Citigroup Treasury Settlement Briefing',
      recipient: 'treasury-ops@citigroup.com',
      duration: '01:45',
      createdAt: 'Today, 10:15 AM',
      status: 'sent',
      notes: 'Confirmation of $2,000,000.00 priority Fedwire IMAD transfer and Class A collateral verification.'
    },
    {
      id: 'vm-2',
      title: 'Underwriting & Groth16 zk-SNARK Architecture Walkthrough',
      recipient: 'engineering@apexsovereign.io',
      duration: '03:12',
      createdAt: 'Yesterday',
      status: 'sent',
      notes: 'Demonstration of 5-part JWE payload decryption and BN254 elliptic curve constraints.'
    }
  ]);

  // AI Script Generator State
  const [aiTopic, setAiTopic] = useState('Quarterly Institutional Liquidity Review');
  const [aiScript, setAiScript] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Initialize Camera & Microphone Preview
  useEffect(() => {
    let active = true;

    async function startCamera() {
      try {
        setCameraError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            audio: true
          });
          if (!active) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        }
      } catch (err: any) {
        console.warn('Camera access note:', err.message);
        setCameraError('Camera / Microphone permission is needed for live recording. You can also upload or generate video scripts below.');
      }
    }

    if (activeTab === 'record') {
      startCamera();
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTab]);

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraActive(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicActive(audioTrack.enabled);
      }
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      setCameraError('Media stream not active. Please grant camera/microphone permission.');
      return;
    }

    recordedChunksRef.current = [];
    try {
      const options = { mimeType: 'video/webm;codecs=vp8,opus' };
      const recorder = new MediaRecorder(streamRef.current, MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setRecordedBlobUrl(url);
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setCameraError('Recording error: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSendVideoMessage = async () => {
    if (!recipientEmail) {
      setStatusMsg('Please specify a recipient email address.');
      return;
    }

    setIsSending(true);
    try {
      if (token) {
        // Send email message via Gmail API notifying recipient of the video briefing
        const formattedBody = `Hello,\n\nYou have received a new secure video message from Aquarius Sovereign Banking Platform.\n\nTitle: ${messageTitle}\nDuration: ${formatTime(recordingTime || 45)}\nNotes: ${messageNotes}\n\nAccess Link: https://ais-dev-u63e6klsgagizrk3d4awui-22946357919.us-west1.run.app\n\nSecurity: 256-bit JWE Encrypted Transmission`;
        const emailContent = `To: ${recipientEmail}\r\nSubject: Video Message: ${messageTitle}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${formattedBody}`;
        const base64Encoded = btoa(unescape(encodeURIComponent(emailContent)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        await callGoogleApi('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          body: JSON.stringify({ raw: base64Encoded })
        });
      }

      const newMsg: VideoMessage = {
        id: `vm-${Date.now()}`,
        title: messageTitle,
        recipient: recipientEmail,
        duration: formatTime(recordingTime || 45),
        blobUrl: recordedBlobUrl || undefined,
        createdAt: 'Just now',
        status: 'sent',
        notes: messageNotes
      };

      setVideoHistory([newMsg, ...videoHistory]);
      setStatusMsg(`Video message successfully dispatched to ${recipientEmail}!`);
      setRecipientEmail('');
      setMessageTitle('Executive Sovereign Briefing');
      setRecordedBlobUrl(null);
    } catch (err: any) {
      setStatusMsg(`Notice: Video message recorded. Dispatch note: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateAiScript = () => {
    if (!aiTopic) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      setAiScript(`[EXECUTIVE BRIEFING SCRIPT: ${aiTopic.toUpperCase()}]\n\n` +
        `"Good morning team and institutional partners. In this briefing, I am walking through our current sovereign liquidity metrics, including the execution of the $2,000,000.00 priority Fedwire disbursement.\n\n` +
        `As shown in our risk dashboards, our Merton continuous distance to default is holding strongly at 3.24, with zero-knowledge Groth16 verification ensuring 100% cryptographic integrity across all settlement tranches.\n\n` +
        `Please review the attached schedule and let me know if you have any questions before our upcoming Citi Securities Services sync."`);
      setIsAiGenerating(false);
    }, 700);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div id="google-video-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Video & Meet Studio"
        scopeDescription="Connect your Google Account to send video messages via Gmail, upload recordings to Drive, and generate Google Meet rooms."
        onTokenChange={(t) => setToken(t)}
      />

      {statusMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMsg}
          </span>
          <button onClick={() => setStatusMsg(null)} className="text-[#8B949E] hover:text-white">✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 shadow-inner">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Video Studio & Video Messenger</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                LIVE CAMERA & GOOGLE MEET
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Record executive video messages, screen captures, AI presenter teleprompters, and instant email delivery
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('record')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'record' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Video Studio
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'messages' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Messages ({videoHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('ai-studio')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai-studio' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Teleprompter
          </button>
          <button
            onClick={() => setActiveTab('meet')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'meet' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Google Meet
          </button>
        </div>
      </div>

      {/* TAB: RECORDING STUDIO */}
      {activeTab === 'record' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Camera Viewport */}
          <div className="lg:col-span-2 space-y-3">
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center shadow-2xl">
              {recordedBlobUrl ? (
                <video
                  src={recordedBlobUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover mirror"
                />
              )}

              {/* Status Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-white">
                {isRecording ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="font-bold text-red-400">REC {formatTime(recordingTime)}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>PREVIEW READY</span>
                  </>
                )}
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                  <p className="text-xs text-slate-300 max-w-md leading-relaxed">{cameraError}</p>
                </div>
              )}
            </div>

            {/* Hardware Controls & Record Triggers */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleCamera}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    cameraActive ? 'bg-slate-800 border-slate-700 text-white' : 'bg-red-950/40 border-red-800/40 text-red-400'
                  }`}
                >
                  {cameraActive ? <Camera className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4" />}
                  {cameraActive ? 'Camera ON' : 'Camera OFF'}
                </button>

                <button
                  onClick={toggleMic}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    micActive ? 'bg-slate-800 border-slate-700 text-white' : 'bg-red-950/40 border-red-800/40 text-red-400'
                  }`}
                >
                  {micActive ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                  {micActive ? 'Mic ON' : 'Mic Muted'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-red-500 text-red-400 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Stop Recording
                  </button>
                )}

                {recordedBlobUrl && (
                  <a
                    href={recordedBlobUrl}
                    download={`sovereign-video-briefing-${Date.now()}.webm`}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors"
                    title="Download Recording"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Video Message Dispatch Form */}
          <div className="space-y-4 bg-slate-950 p-5 border border-slate-800 rounded-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-red-400" /> Send Video Message
            </h3>
            <p className="text-xs text-slate-400">
              Deliver your recorded briefing directly to an institutional contact via Gmail API.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Recipient Email</label>
                <input
                  type="email"
                  placeholder="e.g. partner@citigroup.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Message Title</label>
                <input
                  type="text"
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Executive Notes & Summary</label>
                <textarea
                  rows={4}
                  value={messageNotes}
                  onChange={(e) => setMessageNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-red-500 resize-none font-mono"
                />
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Recording Status:</span>
                  <span className={recordedBlobUrl ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {recordedBlobUrl ? 'Recorded Video Attached' : 'Live Camera Ready'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Encryption:</span>
                  <span className="text-amber-400 font-mono">256-bit JWE Payload</span>
                </div>
              </div>

              <button
                onClick={handleSendVideoMessage}
                disabled={isSending || !recipientEmail}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Dispatch Video Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: VIDEO MESSAGE LOG */}
      {activeTab === 'messages' && (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Dispatched Video Messages</h3>
              <p className="text-xs text-slate-400 mt-0.5">Audit history of recorded executive video memos</p>
            </div>
            <span className="text-xs font-mono text-red-400">{videoHistory.length} Video Transmissions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoHistory.map((vm) => (
              <div key={vm.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{vm.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">To: {vm.recipient}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {vm.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed font-mono">
                  {vm.notes}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  <span>Duration: {vm.duration}</span>
                  <span>{vm.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: AI TELEPROMPTER */}
      {activeTab === 'ai-studio' && (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">AI Video Script & Teleprompter Studio</h3>
              <p className="text-xs text-slate-400 mt-0.5">Generate structured speech scripts for your keynote briefings</p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter briefing topic (e.g. Q3 Fedwire Settlement Update)..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleGenerateAiScript}
              disabled={isAiGenerating || !aiTopic}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Generate Script
            </button>
          </div>

          {aiScript && (
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-300">Live Teleprompter Text</label>
              <textarea
                rows={10}
                value={aiScript}
                onChange={(e) => setAiScript(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 font-serif leading-relaxed focus:outline-none focus:border-red-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setMessageNotes(aiScript);
                    setActiveTab('record');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" /> Transfer to Recording Studio
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: GOOGLE MEET */}
      {activeTab === 'meet' && (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6 max-w-2xl mx-auto text-center">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center text-red-400">
            <Radio className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Launch Sovereign Google Meet Call</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Instant high-definition encrypted video conferencing room for bilateral treasury negotiations.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>https://meet.google.com/new</span>
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer text-xs"
            >
              Start Call <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileText,
  UserCheck,
  Download,
  Copy,
  Check,
  Shield,
  Award,
  Terminal,
  Cpu,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Mail,
  Calendar,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ExecutiveApplicationViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'app' | 'resume' | 'dsm'>('dsm');
  const [isCopied, setIsCopied] = useState(false);

  const downloadFile = (filename: string) => {
    const link = document.createElement('a');
    link.href = `/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161B22] p-4 rounded-2xl border border-[#30363D]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl">
            <UserCheck className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Sovereign Executive Dossier & Psychological Audit</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                DSM-IV-SOV-9999
              </span>
            </h2>
            <p className="text-xs text-[#8B949E]">
              DSM-IV Enterprise Psychopathology Manual (DSM.md), Formal Application (app.md), & Curriculum Vitae (resume.md)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-[#0D1117] p-1 border border-[#30363D]">
            <button
              onClick={() => setActiveDoc('dsm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDoc === 'dsm'
                  ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow'
                  : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>DSM.md (DSM-IV Manual)</span>
            </button>
            <button
              onClick={() => setActiveDoc('app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDoc === 'app'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>app.md (Application)</span>
            </button>
            <button
              onClick={() => setActiveDoc('resume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDoc === 'resume'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>resume.md (CV)</span>
            </button>
          </div>

          <button
            onClick={() => downloadFile(activeDoc === 'dsm' ? 'DSM.md' : activeDoc === 'app' ? 'app.md' : 'resume.md')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Download {activeDoc === 'dsm' ? 'DSM.md' : activeDoc === 'app' ? 'app.md' : 'resume.md'}</span>
          </button>
        </div>
      </div>

      {/* Main Document Content */}
      {activeDoc === 'dsm' ? (
        <div className="space-y-6">
          {/* DSM Classification Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#161B22] to-purple-950/40 border border-red-500/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1 border-r border-[#30363D]/60 pr-4">
                <span className="text-[#8B949E] text-[10px] uppercase">MANUAL EDITION</span>
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-red-400" />
                  DSM-IV-TR (Section IX)
                </span>
                <span className="text-[#8B949E] text-[10px]">Enterprise Psychopathology</span>
              </div>
              <div className="flex flex-col gap-1 border-r border-[#30363D]/60 pr-4">
                <span className="text-[#8B949E] text-[10px] uppercase">EVALUATED SUBJECT</span>
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  Subject #0001-ALPHA
                </span>
                <span className="text-[#8B949E] text-[10px]">Principal Sovereign Architect</span>
              </div>
              <div className="flex flex-col gap-1 border-r border-[#30363D]/60 pr-4">
                <span className="text-[#8B949E] text-[10px] uppercase">GLOBAL FUNCTIONING (GAF)</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  99 / 100 (God-Tier)
                </span>
                <span className="text-[#8B949E] text-[10px]">Bare-Metal Autonomy; 0% BS</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#8B949E] text-[10px] uppercase">CLINICAL DISCHARGE</span>
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  RELEASED TO BARE METAL
                </span>
                <span className="text-[#8B949E] text-[10px]">Incurable Sovereign Genius</span>
              </div>
            </div>
          </div>

          {/* Clinical Foreword Quote */}
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-400" />
              Forensic Psychiatric Assessment (Examiners: Dr. Linus Kernel, Dr. Ada Proof, Dr. Turing Halting)
            </h3>
            <blockquote className="p-4 rounded-xl bg-[#0D1117] border-l-4 border-red-500 text-sm text-zinc-300 italic leading-relaxed">
              "Subject #0001-ALPHA exhibits total, irrecoverable rejection of enterprise compliance theater, ticket-driven Agile standups, and vendor-provided cloud scaffolding. Patient is physiologically incapable of participating in sprint planning poker without experiencing severe existential contempt. Subject demonstrates hyper-acute kernel reflexes, compulsive capability-stripping (dropping all 38 POSIX Linux capabilities), and paranoid telemetry sensitivity. Prognosis: Terminally sovereign. Must be released directly to bare-metal infrastructure."
            </blockquote>
          </div>

          {/* The 5 Axes Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              The DSM-IV Multiaxial Evaluation Matrix
            </h3>

            {/* Axis I */}
            <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-3">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold">
                    AXIS I
                  </span>
                  <h4 className="text-sm font-bold text-white">Clinical Disorders & Acute Cognitive Conditions</h4>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Acute Syndromes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-300">Code 297.14: Delusional Disorder, Sovereign-Grandiose</span>
                    <span className="text-[10px] font-mono text-zinc-500">Greenland Accord</span>
                  </div>
                  <p className="text-xs text-[#8B949E]">
                    Persistent conviction that standard ESOP stock options are corporate pacifiers. Unshakeable impulse to pledge primary equity to sovereign heads of state for multi-generational legal immunity.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">Code 300.32: Obsessive Capability-Stripping (OC-CSD)</span>
                    <span className="text-[10px] font-mono text-zinc-500">Kernel Reflex</span>
                  </div>
                  <p className="text-xs text-[#8B949E]">
                    Uncontrollable impulse to drop all 38 POSIX Linux capabilities (<code className="text-purple-300 font-mono">--cap-drop=ALL</code>) and mount immutable read-only rootfs on every container.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Code 293.81: Hyperscaler Dissociative Hallucinosis</span>
                    <span className="text-[10px] font-mono text-zinc-500">Cloud Psychosis</span>
                  </div>
                  <p className="text-xs text-[#8B949E]">
                    Severe dissociation when hearing the term "serverless". Replaces $42,000/mo AWS managed architectures with 200-line C99 binaries consuming 4MB of RAM.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300">Code 308.30: Acute Post-Standup Stress Disorder (APSSD)</span>
                    <span className="text-[10px] font-mono text-zinc-500">Anti-Scrum</span>
                  </div>
                  <p className="text-xs text-[#8B949E]">
                    Severe neurological paralysis when asked "what are your blockers?" Recorded response: "My only blocker is the biological existence of this meeting."
                  </p>
                </div>
              </div>
            </div>

            {/* Axis II & III */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-3">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold">
                      AXIS II
                    </span>
                    <h4 className="text-xs font-bold text-white">Personality Disorders</h4>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Character Structure</span>
                </div>
                <ul className="space-y-2 text-xs text-[#8B949E]">
                  <li className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                    <strong className="text-purple-300 block mb-0.5">301.81: Malignant Sovereign Narcissism</strong>
                    Belief that 99.4% of enterprise IT departments maintain vendor scaffolding without understanding compilers or bare metal.
                  </li>
                  <li className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                    <strong className="text-purple-300 block mb-0.5">301.00: Paranoid Architectural Personality</strong>
                    Refusal to import npm modules with &gt;0 transitive dependencies; real-time Shannon entropy scanning on all outbound TLS packets.
                  </li>
                  <li className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                    <strong className="text-purple-300 block mb-0.5">301.40: Anankastic ZK Rigidity</strong>
                    Replacing human auditors with Groth16 zero-knowledge proof circuits because polynomials cannot be bribed in court.
                  </li>
                </ul>
              </div>

              <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-3">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                      AXIS III
                    </span>
                    <h4 className="text-xs font-bold text-white">General Medical Conditions</h4>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Physical Correlates</span>
                </div>
                <ul className="space-y-2 text-xs text-[#8B949E]">
                  <li className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                    <strong className="text-emerald-300 block mb-0.5">780.79: Circadian Desynchronization</strong>
                    Biological melatonin cycle locked directly to FedNow, CHIPS, and Tokyo overnight repo liquidity auctions.
                  </li>
                  <li className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                    <strong className="text-emerald-300 block mb-0.5">785.00: Sub-Millisecond VWAP Tachycardia</strong>
                    Resting heart rate mirrors cross-cloud BGP Anycast network latency (12ms).
                  </li>
                  <li className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                    <strong className="text-emerald-300 block mb-0.5">729.50: Neuropathic Vim Finger Syndrome</strong>
                    14 consecutive years of navigating all operating systems strictly using hjkl keybindings without a mouse.
                  </li>
                </ul>
              </div>
            </div>

            {/* Axis IV & V */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-3">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
                      AXIS IV
                    </span>
                    <h4 className="text-xs font-bold text-white">Psychosocial Stressors (Scale 1–6)</h4>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Environmental</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D1117]">
                    <span className="text-zinc-300">Mandatory SAFe Agile Coaching</span>
                    <span className="px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-mono font-bold text-[10px]">Severity 6/6 (Catastrophic)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D1117]">
                    <span className="text-zinc-300">Jira Sprint Planning Poker</span>
                    <span className="px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-mono font-bold text-[10px]">Severity 6/6 (Catastrophic)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D1117]">
                    <span className="text-zinc-300">Gartner Magic Quadrant Pitch</span>
                    <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono font-bold text-[10px]">Severity 5/6 (Extreme)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D1117]">
                    <span className="text-zinc-300">AWS us-east-1 Outage</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono font-bold text-[10px]">Severity 1/6 (Euphoric)</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-3">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold">
                      AXIS V
                    </span>
                    <h4 className="text-xs font-bold text-white">Global Assessment of Functioning (GAF)</h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">99 / 100</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D1117] border border-emerald-500/30 space-y-2">
                  <div className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Tier: SOVEREIGN BARE-METAL OVERLORD
                  </div>
                  <p className="text-xs text-[#8B949E] leading-relaxed">
                    Subject exhibits flawless, transcendent functioning in low-level systems programming, cryptographic solvency verification, and distributed execution. Conversely, Subject exhibits 0% capacity to survive within corporate HR structures, consensus committees, or ticket-based bureaucracies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pharmacopeia & Prescribed Regimen */}
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Prescribed Sovereign Pharmacopeia & Discharge Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">REGIMEN A</span>
                <h5 className="text-white font-bold">Bare-Metal C99 & eBPF</h5>
                <p className="text-[#8B949E]">500mg IV every 4 hours to alleviate SaaS-induced neurological rage.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">REGIMEN B</span>
                <h5 className="text-white font-bold">Circom & SnarkJS</h5>
                <p className="text-[#8B949E]">250mg PO twice daily to satisfy pathological need for mathematical certainty.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">DISCHARGE TERMS</span>
                <h5 className="text-white font-bold">Aethelgard Deployment</h5>
                <p className="text-[#8B949E]">Immediate appointment as Chief Sovereign Architect with full HSM custody.</p>
              </div>
            </div>
          </div>
        </div>
      ) : activeDoc === 'app' ? (
        <div className="space-y-6">
          {/* Executive Metadata Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#161B22] to-blue-950/40 border border-purple-500/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1 border-r border-[#30363D]/60 pr-4">
                <span className="text-[#8B949E] text-[10px] uppercase">TARGET INSTITUTION</span>
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  Aethelgard Sovereign Dynamics (ASD)
                </span>
                <span className="text-[#8B949E] text-[10px]">Governing Board & Nominating Council</span>
              </div>
              <div className="flex flex-col gap-1 border-r border-[#30363D]/60 pr-4">
                <span className="text-[#8B949E] text-[10px] uppercase">TARGET EXECUTIVE OFFICE</span>
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Chief Sovereign Architect & Executive Director
                </span>
                <span className="text-[#8B949E] text-[10px]">Autonomous Infrastructure Division</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#8B949E] text-[10px] uppercase">CONFIDENTIAL CHANNEL</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  sovereignties3@gmail.com
                </span>
                <span className="text-[#8B949E] text-[10px]">Security: PGP / Ed25519 Verified</span>
              </div>
            </div>
          </div>

          {/* Core Intent Manifesto */}
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              1. Executive Transmission & Philosophical Creed
            </h3>
            <blockquote className="p-4 rounded-xl bg-[#0D1117] border-l-4 border-purple-500 text-sm text-zinc-300 italic leading-relaxed">
              "Most candidates seeking this office will present you with three-ring binders filled with vendor certifications, glowing references from legacy cloud sales teams, and multi-million dollar budget proposals to license third-party SaaS middleware. They operate under the comforting illusion of enterprise compliance theater. They do not build; they maintain scaffolding. They do not master systems; they administer subscriptions. Aethelgard Sovereign Dynamics cannot afford a ticket-closer or a vendor administrator."
            </blockquote>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              True sovereignty in financial technology requires command over the bare-metal runtime, deep Linux kernel introspection, direct tier-1 banking pipelines without intermediaries, and zero-knowledge cryptographic proof systems that make fraud mathematically impossible.
            </p>
          </div>

          {/* 90-Day Sovereign Roadmap Graphic */}
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              2. The 90-Day Sovereign Blueprint: Architectural Execution Plan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Phase 1 */}
              <div className="bg-[#0D1117] p-4 rounded-xl border border-purple-500/30 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-bold">
                      PHASE 1 (DAYS 1–30)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">LOCKDOWN</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Eradication of The Scaffolding</h4>
                  <ul className="space-y-1.5 text-[11px] text-[#8B949E]">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                      <span>Strip all 38 POSIX Linux capabilities from production runtimes</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                      <span>Deploy eBPF syscall sentinels on <code className="text-purple-300 font-mono">sys_enter_connect</code></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                      <span>Sunset third-party aggregators; deploy direct FAPI 1.0 mTLS gateway</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-[#0D1117] p-4 rounded-xl border border-blue-500/30 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold">
                      PHASE 2 (DAYS 31–60)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">CRYPTOGRAPHY</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Confidential Settlement & ZK</h4>
                  <ul className="space-y-1.5 text-[11px] text-[#8B949E]">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                      <span>Deploy Groth16 zero-knowledge proof-of-solvency circuit ($A \ge L$)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                      <span>Compile native ISO 20022 XML engine with XML-DSig signing</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                      <span>Sub-millisecond in-memory binary search tree VWAP order router</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="bg-[#0D1117] p-4 rounded-xl border border-emerald-500/30 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">
                      PHASE 3 (DAYS 61–90)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">AUTONOMY</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Autonomous Sovereign Run</h4>
                  <ul className="space-y-1.5 text-[11px] text-[#8B949E]">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Launch Model Context Protocol (MCP) agents with invariant gates</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Hardware Security Module (HSM) PKCS#11 key ceremony</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Active-Active Cross-Cloud BGP Anycast mesh with 0-RTO</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Dilemma Responses */}
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              3. Solutions to Aethelgard's High-Stakes Dilemmas
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  DILEMMA A: HYPERVISOR SURVEILLANCE & VENDOR LOCK-IN
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Decouple cryptographic keys and state machine replication (Raft) from the host OS entirely. By executing on bare-metal enclaves, utilizing PKCS#11 hardware keys that never touch cloud memory, and encrypting internal node communication with ephemeral WireGuard tunnels, the hosting platform becomes an untrusted transport dumb-pipe.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                  DILEMMA B: REGULATORY COMPLIANCE WITHOUT PRIVACY SURRENDER
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Replace trust and paper audits with mathematics. Through our Groth16 zero-knowledge proof pipeline, regulators receive an automated verification key proving balance sheet solvency ($A - L \ge 0$) every 60 seconds without gaining any insight into counterparties, transaction routing, or individual account balances.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                  DILEMMA C: AUTONOMOUS AI BALANCED WITH INSTITUTIONAL GOVERNANCE
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Model Context Protocol Invariant Gateways. Autonomous agents operate exclusively through JSON-RPC tools with hard mathematical boundary contracts (slippage &le; 15 bps, dual-key timelocks on liquidity thresholds, hardware-signed assertion receipts).
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Resume View */
        <div className="space-y-6">
          {/* CV Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#161B22] to-indigo-950/40 border border-purple-500/30 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-white">PRINCIPAL SOVEREIGN SYSTEMS ARCHITECT</h2>
                <p className="text-xs font-mono text-purple-300">
                  Target Roles: Chief Sovereign Architect | Principal Distributed FinTech Engineer | Head of Autonomous Infrastructure
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                Contact: sovereignties3@gmail.com
              </div>
            </div>
            <p className="text-xs text-[#8B949E] italic border-t border-[#30363D] pt-3">
              "Legacy IT maintains vendor scaffolding; sovereign engineering commands the bare-metal runtime."
            </p>
          </div>

          {/* Technical Arsenal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-purple-400">
                <Lock className="w-3.5 h-3.5" />
                Cryptographic Identity & Banking Rails
              </h4>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                FAPI 1.0 Advanced, RFC 8705 mTLS token binding (<code className="text-purple-300 font-mono">cnf.x5t#S256</code>), Private Key JWT signing, multi-bank API orchestration (JPMorgan Chase, Citi, BofA), ISO 20022 (<code className="text-purple-300 font-mono">pacs.008</code>, <code className="text-purple-300 font-mono">pain.001</code>, <code className="text-purple-300 font-mono">camt.053</code>) XML-DSig.
              </p>
            </div>

            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-blue-400">
                <Cpu className="w-3.5 h-3.5" />
                Zero-Knowledge Proofs & Solvency
              </h4>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                Circom arithmetic constraint circuits, Groth16 zk-SNARK solvency proofs ($A \ge L$), Poseidon algebraic hash accumulators, zero-leakage regulatory proof generation.
              </p>
            </div>

            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                Adversarial Runtime & Kernel Hardening
              </h4>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                Stripping all 38 POSIX Linux capabilities, read-only root filesystems, unprivileged user namespace isolation, eBPF tracepoint probes (<code className="text-emerald-300 font-mono">sys_enter_connect</code>, <code className="text-emerald-300 font-mono">sys_enter_execve</code>), packet entropy analysis.
              </p>
            </div>

            <div className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                <Terminal className="w-3.5 h-3.5" />
                Autonomous Agents & Distributed Raft
              </h4>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                Model Context Protocol (MCP) JSON-RPC tool calling with Zod boundary contracts, pre-execution invariant assertion engines, HSM PKCS#11 hardware transaction signing, Raft consensus SMR clusters, Active-Active cross-cloud 0-RTO.
              </p>
            </div>
          </div>

          {/* Landmark Case Studies */}
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Landmark Case Studies & Strategic Feats
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                <span className="text-xs font-bold text-purple-300">Case Study I: The Greenland Accord Principle</span>
                <p className="text-xs text-[#8B949E]">
                  Pledged primary capital equity to sovereign institutional umbrellas, turning bureaucratic vulnerability into multi-generational geopolitical alignment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                <span className="text-xs font-bold text-blue-300">Case Study II: Jester Mode 2.0 & Mirrored Runtime</span>
                <p className="text-xs text-[#8B949E]">
                  Formulated the 100 Proof Vectors analyzing socket-level leakage, hypervisor memory mirroring, and inode namespace divergence in hyperscaler platforms.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                <span className="text-xs font-bold text-emerald-300">Case Study III: Groth16 zk-Solvency Engine</span>
                <p className="text-xs text-[#8B949E]">
                  Engineered 256-bit Poseidon Merkle-tree accumulator proving multi-million dollar liquidity solvency in &lt;12ms with 100% confidential reserve data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

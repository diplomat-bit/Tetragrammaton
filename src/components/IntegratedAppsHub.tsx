import React, { useState, useEffect } from 'react';
import {
  Layers,
  CreditCard,
  FileSpreadsheet,
  ShieldCheck,
  BarChart3,
  Terminal,
  Globe2,
  Receipt,
  FileCode,
  KeyRound,
  Building2,
  ExternalLink,
  Play,
  CheckCircle2,
  ArrowRight,
  Server,
  Sparkles,
  Zap,
  Activity,
  Search,
  Code2,
  Bot
} from 'lucide-react';

// Import the standalone apps from packages/
import ChaseCreditApp from '../../packages/Chase-Bank-credit--main/src/App';
import CitiBalancesCsvApp from '../../packages/Citi-Account-Balances-CSV-Export-main/src/App';
import CitiInsuranceApp from '../../packages/Citi-Offline-Insurance-Booking-Manager-main/src/App';
import CitiVisualizerApp from '../../packages/Citi-account-visualizer-main/src/App';
import CitiSandboxTesterApp from '../../packages/Citi-sandbox-tester--main/src/App';
import CitibankDubaiApp from '../../packages/Citibank-dubai-main/src/App';
import FdxBillPayApp from '../../packages/Fdx-bill-pay-main/src/App';
import HkCitiCardsApp from '../../packages/Hk-Citi-cards-main/src/App';
import JwtDecryptionApp from '../../packages/Jwt-decryption-app-for-Citibank--main/src/App';
import OpenBankingApp from '../../packages/Open-banking-Citibank-demo-business-app-main/src/App';
import CitiPartnerCardsApp from '../../packages/citi-partner-cards-api-explorer/src/App';
import Jocall3PortfolioApp from '../../packages/jocall3-portfolio-explorer/App';
import AutonomousWorkflowApp from '../../packages/copy-of-copy-of-copy-of-copy-of-workflow-of-autonomous-of-infiniteai-expandai/App';
import RemixAutonomousWorkflowApp from '../../packages/remix-workflow-temp/App';
import HfWalletApp from '../../packages/Hf-main/src/App';
import AquariusAppWrapper from './AquariusAppWrapper';
import { ExtractedAppsHub } from './ExtractedAppsHub';
import { JamesBurveloConsortiumHub } from './JamesBurveloConsortiumHub';

export type PackageAppId =
  | 'all'
  | 'jamesburvelo-consortium'
  | 'chase-credit'
  | 'citi-balances-csv'
  | 'citi-insurance'
  | 'citi-visualizer'
  | 'citi-sandbox'
  | 'citibank-dubai'
  | 'fdx-bill-pay'
  | 'hk-citi-cards'
  | 'jwt-decryption'
  | 'open-banking-citi'
  | 'citi-partner-cards'
  | 'jocall3-portfolio'
  | 'autonomous-workflow'
  | 'remix-autonomous-workflow'
  | 'hf-crypto-wallet'
  | 'aibankinggod';

interface AppPackageMeta {
  id: PackageAppId;
  name: string;
  folder: string;
  category: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  endpoints: string[];
  features: string[];
  component: React.ComponentType;
}

export const INTEGRATED_PACKAGES: AppPackageMeta[] = [
  {
    id: 'jamesburvelo-consortium',
    name: "DonOne AI Banking Consortium & Aether Mesh (James Burvelo O'Callaghan III)",
    folder: 'packages/jamesburvelocallaghaniiiand',
    category: 'Sovereign Banking Mesh',
    badge: '75 APPS & ISO 20022',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    icon: Building2,
    description: "Flagship 75-application OmniGrid AI Suite, 150 ISO 20022 code standards, 14 financial lifecycle data models, bond interest rate shock simulator, and 21 monorepo packages.",
    endpoints: [
      'GET /api/jamesburvelo/manifest',
      'GET /api/jamesburvelo/iso20022',
      'POST /api/jamesburvelo/simulations/interest-rate',
      'GET /api/jamesburvelo/models'
    ],
    features: [
      '75 OmniGrid AI Apps',
      '150 ISO 20022 Standards',
      'Macro Yield Curve Simulator',
      '14 Financial Data Models',
      '21 Monorepo Packages'
    ],
    component: JamesBurveloConsortiumHub,
  },
  {
    id: 'chase-credit',
    name: 'Chase Pay With Points & Loyalty Engine',
    folder: 'packages/Chase-Bank-credit--main',
    category: 'Credit & Loyalty',
    badge: 'CHASE PAY WITH POINTS',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    icon: CreditCard,
    description: 'Chase loyalty rewards engine, merchant program enrollment, and point redemption suite with live sandbox executor.',
    endpoints: ['POST /api/chase/execute'],
    features: ['Token Validator', 'Merchant Program Enrollment', 'Transaction Simulator', 'Live Response Telemetry'],
    component: ChaseCreditApp,
  },
  {
    id: 'citi-balances-csv',
    name: 'Citi Account Balances & CSV Exporter',
    folder: 'packages/Citi-Account-Balances-CSV-Export-main',
    category: 'Analytics & CSV',
    badge: 'CITI BALANCES & CSV',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    icon: FileSpreadsheet,
    description: 'Real-time Citi balance monitoring, multi-currency credit limits, transaction breakdown, and CSV data export.',
    endpoints: ['GET /api/citi/config', 'POST /api/citi/proxy/accounts-details', 'POST /api/citi/proxy/transactions'],
    features: ['Multi-currency Card Summaries', 'Transactions Table', 'CSV Export Engine', 'Auto-refresh Polling'],
    component: CitiBalancesCsvApp,
  },
  {
    id: 'citi-insurance',
    name: 'Citi Offline Insurance Booking Manager',
    folder: 'packages/Citi-Offline-Insurance-Booking-Manager-main',
    category: 'Insurance & Policies',
    badge: 'INSURANCE BOOKING',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    icon: ShieldCheck,
    description: 'Multi-party policy booking manager with beneficiary configuration, policy riders, and offline payment accounts.',
    endpoints: ['GET /api/env-config', 'POST /api/proxy-booking'],
    features: ['Applicant & Beneficiary Form', 'Policy Rider Management', 'JSON Payload Scaffolder', 'cURL Generator'],
    component: CitiInsuranceApp,
  },
  {
    id: 'citi-visualizer',
    name: 'Citi Account Visualizer & AI Advisor',
    folder: 'packages/Citi-account-visualizer-main',
    category: 'Visualizer & AI',
    badge: 'GEMINI AI ADVISOR',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    icon: BarChart3,
    description: 'Interactive account dashboard featuring Gemini AI-powered treasury advisory, portfolio metrics, and spending charts.',
    endpoints: ['GET /api/citi/accounts', 'POST /api/ai/insights'],
    features: ['Gemini AI Insights Advisor', 'Credit Utilization Charts', 'Account Status Cards', 'API Playground'],
    component: CitiVisualizerApp,
  },
  {
    id: 'citi-sandbox',
    name: 'Citi Sandbox Dynamic Client Registration (DCR)',
    folder: 'packages/Citi-sandbox-tester--main',
    category: 'Developer Sandbox',
    badge: 'DCR REGISTRATION',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    icon: Terminal,
    description: 'Dynamic Client Registration tester for Citi Partner Portal with interactive header & payload builder.',
    endpoints: ['POST /api/citi/register'],
    features: ['DCR Client Registration', 'Dynamic Request Builder', 'Latency & Status Telemetry', 'Scope Configuration'],
    component: CitiSandboxTesterApp,
  },
  {
    id: 'citibank-dubai',
    name: 'Citibank Dubai EMEA Lending & Offer Acceptance',
    folder: 'packages/Citibank-dubai-main',
    category: 'EMEA Onboarding',
    badge: 'CITIBANK DUBAI / UAE',
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    icon: Globe2,
    description: 'Citibank Dubai / UAE EMEA application onboarding, offer acceptance, and pricing plan calculator.',
    endpoints: ['POST /api/accept-offer'],
    features: ['EMEA Loan Offer Acceptance', 'Pricing Plan Selector', 'Disbursement IBAN Link', 'Control Flow ID Verifier'],
    component: CitibankDubaiApp,
  },
  {
    id: 'fdx-bill-pay',
    name: 'FDX Bill Pay & Payee Management Hub',
    folder: 'packages/Fdx-bill-pay-main',
    category: 'Open Finance',
    badge: 'FDX V6 BILL PAY',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    icon: Receipt,
    description: 'Financial Data Exchange (FDX v6) bill pay gateway with payee directory, telemetry metrics, and scheduled disbursements.',
    endpoints: ['GET /api/payees', 'GET /api/payments'],
    features: ['Payee Directory Management', 'Payment Rails (ACH/RTP/Wire)', 'Latency Telemetry Charts', 'Session Cache'],
    component: FdxBillPayApp,
  },
  {
    id: 'hk-citi-cards',
    name: 'HK Citi Cards & Partner Products Explorer',
    folder: 'packages/Hk-Citi-cards-main',
    category: 'Cards & Credit',
    badge: 'HK CITI CARDS',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    icon: FileCode,
    description: 'Hong Kong Citi Cards partner API explorer with supplementary card flags, reward points, and statement details.',
    endpoints: ['POST /api/citi/cards'],
    features: ['PremierMiles & Cash Back Cards', 'Supplementary Card Flag Toggle', 'Raw JSON Inspector', 'Request History'],
    component: HkCitiCardsApp,
  },
  {
    id: 'jwt-decryption',
    name: 'Citi JWT Decryption & Signature Verifier',
    folder: 'packages/Jwt-decryption-app-for-Citibank--main',
    category: 'Security & Crypto',
    badge: 'JOSE JWE / JWS CRYPTO',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    icon: KeyRound,
    description: 'JWS/JWE token decrypter, claims inspector, and RSA/ECDSA key pair validation studio powered by Jose.',
    endpoints: ['Client-Side Crypto / Jose JWE Decrypt'],
    features: ['JWE Encrypted Payload Decryption', 'Claims & Header Parsing', 'Private Key Importer', 'Signature Verification'],
    component: JwtDecryptionApp,
  },
  {
    id: 'open-banking-citi',
    name: 'Open Bank Project & Commercial Paper Hub',
    folder: 'packages/Open-banking-Citibank-demo-business-app-main',
    category: 'Commercial Banking',
    badge: 'OBP & COMMERCIAL PAPER',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    icon: Building2,
    description: 'OBP Direct Login, multi-bank accounts, Commercial Paper notes issuance & Quantum Treasury Assistant.',
    endpoints: ['GET /api/config/status', 'POST /api/obp/*', 'GET/POST /api/commercial-paper/*'],
    features: ['OBP Direct Authentication', 'Commercial Paper Issuance & Yield Calc', 'Quantum Assistant AI Chat', 'Modern Treasury Sync'],
    component: OpenBankingApp,
  },
  {
    id: 'citi-partner-cards',
    name: 'Citi Partner Cards API Explorer',
    folder: 'packages/citi-partner-cards-api-explorer',
    category: 'Cards & Partner APIs',
    badge: 'CITI PARTNER CARDS',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    icon: CreditCard,
    description: 'Interactive Citi Partner Cards API Explorer with dynamic credentials, card visualizer, raw JSON response inspector, and request history.',
    endpoints: ['POST /api/citi/cards/details'],
    features: ['Dynamic Credentials Config', 'Card Visualizer Card', 'Raw JSON Response Inspector', 'Request History Logger'],
    component: CitiPartnerCardsApp,
  },
  {
    id: 'jocall3-portfolio',
    name: 'GitHub Portfolio Explorer & AI Storyteller',
    folder: 'packages/jocall3-portfolio-explorer',
    category: 'Developer & AI',
    badge: 'PORTFOLIO & GEMINI AI',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    icon: Code2,
    description: 'GitHub repository explorer with code tree file viewer, repository analytics, markdown renderer, and Gemini AI Storyteller.',
    endpoints: ['GET /api/github/repos', 'POST /api/gemini/story'],
    features: ['Repository Analytics Grid', 'Syntax File Viewer', 'Gemini AI Storyteller', 'Markdown Engine'],
    component: Jocall3PortfolioApp,
  },
  {
    id: 'autonomous-workflow',
    name: 'Autonomous AI Workflow & Code Canvas',
    folder: 'packages/copy-of-copy-of-copy-of-copy-of-workflow-of-autonomous-of-infiniteai-expandai',
    category: 'Autonomous AI',
    badge: 'AUTONOMOUS EXPANDAI',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    icon: Sparkles,
    description: 'Autonomous InfiniteAI & ExpandAI workspace featuring live code editor canvas, multi-file AI editing, and GitHub commit integration.',
    endpoints: ['POST /api/ai/plan-edit', 'POST /api/ai/bulk-edit', 'POST /api/github/commit'],
    features: ['Multi-File Bulk AI Editing', 'Live Editor Canvas', 'Branch & PR Manager', 'Interactive AI Chat'],
    component: AutonomousWorkflowApp,
  },
  {
    id: 'remix-autonomous-workflow',
    name: 'Remix InfiniteAI Workflow & Multi-Key Pool',
    folder: 'packages/remix_-copy-of-copy-of-copy-of-copy-of-workflow-of-autonomous-of-infiniteai-expandai',
    category: 'Autonomous AI',
    badge: 'REMIX INFINITE AI',
    badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
    icon: Zap,
    description: 'Advanced remix workflow engine with Gemini API key pooling, token estimation, multi-phase reasoning memory steps, and self-healing code repair.',
    endpoints: ['POST /api/ai/reasoning-step', 'POST /api/ai/key-pool', 'POST /api/ai/code-repair'],
    features: ['API Key Pooling Modal', 'Reasoning Memory Steps', 'Automated Code Repair', 'Token Usage Estimator'],
    component: RemixAutonomousWorkflowApp,
  },
  {
    id: 'hf-crypto-wallet',
    name: 'Paper Key Crypto Wallet & Camera Scanner',
    folder: 'packages/Hf-main',
    category: 'Web3 & Crypto',
    badge: 'WEB3 PAPER KEY SCANNER',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    icon: KeyRound,
    description: 'Web3 cold-storage paper key scanner, camera QR decoder, cryptographic wallet balance tracker, and AES-encrypted key vault.',
    endpoints: ['Ethers.js Client Web3', 'Camera QR Scanner', 'LocalStorage Encrypted Vault'],
    features: ['Webcam Paper Key Scanner', 'Ethers.js Wallet Engine', 'Multi-Wallet Dashboard', 'Real-time Balance Telemetry'],
    component: HfWalletApp,
  },
  {
    id: 'aibankinggod',
    name: 'Aquarius AI Sovereign Singularity & Banking OS',
    folder: 'packages/aibankingGod',
    category: 'Autonomous AI',
    badge: 'AQUARIUS AI SOVEREIGN',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    icon: Bot,
    description: 'Aquarius AI autonomous sovereign banking singularity with quantum assistant, FAPI 2.0 security, modern treasury ledger, Alpaca broker, and crypto cold-storage vault.',
    endpoints: ['POST /api/ai/singularity', 'POST /api/crypto/vault', 'POST /api/fapi/v2', 'GET /api/alpaca/broker'],
    features: ['Sovereign Singularity AI', 'Quantum Assistant & Ledger', 'Alpaca Broker & FAPI 2.0', 'Crypto Cold Storage Vault'],
    component: AquariusAppWrapper,
  },
];

interface IntegratedAppsHubProps {
  initialAppId?: PackageAppId;
  onNavigateToTab?: (tabName: string) => void;
}

export function IntegratedAppsHub({ initialAppId = 'all', onNavigateToTab }: IntegratedAppsHubProps) {
  const [selectedAppId, setSelectedAppId] = useState<PackageAppId>(initialAppId);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    if (initialAppId) {
      setSelectedAppId(initialAppId);
    }
  }, [initialAppId]);

  const categories = ['ALL', ...Array.from(new Set(INTEGRATED_PACKAGES.map((p) => p.category)))];

  const filteredPackages = INTEGRATED_PACKAGES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.endpoints.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const [activeHubView, setActiveHubView] = useState<'apps' | 'zip-explorer'>('apps');
  const selectedPackage = INTEGRATED_PACKAGES.find((p) => p.id === selectedAppId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Integrated Standalone Packages & Banking Apps
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {INTEGRATED_PACKAGES.length} APPS MOUNTED
                  </span>
                </h2>
                <p className="text-xs text-[#8B949E]">
                  All {INTEGRATED_PACKAGES.length} extracted applications from <code className="text-[#79C0FF] font-mono">/zip</code> are fully compiled as standalone modules, equipped with live Express proxy endpoints, and executable in high-fidelity sandbox mode.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats & View Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-[#0D1117] p-1 rounded-lg border border-[#30363D]">
              <button
                onClick={() => {
                  setActiveHubView('apps');
                  setSelectedAppId('all');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeHubView === 'apps'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[#8B949E] hover:text-white'
                }`}
              >
                Apps Catalog ({INTEGRATED_PACKAGES.length})
              </button>
              <button
                onClick={() => setActiveHubView('zip-explorer')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeHubView === 'zip-explorer'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-[#8B949E] hover:text-white'
                }`}
              >
                ZIP Dropzone & Code Tree
              </button>
            </div>
            <div className="h-4 w-px bg-[#30363D]" />
            <span className="text-xs text-[#8B949E] hidden sm:inline">
              Active:{' '}
              <strong className="text-white">
                {activeHubView === 'zip-explorer' ? 'Zero-Config ZIP Ingest' : selectedPackage ? selectedPackage.name : 'Catalog Overview'}
              </strong>
            </span>
          </div>
        </div>

        {/* Quick App Selector Pills (When in Apps Mode) */}
        {activeHubView === 'apps' && (
          <div className="mt-4 pt-4 border-t border-[#21262d] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedAppId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedAppId === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-[#0D1117] text-[#8B949E] hover:text-white border border-[#30363D]'
              }`}
            >
              Grid Catalog ({INTEGRATED_PACKAGES.length})
            </button>
            {INTEGRATED_PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              const isSelected = selectedAppId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedAppId(pkg.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold shadow-sm'
                      : 'bg-[#0D1117] text-[#8B949E] hover:text-white border border-[#30363D]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{pkg.name.split('&')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Render Mode: ZIP Dropzone & Code Tree Explorer */}
      {activeHubView === 'zip-explorer' && (
        <div className="space-y-4">
          <ExtractedAppsHub />
        </div>
      )}

      {/* Render Mode 1: Catalog Overview & App Launchpad */}
      {activeHubView === 'apps' && selectedAppId === 'all' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages, endpoints, features..."
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-[#30363D] text-white font-bold'
                      : 'text-[#8B949E] hover:text-white hover:bg-[#21262d]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of 10 Integrated Applications */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.id}
                  className="bg-[#161B22] rounded-xl border border-[#30363D] hover:border-sky-500/50 p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-sky-950/20 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-lg bg-[#21262d] text-sky-400 group-hover:bg-sky-500/20 transition-colors">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${pkg.badgeColor}`}>
                        {pkg.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-[#8B949E] mt-1 leading-relaxed line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#21262d]">
                      <p className="text-[11px] font-medium text-[#C9D1D9] flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Key Endpoints:</span>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.endpoints.map((ep, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-mono bg-[#0D1117] text-[#79C0FF] rounded border border-[#30363D]"
                          >
                            {ep}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <p className="text-[11px] font-medium text-[#C9D1D9] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Highlights:</span>
                      </p>
                      <ul className="text-[11px] text-[#8B949E] space-y-0.5 pl-4 list-disc">
                        {pkg.features.slice(0, 3).map((feat, fidx) => (
                          <li key={fidx}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#21262d] flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[#8B949E] truncate">
                      {pkg.folder}
                    </span>
                    <button
                      onClick={() => setSelectedAppId(pkg.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Launch App</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Render Mode 2: Full-Fidelity Standalone App Container */}
      {selectedAppId !== 'all' && selectedPackage && (
        <div className="space-y-4">
          {/* Sub-app Top Control Ribbon */}
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedAppId('all')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <span>← Back to Catalog</span>
              </button>
              <div className="h-4 w-px bg-[#30363D]" />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{selectedPackage.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${selectedPackage.badgeColor}`}>
                    STANDALONE MOUNTED
                  </span>
                </h3>
                <p className="text-[11px] text-[#8B949E]">
                  Module path: <code className="font-mono text-[#79C0FF]">{selectedPackage.folder}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Backend Endpoints Active</span>
              </span>
            </div>
          </div>

          {/* Render the actual sub-app component */}
          <div className="bg-[#0D1117] rounded-xl border border-[#30363D] p-1 shadow-inner overflow-hidden">
            <selectedPackage.component />
          </div>
        </div>
      )}
    </div>
  );
}

export default IntegratedAppsHub;

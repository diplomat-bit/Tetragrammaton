
import React from 'react';
import { View, Feature, ExternalApp } from './types';
import { 
  Layout, BrainCircuit, EyeOff, Sparkles, Mic, ShieldCheck, 
  Fingerprint, Database, TrendingUp, Command, Landmark,
  Settings, DatabaseZap, Megaphone, LifeBuoy, 
  ShieldAlert, Network, Cpu, Key, Rocket, Send,
  Zap, Hammer, Puzzle, Globe, Target, Box, Binary, Shield, Compass, Briefcase, Activity, Headphones, BarChart3, Lock, Users, Server, Award
} from 'lucide-react';

export interface NavSection {
  label: string;
  items: { id: string; label: string; icon: React.ReactNode }[];
}

export const NAV_SECTORS: NavSection[] = [
    {
        label: 'Command',
        items: [
            { id: View.WorkspaceNexus, label: 'Workspace Nexus (Drive)', icon: <Globe size={18} className="text-cyan-400" /> },
            { id: View.Dashboard, label: 'Sovereign Bridge', icon: <Layout size={18} /> },
            { id: View.CryptoVerifier, label: 'JWE / JWS Verifier', icon: <ShieldCheck size={18} className="text-emerald-400" /> },
            { id: View.BillingIdentity, label: 'Identity Vault', icon: <Lock size={18} className="text-indigo-400" /> },
            { id: View.PortalHub, label: 'Portal Constellation', icon: <Box size={18} className="text-yellow-400" /> },
            { id: View.DataIngest, label: 'Neural Ingest', icon: <DatabaseZap size={18} className="text-orange-400" /> },
            { id: View.AzureApps, label: 'Azure Directory', icon: <Server size={18} className="text-blue-400" /> },
            { id: View.FloridaVoter, label: 'FL 2026 Voter Registration', icon: <Award size={18} className="text-lime-400" /> },
        ]
    },
    {
        label: 'The Legions',
        items: [
            { id: View.LegionArchitect, label: 'L-I: Architect', icon: <BrainCircuit size={18} className="text-lime-400" /> },
            { id: View.LegionGhost, label: 'L-II: Ghost', icon: <EyeOff size={18} className="text-purple-400" /> },
            { id: View.LegionVisualizer, label: 'L-III: Visualizer', icon: <Sparkles size={18} className="text-pink-400" /> },
            { id: View.LegionVoice, label: 'L-IV: Voice', icon: <Mic size={18} className="text-emerald-400" /> },
            { id: View.LegionAuditor, label: 'L-V: Auditor', icon: <ShieldCheck size={18} className="text-blue-400" /> },
            { id: View.LegionLive, label: 'L-VI: Live Communion', icon: <Headphones size={18} className="text-cyan-400" /> },
        ]
    },
    {
        label: 'Sovereignty Core',
        items: [
            { id: View.IdentityCitadel, label: 'ID Citadel', icon: <Fingerprint size={18} className="text-teal-400" /> },
            { id: View.RecoveryMesh, label: 'Recovery Mesh', icon: <LifeBuoy size={18} className="text-orange-400" /> },
            { id: View.PrivacyGuardian, label: 'Privacy Blinder', icon: <Shield size={18} className="text-indigo-400" /> },
            { id: View.TrustRegistry, label: 'Trust Registry', icon: <Network size={18} className="text-blue-400" /> },
        ]
    },
    {
        label: 'Asset Forge',
        items: [
            { id: View.WealthNexus, label: 'Capital Nexus', icon: <TrendingUp size={18} className="text-green-400" /> },
            { id: View.TokenIssuance, label: 'Asset Forge', icon: <Binary size={18} className="text-yellow-400" /> },
            { id: View.MarketingAutomation, label: 'Growth Hub', icon: <Megaphone size={18} className="text-pink-400" /> },
        ]
    },
    {
        label: 'Intelligence',
        items: [
            { id: View.SovereignIntelligence, label: 'Sovereign Intelligence', icon: <ShieldAlert size={18} className="text-red-500" /> },
            { id: View.UniverseGraph, label: 'Universe Graph 3D', icon: <Network size={18} className="text-purple-400" /> },
            { id: View.AriaComms, label: 'Aria Neural Comms', icon: <Headphones size={18} className="text-pink-400" /> },
            { id: View.IntelligenceHub, label: 'Intelligence Core', icon: <Cpu size={18} className="text-cyan-400" /> },
            { id: View.NeuralTools, label: 'Neural Tools', icon: <Zap size={18} className="text-yellow-400" /> },
            { id: View.NexusBuilder, label: 'Nexus Forge', icon: <Hammer size={18} className="text-gray-400" /> },
        ]
    },
    {
        label: 'Governance & Audits',
        items: [
            { id: View.ImpeachmentGenerator, label: 'Impeachment Audit', icon: <ShieldAlert size={18} className="text-amber-400" /> },
            { id: View.ContractorLobbying, label: 'Contractor Lobbying ROI', icon: <BarChart3 size={18} className="text-lime-400" /> },
            { id: View.SentryEngine, label: 'ISO20022 Sentry Engine', icon: <Lock size={18} className="text-cyan-400" /> },
        ]
    },
    {
        label: 'Citi Treasury & Alpaca Suite',
        items: [
            { id: View.SovereignMarketTakeover, label: 'Market Takeover Hub', icon: <Globe size={18} className="text-yellow-400" /> },
            { id: View.PlaidAlpacaBridge, label: 'Plaid-Alpaca Bridge', icon: <Zap size={18} className="text-emerald-400" /> },
            { id: View.StripeAlpacaBridge, label: 'Stripe-Alpaca Bridge', icon: <Send size={18} className="text-indigo-400" /> },
            { id: View.CitiAlpacaBridge, label: 'Citi-Alpaca Bridge', icon: <Landmark size={18} className="text-cyan-400" /> },
            { id: View.AlpacaBroker, label: 'Alpaca Broker API Suite', icon: <TrendingUp size={18} className="text-yellow-400" /> },
            { id: View.AlpacaAccounts, label: 'Alpaca Account & KYC', icon: <Shield size={18} className="text-yellow-400" /> },
            { id: View.AlpacaTrading, label: 'Alpaca Trading Terminal', icon: <TrendingUp size={18} className="text-emerald-400" /> },
            { id: View.AlpacaFunding, label: 'Alpaca Funding Hub', icon: <Landmark size={18} className="text-cyan-400" /> },
            { id: View.AlpacaJournals, label: 'Alpaca Sovereign Journals', icon: <Activity size={18} className="text-yellow-400" /> },
            { id: View.AlpacaRebalancing, label: 'Alpaca Rebalancing Engine', icon: <Activity size={18} className="text-purple-400" /> },
            { id: View.AlpacaTokenization, label: 'Alpaca RWA Tokenization', icon: <Shield size={18} className="text-pink-400" /> },
            { id: View.AlpacaIpoMarketplace, label: 'Alpaca IPO Marketplace', icon: <Rocket size={18} className="text-amber-400" /> },
            { id: View.AlpacaCryptoWallets, label: 'Alpaca Crypto Wallets', icon: <Lock size={18} className="text-purple-400" /> },
            { id: View.AlpacaReporting, label: 'Alpaca EOD Reporting', icon: <Activity size={18} className="text-emerald-400" /> },
            { id: View.ModernTreasuryLedger, label: 'Modern Treasury Ledger', icon: <Landmark size={18} className="text-cyan-400" /> },
            { id: View.CitiUkInternationalPayments, label: 'Citi UK International Payments', icon: <Send size={18} className="text-emerald-400" /> },
            { id: View.FapiPipeline, label: 'FAPI 2.0 Security Pipeline', icon: <Shield size={18} className="text-emerald-400" /> },
            { id: View.CitiConnectInitiation, label: 'Payment Initiation', icon: <Rocket size={18} className="text-emerald-400" /> },
            { id: View.CitiConnectInquiry, label: 'Status Inquiry', icon: <Activity size={18} className="text-blue-400" /> },
            { id: View.CitiConnectNotifications, label: 'Push Alerts', icon: <Megaphone size={18} className="text-pink-400" /> },
            { id: View.CitiTreasury, label: 'Treasury Command', icon: <Landmark size={18} className="text-amber-400" /> },
            { id: View.CitiPartnerHub, label: 'Citi Partner API Transactions', icon: <Landmark size={18} className="text-cyan-400" /> },
        ]
    },
    {
        label: 'Operations',
        items: [
            { id: View.CitiGateway, label: 'Citi Sovereign Gateway', icon: <Landmark size={18} className="text-blue-400" /> },
            { id: View.WorkspaceNexus, label: 'Workspace Nexus', icon: <Globe size={18} className="text-blue-400" /> },
            { id: View.GcpInventory, label: 'Cloud Infrastructure', icon: <DatabaseZap size={18} className="text-orange-300" /> },
            { id: View.InstitutionalHub, label: 'Institutional Hub', icon: <Command size={18} className="text-cyan-400" /> },
            { id: View.GlobalLedger, label: 'Global Ledger', icon: <Database size={18} /> },
            { id: View.AstraDBQuickstart, label: 'Astra DB Quickstart', icon: <DatabaseZap size={18} className="text-emerald-400" /> },
            { id: View.IntegrationsMarketplace, label: 'Integrations', icon: <Puzzle size={18} className="text-purple-400" /> },
        ]
    },
    {
        label: 'System',
        items: [
            { id: View.Rewards, label: 'Rewards Hub', icon: <Target size={18} className="text-red-400" /> },
            { id: View.TheVision, label: 'The Manifesto', icon: <Compass size={18} className="text-lime-400" /> },
            { id: View.PaymentMethods, label: 'Payment Gateways', icon: <Briefcase size={18} className="text-indigo-400" /> },
            { id: View.Settings, label: 'Core Settings', icon: <Settings size={18} className="text-gray-500" /> },
        ]
    }
];

export const NAV_ITEMS = NAV_SECTORS.flatMap(s => s.items);

export const SOVEREIGN_APPS: ExternalApp[] = [
  { id: 'app-01', name: 'Executive Bridge Control', description: 'Primary OS interface for billionaire-tier asset management.', category: 'Security', viewId: View.Dashboard },
  { id: 'app-02', name: "The Sovereign's Ledger", description: 'Atomic-settlement transaction stream for verified architects.', category: 'Banking', viewId: View.GlobalLedger },
  { id: 'app-03', name: 'Intelligence Nexus', description: 'Deep-learning hub for portfolio trajectory and risk vectors.', category: 'AI', viewId: View.IntelligenceHub },
  { id: 'app-04', name: 'Legion I: Architect', description: 'Strategic reasoning engine for high-fidelity venture forge.', category: 'AI', viewId: View.LegionArchitect, isPremium: true },
  { id: 'app-05', name: 'Neural Recovery Mesh', description: 'Shamir-secret-sharing protocol for hardware-bound identity.', category: 'Security', viewId: View.RecoveryMesh },
  { id: 'app-06', name: 'Asset Forge v2.0', description: 'Multi-chain token issuance with AI-driven economic modeling.', category: 'Banking', viewId: View.TokenIssuance },
  { id: 'app-07', name: 'Global Command Integrations', description: 'Connect third-party enterprise meshes to the Sovereign Hub.', category: 'Dev', viewId: View.IntegrationsMarketplace },
  { id: 'app-08', name: 'Legion VI: Live Communion', description: 'Real-time low-latency voice interface with Gemini Core.', category: 'AI', viewId: View.LegionLive },
  { id: 'app-09', name: 'Neural Tools Suite', description: 'Low-level utilities for token estimation and topic distillation.', category: 'Dev', viewId: View.NeuralTools },
  { id: 'app-10', name: 'Identity Citadel', description: 'TEE hardware-bound root of trust for all user interactions.', category: 'Security', viewId: View.IdentityCitadel },
  
  // --- Integrated admin08077 Spaces ---
  { id: "AIBANKINGUNIVERSITY", name: "AI Banking University", description: "Comprehensive syllabus to AI_BANKING_9999 protocols.", category: "AI", isPremium: true },
  { id: "AIBANKINGUNIVERSITY-AI-AGENT-APP", name: "AI Agent App", description: "Specialized agent demonstration for James Burvel O'Callaghan III.", category: "AI", isPremium: true },
  { id: "Aiab", name: "Aiab Finance", description: "Personal finance management via sovereign Demo Bank interface.", category: "Banking" },
  { id: "Aib8nking", name: "Aib8nking", description: "Core finance management and settlement system.", category: "Banking" },
  { id: "Aibankdemo2", name: "Linked Ledger v2", description: "Advanced visualization for multiple linked bank accounts.", category: "Banking" },
  { id: "Aimobile", name: "AI Mobile Architect", description: "Context-aware code suggestions for sovereign mobile development.", category: "Dev" },
  { id: "Bb", name: "Bb Core UI", description: "Foundation UI components for the Demo Bank ecosystem.", category: "Dev" },
  { id: "Githubgemini", name: "GitHub Gemini Node", description: "Autonomous pull, recode, and push logic for neural repos.", category: "Dev", isPremium: true },
  { id: "Jamesocallaghanprivatebank", name: "Private Banking Citadel", description: "High-net-worth specialized banking interface.", category: "Banking", isPremium: true },
  { id: "Jbo3", name: "Jbo3 Data Matrix", description: "High-fidelity financial data visualization engine.", category: "Dev" },
  { id: "Jbo33", name: "Jbo33 Analytics", description: "Deep-learning analytics for market trajectory monitoring.", category: "AI" },
  { id: "NewWa", name: "Neural Markdown", description: "AI-enhanced markdown rendering engine.", category: "Dev" },
  { id: "Worldsfirstautonomousbank", name: "Autonomous Bank Hub", description: "Master configurations for self-governing financial spaces.", category: "Security", isPremium: true },
  { id: "Ai", name: "Core Neural Engine", description: "Base intelligence unit for the Aquarius Singularity.", category: "AI" },
  { id: "Ai-Banking-Sovereign", name: "Sovereign Banking Core", description: "Low-level banking logic for independent financial states.", category: "Security" },
  { id: "Aibankdemo", name: "Classic Banking Portal", description: "Simulated legacy banking interface for compatibility testing.", category: "Banking" },
  { id: "Aibanke", name: "Aibanke Insights", description: "Predictive banking insights and spending analysis.", category: "AI" },
  { id: "Aibankingdemo", name: "Secure Insights Node", description: "Encrypted financial analytics for verified visionary accounts.", category: "Security" },
  { id: "Aibankingthedemo", name: "Rapid Demo Node", description: "High-speed demonstration of AI banking capabilities.", category: "Banking" },
  { id: "Aidev", name: "DevCore AI Toolkit", description: "Neural development utilities for sovereign engineers.", category: "Dev" },
  { id: "Quantum-Code-Architect", name: "Quantum Code Forge", description: "Next-gen code engineering and symbolic reasoning.", category: "Dev", isPremium: true },
  { id: "Aippk", name: "Advanced Neural PPK", description: "Hardware-bound identity and key management.", category: "Security" },
  { id: "Airenderer", name: "AI Document Factory", description: "Markdown to high-fidelity HTML conversion engine.", category: "Dev" },
  { id: "Aitr", name: "Neural Chat Matrix", description: "Advanced conversational interface for AI communion.", category: "AI" },
  { id: "Apiai", name: "API Sovereign Gateway", description: "Centralized control for external neural service links.", category: "Dev" },
  { id: "THEUNORTHODOXCHRONICLESOFKAIANDHIS100ADVERSARIALAIAGENTS", name: "Adversarial Agents Hub", description: "The Unorthodox Chronicles: 100 agent logic simulator.", category: "AI", isPremium: true },
  { id: "Cc", name: "System Command Center", description: "Global monitoring and execution hub.", category: "Security" },
  { id: "Chatbot", name: "Legacy Chat Node", description: "Fallback conversational unit for standard banking queries.", category: "AI" },
  { id: "Chrome-Flags", name: "System Flag Registry", description: "Kernel-level system feature management.", category: "Dev" },
  { id: "Convo", name: "Convo Assistant", description: "Real-time pair-programming and code assistance.", category: "Dev" },
  { id: "D", name: "Aesthetic Gradient Engine", description: "Dynamic color and theme generation based on neural mood.", category: "Dev" },
  { id: "Demob", name: "Demo B Shard", description: "Isolated testing environment for beta banking modules.", category: "Banking" },
  { id: "Demoo", name: "Snippet Repository", description: "Collective intelligence code shard library.", category: "Dev" },
  { id: "Drip-Faucet", name: "Token Drip Faucet", description: "Test token issuance for sovereign DLT networks.", category: "Banking" },
  { id: "Fr", name: "FR Logic Interface", description: "Financial Relationship monitoring and mapping.", category: "Banking" },
  { id: "Genai", name: "Website Materializer", description: "Generative AI engine for rapid website prototyping.", category: "Dev" },
  { id: "Hhh", name: "Personal Wealth Matrix", description: "High-density personal finance tracker.", category: "Banking" },
  { id: "Inventions", name: "Venture Visualizer", description: "3D visualization of capital invention trajectories.", category: "Dev" },
  { id: "James", name: "Brilliance Engine", description: "High-order reasoning and creativity booster.", category: "AI" },
  { id: "Javascript-Python", name: "Polyglot Compiler", description: "Browser-based execution for multi-language shards.", category: "Dev" },
  { id: "Jocall3", name: "Portfolio Oracle", description: "AI-driven optimization for multi-chain asset portfolios.", category: "AI" },
  { id: "Learnhebrew", name: "Linguistic Portal", description: "Language acquisition module for global visionary expansion.", category: "Legacy" },
  { id: "Merrychristmas", name: "Seasonal Logic", description: "Context-aware seasonal UI and greeting protocols.", category: "Legacy" },
  { id: "Model", name: "Model Architecture Hub", description: "Interface for selecting and tuning active AI models.", category: "AI" },
  { id: "Monetize", name: "Yield Mapping Console", description: "Advanced financial metrics for monetization strategy.", category: "Banking" },
  { id: "Multi", name: "Multi-Tool Shard", description: "Versatile utility collection for system maintenance.", category: "Dev" },
  { id: "Mvp", name: "MVP Genesis Node", description: "The foundation of the sovereign application ecosystem.", category: "Dev" },
  { id: "Neww", name: "System Update Relay", description: "Centralized notification for new software updates.", category: "Dev" },
  { id: "Omniapi", name: "Universal API Bridge", description: "Inter-node communication for heterogeneous systems.", category: "Dev" },
  { id: "Openapi", name: "API Documentation Sanctum", description: "Source of truth for all integrated service documentation.", category: "Dev" },
  { id: "Pic-Editor", name: "Visual Studio Node", description: "AI-enhanced image editing and manipulation.", category: "AI" },
  { id: "Picgenai", name: "3D Image Forge", description: "High-fidelity 3D and 2D asset generation.", category: "AI" },
  { id: "Projectatlas", name: "Project Atlas", description: "Global mapping of financial and compute power.", category: "AI" },
  { id: "Quantumbank", name: "Quantum Banking Node", description: "Next-gen banking using quantum-resistant logic.", category: "Banking" },
  { id: "Remix-Eth", name: "Smart Contract Forge", description: "On-chain logic development for Ethereum-compatible chains.", category: "Banking" },
  { id: "Static", name: "Visual Telemetry Node", description: "Static visualization of complex system flows.", category: "Dev" },
  { id: "Test", name: "System Diagnostics", description: "Comprehensive health checks for the OS core.", category: "Security" },
  { id: "Trainn", name: "No-Code AI Studio", description: "Empowering non-technical visionaries with neural logic.", category: "AI" },
  { id: "Trainn", name: "No-Code AI Studio", description: "Empowering non-technical visionaries with neural logic.", category: "AI" },
  { id: "Transactpro", name: "Atomic Transaction Engine", description: "High-throughput settlement engine for verified entities.", category: "Banking" },
  { id: "Veo", name: "Grounded Response Node", description: "AI responses validated against real-time web grounding.", category: "AI" },
  { id: "Webgenai", name: "Dynamic Web Forge", description: "AI-driven deployment of dynamic web applications.", category: "Dev" },
  { id: "Wf", name: "Workflow Architect", description: "Visual mapping and execution of automated business logic.", category: "Dev" },
];

export const banks = [
  { name: 'Chase', logo: <ShieldCheck size={24} className="text-blue-800" />, institution_id: 'ins_2' },
  { name: 'Bank of America', logo: <Target size={24} className="text-red-600" />, institution_id: 'ins_3' },
  { name: 'Wells Fargo', logo: <Zap size={24} className="text-yellow-600" />, institution_id: 'ins_4' },
];

export const ALL_FEATURES: Feature[] = [
  { id: 'feat_1', name: 'Neural Predictor', icon: '🧠', category: 'Intel', description: 'Real-time market forecasting' },
  { id: 'feat_2', name: 'Quantum Shield', icon: '🛡️', category: 'Vault', description: 'Advanced cryptographic protection' },
  { id: 'feat_3', name: 'Liquidity Bridge', icon: '🌉', category: 'Flow', description: 'Atomic cross-chain swaps' },
  { id: 'feat_4', name: 'Protocol Forge', icon: '🔨', category: 'Forge', description: 'Custom smart contract generation' },
  { id: 'feat_5', name: 'Sovereign ID', icon: '🆔', category: 'Core', description: 'Hardware-bound identity' },
  { id: 'feat_6', name: 'Data Mesh', icon: '🕸️', category: 'Mesh', description: 'Institutional data integration' },
];

export type SlotCategory = 'Core' | 'Intel' | 'Vault' | 'Flow' | 'Mesh' | 'Forge';
export const SLOTS: SlotCategory[] = ['Core', 'Intel', 'Vault', 'Flow', 'Mesh', 'Forge'];

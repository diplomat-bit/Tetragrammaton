import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CredentialsModal } from './components/CredentialsModal';
import { TransferModal } from './components/TransferModal';
import { LiveTelemetryModal } from './components/LiveTelemetryModal';
import { DashboardTab } from './components/DashboardTab';
import { OpenBankProjectTab } from './components/OpenBankProjectTab';
import { CommercialPaperTab } from './components/CommercialPaperTab';
import { ModernTreasuryTab } from './components/ModernTreasuryTab';
import { QuantumAssistantTab } from './components/QuantumAssistantTab';
import { DeveloperGuideTab } from './components/DeveloperGuideTab';
import { api } from './services/api';
import {
  ConfigStatus,
  OBPBank,
  OBPAccount,
  OBPTransaction,
  OBPCustomer,
  OBPBranch,
  OBPProduct,
  CommercialPaperNote,
  ModernTreasuryLedger,
  ModernTreasuryPaymentOrder,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState<boolean>(false);
  const [transferInitialAccountId, setTransferInitialAccountId] = useState<string | undefined>(undefined);

  // Application Data States
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [banks, setBanks] = useState<OBPBank[]>([]);
  const [accounts, setAccounts] = useState<OBPAccount[]>([]);
  const [transactions, setTransactions] = useState<OBPTransaction[]>([]);
  const [customers, setCustomers] = useState<OBPCustomer[]>([]);
  const [branches, setBranches] = useState<OBPBranch[]>([]);
  const [products, setProducts] = useState<OBPProduct[]>([]);
  const [cpNotes, setCpNotes] = useState<CommercialPaperNote[]>([]);
  const [mtLedger, setMtLedger] = useState<ModernTreasuryLedger | null>(null);
  const [paymentOrders, setPaymentOrders] = useState<ModernTreasuryPaymentOrder[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadAllData = useCallback(async () => {
    try {
      const [
        cfg,
        bks,
        accs,
        txs,
        custs,
        brs,
        prds,
        cps,
        ldgr,
        pos,
      ] = await Promise.all([
        api.getConfigStatus().catch(() => null),
        api.getBanks().catch(() => ({ banks: [] })),
        api.getAccounts().catch(() => ({ accounts: [] })),
        api.getTransactions().catch(() => ({ transactions: [] })),
        api.getCustomers().catch(() => ({ customers: [] })),
        api.getBranches().catch(() => ({ branches: [] })),
        api.getProducts().catch(() => ({ products: [] })),
        api.getCommercialPaperNotes().catch(() => ({ notes: [] })),
        api.getLedger().catch(() => ({ ledger: null })),
        api.getPaymentOrders().catch(() => ({ paymentOrders: [] })),
      ]);

      if (cfg) setConfigStatus(cfg);
      if (bks?.banks) setBanks(bks.banks);
      if (accs?.accounts) setAccounts(accs.accounts);
      if (txs?.transactions) setTransactions(txs.transactions);
      if (custs?.customers) setCustomers(custs.customers);
      if (brs?.branches) setBranches(brs.branches);
      if (prds?.products) setProducts(prds.products);
      if (cps?.notes) setCpNotes(cps.notes);
      if (ldgr?.ledger) setMtLedger(ldgr.ledger);
      if (pos?.paymentOrders) setPaymentOrders(pos.paymentOrders);
    } catch (err) {
      console.error('Error fetching banking application data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAllData();
  };

  const handleOpenTransferModal = (accountId?: string) => {
    setTransferInitialAccountId(accountId);
    setIsTransferModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Frosted Glass Background Ambient Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[130px]" />
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-cyan-500/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-[25%] left-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Application Navigation & Credentials Status Bar */}
      <div className="relative z-40">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCredentials={() => setIsCredentialsModalOpen(true)}
          onOpenTelemetry={() => setIsTelemetryModalOpen(true)}
          configStatus={configStatus}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* Main Content View Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-cyan-500/20" />
            <p className="text-sm font-mono text-slate-300">
              Connecting to Citibank Demo Business Desk & Open Bank Project...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab
                accounts={accounts}
                cpNotes={cpNotes}
                mtLedger={mtLedger}
                transactions={transactions}
                onNavigateTab={setActiveTab}
                onOpenTransferModal={handleOpenTransferModal}
              />
            )}

            {activeTab === 'obp' && (
              <OpenBankProjectTab
                banks={banks}
                accounts={accounts}
                transactions={transactions}
                customers={customers}
                branches={branches}
                products={products}
                onOpenTransferModal={handleOpenTransferModal}
                onOpenCredentialsModal={() => setIsCredentialsModalOpen(true)}
                onOpenTelemetryModal={() => setIsTelemetryModalOpen(true)}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            )}

            {activeTab === 'commercial-paper' && (
              <CommercialPaperTab
                notes={cpNotes}
                accounts={accounts}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            )}

            {activeTab === 'modern-treasury' && (
              <ModernTreasuryTab
                ledger={mtLedger}
                paymentOrders={paymentOrders}
                accounts={accounts}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            )}

            {activeTab === 'quantum-assistant' && (
              <QuantumAssistantTab
                accounts={accounts}
                cpNotes={cpNotes}
                mtLedger={mtLedger}
              />
            )}

            {activeTab === 'developer-guide' && (
              <DeveloperGuideTab
                configStatus={configStatus}
                onOpenCredentials={() => setIsCredentialsModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <CredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        configStatus={configStatus}
        onRefresh={handleRefresh}
        onOpenTelemetry={() => {
          setIsCredentialsModalOpen(false);
          setIsTelemetryModalOpen(true);
        }}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        accounts={accounts}
        initialFromAccountId={transferInitialAccountId}
        onSuccess={handleRefresh}
      />

      <LiveTelemetryModal
        isOpen={isTelemetryModalOpen}
        onClose={() => setIsTelemetryModalOpen(false)}
      />
    </div>
  );
}

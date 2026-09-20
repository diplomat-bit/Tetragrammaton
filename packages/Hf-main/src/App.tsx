import React, { useState, useEffect } from "react";
import { SavedWallet } from "./types";
import { CameraScanner } from "./components/CameraScanner";
import { WalletDashboard } from "./components/WalletDashboard";
import { SavedWallets } from "./components/SavedWallets";
import { ethers } from "ethers";
import { KeyRound, Shield, Wallet, Sparkles, ScanLine } from "lucide-react";

export default function App() {
  const [wallets, setWallets] = useState<SavedWallet[]>(() => {
    try {
      const saved = localStorage.getItem("paper_key_wallets");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [activeWalletId, setActiveWalletId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<"scanner" | "dashboard" | "saved">(wallets.length > 0 ? "saved" : "scanner");

  useEffect(() => {
    try {
      localStorage.setItem("paper_key_wallets", JSON.stringify(wallets));
    } catch (e) {
      console.error(e);
    }
  }, [wallets]);

  const handleWalletScanned = (privateKey: string, name?: string) => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const address = wallet.address;

      // Check if already exists
      const existing = wallets.find((w) => w.address.toLowerCase() === address.toLowerCase());
      if (existing) {
        setActiveWalletId(existing.id);
        setCurrentTab("dashboard");
        return;
      }

      const newWallet: SavedWallet = {
        id: "w_" + Math.random().toString(36).substring(2, 9),
        name: name || `Paper Wallet ${wallets.length + 1}`,
        privateKey,
        address,
        addedAt: Date.now(),
      };

      const updated = [newWallet, ...wallets];
      setWallets(updated);
      setActiveWalletId(newWallet.id);
      setCurrentTab("dashboard");
    } catch (e) {
      alert("Invalid private key derivation.");
    }
  };

  const handleDeleteWallet = (id: string) => {
    const updated = wallets.filter((w) => w.id !== id);
    setWallets(updated);
    if (activeWalletId === id) {
      setActiveWalletId(null);
      setCurrentTab(updated.length > 0 ? "saved" : "scanner");
    }
  };

  const activeWallet = wallets.find((w) => w.id === activeWalletId) || wallets[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab(wallets.length > 0 ? "saved" : "scanner")}>
          <div className="w-8 h-8 bg-sky-500 rounded-sm flex items-center justify-center transform rotate-45 shadow-lg shadow-sky-500/20">
            <div className="w-4 h-4 bg-slate-950 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight">HEXA<span className="text-sky-400">SCAN</span></span>
        </div>

        <nav className="flex items-center space-x-2 text-sm font-medium">
          <button
            onClick={() => setCurrentTab("scanner")}
            className={`px-4 py-2 rounded-sm text-xs font-mono tracking-wider transition-colors ${
              currentTab === "scanner"
                ? "bg-sky-600 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            SCANNER
          </button>

          {wallets.length > 0 && (
            <>
              <button
                onClick={() => {
                  if (activeWallet) {
                    setActiveWalletId(activeWallet.id);
                    setCurrentTab("dashboard");
                  }
                }}
                disabled={!activeWallet}
                className={`px-4 py-2 rounded-sm text-xs font-mono tracking-wider transition-colors ${
                  currentTab === "dashboard"
                    ? "bg-sky-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                WALLET
              </button>

              <button
                onClick={() => setCurrentTab("saved")}
                className={`px-4 py-2 rounded-sm text-xs font-mono tracking-wider transition-colors ${
                  currentTab === "saved"
                    ? "bg-sky-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                SAVED ({wallets.length})
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-slate-300">MAINNET ONLINE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {currentTab === "scanner" && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-xs font-mono text-sky-400 uppercase tracking-[0.2em] mb-2">
                CRYPTOGRAPHIC ENCLAVE
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-white">
                Scan Paper Private Key
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-2">
                Position 64-digit segment in camera framing or upload backup card. Gemini Vision AI extracts keys securely client-side.
              </p>
            </div>
            <CameraScanner onWalletScanned={handleWalletScanned} />
          </div>
        )}

        {currentTab === "dashboard" && activeWallet && (
          <WalletDashboard
            wallet={activeWallet}
            onBackToScan={() => setCurrentTab("scanner")}
            onRemoveWallet={handleDeleteWallet}
          />
        )}

        {currentTab === "saved" && (
          <SavedWallets
            wallets={wallets}
            activeWalletId={activeWalletId}
            onSelectWallet={(w) => {
              setActiveWalletId(w.id);
              setCurrentTab("dashboard");
            }}
            onDeleteWallet={handleDeleteWallet}
            onAddNew={() => setCurrentTab("scanner")}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="h-10 bg-slate-950 border-t border-slate-800 px-8 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex space-x-4">
          <span>GAS: 24 GWEI</span>
          <span className="text-sky-400">BLOCK #18420951</span>
        </div>
        <div className="flex space-x-4">
          <span>SECURE ENCLAVE ACTIVE</span>
          <span>V.2.4.0-STABLE</span>
        </div>
      </footer>
    </div>
  );
}


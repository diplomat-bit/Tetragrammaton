import React from "react";
import { SavedWallet } from "../types";
import { KeyRound, Wallet, Trash2, ArrowRight, Shield } from "lucide-react";

interface SavedWalletsProps {
  wallets: SavedWallet[];
  activeWalletId: string | null;
  onSelectWallet: (wallet: SavedWallet) => void;
  onDeleteWallet: (id: string) => void;
  onAddNew: () => void;
}

export const SavedWallets: React.FC<SavedWalletsProps> = ({
  wallets,
  activeWalletId,
  onSelectWallet,
  onDeleteWallet,
  onAddNew,
}) => {
  if (wallets.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-slate-900 border border-slate-800 rounded-sm p-8">
        <KeyRound className="w-16 h-16 mx-auto mb-4 text-sky-400 opacity-80" />
        <h3 className="text-xl font-bold text-white mb-2">No Paper Wallets Saved Yet</h3>
        <p className="text-xs font-mono text-slate-400 mb-6 max-w-md mx-auto">
          Scan your paper private keys using your camera or upload a photo to instantly derive your Ethereum wallet and pull blockchain balances.
        </p>
        <button
          onClick={onAddNew}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold rounded-sm transition-colors"
        >
          SCAN YOUR FIRST PAPER KEY
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">SAVED PAPER WALLETS</h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Select a scanned wallet to view its live blockchain portfolio and transactions.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold rounded-sm transition-colors flex items-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          SCAN NEW KEY
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map((wallet) => {
          const isActive = activeWalletId === wallet.id;
          return (
            <div
              key={wallet.id}
              className={`bg-slate-900 border rounded-sm p-6 transition-all flex flex-col justify-between ${
                isActive
                  ? "border-sky-500 ring-1 ring-sky-500/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sky-500/10 border border-sky-500/30 rounded-sm flex items-center justify-center text-sky-400">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{wallet.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500">
                        Added {new Date(wallet.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-sm">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-sky-400 break-all">
                  {wallet.address}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onDeleteWallet(wallet.id)}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> REMOVE
                </button>
                <button
                  onClick={() => onSelectWallet(wallet)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold rounded-sm flex items-center gap-1.5 transition-colors"
                >
                  OPEN DASHBOARD <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


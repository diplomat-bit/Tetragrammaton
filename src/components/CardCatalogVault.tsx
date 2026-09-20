import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Download,
  Plus,
  Terminal,
  Search,
  Shield,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Cpu,
  FileSpreadsheet,
  FileCode,
  Building2,
  HardDrive
} from 'lucide-react';

interface CatalogCardItem {
  id: string;
  name: string;
  bankName: string;
  accountNumberMasked: string;
  routingNumber?: string;
  cardType: 'CREDIT' | 'DEBIT' | 'PREPAID' | 'VIRTUAL' | 'COMMERCIAL';
  cardNetwork: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'CITI' | 'CHASE' | 'FDX';
  track1: string;
  track2: string;
  track3: string;
  expiryDate: string;
  cardholderName: string;
  creditLimit?: number;
  balance?: number;
  status: 'ACTIVE' | 'LOCKED' | 'EXPIRED' | 'ENCODED';
  createdAt: string;
  notes?: string;
}

export function CardCatalogVault() {
  const [cards, setCards] = useState<CatalogCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ALL');
  const [activeModal, setActiveModal] = useState<'add' | 'encode' | null>(null);
  const [selectedCard, setSelectedCard] = useState<CatalogCardItem | null>(null);
  const [encodingResult, setEncodingResult] = useState<any>(null);

  // Form state for adding/editing card
  const [formName, setFormName] = useState('');
  const [formBankName, setFormBankName] = useState('Citibank N.A.');
  const [formCardNumber, setFormCardNumber] = useState('4412 5873 8523 16F2');
  const [formRouting, setFormRouting] = useState('121000358');
  const [formCardType, setFormCardType] = useState<'CREDIT' | 'DEBIT' | 'COMMERCIAL'>('CREDIT');
  const [formNetwork, setFormNetwork] = useState<'VISA' | 'MASTERCARD' | 'CITI' | 'CHASE' | 'FDX'>('CITI');
  const [formHolder, setFormHolder] = useState('JOHN DOE');
  const [formExpiry, setFormExpiry] = useState('12/28');
  const [formLimit, setFormLimit] = useState('25000');
  const [formBalance, setFormBalance] = useState('1240.50');
  const [formTrack1, setFormTrack1] = useState('%B44125873852316F^JOHN DOE^281220100000?');
  const [formTrack2, setFormTrack2] = useState(';44125873852316F281220100000?');
  const [formTrack3, setFormTrack3] = useState(';00000000000000000000?');
  const [formNotes, setFormNotes] = useState('');

  const fetchCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/card-catalog');
      const data = await res.json();
      if (data.success) {
        setCards(data.items);
      } else {
        setError(data.error || 'Failed to load card catalog.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error loading catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formName,
        bankName: formBankName,
        accountNumberMasked: `•••• •••• •••• ${formCardNumber.slice(-4)}`,
        routingNumber: formRouting,
        cardType: formCardType,
        cardNetwork: formNetwork,
        cardholderName: formHolder,
        expiryDate: formExpiry,
        creditLimit: Number(formLimit),
        balance: Number(formBalance),
        track1: formTrack1,
        track2: formTrack2,
        track3: formTrack3,
        notes: formNotes,
        status: 'ACTIVE'
      };

      const res = await fetch('/api/card-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setActiveModal(null);
        fetchCatalog();
        // Reset form
        setFormName('');
        setFormNotes('');
      } else {
        alert(data.error || 'Failed to save card.');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card and bank account from the catalog?')) return;
    try {
      const res = await fetch(`/api/card-catalog/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCatalog();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTriggerEncode = async (card: CatalogCardItem) => {
    setSelectedCard(card);
    setActiveModal('encode');
    setEncodingResult(null);
    try {
      const res = await fetch('/api/card-catalog/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: card.id,
          action: 'write_iso',
          track1: card.track1,
          track2: card.track2,
          track3: card.track3
        })
      });
      const data = await res.json();
      setEncodingResult(data);
      fetchCatalog();
    } catch (err: any) {
      setEncodingResult({ success: false, error: err.message });
    }
  };

  const handleDownload = (format: 'json' | 'csv') => {
    window.open(`/api/card-catalog/download?format=${format}`, '_blank');
  };

  const filteredCards = cards.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cardholderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.accountNumberMasked.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNet = selectedNetwork === 'ALL' || c.cardNetwork === selectedNetwork;
    return matchesSearch && matchesNet;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CreditCard className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Card & Bank Account Vault Catalog
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {cards.length} RECORDS SECURED
                </span>
              </h1>
              <p className="text-xs text-[#8B949E]">
                USB Magnetic Card Reader / Encoder (Vendor 0x0801, Product 0x0003) integrated with ISO track parser, bank account vault, and instant JSON/CSV download.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('add')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card / Bank Account</span>
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleDownload('json')}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] transition-colors cursor-pointer"
              title="Download Catalog JSON"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => handleDownload('csv')}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] transition-colors cursor-pointer"
              title="Download Catalog CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards, bank names, cardholders..."
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'CITI', 'CHASE', 'FDX', 'VISA', 'MASTERCARD'].map((net) => (
            <button
              key={net}
              onClick={() => setSelectedNetwork(net)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedNetwork === net
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-[#0D1117] text-[#8B949E] hover:text-white border border-[#30363D]'
              }`}
            >
              {net}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-[#8B949E] flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
          <p className="text-xs font-mono">Loading Card & Bank Catalog...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="p-12 text-center bg-[#161B22] rounded-xl border border-[#30363D] space-y-3">
          <CreditCard className="w-10 h-10 text-[#8B949E] mx-auto opacity-40" />
          <p className="text-sm font-medium text-white">No cards found matching your query.</p>
          <p className="text-xs text-[#8B949E]">Add a new card or clear filters to view records.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#161B22] rounded-2xl border border-[#30363D] hover:border-emerald-500/50 p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-emerald-950/10 group"
            >
              <div className="space-y-4">
                {/* Card Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-lg bg-[#21262d] text-emerald-400">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-wider">
                        {card.bankName}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {card.name}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                      card.cardNetwork === 'CITI'
                        ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                        : card.cardNetwork === 'CHASE'
                        ? 'text-sky-400 bg-sky-500/10 border-sky-500/30'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    }`}
                  >
                    {card.cardNetwork}
                  </span>
                </div>

                {/* Simulated Bank Card Graphic */}
                <div className="bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262d] rounded-xl p-4 border border-[#30363D] space-y-3 relative overflow-hidden shadow-inner">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#8B949E]">
                    <span>{card.cardType}</span>
                    <span className="text-emerald-400">{card.status}</span>
                  </div>
                  <div className="font-mono text-base font-bold text-white tracking-widest">
                    {card.accountNumberMasked}
                  </div>
                  <div className="flex justify-between items-end text-[11px] font-mono">
                    <div>
                      <p className="text-[9px] text-[#8B949E]">CARDHOLDER</p>
                      <p className="text-white font-semibold uppercase">{card.cardholderName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[#8B949E]">EXPIRES</p>
                      <p className="text-white font-semibold">{card.expiryDate}</p>
                    </div>
                  </div>
                </div>

                {/* Track Data Summary */}
                <div className="space-y-1 pt-1">
                  <p className="text-[10px] font-mono text-[#8B949E] flex items-center justify-between">
                    <span>ISO TRACK DATA</span>
                    <span className="text-emerald-400">LRC VALIDATED</span>
                  </p>
                  <div className="bg-[#0D1117] rounded-lg p-2 font-mono text-[10px] text-[#79C0FF] truncate border border-[#30363D]">
                    {card.track2 || card.track1}
                  </div>
                </div>

                {card.notes && (
                  <p className="text-xs text-[#8B949E] italic line-clamp-2">
                    "{card.notes}"
                  </p>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 mt-4 border-t border-[#21262d] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTriggerEncode(card)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>USB Encode / Test</span>
                </button>

                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add New Card / Bank Account */}
      {activeModal === 'add' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] w-full max-w-xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Add Card or Bank Account to Catalog</span>
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#8B949E] hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8B949E] mb-1">Card / Account Title</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Citi Executive Checking & Card"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8B949E] mb-1">Bank Name / Institution</label>
                  <input
                    type="text"
                    required
                    value={formBankName}
                    onChange={(e) => setFormBankName(e.target.value)}
                    placeholder="e.g. Citibank N.A."
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8B949E] mb-1">Card Network</label>
                  <select
                    value={formNetwork}
                    onChange={(e) => setFormNetwork(e.target.value as any)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CITI">CITI</option>
                    <option value="CHASE">CHASE</option>
                    <option value="FDX">FDX</option>
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8B949E] mb-1">Card Type</label>
                  <select
                    value={formCardType}
                    onChange={(e) => setFormCardType(e.target.value as any)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CREDIT">CREDIT</option>
                    <option value="DEBIT">DEBIT</option>
                    <option value="COMMERCIAL">COMMERCIAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8B949E] mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={formHolder}
                    onChange={(e) => setFormHolder(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8B949E] mb-1">Account / Card Number</label>
                  <input
                    type="text"
                    required
                    value={formCardNumber}
                    onChange={(e) => setFormCardNumber(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8B949E] mb-1">Routing Number</label>
                  <input
                    type="text"
                    value={formRouting}
                    onChange={(e) => setFormRouting(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8B949E] mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#8B949E]">ISO Track 1 & Track 2 Magnetic Data</label>
                <input
                  type="text"
                  value={formTrack1}
                  onChange={(e) => setFormTrack1(e.target.value)}
                  placeholder="Track 1 data string"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-[#79C0FF] font-mono focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={formTrack2}
                  onChange={(e) => setFormTrack2(e.target.value)}
                  placeholder="Track 2 data string"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-[#79C0FF] font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8B949E] mb-1">Notes & Metadata</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="Additional context, rewards tier, or settlement account details..."
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#30363D]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#21262d] text-[#C9D1D9] hover:text-white text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: USB Encoder / Reader Simulation */}
      {activeModal === 'encode' && selectedCard && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] w-full max-w-xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-400" />
                <span>USB Encoder & Reader Simulator</span>
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#8B949E] hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0D1117] rounded-xl p-4 border border-[#30363D] space-y-2">
                <p className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Selected Record: {selectedCard.name}</span>
                  <span className="text-emerald-400 font-mono">{selectedCard.bankName}</span>
                </p>
                <p className="text-xs text-[#8B949E] font-mono">
                  Card Number: <span className="text-white">{selectedCard.accountNumberMasked}</span>
                </p>
              </div>

              {encodingResult ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-bold">USB Hardware / Simulation Successful</p>
                      <p className="text-[11px] text-[#8B949E] mt-0.5">{encodingResult.details}</p>
                    </div>
                  </div>

                  <div className="bg-[#0D1117] rounded-xl p-3 border border-[#30363D] space-y-2 font-mono text-xs">
                    <p className="text-[#8B949E] text-[10px]">ENCODED ISO TRACK STREAM:</p>
                    <p className="text-[#79C0FF]">Track 1: {encodingResult.encodedTracks.track1}</p>
                    <p className="text-[#79C0FF]">Track 2: {encodingResult.encodedTracks.track2}</p>
                    <p className="text-[#79C0FF]">Track 3: {encodingResult.encodedTracks.track3}</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mx-auto" />
                  <p className="text-xs font-mono text-[#8B949E]">Transmitting packet via USB control transfer (0x21, 9, 0x0300)...</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#30363D]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-bold cursor-pointer"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardCatalogVault;

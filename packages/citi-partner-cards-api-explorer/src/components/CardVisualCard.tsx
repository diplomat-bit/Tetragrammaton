import React from 'react';
import { PartnerCardDetail } from '../types';
import { Wifi, ShieldCheck, CreditCard, Sparkles, Tag, CheckCircle2 } from 'lucide-react';

interface CardVisualCardProps {
  card: PartnerCardDetail;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const CardVisualCard: React.FC<CardVisualCardProps> = ({ card, isSelected, onSelect }) => {
  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const displayPrimaryNumber =
    card.displayPrimaryCardNumber || `•••• •••• •••• ${card.displayCardNumber || '8653'}`;

  return (
    <div
      onClick={onSelect}
      className={`relative group rounded-3xl p-6 transition-all duration-300 overflow-hidden shadow-lg ${
        isSelected
          ? 'ring-3 ring-blue-500 ring-offset-2 scale-[1.01]'
          : 'hover:shadow-xl hover:-translate-y-0.5'
      } bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white cursor-pointer select-none`}
    >
      {/* Background atmospheric elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* Top row: Brand & Plastic Type */}
      <div className="flex items-center justify-between relative z-10 mb-6">
        <div className="flex items-center space-x-2">
          <div className="text-xl font-black tracking-tight text-white flex items-center">
            <span>citi</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-1 inline-block"></span>
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold text-slate-300 border-l border-slate-700 pl-2">
            {card.productName || 'Platinum Visa'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {card.cardPlasticType && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
              {card.cardPlasticType}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
            {card.subCardType || 'DEBIT'}
          </span>
        </div>
      </div>

      {/* Chip and Contactless Wave */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        {/* EMV Chip Representation */}
        <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-400/80 shadow-inner flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-1/2 h-px bg-amber-600/40" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-amber-600/40" />
          <div className="w-4 h-4 rounded border border-amber-600/40" />
        </div>

        {/* Contactless Wave Icon */}
        <div className="flex items-center space-x-2 text-slate-400">
          <Wifi className="w-5 h-5 rotate-90 text-slate-300" />
        </div>
      </div>

      {/* Card Number */}
      <div className="mb-6 relative z-10">
        <div className="font-mono text-lg sm:text-xl font-medium tracking-[0.22em] text-slate-100 drop-shadow-sm">
          {displayPrimaryNumber.replace(/(.{4})/g, '$1 ').trim()}
        </div>
      </div>

      {/* Bottom row: Cardholder Name, Organization & Credit Limit */}
      <div className="flex items-end justify-between relative z-10 pt-2 border-t border-slate-700/60">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
            Cardholder Name
          </p>
          <p className="text-sm font-semibold tracking-wider text-white uppercase drop-shadow-xs">
            {card.embossName || 'CITI PARTNER CARDHOLDER'}
          </p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Org: {card.organization || '888'} • Logo: {card.logo || '300'}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
            Credit Limit
          </p>
          <p className="text-sm sm:text-base font-mono font-bold text-sky-300 drop-shadow-xs">
            {formatCurrency(card.currentCreditLimitAmount)}
          </p>
          <p className="text-[10px] text-emerald-400 font-medium">
            {card.cardHolderType || 'PRIMARY'} CARD
          </p>
        </div>
      </div>
    </div>
  );
};

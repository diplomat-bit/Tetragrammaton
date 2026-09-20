import React, { useState } from 'react';
import { PartnerCardDetail } from '../types';
import {
  DollarSign,
  ShieldAlert,
  Plane,
  Home,
  CheckCircle,
  XCircle,
  Calendar,
  Lock,
  Smartphone,
  CreditCard,
  Layers,
  ArrowUpRight,
  Sparkles,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

interface CardDetailsViewProps {
  card: PartnerCardDetail;
}

export const CardDetailsView: React.FC<CardDetailsViewProps> = ({ card }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'limits' | 'functions' | 'security'>(
    'overview'
  );

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const allowedFunctions = card.cardFunctionsAllowed || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Navigation tabs */}
      <div className="border-b border-slate-200 px-6 bg-slate-50/70 flex items-center justify-between flex-wrap gap-2">
        <div className="flex space-x-1 sm:space-x-4 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Credit & Spending
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('limits')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'limits'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Transaction Controls
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('functions')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'functions'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Allowed Functions ({allowedFunctions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Activation & Security
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono py-2">
          Card ID: {card.cardId ? `${card.cardId.slice(0, 8)}...` : 'N/A'}
        </span>
      </div>

      <div className="p-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Main Credit Metric Cards */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Credit Line Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                  <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
                    Current Credit Limit
                  </span>
                  <div className="text-xl font-bold font-mono text-blue-900 mt-1">
                    {formatCurrency(card.currentCreditLimitAmount)}
                  </div>
                  <p className="text-[11px] text-blue-600/80 mt-1">Active assigned credit ceiling</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                    Cash Credit Limit
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-900 mt-1">
                    {formatCurrency(card.cashCreditLimitAmount)}
                  </div>
                  <p className="text-[11px] text-emerald-600/80 mt-1">Cash advance limit allocation</p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">
                    Max Perm. Credit Limit
                  </span>
                  <div className="text-xl font-bold font-mono text-indigo-900 mt-1">
                    {formatCurrency(card.maximumPermanentCreditLimitAmount)}
                  </div>
                  <p className="text-[11px] text-indigo-600/80 mt-1">Approved ceiling ceiling</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                  <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">
                    Max Temp. Credit Limit
                  </span>
                  <div className="text-xl font-bold font-mono text-purple-900 mt-1">
                    {formatCurrency(card.maximumTemporaryCreditLimitAmount)}
                  </div>
                  <p className="text-[11px] text-purple-600/80 mt-1">Temporary booster allowance</p>
                </div>
              </div>
            </div>

            {/* Daily & Transaction Limits */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Purchase & Daily Limits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">POS Spending Limit</span>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {formatCurrency(card.posSpendingLimitAmount)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Daily ATM Withdrawal</span>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {formatCurrency(card.dailyAtmWithdrawalLimitAmount)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Internet / Online Purchase</span>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {formatCurrency(card.internetPurchaseLimitAmount)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Contactless w/o PIN Limit</span>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {formatCurrency(card.currentContactlessWthoutPinPmtLimit)}{' '}
                    <span className="text-xs text-slate-400 font-normal">
                      (Max {formatCurrency(card.maxContactlessWithoutPinPmtLimit)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Profile Overview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-y-3 justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 font-medium">Embossed Name:</span>{' '}
                <span className="font-semibold text-slate-900">{card.embossName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Product:</span>{' '}
                <span className="font-semibold text-slate-900">{card.productName || 'Citibank Platinum Visa'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Card Plastic:</span>{' '}
                <span className="font-semibold text-slate-900">{card.cardPlasticType || 'PAYTAG'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Issue Reason:</span>{' '}
                <span className="font-semibold text-slate-900">{card.cardIssueReason || 'NEWLY_ONBOARDED_CARD'}</span>
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTION CONTROLS & CHANNELS */}
        {activeTab === 'limits' && (
          <div className="space-y-6">
            <div>
              <p className="text-xs text-slate-500 mb-4">
                Comparison of domestic versus international channel limits and toggle indicators (
                <span className="font-semibold text-emerald-600">A = Active / Enabled</span>,{' '}
                <span className="font-semibold text-rose-600">D = Disabled</span>).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Domestic Transactions */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                        Domestic Channel Controls
                      </span>
                    </div>
                    <span className="text-[11px] bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded">
                      Local
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-800">ATM Transaction</div>
                        <div className="text-[11px] text-slate-400">Cash dispensing limits</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(card.domesticTransaction?.atmTransactionLimitAmount)}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] rounded font-bold ${
                            card.domesticTransaction?.atmTransactionLimitToggleIndicator === 'A'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {card.domesticTransaction?.atmTransactionLimitToggleIndicator === 'A'
                            ? 'ACTIVE (A)'
                            : 'DISABLED (D)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-800">Contactless Transaction</div>
                        <div className="text-[11px] text-slate-400">NFC & Tap-to-pay</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(card.domesticTransaction?.contactlessTransactionLimitAmount)}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] rounded font-bold ${
                            card.domesticTransaction?.contactlessTxnLimitToggleIndicator === 'A'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {card.domesticTransaction?.contactlessTxnLimitToggleIndicator === 'A'
                            ? 'ACTIVE (A)'
                            : 'DISABLED (D)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-800">Contact POS Transaction</div>
                        <div className="text-[11px] text-slate-400">Chip & PIN in-store</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(card.domesticTransaction?.contactPosTransactionLimitAmount)}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] rounded font-bold ${
                            card.domesticTransaction?.contactPosTxnLimitToggleIndicator === 'A'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {card.domesticTransaction?.contactPosTxnLimitToggleIndicator === 'A'
                            ? 'ACTIVE (A)'
                            : 'DISABLED (D)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-800">Non-POS Transaction</div>
                        <div className="text-[11px] text-slate-400">Mail/Phone/eCommerce orders</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(card.domesticTransaction?.nonPosTransactionLimitAmount)}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] rounded font-bold ${
                            card.domesticTransaction?.nonPosTxnLimitToggleIndicator === 'A'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {card.domesticTransaction?.nonPosTxnLimitToggleIndicator === 'A'
                            ? 'ACTIVE (A)'
                            : 'DISABLED (D)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* International Transactions */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Plane className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                        International Channel Controls
                      </span>
                    </div>
                    <span className="text-[11px] bg-indigo-100 text-indigo-800 font-medium px-2 py-0.5 rounded">
                      Overseas
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-800">Overseas ATM Transaction</div>
                        <div className="text-[11px] text-slate-400">Foreign ATM withdrawals</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(card.internationalTransaction?.atmTransactionLimitAmount)}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] rounded font-bold ${
                            card.internationalTransaction?.atmTransactionLimitToggleIndicator === 'A'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {card.internationalTransaction?.atmTransactionLimitToggleIndicator === 'A'
                            ? 'ACTIVE (A)'
                            : 'DISABLED (D)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-800">Overseas Contactless</div>
                        <div className="text-[11px] text-slate-400">Tap abroad</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(card.internationalTransaction?.contactlessTransactionLimitAmount)}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] rounded font-bold ${
                            card.internationalTransaction?.contactlessTxnLimitToggleIndicator === 'A'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {card.internationalTransaction?.contactlessTxnLimitToggleIndicator === 'A'
                            ? 'ACTIVE (A)'
                            : 'DISABLED (D)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-800">Overseas Contact POS</div>
                        <div className="text-[11px] text-slate-400">In-store foreign POS</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(card.internationalTransaction?.contactPosTransactionLimitAmount)}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] rounded font-bold ${
                            card.internationalTransaction?.contactPosTxnLimitToggleIndicator === 'A'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {card.internationalTransaction?.contactPosTxnLimitToggleIndicator === 'A'
                            ? 'ACTIVE (A)'
                            : 'DISABLED (D)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-800">Overseas Non-POS (eCom)</div>
                        <div className="text-[11px] text-slate-400">Cross-border eCommerce</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(card.internationalTransaction?.nonPosTransactionLimitAmount)}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] rounded font-bold ${
                            card.internationalTransaction?.nonPosTxnLimitToggleIndicator === 'A'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {card.internationalTransaction?.nonPosTxnLimitToggleIndicator === 'A'
                            ? 'ACTIVE (A)'
                            : 'DISABLED (D)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALLOWED FUNCTIONS */}
        {activeTab === 'functions' && (
          <div>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Permitted API Card Functions ({allowedFunctions.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Actions and management operations permitted on this specific partner card.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allowedFunctions.map((fn, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-200 transition-colors flex items-start space-x-2.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {fn.cardFunction}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {formatFunctionName(fn.cardFunction)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVATION & SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Activation Indicators */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
                  <Lock className="w-4 h-4 mr-1.5 text-blue-600" />
                  Card Activation Indicators
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Local Activation Indicator:</span>
                    <span className="font-semibold text-slate-900">
                      {card.localCardActivationIndicator || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Overseas Activation Indicator:</span>
                    <span className="font-semibold text-slate-900">
                      {card.overseasCardActivationIndicator || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Perpetual Activation Flag:</span>
                    <span className="font-semibold text-emerald-600">
                      {card.perpetualActivationFlag ? 'Enabled (true)' : 'Disabled (false)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overseas Travel Plan Dates */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-indigo-600" />
                  Overseas Travel Maintenance Window
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Overseas Activation Start:</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {card.overseasCardActivationStartDate || 'None set'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Overseas Activation End:</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {card.overseasCardActivationEndDate || 'None set'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Card Plastic Classification:</span>
                    <span className="font-semibold text-slate-900">
                      {card.cardPlasticType || 'PAYTAG'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Identifiers */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <h4 className="font-semibold text-slate-800 mb-2">Technical IDs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px] text-slate-600">
                <div className="overflow-hidden text-ellipsis">
                  <span className="font-semibold text-slate-700">cardId:</span> {card.cardId}
                </div>
                <div className="overflow-hidden text-ellipsis">
                  <span className="font-semibold text-slate-700">primaryCardId:</span> {card.primaryCardId}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function formatFunctionName(fn: string): string {
  switch (fn) {
    case 'CREDIT_LIMIT_INCREASE':
      return 'Request permanent or temporary credit line increase';
    case 'LOCAL_CARD_ACTIVATION':
      return 'Activate replacement or initial card for domestic use';
    case 'OVERSEAS_CARD_ACTIVATION':
      return 'Enable magnetic stripe and POS for international trips';
    case 'REPORT_LOST_STOLEN':
      return 'Block card instantly and order replacement';
    case 'EPP_BOOKING':
      return 'Convert eligible transactions to Equal Payment Plans';
    case 'UPDATE_POS_CREDIT_LIMIT':
      return 'Modify POS merchant swipe transaction limits';
    case 'UPDATE_NON_POS_CREDIT_LIMIT':
      return 'Modify online eCommerce and phone order limits';
    case 'E_STATEMENT':
      return 'Subscribe or view electronic PDF billing statements';
    case 'E_ADVICE':
      return 'Receive digital transaction receipts and advices';
    case 'RESET_ATM_PIN':
      return 'Request instant ATM security PIN reset';
    case 'ADD_SUPPLEMENTARY_CARD':
      return 'Issue linked card for authorized users or family';
    case 'OVERSEAS_TRAVEL_PLAN_MAINTENANCE':
      return 'Set travel itinerary dates to prevent false fraud blocks';
    default:
      return fn.replace(/_/g, ' ').toLowerCase();
  }
}

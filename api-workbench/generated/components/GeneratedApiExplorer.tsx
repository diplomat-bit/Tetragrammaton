import React, { useState, useEffect } from 'react';
import {
  TrendingUp, CreditCard, Key, ShoppingBag, Award, FileText,
  Play, RefreshCw, Copy, Check, Terminal, Shield, ArrowUpRight,
  ArrowDownLeft, Sparkles, CheckCircle2, ChevronRight, Send, AlertCircle,
  Layers, Search, Filter, Box
} from 'lucide-react';
import { workbenchSdk, WorkbenchApiClient, ApiResponse } from '../configs/api-clients';
import {
  BrokerAccount, BrokerPosition, BrokerOrderResponse,
  AccountFinancialDetails, AccountTransactionItem, BalanceTransferEligibility,
  TokenResponseData, RewardShopWithPointsLinkage, RewardRedemptionResult,
  StatementSummary, TaxStatementSummary
} from './types';
import { SPEC_COMPONENTS_LIST, getSpecComponent } from './specs/SpecComponentRegistry';

// =========================================================================
// 1. BROKERAGE & TRADING COMPONENT (USES SDK: workbenchSdk.broker)
// =========================================================================
export const BrokerTradingComponent: React.FC = () => {
  const [accounts, setAccounts] = useState<BrokerAccount[]>([]);
  const [positions, setPositions] = useState<BrokerPosition[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [symbol, setSymbol] = useState('NVDA');
  const [qty, setQty] = useState('10');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<ApiResponse<any> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const accRes = await workbenchSdk.broker.getAccounts();
    setAccounts(accRes.data);
    if (accRes.data.length > 0) {
      setSelectedAccountId(accRes.data[0].id);
    }
    const posRes = await workbenchSdk.broker.getPositions();
    setPositions(posRes.data);
    setLoading(false);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    const res = await workbenchSdk.broker.createOrder({
      symbol,
      qty: Number(qty),
      side,
      type: orderType,
      time_in_force: 'day',
    });
    setLastResponse(res);
    setLoading(false);
  };

  const copyCode = () => {
    const code = `const res = await workbenchSdk.broker.createOrder({\n  symbol: '${symbol}',\n  qty: ${qty},\n  side: '${side}',\n  type: '${orderType}',\n  time_in_force: 'day'\n});`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">Brokerage & Trading Engine</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              SDK: workbenchSdk.broker
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Generated from Broker API postman & OpenAPI specs. Live order creation, execution, and positions portfolio.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyCode}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy SDK Code</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-[#21262D] hover:bg-[#30363D] text-gray-300 rounded-lg border border-[#30363D] transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map(acc => (
          <div
            key={acc.id}
            onClick={() => setSelectedAccountId(acc.id)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              selectedAccountId === acc.id
                ? 'bg-[#1F242C] border-emerald-500/80 ring-1 ring-emerald-500/40'
                : 'bg-[#0D1117] border-[#30363D] hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="font-mono text-emerald-400">{acc.account_number}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                {acc.status}
              </span>
            </div>
            <div className="text-xl font-black text-white font-mono">${acc.portfolio_value}</div>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
              <span>Buying Power (Cash):</span>
              <span className="font-mono text-gray-200 font-bold">${acc.cash}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Order Placement Terminal */}
      <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Execute Order via SDK Client</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] text-gray-400 font-medium mb-1">Asset Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 font-medium mb-1">Quantity / Shares</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 font-medium mb-1">Order Side</label>
            <select
              value={side}
              onChange={(e) => setSide(e.target.value as any)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-medium text-white focus:border-emerald-500 outline-none"
            >
              <option value="buy">BUY (Long)</option>
              <option value="sell">SELL (Short/Exit)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 font-medium mb-1">Execution Type</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as any)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-medium text-white focus:border-emerald-500 outline-none"
            >
              <option value="market">Market Order</option>
              <option value="limit">Limit Order</option>
            </select>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          <span>Run workbenchSdk.broker.createOrder({symbol}, {qty})</span>
        </button>

        {lastResponse && (
          <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-emerald-400 font-bold">Execution Output (Status: {lastResponse.status})</span>
              <span>{lastResponse.durationMs}ms</span>
            </div>
            <pre className="text-gray-300 max-h-40 overflow-auto whitespace-pre-wrap">
              {JSON.stringify(lastResponse.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Live Positions Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Open Positions ({positions.length})</h4>
        <div className="bg-[#0D1117] border border-[#30363D] rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#161B22] text-gray-400 border-b border-[#30363D]">
              <tr>
                <th className="p-3">Symbol</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Avg Price</th>
                <th className="p-3">Current Price</th>
                <th className="p-3">Market Value</th>
                <th className="p-3">Unrealized P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]/60 text-gray-200">
              {positions.map(p => (
                <tr key={p.asset_id} className="hover:bg-[#161B22]/50">
                  <td className="p-3 font-bold text-white">{p.symbol}</td>
                  <td className="p-3">{p.qty}</td>
                  <td className="p-3">${p.avg_entry_price}</td>
                  <td className="p-3">${p.current_price}</td>
                  <td className="p-3 font-bold">${p.market_value}</td>
                  <td className="p-3 text-emerald-400 font-bold">{p.unrealized_pl} ({p.unrealized_plpc})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. BANKING & TRANSACTIONS COMPONENT (USES SDK: workbenchSdk.banking)
// =========================================================================
export const BankingTransactionsComponent: React.FC = () => {
  const [details, setDetails] = useState<AccountFinancialDetails | null>(null);
  const [transactions, setTransactions] = useState<AccountTransactionItem[]>([]);
  const [eligibility, setEligibility] = useState<BalanceTransferEligibility | null>(null);
  const [accountId, setAccountId] = useState('acc_citibank_8820');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBankingData();
  }, [accountId]);

  const fetchBankingData = async () => {
    setLoading(true);
    const [dRes, txRes, elRes] = await Promise.all([
      workbenchSdk.banking.getAccountDetails(accountId),
      workbenchSdk.banking.getTransactions(accountId, 10),
      workbenchSdk.banking.checkBalanceTransferEligibility(accountId),
    ]);
    setDetails(dRes.data);
    setTransactions(txRes.data);
    setEligibility(elRes.data);
    setLoading(false);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <CreditCard className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">Digital Banking & Transactions</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              SDK: workbenchSdk.banking
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Generated from Accounts OpenAPI, Financial Details, and Balance Transfer Eligibility specs.
          </p>
        </div>
        <button
          onClick={fetchBankingData}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh SDK Data</span>
        </button>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
          <div className="text-xs text-gray-400">Current Ledger Balance</div>
          <div className="text-2xl font-black text-white font-mono">${details?.currentBalance?.toLocaleString() || '0.00'}</div>
          <div className="text-[11px] text-gray-400 flex justify-between">
            <span>Available: ${details?.availableBalance?.toLocaleString()}</span>
            <span className="text-emerald-400 font-bold">{details?.status}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
          <div className="text-xs text-gray-400">Masked Account & Routing</div>
          <div className="text-sm font-bold text-gray-200 font-mono">{details?.accountNumberMasked}</div>
          <div className="text-[11px] text-gray-400">
            Routing ABA: <span className="font-mono text-white">{details?.routingNumber}</span> ({details?.accountType})
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-blue-950/40 border border-indigo-500/30 space-y-2">
          <div className="text-xs text-indigo-300 font-semibold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Balance Transfer Offer</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{eligibility?.promotionalApr}% APR</div>
          <div className="text-[11px] text-gray-300">
            {eligibility?.promotionalDurationMonths} mos promo • Max ${eligibility?.maximumTransferAmount?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Transactions Feed */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Live Transaction Stream</h4>
        <div className="space-y-2">
          {transactions.map(tx => (
            <div
              key={tx.transactionId}
              className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between hover:border-gray-600 transition"
            >
              <div className="flex items-center space-x-3">
                <span className={`p-2 rounded-lg ${
                  tx.creditDebitIndicator === 'CRDT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {tx.creditDebitIndicator === 'CRDT' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </span>
                <div>
                  <p className="text-xs font-bold text-white">{tx.merchantName || tx.description}</p>
                  <p className="text-[11px] text-gray-400">{tx.bookingDate} • Ref: {tx.transactionId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold font-mono ${
                  tx.creditDebitIndicator === 'CRDT' ? 'text-emerald-400' : 'text-gray-200'
                }`}>
                  {tx.creditDebitIndicator === 'CRDT' ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. REWARDS & SHOP WITH POINTS COMPONENT (USES SDK: workbenchSdk.rewards)
// =========================================================================
export const RewardsPointsComponent: React.FC = () => {
  const [memberId, setMemberId] = useState('SWP-MEM-9941');
  const [pointsStatus, setPointsStatus] = useState<RewardShopWithPointsLinkage | null>(null);
  const [redeemPoints, setRedeemPoints] = useState('5000');
  const [lastRedemption, setLastRedemption] = useState<RewardRedemptionResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPoints();
  }, [memberId]);

  const fetchPoints = async () => {
    setLoading(true);
    const res = await workbenchSdk.rewards.getShopWithPointsStatus(memberId);
    setPointsStatus(res.data);
    setLoading(false);
  };

  const handleRedeem = async () => {
    setLoading(true);
    const res = await workbenchSdk.rewards.redeemPoints({
      partnerMemberId: memberId,
      pointsToRedeem: Number(redeemPoints),
      redemptionContext: 'CHECKOUT',
      orderAmount: Number(redeemPoints) / 100,
      currency: 'USD',
    });
    setLastRedemption(res.data);
    setLoading(false);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">Rewards & Shop With Points</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              SDK: workbenchSdk.rewards
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Generated from RewardLinkageShopWithPoints and RewardRedemptionSelectAndCredit OpenAPI specs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-3">
          <div className="text-xs text-gray-400 font-medium">Linkage & Available Points</div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            {pointsStatus?.availablePoints?.toLocaleString() || '0'} <span className="text-sm text-gray-400">pts</span>
          </div>
          <div className="text-xs text-gray-300 font-medium">
            Cash Value: <span className="text-white font-bold">${pointsStatus?.cashEquivalentValue?.toFixed(2)} USD</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
            ✓ Status: {pointsStatus?.linkageStatus} • Conversion: {pointsStatus?.pointsConversionRate} pts = $1.00
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-3">
          <div className="text-xs text-gray-400 font-medium">Redeem for Checkout Credit</div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(e.target.value)}
              className="flex-1 bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-500"
            />
            <span className="text-xs text-gray-400 font-mono">= ${(Number(redeemPoints) / 100).toFixed(2)}</span>
          </div>
          <button
            onClick={handleRedeem}
            disabled={loading}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Run workbenchSdk.rewards.redeemPoints()'}
          </button>
          {lastRedemption && (
            <div className="p-2.5 rounded bg-[#161B22] border border-amber-500/30 text-[11px] font-mono text-amber-300">
              ✓ Redeemed {lastRedemption.pointsDeducted} pts! Applied ${lastRedemption.creditApplied.toFixed(2)} credit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. PAYPAL & CHECKOUT COMPONENT (USES SDK: workbenchSdk.paypal)
// =========================================================================
export const PayPalPaymentsComponent: React.FC = () => {
  const [amount, setAmount] = useState('149.50');
  const [currency, setCurrency] = useState('USD');
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateOrder = async () => {
    setLoading(true);
    const res = await workbenchSdk.paypal.createOrder({
      intent: 'CAPTURE',
      purchase_units: [{
        description: 'Workbench Multi-Spec Checkout Demo',
        amount: { currency_code: currency, value: amount }
      }]
    });
    setCreatedOrder(res.data);
    setLoading(false);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">PayPal Checkout & Capture</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
              SDK: workbenchSdk.paypal
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Generated from PayPal APIs Postman collection & OpenAPI v2 endpoints.
          </p>
        </div>
      </div>

      <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Payment Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Currency Code</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-medium text-white outline-none focus:border-sky-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          <span>Run workbenchSdk.paypal.createOrder({currency} {amount})</span>
        </button>

        {createdOrder && (
          <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-mono space-y-1">
            <div className="text-sky-400 font-bold">PayPal Order Response ({createdOrder.id || 'ord_paypal_101'})</div>
            <pre className="text-gray-300 overflow-auto max-h-36">
              {JSON.stringify(createdOrder, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 5. MASTER GENERATED EXPLORER WRAPPER
// =========================================================================
export const GeneratedApiExplorer: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<'broker' | 'banking' | 'rewards' | 'paypal' | 'all-specs'>('all-specs');
  const [selectedSpecId, setSelectedSpecId] = useState<string>(SPEC_COMPONENTS_LIST[0]?.id || '');
  const [specSearch, setSpecSearch] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState<'all' | 'openapi_3' | 'swagger_2' | 'xsd' | 'postman'>('all');

  const filteredSpecs = SPEC_COMPONENTS_LIST.filter(spec => {
    if (formatFilter !== 'all' && spec.format !== formatFilter) return false;
    if (specSearch) {
      const q = specSearch.toLowerCase();
      return spec.title.toLowerCase().includes(q) || spec.id.toLowerCase().includes(q) || spec.componentName.toLowerCase().includes(q);
    }
    return true;
  });

  const SelectedComponent = getSpecComponent(selectedSpecId);

  return (
    <div className="space-y-6">
      {/* Selector Tabs for Generated Domain Components */}
      <div className="flex items-center space-x-2 border-b border-[#30363D] pb-3 overflow-x-auto scrollbar-thin">
        {[
          { id: 'all-specs', label: '39 Generated Spec UIs (Visa, Broker, Finicity, etc.)', icon: Layers, color: 'text-indigo-400' },
          { id: 'broker', label: 'Brokerage & Trading', icon: TrendingUp, color: 'text-emerald-400' },
          { id: 'banking', label: 'Banking & Transactions', icon: CreditCard, color: 'text-blue-400' },
          { id: 'rewards', label: 'Shop With Points & Rewards', icon: Award, color: 'text-amber-400' },
          { id: 'paypal', label: 'PayPal Payments', icon: ShoppingBag, color: 'text-sky-400' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeComponent === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveComponent(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/50 shadow-sm'
                  : 'bg-[#161B22] text-gray-400 border border-[#30363D] hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Component */}
      {activeComponent === 'all-specs' && (
        <div className="space-y-4">
          {/* Spec Picker and Filter Header */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                    <Layers className="w-4 h-4" />
                  </span>
                  <span>Generated Specification UIs (Total: {SPEC_COMPONENTS_LIST.length})</span>
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Pick any compiled specification component to execute test requests, inspect curl syntax, and check response payloads.
                </p>
              </div>

              {/* Format Filter Chips */}
              <div className="flex items-center space-x-1 overflow-x-auto">
                {(['all', 'openapi_3', 'swagger_2', 'xsd', 'postman'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setFormatFilter(fmt)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium uppercase tracking-wider transition ${
                      formatFilter === fmt
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                        : 'text-gray-400 hover:bg-[#21262D]'
                    }`}
                  >
                    {fmt === 'all' ? 'All Formats' : fmt.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Spec Selector and Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-[#30363D]">
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter 39 specs..."
                  value={specSearch}
                  onChange={(e) => setSpecSearch(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-8">
                <select
                  value={selectedSpecId}
                  onChange={(e) => setSelectedSpecId(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-gray-200 outline-none focus:border-indigo-500 font-mono"
                >
                  {filteredSpecs.map(spec => (
                    <option key={spec.id} value={spec.id}>
                      [{spec.format.toUpperCase()}] {spec.title} ({spec.endpointsCount > 0 ? `${spec.endpointsCount} endpoints` : `${spec.xsdTypesCount} XSD types`})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Render the Active Spec UI */}
          {SelectedComponent ? (
            <SelectedComponent />
          ) : (
            <div className="p-8 text-center bg-[#161B22] border border-[#30363D] rounded-2xl text-gray-400">
              <Box className="w-8 h-8 mx-auto text-gray-500 mb-2" />
              <p className="text-sm font-semibold">No component available for selected specification.</p>
            </div>
          )}
        </div>
      )}

      {activeComponent === 'broker' && <BrokerTradingComponent />}
      {activeComponent === 'banking' && <BankingTransactionsComponent />}
      {activeComponent === 'rewards' && <RewardsPointsComponent />}
      {activeComponent === 'paypal' && <PayPalPaymentsComponent />}
    </div>
  );
};

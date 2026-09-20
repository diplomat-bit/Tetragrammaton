import React, { useState } from 'react';

export const InvestmentForm: React.FC = () => {
  const [asset, setAsset] = useState('Treasury Yield Index');
  const [amount, setAmount] = useState('1000000');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 text-white space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold">Capital Allocation & Investment Order</h1>
        <p className="text-sm text-gray-400">Institutional capital deployment into private equity, money market, and debt instruments</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-400">Target Asset / Strategy</label>
          <input
            type="text"
            value={asset}
            onChange={e => setAsset(e.target.value)}
            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400">Allocation Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Execute Capital Order
        </button>

        {submitted && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-400 rounded-lg text-xs">
            ✓ Investment ticket dispatched to execution desk successfully.
          </div>
        )}
      </form>
    </div>
  );
};

export default InvestmentForm;

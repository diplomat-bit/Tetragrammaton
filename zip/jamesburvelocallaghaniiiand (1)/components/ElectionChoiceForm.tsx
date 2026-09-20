import React, { useState } from 'react';

export const ElectionChoiceForm: React.FC = () => {
  const [choice, setChoice] = useState('cash');

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg text-white space-y-4">
      <h3 className="text-lg font-semibold">Corporate Action & Election Submission (ISO 20022)</h3>
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Distribution Election Type</label>
        <select
          value={choice}
          onChange={e => setChoice(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
        >
          <option value="cash">Cash Dividend Payout (USD / FedNow)</option>
          <option value="reinvest">Dividend Reinvestment (DRIP)</option>
          <option value="stock">Additional Equity Class A Distribution</option>
        </select>
      </div>
      <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm font-medium">
        Transmit ISO 20022 Election Message
      </button>
    </div>
  );
};

export default ElectionChoiceForm;

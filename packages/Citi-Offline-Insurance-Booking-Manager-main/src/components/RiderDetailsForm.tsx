import React from 'react';
import { RiderDetail } from '../types';
import { Shield, Plus, Trash2, Copy } from 'lucide-react';

interface RiderDetailsFormProps {
  riders: RiderDetail[];
  onChange: (updated: RiderDetail[]) => void;
}

export const RiderDetailsForm: React.FC<RiderDetailsFormProps> = ({
  riders,
  onChange,
}) => {
  const handleRiderFieldChange = (
    index: number,
    field: keyof RiderDetail,
    value: any
  ) => {
    const updated = [...riders];
    let val = value;
    if (field === 'riderSumAssuredAmount' || field === 'addOnPremiumAmount' || field === 'riderTerm' || field === 'riderPaymentTerm') {
      const parsed = parseFloat(value);
      val = isNaN(parsed) ? 0 : parsed;
    }
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    onChange(updated);
  };

  const handleAddRider = () => {
    const newRider: RiderDetail = {
      riderCode: 'TP',
      riderSumAssuredAmount: 25000.00,
      addOnPremiumAmount: 0,
      riderTermType: 'MONTHS',
      riderTerm: 60,
      riderPaymentTermType: 'MONTHS',
      riderPaymentTerm: 48,
      riderEffectiveDate: new Date().toISOString().split('T')[0],
    };
    onChange([...riders, newRider]);
  };

  const handleRemoveRider = (index: number) => {
    const updated = riders.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDuplicateRider = (index: number) => {
    const duplicate = { ...riders[index], riderCode: `${riders[index].riderCode}_COPY` };
    onChange([...riders, duplicate]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Rider Specifications (riderDetails: {riders.length})
          </h3>
        </div>
        <button
          id="btn-add-rider"
          type="button"
          onClick={handleAddRider}
          className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-950 text-purple-300 border border-purple-800 hover:bg-purple-900 flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Rider
        </button>
      </div>

      {riders.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">No riders configured.</p>
          <button
            type="button"
            onClick={handleAddRider}
            className="mt-2 text-xs text-purple-400 hover:underline"
          >
            Add a default rider
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {riders.map((rider, index) => (
            <div
              key={index}
              id={`rider-item-${index}`}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 relative group"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-semibold text-purple-300 font-mono flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-[10px]">
                    {index + 1}
                  </span>
                  Rider: {rider.riderCode || 'UNNAMED'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDuplicateRider(index)}
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    title="Duplicate Rider"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveRider(index)}
                    className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Remove Rider"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Rider Code
                  </label>
                  <input
                    id={`input-rider-code-${index}`}
                    type="text"
                    value={rider.riderCode}
                    onChange={(e) => handleRiderFieldChange(index, 'riderCode', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                    placeholder="TP"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Sum Assured
                  </label>
                  <input
                    id={`input-rider-sum-assured-${index}`}
                    type="number"
                    step="0.01"
                    value={rider.riderSumAssuredAmount}
                    onChange={(e) => handleRiderFieldChange(index, 'riderSumAssuredAmount', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Add-on Premium
                  </label>
                  <input
                    id={`input-rider-addon-premium-${index}`}
                    type="number"
                    step="0.01"
                    value={rider.addOnPremiumAmount}
                    onChange={(e) => handleRiderFieldChange(index, 'addOnPremiumAmount', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Effective Date
                  </label>
                  <input
                    id={`input-rider-effective-date-${index}`}
                    type="date"
                    value={rider.riderEffectiveDate}
                    onChange={(e) => handleRiderFieldChange(index, 'riderEffectiveDate', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Rider Term Type
                  </label>
                  <select
                    id={`select-rider-term-type-${index}`}
                    value={rider.riderTermType}
                    onChange={(e) => handleRiderFieldChange(index, 'riderTermType', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  >
                    <option value="MONTHS">MONTHS</option>
                    <option value="YEARS">YEARS</option>
                    <option value="MONTH">MONTH</option>
                    <option value="YEAR">YEAR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Rider Term
                  </label>
                  <input
                    id={`input-rider-term-${index}`}
                    type="number"
                    value={rider.riderTerm}
                    onChange={(e) => handleRiderFieldChange(index, 'riderTerm', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Payment Term Type
                  </label>
                  <select
                    id={`select-rider-payment-term-type-${index}`}
                    value={rider.riderPaymentTermType}
                    onChange={(e) => handleRiderFieldChange(index, 'riderPaymentTermType', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  >
                    <option value="MONTHS">MONTHS</option>
                    <option value="YEARS">YEARS</option>
                    <option value="MONTH">MONTH</option>
                    <option value="YEAR">YEAR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Payment Term
                  </label>
                  <input
                    id={`input-rider-payment-term-${index}`}
                    type="number"
                    value={rider.riderPaymentTerm}
                    onChange={(e) => handleRiderFieldChange(index, 'riderPaymentTerm', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

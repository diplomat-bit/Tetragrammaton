import React from 'react';
import { OfferDetails } from '../types';
import { Tag, Sparkles } from 'lucide-react';

interface OfferDetailsFormProps {
  offer: OfferDetails;
  onChange: (updated: OfferDetails) => void;
}

export const OfferDetailsForm: React.FC<OfferDetailsFormProps> = ({
  offer,
  onChange,
}) => {
  const handleChange = (field: keyof OfferDetails, value: string) => {
    onChange({
      ...offer,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Tag className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-slate-200">
          Insurance Offer Identification (offerDetails)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Wave ID <span className="text-red-400">*</span>
          </label>
          <input
            id="input-offer-wave-id"
            type="text"
            value={offer.waveId}
            onChange={(e) => handleChange('waveId', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="987654321"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">Marketing wave identifier</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Campaign ID <span className="text-red-400">*</span>
          </label>
          <input
            id="input-offer-campaign-id"
            type="text"
            value={offer.campaignId}
            onChange={(e) => handleChange('campaignId', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="123456789"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">Associated partner campaign</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Offer ID <span className="text-red-400">*</span>
          </label>
          <input
            id="input-offer-id"
            type="text"
            value={offer.offerId}
            onChange={(e) => handleChange('offerId', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="111000125"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">Unique insurance offer bundle</span>
        </div>
      </div>
    </div>
  );
};

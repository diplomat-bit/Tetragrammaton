import React from 'react';
import { PolicyDetails } from '../types';
import { FileText, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

interface PolicyDetailsFormProps {
  policy: PolicyDetails;
  onChange: (updated: PolicyDetails) => void;
}

export const PolicyDetailsForm: React.FC<PolicyDetailsFormProps> = ({
  policy,
  onChange,
}) => {
  const handleStringChange = (field: keyof PolicyDetails, value: string) => {
    onChange({
      ...policy,
      [field]: value,
    });
  };

  const handleNumberChange = (field: keyof PolicyDetails, value: string) => {
    const num = parseFloat(value);
    onChange({
      ...policy,
      [field]: isNaN(num) ? 0 : num,
    });
  };

  const handleConsentChange = (field: 'consentType' | 'consentGivenFlag', value: any) => {
    onChange({
      ...policy,
      consentDetails: {
        ...policy.consentDetails,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <FileText className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-200">
          Core Policy Specifications (policyDetails)
        </h3>
      </div>

      {/* Product & Identification */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          1. Product & Identification
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Insurance Product Code <span className="text-red-400">*</span>
            </label>
            <input
              id="input-policy-product-code"
              type="text"
              value={policy.insuranceProductCode}
              onChange={(e) => handleStringChange('insuranceProductCode', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="PR001"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Currency Code <span className="text-red-400">*</span>
            </label>
            <select
              id="select-policy-currency"
              value={policy.insuranceProductCurrencyCode}
              onChange={(e) => handleStringChange('insuranceProductCurrencyCode', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="SGD">SGD (Singapore Dollar)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="HKD">HKD (Hong Kong Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="GBP">GBP (British Pound)</option>
              <option value="AUD">AUD (Australian Dollar)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              User Application Number
            </label>
            <input
              id="input-policy-app-number"
              type="text"
              value={policy.userApplicationNumber}
              onChange={(e) => handleStringChange('userApplicationNumber', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="83748374389"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Insurance Policy Number
            </label>
            <input
              id="input-policy-number"
              type="text"
              value={policy.insurancePolicyNumber}
              onChange={(e) => handleStringChange('insurancePolicyNumber', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="83748374389"
            />
          </div>
        </div>
      </div>

      {/* Policy Status & Coverage Amounts */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          2. Financial Coverage & Premium Amounts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Policy Status
            </label>
            <select
              id="select-policy-status"
              value={policy.insurancePolicyStatus}
              onChange={(e) => handleStringChange('insurancePolicyStatus', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="APPLICATION">APPLICATION</option>
              <option value="IN_FORCE">IN_FORCE</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Sum Assured Amount
            </label>
            <input
              id="input-policy-sum-assured"
              type="number"
              step="0.01"
              value={policy.insuranceSumAssuredAmount}
              onChange={(e) => handleNumberChange('insuranceSumAssuredAmount', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Base Premium Amount
            </label>
            <input
              id="input-policy-base-premium"
              type="number"
              step="0.01"
              value={policy.basePremiumAmount}
              onChange={(e) => handleNumberChange('basePremiumAmount', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Add-On Premium Amount
            </label>
            <input
              id="input-policy-addon-premium"
              type="number"
              step="0.01"
              value={policy.addOnPremiumAmount}
              onChange={(e) => handleNumberChange('addOnPremiumAmount', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Total Premium Amount
            </label>
            <input
              id="input-policy-total-premium"
              type="number"
              step="0.01"
              value={policy.totalPremiumAmount}
              onChange={(e) => handleNumberChange('totalPremiumAmount', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-400 font-semibold font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Payment Frequency
            </label>
            <select
              id="select-policy-frequency"
              value={policy.insurancePremiumPaymentFrequency}
              onChange={(e) => handleStringChange('insurancePremiumPaymentFrequency', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="MONTHLY">MONTHLY</option>
              <option value="QUARTERLY">QUARTERLY</option>
              <option value="SEMI_ANNUAL">SEMI_ANNUAL</option>
              <option value="ANNUAL">ANNUAL</option>
              <option value="SINGLE">SINGLE</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Policy Billing Mode
            </label>
            <select
              id="select-policy-billing-mode"
              value={policy.policyBillingMode}
              onChange={(e) => handleStringChange('policyBillingMode', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="INTERNAL">INTERNAL</option>
              <option value="EXTERNAL">EXTERNAL</option>
              <option value="GIRO">GIRO</option>
              <option value="CREDIT_CARD">CREDIT_CARD</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Initial Premium Modal
            </label>
            <input
              id="input-policy-initial-modal"
              type="number"
              step="0.01"
              value={policy.initialPremiumModal}
              onChange={(e) => handleNumberChange('initialPremiumModal', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Terms & Schedules */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          3. Terms & Duration Schedules
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Policy Term Type
            </label>
            <select
              id="select-policy-term-type"
              value={policy.policyTermType}
              onChange={(e) => handleStringChange('policyTermType', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="MONTH">MONTH</option>
              <option value="YEAR">YEAR</option>
              <option value="MONTHS">MONTHS</option>
              <option value="YEARS">YEARS</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Policy Term Duration
            </label>
            <input
              id="input-policy-term"
              type="number"
              value={policy.policyTerm}
              onChange={(e) => handleNumberChange('policyTerm', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="120"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Premium Payment Term Type
            </label>
            <select
              id="select-premium-term-type"
              value={policy.premiumPaymentTermType}
              onChange={(e) => handleStringChange('premiumPaymentTermType', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="MONTH">MONTH</option>
              <option value="YEAR">YEAR</option>
              <option value="MONTHS">MONTHS</option>
              <option value="YEARS">YEARS</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Premium Payment Term Duration
            </label>
            <input
              id="input-premium-term"
              type="number"
              value={policy.premiumPaymentTerm}
              onChange={(e) => handleNumberChange('premiumPaymentTerm', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="180"
            />
          </div>
        </div>
      </div>

      {/* Key Dates */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          4. Effective & Maturity Dates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Policy Effective Date (YYYY-MM-DD)
            </label>
            <input
              id="input-policy-effective-date"
              type="date"
              value={policy.insurancePolicyEffectiveDate}
              onChange={(e) => handleStringChange('insurancePolicyEffectiveDate', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Policy Maturity Date (YYYY-MM-DD)
            </label>
            <input
              id="input-policy-maturity-date"
              type="date"
              value={policy.policyMaturityDate}
              onChange={(e) => handleStringChange('policyMaturityDate', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              First Premium Due Date (YYYY-MM-DD)
            </label>
            <input
              id="input-policy-first-due-date"
              type="date"
              value={policy.firstPremiumDueDate}
              onChange={(e) => handleStringChange('firstPremiumDueDate', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Vitality & Levies & Consent */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          5. Vitality Membership, Levies & Consent
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Vitality Fee
            </label>
            <input
              id="input-vitality-fee"
              type="number"
              step="0.01"
              value={policy.vitalityMembershipFee}
              onChange={(e) => handleNumberChange('vitalityMembershipFee', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Vitality Discount
            </label>
            <input
              id="input-vitality-discount"
              type="number"
              step="0.01"
              value={policy.vitalityPremiumDiscount}
              onChange={(e) => handleNumberChange('vitalityPremiumDiscount', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Insurance Levy Amount
            </label>
            <input
              id="input-insurance-levy"
              type="number"
              step="0.01"
              value={policy.insuranceLevyAmount}
              onChange={(e) => handleNumberChange('insuranceLevyAmount', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Consent Type
            </label>
            <input
              id="input-consent-type"
              type="text"
              value={policy.consentDetails.consentType}
              onChange={(e) => handleConsentChange('consentType', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="COUNTER_OFFER_CONSENT"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Consent Given Flag
            </label>
            <div className="pt-1.5 flex items-center gap-2">
              <input
                id="checkbox-consent-given"
                type="checkbox"
                checked={policy.consentDetails.consentGivenFlag}
                onChange={(e) => handleConsentChange('consentGivenFlag', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-300">
                {policy.consentDetails.consentGivenFlag ? 'true (Granted)' : 'false (Denied)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

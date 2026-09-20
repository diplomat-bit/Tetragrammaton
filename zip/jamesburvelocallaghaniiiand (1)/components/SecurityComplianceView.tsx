import React from 'react';

export const SecurityComplianceView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enterprise Security & Regulatory Compliance Vault</h1>
        <p className="text-sm text-gray-400">SOC2 Type II, ISO 27001, PCI-DSS Level 1, and GDPR compliance certifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-base">SOC2 Type II Certification</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">Active</span>
          </div>
          <p className="text-xs text-gray-400">Continuous automated audit by Big Four independent assessors.</p>
        </div>
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-base">PCI-DSS Level 1 Merchant Rails</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">Active</span>
          </div>
          <p className="text-xs text-gray-400">Hardware tokenization, zero-plaintext storage architecture.</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityComplianceView;

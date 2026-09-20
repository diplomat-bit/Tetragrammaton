import React, { useState } from 'react';

export const IdentityView: React.FC = () => {
  const [identity] = useState({
    legalName: 'James Burvel O’Callaghan III Institutional Trust',
    taxId: 'XX-XXX4910',
    lei: '5493006MHB84DD0Z4Y42',
    jurisdiction: 'Delaware, United States',
    kybStatus: 'VERIFIED_TIER_1'
  });

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Institutional Legal Entity & KYC/KYB Vault</h1>
        <p className="text-sm text-gray-400">Global Legal Entity Identifier (LEI), beneficial ownership registry, and compliance records</p>
      </div>

      <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4 max-w-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-gray-800">
          <div>
            <span className="text-xs text-gray-400">Legal Entity</span>
            <h3 className="text-lg font-bold">{identity.legalName}</h3>
          </div>
          <span className="px-3 py-1 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 text-xs font-semibold">{identity.kybStatus}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-gray-400">LEI Code</span>
            <div className="font-mono text-cyan-400 mt-1">{identity.lei}</div>
          </div>
          <div>
            <span className="text-xs text-gray-400">Tax ID / EIN</span>
            <div className="font-mono text-gray-300 mt-1">{identity.taxId}</div>
          </div>
          <div>
            <span className="text-xs text-gray-400">Incorporation Jurisdiction</span>
            <div className="text-gray-200 mt-1">{identity.jurisdiction}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityView;

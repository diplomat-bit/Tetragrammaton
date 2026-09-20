import React from 'react';

export const VirtualAccountsTable: React.FC = () => {
  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Virtual IBAN & Sub-Ledger Accounts</h3>
      <p className="text-sm text-gray-400">Multi-tenant automated reconciliation accounts.</p>
    </div>
  );
};

export default VirtualAccountsTable;

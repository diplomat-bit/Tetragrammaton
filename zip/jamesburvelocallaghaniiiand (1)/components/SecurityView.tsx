import React from 'react';

export const SecurityView: React.FC = () => {
  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Security & Access Matrix</h1>
        <p className="text-sm text-gray-400">Multi-factor authorization policies, role-based access control (RBAC), and IP allowlists</p>
      </div>

      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-800">
          <div>
            <h4 className="font-medium text-sm">FIDO2 WebAuthn Enforced</h4>
            <p className="text-xs text-gray-400">Mandatory hardware security key login for all administrators</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">ENFORCED</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-sm">TLS 1.3 Strict Cipher Suites</h4>
            <p className="text-xs text-gray-400">AES-256-GCM quantum-resistant encryption on all active endpoints</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityView;

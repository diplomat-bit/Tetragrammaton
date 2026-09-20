import React, { useState } from 'react';

export const PlaidInstitutionsExplorer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [institutions] = useState([
    { id: 'ins_1', name: 'JPMorgan Chase', products: ['Auth', 'Balance', 'Transactions', 'Identity'] },
    { id: 'ins_2', name: 'Citibank Online', products: ['Auth', 'Balance', 'Transactions', 'Payment Init'] },
    { id: 'ins_3', name: 'Barclays Bank', products: ['Auth', 'Balance', 'Transactions', 'CRA'] }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plaid Global Institutions Directory</h1>
        <p className="text-sm text-gray-400">Search and discover supported financial institutions, oauth flows, and supported data products</p>
      </div>

      <input
        type="text"
        placeholder="Filter institutions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {institutions.map(ins => (
          <div key={ins.id} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
            <span className="text-xs font-mono text-cyan-400">{ins.id}</span>
            <h3 className="font-semibold text-base">{ins.name}</h3>
            <div className="flex flex-wrap gap-1 pt-2">
              {ins.products.map(p => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaidInstitutionsExplorer;

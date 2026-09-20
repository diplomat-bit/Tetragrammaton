import React, { useState } from 'react';

export interface Collectible {
  id: string;
  name: string;
  artist: string;
  valuation: string;
  category: string;
  status: string;
}

export const ArtCollectibles: React.FC = () => {
  const [items] = useState<Collectible[]>([
    { id: 'art_01', name: 'Quantum Abstract Resonance No. 4', artist: 'H. Vance', valuation: '$1,850,000', category: 'Contemporary Oil', status: 'Vault Secured' },
    { id: 'art_02', name: 'Chronos Mechanical Tourbillon 1954', artist: 'Patek Philippe & Co', valuation: '$720,000', category: 'Horology', status: 'In Transit' },
    { id: 'art_03', name: 'Imperial Jadeite Pendant', artist: 'Dynasty Archives', valuation: '$3,400,000', category: 'High Jewelry', status: 'Insured Escrow' }
  ]);

  return (
    <div className="p-6 text-white space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Art & Luxury Collectibles Registry</h1>
          <p className="text-sm text-gray-400">Institutional custodian vault, provenance verification, and asset collateralization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-cyan-400">{item.id}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">{item.status}</span>
            </div>
            <h3 className="font-semibold text-base">{item.name}</h3>
            <p className="text-xs text-gray-400">Creator: {item.artist}</p>
            <div className="pt-2 border-t border-gray-800 flex justify-between items-center">
              <span className="text-xs text-gray-400">{item.category}</span>
              <span className="font-bold text-cyan-300">{item.valuation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtCollectibles;

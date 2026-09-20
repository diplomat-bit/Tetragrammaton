import React from 'react';

export interface CounterpartyDetailsProps {
  counterpartyId?: string;
}

export const CounterpartyDetails: React.FC<CounterpartyDetailsProps> = ({ counterpartyId = 'cp_default' }) => {
  return (
    <div className="p-6 text-white space-y-4">
      <h2 className="text-xl font-bold">Counterparty Entity Verification</h2>
      <p className="text-sm text-gray-400">Entity ID: <span className="font-mono text-cyan-400">{counterpartyId}</span></p>
    </div>
  );
};

export default CounterpartyDetails;

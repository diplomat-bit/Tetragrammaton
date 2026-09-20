import React, { createContext, useContext, useState } from 'react';

export interface MoneyMovementContextType {
  transfers: any[];
  initiateTransfer: (params: any) => Promise<any>;
}

export const MoneyMovementContext = createContext<MoneyMovementContextType>({
  transfers: [],
  initiateTransfer: async () => ({ status: 'success' })
});

export const MoneyMovementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transfers, setTransfers] = useState<any[]>([]);

  const initiateTransfer = async (params: any) => {
    const newTx = { id: 'tx_' + Date.now(), ...params, timestamp: new Date().toISOString() };
    setTransfers(prev => [newTx, ...prev]);
    return { status: 'success', transaction: newTx };
  };

  return (
    <MoneyMovementContext.Provider value={{ transfers, initiateTransfer }}>
      {children}
    </MoneyMovementContext.Provider>
  );
};

export const useMoneyMovement = () => useContext(MoneyMovementContext);
export default MoneyMovementProvider;

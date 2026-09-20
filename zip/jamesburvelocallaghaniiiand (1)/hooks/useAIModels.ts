import { useState, useEffect } from 'react';

export const useAIModels = () => {
  const [model, setModel] = useState<string | null>(null);
  const [modelState, setModelState] = useState<string | null>(null);

  useEffect(() => {
    const simulateModel = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setModel("Simulated Model");
      setModelState("Ready");
    };

    simulateModel();
  }, []);

  return { model, modelState };
};

export default useAIModels;

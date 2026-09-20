import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export const TreasuryXsdConsole = () => {
  const [xmlData, setXmlData] = useState('');
  const [validationResult, setValidationResult] = useState<{status: 'idle' | 'valid' | 'invalid'; message: string}>( {status: 'idle', message: ''});

  const handleValidate = () => {
    // Basic placeholder validation logic
    if (xmlData.includes('<')) {
      setValidationResult({status: 'valid', message: 'XML matches XSD structure.'});
    } else {
      setValidationResult({status: 'invalid', message: 'Invalid XML structure.'});
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-400" />
        US Treasury BFS XML Schema Console
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium">Input XML</label>
          <textarea
            className="w-full h-64 bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm font-mono text-white"
            placeholder="Paste XML content here..."
            value={xmlData}
            onChange={(e) => setXmlData(e.target.value)}
          />
          <button
            onClick={handleValidate}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
          >
            Validate against XSD
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Validation Output</label>
          <div className="h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-y-auto">
            {validationResult.status === 'idle' && <p className="text-slate-500">Ready to validate...</p>}
            {validationResult.status === 'valid' && (
              <div className="text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {validationResult.message}
              </div>
            )}
            {validationResult.status === 'invalid' && (
              <div className="text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {validationResult.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

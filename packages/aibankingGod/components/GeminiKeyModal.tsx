import React, { useState, useEffect } from 'react';
import { Key, X, CheckCircle } from 'lucide-react';

const GeminiKeyModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkKey = () => {
      const hasKey = 
        (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) || 
        localStorage.getItem("CUSTOM_GEMINI_KEY") || 
        (import.meta as any).env?.VITE_GEMINI_API_KEY;
        
      if (!hasKey) {
        setIsOpen(true);
      }
    };
    
    // Check after a short delay to let other things load
    const timer = setTimeout(checkKey, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('CUSTOM_GEMINI_KEY', apiKey.trim());
      setIsSaved(true);
      setTimeout(() => {
        setIsOpen(false);
        // Force a reload to ensure all AI components pick up the new key
        window.location.reload();
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-cyan-500/50 rounded-xl shadow-2xl shadow-cyan-500/20 max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-cyan-500/20 rounded-lg">
            <Key size={24} className="text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Gemini API Key Required</h2>
        </div>
        
        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
          To power the AI features in this application (like Neural Link, Ghost, and Architect), you need to provide a Google Gemini API key. 
          Your key is stored securely in your browser's local storage.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-400 mb-1">
              API Key
            </label>
            <input
              type="password"
              id="gemini-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              autoFocus
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || isSaved}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center"
          >
            {isSaved ? (
              <>
                <CheckCircle size={18} className="mr-2" /> Saved Successfully
              </>
            ) : (
              'Save API Key'
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-sm hover:underline"
          >
            Get a free Gemini API key here &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default GeminiKeyModal;

import React, { useState, useEffect } from 'react';
import { Database, Terminal, Code, Cpu, ChevronRight, Copy, CheckCircle2, Loader2, Key, Link, Zap, ShieldCheck, AlertTriangle, Rocket } from 'lucide-react';
import { View } from '../types';

interface AstraDBQuickstartProps {
    setView?: (view: any) => void;
}

const AstraDBQuickstart: React.FC<AstraDBQuickstartProps> = ({ setView }) => {
    const [copiedStep, setCopiedStep] = useState<number | null>(null);
    const [status, setStatus] = useState<'PENDING' | 'LOADING' | 'HEALTHY' | 'ERROR'>('PENDING');
    const [collections, setCollections] = useState<any[]>([]);
    const [initializing, setInitializing] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'typescript' | 'python'>('typescript');

    const initializeTables = async () => {
        setInitializing(true);
        try {
            const res = await fetch('/api/v1/astra/initialize', { method: 'POST' });
            if (res.ok) {
                // Refresh health check
                const healthRes = await fetch('/api/v1/astra/health');
                if (healthRes.ok) {
                    const data = await healthRes.json();
                    if (data.status === 'healthy') setStatus('HEALTHY');
                }
            }
        } catch (e) {
            console.error("Initialization failed", e);
        } finally {
            setInitializing(false);
        }
    };

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/v1/astra/health');
                if (!res.ok) throw new Error();
                const data = await res.json();
                
                if (data.status === 'healthy') {
                    setStatus('HEALTHY');
                    const collRes = await fetch('/api/v1/astra/collections');
                    if (collRes.ok) {
                        const collData = await collRes.json();
                        setCollections(collData);
                    }
                } else {
                    setStatus('PENDING');
                }
            } catch (e) {
                setStatus('PENDING');
            }
        };
        
        const interval = setInterval(checkStatus, 10000);
        checkStatus();
        return () => clearInterval(interval);
    }, []);

    const copyToClipboard = (text: string, step: number) => {
        navigator.clipboard.writeText(text);
        setCopiedStep(step);
        setTimeout(() => setCopiedStep(null), 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* NAVIGATION */}
            <nav className="mb-6">
                <button 
                    onClick={() => setView?.(View.Dashboard)}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-mono text-[10px] uppercase tracking-widest group cursor-pointer"
                >
                    <ChevronRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to portal
                </button>
            </nav>

            {/* HEADER & STATUS */}
            <section className="bg-gray-900/60 p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                    {status === 'HEALTHY' ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            Active & Secure
                        </div>
                    ) : (
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded-full border border-amber-500/20 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Initialization Pending
                            </div>
                            <button 
                                onClick={initializeTables}
                                disabled={initializing}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase rounded-xl border border-emerald-500/30 transition-all disabled:opacity-50"
                            >
                                {initializing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />}
                                Forge All Tables
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <Database className="text-emerald-400 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">Databases</h1>
                        <p className="text-xs text-gray-500 font-mono">Provisioning high-availability vector clusters on Astra DB.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-800/50">
                    <div className="space-y-1">
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Database Name</span>
                        <div className="text-white font-bold tracking-tight">aibank</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Database ID</span>
                        <div className="text-[11px] font-mono text-emerald-400/80">710a35ae-59da-4917-88b9-6806bc066c08</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">API Endpoint</span>
                        <div className="text-[11px] font-mono text-gray-500 italic">Initializing...</div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-gray-950/50 rounded-2xl border border-gray-800 flex items-center gap-4">
                    {status === 'HEALTHY' ? (
                        <>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <p className="text-[10px] text-emerald-400 font-mono">
                                Systemic Integrity Confirmed. Vector Database is online and processing telemetry.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                            <p className="text-[10px] text-gray-400 font-mono">
                                Database initialization typically takes a few minutes. While your database is being set up, browse quickstart instructions.
                            </p>
                        </>
                    )}
                </div>
            </section>

            {/* QUICKSTART GUIDE */}
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="bg-black/40 p-8 rounded-3xl border border-gray-800">
                        <div className="flex items-center gap-2 mb-8">
                            <Terminal className="text-emerald-400 w-5 h-5" />
                            <h2 className="text-xl font-bold text-white">Developer quickstart setup</h2>
                        </div>

                        <div className="space-y-12">
                            {/* STEP 1 */}
                            <div className="relative pl-10 border-l border-gray-800">
                                <div className="absolute -left-3 top-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black shadow-lg shadow-emerald-500/20">1</div>
                                <h3 className="text-sm font-bold text-white mb-2">Set environment variables</h3>
                                <p className="text-xs text-gray-500 mb-4">Store the endpoint and token in environment variables securely.</p>
                                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 relative group">
                                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto">
{`export ASTRA_DB_API_ENDPOINT="YOUR_API_ENDPOINT"
export ASTRA_DB_APPLICATION_TOKEN="YOUR_TOKEN"`}
                                    </pre>
                                    <button 
                                        onClick={() => copyToClipboard(`export ASTRA_DB_API_ENDPOINT="YOUR_API_ENDPOINT"\nexport ASTRA_DB_APPLICATION_TOKEN="YOUR_TOKEN"`, 1)}
                                        className="absolute top-3 right-3 p-2 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 text-gray-400 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        {copiedStep === 1 ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* STEP 2 */}
                            <div className="relative pl-10 border-l border-gray-800">
                                <div className="absolute -left-3 top-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black">2</div>
                                <h3 className="text-sm font-bold text-white mb-2">Generate an application token</h3>
                                <p className="text-xs text-gray-500 mb-4">Generate a token with Database Administrator permissions. For custom roles, visit Tokens.</p>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="Enter a short description" 
                                        className="bg-black/60 border border-gray-800 rounded-xl px-4 py-2 text-xs text-white font-mono flex-1 focus:outline-none focus:border-emerald-500/50"
                                    />
                                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-xl transition-all">
                                        GENERATE
                                    </button>
                                </div>
                            </div>

                            {/* STEP 3 */}
                            <div className="relative pl-10 border-l border-gray-800">
                                <div className="absolute -left-3 top-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black">3</div>
                                <h3 className="text-sm font-bold text-white mb-2">Install a client</h3>
                                <p className="text-xs text-gray-500 mb-4">Install the @datastax/astra-db-ts package (Node 18+ required).</p>
                                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex justify-between items-center group">
                                    <code className="text-[11px] font-mono text-emerald-400">npm install @datastax/astra-db-ts</code>
                                    <button 
                                        onClick={() => copyToClipboard('npm install @datastax/astra-db-ts', 3)}
                                        className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 text-gray-400 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        {copiedStep === 3 ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* STEP 4 */}
                            <div className="relative pl-10">
                                <div className="absolute -left-3 top-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black">4</div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-1">Connect</h3>
                                        <p className="text-xs text-gray-500">Paste the following code into a new file to verify connectivity.</p>
                                    </div>
                                    <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 self-start">
                                        <button 
                                            onClick={() => setSelectedLanguage('typescript')}
                                            className={`px-3 py-1 text-[10px] font-mono rounded transition-all ${selectedLanguage === 'typescript' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            TypeScript
                                        </button>
                                        <button 
                                            onClick={() => setSelectedLanguage('python')}
                                            className={`px-3 py-1 text-[10px] font-mono rounded transition-all ${selectedLanguage === 'python' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            Python
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 relative group">
                                    {selectedLanguage === 'typescript' ? (
                                        <pre className="text-[10px] font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`import { DataAPIClient } from "@datastax/astra-db-ts";

// Initialize the client
const client = new DataAPIClient();
const db = client.db('YOUR_API_ENDPOINT', {
  token: 'YOUR_TOKEN'
});

(async () => {
  const colls = await db.listCollections();
  console.log('Connected to AstraDB:', colls);
})();`}
                                        </pre>
                                    ) : (
                                        <pre className="text-[10px] font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`from astrapy import DataAPIClient

# Get an existing collection
client = DataAPIClient("YOUR_TOKEN")
database = client.get_database("YOUR_API_ENDPOINT")
collection = database.get_collection("aibank")

# Insert documents into the collection
result = collection.insert_many([
    {
      "name": "Jane Doe",
      "age": 42,
      "$vectorize": "Text to vectorize for this document",
    },
    {
      "nickname": "Bobby",
      "$vectorize": "Text to vectorize for this document",
    }
])`}
                                        </pre>
                                    )}
                                    <button 
                                        onClick={() => {
                                            const tsCode = `import { DataAPIClient } from "@datastax/astra-db-ts";\n\nconst client = new DataAPIClient();\nconst db = client.db('YOUR_API_ENDPOINT', { token: 'YOUR_TOKEN' });\n\n(async () => {\n  const colls = await db.listCollections();\n  console.log('Connected to AstraDB:', colls);\n})();`;
                                            const pyCode = `from astrapy import DataAPIClient\n\nclient = DataAPIClient("YOUR_TOKEN")\ndatabase = client.get_database("YOUR_API_ENDPOINT")\ncollection = database.get_collection("aibank")\n\nresult = collection.insert_many([\n    {\n      "name": "Jane Doe",\n      "age": 42,\n      "$vectorize": "Text to vectorize for this document",\n    },\n    {\n      "nickname": "Bobby",\n      "$vectorize": "Text to vectorize for this document",\n    }\n])`;
                                            copyToClipboard(selectedLanguage === 'typescript' ? tsCode : pyCode, 4);
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 text-gray-400 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        {copiedStep === 4 ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {status === 'HEALTHY' && (
                        <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20 space-y-4">
                            <div className="flex items-center gap-2">
                                <Database className="text-emerald-400 w-4 h-4" />
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Active Collections</h3>
                            </div>
                            <div className="space-y-2">
                                {collections.length > 0 ? collections.map((coll, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl">
                                        <span className="text-[10px] font-mono text-gray-300">{coll.name}</span>
                                        <span className="text-[8px] font-mono text-gray-600 uppercase">{coll.vector?.dimension || 'No Vector'}</span>
                                    </div>
                                )) : (
                                    <p className="text-[10px] text-gray-500 italic">No collections found. Start by creating one.</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-900/40 p-6 rounded-3xl border border-gray-800 space-y-6">
                        <div className="flex items-center gap-2">
                            <Cpu className="text-emerald-400 w-4 h-4" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Resources</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { icon: <Link size={14} />, label: 'Integrations Guide' },
                                { icon: <Code size={14} />, label: 'Data API Docs' },
                                { icon: <Zap size={14} />, label: 'Tutorials' },
                                { icon: <Key size={14} />, label: 'Token Management' }
                            ].map((item, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="text-gray-500 group-hover:text-emerald-400">{item.icon}</div>
                                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-white uppercase">{item.label}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-700 group-hover:text-emerald-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-600/5 p-6 rounded-3xl border border-emerald-500/10">
                        <h4 className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-2">Pro Tip</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed italic">
                            "Vector search capabilities are automatically enabled for this cluster. You can begin ingesting embeddings immediately after initialization."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AstraDBQuickstart;

import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { 
    Cloud, Server, Database, Shield, Box, Search, 
    UploadCloud, BarChart3, Activity, Compass, Cpu, 
    Globe, Network, Zap, GitBranch, Key
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface GcpResource {
    name: string;
    resourceType: string;
    projectId: string;
    displayName: string;
    createTime: string;
    updateTime: string;
    status: string;
    folders: string;
    organization: string;
    parentAssetType: string;
    parentResourceName: string;
    kmsKeys: string;
    directTags: string;
    description: string;
    location: string;
    labels: string;
    networkTags: string;
    additionalAttributes: string;
}

export const INTERNAL_GCP_SAMPLE_DATA = `Name,Resource type,Project Id,Display name,Create time,Update time,Status,Folders,Organization,Parent asset type,Parent full resource name,KMS keys,Direct tags,Description,Location,Labels,Network tags,Additional attributes
"//serviceusage.googleapis.com/projects/640024090334/services/firebasedatabase.googleapis.com","serviceusage.Service","regal-skyline-402703","firebasedatabase.googleapis.com","null","null","ENABLED","[]","organizations/455321300146","cloudresourcemanager.googleapis.com/Project","//cloudresourcemanager.googleapis.com/projects/regal-skyline-402703","[]","[]","","global","{}","[]","null"
"//serviceusage.googleapis.com/projects/640024090334/services/bigquerydatapolicy.googleapis.com","serviceusage.Service","regal-skyline-402703","bigquerydatapolicy.googleapis.com","null","null","ENABLED","[]","organizations/455321300146","cloudresourcemanager.googleapis.com/Project","//cloudresourcemanager.googleapis.com/projects/regal-skyline-402703","[]","[]","","global","{}","[]","null"
"//serviceusage.googleapis.com/projects/640024090334/services/testing.googleapis.com","serviceusage.Service","regal-skyline-402703","testing.googleapis.com","null","null","ENABLED","[]","organizations/455321300146","cloudresourcemanager.googleapis.com/Project","//cloudresourcemanager.googleapis.com/projects/regal-skyline-402703","[]","[]","","global","{}","[]","null"
"//serviceusage.googleapis.com/projects/640024090334/services/replicapool.googleapis.com","serviceusage.Service","regal-skyline-402703","replicapool.googleapis.com","null","null","ENABLED","[]","organizations/455321300146","cloudresourcemanager.googleapis.com/Project","//cloudresourcemanager.googleapis.com/projects/regal-skyline-402703","[]","[]","","global","{}","[]","null"
"//serviceusage.googleapis.com/projects/640024090334/services/testing.googleapis.com","serviceusage.Service","regal-skyline-402703","testing.googleapis.com","null","null","ENABLED","[]","organizations/455321300146","cloudresourcemanager.googleapis.com/Project","//cloudresourcemanager.googleapis.com/projects/regal-skyline-402703","[]","[]","","global","{}","[]","null"`;

const CATEGORY_MAP: Record<string, { label: string, icon: any, color: string }> = {
    'serviceusage.Service': { label: 'Enabled APIs', icon: <Globe size={18} />, color: 'text-blue-400' },
    'bigquery.Dataset': { label: 'BigQuery Datasets', icon: <Database size={18} />, color: 'text-orange-400' },
    'storage.Bucket': { label: 'Cloud Storage', icon: <Box size={18} />, color: 'text-cyan-400' },
    'iam.ServiceAccount': { label: 'Service Accounts', icon: <Shield size={18} />, color: 'text-yellow-400' },
    'iam.ServiceAccountKey': { label: 'SA Keys', icon: <Key size={18} />, color: 'text-yellow-500' },
    'firebase.FirebaseProject': { label: 'Firebase Projects', icon: <Zap size={18} />, color: 'text-amber-500' },
    'discoveryengine.DataStore': { label: 'Discovery Engine', icon: <Compass size={18} />, color: 'text-purple-400' },
    'cloudfunctions.Function': { label: 'Cloud Functions', icon: <Activity size={18} />, color: 'text-pink-400' },
    'cloudbuild.Repository': { label: 'Cloud Build', icon: <GitBranch size={18} />, color: 'text-green-400' },
    'logging.LogBucket': { label: 'Cloud Logging', icon: <BarChart3 size={18} />, color: 'text-slate-400' },
    'secretmanager.Secret': { label: 'Secret Manager', icon: <Shield size={18} />, color: 'text-emerald-400' },
    'gkehub.Feature': { label: 'GKE Hub', icon: <Network size={18} />, color: 'text-indigo-400' },
    'eventarc.Channel': { label: 'Eventarc', icon: <Zap size={18} />, color: 'text-yellow-300' }
};

const getCategoryBadge = (resourceType: string) => {
    const config = CATEGORY_MAP[resourceType] || { label: resourceType.split('.').pop() || resourceType, icon: <Cloud size={18} />, color: 'text-gray-400' };
    return config;
};

const GcpInventoryView: React.FC = () => {
    const [resources, setResources] = useState<GcpResource[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                processParsedData(results.data);
            }
        });
    };

    const handleLoadSample = () => {
        Papa.parse(INTERNAL_GCP_SAMPLE_DATA, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                processParsedData(results.data);
            }
        });
    };

    const processParsedData = (data: any[]) => {
        const parsed: GcpResource[] = data.map((row: any) => ({
            name: row['Name'] || '',
            resourceType: row['Resource type'] || '',
            projectId: row['Project Id'] || '',
            displayName: row['Display name'] || '',
            createTime: row['Create time'] || '',
            updateTime: row['Update time'] || '',
            status: row['Status'] || '',
            folders: row['Folders'] || '',
            organization: row['Organization'] || '',
            parentAssetType: row['Parent asset type'] || '',
            parentResourceName: row['Parent full resource name'] || '',
            kmsKeys: row['KMS keys'] || '',
            directTags: row['Direct tags'] || '',
            description: row['Description'] || '',
            location: row['Location'] || '',
            labels: row['Labels'] || '',
            networkTags: row['Network tags'] || '',
            additionalAttributes: row['Additional attributes'] || ''
        }));
        setResources(parsed);
    };

    const typesCount = useMemo(() => {
        const counts: Record<string, number> = {};
        resources.forEach(r => {
            counts[r.resourceType] = (counts[r.resourceType] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [resources]);

    const filteredResources = useMemo(() => {
        return resources.filter(r => {
            const matchesSearch = (r.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 r.resourceType?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 r.projectId?.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesType = selectedType ? r.resourceType === selectedType : true;
            return matchesSearch && matchesType;
        });
    }, [resources, searchQuery, selectedType]);

    return (
        <div className="h-full flex flex-col pt-4 overflow-hidden">
            <div className="px-8 pb-8 flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2">Infrastructure <span className="text-cyan-500">Fabric</span></h1>
                    <p className="text-[10px] text-gray-500 font-mono tracking-[0.4em] uppercase">
                        Sovereign Environment Asset Inventory // ATTESTATION_READY
                    </p>
                </div>
                {resources.length > 0 && (
                     <div className="flex items-center gap-8">
                        <div className="text-right">
                           <div className="text-3xl font-black text-white tracking-tighter leading-none">{resources.length}</div>
                           <div className="text-[9px] text-gray-600 uppercase tracking-[0.2em] mt-1 font-black">Identified Nodes</div>
                        </div>
                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-2xl transition-all">
                             <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                             <UploadCloud className="text-gray-400" size={20} />
                        </label>
                    </div>
                )}
            </div>

            {resources.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black/20 m-8 rounded-[3rem] border border-white/5 border-dashed">
                    <div className="w-32 h-32 rounded-full bg-cyan-500/5 flex items-center justify-center mb-10 border border-cyan-500/10 relative">
                        <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-ping opacity-20" />
                        <Cloud size={64} className="text-cyan-400 opacity-80" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-white mb-4 uppercase">System Ingestion Pending</h2>
                    <p className="text-sm text-gray-500 font-mono mb-12 max-w-lg text-center uppercase tracking-widest leading-relaxed">
                        Awaiting sovereign infrastructure manifest. Please upload your GCP Asset Inventory (CSV) to initialize the architectural data mesh.
                    </p>
                    <label className="cursor-pointer group relative overflow-hidden bg-white text-black rounded-[2rem] px-12 py-6 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                        <div className="flex items-center gap-4 relative z-10">
                            <UploadCloud className="text-black" />
                            <span className="font-black tracking-[0.2em] uppercase text-sm">Synchronize Manifest</span>
                        </div>
                    </label>
                </div>
            ) : (
                <div className="flex-1 flex gap-6 px-8 pb-8 overflow-hidden">
                    {/* Left Panel - Analytics & Types */}
                    <div className="w-72 flex flex-col gap-6 shrink-0 h-full overflow-y-auto no-scrollbar pb-10">
                        <div className="bg-black/40 backdrop-blur-3xl border border-white/5 p-5 rounded-2xl">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder="Search architecture..." 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="bg-black/40 backdrop-blur-3xl border border-white/5 p-5 rounded-2xl space-y-4">
                            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <Cpu size={12} /> Auto-Scaler Control
                            </h3>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => alert("Initiating Kubernetes Self-Healing Sequence...")}
                                    className="w-full py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase rounded-xl hover:bg-emerald-500/20 transition-all"
                                >
                                    Force Self-Healing
                                </button>
                                <button 
                                    onClick={() => alert("Triggering Global Auto-Scale Event (HPA)...")}
                                    className="w-full py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase rounded-xl hover:bg-cyan-500/20 transition-all"
                                >
                                    Trigger HPA Scale-Up
                                </button>
                            </div>
                        </div>

                        <div className="bg-black/40 backdrop-blur-3xl border border-white/5 p-1 rounded-2xl flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Taxonomy</h3>
                                {selectedType && (
                                    <button onClick={() => setSelectedType(null)} className="text-[9px] text-cyan-400 hover:text-cyan-300 uppercase tracking-widest font-bold">
                                        Clear Filter
                                    </button>
                                )}
                            </div>
                            <div className="p-2 space-y-1 overflow-y-auto custom-scrollbar">
                                {typesCount.map(([type, count]) => {
                                    const { label, icon, color } = getCategoryBadge(type);
                                    const isSelected = selectedType === type;
                                    return (
                                        <button 
                                            key={type}
                                            onClick={() => setSelectedType(isSelected ? null : type)}
                                            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 ${
                                                isSelected 
                                                    ? 'bg-cyan-500/10 border border-cyan-500/20' 
                                                    : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <span className={color}>{icon}</span>
                                                <span className="text-xs text-gray-300 font-mono truncate tracking-wide">{label}</span>
                                            </div>
                                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-gray-500'}`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Data Grid */}
                    <div className="flex-1 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-2xl flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 shrink-0">
                            <div className="flex items-center gap-3">
                                <Server size={18} className="text-gray-400" />
                                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                                    {filteredResources.length} {filteredResources.length === 1 ? 'Node' : 'Nodes'} Operational
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="sticky top-0 bg-[#0a0a0a] z-10 shadow-md">
                                    <tr>
                                        <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Name / Project</th>
                                        <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Resource Type</th>
                                        <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest max-w-xs">Location / Parent</th>
                                        <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResources.map((res, i) => {
                                        const { label, icon, color } = getCategoryBadge(res.resourceType);
                                        return (
                                            <motion.tr 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.01 }}
                                                key={`${res.name}-${i}`} 
                                                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-gray-200 font-mono font-medium truncate max-w-[300px]">
                                                            {res.displayName || res.name.split('/').pop()}
                                                        </span>
                                                        <span className="text-[10px] text-gray-600 font-mono truncate mt-1">
                                                            {res.projectId || 'Global'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <span className={color}>{icon}</span>
                                                        <div>
                                                            <div className="text-xs text-gray-300">{label}</div>
                                                            <div className="text-[9px] text-gray-600 font-mono mt-0.5 truncate max-w-[200px]">{res.resourceType}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 max-w-[200px]">
                                                    <div className="text-xs text-gray-400 font-mono truncate">{res.location || '-'}</div>
                                                    <div className="text-[9px] text-gray-600 font-mono truncate mt-0.5" title={res.parentResourceName}>
                                                        {res.parentResourceName.split('/').pop() || '-'}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    {res.status ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                                                            {res.status}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-500/10 text-gray-400 text-[9px] font-black uppercase tracking-widest border border-gray-500/20">
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredResources.length === 0 && (
                                <div className="p-12 text-center text-gray-500 font-mono text-sm">
                                    No assets found matching the current filters.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GcpInventoryView;

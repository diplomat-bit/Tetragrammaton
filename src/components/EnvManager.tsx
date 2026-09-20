import React, { useState, useEffect, useMemo } from 'react';
import {
  Settings,
  Save,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

interface EnvItem {
  key: string;
  category: string;
  categoryLabel: string;
  description: string;
  value: string;
  isSecret: boolean;
  isSet: boolean;
  status: 'configured' | 'missing' | 'expired_notice';
  isExpiredNotice?: boolean;
  requiredFor?: string;
  maskedValue: string;
  defaultValue?: string;
}

export const EnvManager: React.FC = () => {
  const [items, setItems] = useState<EnvItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'missing' | 'expired' | 'configured'>('all');
  const [unmaskedKeys, setUnmaskedKeys] = useState<Record<string, boolean>>({});

  const fetchEnv = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/api/env/all');
      if (res.ok && res.data) {
        setItems(res.data.items || []);
        setEdits({});
      } else {
        setError('Failed to load environment variables');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnv();
  }, []);

  const handleSave = async () => {
    if (Object.keys(edits).length === 0) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await apiFetch<any>('/api/env/update', {
        method: 'POST',
        body: JSON.stringify({ updates: edits }),
      });
      if (res.ok && res.data) {
        setSuccess(res.data.message || 'Variables updated successfully');
        setItems(res.data.items || []);
        setEdits({});
      } else {
        setError('Failed to update variables');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    window.location.href = '/api/env/download';
  };

  const toggleReveal = (key: string) => {
    setUnmaskedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Metrics
  const totalCount = items.length;
  const missingCount = items.filter(i => i.status === 'missing').length;
  const expiredCount = items.filter(i => i.status === 'expired_notice' || i.isExpiredNotice).length;
  const configuredCount = items.filter(i => i.status === 'configured' && !i.isExpiredNotice).length;

  const categories = useMemo(() => {
    return Array.from(new Set(items.map(i => i.categoryLabel))).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryLabel !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'missing' && item.status !== 'missing') {
        return false;
      }
      if (statusFilter === 'expired' && item.status !== 'expired_notice' && !item.isExpiredNotice) {
        return false;
      }
      if (statusFilter === 'configured' && (item.status !== 'configured' || item.isExpiredNotice)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKey = item.key.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.categoryLabel.toLowerCase().includes(q);
        return matchKey || matchDesc || matchCat;
      }

      return true;
    });
  }, [items, selectedCategory, statusFilter, searchQuery]);

  const filteredCategories = useMemo(() => {
    return Array.from(new Set(filteredItems.map(i => i.categoryLabel)));
  }, [filteredItems]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400">
              <Settings className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Environment & Gateway Configurator</h1>
          </div>
          <p className="text-xs text-[#8B949E] max-w-3xl leading-relaxed">
            Audit and configure environment credentials across Citi Open Banking, Visa Developer, Alpaca Trading, Stripe, Plaid, and Modern Treasury.
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={fetchEnv}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Download .env</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving || Object.keys(edits).length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              Object.keys(edits).length > 0 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg border border-emerald-400' 
                : 'bg-emerald-900/30 text-emerald-500/50 border border-emerald-900/50 cursor-not-allowed'
            }`}
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
            <span>{saving ? 'Saving...' : `Save ${Object.keys(edits).length} Changes`}</span>
          </button>
        </div>
      </div>

      {/* Audit Stats & Diagnostic Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-[#1F242C] border-[#58A6FF] shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
          }`}
        >
          <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider">Total Schema Vars</div>
          <div className="text-xl font-extrabold text-white mt-0.5">{totalCount}</div>
          <div className="text-[10px] text-[#58A6FF] mt-1">Full System Coverage</div>
        </button>

        <button
          onClick={() => setStatusFilter('missing')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'missing'
              ? 'bg-amber-950/30 border-amber-500 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
          }`}
        >
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Missing Vars</span>
          </div>
          <div className="text-xl font-extrabold text-amber-300 mt-0.5">{missingCount}</div>
          <div className="text-[10px] text-amber-400/80 mt-1">Pending setup</div>
        </button>

        <button
          onClick={() => setStatusFilter('expired')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'expired'
              ? 'bg-rose-950/30 border-rose-500 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
          }`}
        >
          <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Expired Tokens</span>
          </div>
          <div className="text-xl font-extrabold text-rose-300 mt-0.5">{expiredCount}</div>
          <div className="text-[10px] text-rose-400/80 mt-1">Needs token refresh</div>
        </button>

        <button
          onClick={() => setStatusFilter('configured')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'configured'
              ? 'bg-emerald-950/30 border-emerald-500 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
          }`}
        >
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Configured</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-300 mt-0.5">{configuredCount}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Live active</div>
        </button>
      </div>

      {/* Critical Token Notice when Citi Bearer is Expired */}
      {expiredCount > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-300">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-white">Action Required: </span>
              Your Citi bearer token has expired and API calls to live endpoints have been paused to prevent 401 unauthorized errors. Update <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-200 font-mono">CITI_BEARER_TOKEN</code> below with a fresh token.
            </div>
          </div>
          <button
            onClick={() => {
              setStatusFilter('expired');
              setSearchQuery('CITI');
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-200 hover:bg-amber-500/30 transition-all shrink-0"
          >
            Jump to Expired Tokens
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8B949E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by variable name, provider, or description..."
            className="w-full bg-[#0D1117] border border-[#30363D] focus:border-[#58A6FF] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8B949E] outline-none font-mono"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#8B949E]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0D1117] border border-[#30363D] text-xs text-[#C9D1D9] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#58A6FF]"
          >
            <option value="all">All Categories ({totalCount})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({items.filter(i => i.categoryLabel === c).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 flex items-center space-x-3 text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* Variables Render By Category */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-8 text-center text-[#8B949E]">
            <p className="text-sm font-semibold">No environment variables match the current filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStatusFilter('all');
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-[#21262D] text-xs text-white font-medium hover:bg-[#30363D]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCategories.map((catLabel) => {
            const catItems = filteredItems.filter(i => i.categoryLabel === catLabel);
            return (
              <div key={catLabel} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-2">
                  <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>{catLabel}</span>
                    <span className="text-xs font-normal text-[#8B949E]">({catItems.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {catItems.map((item) => {
                    const isEdited = item.key in edits;
                    const currentValue = isEdited
                      ? edits[item.key]
                      : (unmaskedKeys[item.key] ? item.value : (item.isSet ? item.maskedValue : ''));
                    const isExpired = item.status === 'expired_notice' || item.isExpiredNotice;
                    const isMissing = item.status === 'missing' && !isEdited;

                    return (
                      <div
                        key={item.key}
                        className={`bg-[#161B22] border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all ${
                          isExpired
                            ? 'border-amber-500/50 bg-amber-950/10'
                            : isMissing
                            ? 'border-[#30363D] hover:border-[#484F58]'
                            : 'border-[#30363D]'
                        }`}
                      >
                        <div className="md:w-2/5 space-y-1 shrink-0">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="text-xs font-mono font-bold text-sky-300">{item.key}</span>
                            
                            {item.isSecret && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                SECRET
                              </span>
                            )}

                            {isExpired ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                EXPIRED TOKEN
                              </span>
                            ) : item.isSet || isEdited ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {isEdited ? 'EDITED' : 'CONFIGURED'}
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#30363D] text-[#8B949E] border border-[#484F58]">
                                MISSING
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#8B949E] leading-relaxed">{item.description}</p>
                        </div>
                        
                        <div className="flex-1 min-w-0 flex items-center space-x-2">
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => setEdits(prev => ({ ...prev, [item.key]: e.target.value }))}
                            placeholder={item.defaultValue ? `Default: ${item.defaultValue}` : 'Enter new value...'}
                            className={`w-full bg-[#0d1117] border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-mono transition-colors ${
                              isEdited
                                ? 'border-pink-500/50 bg-pink-500/5'
                                : isExpired
                                ? 'border-amber-500/40 bg-amber-950/20'
                                : 'border-[#30363D]'
                            }`}
                          />

                          {item.isSecret && item.isSet && !isEdited && (
                            <button
                              type="button"
                              onClick={() => toggleReveal(item.key)}
                              title={unmaskedKeys[item.key] ? 'Mask secret' : 'Reveal secret'}
                              className="p-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white border border-[#30363D] transition-colors"
                            >
                              {unmaskedKeys[item.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

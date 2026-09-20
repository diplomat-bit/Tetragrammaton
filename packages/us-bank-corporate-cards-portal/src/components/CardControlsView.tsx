import { fetchApi } from '../utils';
import { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle, Save, Plus, Trash2, Loader2, Info, CheckCircle2 } from 'lucide-react';

interface MAC {
  action: 'Approve' | 'Decline' | 'Open';
  merchantGroup: string;
}

export default function CardControlsView({ accountUID }: { accountUID: string }) {
  const [controls, setControls] = useState<MAC[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchControls();
  }, [accountUID]);

  const fetchControls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi(`/api/accounts/${accountUID}/merchant-auth-controls`);
      // Assume the API returns { merchantAuthControls: MAC[] } or just MAC[]
      setControls(Array.isArray(data) ? data : (data.merchantAuthControls || []));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveControls = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await fetchApi(`/api/accounts/${accountUID}/merchant-auth-controls`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(controls)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addControl = () => {
    if (controls.length >= 9) return;
    setControls([...controls, { action: 'Approve', merchantGroup: '' }]);
  };

  const removeControl = (index: number) => {
    const newControls = [...controls];
    newControls.splice(index, 1);
    setControls(newControls);
  };

  const updateControl = (index: number, field: keyof MAC, value: string) => {
    const newControls = [...controls];
    newControls[index] = { ...newControls[index], [field]: value };
    setControls(newControls);
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-8 animate-pulse">
        <div className="h-20 bg-white rounded-xl border border-slate-100 shadow-sm"></div>
        <div className="h-96 bg-white rounded-xl border border-slate-100 shadow-sm"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Merchant Controls</h1>
        <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
          Configure Merchant Authorization Controls (MAC) for Account: <span className="font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-sm border border-blue-100 shadow-sm">{accountUID}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="text-sm font-medium leading-relaxed">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          <div className="text-sm font-medium">Authorization controls updated successfully.</div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
              <ShieldAlert className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">MCCG Restrictions</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Manage up to 9 merchant category group controls.</p>
            </div>
          </div>
          <button 
            onClick={addControl}
            disabled={controls.length >= 9}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Control
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {controls.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-base font-medium bg-slate-50 rounded-xl border border-slate-100 border-dashed">
              No authorization controls currently configured for this account.
            </div>
          ) : (
            controls.map((mac, index) => (
              <div key={index} className="flex items-start gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 group-hover:bg-blue-400 transition-colors"></div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Action</label>
                  <select 
                    value={mac.action}
                    onChange={(e) => updateControl(index, 'action', e.target.value)}
                    className="w-full text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                  >
                    <option value="Approve">Approve</option>
                    <option value="Decline">Decline</option>
                    <option value="Open">Open</option>
                  </select>
                </div>
                <div className="flex-[2] space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Merchant Group Code</label>
                  <input 
                    type="text" 
                    value={mac.merchantGroup}
                    placeholder="e.g. Airlines, Retail"
                    onChange={(e) => updateControl(index, 'merchantGroup', e.target.value)}
                    className="w-full text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all shadow-sm placeholder:font-normal"
                  />
                </div>
                <div className="pt-7">
                  <button 
                    onClick={() => removeControl(index)}
                    className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Remove Control"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            onClick={saveControls}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-70 transition-all"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

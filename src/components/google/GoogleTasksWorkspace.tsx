import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckSquare, Plus, Trash2, Calendar, Clock, AlertCircle,
  Sparkles, RefreshCw, CheckCircle2, Circle, Tag, Filter, ArrowUpDown,
  ExternalLink, Check
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

interface TaskItem {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  subtasks: { id: string; text: string; done: boolean }[];
  details?: string;
}

export const GoogleTasksWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [activeList, setActiveList] = useState<string>('treasury');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [lists, setLists] = useState([
    { id: 'treasury', name: 'Treasury & Settlements' },
    { id: 'quant', name: 'Quantitative & RWA' },
    { id: 'cryptography', name: 'Cryptography & ZKP' },
    { id: 'general', name: 'General Operations' },
  ]);

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 't-1',
      listId: 'treasury',
      title: 'Execute $2M Fedwire priority wire via Citibank N.A.',
      completed: true,
      dueDate: 'Today',
      priority: 'critical',
      subtasks: [
        { id: 'st-1', text: 'Verify Federal Reserve IMAD 20260912CITIUS33990021', done: true },
        { id: 'st-2', text: 'Confirm SBA-KL-02 non-dilutable tranche clearance', done: true },
      ],
      details: 'Priority wire distribution conforming to Schedule 1-A covenants.'
    },
    {
      id: 't-2',
      listId: 'treasury',
      title: 'Ingest ISO 20022 pacs.008.001.10 XML Payment Stream',
      completed: false,
      dueDate: 'Tomorrow',
      priority: 'high',
      subtasks: [
        { id: 'st-3', text: 'Validate TAS/BETC classification code 020-000-0000/DISB', done: true },
        { id: 'st-4', text: 'Generate UETR end-to-end audit tracking log', done: false },
      ],
      details: 'Treasury Bureau of the Fiscal Service API sync.'
    },
    {
      id: 't-3',
      listId: 'quant',
      title: 'Calibrate Black-Scholes Volatility Skew Curves',
      completed: false,
      dueDate: 'Sep 15',
      priority: 'high',
      subtasks: [
        { id: 'st-5', text: 'Derive continuous Merton Distance to Default (DD)', done: true },
        { id: 'st-6', text: 'Execute Greeks sensitivity stress-testing', done: false },
      ],
      details: 'Automated quantitative risk computation.'
    },
    {
      id: 't-4',
      listId: 'cryptography',
      title: 'Audit Groth16 Zero-Knowledge Verification Circuits',
      completed: false,
      dueDate: 'Sep 18',
      priority: 'medium',
      subtasks: [
        { id: 'st-7', text: 'Verify BN254 elliptic curve pairing equations', done: false },
      ],
      details: 'Zero-knowledge identity proof validation.'
    }
  ]);

  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Tomorrow');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('high');
  const [newTaskDetails, setNewTaskDetails] = useState('');

  // Fetch live tasks from Google Tasks API
  const fetchLiveGoogleTasks = useCallback(async () => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const res = await callGoogleApi<{ items?: any[] }>(
        'https://tasks.googleapis.com/tasks/v1/users/@me/lists'
      );

      if (res.items && res.items.length > 0) {
        const liveLists = res.items.map((it: any) => ({
          id: it.id,
          name: it.title || 'Google Tasks'
        }));
        setLists((prev) => {
          const ids = new Set(liveLists.map((l: any) => l.id));
          return [...liveLists, ...prev.filter((l) => !ids.has(l.id))];
        });
        setStatusMsg(`Synchronized ${res.items.length} live Google Task lists!`);
      }
    } catch (err: any) {
      console.warn('Google Tasks fetch error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchLiveGoogleTasks();
    }
  }, [token, fetchLiveGoogleTasks]);

  const toggleTaskCompleted = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) => (st.id === subtaskId ? { ...st, done: !st.done } : st)),
        };
      })
    );
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    if (token) {
      setIsSyncing(true);
      try {
        await callGoogleApi(`https://tasks.googleapis.com/tasks/v1/lists/@default/tasks`, {
          method: 'POST',
          body: JSON.stringify({
            title: newTaskTitle,
            notes: newTaskDetails || 'Created from Sovereign OS'
          })
        });
        setStatusMsg('Task created and pushed live to your Google Tasks account!');
      } catch (err: any) {
        console.warn('Google tasks note:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      listId: activeList,
      title: newTaskTitle,
      completed: false,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      subtasks: [],
      details: newTaskDetails
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDetails('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (t.listId !== activeList && activeList !== 'all') return false;
    if (filterStatus === 'active') return !t.completed;
    if (filterStatus === 'completed') return t.completed;
    return true;
  });

  const priorityBadge = (p: TaskItem['priority']) => {
    switch (p) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">MEDIUM</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-700 text-slate-300">LOW</span>;
    }
  };

  return (
    <div id="google-tasks-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Tasks"
        scopeDescription="Connect your Google Account to manage and sync tasks with Google Tasks."
        onTokenChange={(t) => setToken(t)}
      />

      {statusMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMsg}
          </span>
          <button onClick={() => setStatusMsg(null)} className="text-[#8B949E] hover:text-white">✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 shadow-inner">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Google Tasks Manager</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                TASKS V1 CLOUD API
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Mission-critical task queues with priority scheduling & live Google Tasks synchronization
            </p>
          </div>
        </div>

        {token && (
          <button
            onClick={fetchLiveGoogleTasks}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Tasks
          </button>
        )}
      </div>

      {/* Main Tasks Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Lists Sidebar */}
        <div className="space-y-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 h-fit">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Task Categories</span>
          <div className="space-y-1">
            {lists.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveList(l.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeList === l.id ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{l.name}</span>
                <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-full text-[10px]">
                  {tasks.filter((t) => t.listId === l.id).length}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase px-2 font-mono">Status Filter</span>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['all', 'active', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`flex-1 py-1 text-[11px] capitalize rounded font-medium transition-colors ${
                    filterStatus === st ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List & Creator */}
        <div className="lg:col-span-3 space-y-4">
          {/* Add Task Input */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddTask}
                disabled={isSyncing || !newTaskTitle.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add Task
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <input
                  type="text"
                  placeholder="Optional details or instructions..."
                  value={newTaskDetails}
                  onChange={(e) => setNewTaskDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="critical">Priority: Critical</option>
                  <option value="high">Priority: High</option>
                  <option value="medium">Priority: Medium</option>
                  <option value="low">Priority: Low</option>
                </select>
                <input
                  type="text"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  placeholder="Due date"
                  className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white text-center font-mono"
                />
              </div>
            </div>
          </div>

          {/* Task Items Stream */}
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 border border-slate-800 rounded-2xl">
                No tasks match the active filters.
              </div>
            ) : (
              filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 bg-slate-950 border rounded-2xl transition-all space-y-3 group ${
                    t.completed ? 'border-slate-800/50 opacity-60' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => toggleTaskCompleted(t.id)}
                        className="mt-0.5 cursor-pointer text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        {t.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 hover:text-blue-400" />
                        )}
                      </button>
                      <div className="space-y-1">
                        <p className={`text-xs font-bold ${t.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {t.title}
                        </p>
                        {t.details && <p className="text-[11px] text-slate-400">{t.details}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {priorityBadge(t.priority)}
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {t.dueDate}
                      </span>
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtasks */}
                  {t.subtasks.length > 0 && (
                    <div className="pl-8 space-y-1.5 pt-2 border-t border-slate-900">
                      {t.subtasks.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => toggleSubtask(t.id, st.id)}
                          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                            st.done ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700'
                          }`}>
                            {st.done && '✓'}
                          </span>
                          <span className={st.done ? 'line-through text-slate-600' : ''}>{st.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

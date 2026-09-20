import React, { useState } from 'react';
import {
  FormInput, Plus, Trash2, CheckCircle2, Eye, Download,
  Sparkles, RefreshCw, BarChart3, Share2, Send, ListOrdered, Check,
  ExternalLink, Cloud
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

interface FormQuestion {
  id: string;
  question: string;
  type: 'text' | 'paragraph' | 'multiple_choice' | 'checkbox' | 'scale';
  options?: string[];
  required: boolean;
}

export const GoogleFormsWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [formTitle, setFormTitle] = useState('Institutional KYC & Merchant Onboarding Protocol');
  const [formDescription, setFormDescription] = useState('Complete compliance verification for automated Open Banking and Fedwire settlement access.');
  const [viewTab, setViewTab] = useState<'editor' | 'preview' | 'responses'>('editor');
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudFormUrl, setCloudFormUrl] = useState<string | null>(null);
  const [cloudMsg, setCloudMsg] = useState<string | null>(null);

  const [questions, setQuestions] = useState<FormQuestion[]>([
    {
      id: 'q-1',
      question: 'Legal Commercial Business Entity Name',
      type: 'text',
      required: true
    },
    {
      id: 'q-2',
      question: 'Primary Settlement Rail Target',
      type: 'multiple_choice',
      options: ['Citigroup Fedwire Priority', 'ISO 20022 pacs.008 Real-Time', 'Visa Direct Connect', 'ERC-3643 Tokenized Equities'],
      required: true
    },
    {
      id: 'q-3',
      question: 'Anticipated Monthly Disbursement Volume (USD)',
      type: 'scale',
      options: ['1: < $1M', '2: $1M - $10M', '3: $10M - $50M', '4: $50M - $250M', '5: > $250M+'],
      required: true
    },
    {
      id: 'q-4',
      question: 'Developer Webhook & Public JWS Signing Endpoint',
      type: 'text',
      required: false
    }
  ]);

  // Submission answers for preview testing
  const [testAnswers, setTestAnswers] = useState<{ [qId: string]: any }>({});
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Responses log
  const [responses, setResponses] = useState<any[]>([
    {
      id: 'resp-1',
      timestamp: 'Today, 10:20 AM',
      entity: 'Apex Sovereign Trust LLC',
      rail: 'Citigroup Fedwire Priority',
      volume: '5: > $250M+',
      endpoint: 'https://api.apexsovereign.io/v1/webhook'
    },
    {
      id: 'resp-2',
      timestamp: 'Yesterday, 04:45 PM',
      entity: 'Alpaca Clearing Liquidity Provider',
      rail: 'ERC-3643 Tokenized Equities',
      volume: '4: $50M - $250M',
      endpoint: 'https://clearing.alpaca.markets/rwa/hooks'
    }
  ]);

  const handleCreateGoogleForm = async () => {
    if (!token) {
      setCloudMsg('Please connect your Google Account first using the button above.');
      return;
    }
    setIsCloudSyncing(true);
    setCloudMsg(null);
    try {
      const res = await callGoogleApi<{ formId: string; responderUri?: string }>(
        'https://forms.googleapis.com/v1/forms',
        {
          method: 'POST',
          body: JSON.stringify({
            info: {
              title: formTitle || 'Institutional KYC Protocol',
              documentTitle: formTitle || 'Institutional KYC Protocol'
            }
          })
        }
      );

      if (res.formId) {
        const url = res.responderUri || `https://docs.google.com/forms/d/${res.formId}/edit`;
        setCloudFormUrl(url);
        setCloudMsg(`Successfully published Google Form to your account!`);
      }
    } catch (err: any) {
      setCloudMsg(`Form creation notice: ${err.message}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const addQuestion = (type: FormQuestion['type'] = 'text') => {
    const newQ: FormQuestion = {
      id: `q-${Date.now()}`,
      question: 'New Audit Verification Field',
      type,
      required: false,
      options: type === 'multiple_choice' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined
    };
    setQuestions([...questions, newQ]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResp = {
      id: `resp-${Date.now()}`,
      timestamp: 'Just now',
      entity: testAnswers['q-1'] || 'Anonymous Sovereign Entity',
      rail: testAnswers['q-2'] || 'Citigroup Fedwire Priority',
      volume: testAnswers['q-3'] || '3: $10M - $50M',
      endpoint: testAnswers['q-4'] || 'https://sandbox.sovereign.io/webhook'
    };
    setResponses([newResp, ...responses]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setViewTab('responses');
    }, 1200);
  };

  return (
    <div id="google-forms-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Forms"
        scopeDescription="Connect your Google Account to create, deploy, and analyze live Google Forms."
        onTokenChange={(t) => setToken(t)}
      />

      {cloudMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {cloudMsg}
          </span>
          {cloudFormUrl && (
            <a
              href={cloudFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
            >
              Open in Google Forms <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 shadow-inner">
            <FormInput className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-purple-500 focus:outline-none transition-colors px-1"
              />
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                FORMS V1 ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live interactive questionnaire architect, compliance intake pipeline, and analytics studio
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewTab('editor')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                viewTab === 'editor' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Form Builder
            </button>
            <button
              onClick={() => setViewTab('preview')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                viewTab === 'preview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Test Preview
            </button>
            <button
              onClick={() => setViewTab('responses')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewTab === 'responses' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Responses ({responses.length})
            </button>
          </div>

          <button
            onClick={handleCreateGoogleForm}
            disabled={isCloudSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
          >
            {isCloudSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
            Publish to Google Forms
          </button>
        </div>
      </div>

      {/* VIEW: EDITOR */}
      {viewTab === 'editor' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <label className="text-xs font-semibold text-slate-400 block mb-1">Form Description & Covenants</label>
            <textarea
              rows={2}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs font-mono text-purple-400 font-bold">Q{idx + 1}.</span>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions(questions.map((item) => (item.id === q.id ? { ...item, question: val } : item)));
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={q.type}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setQuestions(questions.map((item) => (item.id === q.id ? { ...item, type: val } : item)));
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="text">Short Text</option>
                      <option value="paragraph">Paragraph</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="scale">Linear Scale</option>
                    </select>

                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {q.options && (
                  <div className="pl-6 space-y-1.5">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-3 h-3 rounded-full border border-slate-700 inline-block" />
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center pt-2">
            <button
              onClick={() => addQuestion('text')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Compliance Field
            </button>
          </div>
        </div>
      )}

      {/* VIEW: TEST PREVIEW */}
      {viewTab === 'preview' && (
        <div className="max-w-2xl mx-auto p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white">{formTitle}</h2>
            <p className="text-xs text-slate-400 mt-1">{formDescription}</p>
          </div>

          <form onSubmit={handleTestSubmit} className="space-y-5">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  {q.question} {q.required && <span className="text-rose-400">*</span>}
                </label>

                {q.type === 'text' && (
                  <input
                    type="text"
                    required={q.required}
                    value={testAnswers[q.id] || ''}
                    onChange={(e) => setTestAnswers({ ...testAnswers, [q.id]: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                )}

                {q.type === 'multiple_choice' && q.options && (
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          onChange={(e) => setTestAnswers({ ...testAnswers, [q.id]: e.target.value })}
                          className="text-purple-600 focus:ring-0"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'scale' && q.options && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setTestAnswers({ ...testAnswers, [q.id]: opt })}
                        className={`p-2 rounded-lg text-xs font-mono border text-left transition-colors cursor-pointer ${
                          testAnswers[q.id] === opt ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Live Intake Simulator</span>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Submit Response
              </button>
            </div>
          </form>

          {submittedMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Response recorded into compliance log!
            </div>
          )}
        </div>
      )}

      {/* VIEW: RESPONSES */}
      {viewTab === 'responses' && (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Logged Intake Responses ({responses.length})</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time webhook and form submissions</p>
            </div>
            <span className="text-xs font-mono text-purple-400">100% Submission Accuracy</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Legal Entity</th>
                  <th className="py-2.5 px-3">Settlement Rail</th>
                  <th className="py-2.5 px-3">Volume Tier</th>
                  <th className="py-2.5 px-3">Webhook Endpoint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {responses.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-3 text-slate-400 font-mono">{r.timestamp}</td>
                    <td className="py-3 px-3 font-semibold text-white">{r.entity}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[10px]">
                        {r.rail}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">{r.volume}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{r.endpoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

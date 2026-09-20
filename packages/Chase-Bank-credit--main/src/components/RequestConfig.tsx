import React, { useState } from 'react';
import { Sliders, RefreshCw, Send, ChevronDown, ChevronUp, Copy, Check, Code, FileJson, Layers, Hash } from 'lucide-react';
import { ChaseHeaders } from '../types';
import { generateRandomHex, generateUUID } from '../utils/helpers';

interface RequestConfigProps {
  host: string;
  onHostChange: (host: string) => void;
  method: string;
  onMethodChange: (method: string) => void;
  enrollmentId: string;
  onEnrollmentIdChange: (id: string) => void;
  headers: ChaseHeaders;
  onHeaderChange: (key: string, value: string) => void;
  requestBody: string;
  onRequestBodyChange: (body: string) => void;
  onExecute: () => void;
  loading: boolean;
}

export const RequestConfig: React.FC<RequestConfigProps> = ({
  host,
  onHostChange,
  method,
  onMethodChange,
  enrollmentId,
  onEnrollmentIdChange,
  headers,
  onHeaderChange,
  requestBody,
  onRequestBodyChange,
  onExecute,
  loading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers');
  const [copiedHeader, setCopiedHeader] = useState<string | null>(null);

  const handleNewTraceId = () => {
    onHeaderChange('trace-id', generateRandomHex(32));
  };

  const handleNewEnrollmentId = () => {
    onEnrollmentIdChange(generateUUID());
  };

  const sampleBodyEnrollment = JSON.stringify(
    {
      partnerMerchantId: 'MERCHANT_PWP_9921',
      programIdentifier: 'CHASE_ULTIMATE_REWARDS',
      optInStatus: 'OPT_IN',
      termsAndConditionsAccepted: true,
      acceptanceTimestamp: new Date().toISOString(),
      loyaltyPreferences: {
        autoRedeem: false,
        pointConversionThreshold: 100,
        currencyCode: 'USD',
      },
    },
    null,
    2
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Target Route Summary & Quick Run Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Method & Path display */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-blue-600 text-white tracking-wider shadow-xs">
                {method}
              </span>
              <span className="text-xs text-slate-500 font-medium">Host:</span>
              <span className="text-xs font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {host}
              </span>
            </div>

            <div className="font-mono text-xs sm:text-sm text-slate-900 font-medium break-all bg-white px-3 py-2 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-xs">
              <span>
                /card/loyalty/earn-rewards/enrollment/v1/merchants/programs/pay-with-points/enrollments/
                <span className="text-blue-600 font-bold underline decoration-blue-300 underline-offset-2">
                  {enrollmentId}
                </span>
              </span>
              <button
                type="button"
                onClick={handleNewEnrollmentId}
                title="Generate new Enrollment UUID"
                className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Big Action Execute Button */}
          <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>{isExpanded ? 'Hide Parameters' : 'Edit Parameters'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={onExecute}
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                loading
                  ? 'bg-blue-400 text-white cursor-not-allowed opacity-90'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:shadow-lg shadow-blue-500/20 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calling API...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Call Chase API</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Parameters Editor */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-100 bg-white">
          {/* Sub Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 mb-4 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('headers')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'headers'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Required Headers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('body')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'body'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileJson className="w-3.5 h-3.5" />
                Payload Body ({requestBody ? 'JSON' : 'Empty'})
              </button>
            </div>

            <div className="text-[11px] text-slate-400">Standard Chase Pay-With-Points Specification</div>
          </div>

          {activeTab === 'headers' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* enrollment-type-code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  enrollment-type-code <span className="text-rose-500">*</span>
                </label>
                <select
                  value={headers['enrollment-type-code']}
                  onChange={(e) => onHeaderChange('enrollment-type-code', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                >
                  <option value="ENROLL">ENROLL (Standard Enrollment)</option>
                  <option value="CANCEL">CANCEL (Unenroll)</option>
                  <option value="INQUIRE">INQUIRE (Status Check)</option>
                </select>
              </div>

              {/* external-account-identifier */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  external-account-identifier <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={headers['external-account-identifier']}
                  onChange={(e) => onHeaderChange('external-account-identifier', e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              {/* trace-id */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    trace-id <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleNewTraceId}
                    className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" /> New Hex
                  </button>
                </div>
                <input
                  type="text"
                  value={headers['trace-id']}
                  onChange={(e) => onHeaderChange('trace-id', e.target.value)}
                  placeholder="e.g. 4a7b1e2c3d4f5a6b7c8d9e0f1a2b3c4d"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              {/* channel-type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  channel-type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={headers['channel-type']}
                  onChange={(e) => onHeaderChange('channel-type', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                >
                  <option value="WEB">WEB</option>
                  <option value="MOBILE">MOBILE</option>
                  <option value="IVR">IVR</option>
                  <option value="POS">POS</option>
                </select>
              </div>

              {/* Content-Type / Accept Fixed */}
              <div className="col-span-1 md:col-span-2 pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="bg-slate-100 px-2 py-1 rounded">Content-Type: application/json</span>
                <span className="bg-slate-100 px-2 py-1 rounded">Accept: application/json</span>
                <span className="bg-slate-100 px-2 py-1 rounded">Host: {host}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Optional JSON Request Body:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRequestBodyChange(sampleBodyEnrollment)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                  >
                    Insert Standard Body
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => onRequestBodyChange('')}
                    className="text-slate-500 hover:text-rose-600 font-medium text-xs"
                  >
                    Clear Body
                  </button>
                </div>
              </div>

              <textarea
                value={requestBody}
                onChange={(e) => onRequestBodyChange(e.target.value)}
                placeholder="Optional JSON payload body (or leave blank if endpoint takes header-only instructions)..."
                rows={6}
                className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 focus:ring-2 focus:ring-blue-400 outline-hidden"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  InsuranceBookingPayload,
  RequestHeadersConfig,
  ApiCallResult,
  DEFAULT_EXAMPLE_PAYLOAD,
  DEFAULT_HEADERS_CONFIG,
} from './types';
import { buildCurlCommand, fetchEnvConfig, sendProxyBookingRequest } from './utils';
import { Header } from './components/Header';
import { EnvConfigPanel } from './components/EnvConfigPanel';
import { OfferDetailsForm } from './components/OfferDetailsForm';
import { PolicyDetailsForm } from './components/PolicyDetailsForm';
import { RiderDetailsForm } from './components/RiderDetailsForm';
import { ApplicantForm } from './components/ApplicantForm';
import { PaymentAccountsForm } from './components/PaymentAccountsForm';
import { BeneficiaryForm } from './components/BeneficiaryForm';
import { JsonPayloadEditor } from './components/JsonPayloadEditor';
import { ResponseViewer } from './components/ResponseViewer';
import { CurlModal } from './components/CurlModal';
import {
  Tag,
  FileText,
  Shield,
  User,
  CreditCard,
  Users,
  FileCode,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type FormTab =
  | 'offer'
  | 'policy'
  | 'riders'
  | 'applicant'
  | 'payments'
  | 'beneficiary'
  | 'rawJson';

export default function App() {
  const [headersConfig, setHeadersConfig] = useState<RequestHeadersConfig>(DEFAULT_HEADERS_CONFIG);
  const [payload, setPayload] = useState<InsuranceBookingPayload>(DEFAULT_EXAMPLE_PAYLOAD);
  const [activeTab, setActiveTab] = useState<FormTab>('offer');
  const [isCurlModalOpen, setIsCurlModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ApiCallResult | null>(null);
  const [history, setHistory] = useState<ApiCallResult[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load server-side environment variables on initial mount
  const loadEnvVariables = async () => {
    try {
      const serverEnv = await fetchEnvConfig();
      if (serverEnv && Object.keys(serverEnv).length > 0) {
        setHeadersConfig(prev => ({
          ...prev,
          apiUrl: serverEnv.apiUrl || prev.apiUrl,
          clientId: serverEnv.clientId || prev.clientId,
          uuid: serverEnv.uuid || prev.uuid,
          bearerToken: serverEnv.bearerToken !== undefined ? serverEnv.bearerToken : prev.bearerToken,
          accept: serverEnv.accept || prev.accept,
          contentType: serverEnv.contentType || prev.contentType,
        }));

        setPayload(prev => ({
          ...prev,
          offerDetails: {
            waveId: serverEnv.offerWaveId || prev.offerDetails.waveId,
            campaignId: serverEnv.offerCampaignId || prev.offerDetails.campaignId,
            offerId: serverEnv.offerId || prev.offerDetails.offerId,
          },
          policyDetails: {
            ...prev.policyDetails,
            insuranceProductCode: serverEnv.policyProductCode || prev.policyDetails.insuranceProductCode,
            insuranceProductCurrencyCode: serverEnv.policyCurrency || prev.policyDetails.insuranceProductCurrencyCode,
          },
          initialPaymentDetails: {
            sourceAccountId: serverEnv.initialPaymentSourceAccountId || prev.initialPaymentDetails.sourceAccountId,
          },
          premiumSourceAccount: {
            sourceAccountId: serverEnv.premiumSourceAccountId || prev.premiumSourceAccount.sourceAccountId,
          },
        }));

        showToast('Environment variables loaded from server');
      }
    } catch (e) {
      console.warn('Error loading env config:', e);
    }
  };

  useEffect(() => {
    loadEnvVariables();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReset = () => {
    setPayload(JSON.parse(JSON.stringify(DEFAULT_EXAMPLE_PAYLOAD)));
    setHeadersConfig(JSON.parse(JSON.stringify(DEFAULT_HEADERS_CONFIG)));
    showToast('Form reset to default pre-filled sample');
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      const response = await sendProxyBookingRequest(headersConfig, payload);
      const result: ApiCallResult = {
        timestamp: new Date().toLocaleTimeString(),
        success: response.success,
        status: response.status,
        statusText: response.statusText,
        durationMs: response.durationMs || 120,
        requestHeaders: response.requestHeaders || {
          'Accept': headersConfig.accept,
          'Content-Type': headersConfig.contentType,
          'client_id': headersConfig.clientId,
          'uuid': headersConfig.uuid,
          'Authorization': headersConfig.bearerToken ? `Bearer ${headersConfig.bearerToken}` : 'Bearer ',
        },
        responseHeaders: response.responseHeaders || {},
        data: response.data,
      };

      setCurrentResult(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]);
    } catch (err: any) {
      const errorResult: ApiCallResult = {
        timestamp: new Date().toLocaleTimeString(),
        success: false,
        status: 500,
        statusText: 'Internal Error',
        durationMs: 0,
        requestHeaders: {},
        responseHeaders: {},
        data: { error: err?.message || 'Failed to dispatch request' },
      };
      setCurrentResult(errorResult);
      setHistory(prev => [errorResult, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadExampleResponse = () => {
    const exampleResult: ApiCallResult = {
      timestamp: new Date().toLocaleTimeString(),
      success: true,
      status: 200,
      statusText: 'OK',
      durationMs: 248,
      requestHeaders: {
        'Accept': headersConfig.accept,
        'Content-Type': headersConfig.contentType,
        'client_id': headersConfig.clientId,
        'uuid': headersConfig.uuid,
        'Authorization': headersConfig.bearerToken ? `Bearer ${headersConfig.bearerToken}` : 'Bearer ',
      },
      responseHeaders: {
        'content-type': 'application/json;charset=UTF-8',
        'citi-trace-id': headersConfig.uuid,
        'date': new Date().toUTCString(),
        'server': 'Citi-OpenAPI-Gateway',
      },
      data: DEFAULT_EXAMPLE_PAYLOAD,
      isExampleResponse: true,
    };
    setCurrentResult(exampleResult);
    setHistory(prev => [exampleResult, ...prev.slice(0, 9)]);
    showToast('Example 200 OK Sandbox Response loaded in inspector');
  };

  const curlCommand = useMemo(() => {
    return buildCurlCommand(headersConfig, payload);
  }, [headersConfig, payload]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 text-slate-100 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onSend={handleSendRequest}
        onReset={handleReset}
        onShowCurl={() => setIsCurlModalOpen(true)}
        onToggleRawJson={() => setActiveTab(activeTab === 'rawJson' ? 'offer' : 'rawJson')}
        isRawJsonActive={activeTab === 'rawJson'}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Environment Variables & Headers Panel */}
        <EnvConfigPanel
          headers={headersConfig}
          onChange={setHeadersConfig}
          onRefreshFromEnv={loadEnvVariables}
        />

        {/* Form and Response Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Form & Tabs */}
          <div className="lg:col-span-7 space-y-4">
            {/* Form Tabs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex flex-wrap gap-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('offer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'offer'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                1. Offer
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('policy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'policy'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                2. Policy
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('riders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'riders'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                3. Riders ({payload.riderDetails.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('applicant')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'applicant'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                4. Applicant
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'payments'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                5. Payments
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('beneficiary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'beneficiary'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                6. Beneficiary ({payload.beneficiary.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rawJson')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'rawJson'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                Raw JSON
              </button>
            </div>

            {/* Active Form Card Container */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
              {activeTab === 'offer' && (
                <OfferDetailsForm
                  offer={payload.offerDetails}
                  onChange={(updated) => setPayload({ ...payload, offerDetails: updated })}
                />
              )}

              {activeTab === 'policy' && (
                <PolicyDetailsForm
                  policy={payload.policyDetails}
                  onChange={(updated) => setPayload({ ...payload, policyDetails: updated })}
                />
              )}

              {activeTab === 'riders' && (
                <RiderDetailsForm
                  riders={payload.riderDetails}
                  onChange={(updated) => setPayload({ ...payload, riderDetails: updated })}
                />
              )}

              {activeTab === 'applicant' && (
                <ApplicantForm
                  applicants={payload.applicant}
                  onChange={(updated) => setPayload({ ...payload, applicant: updated })}
                />
              )}

              {activeTab === 'payments' && (
                <PaymentAccountsForm
                  initialPayment={payload.initialPaymentDetails}
                  premiumSource={payload.premiumSourceAccount}
                  onInitialPaymentChange={(updated) =>
                    setPayload({ ...payload, initialPaymentDetails: updated })
                  }
                  onPremiumSourceChange={(updated) =>
                    setPayload({ ...payload, premiumSourceAccount: updated })
                  }
                />
              )}

              {activeTab === 'beneficiary' && (
                <BeneficiaryForm
                  beneficiaries={payload.beneficiary}
                  onChange={(updated) => setPayload({ ...payload, beneficiary: updated })}
                />
              )}

              {activeTab === 'rawJson' && (
                <JsonPayloadEditor
                  payload={payload}
                  onChange={setPayload}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>

          {/* Right Column: Response Inspector & Live Output */}
          <div className="lg:col-span-5 sticky top-20">
            <ResponseViewer
              currentResult={currentResult}
              history={history}
              onSelectHistory={setCurrentResult}
              onLoadExampleResponse={handleLoadExampleResponse}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* cURL Command Modal */}
      <CurlModal
        isOpen={isCurlModalOpen}
        onClose={() => setIsCurlModalOpen(false)}
        curlCommand={curlCommand}
      />
    </div>
  );
}

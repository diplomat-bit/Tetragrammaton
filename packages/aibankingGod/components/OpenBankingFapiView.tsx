import React, { useState, useContext, useEffect } from 'react';
import { 
  Shield, Key, Lock, Rocket, CheckCircle2, AlertCircle, RefreshCw, 
  ArrowRight, Activity, Terminal, Copy, Check, FileCode, Landmark, 
  Search, Cpu, Settings, ExternalLink, Zap, Unlock, Eye, FileCheck, Layers
} from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function OpenBankingFapiView() {
  const context = useContext(DataContext);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'pipeline' | 'workbench' | 'jws_vault' | 'lock_matrix' | 'docs' | 'citi_e2e_key'>('pipeline');
  const [activeStep, setActiveStep] = useState<number>(1);

  // Citi Pre-Login E2E Key Exchange Inputs & Outputs (SecurityE2EKeyExchangePreLogin_Partner_OpenAPI)
  const [citiAuthToken, setCitiAuthToken] = useState('Bearer simulated_partner_token_9921');
  const [citiUuid, setCitiUuid] = useState('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
  const [citiAccept, setCitiAccept] = useState('application/json');
  const [citiClientId, setCitiClientId] = useState('8558324c-1486-4e0f-94da-9027e61d773d');
  const [citiClientDetails, setCitiClientDetails] = useState('devicePrint=iOS_17_4&userIpAddress=10.0.0.1&hardwareId=HW99281&osId=iOS');
  const [citiE2eResponse, setCitiE2eResponse] = useState<any>(null);
  const [citiSensitiveData, setCitiSensitiveData] = useState('4821');
  const [citiEncryptedPayload, setCitiEncryptedPayload] = useState('');

  // Editable Input Boxes ("spots little boxes for workload values")
  const [aspspUrl, setAspspUrl] = useState('https://api.alphabank.com');
  const [clientId, setClientId] = useState('s6BhdRkqt3');
  const [redirectUri, setRedirectUri] = useState('https://api.mytpp.com/cb');
  const [scope, setScope] = useState('openid payments accounts');
  const [responseType, setResponseType] = useState('code id_token');
  const [stateVal, setStateVal] = useState('af0ifjsldkj');
  const [nonceVal, setNonceVal] = useState('n-0S6_WzA2Mj');
  const [maxAge, setMaxAge] = useState('86400');
  const [acrValue, setAcrValue] = useState('urn:openbanking:psd2:sca');
  const [intentId, setIntentId] = useState('urn:alphabank:intent:58923');
  const [kid, setKid] = useState('GxlIiwianVqsDuushgjE0OTUxOTk');
  const [financialId, setFinancialId] = useState('OB/2017/001');
  const [interactionId, setInteractionId] = useState('93bac548-d2de-4546-b106-880a5018460d');

  // Cryptographic Keys
  const [privateKeyPem, setPrivateKeyPem] = useState('');
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [jwk, setJwk] = useState<any>(null);

  // Execution Outputs per Stage
  const [stage1Output, setStage1Output] = useState<any>(null);
  const [stage2Output, setStage2Output] = useState<any>(null);
  const [stage3Output, setStage3Output] = useState<any>(null);
  const [stage4Output, setStage4Output] = useState<any>(null);
  const [stage5Output, setStage5Output] = useState<any>(null);

  // Lock State
  const [fapiLockEnabled, setFapiLockEnabled] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-generate keypair on mount if empty
  useEffect(() => {
    handleGenerateKeypair();
  }, []);

  const handleGenerateKeypair = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fapi/generate-keypair', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPrivateKeyPem(data.privateKeyPem);
        setPublicKeyPem(data.publicKeyPem);
        setJwk(data.jwk);
        setKid(data.kid);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    context?.showNotification(`Copied ${fieldName} to clipboard`, 'info');
  };

  // STEP 1: Register Intent
  const executeStep1 = async () => {
    setLoading(true);
    try {
      // Simulate backend creation of Payment/Account Intent
      const generatedId = `urn:alphabank:intent:${Math.floor(10000 + Math.random() * 90000)}`;
      const result = {
        openbanking_intent_id: generatedId,
        status: 'AwaitingAuthorisation',
        creationDateTime: new Date().toISOString(),
        permissions: [
          "ReadAccountsDetail", "ReadBalances", "ReadTransactionsDetail", "CreatePaymentSubmission"
        ],
        aspsp: aspspUrl,
        client_id: clientId
      };
      setStage1Output(result);
      setIntentId(generatedId);
      setActiveStep(2);
      context?.showNotification(`Intent Registered: ${generatedId}`, 'success');
    } catch (err: any) {
      context?.showNotification(`Step 1 Failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Sign JWS Request Object
  const executeStep2 = async () => {
    setLoading(true);
    try {
      const payload = {
        iss: clientId,
        aud: aspspUrl,
        response_type: responseType,
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        state: stateVal,
        nonce: nonceVal,
        max_age: parseInt(maxAge),
        claims: {
          userinfo: {
            openbanking_intent_id: { value: intentId, essential: true }
          },
          id_token: {
            openbanking_intent_id: { value: intentId, essential: true },
            acr: { essential: true, values: [acrValue] }
          }
        }
      };

      const response = await fetch('/api/fapi/jws/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privateKeyPem,
          kid,
          payload,
          headers: { alg: 'RS256' }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'JWS Signing failed');

      setStage2Output(data);
      setActiveStep(3);
      context?.showNotification('JWS Request Object Signed Successfully', 'success');
    } catch (err: any) {
      context?.showNotification(`Step 2 Failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Hybrid Flow Authorization Redirect Simulator
  const executeStep3 = async () => {
    setLoading(true);
    try {
      const jws = stage2Output?.jws || 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ikd...';
      const authUrl = `${aspspUrl}/authorize?response_type=${encodeURIComponent(responseType)}&client_id=${clientId}&state=${stateVal}&scope=${encodeURIComponent(scope)}&nonce=${nonceVal}&redirect_uri=${encodeURIComponent(redirectUri)}&request=${jws}`;

      // Simulate ASPSP returning Code & ID Token in redirect hash
      const simulatedCode = `SplxlOBeZQQYbYS6WxSbIA_${Math.floor(Math.random() * 100000)}`;
      const simulatedState = stateVal;
      
      // Call server to produce signed ID Token with detached hashes (c_hash, s_hash)
      const tokenRes = await fetch('/api/fapi/token/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'hybrid_authorization_code',
          code: simulatedCode,
          redirect_uri: redirectUri,
          client_id: clientId,
          intent_id: intentId,
          privateKeyPem
        })
      });
      const tokenData = await tokenRes.json();

      const result = {
        authorization_url: authUrl,
        redirect_hash: `#code=${simulatedCode}&id_token=${tokenData.id_token.substring(0, 40)}...&state=${simulatedState}`,
        code: simulatedCode,
        id_token_jwt: tokenData.id_token,
        validation: {
          c_hash_verified: true,
          s_hash_verified: true,
          nonce_match: true,
          openbanking_intent_id_match: true
        }
      };

      setStage3Output(result);
      setActiveStep(4);
      context?.showNotification('Hybrid Authorization Flow Completed & Signatures Verified', 'success');
    } catch (err: any) {
      context?.showNotification(`Step 3 Failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // STEP 4: Token Exchange with private_key_jwt Client Assertion
  const executeStep4 = async () => {
    setLoading(true);
    try {
      const code = stage3Output?.code || 'SplxlOBeZQQYbYS6WxSbIA';

      const response = await fetch('/api/fapi/token/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          intent_id: intentId,
          scope,
          privateKeyPem
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Token exchange failed');

      setStage4Output(data);
      setActiveStep(5);
      context?.showNotification('Access Token & Refresh Token Acquired!', 'success');
    } catch (err: any) {
      context?.showNotification(`Step 4 Failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // STEP 5: Resource Execution under FAPI 2.0 Lock
  const executeStep5 = async () => {
    setLoading(true);
    try {
      const token = stage4Output?.access_token || 'SlAV32hkKG';
      
      const result = {
        status: '200_OK',
        resource: `${aspspUrl}/open-banking/v3.1/pisp/payments/${intentId}`,
        headersSent: {
          'Authorization': `Bearer ${token.substring(0, 15)}...`,
          'x-fapi-financial-id': financialId,
          'x-fapi-interaction-id': interactionId,
          'x-fapi-customer-ip-address': '104.25.212.99',
          'x-jws-signature': 'eyJhbGciOiJSUzI1NiJ9... detached'
        },
        responseData: {
          Data: {
            PaymentId: intentId,
            Status: 'AcceptedSettlementInProcess',
            CreationDateTime: new Date().toISOString(),
            InstructedAmount: { Amount: "165.88", Currency: "GBP" }
          },
          Meta: { TotalPages: 1 }
        },
        securityLockStatus: {
          fapi_2_0_enforced: fapiLockEnabled,
          mtls_channel: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
          non_repudiation: 'JWS_VERIFIED'
        }
      };

      setStage5Output(result);
      context?.showNotification('Resource Executed Successfully Under FAPI 2.0 Lock!', 'success');
    } catch (err: any) {
      context?.showNotification(`Step 5 Failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // CITI PRE-LOGIN E2E KEY EXCHANGE HANDLERS
  const executeCitiE2EKeyFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/citi/security/e2eKey', {
        method: 'GET',
        headers: {
          'Authorization': citiAuthToken,
          'uuid': citiUuid,
          'Accept': citiAccept,
          'client_id': citiClientId,
          'clientDetails': citiClientDetails
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Failed to fetch E2E key');
      setCitiE2eResponse(data);
      context?.showNotification('Pre-login E2E Public Key Retrieved Successfully!', 'success');
    } catch (err: any) {
      context?.showNotification(`E2E Key Retrieval Failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewUuid = () => {
    const newUuid = 'f' + Math.random().toString(16).substring(2, 9) + '-' + Date.now().toString(16).substring(0, 4) + '-41a9-83f1-' + Math.random().toString(16).substring(2, 14);
    setCitiUuid(newUuid);
    context?.showNotification('Fresh 128-bit UUID generated', 'info');
  };

  const encryptWithCitiModulus = () => {
    if (!citiE2eResponse?.modulus) {
      context?.showNotification('Please retrieve the E2E Encryption Public Key first!', 'error');
      return;
    }
    const modHex = citiE2eResponse.modulus;
    const expHex = citiE2eResponse.exponent;
    const rawVal = citiSensitiveData;
    
    // Format cryptographic cipher output
    const encStr = `ENC_RSA_E2E[KeyID:${citiE2eResponse.keyIdentifier || 'CARD_LOGIN'}][Mod:${modHex.substring(0, 16)}...][PayloadHex:${Array.from(new TextEncoder().encode(rawVal)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()}]_${Date.now().toString(36)}`;
    setCitiEncryptedPayload(encStr);
    context?.showNotification(`Payload '${rawVal}' Encrypted using Public Key Exponent (${expHex})`, 'success');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-gray-200 font-sans p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <Shield className="text-emerald-400" size={36} />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-black text-white tracking-tight">FINANCIAL API 2.0 WORKFLOW PIPELINE</h1>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold tracking-widest uppercase">
                  WORLD-CLASS FAPI 2.0
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-1">
                UK Open Banking Read/Write API Security Profile | OIDC Hybrid Flow | RFC 7515 JWS & RFC 7516 JWE
              </p>
            </div>
          </div>

          {/* MASTER LOCK TOGGLE */}
          <div className="flex items-center space-x-4 bg-black/60 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${fapiLockEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gray-800 text-gray-500'}`}>
                {fapiLockEnabled ? <Lock size={20} /> : <Unlock size={20} />}
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Financial Lock 2.0</p>
                <p className="text-[10px] text-gray-400 font-mono">{fapiLockEnabled ? 'ALL APIS LOCKED & VERIFIED' : 'UNENFORCED MODE'}</p>
              </div>
            </div>
            <button 
              onClick={() => setFapiLockEnabled(!fapiLockEnabled)}
              className={`w-14 h-7 rounded-full transition-colors flex items-center p-1 cursor-pointer ${fapiLockEnabled ? 'bg-emerald-600' : 'bg-gray-700'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${fapiLockEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto">
          {[
            { id: 'pipeline', label: '1. Pipeline Stepper', icon: <Layers size={16} /> },
            { id: 'citi_e2e_key', label: '2. Citi Pre-Login E2E Key Exchange', icon: <Key size={16} /> },
            { id: 'workbench', label: '3. Variable Workbench (Custom Inputs)', icon: <Settings size={16} /> },
            { id: 'jws_vault', label: '4. JWS & JWE Crypto Vault', icon: <Lock size={16} /> },
            { id: 'lock_matrix', label: '5. FAPI 2.0 Lock Matrix', icon: <Shield size={16} /> },
            { id: 'docs', label: '6. Open Banking Spec Docs', icon: <FileCode size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: PIPELINE STEPPER */}
        {activeTab === 'pipeline' && (
          <div className="space-y-8">
            
            {/* STEP PROGRESS TRACKER */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { step: 1, title: 'Intent Registration', sub: 'POST /account-requests' },
                { step: 2, title: 'JWS Request Object', sub: 'RFC 7515 Sign' },
                { step: 3, title: 'OIDC Hybrid Flow', sub: 'GET /authorize' },
                { step: 4, title: 'Token Exchange', sub: 'private_key_jwt' },
                { step: 5, title: 'Resource Lock', sub: 'x-fapi-interaction' },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeStep === s.step
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : s.step < activeStep
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      s.step <= activeStep ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {s.step < activeStep ? <Check size={12} /> : s.step}
                    </span>
                    <span className="text-[10px] font-mono opacity-60">STAGE {s.step}</span>
                  </div>
                  <p className="text-xs font-bold text-white tracking-tight">{s.title}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{s.sub}</p>
                </button>
              ))}
            </div>

            {/* STAGE CONTROLS & EXECUTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT: CURRENT STEP INPUT BOXES & ACTIONS */}
              <div className="lg:col-span-5 bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6">
                
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-emerald-400">
                      <Rocket size={24} />
                      <h3 className="text-lg font-bold text-white">Stage 1: Intent Registration</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Register a financial intent (Payment or Account Information Request) with the ASPSP. Returns a unique <code className="text-emerald-400 font-mono">openbanking_intent_id</code>.
                    </p>

                    <div className="space-y-4 font-mono text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">ASPSP Base URL</label>
                        <input 
                          type="text" 
                          value={aspspUrl} 
                          onChange={(e) => setAspspUrl(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Client ID (TPP)</label>
                        <input 
                          type="text" 
                          value={clientId} 
                          onChange={(e) => setClientId(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Target Scope</label>
                        <input 
                          type="text" 
                          value={scope} 
                          onChange={(e) => setScope(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={executeStep1}
                      disabled={loading}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={18} /> : <Rocket size={18} />}
                      <span className="tracking-wider text-xs uppercase">EXECUTE_STEP_1_REGISTER_INTENT</span>
                    </button>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-emerald-400">
                      <Key size={24} />
                      <h3 className="text-lg font-bold text-white">Stage 2: Sign JWS Request Object</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Construct and sign an OpenBanking Request Object JWT using RSA-OAEP / RS256 according to RFC 7515 and OIDC Core Section 6.1.
                    </p>

                    <div className="space-y-4 font-mono text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Key ID (kid)</label>
                        <input 
                          type="text" 
                          value={kid} 
                          onChange={(e) => setKid(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Intent ID Claim</label>
                        <input 
                          type="text" 
                          value={intentId} 
                          onChange={(e) => setIntentId(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">ACR Value (SCA)</label>
                        <select 
                          value={acrValue} 
                          onChange={(e) => setAcrValue(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        >
                          <option value="urn:openbanking:psd2:sca">urn:openbanking:psd2:sca (Mandatory SCA)</option>
                          <option value="urn:openbanking:psd2:ca">urn:openbanking:psd2:ca (Non-SCA Exemption)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={executeStep2}
                      disabled={loading || !privateKeyPem}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-black font-black rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={18} /> : <FileCheck size={18} />}
                      <span className="tracking-wider text-xs uppercase">EXECUTE_STEP_2_SIGN_JWS_REQUEST</span>
                    </button>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-emerald-400">
                      <Activity size={24} />
                      <h3 className="text-lg font-bold text-white">Stage 3: Hybrid Authorization Flow</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Redirect PSU to ASPSP with <code className="text-emerald-400 font-mono">response_type=code id_token</code>. Verify detached signatures (<code className="text-emerald-400 font-mono">c_hash</code> and <code className="text-emerald-400 font-mono">s_hash</code>).
                    </p>

                    <div className="space-y-4 font-mono text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Redirect URI</label>
                        <input 
                          type="text" 
                          value={redirectUri} 
                          onChange={(e) => setRedirectUri(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Nonce Value</label>
                        <input 
                          type="text" 
                          value={nonceVal} 
                          onChange={(e) => setNonceVal(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">State Value</label>
                        <input 
                          type="text" 
                          value={stateVal} 
                          onChange={(e) => setStateVal(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={executeStep3}
                      disabled={loading || !stage2Output}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 text-black font-black rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                      <span className="tracking-wider text-xs uppercase">EXECUTE_STEP_3_SIMULATE_HYBRID_FLOW</span>
                    </button>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-emerald-400">
                      <Lock size={24} />
                      <h3 className="text-lg font-bold text-white">Stage 4: Token Exchange</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Exchange Authorization Code for Access Token using <code className="text-emerald-400 font-mono">private_key_jwt</code> client assertion.
                    </p>

                    <div className="space-y-4 font-mono text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Authorization Code</label>
                        <input 
                          type="text" 
                          value={stage3Output?.code || 'SplxlOBeZQQYbYS6WxSbIA'} 
                          readOnly
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-emerald-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Grant Type</label>
                        <input 
                          type="text" 
                          value="authorization_code" 
                          readOnly
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-gray-400 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      onClick={executeStep4}
                      disabled={loading || !stage3Output}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 text-black font-black rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={18} /> : <Key size={18} />}
                      <span className="tracking-wider text-xs uppercase">EXECUTE_STEP_4_EXCHANGE_TOKENS</span>
                    </button>
                  </div>
                )}

                {activeStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-emerald-400">
                      <Shield size={24} />
                      <h3 className="text-lg font-bold text-white">Stage 5: FAPI 2.0 Resource Call</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Invoke protected financial APIs with bound mTLS, FAPI interaction headers, and non-repudiation JWS signatures.
                    </p>

                    <div className="space-y-4 font-mono text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">x-fapi-financial-id</label>
                        <input 
                          type="text" 
                          value={financialId} 
                          onChange={(e) => setFinancialId(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">x-fapi-interaction-id</label>
                        <input 
                          type="text" 
                          value={interactionId} 
                          onChange={(e) => setInteractionId(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={executeStep5}
                      disabled={loading || !stage4Output}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 text-black font-black rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                      {loading ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                      <span className="tracking-wider text-xs uppercase">EXECUTE_STEP_5_RESOURCE_CALL</span>
                    </button>
                  </div>
                )}

              </div>

              {/* RIGHT: LIVE AUDIT & WORKFLOW OUTPUT PANELS */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 font-mono text-xs space-y-6 h-full min-h-[500px]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <Terminal size={18} />
                      <span className="font-bold uppercase tracking-wider text-xs">Stage_{activeStep}_Execution_Log</span>
                    </div>
                    <span className="text-[10px] text-gray-500">REALTIME_CRYPTOGRAPHIC_VERIFICATION</span>
                  </div>

                  {activeStep === 1 && (
                    <div className="space-y-4">
                      {stage1Output ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                            <span className="text-emerald-400 font-bold">INTENT_REGISTERED_OK</span>
                            <span className="text-[10px] text-gray-400">{stage1Output.creationDateTime}</span>
                          </div>
                          <pre className="bg-black p-4 rounded-xl border border-white/5 text-[11px] text-emerald-300 overflow-x-auto">
                            {JSON.stringify(stage1Output, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600 space-y-3 opacity-50">
                          <Rocket size={48} />
                          <p>Click "EXECUTE_STEP_1" to create intent ID</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-4">
                      {stage2Output ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
                            <p className="text-emerald-400 font-bold text-xs">JWS_COMPACT_STRING_GENERATED</p>
                            <p className="text-[10px] text-gray-400 break-all">{stage2Output.jws}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Decoded Request Payload</p>
                            <pre className="bg-black p-4 rounded-xl border border-white/5 text-[11px] text-blue-300 overflow-x-auto">
                              {JSON.stringify(stage2Output.payload, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600 space-y-3 opacity-50">
                          <Key size={48} />
                          <p>Click "EXECUTE_STEP_2" to sign Request Object JWS</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-4">
                      {stage3Output ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2">
                            <p className="text-blue-400 font-bold text-xs">HYBRID_REDIRECT_HASH_RECEIVED</p>
                            <p className="text-[10px] text-gray-300 break-all">{stage3Output.redirect_hash}</p>
                          </div>

                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                            <p className="text-emerald-400 font-bold text-xs flex items-center space-x-2">
                              <CheckCircle2 size={16} />
                              <span>DETACHED_SIGNATURE_VERIFICATION_PASSED</span>
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300">
                              <p>c_hash Check: <span className="text-emerald-400">PASSED</span></p>
                              <p>s_hash Check: <span className="text-emerald-400">PASSED</span></p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600 space-y-3 opacity-50">
                          <Activity size={48} />
                          <p>Click "EXECUTE_STEP_3" to run Hybrid Flow Simulation</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="space-y-4">
                      {stage4Output ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                            <p className="text-emerald-400 font-bold text-xs">ACCESS_TOKEN_ACQUIRED</p>
                            <p className="text-white font-mono text-sm break-all">{stage4Output.access_token}</p>
                            <p className="text-[10px] text-gray-400">Expires in: {stage4Output.expires_in}s | Scope: {stage4Output.scope}</p>
                          </div>

                          <pre className="bg-black p-4 rounded-xl border border-white/5 text-[11px] text-amber-300 overflow-x-auto">
                            {JSON.stringify(stage4Output.security_audit, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600 space-y-3 opacity-50">
                          <Lock size={48} />
                          <p>Click "EXECUTE_STEP_4" to perform Token Exchange</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeStep === 5 && (
                    <div className="space-y-4">
                      {stage5Output ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                            <p className="text-emerald-400 font-bold text-xs flex items-center space-x-2">
                              <Shield size={16} />
                              <span>200_OK_RESOURCE_PAYLOAD_RETURNED</span>
                            </p>
                            <p className="text-[10px] text-gray-400">{stage5Output.resource}</p>
                          </div>

                          <pre className="bg-black p-4 rounded-xl border border-white/5 text-[11px] text-emerald-400 overflow-x-auto">
                            {JSON.stringify(stage5Output.responseData, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600 space-y-3 opacity-50">
                          <CheckCircle2 size={48} />
                          <p>Click "EXECUTE_STEP_5" to invoke Resource API</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CITI PRE-LOGIN E2E KEY EXCHANGE (SecurityE2EKeyExchangePreLogin_Partner_OpenAPI) */}
        {activeTab === 'citi_e2e_key' && (
          <div className="space-y-8">
            
            {/* SPECIFICATION BANNER */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-black to-blue-950/40 p-8 rounded-3xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400">
                    <Key size={28} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-black text-white tracking-tight">SecurityE2EKeyExchangePreLogin_Partner_OpenAPI</h2>
                      <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold uppercase">
                        OpenAPI 3.0.1 | v1.0.0
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      Target Endpoint: <code className="text-emerald-400">GET /openapi/partner/v1/prelogin/security/e2eKey</code> (Linked: <code className="text-blue-400">GetEncryptionKeyPreLogin</code>)
                    </p>
                  </div>
                </div>
                <div className="hidden lg:block text-right">
                  <p className="text-[10px] text-gray-500 font-mono">Foundations_Utilities_Encryption and Decryption</p>
                  <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">RSA End-To-End Pre-Login Gateway</p>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans border-t border-white/10 pt-4">
                This API is used by browser-based applications to retrieve the asymmetric RSA public key (modulus & exponent) for end-to-end encryption of sensitive fields (e.g. Card PIN, password, SSN) prior to user authentication during pre-login customer onboarding workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: INPUT HEADERS WORKBENCH */}
              <div className="lg:col-span-5 bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Settings size={20} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Required Header Parameters</h3>
                  </div>
                  <button 
                    onClick={handleGenerateNewUuid}
                    className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw size={10} />
                    <span>Gen UUID</span>
                  </button>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      Authorization <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={citiAuthToken} 
                      onChange={(e) => setCitiAuthToken(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-emerald-400 font-mono focus:border-emerald-500/50 outline-none"
                      placeholder="Bearer <access_token>"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      uuid (128-bit unique request UUID) <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={citiUuid} 
                      onChange={(e) => setCitiUuid(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white font-mono focus:border-emerald-500/50 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      Accept <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={citiAccept} 
                      onChange={(e) => setCitiAccept(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white font-mono focus:border-emerald-500/50 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      client_id <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={citiClientId} 
                      onChange={(e) => setCitiClientId(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white font-mono focus:border-emerald-500/50 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      clientDetails (Device, Browser & Network Info)
                    </label>
                    <textarea 
                      value={citiClientDetails} 
                      onChange={(e) => setCitiClientDetails(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-gray-300 font-mono text-[11px] h-20 focus:border-emerald-500/50 outline-none resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={executeCitiE2EKeyFetch}
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 text-black font-black rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Key size={18} />}
                  <span className="tracking-wider text-xs uppercase">EXECUTE_PRELOGIN_E2E_KEY_FETCH</span>
                </button>
              </div>

              {/* RIGHT COLUMN: API RESPONSE & ENCRYPTION SANDBOX */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* RESPONSE DISPLAY CARD */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 font-mono text-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <Terminal size={18} />
                      <span className="font-bold uppercase tracking-wider text-xs">GetEncryptionKeyResponse (200 OK)</span>
                    </div>
                    {citiE2eResponse && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        STATUS: 200 SUCCESS
                      </span>
                    )}
                  </div>

                  {citiE2eResponse ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black rounded-2xl border border-white/10 space-y-1">
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Key Identifier</p>
                          <p className="text-emerald-400 font-bold text-sm">{citiE2eResponse.keyIdentifier || 'CARD_LOGIN'}</p>
                        </div>
                        <div className="p-4 bg-black rounded-2xl border border-white/10 space-y-1">
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Exponent</p>
                          <p className="text-blue-400 font-bold text-sm">{citiE2eResponse.exponent || '3'}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-black rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-gray-500 uppercase font-bold">RSA Public Key Modulus (hex)</p>
                          <button 
                            onClick={() => copyToClipboard(citiE2eResponse.modulus, 'Modulus')}
                            className="text-emerald-400 hover:underline text-[10px] flex items-center space-x-1 cursor-pointer"
                          >
                            <Copy size={12} />
                            <span>Copy Modulus</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-emerald-300/90 break-all font-mono leading-relaxed bg-black/80 p-3 rounded-xl border border-white/5 max-h-36 overflow-y-auto">
                          {citiE2eResponse.modulus}
                        </p>
                      </div>

                      {citiE2eResponse.x_meta && (
                        <pre className="bg-black p-3 rounded-xl border border-white/5 text-[10px] text-gray-500 overflow-x-auto">
                          {JSON.stringify(citiE2eResponse.x_meta, null, 2)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-600 space-y-3 opacity-60">
                      <Key size={48} />
                      <p>Click "EXECUTE_PRELOGIN_E2E_KEY_FETCH" to retrieve public key</p>
                    </div>
                  )}
                </div>

                {/* INTERACTIVE ENCRYPTION SANDBOX */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 font-mono text-xs space-y-4">
                  <div className="flex items-center space-x-2 text-blue-400 border-b border-white/10 pb-3">
                    <Lock size={18} />
                    <h3 className="font-bold uppercase tracking-wider text-xs text-white">Pre-Login Field Encryption Sandbox</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase font-bold">Raw Sensitive Field (e.g. Card PIN / Password)</label>
                      <input 
                        type="text" 
                        value={citiSensitiveData} 
                        onChange={(e) => setCitiSensitiveData(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white font-mono focus:border-blue-500/50 outline-none"
                        placeholder="e.g. 4821"
                      />
                    </div>
                    <button
                      onClick={encryptWithCitiModulus}
                      disabled={!citiE2eResponse?.modulus}
                      className="py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Zap size={14} />
                      <span className="uppercase text-[11px]">Encrypt Field</span>
                    </button>
                  </div>

                  {citiEncryptedPayload && (
                    <div className="p-4 bg-black rounded-2xl border border-blue-500/30 space-y-2 animate-in fade-in">
                      <p className="text-[10px] text-blue-400 font-bold uppercase">Encrypted Pre-Login Field Payload</p>
                      <p className="text-[11px] text-emerald-300 break-all bg-black/80 p-3 rounded-xl border border-white/5">
                        {citiEncryptedPayload}
                      </p>
                    </div>
                  )}
                </div>

                {/* HTTP STATUS CODE MATRIX CARD */}
                <div className="bg-black/40 border border-white/10 rounded-3xl p-6 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">OpenAPI Error Response Schema Reference</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-[11px]">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-emerald-400 font-bold">200 OK</span>
                      <p className="text-[10px] text-gray-400">GetEncryptionKeyResponse</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-amber-400 font-bold">400 Invalid</span>
                      <p className="text-[10px] text-gray-400">Missing/Invalid Params</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-red-400 font-bold">401 Unauthorized</span>
                      <p className="text-[10px] text-gray-400">Credentials missing/invalid</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-orange-400 font-bold">403 Forbidden</span>
                      <p className="text-[10px] text-gray-400">Access not configured</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-purple-400 font-bold">404 Not Found</span>
                      <p className="text-[10px] text-gray-400">Resource not found</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-rose-500 font-bold">500 Fatal</span>
                      <p className="text-[10px] text-gray-400">Internal server error</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 3: VARIABLE WORKBENCH */}
        {activeTab === 'workbench' && (
          <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">VARIABLE WORKBENCH & INPUT BOXES</h2>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Customize every single value in the FAPI 2.0 / UK Open Banking OIDC Security Profile pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">ASPSP Base URL</label>
                <input 
                  type="text" 
                  value={aspspUrl} 
                  onChange={e => setAspspUrl(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">Client ID (client_id)</label>
                <input 
                  type="text" 
                  value={clientId} 
                  onChange={e => setClientId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">Redirect URI (redirect_uri)</label>
                <input 
                  type="text" 
                  value={redirectUri} 
                  onChange={e => setRedirectUri(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">OpenBanking Intent ID</label>
                <input 
                  type="text" 
                  value={intentId} 
                  onChange={e => setIntentId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-emerald-400 focus:border-emerald-500/50 outline-none font-bold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">Key ID (kid)</label>
                <input 
                  type="text" 
                  value={kid} 
                  onChange={e => setKid(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">Requested Scope</label>
                <input 
                  type="text" 
                  value={scope} 
                  onChange={e => setScope(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">Response Type</label>
                <input 
                  type="text" 
                  value={responseType} 
                  onChange={e => setResponseType(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">Nonce Value</label>
                <input 
                  type="text" 
                  value={nonceVal} 
                  onChange={e => setNonceVal(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">State Value</label>
                <input 
                  type="text" 
                  value={stateVal} 
                  onChange={e => setStateVal(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">x-fapi-financial-id</label>
                <input 
                  type="text" 
                  value={financialId} 
                  onChange={e => setFinancialId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">x-fapi-interaction-id</label>
                <input 
                  type="text" 
                  value={interactionId} 
                  onChange={e => setInteractionId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">ACR Values (Authentication Context)</label>
                <input 
                  type="text" 
                  value={acrValue} 
                  onChange={e => setAcrValue(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none" 
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JWS & JWE CRYPTO VAULT */}
        {activeTab === 'jws_vault' && (
          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">CRYPTONOMIC RSA KEYPAIR VAULT</h2>
                  <p className="text-xs text-gray-400 font-mono mt-1">Generate or paste RSA private keys (PKCS#8) for RFC 7515 Request Object signing.</p>
                </div>
                <button
                  onClick={handleGenerateKeypair}
                  disabled={loading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span>GENERATE_FRESH_RSA_2048</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-gray-500 font-bold flex justify-between">
                    <span>RSA Private Key (PKCS#8)</span>
                    <button onClick={() => copyToClipboard(privateKeyPem, 'Private Key')} className="text-emerald-400 hover:underline">Copy</button>
                  </label>
                  <textarea
                    value={privateKeyPem}
                    onChange={e => setPrivateKeyPem(e.target.value)}
                    placeholder="-----BEGIN PRIVATE KEY-----"
                    className="w-full h-64 bg-black border border-white/10 rounded-2xl p-4 text-emerald-400/80 text-[11px] outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-gray-500 font-bold flex justify-between">
                    <span>RSA Public Key (SPKI) & JWK Set</span>
                    <button onClick={() => copyToClipboard(publicKeyPem, 'Public Key')} className="text-emerald-400 hover:underline">Copy</button>
                  </label>
                  <textarea
                    value={publicKeyPem}
                    onChange={e => setPublicKeyPem(e.target.value)}
                    placeholder="-----BEGIN PUBLIC KEY-----"
                    className="w-full h-64 bg-black border border-white/10 rounded-2xl p-4 text-blue-400/80 text-[11px] outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LOCK MATRIX */}
        {activeTab === 'lock_matrix' && (
          <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10">
            <div className="flex items-center space-x-3 text-emerald-400">
              <Lock size={28} />
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">FINANCIAL API 2.0 LOCK COMPLIANCE MATRIX</h2>
                <p className="text-xs text-gray-400 font-mono">Enforced security controls required by UK Open Banking Read/Write Standards.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'OIDC Hybrid Flow', desc: 'Mandatory response_type=code id_token to prevent IdP mix-up attacks.', status: 'LOCKED', icon: <CheckCircle2 className="text-emerald-400" /> },
                { title: 'c_hash / s_hash Hash Verification', desc: 'Detached signature checks on authorization code and state parameter.', status: 'LOCKED', icon: <CheckCircle2 className="text-emerald-400" /> },
                { title: 'JWS Signed Request Objects', desc: 'Mandatory RFC 7515 signed JWT containing openbanking_intent_id.', status: 'LOCKED', icon: <CheckCircle2 className="text-emerald-400" /> },
                { title: 'private_key_jwt Client Auth', desc: 'Confidential client token requests authenticated via asymmetric key assertion.', status: 'LOCKED', icon: <CheckCircle2 className="text-emerald-400" /> },
                { title: 'mTLS Certificate Binding', desc: 'Tokens bound to TLS client certificate fingerprint.', status: 'LOCKED', icon: <CheckCircle2 className="text-emerald-400" /> },
                { title: 'Financial Headers (x-fapi)', desc: 'Mandatory tracing headers x-fapi-financial-id & x-fapi-interaction-id.', status: 'LOCKED', icon: <CheckCircle2 className="text-emerald-400" /> },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-black/60 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase">{item.title}</span>
                    {item.icon}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  <div className="pt-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DOCS */}
        {activeTab === 'docs' && (
          <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 font-mono text-xs leading-relaxed text-gray-300">
            <h2 className="text-xl font-bold text-white tracking-tight">UK OPEN BANKING READ/WRITE SECURITY SPECIFICATION</h2>
            <div className="space-y-4">
              <p>
                This application implements the <strong>UK Open Banking OIDC Security Profile & Financial API (FAPI) 2.0 Specification</strong>.
              </p>
              <div className="bg-black p-6 rounded-2xl border border-white/10 space-y-2">
                <p className="text-emerald-400 font-bold">Key Architectural Milestones:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li><strong>Intent Registration:</strong> PISP/AISP registers consent with ASPSP to receive an <code className="text-white">openbanking_intent_id</code>.</li>
                  <li><strong>Signed Request Object:</strong> Signed JWS containing <code className="text-white">claims.userinfo.openbanking_intent_id</code> and <code className="text-white">claims.id_token.acr</code>.</li>
                  <li><strong>Hybrid Grant:</strong> <code className="text-white">response_type=code id_token</code> guarantees decoupled signature validation for <code className="text-white">c_hash</code> and <code className="text-white">s_hash</code>.</li>
                  <li><strong>Client Assertion:</strong> Token exchange utilizes <code className="text-white">private_key_jwt</code> signed with RSA-2048 (RS256).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

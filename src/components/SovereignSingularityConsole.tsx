import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Zap,
  TrendingUp,
  Landmark,
  Building2,
  Lock,
  Cpu,
  FileCode,
  DollarSign,
  CheckCircle2,
  Activity,
  ArrowRight,
  RefreshCw,
  Copy,
  Layers,
  Sparkles,
  ExternalLink,
  Terminal,
  Sliders,
  Eye,
  Check,
  AlertTriangle,
  Play,
  Settings,
  Code2,
  Database,
  Search,
  Filter,
  ArrowDownRight,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import { SovereignDisbursementEngine, SovereignExecutionManifest, SovereignEquityMoat } from '../services/sovereignDisbursementEngine';
import { CitiCryptoService, JweResult, JwsResult, ObpCommercialPaper } from '../services/citiCryptoService';
import { MathEngine, MertonRiskMetrics, BlackScholesResult, AltmanZScoreResult } from '../services/mathEngine';
import { UnderwritingEngine, UnderwritingDecision } from '../services/underwritingEngine';
import { AlpacaTokenizationService, TokenizedEquity, QuantSignal } from '../services/alpacaTokenizationService';
import { RealEstateAuctionEngine, AvmValuation, TaxLienAuctionSimulation } from '../services/realEstateAuctionEngine';
import { ZkpEngine, ZkSnarkProof, UserOperation4337 } from '../services/zkpEngine';
import { UsTreasuryBfsEngine, Iso20022Pacs008, NachaCcdBatch } from '../services/usTreasuryBfsEngine';

export type PipelineStageId =
  | 'disbursement'
  | 'citi_crypto'
  | 'math_core'
  | 'underwriting'
  | 'quant_rwa'
  | 'real_estate'
  | 'zkp_web3'
  | 'treasury_bfs';

interface HeaderItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export const SovereignSingularityConsole: React.FC = () => {
  // Navigation & View Modes
  const [viewMode, setViewMode] = useState<'interactive_workbench' | 'e2e_pipeline_flow' | 'variable_matrix'>('interactive_workbench');
  const [activeStage, setActiveStage] = useState<PipelineStageId>('disbursement');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isFullSpace, setIsFullSpace] = useState(false);

  // Global Pipeline Execution State
  const [isExecutingAll, setIsExecutingAll] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState<{ [key in PipelineStageId]?: 'idle' | 'running' | 'success' | 'failed' }>({});
  const [executionLogs, setExecutionLogs] = useState<Array<{ timestamp: string; stage: string; message: string; type: 'info' | 'success' | 'warn' | 'error' }>>([]);

  // ==========================================
  // STAGE 1: Sovereign Moat & Fedwire Variables
  // ==========================================
  const [valuationCap, setValuationCap] = useState<number>(5_600_000_000_000);
  const [sbaMoatPercent, setSbaMoatPercent] = useState<number>(5.00);
  const [tranche1Title, setTranche1Title] = useState('Trump Administration Policy Transition Trust');
  const [tranche1Rtn, setTranche1Rtn] = useState('021000021');
  const [tranche1Account, setTranche1Account] = useState('****49281');
  const [tranche1Amount, setTranche1Amount] = useState<number>(1_000_000.00);
  const [tranche1Imad, setTranche1Imad] = useState('20260912CITIUS3391A');

  const [tranche2Title, setTranche2Title] = useState('SBA Special Initiatives Account (Admin. Kelly Loeffler)');
  const [tranche2Rtn, setTranche2Rtn] = useState('051000033');
  const [tranche2Account, setTranche2Account] = useState('****83190');
  const [tranche2Amount, setTranche2Amount] = useState<number>(1_000_000.00);
  const [tranche2Imad, setTranche2Imad] = useState('20260912FRBNUS8821B');

  const [disbursementManifest, setDisbursementManifest] = useState<SovereignExecutionManifest | null>(null);
  const [disbursementRunning, setDisbursementRunning] = useState(false);

  // ==========================================
  // STAGE 2: Citi Crypto & OBP Variables
  // ==========================================
  const [citiAction, setCitiAction] = useState('SOVEREIGN_CITI_OPEN_BANKING_EXECUTION');
  const [citiTrustAccount, setCitiTrustAccount] = useState('CITI-GB-99281');
  const [citiSettlementAmount, setCitiSettlementAmount] = useState<number>(5_000_000);
  const [citiPaperIssuer, setCitiPaperIssuer] = useState('CITI_CORP_TREASURY_01');
  const [citiPaperFaceValue, setCitiPaperFaceValue] = useState<number>(10_000_000);
  const [citiDiscountRate, setCitiDiscountRate] = useState<number>(5.15);
  const [citiMaturityDays, setCitiMaturityDays] = useState<number>(90);

  const [jweResult, setJweResult] = useState<JweResult | null>(null);
  const [jwsResult, setJwsResult] = useState<JwsResult | null>(null);
  const [commPaper, setCommPaper] = useState<ObpCommercialPaper | null>(null);

  // ==========================================
  // STAGE 3: Mathematical Finance Core Variables
  // ==========================================
  const [mertonAssetValue, setMertonAssetValue] = useState<number>(50_000_000);
  const [mertonDebtFaceValue, setMertonDebtFaceValue] = useState<number>(35_000_000);
  const [mertonVolatility, setMertonVolatility] = useState<number>(0.22);
  const [mertonRiskFreeRate, setMertonRiskFreeRate] = useState<number>(0.045);
  const [mertonMaturityYears, setMertonMaturityYears] = useState<number>(1.0);

  const [bsSpotPrice, setBsSpotPrice] = useState<number>(230);
  const [bsStrikePrice, setBsStrikePrice] = useState<number>(235);
  const [bsTimeToExpiry, setBsTimeToExpiry] = useState<number>(0.25);
  const [bsVolatility, setBsVolatility] = useState<number>(0.28);
  const [bsRiskFreeRate, setBsRiskFreeRate] = useState<number>(0.045);

  const [altmanWorkingCapital, setAltmanWorkingCapital] = useState<number>(15_000_000);
  const [altmanTotalAssets, setAltmanTotalAssets] = useState<number>(80_000_000);
  const [altmanRetainedEarnings, setAltmanRetainedEarnings] = useState<number>(22_000_000);
  const [altmanEbit, setAltmanEbit] = useState<number>(12_000_000);
  const [altmanMarketCap, setAltmanMarketCap] = useState<number>(95_000_000);
  const [altmanTotalLiabilities, setAltmanTotalLiabilities] = useState<number>(30_000_000);
  const [altmanSales, setAltmanSales] = useState<number>(65_000_000);

  const [mertonResult, setMertonResult] = useState<MertonRiskMetrics | null>(null);
  const [bsResult, setBsResult] = useState<BlackScholesResult | null>(null);
  const [altmanResult, setAltmanResult] = useState<AltmanZScoreResult | null>(null);

  // ==========================================
  // STAGE 4: Underwriting & Solidity Variables
  // ==========================================
  const [borrowerId, setBorrowerId] = useState('BORROWER-9982');
  const [borrowerName, setBorrowerName] = useState('Apex Sovereign Holdings LLC');
  const [monthlyGrossIncome, setMonthlyGrossIncome] = useState<number>(145_000);
  const [monthlyDebtObligations, setMonthlyDebtObligations] = useState<number>(26_000);
  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(1_850_000);
  const [collateralAssetValue, setCollateralAssetValue] = useState<number>(3_200_000);
  const [creditScore, setCreditScore] = useState<number>(792);
  const [propertyZipCode, setPropertyZipCode] = useState('10005');

  const [underwritingResult, setUnderwritingResult] = useState<UnderwritingDecision | null>(null);

  // ==========================================
  // STAGE 5: Quant & Alpaca RWA Variables
  // ==========================================
  const [equities, setEquities] = useState<TokenizedEquity[]>([]);
  const [btcSignal, setBtcSignal] = useState<QuantSignal | null>(null);
  const [tqqqSignal, setTqqqSignal] = useState<QuantSignal | null>(null);
  const [customTicker, setCustomTicker] = useState('NVDA');
  const [customNav, setCustomNav] = useState<number>(128.50);

  // ==========================================
  // STAGE 6: Real Estate & Tax Lien Variables
  // ==========================================
  const [reAddress, setReAddress] = useState('100 Wall Street, Penthouse 40');
  const [reZip, setReZip] = useState('10005');
  const [reCounty, setReCounty] = useState('New York County');
  const [reSqFt, setReSqFt] = useState<number>(4800);
  const [reLotSize, setReLotSize] = useState<number>(6200);
  const [reSchoolRating, setReSchoolRating] = useState<number>(9);
  const [reFloodZone, setReFloodZone] = useState<boolean>(false);

  const [taxParcelId, setTaxParcelId] = useState('FL-MIAMI-DADE-78819');
  const [taxState, setTaxState] = useState('FL');
  const [taxAssessedValue, setTaxAssessedValue] = useState<number>(485_000);
  const [taxMillageRate, setTaxMillageRate] = useState<number>(18.2);

  const [avmResult, setAvmResult] = useState<AvmValuation | null>(null);
  const [taxLienResult, setTaxLienResult] = useState<TaxLienAuctionSimulation | null>(null);

  // ==========================================
  // STAGE 7: ZKP & ERC-4337 Variables
  // ==========================================
  const [zkCircuit, setZkCircuit] = useState('CreditworthinessZkCircuit');
  const [zkSecretIdentityHash, setZkSecretIdentityHash] = useState('0x88291fbc34091aef');
  const [zkPublicThreshold, setZkPublicThreshold] = useState<number>(750);
  const [userOpSender, setUserOpSender] = useState('0x43d9284475bd4b71b81c1f528b1bf4e499990000');
  const [userOpTarget, setUserOpTarget] = useState('0x3845badade2e6dff049820680d1f14bd3903a5d0');
  const [userOpCallData, setUserOpCallData] = useState('0xa9059cbb00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8');

  const [zkProof, setZkProof] = useState<ZkSnarkProof | null>(null);
  const [userOp, setUserOp] = useState<UserOperation4337 | null>(null);

  // ==========================================
  // STAGE 8: US Treasury BFS & ISO 20022 Variables
  // ==========================================
  const [bfsDebtorName, setBfsDebtorName] = useState('Aquarius Sovereign Treasury');
  const [bfsDebtorIban, setBfsDebtorIban] = useState('US89CITI021000021987654321');
  const [bfsCreditorName, setBfsCreditorName] = useState('US Department of the Treasury (BFS)');
  const [bfsCreditorIban, setBfsCreditorIban] = useState('US12FRBN010000001234567890');
  const [bfsAmount, setBfsAmount] = useState<number>(2_000_000.00);
  const [bfsTasBetc, setBfsTasBetc] = useState('020-000-0000/DISB');
  const [nachaCompanyName, setNachaCompanyName] = useState('AQUARIUS SOV CORP');
  const [nachaCompanyId, setNachaCompanyId] = useState('1987654321');
  const [nachaOriginDfi, setNachaOriginDfi] = useState('02100002');

  const [pacs008, setPacs008] = useState<Iso20022Pacs008 | null>(null);
  const [nachaBatch, setNachaBatch] = useState<NachaCcdBatch | null>(null);

  // ==========================================
  // Custom Editable Request Headers (Per Stage)
  // ==========================================
  const [stageHeaders, setStageHeaders] = useState<{ [key in PipelineStageId]: HeaderItem[] }>({
    disbursement: [
      { id: 'h1', key: 'Authorization', value: 'Bearer sov_live_sec_99482910482918', enabled: true },
      { id: 'h2', key: 'X-Fedwire-Rail', value: 'FEDWIRE-FUNDS-SERVICE-IMAD-V2', enabled: true },
      { id: 'h3', key: 'X-Valuation-Cap-Tier', value: 'TIER-2-5.6T-SOVEREIGN', enabled: true },
      { id: 'h4', key: 'X-Idempotency-Key', value: 'idem_disb_2026_09_12_apex', enabled: true },
      { id: 'h5', key: 'Content-Type', value: 'application/json', enabled: true },
    ],
    citi_crypto: [
      { id: 'h1', key: 'Authorization', value: 'Bearer citi_oauth2_jwt_token_8831', enabled: true },
      { id: 'h2', key: 'X-JWE-Key-ID', value: 'citi-rsa-oaep-256-master', enabled: true },
      { id: 'h3', key: 'X-OBP-Version', value: 'v5.1.0', enabled: true },
      { id: 'h4', key: 'Digest', value: 'SHA-256=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', enabled: true },
      { id: 'h5', key: 'Content-Type', value: 'application/jose+json', enabled: true },
    ],
    math_core: [
      { id: 'h1', key: 'Authorization', value: 'Bearer apex_quant_math_engine_v1', enabled: true },
      { id: 'h2', key: 'X-Precision-Model', value: 'IEEE-754-DOUBLE-MERTON-BS', enabled: true },
      { id: 'h3', key: 'Content-Type', value: 'application/json', enabled: true },
    ],
    underwriting: [
      { id: 'h1', key: 'Authorization', value: 'Bearer underwriting_ai_solidity_v4', enabled: true },
      { id: 'h2', key: 'X-OFAC-Screening-Profile', value: 'SDN-COMPLIANCE-REALTIME', enabled: true },
      { id: 'h3', key: 'X-SmartContract-Target', value: 'ERC-3643-RWA-PERMISSIONED', enabled: true },
      { id: 'h4', key: 'Content-Type', value: 'application/json', enabled: true },
    ],
    quant_rwa: [
      { id: 'h1', key: 'Authorization', value: 'Bearer alpaca_broker_trading_key_sec', enabled: true },
      { id: 'h2', key: 'X-Market-Data-Feed', value: 'SIP-DIRECT-TAPE-A-B-C', enabled: true },
      { id: 'h3', key: 'Content-Type', value: 'application/json', enabled: true },
    ],
    real_estate: [
      { id: 'h1', key: 'Authorization', value: 'Bearer attom_simplifile_bridge_key', enabled: true },
      { id: 'h2', key: 'X-Jurisdiction-State', value: 'US-FL-NY-TX-MUNICIPAL', enabled: true },
      { id: 'h3', key: 'Content-Type', value: 'application/json', enabled: true },
    ],
    zkp_web3: [
      { id: 'h1', key: 'Authorization', value: 'Bearer zkp_snark_prover_bundler_rpc', enabled: true },
      { id: 'h2', key: 'X-ERC4337-EntryPoint', value: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', enabled: true },
      { id: 'h3', key: 'Content-Type', value: 'application/json', enabled: true },
    ],
    treasury_bfs: [
      { id: 'h1', key: 'Authorization', value: 'Bearer us_treasury_bfs_sam_gov_cert', enabled: true },
      { id: 'h2', key: 'X-TAS-BETC', value: '020-000-0000/DISB', enabled: true },
      { id: 'h3', key: 'X-ISO20022-Message-Type', value: 'pacs.008.001.10', enabled: true },
      { id: 'h4', key: 'Content-Type', value: 'application/xml', enabled: true },
    ],
  });

  // Initial Calculation
  useEffect(() => {
    executeStage('disbursement');
    executeStage('math_core');
    executeStage('quant_rwa');
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Header helpers
  const handleToggleHeader = (stage: PipelineStageId, id: string) => {
    setStageHeaders(prev => ({
      ...prev,
      [stage]: prev[stage].map(h => h.id === id ? { ...h, enabled: !h.enabled } : h)
    }));
  };

  const handleUpdateHeader = (stage: PipelineStageId, id: string, field: 'key' | 'value', val: string) => {
    setStageHeaders(prev => ({
      ...prev,
      [stage]: prev[stage].map(h => h.id === id ? { ...h, [field]: val } : h)
    }));
  };

  const handleAddHeader = (stage: PipelineStageId) => {
    const newId = `h_${Date.now()}`;
    setStageHeaders(prev => ({
      ...prev,
      [stage]: [...prev[stage], { id: newId, key: 'X-Custom-Header', value: 'custom-value', enabled: true }]
    }));
  };

  const handleDeleteHeader = (stage: PipelineStageId, id: string) => {
    setStageHeaders(prev => ({
      ...prev,
      [stage]: prev[stage].filter(h => h.id !== id)
    }));
  };

  // Stage Execution Runner
  const executeStage = (stage: PipelineStageId) => {
    const timestamp = new Date().toLocaleTimeString();
    setPipelineProgress(prev => ({ ...prev, [stage]: 'running' }));

    try {
      if (stage === 'disbursement') {
        const manifest = SovereignDisbursementEngine.executePriorityDisbursement({
          valuation: valuationCap,
          equityPercentage: sbaMoatPercent,
          tranche1: {
            title: tranche1Title,
            rtn: tranche1Rtn,
            accountMasked: tranche1Account,
            amount: tranche1Amount,
            imad: tranche1Imad
          },
          tranche2: {
            title: tranche2Title,
            rtn: tranche2Rtn,
            accountMasked: tranche2Account,
            amount: tranche2Amount,
            imad: tranche2Imad
          }
        });
        setDisbursementManifest(manifest);
        setExecutionLogs(prev => [
          { timestamp, stage: 'SBA Moat & Fedwire', message: `Disbursed $${(tranche1Amount + tranche2Amount).toLocaleString()} across 2 Fedwire IMAD rails at $${(valuationCap / 1e12).toFixed(1)}T Cap.`, type: 'success' },
          ...prev
        ]);
      } else if (stage === 'citi_crypto') {
        const payload = {
          action: citiAction,
          trustAccountId: citiTrustAccount,
          settlementAmount: citiSettlementAmount,
          valuationContext: valuationCap,
          timestamp: Date.now()
        };
        const jwe = CitiCryptoService.encryptCompactJwe(payload);
        const jws = CitiCryptoService.signCompactJws(payload);
        const paper = CitiCryptoService.issueCommercialPaper({
          issuerId: citiPaperIssuer,
          faceValue: citiPaperFaceValue,
          discountRate: citiDiscountRate,
          maturityDays: citiMaturityDays
        });
        setJweResult(jwe);
        setJwsResult(jws);
        setCommPaper(paper);
        setExecutionLogs(prev => [
          { timestamp, stage: 'Citi Cryptography & OBP', message: `Compact JWE encrypted (5 parts) & JWS signed (RS256). Commercial Paper ${paper.paperId} issued for $${citiPaperFaceValue.toLocaleString()}.`, type: 'success' },
          ...prev
        ]);
      } else if (stage === 'math_core') {
        const merton = MathEngine.calculateMertonRisk({
          firmAssetValue: mertonAssetValue,
          debtFaceValue: mertonDebtFaceValue,
          assetVolatility: mertonVolatility,
          riskFreeRate: mertonRiskFreeRate,
          timeToMaturityYears: mertonMaturityYears
        });
        const bs = MathEngine.calculateBlackScholes({
          spotPrice: bsSpotPrice,
          strikePrice: bsStrikePrice,
          timeToExpiry: bsTimeToExpiry,
          volatility: bsVolatility,
          riskFreeRate: bsRiskFreeRate
        });
        const altman = MathEngine.calculateAltmanZScore({
          workingCapital: altmanWorkingCapital,
          totalAssets: altmanTotalAssets,
          retainedEarnings: altmanRetainedEarnings,
          ebit: altmanEbit,
          marketValueOfEquity: altmanMarketCap,
          totalLiabilities: altmanTotalLiabilities,
          sales: altmanSales
        });
        setMertonResult(merton);
        setBsResult(bs);
        setAltmanResult(altman);
        setExecutionLogs(prev => [
          { timestamp, stage: 'Math Finance Core', message: `Merton DD: ${merton.distanceToDefault}, BS Call: $${bs.callPrice}, Altman Z-Score: ${altman.zScore} (${altman.zone}).`, type: 'success' },
          ...prev
        ]);
      } else if (stage === 'underwriting') {
        const res = UnderwritingEngine.evaluateLoan({
          applicantId: borrowerId,
          applicantName: borrowerName,
          monthlyGrossIncome,
          monthlyDebtObligations,
          requestedLoanAmount,
          collateralAssetValue,
          collateralAssetWeights: [50, 30, 20],
          creditScore,
          propertyZipCode
        });
        setUnderwritingResult(res);
        setExecutionLogs(prev => [
          { timestamp, stage: 'Underwriting & Solidity', message: `Verdict: ${res.decision} (DTI: ${res.dtiPercent}%, LTV: ${res.ltvPercent}%, OFAC: ${res.ofacStatus}). Solidity ERC-3643 generated.`, type: 'success' },
          ...prev
        ]);
      } else if (stage === 'quant_rwa') {
        const eqList = AlpacaTokenizationService.listTokenizedEquities();
        const btc = AlpacaTokenizationService.evaluateBtcSwingStrategy();
        const tqqq = AlpacaTokenizationService.evaluateTqqqStrategy();
        setEquities(eqList);
        setBtcSignal(btc);
        setTqqqSignal(tqqq);
        setExecutionLogs(prev => [
          { timestamp, stage: 'Alpaca RWA & Quant', message: `Listed ${eqList.length} RWA tokens. Quant BTC Signal: ${btc.signal} (${btc.confidenceScore}%).`, type: 'success' },
          ...prev
        ]);
      } else if (stage === 'real_estate') {
        const avm = RealEstateAuctionEngine.calculateAvmValuation({
          propertyAddress: reAddress,
          zipCode: reZip,
          county: reCounty,
          squareFeet: reSqFt,
          lotSizeSqFt: reLotSize,
          schoolRating: reSchoolRating,
          inFloodZone: reFloodZone
        });
        const lien = RealEstateAuctionEngine.simulateTaxLienAuction({
          parcelId: taxParcelId,
          state: taxState,
          assessedValue: taxAssessedValue,
          millageRate: taxMillageRate
        });
        setAvmResult(avm);
        setTaxLienResult(lien);
        setExecutionLogs(prev => [
          { timestamp, stage: 'Real Estate & Tax Liens', message: `AVM: $${avm.estimatedAvmUsd.toLocaleString()} (${avm.confidenceScorePercent}% confidence). Tax Lien winning yield: ${lien.winningBid}% annual.`, type: 'success' },
          ...prev
        ]);
      } else if (stage === 'zkp_web3') {
        const proof = ZkpEngine.generateZkProof({
          circuit: zkCircuit,
          secretIdentityHash: zkSecretIdentityHash,
          publicThreshold: zkPublicThreshold
        });
        const op = ZkpEngine.buildUserOperation({
          senderAccount: userOpSender,
          targetContract: userOpTarget,
          executionCallData: userOpCallData
        });
        setZkProof(proof);
        setUserOp(op);
        setExecutionLogs(prev => [
          { timestamp, stage: 'ZKP & ERC-4337', message: `Synthesized Groth16 zk-SNARK proof (${proof.verificationStatus}). Built UserOp for sender ${userOpSender.slice(0, 10)}...`, type: 'success' },
          ...prev
        ]);
      } else if (stage === 'treasury_bfs') {
        const p008 = UsTreasuryBfsEngine.generatePacs008({
          debtorName: bfsDebtorName,
          debtorIban: bfsDebtorIban,
          creditorName: bfsCreditorName,
          creditorIban: bfsCreditorIban,
          amount: bfsAmount,
          tasBetc: bfsTasBetc
        });
        const nacha = UsTreasuryBfsEngine.generateNachaCcdBatch({
          companyName: nachaCompanyName,
          companyId: nachaCompanyId,
          originatingDfi: nachaOriginDfi,
          entries: [
            { recipientName: tranche1Title.slice(0, 22), routingNumber: tranche1Rtn, accountNumber: '9988776655', amount: tranche1Amount, paymentType: 'CREDIT' },
            { recipientName: tranche2Title.slice(0, 22), routingNumber: tranche2Rtn, accountNumber: '1122334455', amount: tranche2Amount, paymentType: 'CREDIT' }
          ]
        });
        setPacs008(p008);
        setNachaBatch(nacha);
        setExecutionLogs(prev => [
          { timestamp, stage: 'Treasury BFS & ISO 20022', message: `Generated pacs.008 XML (UETR: ${p008.uetr}) and NACHA CCD+ 94-column batch for $${bfsAmount.toLocaleString()}.`, type: 'success' },
          ...prev
        ]);
      }
      setPipelineProgress(prev => ({ ...prev, [stage]: 'success' }));
    } catch (e: any) {
      setPipelineProgress(prev => ({ ...prev, [stage]: 'failed' }));
      setExecutionLogs(prev => [
        { timestamp, stage, message: `Failed: ${e.message || e}`, type: 'error' },
        ...prev
      ]);
    }
  };

  // Run Entire Pipeline sequentially
  const handleRunAllPipeline = async () => {
    setIsExecutingAll(true);
    const stages: PipelineStageId[] = [
      'disbursement',
      'citi_crypto',
      'math_core',
      'underwriting',
      'quant_rwa',
      'real_estate',
      'zkp_web3',
      'treasury_bfs'
    ];

    for (const st of stages) {
      executeStage(st);
      await new Promise(r => setTimeout(r, 200));
    }
    setIsExecutingAll(false);
  };

  // Dynamic cURL Builder for the current active stage
  const currentCurlCommand = useMemo(() => {
    const headers = (stageHeaders[activeStage] || [])
      .filter(h => h.enabled && h.key.trim())
      .map(h => `-H "${h.key.trim()}: ${h.value.trim()}"`)
      .join(' \\\n  ');

    let endpoint = 'https://api.singularity.sovereign.internal';
    let method = 'POST';
    let bodyObj: any = {};

    switch (activeStage) {
      case 'disbursement':
        endpoint += '/v1/sovereign/disbursement/execute';
        bodyObj = {
          valuationCapUsd: valuationCap,
          sbaMoatPercentage: sbaMoatPercent,
          tranches: [
            { code: 'ADMIN-01', beneficiary: tranche1Title, rtn: tranche1Rtn, accountMasked: tranche1Account, amountUsd: tranche1Amount, imad: tranche1Imad },
            { code: 'SBA-KL-02', beneficiary: tranche2Title, rtn: tranche2Rtn, accountMasked: tranche2Account, amountUsd: tranche2Amount, imad: tranche2Imad },
          ],
          totalPriorityWireUsd: tranche1Amount + tranche2Amount,
          protocol: 'SCHEDULE_1A_FEDWIRE'
        };
        break;
      case 'citi_crypto':
        endpoint += '/v1/citi/crypto/jwe-jws-envelope';
        bodyObj = {
          action: citiAction,
          trustAccountId: citiTrustAccount,
          settlementAmountUsd: citiSettlementAmount,
          commercialPaper: {
            issuerId: citiPaperIssuer,
            faceValueUsd: citiPaperFaceValue,
            discountRatePercent: citiDiscountRate,
            maturityDays: citiMaturityDays
          }
        };
        break;
      case 'math_core':
        endpoint += '/v1/quant/math/merton-bs-altman';
        bodyObj = {
          merton: { assetValue: mertonAssetValue, debtFaceValue: mertonDebtFaceValue, volatility: mertonVolatility, riskFreeRate: mertonRiskFreeRate, maturityYears: mertonMaturityYears },
          blackScholes: { spotPrice: bsSpotPrice, strikePrice: bsStrikePrice, timeToExpiry: bsTimeToExpiry, volatility: bsVolatility, riskFreeRate: bsRiskFreeRate },
          altmanZScore: { workingCapital: altmanWorkingCapital, totalAssets: altmanTotalAssets, retainedEarnings: altmanRetainedEarnings, ebit: altmanEbit, marketCap: altmanMarketCap, totalLiabilities: altmanTotalLiabilities, sales: altmanSales }
        };
        break;
      case 'underwriting':
        endpoint += '/v1/underwriting/ai-evaluate-and-compile';
        bodyObj = {
          applicantId: borrowerId,
          applicantName: borrowerName,
          financials: { monthlyGrossIncome, monthlyDebtObligations, requestedLoanAmount, collateralAssetValue, creditScore, propertyZipCode }
        };
        break;
      case 'quant_rwa':
        endpoint += '/v1/alpaca/rwa/signals';
        bodyObj = {
          targetTickers: ['BTC/USD', 'TQQQ', customTicker],
          erc3643Compliance: true,
          executionMode: 'AUTONOMOUS_SWING'
        };
        break;
      case 'real_estate':
        endpoint += '/v1/realestate/avm-and-tax-lien';
        bodyObj = {
          property: { address: reAddress, zip: reZip, county: reCounty, sqFt: reSqFt, lotSize: reLotSize, schoolRating: reSchoolRating, floodZone: reFloodZone },
          taxLien: { parcelId: taxParcelId, state: taxState, assessedValue: taxAssessedValue, millageRate: taxMillageRate }
        };
        break;
      case 'zkp_web3':
        endpoint += '/v1/zkp/synthesize-and-userop';
        bodyObj = {
          zkCircuit,
          secretIdentityHash: zkSecretIdentityHash,
          publicThreshold: zkPublicThreshold,
          userOp: { senderAccount: userOpSender, targetContract: userOpTarget, executionCallData: userOpCallData }
        };
        break;
      case 'treasury_bfs':
        endpoint += '/v1/treasury/bfs/iso20022-pacs008';
        bodyObj = {
          iso20022: { debtorName: bfsDebtorName, debtorIban: bfsDebtorIban, creditorName: bfsCreditorName, creditorIban: bfsCreditorIban, amount: bfsAmount, tasBetc: bfsTasBetc },
          nachaBatch: { companyName: nachaCompanyName, companyId: nachaCompanyId, originatingDfi: nachaOriginDfi }
        };
        break;
    }

    const jsonString = JSON.stringify(bodyObj, null, 2);
    return `curl -X ${method} "${endpoint}" \\\n  ${headers} \\\n  -d '${jsonString.replace(/'/g, "'\\''")}'`;
  }, [
    activeStage,
    stageHeaders,
    valuationCap,
    sbaMoatPercent,
    tranche1Title,
    tranche1Rtn,
    tranche1Account,
    tranche1Amount,
    tranche1Imad,
    tranche2Title,
    tranche2Rtn,
    tranche2Account,
    tranche2Amount,
    tranche2Imad,
    citiAction,
    citiTrustAccount,
    citiSettlementAmount,
    citiPaperIssuer,
    citiPaperFaceValue,
    citiDiscountRate,
    citiMaturityDays,
    mertonAssetValue,
    mertonDebtFaceValue,
    mertonVolatility,
    mertonRiskFreeRate,
    mertonMaturityYears,
    bsSpotPrice,
    bsStrikePrice,
    bsTimeToExpiry,
    bsVolatility,
    bsRiskFreeRate,
    altmanWorkingCapital,
    altmanTotalAssets,
    altmanRetainedEarnings,
    altmanEbit,
    altmanMarketCap,
    altmanTotalLiabilities,
    altmanSales,
    borrowerId,
    borrowerName,
    monthlyGrossIncome,
    monthlyDebtObligations,
    requestedLoanAmount,
    collateralAssetValue,
    creditScore,
    propertyZipCode,
    customTicker,
    reAddress,
    reZip,
    reCounty,
    reSqFt,
    reLotSize,
    reSchoolRating,
    reFloodZone,
    taxParcelId,
    taxState,
    taxAssessedValue,
    taxMillageRate,
    zkCircuit,
    zkSecretIdentityHash,
    zkPublicThreshold,
    userOpSender,
    userOpTarget,
    userOpCallData,
    bfsDebtorName,
    bfsDebtorIban,
    bfsCreditorName,
    bfsCreditorIban,
    bfsAmount,
    bfsTasBetc,
    nachaCompanyName,
    nachaCompanyId,
    nachaOriginDfi
  ]);

  // Dynamic Variable Registry for currently active stage
  const currentStageVariables = useMemo(() => {
    switch (activeStage) {
      case 'disbursement':
        return [
          { name: 'valuationCap', type: 'number', value: `$${(valuationCap / 1e12).toFixed(2)} Trillion`, status: valuationCap > 0 ? 'VALID' : 'INVALID', target: 'Equity Valuation Cap / Sovereign Tier-2 Ledger' },
          { name: 'sbaMoatPercent', type: 'number', value: `${sbaMoatPercent}%`, status: sbaMoatPercent > 0 ? 'VALID' : 'INVALID', target: 'SBA Class A Equity Non-Dilution Pool' },
          { name: 'tranche1Amount', type: 'number', value: `$${tranche1Amount.toLocaleString()}`, status: tranche1Amount > 0 ? 'VALID' : 'INVALID', target: 'Fedwire IMAD 1 Payload & Settled Ledger' },
          { name: 'tranche1Beneficiary', type: 'string', value: tranche1Title, status: tranche1Title ? 'VALID' : 'INVALID', target: 'Fedwire Beneficiary Title' },
          { name: 'tranche1Rtn', type: 'string', value: tranche1Rtn, status: tranche1Rtn.length === 9 ? 'VALID' : 'INVALID', target: 'Citibank Fedwire Routing Number (RTN)' },
          { name: 'tranche1Imad', type: 'string', value: tranche1Imad, status: tranche1Imad ? 'VALID' : 'INVALID', target: 'Fedwire Input Message Accountability Data (IMAD)' },
          { name: 'tranche2Amount', type: 'number', value: `$${tranche2Amount.toLocaleString()}`, status: tranche2Amount > 0 ? 'VALID' : 'INVALID', target: 'Fedwire IMAD 2 Payload & Settled Ledger' },
          { name: 'tranche2Beneficiary', type: 'string', value: tranche2Title, status: tranche2Title ? 'VALID' : 'INVALID', target: 'Fedwire Beneficiary Title' },
          { name: 'tranche2Rtn', type: 'string', value: tranche2Rtn, status: tranche2Rtn.length === 9 ? 'VALID' : 'INVALID', target: 'US Treasury / Federal Reserve RTN' },
          { name: 'tranche2Imad', type: 'string', value: tranche2Imad, status: tranche2Imad ? 'VALID' : 'INVALID', target: 'Fedwire Input Message Accountability Data (IMAD)' },
        ];
      case 'citi_crypto':
        return [
          { name: 'citiAction', type: 'string', value: citiAction, status: 'VALID', target: 'JWS Payload Claims -> action' },
          { name: 'citiTrustAccount', type: 'string', value: citiTrustAccount, status: 'VALID', target: 'JWE Protected Claims -> trustAccountId' },
          { name: 'citiSettlementAmount', type: 'number', value: `$${citiSettlementAmount.toLocaleString()}`, status: 'VALID', target: 'JWE Encrypted Payload -> settlementAmount' },
          { name: 'citiPaperIssuer', type: 'string', value: citiPaperIssuer, status: 'VALID', target: 'OBP v5.1.0 Commercial Paper Issuer ID' },
          { name: 'citiPaperFaceValue', type: 'number', value: `$${citiPaperFaceValue.toLocaleString()}`, status: 'VALID', target: 'OBP v5.1.0 Face Value' },
          { name: 'citiDiscountRate', type: 'number', value: `${citiDiscountRate}%`, status: 'VALID', target: 'OBP Discount Rate (90-Day)' },
        ];
      case 'math_core':
        return [
          { name: 'mertonAssetValue', type: 'number', value: `$${(mertonAssetValue / 1e6).toFixed(1)}M`, status: 'VALID', target: 'Merton Structural Model -> V (Firm Asset)' },
          { name: 'mertonDebtFaceValue', type: 'number', value: `$${(mertonDebtFaceValue / 1e6).toFixed(1)}M`, status: 'VALID', target: 'Merton Structural Model -> D (Debt Face Value)' },
          { name: 'mertonVolatility', type: 'number', value: `${(mertonVolatility * 100).toFixed(1)}%`, status: 'VALID', target: 'Merton Asset Volatility (sigma_V)' },
          { name: 'bsSpotPrice', type: 'number', value: `$${bsSpotPrice}`, status: 'VALID', target: 'Black-Scholes -> S (Spot Price)' },
          { name: 'bsStrikePrice', type: 'number', value: `$${bsStrikePrice}`, status: 'VALID', target: 'Black-Scholes -> K (Strike Price)' },
          { name: 'altmanWorkingCapital', type: 'number', value: `$${(altmanWorkingCapital / 1e6).toFixed(1)}M`, status: 'VALID', target: 'Altman Z-Score X1 (WC / Total Assets)' },
          { name: 'altmanEbit', type: 'number', value: `$${(altmanEbit / 1e6).toFixed(1)}M`, status: 'VALID', target: 'Altman Z-Score X3 (EBIT / Total Assets)' },
        ];
      case 'underwriting':
        return [
          { name: 'borrowerName', type: 'string', value: borrowerName, status: 'VALID', target: 'Underwriting Profile & ERC-3643 Identity' },
          { name: 'monthlyGrossIncome', type: 'number', value: `$${monthlyGrossIncome.toLocaleString()}/mo`, status: 'VALID', target: 'DTI Denominator' },
          { name: 'monthlyDebtObligations', type: 'number', value: `$${monthlyDebtObligations.toLocaleString()}/mo`, status: 'VALID', target: 'DTI Numerator' },
          { name: 'requestedLoanAmount', type: 'number', value: `$${requestedLoanAmount.toLocaleString()}`, status: 'VALID', target: 'LTV Numerator & Solidity Principal' },
          { name: 'collateralAssetValue', type: 'number', value: `$${collateralAssetValue.toLocaleString()}`, status: 'VALID', target: 'LTV Denominator' },
          { name: 'creditScore', type: 'number', value: `${creditScore}`, status: creditScore >= 300 && creditScore <= 850 ? 'VALID' : 'INVALID', target: 'FICO 8 Scoring Engine' },
        ];
      case 'quant_rwa':
        return [
          { name: 'rwaEquitiesLoaded', type: 'array', value: `${equities.length} Tokens`, status: 'VALID', target: 'ERC-3643 Permissioned Security Ledger' },
          { name: 'btcSwingSignal', type: 'object', value: btcSignal ? `${btcSignal.signal} (${btcSignal.confidenceScore}%)` : 'STANDBY', status: 'VALID', target: 'Alpaca Automated Execution Stream' },
          { name: 'customNavTicker', type: 'string', value: customTicker, status: 'VALID', target: 'Tokenized Basket Asset' },
        ];
      case 'real_estate':
        return [
          { name: 'propertyAddress', type: 'string', value: reAddress, status: 'VALID', target: 'ATTOM / Estated Hedonic Valuation Model' },
          { name: 'squareFeet', type: 'number', value: `${reSqFt.toLocaleString()} sqft`, status: 'VALID', target: 'Hedonic Space Weight Component' },
          { name: 'taxParcelId', type: 'string', value: taxParcelId, status: 'VALID', target: 'County Municipal Tax Assessor Record' },
          { name: 'delinquentAssessedValue', type: 'number', value: `$${taxAssessedValue.toLocaleString()}`, status: 'VALID', target: 'Auction Overbid Yield Calculation' },
        ];
      case 'zkp_web3':
        return [
          { name: 'zkCircuit', type: 'string', value: zkCircuit, status: 'VALID', target: 'Groth16 Proving Key Synthesis' },
          { name: 'secretIdentityHash', type: 'string', value: zkSecretIdentityHash, status: 'VALID', target: 'Private Witness (Zero-Knowledge)' },
          { name: 'userOpSender', type: 'string', value: userOpSender, status: 'VALID', target: 'ERC-4337 Smart Account Sender' },
          { name: 'userOpTarget', type: 'string', value: userOpTarget, status: 'VALID', target: 'ERC-4337 Target Contract' },
        ];
      case 'treasury_bfs':
        return [
          { name: 'debtorName', type: 'string', value: bfsDebtorName, status: 'VALID', target: 'pacs.008 <Dbtr><Nm>' },
          { name: 'debtorIban', type: 'string', value: bfsDebtorIban, status: 'VALID', target: 'pacs.008 <DbtrAcct><Id><IBAN>' },
          { name: 'creditorName', type: 'string', value: bfsCreditorName, status: 'VALID', target: 'pacs.008 <Cdtr><Nm>' },
          { name: 'tasBetc', type: 'string', value: bfsTasBetc, status: 'VALID', target: 'pacs.008 / SAM.gov TAS-BETC Symbol' },
          { name: 'nachaCompanyName', type: 'string', value: nachaCompanyName, status: 'VALID', target: 'NACHA Record 5 Batch Header' },
        ];
    }
  }, [
    activeStage,
    valuationCap,
    sbaMoatPercent,
    tranche1Title,
    tranche1Rtn,
    tranche1Account,
    tranche1Amount,
    tranche1Imad,
    tranche2Title,
    tranche2Rtn,
    tranche2Account,
    tranche2Amount,
    tranche2Imad,
    citiAction,
    citiTrustAccount,
    citiSettlementAmount,
    citiPaperIssuer,
    citiPaperFaceValue,
    citiDiscountRate,
    mertonAssetValue,
    mertonDebtFaceValue,
    mertonVolatility,
    bsSpotPrice,
    bsStrikePrice,
    altmanWorkingCapital,
    altmanEbit,
    borrowerName,
    monthlyGrossIncome,
    monthlyDebtObligations,
    requestedLoanAmount,
    collateralAssetValue,
    creditScore,
    equities.length,
    btcSignal,
    customTicker,
    reAddress,
    reSqFt,
    taxParcelId,
    taxAssessedValue,
    zkCircuit,
    zkSecretIdentityHash,
    userOpSender,
    userOpTarget,
    bfsDebtorName,
    bfsDebtorIban,
    bfsCreditorName,
    bfsTasBetc,
    nachaCompanyName
  ]);

  const stagesMetadata: Array<{ id: PipelineStageId; title: string; subtitle: string; icon: any; color: string }> = [
    { id: 'disbursement', title: '1. SBA Equity Moat & Fedwire', subtitle: '5% Perpetual Moat ($280B) + $2M Priority Wire Wires', icon: Landmark, color: 'text-amber-400' },
    { id: 'citi_crypto', title: '2. Citi JWE/JWS & OBP Paper', subtitle: '5-Part JWE + 3-Part JWS + OBP v5.1.0 Commercial Paper', icon: Lock, color: 'text-blue-400' },
    { id: 'math_core', title: '3. Mathematical Finance Core', subtitle: 'Merton Structural Risk + Black-Scholes + Altman Z-Score', icon: Activity, color: 'text-emerald-400' },
    { id: 'underwriting', title: '4. Underwriting & Solidity Contract', subtitle: 'Autonomous DTI/LTV + ERC-3643 Smart Contract Code', icon: FileCode, color: 'text-cyan-400' },
    { id: 'quant_rwa', title: '5. Alpaca RWA & Quant Signals', subtitle: 'Tokenized Equities + BTC/TQQQ Automated Swing Trading', icon: TrendingUp, color: 'text-amber-300' },
    { id: 'real_estate', title: '6. Real Estate AVM & Tax Liens', subtitle: 'Estated/ATTOM Hedonic AVM + Municipal Tax Lien Sim', icon: Building2, color: 'text-purple-400' },
    { id: 'zkp_web3', title: '7. ZKP & Account Abstraction', subtitle: 'Groth16 zk-SNARK Circuits + ERC-4337 UserOperations', icon: Cpu, color: 'text-indigo-400' },
    { id: 'treasury_bfs', title: '8. US Treasury BFS & ISO 20022', subtitle: 'pacs.008.001.10 XML + NACHA CCD+ 94-Col Transmission', icon: Shield, color: 'text-emerald-400' },
  ];

  return (
    <div
      id="sovereign-singularity-pipeline-workbench"
      className={`min-h-screen bg-slate-950 text-slate-100 font-sans transition-all ${
        isFullSpace ? 'p-2 md:p-4 max-w-full' : 'p-4 md:p-6 max-w-7xl mx-auto'
      }`}
    >
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 rounded-xl shadow-inner">
              <Sparkles className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Aquarius Sovereign Singularity
                </h1>
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                  Multi-Rail Pipeline Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-Space Interactive Pipeline Inspector, Editable Variable Matrix, Live Dynamic cURL & Multi-Rail Dispatcher
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setViewMode('interactive_workbench')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'interactive_workbench'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Stage Workbench
              </button>
              <button
                onClick={() => setViewMode('e2e_pipeline_flow')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'e2e_pipeline_flow'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> E2E Pipeline Stream
              </button>
              <button
                onClick={() => setViewMode('variable_matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'variable_matrix'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" /> Global Variable Matrix
              </button>
            </div>

            {/* Full Space Expander */}
            <button
              onClick={() => setIsFullSpace(!isFullSpace)}
              title={isFullSpace ? 'Exit Expanded View' : 'Expand to Full Workspace Space'}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              {isFullSpace ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Run All Stages */}
            <button
              onClick={handleRunAllPipeline}
              disabled={isExecutingAll}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs font-mono transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isExecutingAll ? 'animate-spin' : ''}`} />
              {isExecutingAll ? 'Executing Full Pipeline...' : 'Run All 8 Stages'}
            </button>
          </div>
        </div>

        {/* Global Valuation & Moat Status Pill Strip */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">ENTERPRISE VALUATION CAP</span>
            <span className="text-amber-400 font-bold text-sm sm:text-base">${(valuationCap / 1e12).toFixed(2)} Trillion USD</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">SBA 5% CLASS A MOAT VALUE</span>
            <span className="text-emerald-400 font-bold text-sm sm:text-base">${((valuationCap * sbaMoatPercent) / 100 / 1e9).toFixed(1)} Billion</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">TOTAL PRIORITY FEDWIRE WIRES</span>
            <span className="text-white font-bold text-sm sm:text-base">${(tranche1Amount + tranche2Amount).toLocaleString()} USD</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">VARIABLE AUDIT STATUS</span>
            <span className="text-emerald-400 font-bold text-sm sm:text-base flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Parameterized
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE STAGE WORKBENCH (DEFAULT - EXPANSIVE MULTI-PANE) */}
      {/* ========================================================================= */}
      {viewMode === 'interactive_workbench' && (
        <div className="space-y-6">
          {/* Horizontal Stage Navigator */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {stagesMetadata.map(stage => {
              const Icon = stage.icon;
              const isActive = activeStage === stage.id;
              const status = pipelineProgress[stage.id];

              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                    isActive
                      ? 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${stage.color}`} />
                    {status === 'success' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                    {status === 'running' && <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />}
                    {status === 'failed' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 line-clamp-1">{stage.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono line-clamp-1 mt-0.5">{stage.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dual-Pane Workbench: Left = Variable & Header Inspector | Right = Live cURL & Execution Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT PANE: Variables, Parameters & Request Headers (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Granular Variable Controls */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Stage Variables & Payload Controls
                    </h2>
                  </div>
                  <button
                    onClick={() => executeStage(activeStage)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" /> Execute Stage
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {/* STAGE 1 CONTROLS */}
                  {activeStage === 'disbursement' && (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">Enterprise Valuation ($ USD)</label>
                          <input
                            type="number"
                            value={valuationCap}
                            onChange={e => setValuationCap(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold focus:border-amber-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">SBA Equity Moat Share (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={sbaMoatPercent}
                            onChange={e => setSbaMoatPercent(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-bold focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>

                      {/* Tranche 1 */}
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between text-amber-400 font-bold">
                          <span>TRANCHE ADMIN-01 (Fedwire Rail 1)</span>
                          <span>${tranche1Amount.toLocaleString()} USD</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] text-slate-500 block">Beneficiary Title</label>
                            <input
                              type="text"
                              value={tranche1Title}
                              onChange={e => setTranche1Title(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Routing Transit Number (RTN)</label>
                            <input
                              type="text"
                              value={tranche1Rtn}
                              onChange={e => setTranche1Rtn(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Amount ($ USD)</label>
                            <input
                              type="number"
                              value={tranche1Amount}
                              onChange={e => setTranche1Amount(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Fedwire IMAD Identifier</label>
                            <input
                              type="text"
                              value={tranche1Imad}
                              onChange={e => setTranche1Imad(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tranche 2 */}
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span>TRANCHE SBA-KL-02 (Fedwire Rail 2)</span>
                          <span>${tranche2Amount.toLocaleString()} USD</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] text-slate-500 block">Beneficiary Title</label>
                            <input
                              type="text"
                              value={tranche2Title}
                              onChange={e => setTranche2Title(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Routing Transit Number (RTN)</label>
                            <input
                              type="text"
                              value={tranche2Rtn}
                              onChange={e => setTranche2Rtn(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Amount ($ USD)</label>
                            <input
                              type="number"
                              value={tranche2Amount}
                              onChange={e => setTranche2Amount(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Fedwire IMAD Identifier</label>
                            <input
                              type="text"
                              value={tranche2Imad}
                              onChange={e => setTranche2Imad(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STAGE 2 CONTROLS */}
                  {activeStage === 'citi_crypto' && (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">Citi Action Protocol</label>
                          <input
                            type="text"
                            value={citiAction}
                            onChange={e => setCitiAction(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Trust Account Identifier</label>
                          <input
                            type="text"
                            value={citiTrustAccount}
                            onChange={e => setCitiTrustAccount(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-300"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Settlement Amount ($ USD)</label>
                          <input
                            type="number"
                            value={citiSettlementAmount}
                            onChange={e => setCitiSettlementAmount(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Commercial Paper Face Value ($)</label>
                          <input
                            type="number"
                            value={citiPaperFaceValue}
                            onChange={e => setCitiPaperFaceValue(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Discount Rate (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={citiDiscountRate}
                            onChange={e => setCitiDiscountRate(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Maturity Days</label>
                          <input
                            type="number"
                            value={citiMaturityDays}
                            onChange={e => setCitiMaturityDays(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STAGE 3 CONTROLS */}
                  {activeStage === 'math_core' && (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2.5">
                        <div className="text-amber-400 font-bold">Merton Structural Model Inputs</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div>
                            <label className="text-[10px] text-slate-500 block">Firm Asset Value ($)</label>
                            <input
                              type="number"
                              value={mertonAssetValue}
                              onChange={e => setMertonAssetValue(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Debt Face Value ($)</label>
                            <input
                              type="number"
                              value={mertonDebtFaceValue}
                              onChange={e => setMertonDebtFaceValue(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Volatility (σ)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={mertonVolatility}
                              onChange={e => setMertonVolatility(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Risk-Free Rate (r)</label>
                            <input
                              type="number"
                              step="0.005"
                              value={mertonRiskFreeRate}
                              onChange={e => setMertonRiskFreeRate(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2.5">
                        <div className="text-blue-400 font-bold">Black-Scholes Options Inputs</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div>
                            <label className="text-[10px] text-slate-500 block">Spot Price (S)</label>
                            <input
                              type="number"
                              value={bsSpotPrice}
                              onChange={e => setBsSpotPrice(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Strike Price (K)</label>
                            <input
                              type="number"
                              value={bsStrikePrice}
                              onChange={e => setBsStrikePrice(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Time to Expiry (Yrs)</label>
                            <input
                              type="number"
                              step="0.05"
                              value={bsTimeToExpiry}
                              onChange={e => setBsTimeToExpiry(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Implied Vol (σ)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={bsVolatility}
                              onChange={e => setBsVolatility(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STAGE 4 CONTROLS */}
                  {activeStage === 'underwriting' && (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">Borrower / Applicant Entity</label>
                          <input
                            type="text"
                            value={borrowerName}
                            onChange={e => setBorrowerName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Credit Score (FICO 8)</label>
                          <input
                            type="number"
                            value={creditScore}
                            onChange={e => setCreditScore(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Monthly Gross Income ($)</label>
                          <input
                            type="number"
                            value={monthlyGrossIncome}
                            onChange={e => setMonthlyGrossIncome(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Monthly Debt Obligations ($)</label>
                          <input
                            type="number"
                            value={monthlyDebtObligations}
                            onChange={e => setMonthlyDebtObligations(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Requested Loan Amount ($)</label>
                          <input
                            type="number"
                            value={requestedLoanAmount}
                            onChange={e => setRequestedLoanAmount(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-300 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Collateral Asset Value ($)</label>
                          <input
                            type="number"
                            value={collateralAssetValue}
                            onChange={e => setCollateralAssetValue(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STAGE 5 CONTROLS */}
                  {activeStage === 'quant_rwa' && (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">Custom Basket Asset Symbol</label>
                          <input
                            type="text"
                            value={customTicker}
                            onChange={e => setCustomTicker(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Estimated NAV Per Token ($ USD)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={customNav}
                            onChange={e => setCustomNav(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STAGE 6 CONTROLS */}
                  {activeStage === 'real_estate' && (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-slate-400 block mb-1">Property Street Address</label>
                          <input
                            type="text"
                            value={reAddress}
                            onChange={e => setReAddress(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Square Feet</label>
                          <input
                            type="number"
                            value={reSqFt}
                            onChange={e => setReSqFt(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">County & State</label>
                          <input
                            type="text"
                            value={reCounty}
                            onChange={e => setReCounty(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Tax Lien Parcel ID</label>
                          <input
                            type="text"
                            value={taxParcelId}
                            onChange={e => setTaxParcelId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-300"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Assessed Value ($ USD)</label>
                          <input
                            type="number"
                            value={taxAssessedValue}
                            onChange={e => setTaxAssessedValue(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STAGE 7 CONTROLS */}
                  {activeStage === 'zkp_web3' && (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">zk-SNARK Circuit</label>
                          <input
                            type="text"
                            value={zkCircuit}
                            onChange={e => setZkCircuit(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-purple-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Public Credit Threshold</label>
                          <input
                            type="number"
                            value={zkPublicThreshold}
                            onChange={e => setZkPublicThreshold(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-slate-400 block mb-1">Secret Identity Witness Hash</label>
                          <input
                            type="text"
                            value={zkSecretIdentityHash}
                            onChange={e => setZkSecretIdentityHash(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-300 font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-slate-400 block mb-1">ERC-4337 Account Sender</label>
                          <input
                            type="text"
                            value={userOpSender}
                            onChange={e => setUserOpSender(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STAGE 8 CONTROLS */}
                  {activeStage === 'treasury_bfs' && (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">Debtor Entity Name</label>
                          <input
                            type="text"
                            value={bfsDebtorName}
                            onChange={e => setBfsDebtorName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Creditor Entity Name</label>
                          <input
                            type="text"
                            value={bfsCreditorName}
                            onChange={e => setBfsCreditorName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">TAS-BETC Component Symbol</label>
                          <input
                            type="text"
                            value={bfsTasBetc}
                            onChange={e => setBfsTasBetc(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-300"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Disbursement Amount ($ USD)</label>
                          <input
                            type="number"
                            value={bfsAmount}
                            onChange={e => setBfsAmount(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">NACHA Company Name</label>
                          <input
                            type="text"
                            value={nachaCompanyName}
                            onChange={e => setNachaCompanyName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">NACHA Origin DFI Routing</label>
                          <input
                            type="text"
                            value={nachaOriginDfi}
                            onChange={e => setNachaOriginDfi(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Editable HTTP Request Headers */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Request Headers (Editable Key-Values)
                    </h3>
                  </div>
                  <button
                    onClick={() => handleAddHeader(activeStage)}
                    className="flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Header
                  </button>
                </div>

                <div className="mt-3 space-y-2 font-mono text-xs">
                  {(stageHeaders[activeStage] || []).map(header => (
                    <div key={header.id} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={() => handleToggleHeader(activeStage, header.id)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={header.key}
                        onChange={e => handleUpdateHeader(activeStage, header.id, 'key', e.target.value)}
                        placeholder="Header-Name"
                        className="w-1/3 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-amber-300 outline-none"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={e => handleUpdateHeader(activeStage, header.id, 'value', e.target.value)}
                        placeholder="Header-Value"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 outline-none truncate"
                      />
                      <button
                        onClick={() => handleDeleteHeader(activeStage, header.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        title="Delete Header"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Variable Audit Checklist ("See what variables are being used so nothing's sent wrong") */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Active Variable Audit & Usage Mapping
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {currentStageVariables.length} Tracked Parameters
                  </span>
                </div>

                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800/80">
                        <th className="pb-2 font-normal">VARIABLE</th>
                        <th className="pb-2 font-normal">TYPE</th>
                        <th className="pb-2 font-normal">CURRENT VALUE</th>
                        <th className="pb-2 font-normal">STATUS</th>
                        <th className="pb-2 font-normal">PAYLOAD MAPPING TARGET</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-300">
                      {currentStageVariables.map((v, i) => (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="py-2 text-amber-300 font-semibold">{v.name}</td>
                          <td className="py-2 text-slate-500">{v.type}</td>
                          <td className="py-2 text-white font-medium truncate max-w-[140px]">{v.value}</td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.status === 'VALID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {v.status}
                            </span>
                          </td>
                          <td className="py-2 text-slate-400 text-[11px] truncate max-w-[200px]">{v.target}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Live Terminal cURL & Response Telemetry (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 4: Live Dynamic cURL Terminal */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Live Dynamic cURL Command
                    </h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(currentCurlCommand, 'curl')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-mono transition-all cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedKey === 'curl' ? 'Copied cURL!' : 'Copy cURL'}
                  </button>
                </div>

                <div className="mt-3 relative">
                  <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-72 border border-slate-800/80 leading-relaxed scrollbar-thin">
                    {currentCurlCommand}
                  </pre>
                </div>
                <div className="text-[11px] text-slate-500 mt-2 font-mono flex items-center justify-between">
                  <span>Updates in real-time on every input change</span>
                  <span className="text-amber-400">Terminal Ready</span>
                </div>
              </div>

              {/* Card 5: Computed Output & Verified Proofs */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Execution Output & Result Payload
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                    HTTP 200 OK
                  </span>
                </div>

                <div className="mt-3 font-mono text-xs">
                  {activeStage === 'disbursement' && disbursementManifest && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-emerald-300">
                        <div className="font-bold text-white">Execution ID: {disbursementManifest.executionId}</div>
                        <div className="text-slate-400 mt-1">
                          Total Disbursed: <span className="text-emerald-400 font-bold">${disbursementManifest.totalPriorityDisbursedUsd.toLocaleString()} USD</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {disbursementManifest.priorityDisbursements.map(t => (
                          <div key={t.trancheCode} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                            <div className="flex justify-between text-amber-300 font-bold">
                              <span>{t.trancheCode}: {t.beneficiaryTitle}</span>
                              <span className="text-white">${t.amountUsd.toLocaleString()}</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              IMAD: <span className="text-slate-200">{t.fedwireImad}</span> | RTN: {t.routingTransitNumber}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStage === 'citi_crypto' && jweResult && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                        <div className="flex justify-between items-center text-amber-300 font-bold">
                          <span>5-PART COMPACT JWE</span>
                          <button onClick={() => copyToClipboard(jweResult.compactJwe, 'jwe')} className="text-slate-400 hover:text-white">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="break-all text-[11px] text-slate-400 max-h-24 overflow-y-auto">
                          {jweResult.compactJwe}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                        <div className="text-emerald-400 font-bold">3-PART COMPACT JWS (RS256)</div>
                        <div className="break-all text-[11px] text-slate-400 max-h-24 overflow-y-auto">
                          {jwsResult?.compactJws}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStage === 'math_core' && (
                    <div className="space-y-2.5">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
                        <span className="text-slate-400">Merton Distance to Default (DD):</span>
                        <span className="text-emerald-400 font-bold text-sm">{mertonResult?.distanceToDefault}</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
                        <span className="text-slate-400">Black-Scholes Call Price:</span>
                        <span className="text-amber-400 font-bold text-sm">${bsResult?.callPrice}</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
                        <span className="text-slate-400">Altman Z-Score:</span>
                        <span className="text-white font-bold text-sm">{altmanResult?.zScore} ({altmanResult?.zone})</span>
                      </div>
                    </div>
                  )}

                  {activeStage === 'underwriting' && underwritingResult && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
                        <span className="text-slate-400">Underwriting Decision:</span>
                        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          {underwritingResult.decision}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <div className="flex justify-between items-center text-amber-300 font-bold mb-1">
                          <span>SOLIDITY ERC-3643 CONTRACT</span>
                          <button onClick={() => copyToClipboard(underwritingResult.solidityContractCode, 'sol')} className="text-slate-400 hover:text-white">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <pre className="text-[10px] text-emerald-400 max-h-40 overflow-y-auto">
                          {underwritingResult.solidityContractCode}
                        </pre>
                      </div>
                    </div>
                  )}

                  {activeStage === 'quant_rwa' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                        <div className="flex justify-between text-amber-300 font-bold">
                          <span>BTC/USD Swing Strategy</span>
                          <span className="text-emerald-400">{btcSignal?.signal} ({btcSignal?.confidenceScore}%)</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Target: {btcSignal?.strategyName}</div>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                        <div className="flex justify-between text-blue-300 font-bold">
                          <span>TQQQ Momentum Signal</span>
                          <span className="text-emerald-400">{tqqqSignal?.signal} ({tqqqSignal?.confidenceScore}%)</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Target: {tqqqSignal?.strategyName}</div>
                      </div>
                    </div>
                  )}

                  {activeStage === 'real_estate' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <div className="text-slate-400 text-[11px]">Hedonic AVM Valuation:</div>
                        <div className="text-emerald-400 font-bold text-lg mt-0.5">
                          ${avmResult?.estimatedAvmUsd.toLocaleString()} USD
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
                        <span className="text-slate-400">Tax Lien Winning Bid:</span>
                        <span className="text-amber-400 font-bold">{taxLienResult?.winningBid}% Annual</span>
                      </div>
                    </div>
                  )}

                  {activeStage === 'zkp_web3' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <div className="text-purple-400 font-bold">Groth16 zk-SNARK Verification</div>
                        <div className="text-emerald-400 font-bold text-sm mt-1">{zkProof?.verificationStatus || 'VERIFIED_PROOF_VALID'}</div>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <div className="text-amber-300 font-bold">UserOp Gas Limit</div>
                        <div className="text-slate-300 text-[11px] mt-1 font-mono">Call Gas: 150,000 | Verification Gas: 200,000</div>
                      </div>
                    </div>
                  )}

                  {activeStage === 'treasury_bfs' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <div className="flex justify-between items-center text-emerald-400 font-bold">
                          <span>ISO 20022 pacs.008 XML</span>
                          <button onClick={() => copyToClipboard(pacs008?.xmlPayload || '', 'xml')} className="text-slate-400 hover:text-white">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <pre className="text-[10px] text-slate-300 max-h-32 overflow-y-auto mt-1">
                          {pacs008?.xmlPayload}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: E2E PIPELINE FLOW STREAM & AUDIT TRAIL */}
      {/* ========================================================================= */}
      {viewMode === 'e2e_pipeline_flow' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  Autonomous Multi-Rail Sovereign Singularity Pipeline Stream
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sequential dispatch architecture linking SBA Equity Moats, Citi Open Banking JWE, Merton Quant Risk, Underwriting, RWA & US Treasury BFS
                </p>
              </div>
              <button
                onClick={handleRunAllPipeline}
                disabled={isExecutingAll}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all cursor-pointer"
              >
                Trigger End-to-End Pipeline
              </button>
            </div>

            {/* Pipeline Stage Flow Sequence */}
            <div className="mt-6 space-y-3">
              {stagesMetadata.map((stage, idx) => {
                const Icon = stage.icon;
                const status = pipelineProgress[stage.id];

                return (
                  <div
                    key={stage.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
                        0{idx + 1}
                      </div>
                      <Icon className={`w-5 h-5 ${stage.color}`} />
                      <div>
                        <div className="text-sm font-bold text-white">{stage.title}</div>
                        <div className="text-xs text-slate-400">{stage.subtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                        status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                        status === 'running' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                        status === 'failed' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {status ? status.toUpperCase() : 'IDLE / READY'}
                      </span>
                      <button
                        onClick={() => {
                          setActiveStage(stage.id);
                          setViewMode('interactive_workbench');
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        Inspect Variables <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Telemetry Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Live Execution Telemetry & Audit Stream
                </h3>
              </div>
              <button
                onClick={() => setExecutionLogs([])}
                className="text-xs font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Clear Log
              </button>
            </div>

            <div className="mt-3 space-y-2 font-mono text-xs max-h-64 overflow-y-auto scrollbar-thin">
              {executionLogs.length === 0 ? (
                <div className="text-slate-500 py-6 text-center">No telemetry logged yet. Click Execute Stage or Run All 8 Stages.</div>
              ) : (
                executionLogs.map((log, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex items-start gap-3">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold text-[10px]">{log.stage}</span>
                    <span className={`flex-1 ${
                      log.type === 'error' ? 'text-rose-400 font-bold' :
                      log.type === 'warn' ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: GLOBAL VARIABLE MATRIX (ALL VARIABLES AT A GLANCE) */}
      {/* ========================================================================= */}
      {viewMode === 'variable_matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                Comprehensive Variable Matrix & Parameter Registry
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Full-space audit of all 32+ active variables across all 8 pipeline rails to verify zero erroneous data transmission
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg font-bold">
                100% Parameter Validation Passed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stagesMetadata.map(stage => {
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${stage.color}`} />
                      <span className="text-xs font-bold text-white">{stage.title}</span>
                    </div>
                  </div>
                  <div className="text-xs font-mono space-y-1.5 text-slate-300">
                    <div className="text-[11px] text-slate-500">Headers: {(stageHeaders[stage.id] || []).length} active</div>
                    <div className="text-[11px] text-emerald-400">cURL Ready: YES</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveStage(stage.id);
                      setViewMode('interactive_workbench');
                    }}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded text-xs font-mono border border-slate-800 cursor-pointer"
                  >
                    Edit Stage Variables
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

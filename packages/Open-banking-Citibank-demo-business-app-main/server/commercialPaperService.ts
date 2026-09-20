import { CommercialPaperNote } from '../src/types';
import { recordApiCall } from './telemetryService';

let commercialPaperNotes: CommercialPaperNote[] = [
  {
    id: 'cp-note-2026-001',
    cusip: '172967AA3',
    issuer: 'Citibank Demo Business Corp',
    program: 'US$ 500,000,000 Tier-1 4(a)(2) CP Program',
    rating: 'A-1+/P-1',
    faceValue: 5000000,
    issuePrice: 4940000,
    discountRate: 4.80,
    bondEquivalentYield: 4.93,
    issueDate: new Date(Date.now() - 3600000 * 24 * 15).toISOString().split('T')[0],
    maturityDate: new Date(Date.now() + 3600000 * 24 * 75).toISOString().split('T')[0],
    tenorDays: 90,
    currency: 'USD',
    status: 'ACTIVE',
    investorOrDealer: 'BlackRock Cash Management Fund',
    settlementAccount: 'hsbc-cp-escrow-9920',
    notes: 'Direct institutional subscription settled via OBP Treasury Escrow account.',
  },
  {
    id: 'cp-note-2026-002',
    cusip: '172967AB1',
    issuer: 'Citibank Demo Business Corp',
    program: 'US$ 500,000,000 Tier-1 4(a)(2) CP Program',
    rating: 'A-1/P-1',
    faceValue: 2500000,
    issuePrice: 2470000,
    discountRate: 4.85,
    bondEquivalentYield: 4.97,
    issueDate: new Date(Date.now() - 3600000 * 24 * 5).toISOString().split('T')[0],
    maturityDate: new Date(Date.now() + 3600000 * 24 * 25).toISOString().split('T')[0],
    tenorDays: 30,
    currency: 'USD',
    status: 'ACTIVE',
    investorOrDealer: 'Citigroup Global Markets Dealer Desk',
    settlementAccount: 'hsbc-cp-escrow-9920',
    notes: 'Dealer placed tranche with 30-day rollover option.',
  },
  {
    id: 'cp-note-2026-003',
    cusip: '172967AC9',
    issuer: 'Citibank Demo Business Corp',
    program: 'US$ 500,000,000 Tier-1 4(a)(2) CP Program',
    rating: 'Tier-1 Prime',
    faceValue: 10000000,
    issuePrice: 9762500,
    discountRate: 4.75,
    bondEquivalentYield: 4.94,
    issueDate: new Date(Date.now() - 3600000 * 24 * 45).toISOString().split('T')[0],
    maturityDate: new Date(Date.now() + 3600000 * 24 * 135).toISOString().split('T')[0],
    tenorDays: 180,
    currency: 'USD',
    status: 'ACTIVE',
    investorOrDealer: 'Vanguard Treasury Liquidity Reserve',
    settlementAccount: 'rbs-op-acc-7701',
    notes: 'Semi-annual institutional benchmark issuance.',
  },
  {
    id: 'cp-note-2026-004',
    cusip: '172967AD7',
    issuer: 'Citibank Demo Business Corp',
    program: 'US$ 500,000,000 Tier-1 4(a)(2) CP Program',
    rating: 'A-1+/P-1',
    faceValue: 3000000,
    issuePrice: 2976000,
    discountRate: 4.80,
    bondEquivalentYield: 4.91,
    issueDate: new Date(Date.now() - 3600000 * 24 * 58).toISOString().split('T')[0],
    maturityDate: new Date(Date.now() + 3600000 * 24 * 2).toISOString().split('T')[0],
    tenorDays: 60,
    currency: 'USD',
    status: 'MATURING_SOON',
    investorOrDealer: 'Fidelity Institutional Money Market Fund',
    settlementAccount: 'citi-cp-settlement-9920',
    notes: 'Maturing in 48 hours. Auto-redemption scheduled.',
  },
];

export function calculateCommercialPaper(faceValue: number, discountRatePercent: number, tenorDays: number) {
  const startTime = Date.now();
  const d = discountRatePercent / 100;
  const discountAmount = faceValue * (d * (tenorDays / 360));
  const issuePrice = faceValue - discountAmount;
  
  const bey = (365 * d) / (360 - (d * tenorDays)) * 100;
  const mmy = (360 * d) / (360 - (d * tenorDays)) * 100;
  const pricePer1000 = (issuePrice / faceValue) * 1000;

  const result = {
    faceValue,
    discountRatePercent,
    tenorDays,
    issuePrice: Math.round(issuePrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    bondEquivalentYield: Math.round(bey * 100) / 100,
    moneyMarketYield: Math.round(mmy * 100) / 100,
    pricePer1000: Math.round(pricePer1000 * 100) / 100,
  };

  recordApiCall({
    service: 'COMMERCIAL_PAPER',
    method: 'POST',
    url: '/api/commercial-paper/calculate',
    status: 200,
    statusText: 'OK (CP Engine)',
    durationMs: Date.now() - startTime,
    requestBody: { faceValue, discountRatePercent, tenorDays },
    responseBody: result,
    mode: 'INTERNAL_ENGINE',
  });

  return result;
}

export function getCommercialPaperNotes(): CommercialPaperNote[] {
  recordApiCall({
    service: 'COMMERCIAL_PAPER',
    method: 'GET',
    url: '/api/commercial-paper',
    status: 200,
    statusText: 'OK',
    durationMs: 8,
    responseBody: { count: commercialPaperNotes.length, notes: commercialPaperNotes },
    mode: 'INTERNAL_ENGINE',
  });
  return commercialPaperNotes;
}

export function issueCommercialPaper(params: {
  faceValue: number;
  discountRate: number;
  tenorDays: number;
  investorOrDealer: string;
  settlementAccount: string;
  rating?: 'A-1+/P-1' | 'A-1/P-1' | 'A-2/P-2' | 'Tier-1 Prime';
  notes?: string;
}): CommercialPaperNote {
  const startTime = Date.now();
  const calc = calculateCommercialPaper(params.faceValue, params.discountRate, params.tenorDays);
  
  const issueDate = new Date().toISOString().split('T')[0];
  const maturityDate = new Date(Date.now() + params.tenorDays * 24 * 3600000).toISOString().split('T')[0];
  
  const randomChars = Math.random().toString(36).substring(2, 4).toUpperCase();
  const cusip = `172967${randomChars}${Math.floor(Math.random() * 9)}`;

  const newNote: CommercialPaperNote = {
    id: `cp-note-${Date.now()}`,
    cusip,
    issuer: 'Citibank Demo Business Corp',
    program: 'US$ 500,000,000 Tier-1 4(a)(2) CP Program',
    rating: params.rating || 'A-1+/P-1',
    faceValue: params.faceValue,
    issuePrice: calc.issuePrice,
    discountRate: params.discountRate,
    bondEquivalentYield: calc.bondEquivalentYield,
    issueDate,
    maturityDate,
    tenorDays: params.tenorDays,
    currency: 'USD',
    status: 'ACTIVE',
    investorOrDealer: params.investorOrDealer || 'Institutional Money Market Dealer',
    settlementAccount: params.settlementAccount || 'citi-cp-settlement-9920',
    notes: params.notes || 'Newly issued commercial paper tranche under Citibank Commercial Paper facility.',
  };

  commercialPaperNotes.unshift(newNote);

  recordApiCall({
    service: 'COMMERCIAL_PAPER',
    method: 'POST',
    url: '/api/commercial-paper/issue',
    status: 201,
    statusText: 'Created (CP Note Issued)',
    durationMs: Date.now() - startTime,
    requestBody: params,
    responseBody: { success: true, note: newNote },
    mode: 'INTERNAL_ENGINE',
  });

  return newNote;
}

export function redeemCommercialPaper(id: string): { success: boolean; note?: CommercialPaperNote; message: string } {
  const startTime = Date.now();
  const note = commercialPaperNotes.find(n => n.id === id);
  if (!note) {
    recordApiCall({
      service: 'COMMERCIAL_PAPER',
      method: 'POST',
      url: `/api/commercial-paper/${id}/redeem`,
      status: 404,
      statusText: 'Not Found',
      durationMs: Date.now() - startTime,
      responseBody: { error: 'Commercial paper note not found' },
      mode: 'INTERNAL_ENGINE',
      isError: true,
    });
    return { success: false, message: 'Commercial paper note not found.' };
  }

  note.status = 'SETTLED';

  recordApiCall({
    service: 'COMMERCIAL_PAPER',
    method: 'POST',
    url: `/api/commercial-paper/${id}/redeem`,
    status: 200,
    statusText: 'OK (CP Redeemed & Settled)',
    durationMs: Date.now() - startTime,
    responseBody: { success: true, note },
    mode: 'INTERNAL_ENGINE',
  });

  return {
    success: true,
    note,
    message: `Commercial paper note ${note.cusip} (Par $${note.faceValue.toLocaleString()}) successfully redeemed and settled.`,
  };
}

export function rolloverCommercialPaper(id: string, newTenorDays?: number, newRate?: number): {
  success: boolean;
  oldNote?: CommercialPaperNote;
  newNote?: CommercialPaperNote;
  message: string;
} {
  const startTime = Date.now();
  const oldNote = commercialPaperNotes.find(n => n.id === id);
  if (!oldNote) {
    recordApiCall({
      service: 'COMMERCIAL_PAPER',
      method: 'POST',
      url: `/api/commercial-paper/${id}/rollover`,
      status: 404,
      statusText: 'Not Found',
      durationMs: Date.now() - startTime,
      responseBody: { error: 'Note not found' },
      mode: 'INTERNAL_ENGINE',
      isError: true,
    });
    return { success: false, message: 'Note not found.' };
  }

  oldNote.status = 'ROLLED_OVER';

  const tenor = newTenorDays || oldNote.tenorDays;
  const rate = newRate || oldNote.discountRate;

  const newNote = issueCommercialPaper({
    faceValue: oldNote.faceValue,
    discountRate: rate,
    tenorDays: tenor,
    investorOrDealer: oldNote.investorOrDealer,
    settlementAccount: oldNote.settlementAccount,
    rating: oldNote.rating as any,
    notes: `Rollover tranche for predecessor CUSIP ${oldNote.cusip}`,
  });

  recordApiCall({
    service: 'COMMERCIAL_PAPER',
    method: 'POST',
    url: `/api/commercial-paper/${id}/rollover`,
    status: 200,
    statusText: 'OK (CP Rolled Over)',
    durationMs: Date.now() - startTime,
    requestBody: { id, newTenorDays, newRate },
    responseBody: { success: true, oldNote, newNote },
    mode: 'INTERNAL_ENGINE',
  });

  return {
    success: true,
    oldNote,
    newNote,
    message: `Rollover complete: CUSIP ${oldNote.cusip} retired and new CUSIP ${newNote.cusip} issued for ${tenor} days at ${rate}% discount.`,
  };
}

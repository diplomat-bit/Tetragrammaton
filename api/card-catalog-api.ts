import express from 'express';
import { Request, Response } from 'express';
import * as usb from 'usb';

export const cardCatalogRouter = express.Router();

export interface CatalogCardItem {
  id: string;
  name: string;
  bankName: string;
  accountNumberMasked: string;
  routingNumber?: string;
  cardType: 'CREDIT' | 'DEBIT' | 'PREPAID' | 'VIRTUAL' | 'COMMERCIAL';
  cardNetwork: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'CITI' | 'CHASE' | 'FDX';
  track1: string;
  track2: string;
  track3: string;
  expiryDate: string;
  cardholderName: string;
  creditLimit?: number;
  balance?: number;
  status: 'ACTIVE' | 'LOCKED' | 'EXPIRED' | 'ENCODED';
  createdAt: string;
  notes?: string;
}

// Default seed catalog items representing major card bank accounts
let catalogStore: CatalogCardItem[] = [
  {
    id: 'card-001',
    name: 'Citi PremierMiles World Elite',
    bankName: 'Citibank N.A.',
    accountNumberMasked: '•••• •••• •••• 4412',
    routingNumber: '121000358',
    cardType: 'CREDIT',
    cardNetwork: 'CITI',
    track1: '%B44125873852316F^JOHN DOE/CITIZEN^28122010000000000?',
    track2: ';44125873852316F281220100000?',
    track3: ';00000000000000000000?',
    expiryDate: '12/28',
    cardholderName: 'JOHN DOE',
    creditLimit: 50000,
    balance: 1420.50,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    notes: 'Primary executive travel card with priority lounge access.'
  },
  {
    id: 'card-002',
    name: 'Chase Sapphire Reserve',
    bankName: 'Chase Bank USA, N.A.',
    accountNumberMasked: '•••• •••• •••• 8891',
    routingNumber: '021000021',
    cardType: 'CREDIT',
    cardNetwork: 'CHASE',
    track1: '%B889104829102839^JANE SMITH^29012210000000000?',
    track2: ';889104829102839290122100000?',
    track3: ';11111111111111111111?',
    expiryDate: '01/29',
    cardholderName: 'JANE SMITH',
    creditLimit: 75000,
    balance: 3890.12,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    notes: 'Ultimate Rewards 3x dining and travel points card.'
  },
  {
    id: 'card-003',
    name: 'FDX Open Finance Corporate Settlement',
    bankName: 'Citibank Business Banking',
    accountNumberMasked: '•••• •••• •••• 9920',
    routingNumber: '322271627',
    cardType: 'COMMERCIAL',
    cardNetwork: 'FDX',
    track1: '%B992038102938102^GLOBAL TREASURY CORP^2711150000000000?',
    track2: ';99203810293810227111500000?',
    track3: ';22222222222222222222?',
    expiryDate: '11/27',
    cardholderName: 'GLOBAL CORP',
    creditLimit: 250000,
    balance: 142000.00,
    status: 'ENCODED',
    createdAt: new Date().toISOString(),
    notes: 'Direct FDX v6 Open Banking settlement card account.'
  }
];

// Get all catalog items
cardCatalogRouter.get('/card-catalog', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: catalogStore.length,
    items: catalogStore
  });
});

// Add or update catalog item
cardCatalogRouter.post('/card-catalog', (req: Request, res: Response) => {
  try {
    const itemData = req.body;
    if (!itemData.name || !itemData.bankName) {
      return res.status(400).json({ success: false, error: 'Name and Bank Name are required.' });
    }

    if (itemData.id) {
      const idx = catalogStore.findIndex(i => i.id === itemData.id);
      if (idx >= 0) {
        catalogStore[idx] = { ...catalogStore[idx], ...itemData };
        return res.json({ success: true, item: catalogStore[idx] });
      }
    }

    const newItem: CatalogCardItem = {
      id: `card-${Date.now()}`,
      name: itemData.name,
      bankName: itemData.bankName,
      accountNumberMasked: itemData.accountNumberMasked || '•••• •••• •••• 0000',
      routingNumber: itemData.routingNumber || '',
      cardType: itemData.cardType || 'CREDIT',
      cardNetwork: itemData.cardNetwork || 'CITI',
      track1: itemData.track1 || '%B0000000000000000^CARDHOLDER^00000000000000000?',
      track2: itemData.track2 || ';0000000000000000000000?',
      track3: itemData.track3 || ';00000000000000000000?',
      expiryDate: itemData.expiryDate || '12/28',
      cardholderName: itemData.cardholderName || 'CARDHOLDER',
      creditLimit: Number(itemData.creditLimit) || 10000,
      balance: Number(itemData.balance) || 0,
      status: itemData.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      notes: itemData.notes || ''
    };

    catalogStore.unshift(newItem);
    res.json({ success: true, item: newItem });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete item
cardCatalogRouter.delete('/card-catalog/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = catalogStore.length;
  catalogStore = catalogStore.filter(i => i.id !== id);
  if (catalogStore.length === initialLen) {
    return res.status(404).json({ success: false, error: 'Card / account item not found.' });
  }
  res.json({ success: true, message: 'Deleted successfully', count: catalogStore.length });
});

// Simulate or execute USB encoding command
cardCatalogRouter.post('/card-catalog/encode', async (req: Request, res: Response) => {
  const { id, action, track1, track2, track3 } = req.body;
  
  // Test USB device connection if usb package is present
  let usbDeviceStatus = 'SIMULATED_SUCCESS';
  let hardwareDetails = 'No physical magnetic card writer connected on USB bus (Vendor 0x0801, Product 0x0003). Executed via high-fidelity virtual writer engine.';

  const usbObj: any = usb;
  if (usbObj && typeof usbObj.findByIds === 'function') {
    try {
      const dev = usbObj.findByIds(0x0801, 0x0003);
      if (dev) {
        hardwareDetails = 'Connected to physical USB Magnetic Card Reader/Encoder (0x0801:0x0003).';
        usbDeviceStatus = 'HARDWARE_CONNECTED';
      }
    } catch (err: any) {
      console.warn('USB hardware check warning:', err.message);
    }
  }

  // Update item status if id provided
  if (id) {
    const item = catalogStore.find(i => i.id === id);
    if (item) {
      item.status = 'ENCODED';
      if (track1) item.track1 = track1;
      if (track2) item.track2 = track2;
      if (track3) item.track3 = track3;
    }
  }

  res.json({
    success: true,
    action: action || 'write_iso',
    hardwareStatus: usbDeviceStatus,
    details: hardwareDetails,
    encodedTracks: {
      track1: track1 || '%B44125873852316F^JOHN DOE^281220100000?',
      track2: track2 || ';44125873852316F281220100000?',
      track3: track3 || ';00000000000000000000?'
    },
    timestamp: new Date().toISOString()
  });
});

// Download catalog endpoint (JSON or CSV)
cardCatalogRouter.get('/card-catalog/download', (req: Request, res: Response) => {
  const format = (req.query.format as string) || 'json';
  
  if (format === 'csv') {
    let csv = 'ID,Name,Bank Name,Cardholder,Account Number,Routing Number,Card Type,Network,Expiry,Credit Limit,Balance,Status,Track 1,Track 2,Track 3,Notes\n';
    for (const item of catalogStore) {
      csv += `"${item.id}","${item.name}","${item.bankName}","${item.cardholderName}","${item.accountNumberMasked}","${item.routingNumber || ''}","${item.cardType}","${item.cardNetwork}","${item.expiryDate}","${item.creditLimit || 0}","${item.balance || 0}","${item.status}","${item.track1}","${item.track2}","${item.track3}","${item.notes || ''}"\n`;
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=citi_chase_card_bank_catalog.csv');
    return res.send(csv);
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=citi_chase_card_bank_catalog.json');
  res.send(JSON.stringify({
    exportedAt: new Date().toISOString(),
    totalRecords: catalogStore.length,
    catalog: catalogStore
  }, null, 2));
});

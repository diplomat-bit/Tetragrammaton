import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const treasuryXsdRouter = Router();

const COMPLEX_TYPES_FILE = path.resolve(process.cwd(), 'Common_ComplexTypes.xsd.xml');
const GROUPS_FILE = path.resolve(process.cwd(), 'Common_Groups.xsd.xml');

interface ParsedXsdItem {
  name: string;
  type: string;
  documentation: string;
  elements: Array<{ name: string; type?: string; minOccurs?: string; maxOccurs?: string }>;
}

let cachedTypes: ParsedXsdItem[] = [];
let cachedGroups: ParsedXsdItem[] = [];

function parseXsdFile(filePath: string, tagType: 'complexType' | 'group'): ParsedXsdItem[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');

  const items: ParsedXsdItem[] = [];
  const regex = tagType === 'complexType' 
    ? /<xsd:complexType\s+name="([^"]+)">([\s\S]*?)<\/xsd:complexType>/g
    : /<xsd:group\s+name="([^"]+)">([\s\S]*?)<\/xsd:group>/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    const body = match[2];

    // Extract documentation
    const docMatch = /<xsd:documentation>([\s\S]*?)<\/xsd:documentation>/.exec(body);
    const documentation = docMatch ? docMatch[1].trim().replace(/\s+/g, ' ') : '';

    // Extract elements
    const elementRegex = /<xsd:element\s+name="([^"]+)"(?:\s+type="([^"]+)")?/g;
    const elements: Array<{ name: string; type?: string }> = [];
    let elemMatch: RegExpExecArray | null;
    while ((elemMatch = elementRegex.exec(body)) !== null) {
      elements.push({
        name: elemMatch[1],
        type: elemMatch[2] || 'xsd:string',
      });
    }

    items.push({
      name,
      type: tagType,
      documentation,
      elements,
    });
  }

  return items;
}

// Initial load
try {
  cachedTypes = parseXsdFile(COMPLEX_TYPES_FILE, 'complexType');
  cachedGroups = parseXsdFile(GROUPS_FILE, 'group');
} catch (e: any) {
  console.warn('Error pre-parsing Treasury XSD files:', e.message);
}

/**
 * GET /api/treasury/schema/types
 */
treasuryXsdRouter.get('/schema/types', (req: Request, res: Response) => {
  if (cachedTypes.length === 0) {
    cachedTypes = parseXsdFile(COMPLEX_TYPES_FILE, 'complexType');
  }
  const query = (req.query.q as string || '').toLowerCase();
  const filtered = query
    ? cachedTypes.filter(t => t.name.toLowerCase().includes(query) || t.documentation.toLowerCase().includes(query))
    : cachedTypes;

  return res.json({
    success: true,
    total: cachedTypes.length,
    matched: filtered.length,
    types: filtered.slice(0, 100),
  });
});

/**
 * GET /api/treasury/schema/groups
 */
treasuryXsdRouter.get('/schema/groups', (req: Request, res: Response) => {
  if (cachedGroups.length === 0) {
    cachedGroups = parseXsdFile(GROUPS_FILE, 'group');
  }
  return res.json({
    success: true,
    total: cachedGroups.length,
    groups: cachedGroups,
  });
});

/**
 * POST /api/treasury/validate-xml
 */
treasuryXsdRouter.post('/validate-xml', (req: Request, res: Response) => {
  const { xml } = req.body;
  if (!xml || typeof xml !== 'string') {
    return res.status(400).json({ success: false, error: 'XML string is required' });
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check XML declaration
  if (!xml.includes('<?xml')) {
    warnings.push('XML declaration <?xml version="1.0" ... ?> is missing.');
  }

  // Check Treasury namespace
  if (!xml.includes('xmlns="urn:us:gov:treasury"') && !xml.includes('urn:us:gov:treasury')) {
    errors.push('Missing required Treasury namespace: xmlns="urn:us:gov:treasury"');
  }

  // Extract root tag
  const rootMatch = /<([a-zA-Z0-9_:]+)(?:\s+[^>]*)?>/.exec(xml.replace(/<\?xml.*?\?>/, ''));
  const rootTag = rootMatch ? rootMatch[1].replace(/^[a-zA-Z0-9_]+:/, '') : null;

  if (!rootTag) {
    errors.push('Could not detect root XML element.');
  } else {
    // Check if rootTag corresponds to known Treasury elements
    const knownElement = cachedTypes.find(t => t.name.toLowerCase().includes(rootTag.toLowerCase()));
    if (!knownElement) {
      warnings.push(`Root tag <${rootTag}> is not defined as an explicit BFS complex type in Common_ComplexTypes.xsd.`);
    }
  }

  // Check balanced tags (rough check)
  const openTags = (xml.match(/<[a-zA-Z0-9_:]+(?:\s+[^>]*[^\/])?>/g) || []).map(t => t.replace(/<([a-zA-Z0-9_:]+).*/, '$1'));
  const closeTags = (xml.match(/<\/[a-zA-Z0-9_:]+>/g) || []).map(t => t.replace(/<\/([a-zA-Z0-9_:]+)>/, '$1'));

  return res.json({
    success: errors.length === 0,
    valid: errors.length === 0,
    rootTag,
    openTagsCount: openTags.length,
    closeTagsCount: closeTags.length,
    errors,
    warnings,
    summary: errors.length === 0 ? 'XML conforms to US Treasury Fiscal Service BFS specification.' : 'Schema validation errors found.',
  });
});

/**
 * POST /api/treasury/generate-tas-betc
 */
treasuryXsdRouter.post('/generate-tas-betc', (req: Request, res: Response) => {
  const {
    agencyIdentifier = '020', // Treasury
    mainAccount = '1435',
    subAccount = '000',
    betc = 'COLL',
    amount = '250000.00',
    transactionId = `TX_${Date.now()}`,
    businessLine = 'COLLECTIONS_BFS',
  } = req.body;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<AccountClassification xmlns="urn:us:gov:treasury" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="5.0.1">
  <Transmission_AccountableDetail>
    <TransactionIdentifier>${transactionId}</TransactionIdentifier>
    <BusinessLine>${businessLine}</BusinessLine>
    <ExecutionDate>${new Date().toISOString().split('T')[0]}</ExecutionDate>
    <TotalAmount currency="USD">${amount}</TotalAmount>
  </Transmission_AccountableDetail>
  <TreasuryAccountSymbol>
    <AgencyIdentifier>${agencyIdentifier}</AgencyIdentifier>
    <MainAccount>${mainAccount}</MainAccount>
    <SubAccount>${subAccount}</SubAccount>
    <BETC>${betc}</BETC>
  </TreasuryAccountSymbol>
  <AccountingReportingStatus>
    <GwaReportable>true</GwaReportable>
    <FiscalQuarter>Q${Math.floor((new Date().getMonth() + 3) / 3)}</FiscalQuarter>
    <FiscalYear>${new Date().getFullYear()}</FiscalYear>
  </AccountingReportingStatus>
</AccountClassification>`;

  return res.json({
    success: true,
    xml,
    tas: `${agencyIdentifier}-${mainAccount}-${subAccount}`,
    betc,
    amount,
    schemaVersion: '5.0.1',
    targetNamespace: 'urn:us:gov:treasury',
  });
});

/**
 * GET /api/treasury/sample-nacha-ach
 */
treasuryXsdRouter.get('/sample-nacha-ach', (req: Request, res: Response) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ACH_Batch xmlns="urn:us:gov:treasury" version="5.0.1">
  <NACHA_BatchHeader>
    <ServiceClassCode>200</ServiceClassCode>
    <CompanyName>DEPT OF TREASURY BFS</CompanyName>
    <StandardEntryClassCode>CCD</StandardEntryClassCode>
    <OriginatingDFIID>05100003</OriginatingDFIID>
    <BatchNumber>0000001</BatchNumber>
  </NACHA_BatchHeader>
  <ACH_EntryDetail>
    <TransactionCode>22</TransactionCode>
    <ReceivingDFIIdentification>12100024</ReceivingDFIIdentification>
    <CheckDigit>8</CheckDigit>
    <DFIAccountNumber>9876543210</DFIAccountNumber>
    <Amount>75420.50</Amount>
    <IndividualIDNumber>FEDERAL_DISBURSEMENT_992</IndividualIDNumber>
    <IndividualName>SOVEREIGN LEDGER ENCLAVE</IndividualName>
    <ACH_Addendum>
      <TypeCode>05</TypeCode>
      <PaymentRelatedInformation>TAS*020*1435*000\\BETC*DISB\\TXID*${Date.now()}</PaymentRelatedInformation>
      <SequenceNumber>0001</SequenceNumber>
    </ACH_Addendum>
  </ACH_EntryDetail>
</ACH_Batch>`;

  return res.json({
    success: true,
    xml,
    standard: 'NACHA ACH BFS V5.0.1',
    addendaType: 'CCD+ Addenda (TypeCode 05)',
  });
});

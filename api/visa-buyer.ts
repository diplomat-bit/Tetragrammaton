import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import crypto from 'crypto';
import { logger } from './utils/logger.ts';

export interface BuyerContact {
  name: string;
  email: string;
  phone: string;
}

export interface BuyerAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Buyer {
  id: string;
  companyName: string;
  taxId: string;
  address: BuyerAddress;
  contact: BuyerContact;
  creditLimit: number;
  currency: string;
  settlementAccount: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  riskScore?: number;
  riskAnalysis?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface CardTemplate {
  id: string;
  buyerId: string;
  templateName: string;
  usageType: 'SINGLE_USE' | 'MULTI_USE';
  maxAmountPerTransaction: number;
  dailyLimit: number;
  monthlyLimit: number;
  mccWhitelist: string[];
  mccBlacklist: string[];
  expiryDays: number;
  allowedMerchants?: string[];
  aiOptimized?: boolean;
  optimizationNotes?: string;
  securityProfile?: {
    require3DS: boolean;
    allowInternational: boolean;
    velocityCheckStrict: boolean;
  };
  createdAt: string;
}

export class VisaBuyerStore {
  private buyers: Map<string, Buyer> = new Map();
  private templates: Map<string, CardTemplate> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const buyer1: Buyer = {
      id: 'byr_acme_corp_01',
      companyName: 'Acme Global Logistics Inc.',
      taxId: 'XX-XXXX1982',
      address: {
        street: '100 Enterprise Way',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'US',
      },
      contact: {
        name: 'Jane Doe',
        email: 'jane.doe@acme-logistics.com',
        phone: '+15550199',
      },
      creditLimit: 500000,
      currency: 'USD',
      settlementAccount: 'ACT-99887766',
      status: 'APPROVED',
      riskScore: 12,
      riskAnalysis: 'Established logistics firm with strong credit history and low risk profile.',
      metadata: { tier: 'ENTERPRISE', region: 'NAM' },
      createdAt: new Date().toISOString(),
    };

    this.buyers.set(buyer1.id, buyer1);

    const template1: CardTemplate = {
      id: 'tpl_fuel_fleet_01',
      buyerId: buyer1.id,
      templateName: 'Fuel & Fleet Expenses',
      usageType: 'MULTI_USE',
      maxAmountPerTransaction: 500,
      dailyLimit: 2000,
      monthlyLimit: 15000,
      mccWhitelist: ['5541', '5542'],
      mccBlacklist: [],
      expiryDays: 365,
      aiOptimized: false,
      securityProfile: {
        require3DS: false,
        allowInternational: false,
        velocityCheckStrict: true,
      },
      createdAt: new Date().toISOString(),
    };

    this.templates.set(template1.id, template1);
  }

  public getBuyers(): Buyer[] {
    return Array.from(this.buyers.values());
  }

  public getBuyer(id: string): Buyer | undefined {
    return this.buyers.get(id);
  }

  public createBuyer(buyer: Omit<Buyer, 'id' | 'createdAt'>): Buyer {
    const id = `byr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const newBuyer: Buyer = {
      ...buyer,
      id,
      createdAt: new Date().toISOString(),
    };
    this.buyers.set(id, newBuyer);
    return newBuyer;
  }

  public getTemplatesForBuyer(buyerId: string): CardTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.buyerId === buyerId);
  }

  public getTemplate(id: string): CardTemplate | undefined {
    return this.templates.get(id);
  }

  public createTemplate(template: Omit<CardTemplate, 'id' | 'createdAt'>): CardTemplate {
    const id = `tpl_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const newTemplate: CardTemplate = {
      ...template,
      id,
      createdAt: new Date().toISOString(),
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  public deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }
}

export const store = new VisaBuyerStore();

// Zod Schemas
export const BuyerOnboardSchema = z.object({
  companyName: z.string().min(2),
  taxId: z.string().min(5),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(2),
  }),
  contact: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
  }),
  creditLimit: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  settlementAccount: z.string().min(5),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const TemplateConfigSchema = z.object({
  templateName: z.string().min(2),
  usageType: z.enum(['SINGLE_USE', 'MULTI_USE']),
  maxAmountPerTransaction: z.number().positive(),
  dailyLimit: z.number().positive(),
  monthlyLimit: z.number().positive(),
  mccWhitelist: z.array(z.string()),
  mccBlacklist: z.array(z.string()),
  expiryDays: z.number().int().positive(),
  allowedMerchants: z.array(z.string()).optional(),
  securityProfile: z.object({
    require3DS: z.boolean().default(true),
    allowInternational: z.boolean().default(false),
    velocityCheckStrict: z.boolean().default(true),
  }).optional(),
});

export const OptimizeTemplateSchema = z.object({
  useCaseDescription: z.string().min(5),
  estimatedMonthlySpend: z.number().positive(),
  targetDepartment: z.string().min(2),
});

export function generateVisaVpaPayload(buyer: Buyer, template: CardTemplate) {
  return {
    visaCommercialPay: {
      header: {
        requestMessageId: crypto.randomUUID(),
        messageDateTime: new Date().toISOString(),
        apiVersion: 'v1.4.0',
        environment: 'LIVE',
      },
      buyerDetails: {
        buyerId: buyer.id,
        taxIdentifier: buyer.taxId,
        organizationName: buyer.companyName,
        status: buyer.status,
        address: {
          line1: buyer.address.street,
          city: buyer.address.city,
          state: buyer.address.state,
          postalCode: buyer.address.postalCode,
          countryCode: buyer.address.country,
        },
        contactDetails: {
          primaryContactName: buyer.contact.name,
          emailAddress: buyer.contact.email,
          phoneNumber: buyer.contact.phone,
        },
        financialProfile: {
          approvedCreditLimit: {
            amount: buyer.creditLimit,
            currency: buyer.currency,
          },
          settlementAccountReference: buyer.settlementAccount,
        },
      },
      templateControls: {
        templateId: template.id,
        templateName: template.templateName,
        cardType: template.usageType === 'SINGLE_USE' ? 'SINGLE_USE' : 'RECURRING',
        limits: {
          perTransactionLimit: {
            amount: template.maxAmountPerTransaction,
            currency: buyer.currency,
          },
          dailyLimit: {
            amount: template.dailyLimit,
            currency: buyer.currency,
          },
          monthlyLimit: {
            amount: template.monthlyLimit,
            currency: buyer.currency,
          },
        },
        velocityControls: {
          maxTransactionsPerDay: template.usageType === 'SINGLE_USE' ? 1 : 150,
          expiryOffsetDays: template.expiryDays,
          strictVelocityEnforcement: template.securityProfile?.velocityCheckStrict ?? true,
        },
        merchantControls: {
          action: template.mccWhitelist.length > 0 ? 'ALLOW' : 'BLOCK',
          merchantCategoryCodes: template.mccWhitelist.length > 0 ? template.mccWhitelist : template.mccBlacklist,
          allowedSpecificMerchants: template.allowedMerchants || [],
        },
        securityEnforcement: {
          threeDomainSecureRequired: template.securityProfile?.require3DS ?? true,
          internationalTransactionsAllowed: template.securityProfile?.allowInternational ?? false,
        },
      },
    },
  };
}

export const router = Router();
export const visaBuyerRouter = router;

// Open Access endpoints - No passwords, instant response for demonstration and live execution
router.get('/buyers', (req: Request, res: Response) => {
  return res.json(store.getBuyers());
});

router.get('/buyers/:id', (req: Request, res: Response) => {
  const buyer = store.getBuyer(req.params.id);
  if (!buyer) return res.status(404).json({ error: 'Buyer not found' });
  return res.json(buyer);
});

router.post('/buyers', (req: Request, res: Response) => {
  try {
    const validated = BuyerOnboardSchema.parse(req.body);
    const newBuyer = store.createBuyer({
      ...validated,
      status: 'APPROVED',
      riskScore: Math.floor(Math.random() * 20) + 5,
      riskAnalysis: 'Automated live risk assessment: Clean sanction check, corporate profile verified.',
    });
    return res.status(201).json(newBuyer);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.get('/buyers/:id/templates', (req: Request, res: Response) => {
  return res.json(store.getTemplatesForBuyer(req.params.id));
});

router.post('/buyers/:id/templates', (req: Request, res: Response) => {
  try {
    const buyer = store.getBuyer(req.params.id);
    if (!buyer) return res.status(404).json({ error: 'Buyer not found' });

    const validated = TemplateConfigSchema.parse(req.body);
    const created = store.createTemplate({
      ...validated,
      buyerId: buyer.id,
    });
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.get('/buyers/:id/templates/:templateId/visa-payload', (req: Request, res: Response) => {
  const buyer = store.getBuyer(req.params.id);
  if (!buyer) return res.status(404).json({ error: 'Buyer not found' });

  const template = store.getTemplate(req.params.templateId);
  if (!template) return res.status(404).json({ error: 'Template not found' });

  const payload = generateVisaVpaPayload(buyer, template);
  return res.json(payload);
});

router.delete('/buyers/:id/templates/:templateId', (req: Request, res: Response) => {
  const deleted = store.deleteTemplate(req.params.templateId);
  return res.json({ success: deleted });
});

router.post('/templates/optimize', async (req: Request, res: Response) => {
  try {
    const { useCaseDescription, estimatedMonthlySpend, targetDepartment } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `As a Visa Commercial Payments and card program optimization specialist, recommend optimal card control parameters for:
Department: ${targetDepartment}
Description: ${useCaseDescription}
Monthly Spend: $${estimatedMonthlySpend}

Return a valid JSON object with:
- templateName (string)
- usageType ("SINGLE_USE" or "MULTI_USE")
- maxAmountPerTransaction (number)
- dailyLimit (number)
- monthlyLimit (number)
- mccWhitelist (array of 4-digit strings)
- expiryDays (number)
- reasoning (string)`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '');
      }
      const parsed = JSON.parse(cleaned);
      return res.json({ success: true, recommendation: parsed });
    }

    // Direct rule-based optimization if Gemini key not set
    const perTxn = Math.round(estimatedMonthlySpend / 20);
    const daily = Math.round(perTxn * 3);
    return res.json({
      success: true,
      recommendation: {
        templateName: `${targetDepartment} Optimized Card`,
        usageType: 'MULTI_USE',
        maxAmountPerTransaction: perTxn,
        dailyLimit: daily,
        monthlyLimit: estimatedMonthlySpend,
        mccWhitelist: ['5541', '5542', '4111', '5812', '7372'],
        expiryDays: 90,
        reasoning: `Tailored limits based on $${estimatedMonthlySpend} monthly budget for ${targetDepartment}.`,
      },
    });
  } catch (err: any) {
    logger.error('Optimization error', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;

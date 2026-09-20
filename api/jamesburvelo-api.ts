import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const jamesburveloRouter = express.Router();

const PKG_DIR = path.resolve(process.cwd(), 'packages', 'jamesburvelocallaghaniiiand');

// 1. Ecosystem Status & Health
jamesburveloRouter.get('/status', (req: Request, res: Response) => {
  const exists = fs.existsSync(PKG_DIR);
  res.json({
    success: true,
    ecosystem: "James Burvelo O'Callaghan III - DonOne AI Banking Consortium & Aether Financial Ecosystem",
    status: exists ? 'DEPLOYED_AND_ACTIVE' : 'STANDBY',
    packagePath: 'packages/jamesburvelocallaghaniiiand',
    timestamp: new Date().toISOString(),
    metrics: {
      omnigridAppsCount: 75,
      componentsCount: 216,
      subpackagesCount: 21,
      financialModelsCount: 14,
      iso20022CodeSets: 60,
    }
  });
});

// 2. 75-Application OmniGrid Manifest
jamesburveloRouter.get('/manifest', (req: Request, res: Response) => {
  try {
    const manifestPath = path.join(PKG_DIR, 'ecosystem', 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      return res.json({ success: true, ...data });
    }

    // Fallback if file not read directly
    res.json({
      success: true,
      ecosystem: {
        name: "OmniGrid AI Suite",
        version: "1.0.0",
        description: "A tightly integrated ecosystem of 75 production-grade AI applications sharing a common protocol layer.",
        core_sdk: "omnigrid-core-v1"
      },
      applications: []
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Architecture & Primitives from AETHER_FINANCIAL_ECOSYSTEM_MANIFEST.md
jamesburveloRouter.get('/architecture', (req: Request, res: Response) => {
  try {
    const manifestPath = path.join(PKG_DIR, 'AETHER_FINANCIAL_ECOSYSTEM_MANIFEST.md');
    let content = '';
    if (fs.existsSync(manifestPath)) {
      content = fs.readFileSync(manifestPath, 'utf8');
    }

    res.json({
      success: true,
      version: '1.0.0-alpha',
      compliance: 'SOC2 Type II / HIPAA / GDPR Ready',
      architecture: 'Distributed Micro-Service Mesh',
      primitives: [
        { name: 'AetherAuth', standard: 'OAuth2 / OIDC Capability-Based Security', description: 'Granular resource access (inference:read, budget:write, agent:invoke) with Azure AD, Okta, and Google Workspace SSO federation.' },
        { name: 'AetherBus', standard: 'NATS JetStream / gRPC CloudEvents v1.0', description: 'Hierarchical topic messaging (domain.function.action) with at-least-once delivery and dead-letter queues.' },
        { name: 'AetherLink', standard: 'Universal AI Adapter', description: 'Unified interface abstracting top 100 vendor APIs with dynamic circuit breakers and failover routing.' },
        { name: 'AetherVault', standard: 'Zero-Knowledge Credential Store', description: 'Hardware-anchored enclave securing vendor API keys, private ledgers, and institutional signing credentials.' },
      ],
      markdown: content
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. ISO 20022 External Codes Dictionary
jamesburveloRouter.get('/iso20022', (req: Request, res: Response) => {
  try {
    const isoPath = path.join(PKG_DIR, 'iso20022.ts');
    let codeGroups: Record<string, string[]> = {};

    if (fs.existsSync(isoPath)) {
      const content = fs.readFileSync(isoPath, 'utf8');
      const regex = /export type (\w+)\s*=\s*([^;]+);/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const typeName = match[1];
        const values = match[2]
          .split('|')
          .map((v) => v.trim().replace(/['"]/g, ''))
          .filter(Boolean);
        codeGroups[typeName] = values;
      }
    }

    res.json({
      success: true,
      totalCodeSets: Object.keys(codeGroups).length,
      categories: [
        'Account Identification',
        'Agent Instruction',
        'Agreement Types',
        'Clearing Systems',
        'Corporate Action Events',
        'Bank Transaction Domains',
        'Document Purposes',
        'Cheque Status Codes'
      ],
      codeSets: codeGroups
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. 14 Financial Data Models
jamesburveloRouter.get('/models', (req: Request, res: Response) => {
  try {
    const modelsDir = path.join(PKG_DIR, 'models');
    const models: any[] = [];

    if (fs.existsSync(modelsDir)) {
      const files = fs.readdirSync(modelsDir).filter((f) => f.endsWith('.ts'));
      files.forEach((f) => {
        const content = fs.readFileSync(path.join(modelsDir, f), 'utf8');
        const nameMatch = f.replace('.ts', '');
        const interfaceMatches = content.match(/export (?:interface|type|class) (\w+)/g) || [];
        models.push({
          fileName: f,
          modelName: nameMatch,
          exports: interfaceMatches.map((m) => m.replace(/export (?:interface|type|class) /, '')),
          sizeBytes: content.length,
        });
      });
    }

    res.json({
      success: true,
      count: models.length,
      models,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Bonds Directory & Market Data
const SAMPLE_BONDS = [
  { isin: 'US912828ZG62', name: 'US Treasury 4.250% 2034', issuer: 'United States Treasury', coupon: 4.25, maturityDate: '2034-08-15', rating: 'AA+', price: 99.42, yield: 4.32, currency: 'USD', duration: 7.8 },
  { isin: 'US06051GFB05', name: 'Bank of America 5.288% 2034', issuer: 'Bank of America Corp', coupon: 5.288, maturityDate: '2034-04-25', rating: 'A-', price: 101.15, yield: 5.12, currency: 'USD', duration: 7.2 },
  { isin: 'US46647PBT48', name: 'JPMorgan Chase 4.850% 2030', issuer: 'JPMorgan Chase & Co', coupon: 4.85, maturityDate: '2030-02-01', rating: 'A+', price: 100.80, yield: 4.68, currency: 'USD', duration: 4.9 },
  { isin: 'US172967MU83', name: 'Citigroup Inc 4.412% 2031', issuer: 'Citigroup Inc', coupon: 4.412, maturityDate: '2031-03-31', rating: 'A', price: 98.90, yield: 4.62, currency: 'USD', duration: 5.6 },
  { isin: 'US025816CQ63', name: 'American Express 4.900% 2033', issuer: 'American Express Co', coupon: 4.90, maturityDate: '2033-05-03', rating: 'A', price: 100.25, yield: 4.86, currency: 'USD', duration: 6.8 },
];

jamesburveloRouter.get('/bonds', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: SAMPLE_BONDS.length,
    bonds: SAMPLE_BONDS,
  });
});

// 7. Interest Rate Macro Simulation Engine
jamesburveloRouter.post('/simulations/interest-rate', (req: Request, res: Response) => {
  try {
    const { changeBasisPoints = 25, portfolioValue = 10000000 } = req.body;
    const deltaYield = changeBasisPoints / 10000; // e.g. +0.0025 for +25 bps

    const simulationResults = SAMPLE_BONDS.map((b) => {
      // Modified Duration formula: ΔP/P ≈ -D * Δy
      const priceDeltaPct = -b.duration * deltaYield;
      const newPrice = +(b.price * (1 + priceDeltaPct)).toFixed(3);
      const newYield = +(b.yield + changeBasisPoints / 100).toFixed(3);
      const allocation = portfolioValue / SAMPLE_BONDS.length;
      const pnl = Math.round(allocation * priceDeltaPct);

      return {
        isin: b.isin,
        name: b.name,
        originalPrice: b.price,
        simulatedPrice: newPrice,
        priceChangePct: +(priceDeltaPct * 100).toFixed(2),
        originalYield: b.yield,
        simulatedYield: newYield,
        duration: b.duration,
        estimatedPnL: pnl,
      };
    });

    const totalPnL = simulationResults.reduce((acc, curr) => acc + curr.estimatedPnL, 0);

    res.json({
      success: true,
      simulation: {
        changeBasisPoints,
        appliedDate: new Date().toISOString().split('T')[0],
        totalPortfolioValue: portfolioValue,
        aggregatePnL: totalPnL,
        aggregateReturnPct: +((totalPnL / portfolioValue) * 100).toFixed(2),
        riskAssessment: changeBasisPoints > 50 ? 'HIGH_DURATION_RISK' : 'MODERATE_SENSITIVITY',
        bonds: simulationResults,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. 216 UI Components Catalog
jamesburveloRouter.get('/components', (req: Request, res: Response) => {
  try {
    const compDir = path.join(PKG_DIR, 'components');
    const components: string[] = [];
    if (fs.existsSync(compDir)) {
      const files = fs.readdirSync(compDir);
      files.forEach((f) => {
        if (f.endsWith('.tsx') || f.endsWith('.ts')) {
          components.push(f.replace(/\.tsx?$/, ''));
        }
      });
    }

    res.json({
      success: true,
      count: components.length,
      components,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Monorepo Subpackages
jamesburveloRouter.get('/subpackages', (req: Request, res: Response) => {
  try {
    const subpackagesDir = path.join(PKG_DIR, 'packages');
    const packages: any[] = [];

    if (fs.existsSync(subpackagesDir)) {
      const entries = fs.readdirSync(subpackagesDir);
      entries.forEach((e) => {
        const full = path.join(subpackagesDir, e);
        if (fs.statSync(full).isDirectory()) {
          const pkgJson = path.join(full, 'package.json');
          let pkgMeta: any = {};
          if (fs.existsSync(pkgJson)) {
            try {
              pkgMeta = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
            } catch (err) {}
          }
          packages.push({
            name: pkgMeta.name || e,
            folder: e,
            version: pkgMeta.version || '1.0.0',
            description: pkgMeta.description || `Subpackage ${e}`,
            hasSrc: fs.existsSync(path.join(full, 'src')),
          });
        }
      });
    }

    res.json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

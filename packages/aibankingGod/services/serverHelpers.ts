import dotenv from "dotenv";
dotenv.config();
import express from "express";
import type { Request, Response } from "express";
import path from "path";
import fs from "fs";
import https from "https";
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { GoogleGenAI } from "@google/genai";
import { Octokit } from "octokit";
import ModernTreasury from 'modern-treasury';
import Stripe from 'stripe';
import * as AlpacaModule from '@alpacahq/alpaca-trade-api';

const Alpaca = (AlpacaModule as any).default || AlpacaModule;

export const SECRETS_FILE = path.join(process.cwd(), "secrets.json");

export const loadSecrets = (): Record<string, any> => {
  if (fs.existsSync(SECRETS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SECRETS_FILE, "utf-8"));
    } catch (e) {
      console.error("Error parsing secrets file:", e);
      return {};
    }
  }
  return {};
};

export const saveSecrets = (secrets: any) => {
  fs.writeFileSync(SECRETS_FILE, JSON.stringify(secrets, null, 2));
};

// Initialize secrets if file doesn't exist
try {
  if (!fs.existsSync(SECRETS_FILE)) {
    saveSecrets({});
  }
} catch (e) {
  console.error("Error initializing secrets file:", e);
}

let alpacaInstance: any = null;
export const getAlpaca = () => {
  if (!alpacaInstance) {
    const secrets = loadSecrets();
    alpacaInstance = new Alpaca({
      keyId: process.env.ALPACA_API_KEY || secrets.ALPACA_API_KEY || 'dummy_key',
      secretKey: process.env.ALPACA_API_SECRET || secrets.ALPACA_API_SECRET || 'dummy_secret',
      paper: true,
      usePolygon: false
    });
  }
  return alpacaInstance;
};

export const getMTClient = () => {
  const secrets = loadSecrets();
  const organizationID = process.env.MODERN_TREASURY_ORGANIZATION_ID || secrets.MODERN_TREASURY_ORGANIZATION_ID;
  const apiKey = process.env.MODERN_TREASURY_API_KEY || secrets.MODERN_TREASURY_API_KEY;
  if (!organizationID || !apiKey) {
    return null;
  }
  return new ModernTreasury({ organizationID, apiKey });
};

let octokitInstance: Octokit | null = null;
export const getOctokit = () => {
  if (!octokitInstance) {
    const token = process.env.GITHUB_ACCESS_TOKEN;
    if (!token) {
      throw new Error("GITHUB_ACCESS_TOKEN is required for Sovereign Audit Logs");
    }
    octokitInstance = new Octokit({ auth: token });
  }
  return octokitInstance;
};

export class GitHubAuditLogger {
  private repoName = process.env.GITHUB_AUDIT_REPO || "aquarius-sovereign-audit-logs";
  private owner: string | null = null;
  private isInitializing = false;
  private hasFailedPermanently = false;

  async init() {
    if (this.owner || this.isInitializing || this.hasFailedPermanently) return;
    this.isInitializing = true;
    try {
      const octokit = getOctokit();
      const user = await octokit.rest.users.getAuthenticated();
      this.owner = user.data.login;

      try {
        await octokit.rest.repos.get({ owner: this.owner, repo: this.repoName });
      } catch (e: any) {
        if (e.status === 404) {
          console.log(`[AUDIT] Creating private audit log repository: ${this.repoName}`);
          try {
            await octokit.rest.repos.createForAuthenticatedUser({
              name: this.repoName,
              private: true,
              description: "Aquarius Sovereign Singularity - Cryptographic Audit Logs",
            });
            await new Promise(r => setTimeout(r, 2000));
            await octokit.rest.repos.createOrUpdateFileContents({
              owner: this.owner,
              repo: this.repoName,
              path: "README.md",
              message: "Initialize Audit Vault @ sovereign-singularity",
              content: Buffer.from("# Aquarius Audit Vault\nSecure telemetry storage for the Sovereign OS.").toString("base64"),
            });
          } catch (createErr: any) {
            console.error(`[AUDIT] WARNING: GITHUB_ACCESS_TOKEN lacks permission to create repo '${this.repoName}'. Disabling GitHub audit logging.`);
            this.hasFailedPermanently = true;
            throw createErr;
          }
        } else {
          throw e;
        }
      }
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      if (err.status === 401 || msg.includes("Bad credentials")) {
        console.log("[AUDIT] GitHub Audit Logger fallback: In-memory session logging enabled (GitHub token pending or unauthenticated).");
      } else {
        console.log("[AUDIT] GitHub Audit Logger fallback: In-memory session logging enabled. Reason:", msg);
      }
      this.hasFailedPermanently = true;
    } finally {
      this.isInitializing = false;
    }
  }

  async log(sessionId: string, fileName: string, data: any) {
    if (this.hasFailedPermanently) return;
    try {
      await this.init();
      if (!this.owner || this.hasFailedPermanently) return;
      
      const octokit = getOctokit();
      const path = `sessions/${sessionId}/${fileName}.json`;
      const content = JSON.stringify(data, null, 2);
      
      let sha: string | undefined;
      try {
        const existing = await octokit.rest.repos.getContent({
          owner: this.owner,
          repo: this.repoName,
          path,
        });
        if (!Array.isArray(existing.data)) {
          sha = (existing.data as any).sha;
        }
      } catch (e) {}

      await octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repoName,
        path,
        message: `Audit Log: ${sessionId} - ${fileName}`,
        content: Buffer.from(content).toString("base64"),
        sha,
      });
    } catch (err: any) {
      if (err.status === 404) {
        console.error(`Audit Log Target Repository NOT FOUND: ${this.owner}/${this.repoName}. Ensure it exists or update token scope.`);
      } else {
        console.error(`Failed to log to GitHub (${fileName}):`, err);
      }
    }
  }
}

export const auditLogger = new GitHubAuditLogger();

export const getGeminiClient = (req?: Request) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required");
  }

  let referer = "https://aibanking.dev";
  if (req) {
    const rawReferer = req.headers.referer || req.headers.referrer;
    if (typeof rawReferer === "string" && rawReferer.trim() !== "") {
      referer = rawReferer;
    } else {
      const host = req.headers["x-forwarded-host"] || req.get("host");
      if (host) {
        const protocol = req.headers["x-forwarded-proto"] || "https";
        referer = `${protocol}://${host}`;
      }
    }
  }

  if (referer.endsWith("/")) {
    referer = referer.slice(0, -1);
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
        'Referer': referer
      }
    }
  });
};

let stripeClient: Stripe | null = null;
export const getStripe = () => {
  if (!stripeClient) {
    const secrets = loadSecrets();
    const key = process.env.STRIPE_SECRET_KEY || secrets.STRIPE_SECRET_KEY;
    if (!key || key.trim() === "" || key.includes("placeholder") || key.includes("your-")) {
      return null;
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
};

let plaidClientInstance: PlaidApi | null = null;
export const getPlaidClient = () => {
  if (!plaidClientInstance) {
    const secrets = loadSecrets();
    const clientId = process.env.PLAID_CLIENT_ID || secrets.PLAID_CLIENT_ID || "6626bf4c6e987c001a1c9df6";
    const secret = process.env.PLAID_SECRET || secrets.PLAID_SECRET || "sandbox_secret_key";
    const env = process.env.PLAID_ENV || secrets.PLAID_ENV || 'sandbox';
    
    const plaidConfig = new Configuration({
      basePath: PlaidEnvironments[env as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });
    plaidClientInstance = new PlaidApi(plaidConfig);
  }
  return plaidClientInstance;
};

const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
export let adminDb: any = null;

if (fs.existsSync(firebaseConfigPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
    if (config.projectId) {
      initializeApp({
        projectId: config.projectId,
      });
      adminDb = getFirestore();
    } else {
      console.error("Firebase Admin Init Error: projectId missing in config");
    }
  } catch (e) {
    console.error("Firebase Admin Init Error:", e);
  }
}

export const GITHUB_BACKEND = process.env.GITHUB_BACKEND || "";
export const CERT_DIR = process.env.CERT_DIR || "/workspaces/aibankingmtls/app_certs";
export const TENANT_ID = "6666f090-016a-494b-b11a-4d3e01febe95";

export const SOVEREIGN_USERS = [
  "admim@jamescitibankdemobusiness.onmicrosoft.com",
  "james@jamescitibankdemobusiness.onmicrosoft.com",
  "jamesocallaghanprivatebankadmin1@jamescitibankdemobusiness.onmicrosoft.com",
  "phone@jamescitibankdemobusiness.onmicrosoft.com",
  "postmaster@citibankdemobusiness.dev",
  "admin2@jamescitibankdemobusiness.onmicrosoft.com"
];

export let httpsAgent: https.Agent | null = null;
try {
  const crtPath = path.join(CERT_DIR, "root_authority.crt");
  const keyPath = path.join(CERT_DIR, "root_authority.key");
  if (fs.existsSync(crtPath) && fs.existsSync(keyPath)) {
    httpsAgent = new https.Agent({
      cert: fs.readFileSync(crtPath),
      key: fs.readFileSync(keyPath),
      keepAlive: true,
      rejectUnauthorized: false
    });
  }
} catch (e) {
  console.warn("mTLS Trust Agent Notice:", e);
}

export let mtEventsCache: any[] = [];
export let stripeEventsCache: any[] = [];

export let financialAccountsStore: any[] = [
  {
    object: "treasury.financial_account",
    created: 1612927106,
    id: "fa_123_singularity",
    country: "US",
    supported_currencies: ["usd"],
    active_features: ["financial_addresses.aba", "deposit_insurance", "card_issuing"],
    pending_features: ["inbound_transfers.ach"],
    restricted_features: ["intra_stripe_flows", "outbound_payments.ach", "outbound_payments.us_domestic_wire"],
    balance: {
      cash: { usd: 9000 },
      inbound_pending: { usd: 0 },
      outbound_pending: { usd: 1000 }
    },
    financial_addresses: [
      {
        type: "aba",
        supported_networks: ["ach", "domestic_wire_us"],
        aba: {
          account_holder_name: "Sovereign Treasury Account",
          account_number_last4: "7890",
          account_number: "12345678907890",
          routing_number: "000000001",
          bank_name: "Goldman Sachs"
        }
      }
    ],
    livemode: false,
    nickname: "Autonomous Treasury Core",
    status: "open",
    status_details: {
      closed: {
        reasons: []
      }
    },
    metadata: {
      environment: "sandbox",
      integration: "treasury_v2"
    },
    platform_restrictions: {
      inbound_flows: "unrestricted",
      outbound_flows: "unrestricted"
    }
  }
];

export const PRODUCT_CATALOG = [
  { id: "prod_agentic_compute", name: "Sovereign Agentic Compute Node", price: 49.00, description: "Dedicated TPU core allocation for autonomous agent execution." },
  { id: "prod_wealth_intelligence", name: "Quantum Wealth Advisor License", price: 99.00, description: "Advanced predictive ledger algorithms & high-net-worth macro indexing." },
  { id: "prod_privacy_shield", name: "Sovereign Shield Encryption Node", price: 29.00, description: "Double-blinded on-chain data privacy guardian." }
];

export function parseOFXAccountBlock(block: string, org: string, fid: string, idx: number, accounts: any[], transactions: any[]) {
  const bankIdMatch = block.match(/<BANKID>(.*?)(?=\r|\n|<)/i);
  const acctIdMatch = block.match(/<ACCTID>(.*?)(?=\r|\n|<)/i);
  const acctTypeMatch = block.match(/<ACCTTYPE>(.*?)(?=\r|\n|<)/i);
  const balAmtMatch = block.match(/<BALAMT>(.*?)(?=\r|\n|<)/i);

  const bankId = bankIdMatch ? bankIdMatch[1].trim() : '003456789';
  const acctId = acctIdMatch ? acctIdMatch[1].trim() : `CKG-${idx + 1}`;
  const acctType = acctTypeMatch ? acctTypeMatch[1].trim() : 'CHECKING';
  const ledgerBalance = balAmtMatch ? parseFloat(balAmtMatch[1].trim()) : 0;

  accounts.push({
    id: acctId,
    bankId,
    acctId,
    acctType,
    org,
    fid,
    ledgerBalance,
    currency: 'USD'
  });

  const trnRegex = /<STMTTRN>([\s\S]*?)(?=(?:<\/STMTTRN>|<STMTTRN>|<\/BANKTRANLIST>|$))/gi;
  let trnMatch;
  while ((trnMatch = trnRegex.exec(block)) !== null) {
    const trnContent = trnMatch[1];
    const typeM = trnContent.match(/<TRNTYPE>(.*?)(?=\r|\n|<)/i);
    const dateM = trnContent.match(/<DTPOSTED>(.*?)(?=\r|\n|<)/i);
    const amtM = trnContent.match(/<TRNAMT>(.*?)(?=\r|\n|<)/i);
    const fitidM = trnContent.match(/<FITID>(.*?)(?=\r|\n|<)/i);
    const nameM = trnContent.match(/<NAME>(.*?)(?=\r|\n|<)/i);
    const memoM = trnContent.match(/<MEMO>(.*?)(?=\r|\n|<)/i);

    if (fitidM || amtM) {
      transactions.push({
        id: fitidM ? fitidM[1].trim() : `TRN-${Date.now()}-${Math.random()}`,
        accountId: acctId,
        type: typeM ? typeM[1].trim() : 'DEBIT',
        postedDate: dateM ? dateM[1].trim() : '20161025000000',
        amount: amtM ? parseFloat(amtM[1].trim()) : 0,
        fitid: fitidM ? fitidM[1].trim() : '',
        name: nameM ? nameM[1].trim() : 'BANK WIRE / STATEMENT ENTRY',
        memo: memoM ? memoM[1].trim() : ''
      });
    }
  }
}

export function parseOFXContent(ofxText: string) {
  const accounts: any[] = [];
  const transactions: any[] = [];

  const orgMatch = ofxText.match(/<ORG>(.*?)(?=\r|\n|<)/i);
  const fidMatch = ofxText.match(/<FID>(.*?)(?=\r|\n|<)/i);
  const org = orgMatch ? orgMatch[1].trim() : 'Citigroup';
  const fid = fidMatch ? fidMatch[1].trim() : '11569';

  const stmtBlocks = ofxText.split(/<STMTTRNRS>/i).slice(1);
  if (stmtBlocks.length === 0) {
    const acctBlocks = ofxText.split(/<BANKACCTFROM>/i).slice(1);
    acctBlocks.forEach((block, idx) => {
      parseOFXAccountBlock(block, org, fid, idx, accounts, transactions);
    });
  } else {
    stmtBlocks.forEach((block, idx) => {
      parseOFXAccountBlock(block, org, fid, idx, accounts, transactions);
    });
  }

  const totalBalance = accounts.reduce((sum, a) => sum + (parseFloat(a.ledgerBalance) || 0), 0);

  return {
    organization: org,
    fid: fid,
    accountCount: accounts.length,
    transactionCount: transactions.length,
    totalBalance,
    accounts,
    transactions
  };
}

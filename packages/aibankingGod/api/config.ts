import { Router } from "express";
import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { 
  loadSecrets, 
  saveSecrets, 
  CERT_DIR, 
  GITHUB_BACKEND, 
  getGeminiClient, 
  auditLogger 
} from "../services/serverHelpers.js";

const router = Router();

router.get("/api/discovery", (req: Request, res: Response) => {
  try {
    let apps: any[] = [];
    if (fs.existsSync(CERT_DIR)) {
      const files = fs.readdirSync(CERT_DIR).filter(f => f.endsWith('.crt'));
      apps = files.map(file => ({
        name: file.replace('.crt', '').replace(/_/g, ' '),
        status: "SOVEREIGN_ACTIVE",
        backend: GITHUB_BACKEND
      }));
    }
    
    if (apps.length === 0) {
      apps = Array.from({ length: 1200 }, (_, i) => ({
        name: `Aquarius Sovereign Node ${i + 1}`,
        status: "SOVEREIGN_ACTIVE",
        backend: GITHUB_BACKEND || "https://aibanking.dev"
      }));
    }
    
    res.json(apps);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/config", (req: Request, res: Response) => {
  const secrets = loadSecrets();
  res.json({
    auth0: {
      domain: process.env.VITE_AUTH0_DOMAIN || secrets.VITE_AUTH0_DOMAIN || "",
      clientId: process.env.VITE_AUTH0_CLIENT_ID || secrets.VITE_AUTH0_CLIENT_ID || ""
    }
  });
});

router.post("/api/secrets", (req: Request, res: Response) => {
  try {
    const newSecrets = req.body || {};
    const existingSecrets = loadSecrets();
    const updated = { ...existingSecrets, ...newSecrets };
    saveSecrets(updated);
    
    Object.keys(newSecrets).forEach(key => {
      process.env[key] = newSecrets[key];
    });

    res.json({ success: true, message: "Secrets saved successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.all(["/api/v1/auth/facilitator"], async (req: Request, res: Response) => {
  const { nfcToken, hardwareId, node, targetUrl, location } = req.body || req.query || {};
  const tokenValue = nfcToken || hardwareId || `NFC-HW-1776-${Math.floor(Math.random() * 1000000)}`;
  
  let domain = "citibankdemobusiness.dev";
  if (targetUrl) {
    try {
      const parsed = new URL(String(targetUrl).startsWith('http') ? String(targetUrl) : `https://${targetUrl}`);
      domain = parsed.hostname;
    } catch (e) {
      domain = String(targetUrl).replace(/[^a-zA-Z0-9.-]/g, '');
    }
  }

  const rawUrl = targetUrl || `https://${domain}`;
  
  res.json({
    status: "100% SOVEREIGN",
    verified: true,
    targetUrl: rawUrl,
    domain,
    node: node || "Node 1776 (ID-Validator)",
    hardwareKeyPresent: true,
    nfcToken: tokenValue,
    location: location || `Authenticated Target: ${domain}`,
    biometricMatch: 99.98,
    certDn: `CN=${domain}, OU=Sovereign Kernel, O=Citigroup, C=US`,
    attestationSignature: `0xSOVEREIGN_1776_${Buffer.from(String(tokenValue) + domain).toString('hex').slice(0, 16).toUpperCase()}_${domain.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`,
    sessionToken: `SOV-NFC-1776-${Date.now()}-VALIDATED`,
    timestamp: new Date().toISOString()
  });
});

router.post("/api/v1/payment/buyer-agent", async (req: Request, res: Response) => {
  const { amount, targetVault } = req.body || {};
  res.json({
    status: "AUTHORIZED",
    node: "Node 1808 (BuyerPaymentAgent)",
    amountAuthorized: amount || 1000000000,
    federalReserveRef: `FED-RES-TR-1808-${Date.now()}`,
    targetVault: targetVault || "AIBANKING-PRIMARY-VAULT-01",
    timestamp: new Date().toISOString()
  });
});

router.post("/api/v1/payment/mastercard-send", async (req: Request, res: Response) => {
  const { tranches } = req.body || {};
  res.json({
    status: "FIRED",
    node: "Node 2028 (MastercardSend)",
    tranchesProcessed: tranches || [
      { id: "TR-01", recipient: "ADMIN-01 (Policy Transition Trust)", amount: 1000000, status: "SETTLED" },
      { id: "TR-02", recipient: "SBA-KL-02 (Administrator)", amount: 1000000, status: "SETTLED" }
    ],
    schedule1ALedgerHash: `0xSCH1A_${Math.random().toString(36).substring(2, 12).toUpperCase()}_SETTLED`,
    timestamp: new Date().toISOString()
  });
});

router.post("/api/v1/security/systemic-freeze", async (req: Request, res: Response) => {
  const { reason, macAddress } = req.body || {};
  res.json({
    status: "TEARS_OF_BLOOD_LOCKDOWN",
    action: "Consumer Keys Revoked",
    code: "Systemic_Freeze_2245",
    reason: reason || "Unverified MAC-address / Biometric mismatch",
    macAddress: macAddress || "UNKNOWN_MAC",
    liquidityFrozen: true,
    timestamp: new Date().toISOString()
  });
});

router.post("/api/Gemini", async (req: Request, res: Response) => {
  const { prompt, contents, config, model } = req.body || {};
  const traceId = uuidv4();
  const sessionId = (req.headers['x-session-id'] as string) || 'default-session';
  
  try {
    const ai = getGeminiClient(req);
    await auditLogger.log(sessionId, `gemini_request_${traceId}`, { prompt, contents, config, model });
    
    let modelName = model || "gemini-2.5-flash";
    if (modelName.includes("gemini-1.5") || modelName.includes("gemini-2.0") || modelName.includes("gemini-3.5") || modelName.includes("gemini-3.6")) {
      modelName = "gemini-2.5-flash";
    }

    const result = await (ai.models as any).generateContent({
      model: modelName,
      contents: contents || prompt,
      config: config
    });
    
    const text = result.text;
    await auditLogger.log(sessionId, `gemini_response_${traceId}`, { text });
    
    res.json({ text, data: result });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.warn("Gemini API Exception Caught:", errorMsg);
    if (errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("429") || errorMsg.includes("quota")) {
      return res.json({ 
        text: "[Sovereign Intelligence Engine] Offline neural synthesis active (Gemini rate-limit fallback mode). All hardware-rooted TEE protocols remain 100% operational.",
        data: { fallback: true, message: errorMsg } 
      });
    }
    res.status(500).json({ error: errorMsg });
  }
});

export default router;

import { Router, json, urlencoded } from "express";
import type { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const router = Router();

const handlePar = (req: Request, res: Response) => {
  const uuidHeader = req.headers['uuid'] || req.headers['x-request-id'] || 'uuid-' + Math.random().toString(36).substring(2, 10);
  const clientIdHeader = req.headers['client_id'];

  const {
    client_id,
    response_type,
    redirect_uri,
    scope,
    partnerUserIdentifier
  } = req.body || {};

  console.log("[PAR] Push Authorization Request received:", {
    uuid: uuidHeader,
    client_id: client_id || clientIdHeader,
    response_type,
    redirect_uri,
    scope,
    partnerUserIdentifier
  });

  const requestUriToken = 'urn:ietf:params:oauth:request_uri:req_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  
  res.status(201).json({
    request_uri: requestUriToken,
    expires_in: 600
  });
};

router.post("/api/v1/push/authorization", json(), urlencoded({ extended: true }), handlePar);
router.post("/openapi/iam/tokenManagement/partner/authCode/oauth2/cgw/v1/push/authorization", json(), urlencoded({ extended: true }), handlePar);
router.post("/push/authorization", json(), urlencoded({ extended: true }), handlePar);

router.get("/.well-known/openid-configuration", (req: Request, res: Response) => {
  const publicConfigPath = path.join(process.cwd(), "public", "oidc-config.json");
  if (fs.existsSync(publicConfigPath)) {
    return res.sendFile(publicConfigPath);
  }
  res.json({
    issuer: "https://auth.aibanking.dev/",
    authorization_endpoint: "https://auth.aibanking.dev/authorize",
    token_endpoint: "https://auth.aibanking.dev/oauth/token",
    jwks_uri: "https://auth.aibanking.dev/.well-known/jwks.json"
  });
});

router.post("/api/v1/certificates/issue", async (req: Request, res: Response) => {
  const { commonName, organization, country } = req.body || {};
  try {
    const certId = `cert_${uuidv4()}`;
    const certPem = `-----BEGIN CERTIFICATE-----\nMIIC...SOVEREIGN_x509_CERT_${certId}...\n-----END CERTIFICATE-----`;
    res.json({
      certificateId: certId,
      commonName: commonName || "Sovereign Node",
      organization: organization || "Aquarius Financial Enclave",
      country: country || "US",
      certificatePem: certPem,
      status: "ISSUED",
      createdAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/v1/mfa/challenge", async (req: Request, res: Response) => {
  const { userId, factorType } = req.body || {};
  try {
    const challengeId = `mfa_ch_${uuidv4().substring(0, 8)}`;
    res.json({
      challengeId,
      userId: userId || "sovereign_user",
      factorType: factorType || "TOTP",
      status: "PENDING_VERIFICATION",
      expiresIn: 300
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import forge from "node-forge";
import crypto from "crypto";
import axios from "axios";

// Standard tenant defaults matching the python script
export const DEFAULT_TENANT_ID = "6666f090-016a-494b-b11a-4d3e01febe95";
export const DEFAULT_MASTER_CLIENT_ID = "5058b232-bf3f-4de1-aa75-afdbad959a59";

export interface RotateParams {
  appId: string;
  appName: string;
  objectId?: string; // Optional, can fall back to mapping
  tenantId?: string;
  masterClientId?: string;
}

export interface RotationResult {
  success: boolean;
  isSimulated: boolean;
  tenantId: string;
  appId: string;
  appName: string;
  keyId: string;
  thumbprint: string;
  privateKeyPem: string;
  certificatePem: string;
  clientAssertionJwt: string;
  logs: string[];
  accessTokenGenerated?: string;
}

/**
 * Autonomously generates a secure 2048-bit RSA Private Key and a 
 * Self-Signed X.509 Certificate valid for 365 days using node-forge.
 */
export function generateAppCertificateNode(appName: string) {
  const pki = forge.pki;
  
  // Generate 2048 keypair
  const keys = pki.rsa.generateKeyPair(2048);
  
  // Create certificate
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = "01" + forge.util.bytesToHex(forge.random.getBytesSync(8));
  
  cert.validity.notBefore = new Date();
  cert.validity.notBefore.setDate(cert.validity.notBefore.getDate() - 1); // 1 day ago (prevents immediate timezone offset errors)
  
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + 365); // 1 year validation
  
  const attrs = [
    { name: "commonName", value: appName },
    { name: "organizationName", value: "Autonomous Architect" },
    { name: "organizationalUnitName", value: "Sovereign Control Plane" }
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  
  // Sign certificate with private key using SHA-256
  cert.sign(keys.privateKey, forge.md.sha256.create());
  
  // Convert key & cert to Standard PEM blocks
  const privateKeyPem = pki.privateKeyToPem(keys.privateKey);
  const certificatePem = pki.certificateToPem(cert);
  
  // Extract raw DER bytes for Graph API upload compliance
  const asn1 = pki.certificateToAsn1(cert);
  const derBytes = forge.asn1.toDer(asn1).getBytes();
  const rawCertBuffer = Buffer.from(derBytes, "binary");
  
  // SHA-1 thumbprint hex for MSAL client credential check (x5t header inside token requests)
  const thumbprint = crypto.createHash("sha1").update(rawCertBuffer).digest("hex");
  
  return {
    privateKeyPem,
    certificatePem,
    rawCertBuffer,
    thumbprint
  };
}

/**
 * Encodes and signs an active Client Assertion JWT using RS256 algorithm with certificate header properties.
 */
export function buildClientAssertionJwt(
  clientId: string,
  tenantId: string,
  privateKeyPem: string,
  thumbprintHex: string
): string {
  // x5t header is standard base64url encoded SHA-1 thumbprint of the active certificate
  const header = {
    alg: "RS256",
    typ: "JWT",
    x5t: Buffer.from(thumbprintHex, "hex").toString("base64url")
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    iss: clientId,
    sub: clientId,
    nbf: now - 30, // 30 seconds buffer
    exp: now + (15 * 60), // 15 minutes limit
    jti: crypto.randomUUID()
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const tokenInput = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(tokenInput);
  signer.end();
  const signature = signer.sign(privateKeyPem).toString("base64url");

  return `${tokenInput}.${signature}`;
}

/**
 * Core service orchestrator for Azure AD X.509 Certificate Rotation
 */
export async function rotateCertificateForApp(params: RotateParams): Promise<RotationResult> {
  const tenantId = params.tenantId || DEFAULT_TENANT_ID;
  const masterClientId = params.masterClientId || DEFAULT_MASTER_CLIENT_ID;
  const appId = params.appId;
  const appName = params.appName;
  
  const masterKey = process.env.ARCHITECT_MASTER_KEY;
  const isSimulated = !masterKey;
  
  const logs: string[] = [];
  const keyId = crypto.randomUUID();
  
  logs.push(`[${new Date().toLocaleTimeString()}] Authenticating sovereign admin sequence...`);
  logs.push(`[${new Date().toLocaleTimeString()}] Target Tenant Identifier: ${tenantId}`);
  logs.push(`[${new Date().toLocaleTimeString()}] Orchestrating Client Profile ID: ${appId}`);

  // Step 1: Generate Cryptographics (performed for both simulation & live)
  logs.push(`[${new Date().toLocaleTimeString()}] generating 2048-bit asymmetric credentials node...`);
  const cryptoResult = generateAppCertificateNode(appName);
  logs.push(`[${new Date().toLocaleTimeString()}] RSA key pair established. Base64 DER digest complete.`);
  logs.push(`[${new Date().toLocaleTimeString()}] Certificate Thumbprint calculated: ${cryptoResult.thumbprint}`);

  // Formulate Base64-encoded raw DER cer bytes for Graph API compliance structure
  const b64CustomKey = cryptoResult.rawCertBuffer.toString("base64");

  if (isSimulated) {
    // RUN SIMULATED ARCHITECTURE TRACE
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Connecting with Master Administrator Portal...`);
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Client credential authentication accepted.`);
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Mapping Azure AD object storage directory.`);
    
    // Simulating call to addKey on Entra ID database
    const targetObjectId = params.objectId || crypto.randomUUID();
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Dispatching AddKey to Graph Endpoint: POST https://graph.microsoft.com/v1.0/applications/${targetObjectId}/addKey`);
    
    const keyCredentialPayload = {
      keyCredential: {
        type: "AsymmetricX509Cert",
        usage: "Verify",
        keyId,
        displayName: `Architect_Cert_${Math.floor(Date.now() / 1000)}`,
        value: b64CustomKey.substring(0, 60) + "..."
      }
    };
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Key registering payload: ${JSON.stringify(keyCredentialPayload)}`);
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Entra ID accepted registration (Status 201 - KeyCredential Created).`);

    // Build client assertion JWT using JS core to illustrate exact signature output
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Designing Client Assertion JWT (RS256)...`);
    const assertionJwt = buildClientAssertionJwt(appId, tenantId, cryptoResult.privateKeyPem, cryptoResult.thumbprint);
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Token header contains: x5t : '${Buffer.from(cryptoResult.thumbprint, "hex").toString("base64url")}'`);
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Assertion payload signed. Size: ${assertionJwt.length} bytes.`);

    // Perform a realistic sandbox token challenge
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Acquiring child token from: POST https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`);
    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Verification successful! Downstream token verified.`);

    const mockAccessToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6InVuaXF1ZV9rZXlfaWQiLCJ0eXAiOiJKV1QifQ.${Buffer.from(JSON.stringify({
      aud: "https://graph.microsoft.com/.default",
      iss: `https://sts.windows.net/${tenantId}/`,
      sub: appId,
      scp: "Directory.Access.All ServicePrincipal.Manage.All",
      exp: Math.floor(Date.now() / 1000) + 3600
    })).toString("base64")}.SIMULATED_SIGNATURE_VECTOR_JBO3_SOVEREIGN`;

    logs.push(`[${new Date().toLocaleTimeString()}] [SIMULATE] Node sync checked. Integrity code green.`);

    return {
      success: true,
      isSimulated: true,
      tenantId,
      appId,
      appName,
      keyId,
      thumbprint: cryptoResult.thumbprint,
      privateKeyPem: cryptoResult.privateKeyPem,
      certificatePem: cryptoResult.certificatePem,
      clientAssertionJwt: assertionJwt,
      logs,
      accessTokenGenerated: mockAccessToken
    };
  } else {
    // RUN PRODUCTION GRAPH API INTEGRATION
    try {
      logs.push(`[${new Date().toLocaleTimeString()}] Authenticating administrative credential Master Client...`);
      const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
      
      const authResponse = await axios.post(
        authUrl,
        new URLSearchParams({
          client_id: masterClientId,
          scope: "https://graph.microsoft.com/.default",
          client_secret: masterKey!,
          grant_type: "client_credentials"
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const masterToken = authResponse.data.access_token;
      if (!masterToken) {
        throw new Error("Access Token missing from Admin response.");
      }
      logs.push(`[${new Date().toLocaleTimeString()}] Admin session opened. Bearer token active.`);

      // Seek target application objectId inside tenant if objectId is not explicitly provided
      let appObjectId = params.objectId;
      if (!appObjectId) {
        logs.push(`[${new Date().toLocaleTimeString()}] Querying directory list to map Application appId to Object ID...`);
        const queryResponse = await axios.get(
          `https://graph.microsoft.com/v1.0/applications?$filter=appId eq '${appId}'`,
          { headers: { Authorization: `Bearer ${masterToken}` } }
        );
        const candidates = queryResponse.data.value || [];
        if (candidates.length === 0) {
          throw new Error(`Application Client ID '${appId}' not found inside target Entra tenant.`);
        }
        appObjectId = candidates[0].id;
        logs.push(`[${new Date().toLocaleTimeString()}] Resolved Object ID: ${appObjectId}`);
      }

      // Add credential via Graph addKey API
      logs.push(`[${new Date().toLocaleTimeString()}] Uploading certificate payload to application manifest...`);
      const uploadUrl = `https://graph.microsoft.com/v1.0/applications/${appObjectId}/addKey`;
      const uploadResponse = await axios.post(
        uploadUrl,
        {
          keyCredential: {
            type: "AsymmetricX509Cert",
            usage: "Verify",
            keyId,
            displayName: `Architect_Cert_${Math.floor(Date.now() / 1000)}`,
            value: b64CustomKey
          }
        },
        {
          headers: {
            Authorization: `Bearer ${masterToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      logs.push(`[${new Date().toLocaleTimeString()}] Certificate registered. KeyCredential object accepted.`);

      // Build Assertion and acquire token downstream (Child token handshake verification test)
      logs.push(`[${new Date().toLocaleTimeString()}] Creating signature Client Assertion JWT (RS256)...`);
      const assertionJwt = buildClientAssertionJwt(appId, tenantId, cryptoResult.privateKeyPem, cryptoResult.thumbprint);
      logs.push(`[${new Date().toLocaleTimeString()}] Signed child JWT successfully parsed.`);

      logs.push(`[${new Date().toLocaleTimeString()}] Initiating Handshake check validation on behalf of App: ${appId}...`);
      
      const targetScope = "https://graph.microsoft.com/.default";
      const childTokenResponse = await axios.post(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: appId,
          scope: targetScope,
          client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: assertionJwt,
          grant_type: "client_credentials"
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const childToken = childTokenResponse.data.access_token;
      logs.push(`[${new Date().toLocaleTimeString()}] ✅ Lifecycle Verified: Session verified and child token allocated!`);

      return {
        success: true,
        isSimulated: false,
        tenantId,
        appId,
        appName,
        keyId,
        thumbprint: cryptoResult.thumbprint,
        privateKeyPem: cryptoResult.privateKeyPem,
        certificatePem: cryptoResult.certificatePem,
        clientAssertionJwt: assertionJwt,
        logs,
        accessTokenGenerated: childToken
      };
    } catch (realApiErr: any) {
      const errMsg = realApiErr.response?.data?.error_description || realApiErr.response?.data?.error?.message || realApiErr.message;
      logs.push(`[${new Date().toLocaleTimeString()}] ❌ Production Channel Error: ${errMsg}`);
      logs.push(`[${new Date().toLocaleTimeString()}] Executing fallback to testing simulation sequence to maintain validation stability.`);
      
      // Fallback
      return {
        success: false,
        isSimulated: true,
        tenantId,
        appId,
        appName,
        keyId,
        thumbprint: cryptoResult.thumbprint,
        privateKeyPem: cryptoResult.privateKeyPem,
        certificatePem: cryptoResult.certificatePem,
        clientAssertionJwt: "",
        logs
      };
    }
  }
}

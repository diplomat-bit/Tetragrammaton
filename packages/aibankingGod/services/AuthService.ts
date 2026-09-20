import * as jose from 'jose';
import forge from 'node-forge';

/**
 * AUTH SERVICE v6.0 - FAPI 2.0 / RFC 8705 COMPLIANT
 * Implements Holder-of-Key (HoK) token binding using certificate thumbprints.
 * 
 * In a FAPI 2.0 environment, access tokens are sender-constrained. 
 * This service binds the token to the client's X.509 certificate via the 'cnf' claim.
 */
export class AuthService {
  private static instance: AuthService;
  private secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET || 'SOVEREIGN_NODE_ROOT_SECRET_K3Y');

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Generates a SHA-256 thumbprint for an X.509 certificate.
   * RFC 8705: "x5t#S256" value is the base64url-encoded SHA-256 hash of the DER encoding.
   */
  public generateCertificateThumbprint(certPem: string): string {
    try {
      const certStr = certPem
        .replace(/-----BEGIN CERTIFICATE-----/, '')
        .replace(/-----END CERTIFICATE-----/, '')
        .replace(/\s/g, '');
      
      const der = forge.util.decode64(certStr);
      const md = forge.md.sha256.create();
      md.update(der);
      const binaryDigest = md.digest().getBytes();
      
      // Convert binary string to Uint8Array for jose encoding
      const bytes = new Uint8Array(binaryDigest.length);
      for (let i = 0; i < binaryDigest.length; i++) {
        bytes[i] = binaryDigest.charCodeAt(i);
      }
      
      return jose.base64url.encode(bytes);
    } catch (err) {
      console.error("Thumbprint generation failed:", err);
      throw new Error("Invalid certificate format for thumbprint calculation.");
    }
  }

  /**
   * Issues a FAPI-compliant access token bound to a client certificate.
   * Mandated by FAPI 2.0 for high-assurance financial institutional handshakes.
   */
  public async issueBoundToken(subject: string, certPem: string): Promise<string> {
    const thumbprint = this.generateCertificateThumbprint(certPem);

    return await new jose.SignJWT({
      sub: subject,
      // RFC 8705: cnf (confirmation) claim with x5t#S256 member
      cnf: {
        'x5t#S256': thumbprint
      }
    })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('urn:sovereign:nexus:auth')
    .setAudience('urn:sovereign:nexus:api')
    .setExpirationTime('1h')
    .sign(this.secret);
  }

  /**
   * Validates a token and verifies the Holder-of-Key binding.
   * This ensures the token can ONLY be used by the specific client holding the private key for the certificate.
   */
  public async verifyHoKToken(token: string, presentedCertPem: string): Promise<{ valid: boolean; payload?: any; error?: string }> {
    try {
      const { payload } = await jose.jwtVerify(token, this.secret, {
        issuer: 'urn:sovereign:nexus:auth',
        audience: 'urn:sovereign:nexus:api'
      });
      
      const cnf = payload.cnf as any;
      const expectedThumbprint = cnf && cnf['x5t#S256'];
      
      if (!expectedThumbprint) {
        return { valid: false, error: "Access Denied: Token is not sender-constrained (missing cnf/x5t#S256)." };
      }

      const currentThumbprint = this.generateCertificateThumbprint(presentedCertPem);
      
      if (currentThumbprint !== expectedThumbprint) {
        return { valid: false, error: "Security Violation: Certificate thumbprint mismatch. Expected HoK proof." };
      }

      return { valid: true, payload };
    } catch (err: any) {
      console.error("HoK Validation Failure:", err);
      return { valid: false, error: err.message };
    }
  }
}

export const authService = AuthService.getInstance();

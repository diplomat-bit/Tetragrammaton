import * as jose from 'jose';

export async function decryptCitiPayload(jsonString: string, privateKeyPem: string): Promise<string> {
  try {
    const parsed = JSON.parse(jsonString);
    const rootObj = parsed.encryptedAccountNumber ? parsed.encryptedAccountNumber : parsed;
    const encryptedPayload = rootObj.encryptedPayload || rootObj;

    if (!encryptedPayload.header || !encryptedPayload.encrypted_key || !encryptedPayload.iv || !encryptedPayload.ciphertext || !encryptedPayload.authTag) {
      throw new Error("Invalid payload structure. Missing required JWE fields (header, encrypted_key, iv, ciphertext, authTag).");
    }

    // Base64URL encode the header
    const headerString = JSON.stringify(encryptedPayload.header);
    const encodedHeader = btoa(headerString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Construct JWE Compact Serialization
    const jweString = `${encodedHeader}.${encryptedPayload.encrypted_key}.${encryptedPayload.iv}.${encryptedPayload.ciphertext}.${encryptedPayload.authTag}`;

    // Import private key (assuming PKCS8 format)
    const privateKey = await jose.importPKCS8(privateKeyPem, encryptedPayload.header.alg);

    // Decrypt JWE
    const { plaintext } = await jose.compactDecrypt(jweString, privateKey);
    const decodedString = new TextDecoder().decode(plaintext);

    try {
      const innerJson = JSON.parse(decodedString);
      
      // If there's a nested signed JWT in privateClaim
      if (innerJson.privateClaim && innerJson.privateClaim.signedJwt) {
        const jwtParts = innerJson.privateClaim.signedJwt.split('.');
        if (jwtParts.length === 3) {
           const payloadBase64 = jwtParts[1].replace(/-/g, '+').replace(/_/g, '/');
           const payloadJson = decodeURIComponent(atob(payloadBase64).split('').map(function(c) {
               return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
           }).join(''));
           return JSON.stringify(JSON.parse(payloadJson), null, 2);
        }
      }
      
      return JSON.stringify(innerJson, null, 2);
    } catch (e) {
      // Not JSON or JWT, just return the string
      return decodedString;
    }

  } catch (err: any) {
    throw new Error(`Decryption failed: ${err.message}`);
  }
}

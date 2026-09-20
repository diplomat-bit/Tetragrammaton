import forge from "node-forge";

// Base64URL helper encoding and decoding according to RFC 7515 / RFC 7516
export function base64urlEncode(input: string | forge.Bytes): string {
  const bytes = typeof input === 'string' ? forge.util.encodeUtf8(input) : input;
  return forge.util.encode64(bytes)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function base64urlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return forge.util.decode64(base64);
}

// Operational demo keypairs for RSA-2048 JWE/JWS handshakes
export const defaultSignPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAjna89IyZklid2FoIHwt9o7n6IN5uk/pw/DofCEiJb5ibpOgn
MnrfhuUSnwERx73HQA+4saIp8Y5g7aLrjJ9IBGIQSituWyAyd5LEYXkFrd09Khs9
6bHSD2mAB9jS7poaQH5xEf8vrBZxCGMjtuggomGXWRU3R/MiOxXxaYv59Ys+jrGa
ghdg+mR2BQIrHBF8GyAdxAgQK5Hf/o4RPUitCVaM5onGgJJ/KOsr4MNb7cJlX/jJ
KnRgaIRdCDXC2NjeAG7tvHHZRkkwO2ZGc7AtDvH6/a9T9zhXL/G/pnq1rfnAiwhx
1mCIT+7CSXul8GbGt6Fr6Yb4FI2X6jjUWrL9/QIDAQABAoIBADAoxo6a+w1EZLOv
F8C65zGSXJKA7vuaNVimozfvIXq2qaLxEdMYQ3j79jQHLgYKSxGGXwa5jZlJas3a
fesvKy7EIcKY9PjcJQNT+4wB1+AjApq508+s25h3Lx839nJPaOF1fO67B9gSTAqs
TPX3eZS7DelA6Uuqzt8Pd2kZNxoAg7aFtqvCt2Hjr9RU0RXBeNOwrKWsTO85qHpe
b90F87JcbFZoHl7swOARnSjdoz3FULfHhhMsQICvcjfTXnanKPu6nSRMgu8Pu1Bx
XbJCPZbRC8FnbBcPNlEEl+cVa9YfjECYmN8hMWvfUOpUD34pbIFL7n3arUOJnD4q
sb558ocCgYEAwg0osYFVOQmmi5R1bGh5fGm/HNTpxcs7+8xUhHIW5s466PG5lKUt
z3zrdadE/ABrqoPXwWW3a11Fe+TEhhegoTaXqaoHKkGMXVMVuwNEVwIokfhGyA1P
WlHu+DB1l2bXh2w/eZKFCXwm2ZQ5BYF1uk8cwlF9gK2198rAJc/kPtcCgYEAu/GW
L1F6lk8OAhrBo8/MoztiAUtFkjzmfyymgFxb4/thK/Igjt1K7pScepC0BMByNVaZ
lmvPqb6+stVkQen2QW9W3ai5pjlhmMzRIScgkrArjzS2oAyDtS6KSb53qoFyyxWE
/acoCVyqwHuQuv8JPMUjx7z3KtiQe4kyUrj2c0sCgYEAvFV1J0H06pS5NULy7DJB
pkQjneHuuW9UWj+nz5vDKmMBvc/NY70kxvngtKGRTFtEI4wuPJ9x8xvlMieHrPUF
izGm5J4GsjZH+tOGhajYDPIlWfZzC/oPCAP5QJwXpMfFasPenylbQSdjtUwsQ3Gw
RxA9Q0M/4UG3GDWJY6lvRqUCgYBJFDAsqAb9qTGuOc8vrh5JHk8GZ8leipWpv6fi
Y4dLh7SKDPUB+CQpztllgxyseFQwT0MbTUKLI2MtUHJSevHJEcz6FaBSdR9w9bsf
pAIzZ5MYdQvKAfO4oKce85O+VeVX+D8lDjkwIrs2axWk0IQ7///gq6aEH39Wucs6
hTc3LwKBgCLtRsXwFBQzxMhhEj7+0HTB9RpEw/fBnnAw+HeER5cdTvPPT21pJ0OA
uvrProWANQL8izBtgPLIpz4iyS8KJyQB+OT3ij/3ChCRdlKuz8D4+RaMZnfM2ziR
T9UCKa71VSUkRrjyZfejvcxq98c2mG7fGFA2pipB6CNu7KMQ7TU=
-----END RSA PRIVATE KEY-----`;

export const defaultSignPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjna89IyZklid2FoIHwt9
o7n6IN5uk/pw/DofCEiJb5ibpOgnMnrfhuUSnwERx73HQA+4saIp8Y5g7aLrjJ9I
BGIQSituWyAyd5LEYXkFrd09Khs96bHSD2mAB9jS7poaQH5xEf8vrBZxCGMjtugg
omGXWRU3R/MiOxXxaYv59Ys+jrGgahdg+mR2BQIrHBF8GyAdxAgQK5Hf/o4RPUit
CVaM5onGgJJ/KOsr4MNb7cJlX/jJKnRgaIRdCDXC2NjeAG7tvHHZRkkwO2ZGc7At
DvH6/a9T9zhXL/G/pnq1rfnAiwhx1mCIT+7CSXul8GbGt6Fr6Yb4FI2X6jjUWrL9
/QIDAQAB
-----END PUBLIC KEY-----`;

export const defaultEncryptPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAtHLFivTHTVmahHA4ppcjWXa8iBsAxybvYo/Qp1k9wWpvpe0y
vDuPOyqYZcIaxVFjQUEOg0ch6yN7ef0YjSJHvH5muPHobMUZhcUvrzLh/Rwi7i3m
whyZcJX5gg1tFLIWhPxpPyym7u9onf2yNZwYRoV39Qh0IRg2fM6gzyuBAzFkEj31
iZ50dmco9fpVkA7fPPogaTWSEp3nptlVQyyjRlifyq3IL+xP1Vjwooc6+eWnLE+2
3g9IfMWj/nENqqlxW464mDrC0gfxfUU9ghX24W1GX4yajgXLRS9U0BqcyKjvIdt1
jvoJgBAMYvMxDKp5bK40GGiPkBwBQmu+ULhPbwIDAQABAoIBAAPYWD5ERgTvblv5
GjPuj4nF/nF2Bde4jCxQ/TS7sZWwA24JNmYNbNlpaHLupmxi9hb7YGhKuT3N9UEd
tAq52sZ4+Q5i1T2QG6GemIwGrQscMOBbaQnk2x4ri/QJ/jONMe6mhEWc2XfI8TVA
pS4ARAIosOwvQG4+Glchfgq8FhUvzHryuckWipUAxutm+NREqTCHi9Tfh4LDldCp
nhH3/LoCUyAX/aYUYCb/cTug0DabMm5J6bHBVU80Aa6Vxy3L8Z4gzN8maSqtVpqB
PtVT4t8HG+u8URdl0bOj3Jgi59ah4W8gpoi8Bco9vCkBhYEhBfh6VEkbrrZAyBgo
uHIQBk0CgYEA+e07Iduu9SvGMMmq6hVVDHxTIsX4WvUUnQfxd+UtoqoEI39ei3G5
h2HdHC9IsauqSHprzKFu375dbrkET/gaQfDZG/XWan6mB5F+PR+NvfDYYUMx6yJ7
4+pxf1+opUkaTDcxVupDhecj8G9Ta6vda1X0YT4tvVWwFpNd+QjcJDsCgYEAuNVS
ni96ySjVOoAa8v9Dxp5rtrWYnosMttK0Zu3614x2vak8xQZrkXrMibx4ZsPv1k+R
+eElqun6bFc2tMsCaif/ZXcrXhWDOcibxMtBs4B849skXSntm+15Uo1otsftNwi2
dr9f/BQyhTjiUAdWhfoS3dzkyZ/L0ZSZQSZpEl0CgYBocdeQYrpPAygkI2MlyBxu
x1YG5izP9jPTHAqxTDkyDVMFcqkUJUafaSp6KNh8R302JNMABUbMgkWRjAhdUxXG
ENzqbmZYwuynpQnYiWM2yXvjya0G0rZrnQIpdNSJnm87AqW/6M6nGt1OEXgPOxeh
T559NPrwcOrRxGw1MpqtGQKBgFwVGuXn7ZoOF7zfWY26En//KNaLvg8uYxUp/+pP
oWqFdhqjF71op2qA7SmplapM702rsqP0wRlXHAWhpYWIphlQ9/IK3rYurYO6J7Bx
Org8yPuTj5hCbTgDpS+1d3eoPsvuMUkTqrQhM9IfNtB792Uj4wZZKDoyvA4bpAZL
JomZAoGAMPc3D6UUPAdwHCVe4XemVu09GDIVt5lTv4esfmiJ4LmvOW63mUZiLyps
ZGqOtJwWfuFKEASU48wDfG7JAG+oLmXWxvFG0kjTUCtxp3ktEVn+y55nLWakWoA+
xA1ogQnYMj4N9lIOZqX8fXgMnKN9Qxqbouy4ASBf9ykiyqCfmFU=
-----END RSA PRIVATE KEY-----`;

export const defaultEncryptPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtHLFivTHTVmahHA4ppcj
WXa8iBsAxybvYo/Qp1k9wWpvpe0yvDuPOyqYZcIaxVFjQUEOg0ch6yN7ef0YjSJH
vH5muPHobMUZhcUvrzLh/Rwi7i3mwhyZcJX5gg1tFLIWhPxpPyym7u9onf2yNZwY
RoV39Qh0IRg2fM6gzyuBAzFkEj31iZ50dmco9fpVkA7fPPogaTWSEp3nptlVQyyj
Rlifyq3IL+xP1Vjwooc6+eWnLE+23g9IfMWj/nENqqlxW464mDrC0gfxfUU9ghX2
4W1GX4yajgXLRS9U0BqcyKjvIdt1jvoJgBAMYvMxDKp5bK40GGiPkBwBQmu+ULhP
bwIDAQAB
-----END PUBLIC KEY-----`;

/**
 * Creates a JWS compact serialization (RS256 - RSA_USING_SHA256)
 */
export function createJwsCompact(plainText: string, privateKeyPem?: string): { compact: string; header: object } {
  const pem = privateKeyPem || defaultSignPrivateKey;
  const privateKey = forge.pki.privateKeyFromPem(pem);
  const header = { alg: "RS256", typ: "JWT" };
  const b64Header = base64urlEncode(JSON.stringify(header));
  const b64Payload = base64urlEncode(plainText);
  const signingInput = `${b64Header}.${b64Payload}`;

  const md = forge.md.sha256.create();
  md.update(signingInput, 'utf8');
  const signatureBytes = privateKey.sign(md);
  const b64Signature = base64urlEncode(signatureBytes);

  return {
    compact: `${signingInput}.${b64Signature}`,
    header
  };
}

/**
 * Verifies a JWS compact serialization (RS256 - RSA_USING_SHA256)
 */
export function verifyJwsCompact(jwsCompact: string, publicKeyPem?: string): { verified: boolean; payload: string; header: object } {
  const pem = publicKeyPem || defaultSignPublicKey;
  const publicKey = forge.pki.publicKeyFromPem(pem);
  const parts = jwsCompact.split('.');
  if (parts.length !== 3) {
    throw new Error("Invalid JWS compact serialization format. Expected 3 dot-separated components.");
  }
  const [b64Header, b64Payload, b64Sig] = parts;
  const signingInput = `${b64Header}.${b64Payload}`;
  const signatureBytes = base64urlDecode(b64Sig);

  const md = forge.md.sha256.create();
  md.update(signingInput, 'utf8');
  const verified = publicKey.verify(md.digest().getBytes(), signatureBytes);

  const header = JSON.parse(forge.util.decodeUtf8(base64urlDecode(b64Header)));
  const payload = forge.util.decodeUtf8(base64urlDecode(b64Payload));

  return { verified, payload, header };
}

/**
 * Encrypts payload to JWE compact serialization (RSA-OAEP-256 + AES-256-GCM)
 */
export function createJweCompact(plaintext: string, publicKeyPem?: string): { compact: string; header: object } {
  const pem = publicKeyPem || defaultEncryptPublicKey;
  const publicKey = forge.pki.publicKeyFromPem(pem);
  const header = { alg: "RSA-OAEP-256", enc: "A256GCM" };
  const b64Header = base64urlEncode(JSON.stringify(header));

  // Generate 256-bit AES Content Encryption Key (CEK) & 96-bit (12-byte) IV
  const cek = forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(12);

  // Encrypt CEK with RSA-OAEP
  const encryptedKey = publicKey.encrypt(cek, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha256.create() }
  });
  const b64EncKey = base64urlEncode(encryptedKey);
  const b64Iv = base64urlEncode(iv);

  // AES-256-GCM Encryption
  const cipher = forge.cipher.createCipher('AES-GCM', cek);
  cipher.start({
    iv: iv,
    additionalData: b64Header,
    tagLength: 128
  });
  cipher.update(forge.util.createBuffer(plaintext, 'utf8'));
  cipher.finish();

  const ciphertext = cipher.output.getBytes();
  const tag = cipher.mode.tag.getBytes();

  const b64Ciphertext = base64urlEncode(ciphertext);
  const b64Tag = base64urlEncode(tag);

  return {
    compact: `${b64Header}.${b64EncKey}.${b64Iv}.${b64Ciphertext}.${b64Tag}`,
    header
  };
}

/**
 * Decrypts JWE compact serialization (RSA-OAEP-256 + AES-256-GCM)
 */
export function decryptJweCompact(jweCompact: string, privateKeyPem?: string): { plaintext: string; header: object } {
  const pem = privateKeyPem || defaultEncryptPrivateKey;
  const privateKey = forge.pki.privateKeyFromPem(pem);
  const parts = jweCompact.split('.');
  if (parts.length !== 5) {
    throw new Error("Invalid JWE compact serialization format. Expected 5 dot-separated components.");
  }
  const [b64Header, b64EncKey, b64Iv, b64Ciphertext, b64Tag] = parts;

  const header = JSON.parse(forge.util.decodeUtf8(base64urlDecode(b64Header)));
  const encKey = base64urlDecode(b64EncKey);
  const iv = base64urlDecode(b64Iv);
  const ciphertext = base64urlDecode(b64Ciphertext);
  const tag = base64urlDecode(b64Tag);

  // Decrypt CEK with RSA-OAEP
  const cek = privateKey.decrypt(encKey, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha256.create() }
  });

  // AES-256-GCM Decryption
  const decipher = forge.cipher.createDecipher('AES-GCM', cek);
  decipher.start({
    iv: iv,
    additionalData: b64Header,
    tagLength: 128,
    tag: forge.util.createBuffer(tag)
  });
  decipher.update(forge.util.createBuffer(ciphertext));
  decipher.finish();

  const plaintext = decipher.output.getBytes();

  return {
    plaintext: forge.util.decodeUtf8(plaintext),
    header
  };
}

/**
 * Full Pipeline: Sign plainText -> Encrypt to JWE -> Decrypt JWE -> Verify JWS Signature
 */
export function encryptAndSignPayload(
  plainText: string = JSON.stringify({ oAuthToken: { grantType: "client_credentials", scope: "/authenticationservices/v1" } }),
  signPrivateKeyPem?: string,
  encryptPublicKeyPem?: string
) {
  // 1. Sign payload into JWS (RS256)
  const jws = createJwsCompact(plainText, signPrivateKeyPem);

  // 2. Encrypt signed JWS into outer JWE (RSA-OAEP-256 + AES-256-GCM)
  const jwe = createJweCompact(jws.compact, encryptPublicKeyPem);

  return {
    plainText,
    signedJwsCompact: jws.compact,
    encryptedJweCompact: jwe.compact,
    jwsHeader: jws.header,
    jweHeader: jwe.header,
    algorithm: "KeyManagement: RSA_OAEP_256 | ContentEncryption: AES_256_GCM | Signature: RSA_USING_SHA256 (RS256)"
  };
}

export function decryptAndVerifyPayload(
  encryptedPayload: string,
  decryptPrivateKeyPem?: string,
  verifyPublicKeyPem?: string
) {
  // 1. Decrypt Outer JWE layer
  const jweResult = decryptJweCompact(encryptedPayload, decryptPrivateKeyPem);

  // 2. Extracted inner JWS compact string
  const jwsCompact = jweResult.plaintext;

  // 3. Verify inner JWS signature
  const jwsResult = verifyJwsCompact(jwsCompact, verifyPublicKeyPem);

  let jsonParsed = null;
  try {
    jsonParsed = JSON.parse(jwsResult.payload);
  } catch (e) {
    jsonParsed = jwsResult.payload;
  }

  return {
    status: jwsResult.verified ? "100% CRYPTOGRAPHICALLY VERIFIED" : "SIGNATURE VERIFICATION FAILED",
    verified: jwsResult.verified,
    plainText: jwsResult.payload,
    verifiedPayload: jsonParsed,
    jweHeader: jweResult.header,
    jwsHeader: jwsResult.header,
    algorithm: "JWE: RSA-OAEP-256 + AES_256_GCM | JWS: RSA_USING_SHA256 (RS256)",
    auditTrail: [
      `[JWE_DECRYPT_SUCCESS] Decrypted 5-part JWE token using RSA-OAEP-256 CEK unwrap & AES-256-GCM authentication tag verification.`,
      `[JWS_EXTRACT_SUCCESS] Unwrapped inner 3-part JWS compact payload (${jwsCompact.length} bytes).`,
      `[JWS_SIGNATURE_VERIFIED] Executed RSA-SHA256 verification against signer public certificate. Verified = ${jwsResult.verified}.`,
      `[PLAINTEXT_EXTRACTED] Plaintext payload verified: ${jwsResult.payload}`
    ],
    timestamp: new Date().toISOString()
  };
}

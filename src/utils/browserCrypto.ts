/**
 * Browser-Safe Cryptographic Utilities
 * Zero Node.js 'crypto' dependencies to ensure 100% client bundle compatibility.
 */

// Pure JS Synchronous SHA-256 implementation
function sha256Sync(ascii: string | Uint8Array): Uint8Array {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i = 0, j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = typeof ascii === 'string' ? ascii[lengthProperty] * 8 : ascii[lengthProperty] * 8;

  // Initial hash values: first 32 bits of the fractional parts of the square roots of the first 8 primes
  let hash: number[] = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  const k: number[] = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0x0bef9a3f, 0xc67178f2
  ];

  const bytes = typeof ascii === 'string'
    ? new TextEncoder().encode(ascii)
    : ascii;

  for (i = 0; i < bytes.length; i++) {
    words[i >> 2] |= bytes[i] << ((3 - (i % 4)) * 8);
  }

  words[bytes.length >> 2] |= 0x80 << ((3 - (bytes.length % 4)) * 8);
  words[(((bytes.length + 8) >> 6) << 4) + 15] = bytes.length * 8;

  const w: number[] = new Array(64);

  for (i = 0; i < words.length; i += 16) {
    let [a, b, c, d, e, f, g, h] = hash;

    for (j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[i + j] | 0;
      } else {
        const gamma0 = ((w[j - 15] >>> 7) | (w[j - 15] << 25)) ^
          ((w[j - 15] >>> 18) | (w[j - 15] << 14)) ^
          (w[j - 15] >>> 3);
        const gamma1 = ((w[j - 2] >>> 17) | (w[j - 2] << 15)) ^
          ((w[j - 2] >>> 19) | (w[j - 2] << 13)) ^
          (w[j - 2] >>> 10);
        w[j] = ((w[j - 16] + gamma0 + w[j - 7] + gamma1) | 0);
      }

      const sigma0 = ((a >>> 2) | (a << 30)) ^
        ((a >>> 13) | (a << 19)) ^
        ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (sigma0 + maj) | 0;

      const sigma1 = ((e >>> 6) | (e << 26)) ^
        ((e >>> 11) | (e << 21)) ^
        ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + sigma1 + ch + k[j] + w[j]) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  const out = new Uint8Array(32);
  for (i = 0; i < 8; i++) {
    out[i * 4] = (hash[i] >>> 24) & 0xff;
    out[i * 4 + 1] = (hash[i] >>> 16) & 0xff;
    out[i * 4 + 2] = (hash[i] >>> 8) & 0xff;
    out[i * 4 + 3] = hash[i] & 0xff;
  }
  return out;
}

/**
 * Generate cryptographically secure or high-entropy random bytes in browser
 */
export function browserRandomBytes(size: number): Uint8Array {
  const array = new Uint8Array(size);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < size; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return array;
}

/**
 * Generate random hex string
 */
export function browserRandomHex(bytes: number): string {
  const buf = browserRandomBytes(bytes);
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate UUID v4 in browser safely
 */
export function browserRandomUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Convert string or Uint8Array to base64url
 */
export function toBase64Url(data: string | Uint8Array): string {
  let str = '';
  if (typeof data === 'string') {
    str = btoa(unescape(encodeURIComponent(data)));
  } else {
    let binary = '';
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    str = btoa(binary);
  }
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Convert string or Uint8Array to standard base64
 */
export function toBase64(data: string | Uint8Array): string {
  if (typeof data === 'string') {
    return btoa(unescape(encodeURIComponent(data)));
  }
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}

/**
 * Compute synchronous SHA-256 in hex
 */
export function sha256Hex(data: string | Uint8Array): string {
  const bytes = sha256Sync(data);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute synchronous SHA-256 in base64url
 */
export function sha256Base64Url(data: string | Uint8Array): string {
  const bytes = sha256Sync(data);
  return toBase64Url(bytes);
}

/**
 * Compute synchronous HMAC-SHA256 (pure JS)
 */
export function hmacSha256Sync(key: string, message: string): Uint8Array {
  const blockSize = 64;
  let keyBytes: Uint8Array = new TextEncoder().encode(key);
  if (keyBytes.length > blockSize) {
    keyBytes = new Uint8Array(sha256Sync(keyBytes));
  }
  const paddedKey = new Uint8Array(blockSize);
  paddedKey.set(keyBytes);

  const oPad = new Uint8Array(blockSize);
  const iPad = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    oPad[i] = paddedKey[i] ^ 0x5c;
    iPad[i] = paddedKey[i] ^ 0x36;
  }

  const msgBytes = new TextEncoder().encode(message);
  const inner = new Uint8Array(blockSize + msgBytes.length);
  inner.set(iPad, 0);
  inner.set(msgBytes, blockSize);
  const innerHash = sha256Sync(inner);

  const outer = new Uint8Array(blockSize + 32);
  outer.set(oPad, 0);
  outer.set(innerHash, blockSize);
  return sha256Sync(outer);
}

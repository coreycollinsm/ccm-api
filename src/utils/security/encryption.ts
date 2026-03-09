import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not set");
}

// Must be exactly 32 bytes for AES-256
const KEY = Buffer.from(ENCRYPTION_KEY, "base64");

if (KEY.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be 32 bytes (Base64-encoded)");
}

export function encryptString(plaintext: string): Buffer {
  const iv = randomBytes(12); // recommended for GCM
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]);
}

export function decryptString(ciphertext: Buffer): string {
  const iv = ciphertext.subarray(0, 12);
  const authTag = ciphertext.subarray(12, 28);
  const encrypted = ciphertext.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted, undefined, "utf8") + decipher.final("utf8");
}

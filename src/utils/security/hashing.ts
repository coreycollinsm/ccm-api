import { createHmac } from "node:crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
function getEmailHashSecret(): string {
  const secret = process.env.EMAIL_LOOKUP_KEY;
  if (!secret) {
    throw new Error("EMAIL_LOOKUP_KEY is not set");
  }
  return secret;
}
const EMAIL_HASH_SECRET = getEmailHashSecret();

/**
 * Deterministic lookup ID for normalized emails.
 * Uses a keyed hash so values are not reversible.
 */
export function createEmailLookupId(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  return createHmac("sha256", EMAIL_HASH_SECRET)
    .update(normalizedEmail, "utf8")
    .digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

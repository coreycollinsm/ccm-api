import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashString(string: string): Promise<string> {
  return bcrypt.hash(string, SALT_ROUNDS);
}

export async function comparePassword(
  string: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(string, hashedPassword);
}

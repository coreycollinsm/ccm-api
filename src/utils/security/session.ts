import crypto from "node:crypto";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthSession } from "../../models";

// Set the expiration rules
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export interface SessionPayload {
  sessionId: string;
  sessionExpiresAt: Date;
}

export const createSessionRecord = async (
  userId: mongoose.Types.ObjectId | string,
): Promise<SessionPayload> => {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const sessionExpiresAt = new Date(Date.now() + SESSION_TTL_MS);

  // Create a new session in the db
  const session = new AuthSession({
    userId,
    sessionId,
    expiresAt: sessionExpiresAt,
  });

  await session.save();

  console.log("📋 Session created in db");

  return { sessionId, sessionExpiresAt };
};

// Set the session cookie
export const setSessionCookie = (
  res: Response,
  session: SessionPayload,
): void => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = isProduction
    ? process.env.SESSION_COOKIE_DOMAIN ?? ".coreycollinsm.com"
    : undefined;
  console.log("🍪 Setting cookie...");

  res.cookie("sessionId", session.sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: session.sessionExpiresAt,
    path: "/",
    domain: cookieDomain,
  });
};

export const getSessionIdFromCookie = (req: Request): string | null => {
  const rawCookie = req.headers.cookie;
  if (!rawCookie) return null;

  const cookies = rawCookie.split(";");
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split("=");
    if (name === "sessionId") {
      const value = rest.join("=");
      return value.length > 0 ? decodeURIComponent(value) : null;
    }
  }

  return null;
};

export const clearSessionCookie = (res: Response): void => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = isProduction
    ? process.env.SESSION_COOKIE_DOMAIN ?? ".coreycollinsm.com"
    : undefined;

  res.clearCookie("sessionId", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    domain: cookieDomain,
  });
};

export const deleteSessionAndCookie = async (
  req: Request,
  res: Response,
): Promise<boolean> => {
  const sessionId = getSessionIdFromCookie(req);

  clearSessionCookie(res);

  if (!sessionId) {
    return false;
  }

  const deletedSession = await AuthSession.findOneAndDelete({ sessionId });
  return Boolean(deletedSession);
};

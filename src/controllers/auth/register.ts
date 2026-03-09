import crypto from "node:crypto";
import { Request, Response } from "express";
import { AuthSession, User } from "../../models";
import {
  createEmailLookupId,
  encryptString,
  hashPassword,
  sendError,
  sendSuccess,
  validatePasswordComplexity,
} from "../../utils";
import { formatUserResponse } from "./me";

// The register submission payload we expect
interface RegisterSubmission {
  email: string;
  password: string;
}

// Helper function to compare the received payload to expected
const isRegisterSubmission = (
  payload: unknown,
): payload is RegisterSubmission => {
  if (!payload || typeof payload !== "object") return false;

  const submission = payload as Partial<RegisterSubmission>;
  return (
    typeof submission.email === "string" &&
    submission.email.length > 0 &&
    typeof submission.password === "string" &&
    submission.password.length > 0
  );
};

// Register endpoint
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📨 Received new user registration payload:", req.body);

    if (!isRegisterSubmission(req.body)) {
      console.error("❌ Invalid register submission payload:", req.body);
      sendError(
        res,
        "Invalid register submission payload",
        { expected: "email, password" },
        400,
      );
      return;
    }

    const submission: RegisterSubmission = req.body;
    const { email, password } = submission;

    const normalizedEmail = email.trim().toLowerCase();

    // Password validation
    const passwordValidation = validatePasswordComplexity(password);
    if (!passwordValidation.isValid) {
      sendError(res, passwordValidation.error ?? "Invalid password", null, 400);
      return;
    }

    // Security transforms
    const emailHash = createEmailLookupId(normalizedEmail);
    const passwordHash = await hashPassword(password);

    // Check if user already exists
    const existingUser = await User.findOne({ emailHash });
    if (existingUser) {
      sendError(res, "User with this email already exists", null, 409);
      return;
    }

    // Encrypt data
    const encryptedEmail = encryptString(normalizedEmail);

    // Create user
    const user = new User({
      email: encryptedEmail,
      emailHash,
      password: passwordHash,
      role: "standard",
    });

    await user.save();

    console.log("👤 User created in db");

    // Create the sessionId and expiration
    const sessionId = crypto.randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    // Create the session entry
    const session = new AuthSession({
      userId: user._id,
      sessionId,
      expiresAt: sessionExpiresAt,
    });

    await session.save();

    console.log("📋 Session created in db");

    // Set secure and samesite in production
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      expires: sessionExpiresAt,
      path: "/",
    });

    console.log("✅ User creation successful");

    sendSuccess(
      res,
      "User created successfully",
      { user: formatUserResponse(user) },
      201,
    );
  } catch (error) {
    console.error("Registration error:", error);
    sendError(res, "Internal server error", error, 500);
  }
};

import { Request, Response } from "express";
import { User } from "../../models";
import {
  createEmailLookupId,
  createSessionRecord,
  sendError,
  sendSuccess,
  setSessionCookie,
  verifyPassword,
} from "../../utils";
import { formatUserResponse } from "./me";

interface LoginSubmission {
  email: string;
  password: string;
}

const isLoginSubmission = (payload: unknown): payload is LoginSubmission => {
  if (!payload || typeof payload !== "object") return false;

  const submission = payload as Partial<LoginSubmission>;
  return (
    typeof submission.email === "string" &&
    submission.email.length > 0 &&
    typeof submission.password === "string" &&
    submission.password.length > 0
  );
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📄 Received new login payload:", req.body);

    if (!isLoginSubmission(req.body)) {
      sendError(
        res,
        "Invalid login submission payload",
        { expected: "email, password" },
        400,
      );
      console.log("❌ invalid login payload");
      return;
    }

    const { email, password } = req.body as LoginSubmission;
    const normalizedEmail = email.trim().toLowerCase();
    const emailHash = createEmailLookupId(normalizedEmail);

    const user = await User.findOne({ emailHash });
    if (!user) {
      console.log("👀 User not found...");
      sendError(res, "Invalid email or password", null, 401);
      return;
    }

    const passwordIsValid = await verifyPassword(password, user.password);
    if (!passwordIsValid) {
      console.log("👎 Incorrect password...");
      sendError(res, "Invalid email or password", null, 401);
      return;
    }
    console.log("🔑 Password is correct");

    const session = await createSessionRecord(user._id);
    setSessionCookie(res, session);

    console.log("✅ Login successful");
    sendSuccess(
      res,
      "Login successful",
      { user: formatUserResponse(user) },
      200,
    );
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Internal server error", error, 500);
  }
};

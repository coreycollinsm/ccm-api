import { Request, Response } from "express";
import { AuthSession, User } from "../../models";
import { sendError } from "../../utils/response";
import { decryptString } from "../../utils";

const getCookieValue = (req: Request, cookieName: string): string | null => {
  const rawCookie = req.headers.cookie;
  if (!rawCookie) {
    return null;
  }

  const cookies = rawCookie.split(";");
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split("=");
    if (name === cookieName) {
      const value = rest.join("=");
      return value.length > 0 ? decodeURIComponent(value) : null;
    }
  }

  return null;
};

export const formatUserResponse = (user: any) => {
  const email = decryptString(user.email);
  const role = user.role || "standard";

  return {
    id: user._id,
    email,
    role,
  };
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const sessionId = getCookieValue(req, "sessionId");
    if (!sessionId) {
      sendError(res, "Unauthorized", null, 401);
      return;
    }

    const session = await AuthSession.findOne({
      sessionId,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      sendError(res, "Unauthorized", null, 401);
      return;
    }

    const user = await User.findById(session.userId);

    if (!user) {
      sendError(res, "User not found", null, 404);
      return;
    }

    res.json(formatUserResponse(user));
  } catch (error) {
    console.error("Get user error:", error);
    sendError(res, "Internal server error", error, 500);
  }
};

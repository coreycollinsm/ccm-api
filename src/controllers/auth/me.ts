import { Request, Response } from "express";
import { User } from "../../models/UserModel";
import { sendError } from "../../utils/response";
import { decryptString } from "../../utils";

interface AuthRequest extends Request {
  userId?: string;
  user?: {
    userId?: string;
    id?: string;
  };
}

const extractUserId = (req: AuthRequest): string | null => {
  const bodyUserId =
    req.body &&
    typeof req.body === "object" &&
    typeof (req.body as { userId?: unknown }).userId === "string"
      ? (req.body as { userId: string }).userId
      : null;

  const resolvedUserId =
    req.userId ?? req.user?.userId ?? req.user?.id ?? bodyUserId;
  if (!resolvedUserId) {
    return null;
  }

  const trimmed = resolvedUserId.trim();
  return trimmed.length > 0 ? trimmed : null;
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
    const authReq = req as AuthRequest;
    const userId = extractUserId(authReq);
    if (!userId) {
      sendError(res, "Unauthorized", null, 401);
      return;
    }
    const user = await User.findById(userId);

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

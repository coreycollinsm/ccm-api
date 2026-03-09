import { Request, Response } from "express";
import { deleteSessionAndCookie, sendSuccess, sendError } from "../../utils";

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteSessionAndCookie(req, res);
    sendSuccess(res, "Logout successful", null, 200);
  } catch (error) {
    console.error("Logout error:", error);
    sendError(res, "Internal server error", error, 500);
  }
};

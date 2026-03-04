import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

const env = process.env.NODE_ENV || "production";

// Handle errors gracefully to avoid crashing app
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // CORS rejection message
  if (err.message === "Not allowed by CORS" || err.message.includes("CORS")) {
    return sendError(
      res,
      "Not allowed by CORS",
      null,
      403,
      env !== "production"
        ? `Origin ${req.headers.origin || "unknown"} is not allowed`
        : undefined,
    );
  }

  // Unknown and other errors
  console.error("Unhandled error:", err);
  sendError(
    res,
    "Internal server error",
    env !== "production" ? err.message : undefined,
    500,
    env !== "production" ? err.stack : undefined,
  );
}

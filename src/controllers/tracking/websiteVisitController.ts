import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/response";
import { WebsiteVisitor, Session } from "../../models/tracking/TrackingModels";

interface WebsiteVisitorPayload {
  consent: "implied" | "accepted" | "declined";
  consentTimestamp: Date;
}

const isWebsiteVisitorPayload = (
  payload: unknown,
): payload is WebsiteVisitorPayload => {
  // Ensure submission matches what's expected
  if (!payload || typeof payload !== "object") return false;

  const visitor = payload as Partial<WebsiteVisitorPayload>;

  return (
    typeof visitor.consent === "string" &&
    visitor.consent.length > 0 &&
    (typeof visitor.consentTimestamp === "string" ||
      visitor.consentTimestamp instanceof Date)
  );
};

export const createWebsiteVisitorRecord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("👤 Visitor payload received:", req.body);
  try {
    // Confirm payload formatting matches expected
    if (!isWebsiteVisitorPayload(req.body)) {
      sendError(res, "Invalid visitor creation payload", null, 400);
      return;
    }

    const websiteVisitor = await WebsiteVisitor.create({});
    // Convert to a plain string for the frontend
    const trackingId = websiteVisitor._id.toString();

    console.log("✅ Successful creation of new website visitor");

    sendSuccess(
      res,
      "Website visitor recorded successfully",
      { trackingId },
      201,
    );
  } catch (err) {
    console.error(
      "🔥 Unexpected server error in createWebsiteVisitorRecord:",
      err,
    );

    sendError(res, "Failed to record website visitor", err, 500);
  }
};

interface CreateSessionPayload {
  trackingId: string;
}

const isCreateSessionPayload = (
  payload: unknown,
): payload is CreateSessionPayload => {
  // Ensure submission matches what's expected
  if (!payload || typeof payload !== "object") return false;

  const session = payload as Partial<CreateSessionPayload>;

  return (
    typeof session.trackingId === "string" && session.trackingId.length > 0
  );
};

export const createSessionRecord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("📄 Session payload received:", req.body);

  try {
    // Confirm payload formatting matches expected
    if (!isCreateSessionPayload(req.body)) {
      sendError(res, "Invalid session creation payload", null, 400);
      return;
    }

    // Extract the payload items
    const { trackingId } = req.body;

    const session = await Session.create({ trackingId });
    // Convert to a plain string for the frontend
    const sessionId = session._id.toString();

    console.log("✅ Successful creation of session record");

    sendSuccess(res, "Session recorded successfully", { sessionId }, 201);
  } catch (err) {
    console.error(
      "🔥 Unexpected server error in createWebsiteVisitorRecord:",
      err,
    );

    sendError(res, "Failed to record website visitor", err, 500);
  }
};

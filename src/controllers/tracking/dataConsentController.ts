import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/response";
import {
  WebsiteVisitor,
  Session,
  OptOut,
} from "../../models/tracking/TrackingModels";

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

interface ConcentOptOutPayload {
  trackingId?: string;
}

const isConcentOptOutPayload = (
  payload: unknown,
): payload is ConcentOptOutPayload => {
  // Ensure submission matches what's expected
  if (!payload || typeof payload !== "object") return false;

  const optOut = payload as Partial<ConcentOptOutPayload>;

  return typeof optOut.trackingId === "string";
};

export const consentOptOut = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("📵 Concent opt-out payload received:", req.body);
  try {
    // Confirm payload formatting matches expected
    if (!isConcentOptOutPayload(req.body)) {
      sendError(res, "Invalid consent opt-out payload", null, 400);
      return;
    }

    const { trackingId } = req.body;

    await WebsiteVisitor.deleteOne({
      _id: trackingId,
    });

    const optOutEntry = await OptOut.create({
      trackingId,
    });

    console.log("✅ Opted-out user:", optOutEntry);

    sendSuccess(res, "Website visitor opted-out successfully", null, 201);
  } catch (err) {
    console.error("🔥 Unexpected server error in consentOptOut:", err);

    sendError(res, "Failed to opt-out:", err, 500);
  }
};

interface ConcentOptInPayload {
  trackingId: string;
  timestamp: Date;
}

const isConcentOptInPayload = (
  payload: unknown,
): payload is ConcentOptInPayload => {
  // Ensure submission matches what's expected
  if (!payload || typeof payload !== "object") return false;

  const optIn = payload as Partial<ConcentOptInPayload>;

  return (
    typeof optIn.trackingId === "string" &&
    optIn.trackingId.length > 0 &&
    (typeof optIn.timestamp === "string" || optIn.timestamp instanceof Date)
  );
};

export const consentOptIn = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("☑️ Concent opt-in payload received:", req.body);
  try {
    // Confirm payload formatting matches expected
    if (!isConcentOptInPayload(req.body)) {
      sendError(res, "Invalid consent opt-in payload", null, 400);
      return;
    }

    const { trackingId, timestamp } = req.body;

    const updatedRecord = await WebsiteVisitor.updateOne(
      {
        _id: trackingId,
      },
      {
        $set: {
          consent: "accepted",
          consentTimestamp: timestamp,
        },
      },
    );

    const { acknowledged, matchedCount, modifiedCount } = updatedRecord;
    if (!acknowledged || matchedCount != modifiedCount) {
      console.error("Error updating opt-in record in db");
      sendError(res, "Error updating opt-in record in db", null, 500);
    }

    console.log("✅ Opted-in user:", trackingId);

    sendSuccess(res, "Website visitor opted-in successfully", null, 201);
  } catch (err) {
    console.error("🔥 Unexpected server error in consentOptIn:", err);

    sendError(res, "Failed to opt-in:", err, 500);
  }
};

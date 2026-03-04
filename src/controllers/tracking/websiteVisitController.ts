import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/response";
import { WebsiteVisit } from "../../models/tracking/WebsiteVisitModel";

interface WebsiteVisitPayload {
  source: string;
  placement?: string;
  timestamp: string | Date;
}

const isWebsiteVisitPayload = (
  payload: unknown,
): payload is WebsiteVisitPayload => {
  // Ensure submission matches what's expected
  if (!payload || typeof payload !== "object") return false;

  const visit = payload as Partial<WebsiteVisitPayload>;

  return (
    typeof visit.source === "string" &&
    (visit.placement === undefined || typeof visit.placement === "string") &&
    (typeof visit.timestamp === "string" || visit.timestamp instanceof Date)
  );
};

export const createWebsiteVisitRecord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Confirm payload formatting matches expected
    if (!isWebsiteVisitPayload(req.body)) {
      sendError(res, "Invalid website visit payload", null, 400);
      return;
    }

    // Extract the payload items
    const { source, placement, timestamp } = req.body;

    // Confirm provided timestamp is formatted correctly
    const parsedTimestamp = new Date(timestamp);
    if (Number.isNaN(parsedTimestamp.getTime())) {
      sendError(res, "Invalid timestamp", null, 400);
      return;
    }

    // Create the entry in the model
    const websiteVisit = await WebsiteVisit.create({
      source: source.trim(),
      placement: placement?.trim() ?? "",
      timestamp: parsedTimestamp,
    });

    console.log("✅ Successful recording of website visit");
    sendSuccess(
      res,
      "Website visit recorded successfully",
      { id: websiteVisit._id },
      201,
    );
  } catch (err) {
    console.error("🔥 Unexpected server error in createWebsiteVisit:", err);
    sendError(res, "Failed to record website visit", err, 500);
  }
};

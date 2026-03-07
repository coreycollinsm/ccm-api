import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/response";
import { PageView } from "../../models/tracking/PageViewModel";

interface PageViewPayload {
  sessionId: string;
  currentPage: string;
  prevPage: string;
  timestamp: string | Date;
}

const isPageViewPayload = (payload: unknown): payload is PageViewPayload => {
  // Ensure submission matches what's expected
  if (!payload || typeof payload !== "object") return false;

  const click = payload as Partial<PageViewPayload>;

  return (
    typeof click.sessionId === "string" &&
    click.sessionId.length > 0 &&
    typeof click.currentPage === "string" &&
    click.currentPage.length > 0 &&
    typeof click.prevPage === "string" &&
    click.prevPage.length > 0 &&
    (typeof click.timestamp === "string" || click.timestamp instanceof Date)
  );
};

export const createPageViewRecord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Confirm payload formatting matches expected
    if (!isPageViewPayload(req.body)) {
      sendError(res, "Invalid page view payload", null, 400);
      return;
    }

    // Extract the payload items
    const { sessionId, currentPage, prevPage, timestamp } = req.body;

    // Confirm provided timestamp is formatted correctly
    const parsedTimestamp = new Date(timestamp);
    if (Number.isNaN(parsedTimestamp.getTime())) {
      sendError(res, "Invalid timestamp", null, 400);
      return;
    }

    // Create the entry in the model
    const pageView = await PageView.create({
      sessionId,
      currentPage: currentPage.trim(),
      prevPage: prevPage.trim(),
      timestamp: parsedTimestamp,
    });

    console.log("✅ Successful recording of page view");
    sendSuccess(
      res,
      "Page view recorded successfully",
      { id: pageView._id },
      201,
    );
  } catch (err) {
    console.error("🔥 Unexpected server error in createPageViewRecord:", err);
    sendError(res, "Failed to record page view", err, 500);
  }
};

import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/response";
import { ButtonClick } from "../../models/tracking/ButtonClickModel";

interface ButtonClickPayload {
  page: string;
  buttonId: string;
  visitId: string;
  timestamp: string | Date;
}

const isButtonClickPayload = (
  payload: unknown,
): payload is ButtonClickPayload => {
  // Ensure submission matches what's expected
  if (!payload || typeof payload !== "object") return false;

  const visit = payload as Partial<ButtonClickPayload>;

  return (
    typeof visit.page === "string" &&
    visit.page.length > 0 &&
    typeof visit.buttonId === "string" &&
    visit.buttonId.length > 0 &&
    typeof visit.visitId === "string" &&
    visit.visitId.length > 0 &&
    (typeof visit.timestamp === "string" || visit.timestamp instanceof Date)
  );
};

export const createButtonClickRecord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Confirm payload formatting matches expected
    if (!isButtonClickPayload(req.body)) {
      sendError(res, "Invalid button click payload", null, 400);
      return;
    }

    // Extract the payload items
    const { page, buttonId, visitId, timestamp } = req.body;

    // Confirm provided timestamp is formatted correctly
    const parsedTimestamp = new Date(timestamp);
    if (Number.isNaN(parsedTimestamp.getTime())) {
      sendError(res, "Invalid timestamp", null, 400);
      return;
    }

    // Create the entry in the model
    const buttonClick = await ButtonClick.create({
      page: page.trim(),
      buttonId: buttonId.trim(),
      visitId: visitId.trim(),
      timestamp: parsedTimestamp,
    });

    console.log("✅ Successful recording of button click");
    sendSuccess(
      res,
      "Button click recorded successfully",
      { id: buttonClick._id },
      201,
    );
  } catch (err) {
    console.error(
      "🔥 Unexpected server error in createButtonClickRecord:",
      err,
    );
    sendError(res, "Failed to record button click", err, 500);
  }
};

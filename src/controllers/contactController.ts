import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { EmailBlacklist } from "../models/BlacklistModels";

// The contact submission payload we expect
interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

// Helper function to compare the received payload to expected
const isContactSubmission = (
  payload: unknown,
): payload is ContactSubmission => {
  if (!payload || typeof payload !== "object") return false;

  const submission = payload as Partial<ContactSubmission>;
  return (
    typeof submission.firstName === "string" &&
    typeof submission.lastName === "string" &&
    typeof submission.email === "string" &&
    typeof submission.company === "string" &&
    typeof submission.message === "string"
  );
};

// The contact submission logic
export const submitContactForm = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("📨 Received contact form submission payload:", req.body);

    if (!isContactSubmission(req.body)) {
      console.error("❌ Invalid contact form submission payload:", req.body);
      sendError(
        res,
        "Invalid contact form submission payload",
        { expected: "firstName, lastName, email, company, message" },
        400,
      );
      return;
    }

    // Extract the data fro the payload
    const { firstName, lastName, email, company, message } = req.body; // TODO will use this with an Asana project integration

    // 🔎 Search for blacklist entries for both full email + the domain
    const emailLower = email.toLowerCase(); // normalized for search
    const domain = email.split("@")[1]?.toLowerCase(); // extract normalized domain for search
    const match = await EmailBlacklist.findOne({
      entry: { $in: [domain, emailLower] },
    });

    // 🚫 Block the submission if blacklisted
    if (match) {
      console.log("🚫 Contact form submission blocked due to blacklisting");
      sendError(
        res,
        "That email or domain has been found on a blacklist",
        { blacklisted: true },
        403,
      );
      return;
    }

    // TODO use AI to check for spam automatically
    // TODO create an entry in a custom Asana project

    // Contact submission complete
    console.log("✅ Successfully received submission:", {
      firstName,
      email,
    });
    sendSuccess(res, "Successfully submitted contact form", undefined, 200);
  } catch (err) {
    console.error("🔥 Unexpected server error in submitForm:", err);
    sendError(res, "Failed to submit form", err, 500);
  }
};

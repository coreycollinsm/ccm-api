import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { EmailBlacklist } from "../models/BlacklistModels";
import { checkContactSpam } from "../utils/geminiSpamChecker";
import { createContactAsanaTask } from "../utils/asana";

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
    const submission: ContactSubmission = req.body;
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

    // 🔎 Ask Gemini if this looks like spam
    let spamCheckSuccessful = false;
    console.log("🛡️ Checking for spam with AI");

    try {
      const verdict = await checkContactSpam(submission);
      if (verdict.isSpam || !verdict.isSpam) spamCheckSuccessful = true;
      console.log("🔘 Spam verdict:", verdict);

      if (verdict.isSpam && verdict.confidence >= 0.7) {
        // 🚫 If it's confidently spam, reject and add to the blacklist
        // ⚠️ Leave domain blacklisting as manual for now to avoid blocking common domains (gmail)

        // Create the blacklist entry
        await EmailBlacklist.create({
          entry: emailLower,
          reason:
            verdict.reason ||
            `Gemini spam verdict (confidence: ${verdict.confidence})`,
        });

        // Log the blocked submission in the console
        console.log("🚫 Added blacklist entry due to spam verdict:", {
          entry: emailLower,
          confidence: verdict.confidence,
          reason: verdict.reason,
          flags: verdict.flags,
        });

        // Send failure response
        sendError(res, "Rejected: Suspected Spam", { spam: true }, 403);
        return;
      }
    } catch (spamCheckErr) {
      // If Gemini fails (like overloaded volume) don't fail the submission, just let it through
      console.error("⚠️ Gemini spam check failed, bypassing spam filter:", {
        error: spamCheckErr,
        email,
      });
    }

    // TODO create an entry in a custom Asana project
    await createContactAsanaTask({
      firstName,
      lastName,
      email: emailLower,
      company,
      message: spamCheckSuccessful ? message : `[BYPASS_SPAM_CHECK] ${message}`, // Set dynamically - if the spam filter failed I want to know in an Asana callout
    });

    // Contact submission complete
    console.log("✅ Successfully received submission into Asana:", {
      firstName,
      email,
    });
    sendSuccess(res, "Successfully submitted contact form", undefined, 200);
  } catch (err) {
    console.error("🔥 Unexpected server error in submitForm:", err);
    sendError(res, "Failed to submit form", err, 500);
  }
};

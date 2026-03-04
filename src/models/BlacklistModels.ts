import mongoose, { Schema, Document } from "mongoose";

// ✉️ Email Blacklist Model
export interface EmailBlacklistDocument extends Document {
  entry?: string; // "entry" because it can be email OR domain
  reason: string;
  createdAt: Date;
}

const EmailBlacklistSchema = new Schema<EmailBlacklistDocument>({
  entry: { type: String, required: true, index: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const EmailBlacklist = mongoose.model<EmailBlacklistDocument>(
  "EmailBlacklist",
  EmailBlacklistSchema,
);

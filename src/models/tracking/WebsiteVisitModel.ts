import mongoose, { Document, Schema } from "mongoose";

export interface WebsiteVisitDocument extends Document {
  source: string;
  placement?: string; // for social ads
  timestamp: Date;
  createdAt: Date;
}

const WebsiteVisitSchema = new Schema<WebsiteVisitDocument>({
  source: { type: String, required: true, trim: true, index: true },
  placement: { type: String, required: false, trim: true },
  timestamp: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const WebsiteVisit = mongoose.model<WebsiteVisitDocument>(
  "WebsiteVisit",
  WebsiteVisitSchema,
);

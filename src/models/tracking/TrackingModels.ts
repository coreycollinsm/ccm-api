import mongoose, { Document, Schema } from "mongoose";

export interface WebsiteVisitorDocument extends Document {
  consent: "implied" | "accepted" | "declined";
  consentTimestamp: Date;
  createdAt: Date;
}

const WebsiteVisitSchema = new Schema<WebsiteVisitorDocument>({
  consent: { type: String, required: true, default: "implied", index: true },
  consentTimestamp: { type: Date, default: () => new Date() },
  createdAt: { type: Date, default: () => new Date() },
});

export const WebsiteVisitor = mongoose.model<WebsiteVisitorDocument>(
  "WebsiteVisitor",
  WebsiteVisitSchema,
);

export interface SessionDocument extends Document {
  trackingId: String;
  createdAt: Date;
}

const SessionSchema = new Schema<SessionDocument>({
  trackingId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const Session = mongoose.model<SessionDocument>(
  "TrackingSession",
  SessionSchema,
);

export interface OptOutDocument extends Document {
  trackingId?: String;
  createdAt: Date;
}

const OptOutSchema = new Schema<OptOutDocument>({
  trackingId: { type: String, required: false, index: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const OptOut = mongoose.model<OptOutDocument>("OptOut", OptOutSchema);

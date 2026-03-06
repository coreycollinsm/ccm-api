import mongoose, { Document, Schema } from "mongoose";

export interface WebsiteVisitorDocument extends Document {
  createdAt: Date;
}

const WebsiteVisitSchema = new Schema<WebsiteVisitorDocument>({
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
  trackingId: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const Session = mongoose.model<SessionDocument>(
  "TrackingSession",
  SessionSchema,
);

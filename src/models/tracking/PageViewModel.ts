import mongoose, { Document, Schema } from "mongoose";

export interface PageViewDocument extends Document {
  sessionId: string;
  currentPage: string;
  prevPage: string;
  timestamp: Date;
  createdAt: Date;
}

const PageViewDocumentSchema = new Schema<PageViewDocument>({
  sessionId: { type: String, required: true, trim: true, index: true },
  currentPage: { type: String, required: true, trim: true, index: true },
  prevPage: { type: String, required: true, trim: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const PageView = mongoose.model<PageViewDocument>(
  "PageView",
  PageViewDocumentSchema,
);

import mongoose, { Document, Schema } from "mongoose";

export interface ButtonClickDocument extends Document {
  page: string;
  buttonId: string;
  sessionId: string;
  timestamp: Date;
  createdAt: Date;
}

const ButtonClickRecordSchema = new Schema<ButtonClickDocument>({
  page: { type: String, required: true, trim: true, index: true },
  buttonId: { type: String, required: true, trim: true, index: true },
  sessionId: { type: String, required: true, trim: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const ButtonClick = mongoose.model<ButtonClickDocument>(
  "ButtonClickRecord",
  ButtonClickRecordSchema,
);

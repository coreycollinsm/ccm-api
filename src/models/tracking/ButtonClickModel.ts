import mongoose, { Document, Schema } from "mongoose";

export interface ButtonClickDocument extends Document {
  page: string;
  buttonId: string;
  visitId?: string;
  timestamp: Date;
  createdAt: Date;
}

const ButtonClickRecordSchema = new Schema<ButtonClickDocument>({
  page: { type: String, required: true, trim: true, index: true },
  buttonId: { type: String, required: true, trim: true, index: true },
  visitId: { type: String, required: false, trim: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const ButtonClick = mongoose.model<ButtonClickDocument>(
  "ButtonClickRecord",
  ButtonClickRecordSchema,
);

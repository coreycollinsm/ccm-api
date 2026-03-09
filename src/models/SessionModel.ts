import mongoose, { Schema } from "mongoose";

export interface AuthSessionDocument {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const AuthSession = mongoose.model<AuthSessionDocument>(
  "AuthSession",
  sessionSchema,
);

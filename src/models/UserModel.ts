import mongoose, { Schema } from "mongoose";

export interface User {
  email: Buffer;
  emailHash: string;
  password: string;
  role: "admin" | "standard";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: {
      type: Buffer,
      required: true,
    },
    emailHash: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "standard"],
      default: "standard",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<User>("User", userSchema);

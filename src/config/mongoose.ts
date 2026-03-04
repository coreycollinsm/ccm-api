import mongoose from "mongoose";

// Locally hosted for development
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

export const connectMongoose = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: process.env.NODE_ENV === "development" ? "ccm-dev" : "ccm-prod", // Dynamic db name based on dev vs prod
    });

    console.log("✅ Connected to MongoDB via Mongoose");
  } catch (err) {
    console.error("❌ Mongoose connection error:", err);
    process.exit(1);
  }
};

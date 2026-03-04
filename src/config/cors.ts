import cors from "cors";

const env = process.env.NODE_ENV || "production";

// Begin Config
const allowedOrigins =
  env === "development"
    ? ["http://localhost:3000"] // Default port for NextJS
    : ["https://coreycollinsm.com"];

console.log("Allowed Origins:", allowedOrigins); // Log in the console on start

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || !allowedOrigins.includes(origin)) {
      console.warn(`CORS: Rejected origin: ${origin}`);
      callback(null, false); // ❌ reject origin
    } else {
      callback(null, true); // ✔️ accept origin
    }
  },
  credentials: true, // TODO planning to showcase some authentication but this isn't built yet
});

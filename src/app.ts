import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { sendError } from "./utils/response";
import { corsMiddleware } from "./config/cors";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

// Middleware
app.use(corsMiddleware); // Origin restrictions
app.use(express.json()); // Express JSON init
app.use(morgan("dev")); // Minimal console logging
app.use(errorHandler); // Avoid crash on errors
app.use("/", routes); // Routes

// 404 Error Handler
app.use((req: Request, res: Response) => {
  sendError(res, "Route not found", null, 404);
});

export default app;

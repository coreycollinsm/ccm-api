import { Router } from "express";
import health from "./health";

const router = Router();

// Routes begin here
router.use("/health", health);
// TODO Contact Route (contact form submissions)
// TODO Tracking routes for website visits and button clicks

export default router;

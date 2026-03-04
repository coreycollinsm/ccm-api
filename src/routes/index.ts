import { Router } from "express";

// Route file imports
import contactRoutes from "./contactRoutes";
import health from "./health";

const router = Router();

// Routes begin here
router.use("/contact", contactRoutes);
router.use("/health", health);
// TODO Tracking routes for website visits and button clicks

export default router;

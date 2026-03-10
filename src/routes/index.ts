import { Router } from "express";

// Route file imports
import health from "./health";
import authRoutes from "./authRoutes";
import contactRoutes from "./contactRoutes";
import trackingRoutes from "./trackingRoutes";

const router = Router();

router.use("/health", health);

// Routes begin here
router.use("/auth", authRoutes); // authentication and authorization
router.use("/contact", contactRoutes); // contact form submissions
router.use("/tracking", trackingRoutes); // any web tracking routes

export default router;

import { Router } from "express";

// Route file imports
import health from "./health";
import contactRoutes from "./contactRoutes";
import trackingRoutes from "./trackingRoutes";

const router = Router();

router.use("/health", health);

// Routes begin here
router.use("/contact", contactRoutes); // contact form submissions
router.use("/tracking", trackingRoutes); // any web tracking routes

export default router;

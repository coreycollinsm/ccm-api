import { Router } from "express";
import health from "./health";

const router = Router();

// Routes begin here
router.use("/health", health);

export default router;

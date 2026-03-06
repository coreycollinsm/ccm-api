import { Router } from "express";

import { createButtonClickRecord } from "../controllers/tracking/buttonClickController";
import {
  createWebsiteVisitorRecord,
  createSessionRecord,
} from "../controllers/tracking/websiteVisitController";

const router = Router();

router.post("/button-clicks", createButtonClickRecord);
router.post("/site-visitors", createWebsiteVisitorRecord);
router.post("/site-sessions", createSessionRecord);

export default router;

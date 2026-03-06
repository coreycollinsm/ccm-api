import { Router } from "express";

import { createButtonClickRecord } from "../controllers/tracking/buttonClickController";
import {
  consentOptOut,
  createWebsiteVisitorRecord,
  createSessionRecord,
} from "../controllers/tracking/dataConsentController";

const router = Router();

router.post("/button-clicks", createButtonClickRecord);
router.post("/site-visitors", createWebsiteVisitorRecord);
router.post("/site-sessions", createSessionRecord);
router.post("/opt-out", consentOptOut);

export default router;

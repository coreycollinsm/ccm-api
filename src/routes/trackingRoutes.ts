import { Router } from "express";

import {
  consentOptOut,
  createWebsiteVisitorRecord,
  createSessionRecord,
  consentOptIn,
} from "../controllers/tracking/dataConsentController";

import { createButtonClickRecord } from "../controllers/tracking/buttonClickController";
import { createPageViewRecord } from "../controllers/tracking/pageViewController";

const router = Router();

// Consent
router.post("/opt-out", consentOptOut);
router.post("/opt-in", consentOptIn);

// Trackers
router.post("/button-clicks", createButtonClickRecord);
router.post("/site-visitors", createWebsiteVisitorRecord);
router.post("/site-sessions", createSessionRecord);
router.post("/page-views", createPageViewRecord);

export default router;

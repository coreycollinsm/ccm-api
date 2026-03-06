import { Router } from "express";

import { createButtonClickRecord } from "../controllers/tracking/buttonClickController";
import {
  consentOptOut,
  createWebsiteVisitorRecord,
  createSessionRecord,
  consentOptIn,
} from "../controllers/tracking/dataConsentController";

const router = Router();

router.post("/button-clicks", createButtonClickRecord);
router.post("/site-visitors", createWebsiteVisitorRecord);
router.post("/site-sessions", createSessionRecord);
router.post("/opt-out", consentOptOut);
router.post("/opt-in", consentOptIn);

export default router;

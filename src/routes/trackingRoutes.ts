import { Router } from "express";

import { createButtonClickRecord } from "../controllers/tracking/buttonClickController";
import { createWebsiteVisitRecord } from "../controllers/tracking/websiteVisitController";

const router = Router();

router.post("/button-click", createButtonClickRecord);
router.post("/website-visit", createWebsiteVisitRecord);

export default router;

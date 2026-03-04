import { Router } from "express";
import { sendSuccess } from "../utils/response";

const router = Router();

router.get("/", (req, res) => {
  sendSuccess(res, "Service is healthy", {
    status: "healthy",
    timeStamp: new Date().toISOString(),
  });
});

export default router;

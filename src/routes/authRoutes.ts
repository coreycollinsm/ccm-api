import { Router } from "express";
import { register, getCurrentUser } from "../controllers";

const router = Router();

// Unprotected
router.post("/register", register);

// TODO Protected Route
router.post("/me", getCurrentUser);

export default router;

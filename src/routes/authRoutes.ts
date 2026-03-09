import { Router } from "express";
import { getCurrentUser, login, register } from "../controllers";

const router = Router();

// Unprotected
router.post("/register", register);
router.post("/login", login);

// TODO Protected Route
router.get("/me", getCurrentUser);

export default router;

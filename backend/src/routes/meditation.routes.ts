import { Router } from "express";
import {
  createSession,
  getSessions,
} from "../controllers/meditation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All meditation routes are protected
router.use(authMiddleware);

// POST /api/meditation
router.post("/", createSession);

// GET /api/meditation
router.get("/", getSessions);

export default router;
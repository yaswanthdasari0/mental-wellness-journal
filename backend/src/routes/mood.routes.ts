import { Router } from "express";
import {
  createMood,
  getMoods,
  getMoodById,
  updateMood,
  deleteMood,
} from "../controllers/mood.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All mood routes are protected — user must be logged in
router.use(authMiddleware);

// POST /api/moods
router.post("/", createMood);

// GET /api/moods
router.get("/", getMoods);

// GET /api/moods/:id
router.get("/:id", getMoodById);

// PUT /api/moods/:id
router.put("/:id", updateMood);

// DELETE /api/moods/:id
router.delete("/:id", deleteMood);

export default router;
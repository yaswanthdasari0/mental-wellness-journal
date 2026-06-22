import { Router } from "express";
import {
  createMood,
  getMoods,
  getTodayMood,
} from "../controllers/mood.controller";

const router = Router();

// POST /api/mood
router.post("/", createMood);

// GET /api/mood
router.get("/", getMoods);

// GET /api/mood/today
router.get("/today", getTodayMood);

export default router;
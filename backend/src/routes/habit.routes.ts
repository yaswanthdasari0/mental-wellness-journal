import { Router } from "express";
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
} from "../controllers/habit.controller";

const router = Router();

// POST /api/habits
router.post("/", createHabit);

// GET /api/habits
router.get("/", getHabits);

// PUT /api/habits/:id
router.put("/:id", updateHabit);

// DELETE /api/habits/:id
router.delete("/:id", deleteHabit);

// POST /api/habits/:id/toggle
router.post("/:id/toggle", toggleHabitCompletion);

export default router;
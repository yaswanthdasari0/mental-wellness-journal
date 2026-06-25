import { Router } from "express";
import {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
} from "../controllers/habit.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All habit routes are protected
router.use(authMiddleware);

// POST /api/habits
router.post("/", createHabit);

// GET /api/habits
router.get("/", getHabits);

// GET /api/habits/:id
router.get("/:id", getHabitById);

// PUT /api/habits/:id
router.put("/:id", updateHabit);

// DELETE /api/habits/:id
router.delete("/:id", deleteHabit);

// POST /api/habits/:id/toggle  ← mark/unmark today's completion
router.post("/:id/toggle", toggleHabitCompletion);

export default router;
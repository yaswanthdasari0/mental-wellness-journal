import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createHabitService,
  getHabitsService,
  getHabitByIdService,
  updateHabitService,
  deleteHabitService,
  toggleHabitCompletionService,
} from "../services/habit.service";

// ── POST /api/habits ───────────────────────────────────

export const createHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      res.status(400).json({ message: "Habit name is required." });
      return;
    }

    const habit = await createHabitService({ name: name.trim(), userId });

    res.status(201).json({ message: "Habit created.", habit });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to create habit." });
  }
};

// ── GET /api/habits ────────────────────────────────────

export const getHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const habits = await getHabitsService(userId);
    res.status(200).json({ habits });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch habits." });
  }
};

// ── GET /api/habits/:id ────────────────────────────────

export const getHabitById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const habit = await getHabitByIdService(id, userId);
    res.status(200).json({ habit });
  } catch (error: any) {
    const notFound = error.message === "Habit not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};

// ── PUT /api/habits/:id ────────────────────────────────

export const updateHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      res.status(400).json({ message: "Habit name is required." });
      return;
    }

    const updated = await updateHabitService(id, userId, { name: name.trim() });
    res.status(200).json({ message: "Habit updated.", habit: updated });
  } catch (error: any) {
    const notFound = error.message === "Habit not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};

// ── DELETE /api/habits/:id ─────────────────────────────

export const deleteHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const result = await deleteHabitService(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    const notFound = error.message === "Habit not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};

// ── POST /api/habits/:id/toggle ────────────────────────

export const toggleHabitCompletion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const result = await toggleHabitCompletionService(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    const notFound = error.message === "Habit not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};
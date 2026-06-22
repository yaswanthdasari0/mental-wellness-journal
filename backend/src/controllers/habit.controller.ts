import { Request, Response } from "express";

// POST /api/habits
export const createHabit = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "createHabit — not implemented yet" });
};

// GET /api/habits
export const getHabits = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "getHabits — not implemented yet" });
};

// PUT /api/habits/:id
export const updateHabit = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "updateHabit — not implemented yet" });
};

// DELETE /api/habits/:id
export const deleteHabit = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "deleteHabit — not implemented yet" });
};

// POST /api/habits/:id/toggle
export const toggleHabitCompletion = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "toggleHabitCompletion — not implemented yet" });
};
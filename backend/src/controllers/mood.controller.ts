import { Request, Response } from "express";

// POST /api/mood
export const createMood = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "createMood — not implemented yet" });
};

// GET /api/mood
export const getMoods = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "getMoods — not implemented yet" });
};

// GET /api/mood/today
export const getTodayMood = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "getTodayMood — not implemented yet" });
};
import { Request, Response } from "express";

// POST /api/gratitude
export const createGratitude = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "createGratitude — not implemented yet" });
};

// GET /api/gratitude
export const getGratitudes = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "getGratitudes — not implemented yet" });
};
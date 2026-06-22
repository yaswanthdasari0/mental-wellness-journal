import { Request, Response } from "express";

// POST /api/journal
export const createJournal = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "createJournal — not implemented yet" });
};

// GET /api/journal
export const getJournals = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "getJournals — not implemented yet" });
};

// GET /api/journal/:id
export const getJournalById = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "getJournalById — not implemented yet" });
};

// PUT /api/journal/:id
export const updateJournal = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "updateJournal — not implemented yet" });
};

// DELETE /api/journal/:id
export const deleteJournal = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "deleteJournal — not implemented yet" });
};
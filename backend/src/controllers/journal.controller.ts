import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createJournalService,
  getJournalsService,
  getJournalByIdService,
  updateJournalService,
  deleteJournalService,
} from "../services/journal.service";

// ── POST /api/journals ─────────────────────────────────

export const createJournal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: "Title and content are required." });
      return;
    }

    const journal = await createJournalService({ title, content, userId });

    res.status(201).json({ message: "Journal entry created.", journal });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to create journal entry." });
  }
};

// ── GET /api/journals ──────────────────────────────────

export const getJournals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const journals = await getJournalsService(userId);
    res.status(200).json({ journals });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch journal entries." });
  }
};

// ── GET /api/journals/:id ──────────────────────────────

export const getJournalById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const journal = await getJournalByIdService(id, userId);
    res.status(200).json({ journal });
  } catch (error: any) {
    const notFound = error.message === "Journal entry not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};

// ── PUT /api/journals/:id ──────────────────────────────

export const updateJournal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title && !content) {
      res.status(400).json({ message: "Provide at least a title or content to update." });
      return;
    }

    const updated = await updateJournalService(id, userId, { title, content });
    res.status(200).json({ message: "Journal entry updated.", journal: updated });
  } catch (error: any) {
    const notFound = error.message === "Journal entry not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};

// ── DELETE /api/journals/:id ───────────────────────────

export const deleteJournal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const result = await deleteJournalService(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    const notFound = error.message === "Journal entry not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};
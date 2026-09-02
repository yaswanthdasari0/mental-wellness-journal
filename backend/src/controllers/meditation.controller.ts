import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createSessionService,
  getSessionsService,
} from "../services/meditation.service";

// ── POST /api/meditation ───────────────────────────────

export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { duration } = req.body;

    if (!duration || typeof duration !== "number" || duration <= 0) {
      res.status(400).json({ message: "Duration must be a positive number (in minutes)." });
      return;
    }

    const session = await createSessionService({ duration, userId });
    res.status(201).json({ message: "Session saved.", session });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to save session." });
  }
};

// ── GET /api/meditation ────────────────────────────────

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const sessions = await getSessionsService(userId);
    res.status(200).json({ sessions });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch sessions." });
  }
};
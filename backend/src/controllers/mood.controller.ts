import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createMoodService,
  getMoodsService,
  getMoodByIdService,
  updateMoodService,
  deleteMoodService,
} from "../services/mood.service";

// Valid mood values — matches your frontend MoodSelector options
const VALID_MOODS = ["great", "happy", "neutral", "sad", "stressed"];

// ── POST /api/moods ────────────────────────────────────

export const createMood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { mood, note } = req.body;

    if (!mood) {
      res.status(400).json({ message: "Mood is required." });
      return;
    }

    if (!VALID_MOODS.includes(mood.toLowerCase())) {
      res.status(400).json({
        message: `Invalid mood. Must be one of: ${VALID_MOODS.join(", ")}`,
      });
      return;
    }

    const newMood = await createMoodService({
      mood: mood.toLowerCase(),
      note,
      userId,
    });

    res.status(201).json({ message: "Mood logged.", mood: newMood });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to create mood." });
  }
};

// ── GET /api/moods ─────────────────────────────────────

export const getMoods = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const moods = await getMoodsService(userId);
    res.status(200).json({ moods });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch moods." });
  }
};

// ── GET /api/moods/:id ─────────────────────────────────

export const getMoodById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const mood = await getMoodByIdService(id, userId);
    res.status(200).json({ mood });
  } catch (error: any) {
    const notFound = error.message === "Mood not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};

// ── PUT /api/moods/:id ─────────────────────────────────

export const updateMood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { mood, note } = req.body;

    if (mood && !VALID_MOODS.includes(mood.toLowerCase())) {
      res.status(400).json({
        message: `Invalid mood. Must be one of: ${VALID_MOODS.join(", ")}`,
      });
      return;
    }

    const updated = await updateMoodService(id, userId, {
      mood: mood?.toLowerCase(),
      note,
    });

    res.status(200).json({ message: "Mood updated.", mood: updated });
  } catch (error: any) {
    const notFound = error.message === "Mood not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};

// ── DELETE /api/moods/:id ──────────────────────────────

export const deleteMood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const result = await deleteMoodService(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    const notFound = error.message === "Mood not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};
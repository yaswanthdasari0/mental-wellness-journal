import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createGratitudeService,
  getGratitudesService,
  getGratitudeByIdService,
  updateGratitudeService,
  deleteGratitudeService,
} from "../services/gratitude.service";

// ── POST /api/gratitude ────────────────────────────────

export const createGratitude = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { items } = req.body;

    // items must be a non-empty array of strings
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Items must be a non-empty array of strings." });
      return;
    }

    // Filter out any blank strings
    const cleaned = items.map((i: string) => i.trim()).filter((i: string) => i.length > 0);

    if (cleaned.length === 0) {
      res.status(400).json({ message: "Please provide at least one gratitude item." });
      return;
    }

    const gratitude = await createGratitudeService({ items: cleaned, userId });

    res.status(201).json({ message: "Gratitude entry created.", gratitude });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to create gratitude entry." });
  }
};

// ── GET /api/gratitude ─────────────────────────────────

export const getGratitudes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const gratitudes = await getGratitudesService(userId);
    res.status(200).json({ gratitudes });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch gratitude entries." });
  }
};

// ── GET /api/gratitude/:id ─────────────────────────────

export const getGratitudeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const gratitude = await getGratitudeByIdService(id, userId);
    res.status(200).json({ gratitude });
  } catch (error: any) {
    const notFound = error.message === "Gratitude entry not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};

// ── PUT /api/gratitude/:id ─────────────────────────────

export const updateGratitude = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Items must be a non-empty array of strings." });
      return;
    }

    const cleaned = items.map((i: string) => i.trim()).filter((i: string) => i.length > 0);

    if (cleaned.length === 0) {
      res.status(400).json({ message: "Please provide at least one gratitude item." });
      return;
    }

    const updated = await updateGratitudeService(id, userId, { items: cleaned });
    res.status(200).json({ message: "Gratitude entry updated.", gratitude: updated });
  } catch (error: any) {
    const notFound = error.message === "Gratitude entry not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};

// ── DELETE /api/gratitude/:id ──────────────────────────

export const deleteGratitude = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const result = await deleteGratitudeService(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    const notFound = error.message === "Gratitude entry not found.";
    res.status(notFound ? 404 : 500).json({ message: error.message });
  }
};
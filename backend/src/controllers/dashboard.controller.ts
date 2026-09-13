import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getDashboardSummaryService } from "../services/dashboard.service";

export const getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const summary = await getDashboardSummaryService(req.userId!);
    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to load dashboard." });
  }
};
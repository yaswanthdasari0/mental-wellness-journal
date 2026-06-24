import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes      from "./routes/auth.routes";
import moodRoutes      from "./routes/mood.routes";
import journalRoutes   from "./routes/journal.routes";
import gratitudeRoutes from "./routes/gratitude.routes";
import habitRoutes     from "./routes/habit.routes";

dotenv.config();

const app: Application = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Mental Wellness Journal API Running" });
});

// ── Routes ──────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/mood",      moodRoutes);
app.use("/api/journal",   journalRoutes);
app.use("/api/gratitude", gratitudeRoutes);
app.use("/api/habits",    habitRoutes);

// ── 404 handler ─────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found." });
});

export default app;
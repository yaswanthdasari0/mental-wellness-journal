import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes       from "./routes/auth.routes";
import moodRoutes       from "./routes/mood.routes";
import journalRoutes    from "./routes/journal.routes";
import gratitudeRoutes  from "./routes/gratitude.routes";
import habitRoutes      from "./routes/habit.routes";
import meditationRoutes from "./routes/meditation.routes"; // ← added

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Mental Wellness Journal API Running" });
});

app.use("/api/auth",       authRoutes);
app.use("/api/moods",      moodRoutes);
app.use("/api/journals",   journalRoutes);
app.use("/api/gratitude",  gratitudeRoutes);
app.use("/api/habits",     habitRoutes);
app.use("/api/meditation", meditationRoutes); // ← added

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found." });
});

export default app;
import { Router } from "express";
import {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} from "../controllers/journal.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All journal routes are protected
router.use(authMiddleware);

// POST /api/journals
router.post("/", createJournal);

// GET /api/journals
router.get("/", getJournals);

// GET /api/journals/:id
router.get("/:id", getJournalById);

// PUT /api/journals/:id
router.put("/:id", updateJournal);

// DELETE /api/journals/:id
router.delete("/:id", deleteJournal);

export default router;
import { Router } from "express";
import {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} from "../controllers/journal.controller";

const router = Router();

// POST /api/journal
router.post("/", createJournal);

// GET /api/journal
router.get("/", getJournals);

// GET /api/journal/:id
router.get("/:id", getJournalById);

// PUT /api/journal/:id
router.put("/:id", updateJournal);

// DELETE /api/journal/:id
router.delete("/:id", deleteJournal);

export default router;
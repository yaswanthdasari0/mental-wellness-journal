import { Router } from "express";
import {
  createGratitude,
  getGratitudes,
  getGratitudeById,
  updateGratitude,
  deleteGratitude,
} from "../controllers/gratitude.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All gratitude routes are protected
router.use(authMiddleware);

// POST /api/gratitude
router.post("/", createGratitude);

// GET /api/gratitude
router.get("/", getGratitudes);

// GET /api/gratitude/:id
router.get("/:id", getGratitudeById);

// PUT /api/gratitude/:id
router.put("/:id", updateGratitude);

// DELETE /api/gratitude/:id
router.delete("/:id", deleteGratitude);

export default router;
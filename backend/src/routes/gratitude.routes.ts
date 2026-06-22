import { Router } from "express";
import {
  createGratitude,
  getGratitudes,
} from "../controllers/gratitude.controller";

const router = Router();

// POST /api/gratitude
router.post("/", createGratitude);

// GET /api/gratitude
router.get("/", getGratitudes);

export default router;
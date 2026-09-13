import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// GET /api/dashboard/summary
router.get("/summary", getDashboardSummary);

export default router;
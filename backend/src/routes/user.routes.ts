import { Router } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// GET  /api/user/profile
router.get("/profile", getProfile);

// PUT  /api/user/profile
router.put("/profile", updateProfile);

// PUT  /api/user/password
router.put("/password", changePassword);

export default router;
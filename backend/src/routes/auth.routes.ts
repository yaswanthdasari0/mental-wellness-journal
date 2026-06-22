import { Router } from "express";
import {
  register,
  login,
  logout,
} from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

export default router;
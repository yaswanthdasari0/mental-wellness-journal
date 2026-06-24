import { Request, Response } from "express";
import { signupService, loginService } from "../services/auth.service";

// ── POST /api/auth/signup ──────────────────────────────

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email and password are required." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters." });
      return;
    }

    const result = await signupService({ name, email, password });

    res.status(201).json({
      message: "Account created successfully.",
      token:   result.token,
      user:    result.user,
    });
  } catch (error: any) {
    // Known errors (e.g. email already exists) return 400
    // Unknown errors return 500
    const isKnown = error.message?.includes("already exists");
    res.status(isKnown ? 400 : 500).json({ message: error.message || "Signup failed." });
  }
};

// ── POST /api/auth/login ───────────────────────────────

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const result = await loginService({ email, password });

    res.status(200).json({
      message: "Logged in successfully.",
      token:   result.token,
      user:    result.user,
    });
  } catch (error: any) {
    // Invalid credentials → 401 Unauthorized
    const isInvalid = error.message?.includes("Invalid email or password");
    res.status(isInvalid ? 401 : 500).json({ message: error.message || "Login failed." });
  }
};

// ── POST /api/auth/logout ──────────────────────────────
// JWT is stateless — logout is handled on the frontend by deleting the token.
// This endpoint exists as a placeholder for future token blacklisting if needed.

export const logout = (_req: Request, res: Response): void => {
  res.status(200).json({ message: "Logged out successfully." });
};
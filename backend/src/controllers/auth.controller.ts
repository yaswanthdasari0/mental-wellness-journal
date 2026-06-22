import { Request, Response } from "express";

// POST /api/auth/register
export const register = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "register — not implemented yet" });
};

// POST /api/auth/login
export const login = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "login — not implemented yet" });
};

// POST /api/auth/logout
export const logout = (_req: Request, res: Response): void => {
  res.status(501).json({ message: "logout — not implemented yet" });
};
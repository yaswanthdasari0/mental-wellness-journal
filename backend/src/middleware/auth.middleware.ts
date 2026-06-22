import { Request, Response, NextFunction } from "express";

// TODO: implement JWT verification in Week 2
// This middleware will protect all routes that require authentication.
// Usage: router.get("/protected", authMiddleware, controller)

export const authMiddleware = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(501).json({ message: "authMiddleware — not implemented yet" });
};
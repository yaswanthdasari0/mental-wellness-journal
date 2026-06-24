import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to carry userId after verification
export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Token comes in the Authorization header as: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided. Please log in." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT_SECRET is not defined in .env");

    // Verify the token — throws if invalid or expired
    const decoded = jwt.verify(token, secret) as { userId: string };

    // Attach userId to the request so controllers can use it
    req.userId = decoded.userId;

    next();
  } catch (error: any) {
    const isExpired = error.name === "TokenExpiredError";
    res.status(401).json({
      message: isExpired ? "Session expired. Please log in again." : "Invalid token.",
    });
  }
};
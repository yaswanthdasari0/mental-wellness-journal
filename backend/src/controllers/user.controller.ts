import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getProfileService,
  updateProfileService,
  changePasswordService,
} from "../services/user.service";

// GET /api/user/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await getProfileService(req.userId!);
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

// PUT /api/user/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      res.status(400).json({ message: "Provide at least a name or email to update." });
      return;
    }

    const updated = await updateProfileService(req.userId!, { name, email });
    res.status(200).json({ message: "Profile updated.", user: updated });
  } catch (error: any) {
    const isKnown = error.message === "This email is already in use.";
    res.status(isKnown ? 400 : 500).json({ message: error.message });
  }
};

// PUT /api/user/password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "Current and new password are required." });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: "New password must be at least 6 characters." });
      return;
    }

    const result = await changePasswordService(req.userId!, { currentPassword, newPassword });
    res.status(200).json(result);
  } catch (error: any) {
    const isWrong = error.message === "Current password is incorrect.";
    res.status(isWrong ? 400 : 500).json({ message: error.message });
  }
};
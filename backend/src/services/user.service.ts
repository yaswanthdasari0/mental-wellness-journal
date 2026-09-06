import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const getProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  if (!user) throw new Error("User not found.");
  return user;
};

export const updateProfileService = async (
  userId: string,
  input: { name?: string; email?: string }
) => {
  const { name } = input;
  // Always lowercase email
  const email = input.email ? input.email.toLowerCase().trim() : undefined;

  if (email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (existing) throw new Error("This email is already in use.");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name  && { name }),
      ...(email && { email }),
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return updated;
};

export const changePasswordService = async (
  userId: string,
  input: { currentPassword: string; newPassword: string }
) => {
  const { currentPassword, newPassword } = input;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found.");

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new Error("Current password is incorrect.");

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

  return { message: "Password changed successfully." };
};
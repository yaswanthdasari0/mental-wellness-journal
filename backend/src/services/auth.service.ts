import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in .env");
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

export const signupService = async (input: SignupInput) => {
  const { name, password } = input;
  // Always store email in lowercase — fixes case sensitivity forever
  const email = input.email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("An account with this email already exists.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = generateToken(user.id);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const loginService = async (input: LoginInput) => {
  const { password } = input;
  // Lowercase the email before lookup — so AKASH@gmail.com finds akash@gmail.com
  const email = input.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password.");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password.");

  const token = generateToken(user.id);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};
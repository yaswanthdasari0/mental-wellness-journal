import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Types ──────────────────────────────────────────────

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ── Helpers ────────────────────────────────────────────

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in .env");

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: "7d" } // token expires in 7 days
  );
};

// ── Services ───────────────────────────────────────────

export const signupService = async (input: SignupInput) => {
  const { name, email, password } = input;

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  // 2. Hash the password — never store plain text passwords
  //    10 = salt rounds (higher = more secure but slower)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Save user to database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // 4. Generate JWT token
  const token = generateToken(user.id);

  // 5. Return token and safe user data (never return the password)
  return {
    token,
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
    },
  };
};

export const loginService = async (input: LoginInput) => {
  const { email, password } = input;

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Use a vague message — don't tell attackers whether the email exists
    throw new Error("Invalid email or password.");
  }

  // 2. Compare the entered password against the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  // 3. Generate JWT token
  const token = generateToken(user.id);

  // 4. Return token and safe user data
  return {
    token,
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
    },
  };
};
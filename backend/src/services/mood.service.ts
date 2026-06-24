import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Types ──────────────────────────────────────────────

export interface CreateMoodInput {
  mood: string;
  note?: string;
  userId: string;
}

export interface UpdateMoodInput {
  mood?: string;
  note?: string;
}

// ── Services ───────────────────────────────────────────

// Create a new mood entry for the logged-in user
export const createMoodService = async (input: CreateMoodInput) => {
  const { mood, note, userId } = input;

  const newMood = await prisma.mood.create({
    data: {
      mood,
      note,
      userId,
    },
  });

  return newMood;
};

// Get all moods for the logged-in user, newest first
export const getMoodsService = async (userId: string) => {
  const moods = await prisma.mood.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return moods;
};

// Get a single mood by id — also verifies it belongs to the user
export const getMoodByIdService = async (id: string, userId: string) => {
  const mood = await prisma.mood.findFirst({
    where: { id, userId },
  });

  if (!mood) throw new Error("Mood not found.");

  return mood;
};

// Update a mood entry
export const updateMoodService = async (
  id: string,
  userId: string,
  input: UpdateMoodInput
) => {
  // First verify it belongs to this user
  const existing = await prisma.mood.findFirst({
    where: { id, userId },
  });

  if (!existing) throw new Error("Mood not found.");

  const updated = await prisma.mood.update({
    where: { id },
    data: {
      ...(input.mood && { mood: input.mood }),
      ...(input.note !== undefined && { note: input.note }),
    },
  });

  return updated;
};

// Delete a mood entry
export const deleteMoodService = async (id: string, userId: string) => {
  // First verify it belongs to this user
  const existing = await prisma.mood.findFirst({
    where: { id, userId },
  });

  if (!existing) throw new Error("Mood not found.");

  await prisma.mood.delete({ where: { id } });

  return { message: "Mood deleted successfully." };
};
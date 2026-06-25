import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Types ──────────────────────────────────────────────

export interface CreateGratitudeInput {
  items: string[];
  userId: string;
}

export interface UpdateGratitudeInput {
  items: string[];
}

// ── Services ───────────────────────────────────────────

// Create a new gratitude entry
export const createGratitudeService = async (input: CreateGratitudeInput) => {
  const { items, userId } = input;

  const gratitude = await prisma.gratitude.create({
    data: { items, userId },
  });

  return gratitude;
};

// Get all gratitude entries for the logged-in user, newest first
export const getGratitudesService = async (userId: string) => {
  const gratitudes = await prisma.gratitude.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return gratitudes;
};

// Get a single gratitude entry — verifies it belongs to the user
export const getGratitudeByIdService = async (id: string, userId: string) => {
  const gratitude = await prisma.gratitude.findFirst({
    where: { id, userId },
  });

  if (!gratitude) throw new Error("Gratitude entry not found.");

  return gratitude;
};

// Update a gratitude entry
export const updateGratitudeService = async (
  id: string,
  userId: string,
  input: UpdateGratitudeInput
) => {
  const existing = await prisma.gratitude.findFirst({
    where: { id, userId },
  });

  if (!existing) throw new Error("Gratitude entry not found.");

  const updated = await prisma.gratitude.update({
    where: { id },
    data: { items: input.items },
  });

  return updated;
};

// Delete a gratitude entry
export const deleteGratitudeService = async (id: string, userId: string) => {
  const existing = await prisma.gratitude.findFirst({
    where: { id, userId },
  });

  if (!existing) throw new Error("Gratitude entry not found.");

  await prisma.gratitude.delete({ where: { id } });

  return { message: "Gratitude entry deleted successfully." };
};
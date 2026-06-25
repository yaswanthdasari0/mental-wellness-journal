import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Types ──────────────────────────────────────────────

export interface CreateJournalInput {
  title: string;
  content: string;
  userId: string;
}

export interface UpdateJournalInput {
  title?: string;
  content?: string;
}

// ── Services ───────────────────────────────────────────

// Create a new journal entry
export const createJournalService = async (input: CreateJournalInput) => {
  const { title, content, userId } = input;

  const journal = await prisma.journal.create({
    data: { title, content, userId },
  });

  return journal;
};

// Get all journal entries for the logged-in user, newest first
export const getJournalsService = async (userId: string) => {
  const journals = await prisma.journal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return journals;
};

// Get a single journal entry — verifies it belongs to the user
export const getJournalByIdService = async (id: string, userId: string) => {
  const journal = await prisma.journal.findFirst({
    where: { id, userId },
  });

  if (!journal) throw new Error("Journal entry not found.");

  return journal;
};

// Update a journal entry
export const updateJournalService = async (
  id: string,
  userId: string,
  input: UpdateJournalInput
) => {
  const existing = await prisma.journal.findFirst({
    where: { id, userId },
  });

  if (!existing) throw new Error("Journal entry not found.");

  const updated = await prisma.journal.update({
    where: { id },
    data: {
      ...(input.title   && { title: input.title }),
      ...(input.content && { content: input.content }),
    },
  });

  return updated;
};

// Delete a journal entry
export const deleteJournalService = async (id: string, userId: string) => {
  const existing = await prisma.journal.findFirst({
    where: { id, userId },
  });

  if (!existing) throw new Error("Journal entry not found.");

  await prisma.journal.delete({ where: { id } });

  return { message: "Journal entry deleted successfully." };
};
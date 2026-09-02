import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateSessionInput {
  duration: number; // minutes
  userId: string;
}

export const createSessionService = async (input: CreateSessionInput) => {
  const { duration, userId } = input;

  const session = await prisma.meditationSession.create({
    data: { duration, userId },
  });

  return session;
};

export const getSessionsService = async (userId: string) => {
  const sessions = await prisma.meditationSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Total minutes this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const weeklyMinutes = sessions
    .filter((s) => new Date(s.createdAt) >= weekStart)
    .reduce((sum, s) => sum + s.duration, 0);

  return { sessions, weeklyMinutes };
};
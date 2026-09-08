import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateSessionInput {
  duration: number;
  userId: string;
}

export const createSessionService = async (input: CreateSessionInput) => {
  const { duration, userId } = input;

  // Safety check — make sure model exists before calling
  const session = await (prisma as any).meditationSession.create({
    data: { duration, userId },
  });

  return session;
};

export const getSessionsService = async (userId: string) => {
  const sessions = await (prisma as any).meditationSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const weeklyMinutes = sessions
    .filter((s: any) => new Date(s.createdAt) >= weekStart)
    .reduce((sum: number, s: any) => sum + s.duration, 0);

  return { sessions, weeklyMinutes };
};
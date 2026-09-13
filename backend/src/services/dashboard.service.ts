import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardSummaryService = async (userId: string) => {
  const now       = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  // Run all queries in parallel for speed
  const [
    todayMood,
    allMoods,
    journalCount,
    weekJournals,
    habits,
    meditationSessions,
    recentJournals,
    recentGratitudes,
  ] = await Promise.all([
    // Today's latest mood
    prisma.mood.findFirst({
      where: { userId, createdAt: { gte: todayStart } },
      orderBy: { createdAt: "desc" },
    }),

    // All moods for weekly chart (last 7 days)
    prisma.mood.findMany({
      where: { userId, createdAt: { gte: weekStart } },
      orderBy: { createdAt: "desc" },
    }),

    // Total journal count
    prisma.journal.count({ where: { userId } }),

    // Journal count this week
    prisma.journal.count({
      where: { userId, createdAt: { gte: weekStart } },
    }),

    // All habits with today's completions
    prisma.habit.findMany({
      where: { userId },
      include: {
        completions: {
          where: { completedAt: { gte: todayStart } },
        },
      },
    }),

    // Meditation sessions (for total minutes)
    (prisma as any).meditationSession.findMany({
      where: { userId, createdAt: { gte: weekStart } },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),

    // Recent journal entries for activity feed
    prisma.journal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, createdAt: true },
    }),

    // Recent gratitude entries for activity feed
    prisma.gratitude.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, createdAt: true, items: true },
    }),
  ]);

  // ── Streak calculation ──────────────────────────────
  const allHabitCompletions = await prisma.habitCompletion.findMany({
    where: { habit: { userId } },
    orderBy: { completedAt: "desc" },
  });

  const uniqueDays = [
    ...new Set(
      allHabitCompletions.map((c) => {
        const d = new Date(c.completedAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    ),
  ].sort((a, b) => b - a);

  let streak = 0;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const today0 = new Date();
  today0.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = today0.getTime() - i * DAY_MS;
    if (uniqueDays[i] === expected) streak++;
    else break;
  }

  // ── Habit completion for today ──────────────────────
  const habitsCompleted = habits.filter((h) => h.completions.length > 0).length;
  const habitsTotal     = habits.length;

  // ── Meditation minutes this week ────────────────────
  const meditationMinutes = (meditationSessions as any[])
    .reduce((sum: number, s: any) => sum + s.duration, 0);

  // ── Recent activity feed (combined, sorted by time) ─
  const activity = [
    ...recentJournals.map((j) => ({
      type:  "journal" as const,
      label: `Added journal: "${j.title}"`,
      time:  j.createdAt,
    })),
    ...recentGratitudes.map((g) => ({
      type:  "gratitude" as const,
      label: `Added gratitude: "${g.items[0]}"`,
      time:  g.createdAt,
    })),
    // Today's mood as activity
    ...(todayMood ? [{
      type:  "mood" as const,
      label: `Logged mood: ${todayMood.mood}`,
      time:  todayMood.createdAt,
    }] : []),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  return {
    todayMood: todayMood ? { mood: todayMood.mood, note: todayMood.note } : null,
    weeklyMoods: allMoods,
    journalCount,
    weekJournalCount: weekJournals,
    streak,
    habitsCompleted,
    habitsTotal,
    meditationMinutes,
    recentActivity: activity,
  };
};
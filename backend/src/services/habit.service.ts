import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Types ──────────────────────────────────────────────

export interface CreateHabitInput {
  name: string;
  userId: string;
}

export interface UpdateHabitInput {
  name: string;
}

// ── Services ───────────────────────────────────────────

// Create a new habit
export const createHabitService = async (input: CreateHabitInput) => {
  const { name, userId } = input;

  const habit = await prisma.habit.create({
    data: { name, userId },
    include: { completions: true },
  });

  return habit;
};

// Get all habits for the logged-in user with their completions
export const getHabitsService = async (userId: string) => {
  const habits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      completions: {
        orderBy: { completedAt: "desc" },
      },
    },
  });

  // Attach streak and today's completion status to each habit
  return habits.map((habit) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const completedToday = habit.completions.some(
      (c) => new Date(c.completedAt) >= todayStart
    );

    const streak = calculateStreak(habit.completions.map((c) => c.completedAt));

    return {
      ...habit,
      completedToday,
      streak,
    };
  });
};

// Get a single habit by id — verifies it belongs to the user
export const getHabitByIdService = async (id: string, userId: string) => {
  const habit = await prisma.habit.findFirst({
    where: { id, userId },
    include: { completions: { orderBy: { completedAt: "desc" } } },
  });

  if (!habit) throw new Error("Habit not found.");

  return habit;
};

// Update a habit name
export const updateHabitService = async (
  id: string,
  userId: string,
  input: UpdateHabitInput
) => {
  const existing = await prisma.habit.findFirst({
    where: { id, userId },
  });

  if (!existing) throw new Error("Habit not found.");

  const updated = await prisma.habit.update({
    where: { id },
    data: { name: input.name },
    include: { completions: true },
  });

  return updated;
};

// Delete a habit and all its completions (cascade handles this in DB)
export const deleteHabitService = async (id: string, userId: string) => {
  const existing = await prisma.habit.findFirst({
    where: { id, userId },
  });

  if (!existing) throw new Error("Habit not found.");

  await prisma.habit.delete({ where: { id } });

  return { message: "Habit deleted successfully." };
};

// Toggle today's completion for a habit
// If already completed today → remove it (uncheck)
// If not completed today → add it (check)
export const toggleHabitCompletionService = async (id: string, userId: string) => {
  // Verify ownership
  const habit = await prisma.habit.findFirst({
    where: { id, userId },
  });

  if (!habit) throw new Error("Habit not found.");

  // Check if already completed today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayCompletion = await prisma.habitCompletion.findFirst({
    where: {
      habitId: id,
      completedAt: { gte: todayStart },
    },
  });

  if (todayCompletion) {
    // Already done today — uncheck it
    await prisma.habitCompletion.delete({ where: { id: todayCompletion.id } });
    return { completedToday: false, message: "Habit unmarked for today." };
  } else {
    // Not done today — check it
    await prisma.habitCompletion.create({ data: { habitId: id } });
    return { completedToday: true, message: "Habit completed for today." };
  }
};

// ── Helpers ────────────────────────────────────────────

// Calculate the current streak — consecutive days completed up to today
const calculateStreak = (dates: Date[]): number => {
  if (dates.length === 0) return 0;

  // Get unique dates (just the day, no time)
  const uniqueDays = [
    ...new Set(
      dates.map((d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    ),
  ].sort((a, b) => b - a); // newest first

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const DAY_MS = 24 * 60 * 60 * 1000;

  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = today.getTime() - i * DAY_MS;
    if (uniqueDays[i] === expected) {
      streak++;
    } else {
      break; // streak broken
    }
  }

  return streak;
};
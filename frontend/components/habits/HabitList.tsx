"use client";

import { useEffect, useState } from "react";
import { getHabits, Habit } from "@/services/habit";
import HabitCard from "./HabitCard";

interface HabitListProps {
  newHabit?: Habit | null;
  onHabitsChange?: (habits: Habit[]) => void;
}

export default function HabitList({ newHabit, onHabitsChange }: HabitListProps) {
  const [habits, setHabits]   = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Helper — update state AND notify parent in one place, never inside a setter
  const syncHabits = (updated: Habit[]) => {
    setHabits(updated);
    onHabitsChange?.(updated);
  };

  // Fetch on mount
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const data = await getHabits();
        syncHabits(data);
      } catch (err: any) {
        setError(err.message || "Failed to load habits.");
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  // Prepend a newly created habit — fix: don't call onHabitsChange inside setHabits()
  useEffect(() => {
    if (!newHabit) return;

    setHabits((prev) => {
      // avoid duplicates
      if (prev.find((h) => h.id === newHabit.id)) return prev;
      const updated = [newHabit, ...prev];
      // Schedule the parent notification AFTER the render, not during
      setTimeout(() => onHabitsChange?.(updated), 0);
      return updated;
    });
  }, [newHabit]);

  const handleUpdate = (updated: Habit) => {
    const next = habits.map((h) =>
      h.id === updated.id ? { ...h, name: updated.name } : h
    );
    syncHabits(next);
  };

  const handleDelete = (id: string) => {
    const next = habits.filter((h) => h.id !== id);
    syncHabits(next);
  };

  // Fix NaN: use the backend value directly, just flip completedToday
  // Streak recalculates server-side from real completion dates — don't guess it here
  const handleToggle = (id: string, completedToday: boolean) => {
    const next = habits.map((h) =>
      h.id === id
        ? {
            ...h,
            completedToday,
            // Keep the streak the backend sent — it's accurate
            // It will update on next page load after the server recalculates
            streak: typeof h.streak === "number" ? h.streak : 0,
          }
        : h
    );
    syncHabits(next);
  };

  if (loading) {
    return <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Loading habits...</div>;
  }
  if (error) {
    return <div style={{ fontSize: "0.85rem", color: "#f87171" }}>{error}</div>;
  }
  if (habits.length === 0) {
    return (
      <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
        No habits yet. Add your first one above.
      </div>
    );
  }

  return (
    <>
      <style>{`.habit-list { display: flex; flex-direction: column; gap: 0.65rem; }`}</style>
      <div className="habit-list">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </>
  );
}
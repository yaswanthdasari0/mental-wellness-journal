"use client";

import { useEffect, useState } from "react";
import { getMoods, deleteMood, Mood } from "@/services/mood";
import MoodCard from "./MoodCard";

export default function MoodHistory({ newEntry }: { newEntry?: Mood | null }) {
  const [moods, setMoods]     = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMoods();
        setMoods(data);
      } catch (err: any) {
        setError(err.message || "Failed to load mood history.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Prepend new entry when MoodSelector saves one
  useEffect(() => {
    if (newEntry) {
      setMoods((prev) => [newEntry, ...prev]);
    }
  }, [newEntry]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this mood entry?")) return;
    try {
      await deleteMood(id);
      setMoods((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete mood.");
    }
  };

  if (loading) return <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Loading mood history...</div>;
  if (error)   return <div style={{ fontSize: "0.85rem", color: "#f87171" }}>{error}</div>;
  if (moods.length === 0) return <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>No mood entries yet. Log your first mood above.</div>;

  return (
    <>
      <style>{`
        .mood-history-list { display: flex; flex-direction: column; gap: 0.9rem; }
      `}</style>

      <div className="mood-history-list">
        {moods.map((mood) => (
          <MoodCard
            key={mood.id}
            mood={mood.mood}
            note={mood.note}
            date={new Date(mood.createdAt).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
            onDelete={() => handleDelete(mood.id)}
          />
        ))}
      </div>
    </>
  );
}
"use client";

import { useEffect, useState } from "react";
import { getGratitudes, Gratitude } from "@/services/gratitude";
import GratitudeCard from "./GratitudeCard";

export default function GratitudeList({
  newEntry,
}: {
  newEntry?: Gratitude | null;
}) {
  const [entries, setEntries] = useState<Gratitude[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getGratitudes();
        setEntries(data);
      } catch (err: any) {
        setError(err.message || "Failed to load gratitude entries.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Prepend new entry when GratitudeForm saves one
  useEffect(() => {
    if (newEntry) {
      setEntries((prev) => [newEntry, ...prev]);
    }
  }, [newEntry]);

  const handleUpdate = (updated: Gratitude) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  if (loading) return <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Loading entries...</div>;
  if (error)   return <div style={{ fontSize: "0.85rem", color: "#f87171" }}>{error}</div>;
  if (entries.length === 0) return (
    <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
      No gratitude entries yet. Write your first one.
    </div>
  );

  return (
    <>
      <style>{`
        .gratitude-list { display: flex; flex-direction: column; gap: 0.85rem; }
      `}</style>

      <div className="gratitude-list">
        {entries.map((entry) => (
          <GratitudeCard
            key={entry.id}
            entry={entry}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
}
"use client";

import { useEffect, useState } from "react";
import { getJournals, Journal } from "@/services/journal";
import JournalCard from "./JournalCard";

export default function RecentJournals({
  newEntry,
}: {
  // When a new entry is created in JournalEditor, it's passed here to prepend
  newEntry?: Journal | null;
}) {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // Fetch on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getJournals();
        setJournals(data);
      } catch (err: any) {
        setError(err.message || "Failed to load journals.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Prepend new entry when JournalEditor saves one
  useEffect(() => {
    if (newEntry) {
      setJournals((prev) => [newEntry, ...prev]);
    }
  }, [newEntry]);

  const handleUpdate = (updated: Journal) => {
    setJournals((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  };

  const handleDelete = (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <>
      <style>{`
        .recent-journals-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .journals-loading { font-size: 0.85rem; color: #94a3b8; padding: 1rem 0; }
        .journals-error  { font-size: 0.85rem; color: #f87171; padding: 1rem 0; }
        .journals-empty  { font-size: 0.85rem; color: #94a3b8; padding: 1rem 0; }
      `}</style>

      {loading && <div className="journals-loading">Loading entries...</div>}
      {error   && <div className="journals-error">{error}</div>}
      {!loading && !error && journals.length === 0 && (
        <div className="journals-empty">No journal entries yet. Write your first one.</div>
      )}

      <div className="recent-journals-list">
        {journals.map((journal) => (
          <JournalCard
            key={journal.id}
            journal={journal}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
}
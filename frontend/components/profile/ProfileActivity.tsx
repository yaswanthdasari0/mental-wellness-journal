"use client";

import { useEffect, useState } from "react";
import { getMoods, Mood } from "@/services/mood";
import { getJournals, Journal } from "@/services/journal";
import { getHabits, Habit } from "@/services/habit";

const MOOD_EMOJI: Record<string, string> = {
  great:"😄", happy:"😊", neutral:"😐", sad:"😢", stressed:"😰",
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff/60000), h = Math.floor(m/60), days = Math.floor(h/24);
  if (m < 1)   return "just now";
  if (m < 60)  return `${m}m ago`;
  if (h < 24)  return `${h}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

type Tab = "journals" | "moods" | "habits";

export default function ProfileActivity() {
  const [tab, setTab]           = useState<Tab>("journals");
  const [journals, setJournals] = useState<Journal[]>([]);
  const [moods, setMoods]       = useState<Mood[]>([]);
  const [habits, setHabits]     = useState<Habit[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [j, m, h] = await Promise.all([getJournals(), getMoods(), getHabits()]);
        setJournals(j); setMoods(m); setHabits(h);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "journals", label: "📓 Journals", count: journals.length },
    { key: "moods",    label: "😊 Moods",    count: moods.length    },
    { key: "habits",   label: "🔥 Habits",   count: habits.length   },
  ];

  return (
    <>
      <style>{`
        .pa-card { background: #fff; border: 1px solid #e8eaed; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 2px rgba(15,23,42,0.03); margin-top: 1.2rem; }
        .pa-tabs { display: flex; gap: 0.3rem; padding: 0.75rem 1.1rem; border-bottom: 1px solid #f1f5f9; background: #fafbfc; overflow-x: auto; }
        .pa-tab {
          padding: 0.45rem 1rem; border-radius: 8px; border: none; font-size: 0.82rem;
          font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.15s;
          font-family: 'Inter', sans-serif; background: transparent; color: #64748b;
        }
        .pa-tab.active { background: #16a34a; color: #fff; font-weight: 600; }
        .pa-tab:not(.active):hover { background: #f1f5f9; color: #334155; }

        .pa-list { padding: 0.25rem 0; max-height: 400px; overflow-y: auto; }
        .pa-item { padding: 0.9rem 1.4rem; border-bottom: 1px solid #f8fafc; transition: background 0.12s; }
        .pa-item:last-child { border-bottom: none; }
        .pa-item:hover { background: #f7f8fa; }
        .pa-item-time { font-size: 0.72rem; color: #94a3b8; margin-top: 0.3rem; }

        .pa-journal-title   { font-size: 0.875rem; font-weight: 600; color: #0f172a; }
        .pa-journal-preview { font-size: 0.78rem; color: #64748b; line-height: 1.5; margin-top: 0.2rem; }

        .pa-mood-row   { display: flex; align-items: center; gap: 0.75rem; }
        .pa-mood-emoji { font-size: 1.3rem; }
        .pa-mood-label { font-size: 0.875rem; font-weight: 600; color: #0f172a; }
        .pa-mood-note  { font-size: 0.78rem; color: #64748b; }

        .pa-habit-row    { display: flex; align-items: center; gap: 0.75rem; }
        .pa-habit-dot    { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .pa-habit-name   { font-size: 0.875rem; font-weight: 500; color: #1e293b; flex: 1; }
        .pa-habit-streak { font-size: 0.76rem; color: #f59e0b; font-weight: 600; }

        .pa-empty   { padding: 2rem; text-align: center; font-size: 0.84rem; color: #94a3b8; }
        .pa-loading { padding: 1.5rem; text-align: center; font-size: 0.84rem; color: #94a3b8; }
      `}</style>

      <div className="pa-card">
        <div className="pa-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`pa-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="pa-list">
          {loading && <div className="pa-loading">Loading...</div>}

          {!loading && tab === "journals" && (
            journals.length === 0
              ? <div className="pa-empty">No journal entries yet.</div>
              : journals.map(j => (
                <div className="pa-item" key={j.id}>
                  <div className="pa-journal-title">{j.title}</div>
                  <div className="pa-journal-preview">
                    {j.content.slice(0, 150)}{j.content.length > 150 ? "..." : ""}
                  </div>
                  <div className="pa-item-time">{timeAgo(j.createdAt)}</div>
                </div>
              ))
          )}

          {!loading && tab === "moods" && (
            moods.length === 0
              ? <div className="pa-empty">No moods logged yet.</div>
              : moods.map(m => (
                <div className="pa-item" key={m.id}>
                  <div className="pa-mood-row">
                    <div className="pa-mood-emoji">{MOOD_EMOJI[m.mood] ?? "😐"}</div>
                    <div>
                      <div className="pa-mood-label">{m.mood.charAt(0).toUpperCase() + m.mood.slice(1)}</div>
                      {m.note && <div className="pa-mood-note">{m.note}</div>}
                    </div>
                  </div>
                  <div className="pa-item-time">{timeAgo(m.createdAt)}</div>
                </div>
              ))
          )}

          {!loading && tab === "habits" && (
            habits.length === 0
              ? <div className="pa-empty">No habits added yet.</div>
              : habits.map(h => (
                <div className="pa-item" key={h.id}>
                  <div className="pa-habit-row">
                    <div className="pa-habit-dot" style={{ background: h.completedToday ? "#16a34a" : "#e2e8f0" }} />
                    <div className="pa-habit-name">{h.name}</div>
                    {h.streak > 0 && <div className="pa-habit-streak">🔥 {h.streak}d</div>}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}
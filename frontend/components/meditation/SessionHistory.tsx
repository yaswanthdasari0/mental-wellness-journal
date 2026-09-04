"use client";

import { useEffect, useState } from "react";
import { getSessions, MeditationSession } from "@/services/meditation";

function CircleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

// Friendly relative time label
function whenLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now  = new Date();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const yestStart = new Date(todayStart);
  yestStart.setDate(yestStart.getDate() - 1);

  if (date >= todayStart) return "Today";
  if (date >= yestStart)  return "Yesterday";

  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export default function SessionHistory({
  newSession,
}: {
  newSession?: MeditationSession | null;
}) {
  const [sessions, setSessions]       = useState<MeditationSession[]>([]);
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSessions();
        setSessions(data.sessions);
        setWeeklyMinutes(data.weeklyMinutes);
      } catch (err: any) {
        setError(err.message || "Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Prepend new session when timer completes
  useEffect(() => {
    if (!newSession) return;
    setSessions((prev) => {
      if (prev.find((s) => s.id === newSession.id)) return prev;
      return [newSession, ...prev];
    });
    setWeeklyMinutes((prev) => prev + newSession.duration);
  }, [newSession]);

  return (
    <>
      <style>{`
        .session-history-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px;
          overflow: hidden; box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }
        .session-history-top {
          padding: 1.1rem 1.5rem; border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: baseline; justify-content: space-between;
        }
        .session-history-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; }
        .session-history-total { font-size: 0.78rem; color: #94a3b8; }
        .session-history-total span { color: #16a34a; font-weight: 600; }
        .session-history-list { padding: 0.4rem 0; }
        .session-row {
          display: flex; align-items: center; gap: 0.9rem;
          padding: 0.8rem 1.5rem; transition: background 0.15s;
        }
        .session-row:hover { background: #f7f8fa; }
        .session-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: rgba(22,163,74,0.08); color: #16a34a;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .session-body { flex: 1; }
        .session-duration { font-size: 0.875rem; font-weight: 600; color: #1e293b; }
        .session-when { font-size: 0.76rem; color: #94a3b8; margin-top: 0.1rem; }
        .session-divider { height: 1px; background: #f8fafc; margin: 0 1.5rem; }
        .session-loading { font-size: 0.85rem; color: #94a3b8; padding: 1rem 1.5rem; }
        .session-error   { font-size: 0.85rem; color: #f87171; padding: 1rem 1.5rem; }
        .session-empty   { font-size: 0.85rem; color: #94a3b8; padding: 1rem 1.5rem; }
      `}</style>

      <div className="session-history-card">
        <div className="session-history-top">
          <div className="session-history-title">Recent Sessions</div>
          <div className="session-history-total">
            <span>{weeklyMinutes} min</span> this week
          </div>
        </div>

        <div className="session-history-list">
          {loading && <div className="session-loading">Loading sessions...</div>}
          {error   && <div className="session-error">{error}</div>}
          {!loading && !error && sessions.length === 0 && (
            <div className="session-empty">No sessions yet. Complete your first one above.</div>
          )}

          {sessions.map((s, i) => (
            <div key={s.id}>
              <div className="session-row">
                <div className="session-icon"><CircleIcon /></div>
                <div className="session-body">
                  <div className="session-duration">{s.duration} min session</div>
                  <div className="session-when">{whenLabel(s.createdAt)}</div>
                </div>
              </div>
              {i < sessions.length - 1 && <div className="session-divider" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
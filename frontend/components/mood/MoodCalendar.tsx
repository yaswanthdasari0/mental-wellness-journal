"use client";

import { useEffect, useState } from "react";
import { getMoods, Mood } from "@/services/mood";
import { MOOD_OPTIONS, getMoodColor } from "./moodData";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function MoodCalendar() {
  const [moods, setMoods]     = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Which month/year to show — defaults to current month
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMoods();
        setMoods(data);
      } catch (err: any) {
        setError(err.message || "Failed to load mood data.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const { month, year } = viewDate;

  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });

  const daysInMonth   = new Date(year, month + 1, 0).getDate();
  const firstWeekday  = new Date(year, month, 1).getDay(); // 0=Sun

  // Build a map: "YYYY-MM-DD" → mood string (latest mood that day wins)
  const moodByDay: Record<string, string> = {};
  moods.forEach((m) => {
    const d = new Date(m.createdAt);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const key = `${year}-${month}-${d.getDate()}`;
      // If multiple entries same day, keep the most recent (array is newest-first)
      if (!moodByDay[key]) moodByDay[key] = m.mood;
    }
  });

  // Grid cells: nulls for empty leading slots, then day numbers
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goToPrev = () => {
    setViewDate(({ month, year }) => {
      if (month === 0) return { month: 11, year: year - 1 };
      return { month: month - 1, year };
    });
  };

  const goToNext = () => {
    const now = new Date();
    if (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth())) return;
    setViewDate(({ month, year }) => {
      if (month === 11) return { month: 0, year: year + 1 };
      return { month: month + 1, year };
    });
  };

  return (
    <>
      <style>{`
        .mood-calendar-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px;
          padding: 1.6rem 1.7rem; box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }

        .mood-calendar-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.2rem;
        }
        .mood-calendar-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; }
        .mood-calendar-nav { display: flex; align-items: center; gap: 0.5rem; }
        .mood-nav-btn {
          width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e8eaed;
          background: #f7f8fa; cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: #64748b;
          transition: border-color 0.15s, color 0.15s; font-size: 0.85rem;
        }
        .mood-nav-btn:hover { border-color: #16a34a; color: #16a34a; }
        .mood-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .mood-calendar-month { font-size: 0.78rem; color: #94a3b8; }

        .mood-calendar-grid {
          display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.35rem;
        }
        .mood-calendar-weekday {
          font-size: 0.7rem; color: #94a3b8; font-weight: 600;
          text-align: center; padding-bottom: 0.3rem;
        }
        .mood-calendar-day {
          aspect-ratio: 1; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.74rem; font-weight: 500; color: #64748b;
          background: #f7f8fa;
        }
        .mood-calendar-day.empty  { background: transparent; }
        .mood-calendar-day.today  { border: 1.5px solid #16a34a; }
        .mood-calendar-day.has-mood { color: #ffffff; font-weight: 600; }

        .mood-calendar-legend {
          display: flex; gap: 0.8rem; flex-wrap: wrap;
          margin-top: 1.4rem; padding-top: 1.2rem;
          border-top: 1px solid #f1f3f5;
        }
        .mood-legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.74rem; color: #64748b; }
        .mood-legend-dot  { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }

        .mood-calendar-loading { font-size: 0.85rem; color: #94a3b8; padding: 1rem 0; text-align: center; }
        .mood-calendar-error   { font-size: 0.85rem; color: #f87171; padding: 0.5rem 0; }
      `}</style>

      <div className="mood-calendar-card">
        <div className="mood-calendar-header">
          <div className="mood-calendar-title">Mood Calendar</div>
          <div className="mood-calendar-nav">
            <button className="mood-nav-btn" onClick={goToPrev}>&#8249;</button>
            <span className="mood-calendar-month">{monthName}</span>
            <button
              className="mood-nav-btn"
              onClick={goToNext}
              disabled={
                year === new Date().getFullYear() &&
                month >= new Date().getMonth()
              }
            >
              &#8250;
            </button>
          </div>
        </div>

        {error && <div className="mood-calendar-error">{error}</div>}

        {loading ? (
          <div className="mood-calendar-loading">Loading...</div>
        ) : (
          <>
            <div className="mood-calendar-grid">
              {WEEKDAY_LABELS.map((d, i) => (
                <div className="mood-calendar-weekday" key={i}>{d}</div>
              ))}

              {cells.map((day, i) => {
                if (day === null) return <div className="mood-calendar-day empty" key={i} />;

                const key   = `${year}-${month}-${day}`;
                const mood  = moodByDay[key];
                const bg    = mood ? getMoodColor(mood) : undefined;

                const now   = new Date();
                const isToday =
                  day === now.getDate() &&
                  month === now.getMonth() &&
                  year === now.getFullYear();

                return (
                  <div
                    key={i}
                    className={[
                      "mood-calendar-day",
                      mood ? "has-mood" : "",
                      isToday ? "today" : "",
                    ].join(" ").trim()}
                    style={mood ? { background: bg } : undefined}
                    title={mood ? `${day} — ${mood}` : undefined}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="mood-calendar-legend">
              {MOOD_OPTIONS.map((m) => (
                <div className="mood-legend-item" key={m.id}>
                  <span className="mood-legend-dot" style={{ background: m.color }} />
                  {m.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
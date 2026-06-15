"use client";

import { MOOD_OPTIONS, getMoodColor, MoodId } from "./moodData";

// Dummy data: day-of-month → mood. Days not present are "no entry".
const DUMMY_MONTH_DATA: Record<number, MoodId> = {
  1: "happy", 2: "great", 3: "neutral", 4: "happy", 5: "sad",
  6: "happy", 7: "great", 8: "neutral", 9: "great", 10: "sad",
  11: "happy", 12: "neutral", 13: "great", 14: "stressed", 15: "happy",
};

const MONTH_NAME = "June 2026";
const DAYS_IN_MONTH = 30;
const FIRST_WEEKDAY = 1; // 0 = Sunday ... June 1, 2026 is a Monday → index 1

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function MoodCalendar() {
  const cells: (number | null)[] = [
    ...Array(FIRST_WEEKDAY).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];

  return (
    <>
      <style>{`
        .mood-calendar-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 1.6rem 1.7rem;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        .mood-calendar-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 1.2rem;
        }
        .mood-calendar-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }
        .mood-calendar-month {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .mood-calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.4rem;
        }

        .mood-calendar-weekday {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
          text-align: center;
          padding-bottom: 0.3rem;
        }

        .mood-calendar-day {
          aspect-ratio: 1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.74rem;
          font-weight: 500;
          color: #64748b;
          background: #f7f8fa;
          position: relative;
        }
        .mood-calendar-day.empty { background: transparent; }
        .mood-calendar-day.has-mood {
          color: #ffffff;
          font-weight: 600;
        }

        .mood-calendar-legend {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1.4rem;
          padding-top: 1.2rem;
          border-top: 1px solid #f1f3f5;
        }
        .mood-legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.74rem;
          color: #64748b;
        }
        .mood-legend-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
        }
      `}</style>

      <div className="mood-calendar-card">
        <div className="mood-calendar-header">
          <div className="mood-calendar-title">Mood Calendar</div>
          <div className="mood-calendar-month">{MONTH_NAME}</div>
        </div>

        <div className="mood-calendar-grid">
          {WEEKDAY_LABELS.map((d, i) => (
            <div className="mood-calendar-weekday" key={i}>{d}</div>
          ))}

          {cells.map((day, i) => {
            if (day === null) return <div className="mood-calendar-day empty" key={i} />;
            const mood = DUMMY_MONTH_DATA[day];
            const bg = mood ? getMoodColor(mood) : undefined;
            return (
              <div
                key={i}
                className={`mood-calendar-day${mood ? " has-mood" : ""}`}
                style={mood ? { background: bg } : undefined}
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
      </div>
    </>
  );
}
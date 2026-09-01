"use client";

import { Habit } from "@/services/habit";

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5c1.5 2.5-1 4-1 6.5a2.5 2.5 0 0 0 5 0c1.6 1.6 2.5 3.5 2.5 5.5a6.5 6.5 0 0 1-13 0c0-3.5 2-5.5 3.5-7.5z" />
    </svg>
  );
}

export default function HabitProgress({ habits }: { habits: Habit[] }) {
  const total     = habits.length;
  const completed = habits.filter((h) => h.completedToday).length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const currentStreak = habits.length > 0
    ? Math.max(...habits.map((h) => h.streak))
    : 0;

  return (
    <>
      <style>{`
        .habit-progress-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px;
          padding: 1.5rem 1.6rem; box-shadow: 0 1px 2px rgba(15,23,42,0.03);
          display: flex; flex-direction: column; gap: 1.4rem;
        }
        .hp-section-label {
          font-size: 0.78rem; font-weight: 600; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.6rem;
        }
        .hp-progress-header {
          display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.55rem;
        }
        .hp-progress-text { font-size: 0.88rem; font-weight: 500; color: #334155; }
        .hp-progress-pct {
          font-family: 'DM Serif Display', serif; font-size: 1.3rem;
          color: #16a34a; letter-spacing: -0.02em;
        }
        .hp-bar-track {
          width: 100%; height: 8px; background: #f1f5f9;
          border-radius: 100px; overflow: hidden;
        }
        .hp-bar-fill {
          height: 100%; border-radius: 100px;
          background: linear-gradient(90deg, #16a34a, #4ade80);
          transition: width 0.5s ease;
        }
        .hp-divider { height: 1px; background: #f1f5f9; }
        .hp-stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .hp-stat { display: flex; flex-direction: column; gap: 0.25rem; }
        .hp-stat-value {
          font-family: 'DM Serif Display', serif; font-size: 1.5rem;
          color: #0f172a; letter-spacing: -0.02em;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .hp-stat-value .flame { color: #f59e0b; }
        .hp-stat-label { font-size: 0.76rem; color: #94a3b8; }
        .hp-empty { font-size: 0.85rem; color: #94a3b8; }
      `}</style>

      <div className="habit-progress-card">
        {total === 0 ? (
          <div className="hp-empty">Add habits to see your progress here.</div>
        ) : (
          <>
            <div>
              <div className="hp-section-label">Today's Progress</div>
              <div className="hp-progress-header">
                <span className="hp-progress-text">
                  {completed} of {total} completed
                </span>
                <span className="hp-progress-pct">{pct}%</span>
              </div>
              <div className="hp-bar-track">
                <div className="hp-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="hp-divider" />

            <div>
              <div className="hp-section-label">Streaks</div>
              <div className="hp-stats-row">
                <div className="hp-stat">
                  <div className="hp-stat-value">
                    <span className="flame"><FlameIcon /></span>
                    {currentStreak}d
                  </div>
                  <div className="hp-stat-label">Current streak</div>
                </div>
                <div className="hp-stat">
                  <div className="hp-stat-value">{maxStreak}d</div>
                  <div className="hp-stat-label">Longest streak</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
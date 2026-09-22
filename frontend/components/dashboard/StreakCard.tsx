"use client";

function FlameIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5c1.5 2.5-1 4-1 6.5a2.5 2.5 0 0 0 5 0c1.6 1.6 2.5 3.5 2.5 5.5a6.5 6.5 0 0 1-13 0c0-3.5 2-5.5 3.5-7.5z" />
    </svg>
  );
}

interface StreakCardProps {
  streak: number;
  completedToday?: boolean;
  loading?: boolean;
}

export default function StreakCard({ streak, completedToday = true, loading = false }: StreakCardProps) {
  // Build last 7 days display.
  // The streak counts backward from the most recent completed day, which is
  // "today" once it's ticked, or "yesterday" while today is still open —
  // same rule as the backend's calculateStreak. So the highlighted block of
  // days ends at yesterday until completedToday flips true.
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isToday = i === 6;

    // Index (from the end) of the most recent day the streak includes:
    // 0 = today if completed today, 1 = today if not yet completed.
    const endOffset = completedToday ? 0 : 1;
    const done = i >= 7 - streak - endOffset && i <= 6 - endOffset;

    return {
      label: ["S", "M", "T", "W", "T", "F", "S"][d.getDay()],
      done,
      isToday,
    };
  });

  return (
    <>
      <style>{`
        .streak-card {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          border-radius: 18px; padding: 1.6rem 1.7rem; height: 100%;
          color: #ffffff; display: flex; flex-direction: column;
          justify-content: space-between; gap: 1.2rem;
          position: relative; overflow: hidden;
          box-shadow: 0 8px 24px rgba(22,163,74,0.25);
        }
        .streak-card::after {
          content: ''; position: absolute;
          width: 140px; height: 140px; border-radius: 50%;
          background: rgba(255,255,255,0.08); top: -50px; right: -50px;
        }
        .streak-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; position: relative; z-index: 1;
        }
        .streak-icon {
          width: 44px; height: 44px; border-radius: 11px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .streak-value {
          font-family: 'DM Serif Display', serif; font-size: 2.4rem;
          letter-spacing: -0.02em; line-height: 1;
        }
        .streak-label { font-size: 0.8rem; color: rgba(255,255,255,0.75); margin-top: 0.3rem; }
        .streak-message {
          font-size: 0.82rem; font-weight: 500;
          color: rgba(255,255,255,0.92); position: relative; z-index: 1;
        }
        .streak-days { display: flex; gap: 0.5rem; position: relative; z-index: 1; }
        .streak-day {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.74rem; font-weight: 600;
          background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.6);
        }
        .streak-day.done { background: rgba(255,255,255,0.95); color: #15803d; }
        .streak-skeleton { opacity: 0.5; }
      `}</style>

      <div className="streak-card">
        <div className="streak-top">
          <div>
            <div className={`streak-value${loading ? " streak-skeleton" : ""}`}>
              {loading ? "—" : `${streak} day${streak !== 1 ? "s" : ""}`}
            </div>
            <div className="streak-label">Current habit streak</div>
          </div>
          <div className="streak-icon"><FlameIcon /></div>
        </div>

        <div className="streak-message">
          {loading ? " " : streak >= 5
            ? "You're on a roll — keep it going."
            : streak > 0
            ? "Every day counts. Don't break it."
            : "Start your streak today."}
        </div>

        <div className="streak-days">
          {days.map((d, i) => (
            <div key={i} className={`streak-day${d.done ? " done" : ""}`}>
              {d.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
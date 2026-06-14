"use client";

// Mood scale: 1 (lowest) to 5 (highest). Placeholder data — to be replaced with Recharts + real data.
const WEEK_DATA = [
  { day: "Mon", value: 4 },
  { day: "Tue", value: 4 },
  { day: "Wed", value: 3 },
  { day: "Thu", value: 2 },
  { day: "Fri", value: 4 },
  { day: "Sat", value: 5 },
  { day: "Sun", value: 3 },
];

const MAX_VALUE = 5;

export default function MoodChart() {
  return (
    <>
      <style>{`
        .mood-chart-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 16px;
          padding: 1.5rem 1.6rem;
          margin-top: 2rem;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        .mood-chart-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 1.6rem;
        }
        .mood-chart-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }
        .mood-chart-sub {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .mood-chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 0.75rem;
          height: 140px;
        }

        .mood-bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          flex: 1;
          height: 100%;
          justify-content: flex-end;
        }

        .mood-bar {
          width: 100%;
          max-width: 32px;
          border-radius: 6px 6px 3px 3px;
          background: rgba(22, 163, 74, 0.15);
          position: relative;
          transition: background 0.15s;
        }
        .mood-bar.high { background: #16a34a; }

        .mood-bar-day {
          font-size: 0.74rem;
          color: #94a3b8;
          font-weight: 500;
        }
      `}</style>

      <div className="mood-chart-card">
        <div className="mood-chart-header">
          <div className="mood-chart-title">Weekly Mood Overview</div>
          <div className="mood-chart-sub">Placeholder — Recharts coming next</div>
        </div>

        <div className="mood-chart-bars">
          {WEEK_DATA.map((d) => {
            const heightPct = (d.value / MAX_VALUE) * 100;
            const isHigh = d.value >= 4;
            return (
              <div className="mood-bar-col" key={d.day}>
                <div
                  className={`mood-bar${isHigh ? " high" : ""}`}
                  style={{ height: `${heightPct}%` }}
                />
                <div className="mood-bar-day">{d.day}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
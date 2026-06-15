"use client";

function ActivityIcon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "journal":
      return (
        <svg {...common}>
          <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5z" />
          <path d="M12 3h6.5A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5H12" />
        </svg>
      );
    case "mood":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14c1 1.3 2.4 2 4 2s3-.7 4-2" />
          <path d="M9 9h.01M15 9h.01" />
        </svg>
      );
    case "gratitude":
      return (
        <svg {...common}>
          <path d="M12 20.5 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5z" />
        </svg>
      );
    default:
      return null;
  }
}

const ACTIVITY = [
  { time: "10:30 AM", label: "Added Journal entry", icon: "journal" },
  { time: "2:15 PM", label: "Logged Mood — Happy", icon: "mood" },
  { time: "8:00 PM", label: "Added Gratitude entry", icon: "gratitude" },
];

export default function RecentActivity() {
  return (
    <>
      <style>{`
        .activity-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 1.6rem 1.7rem;
          margin-top: 1.2rem;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          height: 100%;
        }
        .activity-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1.3rem;
        }
        .activity-list {
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .activity-row {
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          padding-bottom: 1.2rem;
          position: relative;
        }
        .activity-row:last-child { padding-bottom: 0; }

        .activity-row:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 17px; top: 36px; bottom: 0;
          width: 1px;
          background: #eef1f4;
        }

        .activity-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(22, 163, 74, 0.08);
          color: #16a34a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          z-index: 1;
        }
        .activity-body { display: flex; flex-direction: column; gap: 0.2rem; padding-top: 0.2rem; }
        .activity-text {
          font-size: 0.85rem;
          color: #334155;
          font-weight: 500;
        }
        .activity-time {
          font-size: 0.76rem;
          color: #94a3b8;
        }
      `}</style>

      <div className="activity-card">
        <div className="activity-title">Recent Activity</div>
        <div className="activity-list">
          {ACTIVITY.map((item, i) => (
            <div className="activity-row" key={i}>
              <div className="activity-icon">
                <ActivityIcon name={item.icon} />
              </div>
              <div className="activity-body">
                <div className="activity-text">{item.label}</div>
                <div className="activity-time">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
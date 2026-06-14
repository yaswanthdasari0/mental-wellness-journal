"use client";

function StatIcon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "mood":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14c1 1.3 2.4 2 4 2s3-.7 4-2" />
          <path d="M9 9h.01M15 9h.01" />
        </svg>
      );
    case "streak":
      return (
        <svg {...common}>
          <path d="M12 2.5c1.5 2.5-1 4-1 6.5a2.5 2.5 0 0 0 5 0c1.6 1.6 2.5 3.5 2.5 5.5a6.5 6.5 0 0 1-13 0c0-3.5 2-5.5 3.5-7.5z" />
        </svg>
      );
    case "journal":
      return (
        <svg {...common}>
          <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5z" />
          <path d="M12 3h6.5A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5H12" />
        </svg>
      );
    case "meditation":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

export interface StatsCardProps {
  icon: "mood" | "streak" | "journal" | "meditation";
  label: string;
  value: string;
}

export default function StatsCard({ icon, label, value }: StatsCardProps) {
  return (
    <>
      <style>{`
        .stats-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 16px;
          padding: 1.3rem 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .stats-card:hover {
          border-color: #d8dde2;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
        }

        .stats-icon {
          width: 42px; height: 42px;
          border-radius: 11px;
          background: rgba(22, 163, 74, 0.08);
          color: #16a34a;
          display: flex; align-items: center; justify-content: center;
        }

        .stats-value {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .stats-label {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: -0.4rem;
        }
      `}</style>

      <div className="stats-card">
        <div className="stats-icon">
          <StatIcon name={icon} />
        </div>
        <div>
          <div className="stats-value">{value}</div>
          <div className="stats-label">{label}</div>
        </div>
      </div>
    </>
  );
}
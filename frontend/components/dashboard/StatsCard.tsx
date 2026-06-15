"use client";

function StatIcon({ name }: { name: string }) {
  const common = {
    width: 20,
    height: 20,
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
  icon: "mood" | "journal" | "meditation";
  label: string;
  value: string;
  caption?: string;
}

export default function StatsCard({ icon, label, value, caption }: StatsCardProps) {
  return (
    <>
      <style>{`
        .stats-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 1.4rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.2rem;
          height: 100%;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
        }
        .stats-card:hover {
          border-color: #d8dde2;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
          transform: translateY(-2px);
        }

        .stats-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: #f0fdf4;
          color: #16a34a;
          display: flex; align-items: center; justify-content: center;
        }

        .stats-value {
          font-family: 'DM Serif Display', serif;
          font-size: 1.9rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .stats-label {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 0.3rem;
        }

        .stats-caption {
          font-size: 0.74rem;
          color: #16a34a;
          margin-top: 0.5rem;
          font-weight: 500;
        }
      `}</style>

      <div className="stats-card">
        <div className="stats-icon">
          <StatIcon name={icon} />
        </div>
        <div>
          <div className="stats-value">{value}</div>
          <div className="stats-label">{label}</div>
          {caption && <div className="stats-caption">{caption}</div>}
        </div>
      </div>
    </>
  );
}
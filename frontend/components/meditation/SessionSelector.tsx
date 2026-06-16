"use client";

export const SESSIONS = [
  { label: "5 min",  seconds: 300  },
  { label: "10 min", seconds: 600  },
  { label: "15 min", seconds: 900  },
  { label: "20 min", seconds: 1200 },
];

export default function SessionSelector({
  selected,
  onChange,
}: {
  selected: number;
  onChange: (seconds: number) => void;
}) {
  return (
    <>
      <style>{`
        .session-selector-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 1.4rem 1.6rem;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }

        .session-selector-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.9rem;
        }

        .session-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
        }

        .session-option {
          padding: 0.7rem 0;
          border-radius: 10px;
          border: 1.5px solid #e8eaed;
          background: #ffffff;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .session-option:hover {
          border-color: #16a34a;
          color: #16a34a;
        }
        .session-option.selected {
          border-color: #16a34a;
          background: rgba(22,163,74,0.07);
          color: #16a34a;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .session-options { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="session-selector-card">
        <div className="session-selector-label">Session Length</div>
        <div className="session-options">
          {SESSIONS.map((s) => (
            <button
              key={s.seconds}
              className={`session-option${selected === s.seconds ? " selected" : ""}`}
              onClick={() => onChange(s.seconds)}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
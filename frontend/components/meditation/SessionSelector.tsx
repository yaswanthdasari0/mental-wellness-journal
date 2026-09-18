"use client";

import { useState } from "react";

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
  const [customMin, setCustomMin] = useState("");
  const [customErr, setCustomErr] = useState("");

  const handleCustom = () => {
    const mins = parseInt(customMin, 10);
    if (isNaN(mins) || mins < 1) {
      setCustomErr("Enter a number greater than 0.");
      return;
    }
    if (mins > 180) {
      setCustomErr("Maximum is 180 minutes.");
      return;
    }
    setCustomErr("");
    onChange(mins * 60);
    setCustomMin("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCustom();
  };

  const isCustomActive = !SESSIONS.some((s) => s.seconds === selected);

  return (
    <>
      <style>{`
        .session-selector-card {
          background: #ffffff; border: 1px solid #e8eaed;
          border-radius: 18px; padding: 1.4rem 1.6rem;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }
        .session-selector-label {
          font-size: 0.8rem; font-weight: 600; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.9rem;
        }

        /* Preset buttons */
        .session-options {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem;
          margin-bottom: 1rem;
        }
        .session-option {
          padding: 0.7rem 0; border-radius: 10px;
          border: 1.5px solid #e8eaed; background: #ffffff;
          font-size: 0.875rem; font-weight: 500; color: #64748b;
          text-align: center; cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .session-option:hover { border-color: #16a34a; color: #16a34a; }
        .session-option.selected {
          border-color: #16a34a;
          background: rgba(22,163,74,0.07);
          color: #16a34a; font-weight: 600;
        }

        /* Custom input row */
        .session-custom-label {
          font-size: 0.78rem; color: #64748b;
          font-weight: 500; margin-bottom: 0.5rem; display: block;
        }
        .session-custom-row { display: flex; gap: 0.6rem; align-items: center; }
        .session-custom-input {
          flex: 1; background: #f7f8fa; border: 1px solid #e8eaed;
          border-radius: 9px; padding: 0.65rem 0.9rem;
          font-size: 0.875rem; color: #334155;
          font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.2s;
        }
        .session-custom-input:focus { border-color: #16a34a; }
        .session-custom-input.active { border-color: #16a34a; background: rgba(22,163,74,0.04); }
        .session-custom-unit {
          font-size: 0.82rem; color: #94a3b8; flex-shrink: 0;
        }
        .session-custom-btn {
          background: #16a34a; color: #ffffff; border: none;
          padding: 0.65rem 1.2rem; border-radius: 9px;
          font-size: 0.85rem; font-weight: 600; cursor: pointer;
          transition: background 0.2s; font-family: 'Inter', sans-serif;
          flex-shrink: 0;
        }
        .session-custom-btn:hover { background: #15803d; }
        .session-custom-err { font-size: 0.76rem; color: #f87171; margin-top: 0.4rem; }

        /* Active custom badge */
        .session-custom-active {
          font-size: 0.76rem; color: #16a34a; margin-top: 0.4rem;
          font-weight: 500;
        }

        @media (max-width: 480px) {
          .session-options { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="session-selector-card">
        <div className="session-selector-label">Session Length</div>

        {/* Preset options */}
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

        {/* Custom duration */}
        <label className="session-custom-label">Custom duration</label>
        <div className="session-custom-row">
          <input
            type="number"
            min="1"
            max="180"
            className={`session-custom-input${isCustomActive ? " active" : ""}`}
            placeholder="e.g. 25"
            value={customMin}
            onChange={(e) => { setCustomMin(e.target.value); setCustomErr(""); }}
            onKeyDown={handleKey}
          />
          <span className="session-custom-unit">min</span>
          <button className="session-custom-btn" onClick={handleCustom} type="button">
            Set
          </button>
        </div>

        {customErr && <div className="session-custom-err">{customErr}</div>}

        {isCustomActive && (
          <div className="session-custom-active">
            Custom: {Math.round(selected / 60)} min selected
          </div>
        )}
      </div>
    </>
  );
}
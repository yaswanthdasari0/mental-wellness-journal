"use client";

import { useState } from "react";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function HabitForm({ onAdd }: { onAdd?: (name: string) => void }) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (!value.trim()) return;
    // TODO: POST /api/habits
    onAdd?.(value.trim());
    setValue("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <>
      <style>{`
        .habit-form-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 1.4rem 1.6rem;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }

        .habit-form-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 0.7rem;
          display: block;
        }

        .habit-form-row {
          display: flex;
          gap: 0.75rem;
        }

        .habit-form-input {
          flex: 1;
          background: #f7f8fa;
          border: 1px solid #e8eaed;
          border-radius: 9px;
          padding: 0.72rem 1rem;
          font-size: 0.875rem;
          color: #334155;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .habit-form-input::placeholder { color: #94a3b8; }
        .habit-form-input:focus { border-color: #16a34a; }

        .habit-form-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 0.72rem 1.3rem;
          border-radius: 9px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .habit-form-btn:hover { background: #15803d; }
        .habit-form-btn:disabled {
          background: #e8eaed;
          color: #94a3b8;
          cursor: not-allowed;
        }
      `}</style>

      <div className="habit-form-card">
        <label className="habit-form-label">Add a new habit</label>
        <div className="habit-form-row">
          <input
            type="text"
            className="habit-form-input"
            placeholder="e.g. Read 20 pages"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="habit-form-btn" onClick={handleAdd} disabled={!value.trim()}>
            <PlusIcon /> Add Habit
          </button>
        </div>
      </div>
    </>
  );
}
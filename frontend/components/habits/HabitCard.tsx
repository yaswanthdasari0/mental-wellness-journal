"use client";

import { useState } from "react";

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export interface HabitCardProps {
  name: string;
  streak: number;
  defaultDone?: boolean;
}

export default function HabitCard({ name, streak, defaultDone = false }: HabitCardProps) {
  const [done, setDone] = useState(defaultDone);

  return (
    <>
      <style>{`
        .habit-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 13px;
          padding: 1rem 1.3rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: box-shadow 0.18s, border-color 0.18s;
          cursor: pointer;
          user-select: none;
        }
        .habit-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 3px 10px rgba(15,23,42,0.05);
        }
        .habit-card.done {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        /* Custom checkbox */
        .habit-checkbox {
          width: 22px; height: 22px;
          border-radius: 7px;
          border: 1.8px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.18s, border-color 0.18s;
          background: #ffffff;
        }
        .habit-card.done .habit-checkbox {
          background: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }

        .habit-name {
          flex: 1;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
          transition: color 0.18s;
        }
        .habit-card.done .habit-name {
          color: #16a34a;
        }

        .habit-streak {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.76rem;
          color: #94a3b8;
          font-weight: 500;
          flex-shrink: 0;
        }
        .habit-streak-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f59e0b;
        }
      `}</style>

      <div
        className={`habit-card${done ? " done" : ""}`}
        onClick={() => setDone((v) => !v)}
      >
        <div className="habit-checkbox">
          {done && <CheckIcon />}
        </div>
        <div className="habit-name">{name}</div>
        <div className="habit-streak">
          <span className="habit-streak-dot" />
          {streak} day streak
        </div>
      </div>
    </>
  );
}
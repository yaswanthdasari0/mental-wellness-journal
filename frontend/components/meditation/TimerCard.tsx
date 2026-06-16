"use client";

import { useState, useEffect, useRef } from "react";

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4l14 8-14 8V4z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="4" width="4" height="16" rx="1" />
      <rect x="15" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.35 2.65L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

const SIZE = 220;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export default function TimerCard({
  totalSeconds,
  onComplete,
}: {
  totalSeconds: number;
  onComplete?: () => void;
}) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when duration changes
  useEffect(() => {
    setRunning(false);
    setDone(false);
    setRemaining(totalSeconds);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [totalSeconds]);

  // Countdown tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setDone(true);
            onComplete?.();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const progress = remaining / totalSeconds;
  const dashOffset = CIRC * (1 - progress);

  const handleReset = () => {
    setRunning(false);
    setDone(false);
    setRemaining(totalSeconds);
  };

  return (
    <>
      <style>{`
        .timer-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 2rem 1.6rem 1.8rem;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.6rem;
        }

        .timer-svg-wrap { position: relative; }

        .timer-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.2rem;
        }

        .timer-digits {
          font-family: 'DM Serif Display', serif;
          font-size: 2.6rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .timer-done-text {
          font-size: 0.78rem;
          color: #16a34a;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .timer-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .timer-main-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .timer-main-btn:hover { background: #15803d; }
        .timer-main-btn.pause { background: #f59e0b; }
        .timer-main-btn.pause:hover { background: #d97706; }

        .timer-reset-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 10px;
          border: 1px solid #e8eaed;
          background: #f7f8fa;
          color: #64748b;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .timer-reset-btn:hover { border-color: #16a34a; color: #16a34a; }
      `}</style>

      <div className="timer-card">
        {/* Circular SVG progress ring */}
        <div className="timer-svg-wrap">
          <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
            {/* Track */}
            <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
            {/* Progress */}
            <circle
              cx={SIZE/2} cy={SIZE/2} r={R}
              fill="none"
              stroke={done ? "#16a34a" : "#16a34a"}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>
          <div className="timer-text">
            <div className="timer-digits">{fmt(remaining)}</div>
            {done && <div className="timer-done-text">Complete</div>}
          </div>
        </div>

        <div className="timer-controls">
          <button
            className={`timer-main-btn${running ? " pause" : ""}`}
            onClick={() => { if (!done) setRunning((r) => !r); }}
            disabled={done}
          >
            {running ? <><PauseIcon /> Pause</> : <><PlayIcon /> {remaining < totalSeconds && !done ? "Resume" : "Start"}</>}
          </button>
          <button className="timer-reset-btn" onClick={handleReset} title="Reset">
            <ResetIcon />
          </button>
        </div>
      </div>
    </>
  );
}
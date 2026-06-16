"use client";

import { useState, useEffect } from "react";

const PHASES = [
  { label: "Inhale",  duration: 4, color: "#16a34a" },
  { label: "Hold",    duration: 4, color: "#f59e0b" },
  { label: "Exhale",  duration: 4, color: "#60a5fa" },
];

export default function BreathingGuide({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);
  const [tick, setTick] = useState(PHASES[0].duration);

  useEffect(() => {
    if (!active) {
      setPhase(0);
      setTick(PHASES[0].duration);
      return;
    }

    const id = setInterval(() => {
      setTick((t) => {
        if (t <= 1) {
          setPhase((p) => {
            const next = (p + 1) % PHASES.length;
            setTick(PHASES[next].duration);
            return next;
          });
          return PHASES[0].duration; // will be overwritten by setPhase callback
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [active]);

  const current = PHASES[phase];

  return (
    <>
      <style>{`
        .breathing-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 1.4rem 1.6rem;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }

        .breathing-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 1rem;
        }

        /* Animated orb */
        .breathing-orb-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 1.2rem;
        }
        .breathing-orb {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: var(--orb-color, #16a34a);
          opacity: 0.15;
          transition: transform 4s ease-in-out, opacity 0.5s, background 0.5s;
        }
        .breathing-orb.inhale  { transform: scale(1.4); opacity: 0.25; }
        .breathing-orb.hold    { transform: scale(1.4); opacity: 0.25; }
        .breathing-orb.exhale  { transform: scale(1);   opacity: 0.12; }

        .breathing-phase {
          text-align: center;
          margin-bottom: 1.1rem;
        }
        .breathing-phase-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .breathing-phase-tick {
          font-size: 0.82rem;
          color: #94a3b8;
          margin-top: 0.2rem;
        }

        /* Phase row indicators */
        .breathing-phases-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
        }
        .breathing-phase-item {
          padding: 0.6rem 0.5rem;
          border-radius: 9px;
          border: 1px solid #e8eaed;
          text-align: center;
        }
        .breathing-phase-item.current {
          border-color: var(--phase-color);
          background: color-mix(in srgb, var(--phase-color) 8%, white);
        }
        .breathing-phase-item-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
        }
        .breathing-phase-item.current .breathing-phase-item-name {
          color: var(--phase-color);
        }
        .breathing-phase-item-dur {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 0.15rem;
        }

        .breathing-inactive-msg {
          text-align: center;
          font-size: 0.85rem;
          color: #cbd5e1;
          padding: 0.5rem 0;
        }
      `}</style>

      <div className="breathing-card">
        <div className="breathing-label">Breathing Guide</div>

        {active ? (
          <>
            <div className="breathing-orb-wrap">
              <div
                className={`breathing-orb ${current.label.toLowerCase()}`}
                style={{ "--orb-color": current.color } as React.CSSProperties}
              />
            </div>

            <div className="breathing-phase">
              <div className="breathing-phase-name">{current.label}</div>
              <div className="breathing-phase-tick">{tick}s</div>
            </div>

            <div className="breathing-phases-row">
              {PHASES.map((p, i) => (
                <div
                  key={p.label}
                  className={`breathing-phase-item${i === phase ? " current" : ""}`}
                  style={{ "--phase-color": p.color } as React.CSSProperties}
                >
                  <div className="breathing-phase-item-name">{p.label}</div>
                  <div className="breathing-phase-item-dur">{p.duration}s</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="breathing-inactive-msg">
            Start the timer to begin breathing guidance.
          </div>
        )}
      </div>
    </>
  );
}
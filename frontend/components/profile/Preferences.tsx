"use client";

import { useState } from "react";

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 0 1 12 0c0 3 1 4.5 1.5 5.5H4.5C5 13.5 6 12 6 9z" />
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <>
      <style>{`
        .toggle {
          width: 42px; height: 24px;
          border-radius: 100px;
          background: #e2e8f0;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.25s;
          flex-shrink: 0;
          padding: 0;
        }
        .toggle.on { background: #16a34a; }
        .toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          transition: transform 0.25s;
        }
        .toggle.on .toggle-thumb { transform: translateX(18px); }
      `}</style>
      <button className={`toggle${on ? " on" : ""}`} onClick={onToggle} type="button" aria-label="toggle">
        <div className="toggle-thumb" />
      </button>
    </>
  );
}

const DEFAULT_PREFS = [
  { key: "darkMode",       label: "Dark Mode",        sub: "Switch to a darker interface",       icon: "moon",     on: false },
  { key: "notifications",  label: "Notifications",    sub: "Get alerts and reminders",            icon: "bell",     on: true  },
  { key: "dailyReminder",  label: "Daily Reminder",   sub: "Nudge to log mood and journal",       icon: "calendar", on: true  },
];

function PrefIcon({ name }: { name: string }) {
  if (name === "moon")     return <MoonIcon />;
  if (name === "bell")     return <BellIcon />;
  if (name === "calendar") return <CalendarIcon />;
  return null;
}

export default function Preferences() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  const toggle = (key: string) => {
    // TODO: PATCH /api/user/preferences once backend is ready
    setPrefs((p) => p.map((pref) => pref.key === key ? { ...pref, on: !pref.on } : pref));
  };

  return (
    <>
      <style>{`
        .prefs-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }

        .prefs-header {
          padding: 1.1rem 1.6rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .prefs-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }

        .prefs-list { padding: 0.4rem 0; }

        .pref-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.6rem;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s;
        }
        .pref-row:last-child { border-bottom: none; }
        .pref-row:hover { background: #fafbfc; }

        .pref-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: #f0fdf4;
          color: #16a34a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .pref-body { flex: 1; min-width: 0; }
        .pref-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
        }
        .pref-sub {
          font-size: 0.76rem;
          color: #94a3b8;
          margin-top: 0.15rem;
        }
      `}</style>

      <div className="prefs-card">
        <div className="prefs-header">
          <div className="prefs-title">Preferences</div>
        </div>
        <div className="prefs-list">
          {prefs.map((p) => (
            <div className="pref-row" key={p.key}>
              <div className="pref-icon"><PrefIcon name={p.icon} /></div>
              <div className="pref-body">
                <div className="pref-label">{p.label}</div>
                <div className="pref-sub">{p.sub}</div>
              </div>
              <Toggle on={p.on} onToggle={() => toggle(p.key)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
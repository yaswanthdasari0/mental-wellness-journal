"use client";

import { useState, useEffect } from "react";

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
          width: 42px; height: 24px; border-radius: 100px;
          background: #e2e8f0; border: none; cursor: pointer;
          position: relative; transition: background 0.25s; flex-shrink: 0; padding: 0;
        }
        .toggle.on { background: #16a34a; }
        .toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%;
          background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          transition: transform 0.25s;
        }
        .toggle.on .toggle-thumb { transform: translateX(18px); }
      `}</style>
      <button className={`toggle${on ? " on" : ""}`} onClick={onToggle} type="button">
        <div className="toggle-thumb" />
      </button>
    </>
  );
}

// The dark mode CSS injected into <html> when dark mode is on
const DARK_CSS = `
  :root {
    --bg: #0f172a;
    --card-bg: #1e293b;
    --surface: #1e293b;
    --surface-hover: #334155;
    --border: #334155;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --header-bg: #1e293b;
    --sidebar-bg: #1e293b;
  }
  body { background: #0f172a !important; color: #f1f5f9 !important; }
  .dashboard-layout, .mood-layout, .journal-layout, .gratitude-layout,
  .habits-layout, .meditation-layout, .profile-layout {
    background: #0f172a !important;
  }
  .sidebar { background: #1e293b !important; border-right-color: #334155 !important; }
  .sidebar-logo { color: #f1f5f9 !important; }
  .sidebar-link { color: #94a3b8 !important; }
  .sidebar-link:hover { background: #334155 !important; color: #f1f5f9 !important; }
  .sidebar-footer { border-top-color: #334155 !important; }
  .dash-header { background: #1e293b !important; border-bottom-color: #334155 !important; }
  .header-greeting { color: #f1f5f9 !important; }
  .header-search { background: #0f172a !important; border-color: #334155 !important; }
  .header-search input { color: #f1f5f9 !important; }
  .header-icon-btn { background: #0f172a !important; border-color: #334155 !important; color: #94a3b8 !important; }
  .mood-card, .stats-card, .streak-card-inner,
  .journal-card, .journal-editor-card, .gratitude-card, .gratitude-form-card,
  .habit-card, .habit-form-card, .habit-progress-card,
  .mood-chart-card, .activity-card, .session-history-card,
  .timer-card, .breathing-card, .session-selector-card,
  .profile-card, .account-settings-card, .prefs-card, .security-card,
  .mood-calendar-card {
    background: #1e293b !important; border-color: #334155 !important;
  }
  .mood-page-title, .journal-page-title, .gratitude-page-title,
  .habits-page-title, .meditation-page-title, .profile-page-title,
  .mood-selector-title, .section-heading, .habits-section-heading,
  .journal-section-heading, .gratitude-section-heading,
  .mood-section-heading, .dashboard-greeting,
  .hp-stat-value, .stats-value, .streak-value, .timer-digits,
  .mood-card-label, .journal-card-title, .account-settings-title,
  .prefs-title, .security-title, .profile-name,
  .session-history-title, .mood-chart-title, .activity-title {
    color: #f1f5f9 !important;
  }
  .mood-page-subtext, .journal-page-subtext, .profile-page-subtext,
  .mood-card-note, .journal-card-preview, .gratitude-card-item,
  .account-field-value, .pref-label, .security-row-label,
  .session-duration, .hp-progress-text {
    color: #94a3b8 !important;
  }
  .account-field-label, .pref-sub, .mood-card-date,
  .journal-card-date, .gratitude-card-date, .hp-stat-label,
  .stats-label, .mood-page-subtext, .profile-email, .profile-joined {
    color: #64748b !important;
  }
  .journal-editor-toolbar, .journal-editor-footer,
  .gratitude-form-header, .gratitude-form-footer,
  .account-settings-header, .prefs-header, .security-header,
  .session-history-top, .mood-chart-header {
    background: #0f172a !important; border-color: #334155 !important;
  }
  .journal-title-input, .journal-content-input {
    color: #f1f5f9 !important; background: transparent !important;
  }
  .gratitude-input { color: #f1f5f9 !important; border-bottom-color: #334155 !important; }
  .habit-name, .feature-row-name { color: #f1f5f9 !important; }
  .habit-card.done { background: #14532d !important; border-color: #166534 !important; }
  .hp-bar-track { background: #334155 !important; }
  .journal-editor-divider, .hp-divider { background: #334155 !important; }
  .mood-note-input, .habit-form-input, .profile-edit-input,
  .pw-input, .journal-edit-textarea, .journal-edit-input,
  .gratitude-edit-input {
    background: #0f172a !important; border-color: #334155 !important; color: #f1f5f9 !important;
  }
  .mood-calendar-weekday { color: #64748b !important; }
  .mood-calendar-day { background: #334155 !important; color: #94a3b8 !important; }
`;

const PREFS_KEY = "mindspace_prefs";

interface Prefs {
  darkMode: boolean;
  notifications: boolean;
  dailyReminder: boolean;
}

const DEFAULT_PREFS: Prefs = {
  darkMode: false,
  notifications: true,
  dailyReminder: true,
};

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_PREFS;
}

function savePrefs(prefs: Prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

// Apply / remove dark mode CSS on <html>
function applyDarkMode(on: boolean) {
  const existing = document.getElementById("mindspace-dark-style");
  if (on) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = "mindspace-dark-style";
      style.textContent = DARK_CSS;
      document.head.appendChild(style);
    }
    document.documentElement.classList.add("dark");
  } else {
    existing?.remove();
    document.documentElement.classList.remove("dark");
  }
}

export default function Preferences() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  // Load saved prefs on mount and apply dark mode immediately
  useEffect(() => {
    const loaded = loadPrefs();
    setPrefs(loaded);
    applyDarkMode(loaded.darkMode);
  }, []);

  const toggle = (key: keyof Prefs) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      savePrefs(updated);
      if (key === "darkMode") applyDarkMode(updated.darkMode);
      return updated;
    });
  };

  const PREF_ITEMS = [
    { key: "darkMode"       as const, label: "Dark Mode",      sub: "Switch to a darker interface",   icon: "moon"     },
    { key: "notifications"  as const, label: "Notifications",  sub: "Get alerts and reminders",        icon: "bell"     },
    { key: "dailyReminder"  as const, label: "Daily Reminder", sub: "Nudge to log mood and journal",   icon: "calendar" },
  ];

  return (
    <>
      <style>{`
        .prefs-card {
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border, #e8eaed);
          border-radius: 18px; overflow: hidden;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }
        .prefs-header { padding: 1.1rem 1.6rem; border-bottom: 1px solid var(--border, #f1f5f9); }
        .prefs-title { font-size: 0.95rem; font-weight: 600; color: var(--text-primary, #0f172a); }
        .prefs-list { padding: 0.4rem 0; }
        .pref-row {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.6rem; border-bottom: 1px solid #f8fafc;
          transition: background 0.15s;
        }
        .pref-row:last-child { border-bottom: none; }
        .pref-row:hover { background: var(--surface, #fafbfc); }
        .pref-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: #f0fdf4; color: #16a34a;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pref-body { flex: 1; min-width: 0; }
        .pref-label { font-size: 0.875rem; font-weight: 500; color: var(--text-primary, #1e293b); }
        .pref-sub { font-size: 0.76rem; color: #94a3b8; margin-top: 0.15rem; }
      `}</style>

      <div className="prefs-card">
        <div className="prefs-header">
          <div className="prefs-title">Preferences</div>
        </div>
        <div className="prefs-list">
          {PREF_ITEMS.map((p) => (
            <div className="pref-row" key={p.key}>
              <div className="pref-icon">
                {p.icon === "moon"     && <MoonIcon />}
                {p.icon === "bell"     && <BellIcon />}
                {p.icon === "calendar" && <CalendarIcon />}
              </div>
              <div className="pref-body">
                <div className="pref-label">{p.label}</div>
                <div className="pref-sub">{p.sub}</div>
              </div>
              <Toggle on={prefs[p.key]} onToggle={() => toggle(p.key)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
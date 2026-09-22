"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "@/services/user";

function MoonIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>; }
function BellIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 3 1 4.5 1.5 5.5H4.5C5 13.5 6 12 6 9z"/><path d="M9.5 17a2.5 2.5 0 0 0 5 0"/></svg>; }
function CalendarIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>; }
function LockIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }

function Toggle({ on, onToggle, disabled }: { on: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <>
      <style>{`
        .toggle { width: 42px; height: 24px; border-radius: 100px; background: #e2e8f0; border: none; cursor: pointer; position: relative; transition: background 0.25s; flex-shrink: 0; padding: 0; }
        .toggle.on { background: #16a34a; }
        .toggle:disabled { opacity: 0.5; cursor: not-allowed; }
        .toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.15); transition: transform 0.25s; }
        .toggle.on .toggle-thumb { transform: translateX(18px); }
      `}</style>
      <button className={`toggle${on ? " on" : ""}`} onClick={onToggle} type="button" disabled={disabled}>
        <div className="toggle-thumb" />
      </button>
    </>
  );
}

const DARK_CSS = `
  body, html { background: #0f172a !important; color: #e2e8f0 !important; }
  .dashboard-layout, .mood-layout, .journal-layout, .gratitude-layout,
  .habits-layout, .meditation-layout, .profile-layout, .pub-layout { background: #0f172a !important; }
  .sidebar-inner { background: #1e293b !important; border-right-color: #334155 !important; }
  .sidebar-logo { color: #e2e8f0 !important; }
  .sidebar-collapse-btn { border-color: #334155 !important; }
  .sidebar-link { color: #64748b !important; }
  .sidebar-link:hover { background: #334155 !important; color: #e2e8f0 !important; }
  .sidebar-link.active { background: rgba(22,163,74,0.15) !important; }
  .sidebar-footer { border-top-color: #334155 !important; }
  .sidebar-profile-btn:hover { background: #334155 !important; }
  .sidebar-user-name { color: #e2e8f0 !important; }
  .sidebar-profile-dropdown { background: #1e293b !important; border-color: #334155 !important; }
  .dropdown-item { color: #94a3b8 !important; }
  .dropdown-item:hover { background: #334155 !important; color: #e2e8f0 !important; }
  .dropdown-item.danger { color: #f87171 !important; }
  .dropdown-divider { background: #334155 !important; }
  .dash-header { background: #1e293b !important; border-bottom-color: #334155 !important; }
  .header-greeting, .header-logo { color: #e2e8f0 !important; }
  .header-search-box { background: #0f172a !important; border-color: #334155 !important; }
  .header-search-box input { color: #e2e8f0 !important; }
  .header-icon-btn { background: #0f172a !important; border-color: #334155 !important; }
  .mood-card, .stats-card, .journal-card, .journal-editor-card,
  .gratitude-card, .gratitude-form-card, .habit-card, .habit-form-card,
  .habit-progress-card, .mood-chart-card, .activity-card,
  .session-history-card, .timer-card, .breathing-card,
  .session-selector-card, .profile-card, .account-settings-card,
  .prefs-card, .security-card, .mood-calendar-card, .streak-card,
  .pub-card { background: #1e293b !important; border-color: #334155 !important; }
  .mood-page-title, .journal-page-title, .gratitude-page-title,
  .habits-page-title, .meditation-page-title, .profile-page-title,
  .dashboard-greeting, .pub-name { color: #e2e8f0 !important; }
  .mood-page-subtext, .journal-page-subtext, .gratitude-page-subtext,
  .habits-page-subtext, .meditation-page-subtext, .profile-page-subtext,
  .pub-handle, .pub-bio, .pub-joined { color: #64748b !important; }
  .account-settings-title, .prefs-title, .security-title { color: #e2e8f0 !important; }
  .account-field-label, .pref-sub, .mood-card-date { color: #64748b !important; }
  .account-field-value, .pref-label, .security-row-label,
  .habit-name, .journal-card-title { color: #94a3b8 !important; }
  .account-settings-header, .prefs-header, .security-header,
  .account-edit-form { border-color: #334155 !important; }
  .account-edit-input, .pw-input, .profile-edit-input,
  .mood-note-input, .habit-form-input, .habit-edit-input,
  .gratitude-edit-input, .journal-edit-input, .journal-edit-textarea {
    background: #0f172a !important; border-color: #334155 !important; color: #e2e8f0 !important;
  }
  .journal-title-input, .journal-content-input { color: #e2e8f0 !important; }
  .journal-editor-toolbar { background: #0f172a !important; border-color: #334155 !important; }
  .gratitude-form-header { background: #0f172a !important; border-color: #334155 !important; }
  .gratitude-input { color: #e2e8f0 !important; border-bottom-color: #334155 !important; }
  .habit-card.done { background: #14532d !important; border-color: #166534 !important; }
  .habit-checkbox { background: #0f172a !important; border-color: #475569 !important; }
  .hp-bar-track { background: #334155 !important; }
  .hp-stat-value, .stats-value, .timer-digits { color: #e2e8f0 !important; }
  .session-history-top { background: #0f172a !important; border-color: #334155 !important; }
  .security-row { border-color: #334155 !important; }
  .security-row:hover { background: #334155 !important; }
  .pref-row { border-color: #334155 !important; }
  .pref-row:hover { background: #334155 !important; }
  .mood-calendar-day { background: #334155 !important; color: #94a3b8 !important; }
  .pub-stats { background: #334155 !important; }
  .pub-stat { background: #1e293b !important; }
  .pub-stat-value, .pub-follow-num { color: #e2e8f0 !important; }
  ::placeholder { color: #475569 !important; }
`;

const PREFS_KEY = "mindspace_prefs";
interface Prefs { darkMode: boolean; notifications: boolean; dailyReminder: boolean; }
const DEFAULT: Prefs = { darkMode: false, notifications: true, dailyReminder: true };

function loadPrefs(): Prefs {
  try { const r = localStorage.getItem(PREFS_KEY); return r ? { ...DEFAULT, ...JSON.parse(r) } : DEFAULT; }
  catch { return DEFAULT; }
}
function savePrefs(p: Prefs) { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); }

function applyDarkMode(on: boolean) {
  document.getElementById("mindspace-dark-style")?.remove();
  if (on) {
    const s = document.createElement("style");
    s.id = "mindspace-dark-style"; s.textContent = DARK_CSS;
    document.head.appendChild(s);
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default function Preferences() {
  const [prefs, setPrefs]       = useState<Prefs>(DEFAULT);
  const [isPublic, setIsPublic] = useState(true);
  const [privLoading, setPrivLoading] = useState(false);
  const [privMsg, setPrivMsg]   = useState("");

  useEffect(() => {
    const loaded = loadPrefs();
    setPrefs(loaded);
    applyDarkMode(loaded.darkMode);

    // Load isPublic from profile
    import("@/services/user").then(({ getProfile }) => {
      getProfile().then((u: any) => setIsPublic(u.isPublic ?? true)).catch(() => {});
    });
  }, []);

  const toggle = (key: keyof Prefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    savePrefs(updated);
    setPrefs(updated);
    if (key === "darkMode") {
      setTimeout(() => {
        applyDarkMode(updated.darkMode);
        window.dispatchEvent(new Event("dark-mode-changed"));
      }, 0);
    }
  };

  const togglePrivacy = async () => {
    setPrivLoading(true); setPrivMsg("");
    try {
      const { updateProfile } = await import("@/services/user");
      await (updateProfile as any)({ isPublic: !isPublic });
      setIsPublic((v) => !v);
      setPrivMsg(!isPublic ? "Account is now public." : "Account is now private.");
      setTimeout(() => setPrivMsg(""), 2500);
    } catch (err: any) {
      setPrivMsg(err.message || "Failed to update privacy.");
    } finally {
      setPrivLoading(false);
    }
  };

  const PREF_ITEMS = [
    { key: "darkMode"      as const, label: "Dark Mode",       sub: "Switch to a darker interface",  icon: "moon"     },
    { key: "notifications" as const, label: "Notifications",   sub: "Get alerts and reminders",       icon: "bell"     },
    { key: "dailyReminder" as const, label: "Daily Reminder",  sub: "Nudge to log mood and journal",  icon: "calendar" },
  ];

  return (
    <>
      <style>{`
        .prefs-card { background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 2px rgba(15,23,42,0.03); }
        .prefs-header { padding: 1.1rem 1.6rem; border-bottom: 1px solid #f1f5f9; }
        .prefs-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; }
        .prefs-list { padding: 0.4rem 0; }
        .pref-row { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.6rem; border-bottom: 1px solid #f8fafc; transition: background 0.15s; }
        .pref-row:last-child { border-bottom: none; }
        .pref-row:hover { background: #fafbfc; }
        .pref-icon { width: 34px; height: 34px; border-radius: 9px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pref-icon.private { background: #f5f3ff; color: #7c3aed; }
        .pref-body { flex: 1; min-width: 0; }
        .pref-label { font-size: 0.875rem; font-weight: 500; color: #1e293b; }
        .pref-sub { font-size: 0.76rem; color: #94a3b8; margin-top: 0.15rem; }
        .pref-msg { font-size: 0.78rem; color: #16a34a; padding: 0.5rem 1.6rem; }
      `}</style>

      <div className="prefs-card">
        <div className="prefs-header"><div className="prefs-title">Preferences</div></div>
        <div className="prefs-list">

          {/* Standard toggles */}
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

          {/* Privacy toggle — saves to backend */}
          <div className="pref-row">
            <div className="pref-icon private"><LockIcon /></div>
            <div className="pref-body">
              <div className="pref-label">Private Account</div>
              <div className="pref-sub">
                {isPublic ? "Your profile is visible to everyone." : "Only followers can see your stats."}
              </div>
            </div>
            <Toggle on={!isPublic} onToggle={togglePrivacy} disabled={privLoading} />
          </div>
        </div>

        {privMsg && <div className="pref-msg">{privMsg}</div>}
      </div>
    </>
  );
}
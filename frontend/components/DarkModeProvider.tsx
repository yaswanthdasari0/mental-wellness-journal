"use client";

import { useEffect } from "react";

export default function DarkModeProvider() {
  useEffect(() => {
    const applyDarkMode = () => {
      try {
        const raw    = localStorage.getItem("mindspace_prefs");
        const prefs  = raw ? JSON.parse(raw) : {};
        const isDark = prefs.darkMode === true;

        document.getElementById("mindspace-dark-style")?.remove();

        if (isDark) {
          const style      = document.createElement("style");
          style.id         = "mindspace-dark-style";
          style.textContent = DARK_CSS;
          document.head.appendChild(style);
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch {}
    };

    applyDarkMode();
    window.addEventListener("storage", applyDarkMode);
    window.addEventListener("dark-mode-changed", applyDarkMode);
    return () => {
      window.removeEventListener("storage", applyDarkMode);
      window.removeEventListener("dark-mode-changed", applyDarkMode);
    };
  }, []);

  return null;
}

const DARK_CSS = `
  body, html { background: #0f172a !important; color: #e2e8f0 !important; }

  /* ── Layouts ── */
  .dashboard-layout, .mood-layout, .journal-layout, .gratitude-layout,
  .habits-layout, .meditation-layout, .profile-layout {
    background: #0f172a !important;
  }

  /* ── Sidebar ── */
  .sidebar-inner { background: #1e293b !important; border-right-color: #334155 !important; }
  .sidebar-logo { color: #e2e8f0 !important; }
  .sidebar-collapse-btn { border-color: #334155 !important; color: #64748b !important; }
  .sidebar-collapse-btn:hover { background: #334155 !important; color: #e2e8f0 !important; }
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

  /* ── Header ── */
  .dash-header { background: #1e293b !important; border-bottom-color: #334155 !important; }
  .header-greeting { color: #e2e8f0 !important; }
  .header-search { background: #0f172a !important; border-color: #334155 !important; }
  .header-search input { color: #e2e8f0 !important; }
  .header-icon-btn { background: #0f172a !important; border-color: #334155 !important; }
  .notif-dot { border-color: #1e293b !important; }

  /* ── All white cards ── */
  .mood-card, .stats-card, .journal-card, .journal-editor-card,
  .gratitude-card, .gratitude-form-card, .habit-card, .habit-form-card,
  .habit-progress-card, .mood-chart-card, .activity-card,
  .session-history-card, .timer-card, .breathing-card,
  .session-selector-card, .profile-card, .account-settings-card,
  .prefs-card, .security-card, .mood-calendar-card, .streak-card {
    background: #1e293b !important; border-color: #334155 !important;
  }

  /* ── Mood tracker specific ── */
  .mood-selector-card { background: #1e293b !important; border-color: #334155 !important; }
  .mood-selector-title { color: #e2e8f0 !important; }
  .mood-option {
    background: #1e293b !important;
    border-color: #334155 !important;
  }
  .mood-option-label { color: #94a3b8 !important; }
  .mood-option:hover { border-color: #475569 !important; }
  .mood-note-label { color: #94a3b8 !important; }
  .mood-note-input {
    background: #0f172a !important;
    border-color: #334155 !important;
    color: #e2e8f0 !important;
  }
  .mood-save-btn:disabled { background: #334155 !important; color: #64748b !important; }
  .mood-section-heading { color: #e2e8f0 !important; }
  .mood-history-link { color: #4ade80 !important; }

  /* ── Mood history list ── */
  .mood-history-list { color: #e2e8f0 !important; }
  .mood-card-label { color: #e2e8f0 !important; }
  .mood-card-date { color: #64748b !important; }
  .mood-card-note { color: #94a3b8 !important; }

  /* ── Mood calendar ── */
  .mood-calendar-card { background: #1e293b !important; border-color: #334155 !important; }
  .mood-calendar-title { color: #e2e8f0 !important; }
  .mood-calendar-weekday { color: #64748b !important; }
  .mood-calendar-day { background: #334155 !important; color: #94a3b8 !important; }
  .mood-calendar-day.has-mood { color: #ffffff !important; }
  .mood-calendar-day.today { border-color: #16a34a !important; }
  .mood-nav-btn {
    background: #334155 !important;
    border-color: #475569 !important;
    color: #94a3b8 !important;
  }
  .mood-calendar-month { color: #64748b !important; }
  .mood-legend-item { color: #94a3b8 !important; }

  /* ── MoodChart (weekly overview) ── */
  .mood-chart-card { background: #1e293b !important; border-color: #334155 !important; }
  .mood-chart-title { color: #e2e8f0 !important; }
  .mood-chart-sub { color: #64748b !important; }
  .mood-day-label { fill: #64748b !important; }
  .mood-chart-loading, .mood-chart-error { color: #94a3b8 !important; }

  /* ── Page titles and texts ── */
  .mood-page-title, .journal-page-title, .gratitude-page-title,
  .habits-page-title, .meditation-page-title, .profile-page-title,
  .dashboard-greeting { color: #e2e8f0 !important; }

  .mood-page-subtext, .journal-page-subtext, .gratitude-page-subtext,
  .habits-page-subtext, .meditation-page-subtext, .profile-page-subtext {
    color: #64748b !important;
  }

  /* ── Dashboard stats ── */
  .stats-value { color: #e2e8f0 !important; }
  .stats-label { color: #64748b !important; }
  .section-heading, .habits-section-heading, .journal-section-heading,
  .gratitude-section-heading, .meditation-section-heading { color: #e2e8f0 !important; }

  /* ── Streak card ── */
  .streak-card { box-shadow: 0 8px 24px rgba(22,163,74,0.2) !important; }

  /* ── Quick actions ── */
  .quick-action-btn {
    background: #1e293b !important; border-color: #334155 !important; color: #94a3b8 !important;
  }
  .quick-action-btn:hover { border-color: #16a34a !important; color: #16a34a !important; }

  /* ── Activity ── */
  .activity-title { color: #e2e8f0 !important; }
  .activity-text { color: #94a3b8 !important; }
  .activity-time { color: #64748b !important; }
  .activity-row:not(:last-child)::after { background: #334155 !important; }

  /* ── Journal ── */
  .journal-editor-toolbar { background: #0f172a !important; border-color: #334155 !important; }
  .journal-editor-footer { background: #1e293b !important; border-color: #334155 !important; }
  .journal-title-input { color: #e2e8f0 !important; }
  .journal-content-input { color: #e2e8f0 !important; }
  .journal-editor-divider { background: #334155 !important; }
  .journal-card-title { color: #e2e8f0 !important; }
  .journal-card-preview { color: #94a3b8 !important; }
  .journal-card-date { color: #64748b !important; }
  .journal-card-words { color: #475569 !important; }
  .journal-char-count { color: #64748b !important; }
  .journal-section-heading { color: #e2e8f0 !important; }
  .journal-entry-count { color: #64748b !important; }
  .journal-edit-input, .journal-edit-textarea {
    background: #0f172a !important; border-color: #334155 !important; color: #e2e8f0 !important;
  }

  /* ── Gratitude ── */
  .gratitude-form-header { background: #0f172a !important; border-color: #334155 !important; }
  .gratitude-form-footer { background: #1e293b !important; border-color: #334155 !important; }
  .gratitude-form-header-label { color: #64748b !important; }
  .gratitude-input { color: #e2e8f0 !important; border-bottom-color: #334155 !important; }
  .gratitude-card-date { color: #64748b !important; }
  .gratitude-card-item { color: #94a3b8 !important; }
  .gratitude-edit-input { background: #0f172a !important; border-color: #334155 !important; color: #e2e8f0 !important; }
  .gratitude-section-heading { color: #e2e8f0 !important; }

  /* ── Habits ── */
  .habit-card { background: #1e293b !important; border-color: #334155 !important; }
  .habit-card.done { background: #14532d !important; border-color: #166534 !important; }
  .habit-name { color: #e2e8f0 !important; }
  .habit-card.done .habit-name { color: #4ade80 !important; }
  .habit-checkbox { background: #0f172a !important; border-color: #475569 !important; }
  .habit-streak { color: #64748b !important; }
  .habit-form-input { background: #0f172a !important; border-color: #334155 !important; color: #e2e8f0 !important; }
  .hp-bar-track { background: #334155 !important; }
  .hp-stat-value { color: #e2e8f0 !important; }
  .hp-stat-label { color: #64748b !important; }
  .hp-progress-text { color: #94a3b8 !important; }
  .hp-divider { background: #334155 !important; }
  .hp-section-label { color: #64748b !important; }
  .hp-empty { color: #64748b !important; }
  .habit-action-btn { border-color: #334155 !important; color: #64748b !important; }
  .habit-edit-input { background: #0f172a !important; border-color: #334155 !important; color: #e2e8f0 !important; }

  /* ── Meditation ── */
  .timer-digits { color: #e2e8f0 !important; }
  .session-history-title { color: #e2e8f0 !important; }
  .session-history-total { color: #64748b !important; }
  .session-duration { color: #e2e8f0 !important; }
  .session-when { color: #64748b !important; }
  .session-history-top { background: #0f172a !important; border-color: #334155 !important; }
  .session-divider { background: #334155 !important; }
  .session-row:hover { background: #334155 !important; }
  .session-option { background: #1e293b !important; border-color: #334155 !important; color: #94a3b8 !important; }
  .breathing-label { color: #64748b !important; }
  .breathing-phase-name { color: #e2e8f0 !important; }
  .breathing-phase-tick { color: #64748b !important; }
  .breathing-phase-item { background: #1e293b !important; border-color: #334155 !important; }
  .breathing-inactive-msg { color: #475569 !important; }
  .timer-reset-btn { background: #334155 !important; border-color: #475569 !important; color: #94a3b8 !important; }

  /* ── Profile ── */
  .profile-name { color: #e2e8f0 !important; }
  .profile-email, .profile-joined { color: #64748b !important; }
  .account-settings-title, .prefs-title, .security-title { color: #e2e8f0 !important; }
  .account-field-label { color: #64748b !important; }
  .account-field-value { color: #94a3b8 !important; }
  .account-field-row { border-color: #334155 !important; }
  .account-settings-header, .prefs-header, .security-header {
    background: #0f172a !important; border-color: #334155 !important;
  }
  .pref-label { color: #e2e8f0 !important; }
  .pref-sub { color: #64748b !important; }
  .pref-row { border-color: #334155 !important; }
  .pref-row:hover { background: #334155 !important; }
  .security-row { border-color: #334155 !important; }
  .security-row:hover { background: #334155 !important; }
  .security-row-label { color: #e2e8f0 !important; }
  .security-row.danger .security-row-label { color: #f87171 !important; }
  .pw-input { background: #0f172a !important; border-color: #334155 !important; color: #e2e8f0 !important; }
  .profile-edit-input { background: #0f172a !important; border-color: #334155 !important; color: #e2e8f0 !important; }
  .profile-btn-cancel { border-color: #334155 !important; color: #94a3b8 !important; }
  .profile-edit-btn { border-color: #334155 !important; color: #94a3b8 !important; }

  /* ── Generic inputs placeholder ── */
  ::placeholder { color: #475569 !important; }
`;
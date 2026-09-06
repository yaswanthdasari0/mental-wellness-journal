"use client";

import { useEffect } from "react";

// This component goes in layout.tsx — runs once and applies dark mode
// across the entire app on every page load
export default function DarkModeProvider() {
  useEffect(() => {
    const applyDarkMode = () => {
      try {
        const raw   = localStorage.getItem("mindspace_prefs");
        const prefs = raw ? JSON.parse(raw) : {};
        const isDark = prefs.darkMode === true;

        // Remove existing
        document.getElementById("mindspace-dark-style")?.remove();

        if (isDark) {
          const style  = document.createElement("style");
          style.id     = "mindspace-dark-style";
          style.textContent = DARK_CSS;
          document.head.appendChild(style);
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch {}
    };

    // Apply on every page load
    applyDarkMode();

    // Re-apply when preferences change
    window.addEventListener("storage", applyDarkMode);
    window.addEventListener("dark-mode-changed", applyDarkMode);
    return () => {
      window.removeEventListener("storage", applyDarkMode);
      window.removeEventListener("dark-mode-changed", applyDarkMode);
    };
  }, []);

  return null; // renders nothing, just runs the effect
}

const DARK_CSS = `
  body, html { background: #0f172a !important; color: #e2e8f0 !important; }

  /* Layouts */
  .dashboard-layout, .mood-layout, .journal-layout, .gratitude-layout,
  .habits-layout, .meditation-layout, .profile-layout {
    background: #0f172a !important;
  }

  /* Sidebar */
  .sidebar-inner {
    background: #1e293b !important;
    border-right-color: #334155 !important;
  }
  .sidebar-logo { color: #e2e8f0 !important; }
  .sidebar-collapse-btn { border-color: #334155 !important; color: #64748b !important; }
  .sidebar-collapse-btn:hover { background: #334155 !important; color: #e2e8f0 !important; }
  .sidebar-link { color: #64748b !important; }
  .sidebar-link:hover { background: #334155 !important; color: #e2e8f0 !important; }
  .sidebar-link.active { background: rgba(22,163,74,0.15) !important; }
  .sidebar-footer { border-top-color: #334155 !important; }
  .sidebar-profile-btn:hover { background: #334155 !important; }
  .sidebar-user-name { color: #e2e8f0 !important; }
  .sidebar-profile-dropdown {
    background: #1e293b !important;
    border-color: #334155 !important;
  }
  .dropdown-item { color: #94a3b8 !important; }
  .dropdown-item:hover { background: #334155 !important; color: #e2e8f0 !important; }
  .dropdown-item.danger { color: #f87171 !important; }
  .dropdown-divider { background: #334155 !important; }

  /* Header */
  .dash-header { background: #1e293b !important; border-bottom-color: #334155 !important; }
  .header-greeting { color: #e2e8f0 !important; }
  .header-search { background: #0f172a !important; border-color: #334155 !important; }
  .header-search input { color: #e2e8f0 !important; }
  .header-icon-btn { background: #0f172a !important; border-color: #334155 !important; }
  .notif-dot { border-color: #1e293b !important; }

  /* Cards — covers all pages */
  .mood-card, .stats-card, .journal-card, .journal-editor-card,
  .gratitude-card, .gratitude-form-card, .habit-card, .habit-form-card,
  .habit-progress-card, .mood-chart-card, .activity-card,
  .session-history-card, .timer-card, .breathing-card,
  .session-selector-card, .profile-card, .account-settings-card,
  .prefs-card, .security-card, .mood-calendar-card, .streak-card {
    background: #1e293b !important;
    border-color: #334155 !important;
  }

  /* Page titles */
  .mood-page-title, .journal-page-title, .gratitude-page-title,
  .habits-page-title, .meditation-page-title, .profile-page-title,
  .mood-selector-title, .dashboard-greeting,
  .hp-stat-value, .stats-value, .timer-digits,
  .mood-card-label, .journal-card-title, .account-settings-title,
  .prefs-title, .security-title, .profile-name,
  .session-history-title, .mood-chart-title, .activity-title,
  .section-heading, .habits-section-heading, .journal-section-heading,
  .gratitude-section-heading, .mood-section-heading,
  .meditation-section-heading, .meditation-page-title,
  .feature-row-name, .habit-name { color: #e2e8f0 !important; }

  /* Subtexts */
  .mood-page-subtext, .journal-page-subtext, .gratitude-page-subtext,
  .habits-page-subtext, .meditation-page-subtext, .profile-page-subtext,
  .mood-card-note, .journal-card-preview, .account-field-value,
  .pref-label, .security-row-label, .session-duration,
  .hp-progress-text, .habit-streak, .journal-char-count { color: #94a3b8 !important; }

  /* Muted labels */
  .account-field-label, .pref-sub, .mood-card-date,
  .journal-card-date, .gratitude-card-date, .hp-stat-label,
  .stats-label, .profile-email, .profile-joined, .session-when,
  .mood-calendar-weekday, .mood-chart-sub { color: #64748b !important; }

  /* Toolbars / headers inside cards */
  .journal-editor-toolbar, .journal-editor-footer,
  .gratitude-form-header, .gratitude-form-footer,
  .account-settings-header, .prefs-header, .security-header,
  .session-history-top, .mood-chart-header {
    background: #0f172a !important;
    border-color: #334155 !important;
  }

  /* Inputs */
  .journal-title-input, .journal-content-input { color: #e2e8f0 !important; }
  .gratitude-input { color: #e2e8f0 !important; border-bottom-color: #334155 !important; }
  .mood-note-input, .habit-form-input, .profile-edit-input,
  .pw-input, .journal-edit-textarea, .journal-edit-input,
  .gratitude-edit-input, .pw-input {
    background: #0f172a !important;
    border-color: #334155 !important;
    color: #e2e8f0 !important;
  }
  ::placeholder { color: #475569 !important; }

  /* Dividers / tracks */
  .journal-editor-divider, .hp-divider, .session-divider,
  .account-field-row { border-color: #334155 !important; }
  .hp-bar-track { background: #334155 !important; }

  /* Habit */
  .habit-card.done { background: #14532d !important; border-color: #166534 !important; }

  /* Calendar */
  .mood-calendar-day { background: #334155 !important; color: #94a3b8 !important; }
  .mood-calendar-day.has-mood { color: #ffffff !important; }

  /* Quick action buttons */
  .quick-action-btn {
    background: #1e293b !important;
    border-color: #334155 !important;
    color: #94a3b8 !important;
  }
  .quick-action-btn:hover { color: #16a34a !important; }

  /* Security rows */
  .security-row { border-color: #334155 !important; }
  .security-row:hover { background: #334155 !important; }

  /* Feature rows */
  .feature-row { border-color: #334155 !important; }
  .feature-row-desc { color: #64748b !important; }

  /* Session selector */
  .session-option { background: #1e293b !important; border-color: #334155 !important; color: #94a3b8 !important; }
`;
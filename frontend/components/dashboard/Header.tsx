"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, clearAuth } from "@/services/auth";

// ── Icons ──────────────────────────────────────────────

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 0 1 12 0c0 3 1 4.5 1.5 5.5H4.5C5 13.5 6 12 6 9z"/>
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0"/>
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <path d="M20 20l-3.2-3.2"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5"/>
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H9"/>
      <path d="M13 12h7m0 0-3-3m3 3-3 3"/>
    </svg>
  );
}

// ── Notification type ──────────────────────────────────

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  link: string;
}

function generateDailyReminders(): Notification[] {
  const now   = new Date();
  const hour  = now.getHours();
  const items: Notification[] = [];

  // Mood reminder — show if no mood logged yet today (we check prefs, not DB)
  if (hour >= 8) {
    items.push({
      id:    "reminder-mood",
      title: "Daily Mood Check-in",
      body:  "How are you feeling today? Log your mood and start your day right.",
      time:  "Today",
      read:  false,
      link:  "/mood",
    });
  }
  // Journal reminder — evenings
  if (hour >= 18) {
    items.push({
      id:    "reminder-journal",
      title: "Evening Journal Reminder",
      body:  "Take 5 minutes to reflect on your day. Write something, anything.",
      time:  "Today",
      read:  false,
      link:  "/journal",
    });
  }
  // Habit reminder — midday
  if (hour >= 12) {
    items.push({
      id:    "reminder-habits",
      title: "Check Your Habits",
      body:  "Have you completed your habits for today? Keep the streak alive.",
      time:  "Today",
      read:  false,
      link:  "/habits",
    });
  }
  // Gratitude reminder — evening
  if (hour >= 20) {
    items.push({
      id:    "reminder-gratitude",
      title: "Gratitude Entry",
      body:  "What are three things you're grateful for today?",
      time:  "Today",
      read:  false,
      link:  "/gratitude",
    });
  }

  return items;
}

export default function Header() {
  const router = useRouter();

  const [user, setUser]             = useState<{ name: string; email: string } | null>(null);
  const [avatar, setAvatar]         = useState<string | null>(null);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal]   = useState("");
  const [notifications, setNotifs]  = useState<Notification[]>([]);
  const [notifEnabled, setNotifEnabled] = useState(true);

  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  const load = () => {
    setUser(getUser());
    setAvatar(localStorage.getItem("mindspace_avatar"));
    // Load notification preference
    try {
      const prefs = JSON.parse(localStorage.getItem("mindspace_prefs") || "{}");
      setNotifEnabled(prefs.notifications !== false);
      // Load saved read states
      const savedIds: string[] = JSON.parse(localStorage.getItem("mindspace_read_notifs") || "[]");
      const reminders = generateDailyReminders().map((n) => ({
        ...n,
        read: savedIds.includes(n.id),
      }));
      setNotifs(reminders);
    } catch {
      setNotifs(generateDailyReminders());
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("profile-updated", load);
    window.addEventListener("dark-mode-changed", load);
    return () => {
      window.removeEventListener("profile-updated", load);
      window.removeEventListener("dark-mode-changed", load);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem("mindspace_read_notifs", JSON.stringify(updated.map((n) => n.id)));
  };

  const markRead = (id: string) => {
    const updated = notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    localStorage.setItem("mindspace_read_notifs", JSON.stringify(updated.filter((n) => n.read).map((n) => n.id)));
  };

  const handleLogout = () => {
    clearAuth();
    document.cookie = "mindspace_token=; path=/; max-age=0";
    router.push("/login");
  };

  const unread   = notifications.filter((n) => !n.read).length;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  // Search — navigate to relevant page
  const SEARCH_ROUTES = [
    { keywords: ["mood", "feeling", "emotion"],    href: "/mood"       },
    { keywords: ["journal", "diary", "write"],      href: "/journal"    },
    { keywords: ["gratitude", "grateful", "thank"], href: "/gratitude"  },
    { keywords: ["habit", "habits", "streak"],      href: "/habits"     },
    { keywords: ["meditation", "timer", "breathe"], href: "/meditation" },
    { keywords: ["profile", "settings", "account"], href: "/profile"   },
    { keywords: ["dashboard", "home", "overview"],  href: "/dashboard"  },
  ];

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || !searchVal.trim()) return;
    const q = searchVal.toLowerCase();
    const match = SEARCH_ROUTES.find((r) => r.keywords.some((k) => q.includes(k)));
    if (match) router.push(match.href);
    setSearchOpen(false);
    setSearchVal("");
  };

  return (
    <>
      <style>{`
        .dash-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 2rem; background: #ffffff;
          border-bottom: 1px solid #e8eaed;
          position: sticky; top: 0; z-index: 20;
        }

        /* Left — page title area */
        .header-left { display: flex; align-items: center; gap: 0.75rem; }
        .header-appname {
          font-family: 'DM Serif Display', serif; font-size: 1.1rem;
          color: #0f172a; letter-spacing: -0.02em; text-decoration: none;
        }
        .header-appname span { color: #16a34a; }

        /* Right icons */
        .header-right { display: flex; align-items: center; gap: 0.75rem; }

        /* Search bar */
        .header-search-wrap { position: relative; }
        .header-search-box {
          display: flex; align-items: center; gap: 0.5rem;
          background: #f4f6f8; border: 1px solid #e8eaed;
          border-radius: 8px; padding: 0.45rem 0.85rem;
          cursor: text; transition: border-color 0.2s;
        }
        .header-search-box:focus-within { border-color: #16a34a; }
        .header-search-box input {
          border: none; background: transparent; outline: none;
          font-size: 0.82rem; color: #475569;
          width: 180px; font-family: 'Inter', sans-serif;
        }
        .header-search-box input::placeholder { color: #94a3b8; }

        /* Icon buttons */
        .header-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 9px;
          background: #f4f6f8; color: #64748b;
          border: 1px solid #e8eaed; cursor: pointer;
          transition: background 0.15s, color 0.15s; position: relative;
          flex-shrink: 0;
        }
        .header-icon-btn:hover { background: #eef1f4; color: #0f172a; }

        /* Notification dot */
        .notif-dot {
          position: absolute; top: 6px; right: 6px;
          width: 8px; height: 8px; border-radius: 50%;
          background: #f43f5e; border: 1.5px solid #ffffff;
        }
        .notif-count {
          position: absolute; top: -4px; right: -4px;
          min-width: 18px; height: 18px; border-radius: 100px;
          background: #f43f5e; border: 2px solid #ffffff;
          color: #ffffff; font-size: 0.6rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
        }

        /* Notification panel */
        .notif-wrap { position: relative; }
        .notif-panel {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 340px; background: #ffffff;
          border: 1px solid #e8eaed; border-radius: 14px;
          box-shadow: 0 8px 32px rgba(15,23,42,0.12); overflow: hidden; z-index: 100;
        }
        .notif-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.2rem; border-bottom: 1px solid #f1f5f9;
        }
        .notif-panel-title { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
        .notif-mark-all {
          font-size: 0.74rem; color: #16a34a; cursor: pointer;
          background: none; border: none; font-family: 'Inter', sans-serif;
          font-weight: 500;
        }
        .notif-mark-all:hover { color: #15803d; }
        .notif-list { max-height: 320px; overflow-y: auto; }
        .notif-item {
          display: flex; gap: 0.75rem; padding: 0.85rem 1.2rem;
          border-bottom: 1px solid #f8fafc; cursor: pointer;
          transition: background 0.15s; text-decoration: none;
        }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: #f7f8fa; }
        .notif-item.unread { background: rgba(22,163,74,0.04); }
        .notif-dot-small {
          width: 8px; height: 8px; border-radius: 50%; background: #16a34a;
          flex-shrink: 0; margin-top: 6px;
        }
        .notif-dot-read {
          width: 8px; height: 8px; border-radius: 50%; background: transparent;
          flex-shrink: 0; margin-top: 6px;
        }
        .notif-item-body { flex: 1; min-width: 0; }
        .notif-item-title { font-size: 0.82rem; font-weight: 600; color: #0f172a; margin-bottom: 0.2rem; }
        .notif-item-body-text { font-size: 0.76rem; color: #64748b; line-height: 1.5; }
        .notif-item-time { font-size: 0.7rem; color: #94a3b8; margin-top: 0.3rem; }
        .notif-check-btn {
          background: none; border: none; cursor: pointer; color: #16a34a;
          padding: 0.2rem; flex-shrink: 0; opacity: 0.7;
        }
        .notif-check-btn:hover { opacity: 1; }
        .notif-empty {
          padding: 2rem 1.2rem; text-align: center;
          font-size: 0.85rem; color: #94a3b8;
        }
        .notif-disabled-msg {
          padding: 1rem 1.2rem; font-size: 0.78rem; color: #94a3b8;
          text-align: center; background: #f7f8fa;
          border-top: 1px solid #f1f5f9;
        }

        /* Avatar + profile dropdown */
        .header-avatar-wrap { position: relative; }
        .header-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: #16a34a; color: #ffffff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem; font-weight: 700;
          font-family: 'DM Serif Display', serif;
          overflow: hidden; cursor: pointer; border: 2px solid #e8eaed;
          transition: border-color 0.15s;
        }
        .header-avatar:hover { border-color: #16a34a; }
        .header-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .profile-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 200px; background: #ffffff;
          border: 1px solid #e8eaed; border-radius: 12px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.1); overflow: hidden; z-index: 100;
        }
        .profile-dropdown-user {
          padding: 0.9rem 1rem; border-bottom: 1px solid #f1f5f9;
        }
        .profile-dropdown-name { font-size: 0.85rem; font-weight: 600; color: #0f172a; }
        .profile-dropdown-email { font-size: 0.74rem; color: #94a3b8; margin-top: 0.15rem; }
        .dropdown-item {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.7rem 1rem; font-size: 0.84rem; font-weight: 500;
          color: #334155; text-decoration: none; cursor: pointer;
          background: transparent; border: none; width: 100%; text-align: left;
          transition: background 0.15s; font-family: 'Inter', sans-serif;
        }
        .dropdown-item:hover { background: #f4f6f8; }
        .dropdown-item.danger { color: #f43f5e; }
        .dropdown-item.danger:hover { background: #fff1f2; }
        .dropdown-divider { height: 1px; background: #f1f5f9; }

        @media (max-width: 700px) {
          .header-search-box { display: none; }
          .dash-header { padding: 0.85rem 1.2rem; }
          .notif-panel { width: 300px; right: -60px; }
        }
      `}</style>

      <header className="dash-header">
        {/* Left — brand */}
        <Link href="/dashboard" className="header-appname">
          Mind<span>Space</span>
        </Link>

        {/* Right — icons */}
        <div className="header-right">

          {/* Search */}
          <div className="header-search-box">
            <SearchIcon />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search pages... (press Enter)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* Notifications */}
          <div className="notif-wrap" ref={notifRef}>
            <button
              className="header-icon-btn"
              onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
              aria-label="Notifications"
            >
              <BellIcon />
              {notifEnabled && unread > 0 && (
                <span className="notif-count">{unread}</span>
              )}
            </button>

            {notifOpen && (
              <div className="notif-panel">
                <div className="notif-panel-header">
                  <div className="notif-panel-title">Notifications</div>
                  {notifEnabled && unread > 0 && (
                    <button className="notif-mark-all" onClick={markAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>

                {!notifEnabled ? (
                  <div className="notif-empty">
                    Notifications are turned off.<br />
                    <Link href="/profile" style={{ color: "#16a34a", fontSize: "0.78rem" }}>
                      Enable in Settings
                    </Link>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="notif-empty">You're all caught up!</div>
                ) : (
                  <div className="notif-list">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item${!n.read ? " unread" : ""}`}
                        onClick={() => { markRead(n.id); router.push(n.link); setNotifOpen(false); }}
                      >
                        <div className={n.read ? "notif-dot-read" : "notif-dot-small"} />
                        <div className="notif-item-body">
                          <div className="notif-item-title">{n.title}</div>
                          <div className="notif-item-body-text">{n.body}</div>
                          <div className="notif-item-time">{n.time}</div>
                        </div>
                        {!n.read && (
                          <button
                            className="notif-check-btn"
                            onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                            title="Mark read"
                          >
                            <CheckIcon />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {notifEnabled && (
                  <div className="notif-disabled-msg">
                    Reminders are based on time of day.<br />
                    Turn off in{" "}
                    <Link href="/profile" style={{ color: "#16a34a" }}>Profile → Preferences</Link>.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Avatar + profile dropdown */}
          <div className="header-avatar-wrap" ref={profileRef}>
            <div
              className="header-avatar"
              onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
            >
              {avatar
                ? <img src={avatar} alt="Profile" />
                : initials
              }
            </div>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-user">
                  <div className="profile-dropdown-name">{user?.name ?? "—"}</div>
                  <div className="profile-dropdown-email">{user?.email ?? "—"}</div>
                </div>
                <Link className="dropdown-item" href="/profile" onClick={() => setProfileOpen(false)}>
                  <UserIcon /> View Profile
                </Link>
                <Link className="dropdown-item" href="/profile" onClick={() => setProfileOpen(false)}>
                  <SettingsIcon /> Settings
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogoutIcon /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
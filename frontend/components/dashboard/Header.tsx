"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, clearAuth } from "@/services/auth";
import { getAvatar } from "@/services/avatar";
import { searchUsers, SearchUser } from "@/services/social";

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
function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

const getInitials = (name?: string) =>
  name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

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

  const [user, setUser]             = useState<{ id?: string; name: string; email: string } | null>(null);
  const [avatar, setAvatar]         = useState<string | null>(null);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifs]  = useState<Notification[]>([]);
  const [notifEnabled, setNotifEnabled] = useState(true);

  // People search
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState<SearchUser[]>([]);
  const [searching, setSearching]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const notifRef    = useRef<HTMLDivElement>(null);
  const profileRef  = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQuery = useRef("");

  const load = () => {
    const u = getUser();
    setUser(u);
    setAvatar(getAvatar(u)); // per-user avatar
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
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Clear any pending search timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

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
    try {
      clearAuth();
    } catch (err) {
      console.error("clearAuth failed during logout:", err);
    }
    document.cookie = "mindspace_token=; path=/; max-age=0";
    // Hard redirect (not router.push) so logout can't be blocked or
    // intercepted by any client-side auth/route guard.
    window.location.href = "/login";
  };

  // Debounced people search (350ms). Ignores out-of-order responses.
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSearchOpen(true);
    latestQuery.current = val;

    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (val.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const users = await searchUsers(val.trim());
        if (latestQuery.current === val) setResults(users);
      } catch {
        if (latestQuery.current === val) setResults([]);
      } finally {
        if (latestQuery.current === val) setSearching(false);
      }
    }, 350);
  };

  const handleResultClick = (username: string | null) => {
    if (!username) return;
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/u/${username}`);
  };

  const unread   = notifications.filter((n) => !n.read).length;
  const initials = getInitials(user?.name);

  return (
    <>
      <style>{`
        .dash-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 2rem; background: #ffffff;
          border-bottom: 1px solid #e8eaed;
          position: sticky; top: 0; z-index: 20;
        }

        /* Left — brand */
        .header-appname {
          font-family: 'DM Serif Display', serif; font-size: 1.1rem;
          color: #0f172a; letter-spacing: -0.02em; text-decoration: none;
        }
        .header-appname span { color: #16a34a; }

        /* Right icons */
        .header-right { display: flex; align-items: center; gap: 0.75rem; }

        /* ── Search ── */
        .header-search-wrap { position: relative; }
        .header-search-box {
          display: flex; align-items: center; gap: 0.5rem;
          background: #f4f6f8; border: 1px solid #e8eaed;
          border-radius: 8px; padding: 0.45rem 0.85rem;
          transition: border-color 0.2s; min-width: 220px;
        }
        .header-search-box:focus-within { border-color: #16a34a; background: #ffffff; }
        .header-search-box input {
          border: none; background: transparent; outline: none;
          font-size: 0.82rem; color: #334155; width: 100%;
          font-family: 'Inter', sans-serif;
        }
        .header-search-box input::placeholder { color: #94a3b8; }

        .search-dropdown {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0;
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 12px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.1); overflow: hidden; z-index: 100;
          min-width: 280px;
        }
        .search-dropdown-header {
          padding: 0.6rem 1rem; font-size: 0.72rem; color: #94a3b8;
          font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
          border-bottom: 1px solid #f1f5f9;
        }
        .search-result-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1rem; cursor: pointer; transition: background 0.12s;
        }
        .search-result-item:hover { background: #f7f8fa; }
        .search-result-item.no-username { cursor: default; opacity: 0.7; }
        .search-result-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          color: #ffffff; font-size: 0.78rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .search-result-info { flex: 1; min-width: 0; }
        .search-result-name {
          font-size: 0.85rem; font-weight: 600; color: #0f172a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .search-result-handle { font-size: 0.74rem; color: #94a3b8; }
        .search-result-private {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.7rem; color: #94a3b8; flex-shrink: 0;
        }
        .search-empty, .search-loading {
          padding: 1rem; font-size: 0.83rem; color: #94a3b8; text-align: center;
        }

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
          .dash-header { padding: 0.85rem 1.2rem; }
          .header-search-box { min-width: 140px; }
          .search-dropdown {
            position: fixed; top: 64px; left: 1rem; right: 1rem; min-width: 0;
          }
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

          {/* People search */}
          <div className="header-search-wrap" ref={searchRef}>
            <div className="header-search-box">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search people..."
                value={query}
                onChange={handleSearchInput}
                onFocus={() => query.trim().length >= 2 && setSearchOpen(true)}
              />
            </div>

            {searchOpen && query.trim().length >= 2 && (
              <div className="search-dropdown">
                <div className="search-dropdown-header">People</div>

                {searching ? (
                  <div className="search-loading">Searching...</div>
                ) : results.length === 0 ? (
                  <div className="search-empty">No users found for "{query}"</div>
                ) : (
                  results.map((u) => (
                    <div
                      key={u.id}
                      className={`search-result-item${u.username ? "" : " no-username"}`}
                      onClick={() => handleResultClick(u.username)}
                    >
                      <div className="search-result-avatar">{getInitials(u.name)}</div>
                      <div className="search-result-info">
                        <div className="search-result-name">{u.name}</div>
                        <div className="search-result-handle">
                          {u.username ? `@${u.username}` : "No username set"}
                        </div>
                      </div>
                      {!u.isPublic && (
                        <div className="search-result-private">
                          <LockIcon /> Private
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
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
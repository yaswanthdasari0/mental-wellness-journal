"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, clearAuth } from "@/services/auth";
import { getAvatar } from "@/services/avatar";
import { searchUsers, SearchUser } from "@/services/social";
import NotificationBell from "@/components/notifications/NotificationBell";

// ── Icons ──────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <path d="M20 20l-3.2-3.2"/>
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

export default function Header() {
  const router = useRouter();

  const [user, setUser]               = useState<{ id?: string; name: string; email: string } | null>(null);
  const [avatar, setAvatar]           = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // People search
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState<SearchUser[]>([]);
  const [searching, setSearching]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const profileRef  = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQuery = useRef("");

  const load = () => {
    const u = getUser();
    setUser(u);
    setAvatar(getAvatar(u)); // per-user avatar
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

          {/* Notifications — NotificationBell handles follow requests */}
          <NotificationBell />

          {/* Avatar + profile dropdown */}
          <div className="header-avatar-wrap" ref={profileRef}>
            <div
              className="header-avatar"
              onClick={() => setProfileOpen((v) => !v)}
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
                  <UserIcon /> My Profile
                </Link>
                <Link className="dropdown-item" href="/settings" onClick={() => setProfileOpen(false)}>
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
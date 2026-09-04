"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/services/auth";

function BellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 0 1 12 0c0 3 1 4.5 1.5 5.5H4.5C5 13.5 6 12 6 9z" />
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}

export default function Header() {
  const [user, setUser]     = useState<{ name: string; email: string } | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      const stored = getUser();
      setUser(stored);
      // Load profile picture from localStorage
      const pic = localStorage.getItem("mindspace_avatar");
      setAvatar(pic);
    };
    load();

    // Re-read when profile is updated
    window.addEventListener("storage", load);
    // Also listen for custom event fired after profile save
    window.addEventListener("profile-updated", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("profile-updated", load);
    };
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = user?.name?.split(" ")[0] ?? "";
  const initials  = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <style>{`
        .dash-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 2rem;
          background: var(--header-bg, #ffffff);
          border-bottom: 1px solid var(--border, #e8eaed);
          position: sticky; top: 0; z-index: 10;
        }
        .header-greeting { font-size: 0.95rem; font-weight: 600; color: var(--text-primary, #0f172a); }
        .header-right { display: flex; align-items: center; gap: 1.2rem; }
        .header-search {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--surface, #f4f6f8); border: 1px solid var(--border, #e8eaed);
          border-radius: 8px; padding: 0.45rem 0.85rem; color: #94a3b8;
          font-size: 0.82rem; width: 200px;
        }
        .header-search input {
          border: none; background: transparent; outline: none;
          font-size: 0.82rem; color: var(--text-primary, #475569);
          width: 100%; font-family: 'Inter', sans-serif;
        }
        .header-search input::placeholder { color: #94a3b8; }
        .header-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 9px;
          background: var(--surface, #f4f6f8); color: #64748b;
          border: 1px solid var(--border, #e8eaed);
          cursor: pointer; transition: background 0.15s, color 0.15s; position: relative;
        }
        .header-icon-btn:hover { background: var(--surface-hover, #eef1f4); color: var(--text-primary, #0f172a); }
        .notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #16a34a; border: 1.5px solid var(--header-bg, #ffffff);
        }
        .header-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: #16a34a; color: #ffffff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 600;
          font-family: 'DM Serif Display', serif; cursor: pointer;
          overflow: hidden;
        }
        .header-avatar img { width: 100%; height: 100%; object-fit: cover; }
        @media (max-width: 700px) { .header-search { display: none; } }
      `}</style>

      <header className="dash-header">
        <div className="header-greeting">
          {firstName ? `${getGreeting()}, ${firstName}` : getGreeting()}
        </div>

        <div className="header-right">
          <div className="header-search">
            <SearchIcon />
            <input type="text" placeholder="Search..." />
          </div>

          <button className="header-icon-btn" aria-label="Notifications">
            <BellIcon />
            <span className="notif-dot" />
          </button>

          <div className="header-avatar">
            {avatar
              ? <img src={avatar} alt="Profile" />
              : initials
            }
          </div>
        </div>
      </header>
    </>
  );
}
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getUser, clearAuth } from "@/services/auth";

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard",   icon: "home"   },
  { href: "/mood",       label: "Mood Tracker", icon: "smile"  },
  { href: "/journal",    label: "Journal",      icon: "book"   },
  { href: "/gratitude",  label: "Gratitude",    icon: "heart"  },
  { href: "/habits",     label: "Habits",       icon: "flame"  },
  { href: "/meditation", label: "Meditation",   icon: "circle" },
];

function Icon({ name }: { name: string }) {
  const c = {
    width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.8,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":    return <svg {...c}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>;
    case "smile":   return <svg {...c}><circle cx="12" cy="12" r="9"/><path d="M8 14c1 1.3 2.4 2 4 2s3-.7 4-2"/><path d="M9 9h.01M15 9h.01"/></svg>;
    case "book":    return <svg {...c}><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M12 3h6.5A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5H12"/></svg>;
    case "heart":   return <svg {...c}><path d="M12 20.5 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5z"/></svg>;
    case "flame":   return <svg {...c}><path d="M12 2.5c1.5 2.5-1 4-1 6.5a2.5 2.5 0 0 0 5 0c1.6 1.6 2.5 3.5 2.5 5.5a6.5 6.5 0 0 1-13 0c0-3.5 2-5.5 3.5-7.5z"/></svg>;
    case "circle":  return <svg {...c}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>;
    case "chevron": return <svg {...c}><path d="M9 18l6-6-6-6"/></svg>;
    case "menu":    return <svg {...c}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case "x":       return <svg {...c}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "user":    return <svg {...c}><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>;
    case "settings":return <svg {...c}><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
    case "logout":  return <svg {...c}><path d="M9 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H9"/><path d="M13 12h7m0 0-3-3m3 3-3 3"/></svg>;
    default:        return null;
  }
}

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();

  const [collapsed, setCollapsed]         = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [profileOpen, setProfileOpen]     = useState(false);
  const [user, setUser]                   = useState<{ name: string; email: string } | null>(null);
  const [avatar, setAvatar]               = useState<string | null>(null);
  const profileRef                        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => {
      setUser(getUser());
      setAvatar(localStorage.getItem("mindspace_avatar"));
    };
    load();
    window.addEventListener("profile-updated", load);
    return () => window.removeEventListener("profile-updated", load);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    document.cookie = "mindspace_token=; path=/; max-age=0";
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const sidebarContent = (
    <div className={`sidebar-inner${collapsed ? " collapsed" : ""}`}>
      {/* Top — logo + collapse toggle */}
      <div className="sidebar-top">
        {!collapsed && (
          <Link href="/" className="sidebar-logo">Mind<span>Space</span></Link>
        )}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon name={collapsed ? "chevron" : "x"} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link${isActive(item.href) ? " active" : ""}${collapsed ? " icon-only" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="icon-wrap"><Icon name={item.icon} /></span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Profile section at bottom */}
      <div className="sidebar-footer" ref={profileRef}>
        <div
          className={`sidebar-profile-btn${collapsed ? " icon-only" : ""}`}
          onClick={() => setProfileOpen((v) => !v)}
          title={collapsed ? "Profile" : undefined}
        >
          <div className="sidebar-avatar">
            {avatar
              ? <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : initials
            }
          </div>
          {!collapsed && (
            <>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user?.name ?? "—"}</div>
                <div className="sidebar-user-email">{user?.email ?? "—"}</div>
              </div>
              <span className="sidebar-profile-chevron">
                <Icon name="chevron" />
              </span>
            </>
          )}
        </div>

        {/* Profile dropdown */}
        {profileOpen && (
          <div className={`sidebar-profile-dropdown${collapsed ? " collapsed-dropdown" : ""}`}>
            <Link href="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
              <Icon name="user" /> {!collapsed && "View Profile"}
            </Link>
            <Link href="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
              <Icon name="settings" /> {!collapsed && "Settings"}
            </Link>
            <div className="dropdown-divider" />
            <button className="dropdown-item danger" onClick={handleLogout}>
              <Icon name="logout" /> {!collapsed && "Log Out"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        /* ── Mobile hamburger ── */
        .sidebar-mobile-toggle {
          display: none; position: fixed; top: 1rem; left: 1rem; z-index: 200;
          width: 38px; height: 38px; border-radius: 9px;
          background: #ffffff; border: 1px solid #e8eaed;
          color: #64748b; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        /* ── Overlay for mobile ── */
        .sidebar-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.35); z-index: 149;
        }

        /* ── Sidebar wrapper ── */
        .sidebar-wrapper {
          flex-shrink: 0;
          transition: width 0.25s ease;
        }

        .sidebar-inner {
          width: 240px; height: 100vh; position: sticky; top: 0;
          background: #ffffff; border-right: 1px solid #e8eaed;
          display: flex; flex-direction: column;
          padding: 1.2rem 0.75rem; transition: width 0.25s ease;
          overflow: hidden;
        }
        .sidebar-inner.collapsed { width: 68px; }

        /* ── Top area ── */
        .sidebar-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 0.5rem; margin-bottom: 1.5rem; min-height: 36px;
        }
        .sidebar-logo {
          font-family: 'DM Serif Display', serif; font-size: 1.2rem;
          color: #0f172a; letter-spacing: -0.02em; text-decoration: none;
          white-space: nowrap;
        }
        .sidebar-logo span { color: #16a34a; }
        .sidebar-collapse-btn {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e8eaed;
          background: transparent; color: #94a3b8; cursor: pointer;
          transition: background 0.15s, color 0.15s; flex-shrink: 0;
        }
        .sidebar-collapse-btn:hover { background: #f4f6f8; color: #0f172a; }

        /* ── Nav ── */
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.15rem; flex: 1; }
        .sidebar-link {
          display: flex; align-items: center; gap: 0.8rem;
          padding: 0.65rem 0.75rem; border-radius: 10px;
          font-size: 0.875rem; font-weight: 500; color: #64748b;
          text-decoration: none; border-left: 3px solid transparent;
          transition: background 0.15s, color 0.15s; white-space: nowrap;
        }
        .sidebar-link:hover { background: #f4f6f8; color: #0f172a; }
        .sidebar-link.active {
          background: rgba(22,163,74,0.07); color: #16a34a;
          border-left-color: #16a34a; font-weight: 600;
        }
        .sidebar-link.icon-only { justify-content: center; padding: 0.65rem; }
        .sidebar-link.icon-only.active { border-left-color: transparent; }
        .icon-wrap { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* ── Footer / profile ── */
        .sidebar-footer {
          border-top: 1px solid #e8eaed; padding-top: 0.75rem;
          margin-top: 0.75rem; position: relative;
        }
        .sidebar-profile-btn {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.6rem 0.5rem; border-radius: 10px; cursor: pointer;
          transition: background 0.15s;
        }
        .sidebar-profile-btn:hover { background: #f4f6f8; }
        .sidebar-profile-btn.icon-only { justify-content: center; }

        .sidebar-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: #16a34a; color: #ffffff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
          overflow: hidden;
        }
        .sidebar-user-info { flex: 1; min-width: 0; }
        .sidebar-user-name {
          font-size: 0.82rem; font-weight: 600; color: #0f172a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sidebar-user-email {
          font-size: 0.72rem; color: #94a3b8;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sidebar-profile-chevron { color: #94a3b8; flex-shrink: 0; }

        /* ── Dropdown ── */
        .sidebar-profile-dropdown {
          position: absolute; bottom: calc(100% + 8px); left: 0; right: 0;
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 12px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.1); overflow: hidden; z-index: 50;
        }
        .sidebar-profile-dropdown.collapsed-dropdown {
          left: 0; right: auto; width: 160px;
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 0.7rem;
          padding: 0.75rem 1rem; font-size: 0.85rem; font-weight: 500;
          color: #334155; text-decoration: none; cursor: pointer;
          background: transparent; border: none; width: 100%; text-align: left;
          transition: background 0.15s;
        }
        .dropdown-item:hover { background: #f4f6f8; }
        .dropdown-item.danger { color: #f43f5e; }
        .dropdown-item.danger:hover { background: #fff1f2; }
        .dropdown-divider { height: 1px; background: #f1f5f9; margin: 0.25rem 0; }

        /* ── Mobile ── */
        @media (max-width: 900px) {
          .sidebar-mobile-toggle { display: flex; }
          .sidebar-wrapper { display: none; }
          .sidebar-wrapper.mobile-open {
            display: block; position: fixed; left: 0; top: 0; bottom: 0; z-index: 150;
          }
          .sidebar-inner { width: 240px !important; height: 100vh; }
          .sidebar-overlay.visible { display: block; }
        }
      `}</style>

      {/* Mobile hamburger button */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? " visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar-wrapper${mobileOpen ? " mobile-open" : ""}`}>
        {sidebarContent}
      </div>
    </>
  );
}
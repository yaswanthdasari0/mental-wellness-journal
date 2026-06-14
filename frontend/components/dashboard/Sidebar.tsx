"use client";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/dashboard/mood", label: "Mood Tracker", icon: "smile" },
  { href: "/dashboard/journal", label: "Journal", icon: "book" },
  { href: "/dashboard/gratitude", label: "Gratitude", icon: "heart" },
  { href: "/dashboard/habits", label: "Habits", icon: "flame" },
  { href: "/dashboard/meditation", label: "Meditation", icon: "circle" },
  { href: "/dashboard/profile", label: "Profile", icon: "user" },
];

function Icon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
        </svg>
      );
    case "smile":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14c1 1.3 2.4 2 4 2s3-.7 4-2" />
          <path d="M9 9h.01M15 9h.01" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5z" />
          <path d="M12 3h6.5A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5H12" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M12 20.5 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5z" />
        </svg>
      );
    case "flame":
      return (
        <svg {...common}>
          <path d="M12 2.5c1.5 2.5-1 4-1 6.5a2.5 2.5 0 0 0 5 0c1.6 1.6 2.5 3.5 2.5 5.5a6.5 6.5 0 0 1-13 0c0-3.5 2-5.5 3.5-7.5z" />
        </svg>
      );
    case "circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M9 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H9" />
          <path d="M13 12h7m0 0-3-3m3 3-3 3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .sidebar {
          width: 240px;
          height: 100vh;
          position: sticky;
          top: 0;
          background: #ffffff;
          border-right: 1px solid #e8eaed;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
        }

        .sidebar-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.25rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          text-decoration: none;
          padding: 0.5rem 0.75rem 2rem;
          display: block;
        }
        .sidebar-logo span { color: #16a34a; }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          flex: 1;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.65rem 0.85rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          border-left: 3px solid transparent;
          transition: background 0.15s, color 0.15s;
        }
        .sidebar-link:hover {
          background: #f4f6f8;
          color: #0f172a;
        }
        .sidebar-link.active {
          background: rgba(22, 163, 74, 0.07);
          color: #16a34a;
          border-left-color: #16a34a;
          font-weight: 600;
        }
        .sidebar-link .icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-footer {
          border-top: 1px solid #e8eaed;
          padding-top: 0.75rem;
          margin-top: 0.75rem;
        }

        @media (max-width: 900px) {
          .sidebar { display: none; }
        }
      `}</style>

      <aside className="sidebar">
        <a href="/" className="sidebar-logo">Mind<span>Space</span></a>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`sidebar-link${isActive ? " active" : ""}`}
              >
                <span className="icon-wrap"><Icon name={item.icon} /></span>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <a href="/login" className="sidebar-link">
            <span className="icon-wrap"><Icon name="logout" /></span>
            Logout
          </a>
        </div>
      </aside>
    </>
  );
}
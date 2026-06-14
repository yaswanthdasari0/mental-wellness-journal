"use client";

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

export default function Header({ name = "Akash" }: { name?: string }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <style>{`
        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 2rem;
          background: #ffffff;
          border-bottom: 1px solid #e8eaed;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-greeting {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .header-search {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f4f6f8;
          border: 1px solid #e8eaed;
          border-radius: 8px;
          padding: 0.45rem 0.85rem;
          color: #94a3b8;
          font-size: 0.82rem;
          width: 200px;
        }
        .header-search input {
          border: none; background: transparent; outline: none;
          font-size: 0.82rem; color: #475569; width: 100%;
          font-family: 'Inter', sans-serif;
        }
        .header-search input::placeholder { color: #94a3b8; }

        .header-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px;
          border-radius: 9px;
          background: #f4f6f8;
          color: #64748b;
          border: 1px solid #e8eaed;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .header-icon-btn:hover { background: #eef1f4; color: #0f172a; }

        .notif-dot {
          position: absolute;
          top: 8px; right: 8px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #16a34a;
          border: 1.5px solid #ffffff;
        }

        .header-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: #16a34a;
          color: #ffffff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 600;
          font-family: 'DM Serif Display', serif;
          cursor: pointer;
        }

        @media (max-width: 700px) {
          .header-search { display: none; }
        }
      `}</style>

      <header className="dash-header">
        <div className="header-greeting">{getGreeting()}, {name}</div>

        <div className="header-right">
          <div className="header-search">
            <SearchIcon />
            <input type="text" placeholder="Search..." />
          </div>

          <button className="header-icon-btn" aria-label="Notifications">
            <BellIcon />
            <span className="notif-dot" />
          </button>

          <div className="header-avatar">{name.charAt(0)}</div>
        </div>
      </header>
    </>
  );
}
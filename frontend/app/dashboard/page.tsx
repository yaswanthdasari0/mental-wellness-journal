"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import StreakCard from "@/components/dashboard/StreakCard";
import MoodChart from "@/components/dashboard/MoodChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { getDashboardSummary, DashboardSummary } from "@/services/dashboard";
import { getUser } from "@/services/auth";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

const QUICK_ACTIONS = [
  { label: "New Journal Entry", href: "/journal"   },
  { label: "Log Mood",          href: "/mood"       },
  { label: "Add Gratitude",     href: "/gratitude"  },
  { label: "Track Habits",      href: "/habits"     },
  { label: "Meditate",          href: "/meditation" },
];

export default function DashboardPage() {
  const router  = useRouter();
  const user    = getUser();
  const name    = user?.name?.split(" ")[0] ?? "there";

  const [data, setData]       = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const summary = await getDashboardSummary();
        setData(summary);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Format today's mood for display
  const moodLabel = data?.todayMood
    ? data.todayMood.mood.charAt(0).toUpperCase() + data.todayMood.mood.slice(1)
    : "Not logged";

  const moodCaption = data?.todayMood ? "Logged today" : "Tap to log now";

  // Format meditation
  const meditationVal = data
    ? data.meditationMinutes > 0
      ? `${data.meditationMinutes} min`
      : "0 min"
    : "—";

  // Habit caption
  const habitCaption = data
    ? data.habitsTotal > 0
      ? `${data.habitsCompleted} of ${data.habitsTotal} done today`
      : "No habits yet"
    : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .dashboard-layout {
          display: flex; min-height: 100vh;
          background: #f7f8fa; font-family: 'Inter', sans-serif;
        }
        .dashboard-main { flex: 1; min-width: 0; }
        .dashboard-content { padding: 1.8rem 2rem 3rem; max-width: 1200px; }

        .dashboard-greeting {
          font-family: 'DM Serif Display', serif; font-size: 1.8rem;
          color: #0f172a; letter-spacing: -0.02em; margin-bottom: 0.3rem;
        }
        .dashboard-subtext { font-size: 0.88rem; color: #94a3b8; margin-bottom: 1.8rem; }

        .overview-grid {
          display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 1rem;
        }
        @media (max-width: 1000px) { .overview-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px)  {
          .overview-grid { grid-template-columns: 1fr; }
          .dashboard-content { padding: 1.5rem 1.2rem 2.5rem; }
        }

        .lower-grid {
          display: grid; grid-template-columns: 1.6fr 1fr;
          gap: 1.2rem; align-items: start;
        }
        @media (max-width: 900px) { .lower-grid { grid-template-columns: 1fr; } }

        /* Quick actions */
        .quick-actions-section { margin-top: 2rem; }
        .quick-actions-heading { font-size: 0.95rem; font-weight: 600; color: #0f172a; margin-bottom: 0.9rem; }
        .quick-actions-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .quick-action-btn {
          display: flex; align-items: center; gap: 0.5rem;
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 10px;
          padding: 0.7rem 1.2rem; font-size: 0.85rem; font-weight: 500;
          color: #334155; cursor: pointer; text-decoration: none;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .quick-action-btn:hover {
          border-color: #16a34a; background: rgba(22,163,74,0.05); color: #16a34a;
        }

        /* Error */
        .dashboard-error {
          background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px;
          padding: 1rem 1.4rem; font-size: 0.875rem; color: #be123c; margin-bottom: 1.5rem;
        }
      `}</style>

      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-main">
          <Header />

          <div className="dashboard-content">
            <h1 className="dashboard-greeting">Good to see you, {name}</h1>
            <p className="dashboard-subtext">Here's where things stand today.</p>

            {error && <div className="dashboard-error">{error}</div>}

            {/* Stats row */}
            <div className="overview-grid">
              <StreakCard streak={data?.streak ?? 0} loading={loading} />
              <StatsCard
                icon="mood"
                label="Today's Mood"
                value={loading ? "—" : moodLabel}
                caption={loading ? "" : moodCaption}
                loading={loading}
              />
              <StatsCard
                icon="journal"
                label="Journal Entries"
                value={loading ? "—" : String(data?.journalCount ?? 0)}
                caption={loading ? "" : `${data?.weekJournalCount ?? 0} this week`}
                loading={loading}
              />
              <StatsCard
                icon="meditation"
                label="Meditation"
                value={loading ? "—" : meditationVal}
                caption={loading ? "" : "this week"}
                loading={loading}
              />
            </div>

            {/* Quick actions */}
            <div className="quick-actions-section">
              <div className="quick-actions-heading">Quick Actions</div>
              <div className="quick-actions-row">
                {QUICK_ACTIONS.map((a) => (
                  <Link key={a.href} href={a.href} className="quick-action-btn">
                    <PlusIcon /> {a.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Chart + Activity */}
            <div className="lower-grid">
              <MoodChart />
              <RecentActivity
                activities={data?.recentActivity ?? []}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
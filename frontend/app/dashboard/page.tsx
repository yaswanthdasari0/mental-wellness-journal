import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import MoodChart from "@/components/dashboard/MoodChart";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #f7f8fa;
          font-family: 'Inter', sans-serif;
        }

        .dashboard-main {
          flex: 1;
          min-width: 0;
        }

        .dashboard-content {
          padding: 1.8rem 2rem 3rem;
          max-width: 1200px;
        }

        .dashboard-greeting {
          font-family: 'DM Serif Display', serif;
          font-size: 1.7rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 1.6rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        @media (max-width: 1000px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .stats-grid { grid-template-columns: 1fr; }
          .dashboard-content { padding: 1.5rem 1.2rem 2.5rem; }
        }
      `}</style>

      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-main">
          <Header name="Akash" />

          <div className="dashboard-content">
            <h1 className="dashboard-greeting">Welcome back, Akash</h1>

            <div className="stats-grid">
              <StatsCard icon="mood" label="Today's Mood" value="Happy" />
              <StatsCard icon="streak" label="Current Streak" value="5 Days" />
              <StatsCard icon="journal" label="Journal Entries" value="12" />
              <StatsCard icon="meditation" label="Meditation Minutes" value="20 min" />
            </div>

            <QuickActions />
            <MoodChart />
            <RecentActivity />
          </div>
        </div>
      </div>
    </>
  );
}
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import StreakCard from "@/components/dashboard/StreakCard";
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
          font-size: 1.8rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .dashboard-subtext {
          font-size: 0.88rem;
          color: #94a3b8;
          margin-bottom: 1.8rem;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 1000px) {
          .overview-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .overview-grid { grid-template-columns: 1fr; }
          .dashboard-content { padding: 1.5rem 1.2rem 2.5rem; }
        }

        .lower-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 1.2rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .lower-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-main">
          <Header name="Akash" />

          <div className="dashboard-content">
            <h1 className="dashboard-greeting">Good to see you, Akash</h1>
            <p className="dashboard-subtext">Here's where things stand today.</p>

            <div className="overview-grid">
              <StreakCard />
              <StatsCard icon="mood" label="Today's Mood" value="Happy" caption="Logged at 9:12 AM" />
              <StatsCard icon="journal" label="Journal Entries" value="12" caption="2 this week" />
              <StatsCard icon="meditation" label="Meditation" value="20 min" caption="3 sessions today" />
            </div>

            <QuickActions />

            <div className="lower-grid">
              <MoodChart />
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import HabitForm from "@/components/habits/HabitForm";
import HabitList from "@/components/habits/HabitList";
import HabitProgress from "@/components/habits/HabitProgress";

export default function HabitsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .habits-layout {
          display: flex;
          min-height: 100vh;
          background: #f7f8fa;
          font-family: 'Inter', sans-serif;
        }

        .habits-main { flex: 1; min-width: 0; }

        .habits-content {
          padding: 1.8rem 2rem 3rem;
          max-width: 1100px;
        }

        .habits-page-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .habits-page-subtext {
          font-size: 0.88rem;
          color: #94a3b8;
          margin-bottom: 1.8rem;
        }

        /* Left column: form + habit list. Right: progress panel */
        .habits-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .habits-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .habits-content { padding: 1.5rem 1.2rem 2.5rem; }
        }

        .habits-left {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .habits-section-heading {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.9rem;
        }
      `}</style>

      <div className="habits-layout">
        <Sidebar />

        <div className="habits-main">
          <Header name="Akash" />

          <div className="habits-content">
            <h1 className="habits-page-title">Habit Tracker</h1>
            <p className="habits-page-subtext">Small things done daily compound into big results.</p>

            <div className="habits-grid">
              {/* Left column */}
              <div className="habits-left">
                <HabitForm />
                <div>
                  <div className="habits-section-heading">Today's Habits</div>
                  <HabitList />
                </div>
              </div>

              {/* Right column */}
              <div>
                <div className="habits-section-heading">Progress</div>
                <HabitProgress />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import MoodCalendar from "@/components/mood/MoodCalendar";
import MoodHistory from "@/components/mood/MoodHistory";

export default function MoodHistoryPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .mood-history-layout {
          display: flex;
          min-height: 100vh;
          background: #f7f8fa;
          font-family: 'Inter', sans-serif;
        }

        .mood-history-main { flex: 1; min-width: 0; }

        .mood-history-content {
          padding: 1.8rem 2rem 3rem;
          max-width: 1100px;
        }

        .mood-history-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: #94a3b8;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 0.9rem;
          transition: color 0.15s;
        }
        .mood-history-back:hover { color: #16a34a; }

        .mood-history-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .mood-history-subtext {
          font-size: 0.88rem;
          color: #94a3b8;
          margin-bottom: 1.8rem;
        }

        .mood-history-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 1.2rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .mood-history-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .mood-history-content { padding: 1.5rem 1.2rem 2.5rem; }
        }
      `}</style>

      <div className="mood-history-layout">
        <Sidebar />

        <div className="mood-history-main">
          <Header name="Akash" />

          <div className="mood-history-content">
            <a href="/mood" className="mood-history-back">&larr; Back to Mood Tracker</a>
            <h1 className="mood-history-title">Mood History</h1>
            <p className="mood-history-subtext">Every entry you've logged, in one place.</p>

            <div className="mood-history-grid">
              <MoodCalendar />
              <MoodHistory />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
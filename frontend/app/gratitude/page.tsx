import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import GratitudeForm from "@/components/gratitude/GratitudeForm";
import GratitudeList from "@/components/gratitude/GratitudeList";

export default function GratitudePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .gratitude-layout {
          display: flex;
          min-height: 100vh;
          background: #f7f8fa;
          font-family: 'Inter', sans-serif;
        }

        .gratitude-main { flex: 1; min-width: 0; }

        .gratitude-content {
          padding: 1.8rem 2rem 3rem;
          max-width: 1100px;
        }

        .gratitude-page-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .gratitude-page-subtext {
          font-size: 0.88rem;
          color: #94a3b8;
          margin-bottom: 1.8rem;
        }

        .gratitude-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .gratitude-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .gratitude-content { padding: 1.5rem 1.2rem 2.5rem; }
        }

        .gratitude-section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 0.9rem;
        }
        .gratitude-section-heading {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }
        .gratitude-section-count {
          font-size: 0.78rem;
          color: #94a3b8;
        }
      `}</style>

      <div className="gratitude-layout">
        <Sidebar />

        <div className="gratitude-main">
          <Header name="Akash" />

          <div className="gratitude-content">
            <h1 className="gratitude-page-title">Gratitude Journal</h1>
            <p className="gratitude-page-subtext">Three things a day. It quietly works.</p>

            <div className="gratitude-grid">
              <div>
                <div className="gratitude-section-heading" style={{ marginBottom: "0.9rem" }}>Today's Entry</div>
                <GratitudeForm />
              </div>

              <div>
                <div className="gratitude-section-header">
                  <div className="gratitude-section-heading">Previous Entries</div>
                  <div className="gratitude-section-count">5 entries</div>
                </div>
                <GratitudeList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
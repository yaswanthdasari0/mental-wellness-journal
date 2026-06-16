"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import SessionSelector from "@/components/meditation/SessionSelector";
import TimerCard from "@/components/meditation/TimerCard";
import BreathingGuide from "@/components/meditation/BreathingGuide";
import SessionHistory from "@/components/meditation/SessionHistory";

export default function MeditationPage() {
  const [selectedSeconds, setSelectedSeconds] = useState(600); // default 10 min
  const [timerRunning, setTimerRunning] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .meditation-layout {
          display: flex;
          min-height: 100vh;
          background: #f7f8fa;
          font-family: 'Inter', sans-serif;
        }

        .meditation-main { flex: 1; min-width: 0; }

        .meditation-content {
          padding: 1.8rem 2rem 3rem;
          max-width: 1100px;
        }

        .meditation-page-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .meditation-page-subtext {
          font-size: 0.88rem;
          color: #94a3b8;
          margin-bottom: 1.8rem;
        }

        /* Two columns: left = selector + timer + breathing, right = history */
        .meditation-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .meditation-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .meditation-content { padding: 1.5rem 1.2rem 2.5rem; }
        }

        .meditation-left {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .meditation-right {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .meditation-section-heading {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.9rem;
        }

        /* Completion banner */
        .meditation-complete-banner {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 1rem 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.88rem;
          color: #15803d;
          font-weight: 500;
        }
        .meditation-complete-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #16a34a;
          flex-shrink: 0;
        }
      `}</style>

      <div className="meditation-layout">
        <Sidebar />

        <div className="meditation-main">
          <Header name="Akash" />

          <div className="meditation-content">
            <h1 className="meditation-page-title">Meditation</h1>
            <p className="meditation-page-subtext">Take a moment for yourself.</p>

            <div className="meditation-grid">
              {/* Left — controls */}
              <div className="meditation-left">
                <SessionSelector
                  selected={selectedSeconds}
                  onChange={(s) => {
                    setSelectedSeconds(s);
                    setTimerRunning(false);
                  }}
                />

                <TimerCard
                  totalSeconds={selectedSeconds}
                  onComplete={() => {
                    setTimerRunning(false);
                  }}
                />

                <BreathingGuide active={timerRunning} />
              </div>

              {/* Right — history */}
              <div className="meditation-right">
                <div className="meditation-section-heading">History</div>
                <SessionHistory />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import SessionSelector from "@/components/meditation/SessionSelector";
import TimerCard from "@/components/meditation/TimerCard";
import BreathingGuide from "@/components/meditation/BreathingGuide";
import SessionHistory from "@/components/meditation/SessionHistory";
import { MeditationSession } from "@/services/meditation";

export default function MeditationPage() {
  const [selectedSeconds, setSelectedSeconds] = useState(600);
  // timerRunning is now driven by TimerCard via onRunningChange
  const [timerRunning, setTimerRunning]       = useState(false);
  const [latestSession, setLatestSession]     = useState<MeditationSession | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .meditation-layout { display: flex; min-height: 100vh; background: #f7f8fa; font-family: 'Inter', sans-serif; }
        .meditation-main { flex: 1; min-width: 0; }
        .meditation-content { padding: 1.8rem 2rem 3rem; max-width: 1100px; }
        .meditation-page-title { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: #0f172a; letter-spacing: -0.02em; margin-bottom: 0.3rem; }
        .meditation-page-subtext { font-size: 0.88rem; color: #94a3b8; margin-bottom: 1.8rem; }
        .meditation-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 1.5rem; align-items: start; }
        @media (max-width: 900px) { .meditation-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .meditation-content { padding: 1.5rem 1.2rem 2.5rem; } }
        .meditation-left  { display: flex; flex-direction: column; gap: 1.2rem; }
        .meditation-right { display: flex; flex-direction: column; gap: 1.2rem; }
        .meditation-section-heading { font-size: 0.95rem; font-weight: 600; color: #0f172a; margin-bottom: 0.9rem; }
      `}</style>

      <div className="meditation-layout">
        <Sidebar />
        <div className="meditation-main">
          <Header name="Akash" />
          <div className="meditation-content">
            <h1 className="meditation-page-title">Meditation</h1>
            <p className="meditation-page-subtext">Take a moment for yourself.</p>

            <div className="meditation-grid">
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
                  onRunningChange={setTimerRunning}
                  onComplete={() => setTimerRunning(false)}
                />

                {/* Now correctly receives live running state from TimerCard */}
                <BreathingGuide active={timerRunning} />
              </div>

              <div className="meditation-right">
                <div className="meditation-section-heading">History</div>
                <SessionHistory newSession={latestSession} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
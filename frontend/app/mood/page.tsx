"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import MoodSelector from "@/components/mood/MoodSelector";
import MoodCard from "@/components/mood/MoodCard";
import MoodHistory from "@/components/mood/MoodHistory";
import { Mood } from "@/services/mood";

export default function MoodPage() {
  const [latestMood, setLatestMood] = useState<Mood | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .mood-layout { display: flex; min-height: 100vh; background: #f7f8fa; font-family: 'Inter', sans-serif; }
        .mood-main { flex: 1; min-width: 0; }
        .mood-content { padding: 1.8rem 2rem 3rem; max-width: 1000px; }
        .mood-page-title { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: #0f172a; letter-spacing: -0.02em; margin-bottom: 0.3rem; }
        .mood-page-subtext { font-size: 0.88rem; color: #94a3b8; margin-bottom: 1.8rem; }
        .mood-section { margin-top: 1.6rem; }
        .mood-section-heading { font-size: 0.95rem; font-weight: 600; color: #0f172a; margin-bottom: 0.9rem; }
        .mood-history-link {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.82rem; color: #16a34a; text-decoration: none;
          font-weight: 500; margin-top: 1rem;
        }
        .mood-history-link:hover { color: #15803d; }
        @media (max-width: 560px) { .mood-content { padding: 1.5rem 1.2rem 2.5rem; } }
      `}</style>

      <div className="mood-layout">
        <Sidebar />
        <div className="mood-main">
          <Header name="Akash" />
          <div className="mood-content">
            <h1 className="mood-page-title">Mood Tracker</h1>
            <p className="mood-page-subtext">One check-in a day is enough.</p>

            {/* Selector posts to backend, passes new mood up */}
            <MoodSelector onSave={(mood) => setLatestMood(mood)} />

            {/* Show the most recently saved mood */}
            {latestMood && (
              <div className="mood-section">
                <div className="mood-section-heading">Just Logged</div>
                <MoodCard
                  mood={latestMood.mood}
                  note={latestMood.note}
                  compact
                />
              </div>
            )}

            {/* Full history from backend */}
            <div className="mood-section">
              <div className="mood-section-heading">Recent History</div>
              <MoodHistory newEntry={latestMood} />
              <Link href="/mood/history" className="mood-history-link">
                View full history &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
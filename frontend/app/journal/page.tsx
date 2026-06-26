"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import JournalEditor from "@/components/journal/JournalEditor";
import RecentJournals from "@/components/journal/RecentJournals";
import { Journal } from "@/services/journal";

export default function JournalPage() {
  // When editor saves a new entry, pass it to RecentJournals to prepend instantly
  const [latestEntry, setLatestEntry] = useState<Journal | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .journal-layout { display: flex; min-height: 100vh; background: #f7f8fa; font-family: 'Inter', sans-serif; }
        .journal-main { flex: 1; min-width: 0; }
        .journal-content { padding: 1.8rem 2rem 3rem; max-width: 1100px; }
        .journal-page-title { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: #0f172a; letter-spacing: -0.02em; margin-bottom: 0.3rem; }
        .journal-page-subtext { font-size: 0.88rem; color: #94a3b8; margin-bottom: 1.8rem; }
        .journal-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 1.5rem; align-items: start; }
        @media (max-width: 900px) { .journal-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .journal-content { padding: 1.5rem 1.2rem 2.5rem; } }
        .journal-section-heading { font-size: 0.95rem; font-weight: 600; color: #0f172a; margin-bottom: 0.9rem; }
        .journal-section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 0.9rem; }
        .journal-entry-count { font-size: 0.78rem; color: #94a3b8; }
      `}</style>

      <div className="journal-layout">
        <Sidebar />
        <div className="journal-main">
          <Header name="Akash" />
          <div className="journal-content">
            <h1 className="journal-page-title">My Journal</h1>
            <p className="journal-page-subtext">Write freely. There's no audience here.</p>

            <div className="journal-grid">
              {/* Left — editor */}
              <div>
                <div className="journal-section-heading">New Entry</div>
                <JournalEditor onSave={(journal) => setLatestEntry(journal)} />
              </div>

              {/* Right — live list */}
              <div>
                <div className="journal-section-heading">Recent Entries</div>
                <RecentJournals newEntry={latestEntry} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
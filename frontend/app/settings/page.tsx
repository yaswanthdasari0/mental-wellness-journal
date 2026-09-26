"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import AccountSettings from "@/components/profile/AccountSettings";
import Preferences from "@/components/profile/Preferences";
import SecuritySection from "@/components/profile/SecuritySection";
import ProfileCard from "@/components/profile/ProfileCard";

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  );
}

export default function SettingsPage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .settings-layout { display: flex; min-height: 100vh; background: #f7f8fa; font-family: 'Inter', sans-serif; }
        .settings-main   { flex: 1; min-width: 0; }
        .settings-content { padding: 1.8rem 2rem 3rem; max-width: 1000px; }

        .settings-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.8rem; }
        .settings-back {
          display: flex; align-items: center; gap: 0.4rem;
          background: none; border: none; cursor: pointer;
          font-size: 0.84rem; color: #64748b; font-family: 'Inter', sans-serif;
          padding: 0.4rem 0;
        }
        .settings-back:hover { color: #0f172a; }
        .settings-page-title {
          font-family: 'DM Serif Display', serif; font-size: 1.6rem;
          color: #0f172a; letter-spacing: -0.02em;
        }

        .settings-grid {
          display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start;
        }
        @media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .settings-content { padding: 1.5rem 1.2rem 2.5rem; } }

        .settings-left { position: sticky; top: 5rem; }
        .settings-right { display: flex; flex-direction: column; gap: 1.2rem; }
      `}</style>

      <div className="settings-layout">
        <Sidebar />
        <div className="settings-main">
          <Header />
          <div className="settings-content">

            <div className="settings-header">
              <button className="settings-back" onClick={() => router.push("/profile")}>
                <BackIcon /> Back to Profile
              </button>
            </div>

            <h1 className="settings-page-title" style={{ marginBottom: "1.8rem" }}>Settings</h1>

            <div className="settings-grid">
              {/* Left — avatar + name card */}
              <div className="settings-left">
                <ProfileCard />
              </div>

              {/* Right — all settings */}
              <div className="settings-right">
                <AccountSettings />
                <Preferences />
                <SecuritySection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
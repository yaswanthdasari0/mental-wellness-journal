import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ProfileCard from "@/components/profile/ProfileCard";
import AccountSettings from "@/components/profile/AccountSettings";
import Preferences from "@/components/profile/Preferences";
import SecuritySection from "@/components/profile/SecuritySection";

export default function ProfilePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .profile-layout {
          display: flex;
          min-height: 100vh;
          background: #f7f8fa;
          font-family: 'Inter', sans-serif;
        }

        .profile-main { flex: 1; min-width: 0; }

        .profile-content {
          padding: 1.8rem 2rem 3rem;
          max-width: 1100px;
        }

        .profile-page-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .profile-page-subtext {
          font-size: 0.88rem;
          color: #94a3b8;
          margin-bottom: 1.8rem;
        }

        /* Left: profile card (sticky). Right: settings stacked */
        .profile-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .profile-content { padding: 1.5rem 1.2rem 2.5rem; }
        }

        .profile-left {
          position: sticky;
          top: 5rem;
        }

        .profile-right {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
      `}</style>

      <div className="profile-layout">
        <Sidebar />

        <div className="profile-main">
          <Header name="Akash" />

          <div className="profile-content">
            <h1 className="profile-page-title">My Profile</h1>
            <p className="profile-page-subtext">Manage your account and preferences.</p>

            <div className="profile-grid">
              {/* Left — sticky profile card */}
              <div className="profile-left">
                <ProfileCard />
              </div>

              {/* Right — settings panels stacked */}
              <div className="profile-right">
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